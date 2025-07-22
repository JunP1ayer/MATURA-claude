import { NextRequest, NextResponse } from 'next/server';
import { hybridAI } from '@/lib/hybrid-ai-orchestrator';

interface SimpleGenerateRequest {
  idea: string;
  mode?: 'creative' | 'professional' | 'experimental' | 'balanced';
}

// Hybrid AI システムを使用した高品質生成
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    const { idea, mode = 'balanced' } = body as SimpleGenerateRequest;

    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: 'アイデアの入力が必要です' },
        { status: 400 }
      );
    }

    console.log('🎭 [HYBRID-API] Starting hybrid AI generation for:', idea);

    // Hybrid AI システム実行
    const generatedApp = await hybridAI.generateApp(idea.trim(), {
      mode,
      useDesignSystem: true,
      creativityLevel: 'medium',
      qualityPriority: 'quality'
    });
    
    console.log('✅ [HYBRID-API] Generation completed with overall score:', generatedApp.metadata.qualityScores.overall);

    const totalTime = Date.now() - startTime;

    // 成功レスポンス（既存フォーマット互換）
    return NextResponse.json({
      success: true,
      tableName: generatedApp.schema.tableName,
      description: (generatedApp.schema as any).description || `${generatedApp.idea.enhanced} - ハイブリッドAIにより生成`,
      fields: generatedApp.schema.fields,
      generatedCode: generatedApp.code.component,
      designStyle: (generatedApp.design as any).designStyle || 'modern',
      mood: (generatedApp.design as any).mood || 'professional',
      metadata: {
        ...generatedApp.metadata,
        generationTime: totalTime,
        enhanced: true,
        hybridAI: true
      },
      message: `🎉 ハイブリッドAIにより ${generatedApp.idea.category} カテゴリの高品質アプリが生成されました！（品質スコア: ${Math.round(generatedApp.metadata.qualityScores.overall * 100)}%）`
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('❌ [HYBRID-API] Generation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'ハイブリッドAI生成中にエラーが発生しました',
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

// GET method for testing
export async function GET() {
  return NextResponse.json({
    service: 'Hybrid AI Simple Generator',
    version: '3.0.0',
    description: 'Figma + Gemini + OpenAI ハイブリッドシステム',
    capabilities: [
      'Creative Idea Enhancement via Gemini',
      'Professional Design System via Figma',
      'High-Quality Code Generation via OpenAI',
      'Multi-AI Quality Optimization',
      'Category-Specific Specialization',
      'Enterprise-Level Output'
    ],
    status: 'active'
  });
}