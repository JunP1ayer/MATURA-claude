'use client'

import { useState } from 'react'
import { ArrowRight, Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { useMatura } from '@/components/providers/MaturaProvider'
import { UIStyle } from '@/lib/types'
import { UIStyleSelector } from '@/components/ui-styles/UIStyleSelector'

export default function SketchView() {
  const { state, actions } = useMatura()
  const [selectedUIStyle, setSelectedUIStyle] = useState<UIStyle | null>(state.selectedUIStyle)

  const handleStyleSelect = (style: UIStyle) => {
    setSelectedUIStyle(style)
  }

  const handleConfirm = () => {
    if (selectedUIStyle) {
      actions.setUIStyleAndNextPhase(selectedUIStyle)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Palette className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold mb-2">SketchView - UIスタイル選択</h2>
                <p className="text-white/90">
                  美しいUIスタイルテンプレートからお好みのデザインを選択してください
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <PreviewButton 
                data={selectedUIStyle} 
                title="選択したスタイル"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              />
            </div>
          </div>
        </div>

        <div className="p-8">
          <UIStyleSelector
            onStyleSelected={handleStyleSelect}
            selectedStyle={selectedUIStyle}
          />
          
          {selectedUIStyle && (
            <div className="text-center mt-8">
              <button
                onClick={handleConfirm}
                className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
              >
                このスタイルでUX構築を進める
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}