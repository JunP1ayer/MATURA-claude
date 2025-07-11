/**
 * 高品質UIテンプレート集
 * 
 * モダンで洗練されたUIパターンを提供
 * 各テンプレートは以下の基準を満たす：
 * - アニメーション豊富
 * - レスポンシブ対応
 * - アクセシビリティ考慮
 * - カラーカスタマイズ可能
 */

import { AppRequirement } from './types'

interface UITemplate {
  name: string
  category: string
  components: string[]
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  features: string[]
}

export const modernUITemplates: Record<string, UITemplate> = {
  dashboard: {
    name: 'モダンダッシュボード',
    category: 'business',
    components: ['Card', 'Chart', 'Table', 'Badge', 'Progress'],
    colorScheme: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#F59E0B',
      background: '#F8FAFC',
      foreground: '#0F172A'
    },
    features: ['リアルタイムデータ', 'インタラクティブチャート', 'フィルター機能']
  },
  
  landingPage: {
    name: 'ランディングページ',
    category: 'marketing',
    components: ['Hero', 'Feature', 'Testimonial', 'CTA', 'Footer'],
    colorScheme: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      foreground: '#FFFFFF'
    },
    features: ['スクロールアニメーション', 'パララックス効果', 'グラデーション背景']
  },
  
  socialApp: {
    name: 'ソーシャルアプリ',
    category: 'social',
    components: ['Post', 'Comment', 'Profile', 'Feed', 'Story'],
    colorScheme: {
      primary: '#10B981',
      secondary: '#3B82F6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#111827'
    },
    features: ['リアルタイム更新', 'いいねアニメーション', 'インフィニットスクロール']
  },
  
  ecommerce: {
    name: 'ECサイト',
    category: 'business',
    components: ['ProductCard', 'Cart', 'Filter', 'Review', 'Checkout'],
    colorScheme: {
      primary: '#DC2626',
      secondary: '#F97316',
      accent: '#FBBF24',
      background: '#FEFEFE',
      foreground: '#18181B'
    },
    features: ['商品フィルター', 'カート機能', '3Dプレビュー']
  }
}

export function generateEnhancedUIComponent(componentType: string, colorScheme: any): string {
  switch (componentType) {
    case 'Hero':
      return `
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
          style={{ background: '${colorScheme.background}' }}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 animate-gradient" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30"
            />
          </div>
          
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
            >
              次世代の体験を、今ここに
            </motion.h1>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 text-white/80"
            >
              革新的なソリューションで、あなたのビジネスを加速させます
            </motion.p>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-white/90 transform hover:scale-105 transition-all duration-200"
              >
                無料で始める
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                デモを見る
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </motion.section>
      `
      
    case 'FeatureCard':
      return `
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="group relative p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-3 text-gray-900">革新的な機能</h3>
            <p className="text-gray-600 mb-4">
              最新のテクノロジーを活用した、次世代の機能を提供します
            </p>
            
            <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform">
              詳しく見る
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </div>
          
          <motion.div
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      `
      
    case 'InteractiveButton':
      return `
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-8 py-4 rounded-full font-semibold text-white overflow-hidden group"
          style={{ backgroundColor: '${colorScheme.primary}' }}
        >
          <span className="relative z-10">アクションを実行</span>
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      `
      
    default:
      return ''
  }
}

export function generateModernLayout(appType: string, requirements: AppRequirement): string {
  const template = Object.values(modernUITemplates).find(t => 
    t.category === requirements.category || 
    appType.toLowerCase().includes(t.name.toLowerCase())
  ) || modernUITemplates.dashboard
  
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
  Sparkles, 
  ArrowRight, 
  ChevronDown, 
  BarChart3, 
  Users, 
  TrendingUp,
  Activity,
  Menu,
  X
} from 'lucide-react'

export default function ${requirements.appType.replace(/\s+/g, '')}() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* モダンなヘッダー */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                ${requirements.appType}
              </h1>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              ${requirements.features.slice(0, 4).map((feature, i) => `
              <motion.a
                href="#"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                whileHover={{ y: -2 }}
              >
                ${feature}
              </motion.a>
              `).join('')}
            </nav>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="pt-20">
        ${generateEnhancedUIComponent('Hero', template.colorScheme)}
        
        {/* 統計セクション */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">圧倒的な成果</h2>
              <p className="text-xl text-gray-600">数字が物語る、確かな実績</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Users, label: 'アクティブユーザー', value: '10,000+', color: 'text-blue-600' },
                { icon: TrendingUp, label: '成長率', value: '250%', color: 'text-green-600' },
                { icon: Activity, label: '稼働率', value: '99.9%', color: 'text-purple-600' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300">
                    <stat.icon className={\`w-12 h-12 mx-auto mb-4 \${stat.color}\`} />
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 機能セクション */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">主要機能</h2>
              <p className="text-xl text-gray-600">あなたの業務を革新する機能群</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${requirements.features.map((feature, i) => `
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={${i}}
                >
                  ${generateEnhancedUIComponent('FeatureCard', template.colorScheme).replace('革新的な機能', feature)}
                </motion.div>
              `).join('')}
            </div>
          </div>
        </section>

        {/* インタラクティブデモ */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="text-2xl">インタラクティブデモ</CardTitle>
                <CardDescription className="text-white/80">
                  実際の操作感をお試しください
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">概要</TabsTrigger>
                    <TabsTrigger value="analytics">分析</TabsTrigger>
                    <TabsTrigger value="settings">設定</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-8">
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">進捗状況</span>
                          <span className="text-sm text-gray-600">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">今日の成果</p>
                              <p className="text-2xl font-bold">+24%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-600" />
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">アクティブ</p>
                              <p className="text-2xl font-bold">1,234</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                          </div>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="mt-8">
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <BarChart3 className="h-16 w-16 text-gray-400" />
                      <p className="ml-4 text-gray-600">チャートエリア</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-8">
                    <div className="space-y-4">
                      <Input placeholder="設定項目1" />
                      <Input placeholder="設定項目2" />
                      <Button className="w-full">設定を保存</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="mb-4">© 2024 ${requirements.appType}. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-gray-300 transition-colors">利用規約</a>
            <a href="#" className="hover:text-gray-300 transition-colors">プライバシー</a>
            <a href="#" className="hover:text-gray-300 transition-colors">お問い合わせ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}`
}