# MVP実装タスク (tasks-mvp.md)

## Phase 1: 基盤構築 (Infrastructure & Core Logic)

### Task 0: 依存関係のセットアップ

- [x] 必要なパッケージのインストール
  - `pnpm add unified remark-parse remark-rehype rehype-stringify gray-matter`
  - `pnpm add -D @tailwindcss/typography vitest`
- [x] `package.json` へのスクリプト追加
  - `"test": "vitest"`
  - `"lint": "biome check --write"`

**依存関係**: なし
**成果物**: 開発に必要なライブラリとスクリプトが利用可能な状態
**完了条件**: `package.json` にパッケージと `test`, `lint` スクリプトが追加されていること
**テスト**: 不要

### Task 1: Cloudflare R2 設定

- [x] `wrangler.jsonc` - R2バケットのバインディング設定追加 **(FR-01)**
- [x] `app/global.d.ts` - Cloudflare Bindingsの型定義追加

**依存関係**: なし
**成果物**: WorkerからR2バケットにアクセス可能な環境
**完了条件**: `c.env.R2_BUCKET` が型安全に参照できること
**テスト**: 不要

### Task 2: R2 クライアントユーティリティの実装

- [ ] `app/lib/r2.ts` - オブジェクト取得・リスト取得関数の実装 **(FR-01)**
- [ ] `app/lib/r2.test.ts` - 取得ロジックの単体テスト

**依存関係**: Task 1
**成果物**: R2操作用の抽象化レイヤー
**完了条件**: 指定したKeyでR2からデータが取得できること
**テスト**: Vitestによる単体テスト

### Task 3: Markdown 変換ロジックの実装

- [ ] `app/lib/markdown.ts` - gray-matter と unified を使用した変換処理の実装 **(FR-02)**
- [ ] `app/lib/markdown.test.ts` - Frontmatter (YAML) パースとHTML変換のテスト

**依存関係**: なし
**成果物**: MarkdownをHTMLとメタデータに変換する関数
**完了条件**: gray-matterによりFrontmatterが抽出され、本文がHTMLとして出力されること
**テスト**: Vitestによる単体テスト（主要なMarkdown記法の確認）

---

## Phase 2: ルーティング・画面実装 (Routing & UI)

### Task 4: 記事一覧・詳細ページの実装

- [ ] `app/routes/index.tsx` - 記事一覧表示の実装（機能優先、最小限のスタイリング） **(FR-03)**
- [ ] `app/routes/posts/[slug].tsx` - 記事詳細表示の実装（機能優先、最小限のスタイリング） **(FR-04)**
- [ ] `app/routes/_renderer.tsx` - 基本的なCSS/Layout設定（Tailwind Typography利用）

**依存関係**: Task 2, Task 3
**成果物**: ブログの主要閲覧画面（機能重視の最小デザイン）
**完了条件**: R2上のMarkdownがブラウザで閲覧可能であること
**テスト**: 手動確認

### Task 5: 画像配信エンドポイントの実装

- [ ] `app/routes/api/assets/[...path].ts` - 画像配信ロジック **(FR-05)**

**依存関係**: Task 2
**成果物**: Markdown内で使用する画像をR2から配信するAPI
**完了条件**: 適切な `Content-Type` で画像が表示されること
**テスト**: 手動確認（ブラウザで画像URLへアクセス）

---

## Phase 3: 検証・最適化・デプロイ (Validation & Deployment)

### Task 6: ブラウザ互換性・パフォーマンス確認

- [ ] ブラウザ互換性テスト（手動確認）
  - Chrome, Firefox, Safari での表示確認
- [ ] パフォーマンス測定
  - Lighthouseでの基本スコア確認

**依存関係**: Phase 2 完了
**完了条件**: 全ブラウザで崩れなく動作すること

### Task 7: デプロイ準備・本番環境確認

- [ ] `wrangler.jsonc` の本番バケット名確認
- [ ] `pnpm run deploy` によるデプロイ実施
- [ ] 本番URLでの動作確認（Markdown/画像の表示）

**依存関係**: Task 6 完了
**成果物**: 公開されたブログ
**完了条件**: インターネット経由でブログが正常に閲覧できること

---

## Phase 4: 次のステップ (V1 Vision)

### Task 8: 管理画面 (CMS機能) の構想

- [ ] 管理用エンドポイントの検討 (Cloudflare Access / Clerk 等)
- [ ] 記事作成・編集インターフェースの要件定義

**依存関係**: MVP完了
**成果物**: V1開発に向けたバックログの整理
**完了条件**: 記事投稿の自動化またはUI化の計画が立っていること

---

## チェックリスト（デプロイ前最終確認）

### テスト

- [ ] `pnpm test` がパスしているか
- [ ] 存在しない記事アクセス時に404が返るか

### リソース

- [ ] R2にテスト用の `.md` と画像が配置されているか
- [ ] Tailwind CSS が正しくビルドされているか

### 機能確認

- [ ] 記事一覧から詳細へ遷移できるか
- [ ] 記事内の画像が正しく表示されているか
