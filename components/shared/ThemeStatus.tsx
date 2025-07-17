'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Palette, Check } from 'lucide-react'
import { useThemeStore } from '@/lib/stores/themeStore'

export default function ThemeStatus() {
  const { selectedTheme, isThemeApplied } = useThemeStore()

  if (!selectedTheme) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Palette className="w-3 h-3" />
        デフォルトテーマ
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className="text-xs"
        style={{
          backgroundColor: selectedTheme.themeConfig.primary + '20',
          color: selectedTheme.themeConfig.primary,
          borderColor: selectedTheme.themeConfig.primary + '40'
        }}
      >
        <div 
          className="w-2 h-2 rounded-full mr-1"
          style={{ backgroundColor: selectedTheme.themeConfig.primary }}
        />
        {selectedTheme.name}
      </Badge>
      {isThemeApplied && (
        <Check className="w-3 h-3 text-green-500" />
      )}
    </div>
  )
}