**This is a template. Fill in the [], duplicate or delete the template parts as needed.**

# [プロジェクト名] 要件定義書 (requirement.md)

## 1. 概要 (Overview)

本プロジェクトは、[プロジェクトの目的を簡潔に説明]。

フェーズ1でMVPを達成し、フェーズ2で[追加機能や品質向上]を実現する。

- **サービス名**
  - [サービス名] (仮)
- **目的**
  - [プロジェクトの目的と背景]
- **ターゲット**
  - [想定ユーザー、利用シーン]

---

## 2. 技術スタック (Technology Stack)

### MVP

- **フロントエンド**: [Next.js / React / htmx / など]
- **バックエンド**: [なし / Hono / Express / など]
- **ホスティング**: [Vercel / Cloudflare Workers / Cloud Run / など]
- **認証**: [なし / Clerk / Auth0 /　better auth / など]
- **状態管理**: [React Context / Zustand / nuqs / など]
- **スタイリング/コンポーネント**: [Tailwind CSS / shadcn / react aria / など]
- **テスト**: [Vitest / Testing Library / など]
- **ORM+**: [なし / Drizzle ORM / Prisma / など]
- **データベース**: [なし / D1 / Turso / Supabase / Neon /など]
- **その他**: [その他、使用する主要ライブラリ・API]

### PRODUCT v1(製品版)

- **フロントエンド**: [変更がある場合のみ記載]
- **バックエンド**: [追加・変更内容]
- **その他**: [追加機能や技術スタック]

---

## 3. 機能要件 (Functional Requirements)

> **原則**: 1ファイル = 1機能要件を基本とする。各ファイルの責務を明確化し、テスト可能な単位で設計する。

### 3.1. [機能カテゴリ名]

**FR-01: `ファイル名`**

- **要件**: [機能の概要]
- **詳細**:
  - [実装の詳細]
  - [技術的な制約]
  - [使用するAPI・ライブラリ]
- **関数/コンポーネント**: `関数名(引数): 戻り値`
- **Props** (該当する場合): `{ prop1: type, prop2: type }`
- **戻り値** (該当する場合): `{ value1: type, value2: type }`
- **テスト観点**: [テストで確認すべきポイント]

**FR-02: `ファイル名`**

- **要件**: [機能の概要]
- **詳細**:
  - [実装の詳細]
  - [UIの振る舞い]
  - [状態管理]
- **Props**: `{ prop1: type, prop2: type }`
- **テスト観点**: [テストで確認すべきポイント]

### 3.2. [機能カテゴリ名]

**FR-03: `ファイル名`**

- **要件**: [機能の概要]
- **詳細**:
  - [実装の詳細]
- **関数**: `関数名(引数): 戻り値`
- **テスト観点**: [テストで確認すべきポイント]

---

## 4. 非機能要件 (Non-Functional Requirements)

**NFR-01: パフォーマンス**

- [パフォーマンス要件]
- 例: レスポンスタイム、UI更新頻度、バンドルサイズ

**NFR-02: 互換性**

- [ブラウザ・デバイス対応]
- 例: Chrome 90+, Firefox 88+, Safari 14+

**NFR-03: アクセシビリティ**

- [アクセシビリティ要件]
- 例: WCAG 2.1 Level AA準拠、キーボード操作対応

**NFR-04: テスタビリティ**

- [テスト方針]
- 例: ビジネスロジックと重要な関数のみテスト対象。APIとの接続は、正常系と異常系どちらもテストを行う。UIコンポーネントや自明なコードはテスト不要。

**NFR-05: セキュリティ**

- [セキュリティ要件]
- 例: 機密情報の管理、認証・認可

**NFR-06: アーキテクチャ**

- [アーキテクチャ原則]
- 例: フェーズ間の移行を考慮した抽象化、疎結合設計

**NFR-07: ライセンスコンプライアンス**

- [外部リソースのライセンス管理]
- 例: 使用する全ての外部リソースのライセンス遵守、クレジット表記

---

## 5. ディレクトリ構成と作成ファイル (Directory Structure & Files)

### 5.1. フェーズ1: MVP実装時のディレクトリ構成

```
project-name/
├─ app/                             # Next.jsの場合
│  ├─ layout.tsx                    # FR-XX: Root layout
│  ├─ page.tsx                      # FR-XX: Top page
│  ├─ globals.css
│  ├─ _components/                  # Route-specific UI components
│  │  ├─ ComponentA.tsx            # FR-XX: [機能説明]
│  │  └─ ComponentB.tsx            # FR-XX: [機能説明]
│  ├─ _features/                    # Route-specific features
│  │  └─ FeatureName/              # Feature単位でコロケーション
│  │     ├─ index.tsx              # FR-XX: Feature統合UI
│  │     ├─ useFeatureLogic.ts     # FR-XX: Featureロジック
│  │     └─ useFeatureLogic.test.ts
│  └─ _hooks/                       # Route-specific hooks
│     ├─ useHookA.ts               # FR-XX: [機能説明]
│     └─ useHookA.test.ts
│
├─ utils/                            # Global utilities
│  ├─ types.ts                      # Global types (Result<T, E>)
│  ├─ utilityFunction.ts           # FR-XX: [機能説明]
│  └─ utilityFunction.test.ts
│
├─ components/                       # Global shared UI
│  └─ ui/                           # Atomic UI (shadcn/ui, etc.)
│
├─ hooks/                            # Global shared hooks
└─ public/                           # Static assets
   └─ [assets]
```

**Note:** [プロジェクト構造とコンポーネントの構成については、`arch/` ディレクトリ内のプロジェクトアーキテクチャガイドを参照する。]

---

## 6. 外部リソース・ライセンス (External Resources & Licenses)

| リソース     | 用途   | ライセンス       | クレジット表記     |
| ------------ | ------ | ---------------- | ------------------ |
| [リソース名] | [用途] | [ライセンス種別] | [必要なクレジット] |
| [リソース名] | [用途] | [ライセンス種別] | [必要なクレジット] |

---

## 7. 画面設計 (Screen Design)

### 7.1. 画面一覧 (Screen List)

| No  | 画面名   | URLパス     | 機能概要               | 備考 |
| --- | -------- | ----------- | ---------------------- | ---- |
| 001 | ホーム   | `/`         | サービスのトップページ |      |
| XXX | [画面名] | `[URLパス]` | [機能]                 |      |

### 7.2. 画面フロー図 (Screen Flow Diagram)

[画面フロー図の挿入場所]

### 7.3. ワイヤーフレーム・モックアップ (Wireframes & Mockups)

[ワイヤーフレーム・モックアップの挿入場所]

**Note**: 画面フロー図、ワイヤーフレーム・モックアップは、簡易的なもので構わない。またFigmaやMiroなどの外部ツールで管理している場合、そのリンクを記載する。

---

## 8. デザインシステム (Design System)

### 8.1. カラーパレット (Color Palette)

**カラーモード対応**

- ライトモード: [必須 / 不要]
- ダークモード: [必須 / 不要 / オプション]
- システム設定追従: [あり / なし]

**ライトモード**

_プライマリカラー_

- Primary: `#000000` - [用途: メインアクション、ブランドカラー]
- Primary hover: `#000000` - [ホバー時の色]

_セカンダリカラー_

- Secondary: `#000000` - [用途: セカンダリアクション]
- Secondary hover: `#000000` - [ホバー時の色]

_背景・テキストカラー_

- Background: `#FFFFFF` - [背景色]
- Surface: `#F5F5F5` - [カード・パネル背景]
- Text primary: `#1A1A1A` - [メインテキスト]
- Text secondary: `#666666` - [サブテキスト]

_セマンティックカラー_

- Success: `#10B981` - [成功状態、完了]
- Warning: `#F59E0B` - [警告、注意]
- Error: `#EF4444` - [エラー、削除]
- Info: `#3B82F6` - [情報、ヘルプ]

**ダークモード**（該当する場合）

_プライマリカラー_

- Primary: `#FFFFFF` - [用途: メインアクション、ブランドカラー]
- Primary hover: `#E5E5E5` - [ホバー時の色]

_セカンダリカラー_

- Secondary: `#A0A0A0` - [用途: セカンダリアクション]
- Secondary hover: `#B0B0B0` - [ホバー時の色]

_背景・テキストカラー_

- Background: `#0A0A0A` - [背景色]
- Surface: `#1A1A1A` - [カード・パネル背景]
- Text primary: `#E5E5E5` - [メインテキスト]
- Text secondary: `#A0A0A0` - [サブテキスト]

_セマンティックカラー_

- Success: `#10B981` - [成功状態、完了]
- Warning: `#F59E0B` - [警告、注意]
- Error: `#EF4444` - [エラー、削除]
- Info: `#3B82F6` - [情報、ヘルプ]

**コントラスト比**

- Text primary / Background: 4.5:1 以上（WCAG AA準拠）
- Text secondary / Background: 4.5:1 以上
- Interactive elements: 3:1 以上

**実装パターン**

- Tailwind の `dark:` バリアントを使用: `bg-white dark:bg-black`
- `next-themes` などのライブラリでテーマ切り替え実装
- システム設定追従の場合: `darkMode: 'media'` を使用

**Note**: shadcn/ui などのコンポーネントライブラリを使用する場合、カラーのみカスタマイズし、タイポグラフィ・スペーシングは Tailwind / ライブラリのデフォルトを尊重する。

---

## 9. 備考・参考資料 (Notes & References)

- [参考URL]
- [デザインモックアップ]
- [その他補足情報]
