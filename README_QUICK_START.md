# 🚀 MATURA - クイックスタートガイド

## ⚡ ワンコマンド実行

```bash
# 1. API キー設定
export GEMINI_API_KEY="your-api-key"

# 2. 自動生成実行
npm run generate:all "タスク管理アプリを作りたい"

# 3. 開発サーバー起動
npm run dev
```

## 📦 初回セットアップ

```bash
# セットアップスクリプト実行
./scripts/setup-matura.sh

# または手動で
cp .env.example .env
# .env ファイルでGEMINI_API_KEYを設定
npm install
```

## 🎯 自動生成される内容

### ✅ 生成ファイル一覧
- `app/page.tsx` - メインページ
- `app/GeneratedUI.tsx` - UIコンポーネント (Hero + CTA + Features)
- `app/store.ts` - Zustand状態管理 (income, remainingLimit, updateIncome)
- `app/Handlers.tsx` - イベントハンドラー (onClick, console.log)
- `app/api/fuyouCheck/route.ts` - モックAPI (GET/POST)

### 🔧 自動修正機能
- ESLint自動実行・修正
- TypeScript型チェック
- エラー時のGemini API自動修正
- 最大3回リトライ

## 💡 使用例

### タスク管理アプリ
```bash
npm run generate:all "タスクの作成・編集・削除・完了機能があるTodoアプリ"
```

### ブログサイト  
```bash
npm run generate:all "記事投稿・コメント・いいね機能があるブログサイト"
```

### ECサイト
```bash
npm run generate:all "商品一覧・カート・決済機能があるECサイト"
```

### 家計簿アプリ
```bash
npm run generate:all "収入・支出管理・グラフ表示機能がある家計簿アプリ"
```

## 🛠️ 技術スタック

- **Frontend**: Next.js 14 App Router + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + Persist
- **API**: Next.js API Routes
- **Generation**: Gemini API
- **Deploy**: Vercel Ready

## 📊 実行フロー

```
自然言語入力
    ↓
段階的分解 (Gemini API)
    ↓
1️⃣ UI生成 (Hero + CTA + Cards)
    ↓  
2️⃣ Store生成 (Zustand + Actions)
    ↓
3️⃣ Handlers生成 (onClick + Logging)
    ↓
4️⃣ API生成 (Mock Endpoints)
    ↓
5️⃣ 品質チェック (Lint + TypeScript)
    ↓
6️⃣ 自動修正 (Error Fix + Retry)
    ↓
動くUIアプリ完成 🎉
```

## 🚨 トラブルシューティング

### API キーエラー
```bash
❌ GEMINI_API_KEY environment variable is required
```
→ `.env`ファイルでAPI キーを設定

### 生成エラー
```bash
⚠️ [UI Generation] 試行 1/3 失敗
```
→ 自動リトライ（最大3回） + 自動修正

### 型エラー  
```bash
⚠️ TypeScript found issues
🔧 Attempting auto-fix with Gemini API...
```
→ 自動修正 + `auto-fix-suggestions.md`に提案保存

## 🚀 Vercel デプロイ

```bash
# Vercel CLI インストール
npm i -g vercel

# デプロイ
vercel

# 環境変数設定
vercel env add GEMINI_API_KEY
```

## 📁 プロジェクト構成

```
MATURA/
├── scripts/           # 自動生成スクリプト
│   ├── generateUI.ts     # UI生成
│   ├── generateStore.ts  # Store生成  
│   ├── generateHandlers.ts # Handler生成
│   ├── generateApiMock.ts  # API生成
│   └── generateAll.ts    # 統合実行
├── app/              # 生成されるアプリ
│   ├── page.tsx         # メインページ
│   ├── GeneratedUI.tsx  # UI
│   ├── store.ts         # 状態管理
│   ├── Handlers.tsx     # ハンドラー
│   └── api/            # API
└── .env              # 設定ファイル
```

## 🎉 成功パターン

```
🚀 MATURA 生成完了レポート
📊 成功率: 6/6 (100%)
📋 フェーズ別結果:
  ✅ UI Generation
  ✅ Store Generation  
  ✅ Handlers Generation
  ✅ API Mock Generation
  ✅ Quality Check & Auto-Fix
  ✅ Final Integration

🚀 アプリケーション準備完了!
   次のコマンドで開発サーバーを起動: npm run dev
```

**🎯 これであなたのアイデアが動くアプリになります！**