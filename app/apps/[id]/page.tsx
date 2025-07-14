'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ExternalLink, 
  ArrowLeft, 
  RefreshCw, 
  Eye, 
  Code,
  Calendar,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react'

interface AppData {
  appId: string
  metadata: {
    appType: string
    description: string
    features: string[]
    timestamp: string
    [key: string]: any
  }
  pageContent: string
  url: string
  directUrl: string
}

export default function DynamicAppViewer() {
  const params = useParams()
  const router = useRouter()
  const appId = params.id as string
  
  const [appData, setAppData] = useState<AppData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAppData = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/apps/${appId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'アプリデータの取得に失敗しました')
      }
      
      setAppData(data)
      console.log(`✅ App data loaded for: ${appId}`)
      
    } catch (err: any) {
      console.error(`❌ Failed to load app ${appId}:`, err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (appId) {
      fetchAppData()
    }
  }, [appId])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAppData()
  }

  const openInNewTab = () => {
    if (appData?.directUrl) {
      window.open(appData.directUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">アプリを読み込み中...</h2>
          <p className="text-gray-500">App ID: {appId}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="h-5 w-5 mr-2" />
              エラーが発生しました
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="flex space-x-3">
              <Button onClick={handleRefresh} disabled={refreshing} className="flex-1">
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                再試行
              </Button>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!appData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">アプリが見つかりません</h2>
          <p>App ID: {appId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ヘッダー */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.back()} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {appData.metadata.appType}
                </h1>
                <p className="text-sm text-gray-500">App ID: {appData.appId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(appData.metadata.timestamp).toLocaleDateString('ja-JP')}
              </Badge>
              
              <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              
              <Button onClick={openInNewTab} className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                新しいタブで開く
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* アプリ情報サイドバー */}
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  アプリ情報
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">説明</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {appData.metadata.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">主な機能</h4>
                    <ul className="space-y-2">
                      {appData.metadata.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-purple-600" />
                  開発情報
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">生成方法:</span>
                    <Badge variant="secondary">
                      {appData.metadata.generationMethod || 'AI生成'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">フレームワーク:</span>
                    <span className="font-medium">Next.js + React</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">スタイリング:</span>
                    <span className="font-medium">Tailwind CSS</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* メインプレビューエリア */}
          <div className="xl:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-green-600" />
                  ライブプレビュー
                </CardTitle>
                <CardDescription>
                  生成されたアプリのリアルタイムプレビューです
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '800px' }}>
                  <div className="bg-gray-800 text-white px-4 py-2 text-sm flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span>{appData.metadata.appType} - ライブプレビュー</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      MATURA生成
                    </Badge>
                  </div>
                  
                  {/* iFrame for app preview */}
                  <iframe
                    src={appData.directUrl}
                    className="w-full h-full border-0"
                    title={`${appData.metadata.appType} プレビュー`}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}