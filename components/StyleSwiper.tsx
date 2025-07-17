'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, RotateCcw, Heart, X } from 'lucide-react'
import stylesData from '@/styles.json'

interface Theme {
  id: string
  name: string
  description: string
  colorPalette: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  styleTags: string[]
}

interface StyleSwiperProps {
  onThemeSelect?: (theme: Theme) => void
  onThemePreview?: (theme: Theme) => void
}

export default function StyleSwiper({ onThemeSelect, onThemePreview }: StyleSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [themes] = useState<Theme[]>(stylesData.themes)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const controls = useAnimation()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const currentTheme = themes[currentIndex]
  const nextTheme = themes[currentIndex + 1]

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
    if (onThemeSelect && currentTheme) {
      onThemeSelect(currentTheme)
    }
    nextCard()
  }

  const handlePass = () => {
    nextCard()
  }

  const nextCard = () => {
    if (currentIndex < themes.length - 1) {
      setCurrentIndex(currentIndex + 1)
      controls.set({ x: 0, opacity: 1 })
      setDirection(null)
    }
  }

  const handlePreview = () => {
    if (onThemePreview && currentTheme) {
      onThemePreview(currentTheme)
    }
  }

  const resetSwiper = () => {
    setCurrentIndex(0)
    controls.set({ x: 0, opacity: 1 })
    setDirection(null)
  }

  if (currentIndex >= themes.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">すべてのテーマを確認しました！</h3>
        <p className="text-gray-600">気に入ったテーマは見つかりましたか？</p>
        <Button onClick={resetSwiper} className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          もう一度見る
        </Button>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] flex flex-col">
      {/* Card Stack */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Next card (background) */}
        {nextTheme && (
          <Card className="absolute w-full h-[450px] bg-white shadow-lg transform scale-95 opacity-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{nextTheme.name}</CardTitle>
              <CardDescription className="text-sm">{nextTheme.description}</CardDescription>
            </CardHeader>
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
            style={{ 
              borderColor: currentTheme?.colorPalette.primary,
              backgroundColor: currentTheme?.colorPalette.surface 
            }}
          >
            <CardHeader className="pb-4">
              <CardTitle 
                className="text-xl font-bold"
                style={{ color: currentTheme?.colorPalette.text }}
              >
                {currentTheme?.name}
              </CardTitle>
              <CardDescription 
                className="text-sm leading-relaxed"
                style={{ color: currentTheme?.colorPalette.textSecondary }}
              >
                {currentTheme?.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Color Palette */}
              <div>
                <h4 
                  className="text-sm font-semibold mb-2"
                  style={{ color: currentTheme?.colorPalette.text }}
                >
                  カラーパレット
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentTheme && Object.entries(currentTheme.colorPalette).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={`${key}: ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Style Tags */}
              <div>
                <h4 
                  className="text-sm font-semibold mb-2"
                  style={{ color: currentTheme?.colorPalette.text }}
                >
                  スタイルタグ
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentTheme?.styleTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: currentTheme.colorPalette.primary + '20',
                        color: currentTheme.colorPalette.primary,
                        border: `1px solid ${currentTheme.colorPalette.primary}40`
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preview Button */}
              <div className="pt-4">
                <Button 
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  style={{
                    borderColor: currentTheme?.colorPalette.primary,
                    color: currentTheme?.colorPalette.primary
                  }}
                >
                  <Eye className="w-4 h-4" />
                  プレビュー
                </Button>
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
            {currentIndex + 1} / {themes.length}
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
      <div className="absolute top-8 left-8 right-8 flex justify-between pointer-events-none">
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
    </div>
  )
}