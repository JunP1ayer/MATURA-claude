'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UIStyleSelector } from './UIStyleSelector'
import { UIStyle } from './StyleTemplates'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface UIStyleSelectionProps {
  onComplete: (selectedStyle: UIStyle) => void
  onBack?: () => void
  initialStyle?: UIStyle | null
}

export const UIStyleSelection: React.FC<UIStyleSelectionProps> = ({
  onComplete,
  onBack,
  initialStyle = null
}) => {
  const [selectedStyle, setSelectedStyle] = useState<UIStyle | null>(initialStyle)
  const [step, setStep] = useState<'selection' | 'confirmation'>('selection')

  const handleStyleSelected = (style: UIStyle) => {
    setSelectedStyle(style)
  }

  const handleContinue = () => {
    if (selectedStyle) {
      setStep('confirmation')
    }
  }

  const handleConfirm = () => {
    if (selectedStyle) {
      onComplete(selectedStyle)
    }
  }

  const handleBackToSelection = () => {
    setStep('selection')
  }

  if (step === 'confirmation' && selectedStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              スタイル選択を確認
            </h1>
            <p className="text-gray-600">
              選択したUIスタイルでアプリケーションを構築します
            </p>
          </motion.div>

          {/* Confirmation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                選択完了
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedStyle.name}
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                {selectedStyle.description}
              </p>
            </div>

            {/* Style Preview */}
            <div className="mb-8">
              <div className="max-w-md mx-auto">
                <UIStyleSelector
                  onStyleSelected={() => {}}
                  selectedStyle={selectedStyle}
                  className="pointer-events-none"
                />
              </div>
            </div>

            {/* Style Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">デザインの特徴</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStyle.personality.map((trait) => (
                    <span
                      key={trait}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">カラーパレット</h3>
                <div className="flex gap-3">
                  {Object.entries(selectedStyle.colors)
                    .filter(([key]) => ['primary', 'secondary', 'accent'].includes(key))
                    .map(([key, color]) => (
                    <div key={key} className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-md mb-2"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-600 capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleBackToSelection}
                className="px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻って変更
              </Button>
              <Button
                onClick={handleConfirm}
                className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                このスタイルで決定
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
              )}
              <div>
                <h1 className="font-semibold text-gray-900">UIスタイル選択</h1>
                <p className="text-sm text-gray-600">Step 1 of 2: スタイルを選択</p>
              </div>
            </div>
            
            {selectedStyle && (
              <Button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                選択を確認
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <UIStyleSelector 
        onStyleSelected={handleStyleSelected}
        selectedStyle={selectedStyle}
      />
    </div>
  )
}

// Export everything for easy import
export { UIStyleSelector } from './UIStyleSelector'
export { UIPreview, UI_STYLES } from './StyleTemplates'
export type { UIStyle } from './StyleTemplates'
export default UIStyleSelection