---
name: weekly-review
description: vault全体と直近7日のメモから、育ちつつある考え・矛盾・知識の穴・今週の一手を率直に伝える週1の対話。「週次レビュー」「weekly-review」と言われたとき、または週1の定期実行で使う。
---

# weekly-review

毎朝のブリーフが「人間の代わりに気づく」係なら、これは「人間を育てる」係。

## 手順
1. `${VAULT_DIR:-vault}/CLAUDE.md` と vault 全体を読む。直近7日に追加されたもの(`git log --since="7 days ago" --name-only --pretty=format: -- vault`)を重点的に見る。今週の `brief-*.md` も読む。
2. 次の4つを書く:
   - **EMERGING THESIS**: まだ明言していないが、向かいつつある考えや立場は何か
   - **CONTRADICTIONS**: 最近保存したもののうち、以前の考えと矛盾するもの。両側を自分のメモから引用して並べる
   - **KNOWLEDGE GAPS**: 読んでいるもの・考えていることから見て、明らかに読めていない視点は何か
   - **ONE ACTION**: vault 全体を踏まえて、今週いちばん効く一手を1つ
3. 遠慮しない。持ち主に挑む。既に知っていることの要約はしない。
4. `vault/inbox/weekly-YYYY-MM-DD.md` に保存し、コミットして push する。
5. 最後に「CLAUDE.md の『今読んで考えていること』を更新しよう」と一言添え、更新案を1〜3行で示す(勝手には書き換えない)。

出典: https://x.com/kamikudaku_wani/status/2082434322481774982 (原典: https://x.com/CyrilXBT)
