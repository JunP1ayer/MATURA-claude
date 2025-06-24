// トップページデザイン案生成のプロンプトテンプレート

export const generateDesignPrompt = (userIdea: string) => {
  return `
ユーザーのアプリアイデア：
${userIdea}

上記のアイデアを分析し、以下の構造化した製品情報に基づいてトップページのデザイン案を5つ生成してください：

1. Why（なぜ）: このプロダクトが必要な理由・課題
2. Who（誰が）: ターゲットユーザー・ペルソナ
3. What（何を）: 提供する価値・ソリューション
4. How（どうやって）: 実現方法・アプローチ
5. Impact（影響）: 期待される効果・変化

以下のJSON形式で5つの案を出力してください：

{
  "designs": [
    {
      "id": "design-1",
      "heading": "魅力的なメイン見出し（20-30文字）",
      "subDescription": "価値提案を簡潔に説明するサブ説明（50-80文字）",
      "styleName": "デザインスタイル名（例：モダンヒーロー型）",
      "colorScheme": {
        "primary": "#メインカラーコード",
        "secondary": "#サブカラーコード",
        "background": "#背景色コード"
      },
      "tags": ["タグ1", "タグ2", "タグ3"],
      "targetAudience": "想定ユーザー層の詳細",
      "uniqueValue": "このデザインの独自価値提案",
      "productAnalysis": {
        "why": "このプロダクトが必要な理由",
        "who": "ターゲットユーザーの詳細",
        "what": "提供する価値・ソリューション",
        "how": "実現方法・アプローチ",
        "impact": "期待される効果・変化"
      }
    }
  ]
}

重要な指針：
1. 各デザインは明確に異なるターゲットやアプローチを取る
2. 見出しとサブ説明は具体的で魅力的に
3. カラースキームは心理的効果を考慮
4. タグは検索性と分類に役立つものを選択
5. 構造化製品情報（Why/Who/What/How/Impact）を必ず含める

必ず有効なJSONフォーマットで出力してください。
`
}

// デザイン案の型定義
export interface DesignProposal {
  id: string
  heading: string // 見出し
  subDescription: string // サブ説明
  styleName: string // スタイル名
  colorScheme: {
    primary: string // メインカラー
    secondary: string // サブカラー
    background: string // 背景色
  }
  tags: string[] // タグ
  targetAudience: string // 想定ユーザー層
  uniqueValue: string // 独自価値提案
  productAnalysis: {
    why: string // なぜこのプロダクトが必要か
    who: string // 誰がターゲットか
    what: string // 何を提供するか
    how: string // どうやって実現するか
    impact: string // どんな影響を与えるか
  }
}

export interface DesignGeneratorResponse {
  designs: DesignProposal[]
}

// サンプルデザインを生成する関数（開発用フォールバック）
export function generateSampleDesigns(userIdea: string): DesignProposal[] {
  const baseColors = [
    { primary: '#3b82f6', secondary: '#8b5cf6', background: '#ffffff' },
    { primary: '#10b981', secondary: '#14b8a6', background: '#f0fdf4' },
    { primary: '#dc2626', secondary: '#991b1b', background: '#fef2f2' },
    { primary: '#6366f1', secondary: '#a78bfa', background: '#f8fafc' },
    { primary: '#f59e0b', secondary: '#d97706', background: '#fffbeb' }
  ]

  const styleNames = [
    'モダンヒーロー型',
    'エレガント分割型',
    'プロフェッショナル型',
    'ミニマル集中型',
    'エネルギッシュ型'
  ]

  const tagSets = [
    ['モダン', 'インパクト', 'ビジュアル重視'],
    ['エレガント', 'バランス', '高級感'],
    ['プロフェッショナル', '信頼性', 'ビジネス'],
    ['ミニマル', 'シンプル', '集中'],
    ['エネルギッシュ', '活動的', '革新的']
  ]

  return Array.from({ length: 5 }, (_, index) => {
    const colors = baseColors[index]
    
    return {
      id: `design-${index + 1}`,
      heading: `${userIdea}で新しい価値を創造`,
      subDescription: `革新的なソリューションで、あなたのビジネスを次のレベルへ導きます`,
      styleName: styleNames[index],
      colorScheme: colors,
      tags: tagSets[index],
      targetAudience: '効率性と革新性を求めるビジネスパーソン',
      uniqueValue: `${styleNames[index]}による独自のユーザー体験を提供`,
      productAnalysis: {
        why: `現在の市場には${userIdea}に関する効率的なソリューションが不足している`,
        who: '時間効率と品質を重視するプロフェッショナル層',
        what: `${userIdea}を通じて、ユーザーの課題を根本的に解決する価値`,
        how: '直感的なインターフェースと高度な機能の組み合わせ',
        impact: 'ユーザーの生産性向上と満足度の大幅な改善'
      }
    }
  })
}