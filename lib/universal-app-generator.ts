/**
 * Universal App Generator - LLMファーストアーキテクチャ
 * どんなアイデアでも理解し、適切なアプリを生成する
 */

import { openai } from '@/lib/openai';

// 意図理解の結果
export interface AppIntent {
  category: 'productivity' | 'finance' | 'health' | 'social' | 'ecommerce' | 'creative' | 'utility' | 'education' | 'entertainment';
  primaryPurpose: string;
  targetUsers: string[];
  keyFeatures: string[];
  dataToManage: string;
  urgency: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'moderate' | 'complex';
}

// 生成されるスキーマ
export interface GeneratedSchema {
  tableName: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'email' | 'tel' | 'url' | 'boolean';
    required: boolean;
    placeholder?: string;
    validation?: string;
  }>;
}

// UI設定
export interface UIConfiguration {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  layout: 'list' | 'grid' | 'dashboard' | 'form';
  components: string[];
  interactions: string[];
}

// 完成されたアプリ
export interface GeneratedApp {
  intent: AppIntent;
  schema: GeneratedSchema;
  ui: UIConfiguration;
  code: string;
  confidence: number;
}

export class UniversalAppGenerator {
  
  /**
   * メイン生成関数 - 任意のアイデアからアプリを生成
   */
  async generateApp(userIdea: string): Promise<GeneratedApp> {
    console.log('🚀 [UNIVERSAL] Starting universal app generation for:', userIdea);
    
    try {
      // Step 1: 意図理解
      const intent = await this.analyzeIntent(userIdea);
      console.log('✅ [UNIVERSAL] Intent analyzed:', intent.category);
      
      // Step 2: スキーマ生成
      const schema = await this.generateSchema(intent, userIdea);
      console.log('✅ [UNIVERSAL] Schema generated:', schema.tableName);
      
      // Step 3: UI設定生成
      const ui = await this.generateUI(intent, schema);
      console.log('✅ [UNIVERSAL] UI configured:', ui.theme.primaryColor);
      
      // Step 4: コード生成
      const code = await this.generateCode(intent, schema, ui, userIdea);
      console.log('✅ [UNIVERSAL] Code generated:', code.length, 'characters');
      
      const confidence = this.calculateConfidence(intent, schema, ui);
      
      return {
        intent,
        schema,
        ui,
        code,
        confidence
      };
      
    } catch (error) {
      console.error('❌ [UNIVERSAL] Generation failed:', error);
      throw error;
    }
  }

  /**
   * Step 1: 意図理解 - OpenAI Function Callingで構造化
   */
  private async analyzeIntent(userIdea: string): Promise<AppIntent> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert app analyst. Analyze user ideas and extract structured information about their intent."
        },
        {
          role: "user", 
          content: `Analyze this app idea: "${userIdea}"`
        }
      ],
      functions: [
        {
          name: "analyze_app_intent",
          description: "Extract structured information about the user's app idea",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: ["productivity", "finance", "health", "social", "ecommerce", "creative", "utility", "education", "entertainment"],
                description: "Primary category of the app"
              },
              primaryPurpose: {
                type: "string",
                description: "Main purpose or goal of the app"
              },
              targetUsers: {
                type: "array",
                items: { type: "string" },
                description: "Target user groups"
              },
              keyFeatures: {
                type: "array",
                items: { type: "string" },
                description: "Key features the app should have"
              },
              dataToManage: {
                type: "string",
                description: "Type of data the app will manage"
              },
              urgency: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "Urgency level of the problem being solved"
              },
              complexity: {
                type: "string",
                enum: ["simple", "moderate", "complex"],
                description: "Expected complexity of the app"
              }
            },
            required: ["category", "primaryPurpose", "targetUsers", "keyFeatures", "dataToManage", "urgency", "complexity"]
          }
        }
      ],
      function_call: { name: "analyze_app_intent" },
      temperature: 0.3
    });

    const functionCall = response.choices[0]?.message?.function_call;
    if (!functionCall?.arguments) {
      throw new Error('No function call response received');
    }

    return JSON.parse(functionCall.arguments);
  }

  /**
   * Step 2: スキーマ生成 - 意図に基づいた適切なデータ構造
   */
  private async generateSchema(intent: AppIntent, userIdea: string): Promise<GeneratedSchema> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a database schema expert. Generate optimal database schemas for apps."
        },
        {
          role: "user",
          content: `Generate a database schema for this app:
          
Original Idea: "${userIdea}"
Category: ${intent.category}
Purpose: ${intent.primaryPurpose}
Data to Manage: ${intent.dataToManage}
Key Features: ${intent.keyFeatures.join(', ')}

Create an optimal schema with 3-6 fields that capture the essential data.`
        }
      ],
      functions: [
        {
          name: "generate_database_schema",
          description: "Generate a database schema for the app",
          parameters: {
            type: "object",
            properties: {
              tableName: {
                type: "string",
                description: "Table name in snake_case"
              },
              description: {
                type: "string",
                description: "Brief description of what this table stores"
              },
              fields: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    label: { type: "string" },
                    type: { 
                      type: "string",
                      enum: ["text", "number", "date", "email", "tel", "url", "boolean"]
                    },
                    required: { type: "boolean" },
                    placeholder: { type: "string" },
                    validation: { type: "string" }
                  },
                  required: ["name", "label", "type", "required"]
                }
              }
            },
            required: ["tableName", "description", "fields"]
          }
        }
      ],
      function_call: { name: "generate_database_schema" },
      temperature: 0.2
    });

    const functionCall = response.choices[0]?.message?.function_call;
    if (!functionCall?.arguments) {
      throw new Error('No schema generation response received');
    }

    return JSON.parse(functionCall.arguments);
  }

  /**
   * Step 3: UI設定生成 - カテゴリに適したUI/UX
   */
  private async generateUI(intent: AppIntent, schema: GeneratedSchema): Promise<UIConfiguration> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a UI/UX expert. Generate optimal UI configurations for apps."
        },
        {
          role: "user",
          content: `Generate UI configuration for:
          
Category: ${intent.category}
Purpose: ${intent.primaryPurpose}
Target Users: ${intent.targetUsers.join(', ')}
Data Fields: ${schema.fields.map(f => f.name).join(', ')}

Create a modern, user-friendly interface design.`
        }
      ],
      functions: [
        {
          name: "generate_ui_configuration",
          description: "Generate UI configuration for the app",
          parameters: {
            type: "object",
            properties: {
              theme: {
                type: "object",
                properties: {
                  primaryColor: { type: "string" },
                  secondaryColor: { type: "string" },
                  backgroundColor: { type: "string" }
                },
                required: ["primaryColor", "secondaryColor", "backgroundColor"]
              },
              layout: {
                type: "string",
                enum: ["list", "grid", "dashboard", "form"],
                description: "Primary layout type"
              },
              components: {
                type: "array",
                items: { type: "string" },
                description: "UI components to include"
              },
              interactions: {
                type: "array", 
                items: { type: "string" },
                description: "User interaction patterns"
              }
            },
            required: ["theme", "layout", "components", "interactions"]
          }
        }
      ],
      function_call: { name: "generate_ui_configuration" },
      temperature: 0.4
    });

    const functionCall = response.choices[0]?.message?.function_call;
    if (!functionCall?.arguments) {
      throw new Error('No UI configuration response received');
    }

    return JSON.parse(functionCall.arguments);
  }

  /**
   * Step 4: コード生成 - 完全なReactアプリケーション
   */
  private async generateCode(intent: AppIntent, schema: GeneratedSchema, ui: UIConfiguration, userIdea: string): Promise<string> {
    const prompt = `Generate a complete React application for: "${userIdea}"

SPECIFICATIONS:
- Category: ${intent.category}
- Purpose: ${intent.primaryPurpose}
- Table: ${schema.tableName}
- Fields: ${schema.fields.map(f => `${f.name} (${f.type})`).join(', ')}
- Theme: ${ui.theme.primaryColor}
- Layout: ${ui.layout}

REQUIREMENTS:
1. Use Next.js 14 with TypeScript
2. Include shadcn/ui components
3. Implement full CRUD operations
4. Use the exact field structure provided
5. Apply the specified color theme
6. Include proper error handling
7. Make it responsive and accessible

Generate ONLY the main page component code.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert React developer. Generate production-ready React applications with modern best practices."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    const code = response.choices[0]?.message?.content;
    if (!code) {
      throw new Error('No code generation response received');
    }

    return code;
  }

  /**
   * 信頼度計算
   */
  private calculateConfidence(intent: AppIntent, schema: GeneratedSchema, ui: UIConfiguration): number {
    let confidence = 70; // Base confidence
    
    // 意図の明確性
    if (intent.keyFeatures.length >= 3) confidence += 10;
    if (intent.primaryPurpose.length > 20) confidence += 5;
    
    // スキーマの適切性
    if (schema.fields.length >= 3 && schema.fields.length <= 6) confidence += 10;
    
    // UI設定の完整性
    if (ui.components.length >= 3) confidence += 5;
    
    return Math.min(confidence, 100);
  }
}

// シングルトンインスタンス
export const universalGenerator = new UniversalAppGenerator();