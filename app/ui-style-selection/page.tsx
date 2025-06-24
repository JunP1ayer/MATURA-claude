'use client'

import { useState } from 'react'
import { UIStyleSelector } from '@/components/design-proposals/UIStyleSelector'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Lightbulb, Users, Target, Zap, TrendingUp } from 'lucide-react'
import type { DesignProposal } from '@/lib/prompts/design-generator'

export default function UIStyleSelectionPage() {
  const [selectedDesign, setSelectedDesign] = useState<DesignProposal | null>(null)
  
  // GPTによる構造化済みのプロダクト情報（例）
  const productInfo = {
    idea: "旅行の思い出を記録・共有できるアプリ",
    structuredInfo: {
      why: "旅行の記憶が時間と共に薄れてしまい、大切な思い出を適切に保存・共有する手段が不足している",
      who: "20-40代の旅行好きで、思い出を大切にし、SNSで体験を共有したい人々",
      what: "写真・動画・位置情報・感想を統合して、旅行の記録を美しくまとめて共有できる価値",
      how: "直感的なタイムライン機能と地図統合、AI による自動編集機能",
      impact: "旅行体験の価値最大化と、友人・家族との思い出の共有促進"
    }
  }

  const handleDesignSelected = (design: DesignProposal) => {
    setSelectedDesign(design)
    console.log('Selected design:', design)
    
    // ここで次のステップに進む処理を実装
    // 例：onNext(design) などのコールバック
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              構造化完了
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              UIスタイルを選択してください
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              あなたのアイデア「{productInfo.idea}」を分析し、最適な5つのトップページデザイン案を生成しました。
            </p>
          </div>
        </div>
      </div>

      {/* Product Analysis Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            プロダクト分析結果
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">Why</span>
                </div>
                <span className="text-sm font-medium text-gray-700">なぜ</span>
              </div>
              <p className="text-xs text-gray-600">{productInfo.structuredInfo.why}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">誰が</span>
              </div>
              <p className="text-xs text-gray-600">{productInfo.structuredInfo.who}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">何を</span>
              </div>
              <p className="text-xs text-gray-600">{productInfo.structuredInfo.what}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">どうやって</span>
              </div>
              <p className="text-xs text-gray-600">{productInfo.structuredInfo.how}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">影響</span>
              </div>
              <p className="text-xs text-gray-600">{productInfo.structuredInfo.impact}</p>
            </div>
          </div>
        </Card>

        {/* UI Style Selector */}
        <UIStyleSelector
          userIdea={productInfo.idea}
          onDesignSelected={handleDesignSelected}
        />

        {/* Selected Design Details */}
        {selectedDesign && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  選択されたデザイン詳細
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">見出し</span>
                    <p className="text-base font-medium text-gray-900">{selectedDesign.heading}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">サブ説明</span>
                    <p className="text-sm text-gray-700">{selectedDesign.subDescription}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">スタイル名</span>
                    <p className="text-sm text-gray-700">{selectedDesign.styleName}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">独自価値</span>
                    <p className="text-sm text-gray-700">{selectedDesign.uniqueValue}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">特徴タグ</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedDesign.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">配色パレット</span>
                    <div className="flex gap-2 mt-1">
                      <div 
                        className="w-6 h-6 rounded border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedDesign.colorScheme.primary }}
                        title="Primary"
                      />
                      <div 
                        className="w-6 h-6 rounded border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedDesign.colorScheme.secondary }}
                        title="Secondary"
                      />
                      <div 
                        className="w-6 h-6 rounded border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedDesign.colorScheme.background }}
                        title="Background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <a 
              href="/design-test"
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              ← テストページに戻る
            </a>
            
            <div className="text-center sm:text-right">
              <p className="text-xs text-gray-500">
                Next.js + TypeScript + Tailwind CSS + shadcn/ui
              </p>
              <p className="text-xs text-gray-400">
                レスポンシブ対応済み
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}