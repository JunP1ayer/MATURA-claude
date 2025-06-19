// Constants file for MATURA MVP
// This file contains all centralized constant values used throughout the application

/**
 * Phase-related constants
 */
export const PHASES = {
  FREE_TALK: 0,
  INSIGHT_REFINE: 1,
  SKETCH_VIEW: 2,
  UX_BUILD: 3,
  CODE_PLAYGROUND: 4,
  RELEASE_BOARD: 5,
} as const

export const PHASE_NAMES = {
  [PHASES.FREE_TALK]: 'Free Talk',
  [PHASES.INSIGHT_REFINE]: 'Insight Refine',
  [PHASES.SKETCH_VIEW]: 'Sketch View',
  [PHASES.UX_BUILD]: 'UX Build',
  [PHASES.CODE_PLAYGROUND]: 'Code Playground',
  [PHASES.RELEASE_BOARD]: 'Release Board',
} as const

export const PHASE_DESCRIPTIONS = {
  [PHASES.FREE_TALK]: 'Share your app idea freely',
  [PHASES.INSIGHT_REFINE]: 'Refine and structure your vision',
  [PHASES.SKETCH_VIEW]: 'Choose your UI style',
  [PHASES.UX_BUILD]: 'Design the user experience',
  [PHASES.CODE_PLAYGROUND]: 'Generate and customize code',
  [PHASES.RELEASE_BOARD]: 'Launch your app',
} as const

export const PHASE_ICONS = {
  [PHASES.FREE_TALK]: '💬',
  [PHASES.INSIGHT_REFINE]: '💡',
  [PHASES.SKETCH_VIEW]: '🎨',
  [PHASES.UX_BUILD]: '🏗️',
  [PHASES.CODE_PLAYGROUND]: '⚡',
  [PHASES.RELEASE_BOARD]: '🚀',
} as const

/**
 * UI Style constants
 */
export const UI_STYLES = {
  MINIMAL: 'minimal',
  COLORFUL: 'colorful',
  DARK: 'dark',
  NATURAL: 'natural',
  PROFESSIONAL: 'professional',
  PLAYFUL: 'playful',
} as const

export const UI_STYLE_LABELS = {
  [UI_STYLES.MINIMAL]: 'Minimal',
  [UI_STYLES.COLORFUL]: 'Colorful',
  [UI_STYLES.DARK]: 'Dark',
  [UI_STYLES.NATURAL]: 'Natural',
  [UI_STYLES.PROFESSIONAL]: 'Professional',
  [UI_STYLES.PLAYFUL]: 'Playful',
} as const

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  GENERATE_CODE: '/api/generate-code',
  DEPLOY: '/api/deploy',
  SAVE_PROJECT: '/api/save-project',
  LOAD_PROJECT: '/api/load-project',
} as const

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  CURRENT_STATE: 'matura_current_state',
  HISTORY: 'matura_history',
  USER_PREFERENCES: 'matura_user_preferences',
  DRAFT_PROJECT: 'matura_draft_project',
  THEME: 'matura_theme',
} as const

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
} as const

/**
 * Message role constants
 */
export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const

/**
 * Monetization types
 */
export const MONETIZATION_TYPES = {
  ADS: 'ads',
  SUBSCRIPTION: 'subscription',
  FREEMIUM: 'freemium',
} as const

export const MONETIZATION_LABELS = {
  [MONETIZATION_TYPES.ADS]: 'Advertisement Based',
  [MONETIZATION_TYPES.SUBSCRIPTION]: 'Subscription Model',
  [MONETIZATION_TYPES.FREEMIUM]: 'Freemium Model',
} as const

/**
 * Platform constants
 */
export const PLATFORMS = {
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
  DESKTOP: 'desktop',
} as const

export const PLATFORM_LABELS = {
  [PLATFORMS.WEB]: 'Web Application',
  [PLATFORMS.IOS]: 'iOS App',
  [PLATFORMS.ANDROID]: 'Android App',
  [PLATFORMS.DESKTOP]: 'Desktop Application',
} as const

/**
 * Framework constants
 */
export const FRAMEWORKS = {
  REACT: 'react',
  NEXTJS: 'nextjs',
  VUE: 'vue',
  ANGULAR: 'angular',
  VANILLA: 'vanilla',
} as const

export const FRAMEWORK_LABELS = {
  [FRAMEWORKS.REACT]: 'React',
  [FRAMEWORKS.NEXTJS]: 'Next.js',
  [FRAMEWORKS.VUE]: 'Vue.js',
  [FRAMEWORKS.ANGULAR]: 'Angular',
  [FRAMEWORKS.VANILLA]: 'Vanilla JavaScript',
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  RATE_LIMIT: 'Too many requests. Please slow down.',
  SERVER_ERROR: 'Server error. Please try again later.',
  OPENAI_ERROR: 'AI service is temporarily unavailable. Please try again.',
  STORAGE_FULL: 'Local storage is full. Please clear some space.',
  INVALID_PHASE: 'Invalid phase transition.',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  PROJECT_SAVED: 'Project saved successfully!',
  CODE_GENERATED: 'Code generated successfully!',
  DEPLOYED: 'App deployed successfully!',
  COPIED: 'Copied to clipboard!',
  PHASE_COMPLETED: 'Phase completed successfully!',
} as const

/**
 * Limits and constraints
 */
export const LIMITS = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_MESSAGES_PER_PHASE: 50,
  MAX_FEATURES: 10,
  MAX_COMPONENTS: 20,
  MAX_HISTORY_ITEMS: 50,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_CODE_LENGTH: 50000,
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 30,
  MAX_PROJECT_NAME_LENGTH: 100,
} as const

/**
 * Default values
 */
export const DEFAULTS = {
  THEME: 'light',
  LANGUAGE: 'en',
  FRAMEWORK: FRAMEWORKS.REACT,
  UI_STYLE: UI_STYLES.MINIMAL,
  PLATFORM: PLATFORMS.WEB,
  ANIMATION_ENABLED: true,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
} as const

/**
 * Regular expressions for validation
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  HEX_COLOR: /^#[0-9A-Fa-f]{6}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  PROJECT_NAME: /^[a-zA-Z0-9\s-_]+$/,
} as const

/**
 * Type exports
 */
export type Phase = typeof PHASES[keyof typeof PHASES]
export type UIStyle = typeof UI_STYLES[keyof typeof UI_STYLES]
export type MessageRole = typeof MESSAGE_ROLES[keyof typeof MESSAGE_ROLES]
export type MonetizationType = typeof MONETIZATION_TYPES[keyof typeof MONETIZATION_TYPES]
export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS]
export type Framework = typeof FRAMEWORKS[keyof typeof FRAMEWORKS]