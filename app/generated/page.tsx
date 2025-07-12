'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Calendar, ExternalLink, Code, Zap } from 'lucide-react'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'

interface GeneratedApp {
  id: string
  appType: string
  timestamp: string
  path: string
  url: string
}

export default function GeneratedAppsPage() {
  const [apps, setApps] = useState<GeneratedApp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGeneratedApps()
  }, [])

  const loadGeneratedApps = async () => {
    try {
      const response = await fetch('/api/generated-apps')
      if (response.ok) {
        const data = await response.json()
        setApps(data.apps || [])
      }
    } catch (error) {
      console.error('Failed to load generated apps:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAppTypeColor = (appType: string) => {
    const colors = {
      'タスク管理': 'bg-blue-100 text-blue-800',
      'レシピ管理': 'bg-green-100 text-green-800',
      '家計簿': 'bg-purple-100 text-purple-800',
      'ブログ': 'bg-orange-100 text-orange-800',
      '在庫管理': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    
    for (const [key, color] of Object.entries(colors)) {
      if (appType.includes(key)) return color
    }
    return colors.default
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">生成されたアプリを読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              生成されたアプリ
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            これまでに生成されたアプリの一覧です
          </p>
        </div>

        {/* アプリ一覧 */}
        {apps.length === 0 ? (
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              まだアプリが生成されていません
            </h3>
            <p className="text-gray-500 mb-6">
              新しいアプリを作成して、ここに表示させましょう
            </p>
            <Link href="/generator">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Zap className="mr-2 h-4 w-4" />
                アプリを作成する
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{app.appType}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(app.timestamp).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                      <Badge className={getAppTypeColor(app.appType)}>
                        {app.appType.includes('アプリ') ? app.appType.replace('アプリ', '') : app.appType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p>完全に動作するアプリケーションが生成されました</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={app.url} className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            アプリを開く
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* 新しいアプリ作成ボタン */}
        <div className="text-center mt-12">
          <Link href="/generator">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Zap className="mr-2 h-5 w-5" />
              新しいアプリを作成
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}