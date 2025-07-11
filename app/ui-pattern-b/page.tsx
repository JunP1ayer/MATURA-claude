'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Code2, Cpu, Database, Globe, Settings, Users } from 'lucide-react'
import { useMaturaStore, useGenerationControl, usePatternToggle } from '@/lib/store'
import { apiClient, apiIntegration } from '@/lib/api-client'

/**
 * UI Pattern B: Clean Minimalist Style
 * - 白基調のクリーンデザイン
 * - 微細なシャドウ
 * - シンプルで読みやすい
 * - プロフェッショナルな印象
 */
export default function UIPatternB() {
  // ===== State Management =====
  const { 
    isGenerating, 
    isComplete, 
    generationProgress,
    isDarkMode,
    isGeminiEnabled,
    apiCallCount,
    toggleGenerating,
    toggleComplete,
    toggleDarkMode,
    toggleGemini,
    incrementApiCall,
    setGenerationProgress,
    resetAllState
  } = useMaturaStore()
  
  const { startGeneration, completeGeneration } = useGenerationControl()
  const { selectPattern } = usePatternToggle()

  // ===== Event Handlers =====
  
  const handleStartGeneration = async () => {
    console.log('🚀 [Pattern B] Starting generation process with API...')
    
    // API Integration - 生成開始
    const success = await apiIntegration.startGeneration((updates) => {
      if (typeof updates.apiCallCount === 'function') {
        incrementApiCall()
      }
      if (updates.isGenerating !== undefined) {
        if (!isGenerating) startGeneration()
      }
      if (updates.generationProgress !== undefined) {
        setGenerationProgress(updates.generationProgress)
      }
    })

    if (!success) {
      console.error('❌ [Pattern B] Failed to start generation via API')
      return
    }
    
    // プログレス更新のシミュレーション（API呼び出し付き）
    let progress = 0
    const interval = setInterval(async () => {
      progress += 10
      
      await apiIntegration.updateProgress(progress, (updates) => {
        if (typeof updates.apiCallCount === 'function') {
          incrementApiCall()
        }
        if (updates.generationProgress !== undefined) {
          setGenerationProgress(updates.generationProgress)
        }
      })
      
      console.log(`📊 [Pattern B] Generation progress: ${progress}%`)
      
      if (progress >= 100) {
        clearInterval(interval)
        
        await apiIntegration.completeGeneration((updates) => {
          if (typeof updates.apiCallCount === 'function') {
            incrementApiCall()
          }
          if (updates.isComplete !== undefined) {
            completeGeneration()
          }
        })
        
        console.log('✅ [Pattern B] Generation completed successfully!')
      }
    }, 500)
  }

  const handleViewDemo = async () => {
    console.log('👁️ [Pattern B] Demo viewing initiated')
    selectPattern('pattern-b')
    toggleDarkMode()
    incrementApiCall()
    
    // API Call - 結果取得のデモ
    try {
      const response = await apiClient.getGenerationResults('summary', false, true)
      if (response.success) {
        console.log('📄 [Pattern B] Demo results retrieved:', response.data?.projectInfo?.name)
      }
    } catch (error) {
      console.warn('⚠️ [Pattern B] Demo API call failed:', error)
    }
    
    console.log(`🌙 [Pattern B] Dark mode toggled: ${!isDarkMode}`)
  }

  const handleToggleGemini = () => {
    console.log('🔥 [Pattern B] Toggling Gemini API...')
    toggleGemini()
    console.log(`🤖 [Pattern B] Gemini enabled: ${!isGeminiEnabled}`)
  }

  const handleFeatureClick = async (feature: string) => {
    console.log(`🎯 [Pattern B] Feature clicked: ${feature}`)
    incrementApiCall()
    
    // 機能デモンストレーション + API Call
    let targetProgress = 0
    switch (feature) {
      case 'ai':
        targetProgress = 20
        break
      case 'quality':
        targetProgress = 40
        break
      case 'state':
        targetProgress = 60
        break
      case 'deploy':
        targetProgress = 80
        break
      case 'stack':
        targetProgress = 90
        break
      case 'team':
        targetProgress = 100
        break
    }
    
    // API Integration - 進行状況更新
    try {
      await apiIntegration.updateProgress(targetProgress, (updates) => {
        if (updates.generationProgress !== undefined) {
          setGenerationProgress(updates.generationProgress)
        }
      })
      console.log(`📊 [Pattern B] Feature demo progress: ${targetProgress}%`)
    } catch (error) {
      console.warn('⚠️ [Pattern B] Feature API call failed:', error)
      setGenerationProgress(targetProgress) // Fallback
    }
  }

  const handlePricingClick = async () => {
    console.log('💰 [Pattern B] Pricing clicked')
    incrementApiCall()
    
    // API Call - アナリティクス取得
    try {
      const response = await apiClient.analyzeResults()
      if (response.success) {
        console.log('📊 [Pattern B] Analytics retrieved for pricing:', response.data?.performance)
      }
    } catch (error) {
      console.warn('⚠️ [Pattern B] Analytics API call failed:', error)
    }
    
    console.log(`📊 [Pattern B] Current state: generating=${isGenerating}, complete=${isComplete}`)
  }

  const handleResetState = () => {
    console.log('🔄 [Pattern B] Resetting all state...')
    resetAllState()
    console.log('✅ [Pattern B] State reset completed')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium">
              <Code2 className="w-4 h-4 mr-2" />
              次世代開発プラットフォーム
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="text-blue-600">MATURA</span>で
              <br />
              開発を
              <span className="text-gray-800 relative">
                革新
                <div className="absolute bottom-1 left-0 w-full h-3 bg-yellow-200 -z-10"></div>
              </span>
              する
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AI駆動の自律型コード生成で、
              <span className="text-blue-600 font-semibold">15秒から8時間</span>
              で完璧なアプリケーションを構築
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                onClick={handleStartGeneration}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? `生成中 ${generationProgress}%` : '今すぐ始める'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleViewDemo}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg font-semibold transition-all duration-200"
              >
                デモを見る
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">15秒</div>
                <div className="text-gray-600 text-sm">最速生成時間</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-gray-600 text-sm">型安全性</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">8時間</div>
                <div className="text-gray-600 text-sm">完全アプリ生成</div>
              </div>
            </div>

            {/* State Display */}
            {(isGenerating || isComplete || apiCallCount > 0) && (
              <div className="mt-12 p-6 bg-gray-100 rounded-lg border border-gray-200">
                <div className="text-gray-800 text-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">生成状態:</span>
                    <span className={`font-semibold ${isGenerating ? 'text-blue-600' : isComplete ? 'text-green-600' : 'text-gray-600'}`}>
                      {isGenerating ? '実行中' : isComplete ? '完了' : '待機中'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">進行状況:</span>
                    <span className="text-blue-600 font-semibold">{generationProgress}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">API呼び出し回数:</span>
                    <span className="text-purple-600 font-semibold">{apiCallCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Gemini API:</span>
                    <span className={`font-semibold ${isGeminiEnabled ? 'text-green-600' : 'text-orange-600'}`}>
                      {isGeminiEnabled ? '有効' : '無効'}
                    </span>
                  </div>
                  {generationProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              なぜ <span className="text-blue-600">MATURA</span> なのか？
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              従来の開発手法を覆す、完全自律型AI開発システム
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card 
              className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleFeatureClick('ai')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  AI駆動生成
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Gemini APIを活用した高精度コード生成
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Next.js 14 App Router
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    TypeScript完全対応
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    shadcn/ui + Tailwind
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card 
              className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleFeatureClick('quality')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  自動品質管理
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Lint、型チェック、テストを自動実行
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    ESLint自動修正
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Prettier統合
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Jest + Testing Library
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card 
              className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleFeatureClick('state')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  状態管理統合
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Zustand + 永続化で完璧な状態管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    型安全なストア
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    DevTools統合
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    永続化対応
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature Card 4 */}
            <Card 
              className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleFeatureClick('deploy')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  即座デプロイ
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Vercel最適化で即座に本番環境へ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    ワンクリックデプロイ
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    CDN最適化
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    SSL自動設定
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature Card 5 */}
            <Card 
              className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleFeatureClick('stack')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  モダンスタック
                </CardTitle>
                <CardDescription className="text-gray-600">
                  最新技術スタックで将来性を保証
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    React 18
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Server Components
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    App Router
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature Card 6 */}
            <Card 
              className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleFeatureClick('team')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  チーム対応
                </CardTitle>
                <CardDescription className="text-gray-600">
                  複数人での開発に最適化された構造
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    コード規約統一
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    Git統合
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    ドキュメント自動生成
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              簡単<span className="text-blue-600">3ステップ</span>
            </h2>
            <p className="text-lg text-gray-600">
              複雑な設定は不要。すぐに高品質なアプリケーションが完成
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                要件入力
              </h3>
              <p className="text-gray-600">
                作りたいアプリケーションの概要を入力するだけ
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI生成
              </h3>
              <p className="text-gray-600">
                AIが自動でコードを生成し、品質チェックまで完了
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                即座デプロイ
              </h3>
              <p className="text-gray-600">
                生成されたアプリケーションを即座に本番環境にデプロイ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="container mx-auto">
          <Card className="bg-white border border-gray-200 shadow-xl">
            <CardContent className="p-16 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                今すぐ<span className="text-blue-600">MATURA</span>を体験
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                無料プランで今すぐ始めて、AI駆動開発の威力を実感してください
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleStartGeneration}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? '生成中...' : '無料で開始'}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handlePricingClick}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12 py-6 text-xl transition-all duration-200"
                >
                  詳細を見る
                </Button>
              </div>
              
              <div className="mt-8 text-sm text-gray-500">
                クレジットカード不要 • 即座開始 • いつでもキャンセル可能
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}