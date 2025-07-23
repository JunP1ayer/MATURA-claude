/**
 * Enhanced Gemini API Client for Creative AI Generation
 * Optimized for ideation, creativity, and diverse content generation
 */

interface GeminiRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  context?: string;
  creativityMode?: 'conservative' | 'balanced' | 'experimental' | 'wild';
  topP?: number;
  topK?: number;
}

interface GeminiCreativeResponse {
  success: boolean;
  data?: string;
  error?: string;
  creativityScore?: number;
  variations?: string[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: {
    model: string;
    temperature: number;
    processingTime: number;
    safety: any;
  };
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
   * 創造的アイデア生成 - Geminiの強みを活用
   */
  /**
   * 機能抽出特化分析 - カテゴリ分類完全廃止
   */
  async extractFeaturesDirectly(
    userInput: string,
    options: Partial<GeminiRequest> = {}
  ): Promise<GeminiCreativeResponse> {
    const startTime = Date.now();
    
    const creativityConfig = this.getCreativityConfig(options.creativityMode || 'balanced');
    
    const prompt = `🎯 高精度機能抽出システム - 安定性重視版 🎯

【分析対象】: "${userInput}"

あなたは機能分析の専門家です。どのようなユーザーアイデアでも一貫して高品質な機能抽出を行ってください。

📋 【必須実行手順】:
STEP 1: ユーザーの言葉から「動詞」を抽出（何をしたいか）
STEP 2: 「対象データ」を特定（何を扱うか）
STEP 3: 「ユーザーの目的」を明確化（なぜ必要か）
STEP 4: 上記を基に具体的機能リストを生成

🎯 【出力必須要件】:
- keyFeatures: 必ず6個の具体的機能（「〜機能」「〜システム」「〜管理」などの形式）
- specificComponents: 必ず4個のUIコンポーネント（「〜フォーム」「〜リスト」「〜カード」など）
- dataStructure: 必ず3個のデータエンティティ（実際に保存するデータの名前）
- businessLogic: 必ず3個のビジネスルール（「〜の計算」「〜の検証」など）

以下のJSON形式で必ず回答してください（フィールドの欠落は厳禁です）：

{
  "enhancedDescription": "ユーザーのアイデアを機能面で具体化した説明（60-80文字）",
  "coreEssence": "このアプリが解決する核心的価値（30-50文字）",
  "targetUsers": ["主要ユーザー", "副次ユーザー", "管理者"],
  "keyFeatures": ["機能1", "機能2", "機能3", "機能4", "機能5", "機能6"],
  "specificComponents": ["UIコンポーネント1", "UIコンポーネント2", "UIコンポーネント3", "UIコンポーネント4"],
  "dataStructure": ["データエンティティ1", "データエンティティ2", "データエンティティ3"],
  "userInteractions": ["操作1", "操作2", "操作3"],
  "businessLogic": ["ビジネスルール1", "ビジネスルール2", "ビジネスルール3"],
  "uniqueValue": "他にない独自の価値提案（40-60文字）",
  "businessPotential": "high|medium|low",
  "technicalConsiderations": ["技術的考慮点1", "技術的考慮点2"],
  "inspiration": "実装時のインスピレーション（30-50文字）"
}

${this.getCreativityPrompt(options.creativityMode || 'balanced')}

🚨 【重要な一貫性ルール】:
1. カテゴリ分類は絶対に行わない
2. 汎用的な「管理」「一覧」ではなく、具体的な機能名を使用
3. ユーザーが明示していない機能は推測で追加しない
4. 全フィールドを必ず埋める（空配列や空文字列は禁止）
5. 実装可能で具体的な内容のみ記載

📝 【実例ガイド】:
入力: "家計簿アプリ" 
→ keyFeatures: ["収支記録機能", "カテゴリ別集計機能", "月次レポート生成機能", "予算設定機能", "レシート撮影機能", "グラフ表示機能"]
→ dataStructure: ["expense_records", "budget_settings", "receipt_images"]`;

    const result = await this.generateText({
      prompt,
      temperature: creativityConfig.temperature,
      maxTokens: options.maxTokens || 2000,
      ...creativityConfig
    });

    const processingTime = Date.now() - startTime;

    if (result.success && result.data) {
      try {
        // JSON抽出を試行
        const jsonMatch = result.data.match(/\{[\s\S]*\}/);
        let parsedData = null;
        
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }

        return {
          success: true,
          data: result.data,
          creativityScore: this.calculateCreativityScore(result.data),
          variations: parsedData?.creativeVariations?.map((v: any) => v.name) || [],
          usage: result.usage,
          metadata: {
            model: 'gemini-1.5-flash',
            temperature: creativityConfig.temperature,
            processingTime,
            safety: null
          }
        };
      } catch (parseError) {
        // JSON解析失敗でも基本情報は返す
        return {
          success: true,
          data: result.data,
          creativityScore: this.calculateCreativityScore(result.data),
          variations: [],
          usage: result.usage,
          metadata: {
            model: 'gemini-1.5-flash',
            temperature: creativityConfig.temperature,
            processingTime,
            safety: null
          }
        };
      }
    }

    return {
      success: false,
      error: result.error || 'Creative generation failed',
      creativityScore: 0,
      variations: []
    };
  }

  /**
   * 創造的デザインコンセプト生成
   */
  async generateDesignConcepts(
    appIdea: string,
    creativityLevel: 'conservative' | 'balanced' | 'experimental' | 'wild' = 'balanced'
  ): Promise<GeminiCreativeResponse> {
    const creativityConfig = this.getCreativityConfig(creativityLevel);
    
    const prompt = `🎨 デザイン創造モード 🎨

アプリアイデア: "${appIdea}"

あなたは世界的に有名なデザイナーです。このアプリに革新的で美しいデザインコンセプトを提案してください。

デザイン思考プロセス:
1. 🎯 ユーザーの感情的ニーズを理解
2. 🌈 視覚的インパクトの創造
3. ✨ インタラクションの革新
4. 🔮 未来的体験の設計
5. 💫 ブランド価値の構築

以下のJSON形式でデザインコンセプトを生成してください：

{
  "primaryConcept": {
    "name": "メインコンセプト名",
    "philosophy": "デザイン哲学",
    "moodKeywords": ["ムード1", "ムード2", "ムード3"],
    "colorStory": "カラーストーリー"
  },
  "visualIdentity": {
    "colorPalettes": [
      {
        "name": "パレット名",
        "colors": ["#color1", "#color2", "#color3", "#color4"],
        "emotion": "感情的効果",
        "usage": "使用場面"
      }
    ],
    "typography": {
      "heading": "見出しフォント提案",
      "body": "本文フォント提案",
      "accent": "アクセントフォント提案",
      "personality": "フォントの個性"
    },
    "imagery": {
      "style": "画像スタイル",
      "iconApproach": "アイコンアプローチ",
      "photographyMood": "写真の雰囲気"
    }
  },
  "interactionDesign": {
    "philosophy": "インタラクション哲学",
    "keyAnimations": ["アニメーション1", "アニメーション2"],
    "microInteractions": ["マイクロインタラクション1", "マイクロインタラクション2"],
    "navigationStyle": "ナビゲーションスタイル"
  },
  "innovativeFeatures": [
    {
      "name": "革新機能名",
      "description": "機能説明",
      "userBenefit": "ユーザーメリット"
    }
  ],
  "emotionalJourney": {
    "onboarding": "オンボーディング体験",
    "dailyUse": "日常使用体験",
    "achievement": "達成体験"
  }
}

${this.getCreativityPrompt(creativityLevel)}

特に視覚的インパクトと感情的つながりを重視してください。`;

    const result = await this.generateText({
      prompt,
      temperature: creativityConfig.temperature,
      maxTokens: 2500,
      ...creativityConfig
    });

    if (result.success) {
      return {
        success: true,
        data: result.data,
        creativityScore: this.calculateCreativityScore(result.data || ''),
        usage: result.usage,
        metadata: {
          model: 'gemini-1.5-flash',
          temperature: creativityConfig.temperature,
          processingTime: 0,
          safety: null
        }
      };
    }

    return {
      success: false,
      error: result.error,
      creativityScore: 0
    };
  }

  /**
   * 創造性設定の取得
   */
  private getCreativityConfig(mode: string) {
    const configs = {
      conservative: {
        temperature: 0.6,
        topP: 0.8,
        topK: 40
      },
      balanced: {
        temperature: 0.8,
        topP: 0.9,
        topK: 60
      },
      experimental: {
        temperature: 1.0,
        topP: 0.95,
        topK: 80
      },
      wild: {
        temperature: 1.2,
        topP: 1.0,
        topK: 100
      }
    };

    return configs[mode as keyof typeof configs] || configs.balanced;
  }

  /**
   * 創造性プロンプトの取得
   */
  private getCreativityPrompt(mode: string): string {
    const prompts = {
      conservative: '実用性を重視しつつ、適度な創造性を発揮してください。',
      balanced: '創造性と実用性のバランスを保ち、革新的だが実現可能なアイデアを提案してください。',
      experimental: '大胆で革新的なアイデアを恐れずに提案してください。従来の常識を覆すような発想を歓迎します。',
      wild: '制約を忘れ、最大限の創造性を発揮してください。SF的、未来的、非常識なアイデアも大歓迎です！'
    };

    return prompts[mode as keyof typeof prompts] || prompts.balanced;
  }

  /**
   * 創造性スコア計算
   */
  private calculateCreativityScore(content: string): number {
    let score = 0.5; // ベーススコア

    // 長さによる評価
    if (content.length > 500) score += 0.1;
    if (content.length > 1000) score += 0.1;

    // キーワードによる創造性判定
    const creativeKeywords = [
      '革新', '独創', '斬新', '画期的', '未来的', '創造的', 
      '変革', '進化', 'イノベーション', 'ブレイクスルー',
      '体験', '感情', '驚き', '魅力', 'ユニーク'
    ];

    creativeKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 0.02;
    });

    // JSON構造の複雑さ
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const keys = Object.keys(parsed);
        if (keys.length >= 5) score += 0.1;
        if (keys.length >= 8) score += 0.1;
      }
    } catch (e) {
      // JSON解析失敗は問題なし
    }

    return Math.min(score, 1.0);
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

コンポーネント名: ${schema.tableName ? `${this.toPascalCase(schema.tableName)  }Manager` : 'AppManager'}
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

## 以下のJSON形式で柔軟に分析してください
{
  "designCharacter": "デザインの性格（自由記述）",
  "complexity": "simple|moderate|complex",
  "targetAudience": "ターゲット層（自由記述）",
  "primaryGoals": ["主要目標1", "目標2", "目標3"],
  "emotionalTone": "感情的トーン（自由記述）",
  "designTags": ["デザインタグ1", "タグ2", "タグ3", "タグ4"],
  "recommendedColors": {
    "palette": ["#色コード1", "#色コード2", "#色コード3", "#色コード4"],
    "mood": "色の雰囲気",
    "reasoning": "色選択の理由"
  },
  "layoutApproach": "レイアウトアプローチ（自由記述）",
  "keyFeatures": ["機能1", "機能2", "機能3"],
  "designPriorities": ["優先事項1", "優先事項2", "優先事項3"],
  "innovativeElements": ["革新要素1", "要素2"],
  "userExperienceFocus": "UX重点領域",
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