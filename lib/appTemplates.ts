// アプリタイプ別のテンプレート
export const appTemplates = {
  finance: () => `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Wallet, TrendingUp, TrendingDown, PlusCircle, MinusCircle } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
}

export default function FinanceApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 300000,
      category: '給与',
      description: '月給',
      date: '2024-01-01'
    },
    {
      id: '2',
      type: 'expense',
      amount: 50000,
      category: '食費',
      description: 'スーパーでの買い物',
      date: '2024-01-02'
    }
  ])
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: ''
  })
  
  const incomeCategories = ['給与', 'ボーナス', '副業', 'その他収入']
  const expenseCategories = ['食費', '住居費', '交通費', '娯楽費', 'その他支出']
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 11),
      type: formData.type,
      amount: parseInt(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date().toISOString().split('T')[0]
    }
    
    setTransactions([newTransaction, ...transactions])
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: ''
    })
  }
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpense
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Wallet className="h-8 w-8 text-green-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              家計簿アプリ
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">収入</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ¥{totalIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">支出</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ¥{totalExpense.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">残高</CardTitle>
              <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={\`text-2xl font-bold \${balance >= 0 ? 'text-blue-600' : 'text-red-600'}\`}>
                ¥{balance.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 取引追加フォーム */}
          <Card>
            <CardHeader>
              <CardTitle>新しい取引を追加</CardTitle>
              <CardDescription>収入または支出を記録してください</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">種類</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'income' | 'expense') => 
                      setFormData({...formData, type: value, category: ''})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">収入</SelectItem>
                      <SelectItem value="expense">支出</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="amount">金額</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">カテゴリ</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">説明</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  取引を追加
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* 取引履歴 */}
          <Card>
            <CardHeader>
              <CardTitle>取引履歴</CardTitle>
              <CardDescription>最近の取引一覧</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {transaction.type === 'income' ? (
                        <PlusCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <MinusCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{transaction.category}</Badge>
                          <span className="text-sm text-gray-500">{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className={\`font-bold \${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}\`}>
                      {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}`,

  recipe: () => `'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Clock, Flame, ChefHat, X } from 'lucide-react'

interface Recipe {
  id: string
  name: string
  ingredients: string[]
  instructions: string
  prepTime: number
  cookTime: number
  calories: number
  category: string
  tags: string[]
  createdAt: string
}

export default function RecipeApp() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'チキンカレー',
      ingredients: ['鶏肉', '玉ねぎ', 'カレールー', 'じゃがいも', 'にんじん'],
      instructions: '1. 野菜と肉を切る\\n2. 炒める\\n3. 煮込む\\n4. カレールーを加える',
      prepTime: 15,
      cookTime: 30,
      calories: 450,
      category: 'メイン',
      tags: ['カレー', '肉料理'],
      createdAt: '2024-01-15'
    }
  ])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    calories: '',
    category: 'メイン',
    tags: ''
  })
  
  const categories = ['メイン', '副菜', 'スープ', 'デザート', 'サラダ', 'その他']
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newRecipe: Recipe = {
      id: Math.random().toString(36).substring(2, 11),
      name: formData.name,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
      instructions: formData.instructions,
      prepTime: parseInt(formData.prepTime) || 0,
      cookTime: parseInt(formData.cookTime) || 0,
      calories: parseInt(formData.calories) || 0,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setRecipes([newRecipe, ...recipes])
    setShowForm(false)
    setFormData({
      name: '',
      ingredients: '',
      instructions: '',
      prepTime: '',
      cookTime: '',
      calories: '',
      category: 'メイン',
      tags: ''
    })
  }
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                レシピ管理アプリ
              </h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              新しいレシピ
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="レシピを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              すべて
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="h-full">
              <CardHeader>
                <Badge variant="secondary">{recipe.category}</Badge>
                <CardTitle>{recipe.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recipe.prepTime + recipe.cookTime}分
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {recipe.calories}kcal
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>材料:</strong> {recipe.ingredients.join('、')}</p>
                <p className="text-sm whitespace-pre-line">{recipe.instructions}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}`,

  task: () => `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, Circle, Calendar, AlertCircle, Plus, Filter } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
}

export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'プロジェクト企画書作成',
      description: '新しいプロジェクトの企画書を作成する',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-20',
      createdAt: '2024-01-10'
    }
  ])
  
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 11),
      title: formData.title,
      description: formData.description,
      status: 'todo',
      priority: formData.priority,
      dueDate: formData.dueDate,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setTasks([newTask, ...tasks])
    setShowForm(false)
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    })
  }
  
  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const statusMap = {
          'todo': 'in-progress',
          'in-progress': 'completed',
          'completed': 'todo'
        }
        return { ...task, status: statusMap[task.status] as Task['status'] }
      }
      return task
    }))
  }
  
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true
    return task.status === filterStatus
  })
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                タスク管理アプリ
              </h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              新しいタスク
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* フィルター */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            すべて
          </Button>
          <Button
            variant={filterStatus === 'todo' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('todo')}
          >
            未着手
          </Button>
          <Button
            variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('in-progress')}
          >
            進行中
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('completed')}
          >
            完了
          </Button>
        </div>
        
        {/* タスク追加フォーム */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>新しいタスクを追加</CardTitle>
                <CardDescription>タスクの詳細を入力してください</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">タスク名</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">説明</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">優先度</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high') => 
                          setFormData({...formData, priority: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">低</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="high">高</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="dueDate">期限</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      キャンセル
                    </Button>
                    <Button type="submit">タスクを追加</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* タスク一覧 */}
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={\`hover:shadow-lg transition-shadow \${task.status === 'completed' ? 'opacity-75' : ''}\`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-1"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={\`font-semibold \${task.status === 'completed' ? 'line-through text-gray-500' : ''}\`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={\`\${getPriorityColor(task.priority)}\`}>
                            {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                          </Badge>
                          <Badge variant="outline">
                            {task.status === 'todo' ? '未着手' : 
                             task.status === 'in-progress' ? '進行中' : '完了'}
                          </Badge>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className={\`text-gray-600 mb-2 \${task.status === 'completed' ? 'line-through' : ''}\`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            期限: {task.dueDate}
                          </span>
                        )}
                        <span>作成: {task.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filterStatus === 'all' ? 'タスクがありません' : 
               \`\${filterStatus === 'todo' ? '未着手の' : 
                 filterStatus === 'in-progress' ? '進行中の' : '完了した'}タスクがありません\`}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}`,

  landingPage: () => `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Star, Check, ArrowRight, Mail, Phone, MapPin, Play, Shield, Zap, Heart, Menu, X, ChevronDown } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail('')
      }, 3000)
    }
  }

  const features = [
    {
      icon: <Zap className="h-12 w-12 text-blue-600" />,
      title: "高速処理",
      description: "最新のテクノロジーにより、従来の10倍の処理速度を実現"
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: "安全性", 
      description: "業界最高水準のセキュリティで大切なデータを保護"
    },
    {
      icon: <Heart className="h-12 w-12 text-red-600" />,
      title: "使いやすさ",
      description: "直感的なインターフェースで誰でも簡単に操作可能"
    }
  ]

  const testimonials = [
    {
      name: "田中様",
      company: "株式会社テック",
      rating: 5,
      comment: "導入後、業務効率が大幅に向上しました。サポート体制も素晴らしいです。"
    },
    {
      name: "佐藤様",
      company: "クリエイト合同会社", 
      rating: 5,
      comment: "使いやすさと機能性を両立した優秀なサービスです。"
    },
    {
      name: "山田様",
      company: "イノベーション株式会社",
      rating: 5,
      comment: "他社サービスと比較しても圧倒的な性能差を感じます。"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YourBrand
              </h1>
              <div className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">特徴</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">お客様の声</a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">料金</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">お問い合わせ</a>
              </div>
            </div>
            <div className="hidden md:block">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                無料で始める
              </Button>
            </div>
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 bg-white border-b z-40 md:hidden"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a href="#features" className="block text-gray-700 hover:text-blue-600">特徴</a>
            <a href="#testimonials" className="block text-gray-700 hover:text-blue-600">お客様の声</a>
            <a href="#pricing" className="block text-gray-700 hover:text-blue-600">料金</a>
            <a href="#contact" className="block text-gray-700 hover:text-blue-600">お問い合わせ</a>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              無料で始める
            </Button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100 bg-grid-16 opacity-5"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                🚀 新機能リリース
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                次世代のビジネスを
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  今すぐ始めましょう
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                AIと最新テクノロジーを活用して、あなたのビジネスを革新的に変革します
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  無料トライアルを開始
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300">
                  <Play className="mr-2 h-5 w-5" />
                  デモを見る
                </Button>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <ChevronDown className="h-8 w-8 text-gray-400 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">なぜ選ばれるのか</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              私たちのサービスが多くの企業に選ばれる理由
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">お客様の声</h2>
            <p className="text-xl text-gray-600">実際にご利用いただいたお客様からの評価</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">シンプルな料金体系</h2>
            <p className="text-xl text-gray-600">あなたのビジネスに最適なプランを選択</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "スターター", price: "¥0", features: ["基本機能", "5プロジェクトまで", "メールサポート"] },
              { name: "プロ", price: "¥5,000", features: ["全機能", "無制限プロジェクト", "優先サポート", "API アクセス"], popular: true },
              { name: "エンタープライズ", price: "お問い合わせ", features: ["カスタマイズ可能", "専任サポート", "SLA保証", "オンプレミス対応"] }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={\`h-full \${plan.popular ? 'border-blue-600 border-2 shadow-xl' : ''}\`}>
                  {plan.popular && (
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                      最も人気
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg text-gray-500">/月</span></p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={\`w-full \${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}\`} variant={plan.popular ? "default" : "outline"}>
                      選択する
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              今すぐ始めましょう
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              14日間の無料トライアルで、すべての機能をお試しください
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="メールアドレスを入力"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-white text-blue-600 hover:bg-blue-50 whitespace-nowrap px-8"
                  disabled={isSubmitted}
                >
                  {isSubmitted ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      送信完了
                    </>
                  ) : (
                    '無料で始める'
                  )}
                </Button>
              </div>
            </form>
            
            {isSubmitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-green-200"
              >
                ✅ ありがとうございます！まもなく詳細をお送りします。
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                YourBrand
              </h3>
              <p className="text-gray-400">
                次世代のビジネスソリューションで、あなたの成功をサポートします
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">製品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">機能一覧</a></li>
                <li><a href="#" className="hover:text-white transition-colors">料金プラン</a></li>
                <li><a href="#" className="hover:text-white transition-colors">導入事例</a></li>
                <li><a href="#" className="hover:text-white transition-colors">セキュリティ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ドキュメント</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API リファレンス</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ステータス</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">お問い合わせ</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@yourbrand.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>03-1234-5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>東京都渋谷区1-2-3</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YourBrand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}`
}

export function generateAppByType(appType: string, userInput: string): string {
  const input = userInput.toLowerCase()
  
  if (input.includes('レシピ') || input.includes('料理') || appType.includes('recipe')) {
    return appTemplates.recipe()
  } else if (input.includes('家計簿') || input.includes('収支') || input.includes('財務') || appType.includes('finance')) {
    return appTemplates.finance()
  } else if (input.includes('タスク') || input.includes('todo') || input.includes('やること') || appType.includes('task')) {
    return appTemplates.task()
  } else if (input.includes('lp') || input.includes('ランディング') || input.includes('landing') || input.includes('サイト') || input.includes('ウェブサイト') || input.includes('website') || appType.includes('ランディング')) {
    return appTemplates.landingPage()
  }
  
  // デフォルトはタスク管理アプリ
  return appTemplates.task()
}
