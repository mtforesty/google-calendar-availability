---
name: daily-brief
description: vaultの直近のメモから、気づいていないつながり3つ・今週のパターン1つ・今日考える問い1つを書いて inbox に置く。「朝のブリーフ」「daily-brief」と言われたとき、または毎朝の定期実行で使う。
---

# daily-brief

話しかけてこない第二の脳は、第二の脳じゃない。毎朝、頼まれる前にvaultから1本届ける。

## 手順
1. vault は `${VAULT_DIR:-vault}`。まず `vault/CLAUDE.md` を読み、持ち主の目標・プロジェクト・関心を把握する。
2. 対象メモを集める。クローン直後はファイルの更新日時が当てにならないので、git の履歴で判定する:
   - inbox の直近24時間: `git log --since="24 hours ago" --name-only --pretty=format: -- vault/inbox`
   - notes の直近7日: `git log --since="7 days ago" --name-only --pretty=format: -- vault/notes`
   - 過去の `brief-*.md` は対象から外す
   - 該当が0件なら、新しいメモが無いことを1行で報告して終了(ファイルは作らない)
3. 比較相手として、それ以外の notes / ideas / projects も読む。
4. 次の3つを書く:
   - **CONNECTIONS**: 最近のメモと古いメモの、持ち主がまだ気づいていなさそうな意外なつながりを3つ。具体的に、該当箇所を引用し、ファイルへ `[[リンク]]` を張る
   - **PATTERN**: 今週読んだもの全体に共通するパターンを1つ。本人がまだ言葉にしていないが、頭が明らかに取り組んでいること
   - **QUESTION**: そのパターンから、今日じっくり考える価値のある問いを1つ。タスクではなく問い
5. Obsidian 向けの markdown にして `vault/inbox/brief-YYYY-MM-DD.md`(日付は Asia/Tokyo)に保存する。
6. コミットして push する。報告はブリーフの QUESTION とファイルパスだけ。

## 書き方
- 一般論、褒め言葉、メモの要約は書かない。vault の中身を根拠にする
- 日本語で書く

出典: https://x.com/kamikudaku_wani/status/2082434322481774982 (原典: https://x.com/CyrilXBT)
