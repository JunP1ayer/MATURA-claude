'use client'

import React, { useState } from 'react'
import UISelectionStep from './UISelectionStep'
import { UIStyle } from './SwipeCard'

interface UISelectionProps {
  onComplete?: (selectedStyles: UIStyle[]) => void
  onBack?: () => void
}

export default function UISelection({ onComplete, onBack }: UISelectionProps) {
  const [selectedStyles, setSelectedStyles] = useState<UIStyle[]>([])
  const [currentStep, setCurrentStep] = useState<'selection' | 'result'>('selection')

  const handleStyleSelected = (style: UIStyle) => {
    console.log('Selected UI Style:', style)
    
    // ここで選択されたスタイルを親コンポーネントに渡すか、
    // 次のステップに進む処理を実装
    if (onComplete) {
      onComplete([style])
    }
    
    // または、選択結果ページに遷移
    setCurrentStep('result')
  }

  if (currentStep === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎨</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">UIスタイル選択完了！</h1>
            <p className="text-gray-600 mb-8">
              選択されたスタイルでアプリケーションの構築を開始します
            </p>
            <button
              onClick={() => setCurrentStep('selection')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              もう一度選択する
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <UISelectionStep
      onStyleSelected={handleStyleSelected}
      onBack={onBack}
      selectedStyles={selectedStyles}
    />
  )
}

// Export individual components for flexible usage
export { UISelectionStep }
export type { UIStyle } from './SwipeCard'