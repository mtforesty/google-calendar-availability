// HTMLシーンをコマ送りで撮影し、ffmpegで動画(+音声)に書き出す。
//
// 使い方:
//   node render.mjs scenes/example.html out/example.mp4 [--audio a.wav --audio b.wav] [--width 1080 --height 1920] [--fps 30]
//   node render.mjs scenes/telop.html out/telop.mov --alpha   … 透明背景のテロップ層
//
// シーン側の約束:
//   window.SCENE = { duration: 秒 }       … 動画の長さ
//   window.renderAt(t) (同期 or Promise) … 時刻 t 秒の絵を描く。時計(requestAnimationFrame や Date)に頼らず t だけで決める
// これにより、PCの速さに関係なく毎回同じ動画になる。
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync, statSync, createReadStream } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const audios = args.flatMap((a, i) => (a === "--audio" ? [args[i + 1]] : []));
const [scene, out] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!scene || !out) {
  console.error("usage: node render.mjs <scene.html> <out.mp4> [--audio file]... [--width W --height H --fps N]");
  process.exit(1);
}
const width = Number(opt("width", 1920));
const height = Number(opt("height", 1080));
const fps = Number(opt("fps", 30));
// --alpha: 背景を透明にして .mov(PNGコーデック)で書き出す。実写の上に重ねるテロップ層に使う
const alpha = args.includes("--alpha");

// three を node_modules から import できるよう、このフォルダを配信する
const root = path.dirname(new URL(import.meta.url).pathname);
const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json", ".webm": "video/webm" };
const server = createServer(async (req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(root) || !existsSync(p)) return res.writeHead(404).end();
  const type = types[path.extname(p)] ?? "application/octet-stream";
  // <video> のシークには Range 対応が要る
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
  if (range) {
    const size = statSync(p).size;
    const start = range[1] ? Number(range[1]) : size - Number(range[2]);
    const end = range[1] && range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { "content-type": type, "accept-ranges": "bytes", "content-range": `bytes ${start}-${end}/${size}`, "content-length": end - start + 1 });
    return createReadStream(p, { start, end }).pipe(res);
  }
  res.writeHead(200, { "content-type": type, "accept-ranges": "bytes" });
  res.end(await readFile(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width, height } });
page.on("pageerror", (e) => console.error("scene error:", e.message));
await page.goto(`${base}/${path.relative(root, path.resolve(scene))}`);
await page.waitForFunction(() => window.SCENE && typeof window.renderAt === "function", null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.SCENE.duration);
const frames = Math.round(duration * fps);

await mkdir(path.dirname(path.resolve(out)), { recursive: true });
const ff = spawn("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
  ...audios.flatMap((a) => ["-i", a]),
  ...(audios.length > 1 ? ["-filter_complex", `${audios.map((_, i) => `[${i + 1}:a]`).join("")}amix=inputs=${audios.length}:normalize=0[a]`, "-map", "0:v", "-map", "[a]"] : []),
  ...(alpha ? ["-c:v", "png", "-pix_fmt", "rgba"] : ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20"]),
  ...(audios.length ? ["-c:a", "aac", "-b:a", "192k"] : []),
  "-t", String(duration), ...(alpha ? [] : ["-movflags", "+faststart"]), out,
], { stdio: ["pipe", "inherit", "inherit"] });

for (let f = 0; f < frames; f++) {
  await page.evaluate((t) => window.renderAt(t), f / fps);
  const png = await page.screenshot({ type: "png", omitBackground: alpha });
  if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % fps === 0) process.stdout.write(`\r${f}/${frames} frames`);
}
ff.stdin.end();
const code = await new Promise((r) => ff.on("close", r));
await browser.close();
server.close();
if (code !== 0) process.exit(code);
console.log(`\nwrote ${out} (${duration}s, ${width}x${height}, ${fps}fps)`);
