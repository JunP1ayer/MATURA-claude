'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, FileImage, Zap, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-react'

export default function FigmaImportPage() {
  const [figmaUrl, setFigmaUrl] = useState('')
  const [userRequirement, setUserRequirement] = useState('')
  const [appType, setAppType] = useState('webapp')
  const [generateType, setGenerateType] = useState('full')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<string>('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)
    setCurrentStep('Figmaデータを取得中...')

    try {
      const response = await fetch('/api/figma-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          figmaUrl,
          userRequirement,
          appType,
          generateType
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setResult(data)
        setCurrentStep('完了！')
      } else {
        throw new Error(data.error || 'Generation failed')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setCurrentStep('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestFigma = async () => {
    setIsLoading(true)
    setError(null)
    setCurrentStep('Figmaファイルをテスト中...')

    try {
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileUrl: figmaUrl
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setResult({ testData: data.data, isTest: true })
        setCurrentStep('テスト完了！')
      } else {
        throw new Error(data.error || 'Test failed')
      }
    } catch (err: any) {
      setError(err.message || 'Test failed')
      setCurrentStep('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Figma to Next.js Generator
          </h1>
          <p className="text-gray-600 text-lg">
            FigmaデザインからNext.jsアプリケーションを自動生成
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Figmaファイル設定
              </CardTitle>
              <CardDescription>
                FigmaのURLを入力してアプリケーションを生成します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <Label htmlFor="figmaUrl">Figma URL</Label>
                  <Input
                    id="figmaUrl"
                    type="url"
                    placeholder="https://www.figma.com/file/..."
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    例: https://www.figma.com/file/ABC123/My-Design
                  </p>
                </div>

                <div>
                  <Label htmlFor="appType">アプリケーションタイプ</Label>
                  <Select value={appType} onValueChange={setAppType}>
                    <SelectTrigger>
                      <SelectValue placeholder="アプリタイプを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webapp">Webアプリ</SelectItem>
                      <SelectItem value="landing">ランディングページ</SelectItem>
                      <SelectItem value="dashboard">ダッシュボード</SelectItem>
                      <SelectItem value="ecommerce">ECサイト</SelectItem>
                      <SelectItem value="blog">ブログ</SelectItem>
                      <SelectItem value="portfolio">ポートフォリオ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="generateType">生成タイプ</Label>
                  <Select value={generateType} onValueChange={setGenerateType}>
                    <SelectTrigger>
                      <SelectValue placeholder="生成タイプを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">完全生成</SelectItem>
                      <SelectItem value="ui">UIのみ</SelectItem>
                      <SelectItem value="structure">構造のみ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="userRequirement">追加要件 (オプション)</Label>
                  <Textarea
                    id="userRequirement"
                    placeholder="例: ユーザー認証機能を追加、ダークモード対応など"
                    value={userRequirement}
                    onChange={(e) => setUserRequirement(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !figmaUrl}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {currentStep}
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        生成開始
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestFigma}
                    disabled={isLoading || !figmaUrl}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    テスト
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Result Display */}
          <Card>
            <CardHeader>
              <CardTitle>生成結果</CardTitle>
              <CardDescription>
                生成されたアプリケーションの情報
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result && (
                <div className="space-y-4">
                  {result.isTest ? (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">概要</TabsTrigger>
                        <TabsTrigger value="design">デザイン</TabsTrigger>
                        <TabsTrigger value="structure">構造</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">ファイル名</p>
                            <p className="text-sm text-gray-600">{result.testData.file.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">最終更新</p>
                            <p className="text-sm text-gray-600">
                              {new Date(result.testData.file.lastModified).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                              {result.testData.designSystem.colors.length}
                            </p>
                            <p className="text-sm text-gray-600">カラー</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {result.testData.designSystem.fonts.length}
                            </p>
                            <p className="text-sm text-gray-600">フォント</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                              {result.testData.designSystem.components.length}
                            </p>
                            <p className="text-sm text-gray-600">コンポーネント</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="design" className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">カラーパレット</p>
                          <div className="flex flex-wrap gap-2">
                            {result.testData.designSystem.colors.slice(0, 10).map((color: string, index: number) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-xs font-mono"
                                style={{ backgroundColor: color }}
                                title={color}
                              >
                                {color.length <= 7 ? color : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">フォント</p>
                          <div className="space-y-1">
                            {result.testData.designSystem.fonts.slice(0, 5).map((font: string, index: number) => (
                              <Badge key={index} variant="outline">
                                {font}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="structure" className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">ページ構造</p>
                          <div className="space-y-2">
                            {result.testData.structure.pages.map((page: any, index: number) => (
                              <div key={index} className="border rounded p-3">
                                <p className="font-medium">{page.name}</p>
                                <p className="text-sm text-gray-600">{page.children} フレーム</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          生成が完了しました！ファイルが /app/generated-app/ に保存されました。
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">生成されたページ</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {result.generated?.pages || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">生成されたコンポーネント</p>
                          <p className="text-2xl font-bold text-green-600">
                            {result.generated?.components || 0}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">次のステップ</p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <pre className="text-green-600">
                            cd app/generated-app{'\n'}
                            npm run dev
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}