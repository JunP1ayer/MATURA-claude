'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Brain, 
  Palette, 
  Wand2, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Target,
  Loader2,
  Star,
  Lightbulb
} from 'lucide-react';

interface IntelligentGenerationResult {
  intelligentSelection: {
    selectedPattern: any;
    customizedPattern: any;
    designReasoning: string;
    confidenceScore: number;
    alternatives: any[];
  };
  analysis: {
    structuredData: {
      why: string;
      who: string;
      what: string;
      how: string;
      impact: string;
    };
    designContext: {
      category: string;
      complexity: string;
      targetAudience: string;
      primaryGoal: string;
      emotionalTone: string;
      confidenceScore: number;
    };
    colorPersonality: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      reasoning: string;
    };
  };
  generation: any;
  schema: any;
  meta: {
    processingTime: number;
    version: string;
    intelligentMode: boolean;
    hasSchema: boolean;
    hasCustomUI: boolean;
    figmaUsed: boolean;
  };
}

interface IntelligentDesignGeneratorProps {
  onGenerate: (result: IntelligentGenerationResult) => void;
  onSchemaGenerate: (schema: any) => void;
}

export const IntelligentDesignGenerator: React.FC<IntelligentDesignGeneratorProps> = ({
  onGenerate,
  onSchemaGenerate
}) => {
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<IntelligentGenerationResult | null>(null);

  const handleIntelligentGenerate = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setResult(null);

    try {
      // Step 1: Start analysis
      setGenerationStep('ユーザー意図を分析中...');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Template selection
      setGenerationStep('最適なデザインテンプレートを選択中...');
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 3: Make API call
      setGenerationStep('智能的カスタマイズを実行中...');
      setProgress(60);

      const response = await fetch('/api/intelligent-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput,
          generateSchema: true,
          customizationOptions: {
            adaptColors: true,
            adaptLayout: true,
            adaptComplexity: true,
            adaptComponents: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error('智能生成に失敗しました');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '生成処理でエラーが発生しました');
      }

      // Step 4: Finalize
      setGenerationStep('最終調整中...');
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 400));

      setGenerationStep('完了！');
      setProgress(100);
      
      setResult(data.data);
      
      // Trigger callbacks
      onGenerate(data.data);
      if (data.data.schema) {
        onSchemaGenerate(data.data.schema);
      }

    } catch (error) {
      console.error('Intelligent generation error:', error);
      setGenerationStep('エラーが発生しました');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Brain className="h-6 w-6" />
            AI アシストデザイン生成
          </CardTitle>
          <p className="text-sm text-purple-600">
            自然言語でアイデアを伝えるだけで、あなた専用の美しいUIを自動生成します
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              あなたのプロダクトアイデアを詳しく教えてください
            </label>
            <Textarea
              placeholder="例: チームのタスク管理を効率化したい。メンバーは開発者とデザイナーで、プロジェクトごとに進捗を可視化できて、優先度も設定できるアプリが欲しい。結果として生産性を30%向上させたい。"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={4}
              className="text-sm resize-none"
            />
            <p className="text-xs text-gray-500">
              💡 Why（なぜ）/ Who（誰が）/ What（何を）/ How（どうやって）/ Impact（どんな効果）を含めると、より精度の高いUIが生成されます
            </p>
          </div>

          <Button 
            onClick={handleIntelligentGenerate}
            disabled={isGenerating || !userInput.trim()}
            className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {generationStep}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                AIがあなた専用のUIを生成
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-center text-gray-600">{generationStep}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          {/* Design Analysis */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                AI分析結果
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-white rounded-lg">
                  <Target className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-xs font-medium text-gray-600">カテゴリ</p>
                  <p className="text-sm font-semibold">{result.analysis.designContext.category}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-xs font-medium text-gray-600">対象ユーザー</p>
                  <p className="text-sm font-semibold">{result.analysis.designContext.targetAudience}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <p className="text-xs font-medium text-gray-600">複雑さ</p>
                  <p className="text-sm font-semibold">{result.analysis.designContext.complexity}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Star className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
                  <p className="text-xs font-medium text-gray-600">確信度</p>
                  <p className="text-sm font-semibold">{result.analysis.designContext.confidenceScore}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Design */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Palette className="h-5 w-5" />
                選択されたデザイン
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">{result.intelligentSelection.customizedPattern.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{result.intelligentSelection.customizedPattern.category}</Badge>
                    <Badge variant="outline">{result.intelligentSelection.customizedPattern.layout}</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      MVP Score: {result.intelligentSelection.customizedPattern.mvpScore}/10
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200" 
                    style={{ backgroundColor: result.analysis.colorPersonality.primary }}
                    title="Primary"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200" 
                    style={{ backgroundColor: result.analysis.colorPersonality.secondary }}
                    title="Secondary"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200" 
                    style={{ backgroundColor: result.analysis.colorPersonality.accent }}
                    title="Accent"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">デザイン選択理由</p>
                    <p className="text-sm text-gray-600">{result.intelligentSelection.designReasoning}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-2">
                  <Palette className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">配色の考え方</p>
                    <p className="text-sm text-gray-600">{result.analysis.colorPersonality.reasoning}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>生成モード: {result.meta.intelligentMode ? 'AI智能' : '標準'}</span>
                  <span>Figma連携: {result.meta.figmaUsed ? '有効' : '無効'}</span>
                  <span>バージョン: {result.meta.version}</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  完了
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IntelligentDesignGenerator;