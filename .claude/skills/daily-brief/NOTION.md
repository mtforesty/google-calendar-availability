# 第二の脳: Notion の読み書き(daily-brief / weekly-review / capture 共通)

## 公開リポジトリの注意
このリポジトリは public。Notion から読んだ内容をファイルに保存したり、コミットしたりしない。

## メモの集め方
- `notion-search` を `query: ""`、`filters.edited_by_user_ids: ["me"]`、`filters.last_edited_date_range`(日付は Asia/Tokyo)、`sort: "last_edited"`、`page_size: 50` で呼ぶ。結果が50件あれば `last_edited_date_range` を細かく区切って取り直す。
- 結果のうち `type: "page"` を `notion-fetch` で読む。database は、行のページが別に出てくるので読まなくてよい。
- 次のページは除外する: タイトルが「第二の脳 ブリーフ」配下のもの(自分の出力)、「評価シート」「自己評価」など人事評価に関するもの、本文がほぼ空のもの。
- 比較用の古いメモは、最近のメモのキーワード(顧客名、テーマ)で `notion-search`(フィルタなし)を引いて集める。

## 取扱説明書
- `notion-search` でタイトル「第二の脳 取扱説明書」を探して読む。無ければ `templates/second-brain-profile.md` の項目を使い、報告の最後に「Notion に取扱説明書を作ると精度が上がる」と一言添える。

## 出力先
- `notion-search` でタイトル「第二の脳 ブリーフ」のページを探す。無ければ、ユーザーの個人ページ(プライベート)直下に作る。チームスペースや共有ページの下には作らない。
- 出力はその子ページとして作る。ページ内のリンクは Notion のページへのメンション/リンクにする。
