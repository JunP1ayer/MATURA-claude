'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Target, Star, Heart, ArrowRight, RefreshCw, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { ProcessingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'
import { Insight } from '@/lib/types'

export default function InsightRefine() {
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [insights, setInsights] = useState<Insight | null>(null)

  useEffect(() => {
    generateInsights()
  }, [])

  // Cleanup on unmount - cancel any ongoing requests
  useEffect(() => {
    return () => {
      chatOptimized.cleanup()
    }
  }, [chatOptimized])

  const generateInsights = async () => {
    try {
      const structuredData = await chatOptimized.generateStructuredData(
        state.conversations,
        'InsightRefine',
        {
          onError: (error) => {
            console.error('洞察生成エラー:', error)
          },
          timeout: 45000 // 45 second timeout for structured data generation
        }
      )
      
      if (structuredData) {
        setInsights(structuredData)
        actions.setInsights(structuredData)
      }
    } catch (error) {
      console.error('洞察生成エラー:', error)
    }
  }

  const handleNext = () => {
    if (insights) {
      actions.setInsights(insights)
      actions.nextPhase()
    }
  }

  const handleRegenerate = () => {
    generateInsights()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold mb-2">InsightRefine - 洞察の精製</h2>
                <p className="text-white/90">
                  あなたの対話から重要な洞察を抽出します
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {chatOptimized.isLoading && (
                <button
                  onClick={chatOptimized.cancelRequest}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                  キャンセル
                </button>
              )}
              {insights && !chatOptimized.isLoading && (
                <button
                  onClick={handleRegenerate}
                  disabled={chatOptimized.isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  再生成
                </button>
              )}
              <PreviewButton 
                data={insights} 
                title="洞察データ"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              />
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-8">
          {/* エラー表示 */}
          {chatOptimized.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-red-600">{chatOptimized.error}</p>
                <button
                  onClick={chatOptimized.clearError}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {chatOptimized.isLoading ? (
            <div className="text-center py-16">
              <ProcessingSpinner />
              <div className="mt-8 space-y-2">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600"
                >
                  対話内容を分析しています...
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-gray-500 text-sm"
                >
                  ビジョンとターゲットを特定中
                </motion.p>
              </div>
            </div>
          ) : insights ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* ビジョン */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">ビジョン</h3>
                </div>
                <p className="text-blue-800 text-lg leading-relaxed">
                  {insights.vision}
                </p>
              </motion.div>

              {/* ターゲットユーザー */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900">ターゲットユーザー</h3>
                </div>
                <p className="text-green-800 text-lg leading-relaxed">
                  {insights.target}
                </p>
              </motion.div>

              {/* 主要機能 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">主要機能</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {insights.features?.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white p-3 rounded-lg border border-purple-200 text-purple-800"
                    >
                      • {feature}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* 提供価値 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-900">提供価値</h3>
                </div>
                <p className="text-red-800 text-lg leading-relaxed">
                  {insights.value}
                </p>
              </motion.div>

              {/* 動機 */}
              {insights.motivation && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">作りたい理由</h3>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {insights.motivation}
                  </p>
                </motion.div>
              )}

              {/* 次へボタン */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-4"
              >
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-matura-primary to-matura-secondary text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
                >
                  UIデザインを選択する
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          ) : !insights && !chatOptimized.isLoading ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">洞察の生成に失敗しました</p>
              <button
                onClick={handleRegenerate}
                disabled={chatOptimized.isLoading}
                className="px-6 py-2 bg-matura-primary text-white rounded-lg hover:bg-matura-secondary transition-colors disabled:opacity-50"
              >
                再試行
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}