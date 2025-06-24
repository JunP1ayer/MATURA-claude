'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// Simplified UI Style Interface
interface UIStyle {
  id: string
  name: string
  description: string
  category: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  personality: string[]
}

// High-Quality UI Styles
const BEAUTIFUL_UI_STYLES: UIStyle[] = [
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: '洗練されたグラデーションと柔らかな影で、現代的で親しみやすい印象を与えます',
    category: 'modern',
    colors: {
      primary: '#6366f1',
      secondary: '#a855f7',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937'
    },
    personality: ['親しみやすい', 'モダン', '信頼感']
  },
  {
    id: 'minimal-zen',
    name: 'Minimal Zen',
    description: '余白を活かしたミニマルデザイン。無駄を省き、本質に集中できる美しさ',
    category: 'minimal',
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    },
    personality: ['シンプル', '洗練', '集中']
  },
  {
    id: 'luxury-dark',
    name: 'Luxury Dark',
    description: 'プレミアム感溢れるダークテーマ。金のアクセントが高級感を演出',
    category: 'luxury',
    colors: {
      primary: '#fbbf24',
      secondary: '#f3f4f6',
      accent: '#fcd34d',
      background: '#111827',
      text: '#f9fafb'
    },
    personality: ['高級感', 'プレミアム', '特別感']
  },
  {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    description: '鮮やかな色彩とダイナミックな要素で創造性とエネルギーを表現',
    category: 'creative',
    colors: {
      primary: '#ef4444',
      secondary: '#06b6d4',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937'
    },
    personality: ['創造的', 'エネルギッシュ', '革新的']
  },
  {
    id: 'professional-corporate',
    name: 'Professional Corporate',
    description: 'ビジネスシーンに最適な、信頼性と専門性を重視したデザイン',
    category: 'professional',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#059669',
      background: '#f8fafc',
      text: '#0f172a'
    },
    personality: ['信頼性', '専門性', '安定感']
  },
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    description: 'ガラスのような透明感と奥行きで、未来的で洗練された体験',
    category: 'modern',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff'
    },
    personality: ['未来的', '洗練', '革新']
  }
]

// Mini UI Preview Component
interface UIPreviewProps {
  style: UIStyle
}

const UIPreview: React.FC<UIPreviewProps> = ({ style }) => {
  const isGlass = style.id === 'glass-morphism'
  const isDark = style.id === 'luxury-dark'
  
  return (
    <div 
      className="relative w-full h-64 rounded-xl overflow-hidden shadow-xl"
      style={{
        background: style.colors.background.includes('gradient') 
          ? style.colors.background 
          : style.colors.background
      }}
    >
      {/* Background Pattern for Glass */}
      {isGlass && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-16 h-16 bg-white/30 rounded-full blur-xl" />
          <div className="absolute bottom-8 right-8 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
        </div>
      )}
      
      {/* Mini Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        isDark ? "border-gray-700/50" : "border-gray-200/50"
      } ${isGlass ? "backdrop-blur-sm bg-white/10 border-white/20" : ""}`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isGlass ? "bg-white/60" : isDark ? "bg-gray-400" : "bg-gray-300"
          }`} />
          <div className={`w-16 h-2 rounded ${
            isGlass ? "bg-white/40" : isDark ? "bg-gray-600" : "bg-gray-200"
          }`} />
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                isGlass ? "bg-white/40" : isDark ? "bg-gray-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div
          className="h-4 rounded"
          style={{ 
            backgroundColor: isGlass ? 'rgba(255,255,255,0.7)' : 
                           isDark ? '#6b7280' : '#e5e7eb',
            width: '60%'
          }}
        />
        
        {/* Subtitle */}
        <div
          className="h-2 rounded"
          style={{ 
            backgroundColor: isGlass ? 'rgba(255,255,255,0.5)' : 
                           isDark ? '#4b5563' : '#d1d5db',
            width: '40%'
          }}
        />

        {/* Card Element */}
        <div className={`p-3 rounded-lg space-y-2 mt-4 ${
          isGlass ? "backdrop-blur-sm bg-white/10 border border-white/20" :
          isDark ? "bg-gray-800/50 border border-gray-700/50" :
          "bg-white shadow-sm border border-gray-100"
        }`}>
          <div
            className="h-2 rounded"
            style={{ 
              backgroundColor: style.colors.primary,
              width: '70%'
            }}
          />
          <div
            className="h-2 rounded"
            style={{ 
              backgroundColor: isGlass ? 'rgba(255,255,255,0.4)' : 
                             isDark ? '#6b7280' : '#e5e7eb',
              width: '50%'
            }}
          />
        </div>

        {/* Action Elements */}
        <div className="flex gap-2 mt-4">
          <div
            className="flex-1 h-6 rounded-md flex items-center justify-center text-[8px] font-medium text-white"
            style={{ backgroundColor: style.colors.primary }}
          >
            Action
          </div>
          <div
            className={`flex-1 h-6 rounded-md border flex items-center justify-center text-[8px] font-medium ${
              isGlass ? "border-white/30 text-white/80" :
              isDark ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
            }`}
          >
            Cancel
          </div>
        </div>
      </div>

      {/* Accent Element */}
      <div 
        className="absolute top-2 right-2 w-2 h-6 rounded-full"
        style={{ backgroundColor: style.colors.accent }}
      />
    </div>
  )
}

export default function UICleanPage() {
  const [selectedStyle, setSelectedStyle] = useState<UIStyle | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleStyleSelected = (style: UIStyle) => {
    setSelectedStyle(style)
    setShowResult(true)
    console.log('🎨 Clean UI Style Selected:', style)
  }

  const handleReset = () => {
    setSelectedStyle(null)
    setShowResult(false)
  }

  if (showResult && selectedStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-sm font-medium text-emerald-800">Selection Complete</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">素晴らしい選択です！</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              <span className="font-semibold text-emerald-600">{selectedStyle.name}</span> スタイルで
              あなたのアプリケーションを美しく構築していきます
            </p>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedStyle.name}</h2>
                  <p className="text-emerald-100 text-lg">{selectedStyle.description}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Style Preview */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">スタイルプレビュー</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <UIPreview style={selectedStyle} />
                  </div>
                </div>

                {/* Style Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">デザインの特徴</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStyle.personality.map((trait) => (
                        <span
                          key={trait}
                          className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm rounded-full font-medium"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">カラーパレット</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(selectedStyle.colors)
                        .filter(([key]) => ['primary', 'secondary', 'accent'].includes(key))
                        .map(([key, color]) => (
                        <div key={key} className="text-center">
                          <div
                            className="w-full h-16 rounded-xl border-2 border-white shadow-lg mb-2"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                          <div className="text-xs text-gray-500 font-mono">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* JSON Output */}
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">選択データ（開発者向け）</h3>
            </div>
            <div className="p-6">
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                  {JSON.stringify(selectedStyle, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReset}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← 別のスタイルを選択
            </button>
            
            <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-colors">
              このスタイルでMATURAを開始
            </button>
            
            <Link href="/">
              <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                メインページに戻る
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  ← ホーム
                </button>
              </Link>
              <div>
                <h1 className="font-semibold text-gray-900">Clean UIスタイル選択</h1>
                <p className="text-sm text-gray-600">美しいUIデザインを選択してください</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              ✨ Beautiful UI Templates
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-sm font-medium text-blue-800">UI Style Selection</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            あなたのアプリにぴったりの
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              UIスタイルを選択
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ブランドの個性とユーザー体験を最適化する、
            美しくデザインされたUIスタイルテンプレートから選択してください
          </p>
        </div>

        {/* Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BEAUTIFUL_UI_STYLES.map((style) => {
            const isSelected = selectedStyle?.id === style.id

            return (
              <div
                key={style.id}
                className={`group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 ${
                  isSelected ? 'scale-105' : ''
                }`}
                onClick={() => handleStyleSelected(style)}
              >
                <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 border-2 bg-white shadow-lg hover:shadow-xl ${
                  isSelected 
                    ? "border-blue-500 ring-4 ring-blue-500/10" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 text-xs font-medium text-white rounded-full shadow-lg ${
                      style.category === 'modern' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                      style.category === 'minimal' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                      style.category === 'luxury' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                      style.category === 'creative' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                      'bg-gradient-to-r from-blue-600 to-indigo-700'
                    }`}>
                      {style.category}
                    </span>
                  </div>

                  {/* UI Preview */}
                  <div className="relative">
                    <UIPreview style={style} />
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
                        <span 
                          key={trait}
                          className="px-3 py-1 text-xs border border-gray-200 text-gray-600 rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {/* Color Palette */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Colors
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
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Summary */}
        {selectedStyle && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">
                  {selectedStyle.name} を選択しました
                </p>
                <p className="text-sm text-gray-600">
                  詳細を確認するには上のボタンをクリックしてください
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}