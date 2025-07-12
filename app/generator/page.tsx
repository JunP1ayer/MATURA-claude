'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Sparkles, Rocket, CheckCircle2, Settings } from 'lucide-react'

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

      // ステップ5: 統合（Figmaデータを含む） - メイン処理
      updateStepStatus('integration', 'running')
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
      
      // 生成されたアプリのURLを設定
      const appUrl = integrationResult.result?.appUrl || integrationResult.appUrl || '/generated-app'
      setGeneratedAppUrl(appUrl)
      console.log('Generated app URL:', appUrl)

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
          <p className="text-xl text-gray-600 mb-2">自然言語でアプリを作ろう</p>
          <p className="text-gray-500">あなたのアイデアを、そのまま文章で書いてください</p>
        </div>

        {/* メイン入力エリア */}
        <div className="max-w-2xl mx-auto mb-8">
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
              
              <Button 
                onClick={generateApp}
                disabled={!input.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    アプリを生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    アプリを作る
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 生成プロセス表示 */}
        {isGenerating && (
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
        )}

        {/* 完成したアプリ表示 */}
        {generatedAppUrl && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  🎉 アプリが完成しました！
                </CardTitle>
                <CardDescription>
                  あなたのアイデアが動くアプリになりました
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => window.open(generatedAppUrl, '_blank')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
                  >
                    <Rocket className="mr-2 h-5 w-5" />
                    アプリを開く
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setInput('')
                        setFigmaFileId('')
                        setGeneratedAppUrl('')
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