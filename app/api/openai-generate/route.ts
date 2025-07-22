import { NextRequest, NextResponse } from 'next/server';
import { openAIOptimized } from '@/lib/openai-optimized-system';

interface OpenAIGenerateRequest {
  idea: string;
  mode?: 'creative' | 'analytical' | 'technical' | 'reasoning';
  useGPT4?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea, mode = 'technical', useGPT4 = true } = body as OpenAIGenerateRequest;

    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: 'アイデアの入力が必要です' },
        { status: 400 }
      );
    }

    console.log('🚀 [OPENAI-GENERATE] Starting advanced OpenAI generation');
    console.log(`📋 [OPENAI-GENERATE] Mode: ${mode}, GPT-4: ${useGPT4}`);

    const startTime = Date.now();

    // Phase 1: Intent Analysis with GPT-4
    console.log('🔍 [PHASE-1] Advanced Intent Analysis');
    const intentResult = await openAIOptimized.executeFunction(
      'analyze_app_intent',
      {
        description: 'Analyze the app idea and extract structured intent information',
        parameters: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['productivity', 'finance', 'health', 'social', 'ecommerce', 'creative', 'utility', 'education', 'entertainment'],
              description: 'App category'
            },
            primaryPurpose: {
              type: 'string',
              description: 'Main purpose of the app'
            },
            targetUsers: {
              type: 'array',
              items: { type: 'string' },
              description: 'Target user groups'
            },
            keyFeatures: {
              type: 'array',
              items: { type: 'string' },
              description: 'Key features and functionalities'
            },
            dataToManage: {
              type: 'string',
              description: 'Type of data the app will manage'
            },
            urgency: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Development urgency'
            },
            complexity: {
              type: 'string',
              enum: ['simple', 'moderate', 'complex'],
              description: 'Technical complexity level'
            },
            marketPosition: {
              type: 'string',
              description: 'Market positioning and competitive advantage'
            },
            businessModel: {
              type: 'string',
              description: 'Potential business model'
            }
          },
          required: ['category', 'primaryPurpose', 'targetUsers', 'keyFeatures', 'dataToManage', 'urgency', 'complexity']
        }
      },
      `アプリのアイデア: "${idea}"

このアイデアを詳細に分析し、以下の観点から構造化された情報を抽出してください：

1. アプリの本質的な目的と価値提案
2. 想定するユーザー層と使用シーン
3. 必要な機能と技術要件
4. 市場での位置づけと競合優位性
5. ビジネス的な可能性

分析は実用性と実現可能性を重視し、具体的で実装しやすい内容としてください。`,
      'あなたは経験豊富なプロダクトマネージャーです。アプリのアイデアを多角的に分析し、実用的で魅力的なプロダクト仕様を設計してください。',
      { model: useGPT4 ? 'gpt-4' : 'gpt-3.5-turbo', temperature: 0.4 }
    );

    // Phase 2: Advanced Schema Design
    console.log('🏗️ [PHASE-2] Advanced Schema Design');
    const schemaResult = await openAIOptimized.executeFunction(
      'design_advanced_schema',
      {
        description: 'Design a comprehensive database schema with advanced features',
        parameters: {
          type: 'object',
          properties: {
            mainTable: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Main table name in snake_case' },
                description: { type: 'string', description: 'Table purpose and description' },
                fields: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: 'Field name' },
                      type: { type: 'string', description: 'Field type' },
                      required: { type: 'boolean', description: 'Is required' },
                      label: { type: 'string', description: 'User-friendly label' },
                      placeholder: { type: 'string', description: 'Placeholder text' },
                      validation: { type: 'string', description: 'Validation rules' },
                      defaultValue: { type: 'string', description: 'Default value' }
                    }
                  }
                }
              }
            },
            relatedTables: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  purpose: { type: 'string' },
                  relationship: { type: 'string' }
                }
              }
            },
            businessLogic: {
              type: 'array',
              items: { type: 'string' },
              description: 'Business rules and logic'
            },
            scalabilityFeatures: {
              type: 'array',
              items: { type: 'string' },
              description: 'Features for future scalability'
            }
          },
          required: ['mainTable', 'businessLogic']
        }
      },
      `プロダクト分析結果:
${JSON.stringify(intentResult.data, null, 2)}

この分析結果を基に、高度なデータベーススキーマを設計してください：

設計要件:
1. 拡張性とパフォーマンスを考慮した構造
2. ビジネスロジックを支える適切なフィールド設計
3. 将来の機能拡張に対応した柔軟な設計
4. データの整合性と安全性を確保
5. 実装しやすいシンプルさの維持

特に以下を重視してください：
- ユーザー体験を向上させるフィールド構成
- 検索・フィルタリング性能の最適化
- データ分析やレポート機能への対応`,
      'あなたは経験豊富なデータベースアーキテクトです。ビジネス要件を技術的に実現する最適なスキーマを設計してください。',
      { model: useGPT4 ? 'gpt-4' : 'gpt-3.5-turbo', temperature: 0.3 }
    );

    // Phase 3: Advanced Code Generation
    console.log('⚡ [PHASE-3] Advanced Code Generation');
    const codeResult = await openAIOptimized.generateAdvancedText(
      `プロダクト仕様:
${JSON.stringify(intentResult.data, null, 2)}

データベース設計:
${JSON.stringify(schemaResult.data, null, 2)}

この設計を基に、最高品質のNext.js + React + TypeScript アプリケーションコンポーネントを生成してください。

高度な要件:
1. プロフェッショナルレベルのコード品質
2. TypeScript厳密型チェック対応
3. 高度なエラーハンドリングとバリデーション
4. アクセシビリティ完全対応 (ARIA, キーボードナビゲーション)
5. パフォーマンス最適化 (useMemo, useCallback)
6. 美しいUI/UX設計 (アニメーション、マイクロインタラクション)
7. レスポンシブデザイン (モバイルファースト)
8. SEO対応とメタデータ
9. 国際化対応の基盤
10. テスタビリティを考慮した設計

技術スタック:
- Next.js 14 (App Router)
- React 18 (Concurrent Features)
- TypeScript (Strict Mode)
- Tailwind CSS (Advanced Classes)
- shadcn/ui (Premium Components)
- Framer Motion (Animations)
- React Hook Form + Zod (Validation)
- Lucide Icons (Modern Icons)

コンポーネント構造:
- 再利用可能なカスタムフック
- 型安全なAPI呼び出し
- 適切な状態管理とデータフロー
- エラーバウンダリとフォールバック
- スケルトンローディング
- オプティミスティックアップデート

UI/UX要素:
- ダークモード対応
- グラデーションとマイクロアニメーション
- インタラクティブなホバーエフェクト
- スムーズなページ遷移
- 直感的なナビゲーション
- 視覚的なフィードバック`,
      mode,
      { 
        model: useGPT4 ? 'gpt-4' : 'gpt-3.5-turbo', 
        temperature: mode === 'creative' ? 0.8 : 0.2, 
        maxTokens: 4000 
      }
    );

    // Phase 4: Quality Enhancement
    console.log('✨ [PHASE-4] Quality Enhancement');
    const enhancementResult = await openAIOptimized.generateAdvancedText(
      `生成されたコード:
${codeResult.data}

このコードを以下の観点で分析し、改善提案を生成してください：

分析ポイント:
1. コード品質とベストプラクティス準拠
2. パフォーマンス最適化の機会
3. アクセシビリティの改善点
4. セキュリティの強化要素
5. ユーザビリティの向上提案
6. 保守性と拡張性の評価
7. テスト容易性の改善

出力形式:
{
  "qualityScore": 95,
  "strengths": ["優れている点のリスト"],
  "improvements": ["改善提案のリスト"],
  "securityNotes": ["セキュリティ考慮事項"],
  "performanceOptimizations": ["パフォーマンス最適化提案"],
  "accessibilityEnhancements": ["アクセシビリティ改善提案"],
  "testingStrategy": ["テスト戦略の提案"]
}`,
      'analytical',
      { model: useGPT4 ? 'gpt-4' : 'gpt-3.5-turbo', temperature: 0.1 }
    );

    const totalTime = Date.now() - startTime;

    // Results compilation
    const result = {
      intent: intentResult.data,
      schema: schemaResult.data,
      code: codeResult.data,
      qualityAnalysis: enhancementResult.data,
      metadata: {
        model: useGPT4 ? 'gpt-4' : 'gpt-3.5-turbo',
        mode,
        processingTime: totalTime,
        totalTokens: (intentResult.tokens?.total || 0) + 
                    (schemaResult.tokens?.total || 0) + 
                    (codeResult.tokens?.total || 0) + 
                    (enhancementResult.tokens?.total || 0),
        qualityScores: {
          intent: intentResult.quality?.confidence || 0,
          schema: schemaResult.quality?.confidence || 0,
          code: codeResult.quality?.confidence || 0,
          enhancement: enhancementResult.quality?.confidence || 0
        }
      },
      instructions: {
        deployment: 'Next.js App Routerプロジェクトにコンポーネントをコピーして使用',
        apis: {
          main: `/api/crud/${(schemaResult.data as any)?.mainTable?.name || 'data'}`,
          endpoints: ['GET (取得)', 'POST (作成)', 'PUT (更新)', 'DELETE (削除)']
        },
        setup: [
          '1. 依存関係のインストール: npm install',
          '2. shadcn/uiコンポーネントのセットアップ',
          '3. データベーステーブルの作成',
          '4. 環境変数の設定',
          '5. アプリケーションの起動: npm run dev'
        ],
        features: (intentResult.data as any)?.keyFeatures || [],
        nextSteps: [
          'ユーザー認証機能の追加',
          'データ分析ダッシュボードの実装',
          'モバイルアプリ版の開発',
          'API の拡張とドキュメント化',
          'プロダクション環境へのデプロイ'
        ]
      }
    };

    console.log('🎉 [OPENAI-GENERATE] Advanced generation completed successfully');
    console.log(`📊 [OPENAI-GENERATE] Total tokens: ${result.metadata.totalTokens}, Time: ${Math.round(totalTime/1000)}s`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('💥 [OPENAI-GENERATE] Generation failed:', error);
    return NextResponse.json(
      { 
        error: 'OpenAI最適化生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}