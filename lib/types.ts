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
  // Advanced generation fields
  generationTime?: number
  hasRealFunctionality?: boolean
  includedFeatures?: string[]
  estimatedLines?: number
  qualityScore?: number
  featureCompleteness?: number
  testResults?: any
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

// 統合されたUX設計型定義
export interface UnifiedUXDesign {
  // アイデアベース情報
  concept: {
    vision: string
    target: string  
    features: string[]
    value: string
    motivation: string
  }
  
  // UIスタイル情報
  designStyle: {
    name: string
    category: string
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
    personality: string[]
    spacing: 'tight' | 'comfortable' | 'spacious'
  }
  
  // 生成されたUX構造
  structure: {
    siteArchitecture: {
      topPage: { purpose: string; elements: string[] }
      mainFeatures: Array<{
        name: string
        description: string
        uiElements: string[]
        userInteractions: string[]
      }>
      userFlow: string[]
    }
    designSystem: {
      layout: string
      colorUsage: {
        primary: string
        secondary: string
        accent: string
        usage: string
      }
      typography: {
        heading: string
        body: string
        accent: string
      }
      spacing: string
      interactions: string[]
    }
    functionalComponents: Array<{
      name: string
      purpose: string
      props: Record<string, any>
      events: string[]
      state: Record<string, any>
    }>
  }
  
  // 実装ガイド
  implementation: {
    recommendedFramework: string
    keyLibraries: string[]
    fileStructure: string[]
    dataFlow: string
    apiRequirements: string[]
  }
}

// 動的UI生成の型定義
export interface DynamicUIGeneration {
  baseInsight: Insight
  generatedStyles: Array<{
    id: string
    name: string
    description: string
    reasoning: string
    colors: UIStyle['colors']
    typography: UIStyle['typography']
    personality: string[]
    suitabilityScore: number
  }>
  selectedStyle: UIStyle
  customizations: Record<string, any>
}

export interface MaturaState {
  currentPhase: number
  conversations: Message[]
  insights: Insight | null
  selectedUI: UIDesign | null
  selectedUIStyle: UIStyle | null
  selectedTopPageDesign: TopPageDesign | null
  uxDesign: UXDesign | null
  unifiedUXDesign: UnifiedUXDesign | null  // 新しい統合UX設計
  dynamicUIGeneration: DynamicUIGeneration | null  // 動的UI生成
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

// App generation types
export interface AppRequirement {
  appType: string
  description: string
  features: string[]
  theme: string
  complexity: string
  apiNeeds: boolean
  storeNeeds: boolean
  category: string
  targetUser: string
  primaryColor: string
  dataStructure: {
    mainEntity: string
    fields: string[]
  }
}

export interface FigmaDesignSystem {
  colors: string[]
  fonts: string[]
  components: Array<{
    id: string
    name: string
    type: string
  }>
}

export interface GeneratedAppResult {
  mainPage: string
  written: boolean
  path: string
  validated: boolean
  generationMethod: string
  timestamp: string
  appType: string
  features: string[]
  figmaIntegrated: boolean
  figmaData?: {
    name: string
    colorsUsed: string[]
    fontsUsed: string[]
    componentsUsed: number
  } | null
}