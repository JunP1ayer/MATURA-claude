import { z } from 'zod'

// Common validation schemas
export const taskSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: '優先度を選択してください'
  }),
  dueDate: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
})

export const expenseSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  amount: z.number().positive('金額は正の数値を入力してください'),
  category: z.string().min(1, 'カテゴリを選択してください'),
  date: z.string().min(1, '日付を選択してください'),
  type: z.enum(['income', 'expense'], {
    required_error: '収入・支出を選択してください'
  }),
  tags: z.array(z.string()).optional()
})

export const recipeSchema = z.object({
  title: z.string().min(1, 'レシピ名は必須です').max(100, 'レシピ名は100文字以内で入力してください'),
  description: z.string().optional(),
  ingredients: z.array(z.string().min(1, '材料を入力してください')).min(1, '材料は最低1つ入力してください'),
  instructions: z.array(z.string()).optional(),
  cookingTime: z.string().min(1, '調理時間を入力してください'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    required_error: '難易度を選択してください'
  }),
  servings: z.number().positive().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
})

export const workoutSchema = z.object({
  title: z.string().min(1, 'ワークアウト名は必須です').max(100, 'ワークアウト名は100文字以内で入力してください'),
  description: z.string().optional(),
  duration: z.string().min(1, '時間を入力してください'),
  calories: z.number().positive().optional(),
  exercises: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    required_error: '難易度を選択してください'
  }),
  category: z.string().optional(),
  notes: z.string().optional()
})

export const noteSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  content: z.string().min(1, '内容は必須です').max(10000, '内容は10000文字以内で入力してください'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  pinned: z.boolean().optional()
})

// Form validation hook
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const validate = (data: unknown): { success: boolean; data?: T; errors?: Record<string, string> } => {
    try {
      const validData = schema.parse(data)
      return { success: true, data: validData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          errors[path] = err.message
        })
        return { success: false, errors }
      }
      return { success: false, errors: { general: '予期しないエラーが発生しました' } }
    }
  }

  return { validate }
}

// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 400
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown): {
  message: string
  code: string
  statusCode: number
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    }
  }

  if (error instanceof z.ZodError) {
    return {
      message: 'バリデーションエラーが発生しました',
      code: 'VALIDATION_ERROR',
      statusCode: 400
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      statusCode: 500
    }
  }

  return {
    message: '予期しないエラーが発生しました',
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potentially harmful characters
    .slice(0, 1000) // Limit length
}

export function sanitizeArray(input: string[]): string[] {
  return input
    .map(sanitizeInput)
    .filter(Boolean) // Remove empty strings
    .slice(0, 50) // Limit array size
}

// Async operation wrapper with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage = '操作に失敗しました'
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    console.error(errorMessage, error)
    const handled = handleError(error)
    return { 
      success: false, 
      error: handled.message 
    }
  }
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()

  isAllowed(
    identifier: string, 
    maxAttempts = 5, 
    windowMs = 60000
  ): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs)
    
    if (validAttempts.length >= maxAttempts) {
      return false
    }
    
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)
    return true
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

// Data export/import validation
export const exportDataSchema = z.object({
  tasks: z.array(taskSchema).optional(),
  expenses: z.array(expenseSchema).optional(),
  recipes: z.array(recipeSchema).optional(),
  workouts: z.array(workoutSchema).optional(),
  notes: z.array(noteSchema).optional(),
  exportDate: z.string(),
  version: z.string().optional()
})

export type ExportData = z.infer<typeof exportDataSchema>