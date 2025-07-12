'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, Plus, Download, Share2, Figma, ChevronRight } from 'lucide-react'
import ThinkingFrameCard from './ThinkingFrameCard'

interface FigmaElement {
  id: string
  name: string
  type: 'text' | 'frame' | 'rectangle' | 'group'
  content?: string
  styles: any
  children?: FigmaElement[]
}

interface ThinkingData {
  why: string
  who: string
  what: string[]
  how: string
  impact: string
}

interface StructuredThinkingLayoutProps {
  figmaFileId?: string
  initialData?: ThinkingData
}

export default function StructuredThinkingLayout({
  figmaFileId = '',
  initialData
}: StructuredThinkingLayoutProps) {
  const [thinkingData, setThinkingData] = useState<ThinkingData>(
    initialData || {
      why: '',
      who: '',
      what: [],
      how: '',
      impact: ''
    }
  )
  
  const [figmaElements, setFigmaElements] = useState<FigmaElement[]>([])
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['why']))
  const [loadingFigma, setLoadingFigma] = useState(false)
  const [projectTitle, setProjectTitle] = useState('新しい思考プロジェクト')

  // Figma要素を思考フレームに振り分ける
  const categorizeFigmaElements = (elements: FigmaElement[]) => {
    const categorized = {
      why: [] as FigmaElement[],
      who: [] as FigmaElement[],
      what: [] as FigmaElement[],
      how: [] as FigmaElement[],
      impact: [] as FigmaElement[]
    }

    elements.forEach(element => {
      // 名前やコンテンツから推測して振り分け
      const name = element.name.toLowerCase()
      const content = element.content?.toLowerCase() || ''
      
      if (name.includes('vision') || name.includes('goal') || name.includes('purpose') || 
          content.includes('目的') || content.includes('ビジョン') || content.includes('理念')) {
        categorized.why.push(element)
      } else if (name.includes('user') || name.includes('target') || name.includes('persona') ||
                 content.includes('ユーザー') || content.includes('対象') || content.includes('ペルソナ')) {
        categorized.who.push(element)
      } else if (name.includes('feature') || name.includes('function') || name.includes('content') ||
                 content.includes('機能') || content.includes('コンテンツ') || content.includes('要素')) {
        categorized.what.push(element)
      } else if (name.includes('flow') || name.includes('process') || name.includes('step') ||
                 content.includes('手順') || content.includes('プロセス') || content.includes('フロー')) {
        categorized.how.push(element)
      } else if (name.includes('result') || name.includes('impact') || name.includes('effect') ||
                 content.includes('効果') || content.includes('成果') || content.includes('結果')) {
        categorized.impact.push(element)
      } else {
        // デフォルトはwhatに分類
        categorized.what.push(element)
      }
    })

    return categorized
  }

  // Figmaデータの読み込み
  const loadFigmaReference = async () => {
    if (!figmaFileId) return
    
    setLoadingFigma(true)
    try {
      // 既存のparseFigma.jsで生成されたJSONを読み込む想定
      const response = await fetch(`/api/figma-test?fileId=${figmaFileId}&secure=true`)
      const result = await response.json()
      
      if (result.success && result.data) {
        // ダミーデータ（実際は解析結果を使用）
        const sampleElements: FigmaElement[] = [
          {
            id: '1',
            name: 'Vision Statement',
            type: 'text',
            content: '学園祭で地域の人々と学生が繋がる場を作りたい',
            styles: {}
          },
          {
            id: '2', 
            name: 'Target User Profile',
            type: 'frame',
            content: '地域住民（30-60代）、学生（18-25歳）',
            styles: {}
          },
          {
            id: '3',
            name: 'Feature List',
            type: 'frame',
            content: 'イベント情報、アクセス、出店情報',
            styles: {}
          }
        ]
        setFigmaElements(sampleElements)
      }
    } catch (error) {
      console.error('Figma data loading failed:', error)
    } finally {
      setLoadingFigma(false)
    }
  }

  const updateThinkingData = (stage: keyof ThinkingData, value: string | string[]) => {
    setThinkingData(prev => ({ ...prev, [stage]: value }))
  }

  // AI思考支援機能
  const handleAIAssist = async (stage: string, currentValue: string | string[]) => {
    try {
      const response = await fetch('/api/structure-autofill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userInput: `${stage}について考えてください。現在の内容: ${Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}`,
          stage: stage
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        const stageKey = stage as keyof ThinkingData
        const newValue = result.data.structure[stageKey]
        updateThinkingData(stageKey, newValue)
      } else {
        console.error('AI思考支援エラー:', result.error)
      }
    } catch (error) {
      console.error('AI思考支援リクエストエラー:', error)
    }
  }

  const toggleCardExpansion = (stage: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stage)) {
        newSet.delete(stage)
      } else {
        newSet.add(stage)
      }
      return newSet
    })
  }

  const getProgressPercentage = () => {
    let filled = 0
    
    // why, who, how, impact をチェック
    if (thinkingData.why.trim().length > 10) filled++
    if (thinkingData.who.trim().length > 10) filled++
    if (thinkingData.how.trim().length > 10) filled++
    if (thinkingData.impact.trim().length > 10) filled++
    
    // what をチェック（配列）
    if (Array.isArray(thinkingData.what) && thinkingData.what.length > 0) filled++
    
    return Math.round((filled / 5) * 100)
  }

  const categorizedElements = categorizeFigmaElements(figmaElements)

  const thinkingFrames = [
    {
      stage: 'why' as const,
      title: 'Why - なぜやるのか',
      description: '目的・ビジョン・理念を明確にする',
      placeholder: '例：地域と学生をつなぐ新しい学園祭体験を作り、互いの理解を深めたい...',
      figmaReferences: categorizedElements.why
    },
    {
      stage: 'who' as const, 
      title: 'Who - だれのためか',
      description: 'ターゲットユーザー・ステークホルダーを特定する',
      placeholder: '例：地域住民（特に30-60代の家族層）と大学生、地元商店の方々...',
      figmaReferences: categorizedElements.who
    },
    {
      stage: 'what' as const,
      title: 'What - なにを提供するか', 
      description: '具体的な価値・機能・コンテンツを定義する',
      placeholder: '例：ヒーローセクション、タイムテーブル、出展紹介、アクセスマップ...',
      figmaReferences: categorizedElements.what
    },
    {
      stage: 'how' as const,
      title: 'How - どうやって実現するか',
      description: '実装方法・プロセス・手順を具体化する', 
      placeholder: '例：学生団体と地域自治会の連携体制構築、出店者向けWebシステム開発...',
      figmaReferences: categorizedElements.how
    },
    {
      stage: 'impact' as const,
      title: 'Impact - どんな効果・変化を生むか',
      description: '期待される成果・影響・価値創造を描く',
      placeholder: '例：年間来場者数30%増、地域交流イベント年4回開催、学生の地域愛着度向上...',
      figmaReferences: categorizedElements.impact
    }
  ]

  useEffect(() => {
    if (figmaFileId) {
      loadFigmaReference()
    }
  }, [figmaFileId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="text-xl font-bold border-none bg-transparent p-0 h-auto focus:outline-none"
                />
                <p className="text-sm text-gray-500">思考構造化プロジェクト</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-white">
                進捗 {getProgressPercentage()}%
              </Badge>
              {figmaFileId && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Figma className="h-3 w-3 mr-1" />
                  参考データあり
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                共有
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                エクスポート
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">

        {/* 進捗概要 */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🧠 思考構造化の進捗</span>
              </CardTitle>
              <CardDescription>
                5つのフレームワークで思考を体系的に整理し、実現可能な形に構造化します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                {thinkingFrames.map((frame, index) => (
                  <div key={frame.stage} className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        (frame.stage === 'what' ? 
                          (Array.isArray(thinkingData[frame.stage]) && thinkingData[frame.stage].length > 0) :
                          (typeof thinkingData[frame.stage] === 'string' && thinkingData[frame.stage].length > 10))
                          ? 'bg-green-500 text-white' 
                          : expandedCards.has(frame.stage)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < thinkingFrames.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Figma参考データ読み込み状況 */}
        {figmaFileId && (
          <section className="mb-6">
            <Alert>
              <Figma className="h-4 w-4" />
              <AlertDescription>
                {loadingFigma ? (
                  '📡 Figma参考データを読み込み中...'
                ) : figmaElements.length > 0 ? (
                  `✅ ${figmaElements.length}個のFigma要素を参考として読み込みました。各思考フレームで活用できます。`
                ) : (
                  '⚠️ Figma参考データを読み込めませんでした。思考整理は通常通り進められます。'
                )}
              </AlertDescription>
            </Alert>
          </section>
        )}

        {/* 思考フレームカード群 */}
        <section className="space-y-6">
          {thinkingFrames.map((frame, index) => (
            <ThinkingFrameCard
              key={frame.stage}
              stage={frame.stage}
              title={frame.title}
              description={frame.description}
              placeholder={frame.placeholder}
              value={thinkingData[frame.stage]}
              onChange={(value) => updateThinkingData(frame.stage, value)}
              figmaReferences={frame.figmaReferences.map(el => ({
                id: el.id,
                name: el.name,
                type: el.type === 'text' ? 'text' : 'frame',
                content: el.content,
                preview: el.content
              }))}
              isExpanded={expandedCards.has(frame.stage)}
              onToggleExpand={() => toggleCardExpansion(frame.stage)}
              onAIAssist={handleAIAssist}
            />
          ))}
        </section>

        {/* 次のステップ */}
        {getProgressPercentage() >= 80 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">🎉 思考構造化が完了しました！</CardTitle>
                <CardDescription className="text-green-600">
                  次のステップに進んで、具体的な実現方法を検討しましょう
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    デザイン検討フェーズへ
                  </Button>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    実装計画フェーズへ
                  </Button>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    ビジネス戦略フェーズへ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}
      </main>
    </div>
  )
}