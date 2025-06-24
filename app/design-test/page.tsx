'use client'

import { useState } from 'react'
import { UIStyleSelector } from '@/components/design-proposals/UIStyleSelector'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { DesignProposal } from '@/lib/prompts/design-generator'

export default function DesignTestPage() {
  const [userIdea, setUserIdea] = useState('')
  const [submittedIdea, setSubmittedIdea] = useState('')
  const [selectedDesign, setSelectedDesign] = useState<DesignProposal | null>(null)
  const [showSelector, setShowSelector] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userIdea.trim()) {
      setSubmittedIdea(userIdea.trim())
      setShowSelector(true)
      setSelectedDesign(null)
    }
  }

  const handleDesignSelected = (design: DesignProposal) => {
    setSelectedDesign(design)
    console.log('Selected design:', design)
  }

  const handleReset = () => {
    setUserIdea('')
    setSubmittedIdea('')
    setSelectedDesign(null)
    setShowSelector(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            デザイン案生成テスト
          </h1>
          <p className="text-lg text-gray-600">
            アプリのアイデアを入力すると、5つのトップページデザイン案を生成します
          </p>
        </div>

        {!showSelector ? (
          /* Input Form */
          <Card className="max-w-2xl mx-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                  アプリのアイデアを入力してください
                </label>
                <Input
                  id="idea"
                  type="text"
                  value={userIdea}
                  onChange={(e) => setUserIdea(e.target.value)}
                  placeholder="例：料理レシピを共有できるSNSアプリ"
                  className="w-full text-lg"
                  autoFocus
                />
              </div>
              
              <Button
                type="submit"
                disabled={!userIdea.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                デザイン案を生成
              </Button>
            </form>

            {/* Examples */}
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-600 mb-4">アイデアの例：</p>
              <div className="space-y-2">
                {[
                  '健康管理アプリ',
                  'タスク管理ツール',
                  'オンライン学習プラットフォーム',
                  'フィットネストラッカー',
                  'レストラン予約システム'
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setUserIdea(example)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    → {example}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          /* Design Selector */
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4">
                <span className="text-sm text-gray-600">アイデア:</span>
                <span className="font-medium">{submittedIdea}</span>
              </div>
            </div>

            <UIStyleSelector
              userIdea={submittedIdea}
              onDesignSelected={handleDesignSelected}
            />

            {/* Selected Design Info */}
            {selectedDesign && (
              <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      デザインが選択されました！
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      選択したデザイン: {selectedDesign.styleName}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>見出し: {selectedDesign.heading}</p>
                      <p>メインカラー: {selectedDesign.colorScheme.primary}</p>
                      <p>ターゲット: {selectedDesign.targetAudience}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                  >
                    別のアイデアを試す
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <a 
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            ← MATURAに戻る
          </a>
        </div>
      </div>
    </div>
  )
}