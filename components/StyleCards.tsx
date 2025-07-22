'use client'

import React, { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StyleData {
  id?: string
  name?: string
  description?: string
  baseColor?: string
  tags?: string[]
  previewColor?: string[]
  icon?: string
  thumbnail?: string
  themeConfig?: {
    primary?: string
    secondary?: string
    background?: string
    surface?: string
    text?: string
    textSecondary?: string
    border?: string
    accent?: string
  }
}

interface StyleCardsProps {
  onStyleSelect?: (style: StyleData) => void
}

// 完全に安全なスタイル作成関数
const createUltraSafeStyle = (rawStyle: any): StyleData => {
  const defaultColors = ['#000000', '#888888', '#ffffff']
  const defaultTags = ['スタイル', 'デザイン']
  
  return {
    id: rawStyle?.id || `style-${Math.random().toString(36).substr(2, 9)}`,
    name: rawStyle?.name || 'スタイル',
    description: rawStyle?.description || 'デザインスタイル',
    baseColor: rawStyle?.baseColor || defaultColors[0],
    tags: Array.isArray(rawStyle?.tags) ? rawStyle.tags : defaultTags,
    previewColor: Array.isArray(rawStyle?.previewColor) ? rawStyle.previewColor : defaultColors,
    icon: rawStyle?.icon || 'Palette',
    thumbnail: rawStyle?.thumbnail || '',
    themeConfig: {
      primary: rawStyle?.themeConfig?.primary || defaultColors[0],
      secondary: rawStyle?.themeConfig?.secondary || defaultColors[1],
      background: rawStyle?.themeConfig?.background || defaultColors[2],
      surface: rawStyle?.themeConfig?.surface || defaultColors[2],
      text: rawStyle?.themeConfig?.text || defaultColors[0],
      textSecondary: rawStyle?.themeConfig?.textSecondary || defaultColors[1],
      border: rawStyle?.themeConfig?.border || (`${defaultColors[1]  }40`),
      accent: rawStyle?.themeConfig?.accent || defaultColors[1]
    }
  }
}

// ヘルパー関数：安全な色取得
const getSafeColor = (colors: string[] | undefined | null, index: number, defaultColor: string): string => {
  try {
    if (!Array.isArray(colors) || colors.length <= index || !colors[index] || typeof colors[index] !== 'string' || colors[index].trim() === '') {
      console.warn('Invalid color data:', { colors, index, value: colors?.[index] })
      return defaultColor
    }
    return colors[index]
  } catch (error) {
    console.warn('Color access error:', error)
    return defaultColor
  }
}

// ヘルパー関数：安全な配列アクセス（直接的なアクセス用）
const getPreviewColor = (previewColor: string[] | undefined, index: number, fallback: string): string => {
  return (Array.isArray(previewColor) && previewColor[index] && typeof previewColor[index] === 'string')
    ? previewColor[index]
    : fallback
}

export default function StyleCards({ onStyleSelect }: StyleCardsProps) {
  const [styles, setStyles] = useState<StyleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        console.log('Fetching styles...')
        const response = await fetch('/data/styles.json')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        console.log('Raw data:', data)
        
        // データを安全に変換
        const safeStyles = Array.isArray(data) 
          ? data.map(createUltraSafeStyle)
          : [createUltraSafeStyle(data)]
        
        console.log('Safe styles:', safeStyles)
        setStyles(safeStyles)
        
      } catch (err) {
        console.error('Fetch error:', err)
        // エラーでもデフォルトスタイルを提供
        const fallbackStyles = [
          createUltraSafeStyle({ name: 'ポップ', description: 'カラフルで遊び心あるデザイン' }),
          createUltraSafeStyle({ name: 'ミニマル', description: 'シンプルで洗練されたスタイル' }),
          createUltraSafeStyle({ name: 'モダン', description: '最新トレンドを取り入れた現代的デザイン' })
        ]
        setStyles(fallbackStyles)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStyles()
  }, [])

  const handleStyleSelect = (index: number) => {
    try {
      console.log('handleStyleSelect called with:', { index, currentSelected: selectedStyleIndex })
      
      // インデックスの安全性チェック
      if (typeof index !== 'number' || index < 0 || index >= styles.length) {
        console.warn('Invalid index for selection:', index)
        return
      }
      
      // 安全な選択状態更新
      const newSelectedIndex = (typeof selectedStyleIndex === 'number' && selectedStyleIndex === index) ? null : index
      console.log('Setting new selected index:', newSelectedIndex)
      setSelectedStyleIndex(newSelectedIndex)
    } catch (error) {
      console.error('Selection error:', error)
    }
  }

  const handleNext = () => {
    try {
      console.log('handleNext called with:', { selectedStyleIndex, stylesLength: styles.length })
      
      // 安全な選択状態チェック
      if (typeof selectedStyleIndex !== 'number' || selectedStyleIndex < 0 || selectedStyleIndex >= styles.length) {
        console.warn('Invalid selected index:', selectedStyleIndex)
        return
      }
      
      const selectedStyle = styles[selectedStyleIndex]
      if (!selectedStyle) {
        console.warn('Selected style not found at index:', selectedStyleIndex)
        return
      }
      
      console.log('選択されたスタイル:', selectedStyle.name)
      if (onStyleSelect) {
        onStyleSelect(selectedStyle)
      }
    } catch (error) {
      console.error('Next button error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-sm text-yellow-800">
            データ読み込みエラー: {error} (デフォルトスタイルを使用しています)
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {styles.map((style, index) => {
          try {
            // デバッグログ追加
            console.log('Processing style:', { style, index, selectedStyleIndex })
            
            // インデックスの安全性チェック
            if (typeof index !== 'number' || index < 0) {
              console.warn('Invalid index:', index)
              return null
            }
            
            // 安全なスタイル処理
            const safeStyle = createUltraSafeStyle(style)
            
            // デフォルト色の定義
            const defaultColors = ['#000000', '#888888', '#ffffff']
            const primaryColor = getSafeColor(safeStyle.previewColor, 0, defaultColors[0])
            const secondaryColor = getSafeColor(safeStyle.previewColor, 1, defaultColors[1])
            const backgroundColor = getSafeColor(safeStyle.previewColor, 2, defaultColors[2])
            
            // アイコンコンポーネントを安全に取得
            let IconComponent = null
            try {
              const iconName = safeStyle.icon || 'Palette'
              IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>
            } catch (iconError) {
              console.warn('Icon error:', iconError)
              IconComponent = Icons.Palette as React.ComponentType<{ className?: string }>
            }
            
            // 安全な isSelected 判定
            const isSelected = (typeof selectedStyleIndex === 'number' && typeof index === 'number') 
              ? selectedStyleIndex === index 
              : false
            
            // 色の値を再確認（ダブルチェック）
            const safePrimaryColor = (typeof primaryColor === 'string' && primaryColor.length > 0) ? primaryColor : '#000000'
            const safeSecondaryColor = (typeof secondaryColor === 'string' && secondaryColor.length > 0) ? secondaryColor : '#888888'
            const safeBackgroundColor = (typeof backgroundColor === 'string' && backgroundColor.length > 0) ? backgroundColor : '#ffffff'
            
            console.log('Color check:', { 
              primaryColor, safePrimaryColor,
              secondaryColor, safeSecondaryColor,
              backgroundColor, safeBackgroundColor
            })
            console.log('isSelected calculation:', { selectedStyleIndex, index, isSelected })
            
            return (
              <Card 
                key={safeStyle.id || index}
                onClick={() => handleStyleSelect(index)}
                className={`group hover:shadow-lg transition-all duration-300 border-2 bg-white rounded-xl overflow-hidden cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg transform scale-105' 
                    : 'hover:border-opacity-50'
                }`}
                style={{ 
                  borderColor: isSelected 
                    ? '#3b82f6' 
                    : `${getPreviewColor(safeStyle.previewColor, 1, '#cccccc')  }40`
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ 
                          color: getPreviewColor(safeStyle.previewColor, 1, '#888888')
                        }}
                        />
                      )}
                      {safeStyle.name || 'Unnamed Style'}
                      {isSelected && (
                        <span className="ml-2 text-blue-500 text-sm">✓</span>
                      )}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed">
                    {safeStyle.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* カラーパレット */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      カラーパレット
                    </h4>
                    <div className="flex gap-2">
                      {(Array.isArray(safeStyle.previewColor) && safeStyle.previewColor.length > 0
                        ? safeStyle.previewColor
                        : defaultColors
                      ).map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm flex-shrink-0 hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: color || '#cccccc' }}
                          title={color || '#cccccc'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* スタイルタグ */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      スタイル
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(safeStyle.tags) && safeStyle.tags.length > 0
                        ? safeStyle.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${getPreviewColor(safeStyle.previewColor, 1, '#cccccc')  }15`,
                                color: getPreviewColor(safeStyle.previewColor, 0, '#000000'),
                                border: `1px solid ${getPreviewColor(safeStyle.previewColor, 1, '#cccccc')}30`
                              }}
                            >
                              {tag || 'スタイル'}
                            </Badge>
                          ))
                        : (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${getPreviewColor(safeStyle.previewColor, 1, '#cccccc')  }15`,
                                color: getPreviewColor(safeStyle.previewColor, 0, '#000000'),
                                border: `1px solid ${getPreviewColor(safeStyle.previewColor, 1, '#cccccc')}30`
                              }}
                            >
                              スタイル
                            </Badge>
                          )
                      }
                    </div>
                  </div>

                  {/* ベースカラー表示 */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Base Color</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {safeStyle.baseColor || '#000000'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          } catch (renderError) {
            console.error('Render error for style:', style, renderError)
            return (
              <Card key={index} className="p-4 border-red-300">
                <p className="text-red-600">スタイル表示エラー</p>
              </Card>
            )
          }
        })}
      </div>
      
      {/* 次へボタン */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleNext}
          disabled={typeof selectedStyleIndex !== 'number' || selectedStyleIndex < 0 || selectedStyleIndex >= styles.length}
          className="px-8 py-2 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          次へ
        </Button>
      </div>
    </div>
  )
}