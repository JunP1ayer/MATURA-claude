/**
 * Enhanced Code Generator with Gemini Consultation
 * 意図理解→機能実装の完全な連携システム
 */

import { GeminiClient } from '@/lib/gemini-client';
import { openai } from '@/lib/openai';
// Types previously from universal-app-generator
export interface AppIntent {
  purpose: string;
  target_users: string;
  key_features: string[];
  business_model?: string;
}

export interface GeneratedSchema {
  tableName: string;
  columns: Array<{
    name: string;
    type: string;
    nullable?: boolean;
    defaultValue?: any;
  }>;
}

export interface UIConfiguration {
  layout: string;
  theme: string;
  components: string[];
}

export interface CodeGenerationPlan {
  mainFeatures: string[];
  businessLogic: string[];
  userInteractions: string[];
  dataFlow: string[];
  validations: string[];
  errorHandling: string[];
}

export interface FunctionalCode {
  mainComponent: string;
  businessLogicFunctions: string[];
  utilityFunctions: string[];
  typeDefinitions: string;
  testCases: string[];
  documentation: string;
}

export class EnhancedCodeGenerator {
  private gemini: GeminiClient;

  constructor() {
    this.gemini = new GeminiClient();
  }

  /**
   * Geminiと相談しながら機能的なコードを生成
   */
  async generateFunctionalCode(
    intent: AppIntent,
    schema: GeneratedSchema,
    ui: UIConfiguration,
    userIdea: string
  ): Promise<FunctionalCode> {
    console.log('🤖 [ENHANCED-CODE] Starting Gemini-assisted code generation');

    // Step 1: Geminiでコード生成計画を立案
    const plan = await this.createCodeGenerationPlan(intent, schema, userIdea);
    console.log('✅ [ENHANCED-CODE] Generation plan created:', plan.mainFeatures.length, 'features');

    // Step 2: 意図に基づいた機能実装
    const functionalCode = await this.implementBusinessLogic(plan, intent, schema);
    console.log('✅ [ENHANCED-CODE] Business logic implemented');

    // Step 3: OpenAIで統合コンポーネント生成
    const mainComponent = await this.generateMainComponent(plan, intent, schema, ui, userIdea);
    console.log('✅ [ENHANCED-CODE] Main component generated');

    // Step 4: テストケース生成
    const testCases = await this.generateTestCases(plan, intent, schema);
    console.log('✅ [ENHANCED-CODE] Test cases generated');

    // Step 5: ドキュメント生成
    const documentation = await this.generateDocumentation(intent, schema, plan);
    console.log('✅ [ENHANCED-CODE] Documentation generated');

    return {
      mainComponent,
      businessLogicFunctions: functionalCode.businessLogic,
      utilityFunctions: functionalCode.utilities,
      typeDefinitions: functionalCode.types,
      testCases,
      documentation
    };
  }

  /**
   * Geminiでコード生成計画を立案
   */
  private async createCodeGenerationPlan(
    intent: AppIntent,
    schema: GeneratedSchema,
    userIdea: string
  ): Promise<CodeGenerationPlan> {
    const prompt = `あなたは上級ソフトウェアアーキテクトです。以下のアプリアイデアを分析し、完全に機能するコード生成計画を立ててください。

【アプリアイデア】
${userIdea}

【意図分析結果】
- カテゴリ: ${intent.category}
- 主目的: ${intent.primaryPurpose}
- ターゲットユーザー: ${intent.targetUsers.join(', ')}
- 主要機能: ${intent.keyFeatures.join(', ')}
- 管理データ: ${intent.dataToManage}

【データベース構造】
テーブル: ${schema.tableName}
フィールド: ${schema.fields.map(f => `${f.name}(${f.type})`).join(', ')}

以下の形式でJSON応答してください：
{
  "mainFeatures": ["具体的な機能1", "具体的な機能2", ...],
  "businessLogic": ["ビジネスロジック1", "ビジネスロジック2", ...],
  "userInteractions": ["ユーザー操作1", "ユーザー操作2", ...],
  "dataFlow": ["データフロー1", "データフロー2", ...],
  "validations": ["バリデーション1", "バリデーション2", ...],
  "errorHandling": ["エラーハンドリング1", "エラーハンドリング2", ...]
}

**重要**: ユーザーのアイデアの本質を完全に反映し、実用的で機能的なアプリになるよう詳細に計画してください。`;

    try {
      const response = await this.gemini.generateText({
        prompt,
        temperature: 0.3,
        maxTokens: 2000
      });

      if (!response.success || !response.data) {
        throw new Error('Gemini planning failed');
      }

      // JSON抽出と解析
      const jsonMatch = response.data.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('❌ [ENHANCED-CODE] Gemini planning failed:', error);
      
      // フォールバック計画
      return this.createFallbackPlan(intent, schema);
    }
  }

  /**
   * 意図に基づいたビジネスロジック実装
   */
  private async implementBusinessLogic(
    plan: CodeGenerationPlan,
    intent: AppIntent,
    schema: GeneratedSchema
  ): Promise<{ businessLogic: string[], utilities: string[], types: string }> {
    const businessLogicPrompt = `Generate TypeScript business logic functions for:

Main Features: ${plan.mainFeatures.join(', ')}
Business Logic: ${plan.businessLogic.join(', ')}
Data Validations: ${plan.validations.join(', ')}

Schema: ${schema.tableName} with fields: ${schema.fields.map(f => f.name).join(', ')}

Create practical, reusable functions that implement the core business logic.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert TypeScript developer. Generate clean, functional business logic code."
        },
        {
          role: "user",
          content: businessLogicPrompt
        }
      ],
      temperature: 0.2,
      max_tokens: 3000
    });

    const code = response.choices[0]?.message?.content || '';
    
    // コードを関数別に分離
    const businessLogic = this.extractFunctions(code, 'business');
    const utilities = this.extractFunctions(code, 'utility');
    const types = this.extractTypes(code);

    return { businessLogic, utilities, types };
  }

  /**
   * メインコンポーネント生成
   */
  private async generateMainComponent(
    plan: CodeGenerationPlan,
    intent: AppIntent,
    schema: GeneratedSchema,
    ui: UIConfiguration,
    userIdea: string
  ): Promise<string> {
    const componentPrompt = `Generate a complete React component for: "${userIdea}"

FUNCTIONAL REQUIREMENTS:
${plan.mainFeatures.map((feature, i) => `${i + 1}. ${feature}`).join('\n')}

USER INTERACTIONS:
${plan.userInteractions.map((interaction, i) => `${i + 1}. ${interaction}`).join('\n')}

DATA STRUCTURE:
- Table: ${schema.tableName}
- Fields: ${schema.fields.map(f => `${f.name} (${f.type}, ${f.required ? 'required' : 'optional'})`).join(', ')}

UI CONFIGURATION:
- Theme: ${ui.theme.primaryColor}
- Layout: ${ui.layout}
- Components: ${ui.components.join(', ')}

TECHNICAL REQUIREMENTS:
1. Use Next.js 14 with TypeScript
2. Implement ALL main features functionally
3. Include proper error handling and validation
4. Use shadcn/ui components
5. Apply the specified color theme
6. Make it fully responsive
7. Include loading states and user feedback
8. Implement proper CRUD operations with /api/crud/${schema.tableName}

Generate a complete, production-ready React component that fully implements the user's idea.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert React developer. Generate complete, functional React components that fully implement user requirements."
        },
        {
          role: "user",
          content: componentPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * テストケース生成
   */
  private async generateTestCases(
    plan: CodeGenerationPlan,
    intent: AppIntent,
    schema: GeneratedSchema
  ): Promise<string[]> {
    const testPrompt = `Generate comprehensive test cases for:

Features: ${plan.mainFeatures.join(', ')}
Business Logic: ${plan.businessLogic.join(', ')}
Data Schema: ${schema.tableName} with ${schema.fields.map(f => f.name).join(', ')}

Include:
1. Unit tests for business logic
2. Integration tests for API calls
3. UI interaction tests
4. Edge case tests
5. Error handling tests

Use Jest and React Testing Library format.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior QA engineer. Generate comprehensive test suites."
        },
        {
          role: "user",
          content: testPrompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2000
    });

    const testCode = response.choices[0]?.message?.content || '';
    return testCode.split('describe(').filter(test => test.trim().length > 0);
  }

  /**
   * ドキュメント生成
   */
  private async generateDocumentation(
    intent: AppIntent,
    schema: GeneratedSchema,
    plan: CodeGenerationPlan
  ): Promise<string> {
    return `# ${intent.primaryPurpose}

## 概要
${intent.primaryPurpose}を実現する${intent.category}カテゴリのアプリケーション

## ターゲットユーザー
${intent.targetUsers.join(', ')}

## 主要機能
${plan.mainFeatures.map((feature, i) => `${i + 1}. ${feature}`).join('\n')}

## データ構造
- テーブル: \`${schema.tableName}\`
- フィールド: ${schema.fields.map(f => `\`${f.name}\` (${f.type})`).join(', ')}

## API エンドポイント
- GET /api/crud/${schema.tableName} - データ一覧取得
- POST /api/crud/${schema.tableName} - データ作成
- PUT /api/crud/${schema.tableName} - データ更新
- DELETE /api/crud/${schema.tableName} - データ削除

## 使用方法
1. アプリケーションを起動
2. ${plan.userInteractions[0] || 'データを入力'}
3. ${plan.userInteractions[1] || '結果を確認'}

## 技術スタック
- Next.js 14
- TypeScript
- shadcn/ui
- Tailwind CSS`;
  }

  // ヘルパー関数
  private createFallbackPlan(intent: AppIntent, schema: GeneratedSchema): CodeGenerationPlan {
    return {
      mainFeatures: intent.keyFeatures,
      businessLogic: [`${intent.dataToManage}の管理`, 'データバリデーション', '検索・フィルター'],
      userInteractions: ['データ入力', '一覧表示', '編集・削除'],
      dataFlow: ['フォーム送信', 'API通信', 'データ表示'],
      validations: ['必須項目チェック', 'データ形式検証'],
      errorHandling: ['API エラー処理', 'ユーザー通知']
    };
  }

  private extractFunctions(code: string, type: 'business' | 'utility'): string[] {
    // 関数を抽出するロジック（簡略化）
    const functions = code.match(/function\s+\w+.*?\{[\s\S]*?\}/g) || [];
    return functions.filter((fn: string) => 
      type === 'business' ? fn.includes('business') || fn.includes('logic') : 
      fn.includes('util') || fn.includes('helper')
    );
  }

  private extractTypes(code: string): string {
    const types = code.match(/interface\s+\w+.*?\{[\s\S]*?\}/g) || [];
    return types.join('\n\n');
  }
}

export const enhancedCodeGenerator = new EnhancedCodeGenerator();