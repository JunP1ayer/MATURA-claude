'use client'

import { useState, useEffect } from 'react'
import { Wrench, Layout, Type, Navigation, Palette, ArrowRight, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { ProcessingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'
import { UXDesign } from '@/lib/types'

export default function UXBuild() {
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [uxDesign, setUxDesign] = useState<UXDesign | null>(null)

  useEffect(() => {
    generateUXDesign()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chatOptimized.cleanup()
    }
  }, [chatOptimized])

  const generateUXDesign = async () => {
    try {
      // UXデザイン仕様を作成
      const uxSpec = {
        insights: state.insights,
        selectedUI: state.selectedUI,
        conversations: state.conversations
      }

      const structuredData = await chatOptimized.generateStructuredData(
        [{ 
          id: 'ux-spec', 
          role: 'user' as const, 
          content: JSON.stringify(uxSpec),
          timestamp: new Date()
        }],
        'UXBuild',
        {
          timeout: 45000,
          onError: (error) => {
            console.error('UX design generation error:', error)
          }
        }
      )

      if (structuredData) {
        setUxDesign(structuredData)
        actions.setUXDesign(structuredData)
      } else {
        // フォールバックとしてダミーデータを生成
        const fallbackDesign: UXDesign = {
          layout: state.selectedUI?.style === 'minimal' ? 'grid-minimal' : 'card-based',
          colorScheme: state.selectedUI?.style === 'dark' ? 'dark-theme' : 'light-theme',
          typography: 'modern-sans',
          navigation: 'header-nav',
          components: ['ヘッダー', 'メインコンテンツ', 'サイドバー', 'フッター'],
          interactions: ['スムーズスクロール', 'ホバーエフェクト', 'アニメーション']
        }
        setUxDesign(fallbackDesign)
        actions.setUXDesign(fallbackDesign)
      }
    } catch (error) {
      console.error('UX設計生成エラー:', error)
    }
  }

  const handleNext = () => {
    if (uxDesign) {
      actions.nextPhase()
    }
  }

  const handleRegenerate = () => {
    generateUXDesign()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Wrench className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold mb-2">UXBuild - 体験設計の構築</h2>
                <p className="text-white/90">
                  選択されたデザインに基づいて最適なUX体験を設計します
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {uxDesign && (
                <button
                  onClick={handleRegenerate}
                  disabled={chatOptimized.isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  再設計
                </button>
              )}
              <PreviewButton 
                data={uxDesign} 
                title="UX設計"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              />
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-8">
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
                  UX体験を設計しています...
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-gray-500 text-sm"
                >
                  レイアウトとインタラクションを最適化中
                </motion.p>
              </div>
            </div>
          ) : uxDesign ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* 設計概要 */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-100">
                <h3 className="text-xl font-bold text-green-900 mb-3">設計概要</h3>
                <p className="text-green-800">
                  {state.selectedUI?.name}デザインに基づいた、
                  {state.insights?.target}向けの最適化されたUX体験を構築しました。
                </p>
              </div>

              {/* UXコンポーネント */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* レイアウト */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-blue-50 p-6 rounded-lg border border-blue-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Layout className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-blue-900">レイアウト構造</h4>
                  </div>
                  <p className="text-blue-800 font-medium">{uxDesign.layout}</p>
                </motion.div>

                {/* カラーテーマ */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-purple-50 p-6 rounded-lg border border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-purple-900">カラーテーマ</h4>
                  </div>
                  <p className="text-purple-800 font-medium">{uxDesign.colorScheme}</p>
                </motion.div>

                {/* タイポグラフィ */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-orange-50 p-6 rounded-lg border border-orange-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Type className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-orange-900">タイポグラフィ</h4>
                  </div>
                  <p className="text-orange-800 font-medium">{uxDesign.typography}</p>
                </motion.div>

                {/* ナビゲーション */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-teal-50 p-6 rounded-lg border border-teal-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-teal-900">ナビゲーション</h4>
                  </div>
                  <p className="text-teal-800 font-medium">{uxDesign.navigation}</p>
                </motion.div>
              </div>

              {/* コンポーネント一覧 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 p-6 rounded-lg border border-gray-100"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">主要コンポーネント</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uxDesign.components.map((component, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-white p-3 rounded-lg border border-gray-200 text-center text-gray-800 font-medium"
                    >
                      {component}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* インタラクション */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-pink-50 p-6 rounded-lg border border-pink-100"
              >
                <h4 className="text-lg font-bold text-pink-900 mb-4">インタラクション設計</h4>
                <div className="flex flex-wrap gap-3">
                  {uxDesign.interactions.map((interaction, index) => (
                    <motion.span
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
                    >
                      {interaction}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* 次へボタン */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-4"
              >
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-matura-primary to-matura-secondary text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
                >
                  コードを生成する
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">UX設計の生成に失敗しました</p>
              <button
                onClick={handleRegenerate}
                className="px-6 py-2 bg-matura-primary text-white rounded-lg hover:bg-matura-secondary transition-colors"
              >
                再試行
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}