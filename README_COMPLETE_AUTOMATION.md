# 🚀 MATURA - 完全自動化システム

## 📌 概要

MATURAは**人間の手を一切介さず**、ユーザーの自然文から「動くサービス」を自動生成する完全自動化システムです。

## ⚡ ワンコマンド実行

```bash
# 環境変数設定
export GEMINI_API_KEY="your-gemini-api-key"

# 自動生成実行
npm run generate:all "タスク管理アプリを作りたい"
```

## 🎯 自動生成される内容

### 1️⃣ UIコンポーネント
- **生成ファイル**: `app/page.tsx`, `app/components/`
- **内容**: Hero、CTA、カード、ページ構造
- **技術**: Next.js 14 App Router、Tailwind CSS

### 2️⃣ 状態管理
- **生成ファイル**: `lib/store/useAppStore.ts`
- **内容**: Zustand store、TypeScript型定義
- **機能**: CRUD操作、永続化、DevTools

### 3️⃣ イベントハンドラー
- **生成ファイル**: `lib/handlers/useHandlers.ts`
- **内容**: onClick等のロジック、カスタムフック
- **機能**: バリデーション、エラーハンドリング

### 4️⃣ モックAPI
- **生成ファイル**: `app/api/data/route.ts`, `app/api/actions/route.ts`
- **内容**: RESTエンドポイント、モックデータ
- **機能**: CRUD操作、レスポンス管理

### 5️⃣ 自動修正
- **ESLint**: 自動実行・自動修正
- **TypeScript**: 型チェック・エラー修正
- **再生成**: エラー時の自動再試行

## 🔧 システム構成

```
MATURA/
├── scripts/
│   └── generate.js              # CLI エントリーポイント
├── lib/
│   ├── core/                    # コアシステム
│   │   ├── geminiClient.ts      # Gemini API クライアント
│   │   ├── fileManager.ts       # ファイル管理
│   │   └── autoFixer.ts         # 自動修正システム
│   └── generators/              # 生成エンジン
│       ├── generateUI.js        # UI生成
│       ├── generateStore.js     # Store生成
│       ├── generateHandlers.js  # ハンドラー生成
│       ├── generateApiMock.js   # API生成
│       └── generateAll.js       # 統合制御
└── 生成結果/
    ├── app/                     # 自動生成されたアプリ
    │   ├── page.tsx
    │   ├── components/
    │   └── api/
    └── lib/                     # 自動生成されたライブラリ
        ├── store/
        └── handlers/
```

## 🎮 使用例

### タスク管理アプリ
```bash
npm run generate:all "タスクの作成・編集・削除ができるTodoアプリ"
```

### ブログサイト
```bash
npm run generate:all "記事投稿・コメント機能があるブログサイト"
```

### ECサイト
```bash
npm run generate:all "商品一覧・カート・決済機能があるECサイト"
```

### SNSアプリ
```bash
npm run generate:all "投稿・いいね・フォロー機能があるSNSアプリ"
```

## 🔄 自己修正フロー

1. **生成完了後**: ESLint + TypeScript チェック実行
2. **エラー検出**: Gemini APIに修正を依頼
3. **自動適用**: 修正されたコードを自動保存
4. **再チェック**: 最大3回まで自動リトライ
5. **完了確認**: 全エラー解消まで継続

## 📊 実行結果例

```
🚀 ======================================
🚀 MATURA 完全自動生成システム開始
🚀 ======================================
💡 User Input: タスク管理アプリを作りたい

🎯 [UI Generation] Starting...
✅ [UI Generation] Completed successfully

🎯 [Store Generation] Starting...
✅ [Store Generation] Completed successfully

🎯 [Handlers Generation] Starting...
✅ [Handlers Generation] Completed successfully

🎯 [API Mock Generation] Starting...
✅ [API Mock Generation] Completed successfully

🎯 [Auto Fix] Starting...
🔧 [Auto Fix] Running lint and type checks...
✅ [Auto Fix] Completed successfully

🎉 ======================================
🎉 MATURA 生成完了!
🎉 ======================================
⏱️ 総実行時間: 45秒
✅ 総合結果: 成功

📊 フェーズ別結果:
  🎨 UI: ✅
  🗄️ Store: ✅
  ⚡ Handlers: ✅
  📡 API: ✅
  🔧 Auto Fix: ✅

🚀 アプリケーション準備完了!
```

## 🛠️ 設定

### 必要な環境変数
```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

### .env ファイル
```
GEMINI_API_KEY=your-gemini-api-key
```

## 🚨 エラーハンドリング

- **API失敗**: 自動リトライ（最大3回）
- **ファイル保存失敗**: 自動復旧試行
- **Lint/型エラー**: Gemini APIで自動修正
- **致命的エラー**: ログ出力して適切に終了

## 🎯 特徴

- ✅ **完全自動**: 人間の介入不要
- ✅ **自己修正**: エラー時の自動復旧
- ✅ **リトライ機能**: 失敗時の自動再試行
- ✅ **品質保証**: Lint・型チェック自動実行
- ✅ **生産レディ**: 即座に動作するコード生成

## 🚀 今すぐ始める

```bash
# 1. リポジトリクローン
git clone [repository-url]

# 2. 依存関係インストール
npm install

# 3. 環境変数設定
export GEMINI_API_KEY="your-api-key"

# 4. 自動生成実行
npm run generate:all "あなたのアプリアイデア"

# 5. 開発サーバー起動
npm run dev
```

**🎉 これであなたのアイデアが動くアプリになります！**