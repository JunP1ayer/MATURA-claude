'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight, Eye, EyeOff, Lightbulb } from 'lucide-react'

interface FigmaReference {
  id: string
  name: string
  type: 'text' | 'frame'
  content?: string
  preview?: string
}

interface ThinkingFrameCardProps {
  stage: 'why' | 'who' | 'what' | 'how' | 'impact'
  title: string
  description: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  figmaReferences?: FigmaReference[]
  isExpanded?: boolean
  onToggleExpand?: () => void
}

const stageColors = {
  why: 'bg-purple-50 border-purple-200 text-purple-900',
  who: 'bg-blue-50 border-blue-200 text-blue-900',
  what: 'bg-green-50 border-green-200 text-green-900',
  how: 'bg-orange-50 border-orange-200 text-orange-900',
  impact: 'bg-red-50 border-red-200 text-red-900'
}

const stageIcons = {
  why: '🎯',
  who: '👥', 
  what: '📦',
  how: '⚙️',
  impact: '📈'
}

export default function ThinkingFrameCard({
  stage,
  title,
  description,
  placeholder,
  value,
  onChange,
  figmaReferences = [],
  isExpanded = false,
  onToggleExpand
}: ThinkingFrameCardProps) {
  const [showFigmaRef, setShowFigmaRef] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  const handleAIAssist = () => {
    setIsThinking(true)
    // AI思考支援のロジック（将来実装）
    setTimeout(() => {
      setIsThinking(false)
    }, 2000)
  }

  const colorClass = stageColors[stage]
  const stageIcon = stageIcons[stage]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className={`${colorClass} transition-all duration-200 hover:shadow-md`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{stageIcon}</span>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-sm opacity-70">
                  {description}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {figmaReferences.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFigmaRef(!showFigmaRef)}
                  className="text-xs"
                >
                  {showFigmaRef ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  参考 ({figmaReferences.length})
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="text-xs"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
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
                {/* Figma参考パネル */}
                <AnimatePresence>
                  {showFigmaRef && figmaReferences.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 p-3 bg-white/50 rounded-lg border border-dashed"
                    >
                      <div className="text-xs font-medium mb-2 opacity-70">
                        📎 Figma参考要素 - 思考整理の参考として
                      </div>
                      <div className="space-y-2">
                        {figmaReferences.map((ref) => (
                          <div key={ref.id} className="flex items-start space-x-2 text-xs">
                            <Badge variant="outline" className="text-xs">
                              {ref.type === 'text' ? '📝' : '📐'} {ref.type}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{ref.name}</div>
                              {ref.content && (
                                <div className="text-gray-600 truncate italic">
                                  "{ref.content.slice(0, 40)}..."
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs opacity-60">
                        💡 これらの要素を参考に、あなたの思考を整理してください
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 思考入力エリア */}
                <div className="space-y-3">
                  <Textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="min-h-[100px] bg-white/70 border-0 focus:bg-white transition-colors"
                    rows={4}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs opacity-60">
                      {value.length} 文字 / 思考を深めるため、具体的に書いてください
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAIAssist}
                      disabled={isThinking}
                      className="text-xs"
                    >
                      {isThinking ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Lightbulb className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Lightbulb className="h-4 w-4" />
                      )}
                      AI思考支援
                    </Button>
                  </div>
                </div>

                {/* 思考の深化プロンプト */}
                {value.length > 0 && value.length < 50 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs"
                  >
                    💭 もう少し詳しく考えてみませんか？「なぜそう思うのか」「具体的にはどういうことか」を追加してみてください。
                  </motion.div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}