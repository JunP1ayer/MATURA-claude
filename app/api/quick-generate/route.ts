import { NextRequest, NextResponse } from 'next/server';
import { openAIOptimized } from '@/lib/openai-optimized-system';

interface QuickGenerateRequest {
  idea: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea } = body as QuickGenerateRequest;

    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: 'アイデアの入力が必要です' },
        { status: 400 }
      );
    }

    console.log('🚀 [QUICK-OPENAI] Fast OpenAI generation started');

    const startTime = Date.now();

    // 単一のOpenAI呼び出しで高速生成
    const result = await openAIOptimized.executeFunction(
      'generate_complete_app',
      {
        description: 'Generate a complete Next.js React app with schema and code',
        parameters: {
          type: 'object',
          properties: {
            appAnalysis: {
              type: 'object',
              properties: {
                category: { type: 'string' },
                purpose: { type: 'string' },
                targetUsers: { type: 'array', items: { type: 'string' } }
              }
            },
            schema: {
              type: 'object',
              properties: {
                tableName: { type: 'string' },
                fields: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      type: { type: 'string' },
                      required: { type: 'boolean' },
                      label: { type: 'string' }
                    }
                  }
                }
              }
            },
            reactCode: {
              type: 'string',
              description: 'Complete React component code'
            }
          },
          required: ['appAnalysis', 'schema', 'reactCode']
        }
      },
      `アプリのアイデア: "${idea}"

このアイデアから完全なWebアプリケーションを生成してください：

1. アプリ分析（カテゴリ、目的、ターゲットユーザー）
2. データベーススキーマ（実用的なフィールド構成）
3. Next.js + React + TypeScript コンポーネント

要件:
- 'use client'で開始
- shadcn/ui使用 (Card, Button, Input)
- 完全なCRUD機能
- エラーハンドリング
- レスポンシブデザイン
- TypeScript型安全性

コンポーネントはすぐに動作するプロダクションレベルの品質で生成してください。`,
      'あなたは経験豊富なフルスタック開発者です。実用的で美しく、すぐに使えるWebアプリケーションを生成してください。',
      { model: 'gpt-4', temperature: 0.4, maxTokens: 3000 }
    );

    const processingTime = Date.now() - startTime;

    if (result.success && result.data) {
      console.log('✅ [QUICK-OPENAI] Generation completed successfully');
      console.log(`📊 [QUICK-OPENAI] Quality: ${result.quality.confidence}, Tokens: ${result.tokens.total}, Time: ${processingTime}ms`);

      return NextResponse.json({
        code: result.data.reactCode,
        schema: {
          tableName: result.data.schema.tableName,
          columns: [
            { name: 'id', type: 'uuid', primaryKey: true, required: true },
            ...result.data.schema.fields.map(field => ({
              name: field.name,
              type: field.type,
              primaryKey: false,
              required: field.required || false
            })),
            { name: 'created_at', type: 'timestamp', primaryKey: false, required: true },
            { name: 'updated_at', type: 'timestamp', primaryKey: false, required: true }
          ]
        },
        analysis: result.data.appAnalysis,
        metadata: {
          provider: 'openai',
          model: 'gpt-4',
          processingTime,
          tokens: result.tokens.total,
          quality: result.quality.confidence,
          generatedAt: new Date().toISOString()
        },
        message: `OpenAI GPT-4による高品質アプリが生成されました！（${Math.round(processingTime/1000)}秒）`,
        instructions: {
          howToUse: 'このコードをNext.jsプロジェクトにコピーして使用してください',
          apiEndpoints: {
            create: `/api/crud/${result.data.schema.tableName} (POST)`,
            read: `/api/crud/${result.data.schema.tableName} (GET)`,
            delete: `/api/crud/${result.data.schema.tableName}?id=xxx (DELETE)`
          },
          note: 'GPT-4により最適化された高品質なコードです'
        }
      });
    } else {
      throw new Error('OpenAI generation failed: ' + (result.error || 'Unknown error'));
    }

  } catch (error) {
    console.error('💥 [QUICK-OPENAI] Generation failed:', error);
    return NextResponse.json(
      { 
        error: 'OpenAI高速生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}