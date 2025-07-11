# 🚀 MATURA - 対話式生成システム

## ✨ 概要

MATURAは自然言語でアプリのアイデアを入力すると、対話を通じて詳細な仕様を収集し、完全に動作するNext.jsアプリケーションを自動生成するシステムです。

## 🎯 使用方法

### 🔥 対話式生成

```bash
# 1. API キー設定
export GEMINI_API_KEY="your-api-key"

# 2. 対話式生成開始
npm run generate:all

# 3. 対話に答える
# 📱 アプリの種類を選択
# 📝 詳細説明を入力
# ⚙️ 必要な機能を選択
# 🎨 UIテーマを選択
# 🔧 複雑度を選択
# 🔍 技術要件を確認
# 📋 最終確認

# 4. 自動生成完了 → アプリ起動
npm run dev
```

## 🗣️ 対話フロー

### 1️⃣ アプリの種類選択
```
📱 1. どのような種類のアプリを作成しますか？

   1) タスク・ToDo管理アプリ
   2) 家計簿・金融管理アプリ
   3) ブログ・コンテンツサイト
   4) ECサイト・ショッピングサイト
   5) SNS・コミュニティアプリ
   6) 予約・スケジュール管理
   7) 学習・教育アプリ
   8) その他（カスタム）

🎯 選択してください (1-8): 
```

### 2️⃣ 詳細説明
```
📝 2. アプリの詳細を教えてください

💡 提案: タスクの作成・編集・削除・完了状態管理、カテゴリ分類、期限設定、優先度管理機能を持つアプリ

❓ この説明を使用しますか？ (y/N): 
```

### 3️⃣ 機能選択
```
⚙️ 3. 必要な機能を選択してください（複数選択可）

   1) タスク作成・編集・削除
   2) 期限・優先度設定
   3) カテゴリ・タグ分類
   4) 進捗管理・完了率表示
   5) リマインダー・通知
   6) チーム共有・協力機能
   7) ダッシュボード・統計表示

🎯 選択してください (例: 1,3,5 または all): 
```

### 4️⃣ UIテーマ選択
```
🎨 4. UIテーマを選択してください

   1) Modern - モダン・グラデーション・アニメーション
   2) Minimal - ミニマル・シンプル・クリーン
   3) Professional - プロフェッショナル・ビジネス向け

🎯 選択してください (1-3): 
```

### 5️⃣ 複雑度選択
```
🔧 5. アプリの複雑度を選択してください

   1) Simple - 基本機能のみ、シンプル構成
   2) Medium - 中程度の機能、バランス重視
   3) Advanced - 高機能、フル装備

🎯 選択してください (1-3): 
```

### 6️⃣ 技術要件確認
```
🔍 6. 技術要件の確認

💡 自動判定:
   API (バックエンド処理): 必要
   Store (状態管理): 必要

❓ APIを含めますか？ (Y/n): 
❓ 状態管理を含めますか？ (Y/n): 
```

### 7️⃣ 最終確認
```
📋 7. 最終確認

生成されるアプリの仕様:
   📱 種類: タスク・ToDo管理アプリ
   📝 説明: タスクの作成・編集・削除・完了状態管理...
   ⚙️ 機能: タスク作成・編集・削除, 期限・優先度設定...
   🎨 テーマ: modern
   🔧 複雑度: medium
   📡 API: あり
   🗄️ Store: あり

❓ この仕様でアプリを生成しますか？ (Y/n): 
```

## 🔄 生成プロセス

```
🚀 ======================================
🚀 MATURA 対話式生成システム開始
🚀 ======================================
💡 アプリ種類: タスク・ToDo管理アプリ
📝 説明: タスクの作成・編集・削除・完了状態管理...
⚙️ 機能: タスク作成・編集・削除, 期限・優先度設定...
🎨 テーマ: modern
⏳ 段階的生成を開始します...

🎯 [UI Generation] 開始...
✅ [UI Generation] 完了

🎯 [Store Generation] 開始...
✅ [Store Generation] 完了

🎯 [Handlers Generation] 開始...
✅ [Handlers Generation] 完了

🎯 [API Mock Generation] 開始...
✅ [API Mock Generation] 完了

🎯 [Quality Check & Auto-Fix] 開始...
🔍 [Quality Check] Running lint and type check...
✅ [Quality Check & Auto-Fix] 完了

🎯 [Final Integration] 開始...
🏗️ [Integration] Creating main page...
✅ [Final Integration] 完了

🎉 ======================================
🎉 MATURA 生成完了レポート
🎉 ======================================
📊 成功率: 6/6 (100%)

🎉 対話式生成完了！
📱 次のコマンドでアプリを起動: npm run dev
🌐 ブラウザで http://localhost:3000 を開いてください
```

## 📁 生成されるファイル

### 🎨 UIコンポーネント
- `app/GeneratedUI.tsx` - メインUIコンポーネント
- `app/page.tsx` - ルートページ

### 🗄️ 状態管理
- `app/store.ts` - Zustandストア（必要な場合のみ）

### ⚡ イベントハンドラー
- `app/Handlers.tsx` - 各種イベントハンドラー

### 📡 API
- `app/api/[endpoint]/route.ts` - モックAPI（必要な場合のみ）

## 🛠️ 技術スタック

### 🎯 自動判定される技術要件

| 機能キーワード | API需要 | Store需要 |
|---|---|---|
| 決済、認証、連携 | ✅ | ✅ |
| 通知、レポート、集計 | ✅ | ✅ |
| カート、進捗、履歴 | ✅ | ✅ |
| 管理、検索、データ | ✅ | ✅ |
| 基本表示のみ | ❌ | ❌ |

### 🔧 生成されるコード仕様

#### UIコンポーネント
- **Theme: Modern** → グラデーション、アニメーション、鮮やかな色彩
- **Theme: Minimal** → シンプル、白基調、控えめな装飾
- **Theme: Professional** → ビジネス向け、ダークモード対応

#### 状態管理
- **Zustand** ベースの軽量ストア
- **永続化** (localStorage)
- **DevTools** 対応

#### API
- **Next.js API Routes** 形式
- **TypeScript** 完全対応
- **エラーハンドリング** 内蔵

## 🚨 エラー処理

### 🔧 自動修正機能

```bash
⚠️ ESLint found issues
🔧 Attempting auto-fix with Gemini API...
📄 Fix suggestions saved to: auto-fix-suggestions.md
✅ Auto-fix completed

⚠️ [UI Generation] 試行 1/3 失敗
🔄 [UI Generation] Retrying... (2/3)
✅ [UI Generation] 完了
```

### 📋 生成されるログファイル

- `auto-fix-suggestions.md` - 自動修正提案
- `[phase-name]-fix.md` - フェーズ別修正提案

## 🎯 使用例

### 💼 ビジネスアプリ
```bash
npm run generate:all
# → 予約・スケジュール管理 選択
# → Professional テーマ
# → Advanced 複雑度
```

### 🎨 個人プロジェクト
```bash
npm run generate:all
# → ブログ・コンテンツサイト 選択
# → Modern テーマ
# → Simple 複雑度
```

### 📊 データ管理
```bash
npm run generate:all
# → 家計簿・金融管理アプリ 選択
# → Minimal テーマ
# → Medium 複雑度
```


## 🎉 まとめ

**🚀 MATURA対話式生成システムの特徴:**

1. **✨ 直感的な対話フロー** - 7ステップでアプリ仕様を収集
2. **🎯 自動技術判定** - 機能に応じてAPI/Store要件を自動判定
3. **🔧 完全自動生成** - 対話完了後は無人でアプリ生成
4. **⚡ 即座起動** - 生成完了と同時にアプリ起動可能
5. **🛡️ エラー自動修正** - 失敗時の自動リトライ・修正機能

**🎯 シンプルな使用方法**

```bash
export GEMINI_API_KEY="your-key"
npm run generate:all
```

**これだけで完了！** 対話で全て収集 → 自動生成 → 動くアプリ完成！