/**
 * OpenAI最適化システム - OpenAI APIの能力を最大限活用
 * GPT-4、Function Calling、高度なプロンプトエンジニアリングを使用
 */

import { openai } from '@/lib/openai';

export interface OpenAIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  processingTime: number;
  quality: {
    confidence: number;
    reasoning: string;
  };
}

export interface OpenAIConfig {
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
  enableReasoningMode: boolean;
}

export class OpenAIOptimizedSystem {
  private config: OpenAIConfig;

  constructor(config?: Partial<OpenAIConfig>) {
    this.config = {
      model: 'gpt-4', // デフォルトでGPT-4を使用
      temperature: 0.7,
      maxTokens: 4000,
      timeoutMs: 60000,
      enableReasoningMode: true,
      ...config
    };
  }

  /**
   * 高度なFunction Calling - OpenAIの強力な機能を活用
   */
  async executeFunction<T>(
    functionName: string,
    functionSchema: any,
    prompt: string,
    systemMessage?: string,
    options?: Partial<OpenAIConfig>
  ): Promise<OpenAIResponse<T>> {
    const startTime = Date.now();
    const config = { ...this.config, ...options };

    try {
      console.log(`🚀 [OPENAI-OPTIMIZED] Starting ${functionName} with ${config.model}`);
      
      // 高度なシステムプロンプトの構築
      const enhancedSystemMessage = this.buildEnhancedSystemMessage(
        systemMessage || '', 
        functionName, 
        config
      );

      // OpenAI APIの実行
      const response = await openai.chat.completions.create({
        model: config.model,
        messages: [
          { role: "system", content: enhancedSystemMessage },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: functionName,
              description: functionSchema.description,
              parameters: functionSchema.parameters
            }
          }
        ],
        tool_choice: { type: "function", function: { name: functionName } },
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        response_format: { type: "text" }
      });

      // レスポンスの解析
      const toolCall = response.choices[0]?.message?.tool_calls?.[0];
      if (!toolCall?.function?.arguments) {
        throw new Error('No valid function call response');
      }

      const parsedData = JSON.parse(toolCall.function.arguments);
      
      // 品質評価
      const quality = this.evaluateResponseQuality(parsedData, functionSchema);
      
      const result: OpenAIResponse<T> = {
        success: true,
        data: parsedData,
        model: config.model,
        tokens: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        },
        processingTime: Date.now() - startTime,
        quality
      };

      console.log(`✅ [OPENAI-OPTIMIZED] ${functionName} completed successfully`);
      console.log(`📊 [OPENAI-OPTIMIZED] Tokens: ${result.tokens.total}, Quality: ${quality.confidence}`);
      
      return result;

    } catch (error) {
      console.error(`❌ [OPENAI-OPTIMIZED] ${functionName} failed:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: config.model,
        tokens: { prompt: 0, completion: 0, total: 0 },
        processingTime: Date.now() - startTime,
        quality: { confidence: 0, reasoning: 'Function execution failed' }
      };
    }
  }

  /**
   * 高度なテキスト生成 - Creative Writing、分析、推論に最適
   */
  async generateAdvancedText(
    prompt: string,
    type: 'creative' | 'analytical' | 'reasoning' | 'technical',
    options?: Partial<OpenAIConfig>
  ): Promise<OpenAIResponse<string>> {
    const startTime = Date.now();
    const config = { ...this.config, ...options };

    // タイプ別の最適化
    const typeOptimization = this.getTypeOptimization(type);
    config.temperature = typeOptimization.temperature;
    config.model = typeOptimization.preferredModel;

    try {
      console.log(`🎨 [OPENAI-OPTIMIZED] Generating ${type} text with ${config.model}`);

      const response = await openai.chat.completions.create({
        model: config.model,
        messages: [
          { role: "system", content: typeOptimization.systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        presence_penalty: typeOptimization.presencePenalty,
        frequency_penalty: typeOptimization.frequencyPenalty
      });

      const content = response.choices[0]?.message?.content || '';
      
      // コンテンツ品質評価
      const quality = this.evaluateTextQuality(content, type);

      const result: OpenAIResponse<string> = {
        success: true,
        data: content,
        model: config.model,
        tokens: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        },
        processingTime: Date.now() - startTime,
        quality
      };

      console.log(`✅ [OPENAI-OPTIMIZED] ${type} text generated successfully`);
      
      return result;

    } catch (error) {
      console.error(`❌ [OPENAI-OPTIMIZED] ${type} text generation failed:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: config.model,
        tokens: { prompt: 0, completion: 0, total: 0 },
        processingTime: Date.now() - startTime,
        quality: { confidence: 0, reasoning: 'Text generation failed' }
      };
    }
  }

  /**
   * 強化されたシステムメッセージの構築
   */
  private buildEnhancedSystemMessage(
    baseMessage: string, 
    functionName: string, 
    config: OpenAIConfig
  ): string {
    const enhancementPrompts = {
      reasoning: config.enableReasoningMode ? `
思考プロセスを明確にし、段階的に推論してください。
各決定の根拠を示し、代替案も考慮してください。` : '',
      
      quality: `
最高品質の結果を生成してください。以下の基準を満たすよう努めてください：
- 正確性と一貫性
- 詳細で具体的な内容
- 実用的で実装可能な提案
- 創造性と革新性のバランス`,
      
      structure: `
構造化された形式で応答し、すべての必須フィールドを含めてください。
JSONスキーマに完全に準拠し、型安全性を確保してください。`
    };

    return `${baseMessage}

${enhancementPrompts.reasoning}

${enhancementPrompts.quality}

${enhancementPrompts.structure}

Function: ${functionName}
Model: ${config.model}
Quality Mode: MAXIMUM`;
  }

  /**
   * レスポンス品質の評価
   */
  private evaluateResponseQuality(data: any, schema: any): { confidence: number; reasoning: string } {
    let confidence = 0.8; // Base confidence for GPT-4
    let issues: string[] = [];

    // 必須フィールドの確認
    const required = schema.parameters?.required || [];
    const missingFields = required.filter((field: string) => !(field in data));
    if (missingFields.length === 0) {
      confidence += 0.1;
    } else {
      issues.push(`Missing fields: ${missingFields.join(', ')}`);
      confidence -= 0.2;
    }

    // データの豊富さ評価
    const dataString = JSON.stringify(data);
    if (dataString.length > 500) confidence += 0.05;
    if (dataString.length > 1000) confidence += 0.05;

    // オブジェクトの複雑さ評価
    if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      if (keys.length >= 5) confidence += 0.1;
      if (keys.length >= 8) confidence += 0.05;
    }

    const reasoning = issues.length > 0 
      ? `Quality issues: ${issues.join('; ')}` 
      : 'High quality response with all requirements met';

    return { 
      confidence: Math.min(Math.max(confidence, 0), 1), 
      reasoning 
    };
  }

  /**
   * テキスト品質の評価
   */
  private evaluateTextQuality(content: string, type: string): { confidence: number; reasoning: string } {
    let confidence = 0.8;
    let factors: string[] = [];

    // 長さの評価
    if (content.length > 200) {
      confidence += 0.05;
      factors.push('adequate length');
    }
    if (content.length > 500) {
      confidence += 0.05;
      factors.push('comprehensive content');
    }

    // 構造の評価
    const paragraphs = content.split('\n\n').length;
    if (paragraphs >= 2) {
      confidence += 0.05;
      factors.push('well-structured');
    }

    // タイプ別評価
    switch (type) {
      case 'creative':
        if (content.includes('!') || content.includes('?')) {
          confidence += 0.05;
          factors.push('expressive language');
        }
        break;
      case 'analytical':
        if (content.includes('分析') || content.includes('評価')) {
          confidence += 0.05;
          factors.push('analytical depth');
        }
        break;
      case 'technical':
        if (content.includes('実装') || content.includes('技術')) {
          confidence += 0.05;
          factors.push('technical accuracy');
        }
        break;
    }

    const reasoning = factors.length > 0 
      ? `Quality factors: ${factors.join(', ')}` 
      : 'Standard quality text generated';

    return { 
      confidence: Math.min(confidence, 1), 
      reasoning 
    };
  }

  /**
   * 生成タイプ別の最適化設定
   */
  private getTypeOptimization(type: string) {
    const optimizations = {
      creative: {
        temperature: 0.9,
        preferredModel: 'gpt-4' as const,
        presencePenalty: 0.6,
        frequencyPenalty: 0.3,
        systemPrompt: `あなたは創造的で革新的なアイデアを生成する専門家です。
独創性、魅力、実用性を兼ね備えた内容を作成してください。
ユーザーの想像力を刺激し、新しい視点を提供してください。`
      },
      analytical: {
        temperature: 0.3,
        preferredModel: 'gpt-4' as const,
        presencePenalty: 0.1,
        frequencyPenalty: 0.1,
        systemPrompt: `あなたは詳細な分析と論理的思考を行う専門家です。
データに基づいた洞察、明確な論拠、実証可能な結論を提供してください。
複雑な問題を体系的に分解し、包括的な分析を行ってください。`
      },
      reasoning: {
        temperature: 0.2,
        preferredModel: 'gpt-4' as const,
        presencePenalty: 0.0,
        frequencyPenalty: 0.0,
        systemPrompt: `あなたは段階的推論と論理的思考を行う専門家です。
各ステップを明確に示し、前提条件から結論まで論理的に導いてください。
代替案も考慮し、最も合理的な解決策を提案してください。`
      },
      technical: {
        temperature: 0.1,
        preferredModel: 'gpt-4' as const,
        presencePenalty: 0.0,
        frequencyPenalty: 0.0,
        systemPrompt: `あなたは技術的精度と実装可能性を重視する専門家です。
正確な技術情報、ベストプラクティス、実装可能なソリューションを提供してください。
コードの品質、パフォーマンス、メンテナンス性を考慮してください。`
      }
    };

    return optimizations[type as keyof typeof optimizations] || optimizations.analytical;
  }

  /**
   * システムヘルスチェック
   */
  async healthCheck(): Promise<{
    available: boolean;
    model: string;
    latency: number;
    capabilities: string[];
  }> {
    const start = Date.now();
    
    try {
      const response = await openai.chat.completions.create({
        model: this.config.model,
        messages: [{ role: "user", content: "Health check" }],
        max_tokens: 5
      });

      return {
        available: true,
        model: this.config.model,
        latency: Date.now() - start,
        capabilities: [
          'Function Calling',
          'Advanced Reasoning',
          'Creative Generation',
          'Technical Analysis',
          'Multi-language Support'
        ]
      };
    } catch (error) {
      return {
        available: false,
        model: this.config.model,
        latency: Date.now() - start,
        capabilities: []
      };
    }
  }
}

export const openAIOptimized = new OpenAIOptimizedSystem();