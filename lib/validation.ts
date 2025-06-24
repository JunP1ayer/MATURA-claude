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