// Gemini TTS でナレーションを WAV に書き出す。
//   GEMINI_API_KEY=... node tts.mjs "読み上げる文章" out/narration.wav [--voice Kore] [--style "静かに、語りかけるように"]
// モデルは GEMINI_TTS_MODEL で変更可能。
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const [text, out] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const key = process.env.GEMINI_API_KEY;
if (!text || !out) { console.error('usage: node tts.mjs "text" out.wav [--voice NAME] [--style "演技の指示"]'); process.exit(1); }
if (!key) { console.error("GEMINI_API_KEY is not set"); process.exit(1); }

const model = process.env.GEMINI_TTS_MODEL ?? "gemini-2.5-flash-preview-tts";
const style = opt("style");
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-goog-api-key": key },
  body: JSON.stringify({
    contents: [{ parts: [{ text: style ? `${style}:\n${text}` : text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: opt("voice", "Kore") } } },
    },
  }),
});
if (!res.ok) { console.error(`Gemini TTS error ${res.status}: ${(await res.text()).slice(0, 400)}`); process.exit(1); }
const data = (await res.json()).candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
if (!data) { console.error("no audio in response"); process.exit(1); }

// 返ってくるのは 24kHz / 16bit / mono の生PCM なので WAV に包む
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "-", out], { stdio: ["pipe", "inherit", "inherit"] });
ff.stdin.end(Buffer.from(data, "base64"));
ff.on("close", (c) => { if (c === 0) console.log(`wrote ${out}`); process.exit(c); });
