'use client'

import React, { useState, useCallback } from 'react'
import SwipeCard, { UIStyle } from './SwipeCard'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, RefreshCw, Zap } from 'lucide-react'

// Sample UI styles data
const UI_STYLES: UIStyle[] = [
  {
    id: 'soft-cards',
    name: 'Soft Cards',
    description: '角丸で優しいグラデーション。ユーザーフレンドリーなアプリに最適。Instagram風の親しみやすいデザイン。',
    image: '/ui_samples/soft-cards.svg',
    tags: ['Modern', 'Friendly', 'Mobile'],
    colors: {
      primary: '#ec4899',
      secondary: '#a855f7',
      accent: '#fce7f3'
    }
  },
  {
    id: 'flat-minimal',
    name: 'Flat Minimal',
    description: 'シンプルで洗練されたデザイン。ビジネスアプリや生産性ツールに最適。Apple風のクリーンなスタイル。',
    image: '/ui_samples/flat-minimal.svg',
    tags: ['Clean', 'Professional', 'Simple'],
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#ffffff'
    }
  },
  {
    id: 'glass-ui',
    name: 'Glass Morphism',
    description: 'ガラスのような透明感とブラー効果。モダンでスタイリッシュなアプリに最適。macOS Big Sur風。',
    image: '/ui_samples/glass-ui.svg',
    tags: ['Modern', 'Stylish', 'Premium'],
    colors: {
      primary: '#3b82f6',
      secondary: '#ec4899',
      accent: 'rgba(255,255,255,0.2)'
    }
  },
  {
    id: 'notion-style',
    name: 'Document Style',
    description: 'Notion風のシンプルな文書スタイル。コンテンツ重視のアプリや学習プラットフォームに最適。',
    image: '/ui_samples/notion-style.svg',
    tags: ['Content', 'Reading', 'Focus'],
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#f3f4f6'
    }
  },
  {
    id: 'chat-ai',
    name: 'Chat Interface',
    description: 'LINE風のチャットインターフェース。AI対話アプリやメッセージングアプリに最適。',
    image: '/ui_samples/chat-ai.svg',
    tags: ['Chat', 'AI', 'Social'],
    colors: {
      primary: '#22c55e',
      secondary: '#6b7280',
      accent: '#ffffff'
    }
  }
]

interface UISelectionStepProps {
  onStyleSelected: (style: UIStyle) => void
  onBack?: () => void
  selectedStyles?: UIStyle[]
}

export default function UISelectionStep({ 
  onStyleSelected, 
  onBack,
  selectedStyles = []
}: UISelectionStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedStyles, setLikedStyles] = useState<UIStyle[]>(selectedStyles)
  const [passedStyles, setPassedStyles] = useState<UIStyle[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const currentStyle = UI_STYLES[currentIndex]
  const hasMoreCards = currentIndex < UI_STYLES.length
  const progress = ((currentIndex + passedStyles.length + likedStyles.length) / UI_STYLES.length) * 100

  const handleSwipeRight = useCallback(() => {
    if (!currentStyle) return
    
    const newLikedStyles = [...likedStyles, currentStyle]
    setLikedStyles(newLikedStyles)
    
    if (currentIndex >= UI_STYLES.length - 1) {
      setIsComplete(true)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentStyle, currentIndex, likedStyles])

  const handleSwipeLeft = useCallback(() => {
    if (!currentStyle) return
    
    const newPassedStyles = [...passedStyles, currentStyle]
    setPassedStyles(newPassedStyles)
    
    if (currentIndex >= UI_STYLES.length - 1) {
      setIsComplete(true)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentStyle, currentIndex, passedStyles])

  const handleSwipeUp = useCallback(() => {
    // Show detailed view or more info
    console.log('Show details for:', currentStyle?.name)
  }, [currentStyle])

  const handleSelectStyle = useCallback((style: UIStyle) => {
    onStyleSelected(style)
  }, [onStyleSelected])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setLikedStyles([])
    setPassedStyles([])
    setIsComplete(false)
  }, [])

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">選択完了</h1>
            <Button variant="ghost" size="icon" onClick={handleRestart}>
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">お疲れ様でした！</h2>
              <p className="text-gray-600">
                {likedStyles.length}個のスタイルがお気に入りに追加されました
              </p>
            </div>

            {/* Liked Styles */}
            {likedStyles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">お気に入りのスタイル</h3>
                <div className="space-y-3">
                  {likedStyles.map((style) => (
                    <div 
                      key={style.id}
                      className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleSelectStyle(style)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={style.image} 
                            alt={style.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{style.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{style.description}</p>
                        </div>
                        <div className="flex gap-1">
                          {Object.values(style.colors).map((color, i) => (
                            <div 
                              key={i}
                              className="w-3 h-3 rounded-full border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {likedStyles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">お気に入りのスタイルがありません</p>
                <Button onClick={handleRestart} variant="outline">
                  もう一度選択する
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">UIスタイル選択</h1>
            <p className="text-sm text-gray-600">
              {currentIndex + 1} / {UI_STYLES.length}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRestart}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Cards Stack */}
        <div className="relative h-[600px] mb-6">
          {hasMoreCards && (
            <>
              {/* Background cards */}
              {[1, 2, 3].map((offset) => {
                const index = currentIndex + offset
                if (index >= UI_STYLES.length) return null
                
                return (
                  <SwipeCard
                    key={`${UI_STYLES[index].id}-${index}`}
                    uiStyle={UI_STYLES[index]}
                    onSwipeLeft={() => {}}
                    onSwipeRight={() => {}}
                    zIndex={5 - offset}
                    isTop={false}
                  />
                )
              })}
              
              {/* Top card */}
              <SwipeCard
                key={`${currentStyle.id}-${currentIndex}`}
                uiStyle={currentStyle}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSwipeUp={handleSwipeUp}
                isTop={true}
                zIndex={5}
              />
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            onClick={handleSwipeLeft}
            disabled={!hasMoreCards}
          >
            パス
          </Button>
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleSwipeRight}
            disabled={!hasMoreCards}
          >
            気に入った！
          </Button>
        </div>

        {/* Counter */}
        <div className="text-center mt-6 text-sm text-gray-500">
          お気に入り: {likedStyles.length}個 | パス: {passedStyles.length}個
        </div>
      </div>
    </div>
  )
}