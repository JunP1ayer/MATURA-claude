'use client'

import React, { useEffect, ReactNode } from 'react'
import { useThemeStore } from '@/lib/stores/themeStore'

interface ThemeProviderProps {
  children: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { selectedTheme, applyTheme } = useThemeStore()

  useEffect(() => {
    // ページロード時にテーマを適用
    if (selectedTheme) {
      applyTheme()
    }
  }, [selectedTheme, applyTheme])

  return (
    <div className="theme-provider">
      {children}
    </div>
  )
}

// テーマ対応のコンポーネント用ユーティリティフック
export function useThemedStyles() {
  const { selectedTheme, getThemeClasses } = useThemeStore()
  
  const getStyles = () => {
    if (!selectedTheme) {
      return {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-500 text-white', 
        surface: 'bg-gray-50',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200',
        accent: 'bg-purple-500 text-white'
      }
    }

    const theme = selectedTheme.themeConfig
    return {
      primary: `text-white`,
      secondary: `text-white`,
      surface: `border`,
      text: '',
      textSecondary: '',
      border: 'border',
      accent: `text-white`
    }
  }

  const getInlineStyles = () => {
    if (!selectedTheme) return {}
    
    const theme = selectedTheme.themeConfig
    return {
      primary: { backgroundColor: theme.primary, color: 'white' },
      secondary: { backgroundColor: theme.secondary, color: 'white' },
      surface: { backgroundColor: theme.surface, borderColor: theme.border },
      text: { color: theme.text },
      textSecondary: { color: theme.textSecondary },
      border: { borderColor: theme.border },
      accent: { backgroundColor: theme.accent, color: 'white' }
    }
  }

  return {
    selectedTheme,
    styles: getStyles(),
    inlineStyles: getInlineStyles(),
    themeClasses: getThemeClasses()
  }
}