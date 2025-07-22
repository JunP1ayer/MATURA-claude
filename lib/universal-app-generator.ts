/**
 * Universal App Generator - LLMファーストアーキテクチャ
 * どんなアイデアでも理解し、適切なアプリを生成する
 */

import { openai } from '@/lib/openai';
import { enhancedCodeGenerator } from './enhanced-code-generator';
import { figmaEnhancedUIGenerator } from './figma-enhanced-ui-generator';
import { robustLLMSystem } from './robust-llm-system';

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
   * 強化されたLLMシステム、Figma連携、高品質コード生成を統合
   */
  async generateApp(userIdea: string): Promise<GeneratedApp> {
    console.log('🚀 [UNIVERSAL] Starting enhanced universal app generation for:', userIdea);
    
    // システムヘルスチェック
    const health = await robustLLMSystem.healthCheck();
    console.log('🏥 [UNIVERSAL] System health:', health.overall ? 'Healthy' : 'Degraded');
    
    try {
      // Step 1: 意図理解（創造性強化版）
      const intentResponse = await robustLLMSystem.callFunctionWithFallback<AppIntent>(
        'analyze_app_intent',
        this.getIntentAnalysisSchema(),
        this.buildCreativeIntentPrompt(userIdea),
        'You are a creative app analyst who thinks outside the box. Analyze diverse app ideas with imagination and avoid defaulting to productivity. Each app has unique characteristics that should be captured.'
      );
      
      if (!intentResponse.success || !intentResponse.data) {
        throw new Error('Intent analysis failed completely');
      }
      
      const intent = intentResponse.data;
      
      // Ensure targetUsers is always an array
      if (typeof intent.targetUsers === 'string') {
        intent.targetUsers = [intent.targetUsers];
      } else if (!Array.isArray(intent.targetUsers)) {
        intent.targetUsers = ['一般ユーザー'];
      }
      
      // Ensure keyFeatures is always an array
      if (typeof intent.keyFeatures === 'string') {
        intent.keyFeatures = [intent.keyFeatures];
      } else if (!Array.isArray(intent.keyFeatures)) {
        intent.keyFeatures = ['基本機能'];
      }
      
      console.log('✅ [UNIVERSAL] Intent analyzed:', intent.category, `(confidence: ${intentResponse.confidence})`);
      
      // Step 2: スキーマ生成（創造性強化版）
      const schemaResponse = await robustLLMSystem.callFunctionWithFallback<GeneratedSchema>(
        'generate_database_schema',
        this.getSchemaGenerationSchema(),
        this.buildCreativeSchemaPrompt(intent, userIdea),
        'You are a creative database architect. Design unique and specialized schemas that perfectly match the app category and purpose. Avoid generic productivity patterns and embrace the specific needs of each domain.'
      );
      
      if (!schemaResponse.success || !schemaResponse.data) {
        throw new Error('Schema generation failed completely');
      }
      
      const schema = schemaResponse.data;
      
      // Ensure schema.fields is always an array
      if (!Array.isArray(schema.fields)) {
        schema.fields = [
          { name: 'id', label: 'ID', type: 'text', required: true },
          { name: 'title', label: 'タイトル', type: 'text', required: true },
          { name: 'description', label: '説明', type: 'text', required: false },
          { name: 'created_at', label: '作成日', type: 'date', required: true }
        ];
      }
      
      console.log('✅ [UNIVERSAL] Schema generated:', schema.tableName, `(confidence: ${schemaResponse.confidence})`);
      
      // Step 3: UI設定生成（Figma連携強化版）
      const ui = await figmaEnhancedUIGenerator.generateEnhancedUI(intent, schema, userIdea);
      console.log('✅ [UNIVERSAL] Enhanced UI configured with Figma integration');
      
      // Step 4: コード生成（機能性強化版）
      const functionalCode = await enhancedCodeGenerator.generateFunctionalCode(intent, schema, ui, userIdea);
      console.log('✅ [UNIVERSAL] Functional code generated with business logic');
      
      // 総合信頼度計算
      const confidence = this.calculateEnhancedConfidence(
        intentResponse,
        schemaResponse,
        ui,
        functionalCode
      );
      
      return {
        intent,
        schema,
        ui,
        code: functionalCode.mainComponent,
        confidence
      };
      
    } catch (error) {
      console.error('❌ [UNIVERSAL] Enhanced generation failed:', error);
      throw error;
    }
  }

  /**
   * Step 1: 意図理解 - OpenAI Tools APIで構造化
   */
  private async analyzeIntent(userIdea: string): Promise<AppIntent> {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      tools: [
        {
          type: "function",
          function: {
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
        }
      ],
      tool_choice: { type: "function", function: { name: "analyze_app_intent" } },
      temperature: 0.3
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('No tool call response received');
    }

    return JSON.parse(toolCall.function.arguments);
  }

  /**
   * Step 2: スキーマ生成 - 意図に基づいた適切なデータ構造
   */
  private async generateSchema(intent: AppIntent, userIdea: string): Promise<GeneratedSchema> {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      tools: [
        {
          type: "function",
          function: {
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
        }
      ],
      tool_choice: { type: "function", function: { name: "generate_database_schema" } },
      temperature: 0.2
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('No schema generation response received');
    }

    return JSON.parse(toolCall.function.arguments);
  }

  /**
   * Step 3: UI設定生成 - カテゴリに適したUI/UX
   */
  private async generateUI(intent: AppIntent, schema: GeneratedSchema): Promise<UIConfiguration> {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      tools: [
        {
          type: "function",
          function: {
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
        }
      ],
      tool_choice: { type: "function", function: { name: "generate_ui_configuration" } },
      temperature: 0.4
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('No UI configuration response received');
    }

    return JSON.parse(toolCall.function.arguments);
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
- UI Theme: ${ui.theme.primaryColor} primary, ${ui.layout} layout
- Components: ${ui.components.join(', ')}

REQUIREMENTS:
1. Use React with TypeScript
2. Include all CRUD operations
3. Responsive design with Tailwind CSS
4. Form validation and error handling
5. Modern UI components and interactions
6. Local state management with useState/useReducer
7. Professional code structure and comments

Generate a single, complete React component that implements all functionality.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert React developer. Generate high-quality, production-ready React applications." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const code = response.choices[0]?.message?.content;
    if (!code) {
      throw new Error('No code generation response received');
    }

    return code;
  }

  /**
   * スキーマ定義メソッド
   */
  private getIntentAnalysisSchema() {
    return {
      description: "Extract structured information about the user's app idea",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["productivity", "finance", "health", "social", "ecommerce", "creative", "utility", "education", "entertainment"],
            description: "Primary category of the app - think creatively beyond productivity"
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
    };
  }

  private getSchemaGenerationSchema() {
    return {
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
    };
  }

  private buildCreativeIntentPrompt(userIdea: string): string {
    return `Analyze this unique app idea with creativity and precision:

"${userIdea}"

IMPORTANT GUIDELINES:
- DO NOT default to "productivity" unless it's clearly a productivity tool
- Look for specific domain characteristics (gaming -> entertainment, recipes -> creative, etc.)
- Consider the unique aspects that make this app special
- Think about who would ACTUALLY use this app and why
- Identify the true category based on the primary use case

Analyze deeply and categorize accurately.`;
  }

  private buildCreativeSchemaPrompt(intent: AppIntent, userIdea: string): string {
    const categoryExamples = {
      entertainment: '(e.g., high_score, player_name, game_level, achievements)',
      creative: '(e.g., recipe_name, ingredients, cooking_time, difficulty)',
      education: '(e.g., course_name, lesson_progress, quiz_score, completion_date)',
      health: '(e.g., symptom, severity, date_recorded, medication)',
      social: '(e.g., member_name, group_role, join_date, activity_level)',
      finance: '(e.g., transaction_amount, category, account, budget_goal)',
      ecommerce: '(e.g., product_name, price, inventory, customer_rating)',
      utility: '(e.g., tool_name, usage_count, configuration, last_used)'
    };
    
    const examples = categoryExamples[intent.category] || '(e.g., specialized fields for this domain)';
    
    return `Generate a specialized database schema for this ${intent.category} app:
          
Original Idea: "${userIdea}"
Category: ${intent.category}
Purpose: ${intent.primaryPurpose}
Data to Manage: ${intent.dataToManage}
Key Features: ${intent.keyFeatures.join(', ')}

Create a DOMAIN-SPECIFIC schema with 4-6 fields that are tailored to ${intent.category} apps ${examples}.

DO NOT use generic productivity fields. Make it specific to the ${intent.category} domain.`;
  }

  private calculateEnhancedConfidence(
    intentResponse: any,
    schemaResponse: any,
    ui: any,
    functionalCode: any
  ): number {
    let confidence = 0.7; // Base confidence
    
    if (intentResponse.confidence > 0.8) confidence += 0.1;
    if (schemaResponse.confidence > 0.8) confidence += 0.1;
    if (ui.figmaDesignSystem) confidence += 0.05;
    if (functionalCode.businessLogicFunctions?.length > 0) confidence += 0.05;
    
    return Math.min(confidence, 1.0);
  }
}

// シングルトンインスタンス
export const universalGenerator = new UniversalAppGenerator();