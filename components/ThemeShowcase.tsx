'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Heart, MessageCircle, Bookmark, Search, Menu, ArrowLeft } from 'lucide-react'

type Theme = 'soft-cards' | 'flat-minimal' | 'glass-ui' | 'notion-style' | 'chat-ai'

export default function ThemeShowcase() {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [message, setMessage] = useState('')

  const themes = [
    { 
      id: 'soft-cards', 
      name: 'Soft Cards', 
      description: '丸み、ふんわり影、優しい雰囲気',
      colors: {
        primary: { name: 'Pink', value: '#ec4899' },
        secondary: { name: 'Purple', value: '#a855f7' },
        background: { name: 'Pink Light', value: '#fce7f3' },
        accent: { name: 'Purple Light', value: '#f3e8ff' }
      }
    },
    { 
      id: 'flat-minimal', 
      name: 'Flat Minimal', 
      description: '角なし、余白多め、ミニマル',
      colors: {
        primary: { name: 'Black', value: '#000000' },
        secondary: { name: 'Gray', value: '#6b7280' },
        background: { name: 'Gray Light', value: '#f9fafb' },
        accent: { name: 'White', value: '#ffffff' }
      }
    },
    { 
      id: 'glass-ui', 
      name: 'Glass UI', 
      description: '背景ぼかし、ガラス風、暗め背景',
      colors: {
        primary: { name: 'Pink', value: '#ec4899' },
        secondary: { name: 'Blue', value: '#3b82f6' },
        background: { name: 'Purple Dark', value: '#581c87' },
        accent: { name: 'White/20', value: 'rgba(255,255,255,0.2)' }
      }
    },
    { 
      id: 'notion-style', 
      name: 'Notion Style', 
      description: '白背景、タイポ中心、余白広め',
      colors: {
        primary: { name: 'Black', value: '#000000' },
        secondary: { name: 'Gray', value: '#6b7280' },
        background: { name: 'White', value: '#ffffff' },
        accent: { name: 'Gray Light', value: '#f3f4f6' }
      }
    },
    { 
      id: 'chat-ai', 
      name: 'Chat AI', 
      description: 'LINE風チャットUI、入力欄が下部に固定',
      colors: {
        primary: { name: 'Green', value: '#22c55e' },
        secondary: { name: 'Gray', value: '#6b7280' },
        background: { name: 'Gray Light', value: '#f3f4f6' },
        accent: { name: 'White', value: '#ffffff' }
      }
    }
  ]

  const renderThemeContent = () => {
    switch (selectedTheme) {
      case 'soft-cards':
        return (
          <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
            <div className="max-w-md mx-auto space-y-6">
              {/* Hero Section */}
              <div className="text-center py-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                  Soft & Gentle
                </h1>
                <p className="text-gray-600">やさしさを感じるデザイン</p>
              </div>

              {/* Cards */}
              <Card className="rounded-3xl shadow-xl border-0 bg-white/80 backdrop-blur">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                  <CardDescription>今日も素敵な一日を</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">こんにちは、ユーザーさん</p>
                      <p className="text-sm text-gray-500">最終ログイン: 2時間前</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Input 
                      placeholder="メールアドレス" 
                      className="rounded-2xl border-gray-200 focus:border-pink-300 transition-colors"
                    />
                    <Input 
                      type="password" 
                      placeholder="パスワード" 
                      className="rounded-2xl border-gray-200 focus:border-pink-300 transition-colors"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg">
                    ログイン
                  </Button>
                  <Button variant="outline" className="rounded-2xl border-2 hover:bg-purple-50">
                    新規登録
                  </Button>
                </CardFooter>
              </Card>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                {['機能1', '機能2', '機能3', '機能4'].map((item, i) => (
                  <Card key={i} className="rounded-2xl shadow-md border-0 hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto mb-3" />
                      <p className="font-medium">{item}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case 'flat-minimal':
        return (
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-md mx-auto space-y-12">
              {/* Hero Section */}
              <div className="space-y-4">
                <h1 className="text-5xl font-light tracking-tight">Minimal</h1>
                <p className="text-gray-500 text-lg">Less is more.</p>
              </div>

              {/* Main Card */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <Input 
                      placeholder="Email" 
                      className="border-0 border-b rounded-none px-0 text-lg focus:ring-0"
                    />
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      className="border-0 border-b rounded-none px-0 text-lg focus:ring-0"
                    />
                  </div>
                  <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-none h-12 text-base">
                    Continue
                  </Button>
                </CardContent>
              </Card>

              {/* Feature List */}
              <div className="space-y-6">
                {['Simple', 'Clean', 'Modern', 'Efficient'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-white transition-colors cursor-pointer">
                    <span className="text-lg">{item}</span>
                    <span className="text-gray-400">→</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="text-center text-gray-400 text-sm">
                <p>© 2024 Minimal Design</p>
              </div>
            </div>
          </div>
        )

      case 'glass-ui':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
            {/* Background Circles */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
            
            <div className="max-w-md mx-auto space-y-6 relative z-10">
              {/* Hero Section */}
              <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-white mb-2">Glass Morphism</h1>
                <p className="text-gray-300">透明感のあるモダンデザイン</p>
              </div>

              {/* Glass Card */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome</CardTitle>
                  <CardDescription className="text-gray-300">ログインして続ける</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input 
                    placeholder="メールアドレス" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur"
                  />
                  <Input 
                    type="password" 
                    placeholder="パスワード" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur"
                  />
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur border border-white/30">
                    ログイン
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Users', value: '10K+' },
                  { label: 'Active', value: '98%' },
                  { label: 'Rating', value: '4.9' }
                ].map((stat, i) => (
                  <Card key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-4">
                    <CardContent className="p-0 text-center">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-300">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0">
                  Get Started
                </Button>
                <Button variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        )

      case 'notion-style':
        return (
          <div className="min-h-screen bg-white p-6">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="flex items-center gap-2 mb-12">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Menu className="h-5 w-5" />
                </Button>
                <Input 
                  placeholder="Search..." 
                  className="flex-1 border-0 bg-gray-100 rounded-md px-3"
                />
              </div>

              {/* Page Title */}
              <div className="mb-12">
                <h1 className="text-4xl font-normal mb-4">Welcome to Workspace</h1>
                <p className="text-gray-600">Last edited: 2 minutes ago</p>
              </div>

              {/* Content Blocks */}
              <div className="space-y-8">
                {/* Text Block */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-normal">Getting Started</h2>
                  <p className="text-gray-700 leading-relaxed">
                    This is a clean, typography-focused design inspired by Notion. 
                    Focus on content with generous whitespace and minimal distractions.
                  </p>
                </div>

                {/* Todo List */}
                <div className="space-y-3">
                  <h3 className="text-xl font-normal mb-4">Today's Tasks</h3>
                  {['Complete project proposal', 'Review design mockups', 'Team standup at 3pm'].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="border-t pt-8">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start gap-2 h-auto p-4 hover:bg-gray-50">
                      <div className="text-left">
                        <p className="font-medium">New Page</p>
                        <p className="text-sm text-gray-500">Create a blank page</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 h-auto p-4 hover:bg-gray-50">
                      <div className="text-left">
                        <p className="font-medium">Import</p>
                        <p className="text-sm text-gray-500">From other apps</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'chat-ai':
        return (
          <div className="h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">AI Assistant</p>
                <p className="text-xs text-green-600">オンライン</p>
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-md mx-auto">
                {/* AI Message */}
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm">こんにちは！何かお手伝いできることはありますか？</p>
                    <p className="text-xs text-gray-500 mt-1">10:30</p>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex gap-2 justify-end">
                  <div className="bg-green-500 text-white rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                    <p className="text-sm">プログラミングについて教えてください</p>
                    <p className="text-xs text-green-100 mt-1">10:31</p>
                  </div>
                </div>

                {/* AI Message with options */}
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 max-w-[80%]">
                    <div className="bg-white rounded-2xl rounded-tl-none p-3">
                      <p className="text-sm">もちろんです！どの言語に興味がありますか？</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Python</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">JavaScript</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Java</Badge>
                    </div>
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl rounded-tl-none p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2 max-w-md mx-auto">
                <Input 
                  placeholder="メッセージを入力..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 rounded-full bg-gray-100 border-0 px-4"
                />
                <Button size="icon" className="rounded-full bg-green-500 hover:bg-green-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (selectedTheme) {
    return (
      <div className="w-full h-screen">
        {renderThemeContent()}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">UIテーマショーケース</h1>
          <p className="text-gray-600">お好みのテーマを選択してください</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card 
              key={theme.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedTheme(theme.id as Theme)}
            >
              <CardHeader>
                <CardTitle>{theme.name}</CardTitle>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Color Palette Preview */}
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 relative overflow-hidden">
                    {/* Mini UI Preview */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {theme.id === 'soft-cards' && (
                        <div className="scale-75 space-y-2">
                          <div className="bg-white rounded-2xl shadow-lg p-4 w-48">
                            <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mb-2" />
                            <div className="h-2 bg-gray-200 rounded-full w-3/4" />
                          </div>
                          <div className="flex gap-2">
                            <div className="bg-pink-100 rounded-xl p-3 flex-1">
                              <div className="h-2 bg-pink-300 rounded" />
                            </div>
                            <div className="bg-purple-100 rounded-xl p-3 flex-1">
                              <div className="h-2 bg-purple-300 rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                      {theme.id === 'flat-minimal' && (
                        <div className="scale-75 space-y-4 w-48">
                          <div className="space-y-2">
                            <div className="h-3 bg-black w-20" />
                            <div className="h-2 bg-gray-300 w-32" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-px bg-gray-300" />
                            <div className="h-px bg-gray-300" />
                          </div>
                          <div className="bg-black text-white text-xs py-2 px-4 text-center">
                            BUTTON
                          </div>
                        </div>
                      )}
                      {theme.id === 'glass-ui' && (
                        <div className="scale-75 relative">
                          <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-500 rounded-full blur-xl opacity-50" />
                          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500 rounded-full blur-xl opacity-50" />
                          <div className="bg-white/10 backdrop-blur rounded-xl p-4 w-48 border border-white/20">
                            <div className="h-2 bg-white/30 rounded mb-2" />
                            <div className="h-2 bg-white/20 rounded w-3/4" />
                          </div>
                        </div>
                      )}
                      {theme.id === 'notion-style' && (
                        <div className="scale-75 space-y-3 w-48 text-left">
                          <div>
                            <div className="h-4 bg-black w-32 mb-2" />
                            <div className="h-2 bg-gray-300 w-full" />
                            <div className="h-2 bg-gray-300 w-5/6 mt-1" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 border border-gray-400 rounded" />
                              <div className="h-2 bg-gray-300 w-20" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 border border-gray-400 rounded" />
                              <div className="h-2 bg-gray-300 w-24" />
                            </div>
                          </div>
                        </div>
                      )}
                      {theme.id === 'chat-ai' && (
                        <div className="scale-75 space-y-2 w-48">
                          <div className="flex gap-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full" />
                            <div className="bg-white rounded-xl rounded-tl-none p-2 flex-1">
                              <div className="h-2 bg-gray-300 rounded w-20" />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <div className="bg-green-500 rounded-xl rounded-tr-none p-2">
                              <div className="h-2 bg-green-300 rounded w-16" />
                            </div>
                          </div>
                          <div className="bg-gray-200 rounded-full px-3 py-1 flex items-center gap-2 mt-4">
                            <div className="h-2 bg-gray-400 rounded flex-1" />
                            <div className="w-4 h-4 bg-green-500 rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Color Swatches */}
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(theme.colors).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div 
                          className="h-12 w-full rounded-lg shadow-sm border border-gray-200 mb-1 relative group cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: color.value }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-medium px-1 py-0.5 bg-black/70 text-white rounded">
                              {color.value}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 capitalize">{key}</p>
                        <p className="text-xs text-gray-400">{color.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">このテーマを選択</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}