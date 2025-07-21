/**
 * Universal Generation API - LLMファーストアプリ生成
 * 従来のキーワードベースシステムを完全に置き換え
 */

import { NextRequest, NextResponse } from 'next/server';
import { universalGenerator } from '@/lib/universal-app-generator';
import { supabase } from '@/lib/supabase';

interface UniversalGenerateRequest {
  idea: string;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    const { idea } = body as UniversalGenerateRequest;

    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: 'アイデアの入力が必要です' },
        { status: 400 }
      );
    }

    console.log('🚀 [UNIVERSAL-API] Starting generation for:', idea);

    // Universal App Generator実行
    const generatedApp = await universalGenerator.generateApp(idea.trim());
    
    console.log('✅ [UNIVERSAL-API] Generation completed with confidence:', generatedApp.confidence);

    // データベースに保存
    let savedApp = null;
    try {
      const appData = {
        name: `${idea.slice(0, 50)}${idea.length > 50 ? '...' : ''}`,
        description: `AI生成アプリ - ${generatedApp.intent.category}カテゴリ`,
        user_idea: idea,
        schema: {
          tableName: generatedApp.schema.tableName,
          fields: generatedApp.schema.fields.map(field => ({
            name: field.name,
            type: field.type,
            nullable: !field.required,
            primaryKey: field.name === 'id'
          }))
        },
        generated_code: generatedApp.code,
        app_type: 'universal',
        metadata: {
          intent: generatedApp.intent,
          ui: generatedApp.ui,
          confidence: generatedApp.confidence,
          generationTime: Date.now() - startTime,
          generatedAt: new Date().toISOString()
        }
      };

      const { data, error } = await supabase
        .from('generated_apps')
        .insert([appData])
        .select()
        .single();

      if (error) {
        console.error('❌ [UNIVERSAL-API] Database save failed:', error);
      } else {
        savedApp = data;
        console.log('✅ [UNIVERSAL-API] App saved to database:', data.id);
      }
    } catch (dbError) {
      console.error('❌ [UNIVERSAL-API] Database error:', dbError);
    }

    const totalTime = Date.now() - startTime;

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      app: generatedApp,
      savedApp,
      generation: {
        method: 'universal_llm',
        time: totalTime,
        confidence: generatedApp.confidence,
        phases: [
          { name: 'Intent Analysis', completed: true },
          { name: 'Schema Generation', completed: true },
          { name: 'UI Configuration', completed: true },
          { name: 'Code Generation', completed: true }
        ]
      },
      instructions: {
        howToUse: 'この高品質なコードは即座に使用可能です',
        features: generatedApp.intent.keyFeatures,
        targetUsers: generatedApp.intent.targetUsers,
        category: generatedApp.intent.category,
        apiEndpoints: {
          create: `/api/crud/${generatedApp.schema.tableName} (POST)`,
          read: `/api/crud/${generatedApp.schema.tableName} (GET)`,
          update: `/api/crud/${generatedApp.schema.tableName} (PUT)`,
          delete: `/api/crud/${generatedApp.schema.tableName} (DELETE)`
        }
      },
      message: `🎉 完璧な${generatedApp.intent.category}アプリが生成されました！（信頼度: ${generatedApp.confidence}%、処理時間: ${Math.round(totalTime/1000)}秒）`
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('❌ [UNIVERSAL-API] Generation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'アプリ生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        generation: {
          method: 'universal_llm',
          time: totalTime,
          success: false
        }
      },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    service: 'Universal App Generator',
    version: '2.0.0',
    description: 'LLMファーストのアプリ生成システム',
    capabilities: [
      'Intent Understanding via OpenAI Function Calling',
      'Dynamic Schema Generation',
      'Adaptive UI Configuration', 
      'Production-ready Code Generation',
      'Multi-category Support',
      'High Confidence Scoring'
    ],
    status: 'active'
  });
}