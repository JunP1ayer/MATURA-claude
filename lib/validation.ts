// Validation schemas using Zod for MATURA MVP
import { z } from 'zod'

/**
 * Common validation patterns
 */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  username: /^[a-zA-Z0-9_-]{3,30}$/,
} as const

/**
 * Message schemas
 */
export const messageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(2000),
  timestamp: z.date(),
  phase: z.string().optional(),
})

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(2000, 'Message must be less than 2000 characters'),
  phase: z.number().min(0).max(5).optional(),
})

/**
 * Insight schemas
 */
export const insightSchema = z.object({
  vision: z.string().min(10).max(500),
  target: z.string().min(5).max(200),
  features: z.array(z.string().min(1).max(100)).min(1).max(10),
  value: z.string().min(10).max(300),
  motivation: z.string().min(10).max(500),
})

/**
 * UI Design schemas
 */
export const uiDesignSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  style: z.enum(['minimal', 'colorful', 'dark', 'natural', 'professional', 'playful']),
  preview: z.string().url(),
  description: z.string().min(10).max(500),
  color_scheme: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(1).max(6),
})

/**
 * UX Design schemas
 */
export const uxDesignSchema = z.object({
  layout: z.string().min(10).max(1000),
  colorScheme: z.string().min(10).max(500),
  typography: z.string().min(10).max(500),
  navigation: z.string().min(10).max(500),
  components: z.array(z.string().min(1).max(100)).min(1).max(20),
  interactions: z.array(z.string().min(1).max(200)).min(0).max(15),
})

/**
 * Generated Code schemas
 */
export const generatedCodeSchema = z.object({
  html: z.string().min(1).max(50000),
  css: z.string().min(1).max(30000),
  javascript: z.string().min(0).max(30000),
  framework: z.string().min(1).max(50),
  dependencies: z.array(z.string()).default([]),
})

/**
 * Release Info schemas
 */
export const releaseInfoSchema = z.object({
  url: z.string().url(),
  timestamp: z.string().datetime(),
  platform: z.string().min(1).max(50),
  features: z.array(z.string().min(1).max(200)).min(1),
  monetization: z.object({
    type: z.enum(['ads', 'subscription', 'freemium']),
    revenue_model: z.string().min(10).max(500),
  }).optional(),
})

/**
 * API Request/Response schemas
 */
export const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  phase: z.number().min(0).max(5),
  context: z.any().optional(),
})

export const chatResponseSchema = z.object({
  message: z.string(),
  phase_data: z.any().optional(),
  error: z.string().optional(),
})

/**
 * User input schemas
 */
export const projectNameSchema = z
  .string()
  .min(3, 'Project name must be at least 3 characters')
  .max(100, 'Project name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s-_]+$/, 'Project name can only contain letters, numbers, spaces, hyphens, and underscores')

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(patterns.username, 'Username can only contain letters, numbers, hyphens, and underscores')

/**
 * Form schemas
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signupFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const projectFormSchema = z.object({
  name: projectNameSchema,
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isPublic: z.boolean().default(false),
})

/**
 * Helper functions for validation
 */
export function validateMessage(message: unknown): z.infer<typeof messageSchema> {
  return messageSchema.parse(message)
}

export function validateChatRequest(data: unknown): z.infer<typeof chatRequestSchema> {
  return chatRequestSchema.parse(data)
}

export function validateInsight(data: unknown): z.infer<typeof insightSchema> {
  return insightSchema.parse(data)
}

export function validateUIDesign(data: unknown): z.infer<typeof uiDesignSchema> {
  return uiDesignSchema.parse(data)
}

export function validateUXDesign(data: unknown): z.infer<typeof uxDesignSchema> {
  return uxDesignSchema.parse(data)
}

export function validateGeneratedCode(data: unknown): z.infer<typeof generatedCodeSchema> {
  return generatedCodeSchema.parse(data)
}

export function validateReleaseInfo(data: unknown): z.infer<typeof releaseInfoSchema> {
  return releaseInfoSchema.parse(data)
}

/**
 * Safe validation functions that return result objects
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  error.errors.forEach((err) => {
    if (err.path.length > 0) {
      const path = err.path.join('.')
      errors[path] = err.message
    }
  })
  return errors
}

/**
 * MATURA構造データ統合スキーマ
 */
export const structureDataSchema = z.object({
  why: z.string().min(10, 'Why is too short (minimum 10 characters)').max(500, 'Why is too long'),
  who: z.string().min(5, 'Who is too short (minimum 5 characters)').max(200, 'Who is too long'),
  what: z.array(z.string().min(1).max(100)).min(3, 'What needs at least 3 items').max(10, 'What has too many items'),
  how: z.string().min(10, 'How is too short (minimum 10 characters)').max(500, 'How is too long'),
  impact: z.string().min(10, 'Impact is too short (minimum 10 characters)').max(300, 'Impact is too long'),
})

export const maturaQualityCheckSchema = z.object({
  structureData: structureDataSchema,
  qualityScore: z.number().min(0).max(100),
  completeness: z.number().min(0).max(100),
  consistency: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  issues: z.array(z.object({
    field: z.string(),
    type: z.enum(['warning', 'error', 'suggestion']),
    message: z.string(),
    severity: z.number().min(1).max(5)
  })),
  recommendations: z.array(z.string()),
  readyForGeneration: z.boolean()
})

/**
 * 構造データの品質チェック機能
 */
export interface QualityCheckResult {
  isValid: boolean
  qualityScore: number
  completeness: number
  consistency: number
  clarity: number
  issues: Array<{
    field: string
    type: 'warning' | 'error' | 'suggestion'
    message: string
    severity: number
  }>
  recommendations: string[]
  readyForGeneration: boolean
}

export function checkStructureQuality(structureData: any): QualityCheckResult {
  const issues: QualityCheckResult['issues'] = []
  const recommendations: string[] = []
  
  // 基本バリデーション
  const structureValidation = safeValidate(structureDataSchema, structureData)
  if (!structureValidation.success) {
    if ('error' in structureValidation) {
      structureValidation.error.errors.forEach(err => {
        issues.push({
          field: err.path.join('.'),
          type: 'error',
          message: err.message,
          severity: 5
        })
      })
    }
  }
  
  const data = structureValidation.success ? structureValidation.data : structureData
  
  // 詳細品質チェック
  let qualityScore = 100
  let completeness = 100
  let consistency = 100
  let clarity = 100
  
  // Why の質チェック
  if (data.why) {
    if (data.why.length < 30) {
      issues.push({
        field: 'why',
        type: 'warning',
        message: 'Why section could be more detailed for better code generation',
        severity: 2
      })
      qualityScore -= 10
    }
    if (!data.why.includes('ため') && !data.why.includes('ので') && !data.why.includes('から')) {
      issues.push({
        field: 'why',
        type: 'suggestion',
        message: 'Consider adding reasoning words (ため, ので, から) to clarify purpose',
        severity: 1
      })
      clarity -= 5
    }
  }
  
  // Who の質チェック
  if (data.who) {
    if (!data.who.includes('、') && data.who.length < 20) {
      issues.push({
        field: 'who',
        type: 'suggestion',
        message: 'Consider specifying multiple target user groups',
        severity: 1
      })
      completeness -= 10
    }
  }
  
  // What の質チェック
  if (data.what && Array.isArray(data.what)) {
    if (data.what.length < 3) {
      issues.push({
        field: 'what',
        type: 'error',
        message: 'At least 3 features are required for proper code generation',
        severity: 4
      })
      qualityScore -= 20
    }
    
    const duplicates = data.what.filter((item: string, index: number) => 
      data.what.indexOf(item) !== index
    )
    if (duplicates.length > 0) {
      issues.push({
        field: 'what',
        type: 'warning',
        message: 'Duplicate features detected: ' + duplicates.join(', '),
        severity: 2
      })
      consistency -= 15
    }
  }
  
  // How の質チェック
  if (data.how) {
    if (data.how.length < 30) {
      issues.push({
        field: 'how',
        type: 'warning',
        message: 'How section needs more implementation details',
        severity: 3
      })
      qualityScore -= 15
    }
    
    const techKeywords = ['React', 'Next.js', 'API', 'データベース', 'UI', 'UX', 'レスポンシブ']
    const hasTechKeywords = techKeywords.some(keyword => data.how.includes(keyword))
    if (!hasTechKeywords) {
      recommendations.push('Consider adding technical implementation details (React, Next.js, API, etc.)')
    }
  }
  
  // Impact の質チェック
  if (data.impact) {
    const hasMetrics = /\d+/.test(data.impact)
    if (!hasMetrics) {
      issues.push({
        field: 'impact',
        type: 'suggestion',
        message: 'Consider adding specific metrics or numbers to quantify impact',
        severity: 1
      })
      clarity -= 10
    }
  }
  
  // 一貫性チェック
  if (data.why && data.impact) {
    const whyWords = data.why.toLowerCase().split(' ')
    const impactWords = data.impact.toLowerCase().split(' ')
    const commonWords = whyWords.filter(word => impactWords.includes(word))
    
    if (commonWords.length < 2) {
      issues.push({
        field: 'consistency',
        type: 'warning',
        message: 'Why and Impact sections should be more aligned',
        severity: 2
      })
      consistency -= 10
    }
  }
  
  // 推奨事項生成
  if (qualityScore < 70) {
    recommendations.push('Consider expanding all sections with more specific details')
  }
  if (completeness < 80) {
    recommendations.push('Add more comprehensive information in sparse sections')
  }
  if (consistency < 80) {
    recommendations.push('Review sections for consistency and alignment')
  }
  
  const readyForGeneration = qualityScore >= 60 && issues.filter(i => i.type === 'error').length === 0
  
  return {
    isValid: structureValidation.success,
    qualityScore: Math.max(0, qualityScore),
    completeness: Math.max(0, completeness),
    consistency: Math.max(0, consistency),
    clarity: Math.max(0, clarity),
    issues,
    recommendations,
    readyForGeneration
  }
}

/**
 * プロンプト最適化のための構造データ強化
 */
export function enhanceStructureForPrompt(structureData: any): {
  enhanced: any
  modifications: string[]
} {
  const enhanced = { ...structureData }
  const modifications: string[] = []
  
  // Why を強化
  if (enhanced.why && enhanced.why.length < 50) {
    enhanced.why += ' これにより、ユーザーの課題解決と価値提供を実現する。'
    modifications.push('Enhanced Why section with value proposition')
  }
  
  // What を強化
  if (enhanced.what && Array.isArray(enhanced.what)) {
    if (enhanced.what.length < 5) {
      enhanced.what.push('レスポンシブデザイン', 'ユーザビリティ最適化')
      modifications.push('Added standard web features')
    }
  }
  
  // How を強化
  if (enhanced.how && !enhanced.how.includes('Next.js')) {
    enhanced.how += ' Next.js、TypeScript、Tailwind CSSを使用したモダンな実装を行う。'
    modifications.push('Added modern tech stack specification')
  }
  
  // Impact に具体性を追加
  if (enhanced.impact && !/\d+/.test(enhanced.impact)) {
    enhanced.impact += ' 利用率30%向上を目指す。'
    modifications.push('Added quantitative impact metrics')
  }
  
  return { enhanced, modifications }
}

// Export types
export type Message = z.infer<typeof messageSchema>
export type ChatRequest = z.infer<typeof chatRequestSchema>
export type ChatResponse = z.infer<typeof chatResponseSchema>
export type Insight = z.infer<typeof insightSchema>
export type UIDesign = z.infer<typeof uiDesignSchema>
export type UXDesign = z.infer<typeof uxDesignSchema>
export type GeneratedCode = z.infer<typeof generatedCodeSchema>
export type ReleaseInfo = z.infer<typeof releaseInfoSchema>
export type LoginForm = z.infer<typeof loginFormSchema>
export type SignupForm = z.infer<typeof signupFormSchema>
export type ProjectForm = z.infer<typeof projectFormSchema>
export type StructureData = z.infer<typeof structureDataSchema>
export type MaturaQualityCheck = z.infer<typeof maturaQualityCheckSchema>