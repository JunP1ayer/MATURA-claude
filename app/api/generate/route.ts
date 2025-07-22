import { NextRequest, NextResponse } from 'next/server';
import { hybridAI } from '@/lib/hybrid-ai-orchestrator';

interface GenerateRequest {
  idea: string;
  mode?: 'creative' | 'professional' | 'experimental' | 'balanced';
  // Legacy support
  userInput?: string;
  autonomous?: boolean;
  figmaFileId?: string;
  structureData?: any;
  optimizedPrompt?: string;
}

export async function POST(request: NextRequest) {
  console.log('=== API Generate Route (Hybrid AI) Called ===');
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { idea, userInput, mode = 'balanced' } = body as GenerateRequest;
    const inputIdea = idea || userInput; // Legacy support

    if (!inputIdea || !inputIdea.trim()) {
      return NextResponse.json(
        { error: 'アイデアの入力が必要です' },
        { status: 400 }
      );
    }

    console.log('🎭 [GENERATE-API] Starting hybrid AI generation for:', inputIdea);

    // ハイブリッドAIシステム実行
    const generatedApp = await hybridAI.generateApp(inputIdea.trim(), {
      mode,
      useDesignSystem: true,
      creativityLevel: 'medium',
      qualityPriority: 'quality' as const
    });
    
    console.log('✅ [GENERATE-API] Generation completed with category:', generatedApp.idea.category);

    const totalTime = Date.now() - startTime;

    // レスポンス（既存フォーマット互換）
    return NextResponse.json({
      success: true,
      
      // 基本情報
      tableName: generatedApp.schema.tableName,
      description: generatedApp.idea.enhanced,
      category: generatedApp.idea.category,
      
      // スキーマとコード
      fields: generatedApp.schema.fields,
      generatedCode: generatedApp.code.component,
      
      // デザイン情報
      designStyle: generatedApp.design.designStyle || 'modern',
      mood: generatedApp.design.mood || 'professional',
      colorPalette: generatedApp.design.colorPalette || ['#3b82f6', '#64748b', '#f59e0b'],
      
      // 拡張情報
      idea: generatedApp.idea,
      ui: generatedApp.design,
      businessLogic: generatedApp.schema.businessLogic || [],
      
      // メタデータ
      metadata: {
        ...generatedApp.metadata,
        generationTime: totalTime,
        autonomous,
        figmaIntegrated: !!figmaFileId,
        hybridAI: true,
        version: '3.0.0'
      },
      
      message: `🎉 ハイブリッドAI により ${generatedApp.idea.category} カテゴリの革新的なアプリが生成されました！`
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('❌ [GENERATE-API] Generation failed:', error);
    
    return NextResponse.json(
      {
        error: 'アプリ生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          generationTime: totalTime,
          success: false,
          hybridAI: true
        }
      },
      { status: 500 }
    );
  }
}

// GET method for status
export async function GET() {
  return NextResponse.json({
    service: 'Hybrid AI Generator',
    version: '3.0.0',
    description: 'Figma + Gemini + OpenAI統合によるハイブリッドアプリ生成システム',
    features: [
      'Multi-AI協調による創造的生成',
      'カテゴリ別専門化パターン',
      '企業レベル品質コード',
      'Figmaデザインシステム統合',
      'Gemini創造性エンハンスメント',
      'OpenAI構造化生成'
    ],
    status: 'active',
    providers: ['gemini', 'openai', 'figma']
  });
}