# MATURA - AI-Powered App Generator with Figma Integration

## 🎯 概要

MATURAは自然言語でアプリケーションを自動生成するAIプラットフォームです。**Figmaデザイン連携機能**により、デザインシステムを活用した高品質なNext.js + TypeScript + shadcn/ui アプリケーションを生成できます。

## ✨ 主要機能

- 🤖 **AI-Powered Generation**: Gemini AI による高品質コード生成
- 🎨 **Figma Integration**: Figma REST API からデザインシステムを自動取得
- 🎨 **Design System Mapping**: Figma コンポーネント → shadcn/ui 自動マッピング
- 📱 **Modern Stack**: Next.js 14 + TypeScript + Tailwind CSS + Zustand
- 🔄 **Real-time Generation**: リアルタイム生成プロセス表示
- 🛡️ **Error Handling**: 包括的なエラーハンドリングとフォールバック
- 📊 **Test Tools**: Figma統合テストツール内蔵

## 🚀 クイックスタート

### 1. 環境設定

```bash
# リポジトリをクローン
git clone <repository-url>
cd MATURA-claude

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
```

### 2. 必要なAPIキーを設定

`.env` ファイルを編集：

```env
# Gemini API Key (必須)
GEMINI_API_KEY=your-gemini-api-key-here

# Figma API Key (必須 - Figma統合用)
FIGMA_API_KEY=your-figma-api-key-here

# Default Figma File ID (オプション)
DEFAULT_FIGMA_FILE_ID=GeCGXZi0K7PqpHmzXjZkWn
```

### 3. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 🎨 Figma連携機能

### Figma API キーの取得

1. [Figma Developer Settings](https://www.figma.com/developers/api#access-tokens) にアクセス
2. "Generate new token" をクリック
3. 生成されたトークンを `.env` の `FIGMA_API_KEY` に設定

### Figma File ID の取得

Figma URL から File ID を抽出：
```
https://www.figma.com/file/ABC123/My-Design
                        ^^^^^^ <- これがFile ID
```

### 対応機能

- **カラーパレット抽出**: Figmaから色を自動抽出してTailwind CSSに適用
- **フォント抽出**: Figmaで使用されているフォントを特定
- **コンポーネントマッピング**: 
  - Button → shadcn/ui Button
  - Card → shadcn/ui Card  
  - Input → shadcn/ui Input
  - Badge → shadcn/ui Badge
- **レスポンシブ対応**: モバイルファースト設計
- **アクセシビリティ**: ARIA属性とキーボードナビゲーション

## 🔧 API エンドポイント

### `/api/generate` - アプリ生成

```typescript
POST /api/generate
{
  "userInput": "タスク管理アプリを作って",
  "figmaFileId": "optional-figma-file-id"
}
```

### `/api/figma` - Figmaデータ取得

```typescript
POST /api/figma
{
  "fileId": "figma-file-id"
}
```

## 🛠️ 使用方法

### 1. 基本的な生成

1. トップページの「今すぐアプリを作る」をクリック
2. 作りたいアプリの説明を自然言語で入力
3. 「アプリを作る」ボタンをクリック
4. 生成プロセスを確認
5. 完成したアプリを `/generated-app` で確認

### 2. Figma統合生成

1. 生成画面で「高度な設定」を展開
2. Figma File ID を入力（オプション）
3. アプリ生成を実行
4. Figmaデザインシステムが自動適用される

### 3. Figma統合テスト

1. `/components/FigmaIntegrationTest.tsx` コンポーネントを使用
2. Figma File ID を入力
3. 「Test Figma API」で接続テスト
4. 「Test Full Generation」で完全生成テスト

## 📁 プロジェクト構造

```
MATURA-claude/
├── app/
│   ├── api/
│   │   ├── generate/          # メイン生成API
│   │   ├── figma/            # Figma API ラッパー
│   │   └── figma-generate/   # Figma統合生成
│   ├── generator/            # 生成UI
│   ├── figma-import/         # Figma連携UI
│   └── generated-app/        # 生成されたアプリ保存先
├── lib/
│   ├── figma.ts             # Figma API クライアント
│   └── appTemplates.ts      # アプリテンプレート
├── components/
│   ├── ui/                  # shadcn/ui コンポーネント
│   └── FigmaIntegrationTest.tsx # テストツール
└── .env                     # 環境変数
```

## 🔄 生成フロー

1. **要件分析**: 自然言語入力をAIが解析
2. **Figmaデータ取得**: 指定されたFigmaファイルからデザインシステム抽出
3. **shadcn/ui マッピング**: Figmaコンポーネントをshadcn/uiにマッピング
4. **コード生成**: Gemini AIが統合されたコードを生成
5. **検証・修正**: 生成されたコードを検証し、必要に応じて修正
6. **ファイル保存**: `/app/generated-app/` に結果を保存

## 🛡️ エラーハンドリング

### フォールバック機能

1. **Figma API エラー**: デフォルトテンプレートを使用
2. **AI生成エラー**: テンプレートベース生成にフォールバック
3. **コード検証エラー**: 自動修正を試行、失敗時はフォールバックアプリを生成

### ログ出力

- 🎨 Figma API呼び出し
- 🤖 AI生成プロセス
- ✅ 成功ログ
- ❌ エラーログ
- 📊 統計情報

## 🧪 テスト

```bash
# TypeScript型チェック
npm run type-check

# ESLint
npm run lint

# Prettier
npm run prettier

# 全体品質チェック
npm run quality

# 自動修正
npm run quality:fix
```

## 📊 対応アプリタイプ

- **タスク・ToDo管理アプリ**
- **家計簿・レシピ管理アプリ**  
- **在庫・予約管理システム**
- **ブログ・ポートフォリオサイト**
- **ランディングページ**
- **学習管理アプリ**
- **カスタムアプリ** (自由記述)

## 🔧 カスタマイズ

### 新しいテンプレート追加

`lib/appTemplates.ts` でアプリタイプを追加：

```typescript
export function generateAppByType(appType: string, description: string): string {
  // 新しいアプリタイプの条件を追加
  if (appType.includes('your-new-type')) {
    return yourNewTemplate()
  }
  // ...
}
```

### Figmaコンポーネントマッピング追加

`lib/figma.ts` の `mapToShadcnComponents` を拡張：

```typescript
// 新しいコンポーネントマッピングを追加
if (name.includes('your-component')) {
  return {
    figmaName: comp.name,
    shadcnComponent: 'YourShadcnComponent',
    props: { /* プロパティ */ },
    description: `説明`
  }
}
```

## 🚢 デプロイ

### Vercel

```bash
# Vercelにデプロイ
vercel

# 環境変数を設定
vercel env add GEMINI_API_KEY
vercel env add FIGMA_API_KEY
vercel env add DEFAULT_FIGMA_FILE_ID
```

### Docker

```bash
# Dockerイメージをビルド
docker build -t matura .

# コンテナを実行
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your-key \
  -e FIGMA_API_KEY=your-figma-key \
  matura
```

## 📋 システム要件

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Gemini API Key**: 必須
- **Figma API Key**: Figma連携時に必須

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/new-feature`)
3. 変更をコミット (`git commit -am 'Add new feature'`)
4. ブランチにプッシュ (`git push origin feature/new-feature`)
5. プルリクエストを作成

## 📝 ライセンス

MIT License

## 🆘 サポート

- **Issues**: GitHubのIssuesで報告
- **Documentation**: 本READMEおよび各ファイルのコメント
- **Test Tool**: `/components/FigmaIntegrationTest.tsx` でFigma連携をテスト

---

**MATURA Development Team** 🚀