# X情報の自動取り込み

Xのブックマークに入れた「skills / Claudeの作り方」投稿を、Claudeが自動で拾い、採用可否を判断し、採用分を実装してpushする。

## 使い方

Claude Codeで `/adopt-x-tips` を実行するだけ。定期実行にしたい場合はClaudeに「adopt-x-tipsを毎日回して」と頼む。

## 初回セットアップ(1回だけ)

1. https://developer.x.com でアプリを作り、OAuth 2.0 (User context) を有効化
2. スコープ: `tweet.read users.read bookmark.read offline.access`
3. 取得したユーザーアクセストークンを、Claude Codeのクラウド環境の環境変数 `X_USER_ACCESS_TOKEN` に設定
   (アクセストークンは約2時間で失効するため、長期運用にはリフレッシュ処理が別途必要)

## ファイル

- `scripts/fetch_x_bookmarks.py` 未処理ブックマークをJSONで出力
- `.claude/skills/adopt-x-tips/SKILL.md` 判断・実装・push の手順と採用基準
- `x-tips/decisions.md` 採用/見送りの記録
- `x-tips/processed.json` 処理済みの投稿id
