import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"']/g, '')
}

export function generateDummyURL(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `https://matura-app-${random}-${timestamp}.vercel.app`
}

export function estimateAPICost(messages: number, phase: string): number {
  const baseCosts = {
    FreeTalk: 0.02,
    InsightRefine: 0.05,
    SketchView: 0.03,
    UXBuild: 0.04,
    CodePlayground: 0.08,
    ReleaseBoard: 0.02
  }
  
  return (baseCosts[phase as keyof typeof baseCosts] || 0.03) * messages
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function parseJSON(jsonString: string): any {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('JSON parse error:', error)
    return null
  }
}