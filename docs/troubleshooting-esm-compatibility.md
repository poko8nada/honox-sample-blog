# ESM/Edge Runtime 互換性トラブルシューティング (troubleshooting-esm-compatibility.md)

## 1. 問題 (Problem)

Cloudflare Workers (HonoX) での開発中、ブラウザまたはコンソールに以下のエラーが表示される：

- `ReferenceError: require is not defined`
- `ReferenceError: module is not defined`
- `ReferenceError: process is not defined`

## 2. 原因 (Root Cause)

Cloudflare Workers は **ESM (ES Modules)** 専用のランタイムであり、Node.js 特有の CommonJS (CJS) グローバル変数（`require`, `module`, `exports`, `process` 等）がデフォルトでは存在しません。

Vite は SSR (Server Side Rendering) 用のコードを生成する際、依存ライブラリをバンドルしようとしますが、ライブラリが CJS 形式で書かれている場合、Vite の変換プロセスが不完全になり、ランタイムで未定義の `require` 等を呼び出そうとしてエラーが発生します。

## 3. 解決策 (Solutions)

### 3.1. ESM 対応パッケージへの差し替え

最も根本的な解決策は、CJS に依存しない ESM ネイティブなパッケージを使用することです。

- **例**: `gray-matter` → `gray-matter-es`
- **理由**: `gray-matter-es` は ESM 環境向けにビルドされているため、`require` エラーが発生しません。

### 3.2. Vite の `ssr.external` 設定

パッケージを差し替えられない場合、または依存関係の深い場所にあるユーティリティ（`debug`, `extend` 等）がエラーを起こす場合は、`vite.config.ts` で `ssr.external` に指定します。

```ts
// vite.config.ts
export default defineConfig({
  // ... plugins ...
  ssr: {
    external: [
      'debug',
      'extend'
    ],
  },
})
```

#### なぜ `external` で解決するのか？

1. **Vite の変換を回避**: 通常、Vite はライブラリを解析してバンドル（`noExternal`）しようとしますが、その過程で CJS/ESM の変換に失敗し、壊れたコードを生成することがあります。`external` に指定すると、Vite はそのライブラリの解析とバンドルをスキップします。
2. **ランタイムの互換機能に委ねる**: Cloudflare Workers (workerd / Miniflare) は、Node.js との互換性を高めるための内部的な仕組みを持っています。Vite が中途半端に変換して壊すよりも、オリジナルのコードをそのままランタイムに渡した方が、ランタイム側の互換レイヤーによって正しく実行される可能性が高まります。

## 4. 注意が必要なパッケージのリスト

以下のパッケージは Edge Runtime で問題を起こしやすく、`external` 指定が必要になるケースが多いです。

- `debug`: 内部で Node.js のグローバル変数に依存。
- `extend`: オブジェクトマージ用の CJS ライブラリ。
- `js-yaml`: Markdown プロセッサの依存関係として含まれることが多い。

---

## 5. 参考資料

- [Vite SSR Options - ssr.external](https://vitejs.dev/config/ssr-options.html#ssr-external)
- [Cloudflare Workers - Node.js compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)
