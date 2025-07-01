'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Star, Zap, CheckCircle, RefreshCw } from 'lucide-react'
import { Insight, UIStyle, DynamicUIGeneration } from '@/lib/types'
import { UXGenerator } from '@/lib/uxGenerator'

interface DynamicUISelectorProps {
  insight: Insight
  onUISelected: (selectedStyle: UIStyle, dynamicGeneration: DynamicUIGeneration) => void
  isLoading?: boolean
}

export default function DynamicUISelector({ 
  insight, 
  onUISelected, 
  isLoading = false 
}: DynamicUISelectorProps) {
  const [generatedStyles, setGeneratedStyles] = useState<DynamicUIGeneration['generatedStyles']>([])
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // アイデアベースのUI候補を生成
  useEffect(() => {
    generateDynamicStyles()
  }, [insight])

  const generateDynamicStyles = async () => {
    setIsGenerating(true)
    try {
      const styles = await UXGenerator.generateDynamicUIOptions(insight)
      setGeneratedStyles(styles)
      // 最初のスタイル（最も適合性の高い）を自動選択
      if (styles.length > 0) {
        setSelectedStyleId(styles[0].id)
      }
    } catch (error) {
      console.error('Dynamic UI generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStyleSelect = async (styleId: string) => {
    setSelectedStyleId(styleId)
    
    const selectedStyleData = generatedStyles.find(s => s.id === styleId)
    if (!selectedStyleData) return

    // UIStyle形式に変換
    const uiStyle: UIStyle = {
      id: selectedStyleData.id,
      name: selectedStyleData.name,
      description: selectedStyleData.description,
      category: 'modern', // デフォルト
      colors: selectedStyleData.colors,
      typography: selectedStyleData.typography,
      spacing: 'comfortable',
      personality: selectedStyleData.personality
    }

    // DynamicUIGeneration形式で包括的なデータを作成
    const dynamicGeneration: DynamicUIGeneration = {
      baseInsight: insight,
      generatedStyles,
      selectedStyle: uiStyle,
      customizations: {}
    }

    onUISelected(uiStyle, dynamicGeneration)
  }

  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            あなたのアイデアに最適なUIを生成中...
          </h3>
          <p className="text-gray-600 text-center">
            「{insight.vision}」の特性を分析し、<br/>
            {insight.target}に最適なデザインスタイルを作成しています
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Palette className="w-8 h-8" />
              あなたのアイデアに最適化されたUIスタイル
            </h2>
            <p className="text-purple-100">
              「{insight.vision}」に基づいて、最適なデザインスタイルを生成しました
            </p>
          </div>
          <button
            onClick={generateDynamicStyles}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            再生成
          </button>
        </div>
      </div>

      {/* スタイル選択グリッド */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {generatedStyles.map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300
                  ${selectedStyleId === style.id 
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }
                `}
                onClick={() => handleStyleSelect(style.id)}
              >
                {/* 選択インジケーター */}
                {selectedStyleId === style.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                {/* 適合性スコア */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-600">
                      適合性 {style.suitabilityScore}%
                    </span>
                  </div>
                  {style.suitabilityScore >= 80 && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <Zap className="w-4 h-4" />
                      推奨
                    </div>
                  )}
                </div>

                {/* スタイル名と説明 */}
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {style.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {style.description}
                </p>

                {/* カラーパレット */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">カラーパレット</p>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: style.colors.primary }}
                      title={`Primary: ${style.colors.primary}`}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: style.colors.secondary }}
                      title={`Secondary: ${style.colors.secondary}`}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: style.colors.accent }}
                      title={`Accent: ${style.colors.accent}`}
                    />
                  </div>
                </div>

                {/* パーソナリティタグ */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">デザインの特徴</p>
                  <div className="flex flex-wrap gap-1">
                    {style.personality.map((trait, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 選択理由 */}
                <div className="text-xs text-gray-600 italic">
                  {style.reasoning}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 選択確認 */}
        {selectedStyleId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">
                スタイル選択完了
              </h3>
            </div>
            <p className="text-blue-700 mb-4">
              選択されたスタイルは、あなたのアイデア「{insight.vision}」に
              {generatedStyles.find(s => s.id === selectedStyleId)?.suitabilityScore}%
              の適合性を持っています。
            </p>
            <p className="text-blue-600 text-sm">
              このスタイルは次のフェーズでUX設計に自動的に反映されます。
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}