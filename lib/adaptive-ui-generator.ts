/**
 * アダプティブUI生成器
 * ユーザーのアイデアとFigmaデザインシステムに基づいて
 * 毎回ユニークで高品質なUIを動的生成
 */

import { AppRequirement } from './types'

interface DesignPattern {
  name: string
  layout: 'hero-centered' | 'sidebar-nav' | 'card-grid' | 'dashboard' | 'landing'
  colorScheme: 'monochrome' | 'vibrant' | 'pastel' | 'corporate' | 'creative'
  animation: 'subtle' | 'dynamic' | 'playful' | 'professional'
  components: string[]
}

// アイデアタイプに基づく動的デザインパターン
const DESIGN_PATTERNS: Record<string, DesignPattern[]> = {
  'productivity': [
    {
      name: 'Kanban Dashboard',
      layout: 'dashboard',
      colorScheme: 'corporate',
      animation: 'professional',
      components: ['KanbanBoard', 'ProgressRing', 'TaskCard', 'TeamAvatar']
    },
    {
      name: 'Minimal Focus',
      layout: 'hero-centered',
      colorScheme: 'monochrome',
      animation: 'subtle',
      components: ['FocusTimer', 'SimpleCard', 'ProgressBar']
    }
  ],
  'creative': [
    {
      name: 'Portfolio Gallery',
      layout: 'card-grid',
      colorScheme: 'vibrant',
      animation: 'playful',
      components: ['ImageGallery', 'CreativeCard', 'ColorPalette']
    },
    {
      name: 'Studio Workspace',
      layout: 'sidebar-nav',
      colorScheme: 'creative',
      animation: 'dynamic',
      components: ['ToolPalette', 'Canvas', 'LayerPanel']
    }
  ],
  'business': [
    {
      name: 'Analytics Dashboard',
      layout: 'dashboard',
      colorScheme: 'corporate',
      animation: 'professional',
      components: ['Chart', 'MetricCard', 'DataTable', 'Filter']
    },
    {
      name: 'Landing Page',
      layout: 'landing',
      colorScheme: 'corporate',
      animation: 'subtle',
      components: ['Hero', 'FeatureGrid', 'Testimonial', 'CTA']
    }
  ],
  'social': [
    {
      name: 'Feed Interface',
      layout: 'hero-centered',
      colorScheme: 'vibrant',
      animation: 'dynamic',
      components: ['PostCard', 'UserProfile', 'ReactionButton', 'CommentThread']
    },
    {
      name: 'Community Hub',
      layout: 'card-grid',
      colorScheme: 'pastel',
      animation: 'playful',
      components: ['CommunityCard', 'UserAvatar', 'ActivityFeed']
    }
  ]
}

// キーワードベースのパターン選択
const KEYWORD_PATTERNS: Record<string, string> = {
  'タスク': 'productivity',
  '管理': 'productivity',
  'ダッシュボード': 'business',
  '分析': 'business',
  'ポートフォリオ': 'creative',
  'ギャラリー': 'creative',
  'ソーシャル': 'social',
  'コミュニティ': 'social',
  'チャット': 'social',
  'ブログ': 'creative',
  'ショップ': 'business',
  'EC': 'business'
}

export function generateAdaptiveUI(requirements: AppRequirement, figmaData?: any): string {
  // 1. アイデアタイプの自動判定
  const ideaType = detectIdeaType(requirements)
  
  // 2. 利用可能なデザインパターンを取得
  const availablePatterns = DESIGN_PATTERNS[ideaType] || DESIGN_PATTERNS['productivity']
  
  // 3. ランダムまたはFigmaデータに基づいてパターン選択
  const selectedPattern = selectDesignPattern(availablePatterns, figmaData, requirements)
  
  // 4. Figmaカラーの統合
  const colorPalette = figmaData?.designSystem?.colors || generateDefaultColors(selectedPattern.colorScheme)
  
  // 5. 動的UIコード生成
  return generateDynamicUI(requirements, selectedPattern, colorPalette, figmaData)
}

function detectIdeaType(requirements: AppRequirement): string {
  const text = `${requirements.appType} ${requirements.description} ${requirements.features.join(' ')}`.toLowerCase()
  
  // キーワードマッチング
  for (const [keyword, type] of Object.entries(KEYWORD_PATTERNS)) {
    if (text.includes(keyword)) {
      return type
    }
  }
  
  // カテゴリフォールバック
  return requirements.category || 'productivity'
}

function selectDesignPattern(patterns: DesignPattern[], figmaData: any, requirements: AppRequirement): DesignPattern {
  // Figmaデータがある場合、デザインシステムに基づいて選択
  if (figmaData?.designSystem?.style) {
    const figmaStyle = figmaData.designSystem.style.toLowerCase()
    const matchingPattern = patterns.find(p => 
      figmaStyle.includes(p.name.toLowerCase()) || 
      figmaStyle.includes(p.layout) ||
      figmaStyle.includes(p.colorScheme)
    )
    if (matchingPattern) return matchingPattern
  }
  
  // 要件の複雑さに基づいて選択
  if (requirements.features.length > 5) {
    return patterns.find(p => p.layout === 'dashboard') || patterns[0]
  }
  
  // ランダム選択（時間ベースシード）
  const seed = new Date().getHours() + new Date().getDate()
  return patterns[seed % patterns.length]
}

function generateDefaultColors(scheme: string): string[] {
  const colorSchemes = {
    'monochrome': ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'],
    'vibrant': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    'pastel': ['#FFD3E1', '#C7CEEA', '#B5EAD7', '#FFDAC1', '#E2F0CB', '#F7DC6F'],
    'corporate': ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12', '#27AE60', '#9B59B6'],
    'creative': ['#FF69B4', '#00CED1', '#FF1493', '#32CD32', '#FF4500', '#8A2BE2']
  }
  
  return colorSchemes[scheme] || colorSchemes['corporate']
}

function generateDynamicUI(
  requirements: AppRequirement, 
  pattern: DesignPattern, 
  colors: string[], 
  figmaData: any
): string {
  const primaryColor = colors[0] || '#3B82F6'
  const secondaryColor = colors[1] || '#8B5CF6'
  const accentColor = colors[2] || '#EC4899'
  
  // 動的なコンポーネント生成
  const dynamicComponents = generateComponents(pattern, requirements, colors)
  
  return `'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, ArrowRight, Users, TrendingUp, Activity, Menu, X, Plus, Check,
  BarChart3, PieChart, Calendar, Settings, Bell, Search, Filter, Grid3x3,
  Heart, Share, MessageCircle, Star, Eye, Download, Upload, Edit, Trash2
} from 'lucide-react'

export default function ${requirements.appType.replace(/\\s+/g, '')}() {
  const [items, setItems] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(${Math.floor(Math.random() * 40) + 60}), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setItems([...items, {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date().toISOString(),
        category: '${requirements.category}',
        priority: Math.floor(Math.random() * 3) + 1
      }])
      setInputValue('')
    }
  }

  return (
    <div className="min-h-screen ${generateLayoutClasses(pattern)}">
      ${generateHeader(pattern, requirements, primaryColor, secondaryColor)}
      
      <main className="${generateMainClasses(pattern)}">
        ${generateLayoutSections(pattern, requirements, colors, dynamicComponents)}
      </main>
    </div>
  )
}`
}

function generateComponents(pattern: DesignPattern, requirements: AppRequirement, colors: string[]): any {
  // パターンに基づいて動的にコンポーネントを生成
  return {
    heroSection: pattern.layout === 'hero-centered' || pattern.layout === 'landing',
    sidebar: pattern.layout === 'sidebar-nav',
    dashboard: pattern.layout === 'dashboard',
    grid: pattern.layout === 'card-grid',
    animations: pattern.animation,
    colors: colors
  }
}

function generateLayoutClasses(pattern: DesignPattern): string {
  const baseClasses = {
    'hero-centered': 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    'sidebar-nav': 'bg-gray-50',
    'card-grid': 'bg-gradient-to-br from-pink-50 via-white to-yellow-50',
    'dashboard': 'bg-gradient-to-br from-slate-50 via-white to-zinc-50',
    'landing': 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
  }
  
  return baseClasses[pattern.layout] || baseClasses['hero-centered']
}

function generateHeader(pattern: DesignPattern, requirements: AppRequirement, primary: string, secondary: string): string {
  if (pattern.layout === 'sidebar-nav') {
    return `
      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white shadow-xl border-r">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, ${primary}, ${secondary})' }}>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">${requirements.appType}</h1>
            </div>
            <nav className="space-y-2">
              ${requirements.features.slice(0, 6).map(feature => `
              <motion.a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '${primary}' }}></div>
                <span className="text-sm">${feature}</span>
              </motion.a>`).join('')}
            </nav>
          </div>
        </aside>
        <div className="flex-1">`
  }
  
  return `
    {/* Modern Header */}
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-lg opacity-75" style={{ background: 'linear-gradient(135deg, ${primary}, ${secondary})' }}></div>
              <div className="relative p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, ${primary}, ${secondary})' }}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">${requirements.appType}</h1>
          </motion.div>
        </div>
      </div>
    </motion.header>`
}

function generateMainClasses(pattern: DesignPattern): string {
  const classes = {
    'hero-centered': 'container mx-auto px-4 py-8 max-w-4xl',
    'sidebar-nav': 'p-8',
    'card-grid': 'container mx-auto px-4 py-8 max-w-7xl',
    'dashboard': 'container mx-auto px-4 py-8 max-w-7xl',
    'landing': 'container mx-auto px-4 py-8 max-w-6xl'
  }
  
  return classes[pattern.layout] || classes['hero-centered']
}

function generateLayoutSections(pattern: DesignPattern, requirements: AppRequirement, colors: string[], components: any): string {
  // パターンに基づいて異なるレイアウトセクションを生成
  const sections = []
  
  if (components.heroSection) {
    sections.push(`
      {/* Dynamic Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          ${generateDynamicTitle(requirements)}
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          ${requirements.description}
        </p>
      </motion.section>`)
  }
  
  // メインコンテンツは常に生成
  sections.push(`
    {/* Dynamic Main Content */}
    <div className="${pattern.layout === 'card-grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}">
      ${generateMainContent(pattern, requirements, colors)}
    </div>`)
  
  return sections.join('\n')
}

function generateDynamicTitle(requirements: AppRequirement): string {
  const titles = [
    `${requirements.appType}で未来を創造`,
    `次世代の${requirements.category}プラットフォーム`,
    `${requirements.appType} - 新しい体験の始まり`,
    `革新的な${requirements.appType}ソリューション`
  ]
  
  return titles[Math.floor(Math.random() * titles.length)]
}

function generateMainContent(pattern: DesignPattern, requirements: AppRequirement, colors: string[]): string {
  // パターンに応じて異なるメインコンテンツを生成
  if (pattern.layout === 'card-grid') {
    return requirements.features.map((feature, i) => `
      <motion.div
        key={${i}}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: ${i * 0.1} }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group"
      >
        <Card className="h-full hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" 
                 style={{ background: 'linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})' }}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="group-hover:text-blue-600 transition-colors">${feature}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              ${feature}の詳細機能説明がここに表示されます。
            </p>
            <Button variant="outline" className="w-full group-hover:border-blue-500">
              詳しく見る <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>`).join('')
  }
  
  // デフォルトレイアウト
  return `
    <div className="lg:col-span-2">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>新規作成</CardTitle>
          <CardDescription>簡単な操作で素早くデータを追加</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                placeholder="ここに入力してください..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pr-24"
              />
              <Button 
                type="submit" 
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ background: 'linear-gradient(135deg, ${colors[0]}, ${colors[1]})' }}
              >
                <Plus className="h-4 w-4 mr-1" />
                追加
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" style={{ color: '${colors[0]}' }} />
            主要機能
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            ${requirements.features.map((feature, i) => `
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ${i * 0.1} }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})' }}></div>
              <span className="text-sm text-gray-700">${feature}</span>
            </motion.div>`).join('')}
          </div>
        </CardContent>
      </Card>
    </div>`
}