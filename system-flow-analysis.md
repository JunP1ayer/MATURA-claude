# 🔄 MATURAシステムフロー完全分析

## 現在のフロー（hybrid-ai-orchestrator.ts）

### Phase 1: Gemini Creative Enhancement（並列実行）
```
[Gemini API] ← userIdea → enhanceIdeaWithGemini()
├─ 機能抽出（extractFeaturesDirectly）
├─ カテゴリ分類を完全廃止（category: null）
├─ keyFeatures, specificComponents, dataStructure を抽出
└─ フォールバック機能付き

[Gemini API] ← userIdea → generateDesignInspirationWithGemini()
├─ デザインインスピレーション生成
├─ カラーパレット、タイポグラフィ、コンポーネント提案
└─ JSON解析（複数パターン）
```

### Phase 2: Figma Design System Integration
```
[Figma API] → integrateWithFigma()
├─ Figmaファイルからデザイントークン抽出
├─ カラー、タイポグラフィ、スペーシング抽出
├─ コンポーネント情報取得
└─ フォールバック対応
```

### Phase 3: OpenAI Structured Generation（並列実行）
```
[OpenAI GPT-4] → generateSchemaWithOpenAI()
├─ Function Calling でスキーマ生成
├─ 機能ベースのプロンプト使用
└─ フォールバック対応

[OpenAI GPT-4] → generateCodeWithOpenAI()
├─ Function Calling でReactコンポーネント生成
├─ Figmaデザイントークン統合
├─ **⚠️ JSON解析エラー発生箇所**
└─ テキスト生成フォールバック
```

### Phase 4: Quality Enhancement & Integration
```
enhanceAndIntegrate()
├─ 生成結果の統合
├─ 品質スコア計算
├─ レスポンス形式統一
└─ 最終結果返却
```

## 🚨 問題箇所の特定

### 1. JSON解析エラー（OpenAI Function Calling）
- 位置: `lib/openai-optimized-system.ts:130`
- 原因: OpenAI Function Callingの応答に不正な文字が含まれる
- 症状: `Unexpected token p in JSON at position 1726`

### 2. フォールバック依存
- 現在はJSON解析エラー時にテキスト生成にフォールバック
- 本来のFunction Callingが機能していない