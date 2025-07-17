'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Palette, Code, Eye, Wand2, Figma, Lightbulb } from 'lucide-react';
import { DynamicForm } from '@/components/DynamicForm';
import { DataTable } from '@/components/DataTable';
import { toast } from 'sonner';
import { FigmaStyleSelector } from '@/components/FigmaStyleSelector';
import { IntelligentDesignGenerator } from '@/components/IntelligentDesignGenerator';
import { selectOptimalDesignPattern } from '@/lib/smart-ui-selector';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue?: string;
}

interface Schema {
  tableName: string;
  columns: Column[];
}

interface DesignTheme {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
  };
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
}

const designThemes: DesignTheme[] = [
  {
    name: 'モダンブルー',
    description: 'プロフェッショナルで洗練された印象',
    colors: {
      primary: 'blue-600',
      secondary: 'blue-100',
      background: 'gray-50',
      surface: 'white',
      accent: 'indigo-500'
    },
    style: 'modern'
  },
  {
    name: 'エレガントパープル',
    description: '上品で高級感のあるデザイン',
    colors: {
      primary: 'purple-600',
      secondary: 'purple-100',
      background: 'slate-50',
      surface: 'white',
      accent: 'violet-500'
    },
    style: 'elegant'
  },
  {
    name: 'ミニマルグレー',
    description: 'シンプルで使いやすい',
    colors: {
      primary: 'gray-700',
      secondary: 'gray-100',
      background: 'gray-50',
      surface: 'white',
      accent: 'slate-600'
    },
    style: 'minimal'
  },
  {
    name: 'フレッシュグリーン',
    description: '自然で親しみやすい',
    colors: {
      primary: 'green-600',
      secondary: 'green-100',
      background: 'green-50',
      surface: 'white',
      accent: 'emerald-500'
    },
    style: 'modern'
  }
];

export default function AppCreatorPage() {
  const [step, setStep] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<DesignTheme>(designThemes[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [schema, setSchema] = useState<Schema | null>(null);
  const [isCreatingApp, setIsCreatingApp] = useState(false);
  const [appCreated, setAppCreated] = useState(false);
  const [useFigma, setUseFigma] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState('');
  const [isGeneratingFigma, setIsGeneratingFigma] = useState(false);
  const [selectedFigmaPattern, setSelectedFigmaPattern] = useState(null);
  const [generationMode, setGenerationMode] = useState<'intelligent' | 'traditional'>('intelligent');
  const [intelligentResult, setIntelligentResult] = useState(null);

  const generateSchema = async () => {
    if (!userInput.trim()) {
      toast.error('アプリのアイデアを入力してください');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/infer-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error('スキーマ生成に失敗しました');
      }

      const result = await response.json();
      setSchema(result.schema);
      setStep(2);
      toast.success('スキーマが生成されました！');
    } catch (error) {
      toast.error('スキーマ生成中にエラーが発生しました');
      console.error('Schema generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWithFigma = async () => {
    if (!userInput.trim()) {
      toast.error('アプリのアイデアを入力してください');
      return;
    }

    setIsGeneratingFigma(true);
    try {
      // First generate schema
      const schemaResponse = await fetch('/api/infer-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!schemaResponse.ok) {
        throw new Error('スキーマ生成に失敗しました');
      }

      const schemaResult = await schemaResponse.json();
      setSchema(schemaResult.schema);

      // Then generate with Figma
      const figmaResponse = await fetch('/api/figma-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          figmaUrl: figmaUrl || undefined,
          userRequirement: userInput,
          appType: 'webapp',
          generateType: 'full'
        }),
      });

      if (!figmaResponse.ok) {
        throw new Error('Figmaベース生成に失敗しました');
      }

      setStep(2);
      toast.success('Figmaベースのスキーマが生成されました！');
    } catch (error) {
      toast.error('Figma生成中にエラーが発生しました');
      console.error('Figma generation error:', error);
    } finally {
      setIsGeneratingFigma(false);
    }
  };

  const createApp = async () => {
    if (!schema) return;

    setIsCreatingApp(true);
    try {
      const response = await fetch('/api/create-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema }),
      });

      if (!response.ok) {
        throw new Error('アプリ作成に失敗しました');
      }

      setAppCreated(true);
      setStep(3);
      toast.success('あなたのアプリが完成しました！');
    } catch (error) {
      toast.error('アプリ作成中にエラーが発生しました');
      console.error('App creation error:', error);
    } finally {
      setIsCreatingApp(false);
    }
  };

  const handleIntelligentGenerate = (result: any) => {
    setIntelligentResult(result);
    setStep(2);
    toast.success('AI がアプリを智能的に生成しました！');
  };

  const handleIntelligentSchemaGenerate = (schema: any) => {
    setSchema(schema);
  };

  const resetCreator = () => {
    setStep(1);
    setUserInput('');
    setSchema(null);
    setAppCreated(false);
    setSelectedTheme(designThemes[0]);
    setUseFigma(false);
    setFigmaUrl('');
    setSelectedFigmaPattern(null);
    setGenerationMode('intelligent');
    setIntelligentResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Wand2 className="h-10 w-10 text-purple-600" />
            AI アプリクリエーター
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            自然言語でアイデアを伝えるだけで、美しいデザインと完全な機能を備えたアプリを自動生成
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= num 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > num ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Input & Design Generation */}
        {step === 1 && (
          <Card className="max-w-6xl mx-auto shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                ステップ1: アイデアからUIを生成
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* App Idea Input */}
              <div className="space-y-4">
                <Label htmlFor="app-idea" className="text-lg font-semibold">
                  あなたのアプリアイデア
                </Label>
                <Textarea
                  id="app-idea"
                  placeholder="例: チームのタスク管理を効率化したい。開発者とデザイナーが対象で、プロジェクトごとに進捗を可視化でき、優先度も設定できるツールが欲しい。結果として生産性を30%向上させたい。"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={4}
                  className="text-lg"
                />
              </div>

              {/* Generation Mode Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">生成モード選択</Label>
                <Tabs value={generationMode} onValueChange={(value) => setGenerationMode(value as 'intelligent' | 'traditional')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="intelligent" className="text-lg py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI智能生成（推奨）
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="traditional" className="text-lg py-3">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        従来のスタイル選択
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="intelligent" className="mt-6">
                    <IntelligentDesignGenerator
                      onGenerate={handleIntelligentGenerate}
                      onSchemaGenerate={handleIntelligentSchemaGenerate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="traditional" className="mt-6">
                    <div className="space-y-6">
                      <FigmaStyleSelector
                        onStyleSelect={(pattern, figmaUrl) => {
                          setSelectedFigmaPattern(pattern);
                          if (figmaUrl) {
                            setFigmaUrl(figmaUrl);
                            setUseFigma(true);
                          } else {
                            setUseFigma(false);
                            setFigmaUrl('');
                          }
                          const matchingTheme = designThemes.find(t => t.name.includes(pattern.category)) || designThemes[0];
                          setSelectedTheme(matchingTheme);
                        }}
                        selectedPattern={selectedFigmaPattern}
                        customFigmaUrl={figmaUrl}
                        onFigmaUrlChange={setFigmaUrl}
                      />

                      <div className="flex gap-3">
                        <Button 
                          onClick={useFigma ? generateWithFigma : generateSchema} 
                          disabled={(isGenerating || isGeneratingFigma) || !userInput.trim() || !selectedFigmaPattern}
                          className="flex-1 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          {(isGenerating || isGeneratingFigma) ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              {useFigma ? 'Figma分析中...' : 'AI分析中...'}
                            </>
                          ) : (
                            <>
                              {useFigma ? <Figma className="mr-2 h-5 w-5" /> : <Wand2 className="mr-2 h-5 w-5" />}
                              {useFigma ? 'Figmaで生成' : 'スキーマを生成'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schema Review and Design Insights */}
        {step === 2 && schema && (
          <div className="space-y-6">
            {/* Intelligent Generation Results */}
            {intelligentResult && (
              <Card className="max-w-6xl mx-auto shadow-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2 text-green-700">
                    <Sparkles className="h-6 w-6" />
                    AI智能分析結果
                  </CardTitle>
                  <p className="text-green-600">
                    あなたのアイデアから最適なデザインとスキーマを生成しました
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Analysis Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">構造化分析</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">なぜ:</span> {intelligentResult.analysis.structuredData.why}</p>
                        <p><span className="font-medium">誰が:</span> {intelligentResult.analysis.structuredData.who}</p>
                        <p><span className="font-medium">何を:</span> {intelligentResult.analysis.structuredData.what}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">選択されたデザイン</h4>
                      <div className="space-y-2">
                        <p className="font-medium text-purple-600">
                          {intelligentResult.intelligentSelection.customizedPattern.name}
                        </p>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            {intelligentResult.analysis.designContext.category}
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            MVP: {intelligentResult.intelligentSelection.customizedPattern.mvpScore}/10
                          </Badge>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: intelligentResult.analysis.colorPersonality.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: intelligentResult.analysis.colorPersonality.secondary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: intelligentResult.analysis.colorPersonality.accent }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">AI 確信度</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${intelligentResult.analysis.designContext.confidenceScore * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {intelligentResult.analysis.designContext.confidenceScore}/10
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          高い確信度で最適なデザインを選択しました
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Design Reasoning */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      デザイン選択の理由
                    </h4>
                    <p className="text-sm text-gray-700">
                      {intelligentResult.intelligentSelection.designReasoning}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Schema Details */}
            <Card className="max-w-4xl mx-auto shadow-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Code className="h-6 w-6 text-purple-600" />
                  ステップ2: 生成されたスキーマを確認
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-lg">テーブル: {schema.tableName}</h3>
                  <div className="grid gap-3">
                    {schema.columns.map((column, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                        <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm">
                          {column.name}
                        </span>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {column.type}
                        </Badge>
                        {column.primaryKey && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            PRIMARY KEY
                          </Badge>
                        )}
                        {!column.nullable && (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            必須
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={createApp} 
                    disabled={isCreatingApp}
                    className="flex-1 py-4 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isCreatingApp ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        アプリ作成中...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        アプリを作成
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="px-8"
                  >
                    戻る
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Generated App */}
        {step === 3 && appCreated && schema && (
          <div className="space-y-6">
            <Card className="max-w-4xl mx-auto shadow-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl flex items-center justify-center gap-2 text-green-600">
                  <Eye className="h-6 w-6" />
                  ステップ3: あなたのアプリが完成しました！
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={resetCreator} className="px-8">
                    新しいアプリを作成
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="max-w-7xl mx-auto shadow-xl">
              <CardContent className="p-8">
                <Tabs defaultValue="form" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="form" className="text-lg py-3">
                      データ入力
                    </TabsTrigger>
                    <TabsTrigger value="data" className="text-lg py-3">
                      データ一覧
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="form" className="mt-8">
                    <DynamicForm schema={schema} />
                  </TabsContent>
                  
                  <TabsContent value="data" className="mt-8">
                    <DataTable schema={schema} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}