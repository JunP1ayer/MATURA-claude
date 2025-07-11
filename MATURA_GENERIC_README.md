# MATURA - 汎用自己進化コード生成エンジン

## 🌟 概要

MATURAは**ユーザーのアイデアを形にする汎用的な自己進化エンジン**です。任意のアプリケーションアイデアから、完全に動作するNext.js/React/TypeScriptアプリケーションを自動生成します。

## 🚀 特徴

- **完全汎用化**: 扶養控除アプリ専用ではなく、あらゆるアプリアイデアに対応
- **自己進化**: 内部で段階的にコードを生成し、自己修正して完成させる
- **6つのジェネレーター**: UI、Store、Handlers、API、自動修正、統合実行

## 📦 ジェネレーター詳細

### 1️⃣ generateUI.ts - 動的UI生成
```typescript
// アプリアイデアに基づいてUIを自動生成
const ui = await generateUI({
  appIdea: "タスク管理アプリ",
  theme: "modern"
})
```

### 2️⃣ generateStore.ts - 動的Store生成
```typescript
// アプリに最適化されたZustandストアを生成
const store = await generateStore({
  appIdea: "タスク管理アプリ",
  storeType: "zustand"
})
```

### 3️⃣ generateHandlers.ts - 動的イベントハンドラ生成
```typescript
// アプリ固有のイベントハンドラを生成
const handlers = await generateHandlers({
  appIdea: "タスク管理アプリ",
  handlerTypes: ["crud", "ui", "api"]
})
```

### 4️⃣ generateApiMock.ts - 動的API生成
```typescript
// アプリに必要なAPIエンドポイントを生成
const api = await generateApiMock({
  appIdea: "タスク管理アプリ",
  apiType: "rest"
})
```

### 5️⃣ autoLintTypeCheck.ts - 自己修正システム
- ESLint自動実行・修正
- TypeScript型チェック・エラー修正
- 依存関係自動インストール
- 最大3サイクルの自己修正ループ

### 6️⃣ generateAll.ts - 統合実行マスター
```typescript
// 全てのジェネレーターを統合実行
const result = await generateAll({
  appIdea: "タスク管理アプリ：タスクの作成・編集・削除・完了状態管理",
  theme: "modern",
  runAutoCorrection: true
})
```

## 💡 使用例

### タスク管理アプリ
```typescript
generateAll({
  appIdea: "タスク管理アプリ：タスクの作成・編集・削除・完了状態管理、カテゴリ分類、期限設定"
})
```

### 経費追跡アプリ
```typescript
generateAll({
  appIdea: "経費追跡アプリ：収入・支出の記録、カテゴリ別集計、月次レポート、予算管理"
})
```

### レシピ共有アプリ
```typescript
generateAll({
  appIdea: "レシピ共有アプリ：レシピの投稿・閲覧・検索、材料リスト、お気に入り機能"
})
```

### 習慣トラッカー
```typescript
generateAll({
  appIdea: "習慣トラッカーアプリ：習慣の登録、毎日のチェックイン、達成率の可視化"
})
```

## 🔧 動作原理

1. **アイデア解析**: 入力されたアプリアイデアを解析
2. **動的プロンプト生成**: アイデアに基づいてGemini APIプロンプトを構築
3. **コード生成**: 各ジェネレーターがアプリ固有のコードを生成
4. **自己修正**: 生成されたコードの型エラーやLintエラーを自動修正
5. **統合**: 全てのコンポーネントを統合して完全なアプリを構築

## 📊 生成されるファイル構造

```
generated/
├── app/
│   ├── GeneratedUI.tsx      # アプリ固有のUI
│   ├── page.tsx            # メインページ
│   └── api/
│       └── [endpoint]/     # アプリ固有のAPIエンドポイント
├── store/
│   └── generatedStore.ts   # アプリ固有の状態管理
├── lib/
│   └── handlers/
│       └── eventHandlers.ts # アプリ固有のイベントハンドラ
└── __tests__/              # 自動生成されたテスト
```

## 🎯 重要なポイント

- **完全汎用**: 特定のアプリ（扶養控除など）に依存しない
- **自己完結**: 生成されたコードは即座に動作可能
- **拡張可能**: 新しいジェネレーターの追加が容易
- **品質保証**: 自動テスト、型チェック、Lintを含む

## 🚦 実行方法

```bash
# 環境変数設定
export GEMINI_API_KEY="your-api-key"

# テストスクリプト実行
npm run test:generic

# または直接実行
ts-node scripts/testGenericMatura.ts
```

## 📈 今後の展開

- GraphQL対応
- より多様なUIテーマ
- リアルタイムアプリ対応
- マイクロサービス生成
- Docker/K8s設定生成

---

**MATURA** - あなたのアイデアを、動くコードに。自己進化する汎用コード生成エンジン。