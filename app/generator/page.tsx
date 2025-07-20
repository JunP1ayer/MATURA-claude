'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Sparkles, Rocket, CheckCircle2, Settings, Brain, Wand2 } from 'lucide-react'
import StructureViewer from '@/components/StructureViewer'
import type { StructureData } from '@/lib/types'

interface GenerationStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  description: string
}

export default function GeneratorPage() {
  const [input, setInput] = useState('')
  const [figmaFileId, setFigmaFileId] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAppUrl, setGeneratedAppUrl] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('input')
  const [structureData, setStructureData] = useState<StructureData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: 'analyze', name: 'アイデア分析', status: 'pending', description: 'あなたのアイデアを理解中...' },
    { id: 'figma', name: 'Figmaデザイン取得', status: 'pending', description: 'デザインシステムを取得中...' },
    { id: 'ui', name: 'UI生成', status: 'pending', description: '美しいインターフェースを作成中...' },
    { id: 'logic', name: 'ロジック生成', status: 'pending', description: 'アプリの機能を実装中...' },
    { id: 'integration', name: '統合', status: 'pending', description: 'すべてを組み合わせ中...' },
    { id: 'deploy', name: '完成', status: 'pending', description: 'アプリを起動中...' }
  ])

  const updateStepStatus = (stepId: string, status: GenerationStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ))
  }

  // アイデア分析機能
  const analyzeIdea = async () => {
    if (!input.trim()) return

    setIsAnalyzing(true)
    setActiveTab('structure')

    try {
      // 簡易構造化データ生成（実際の実装ではGemini APIを使用）
      const mockStructureData: StructureData = {
        why: `${input}により解決される問題と市場ニーズ`,
        who: `${input}を必要とするターゲットユーザー層`,
        what: [
          "核となる基本機能",
          "ユーザビリティ向上機能",
          "差別化要因となる機能",
          "エンゲージメント促進機能",
          "将来拡張予定機能"
        ],
        how: "Next.js 14 + TypeScript + Tailwind CSS による最新技術スタックでの実装",
        impact: "ユーザー効率化30%向上と市場における独自価値の創出"
      }

      // 遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStructureData(mockStructureData)
      setAnalysisResult({
        qualityScore: 87,
        readyForGeneration: true,
        recommendations: [
          "機能の優先順位付けが推奨されます",
          "ターゲットユーザーをより具体化してください",
          "技術スタックが適切に選択されています"
        ]
      })
    } catch (error) {
      console.error('分析エラー:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 新機能テスト関数を追加
  const testNewFeatures = async () => {
    try {
      // 動的インポートで新機能をテスト
      const { checkStructureQuality } = await import('@/lib/validation')
      const { promptTuner } = await import('@/lib/prompt-tuner')
      
      const testData = {
        why: "ホテルの予約プロセスを簡単にして、旅行者に快適な宿泊体験を提供したい",
        who: "旅行者、出張者、観光客",
        what: ["客室検索機能", "予約システム", "決済機能", "レビュー表示", "キャンセル機能"],
        how: "Next.js、TypeScript、Tailwind CSSを使用したモダンなWebアプリケーション実装",
        impact: "予約効率が30%向上し、顧客満足度が向上する"
      }
      
      const qualityCheck = checkStructureQuality(testData)
      const optimization = promptTuner.optimizeForGeneration(testData)
      
      setTestResult({ qualityCheck, optimization })
      alert(`✅ 新機能テスト成功！品質スコア: ${qualityCheck.qualityScore}%`)
    } catch (error) {
      console.error('新機能テストエラー:', error)
      alert('❌ 新機能テストに失敗しました: ' + error)
    }
  }

  const generateApp = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    setGeneratedAppUrl('')

    try {
      // ステップ1: アイデア分析
      updateStepStatus('analyze', 'running')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus('analyze', 'completed')

      // ステップ2: Figmaデザイン取得
      updateStepStatus('figma', 'running')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus('figma', 'completed')

      // ステップ3: UI生成 (実際はスキップ)
      updateStepStatus('ui', 'running')
      await new Promise(resolve => setTimeout(resolve, 500))
      updateStepStatus('ui', 'completed')

      // ステップ4: ロジック生成 (実際はスキップ)
      updateStepStatus('logic', 'running')
      await new Promise(resolve => setTimeout(resolve, 500))
      updateStepStatus('logic', 'completed')

      // ステップ5: 統合（構造化データを使用） - 新機能適用
      updateStepStatus('integration', 'running')
      
      // ユーザー入力のみでアプリを生成（構造化思考はAIが自動分析）
      const integrationResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userInput: input,
          figmaFileId: figmaFileId || undefined
        })
      })
      
      if (!integrationResponse.ok) {
        const errorData = await integrationResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `統合に失敗しました (${integrationResponse.status})`)
      }
      
      const integrationResult = await integrationResponse.json()
      updateStepStatus('integration', 'completed')

      // ステップ6: 完成
      updateStepStatus('deploy', 'running')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus('deploy', 'completed')
      
      // 生成されたアプリのURLを設定（新しい動的システム）
      const appUrl = integrationResult.result?.appUrl || integrationResult.appUrl
      
      if (appUrl) {
        // 新しい動的ビューアーURLを生成
        const appId = appUrl.split('/').pop() || appUrl.replace('/', '')
        const dynamicUrl = `/apps/${appId}`
        setGeneratedAppUrl(dynamicUrl)
        console.log('Generated app URL:', dynamicUrl, 'App ID:', appId)
      } else {
        // フォールバック: 生成されたアプリリストから最新を取得
        try {
          const appsResponse = await fetch('/api/apps')
          if (appsResponse.ok) {
            const appsData = await appsResponse.json()
            if (appsData.apps && appsData.apps.length > 0) {
              const latestApp = appsData.apps[0]
              setGeneratedAppUrl(`/apps/${latestApp.id}`)
              console.log('Using latest app:', latestApp.id)
            }
          }
        } catch (error) {
          console.error('Failed to get latest app:', error)
          setGeneratedAppUrl('/generated-app') // 従来のフォールバック
        }
      }

    } catch (error) {
      console.error('アプリ生成エラー:', error)
      // エラーハンドリング
    } finally {
      setIsGenerating(false)
    }
  }

  const getStepIcon = (status: GenerationStep['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MATURA
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">AI駆動のアプリ生成プラットフォーム</p>
          <p className="text-gray-500">高精度構造化 → 美しいUI → 完全なコード生成</p>
        </div>

        {/* メインタブナビゲーション */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="input" className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4" />
                <span>アイデア入力</span>
              </TabsTrigger>
              <TabsTrigger value="structure" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>構造化分析</span>
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center space-x-2">
                <Rocket className="h-4 w-4" />
                <span>アプリ生成</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* アイデア入力タブ */}
          <TabsContent value="input">
            <div className="max-w-2xl mx-auto">
              <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-500" />
                どんなアプリを作りたいですか？
              </CardTitle>
              <CardDescription>
                例: 「タスク管理アプリを作りたい」「家計簿アプリが欲しい」「ブログサイトを作って」
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="ここにアプリのアイデアを自由に書いてください...&#10;&#10;例:&#10;・毎日のタスクを管理できるアプリ&#10;・期限や優先度も設定したい&#10;・完了したタスクを確認できる機能も欲しい"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] text-base"
                disabled={isGenerating}
              />
              
              {/* 高度な設定 */}
              <div className="border-t pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  高度な設定 {showAdvanced ? '▼' : '▶'}
                </Button>
                
                {showAdvanced && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <div>
                      <Label htmlFor="figmaFileId" className="text-sm font-medium">
                        Figma File ID (オプション)
                      </Label>
                      <Input
                        id="figmaFileId"
                        type="text"
                        placeholder="例: GeCGXZi0K7PqpHmzXjZkWn"
                        value={figmaFileId}
                        onChange={(e) => setFigmaFileId(e.target.value)}
                        className="mt-1"
                        disabled={isGenerating}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        カスタムFigmaデザインを使用する場合は、File IDを入力してください。
                        <br />
                        空欄の場合はデフォルトのテンプレートを使用します。
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={analyzeIdea}
                  disabled={!input.trim() || isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      アイデアを分析
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={testNewFeatures}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 text-lg"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  新機能をテスト
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          {/* 構造化分析タブ */}
          <TabsContent value="structure">
            {structureData ? (
              <StructureViewer
                structureData={structureData}
                qualityScore={analysisResult?.qualityScore || 85}
                onGenerate={() => {
                  setActiveTab('generate')
                  generateApp()
                }}
                isGenerating={isGenerating}
              />
            ) : (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  アイデアを分析してください
                </h3>
                <p className="text-gray-500 mb-6">
                  まず「アイデア入力」タブでアイデアを入力し、分析を実行してください
                </p>
                <Button onClick={() => setActiveTab('input')} variant="outline">
                  アイデア入力へ戻る
                </Button>
              </div>
            )}
          </TabsContent>

          {/* アプリ生成タブ */}
          <TabsContent value="generate">
            {/* 生成プロセス表示 */}
            {isGenerating ? (
              <div className="max-w-2xl mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle>生成進行状況</CardTitle>
                <CardDescription>あなたのアプリを作成中です...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            step.status === 'completed' ? 'text-green-600' :
                            step.status === 'running' ? 'text-blue-600' :
                            'text-gray-500'
                          }`}>
                            {step.name}
                          </span>
                          {step.status === 'running' && (
                            <span className="text-sm text-gray-500">実行中...</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
            ) : generatedAppUrl ? (
              <div className="max-w-2xl mx-auto">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      🎉 アプリが完成しました！
                    </CardTitle>
                    <CardDescription>
                      あなたの要求に最適化された高品質アプリが完成しました。すぐにお試しください。
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => {
                          console.log('Opening app:', generatedAppUrl);
                          if (generatedAppUrl.startsWith('http')) {
                            window.open(generatedAppUrl, '_blank');
                          } else {
                            window.open(window.location.origin + generatedAppUrl, '_blank');
                          }
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        <Rocket className="mr-2 h-6 w-6" />
                        🚀 アプリをプレビュー
                      </Button>
                      
                      <div className="text-center">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setInput('')
                            setFigmaFileId('')
                            setGeneratedAppUrl('')
                            setStructureData(null)
                            setAnalysisResult(null)
                            setActiveTab('input')
                            setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
                          }}
                          className="text-gray-600"
                        >
                          新しいアプリを作る
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Rocket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  アプリ生成の準備が必要です
                </h3>
                <p className="text-gray-500 mb-6">
                  まずアイデアを分析してから生成を開始してください
                </p>
                <Button onClick={() => setActiveTab('input')} variant="outline">
                  アイデア入力へ戻る
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* 新機能テスト結果表示 */}
        {testResult && (
          <div className="max-w-2xl mx-auto mb-8 mt-8">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">✅ 新機能テスト結果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {testResult.qualityCheck.qualityScore}%
                      </div>
                      <div className="text-sm text-gray-600">品質スコア</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {testResult.qualityCheck.completeness}%
                      </div>
                      <div className="text-sm text-gray-600">完全性</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {testResult.optimization.promptStrategy}
                      </div>
                      <div className="text-sm text-gray-600">戦略</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {testResult.optimization.estimatedOutputQuality}%
                      </div>
                      <div className="text-sm text-gray-600">予想品質</div>
                    </div>
                  </div>
                  <div className="text-center text-green-700">
                    🎉 新機能が正常に動作しています！構造データの品質チェックとプロンプト最適化が成功しました。
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* サンプル例 */}
        {!isGenerating && !generatedAppUrl && (
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
              こんなアプリが作れます
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "タスク管理アプリ",
                  description: "やることリストを管理",
                  example: "毎日のタスクを追加して、完了したらチェックできるアプリが欲しい"
                },
                {
                  title: "レシピ管理アプリ", 
                  description: "料理レシピを保存・検索",
                  example: "レシピを保存して、材料や調理時間で検索できるアプリを作って"
                },
                {
                  title: "在庫管理システム",
                  description: "商品の在庫を追跡",
                  example: "商品の入出庫を記録して在庫数を管理できるシステムが欲しい"
                },
                {
                  title: "ブログサイト",
                  description: "記事を投稿・管理",
                  example: "記事を書いて投稿できるシンプルなブログサイトを作って"
                },
                {
                  title: "予約管理システム",
                  description: "予約の受付と管理",
                  example: "お客様の予約を受け付けて管理できるシステムを作りたい"
                },
                {
                  title: "学習記録アプリ",
                  description: "勉強時間と進捗を記録",
                  example: "毎日の勉強時間を記録して、グラフで進捗を見れるアプリ"
                }
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setInput(item.example)}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 italic">
                      "{item.example}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}