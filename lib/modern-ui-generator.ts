/**
 * モダンUI生成器
 * 高品質で洗練されたUIを生成する専用モジュール
 */

import { AppRequirement } from './types'

export function generateModernUI(requirements: AppRequirement): string {
  const { appType, description, features, primaryColor = '#3B82F6' } = requirements
  
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

export default function ${appType.replace(/\s+/g, '')}() {
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