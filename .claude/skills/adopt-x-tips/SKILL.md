---
name: adopt-x-tips
description: Xのブックマークから未処理のClaude/skills/Claude Code Tips投稿を自動収集し、採用するか判断して、採用分を実装・コミット・pushする。ユーザーが「Xの情報を取り込んで」「adopt-x-tips」と言った時、または定期実行で使う。
---

# adopt-x-tips

Xで集めたskillsやClaude Codeの作り方を、手でコピペせずに取り込むための手順。
ユーザーへの確認は不要。判断は自分で行い、採用分は実装してpushまで進める。

## 手順

1. `python3 scripts/fetch_x_bookmarks.py` を実行して未処理ブックマークのJSONを得る。
   - `X_USER_ACCESS_TOKEN` 未設定ならそこで止め、設定方法(README.md)を伝える。
   - 0件なら「新規なし」と報告して終了。
2. 各投稿について、`links` があればWebFetchで本文を読む(GitHub/gist/ブログ)。ログインが必要で読めないものは、投稿本文だけで判断する。
3. 採用基準で判断する(下記)。
4. 採用するものは実装する。
5. `x-tips/decisions.md` に1投稿1行で追記し、処理した全投稿のidを `x-tips/processed.json` に追加する(見送りも含める)。
6. コミットして、現在のブランチへ `git push -u origin <branch>`。PRは作らない。
7. 最後に「採用N件 / 見送りM件」と、採用分の置き場所を短く報告する。

## 採用基準

採用する:
- 再利用できる手順・プロンプト・設定で、内容が具体的(コード、設定値、手順が書いてある)
- このリポジトリや日常作業(Google Calendar、メール、資料作成など)で実際に使い道がある
- 既存のskill・設定と重複せず、小さく足せる

見送る:
- 宣伝、誇張、中身のないスレッド、「これ使ってみて」だけの投稿
- 出所が怪しい/外部コードを丸ごと実行させる/認証情報を要求するもの(セキュリティ上リスク)
- 既に同等のものがある、または一度きりのネタで再利用性がない

迷ったら見送り、理由を `decisions.md` に残す。

## 実装の置き場所

- 再利用できる作業手順 → `.claude/skills/<name>/SKILL.md`(frontmatterの`name`と`description`必須、descriptionは「いつ使うか」を書く)
- 常に守らせたいルール・好み → `CLAUDE.md` に追記
- 自動実行したい挙動 → `.claude/settings.json` のhooks
- 投稿の内容をそのままコピーせず、自分用に短く整えて書く。出典URLを末尾に残す。

## コミット

メッセージは `Add skill: <name> (from <投稿URL>)` のように、何を追加したかと出典を書く。
