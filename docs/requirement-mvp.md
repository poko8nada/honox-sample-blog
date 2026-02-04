# honox-blog 要件定義書 (requirement-mvp.md)

## 1. 概要 (Overview)

本プロジェクトは、HonoXをフレームワークとして使用し、Cloudflare R2をデータストレージとして活用する軽量なブログシステムである。
MVPでは機能性を重視し、スタイリングは最小限（Minimal Styling）に留める。

フェーズ1でR2からの配信を可能にするMVPを構築し、フェーズ2（v1）で管理画面（CMS機能）を追加する。

- **サービス名**
  - honox-blog
- **目的**
  - 外部のヘッドレスCMSやDBを使わず、Cloudflare R2に配置したMarkdownファイルと画像を直接配信する仕組みを構築する。
- **ターゲット**
  - 技術ブログをシンプルかつ低コストで運用したい開発者。

---

## 2. 技術スタック (Technology Stack)

### MVP

- **フレームワーク**: HonoX
- **レンダラー**: hono/jsx (SSR)
- **ホスティング/ランタイム**: Cloudflare Workers
- **ストレージ**: Cloudflare R2 (Markdown, Images)
- **Markdown変換**:
  - `unified`: 全体のプロセッサー
  - `remark-parse`: Markdown の解析
  - `remark-rehype`: Markdown (remark) から HTML (rehype) への変換
  - `rehype-stringify`: HTML の出力
- **Frontmatterパース**: `gray-matter-es` (ESM環境に対応したgray-matterのフォーク)
- **スタイリング**: Tailwind CSS v4 + `@tailwindcss/typography` (記事本文の最小限の装飾)
- **Lint/Formatter**: Biome
- **パッケージマネージャ**: pnpm
- **主要スクリプト**:
  - `dev`: `vite` - 開発サーバーの起動
  - `build`: `vite build --mode client && vite build` - ビルド
  - `preview`: `wrangler dev` - ローカルでの動作確認
  - `deploy`: `pnpm run build && wrangler deploy` - デプロイ
  - `test`: `vitest` - テストの実行
  - `lint`: `biome check --write` - Lintとフォーマットの実行

### PRODUCT v1 (製品版)

- **管理画面**: 記事のアップロード、編集、削除を行うダッシュボード
- **認証**: 管理画面へのアクセス制限（Cloudflare Access または Clerk等）
- **プレビュー機能**: 下書き記事のプレビュー表示

---

## 3. 機能要件 (Functional Requirements)

### 3.1. 記事管理・配信機能

**FR-01: `r2-client` (Utility)**

- **要件**: Cloudflare R2バインディングを介したデータの取得。
- **詳細**:
  - 指定されたパス（slug）に基づき、R2バケットからオブジェクトを取得する。
  - `.md` ファイルのリスト取得機能。
- **テスト観点**: モックされたR2バインディングを使用して、正しいデータが取得できるか。

**FR-02: `markdown-processor` (Utility)**

- **要件**: Markdown文字列をHTMLへ変換。
- **詳細**:
  - `gray-matter-es` を使用した Frontmatter (YAML) のパース。
  - `remark`/`rehype` を使用した本文のHTML変換。
  - 記事タイトル、公開日、タグ、説明文の抽出。
- **テスト観点**: Markdownが期待通りのHTML構造に変換され、Frontmatterがオブジェクトとして正しく抽出されるか。

### 3.2. ルーティング

**FR-03: `app/routes/index.tsx`**

- **要件**: 記事一覧の表示。
- **詳細**:
  - R2上の `.md` ファイル一覧からメタデータを取得し、リスト表示する。
- **テスト観点**: 記事リストが正しくレンダリングされるか。

**FR-04: `app/routes/posts/[slug].tsx`**

- **要6**: 記事詳細の表示。
- **詳細**:
  - `slug` に対応する `.md` ファイルをR2から取得し、HTMLとしてレンダリングする。
- **テスト観点**: 存在しないslugに対する404レスポンス。

**FR-05: app/routes/api/[...path].ts**

- **要件**: R2内の画像ファイル配信。
- **詳細**:
  - Markdown内から参照される画像ファイルをR2から取得し、適切な `Content-Type` でレスポンスを返す。
- **テスト観点**: 画像ファイルが正しいバイナリデータとして配信されるか。

### 3.3. R2 ストレージ構造 (R2 Storage Structure)

R2バケット内は以下のディレクトリ（プレフィックス）構造で管理する。

- `posts/`: Markdownファイル（.md）を格納。
  - 例: `posts/hello-world.md`
- `images/`: 記事内で使用する画像ファイルを格納。
  - 例: `images/hero-image.png`

---

## 4. 非機能要件 (Non-Functional Requirements)

**NFR-01: パフォーマンス**

- Cloudflare WorkersのEdge実行による高速なレスポンス。
- R2からの取得結果の適切なキャッシュ制御。

**NFR-02: セキュリティ**

- R2バケットはパブリック公開せず、Worker経由でのみアクセス可能とする。

**NFR-03: アーキテクチャ**

- Islands Architectureを活用し、必要最小限のJavaScriptのみをクライアントに送る。
- Markdown変換はサーバーサイドで行う。

**NFR-04: エラーハンドリング方針**

- ビジネスロジックやデータ取得層（lib/）では、例外（try-catch）を直接呼び出し側に伝播させず、`Result<T, E>` 型（`app/utils/types.ts`）を使用してエラーを値として返す。
- これにより、エラーハンドリングを型安全かつ明示的に行う。

**NFR-05: ESM/Edgeランタイム互換性**

- Cloudflare Workers (Edgeランタイム) では Node.js の `require` が使用できないため、純粋な ESM パッケージを選択するか、Vite の `ssr.external` 設定で適切に処理する。
- `gray-matter` のような CommonJS ライブラリは `gray-matter-es` などの ESM 対応版を使用し、必要に応じて Vite の `ssr.external` に依存関係を追加してエラーを回避する。
- 詳細は [ESM/Edge Runtime 互換性トラブルシューティング](./troubleshooting-esm-compatibility.md) を参照。

---

## 5. ディレクトリ構成と作成ファイル (Directory Structure & Files)

### 5.1. MVP実装時のディレクトリ構成

```
honox-sample-blog/
├─ app/
│  ├─ routes/
│  │  ├─ index.tsx               # FR-03: 記事一覧
│  │  ├─ posts/
│  │  │  └─ [slug].tsx           # FR-04: 記事詳細
│  │  ├─ api/
│  │  │  └─ [...path].ts           # FR-05: R2画像配信
│  │  └─ _renderer.tsx           # 全体レイアウト
│  ├─ lib/                       # ビジネスロジック・ユーティリティ層（Result型を使用）
│  │  ├─ r2.ts                   # FR-01: R2クライアント
│  │  └─ markdown.ts             # FR-02: Markdown変換
│  ├─ utils/                     # 汎用的な型定義やヘルパー
│  │  └─ types.ts                # Result<T, E> 型の定義
│  ├─ style.css                  # Tailwind CSS v4
│  ├─ server.ts
│  └─ client.ts
├─ wrangler.jsonc                # R2バインディング設定
└─ package.json
```

---

## 6. 画面設計 (Screen Design)

### 6.1. 画面一覧 (Screen List)

| No  | 画面名   | URLパス        | 機能概要             |
| --- | -------- | -------------- | -------------------- |
| 001 | ホーム   | `/`            | 記事一覧のリスト表示 |
| 002 | 記事詳細 | `/posts/:slug` | 記事本文の表示       |

---

## 7. 備考・参考資料 (Notes & References)

- [HonoX Documentation](https://github.com/honojs/honox)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [ESM/Edge Runtime 互換性トラブルシューティング](./troubleshooting-esm-compatibility.md)
