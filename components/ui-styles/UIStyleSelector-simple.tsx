'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UIStyle, UI_STYLES, UIPreview } from './StyleTemplates'
import { Check, Sparkles, Palette, Zap, Crown, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UIStyleSelectorProps {
  onStyleSelected: (style: UIStyle) => void
  selectedStyle?: UIStyle | null
  className?: string
}

const categoryIcons = {
  modern: Sparkles,
  minimal: Palette,
  luxury: Crown,
  creative: Zap,
  professional: Building2
} as const

const categoryColors = {
  modern: 'from-blue-500 to-purple-600',
  minimal: 'from-gray-400 to-gray-600', 
  luxury: 'from-yellow-500 to-amber-600',
  creative: 'from-red-500 to-pink-600',
  professional: 'from-blue-600 to-indigo-700'
} as const

export const UIStyleSelector: React.FC<UIStyleSelectorProps> = ({
  onStyleSelected,
  selectedStyle,
  className
}) => {
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(UI_STYLES.map(s => s.category)))]
  const filteredStyles = filter === 'all' 
    ? UI_STYLES 
    : UI_STYLES.filter(s => s.category === filter)

  return (
    <div className={cn("w-full max-w-7xl mx-auto p-6", className)}>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6">
          <Palette className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">UI Style Selection</span>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
          あなたのアプリにぴったりの
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            UIスタイルを選択
          </span>
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          ブランドの個性とユーザー体験を最適化する、
          美しくデザインされたUIスタイルテンプレートから選択してください
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => {
          const isActive = filter === category
          const Icon = category !== 'all' ? categoryIcons[category as keyof typeof categoryIcons] : Palette
          
          return (
            <Button
              key={category}
              variant={isActive ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className={cn(
                "h-auto px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                  : "hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category === 'all' ? 'すべて' : 
               category === 'modern' ? 'モダン' :
               category === 'minimal' ? 'ミニマル' :
               category === 'luxury' ? 'ラグジュアリー' :
               category === 'creative' ? 'クリエイティブ' :
               category === 'professional' ? 'プロフェッショナル' : category}
            </Button>
          )
        })}
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStyles.map((style, index) => {
          const isSelected = selectedStyle?.id === style.id
          const isHovered = hoveredStyle === style.id
          const Icon = categoryIcons[style.category]

          return (
            <div
              key={style.id}
              className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
              onMouseEnter={() => setHoveredStyle(style.id)}
              onMouseLeave={() => setHoveredStyle(null)}
              onClick={() => onStyleSelected(style)}
            >
              <Card className={cn(
                "relative overflow-hidden transition-all duration-300 border-2",
                isSelected 
                  ? "border-blue-500 shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/10" 
                  : "border-gray-200 hover:border-gray-300 hover:shadow-xl",
                "bg-white"
              )}>
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "bg-gradient-to-r text-white border-0 shadow-lg backdrop-blur-sm",
                      categoryColors[style.category]
                    )}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {style.category === 'modern' ? 'モダン' :
                     style.category === 'minimal' ? 'ミニマル' :
                     style.category === 'luxury' ? 'ラグジュアリー' :
                     style.category === 'creative' ? 'クリエイティブ' :
                     style.category === 'professional' ? 'プロフェッショナル' : style.category}
                  </Badge>
                </div>

                <CardContent className="p-0">
                  {/* UI Preview */}
                  <div className="relative">
                    <UIPreview 
                      style={style} 
                      className={cn(
                        "transition-transform duration-300",
                        isHovered && "scale-[1.02]"
                      )}
                    />
                    
                    {/* Hover Overlay */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                        <Button 
                          size="sm"
                          className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                        >
                          このスタイルを選択
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Style Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {style.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {style.description}
                      </p>
                    </div>

                    {/* Personality Tags */}
                    <div className="flex flex-wrap gap-2">
                      {style.personality.map((trait) => (
                        <Badge 
                          key={trait}
                          variant="outline" 
                          className="text-xs border-gray-200 text-gray-600 hover:border-gray-300"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>

                    {/* Color Palette */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Color Palette
                      </span>
                      <div className="flex gap-1">
                        {Object.entries(style.colors)
                          .filter(([key]) => ['primary', 'secondary', 'accent'].includes(key))
                          .map(([key, color]) => (
                          <div
                            key={key}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                            title={key}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Selected Style Summary */}
      {selectedStyle && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">
                {selectedStyle.name} を選択しました
              </p>
              <p className="text-sm text-gray-600">
                次のステップでこのスタイルを適用します
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}