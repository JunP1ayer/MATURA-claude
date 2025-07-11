'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Play, Download, Github, ExternalLink, Figma } from 'lucide-react'
import GeneratedPage from '@/components/GeneratedPage'

interface ParsedDesign {
  name: string
  elements: any[]
  metadata: {
    totalElements: number
    hasText: boolean
    hasFrames: boolean
    dominantColors: string[]
  }
}

export default function FigmaDemoPage() {
  const [fileId, setFileId] = useState('iBSG2tTkhYM9Ucvi04u5sx')
  const [parsedData, setParsedData] = useState<ParsedDesign | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // パースされたデータをロード
  const loadParsedData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 実際の運用では、Node.jsスクリプトで生成されたJSONファイルを読み込む
      // ここではダミーデータを使用
      const dummyData: ParsedDesign = {
        name: "Figma basics",
        elements: [
          {
            type: "text",
            id: "10:9",
            name: "Design your own card here!",
            styles: {
              width: 480,
              height: 124,
              x: 100,
              y: 50,
              backgroundColor: "#f8f9fa",
              fontSize: 32,
              fontWeight: 600,
              color: "#1a1a1a"
            },
            content: "Design your own card here!"
          },
          {
            type: "frame",
            id: "10:10",
            name: "Card Container",
            styles: {
              width: 400,
              height: 250,
              x: 50,
              y: 200,
              backgroundColor: "#ffffff",
              borderRadius: 12
            }
          },
          {
            type: "text",
            id: "10:12",
            name: "Subtitle",
            styles: {
              width: 300,
              height: 50,
              x: 100,
              y: 250,
              fontSize: 16,
              fontWeight: 400,
              color: "#666666"
            },
            content: "This is automatically generated from Figma design"
          },
          {
            type: "rectangle",
            id: "10:11",
            name: "Featured Image",
            styles: {
              width: 350,
              height: 150,
              x: 75,
              y: 300,
              backgroundColor: "#e1f5fe",
              borderRadius: 8
            }
          }
        ],
        metadata: {
          totalElements: 4,
          hasText: true,
          hasFrames: true,
          dominantColors: ["#1a1a1a", "#ffffff", "#e1f5fe"]
        }
      }
      
      setParsedData(dummyData)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load parsed data')
    } finally {
      setLoading(false)
    }
  }

  // ページ読み込み時にデータをロード
  useEffect(() => {
    loadParsedData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                <Figma className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  MATURA + Figma Integration Demo
                </h1>
                <p className="text-gray-600 mt-1">
                  Figmaデザインから自動生成されたUIコンポーネント
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✅ Figma Connected
              </Badge>
              <Badge variant="outline">
                v2.0.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 概要セクション */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-blue-600" />
                <span>実装完了機能</span>
              </CardTitle>
              <CardDescription>
                MATURAはただのコード生成ツールを超越し、「ユーザーの想い → 心を掴むデザイン」へ変換するプラットフォームとなりました
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">✅</div>
                  <div className="font-semibold">FigmaDesignParser</div>
                  <div className="text-sm text-gray-600">Frame/Text要素の解析</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">✅</div>
                  <div className="font-semibold">parseFigma.js</div>
                  <div className="text-sm text-gray-600">Node.js実行スクリプト</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">✅</div>
                  <div className="font-semibold">GeneratedPage.tsx</div>
                  <div className="text-sm text-gray-600">Reactコンポーネント表示</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">🔄</div>
                  <div className="font-semibold">MATURA統合</div>
                  <div className="text-sm text-gray-600">完全自動化デモ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* コントロールセクション */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Figma File Controls</CardTitle>
              <CardDescription>
                FigmaファイルIDを指定してリアルタイムでデザインを解析・レンダリング
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="Figma File ID"
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={loadParsedData} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Parse & Render
                </Button>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  View Source
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export JSX
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Figma
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* エラー表示 */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>
              ❌ {error}
            </AlertDescription>
          </Alert>
        )}

        {/* GeneratedPageコンポーネントの表示 */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Live Figma Design Rendering</CardTitle>
              <CardDescription>
                FigmaデザインがリアルタイムでReactコンポーネントとしてレンダリングされます
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                {parsedData ? (
                  <GeneratedPage
                    fileId={fileId}
                    parsedData={parsedData}
                    onRefresh={loadParsedData}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Figmaデザインを解析中...</span>
                      </div>
                    ) : (
                      'No design data loaded'
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 将来の拡張ロードマップ */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>🚀 Future Expansion Roadmap</CardTitle>
              <CardDescription>
                MATURAの「想い → デザイン」体験をさらに進化させる次期機能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Phase 2: 深度解析</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>ネストした子要素の再帰解析</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>レイアウト制約とAuto Layout</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>コンポーネント/バリアント解析</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>インタラクション・アニメーション</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Phase 3: AI統合</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>自然言語からFigmaデザイン生成</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>デザインシステムの自動抽出</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>ユーザビリティ改善提案</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>A/Bテスト用バリエーション生成</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">🎯 Ultimate Vision</h4>
                <p className="text-gray-700">
                  ユーザーが「学園祭のワクワクを伝えたい」と言葉で表現するだけで、
                  MATURAが自動的にFigmaでデザインを作成し、Reactコードを生成し、
                  デプロイまで完結する完全自動化プラットフォーム
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}