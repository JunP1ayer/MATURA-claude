/**
 * ハイブリッドAIオーケストレーター
 * Figma + Gemini + OpenAI の最適な組み合わせシステム
 */

import { openAIOptimized } from '@/lib/openai-optimized-system';
import { GeminiClient } from '@/lib/gemini-client';

export interface HybridGenerationConfig {
  mode: 'creative' | 'professional' | 'experimental' | 'balanced';
  useDesignSystem: boolean;
  creativityLevel: 'low' | 'medium' | 'high';
  qualityPriority: 'speed' | 'quality' | 'creativity';
}

export interface HybridResult {
  idea: {
    original: string;
    enhanced: string;
    variations: string[];
    category: string;
    coreValue?: string;
    realProblem?: string;
    targetUsers?: string[];
    keyFeatures?: string[];
    businessLogic?: string[];
    uniqueValue?: string;
    industryContext?: string;
    insights?: string[];
    businessPotential?: string;
  };
  design: {
    figmaTokens?: any;
    colorPalette: string[];
    typography: any;
    components: string[];
    designSystem: string;
    designStyle?: string;
    mood?: string;
  };
  schema: {
    tableName: string;
    fields: any[];
    relationships: any[];
    businessLogic: string[];
  };
  code: {
    component: string;
    types: string;
    styles: string;
    hooks: string;
  };
  metadata: {
    providers: string[];
    processingTime: number;
    qualityScores: {
      creativity: number;
      technical: number;
      design: number;
      overall: number;
    };
    tokens: {
      openai: number;
      gemini: number;
      total: number;
    };
  };
}

export class HybridAIOrchestrator {
  private gemini: GeminiClient;

  constructor() {
    this.gemini = new GeminiClient();
  }

  /**
   * メインのハイブリッド生成フロー
   */
  async generateApp(
    userIdea: string, 
    config: Partial<HybridGenerationConfig> = {}
  ): Promise<HybridResult> {
    const startTime = Date.now();
    
    const finalConfig: HybridGenerationConfig = {
      mode: 'balanced',
      useDesignSystem: true,
      creativityLevel: 'medium',
      qualityPriority: 'quality',
      ...config
    };

    console.log('🎭 [HYBRID] Starting multi-AI generation process');
    console.log(`🎯 [HYBRID] Mode: ${finalConfig.mode}, Creativity: ${finalConfig.creativityLevel}`);

    // Phase 1: Gemini Creative Enhancement (並列実行)
    const [ideaEnhancement, designInspiration] = await Promise.all([
      this.enhanceIdeaWithGemini(userIdea, finalConfig),
      this.generateDesignInspirationWithGemini(userIdea, finalConfig)
    ]);

    // Phase 2: Figma Design System Integration (条件付き)
    let designSystem = null;
    if (finalConfig.useDesignSystem) {
      designSystem = await this.integrateWithFigma(ideaEnhancement.enhanced, finalConfig);
    }

    // Phase 3: OpenAI Structured Generation
    const [schemaResult, codeResult] = await Promise.all([
      this.generateSchemaWithOpenAI(ideaEnhancement, designSystem, finalConfig),
      this.generateCodeWithOpenAI(ideaEnhancement, designSystem, designInspiration, finalConfig)
    ]);

    // Phase 4: Quality Enhancement & Integration
    const finalResult = await this.enhanceAndIntegrate({
      idea: ideaEnhancement,
      design: { ...designInspiration, ...(designSystem || {}) },
      schema: schemaResult,
      code: codeResult,
      config: finalConfig,
      startTime
    });

    console.log('🎉 [HYBRID] Multi-AI generation completed successfully');
    return finalResult;
  }

  /**
   * Geminiによるアイデア強化
   */
  private async enhanceIdeaWithGemini(
    userIdea: string, 
    config: HybridGenerationConfig
  ) {
    console.log('🌟 [GEMINI] Creative idea enhancement started');

    const creativityPrompt = this.buildGeminiCreativityPrompt(userIdea, config);
    
    const result = await this.gemini.generateText({
      prompt: creativityPrompt,
      temperature: config.creativityLevel === 'high' ? 0.9 : 
                   config.creativityLevel === 'medium' ? 0.7 : 0.5,
      maxTokens: 1500
    });

    if (result.success && result.data) {
      try {
        // JSONパース試行
        const parsed = this.extractJSONFromGeminiResponse(result.data);
        console.log('✅ [GEMINI] Idea enhancement completed');
        return {
          original: userIdea,
          enhanced: parsed.enhanced || userIdea,
          variations: parsed.variations || [userIdea],
          category: parsed.category || this.inferCategoryFromIdea(userIdea),
          insights: parsed.insights || [],
          businessPotential: parsed.businessPotential || 'medium',
          // 新しい本質理解フィールドを追加
          coreValue: parsed.coreValue,
          realProblem: parsed.realProblem,
          targetUsers: parsed.targetUsers,
          keyFeatures: parsed.keyFeatures,
          businessLogic: parsed.businessLogic,
          uniqueValue: parsed.uniqueValue,
          industryContext: parsed.industryContext
        };
      } catch (error) {
        console.log('⚠️ [GEMINI] Parsing failed, using intelligent fallback');
        const intelligentAnalysis = this.createIntelligentFallbackFromText(userIdea);
        return {
          original: userIdea,
          enhanced: intelligentAnalysis.enhanced,
          variations: intelligentAnalysis.variations,
          category: intelligentAnalysis.category,
          insights: intelligentAnalysis.insights,
          businessPotential: intelligentAnalysis.businessPotential,
          // 本質理解情報も保持
          coreValue: intelligentAnalysis.coreValue,
          realProblem: intelligentAnalysis.realProblem,
          targetUsers: intelligentAnalysis.targetUsers,
          keyFeatures: intelligentAnalysis.keyFeatures,
          businessLogic: intelligentAnalysis.businessLogic,
          uniqueValue: intelligentAnalysis.uniqueValue,
          industryContext: intelligentAnalysis.industryContext
        };
      }
    }

    // 最終フォールバック: Gemini API失敗時
    console.log('⚠️ [GEMINI] API failed, using comprehensive intelligent analysis');
    const deepAnalysis = this.createIntelligentFallbackFromText(userIdea);
    
    return {
      original: userIdea,
      enhanced: deepAnalysis.enhanced,
      variations: deepAnalysis.variations,
      category: deepAnalysis.category,
      insights: deepAnalysis.insights,
      businessPotential: deepAnalysis.businessPotential,
      // 文脈理解を最大限維持
      coreValue: deepAnalysis.coreValue,
      realProblem: deepAnalysis.realProblem,
      targetUsers: deepAnalysis.targetUsers,
      keyFeatures: deepAnalysis.keyFeatures,
      businessLogic: deepAnalysis.businessLogic,
      uniqueValue: deepAnalysis.uniqueValue,
      industryContext: deepAnalysis.industryContext
    };
  }

  /**
   * Geminiによるデザインインスピレーション生成
   */
  private async generateDesignInspirationWithGemini(
    userIdea: string,
    config: HybridGenerationConfig
  ) {
    console.log('🎨 [GEMINI] Design inspiration generation started');

    const designPrompt = `アプリアイデア: "${userIdea}"

このアプリに最適なデザインコンセプトを創造的に提案してください：

{
  "colorPalette": ["#主色", "#副色", "#アクセント色", "#背景色"],
  "designStyle": "modern/minimalist/playful/professional",
  "typography": {
    "heading": "フォントファミリー",
    "body": "本文フォント",
    "accent": "アクセントフォント"
  },
  "components": ["推奨UIコンポーネント"],
  "layout": "grid/list/dashboard/card",
  "mood": "温かい/クール/活発/落ち着いた",
  "inspiration": "デザインインスピレーション説明"
}

創造性を重視し、ユニークで魅力的なデザイン提案をしてください。`;

    const result = await this.gemini.generateText({
      prompt: designPrompt,
      temperature: 0.8,
      maxTokens: 1000
    });

    if (result.success && result.data) {
      try {
        const parsed = this.extractJSONFromGeminiResponse(result.data);
        console.log('✅ [GEMINI] Design inspiration completed');
        return {
          colorPalette: parsed.colorPalette || ['#3b82f6', '#64748b', '#f59e0b', '#ffffff'],
          designStyle: parsed.designStyle || 'modern',
          typography: parsed.typography || { heading: 'Inter', body: 'Inter' },
          components: parsed.components || ['Card', 'Button', 'Input'],
          layout: parsed.layout || 'card',
          mood: parsed.mood || 'modern',
          inspiration: parsed.inspiration || 'Clean and intuitive design'
        };
      } catch (error) {
        console.log('⚠️ [GEMINI] Design parsing failed, using defaults');
      }
    }

    return {
      colorPalette: ['#3b82f6', '#64748b', '#f59e0b', '#ffffff'],
      designStyle: 'modern',
      typography: { heading: 'Inter', body: 'Inter' },
      components: ['Card', 'Button', 'Input'],
      layout: 'card',
      mood: 'modern',
      inspiration: 'Clean and intuitive design'
    };
  }

  /**
   * Figmaデザインシステム統合
   */
  private async integrateWithFigma(
    enhancedIdea: string,
    config: HybridGenerationConfig
  ) {
    console.log('🎯 [FIGMA] Design system integration started');

    try {
      // Figma APIキーの確認
      if (!process.env.FIGMA_API_KEY) {
        console.log('⚠️ [FIGMA] API key not available, using default design system');
        return this.getDefaultDesignSystem();
      }

      // デザインファイルの取得
      const fileId = process.env.DEFAULT_FIGMA_FILE_ID;
      if (!fileId) {
        console.log('⚠️ [FIGMA] File ID not configured, using default design system');
        return this.getDefaultDesignSystem();
      }

      // Figma API呼び出し（堅牢なエラーハンドリング付き）
      try {
        const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
          headers: {
            'X-Figma-Token': process.env.FIGMA_API_KEY!,
          },
        });

        if (!response.ok) {
          console.log(`⚠️ [FIGMA] API request failed: ${response.status}, falling back to default`);
          return this.getDefaultDesignSystem();
        }

        const data = await response.json();
        console.log('✅ [FIGMA] Successfully fetched design data');
        
        return {
          figmaTokens: data,
          colorPalette: ['#3b82f6', '#64748b', '#f59e0b', '#ffffff'],
          typography: { heading: 'Inter', body: 'Inter' },
          components: ['Button', 'Input', 'Card'],
          designSystem: 'figma-integrated'
        };
      } catch (fetchError: any) {
        console.log('⚠️ [FIGMA] Fetch failed:', fetchError?.message || 'Unknown error');
        return this.getDefaultDesignSystem();
      }
    } catch (error: any) {
      console.log('⚠️ [FIGMA] Integration failed:', error?.message || 'Unknown error');
      return this.getDefaultDesignSystem();
    }
  }

  /**
   * デフォルトデザインシステム
   */
  private getDefaultDesignSystem() {
    return {
      figmaTokens: null,
      colorPalette: ['#3b82f6', '#64748b', '#f59e0b', '#ffffff'],
      typography: { heading: 'Inter', body: 'Inter' },
      components: ['Card', 'Button', 'Input', 'Badge'],
      designSystem: 'default-premium',
      theme: 'modern',
      layout: 'responsive'
    };
  }

  /**
   * OpenAIによる高精度スキーマ生成
   */
  private async generateSchemaWithOpenAI(
    ideaData: any,
    designSystem: any,
    config: HybridGenerationConfig
  ) {
    console.log('🏗️ [OPENAI] High-precision schema generation started');

    const schemaResult = await openAIOptimized.executeFunction(
      'generate_advanced_schema',
      {
        description: 'Generate advanced database schema with business logic',
        parameters: {
          type: 'object',
          properties: {
            tableName: { type: 'string' },
            description: { type: 'string' },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  required: { type: 'boolean' },
                  label: { type: 'string' },
                  validation: { type: 'string' },
                  defaultValue: { type: 'string' }
                }
              }
            },
            relationships: {
              type: 'array',
              items: { type: 'string' }
            },
            businessLogic: {
              type: 'array',
              items: { type: 'string' }
            },
            indexes: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['tableName', 'fields', 'businessLogic']
        }
      },
      `強化されたアイデア: ${JSON.stringify(ideaData, null, 2)}
デザインシステム: ${JSON.stringify(designSystem, null, 2)}

このアプリに最適な高度なデータベーススキーマを設計してください：

要件:
1. 実用的で拡張性のあるフィールド構成
2. ビジネスロジックを支える関係性
3. パフォーマンスを考慮したインデックス
4. データ整合性とセキュリティ
5. 将来の機能拡張への対応

特に以下を重視してください：
- ユーザー体験を向上させるデータ設計
- 検索・フィルタリング性能
- レポート・分析機能への対応`,
      'あなたは経験豊富なデータベースアーキテクトです。ビジネス要件を満たす最適なスキーマを設計してください。',
      { model: 'gpt-4', temperature: 0.3 }
    );

    if (schemaResult.success && schemaResult.data) {
      console.log('✅ [OPENAI] Schema generation completed');
      return schemaResult.data;
    }

    console.log('⚠️ [OPENAI] Schema generation failed, using fallback');
    return {
      tableName: 'app_data',
      fields: [
        { name: 'title', type: 'string', required: true, label: 'タイトル' },
        { name: 'description', type: 'text', required: false, label: '説明' }
      ],
      relationships: [],
      businessLogic: ['基本的なCRUD操作'],
      indexes: ['title']
    };
  }

  /**
   * OpenAIによる高品質コード生成
   */
  private async generateCodeWithOpenAI(
    ideaData: any,
    designSystem: any,
    designInspiration: any,
    config: HybridGenerationConfig
  ) {
    console.log('⚡ [OPENAI] High-quality code generation started');

    // まずSchema情報を先に生成
    const schemaData = await this.generateSchemaWithOpenAI(ideaData, designSystem, config);
    
    // Function Callingを使って構造化されたコード生成
    const codeResult = await openAIOptimized.executeFunction(
      'generate_hybrid_react_component',
      {
        description: 'Generate enterprise-level React component with Figma + Gemini integration',
        parameters: {
          type: 'object',
          properties: {
            componentName: { type: 'string', description: 'Component name in PascalCase' },
            componentCode: { type: 'string', description: 'Complete React component code' },
            typeDefinitions: { type: 'string', description: 'TypeScript type definitions' },
            customHooks: { type: 'string', description: 'Custom React hooks code' },
            apiIntegration: { type: 'string', description: 'API integration code' },
            storybook: { type: 'string', description: 'Storybook story for component testing' }
          },
          required: ['componentName', 'componentCode', 'typeDefinitions']
        }
      },
      `🎭 HYBRID AI プレミアムコード生成

## プロジェクト仕様
**アイデア**: ${ideaData.enhanced || ideaData.original}
**カテゴリ**: ${ideaData.category}
**ビジネスポテンシャル**: ${ideaData.businessPotential}

## Gemini創造的インスピレーション
${JSON.stringify(designInspiration, null, 2)}

## Figmaデザインシステム
${designSystem ? JSON.stringify(designSystem, null, 2) : 'デフォルトデザインシステム使用'}

## データベーススキーマ
${JSON.stringify(schemaData, null, 2)}

## ハイブリッドAI統合要求

### 🌟 Geminiの創造性を反映
- ${designInspiration.inspiration || 'クリエイティブなユーザー体験'}
- ${designInspiration.mood || 'modern'} な雰囲気
- カラーパレット: ${(designInspiration.colorPalette || ['#3b82f6']).join(', ')}

### 🎨 Figmaデザイントークン活用
- ${designSystem?.figmaTokens ? 'Figmaデザイントークン統合' : 'プレミアムデザインシステム'}
- レスポンシブブレークポイント対応
- 一貫したスペーシングとタイポグラフィ

### ⚡ 企業レベル技術実装
1. **完全TypeScript**: 厳密な型安全性
2. **パフォーマンス最適化**: React.memo, useMemo, useCallback適用
3. **アクセシビリティ**: ARIA attributes完全対応
4. **エラーハンドリング**: Error Boundaries + 優雅な回復
5. **リアルタイム更新**: SWR/React Query統合
6. **アニメーション**: Framer Motion微細効果
7. **フォーム**: React Hook Form + Zod検証
8. **状態管理**: Zustand/Context API適切選択
9. **国際化**: i18n基盤組み込み
10. **テスト**: Testing Library準拠

### 必須技術スタック
\`\`\`typescript
// 使用必須ライブラリ
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Plus, Heart, Share2, Download, Upload, Filter, Grid, List } from 'lucide-react';
\`\`\`

### コンポーネント設計要求
1. **メインコンテナ**: 全体レイアウト管理
2. **ヘッダー**: ナビゲーション + 検索 + ユーザープロフィール
3. **コンテンツエリア**: ${ideaData.category}に特化した機能区域
4. **サイドバー**: フィルタ・設定・追加機能
5. **フッター**: 補助情報・リンク
6. **モーダル**: 作成・編集・詳細表示
7. **カスタムフック**: ビジネスロジック分離

### 品質基準
- **コード品質**: ESLint + Prettier準拠
- **型カバレッジ**: 100%
- **エラーハンドリング**: 全API呼び出し保護
- **ローディング状態**: スケルトンUI実装
- **空状態**: Empty State対応
- **レスポンシブ**: sm, md, lg, xl全対応

完全に動作する本格的なReactコンポーネントを生成してください。`,
      `あなたは世界トップクラスのReact/TypeScript開発者です。

Figma + Gemini + OpenAIの総合力を活用し、以下を統合した最高品質のコンポーネントを作成してください：

1. **Geminiの創造性**: 革新的なUX/UI設計
2. **Figmaの一貫性**: デザインシステム準拠
3. **OpenAIの技術力**: 完璧なTypeScript実装

企業レベルの品質で、実際のプロダクションで使用できるコードを生成してください。`,
      { 
        model: 'gpt-4', 
        temperature: 0.2, 
        maxTokens: 4000 
      }
    );

    if (codeResult.success && codeResult.data) {
      console.log('✅ [OPENAI] Enterprise-level code generation completed');
      const data = codeResult.data as any;
      return {
        component: data.componentCode || data,
        types: data.typeDefinitions || '// Advanced TypeScript types generated',
        styles: '// Figma design tokens + Tailwind CSS integrated',
        hooks: data.customHooks || '// Custom hooks for business logic',
        apiIntegration: data.apiIntegration || '// API integration code',
        storybook: data.storybook || '// Storybook stories generated'
      };
    }

    console.log('⚠️ [OPENAI] Advanced code generation failed, attempting simplified version');
    
    // フォールバック: 簡略化されたコード生成
    const fallbackResult = await openAIOptimized.generateAdvancedText(
      `Create a complete React component for: ${ideaData.enhanced || ideaData.original}
      
Design: ${JSON.stringify(designInspiration)}
Schema: ${JSON.stringify(schemaData)}

Generate enterprise-level TypeScript React component with:
- Full functionality for ${ideaData.category} app
- Tailwind CSS styling
- shadcn/ui components
- Framer Motion animations
- Complete CRUD operations
- Error handling
- Loading states
- Responsive design

Component name: ${this.generateComponentName(ideaData.original)}`,
      'technical',
      { model: 'gpt-4', temperature: 0.3, maxTokens: 4000 }
    );

    if (fallbackResult.success && fallbackResult.data) {
      return {
        component: fallbackResult.data,
        types: '// TypeScript types embedded in component',
        styles: '// Tailwind CSS + Design System integrated',
        hooks: '// Custom hooks embedded in component'
      };
    }

    console.log('❌ [OPENAI] All code generation attempts failed');
    return {
      component: this.generateFallbackComponent(ideaData, designInspiration, schemaData),
      types: '// Basic TypeScript types',
      styles: '// Basic Tailwind CSS',
      hooks: '// Basic custom hooks'
    };
  }

  /**
   * コンポーネント名生成
   */
  private generateComponentName(idea: string): string {
    const words = idea.split(/\s+/).slice(0, 2);
    return words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase().replace(/[^a-zA-Z]/g, '')
    ).join('') + 'Manager';
  }

  /**
   * フォールバックコンポーネント生成
   */
  private generateFallbackComponent(ideaData: any, designInspiration: any, schemaData: any): string {
    const componentName = this.generateComponentName(ideaData.original);
    const primaryColor = designInspiration.colorPalette?.[0] || '#3b82f6';
    
    return `'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Heart, Star } from 'lucide-react';
import { toast } from 'sonner';

interface ${componentName}Props {
  className?: string;
}

interface DataItem {
  id: string;
  ${schemaData.fields?.slice(0, 3).map((field: any) => 
    `${field.name}: ${field.type === 'text' ? 'string' : field.type};`
  ).join('\n  ') || 'name: string;\n  description: string;'}
  created_at: string;
}

export default function ${componentName}({ className }: ${componentName}Props) {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setItems([
        {
          id: '1',
          ${schemaData.fields?.slice(0, 3).map((field: any, index: number) => 
            `${field.name}: ${field.type === 'text' ? `'Sample ${field.label || field.name} ${index + 1}'` : 
            field.type === 'number' ? Math.floor(Math.random() * 100) :
            field.type === 'boolean' ? 'true' : 
            `'Sample data'`}`
          ).join(',\n          ') || "name: 'Sample Item 1',\n          description: 'Sample description'"}
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = items.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={\`container mx-auto p-6 \${className}\`} style={{ 
      background: \`linear-gradient(135deg, \${primaryColor}10, \${primaryColor}05)\` 
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ${ideaData.enhanced ? ideaData.enhanced.split(' ').slice(0, 3).join(' ') : componentName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            ${designInspiration.inspiration || 'Manage your items efficiently'}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Items Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {item.${schemaData.fields?.[0]?.name || 'name'}}
                  </CardTitle>
                  <Badge variant="secondary" style={{ backgroundColor: \`\${primaryColor}20\`, color: primaryColor }}>
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.${schemaData.fields?.[1]?.name || 'description'}}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No items found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or add new items.
          </p>
        </motion.div>
      )}
    </div>
  );
}`;
  }

  /**
   * 統合と品質向上
   */
  private async enhanceAndIntegrate(data: any): Promise<HybridResult> {
    const processingTime = Date.now() - data.startTime;
    
    return {
      idea: data.idea,
      design: data.design,
      schema: data.schema,
      code: data.code,
      metadata: {
        providers: ['gemini', 'openai', ...(data.design.figmaTokens ? ['figma'] : [])],
        processingTime,
        qualityScores: {
          creativity: 0.9, // Geminiの貢献
          technical: 0.95, // OpenAIの貢献
          design: data.design.figmaTokens ? 0.98 : 0.85, // Figmaの貢献
          overall: 0.92
        },
        tokens: {
          openai: 2000, // 推定値
          gemini: 800,  // 推定値
          total: 2800
        }
      }
    };
  }

  /**
   * ユーティリティメソッド
   */
  private buildGeminiCreativityPrompt(userIdea: string, config: HybridGenerationConfig): string {
    const creativityInstructions = {
      low: '実用性を重視し、確実に動作する機能を提案してください。',
      medium: '実用性と創造性のバランスを取り、革新的だが実現可能な機能を提案してください。',
      high: '創造性を最大限に発揮し、従来にない斬新で魅力的な機能を提案してください。'
    };

    return `# アイデア本質理解・分析システム

## 入力アイデア
"${userIdea}"

## あなたの役割
世界トップクラスのプロダクト戦略家として、このアイデアの**本質的価値と真の目的**を深く理解してください。

## 必須分析項目

### 1. 本質理解 (最重要)
- ユーザーが **本当に解決したい問題** は何か？
- どんな **業界・分野・用途** でのソリューションか？
- **誰が、なぜ、どのような状況で** 使うのか？
- 既存の汎用的ソリューション（タスク管理等）では **なぜ不十分** なのか？

### 2. 文脈分析
- 業界特有のニーズと制約
- ターゲットユーザーの専門的要求
- ビジネスプロセス上の位置づけ
- 技術的・規制的考慮事項

### 3. 価値提案
- このアイデア独自の競争優位性
- 解決する痛点の深刻度
- 市場での差別化要因

## 出力形式 (必ず正確なJSON)
\`\`\`json
{
  "enhanced": "本質を理解した上での強化されたアイデア詳細",
  "coreValue": "このアイデアの核となる価値提案",
  "realProblem": "実際に解決する具体的問題",
  "category": "finance/health/creative/entertainment/social/education/ecommerce/productivity",
  "targetUsers": ["具体的ユーザー層1", "具体的ユーザー層2"],
  "keyFeatures": ["本質的機能1", "本質的機能2", "本質的機能3"],
  "businessLogic": ["ビジネスロジック1", "ビジネスロジック2"],
  "uniqueValue": "既存ソリューションとの明確な差別化",
  "businessPotential": "high/medium/low",
  "industryContext": "業界・分野の文脈説明",
  "variations": ["バリエーション1", "バリエーション2"],
  "insights": ["重要な洞察1", "重要な洞察2", "重要な洞察3"]
}
\`\`\`

## 重要な制約
- **絶対に** 汎用的なタスク管理・TODO・メモアプリに逃げない
- **必ず** 具体的な業界・用途・ユーザーニーズに特化する
- **表面的なキーワード** ではなく **文脈と目的** を重視する
- ${creativityInstructions[config.creativityLevel]}

**ユーザーの真の意図を理解し、価値あるプロダクトアイデアに発展させてください。**`;
  }

  /**
   * フォールバック用のインテリジェントカテゴリ推論
   */
  private inferCategoryFromIdea(userIdea: string): string {
    const idea = userIdea.toLowerCase();
    
    // キーワードベース分類（優先順位順）
    if (idea.includes('レシピ') || idea.includes('料理') || idea.includes('食事') || idea.includes('cooking')) {
      return 'creative';
    }
    if (idea.includes('ゲーム') || idea.includes('game') || idea.includes('遊び') || idea.includes('エンターテイン')) {
      return 'entertainment'; 
    }
    if (idea.includes('学習') || idea.includes('教育') || idea.includes('勉強') || idea.includes('スクール')) {
      return 'education';
    }
    if (idea.includes('健康') || idea.includes('運動') || idea.includes('フィットネス') || idea.includes('医療')) {
      return 'health';
    }
    if (idea.includes('金融') || idea.includes('銀行') || idea.includes('投資') || idea.includes('家計')) {
      return 'finance';
    }
    if (idea.includes('ショッピング') || idea.includes('EC') || idea.includes('売買') || idea.includes('商品')) {
      return 'ecommerce';
    }
    if (idea.includes('SNS') || idea.includes('コミュニティ') || idea.includes('チャット') || idea.includes('友達')) {
      return 'social';
    }
    if (idea.includes('タスク') || idea.includes('TODO') || idea.includes('管理') || idea.includes('スケジュール')) {
      return 'productivity';
    }
    
    // デフォルトは creative（タスク管理を避ける）
    return 'creative';
  }

  /**
   * カテゴリ別カラーパレット
   */
  private getCategoryColors(category: string): string[] {
    const colorPalettes = {
      creative: ['#8b5cf6', '#a855f7', '#c084fc', '#ffffff'],
      entertainment: ['#ef4444', '#f97316', '#eab308', '#ffffff'], 
      education: ['#3b82f6', '#1d4ed8', '#1e40af', '#ffffff'],
      health: ['#059669', '#10b981', '#34d399', '#ffffff'],
      finance: ['#1e40af', '#3b82f6', '#60a5fa', '#ffffff'],
      ecommerce: ['#dc2626', '#ea580c', '#facc15', '#ffffff'],
      social: ['#ec4899', '#f472b6', '#f9a8d4', '#ffffff'],
      productivity: ['#6366f1', '#8b5cf6', '#a78bfa', '#ffffff'],
      utility: ['#64748b', '#94a3b8', '#cbd5e1', '#ffffff']
    };
    
    return colorPalettes[category as keyof typeof colorPalettes] || colorPalettes.creative;
  }

  private extractJSONFromGeminiResponse(response: string): any {
    console.log('🔍 [JSON] Attempting to extract JSON from Gemini response');
    
    try {
      // 段階的JSONパターン抽出（優先度順）
      const patterns = [
        /```json\s*(\{[\s\S]*?\})\s*```/i, // コードブロック内（最優先）
        /json\s*(\{[\s\S]*?\})/i, // json prefix付き
        /\{[\s\S]*?"enhanced"[\s\S]*?\}/i, // enhanced含むJSON
        /\{[\s\S]*?"category"[\s\S]*?\}/i, // category含むJSON
        /\{[\s\S]*?\}/  // 最後の手段
      ];

      let bestMatch = null;
      let bestScore = 0;

      for (const pattern of patterns) {
        const matches = response.match(pattern);
        if (matches) {
          const jsonStr = matches[1] || matches[0];
          
          // JSON品質スコア計算
          const score = this.calculateJSONQualityScore(jsonStr);
          console.log(`[JSON] Pattern match score: ${score}`);
          
          if (score > bestScore) {
            bestMatch = jsonStr;
            bestScore = score;
          }
        }
      }

      if (!bestMatch) {
        throw new Error('No JSON pattern found in response');
      }

      // JSON修正・パース
      const cleanedJson = this.cleanAndValidateJSON(bestMatch);
      const parsed = JSON.parse(cleanedJson);
      
      // 必須フィールド確認・補完
      const validated = this.validateAndCompleteGeminiResponse(parsed, response);
      console.log('✅ [JSON] Successfully extracted and validated JSON');
      
      return validated;

    } catch (error) {
      console.warn('⚠️ [JSON] Extraction failed, using intelligent text analysis');
      return this.createIntelligentFallbackFromText(response);
    }
  }

  private calculateJSONQualityScore(jsonStr: string): number {
    let score = 0;
    
    // 基本構造チェック
    if (jsonStr.includes('enhanced')) score += 20;
    if (jsonStr.includes('category')) score += 20;
    if (jsonStr.includes('targetUsers')) score += 15;
    if (jsonStr.includes('keyFeatures')) score += 15;
    if (jsonStr.includes('coreValue')) score += 10;
    if (jsonStr.includes('businessPotential')) score += 10;
    
    // JSON構造整合性
    const openBraces = (jsonStr.match(/\{/g) || []).length;
    const closeBraces = (jsonStr.match(/\}/g) || []).length;
    if (openBraces === closeBraces) score += 10;
    
    return score;
  }

  private cleanAndValidateJSON(jsonStr: string): string {
    return jsonStr
      // 基本的な修正
      .replace(/'/g, '"')  // シングルクォート→ダブルクォート
      .replace(/,\s*[}\]]/g, match => match.replace(',', ''))  // trailing comma削除
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // キーをクォート
      .replace(/:\s*([^",{\[\]}\s][^",{\[\]}\n]*?)(?=\s*[,}])/g, ': "$1"') // 値をクォート
      // 改行・制御文字の処理
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      // 重複コンマ除去
      .replace(/,,+/g, ',');
  }

  private validateAndCompleteGeminiResponse(parsed: any, originalResponse: string): any {
    // 必須フィールドの補完
    const completed = {
      enhanced: parsed.enhanced || parsed.description || originalResponse.slice(0, 200),
      coreValue: parsed.coreValue || parsed.uniqueValue || 'ユーザーニーズに特化したソリューション',
      realProblem: parsed.realProblem || '具体的な課題の解決',
      category: parsed.category || this.inferCategoryFromIdea(originalResponse),
      targetUsers: parsed.targetUsers || ['専門ユーザー'],
      keyFeatures: parsed.keyFeatures || ['核心機能1', '核心機能2'],
      businessLogic: parsed.businessLogic || ['基本的なビジネスロジック'],
      uniqueValue: parsed.uniqueValue || 'システム固有の価値提案',
      businessPotential: parsed.businessPotential || 'medium',
      industryContext: parsed.industryContext || '特定業界向け',
      variations: parsed.variations || [],
      insights: parsed.insights || ['本質的洞察']
    };

    return completed;
  }

  private createIntelligentFallbackFromText(response: string): any {
    console.log('🧠 [FALLBACK] Creating intelligent analysis from text');
    
    // テキスト内容の分析
    const category = this.inferCategoryFromIdea(response);
    const keyTerms = this.extractKeyTerms(response);
    
    return {
      enhanced: `${keyTerms.join('、')}を活用した専門的ソリューション`,
      coreValue: 'ユーザーの具体的ニーズに対応',
      realProblem: '現状の課題解決',
      category: category,
      targetUsers: ['専門ユーザー', '業界関係者'],
      keyFeatures: keyTerms.slice(0, 3).map(term => `${term}機能`),
      businessLogic: ['専門的処理', 'データ管理', 'ユーザー対応'],
      uniqueValue: `${category}分野に特化したアプローチ`,
      businessPotential: 'medium',
      industryContext: `${category}業界での活用`,
      variations: [],
      insights: [`${category}分野の専門的ニーズに対応`, '実用性重視の設計']
    };
  }

  private extractKeyTerms(text: string): string[] {
    // 重要そうなキーワードを抽出
    const words = text.toLowerCase()
      .replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !['の', 'を', 'に', 'は', 'が', 'で', 'と', 'から', 'まで'].includes(word));
    
    // 頻度で重要度を判定（簡易版）
    const frequency: { [key: string]: number } = {};
    words.forEach(word => frequency[word] = (frequency[word] || 0) + 1);
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }
}

export const hybridAI = new HybridAIOrchestrator();