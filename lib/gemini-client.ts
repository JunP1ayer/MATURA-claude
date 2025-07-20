/**
 * Gemini API Client for enhanced code generation
 */

interface GeminiRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  context?: string;
}

interface GeminiResponse {
  success: boolean;
  data?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class GeminiClient {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
    }
  }

  async generateText(request: GeminiRequest): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Gemini API key not configured'
      };
    }

    try {
      console.log('🤖 Calling Gemini API...');
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${request.context ? `Context: ${request.context}\n\n` : ''}${request.prompt}`
            }]
          }],
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: request.maxTokens || 2048,
            topP: 0.8,
            topK: 40
          }
        })
      });

      const endTime = Date.now();
      console.log(`✅ Gemini API responded in ${endTime - startTime}ms`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Gemini API error:', errorData);
        return {
          success: false,
          error: `Gemini API error: ${response.status} - ${errorData}`
        };
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        return {
          success: false,
          error: 'Invalid response structure from Gemini API'
        };
      }

      const generatedText = data.candidates[0].content.parts[0].text;

      return {
        success: true,
        data: generatedText,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        }
      };

    } catch (error) {
      console.error('💥 Gemini API call failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * 高品質なコード生成に特化したメソッド
   */
  async generateHighQualityCode(
    userRequirement: string,
    schema: any,
    designPattern: any
  ): Promise<GeminiResponse> {
    const prompt = `
あなたは優秀なReact/TypeScript開発者です。以下の要件に基づいて、高品質で実用的なReactコンポーネントを生成してください。

## 要件
${userRequirement}

## データベーススキーマ
${JSON.stringify(schema, null, 2)}

## デザインパターン
${JSON.stringify(designPattern, null, 2)}

## 生成する際の重要な条件
1. **完全に動作するコード**: エラーのない、実際に動作するReactコンポーネント
2. **TypeScript対応**: 厳密な型定義を含む
3. **モダンなReact**: Hooks、関数型コンポーネントを使用
4. **UI/UX最適化**: 使いやすく美しいインターフェース
5. **パフォーマンス**: 最適化されたレンダリング
6. **エラーハンドリング**: 堅牢なエラー処理
7. **レスポンシブデザイン**: モバイル対応
8. **アクセシビリティ**: WAI-ARIA準拠

## 使用すべきライブラリ
- React 18+ with Hooks
- TypeScript
- Tailwind CSS
- Lucide React (アイコン)
- shadcn/ui コンポーネント

## 出力形式
完全なReactコンポーネントのコードのみを出力してください。説明は不要です。

コンポーネント名: ${schema.tableName ? this.toPascalCase(schema.tableName) + 'Manager' : 'AppManager'}
`;

    return this.generateText({
      prompt,
      temperature: 0.3, // より一貫性のある出力のため低めに設定
      maxTokens: 4000,
      context: 'High-quality React component generation'
    });
  }

  /**
   * デザイン分析に特化したメソッド
   */
  async analyzeDesignRequirements(userInput: string): Promise<GeminiResponse> {
    const prompt = `
ユーザーの入力を分析して、最適なデザインパターンを提案してください。

## ユーザー入力
${userInput}

## 分析して以下のJSON形式で回答してください
{
  "category": "business|creative|social|productivity|ecommerce|education",
  "complexity": "simple|moderate|complex",
  "targetAudience": "general|professional|creative|technical|children",
  "primaryGoal": "efficiency|engagement|sales|learning|communication",
  "emotionalTone": "modern|friendly|professional|playful|elegant",
  "recommendedColors": {
    "primary": "#色コード",
    "secondary": "#色コード", 
    "accent": "#色コード",
    "reasoning": "色選択の理由"
  },
  "layoutStyle": "minimal|modern|classic|creative",
  "keyFeatures": ["機能1", "機能2", "機能3"],
  "designPriorities": ["優先事項1", "優先事項2"],
  "confidenceScore": 0.8
}

JSONのみを出力してください。他の文章は不要です。
`;

    return this.generateText({
      prompt,
      temperature: 0.4,
      maxTokens: 1000,
      context: 'Design requirement analysis'
    });
  }

  /**
   * スキーマ推論に特化したメソッド
   */
  async inferDatabaseSchema(userInput: string): Promise<GeminiResponse> {
    const prompt = `
ユーザーの要求からデータベーススキーマを推論してください。

## ユーザー入力
${userInput}

## 以下のJSON形式で回答してください
{
  "tableName": "テーブル名（英語、単数形）",
  "columns": [
    {
      "name": "カラム名",
      "type": "uuid|text|integer|decimal|boolean|date|timestamp",
      "nullable": true|false,
      "primaryKey": true|false,
      "defaultValue": "デフォルト値（該当する場合）",
      "description": "カラムの説明"
    }
  ],
  "relationships": [
    {
      "type": "foreign_key",
      "column": "カラム名",
      "references": "参照テーブル.カラム名"
    }
  ],
  "indexes": ["インデックスが必要なカラム名"],
  "reasoning": "このスキーマ設計の理由"
}

JSONのみを出力してください。他の文章は不要です。
`;

    return this.generateText({
      prompt,
      temperature: 0.2, // より正確な構造化データのため低温度
      maxTokens: 1500,
      context: 'Database schema inference'
    });
  }

  private toPascalCase(str: string): string {
    return str.replace(/(?:^|_)([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}

export const geminiClient = new GeminiClient();