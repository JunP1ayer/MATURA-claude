'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Target,
  Users,
  Cog,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  Edit3,
  Copy,
  Star,
  ArrowRight,
  Zap,
  BookOpen,
  Brain,
  Rocket
} from 'lucide-react'
import { type StructureData } from '@/lib/types'

interface StructureViewerProps {
  structureData: StructureData
  qualityScore?: number
  onEdit?: (field: keyof StructureData) => void
  onGenerate?: () => void
  isGenerating?: boolean
  className?: string
}

interface StructureField {
  key: keyof StructureData
  label: string
  icon: React.ReactNode
  color: string
  description: string
}

const structureFields: StructureField[] = [
  {
    key: 'why',
    label: 'なぜ (Why)',
    icon: <Target className="h-5 w-5" />,
    color: 'from-red-500 to-pink-500',
    description: '問題定義と解決価値'
  },
  {
    key: 'who',
    label: '誰のために (Who)',
    icon: <Users className="h-5 w-5" />,
    color: 'from-blue-500 to-cyan-500',
    description: 'ターゲットユーザー'
  },
  {
    key: 'what',
    label: '何を提供するか (What)',
    icon: <Cog className="h-5 w-5" />,
    color: 'from-green-500 to-emerald-500',
    description: '機能と価値'
  },
  {
    key: 'how',
    label: 'どのように (How)',
    icon: <Lightbulb className="h-5 w-5" />,
    color: 'from-yellow-500 to-orange-500',
    description: '実現方法'
  },
  {
    key: 'impact',
    label: '期待される影響 (Impact)',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'from-purple-500 to-indigo-500',
    description: '成果と意義'
  }
]

export default function StructureViewer({
  structureData,
  qualityScore = 85,
  onEdit,
  onGenerate,
  isGenerating = false,
  className = ''
}: StructureViewerProps) {
  const [activeField, setActiveField] = useState<keyof StructureData | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('コピーに失敗しました:', err)
    }
  }

  const getFieldContent = (field: StructureField) => {
    const value = structureData[field.key]
    if (Array.isArray(value)) {
      return value.join('\n')
    }
    return String(value || '')
  }

  const getCompletionPercentage = () => {
    const totalFields = structureFields.length
    const completedFields = structureFields.filter(field => {
      const value = structureData[field.key]
      if (Array.isArray(value)) {
        return value.length > 0 && value.some(item => item.trim().length > 0)
      }
      return typeof value === 'string' && value.trim().length > 0
    }).length
    
    return Math.round((completedFields / totalFields) * 100)
  }

  const completionPercentage = getCompletionPercentage()
  const isReady = completionPercentage >= 80

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* ヘッダー統計 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">構造化進捗</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {completionPercentage}%
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">品質スコア</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {qualityScore}点
                </div>
                <Badge variant={qualityScore >= 85 ? "default" : qualityScore >= 70 ? "secondary" : "outline"}>
                  {qualityScore >= 85 ? "優秀" : qualityScore >= 70 ? "良好" : "要改善"}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">準備状況</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {structureFields.filter(field => getFieldContent(field).length > 0).length}/5
                </div>
                <Badge variant={isReady ? "default" : "secondary"}>
                  {isReady ? "生成可能" : "未完了"}
                </Badge>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={onGenerate}
                  disabled={!isReady || isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3"
                >
                  {isGenerating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Rocket className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? "生成中..." : "アプリを生成"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 構造データカード（Trello/Notion風） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {structureFields.map((field, index) => {
            const content = getFieldContent(field)
            const hasContent = content.length > 0
            const isActive = activeField === field.key

            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative ${isActive ? 'z-10' : ''}`}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 ${
                    hasContent 
                      ? 'border-l-4 border-l-green-500 shadow-lg hover:shadow-xl' 
                      : 'border-l-4 border-l-gray-300 shadow-md hover:shadow-lg'
                  } ${isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                  onClick={() => setActiveField(isActive ? null : field.key)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${field.color} bg-opacity-10`}>
                          <div className={`text-gray-700`}>
                            {field.icon}
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {field.label}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {field.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {hasContent && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        <Badge variant={hasContent ? "default" : "secondary"}>
                          {hasContent ? "完了" : "未入力"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {hasContent ? (
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          {Array.isArray(structureData[field.key]) ? (
                            <ul className="space-y-2">
                              {(structureData[field.key] as string[]).map((item, idx) => (
                                <motion.li 
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="flex items-center space-x-2"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm text-gray-800">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {content}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-6 border border-dashed border-gray-300 text-center">
                          <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {field.label}の内容を入力してください
                          </p>
                        </div>
                      )}
                      
                      {/* アクションボタン */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-gray-500">
                          {Array.isArray(structureData[field.key]) 
                            ? `${(structureData[field.key] as string[]).length}項目`
                            : `${content.length}文字`
                          }
                        </div>
                        
                        <div className="flex space-x-2">
                          {hasContent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(content, field.key)
                              }}
                              disabled={copiedField === field.key}
                            >
                              {copiedField === field.key ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onEdit(field.key)
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 生成準備完了メッセージ */}
      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        🎉 構造化が完了しました！
                      </h3>
                      <p className="text-sm text-green-700">
                        高品質なアプリケーションを生成する準備が整いました
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    今すぐ生成
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}