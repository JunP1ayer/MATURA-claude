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

export interface MaturaState {
  currentPhase: number
  conversations: Message[]
  insights: Insight | null
  selectedUI: UIDesign | null
  uxDesign: UXDesign | null
  generatedCode: GeneratedCode | null
  releaseInfo: ReleaseInfo | null
  isLoading: boolean
  error: string | null
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