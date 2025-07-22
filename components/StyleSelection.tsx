'use client'

import React, { useState, useEffect } from 'react'
import { Grid, Layers, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createSafeStyle, createSafeStyles, type StyleData } from '@/lib/styleUtils'
import StyleCards from './StyleCards'
import TinderStyleSwiper from './TinderStyleSwiper'


interface StyleSelectionProps {
  onStyleSelect?: (style: StyleData) => void
}

export default function StyleSelection({ onStyleSelect }: StyleSelectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid')
  const [styles, setStyles] = useState<StyleData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState<StyleData | null>(null)

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch('/data/styles.json')
        if (!response.ok) {
          throw new Error('Failed to fetch styles')
        }
        const data = await response.json()
        setStyles(createSafeStyles(data))
      } catch (err) {
        console.error('Error fetching styles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStyles()
  }, [])

  const handleStyleSelect = (style: StyleData) => {
    const safeStyle = createSafeStyle(style)
    setSelectedStyle(safeStyle)
    if (onStyleSelect) {
      onStyleSelect(safeStyle)
    }
  }

  const handleStyleReject = (style: StyleData) => {
    console.log('Rejected style:', style.name)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          UIスタイルを選択
        </h2>
        <p className="text-gray-600 mb-6">
          プロジェクトに最適なデザインスタイルを見つけましょう
        </p>
        
        {/* 表示切り替えボタン */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            グリッド表示
          </Button>
          <Button
            variant={viewMode === 'swipe' ? 'default' : 'outline'}
            onClick={() => setViewMode('swipe')}
            className="flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            スワイプ表示
          </Button>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="transition-all duration-300">
        {viewMode === 'grid' ? (
          <StyleCards onStyleSelect={handleStyleSelect} />
        ) : (
          <div className="flex justify-center">
            <TinderStyleSwiper 
              styles={styles}
              onStyleSelect={handleStyleSelect}
              onStyleReject={handleStyleReject}
            />
          </div>
        )}
      </div>

      {/* 選択状態の表示 */}
      {selectedStyle && (() => {
        // Create safe style with defaults
        const safeStyle = createSafeStyle(selectedStyle)
        
        return (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center gap-3 z-50">
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: safeStyle?.previewColor?.[1] || '#888888' }}
            />
            <span className="font-medium">{safeStyle.name}</span>
            <span className="text-gray-500">が選択されています</span>
            <Button 
              size="sm"
              onClick={() => onStyleSelect && onStyleSelect(selectedStyle)}
              className="ml-2"
            >
              <Eye className="w-4 h-4 mr-1" />
              プレビュー
            </Button>
          </div>
        )
      })()}
    </div>
  )
}