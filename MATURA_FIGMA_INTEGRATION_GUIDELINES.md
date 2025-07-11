# MATURA × Figma連携指針

## 🎯 基本方針

MATURAは「ユーザーの思考を構造化して形にする」AI伴走プラットフォームです。
Figmaは、この思考プロセスを補強する **参考データソース** として位置づけます。

---

## 📋 思考フレームワーク × Figma要素マッピング

| 思考段階 | Figma要素 | 活用方法 | 表示方法 |
|---------|-----------|----------|----------|
| **Why** (目的) | Text(見出し) | ビジョン文の参考として | 思考カード上部に引用 |
| **Who** (対象) | Frame(グループ) | ペルソナ構造の分析 | サイドパネルで参考表示 |
| **What** (内容) | Frame階層 | 機能関係性の参考 | 構造ツリーと並列表示 |
| **How** (方法) | Frame配置 | フロー構造の参考 | プロセス図の横に配置 |
| **Impact** (効果) | 視覚要素 | 効果表現の参考 | 成果予測エリアで参考 |

---

## 🏗️ UX設計原則

### 1. 思考プロセス最優先
```
核心：Why → Who → What → How → Impact
補強：Figma参考要素（オプション）
```

### 2. 段階的情報開示
- **Level 1**: 基本思考フレーム（全員共通）
- **Level 2**: AI思考支援（希望者のみ）  
- **Level 3**: Figma参考要素（提供者のみ）

### 3. 混在対応設計
```typescript
// Figma使用者
<ThinkingCard>
  <BaseThinkingInput />     // 基本入力
  <FigmaReferencePanel />   // 参考要素
  <AIAssistButton />        // AI支援
</ThinkingCard>

// Figma非使用者  
<ThinkingCard>
  <BaseThinkingInput />     // 基本入力（同じ）
  <AIAssistButton />        // AI支援（同じ）
</ThinkingCard>
```

---

## 🔄 思考⇄構造⇄出口フローでのFigma位置づけ

```
[ユーザーの思考] 
    ↓
[構造化フレームワーク] ←─ [Figma参考データ]（補強）
    ↓
[Why/Who/What/How/Impact] ←─ [Figma要素分析]（参考）
    ↓
[出口選択: デザイン/コード/戦略]
```

### Figmaの役割
- **入力段階**: 思考の材料提供、構造化の参考
- **処理段階**: 一貫性チェック、関係性の可視化
- **出力段階**: 実装との橋渡し（デザイン出口選択時）

---

## ✅ 実装指針

### やるべきこと
1. **思考の材料提供**
   - 既存デザインから思考要素を抽出
   - Frame/Text構造の思考フレームへの振り分け

2. **構造化の参考**
   - デザイン階層を思考整理に活用
   - 視覚的関係性の参考として表示

3. **一貫性の担保**
   - 思考整理と実装の橋渡し
   - デザイン意図の構造化

### やりすぎない使い方
1. **自動生成に頼らない**
   - AIがデザインを作るのではなく、ユーザーの思考を支援
   - 生成ツールではなく、思考支援ツール

2. **メイン手段にしない**
   - Figmaはオプション、思考フレームが主軸
   - Figma無しでも完全に機能する設計

3. **複雑化しない**
   - シンプルな参考機能に留める
   - Frame/Text要素の基本解析のみ

---

## 🎯 最終的なFigmaの位置づけ

**MATURAにおけるFigma = 思考を豊かにする参考書**

- 📚 **参考資料**: ユーザーの既存デザインを思考材料として活用
- 🔗 **橋渡し役**: 思考と実装の一貫性を保つ
- 🎨 **補強ツール**: 思考フレームワークを視覚的に補強

**目指す体験**
```
ユーザー: "学園祭のサイトを作りたい（Figmaにラフがある）"
MATURA: "Figmaのラフを参考に、まず『なぜ作るのか』から整理しましょう"
→ 思考構造化プロセス（Figma要素は参考として表示）
→ 構造化された思考 + 実装可能な形
```

---

## 📈 将来拡張の方向性

### Phase 2: 深度解析
- ネストした要素の再帰解析
- コンポーネント/バリアント対応
- インタラクション情報の活用

### Phase 3: AI思考統合
- 自然言語での思考支援強化
- デザイン意図の自動抽出
- 思考パターンの学習と提案

### Ultimate Vision
```
"地域と学生をつなぐ場を作りたい"
    ↓ (AI思考支援)
構造化された思考フレーム
    ↓ (Figmaとの連携)
一貫性のある実装計画
    ↓ (統合システム)
思考が形になった成果物
```

---

## 💡 実装チェックリスト

- [x] Figma要素の思考フレーム振り分け
- [x] 最低限連携サンプル（参考表示のみ）
- [x] 混在UX対応（Figma有無による体験差を最小化）
- [x] 思考プロセス優先設計
- [ ] AI思考支援との統合
- [ ] 出口（デザイン/コード/戦略）への橋渡し
- [ ] コラボレーション機能

**結論**: MATURAはFigmaを「思考を豊かにする参考書」として活用し、
核となる思考構造化プロセスを決して損なわないよう注意深く統合する。