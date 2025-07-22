import { NextRequest, NextResponse } from 'next/server';
import { hybridAI } from '@/lib/hybrid-ai-orchestrator';

interface HybridGenerateRequest {
  idea: string;
  mode?: 'creative' | 'professional' | 'experimental' | 'balanced';
  useDesignSystem?: boolean;
  creativityLevel?: 'low' | 'medium' | 'high';
  qualityPriority?: 'speed' | 'quality' | 'creativity';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      idea, 
      mode = 'balanced',
      useDesignSystem = true,
      creativityLevel = 'medium',
      qualityPriority = 'quality'
    } = body as HybridGenerateRequest;

    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: 'アイデアの入力が必要です' },
        { status: 400 }
      );
    }

    console.log('🎭 [HYBRID-API] Multi-AI generation started');
    console.log(`🎯 [HYBRID-API] Configuration: ${mode}, creativity: ${creativityLevel}, figma: ${useDesignSystem}`);

    const startTime = Date.now();

    // ハイブリッドAIシステムによる生成
    const result = await hybridAI.generateApp(idea.trim(), {
      mode,
      useDesignSystem,
      creativityLevel,
      qualityPriority
    });

    const totalTime = Date.now() - startTime;

    console.log('🎉 [HYBRID-API] Multi-AI generation completed');
    console.log(`📊 [HYBRID-API] Total time: ${Math.round(totalTime/1000)}s, Quality: ${result.metadata.qualityScores.overall}`);

    // レスポンスの構築
    const response = {
      // 生成されたコンテンツ
      code: result.code.component,
      schema: {
        tableName: result.schema.tableName,
        description: (result.schema as any).description || 'ハイブリッドAIにより生成されたテーブル',
        columns: [
          { name: 'id', type: 'uuid', primaryKey: true, required: true },
          ...result.schema.fields.map((field: any) => ({
            name: field.name,
            type: field.type,
            primaryKey: false,
            required: field.required || false,
            label: field.label || field.name
          })),
          { name: 'created_at', type: 'timestamp', primaryKey: false, required: true },
          { name: 'updated_at', type: 'timestamp', primaryKey: false, required: true }
        ]
      },

      // AIエンハンスメント情報
      enhancements: {
        originalIdea: result.idea.original,
        enhancedIdea: result.idea.enhanced,
        variations: result.idea.variations,
        category: result.idea.category,
        
        design: {
          colorPalette: result.design.colorPalette,
          designStyle: (result.design as any).designStyle || 'modern',
          typography: result.design.typography,
          components: result.design.components,
          figmaTokens: result.design.figmaTokens ? '✅ Figma統合済み' : '❌ デフォルトデザイン',
          mood: (result.design as any).mood || 'professional'
        },
        
        businessLogic: result.schema.businessLogic || ['基本CRUD操作'],
        relationships: result.schema.relationships || []
      },

      // メタデータ
      metadata: {
        providers: result.metadata.providers,
        processingTime: totalTime,
        generationMode: mode,
        aiContributions: {
          creativity: `Gemini (スコア: ${result.metadata.qualityScores.creativity})`,
          technical: `OpenAI (スコア: ${result.metadata.qualityScores.technical})`,
          design: `${result.design.figmaTokens ? 'Figma + Gemini' : 'Gemini'} (スコア: ${result.metadata.qualityScores.design})`
        },
        qualityScores: result.metadata.qualityScores,
        tokens: result.metadata.tokens,
        features: [
          '🎨 Figma デザインシステム統合',
          '🌟 Gemini 創造的アイデア生成', 
          '⚡ OpenAI 高精度コード生成',
          '🔄 マルチAI最適化',
          '🎯 品質保証システム'
        ]
      },

      // 使用方法とAPI情報
      instructions: {
        howToUse: 'このコードをNext.jsプロジェクトにコピーして使用してください',
        setupSteps: [
          '1. 依存関係のインストール: npm install',
          '2. shadcn/uiコンポーネントのセットアップ',
          '3. データベーステーブルの作成',
          '4. 環境変数の設定'
        ],
        apiEndpoints: {
          create: `/api/crud/${result.schema.tableName} (POST)`,
          read: `/api/crud/${result.schema.tableName} (GET)`,
          update: `/api/crud/${result.schema.tableName} (PUT)`,
          delete: `/api/crud/${result.schema.tableName}?id=xxx (DELETE)`
        },
        designImplementation: {
          colors: result.design.colorPalette ? `カラーパレット: ${result.design.colorPalette.join(', ')}` : 'デフォルトカラー使用',
          fonts: result.design.typography ? `フォント: ${result.design.typography.heading || 'Inter'}` : 'デフォルトフォント使用',
          figmaIntegration: result.design.figmaTokens ? 'Figmaデザイントークンが統合されています' : 'デフォルトデザインシステムを使用'
        }
      },

      // 成功メッセージ
      message: `🎭 ハイブリッドAI（${result.metadata.providers.join(' + ')}）による高品質アプリが生成されました！（${Math.round(totalTime/1000)}秒）`,
      
      // 次のステップ提案
      nextSteps: [
        '🚀 アプリのデプロイ',
        '🎨 デザインのカスタマイズ',
        '🔧 機能の拡張',
        '📱 モバイル対応の強化',
        '🧪 ユーザーテストの実施'
      ]
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 [HYBRID-API] Generation failed:', error);
    
    // エラーの詳細分析
    let errorCategory = 'unknown';
    let fallbackSuggestion = '';
    
    if (error instanceof Error) {
      if (error.message.includes('Figma')) {
        errorCategory = 'figma';
        fallbackSuggestion = 'Figma統合なしで再試行中...';
      } else if (error.message.includes('Gemini')) {
        errorCategory = 'gemini';
        fallbackSuggestion = 'OpenAI単体での生成に切り替え中...';
      } else if (error.message.includes('OpenAI')) {
        errorCategory = 'openai';
        fallbackSuggestion = 'Geminiフォールバックで生成中...';
      }
    }

    return NextResponse.json(
      { 
        error: 'ハイブリッドAI生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorCategory,
        fallbackSuggestion,
        recoveryOptions: [
          'Figmaなしで再試行',
          'シンプルモードで生成',
          'OpenAI単体で生成'
        ]
      },
      { status: 500 }
    );
  }
}

// ヘルスチェックエンドポイント
export async function GET() {
  try {
    // 各AIシステムの状態チェック
    const healthStatus = {
      hybrid: true,
      openai: !!process.env.OPENAI_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      figma: !!process.env.FIGMA_API_KEY,
      timestamp: new Date().toISOString()
    };

    const systemReady = healthStatus.openai && healthStatus.gemini;
    const figmaReady = healthStatus.figma;

    return NextResponse.json({
      status: systemReady ? 'healthy' : 'partial',
      components: healthStatus,
      capabilities: {
        basicGeneration: systemReady,
        creativeGeneration: healthStatus.gemini,
        precisionGeneration: healthStatus.openai,
        designIntegration: figmaReady,
        hybridGeneration: systemReady
      },
      modes: [
        'creative - Gemini重視の創造的生成',
        'professional - OpenAI重視の高精度生成',
        'experimental - 全システム最大活用',
        'balanced - バランス重視の最適化'
      ],
      message: systemReady ? 
        '🎭 ハイブリッドAIシステム稼働中' : 
        '⚠️ 一部システムが利用できません'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}