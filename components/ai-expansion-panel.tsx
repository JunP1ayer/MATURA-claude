'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Wand2, 
  Sparkles, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Code,
  Palette,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InteractiveButton, useToast } from '@/components/ui/interactive-feedback'
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations'

interface AIExpansionPanelProps {
  appId: string
  appType: string
  currentFeatures: string[]
  onExpansionComplete?: (result: any) => void
}

export function AIExpansionPanel({
  appId,
  appType,
  currentFeatures,
  onExpansionComplete
}: AIExpansionPanelProps) {
  const [isExpanding, setIsExpanding] = useState(false)
  const [expansionRequest, setExpansionRequest] = useState('')
  const [expansionResult, setExpansionResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const { toast } = useToast()

  const handleExpansion = async () => {
    if (!expansionRequest.trim()) {
      toast.warning('リクエストを入力してください', '機能追加・改善したい内容を具体的に記述してください')
      return
    }

    setIsExpanding(true)
    const loadingToastId = toast.loading('AI拡張を実行中...', 'アプリケーションを分析・改善しています')

    try {
      const response = await fetch('/api/ai-expand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId,
          appType,
          userRequest: expansionRequest,
          currentCode: await getCurrentAppCode(appId),
          existingFeatures: currentFeatures,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'AI拡張に失敗しました')
      }

      toast.dismiss(loadingToastId)
      toast.success(
        '🎉 AI拡張が完了しました！',
        `${result.modifications}件のコード変更と${result.uiImprovements}件のUI改善を適用しました`,
        { duration: 8000 }
      )

      setExpansionResult(result)
      setShowResult(true)
      setExpansionRequest('')

      if (onExpansionComplete) {
        onExpansionComplete(result)
      }

    } catch (error: any) {
      toast.dismiss(loadingToastId)
      toast.error(
        'AI拡張に失敗しました',
        error.message || '予期しないエラーが発生しました。しばらく待ってから再試行してください。'
      )
      console.error('AI Expansion error:', error)
    } finally {
      setIsExpanding(false)
    }
  }

  const suggestionPrompts = [
    {
      icon: Code,
      title: '機能追加',
      description: 'CRUD操作の追加',
      prompt: '検索機能とフィルタリング機能を追加して、データを素早く見つけられるようにしたい',
    },
    {
      icon: Palette,
      title: 'UI改善',
      description: 'デザインの向上',
      prompt: 'よりモダンで直感的なインターフェースにして、ユーザビリティを向上させたい',
    },
    {
      icon: Zap,
      title: 'パフォーマンス',
      description: '高速化・最適化',
      prompt: 'アプリの読み込み速度を向上させ、レスポンスを高速化したい',
    },
    {
      icon: Brain,
      title: 'AI機能',
      description: 'インテリジェント機能',
      prompt: 'AIによる自動分類やレコメンデーション機能を追加したい',
    },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* メインパネル */}
      <motion.div variants={fadeInUp}>
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              AI自己拡張機能
            </CardTitle>
            <CardDescription>
              自然言語でアプリケーションの機能追加・改善を行います。具体的な要望を入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 現在の機能表示 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">現在の機能</h4>
              <div className="flex flex-wrap gap-2">
                {currentFeatures.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 入力エリア */}
            <div className="space-y-3">
              <Textarea
                placeholder="例: ダッシュボードにグラフを追加して、データを可視化したい。売上推移や利用状況が一目で分かるようにしたい。"
                value={expansionRequest}
                onChange={(e) => setExpansionRequest(e.target.value)}
                className="min-h-24 resize-none"
                disabled={isExpanding}
              />
              
              <InteractiveButton
                onClick={handleExpansion}
                disabled={!expansionRequest.trim() || isExpanding}
                isLoading={isExpanding}
                loadingText="AI拡張実行中..."
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {!isExpanding && (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI拡張を実行
                  </>
                )}
              </InteractiveButton>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 提案プロンプト */}
      <motion.div variants={fadeInUp}>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          よく使われる改善リクエスト
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestionPrompts.map((suggestion, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:border-purple-300 transition-colors"
                onClick={() => setExpansionRequest(suggestion.prompt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <suggestion.icon className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">{suggestion.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{suggestion.prompt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 実行結果 */}
      <AnimatePresence>
        {showResult && expansionResult && (
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                  AI拡張完了
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 実行サマリー */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {expansionResult.modifications || 0}
                      </div>
                      <div className="text-sm text-gray-600">コード変更</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {expansionResult.uiImprovements || 0}
                      </div>
                      <div className="text-sm text-gray-600">UI改善</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {expansionResult.analysis?.feasibility || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">実現可能性</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(expansionResult.processingTime / 1000) || 0}s
                      </div>
                      <div className="text-sm text-gray-600">処理時間</div>
                    </div>
                  </div>

                  {/* 実行レポート */}
                  {expansionResult.executionReport && (
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-medium text-gray-900 mb-2">実行レポート</h4>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {expansionResult.executionReport}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      変更を確認
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowResult(false)}
                    >
                      閉じる
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 現在のアプリコードを取得するヘルパー関数
async function getCurrentAppCode(appId: string): Promise<string> {
  try {
    const response = await fetch(`/api/apps/${appId}`)
    const data = await response.json()
    return data.pageContent || ''
  } catch (error) {
    console.error('Failed to get current app code:', error)
    return ''
  }
}