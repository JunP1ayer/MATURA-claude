'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, 
  Eye, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  RefreshCw,
  FileText,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
  Info
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type StructureData } from '@/lib/types'

interface CodeViewerProps {
  structureData: StructureData
  generatedCode?: {
    html: string
    css?: string
    javascript?: string
    framework?: string
    dependencies?: string[]
  }
  onGenerate?: () => void
  isGenerating?: boolean
  className?: string
}

interface ViewportSize {
  name: string
  width: string
  height: string
  icon: React.ReactNode
}

const viewportSizes: ViewportSize[] = [
  { name: 'デスクトップ', width: '100%', height: '600px', icon: <Monitor className="h-4 w-4" /> },
  { name: 'タブレット', width: '768px', height: '600px', icon: <Tablet className="h-4 w-4" /> },
  { name: 'スマートフォン', width: '375px', height: '600px', icon: <Smartphone className="h-4 w-4" /> }
]

export default function CodeViewer({
  structureData,
  generatedCode,
  onGenerate,
  isGenerating = false,
  className = ''
}: CodeViewerProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'code'>('structure')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [selectedViewport, setSelectedViewport] = useState(0)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 構造データの統計
  const getStructureStats = () => {
    const stats = {
      totalFields: 0,
      completedFields: 0,
      totalCharacters: 0,
      readyForGeneration: false
    }

    Object.entries(structureData).forEach(([key, value]) => {
      stats.totalFields++
      
      if (Array.isArray(value)) {
        if (value.length > 0) {
          stats.completedFields++
          stats.totalCharacters += value.join('').length
        }
      } else if (typeof value === 'string' && value.trim().length > 0) {
        stats.completedFields++
        stats.totalCharacters += value.length
      }
    })

    stats.readyForGeneration = stats.completedFields >= 4 // 最低4つのフィールドが必要

    return stats
  }

  // コピー機能
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('コピーに失敗しました:', err)
    }
  }

  // プレビューの読み込み
  const loadPreview = () => {
    if (!generatedCode?.html || !iframeRef.current) return

    setIsPreviewLoading(true)
    setPreviewError(null)

    try {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document

      if (doc) {
        doc.open()
        doc.write(generatedCode.html)
        doc.close()

        iframe.onload = () => {
          setIsPreviewLoading(false)
        }

        iframe.onerror = () => {
          setIsPreviewLoading(false)
          setPreviewError('プレビューの読み込みに失敗しました')
        }

        setTimeout(() => {
          if (isPreviewLoading) {
            setIsPreviewLoading(false)
            setPreviewError('読み込みがタイムアウトしました')
          }
        }, 10000)
      }
    } catch (error) {
      setIsPreviewLoading(false)
      setPreviewError('プレビューエラーが発生しました')
    }
  }

  useEffect(() => {
    if (generatedCode?.html && activeTab === 'code') {
      loadPreview()
    }
  }, [generatedCode?.html, activeTab])

  const structureStats = getStructureStats()
  const currentViewport = viewportSizes[selectedViewport]

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'structure' | 'code')}>
        {/* タブヘッダー */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2">
            <TabsTrigger value="structure" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>構造データ</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>生成されたコード</span>
              {generatedCode && (
                <Badge variant="secondary" className="ml-1">
                  完了
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-3">
            {/* 統計情報 */}
            <Badge variant="outline" className="text-sm">
              {structureStats.completedFields}/{structureStats.totalFields} 完了
            </Badge>
            
            <Badge variant="outline" className="text-sm">
              {structureStats.totalCharacters} 文字
            </Badge>

            {/* 生成ボタン */}
            {!generatedCode && (
              <Button
                onClick={onGenerate}
                disabled={!structureStats.readyForGeneration || isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                  </motion.div>
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                コード生成
              </Button>
            )}
          </div>
        </div>

        {/* 構造データタブ */}
        <TabsContent value="structure" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* 構造データ表示 */}
                {Object.entries(structureData).map(([key, value]) => {
                  const hasContent = Array.isArray(value) ? value.length > 0 : String(value).length > 0
                  const displayValue = Array.isArray(value) ? value.join('\n') : String(value)

                  return (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold capitalize flex items-center space-x-2">
                          <span className="capitalize">{key.toUpperCase()}</span>
                          {hasContent && <Check className="h-4 w-4 text-green-600" />}
                        </h3>
                        
                        {hasContent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(displayValue, key)}
                            disabled={copiedField === key}
                          >
                            {copiedField === key ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            {copiedField === key ? 'コピー済み' : 'コピー'}
                          </Button>
                        )}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border">
                        {hasContent ? (
                          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                            {displayValue}
                          </pre>
                        ) : (
                          <p className="text-gray-500 italic text-sm">未入力</p>
                        )}
                      </div>

                      {Array.isArray(value) && (
                        <div className="text-xs text-gray-600">
                          {value.length} 項目
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* 構造データの品質評価 */}
                <Alert className={`${structureStats.readyForGeneration ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {structureStats.readyForGeneration ? (
                      <span className="text-green-800">
                        ✅ 構造データが完成しています。コード生成を開始できます。
                      </span>
                    ) : (
                      <span className="text-yellow-800">
                        ⚠️ 最低4つのフィールドを入力してからコード生成を行ってください。
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* コードタブ */}
        <TabsContent value="code" className="space-y-6">
          {!generatedCode ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    コードがまだ生成されていません
                  </h3>
                  <p className="text-gray-500 mb-6">
                    構造データを完成させてからコード生成ボタンを押してください
                  </p>
                  <Button
                    onClick={onGenerate}
                    disabled={!structureStats.readyForGeneration || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                      </motion.div>
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    コード生成を開始
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* コード表示エリア */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">生成されたコード</h3>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCode.html, 'html')}
                          disabled={copiedField === 'html'}
                        >
                          {copiedField === 'html' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          コピー
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          ダウンロード
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                      <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                        {generatedCode.html}
                      </pre>
                    </div>

                    {/* コード情報 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">フレームワーク:</span>
                        <Badge variant="outline" className="ml-2">
                          {generatedCode.framework || 'Next.js'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">コード長:</span>
                        <span className="ml-2 font-mono">{generatedCode.html.length} 文字</span>
                      </div>
                    </div>

                    {generatedCode.dependencies && generatedCode.dependencies.length > 0 && (
                      <div>
                        <span className="text-gray-600 text-sm">依存関係:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {generatedCode.dependencies.map((dep, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* プレビューエリア */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">ライブプレビュー</h3>
                      
                      <div className="flex items-center space-x-2">
                        {/* ビューポート選択 */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          {viewportSizes.map((size, index) => (
                            <Button
                              key={index}
                              variant={selectedViewport === index ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setSelectedViewport(index)}
                              className="p-2"
                            >
                              {size.icon}
                            </Button>
                          ))}
                        </div>
                        
                        <Button variant="ghost" size="sm" onClick={loadPreview}>
                          <RefreshCw className="h-4 w-4" />
                          更新
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                          新しいタブで開く
                        </Button>
                      </div>
                    </div>

                    {/* プレビューフレーム */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: currentViewport.height }}>
                      <div className="bg-gray-800 text-white px-4 py-2 text-sm flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <span>プレビュー - {currentViewport.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {currentViewport.width} × {currentViewport.height}
                        </Badge>
                      </div>

                      <div className="relative h-full bg-white" style={{ width: currentViewport.width, maxWidth: '100%', margin: '0 auto' }}>
                        {isPreviewLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                            <div className="text-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"
                              />
                              <p className="text-gray-600 text-sm">プレビューを読み込み中...</p>
                            </div>
                          </div>
                        )}

                        {previewError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
                            <div className="text-center">
                              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                              <h3 className="text-red-800 font-semibold mb-1">プレビューエラー</h3>
                              <p className="text-red-600 text-sm">{previewError}</p>
                            </div>
                          </div>
                        )}

                        <iframe
                          ref={iframeRef}
                          className="w-full h-full border-0"
                          sandbox="allow-scripts allow-same-origin allow-forms"
                          title="コードプレビュー"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}