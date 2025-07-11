# MATURA Generator Scripts

## 概要
自然言語からNext.jsアプリケーションを自律生成するスクリプト群です。

## セットアップ

```bash
# 依存関係インストール
cd scripts/matura
npm install

# 環境変数設定
export OPENAI_API_KEY="your-openai-key"
export GEMINI_API_KEY="your-gemini-key"
```

## 使用方法

### 1. 構造生成のみ
```bash
npx tsx generateStructure.ts
```

### 2. UI生成のみ
```bash
npx tsx generateUI.ts
```

### 3. 完全自動生成
```bash
npx tsx matura.ts "タスク管理アプリを作って"
```

### 4. Figma連携
```bash
npx tsx matura.ts "ECサイト" --figma="https://figma.com/..."
```

## 生成フロー

1. **構造解析** - 自然言語をJSON構造に変換
2. **UI生成** - shadcn/ui + Tailwind CSSでコンポーネント生成
3. **状態管理** - Zustandストア生成
4. **API生成** - Next.js API Routes生成
5. **統合検証** - TypeScript/ESLintチェック
6. **自己修正** - エラーを自動修正

## 出力

生成されたアプリは `/app/generated-app/` に保存されます。

```bash
cd ../../app/generated-app
npm run dev
```

## カスタマイズ

`matura.config.json` で詳細設定が可能です。