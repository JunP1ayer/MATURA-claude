'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  Sparkles, 
  Settings, 
  Share2,
  Download,
  Eye,
  EyeOff,
  ChevronRight,
  Zap
} from 'lucide-react'
import { checkStructureQuality, type QualityCheckResult } from '@/lib/validation'
import { promptTuner, type PromptOptimizationResult } from '@/lib/prompt-tuner'

interface StructureData {
  why: string
  who: string
  what: string[]
  how: string
  impact: string
}

interface EnhancedStructureViewProps {
  initialData?: Partial<StructureData>
  onDataChange?: (data: StructureData) => void
  onGenerate?: (optimizedData: PromptOptimizationResult) => void
  currentStage?: 'structure' | 'generating' | 'completed'
  isLoading?: boolean
}

const stageConfigs = {
  why: {
    title: 'Why - なぜやるのか',
    description: '目的・ビジョン・理念を明確にする',
    icon: '🎯',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  who: {
    title: 'Who - だれのためか',
    description: 'ターゲットユーザー・ステークホルダーを特定',
    icon: '👥',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  what: {
    title: 'What - なにを提供するか',
    description: '具体的な価値・機能・コンテンツを定義',
    icon: '⚙️',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  how: {
    title: 'How - どうやって実現するか',
    description: '実装方法・プロセス・手順を具体化',
    icon: '🛠️',
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  impact: {
    title: 'Impact - どんな効果・変化を生むか',
    description: '期待される成果・影響・価値創造を描く',
    icon: '📈',
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
}

export default function EnhancedStructureView({
  initialData = {},
  onDataChange,
  onGenerate,
  currentStage = 'structure',
  isLoading = false
}: EnhancedStructureViewProps) {
  const [structureData, setStructureData] = useState<StructureData>({
    why: initialData.why || '',
    who: initialData.who || '',
    what: initialData.what || [],
    how: initialData.how || '',
    impact: initialData.impact || ''
  })

  const [qualityCheck, setQualityCheck] = useState<QualityCheckResult | null>(null)
  const [optimization, setOptimization] = useState<PromptOptimizationResult | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['why']))
  const [showQualityPanel, setShowQualityPanel] = useState(false)

  // 品質チェックの実行
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = checkStructureQuality(structureData)
      setQualityCheck(result)
      
      if (result.readyForGeneration) {
        const optimizationResult = promptTuner.optimizeForGeneration(structureData)
        setOptimization(optimizationResult)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [structureData])

  // 親コンポーネントにデータ変更を通知
  useEffect(() => {
    onDataChange?.(structureData)
  }, [structureData, onDataChange])

  const updateStructureData = (field: keyof StructureData, value: string | string[]) => {
    setStructureData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleCardExpansion = (field: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(field)) {
        newSet.delete(field)
      } else {
        newSet.add(field)
      }
      return newSet
    })
  }

  const getStageIndicator = () => {
    switch (currentStage) {
      case 'structure':
        return { label: '構造設計中', color: 'bg-blue-500', icon: <Settings className="h-4 w-4" /> }
      case 'generating':
        return { label: '生成中', color: 'bg-yellow-500', icon: <Zap className="h-4 w-4" /> }
      case 'completed':
        return { label: '生成完了', color: 'bg-green-500', icon: <CheckCircle className="h-4 w-4" /> }
    }
  }

  const stageIndicator = getStageIndicator()

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">構造化プロダクト設計</h1>
            <p className="text-gray-600">Why/Who/What/How/Impactで思考を体系化</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className={`${stageIndicator.color} text-white border-0`}>
            {stageIndicator.icon}
            <span className="ml-1">{stageIndicator.label}</span>
          </Badge>
          
          {qualityCheck && (
            <Badge 
              variant="outline" 
              className={`${qualityCheck.qualityScore >= 80 ? 'bg-green-100 text-green-800' : 
                         qualityCheck.qualityScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                         'bg-red-100 text-red-800'}`}
            >
              品質スコア: {qualityCheck.qualityScore}%
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowQualityPanel(!showQualityPanel)}
          >
            {showQualityPanel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            品質チェック
          </Button>
        </div>
      </div>

      {/* 品質チェックパネル */}
      <AnimatePresence>
        {showQualityPanel && qualityCheck && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span>品質分析レポート</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{qualityCheck.qualityScore}%</div>
                    <div className="text-sm text-gray-600">総合品質</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{qualityCheck.completeness}%</div>
                    <div className="text-sm text-gray-600">完全性</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{qualityCheck.consistency}%</div>
                    <div className="text-sm text-gray-600">一貫性</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{qualityCheck.clarity}%</div>
                    <div className="text-sm text-gray-600">明確性</div>
                  </div>
                </div>

                {qualityCheck.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">改善提案</h4>
                    {qualityCheck.issues.map((issue, index) => (
                      <Alert key={index} className={`
                        ${issue.type === 'error' ? 'bg-red-50 border-red-200' : 
                          issue.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                          'bg-blue-50 border-blue-200'}
                      `}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-medium">{issue.field}:</span> {issue.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 進捗バー */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">構造化進捗</span>
            <span className="text-sm text-gray-600">
              {qualityCheck ? `${Math.round((qualityCheck.completeness / 100) * 5)}/5` : '0/5'} セクション完了
            </span>
          </div>
          <Progress 
            value={qualityCheck?.completeness || 0} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* 構造データカード */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(Object.keys(stageConfigs) as Array<keyof typeof stageConfigs>).map((field) => {
          const config = stageConfigs[field]
          const isExpanded = expandedCards.has(field)
          const value = structureData[field]
          const hasContent = Array.isArray(value) ? value.length > 0 : value.length > 0
          
          return (
            <motion.div
              key={field}
              layout
              className={`${isExpanded ? 'lg:col-span-2' : ''}`}
            >
              <Card className={`
                ${config.bgColor} ${config.borderColor} border-2 
                transition-all duration-300 hover:shadow-lg cursor-pointer
                ${hasContent ? 'ring-2 ring-green-200' : ''}
              `}>
                <CardHeader 
                  className="pb-3"
                  onClick={() => toggleCardExpansion(field)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        p-2 rounded-lg bg-gradient-to-r ${config.color} text-white text-xl
                      `}>
                        {config.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800">
                          {config.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {config.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {hasContent && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      <ChevronRight 
                        className={`h-5 w-5 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <Textarea
                            placeholder={`${config.title}について詳しく記述してください...`}
                            value={Array.isArray(value) ? value.join('\n') : value}
                            onChange={(e) => {
                              const newValue = e.target.value
                              if (field === 'what') {
                                updateStructureData(field, newValue.split('\n').filter(v => v.trim()))
                              } else {
                                updateStructureData(field, newValue)
                              }
                            }}
                            className="min-h-[120px] bg-white/80 border-0 focus:bg-white resize-none"
                            rows={5}
                          />
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                              {Array.isArray(value) ? 
                                `${value.length} 項目, ${value.join('').length} 文字` : 
                                `${value.length} 文字`
                              }
                            </span>
                            
                            <Button variant="ghost" size="sm">
                              <Lightbulb className="h-4 w-4 mr-1" />
                              AI支援
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* 生成ボタン */}
      {qualityCheck?.readyForGeneration && optimization && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-800">
                    構造化が完了しました！
                  </span>
                </div>
                
                <p className="text-green-700 max-w-2xl mx-auto">
                  品質スコア {optimization.qualityCheck.qualityScore}% - 
                  {optimization.promptStrategy === 'advanced' ? '高品質' : 
                   optimization.promptStrategy === 'enhanced' ? '標準品質' : '基本品質'}の
                  コード生成が可能です。
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button 
                    onClick={() => onGenerate?.(optimization)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                      </motion.div>
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    コード生成を開始
                  </Button>
                  
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    構造を共有
                  </Button>
                  
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    JSONで保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}