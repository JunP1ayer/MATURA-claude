/**
 * OpenAI GPT-4 Code Generator
 * Specialized for generating high-quality React components from Gemini requirements
 */

import OpenAI from 'openai';

interface CodeGenerationRequest {
  appRequirements: any;
  style?: 'minimal' | 'professional' | 'creative';
  framework?: 'react' | 'next';
}

interface CodeGenerationResponse {
  success: boolean;
  generatedCode?: string;
  error?: string;
  metadata?: {
    model: string;
    tokensUsed: number;
    processingTime: number;
  };
}

export class OpenAICodeGenerator {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not found in environment variables');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  /**
   * Generate React code from Gemini-analyzed requirements
   */
  async generateFromRequirements(
    request: CodeGenerationRequest
  ): Promise<CodeGenerationResponse> {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: 'OpenAI API key not configured'
      };
    }

    const startTime = Date.now();
    
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(request);

      console.log('🤖 Generating code with GPT-4...');
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1, // Low temperature for consistent code generation
        max_tokens: 4000,
        top_p: 0.9,
      });

      const generatedCode = completion.choices[0]?.message?.content;
      
      if (!generatedCode) {
        return {
          success: false,
          error: 'No code generated from GPT-4'
        };
      }

      const processingTime = Date.now() - startTime;
      console.log(`✅ GPT-4 code generation completed in ${processingTime}ms`);

      return {
        success: true,
        generatedCode,
        metadata: {
          model: 'gpt-4',
          tokensUsed: completion.usage?.total_tokens || 0,
          processingTime
        }
      };

    } catch (error) {
      console.error('💥 GPT-4 code generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private buildSystemPrompt(): string {
    return `You are an expert React/TypeScript developer.
Generate COMPLETE, working React components.
Use shadcn/ui, Tailwind CSS, and modern React hooks.
Return ONLY code, no explanations.`;
  }

  private buildUserPrompt(request: CodeGenerationRequest): string {
    const { appRequirements } = request;
    
    // Extract field names for EXACT usage instruction
    const fieldNames = appRequirements.dataModel?.columns?.map(col => `"${col.name}"`).join(', ') || '';
    
    // Extract terminology for EXACT usage instruction
    const terminology = appRequirements.uiRequirements?.terminology || {};
    const terminologyList = [
      terminology.addAction,
      terminology.updateAction, 
      terminology.deleteAction
    ].filter(Boolean).map(term => `  - "${term}"`).join('\n');
    
    return `Generate a React component strictly based on these requirements:

## App Requirements
${JSON.stringify(appRequirements, null, 2)}

## Implementation Guidelines:
- Use EXACT field names from the JSON: ${fieldNames}
- Use EXACT UI terminology provided:${terminologyList ? '\n' + terminologyList : '\n  - (Use provided terminology)'}
- Component name: ${this.getComponentName(appRequirements)}
- App title: "${appRequirements.uiRequirements?.layout?.pageTitle || 'Generated App'}"
- Layout must strictly follow provided instructions (e.g., ${appRequirements.uiRequirements?.layout?.addFormPosition === 'sidebar' ? 'form in sidebar, list in main area' : 'follow layout instructions'})
- Implement FULL CRUD operations including create, read, update, delete
- Clearly handle loading states (spinner) and errors (user-friendly messages)

## 🚫 Prohibited (Do NOT do these):
- Do not fallback to any generic CRUD template.
- Do not ignore UX and UI instructions provided.
- Do not skip implementation of update/delete operations.
- Do not omit loading/error handling.

Generate the complete React component code now:`;
  }

  private getComponentName(appRequirements: any): string {
    const domain = appRequirements.appOverview?.domain;
    const tableName = appRequirements.dataModel?.tableName;
    
    if (domain) {
      return this.toPascalCase(domain.replace(/_/g, '')) + 'App';
    }
    
    if (tableName) {
      return this.toPascalCase(tableName.replace(/s$/, '')) + 'Manager';
    }
    
    return 'GeneratedApp';
  }

  private toPascalCase(str: string): string {
    return str.replace(/(?:^|_)([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}

export const openaiCodeGenerator = new OpenAICodeGenerator();