// Configuration file for MATURA MVP
// This file centralizes all environment variables and configuration settings

/**
 * Environment configuration
 */
export const env = {
  // Node environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  // Application URLs
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',

  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',

  // Rate limiting
  RATE_LIMIT_REQUESTS: parseInt(process.env.RATE_LIMIT_REQUESTS || '100', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes

  // OpenAI specific settings
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4',
  OPENAI_MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  OPENAI_TEMPERATURE: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
} as const

/**
 * Application configuration
 */
export const config = {
  // App metadata
  app: {
    name: 'MATURA MVP',
    description: 'AI-powered app development platform',
    version: '1.0.0',
  },

  // API configuration
  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },

  // Chat configuration
  chat: {
    maxMessages: 100,
    maxMessageLength: 2000,
    typingDelay: 50, // milliseconds
  },

  // Phase configuration
  phases: {
    totalPhases: 6,
    phaseNames: [
      'Free Talk',
      'Insight Refine',
      'Sketch View',
      'UX Build',
      'Code Playground',
      'Release Board'
    ] as const,
  },

  // Storage configuration
  storage: {
    localStoragePrefix: 'matura_',
    sessionStoragePrefix: 'matura_session_',
    maxHistoryItems: 50,
  },

  // UI configuration
  ui: {
    animationDuration: 300, // milliseconds
    toastDuration: 5000, // 5 seconds
    modalBackdropOpacity: 0.5,
  },

  // Validation configuration
  validation: {
    minPasswordLength: 8,
    maxUsernameLength: 50,
    maxProjectNameLength: 100,
  },

  // Error handling
  errors: {
    showStackTrace: env.isDevelopment,
    logToConsole: env.isDevelopment,
    reportToService: env.isProduction && env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
  },

  // Feature toggles
  features: {
    enableChat: true,
    enableCodeGeneration: true,
    enableDeployment: true,
    enableAnalytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    enableBetaFeatures: env.isDevelopment,
  },
} as const

/**
 * Type-safe configuration getter
 */
export function getConfig<T extends keyof typeof config>(key: T): typeof config[T] {
  return config[key]
}

/**
 * Type-safe environment variable getter with validation
 */
export function getEnv<T extends keyof typeof env>(key: T): typeof env[T] {
  const value = env[key]
  
  // Validate required environment variables
  if (key === 'OPENAI_API_KEY' && !value) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  
  return value
}

/**
 * Validate all required environment variables at startup
 */
export function validateEnv(): void {
  const requiredEnvVars = ['OPENAI_API_KEY'] as const
  const missing: string[] = []

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file.'
    )
  }
}

// Export types for use in other files
export type Config = typeof config
export type Env = typeof env
export type PhaseNames = typeof config.phases.phaseNames[number]