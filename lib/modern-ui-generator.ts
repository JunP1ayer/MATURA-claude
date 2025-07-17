/**
 * モダンUI生成器
 * 高品質で洗練されたUIを生成する専用モジュール
 */

import { AppRequirement } from './types'

export function generateModernUI(requirements: AppRequirement): string {
  const { appType, description, features, primaryColor = '#3B82F6' } = requirements
  
  // 各アプリタイプに応じた専用テンプレートを使用
  if (appType.includes('ホテル') || appType.includes('予約') || appType.includes('booking')) {
    return generateHotelBookingSystem(requirements)
  }
  if (appType.includes('EC') || appType.includes('ショップ') || appType.includes('eコマース')) {
    return generateECommerceSystem(requirements)
  }
  if (appType.includes('学習') || appType.includes('教育') || appType.includes('LMS')) {
    return generateLearningSystem(requirements)
  }
  if (appType.includes('タスク') || appType.includes('TODO') || appType.includes('プロジェクト')) {
    return generateTaskManagementSystem(requirements)
  }
  if (appType.includes('ブログ') || appType.includes('CMS') || appType.includes('記事')) {
    return generateBlogSystem(requirements)
  }
  if (appType.includes('SNS') || appType.includes('コミュニティ') || appType.includes('チャット')) {
    return generateSocialSystem(requirements)
  }
  
  // デフォルト：汎用ビジネスアプリテンプレート
  return generateAdaptiveBusinessApp(requirements)
}

// 汎用ビジネスアプリテンプレート（どんなアイデアにも適応）
function generateAdaptiveBusinessApp(requirements: AppRequirement): string {
  const { appType, description, features, primaryColor = '#3B82F6', targetUser = 'ユーザー' } = requirements
  
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
  Users, 
  TrendingUp,
  Activity,
  Menu,
  X,
  Plus,
  Check
} from 'lucide-react'

export default function GeneratedApp() {
  const [items, setItems] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(75), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setItems([...items, {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date().toISOString()
      }])
      setInputValue('')
    }
  }

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* ヘッダー */}
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-lg opacity-75"></div>
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                ${appType}
              </h1>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-6">
              ${features.slice(0, 3).map(feature => `
              <motion.a
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -1 }}
              >
                ${feature}
              </motion.a>`).join('')}
            </nav>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ヒーローセクション */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
            次世代の体験を、今ここに
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ${description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg"
              >
                今すぐ始める
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline"
                className="border-gray-300"
              >
                詳しく見る
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* 統計カード */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Users, label: 'アクティブユーザー', value: '10,000+', color: 'from-blue-500 to-cyan-500' },
            { icon: TrendingUp, label: '成長率', value: '+250%', color: 'from-green-500 to-emerald-500' },
            { icon: Activity, label: '稼働率', value: '99.9%', color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="relative overflow-hidden">
                <div className={\`absolute inset-0 bg-gradient-to-br \${stat.color} opacity-5\`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={\`p-3 rounded-lg bg-gradient-to-br \${stat.color} bg-opacity-10\`}>
                      <stat.icon className={\`h-6 w-6 text-\${stat.color.split('-')[1]}-600\`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 入力フォーム */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>新規作成</CardTitle>
                <CardDescription>
                  簡単な操作で素早くデータを追加
                </CardDescription>
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
                    <motion.div 
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        type="submit" 
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        追加
                      </Button>
                    </motion.div>
                  </div>
                </form>

                {/* タブコンテンツ */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">概要</TabsTrigger>
                    <TabsTrigger value="items">アイテム</TabsTrigger>
                    <TabsTrigger value="analytics">分析</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">全体の進捗</span>
                          <span className="text-sm text-gray-600">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                          <p className="text-sm text-gray-600 mb-1">完了タスク</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {items.filter(item => item.completed).length}
                          </p>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                          <p className="text-sm text-gray-600 mb-1">残りタスク</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {items.filter(item => !item.completed).length}
                          </p>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="items" className="mt-6">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card 
                              className={\`p-4 cursor-pointer transition-all \${
                                item.completed ? 'opacity-60' : ''
                              }\`}
                              onClick={() => toggleItem(item.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={\`w-5 h-5 rounded-full border-2 flex items-center justify-center \${
                                    item.completed 
                                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-500' 
                                      : 'border-gray-300'
                                  }\`}>
                                    {item.completed && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <span className={\`\${item.completed ? 'line-through text-gray-500' : ''}\`}>
                                    {item.text}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </Badge>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {items.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          まだアイテムがありません
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="mt-6">
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">分析データ</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 機能一覧 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  主要機能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  ${features.map((feature, i) => `
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ${i * 0.1} }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    <span className="text-sm text-gray-700">${feature}</span>
                  </motion.div>`).join('')}
                </div>
              </CardContent>
            </Card>

            {/* CTAカード */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">プレミアムへアップグレード</h3>
                  <p className="text-sm text-white/80 mb-4">
                    全ての機能を無制限で使用可能
                  </p>
                  <Button 
                    className="w-full bg-white text-purple-600 hover:bg-gray-100"
                  >
                    詳細を見る
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}`
}

// ECサイト専用テンプレート
function generateECommerceSystem(requirements: AppRequirement): string {
  const { description, features, primaryColor = '#059669' } = requirements
  
  return `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart,
  Search,
  Star,
  Heart,
  Filter,
  Grid,
  List,
  Truck,
  Shield,
  CreditCard,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react'

export default function ECommerceSystem() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cartItems, setCartItems] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const featuredProducts = [
    {
      id: 1,
      name: 'プレミアムヘッドフォン',
      price: 24800,
      originalPrice: 32800,
      rating: 4.8,
      reviews: 342,
      image: '/api/placeholder/300/300',
      category: 'electronics',
      inStock: true,
      discount: 25
    },
    {
      id: 2,
      name: 'オーガニックコーヒー豆',
      price: 1980,
      rating: 4.6,
      reviews: 128,
      image: '/api/placeholder/300/300',
      category: 'food',
      inStock: true
    },
    {
      id: 3,
      name: 'デザイナーTシャツ',
      price: 3500,
      rating: 4.4,
      reviews: 89,
      image: '/api/placeholder/300/300',
      category: 'fashion',
      inStock: false
    }
  ]

  const categories = [
    { id: 'all', name: '全て', count: 156 },
    { id: 'electronics', name: '家電・PC', count: 42 },
    { id: 'fashion', name: 'ファッション', count: 38 },
    { id: 'food', name: '食品・飲料', count: 28 },
    { id: 'books', name: '本・雑誌', count: 24 },
    { id: 'sports', name: 'スポーツ', count: 24 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">ECommerce</h1>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="商品を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {cartItems}
                  </Badge>
                )}
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                ログイン
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-4">
              お探しの商品がここに
            </h1>
            <p className="text-xl text-green-100 mb-8">
              {description || '厳選された高品質な商品を、お得な価格でお届けします'}
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                今すぐ購入
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                カタログを見る
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* サイドバー */}
          <div className="w-64 flex-shrink-0">
            {/* カテゴリー */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  カテゴリー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={\`w-full text-left p-2 rounded-lg transition-colors \${
                        selectedCategory === category.id
                          ? 'bg-green-100 text-green-800'
                          : 'hover:bg-gray-100'
                      }\`}
                    >
                      <div className="flex justify-between">
                        <span>{category.name}</span>
                        <span className="text-gray-500 text-sm">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 特徴 */}
            <Card>
              <CardHeader>
                <CardTitle>サービス特徴</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  ${features.map((feature, i) => `
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm">${feature}</span>
                  </div>`).join('')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1">
            {/* ツールバー */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">おすすめ商品</h2>
                <Badge variant="outline">{featuredProducts.length}件</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 商品一覧 */}
            <div className={\`grid gap-6 \${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }\`}>
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square bg-gray-200 relative">
                      {product.discount && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          -{product.discount}%
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">{product.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/20 hover:bg-white/30"
                      >
                        <Heart className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{product.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-green-600">
                            ¥{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ¥{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Badge variant={product.inStock ? "default" : "secondary"}>
                          {product.inStock ? '在庫あり' : '在庫切れ'}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={!product.inStock}
                          onClick={() => setCartItems(cartItems + 1)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          カートに追加
                        </Button>
                        <Button variant="outline" size="sm">
                          詳細
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ECommerce</h3>
              <p className="text-gray-400">
                {description || '高品質な商品をお得な価格でお届けする総合ECサイト'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サービス</h4>
              <ul className="space-y-2 text-gray-400">
                <li>商品検索</li>
                <li>オンライン決済</li>
                <li>配送追跡</li>
                <li>返品・交換</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li>よくある質問</li>
                <li>お問い合わせ</li>
                <li>配送について</li>
                <li>返品ポリシー</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">安心・安全</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  SSL暗号化
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  安全決済
                </div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  迅速配送
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ECommerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}`
}

// 学習管理システム専用テンプレート
function generateLearningSystem(requirements: AppRequirement): string {
  const { description, features, primaryColor = '#7C3AED' } = requirements
  
  return `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Users,
  Award,
  Search,
  Filter,
  Star,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'

export default function LearningSystem() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [completedCourses, setCompletedCourses] = useState(2)
  const [totalProgress, setTotalProgress] = useState(65)

  const courses = [
    {
      id: 1,
      title: 'React基礎コース',
      instructor: '田中先生',
      progress: 75,
      duration: '8時間',
      students: 1250,
      rating: 4.8,
      difficulty: 'beginner',
      category: 'programming',
      completed: false
    },
    {
      id: 2,
      title: 'TypeScript完全攻略',
      instructor: '佐藤先生',
      progress: 100,
      duration: '12時間',
      students: 890,
      rating: 4.9,
      difficulty: 'intermediate',
      category: 'programming',
      completed: true
    },
    {
      id: 3,
      title: 'UI/UXデザイン入門',
      instructor: '山田先生',
      progress: 30,
      duration: '6時間',
      students: 2100,
      rating: 4.7,
      difficulty: 'beginner',
      category: 'design',
      completed: false
    }
  ]

  const categories = [
    { id: 'all', name: '全て', count: 156 },
    { id: 'programming', name: 'プログラミング', count: 42 },
    { id: 'design', name: 'デザイン', count: 38 },
    { id: 'business', name: 'ビジネス', count: 28 },
    { id: 'language', name: '語学', count: 24 },
    { id: 'marketing', name: 'マーケティング', count: 24 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LearnHub</h1>
                <p className="text-sm text-gray-600">あなたの学習パートナー</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="コースを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Award className="h-5 w-5 mr-2" />
                成績
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                ダッシュボード
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-bold mb-4">
                学びの可能性を
                <br />無限に広げよう
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                {description || '専門講師による質の高いオンライン学習で、あなたのスキルアップを支援します'}
              </p>
              <div className="flex space-x-4">
                <Button className="bg-white text-purple-600 hover:bg-gray-100">
                  学習を始める
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  コース一覧
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{totalProgress}%</div>
                  <div className="text-purple-100 text-sm">学習進捗</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{completedCourses}</div>
                  <div className="text-purple-100 text-sm">完了コース</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">24</div>
                  <div className="text-purple-100 text-sm">学習時間</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">5</div>
                  <div className="text-purple-100 text-sm">獲得バッジ</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* サイドバー */}
          <div className="w-64 flex-shrink-0">
            {/* カテゴリー */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  カテゴリー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={\`w-full text-left p-2 rounded-lg transition-colors \${
                        selectedCategory === category.id
                          ? 'bg-purple-100 text-purple-800'
                          : 'hover:bg-gray-100'
                      }\`}
                    >
                      <div className="flex justify-between">
                        <span>{category.name}</span>
                        <span className="text-gray-500 text-sm">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 学習統計 */}
            <Card>
              <CardHeader>
                <CardTitle>今週の学習</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">目標達成</span>
                      <span className="text-sm font-semibold">{totalProgress}%</span>
                    </div>
                    <Progress value={totalProgress} className="h-2" />
                  </div>
                  
                  ${features.map((feature, i) => `
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">${feature}</span>
                  </div>`).join('')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1">
            {/* セクションヘッダー */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">おすすめコース</h2>
                <p className="text-gray-600">あなたにぴったりの学習コンテンツ</p>
              </div>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                学習カレンダー
              </Button>
            </div>

            {/* コース一覧 */}
            <div className="grid gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            {course.completed && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                完了
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {course.difficulty === 'beginner' ? '初級' : 
                               course.difficulty === 'intermediate' ? '中級' : '上級'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4">講師: {course.instructor}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.duration}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              {course.students}人
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-4 w-4 mr-1 text-yellow-400" />
                              {course.rating}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {course.progress}%完了
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600">進捗</span>
                              <span className="text-sm font-semibold">{course.progress}%</span>
                            </div>
                            <Progress 
                              value={course.progress} 
                              className={\`h-2 \${
                                course.completed ? 'bg-green-100' : 'bg-purple-100'
                              }\`}
                            />
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col space-y-2">
                          <Button 
                            className={\`\${
                              course.completed 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-purple-600 hover:bg-purple-700'
                            }\`}
                          >
                            {course.completed ? (
                              <>
                                <Award className="h-4 w-4 mr-2" />
                                復習する
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                続きから
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            詳細
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LearnHub</h3>
              <p className="text-gray-400">
                {description || 'オンライン学習プラットフォームで、いつでもどこでも学習できます'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サービス</h4>
              <ul className="space-y-2 text-gray-400">
                <li>オンラインコース</li>
                <li>ライブセッション</li>
                <li>進捗管理</li>
                <li>修了証明書</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li>よくある質問</li>
                <li>お問い合わせ</li>
                <li>学習ガイド</li>
                <li>技術サポート</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">コミュニティ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>学習者フォーラム</li>
                <li>勉強会</li>
                <li>成果発表</li>
                <li>ネットワーキング</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}`
}

// タスク管理システム専用テンプレート
function generateTaskManagementSystem(requirements: AppRequirement): string {
  const { description, features, primaryColor = '#F59E0B' } = requirements
  
  return `'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus,
  Check,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Flag,
  User,
  Target,
  TrendingUp
} from 'lucide-react'

export default function TaskManagementSystem() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'プロジェクト企画書の作成',
      description: '新プロジェクトの企画書を作成する',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-02-15',
      assignee: '田中',
      category: 'planning',
      completed: false
    },
    {
      id: 2,
      title: 'デザインレビュー',
      description: 'UIデザインの最終確認を行う',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-02-12',
      assignee: '佐藤',
      category: 'design',
      completed: false
    },
    {
      id: 3,
      title: 'バグ修正',
      description: 'ログイン機能のバグを修正',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-02-10',
      assignee: '山田',
      category: 'development',
      completed: true
    }
  ])
  
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const statusOptions = [
    { value: 'all', label: '全て', count: tasks.length },
    { value: 'todo', label: '未着手', count: tasks.filter(t => t.status === 'todo').length },
    { value: 'in-progress', label: '進行中', count: tasks.filter(t => t.status === 'in-progress').length },
    { value: 'completed', label: '完了', count: tasks.filter(t => t.completed).length }
  ]

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
  }

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignee: 'あなた',
        category: 'general',
        completed: false
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle('')
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, status: !task.completed ? 'completed' : 'todo' }
        : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter || (filter === 'completed' && task.completed)
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const completionRate = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-sm text-gray-600">効率的なタスク管理</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="タスクを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Calendar className="h-5 w-5 mr-2" />
                カレンダー
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                新規タスク
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ダッシュボード */}
      <section className="py-8 bg-gradient-to-r from-orange-500 to-yellow-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{tasks.length}</div>
                <div className="text-orange-100 text-sm">総タスク数</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{tasks.filter(t => t.completed).length}</div>
                <div className="text-orange-100 text-sm">完了タスク</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{tasks.filter(t => t.status === 'in-progress').length}</div>
                <div className="text-orange-100 text-sm">進行中</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{completionRate}%</div>
                <div className="text-orange-100 text-sm">完了率</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">今週の進捗</span>
              <span className="text-orange-100">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3 bg-white/20" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* サイドバー */}
          <div className="w-64 flex-shrink-0">
            {/* 新規タスク作成 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  クイック追加
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input
                    placeholder="新しいタスク..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <Button onClick={addTask} className="w-full bg-orange-500 hover:bg-orange-600">
                    追加
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* フィルター */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  フィルター
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={\`w-full text-left p-2 rounded-lg transition-colors \${
                        filter === option.value
                          ? 'bg-orange-100 text-orange-800'
                          : 'hover:bg-gray-100'
                      }\`}
                    >
                      <div className="flex justify-between">
                        <span>{option.label}</span>
                        <span className="text-gray-500 text-sm">({option.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 機能一覧 */}
            <Card>
              <CardHeader>
                <CardTitle>主要機能</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  ${features.map((feature, i) => `
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">${feature}</span>
                  </div>`).join('')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1">
            {/* セクションヘッダー */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">タスク一覧</h2>
                <p className="text-gray-600">{filteredTasks.length}件のタスク</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  期限順
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  優先度順
                </Button>
              </div>
            </div>

            {/* タスクリスト */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card className={\`overflow-hidden hover:shadow-lg transition-all duration-300 \${
                      task.completed ? 'opacity-75' : ''
                    }\`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={\`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors \${
                              task.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-orange-500'
                            }\`}
                          >
                            {task.completed && <Check className="h-4 w-4 text-white" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={\`text-lg font-semibold \${
                                  task.completed ? 'line-through text-gray-500' : ''
                                }\`}>
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                )}
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-3">
                              <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                                {task.status === 'todo' ? '未着手' :
                                 task.status === 'in-progress' ? '進行中' : '完了'}
                              </Badge>
                              <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                                {task.priority === 'high' ? '高' :
                                 task.priority === 'medium' ? '中' : '低'}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                {task.dueDate}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="h-4 w-4 mr-1" />
                                {task.assignee}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>該当するタスクがありません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TaskFlow</h3>
              <p className="text-gray-400">
                {description || 'シンプルで効率的なタスク管理システム'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">機能</h4>
              <ul className="space-y-2 text-gray-400">
                <li>タスク管理</li>
                <li>進捗追跡</li>
                <li>チーム共有</li>
                <li>期限管理</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li>よくある質問</li>
                <li>お問い合わせ</li>
                <li>使い方ガイド</li>
                <li>アップデート情報</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">統計</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  生産性向上
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  目標達成
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  時間節約
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}`
}

// ブログシステム専用テンプレート
function generateBlogSystem(requirements: AppRequirement): string {
  const { description, features, primaryColor = '#DC2626' } = requirements
  
  return `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  PenTool,
  Search,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Filter,
  User,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function BlogSystem() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const articles = [
    {
      id: 1,
      title: 'Next.js 14の新機能について',
      excerpt: 'Next.js 14がリリースされ、多くの新機能が追加されました。App Routerの改善やServer Actionsの安定化など...',
      author: '田中太郎',
      publishDate: '2024-02-15',
      category: 'tech',
      readTime: '5分',
      views: 1250,
      likes: 89,
      comments: 23,
      featured: true
    },
    {
      id: 2,
      title: 'デザインシステムの構築方法',
      excerpt: '効果的なデザインシステムを構築するためのベストプラクティスと実践的なアプローチを紹介します...',
      author: '佐藤花子',
      publishDate: '2024-02-12',
      category: 'design',
      readTime: '8分',
      views: 890,
      likes: 67,
      comments: 15,
      featured: false
    },
    {
      id: 3,
      title: 'TypeScriptの型安全性を活用した開発',
      excerpt: 'TypeScriptの強力な型システムを活用して、より安全で保守性の高いコードを書く方法について...',
      author: '山田次郎',
      publishDate: '2024-02-10',
      category: 'tech',
      readTime: '6分',
      views: 2100,
      likes: 145,
      comments: 42,
      featured: true
    }
  ]

  const categories = [
    { id: 'all', name: '全て', count: articles.length },
    { id: 'tech', name: 'テクノロジー', count: 2 },
    { id: 'design', name: 'デザイン', count: 1 },
    { id: 'business', name: 'ビジネス', count: 0 },
    { id: 'lifestyle', name: 'ライフスタイル', count: 0 }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticle = articles.find(article => article.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechBlog</h1>
                <p className="text-sm text-gray-600">技術と知識の共有</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="記事を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-5 w-5 mr-2" />
                記事一覧
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <PenTool className="h-4 w-4 mr-2" />
                記事を書く
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-pink-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-4">
              知識と経験をシェアしよう
            </h1>
            <p className="text-xl text-red-100 mb-8">
              {description || '技術者によるテクノロジーとデザインに関する最新情報をお届けします'}
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-white text-red-600 hover:bg-gray-100">
                記事を読む
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                著者になる
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 注目記事 */}
      {featuredArticle && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">注目の記事</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3 aspect-video md:aspect-auto bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold p-8 text-center">
                      {featuredArticle.title}
                    </span>
                  </div>
                  <div className="md:w-2/3">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-2 mb-4">
                        <Badge className="bg-red-100 text-red-800">注目記事</Badge>
                        <Badge variant="outline">{featuredArticle.category}</Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4">{featuredArticle.title}</h3>
                      <p className="text-gray-600 mb-6">{featuredArticle.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {featuredArticle.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {featuredArticle.publishDate}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {featuredArticle.readTime}
                          </div>
                        </div>
                        
                        <Button className="bg-red-600 hover:bg-red-700">
                          続きを読む
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* サイドバー */}
          <div className="w-64 flex-shrink-0">
            {/* カテゴリー */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  カテゴリー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={\`w-full text-left p-2 rounded-lg transition-colors \${
                        selectedCategory === category.id
                          ? 'bg-red-100 text-red-800'
                          : 'hover:bg-gray-100'
                      }\`}
                    >
                      <div className="flex justify-between">
                        <span>{category.name}</span>
                        <span className="text-gray-500 text-sm">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 人気記事 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  人気記事
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {articles
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((article, index) => (
                      <div key={article.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-2">{article.title}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Eye className="h-3 w-3 mr-1" />
                            {article.views}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* ブログ機能 */}
            <Card>
              <CardHeader>
                <CardTitle>ブログ機能</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  ${features.map((feature, i) => `
                  <div className="flex items-center space-x-2">
                    <PenTool className="h-4 w-4 text-red-600" />
                    <span className="text-sm">${feature}</span>
                  </div>`).join('')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1">
            {/* セクションヘッダー */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">最新記事</h2>
                <p className="text-gray-600">{filteredArticles.length}件の記事</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  日付順
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  人気順
                </Button>
              </div>
            </div>

            {/* 記事一覧 */}
            <div className="grid gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="outline">{article.category}</Badge>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {article.readTime}
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-semibold mb-3">{article.title}</h3>
                          <p className="text-gray-600 mb-4">{article.excerpt}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {article.author}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {article.publishDate}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {article.views}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {article.likes}
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {article.comments}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col space-y-2">
                          <Button className="bg-red-600 hover:bg-red-700">
                            読む
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {filteredArticles.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>該当する記事がありません</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TechBlog</h3>
              <p className="text-gray-400">
                {description || '技術者によるテクノロジーとデザインの最新情報'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">コンテンツ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>技術記事</li>
                <li>チュートリアル</li>
                <li>ニュース</li>
                <li>レビュー</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li>よくある質問</li>
                <li>お問い合わせ</li>
                <li>執筆ガイド</li>
                <li>利用規約</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">コミュニティ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>著者紹介</li>
                <li>読者フォーラム</li>
                <li>イベント</li>
                <li>ニュースレター</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}`
}

// SNS・コミュニティシステム専用テンプレート
function generateSocialSystem(requirements: AppRequirement): string {
  const { description, features, primaryColor = '#3B82F6' } = requirements
  
  return `'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageCircle,
  Heart,
  Share2,
  Plus,
  Search,
  Bell,
  User,
  Users,
  Bookmark,
  Settings,
  Send,
  Image,
  Smile,
  TrendingUp
} from 'lucide-react'

export default function SocialSystem() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: '田中太郎',
      handle: '@tanaka',
      content: '新しいプロジェクトを開始しました！Next.js 14とTypeScriptを使って、モダンなWebアプリケーションを構築中です。',
      timestamp: '2時間前',
      likes: 24,
      comments: 8,
      shares: 3,
      liked: false,
      bookmarked: false
    },
    {
      id: 2,
      author: '佐藤花子',
      handle: '@hanako_design',
      content: 'デザインシステムの重要性について考えています。一貫性のあるUIは、ユーザー体験を大幅に向上させますね。皆さんはどんなデザインツールを使っていますか？',
      timestamp: '4時間前',
      likes: 42,
      comments: 15,
      shares: 7,
      liked: true,
      bookmarked: true
    },
    {
      id: 3,
      author: '山田次郎',
      handle: '@yamada_dev',
      content: 'TypeScriptの型安全性は本当に素晴らしいです。バグの早期発見と開発効率の向上を実感しています。',
      timestamp: '1日前',
      likes: 67,
      comments: 23,
      shares: 12,
      liked: false,
      bookmarked: false
    }
  ])
  
  const [newPostContent, setNewPostContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const toggleBookmark = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ))
  }

  const addPost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: Date.now(),
        author: 'あなた',
        handle: '@you',
        content: newPostContent,
        timestamp: 'たった今',
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        bookmarked: false
      }
      setPosts([newPost, ...posts])
      setNewPostContent('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SocialHub</h1>
                <p className="text-sm text-gray-600">つながりを深める</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="ユーザーや投稿を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                投稿
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* サイドバー */}
          <div className="lg:col-span-1">
            {/* プロフィール */}
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">あなた</h3>
                <p className="text-gray-600 text-sm">@you</p>
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div>
                    <div className="text-lg font-bold">127</div>
                    <div className="text-xs text-gray-600">投稿</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">1.2k</div>
                    <div className="text-xs text-gray-600">フォロワー</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">589</div>
                    <div className="text-xs text-gray-600">フォロー</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ナビゲーション */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-3" />
                    タイムライン
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-3" />
                    トレンド
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bookmark className="h-4 w-4 mr-3" />
                    ブックマーク
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-3" />
                    コミュニティ
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-3" />
                    設定
                  </Button>
                </nav>
              </CardContent>
            </Card>

            {/* おすすめユーザー */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">おすすめユーザー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['田中太郎', '佐藤花子', '山田次郎'].map((name, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{name}</div>
                          <div className="text-xs text-gray-600">@{name.replace(' ', '_').toLowerCase()}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        フォロー
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* 新規投稿 */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="今何をしていますか？"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="border-none resize-none text-lg placeholder:text-gray-500 focus:ring-0"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="sm">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        onClick={addPost}
                        disabled={!newPostContent.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        投稿
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* タイムライン */}
            <div className="space-y-6">
              <AnimatePresence>
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{post.author}</h3>
                              <span className="text-gray-600 text-sm">{post.handle}</span>
                              <span className="text-gray-500 text-sm">•</span>
                              <span className="text-gray-500 text-sm">{post.timestamp}</span>
                            </div>
                            
                            <p className="text-gray-800 mb-4">{post.content}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-6">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                                  <MessageCircle className="h-4 w-4" />
                                  <span className="text-sm">{post.comments}</span>
                                </button>
                                
                                <button 
                                  onClick={() => toggleLike(post.id)}
                                  className={\`flex items-center space-x-2 transition-colors \${
                                    post.liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                                  }\`}
                                >
                                  <Heart className={\`h-4 w-4 \${post.liked ? 'fill-current' : ''}\`} />
                                  <span className="text-sm">{post.likes}</span>
                                </button>
                                
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                                  <Share2 className="h-4 w-4" />
                                  <span className="text-sm">{post.shares}</span>
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => toggleBookmark(post.id)}
                                className={\`transition-colors \${
                                  post.bookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                                }\`}
                              >
                                <Bookmark className={\`h-4 w-4 \${post.bookmarked ? 'fill-current' : ''}\`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* 右サイドバー */}
          <div className="lg:col-span-1">
            {/* トレンド */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  トレンド
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { tag: '#NextJS', posts: '1.2k件の投稿' },
                    { tag: '#TypeScript', posts: '890件の投稿' },
                    { tag: '#デザイン', posts: '567件の投稿' },
                    { tag: '#Web開発', posts: '432件の投稿' }
                  ].map((trend, index) => (
                    <div key={index} className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                      <div className="font-medium">{trend.tag}</div>
                      <div className="text-sm text-gray-600">{trend.posts}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* アクティビティ */}
            <Card>
              <CardHeader>
                <CardTitle>最近のアクティビティ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  ${features.map((feature, i) => `
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">${feature}</span>
                  </div>`).join('')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SocialHub</h3>
              <p className="text-gray-400">
                {description || '人とのつながりを大切にするソーシャルプラットフォーム'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">機能</h4>
              <ul className="space-y-2 text-gray-400">
                <li>投稿・シェア</li>
                <li>フォロー・フォロワー</li>
                <li>メッセージ機能</li>
                <li>コミュニティ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li>よくある質問</li>
                <li>お問い合わせ</li>
                <li>プライバシー</li>
                <li>利用規約</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">コミュニティ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>ガイドライン</li>
                <li>イベント</li>
                <li>開発者</li>
                <li>パートナー</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SocialHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}`
}

// ホテル予約システム専用テンプレート
function generateHotelBookingSystem(requirements: AppRequirement): string {
  const { description, features, primaryColor = '#1E40AF' } = requirements
  
  return `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar,
  MapPin,
  Star,
  Users,
  Wifi,
  Car,
  Coffee,
  Search,
  Heart,
  Phone,
  Mail,
  Clock,
  CreditCard,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function HotelBookingSystem() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [searchQuery, setSearchQuery] = useState('')

  const featuredHotels = [
    {
      id: 1,
      name: 'グランドホテル東京',
      location: '東京・銀座',
      rating: 4.8,
      price: 28000,
      image: '/api/placeholder/400/300',
      amenities: ['Wifi', 'プール', '駐車場', 'スパ'],
      rooms: 250
    },
    {
      id: 2,
      name: 'オーシャンビューリゾート',
      location: '沖縄・那覇',
      rating: 4.6,
      price: 22000,
      image: '/api/placeholder/400/300',
      amenities: ['オーシャンビュー', 'レストラン', 'ジム'],
      rooms: 180
    },
    {
      id: 3,
      name: 'マウンテンロッジ軽井沢',
      location: '長野・軽井沢',
      rating: 4.5,
      price: 18000,
      image: '/api/placeholder/400/300',
      amenities: ['温泉', '自然散策', '露天風呂'],
      rooms: 120
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HotelBooking</h1>
                <p className="text-sm text-gray-600">最高の宿泊体験をお届け</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                お問い合わせ
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                ログイン
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">
              理想の宿泊先を見つけよう
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              全国の厳選されたホテル・旅館から、あなたにぴったりの宿泊施設をお探しいたします
            </p>
            
            {/* 検索フォーム */}
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">チェックイン</label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">チェックアウト</label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">宿泊人数</label>
                    <select 
                      value={guests} 
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value={1}>1名</option>
                      <option value={2}>2名</option>
                      <option value={3}>3名</option>
                      <option value={4}>4名</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10">
                      <Search className="h-4 w-4 mr-2" />
                      検索
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">なぜHotelBookingが選ばれるのか</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              お客様に最高の宿泊体験をお届けするための特徴
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${features.map((feature, index) => `
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ${index * 0.1} }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">${feature}</h3>
                  <p className="text-gray-600">
                    最高品質の${feature}をご提供いたします
                  </p>
                </CardContent>
              </Card>
            </motion.div>`).join('')}
          </div>
        </div>
      </section>

      {/* おすすめホテル */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">おすすめのホテル</h2>
            <p className="text-gray-600">厳選された人気の宿泊施設</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredHotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">{hotel.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/20 hover:bg-white/30"
                    >
                      <Heart className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {hotel.location}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold ml-1">{hotel.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">¥{hotel.price.toLocaleString()}</span>
                        <span className="text-gray-600 text-sm ml-1">/泊</span>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        詳細を見る
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 予約プロセス */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">簡単3ステップで予約完了</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">検索</h3>
              <p className="text-gray-600">お好みの条件でホテルを検索</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">選択</h3>
              <p className="text-gray-600">理想のホテルと部屋を選択</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">予約</h3>
              <p className="text-gray-600">安全な決済で予約完了</p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HotelBooking</h3>
              <p className="text-gray-400 mb-4">
                ${description || '最高の宿泊体験をお届けするホテル予約システム'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サービス</h4>
              <ul className="space-y-2 text-gray-400">
                <li>ホテル検索</li>
                <li>オンライン予約</li>
                <li>レビュー・評価</li>
                <li>カスタマーサポート</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li>よくある質問</li>
                <li>お問い合わせ</li>
                <li>予約確認</li>
                <li>キャンセル</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">お問い合わせ</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  0120-123-456
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@hotelbooking.jp
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  24時間対応
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HotelBooking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}`
}