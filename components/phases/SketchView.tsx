'use client'

import { useState } from 'react'
import { Heart, X, ArrowRight, Palette, Shuffle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { useMatura } from '@/components/providers/MaturaProvider'
import { UIDesign } from '@/lib/types'

// ダミーUIデザインオプション（実際にはAIが生成）
const uiDesigns: UIDesign[] = [
  {
    id: '1',
    name: 'ミニマルモダン',
    style: 'minimal',
    preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
    description: 'シンプルで洗練されたデザイン',
    color_scheme: ['#f8fafc', '#e2e8f0', '#64748b']
  },
  {
    id: '2',
    name: 'カラフルポップ',
    style: 'colorful',
    preview: 'bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200',
    description: '楽しく親しみやすいデザイン',
    color_scheme: ['#fce7f3', '#e9d5ff', '#c7d2fe']
  },
  {
    id: '3',
    name: 'ダークエレガント',
    style: 'dark',
    preview: 'bg-gradient-to-br from-gray-800 to-gray-900',
    description: '高級感のあるダークテーマ',
    color_scheme: ['#1f2937', '#374151', '#6b7280']
  },
  {
    id: '4',
    name: 'ナチュラルグリーン',
    style: 'natural',
    preview: 'bg-gradient-to-br from-green-100 to-blue-100',
    description: '自然で心地よいデザイン',
    color_scheme: ['#dcfce7', '#dbeafe', '#34d399']
  },
  {
    id: '5',
    name: 'プロフェッショナル',
    style: 'professional',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    description: 'ビジネス向けの信頼感あるデザイン',
    color_scheme: ['#eff6ff', '#e0e7ff', '#3b82f6']
  },
  {
    id: '6',
    name: 'プレイフル',
    style: 'playful',
    preview: 'bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100',
    description: '遊び心のあるカジュアルデザイン',
    color_scheme: ['#fef3c7', '#fed7aa', '#fecaca']
  }
]

export default function SketchView() {
  const { state, actions } = useMatura()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedUI, setSelectedUI] = useState<UIDesign | null>(null)
  const [likedUIs, setLikedUIs] = useState<UIDesign[]>([])

  const currentUI = uiDesigns[currentIndex] || uiDesigns[0]

  const handleLike = () => {
    const ui = uiDesigns[currentIndex]
    if (ui) {
      setLikedUIs([...likedUIs, ui])
      
      if (!selectedUI) {
        setSelectedUI(ui)
      }
    }
    
    nextCard()
  }

  const handleDislike = () => {
    nextCard()
  }

  const nextCard = () => {
    if (currentIndex < uiDesigns.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // 全て見終わった場合、最初に戻る
      setCurrentIndex(0)
    }
  }

  const handleConfirm = () => {
    if (selectedUI) {
      actions.setSelectedUI(selectedUI)
      actions.nextPhase()
    }
  }

  const handleSelectDifferent = (ui: UIDesign) => {
    setSelectedUI(ui)
  }

  const handleShuffle = () => {
    setCurrentIndex(Math.floor(Math.random() * uiDesigns.length))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Palette className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold mb-2">SketchView - UIデザイン選択</h2>
                <p className="text-white/90">
                  Tinder風にスワイプしてお好みのデザインを選んでください
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                シャッフル
              </button>
              <PreviewButton 
                data={selectedUI || likedUIs} 
                title="選択したデザイン"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              />
            </div>
          </div>
        </div>

        <div className="p-8">
          {!selectedUI ? (
            /* デザイン選択フェーズ */
            <div className="space-y-6">
              {/* カードエリア */}
              <div className="relative h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentUI.id}
                    initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full max-w-md h-full rounded-2xl ${currentUI.preview} shadow-2xl flex flex-col items-center justify-center p-8 border-2 border-white/20`}
                  >
                    <div className="text-center text-gray-800">
                      <h3 className="text-3xl font-bold mb-4">{currentUI.name}</h3>
                      <p className="text-lg mb-6 opacity-80">{currentUI.description}</p>
                      
                      {/* カラーパレット */}
                      <div className="flex justify-center gap-2 mb-4">
                        {currentUI.color_scheme.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-white/50"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <p className="text-sm">スタイル: {currentUI.style}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* スワイプボタン */}
                <div className="absolute bottom-[-50px] flex gap-8">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDislike}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full shadow-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-8 h-8 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-colors"
                  >
                    <Heart className="w-8 h-8 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* プログレス */}
              <div className="text-center mt-16">
                <p className="text-gray-600 mb-2">
                  {currentIndex + 1} / {uiDesigns.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                  <div
                    className="bg-matura-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / uiDesigns.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* いいねしたデザイン */}
              {likedUIs.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">いいねしたデザイン</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {likedUIs.map((ui: UIDesign, index: number) => {
                      const isSelected = selectedUI !== null && (selectedUI as UIDesign).id === ui.id
                      return (
                        <button
                          key={`liked-${ui.id}-${index}`}
                          onClick={() => handleSelectDifferent(ui)}
                          className={`p-4 rounded-lg ${ui.preview} border-2 transition-all ${
                            isSelected ? 'border-matura-primary shadow-lg' : 'border-gray-200'
                          }`}
                        >
                          <p className="text-sm font-medium">{ui.name}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 確認フェーズ */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className={`w-full max-w-lg mx-auto h-[300px] rounded-2xl ${selectedUI.preview} shadow-2xl flex items-center justify-center`}>
                <div className="text-center">
                  <h3 className="text-4xl font-bold mb-2 text-gray-800">{selectedUI.name}</h3>
                  <p className="text-xl text-gray-700">選択されました！</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-matura-dark">
                  このデザインでUX構築を進めますか？
                </h4>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSelectedUI(null)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    他のを選ぶ
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-matura-primary to-matura-secondary text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
                  >
                    このデザインで進める
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}