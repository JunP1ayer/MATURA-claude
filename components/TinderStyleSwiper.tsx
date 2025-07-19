'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, X, RotateCcw, Grid, Layers } from 'lucide-react'
import { useThemeStore } from '@/lib/stores/themeStore'
import { createSafeStyle, createSafeStyles, type StyleData } from '@/lib/styleUtils'


interface TinderStyleSwiperProps {
  styles: StyleData[]
  onStyleSelect?: (style: StyleData) => void
  onStyleReject?: (style: StyleData) => void
}

export default function TinderStyleSwiper({ styles, onStyleSelect, onStyleReject }: TinderStyleSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [likedStyles, setLikedStyles] = useState<StyleData[]>([])
  const controls = useAnimation()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  
  const { setSelectedTheme } = useThemeStore()

  const currentStyle = createSafeStyle(styles[currentIndex])
  const nextStyle = createSafeStyle(styles[currentIndex + 1])
  
  // Create safe versions for consistent naming
  const safeCurrentStyle = currentStyle
  const safeNextStyle = nextStyle

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100
    const swipeVelocity = Math.abs(info.velocity.x)

    if (info.offset.x > threshold || swipeVelocity > 500) {
      // Swipe right - Like
      setDirection('right')
      await controls.start({ x: 300, opacity: 0 })
      handleLike()
    } else if (info.offset.x < -threshold || swipeVelocity > 500) {
      // Swipe left - Pass
      setDirection('left')
      await controls.start({ x: -300, opacity: 0 })
      handlePass()
    } else {
      // Return to center
      controls.start({ x: 0, opacity: 1 })
    }
  }

  const handleLike = () => {
    if (currentStyle) {
      setLikedStyles([...likedStyles, currentStyle])
      
      // Zustandストアにテーマを保存（id必須チェック付き）
      if (currentStyle.id && currentStyle.themeConfig) {
        const themeData = {
          ...currentStyle,
          id: currentStyle.id,
          themeConfig: currentStyle.themeConfig
        }
        setSelectedTheme(themeData as any)
        console.log('テーマが保存されました:', themeData.name)
      }
      
      if (onStyleSelect) {
        onStyleSelect(currentStyle)
      }
    }
    nextCard()
  }

  const handlePass = () => {
    if (currentStyle && onStyleReject) {
      onStyleReject(currentStyle)
    }
    nextCard()
  }

  const nextCard = () => {
    if (currentIndex < styles.length - 1) {
      setCurrentIndex(currentIndex + 1)
      controls.set({ x: 0, opacity: 1 })
      setDirection(null)
    }
  }

  const resetSwiper = () => {
    setCurrentIndex(0)
    setLikedStyles([])
    controls.set({ x: 0, opacity: 1 })
    setDirection(null)
  }

  // 詳細なUIプレビュー生成
  const generateDetailedPreview = (style: StyleData) => {
    const safeStyle = createSafeStyle(style)
    const theme = safeStyle.themeConfig

    return (
      <div 
        className="w-full h-80 rounded-lg border-2 p-4"
        style={{ 
          backgroundColor: theme.background,
          borderColor: theme.border
        }}
      >
        {/* ヘッダー */}
        <div 
          className="flex items-center justify-between mb-4 pb-2 border-b"
          style={{ borderColor: theme.border }}
        >
          <h3 
            className="text-lg font-bold"
            style={{ color: theme.text }}
          >
            Dashboard
          </h3>
          <div className="flex gap-2">
            <div 
              className="px-3 py-1 rounded-md text-sm font-medium"
              style={{
                backgroundColor: theme.primary,
                color: theme.background
              }}
            >
              設定
            </div>
            <div 
              className="p-2 rounded-md border"
              style={{
                borderColor: theme.border,
                color: theme.textSecondary
              }}
            >
              ⚙️
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* フォームエリア */}
          <div 
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.primary }} />
              <span className="font-semibold text-sm" style={{ color: theme.text }}>
                ユーザー情報
              </span>
            </div>
            <div className="space-y-2">
              <div 
                className="w-full h-6 px-2 text-xs rounded border flex items-center"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary
                }}
              >
                山田太郎
              </div>
              <div 
                className="w-full h-6 px-2 text-xs rounded border flex items-center"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary
                }}
              >
                example@email.com
              </div>
              <div className="flex gap-2 pt-1">
                <div 
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.background
                  }}
                >
                  保存
                </div>
                <div 
                  className="px-2 py-1 rounded text-xs border"
                  style={{
                    borderColor: theme.border,
                    color: theme.textSecondary
                  }}
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>

          {/* 統計エリア */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div 
                className="p-2 rounded border text-center"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border
                }}
              >
                <div 
                  className="text-lg font-bold"
                  style={{ color: theme.primary }}
                >
                  125
                </div>
                <div 
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  フォロワー
                </div>
              </div>
              <div 
                className="p-2 rounded border text-center"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border
                }}
              >
                <div 
                  className="text-lg font-bold"
                  style={{ color: theme.accent }}
                >
                  48
                </div>
                <div 
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  投稿
                </div>
              </div>
            </div>
            
            {/* アクションカード */}
            <div 
              className="p-2 rounded border"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border
              }}
            >
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.accent }} />
                <span className="font-semibold text-xs" style={{ color: theme.text }}>
                  おすすめ
                </span>
              </div>
              <p 
                className="text-xs mb-2"
                style={{ color: theme.textSecondary }}
              >
                新機能をお試しください
              </p>
              <div 
                className="w-full py-1 px-2 rounded text-xs text-center font-medium"
                style={{
                  backgroundColor: theme.secondary,
                  color: theme.background
                }}
              >
                試してみる
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div 
          className="pt-2 border-t text-center"
          style={{ borderColor: theme.border }}
        >
          <div 
            className="text-xs"
            style={{ color: theme.textSecondary }}
          >
            {style.name} スタイル
          </div>
        </div>
      </div>
    )
  }

  if (currentIndex >= styles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">すべてのスタイルを確認しました！</h3>
        <p className="text-gray-600 text-center">
          {likedStyles.length > 0 
            ? `${likedStyles.length}個のスタイルを選択しました` 
            : '気に入ったスタイルは見つかりましたか？'
          }
        </p>
        
        {likedStyles.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {likedStyles.map((style, index) => {
              const safeStyle = {
                ...style,
                previewColor: style.previewColor || ['#000000', '#888888', '#ffffff'],
                name: style.name || 'Unnamed Style'
              }
              return (
                <Badge 
                  key={index}
                  style={{
                    backgroundColor: (safeStyle?.previewColor?.[1] || '#888888') + '20',
                    color: (safeStyle?.previewColor?.[1] || '#888888'),
                    border: `1px solid ${(safeStyle?.previewColor?.[1] || '#888888')}40`
                  }}
                >
                  {safeStyle.name}
                </Badge>
              )
            })}
          </div>
        )}
        
        <Button onClick={resetSwiper} className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          もう一度見る
        </Button>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] flex flex-col">
      {/* プログレスバー */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / styles.length) * 100}%` }}
        />
      </div>

      {/* Card Stack */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Next card (background) */}
        {safeNextStyle && (
          <Card className="absolute w-full h-[450px] bg-white shadow-lg transform scale-95 opacity-50">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-2">{safeNextStyle.name}</h3>
              <div className="text-xs text-gray-500 mb-2">{safeNextStyle.description}</div>
              <div className="w-full h-32 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-gray-400 text-sm">次のテーマ</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current card */}
        <motion.div
          className="absolute w-full cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity }}
          animate={controls}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.05 }}
        >
          <Card 
            className="w-full h-[450px] bg-white shadow-xl border-2"
            style={{ borderColor: (safeCurrentStyle?.previewColor?.[1] || '#888888') }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-xl font-bold"
                  style={{ color: (safeCurrentStyle?.previewColor?.[0] || '#000000') }}
                >
                  {safeCurrentStyle?.name}
                </h3>
                <div className="flex gap-1">
                  {(safeCurrentStyle?.previewColor || []).slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* 詳細UIプレビュー */}
              {safeCurrentStyle && generateDetailedPreview(safeCurrentStyle)}
              
              <div className="mt-4">
                <p className="text-sm mb-2" style={{ color: safeCurrentStyle?.themeConfig?.textSecondary || '#6b7280' }}>
                  {safeCurrentStyle?.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(safeCurrentStyle?.tags || []).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: (safeCurrentStyle?.previewColor?.[0] || '#000000') + '20',
                        color: (safeCurrentStyle?.previewColor?.[0] || '#000000')
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-8 mt-6">
        <Button
          onClick={handlePass}
          variant="outline"
          size="lg"
          className="w-14 h-14 rounded-full border-2 border-red-200 hover:border-red-400 hover:bg-red-50"
        >
          <X className="w-6 h-6 text-red-500" />
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">
            {currentIndex + 1} / {styles.length}
          </p>
          <p className="text-xs text-gray-400">
            スワイプまたはボタンで選択
          </p>
        </div>
        
        <Button
          onClick={handleLike}
          variant="outline"
          size="lg"
          className="w-14 h-14 rounded-full border-2 border-green-200 hover:border-green-400 hover:bg-green-50"
        >
          <Heart className="w-6 h-6 text-green-500" />
        </Button>
      </div>

      {/* Swipe indicators */}
      <div className="absolute top-20 left-8 right-8 flex justify-between pointer-events-none">
        <motion.div
          className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg rotate-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: direction === 'left' || (x.get() < -50 && Math.abs(x.get()) > 50) ? 1 : 0,
            scale: direction === 'left' || (x.get() < -50 && Math.abs(x.get()) > 50) ? 1 : 0.8
          }}
        >
          PASS
        </motion.div>
        <motion.div
          className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg -rotate-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: direction === 'right' || (x.get() > 50 && Math.abs(x.get()) > 50) ? 1 : 0,
            scale: direction === 'right' || (x.get() > 50 && Math.abs(x.get()) > 50) ? 1 : 0.8
          }}
        >
          LIKE
        </motion.div>
      </div>

      {/* Liked styles counter */}
      {likedStyles.length > 0 && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ♥ {likedStyles.length}
        </div>
      )}
    </div>
  )
}