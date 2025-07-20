'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Check } from 'lucide-react'
import { UIStyle } from '@/lib/types'

interface UIStyleSelectorProps {
  styles: UIStyle[]
  selectedStyle?: UIStyle | null
  onStyleSelect: (style: UIStyle) => void
  isLoading?: boolean
}

const UIStyleSelector: React.FC<UIStyleSelectorProps> = ({
  styles,
  selectedStyle,
  onStyleSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">UIスタイルを選択</h2>
        <p className="text-gray-600">
          あなたのアプリに最適なデザインスタイルを選んでください
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {styles.map((style) => {
          const isSelected = selectedStyle?.id === style.id
          
          return (
            <Card 
              key={style.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                  : 'hover:scale-102'
              }`}
              onClick={() => onStyleSelect(style)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{style.name}</CardTitle>
                  {isSelected && (
                    <div className="bg-blue-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="w-fit">
                  {style.category}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Color Palette Preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Palette className="h-4 w-4" />
                    カラーパレット
                  </div>
                  <div className="flex gap-1">
                    <div 
                      className="w-8 h-8 rounded-md border shadow-sm"
                      style={{ backgroundColor: style.colors.primary }}
                      title={`Primary: ${style.colors.primary}`}
                    />
                    <div 
                      className="w-8 h-8 rounded-md border shadow-sm"
                      style={{ backgroundColor: style.colors.secondary }}
                      title={`Secondary: ${style.colors.secondary}`}
                    />
                    <div 
                      className="w-8 h-8 rounded-md border shadow-sm"
                      style={{ backgroundColor: style.colors.accent }}
                      title={`Accent: ${style.colors.accent}`}
                    />
                    <div 
                      className="w-8 h-8 rounded-md border shadow-sm"
                      style={{ backgroundColor: style.colors.background }}
                      title={`Background: ${style.colors.background}`}
                    />
                  </div>
                </div>

                {/* Typography Info */}
                <div className="space-y-1">
                  <div className="text-sm font-medium">タイポグラフィ</div>
                  <div className="text-xs text-gray-600">
                    <div>見出し: {style.typography.heading}</div>
                    <div>本文: {style.typography.body}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {style.description}
                </p>

                {/* Personality Tags */}
                <div className="flex flex-wrap gap-1">
                  {style.personality.slice(0, 3).map((trait, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {trait}
                    </Badge>
                  ))}
                  {style.personality.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{style.personality.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Spacing Info */}
                <div className="text-xs text-gray-500">
                  間隔: {style.spacing === 'tight' ? '密' : style.spacing === 'comfortable' ? '標準' : '広'}
                </div>

                {/* Action Button */}
                <Button 
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStyleSelect(style)
                  }}
                >
                  {isSelected ? '選択済み' : 'このスタイルを選択'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedStyle && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            選択中: {selectedStyle.name}
          </h3>
          <p className="text-blue-800 text-sm">
            {selectedStyle.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedStyle.personality.map((trait, index) => (
              <Badge key={index} className="bg-blue-100 text-blue-800">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UIStyleSelector