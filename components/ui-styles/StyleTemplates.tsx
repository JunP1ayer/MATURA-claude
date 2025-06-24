'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// UI Style Interface
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
}

// Sophisticated UI Style Templates
export const UI_STYLES: UIStyle[] = [
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: '洗練されたグラデーションと柔らかな影で、現代的で親しみやすい印象を与えます',
    category: 'modern',
    colors: {
      primary: '#6366f1',
      secondary: '#a855f7',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937'
    },
    typography: {
      heading: 'font-bold tracking-tight',
      body: 'font-medium leading-relaxed'
    },
    spacing: 'comfortable',
    personality: ['親しみやすい', 'モダン', '信頼感']
  },
  {
    id: 'minimal-zen',
    name: 'Minimal Zen',
    description: '余白を活かしたミニマルデザイン。無駄を省き、本質に集中できる美しさ',
    category: 'minimal',
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    },
    typography: {
      heading: 'font-light tracking-wide',
      body: 'font-normal leading-loose'
    },
    spacing: 'spacious',
    personality: ['シンプル', '洗練', '集中']
  },
  {
    id: 'luxury-dark',
    name: 'Luxury Dark',
    description: 'プレミアム感溢れるダークテーマ。金のアクセントが高級感を演出',
    category: 'luxury',
    colors: {
      primary: '#fbbf24',
      secondary: '#f3f4f6',
      accent: '#fcd34d',
      background: '#111827',
      text: '#f9fafb'
    },
    typography: {
      heading: 'font-bold tracking-tight',
      body: 'font-normal leading-relaxed'
    },
    spacing: 'comfortable',
    personality: ['高級感', 'プレミアム', '特別感']
  },
  {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    description: '鮮やかな色彩とダイナミックな要素で創造性とエネルギーを表現',
    category: 'creative',
    colors: {
      primary: '#ef4444',
      secondary: '#06b6d4',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937'
    },
    typography: {
      heading: 'font-extrabold tracking-tight',
      body: 'font-medium leading-relaxed'
    },
    spacing: 'tight',
    personality: ['創造的', 'エネルギッシュ', '革新的']
  },
  {
    id: 'professional-corporate',
    name: 'Professional Corporate',
    description: 'ビジネスシーンに最適な、信頼性と専門性を重視したデザイン',
    category: 'professional',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#059669',
      background: '#f8fafc',
      text: '#0f172a'
    },
    typography: {
      heading: 'font-semibold tracking-normal',
      body: 'font-normal leading-normal'
    },
    spacing: 'comfortable',
    personality: ['信頼性', '専門性', '安定感']
  },
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    description: 'ガラスのような透明感と奥行きで、未来的で洗練された体験',
    category: 'modern',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff'
    },
    typography: {
      heading: 'font-bold tracking-tight',
      body: 'font-medium leading-relaxed'
    },
    spacing: 'comfortable',
    personality: ['未来的', '洗練', '革新']
  }
]

// Mini UI Preview Component
interface UIPreviewProps {
  style: UIStyle
  className?: string
}

export const UIPreview: React.FC<UIPreviewProps> = ({ style, className }) => {
  const isGlass = style.id === 'glass-morphism'
  const isDark = style.id === 'luxury-dark'
  
  return (
    <div 
      className={cn(
        "relative w-full h-64 rounded-xl overflow-hidden shadow-xl transition-all duration-300",
        className
      )}
      style={{
        background: style.colors.background.includes('gradient') 
          ? style.colors.background 
          : style.colors.background
      }}
    >
      {/* Background Pattern for Glass */}
      {isGlass && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-16 h-16 bg-white/30 rounded-full blur-xl" />
          <div className="absolute bottom-8 right-8 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
        </div>
      )}
      
      {/* Mini Header */}
      <div className={cn(
        "px-4 py-3 border-b flex items-center justify-between",
        isDark ? "border-gray-700/50" : "border-gray-200/50",
        isGlass && "backdrop-blur-sm bg-white/10 border-white/20"
      )}>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isGlass ? "bg-white/60" : isDark ? "bg-gray-400" : "bg-gray-300"
          )} />
          <div className={cn(
            "w-16 h-2 rounded",
            isGlass ? "bg-white/40" : isDark ? "bg-gray-600" : "bg-gray-200"
          )} />
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                isGlass ? "bg-white/40" : isDark ? "bg-gray-600" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div
          className={cn(
            "h-4 rounded",
            style.typography.heading
          )}
          style={{ 
            backgroundColor: isGlass ? 'rgba(255,255,255,0.7)' : 
                           isDark ? '#6b7280' : '#e5e7eb',
            width: '60%'
          }}
        />
        
        {/* Subtitle */}
        <div
          className="h-2 rounded"
          style={{ 
            backgroundColor: isGlass ? 'rgba(255,255,255,0.5)' : 
                           isDark ? '#4b5563' : '#d1d5db',
            width: '40%'
          }}
        />

        {/* Card Element */}
        <div className={cn(
          "p-3 rounded-lg space-y-2 mt-4",
          isGlass && "backdrop-blur-sm bg-white/10 border border-white/20",
          isDark && "bg-gray-800/50 border border-gray-700/50",
          !isGlass && !isDark && "bg-white shadow-sm border border-gray-100"
        )}>
          <div
            className="h-2 rounded"
            style={{ 
              backgroundColor: style.colors.primary,
              width: '70%'
            }}
          />
          <div
            className="h-2 rounded"
            style={{ 
              backgroundColor: isGlass ? 'rgba(255,255,255,0.4)' : 
                             isDark ? '#6b7280' : '#e5e7eb',
              width: '50%'
            }}
          />
        </div>

        {/* Action Elements */}
        <div className="flex gap-2 mt-4">
          <div
            className="flex-1 h-6 rounded-md flex items-center justify-center text-[8px] font-medium text-white"
            style={{ backgroundColor: style.colors.primary }}
          >
            Action
          </div>
          <div
            className={cn(
              "flex-1 h-6 rounded-md border flex items-center justify-center text-[8px] font-medium",
              isGlass ? "border-white/30 text-white/80" :
              isDark ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
            )}
          >
            Cancel
          </div>
        </div>
      </div>

      {/* Accent Element */}
      <div 
        className="absolute top-2 right-2 w-2 h-6 rounded-full"
        style={{ backgroundColor: style.colors.accent }}
      />
    </div>
  )
}