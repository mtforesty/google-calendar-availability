---
name: capture
description: 渡された文章・URL・思いつきを、整理の手間なしで vault/inbox に1ファイルとして保存する。ユーザーが「メモして」「保存して」「vaultに入れて」と言ったときに使う。
---

# capture

入れる手間を限りなくゼロにするための手順。分類やタグ付けで悩ませない。

1. 保存先は `${VAULT_DIR:-vault}/inbox/`。
2. ファイル名は `YYYY-MM-DD-<内容を表す短い英数字スラッグ>.md`(日付は Asia/Tokyo)。
3. 中身:
   ```
   ---
   captured: YYYY-MM-DD
   source: <URLや出典。なければ省略>
   ---
   # <一行タイトル>

   <渡された内容をそのまま。要約で置き換えない>
   ```
4. 自分の考えだと明らかなもの(「〜と思った」など)は `ideas/` に直接保存してよい。それ以外は全部 inbox。
5. コミットして push する。報告は「保存した: <パス>」の1行だけ。

出典: https://x.com/kamikudaku_wani/status/2082434322481774982 (原典: https://x.com/CyrilXBT)
