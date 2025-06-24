'use client'

import React from 'react'
import Image from 'next/image'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, X, RotateCcw } from 'lucide-react'

export interface UIStyle {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

interface SwipeCardProps {
  uiStyle: UIStyle
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeUp?: () => void
  isTop?: boolean
  zIndex?: number
}

export default function SwipeCard({ 
  uiStyle, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp,
  isTop = false,
  zIndex = 1 
}: SwipeCardProps) {
  const { handlers, transform, opacity } = useSwipeGesture({
    threshold: 80,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp
  })

  return (
    <div
      className={`absolute inset-0 cursor-grab active:cursor-grabbing select-none ${
        isTop ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ 
        zIndex,
        transform: isTop ? transform : `scale(${0.95 - (5 - zIndex) * 0.05})`,
        opacity: isTop ? opacity : 0.7
      }}
      {...(isTop ? handlers : {})}
    >
      <Card className="w-full h-full shadow-2xl border-0 bg-white overflow-hidden">
        <div className="relative h-2/3">
          <Image
            src={uiStyle.image}
            alt={uiStyle.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {uiStyle.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Color palette */}
          <div className="absolute top-4 right-4 flex gap-1">
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: uiStyle.colors.primary }}
            />
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: uiStyle.colors.secondary }}
            />
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: uiStyle.colors.accent }}
            />
          </div>
        </div>

        <CardContent className="p-6 h-1/3 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">{uiStyle.name}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{uiStyle.description}</p>
          </div>

          {/* Action hints */}
          {isTop && (
            <div className="flex justify-between items-center text-xs text-gray-400 mt-4">
              <div className="flex items-center gap-1">
                <X className="w-4 h-4 text-red-400" />
                <span>スワイプして除外</span>
              </div>
              <div className="flex items-center gap-1">
                <RotateCcw className="w-4 h-4 text-blue-400" />
                <span>上で詳細</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-green-400" />
                <span>スワイプして選択</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Swipe indicators */}
      {isTop && (
        <>
          <div 
            className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg opacity-0 transition-opacity"
            style={{ opacity: Math.max(0, -(parseFloat(transform.split('(')[1]?.split('px')[0] || '0'))) / 100 }}
          >
            PASS
          </div>
          <div 
            className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg opacity-0 transition-opacity"
            style={{ opacity: Math.max(0, parseFloat(transform.split('(')[1]?.split('px')[0] || '0')) / 100 }}
          >
            LIKE
          </div>
        </>
      )}
    </div>
  )
}