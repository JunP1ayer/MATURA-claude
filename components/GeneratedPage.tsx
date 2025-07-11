'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, RefreshCw, Download, Eye, Code, Figma } from 'lucide-react'

interface ParsedElement {
  type: 'frame' | 'text' | 'rectangle' | 'group'
  id: string
  name: string
  styles: {
    backgroundColor?: string
    color?: string
    fontSize?: number
    fontWeight?: number
    width?: number
    height?: number
    x?: number
    y?: number
    borderRadius?: number
    padding?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
  }
  content?: string
  children?: ParsedElement[]
}

interface ParsedDesign {
  name: string
  elements: ParsedElement[]
  metadata: {
    totalElements: number
    hasText: boolean
    hasFrames: boolean
    dominantColors: string[]
  }
}

interface GeneratedPageProps {
  fileId?: string
  parsedData?: ParsedDesign
  onRefresh?: () => void
}

export default function GeneratedPage({ 
  fileId = '',
  parsedData = null,
  onRefresh
}: GeneratedPageProps) {
  const [loading, setLoading] = useState(false)
  const [currentData, setCurrentData] = useState<ParsedDesign | null>(parsedData)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [error, setError] = useState<string | null>(null)

  // Figmaデータを取得する関数
  const fetchFigmaData = async (targetFileId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/figma-test?fileId=${targetFileId}&secure=true`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch Figma data')
      }
      
      // ここで実際のFigmaDesignParserを使用（サーバーサイドで解析）
      // または、クライアントサイドで解析
      setCurrentData({
        name: result.data.name || 'Figma Design',
        elements: [], // 簡略化のため空配列
        metadata: {
          totalElements: 0,
          hasText: false,
          hasFrames: false,
          dominantColors: ['#000000']
        }
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // 要素をReactコンポーネントとしてレンダリング
  const renderElement = (element: ParsedElement, index: number) => {
    const styles = convertStylesToCSS(element.styles)
    
    const baseProps = {
      key: element.id || index,
      style: styles,
      'data-figma-id': element.id,
      'data-figma-name': element.name
    }

    switch (element.type) {
      case 'text':
        return (
          <motion.p
            {...baseProps}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="figma-text-element"
          >
            {element.content || ''}
          </motion.p>
        )
      
      case 'frame':
      case 'group':
        return (
          <motion.div
            {...baseProps}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="figma-frame-element"
          >
            {element.children?.map((child, childIndex) => 
              renderElement(child, childIndex)
            )}
            {!element.children && (
              <div className="frame-label text-xs text-gray-400 p-2">
                Frame: {element.name}
              </div>
            )}
          </motion.div>
        )
      
      case 'rectangle':
        return (
          <motion.div
            {...baseProps}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="figma-rectangle-element"
          />
        )
      
      default:
        return (
          <motion.div
            {...baseProps}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="figma-unknown-element"
          >
            <div className="text-xs text-gray-500">
              {element.type}: {element.name}
            </div>
          </motion.div>
        )
    }
  }

  // スタイルオブジェクトをCSS形式に変換
  const convertStylesToCSS = (styles: ParsedElement['styles']): React.CSSProperties => {
    const css: React.CSSProperties = {}

    if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor
    if (styles.color) css.color = styles.color
    if (styles.fontSize) css.fontSize = `${styles.fontSize}px`
    if (styles.fontWeight) css.fontWeight = styles.fontWeight
    if (styles.width) css.width = `${styles.width}px`
    if (styles.height) css.height = `${styles.height}px`
    if (styles.borderRadius) css.borderRadius = `${styles.borderRadius}px`
    
    // 位置情報
    if (styles.x !== undefined || styles.y !== undefined) {
      css.position = 'absolute'
      if (styles.x !== undefined) css.left = `${styles.x}px`
      if (styles.y !== undefined) css.top = `${styles.y}px`
    }

    // パディング
    if (styles.padding) {
      const p = styles.padding
      css.padding = `${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${p.left || 0}px`
    }

    return css
  }

  // JSXコードを生成
  const generateJSXCode = () => {
    if (!currentData) return ''
    
    const elementsJSX = currentData.elements.map((element, index) => {
      const styles = convertStylesToCSS(element.styles)
      const styleString = JSON.stringify(styles, null, 2)
      
      switch (element.type) {
        case 'text':
          return `    <p style={${styleString}} data-figma-id="${element.id}">
      ${element.content || ''}
    </p>`
        
        case 'frame':
        case 'group':
          return `    <div style={${styleString}} data-figma-id="${element.id}">
      {/* Frame: ${element.name} */}
    </div>`
        
        case 'rectangle':
          return `    <div style={${styleString}} data-figma-id="${element.id}"></div>`
        
        default:
          return `    <div style={${styleString}} data-figma-id="${element.id}">
      {/* ${element.type}: ${element.name} */}
    </div>`
      }
    }).join('\n')

    return `'use client'

import React from 'react'

// Generated from Figma design: ${currentData.name}
// Elements: ${currentData.metadata.totalElements}
// Colors: ${currentData.metadata.dominantColors.join(', ')}

export default function FigmaGeneratedPage() {
  return (
    <div 
      className="figma-generated-container" 
      style={{ 
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '${currentData.metadata.dominantColors[0] || '#ffffff'}'
      }}
    >
${elementsJSX}
    </div>
  )
}`
  }

  // 初期化時にfileIdがある場合はデータを取得
  useEffect(() => {
    if (fileId && !parsedData) {
      fetchFigmaData(fileId)
    }
  }, [fileId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-600">
                <Figma className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentData?.name || 'Figma Design Parser'}
                </h1>
                <p className="text-sm text-gray-500">
                  Figmaデザインをリアルタイムでレンダリング
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'preview' ? 'code' : 'preview')}
              >
                {viewMode === 'preview' ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {viewMode === 'preview' ? 'Code' : 'Preview'}
              </Button>
              
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* エラー表示 */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>
              ❌ {error}
            </AlertDescription>
          </Alert>
        )}

        {/* ローディング状態 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Figmaデータを解析中...</span>
          </div>
        )}

        {/* メインコンテンツ */}
        {!loading && currentData && (
          <div className="space-y-6">
            {/* メタデータ */}
            <Card>
              <CardHeader>
                <CardTitle>Design Information</CardTitle>
                <CardDescription>
                  Figmaデザインから解析された情報
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {currentData.metadata.totalElements}
                    </div>
                    <div className="text-sm text-gray-500">Total Elements</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {currentData.metadata.hasText ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-500">Has Text</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {currentData.metadata.hasFrames ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-500">Has Frames</div>
                  </div>
                  <div>
                    <div className="flex space-x-1">
                      {currentData.metadata.dominantColors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">Colors</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ビューモード切り替え */}
            <AnimatePresence mode="wait">
              {viewMode === 'preview' ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="figma-preview-container"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Design Preview</CardTitle>
                      <CardDescription>
                        Figmaデザインのリアルタイムレンダリング
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="border rounded-lg overflow-hidden"
                        style={{ 
                          minHeight: '400px',
                          backgroundColor: currentData.metadata.dominantColors[0] || '#ffffff',
                          position: 'relative'
                        }}
                      >
                        {currentData.elements.map((element, index) => 
                          renderElement(element, index)
                        )}
                        {currentData.elements.length === 0 && (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            No elements to display
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated JSX Code</CardTitle>
                      <CardDescription>
                        Figmaデザインから生成されたReactコンポーネント
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{generateJSXCode()}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* データがない場合 */}
        {!loading && !currentData && !error && (
          <div className="text-center py-12">
            <Figma className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Figma data loaded
            </h3>
            <p className="text-gray-500">
              Provide a file ID or parsed data to see the preview
            </p>
          </div>
        )}
      </main>
    </div>
  )
}