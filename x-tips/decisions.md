# 採用判断ログ

| 日付 | 投稿 | 判断 | 理由 / 実装先 |
|---|---|---|---|
| 2026-10-07 | [Libertyship澤井CTOインタビュー](https://ai.freelance-job.com/article/6abf64466f60ae186b88065e) | 部分採用 | 作業/レビューのエージェント分離と司令塔ループを採用 → `.claude/skills/dev-flow`, `.claude/agents/{design-reviewer,architect,code-reviewer}.md`。CodeRabbit・Takumi Guard・cc-sddは外部サービス登録が必要で記事に設定の具体がないため見送り |
| 2026-10-07 | [噛みくだくん: Claude×Obsidian 第二の脳](https://x.com/kamikudaku_wani/status/2082434322481774982) | 採用 | vault構成とCLAUDE.mdテンプレ → `vault/`、毎朝のブリーフ → `/daily-brief`、週次の対話 → `/weekly-review`、入れる手間の削減 → `/capture`。Readwise/Airr/Whisper/Telegram/N8Nは登録が必要なため見送り。LINEオプチャ誘導は宣伝のため対象外 |
| 2026-10-07 | (変更) 第二の脳のメモ元 | 変更 | ユーザー指示でメモ元を「自分が編集した Notion ページ」に変更。リポジトリが public のため、メモ・ブリーフは Notion にのみ置き、`vault/` は廃止 |
| 2026-10-07 | [よん: Claude Codeの教科書](https://x.com/4on_yon_x/status/2107692623934980258) | 部分採用 | `/check-change` を追加。`/dev-flow` に調査フェーズ・受け入れ条件・やらないこと・異常系の検討・小さく縦に作る・再現テスト先行・3回失敗で停止を追加。CLAUDE.md に開発の約束を追加。Hooks(検査コマンド未確定のため想像で書かない)、opusplan、worktree、プロパティベーステスト、モデル比較評価は今の規模では不要として見送り |
