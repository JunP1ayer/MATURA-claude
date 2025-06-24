'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text,
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-matura-primary',
    secondary: 'border-matura-secondary', 
    white: 'border-white'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-200',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{
          borderTopColor: 'transparent'
        }}
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// プリセットされたローディングコンポーネント
export function ThinkingSpinner() {
  return (
    <LoadingSpinner 
      size="md" 
      text="考えています..." 
      className="py-4"
    />
  )
}

export function ProcessingSpinner() {
  return (
    <LoadingSpinner 
      size="lg" 
      text="処理中..." 
      className="py-8"
    />
  )
}

export function GeneratingSpinner() {
  return (
    <LoadingSpinner 
      size="lg" 
      text="生成中..." 
      className="py-8"
    />
  )
}