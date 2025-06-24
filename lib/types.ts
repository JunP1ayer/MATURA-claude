// MATURA Type Definitions
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  phase?: string
}

export interface Insight {
  vision: string
  target: string
  features: string[]
  value: string
  motivation: string
}

export interface UIDesign {
  id: string
  name: string
  style: 'minimal' | 'colorful' | 'dark' | 'natural' | 'professional' | 'playful'
  preview: string
  description: string
  color_scheme: string[]
}

// 新しい高品質UIスタイル定義
export interface UIStyle {
  id: string
  name: string
  description: string
  category: 'modern' | 'minimal' | 'luxury' | 'creative' | 'professional'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  typography: {
    heading: string
    body: string
  }
  spacing: 'tight' | 'comfortable' | 'spacious'
  personality: string[]
  svgPreview?: string
}

// トップページデザイン案の型定義（新しい構造）
export interface TopPageDesign {
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

export interface UXDesign {
  layout: string
  colorScheme: string
  typography: string
  navigation: string
  components: string[]
  interactions: string[]
}

export interface GeneratedCode {
  html: string
  css: string
  javascript: string
  framework: string
  dependencies: string[]
  // 新しいフィールド
  fullHtml?: string
  title?: string
  description?: string
  isComplete?: boolean
}

export interface ReleaseInfo {
  url: string
  timestamp: string
  platform: string
  features: string[]
  monetization?: {
    type: 'ads' | 'subscription' | 'freemium'
    revenue_model: string
  }
}

export interface ExtractedStructure {
  vision: string
  target: string
  features: string[]
  uiStyle: 'modern' | 'classic' | 'playful' | 'minimal'
  keywords: string[]
}

export interface MaturaState {
  currentPhase: number
  conversations: Message[]
  insights: Insight | null
  selectedUI: UIDesign | null
  selectedUIStyle: UIStyle | null
  selectedTopPageDesign: TopPageDesign | null
  uxDesign: UXDesign | null
  generatedCode: GeneratedCode | null
  releaseInfo: ReleaseInfo | null
  isLoading: boolean
  error: string | null
  // 新しいフィールド
  messageCount: number
  structureExtracted: boolean
  extractedStructure: ExtractedStructure | null
}

export interface PhaseConfig {
  id: number
  name: string
  title: string
  description: string
  icon: string
  completed: boolean
}

export interface ChatResponse {
  message: string
  phase_data?: any
  error?: string
}

export interface HistoryItem {
  id: string
  timestamp: string
  phase: string
  data: any
  conversations: Message[]
}