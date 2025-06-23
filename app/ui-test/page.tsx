'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// Simplified UIStyle interface
interface UIStyle {
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

// Mock UI styles data
const UI_STYLES: UIStyle[] = [
  {
    id: 'soft-cards',
    name: 'Soft Cards',
    description: '角丸で優しいグラデーション。ユーザーフレンドリーなアプリに最適。',
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
    description: 'シンプルで洗練されたデザイン。ビジネスアプリに最適。',
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
    description: 'ガラスのような透明感とブラー効果。モダンでスタイリッシュ。',
    image: '/ui_samples/glass-ui.svg',
    tags: ['Modern', 'Stylish', 'Premium'],
    colors: {
      primary: '#3b82f6',
      secondary: '#ec4899',
      accent: 'rgba(255,255,255,0.2)'
    }
  }
]

export default function UITestPage() {
  const [selectedStyle, setSelectedStyle] = useState<UIStyle | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleStyleSelected = (style: UIStyle) => {
    setSelectedStyle(style)
    console.log('選択されたUIスタイル:', style)
  }

  const handleNext = () => {
    if (currentIndex < UI_STYLES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReset = () => {
    setSelectedStyle(null)
    setCurrentIndex(0)
  }

  if (selectedStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-blue-500 hover:underline">
              ← ホームに戻る
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">UIスタイル選択完了</h1>
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              リセット
            </button>
          </div>

          {/* Result Display */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">選択されたスタイル</h2>
            
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={selectedStyle.image} 
                  alt={selectedStyle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{selectedStyle.name}</h3>
                <p className="text-gray-600 mb-4">{selectedStyle.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedStyle.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Color Palette */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">カラーパレット</h4>
                  <div className="flex gap-3">
                    {Object.entries(selectedStyle.colors).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div 
                          className="w-8 h-8 rounded border border-gray-200 mb-1"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-gray-600">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* JSON Display */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">データ（JSON）</h4>
              <pre className="text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify(selectedStyle, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentStyle = UI_STYLES[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-blue-500 hover:underline">
            ← ホーム
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">UIスタイル選択</h1>
            <p className="text-sm text-gray-600">
              {currentIndex + 1} / {UI_STYLES.length}
            </p>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / UI_STYLES.length) * 100}%` }}
          />
        </div>

        {/* Style Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="aspect-video bg-gray-100">
            <img 
              src={currentStyle.image} 
              alt={currentStyle.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{currentStyle.name}</h2>
            <p className="text-gray-600 mb-4">{currentStyle.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentStyle.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Color Palette */}
            <div className="flex gap-2">
              {Object.values(currentStyle.colors).map((color, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前へ
          </button>
          <button
            onClick={() => handleStyleSelected(currentStyle)}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
          >
            このスタイルを選択
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === UI_STYLES.length - 1}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </div>

        {/* Skip Button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            スキップ
          </button>
        </div>
      </div>
    </div>
  )
}