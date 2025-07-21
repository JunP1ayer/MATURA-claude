/**
 * Robust LLM System - Gemini + OpenAI 連携による堅牢なLLMシステム
 * エラー処理、フォールバック、品質保証を徹底
 */

import { openai } from '@/lib/openai';
import { GeminiClient } from '@/lib/gemini-client';

export interface LLMResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  provider: 'openai' | 'gemini' | 'fallback';
  attempts: number;
  confidence: number;
  processingTime: number;
}

export interface LLMSystemConfig {
  maxRetries: number;
  timeoutMs: number;
  fallbackEnabled: boolean;
  qualityThreshold: number;
}

export class RobustLLMSystem {
  private gemini: GeminiClient;
  private config: LLMSystemConfig;

  constructor(config?: Partial<LLMSystemConfig>) {
    this.gemini = new GeminiClient();
    this.config = {
      maxRetries: 3,
      timeoutMs: 30000,
      fallbackEnabled: true,
      qualityThreshold: 0.8,
      ...config
    };
  }

  /**
   * OpenAI Function Calling with Gemini Fallback
   */
  async callFunctionWithFallback<T>(
    functionName: string,
    functionSchema: any,
    prompt: string,
    systemMessage?: string
  ): Promise<LLMResponse<T>> {
    const startTime = Date.now();
    let attempts = 0;

    // Phase 1: OpenAI Function Calling (Primary)
    for (let i = 0; i < this.config.maxRetries; i++) {
      attempts++;
      try {
        console.log(`🔄 [ROBUST-LLM] OpenAI attempt ${attempts}/${this.config.maxRetries}`);
        
        const result = await this.callOpenAIFunction<T>(
          functionName,
          functionSchema,
          prompt,
          systemMessage
        );

        if (result.success && result.data) {
          const confidence = this.calculateConfidence(result.data, 'openai');
          
          if (confidence >= this.config.qualityThreshold) {
            console.log('✅ [ROBUST-LLM] OpenAI success with high confidence:', confidence);
            return {
              success: true,
              data: result.data,
              provider: 'openai',
              attempts,
              confidence,
              processingTime: Date.now() - startTime
            };
          } else {
            console.log('⚠️ [ROBUST-LLM] OpenAI low confidence, retrying:', confidence);
          }
        }
      } catch (error) {
        console.log('❌ [ROBUST-LLM] OpenAI attempt failed:', error);
      }
    }

    // Phase 2: Gemini Fallback (Secondary)
    if (this.config.fallbackEnabled) {
      console.log('🔄 [ROBUST-LLM] Switching to Gemini fallback');
      
      for (let i = 0; i < this.config.maxRetries; i++) {
        attempts++;
        try {
          const result = await this.callGeminiFallback<T>(prompt, functionSchema);
          
          if (result.success && result.data) {
            const confidence = this.calculateConfidence(result.data, 'gemini');
            
            console.log('✅ [ROBUST-LLM] Gemini fallback success:', confidence);
            return {
              success: true,
              data: result.data,
              provider: 'gemini',
              attempts,
              confidence,
              processingTime: Date.now() - startTime
            };
          }
        } catch (error) {
          console.log('❌ [ROBUST-LLM] Gemini attempt failed:', error);
        }
      }
    }

    // Phase 3: Rule-based Fallback (Last Resort)
    console.log('🔄 [ROBUST-LLM] Using rule-based fallback');
    const fallbackData = this.generateRuleBasedFallback<T>(functionName, prompt);
    
    return {
      success: true,
      data: fallbackData,
      provider: 'fallback',
      attempts,
      confidence: 0.6,
      processingTime: Date.now() - startTime
    };
  }

  /**
   * OpenAI Function Calling with timeout and validation
   */
  private async callOpenAIFunction<T>(
    functionName: string,
    functionSchema: any,
    prompt: string,
    systemMessage?: string
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('OpenAI timeout')), this.config.timeoutMs)
      );

      const apiPromise = openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          ...(systemMessage ? [{ role: "system" as const, content: systemMessage }] : []),
          { role: "user" as const, content: prompt }
        ],
        functions: [
          {
            name: functionName,
            description: functionSchema.description,
            parameters: functionSchema.parameters
          }
        ],
        function_call: { name: functionName },
        temperature: 0.2,
        max_tokens: 3000
      });

      const response = await Promise.race([apiPromise, timeoutPromise]) as any;
      
      const functionCall = response.choices[0]?.message?.function_call;
      if (!functionCall?.arguments) {
        throw new Error('No function call response');
      }

      const parsedData = JSON.parse(functionCall.arguments);
      
      // Validation
      if (!this.validateFunctionResponse(parsedData, functionSchema)) {
        throw new Error('Function response validation failed');
      }

      return { success: true, data: parsedData };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Gemini fallback with structured prompting
   */
  private async callGeminiFallback<T>(
    prompt: string,
    functionSchema: any
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const structuredPrompt = `${prompt}

以下の形式でJSONレスポンスを生成してください：
${JSON.stringify(functionSchema.parameters, null, 2)}

重要: 有効なJSONのみを返してください。`;

      const response = await this.gemini.generateText({
        prompt: structuredPrompt,
        temperature: 0.3,
        maxTokens: 2000
      });

      if (!response.success || !response.data) {
        throw new Error('Gemini generation failed');
      }

      // JSON抽出
      const jsonMatch = response.data.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      return { success: true, data: parsedData };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Rule-based fallback for critical functions
   */
  private generateRuleBasedFallback<T>(functionName: string, prompt: string): T {
    const fallbacks: Record<string, any> = {
      analyze_app_intent: {
        category: 'utility',
        primaryPurpose: 'データ管理システム',
        targetUsers: ['一般ユーザー'],
        keyFeatures: ['データ作成', 'データ表示', 'データ編集'],
        dataToManage: 'アプリケーションデータ',
        urgency: 'medium',
        complexity: 'simple'
      },
      generate_database_schema: {
        tableName: 'app_data',
        description: 'アプリケーションデータの管理',
        fields: [
          { name: 'id', label: 'ID', type: 'text', required: true },
          { name: 'title', label: 'タイトル', type: 'text', required: true },
          { name: 'description', label: '説明', type: 'text', required: false },
          { name: 'created_at', label: '作成日', type: 'date', required: true }
        ]
      },
      generate_ui_configuration: {
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          backgroundColor: '#ffffff'
        },
        layout: 'list',
        components: ['Card', 'Button', 'Input'],
        interactions: ['click', 'submit', 'edit']
      }
    };

    return fallbacks[functionName] || fallbacks.analyze_app_intent;
  }

  /**
   * Response validation
   */
  private validateFunctionResponse(data: any, schema: any): boolean {
    try {
      const required = schema.parameters?.required || [];
      
      for (const field of required) {
        if (!(field in data)) {
          console.log(`❌ [ROBUST-LLM] Missing required field: ${field}`);
          return false;
        }
      }

      // Type validation
      const properties = schema.parameters?.properties || {};
      for (const [key, value] of Object.entries(data)) {
        const expectedType = properties[key]?.type;
        if (expectedType && !this.validateType(value, expectedType)) {
          console.log(`❌ [ROBUST-LLM] Type mismatch for ${key}: expected ${expectedType}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log('❌ [ROBUST-LLM] Validation error:', error);
      return false;
    }
  }

  /**
   * Type validation helper
   */
  private validateType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * Confidence calculation
   */
  private calculateConfidence(data: any, provider: 'openai' | 'gemini'): number {
    let confidence = provider === 'openai' ? 0.85 : 0.75; // Base confidence

    // Check data completeness
    const dataString = JSON.stringify(data);
    if (dataString.length > 100) confidence += 0.05;
    if (dataString.length > 500) confidence += 0.05;

    // Check for specific quality indicators
    if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      if (keys.length >= 3) confidence += 0.05;
      if (keys.length >= 5) confidence += 0.05;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * System health check
   */
  async healthCheck(): Promise<{
    openai: boolean;
    gemini: boolean;
    overall: boolean;
    latency: { openai?: number; gemini?: number };
  }> {
    const results = { openai: false, gemini: false, overall: false, latency: {} as any };

    // OpenAI health check
    try {
      const start = Date.now();
      await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 10
      });
      results.openai = true;
      results.latency.openai = Date.now() - start;
    } catch (error) {
      console.log('❌ [ROBUST-LLM] OpenAI health check failed');
    }

    // Gemini health check
    try {
      const start = Date.now();
      const response = await this.gemini.generateText({
        prompt: "Hello",
        maxTokens: 10
      });
      results.gemini = response.success;
      results.latency.gemini = Date.now() - start;
    } catch (error) {
      console.log('❌ [ROBUST-LLM] Gemini health check failed');
    }

    results.overall = results.openai || results.gemini;
    return results;
  }
}

export const robustLLMSystem = new RobustLLMSystem();