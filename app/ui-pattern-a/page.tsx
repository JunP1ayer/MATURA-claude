'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from 'lucide-react'
import { useMaturaStore, useGenerationControl, usePatternToggle } from '@/lib/store'
import { apiClient, apiIntegration } from '@/lib/api-client'

/**
 * UI Pattern A: Modern Gradient & Glassmorphism Style
 * - グラデーション背景
 * - ガラス効果
 * - 動的なホバーエフェクト
 * - 鮮やかな色彩
 */
export default function UIPatternA() {
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
    console.log('🚀 [Pattern A] Starting generation process with API...')
    
    // API Integration - 生成開始
    const success = await apiIntegration.startGeneration((updates) => {
      if (typeof updates.apiCallCount === 'function') {
        incrementApiCall()
      }
      if (updates.isGenerating !== undefined) {
        // startGeneration() は既に状態更新するので、重複を避ける
        if (!isGenerating) startGeneration()
      }
      if (updates.generationProgress !== undefined) {
        setGenerationProgress(updates.generationProgress)
      }
    })

    if (!success) {
      console.error('❌ [Pattern A] Failed to start generation via API')
      return
    }
    
    // プログレス更新のシミュレーション（API呼び出し付き）
    let progress = 0
    const interval = setInterval(async () => {
      progress += 10
      
      // API Integration - 進行状況更新
      await apiIntegration.updateProgress(progress, (updates) => {
        if (typeof updates.apiCallCount === 'function') {
          incrementApiCall()
        }
        if (updates.generationProgress !== undefined) {
          setGenerationProgress(updates.generationProgress)
        }
      })
      
      console.log(`📊 [Pattern A] Generation progress: ${progress}%`)
      
      if (progress >= 100) {
        clearInterval(interval)
        
        // API Integration - 生成完了
        await apiIntegration.completeGeneration((updates) => {
          if (typeof updates.apiCallCount === 'function') {
            incrementApiCall()
          }
          if (updates.isComplete !== undefined) {
            completeGeneration()
          }
        })
        
        console.log('✅ [Pattern A] Generation completed successfully!')
      }
    }, 500)
  }

  const handleViewDemo = async () => {
    console.log('👁️ [Pattern A] Demo viewing initiated')
    selectPattern('pattern-a')
    toggleDarkMode()
    incrementApiCall()
    
    // API Call - 結果取得のデモ
    try {
      const response = await apiClient.getGenerationResults('summary', false, true)
      if (response.success) {
        console.log('📄 [Pattern A] Demo results retrieved:', response.data?.projectInfo?.name)
      }
    } catch (error) {
      console.warn('⚠️ [Pattern A] Demo API call failed:', error)
    }
    
    console.log(`🌙 [Pattern A] Dark mode toggled: ${!isDarkMode}`)
  }

  const handleToggleGemini = async () => {
    console.log('🔥 [Pattern A] Toggling Gemini API...')
    toggleGemini()
    incrementApiCall()
    
    // API Call - 設定更新
    try {
      const newSettings = {
        generation: {
          geminiApi: {
            enabled: !isGeminiEnabled
          }
        }
      }
      const response = await apiClient.updateSettings(newSettings, 'generation')
      if (response.success) {
        console.log('⚙️ [Pattern A] Gemini settings updated via API')
      }
    } catch (error) {
      console.warn('⚠️ [Pattern A] Settings API call failed:', error)
    }
    
    console.log(`🤖 [Pattern A] Gemini enabled: ${!isGeminiEnabled}`)
  }

  const handleFeatureClick = async (feature: string) => {
    console.log(`🎯 [Pattern A] Feature clicked: ${feature}`)
    incrementApiCall()
    
    // 機能デモンストレーション + API Call
    let targetProgress = 0
    switch (feature) {
      case 'speed':
        targetProgress = 25
        break
      case 'quality':
        targetProgress = 50
        break
      case 'deploy':
        targetProgress = 75
        break
    }
    
    // API Integration - 進行状況更新
    try {
      await apiIntegration.updateProgress(targetProgress, (updates) => {
        if (updates.generationProgress !== undefined) {
          setGenerationProgress(updates.generationProgress)
        }
      })
      console.log(`📊 [Pattern A] Feature demo progress: ${targetProgress}%`)
    } catch (error) {
      console.warn('⚠️ [Pattern A] Feature API call failed:', error)
      setGenerationProgress(targetProgress) // Fallback
    }
  }

  const handlePricingClick = async () => {
    console.log('💰 [Pattern A] Pricing clicked')
    incrementApiCall()
    
    // API Call - アナリティクス取得
    try {
      const response = await apiClient.analyzeResults()
      if (response.success) {
        console.log('📊 [Pattern A] Analytics retrieved for pricing:', response.data?.performance)
      }
    } catch (error) {
      console.warn('⚠️ [Pattern A] Analytics API call failed:', error)
    }
    
    console.log(`📊 [Pattern A] Current state: generating=${isGenerating}, complete=${isComplete}`)
  }

  const handleResetState = async () => {
    console.log('🔄 [Pattern A] Resetting all state...')
    
    // API Call - 生成リセット
    try {
      const response = await apiClient.resetGeneration()
      if (response.success) {
        console.log('🔄 [Pattern A] Generation reset via API')
        resetAllState()
        console.log('✅ [Pattern A] State reset completed')
      }
    } catch (error) {
      console.warn('⚠️ [Pattern A] Reset API call failed:', error)
      resetAllState() // Fallback
    }
    
    incrementApiCall()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Code Generation
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                MATURA
              </span>
              <br />
              <span className="text-white/90">
                Code Generation
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              15秒から8時間で完璧なアプリケーションを生成する
              <span className="text-cyan-300 font-semibold">次世代自律型</span>
              開発プラットフォーム
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                onClick={handleStartGeneration}
                disabled={isGenerating}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5 mr-2" />
                {isGenerating ? `生成中 ${generationProgress}%` : '今すぐ開始'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleViewDemo}
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold transition-all duration-300"
              >
                デモを見る
              </Button>
            </div>

            {/* State Display */}
            {(isGenerating || isComplete || apiCallCount > 0) && (
              <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-white/90 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>生成状態:</span>
                    <span className={isGenerating ? 'text-cyan-300' : isComplete ? 'text-green-300' : 'text-white'}>
                      {isGenerating ? '実行中' : isComplete ? '完了' : '待機中'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>進行状況:</span>
                    <span className="text-cyan-300">{generationProgress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API呼び出し回数:</span>
                    <span className="text-purple-300">{apiCallCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gemini API:</span>
                    <span className={isGeminiEnabled ? 'text-green-300' : 'text-orange-300'}>
                      {isGeminiEnabled ? '有効' : '無効'}
                    </span>
                  </div>
                  {generationProgress > 0 && (
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
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

      {/* Features Cards Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              革新的な
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                機能
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              完全自律型AIがあなたのアイデアを高品質なコードに変換
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card 
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleFeatureClick('speed')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  超高速生成
                </CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  15秒で基本構造、8時間で完全なアプリケーション
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-white/80">
                    <span>基本UI</span>
                    <span className="text-cyan-300 font-semibold">15秒</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>状態管理</span>
                    <span className="text-cyan-300 font-semibold">2分</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>完全アプリ</span>
                    <span className="text-cyan-300 font-semibold">8時間</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card 
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleFeatureClick('quality')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  品質保証
                </CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  TypeScript + テスト + Lintで完璧な品質
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-white/80">
                    <span>型安全性</span>
                    <span className="text-green-300 font-semibold">100%</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>テストカバレッジ</span>
                    <span className="text-green-300 font-semibold">90%+</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>Lint準拠</span>
                    <span className="text-green-300 font-semibold">完全</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card 
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleFeatureClick('deploy')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  即座デプロイ
                </CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  Vercel対応、本番環境に即座にデプロイ可能
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-white/80">
                    <span>Vercel連携</span>
                    <span className="text-orange-300 font-semibold">自動</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>SSL証明書</span>
                    <span className="text-orange-300 font-semibold">付属</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>CDN最適化</span>
                    <span className="text-orange-300 font-semibold">有効</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/30 overflow-hidden">
            <CardContent className="p-16 text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                今すぐ
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  体験
                </span>
                してみませんか？
              </h3>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                数分で完璧なアプリケーションが完成する感動を体験してください
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleStartGeneration}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-12 py-6 text-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? '生成中...' : '無料で開始'}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handlePricingClick}
                  className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm px-12 py-6 text-xl transition-all duration-300"
                >
                  料金プランを見る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}