---
name: motion-video
description: 動画生成AIを使わず、HTML/Three.jsの文字モーション + ナレーション(Gemini TTS) + ffmpeg合成の効果音で、マーケティング用の短い動画を作って mp4 に書き出す。「動画を作って」「告知動画」「プロモ動画」「SNS用の動画」と言われたときに使う。
---

# motion-video

文字が崩れない、直しが速い、データが軽い。コピーを主役にした動画向け。
道具は `motion-video/` にある(初回は `cd motion-video && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install`)。

## 1. 企画を決める(ユーザーに確認するのはここだけ)
足りない項目だけ聞く。分かっていれば聞かずに進む。
- 目的と見る人(例: 新サービスの認知、既存顧客への機能告知)
- 出す場所 → 縦横比: X/YouTube は 1920x1080、リール/ショート/TikTok は 1080x1920、正方形は 1080x1080
- 長さ(既定 15秒。SNS広告なら6〜15秒)
- 伝えたい一言と、最後の行動(CTA: URL、「詳しくはプロフィールへ」など)
- ブランドカラー、ロゴ画像(あれば)
- ナレーションの有無

## 2. 台本を書く
- 1画面1メッセージ、1行12文字前後まで。読めない速さにしない(1文字0.1秒+余韻1秒が目安)
- 構成: 掴み(問い/痛み)→ 転換 → 価値 → CTA
- ナレーションを入れるなら、画面の文字とナレーションの文は同じにしない(画面は短く、声は補足)
- 誇大表現・根拠のない数字・他社名を書かない

## 3. シーンを作る
- `motion-video/scenes/example.html` を `scenes/<名前>.html` に複製して書き換える。
- 約束: `window.SCENE = { duration }` と `window.renderAt(t)` を用意する。絵は **t だけ** で決める(requestAnimationFrame、Date、Math.random を使わない。乱数は固定シードで)
- 日本語の文字は CanvasTexture で描く(Three.js の 3D フォントは日本語が重く崩れやすい)
- 外部 CDN は使わない(書き出し環境から読めない)。ライブラリは npm で入れて `/node_modules/...` を importmap で読む
- 画像を使うなら `scenes/` の下に置く

## 4. 音を作る
- ナレーション: `GEMINI_API_KEY=... node tts.mjs "文章" out/narration.wav --voice Kore --style "落ち着いた声で、語りかけるように"`
  (キーが無ければナレーション無しで進め、報告に書く)
- 効果音: `./sfx.sh wind|knock|pop|rise out/x.wav [秒]`。鳴らす位置は `ffmpeg -i x.wav -af "adelay=1500|1500" x-d.wav`
- ナレーションの長さ(`ffprobe`)に合わせて、シーンの `duration` と文字の出るタイミングを調整する

## 5. 書き出して確認する
```
node render.mjs scenes/<名前>.html out/<名前>.mp4 --width 1080 --height 1920 --audio out/narration.wav --audio out/x-d.wav
```
- 書き出したら、要所のコマを `ffmpeg -ss <秒> -i out/<名前>.mp4 -frames:v 1 out/check.png` で切り出し、目で確認する(文字切れ、はみ出し、読めない速さ、余白)
- 問題があれば直して書き出し直す
- 完成した mp4 はユーザーにファイルで渡す

## 公開リポジトリの注意
このリポジトリは public。未発表のキャンペーン内容、顧客名、社内の数字を含むシーンや台本はコミットしない。
コミットしてよいのは、汎用の道具とサンプルだけ。動画ファイル(`out/`)は .gitignore 済み。

出典: ユーザーが共有したX投稿「凍った手記」(Opus 5.5 × HTML/Three.js × Gemini TTS × ffmpeg)
