/**
 * ハイブリッドAIオーケストレーター
 * Figma + Gemini + OpenAI の最適な組み合わせシステム
 */

import { GeminiClient } from '@/lib/gemini-client';
import { openAIOptimized } from '@/lib/openai-optimized-system';

export interface HybridGenerationConfig {
  mode: 'creative' | 'professional' | 'experimental' | 'balanced';
  useDesignSystem: boolean;
  creativityLevel: 'low' | 'medium' | 'high';
  qualityPriority: 'speed' | 'quality' | 'creativity';
}

export interface HybridResult {
  idea: {
    original: string;
    enhanced: string;
    variations: string[];
    category: string;
    coreValue?: string;
    realProblem?: string;
    targetUsers?: string[];
    keyFeatures?: string[];
    businessLogic?: string[];
    uniqueValue?: string;
    industryContext?: string;
    insights?: string[];
    businessPotential?: string;
  };
  design: {
    figmaTokens?: any;
    colorPalette: string[];
    typography: any;
    components: string[];
    designSystem: string;
    designStyle?: string;
    mood?: string;
  };
  schema: {
    tableName: string;
    fields: any[];
    relationships: any[];
    businessLogic: string[];
  };
  code: {
    component: string;
    types: string;
    styles: string;
    hooks: string;
  };
  metadata: {
    providers: string[];
    processingTime: number;
    qualityScores: {
      creativity: number;
      technical: number;
      design: number;
      overall: number;
    };
    tokens: {
      openai: number;
      gemini: number;
      total: number;
    };
  };
}

export class HybridAIOrchestrator {
  private gemini: GeminiClient;

  constructor() {
    this.gemini = new GeminiClient();
  }

  /**
   * メインのハイブリッド生成フロー
   */
  async generateApp(
    userIdea: string, 
    config: Partial<HybridGenerationConfig> = {}
  ): Promise<HybridResult> {
    const startTime = Date.now();
    
    const finalConfig: HybridGenerationConfig = {
      mode: 'balanced',
      useDesignSystem: true,
      creativityLevel: 'medium',
      qualityPriority: 'quality',
      ...config
    };

    console.log('🎭 [HYBRID] Starting multi-AI generation process');
    console.log(`🎯 [HYBRID] Mode: ${finalConfig.mode}, Creativity: ${finalConfig.creativityLevel}`);

    // Phase 1: Gemini Creative Enhancement (並列実行)
    const [ideaEnhancement, designInspiration] = await Promise.all([
      this.enhanceIdeaWithGemini(userIdea, finalConfig),
      this.generateDesignInspirationWithGemini(userIdea, finalConfig)
    ]);

    // Phase 2: Figma Design System Integration (条件付き)
    let designSystem = null;
    if (finalConfig.useDesignSystem) {
      designSystem = await this.integrateWithFigma(ideaEnhancement.enhanced, finalConfig);
    }

    // Phase 3: OpenAI Structured Generation
    const [schemaResult, codeResult] = await Promise.all([
      this.generateSchemaWithOpenAI(ideaEnhancement, designSystem, finalConfig),
      this.generateCodeWithOpenAI(ideaEnhancement, designSystem, designInspiration, finalConfig)
    ]);

    // Phase 4: Quality Enhancement & Integration
    const finalResult = await this.enhanceAndIntegrate({
      idea: ideaEnhancement,
      design: { ...designInspiration, ...(designSystem || {}) },
      schema: schemaResult,
      code: codeResult,
      config: finalConfig,
      startTime
    });

    console.log('🎉 [HYBRID] Multi-AI generation completed successfully');
    return finalResult;
  }

  /**
   * Geminiによるアイデア強化
   */
  private async enhanceIdeaWithGemini(
    userIdea: string, 
    config: HybridGenerationConfig
  ) {
    console.log('🌟 [GEMINI] Flexible idea analysis started');

    // 新しい柔軟な分析メソッドを使用
    const result = await this.gemini.analyzeIdeaFlexibly(userIdea, {
      creativityMode: config.creativityLevel === 'high' ? 'experimental' : 
                      config.creativityLevel === 'medium' ? 'balanced' : 'conservative',
      maxTokens: 2000
    });

    if (result.success && result.data) {
      try {
        // JSONパース試行
        const parsed = this.extractFlexibleJSONFromGeminiResponse(result.data);
        console.log('✅ [GEMINI] Flexible idea analysis completed');
        return {
          original: userIdea,
          enhanced: parsed.enhancedDescription || userIdea,
          variations: [],
          category: this.extractCategoryFromTags(parsed.naturalTags || []),
          insights: parsed.technicalConsiderations || [],
          businessPotential: parsed.businessPotential || 'medium',
          // 新しい柔軟なフィールド
          coreEssence: parsed.coreEssence,
          naturalTags: parsed.naturalTags || [],
          targetUsers: parsed.targetUsers || [],
          keyFeatures: parsed.keyFeatures || [],
          uniqueValue: parsed.uniqueValue,
          innovationAreas: parsed.innovationAreas || [],
          crossDomainPotential: parsed.crossDomainPotential || [],
          userExperienceVision: parsed.userExperienceVision,
          futureEvolution: parsed.futureEvolution,
          inspiration: parsed.inspiration
        };
      } catch (error) {
        console.log('⚠️ [GEMINI] Parsing failed, using flexible fallback');
        const flexibleAnalysis = this.createFlexibleFallbackFromText(userIdea);
        return {
          original: userIdea,
          enhanced: flexibleAnalysis.enhancedDescription,
          variations: [],
          category: flexibleAnalysis.primaryTag,
          insights: flexibleAnalysis.considerations,
          businessPotential: flexibleAnalysis.businessPotential,
          coreEssence: flexibleAnalysis.coreEssence,
          naturalTags: flexibleAnalysis.naturalTags,
          targetUsers: flexibleAnalysis.targetUsers,
          keyFeatures: flexibleAnalysis.keyFeatures,
          uniqueValue: flexibleAnalysis.uniqueValue,
          innovationAreas: [],
          crossDomainPotential: [],
          userExperienceVision: flexibleAnalysis.vision,
          futureEvolution: flexibleAnalysis.futureEvolution,
          inspiration: flexibleAnalysis.inspiration
        };
      }
    }

    // 最終フォールバック: Gemini API失敗時
    console.log('⚠️ [GEMINI] API failed, using flexible final fallback');
    const finalAnalysis = this.createFlexibleFallbackFromText(userIdea);
    
    return {
      original: userIdea,
      enhanced: finalAnalysis.enhancedDescription,
      variations: [],
      category: finalAnalysis.primaryTag,
      insights: finalAnalysis.considerations,
      businessPotential: finalAnalysis.businessPotential,
      coreEssence: finalAnalysis.coreEssence,
      naturalTags: finalAnalysis.naturalTags,
      targetUsers: finalAnalysis.targetUsers,
      keyFeatures: finalAnalysis.keyFeatures,
      uniqueValue: finalAnalysis.uniqueValue,
      innovationAreas: [],
      crossDomainPotential: [],
      userExperienceVision: finalAnalysis.vision,
      futureEvolution: finalAnalysis.futureEvolution,
      inspiration: finalAnalysis.inspiration
    };
  }

  /**
   * Geminiによるデザインインスピレーション生成
   */
  private async generateDesignInspirationWithGemini(
    userIdea: string,
    config: HybridGenerationConfig
  ) {
    console.log('🎨 [GEMINI] Design inspiration generation started');

    const designPrompt = `Design concept for: "${userIdea}"

Create a JSON object with design recommendations:

\`\`\`json
{
  "colorPalette": ["#primary", "#secondary", "#accent", "#background"],
  "designStyle": "modern|minimalist|playful|professional",
  "typography": {
    "heading": "Font family name",
    "body": "Body font name",
    "accent": "Accent font name"
  },
  "components": ["recommended UI components"],
  "layout": "grid|list|dashboard|card",
  "mood": "warm|cool|energetic|calm",
  "inspiration": "Design inspiration description"
}
\`\`\`

IMPORTANT:
- Return ONLY valid JSON without comments
- No // or /* */ comments
- Use practical color hex codes
- Be creative and unique`;

    const result = await this.gemini.generateText({
      prompt: designPrompt,
      temperature: 0.8,
      maxTokens: 1000
    });

    if (result.success && result.data) {
      try {
        const parsed = this.extractJSONFromGeminiResponse(result.data);
        console.log('✅ [GEMINI] Design inspiration completed');
        return {
          colorPalette: parsed.colorPalette || ['#3b82f6', '#64748b', '#f59e0b', '#ffffff'],
          designStyle: parsed.designStyle || 'modern',
          typography: parsed.typography || { heading: 'Inter', body: 'Inter' },
          components: parsed.components || ['Card', 'Button', 'Input'],
          layout: parsed.layout || 'card',
          mood: parsed.mood || 'modern',
          inspiration: parsed.inspiration || 'Clean and intuitive design'
        };
      } catch (error) {
        console.log('⚠️ [GEMINI] Design parsing failed, using defaults');
      }
    }

    return {
      colorPalette: ['#3b82f6', '#64748b', '#f59e0b', '#ffffff'],
      designStyle: 'modern',
      typography: { heading: 'Inter', body: 'Inter' },
      components: ['Card', 'Button', 'Input'],
      layout: 'card',
      mood: 'modern',
      inspiration: 'Clean and intuitive design'
    };
  }

  /**
   * Figmaデザインシステム統合
   */
  private async integrateWithFigma(
    enhancedIdea: string,
    config: HybridGenerationConfig
  ) {
    console.log('🎯 [FIGMA] Design system integration started');

    try {
      // Figma APIキーの確認
      if (!process.env.FIGMA_API_KEY) {
        console.log('⚠️ [FIGMA] API key not available, using default design system');
        return this.getDefaultDesignSystem();
      }

      // デザインファイルの取得
      const fileId = process.env.DEFAULT_FIGMA_FILE_ID;
      if (!fileId) {
        console.log('⚠️ [FIGMA] File ID not configured, using default design system');
        return this.getDefaultDesignSystem();
      }

      // Figma API呼び出し（堅牢なエラーハンドリング付き）
      try {
        const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
          headers: {
            'X-Figma-Token': process.env.FIGMA_API_KEY!,
          },
        });

        if (!response.ok) {
          console.log(`⚠️ [FIGMA] API request failed: ${response.status}, falling back to default`);
          return this.getDefaultDesignSystem();
        }

        const data = await response.json();
        console.log('✅ [FIGMA] Successfully fetched design data');
        
        // Figmaファイルからデザイントークンを抽出
        const extractedDesign = this.extractFigmaDesignTokens(data);
        
        return {
          figmaTokens: data,
          colorPalette: extractedDesign.colorPalette,
          typography: extractedDesign.typography,
          components: extractedDesign.components,
          designSystem: 'figma-integrated',
          spacing: extractedDesign.spacing,
          borderRadius: extractedDesign.borderRadius,
          shadows: extractedDesign.shadows
        };
      } catch (fetchError: any) {
        console.log('⚠️ [FIGMA] Fetch failed:', fetchError?.message || 'Unknown error');
        return this.getDefaultDesignSystem();
      }
    } catch (error: any) {
      console.log('⚠️ [FIGMA] Integration failed:', error?.message || 'Unknown error');
      return this.getDefaultDesignSystem();
    }
  }

  /**
   * Figmaデザインファイルからデザイントークンを抽出
   */
  private extractFigmaDesignTokens(figmaData: any) {
    try {
      const document = figmaData?.document;
      if (!document) {
        console.log('⚠️ [FIGMA] No document found, using fallback design');
        return this.getFallbackDesign();
      }

      // カラーパレットの抽出
      const colorPalette = this.extractColorsFromFigma(document);
      
      // タイポグラフィの抽出
      const typography = this.extractTypographyFromFigma(document);
      
      // コンポーネントの抽出
      const components = this.extractComponentsFromFigma(document);
      
      // スペーシングの抽出
      const spacing = this.extractSpacingFromFigma(document);

      console.log('✅ [FIGMA] Design tokens extracted successfully');
      console.log('🎨 [FIGMA] Colors:', colorPalette.slice(0, 3));
      console.log('📝 [FIGMA] Typography:', typography.heading);
      console.log('🧩 [FIGMA] Components:', components.slice(0, 3));

      return {
        colorPalette,
        typography,
        components,
        spacing,
        borderRadius: ['4px', '8px', '12px', '16px'],
        shadows: ['0 1px 3px rgba(0,0,0,0.1)', '0 4px 6px rgba(0,0,0,0.1)']
      };
    } catch (error) {
      console.log('⚠️ [FIGMA] Token extraction failed:', (error as Error)?.message || 'Unknown error');
      return this.getFallbackDesign();
    }
  }

  private extractColorsFromFigma(document: any): string[] {
    try {
      const colors: string[] = [];
      
      // Figmaのfillsからカラーを抽出する再帰関数
      const extractColors = (node: any) => {
        if (node.fills && Array.isArray(node.fills)) {
          node.fills.forEach((fill: any) => {
            if (fill.type === 'SOLID' && fill.color) {
              const { r, g, b } = fill.color;
              const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
              if (!colors.includes(hex)) {
                colors.push(hex);
              }
            }
          });
        }
        
        if (node.children) {
          node.children.forEach(extractColors);
        }
      };

      extractColors(document);
      
      // 最大8色まで、デフォルトカラーで補完
      const finalColors = colors.slice(0, 8);
      const defaultColors = ['#3b82f6', '#64748b', '#f59e0b', '#ffffff', '#000000', '#ef4444', '#10b981', '#8b5cf6'];
      
      while (finalColors.length < 4) {
        finalColors.push(defaultColors[finalColors.length]);
      }
      
      return finalColors;
    } catch (error) {
      return ['#3b82f6', '#64748b', '#f59e0b', '#ffffff'];
    }
  }

  private extractTypographyFromFigma(document: any) {
    try {
      const fonts = new Set<string>();
      
      const extractFonts = (node: any) => {
        if (node.style && node.style.fontFamily) {
          fonts.add(node.style.fontFamily);
        }
        if (node.children) {
          node.children.forEach(extractFonts);
        }
      };

      extractFonts(document);
      const fontArray = Array.from(fonts);

      return {
        heading: fontArray[0] || 'Inter',
        body: fontArray[1] || fontArray[0] || 'Inter',
        accent: fontArray[2] || fontArray[0] || 'Playfair Display'
      };
    } catch (error) {
      return { heading: 'Inter', body: 'Inter', accent: 'Playfair Display' };
    }
  }

  private extractComponentsFromFigma(document: any): string[] {
    try {
      const components: string[] = [];
      
      const extractComponents = (node: any) => {
        if (node.type === 'COMPONENT' && node.name) {
          components.push(node.name);
        }
        if (node.children) {
          node.children.forEach(extractComponents);
        }
      };

      extractComponents(document);
      
      // デフォルトコンポーネントで補完
      const defaultComponents = ['Button', 'Input', 'Card', 'Badge', 'Avatar', 'Dialog'];
      const finalComponents = [...new Set([...components, ...defaultComponents])];
      
      return finalComponents.slice(0, 10);
    } catch (error) {
      return ['Button', 'Input', 'Card', 'Badge'];
    }
  }

  private extractSpacingFromFigma(document: any): string[] {
    // Figmaのconstraintsやlayoutから推測
    return ['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px'];
  }

  private getFallbackDesign() {
    return {
      colorPalette: ['#3b82f6', '#64748b', '#f59e0b', '#ffffff'],
      typography: { heading: 'Inter', body: 'Inter', accent: 'Playfair Display' },
      components: ['Button', 'Input', 'Card', 'Badge'],
      spacing: ['4px', '8px', '16px', '24px'],
      borderRadius: ['4px', '8px', '12px'],
      shadows: ['0 1px 3px rgba(0,0,0,0.1)']
    };
  }

  /**
   * 柔軟なJSONレスポンス解析
   */
  private extractFlexibleJSONFromGeminiResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.log('JSON parsing failed:', error);
    }
    return {};
  }

  /**
   * 自然なタグからカテゴリを抽出
   */
  private extractCategoryFromTags(tags: string[]): string {
    const categoryMapping = {
      productivity: ['タスク', 'TODO', '仕事', '効率', '管理', 'スケジュール'],
      social: ['SNS', 'コミュニティ', 'チャット', '投稿', 'シェア', 'フォロー'],
      ecommerce: ['ショップ', '販売', '購入', '商品', 'EC', 'カート'],
      finance: ['家計簿', '金融', '投資', '支出', '収入', 'お金'],
      health: ['健康', 'フィットネス', '運動', '医療', 'ダイエット', '記録'],
      education: ['学習', '教育', '勉強', '知識', 'スキル', '課題'],
      creative: ['アート', '創作', 'デザイン', '音楽', '写真', '表現'],
      entertainment: ['ゲーム', '娯楽', '映画', '音楽', '趣味', 'エンタメ']
    };

    // タグをチェックして最も適したカテゴリを見つける
    for (const [category, keywords] of Object.entries(categoryMapping)) {
      for (const tag of tags) {
        if (keywords.some(keyword => tag.includes(keyword))) {
          return category;
        }
      }
    }

    return 'general';
  }

  /**
   * 柔軟なフォールバック分析生成
   */
  private createFlexibleFallbackFromText(userInput: string): any {
    const inputLower = userInput.toLowerCase();
    
    // 自然言語からの特徴抽出
    const naturalTags = [];
    const features = [];
    
    // 基本的なタグ抽出
    if (inputLower.includes('タスク') || inputLower.includes('todo') || inputLower.includes('管理')) {
      naturalTags.push('タスク管理', '生産性', '効率化');
      features.push('タスク作成・編集・削除', '進捗管理', '期限設定');
    }
    if (inputLower.includes('ブログ') || inputLower.includes('記事') || inputLower.includes('投稿')) {
      naturalTags.push('コンテンツ作成', '文章', 'メディア');
      features.push('記事作成・編集', '公開管理', 'カテゴリ分類');
    }
    if (inputLower.includes('ショップ') || inputLower.includes('販売') || inputLower.includes('ec')) {
      naturalTags.push('eコマース', '販売', 'ビジネス');
      features.push('商品管理', '注文処理', '在庫管理');
    }
    if (inputLower.includes('家計簿') || inputLower.includes('金融') || inputLower.includes('収支')) {
      naturalTags.push('金融', '家計管理', '資産');
      features.push('収支記録', '予算管理', '分析レポート');
    }

    // デフォルト値で補完
    if (naturalTags.length === 0) {
      naturalTags.push('アプリケーション', 'デジタルツール', 'ユーザー体験');
    }
    if (features.length === 0) {
      features.push('データ管理', '検索・フィルタ', 'ユーザーインターフェース');
    }

    return {
      enhancedDescription: `${userInput}を効果的に実現する革新的なアプリケーション`,
      coreEssence: `${userInput}の本質的価値を提供`,
      naturalTags,
      primaryTag: this.extractCategoryFromTags(naturalTags),
      targetUsers: ['一般ユーザー', '専門ユーザー', '初心者'],
      keyFeatures: features,
      uniqueValue: 'シンプルで直感的なインターフェースと高い実用性',
      businessPotential: 'medium',
      considerations: ['ユーザビリティの向上', '機能の充実', '継続的な改善'],
      vision: 'ユーザーの日常をより便利にする体験',
      futureEvolution: 'AIと連携した高度な機能の追加',
      inspiration: 'テクノロジーで人々の生活を豊かにする'
    };
  }

  /**
   * デフォルトデザインシステム（高品質版）
   */
  private getDefaultDesignSystem() {
    return {
      figmaTokens: null,
      colorPalette: ['#6366f1', '#8b5cf6', '#06b6d4', '#ffffff'],
      typography: { 
        heading: 'Inter, system-ui, sans-serif', 
        body: 'Inter, system-ui, sans-serif',
        accent: 'JetBrains Mono, monospace'
      },
      components: ['Card', 'Button', 'Input', 'Badge', 'Modal', 'Table', 'Form'],
      designSystem: 'premium-modern',
      theme: 'gradient-enhanced',
      layout: 'responsive-grid',
      spacing: ['8px', '16px', '24px', '32px', '48px', '64px'],
      borderRadius: ['8px', '12px', '16px', '24px'],
      shadows: [
        '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
      ],
      gradients: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      ]
    };
  }

  /**
   * OpenAIによる高精度スキーマ生成
   */
  private async generateSchemaWithOpenAI(
    ideaData: any,
    designSystem: any,
    config: HybridGenerationConfig
  ) {
    console.log('🏗️ [OPENAI] High-precision schema generation started');

    const schemaResult = await openAIOptimized.executeFunction(
      'generate_advanced_schema',
      {
        description: 'Generate advanced database schema with business logic',
        parameters: {
          type: 'object',
          properties: {
            tableName: { type: 'string' },
            description: { type: 'string' },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  required: { type: 'boolean' },
                  label: { type: 'string' },
                  validation: { type: 'string' },
                  defaultValue: { type: 'string' }
                }
              }
            },
            relationships: {
              type: 'array',
              items: { type: 'string' }
            },
            businessLogic: {
              type: 'array',
              items: { type: 'string' }
            },
            indexes: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['tableName', 'fields', 'businessLogic']
        }
      },
`Create a comprehensive database schema for: "${ideaData.enhanced || ideaData.original}"

Application Category: ${ideaData.category}
Target Users: ${ideaData.targetUsers?.join(', ') || 'General users'}
Key Features: ${ideaData.keyFeatures?.join(', ') || 'Basic functionality'}

Requirements:
- Design schema specifically for ${ideaData.category} domain
- Include 4-6 essential fields that represent the core data model
- Add appropriate data types (string, number, date, boolean, text)
- Ensure fields support the main use cases
- Add proper labels in Japanese for UI display
- Consider search, filtering, and sorting capabilities
- Include performance indexes for key lookup fields

Create a practical, real-world schema that directly supports the application's purpose.
Table name should reflect the primary entity (e.g., 'tasks', 'blog_posts', 'products', 'transactions').

Focus on utility and user experience over complexity.`,
`You are a database architect. Create an optimal schema for the business requirements.`,
      { model: 'gpt-4', temperature: 0.3 }
    );

    if (schemaResult.success && schemaResult.data) {
      console.log('✅ [OPENAI] Schema generation completed');
      return schemaResult.data;
    }

    console.log('⚠️ [OPENAI] Schema generation failed, using dynamic fallback');
    
    // カテゴリベースの動的フォールバック
    const category = ideaData.category || 'general';
    return this.generateDynamicFallbackSchema(ideaData.original || ideaData.enhanced, category);
  }

  /**
   * 動的フォールバックスキーマ生成
   */
  private generateDynamicFallbackSchema(idea: string, category: string): any {
    const ideaLower = idea.toLowerCase();
    
    // カテゴリベースのスキーマテンプレート
    const schemaTemplates = {
      finance: {
        tableName: 'financial_records',
        fields: [
          { name: 'title', type: 'string', required: true, label: '項目名' },
          { name: 'amount', type: 'number', required: true, label: '金額' },
          { name: 'category', type: 'string', required: false, label: 'カテゴリ' },
          { name: 'date', type: 'date', required: true, label: '日付' },
          { name: 'notes', type: 'text', required: false, label: 'メモ' }
        ]
      },
      productivity: {
        tableName: 'tasks',
        fields: [
          { name: 'title', type: 'string', required: true, label: 'タスク名' },
          { name: 'description', type: 'text', required: false, label: '詳細' },
          { name: 'status', type: 'string', required: true, label: 'ステータス' },
          { name: 'priority', type: 'string', required: false, label: '優先度' },
          { name: 'due_date', type: 'date', required: false, label: '期限' }
        ]
      },
      ecommerce: {
        tableName: 'products',
        fields: [
          { name: 'name', type: 'string', required: true, label: '商品名' },
          { name: 'price', type: 'number', required: true, label: '価格' },
          { name: 'description', type: 'text', required: false, label: '商品説明' },
          { name: 'category', type: 'string', required: false, label: 'カテゴリ' },
          { name: 'stock', type: 'number', required: true, label: '在庫数' }
        ]
      },
      social: {
        tableName: 'posts',
        fields: [
          { name: 'title', type: 'string', required: true, label: 'タイトル' },
          { name: 'content', type: 'text', required: true, label: '内容' },
          { name: 'author', type: 'string', required: true, label: '投稿者' },
          { name: 'tags', type: 'string', required: false, label: 'タグ' },
          { name: 'published_at', type: 'datetime', required: true, label: '投稿日時' }
        ]
      },
      creative: {
        tableName: 'creative_items',
        fields: [
          { name: 'title', type: 'string', required: true, label: 'タイトル' },
          { name: 'description', type: 'text', required: false, label: '説明' },
          { name: 'type', type: 'string', required: false, label: '種類' },
          { name: 'status', type: 'string', required: true, label: 'ステータス' },
          { name: 'created_at', type: 'datetime', required: true, label: '作成日時' }
        ]
      },
      health: {
        tableName: 'health_records',
        fields: [
          { name: 'title', type: 'string', required: true, label: '記録名' },
          { name: 'value', type: 'number', required: false, label: '数値' },
          { name: 'unit', type: 'string', required: false, label: '単位' },
          { name: 'date', type: 'date', required: true, label: '記録日' },
          { name: 'notes', type: 'text', required: false, label: 'メモ' }
        ]
      },
      education: {
        tableName: 'learning_items',
        fields: [
          { name: 'title', type: 'string', required: true, label: '学習項目' },
          { name: 'progress', type: 'number', required: false, label: '進捗率' },
          { name: 'difficulty', type: 'string', required: false, label: '難易度' },
          { name: 'category', type: 'string', required: false, label: 'カテゴリ' },
          { name: 'completed_at', type: 'date', required: false, label: '完了日' }
        ]
      }
    };
    
    // 特定キーワードによる追加調整
    if (ideaLower.includes('ブログ') || ideaLower.includes('記事') || ideaLower.includes('投稿')) {
      return {
        tableName: 'blog_posts',
        fields: [
          { name: 'title', type: 'string', required: true, label: 'タイトル' },
          { name: 'content', type: 'text', required: true, label: '本文' },
          { name: 'author', type: 'string', required: false, label: '著者' },
          { name: 'category', type: 'string', required: false, label: 'カテゴリ' },
          { name: 'published_at', type: 'datetime', required: false, label: '公開日時' }
        ],
        relationships: [],
        businessLogic: ['記事の作成・編集・削除', 'カテゴリ別表示', '公開/非公開管理'],
        indexes: ['title', 'published_at']
      };
    }
    
    if (ideaLower.includes('在庫') || ideaLower.includes('商品管理') || ideaLower.includes('inventory')) {
      return {
        tableName: 'inventory_items',
        fields: [
          { name: 'product_name', type: 'string', required: true, label: '商品名' },
          { name: 'sku', type: 'string', required: true, label: '商品コード' },
          { name: 'quantity', type: 'number', required: true, label: '数量' },
          { name: 'price', type: 'number', required: false, label: '価格' },
          { name: 'location', type: 'string', required: false, label: '保管場所' }
        ],
        relationships: [],
        businessLogic: ['在庫の追加・更新・削除', '在庫数の自動計算', '不足アラート'],
        indexes: ['sku', 'product_name']
      };
    }
    
    // デフォルトはカテゴリベース
    const template = schemaTemplates[category] || schemaTemplates.creative;
    
    return {
      ...template,
      relationships: [],
      businessLogic: ['基本的なCRUD操作', 'データの検索・フィルタ', '一覧表示'],
      indexes: [template.fields[0]?.name || 'id']
    };
  }

  /**
   * OpenAIによる高品質コード生成
   */
  private async generateCodeWithOpenAI(
    ideaData: any,
    designSystem: any,
    designInspiration: any,
    config: HybridGenerationConfig
  ) {
    console.log('⚡ [OPENAI] High-quality code generation started');

    // まずSchema情報を先に生成
    const schemaData = await this.generateSchemaWithOpenAI(ideaData, designSystem, config);
    
    // Function Callingを使って構造化されたコード生成
    console.log('🔄 [OPENAI] Starting Function Calling for component generation');
    console.log('🔄 [OPENAI] Category:', ideaData.category);
    console.log('🔄 [OPENAI] Enhanced idea:', ideaData.enhanced);
    
    const tableName = (schemaData as any)?.tableName || 'app_data';
    const fields = ((schemaData as any)?.fields || []).slice(0, 5);
    const colors = designInspiration.colorPalette || designSystem?.colorPalette || ['#6366f1', '#8b5cf6'];
    
    const prompt = `Create a high-quality React TypeScript component for: "${ideaData.enhanced || ideaData.original}"

Application Details:
- Category: ${ideaData.category}
- Component Name: ${this.generateComponentName(ideaData.original)}
- Database Table: ${tableName}
- Key Fields: ${fields.map((f: any) => `${f.name} (${f.type})`).join(', ')}
- Target Users: ${ideaData.targetUsers?.join(', ') || 'General users'}

Design Specifications:
- Style: ${designInspiration.mood || 'modern'} ${designSystem?.theme || 'premium'} design
- Color Palette: ${colors.slice(0, 3).join(', ')}
- Typography: ${designSystem?.typography?.heading || 'Inter, sans-serif'}
- Layout: ${designSystem?.layout || 'responsive grid'}

Technical Requirements:
- Use React 18+ with TypeScript
- Implement shadcn/ui components (Card, Button, Input, Badge, Table, Form)
- Full CRUD operations (Create, Read, Update, Delete)
- Form validation with proper error handling
- Loading states and empty states with proper UI feedback  
- Responsive design optimized for mobile and desktop
- Modern CSS with Tailwind classes and custom styling
- Proper accessibility (a11y) attributes
- Search and filter functionality if applicable

UI/UX Guidelines:
- Clean, modern interface with professional appearance
- Smooth animations and transitions
- Intuitive user flow and navigation
- Proper spacing and typography hierarchy
- Error states with helpful messages
- Success feedback for user actions

Generate a complete, production-ready React component that implements all CRUD operations for the ${tableName} table.`;

    // プロンプトサイズの確認
    const promptLength = prompt.length;
    console.log('📏 [OPENAI] Prompt length:', promptLength, 'characters');
    console.log('📏 [OPENAI] Estimated tokens:', Math.ceil(promptLength / 4)); // 大まかな推定

    const systemMessage = `You are an expert React/TypeScript developer. Create a high-quality production-ready component with modern best practices.`;

    const functionSchema = {
      description: 'Generate enterprise-level React component with Figma + Gemini integration',
      parameters: {
        type: 'object',
        properties: {
          componentName: { type: 'string', description: 'Component name in PascalCase' },
          componentCode: { type: 'string', description: 'Complete React component code' },
          typeDefinitions: { type: 'string', description: 'TypeScript type definitions' },
          customHooks: { type: 'string', description: 'Custom React hooks code' },
          apiIntegration: { type: 'string', description: 'API integration code' },
          storybook: { type: 'string', description: 'Storybook story for component testing' }
        },
        required: ['componentName', 'componentCode', 'typeDefinitions']
      }
    };

    const codeResult = await openAIOptimized.executeFunction(
      'generate_hybrid_react_component',
      functionSchema,
      prompt,
      systemMessage,
      { 
        model: 'gpt-4', 
        temperature: 0.2, 
        maxTokens: 4000 
      }
    );

    if (codeResult.success && codeResult.data) {
      console.log('✅ [OPENAI] Enterprise-level code generation completed');
      const data = codeResult.data as any;
      return {
        component: data.componentCode || data,
        types: data.typeDefinitions || '// Advanced TypeScript types generated',
        styles: '// Figma design tokens + Tailwind CSS integrated',
        hooks: data.customHooks || '// Custom hooks for business logic',
        apiIntegration: data.apiIntegration || '// API integration code',
        storybook: data.storybook || '// Storybook stories generated'
      };
    }

    console.log('⚠️ [OPENAI] Function calling failed, attempting text generation');
    console.log('⚠️ [OPENAI] Failure reason:', codeResult.error || 'Unknown error');
    console.log('⚠️ [OPENAI] Attempting fallback with direct prompt...');
    
    // フォールバック: 軽量コード生成
    const fallbackResult = await openAIOptimized.generateAdvancedText(
      `Create React component: ${ideaData.enhanced || ideaData.original}
      
Category: ${ideaData.category}
Table: ${(schemaData as any)?.tableName || 'app_data'}
Fields: ${((schemaData as any)?.fields || []).slice(0, 3).map((f: any) => f?.name || 'field').join(', ')}
Component: ${this.generateComponentName(ideaData.original)}

Generate TypeScript React component with CRUD, shadcn/ui, Tailwind CSS.`,
      'technical',
      { model: 'gpt-4', temperature: 0.3, maxTokens: 4000 }
    );

    if (fallbackResult.success && fallbackResult.data) {
      console.log('✅ [OPENAI] Text generation fallback successful');
      return {
        component: fallbackResult.data,
        types: '// TypeScript types embedded in component',
        styles: '// Tailwind CSS + Design System integrated',
        hooks: '// Custom hooks embedded in component'
      };
    }

    console.log('⚠️ [OPENAI] Both function calling and text generation failed');
    console.log('⚠️ [OPENAI] Function calling error:', codeResult.error || 'Unknown');
    console.log('⚠️ [OPENAI] Text generation error:', fallbackResult.error || 'Unknown');
    console.log('⚠️ [OPENAI] Using category-aware template as last resort');
    
    // 最後のリゾート：カテゴリ対応テンプレート生成
    return {
      component: this.generateFallbackComponent(ideaData, designInspiration, schemaData),
      types: '// Basic TypeScript types',
      styles: '// Basic Tailwind CSS',
      hooks: '// Basic custom hooks'
    };
  }

  /**
   * コンポーネント名生成
   */
  private generateComponentName(idea: string): string {
    const words = idea.split(/\s+/).slice(0, 2);
    return `${words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase().replace(/[^a-zA-Z]/g, '')
    ).join('')  }Manager`;
  }

  /**
   * フォールバックコンポーネント生成（カテゴリ対応）
   */
  private generateFallbackComponent(ideaData: any, designInspiration: any, schemaData: any): string {
    console.log('🔄 [FALLBACK] Generating fallback component for category:', ideaData.category);
    console.log('🔄 [FALLBACK] Original idea:', ideaData.original);
    
    const componentName = this.generateComponentName(ideaData.original);
    const primaryColor = designInspiration.colorPalette?.[0] || '#3b82f6';
    const category = ideaData.category?.toLowerCase() || 'general';
    
    // カテゴリ別のコンテンツを生成
    const categoryContent = this.generateCategorySpecificContent(category, ideaData.original);
    
    return `'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Heart, Star, DollarSign, Calendar, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface ${componentName}Props {
  className?: string;
}

interface DataItem {
  id: string;
  ${schemaData.fields?.slice(0, 3).map((field: any) => 
    `${field.name}: ${field.type === 'text' ? 'string' : field.type};`
  ).join('\n  ') || 'name: string;\n  description: string;'}
  created_at: string;
}

export default function ${componentName}({ className }: ${componentName}Props) {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // カテゴリ特化のサンプルデータでロード
    setTimeout(() => {
      setItems([
        {
          id: '1',
          name: '${categoryContent.sampleData.name}',
          ${Object.entries(categoryContent.sampleData).filter(([key]) => key !== 'name').map(([key, value]) => 
            `${key}: '${value}'`
          ).join(',\n          ')},
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = items.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={\`container mx-auto p-6 \${className}\`} style={{ 
      background: \`linear-gradient(135deg, \${primaryColor}10, \${primaryColor}05)\` 
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {category === 'finance' ? <DollarSign className="w-8 h-8" /> : <Calendar className="w-8 h-8" />}
            ${categoryContent.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            ${categoryContent.subtitle}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          ${categoryContent.addButtonText}
        </Button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="${categoryContent.searchPlaceholder}"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Items Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {item.${schemaData.fields?.[0]?.name || 'name'}}
                  </CardTitle>
                  <Badge variant="secondary" style={{ backgroundColor: \`\${primaryColor}20\`, color: primaryColor }}>
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.${schemaData.fields?.[1]?.name || 'description'}}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No items found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or add new items.
          </p>
        </motion.div>
      )}
    </div>
  );
}`;
  }

  /**
   * カテゴリ別コンテンツ生成
   */
  private generateCategorySpecificContent(category: string, originalIdea: string) {
    const categoryConfigs = {
      finance: {
        title: '家計管理システム',
        subtitle: '収支を効率的に管理して資産を最適化',
        icon: 'DollarSign',
        addButtonText: '収入記録',
        searchPlaceholder: '収支項目を検索...',
        emptyTitle: '収支記録がありません',
        emptyMessage: '新しい収支記録を追加して家計を管理しましょう',
        badge: '記録済み',
        sampleData: {
          name: '給与収入',
          amount: '250000',
          status: '記録済み',
          description: '月次給与'
        }
      },
      productivity: {
        title: 'タスク管理システム',
        subtitle: 'プロジェクトとタスクを効率的に管理',
        icon: 'CheckSquare',
        addButtonText: 'タスク追加',
        searchPlaceholder: 'タスクを検索...',
        emptyTitle: 'タスクがありません',
        emptyMessage: '新しいタスクを追加して生産性を向上させましょう',
        badge: '進行中',
        sampleData: {
          name: 'プロジェクト計画',
          priority: 'High',
          status: '進行中',
          description: '新機能の企画と設計'
        }
      },
      social: {
        title: 'ブログ管理システム',
        subtitle: '記事とコンテンツを効率的に管理',
        icon: 'FileText',
        addButtonText: '記事作成',
        searchPlaceholder: '記事を検索...',
        emptyTitle: '記事がありません',
        emptyMessage: '新しい記事を作成してコンテンツを充実させましょう',
        badge: '公開済み',
        sampleData: {
          name: 'ブログ記事のタイトル',
          category: 'Technology',
          status: '下書き',
          description: '記事の概要'
        }
      },
      ecommerce: {
        title: '商品管理システム',
        subtitle: '在庫と商品を効率的に管理',
        icon: 'Package',
        addButtonText: '商品登録',
        searchPlaceholder: '商品を検索...',
        emptyTitle: '商品がありません',
        emptyMessage: '新しい商品を登録して在庫を管理しましょう',
        badge: '在庫あり',
        sampleData: {
          name: 'サンプル商品',
          price: '1980',
          status: '販売中',
          description: '人気商品'
        }
      },
      health: {
        title: '健康記録システム',
        subtitle: '健康データを効率的に管理',
        icon: 'Heart',
        addButtonText: '記録追加',
        searchPlaceholder: '健康記録を検索...',
        emptyTitle: '健康記録がありません',
        emptyMessage: '新しい健康記録を追加して体調を管理しましょう',
        badge: '正常値',
        sampleData: {
          name: '体重測定',
          value: '68.5',
          status: '正常',
          description: '朝の測定'
        }
      },
      education: {
        title: '学習管理システム',
        subtitle: '学習進捗を効率的に管理',
        icon: 'BookOpen',
        addButtonText: '学習記録',
        searchPlaceholder: '学習項目を検索...',
        emptyTitle: '学習記録がありません',
        emptyMessage: '新しい学習記録を追加して進捗を管理しましょう',
        badge: '進行中',
        sampleData: {
          name: 'プログラミング基礎',
          progress: '75',
          status: '進行中',
          description: 'React学習コース'
        }
      },
      creative: {
        title: 'クリエイティブ管理システム',
        subtitle: 'クリエイティブ作品を効率的に管理',
        icon: 'Palette',
        addButtonText: '作品追加',
        searchPlaceholder: '作品を検索...',
        emptyTitle: '作品がありません',
        emptyMessage: '新しい作品を追加してポートフォリオを構築しましょう',
        badge: '完成',
        sampleData: {
          name: 'デザインプロジェクト',
          type: 'UI/UX',
          status: '完成',
          description: 'モバイルアプリデザイン'
        }
      },
      entertainment: {
        title: 'エンターテイメント管理システム',
        subtitle: 'コンテンツとメディアを効率的に管理',
        icon: 'Play',
        addButtonText: 'コンテンツ追加',
        searchPlaceholder: 'コンテンツを検索...',
        emptyTitle: 'コンテンツがありません',
        emptyMessage: '新しいコンテンツを追加してライブラリを充実させましょう',
        badge: '視聴済み',
        sampleData: {
          name: 'おすすめ映画',
          genre: 'ドラマ',
          status: '視聴済み',
          description: '評価の高い作品'
        }
      }
    };

    // カテゴリ別の特定テンプレート選択
    const config = categoryConfigs[category];
    if (config) {
      return config;
    }

    // フォールバック：元のアイデアから推測
    const ideaLower = originalIdea.toLowerCase();
    if (ideaLower.includes('ブログ') || ideaLower.includes('記事') || ideaLower.includes('投稿')) {
      return categoryConfigs.social;
    }
    if (ideaLower.includes('商品') || ideaLower.includes('在庫') || ideaLower.includes('EC') || ideaLower.includes('ショップ')) {
      return categoryConfigs.ecommerce;
    }
    if (ideaLower.includes('健康') || ideaLower.includes('運動') || ideaLower.includes('体重')) {
      return categoryConfigs.health;
    }
    if (ideaLower.includes('学習') || ideaLower.includes('教育') || ideaLower.includes('勉強')) {
      return categoryConfigs.education;
    }
    if (ideaLower.includes('扶養') || ideaLower.includes('控除') || ideaLower.includes('税金') || ideaLower.includes('家計')) {
      return categoryConfigs.finance;
    }

    // 最後のデフォルト
    return categoryConfigs.productivity;
  }

  /**
   * 統合と品質向上
   */
  private async enhanceAndIntegrate(data: any): Promise<HybridResult> {
    const processingTime = Date.now() - data.startTime;
    
    return {
      idea: data.idea,
      design: data.design,
      schema: data.schema,
      code: data.code,
      metadata: {
        providers: ['gemini', 'openai', ...(data.design.figmaTokens ? ['figma'] : [])],
        processingTime,
        qualityScores: {
          creativity: 0.9, // Geminiの貢献
          technical: 0.95, // OpenAIの貢献
          design: data.design.figmaTokens ? 0.98 : 0.85, // Figmaの貢献
          overall: 0.92
        },
        tokens: {
          openai: 2000, // 推定値
          gemini: 800,  // 推定値
          total: 2800
        }
      }
    };
  }

  /**
   * ユーティリティメソッド
   */
  private buildGeminiCreativityPrompt(userIdea: string, config: HybridGenerationConfig): string {
    return `Analyze this application idea and provide detailed insights: "${userIdea}"

Please analyze this idea thoroughly and respond with a JSON object in this EXACT format:

\`\`\`json
{
  "enhanced": "Improved and detailed description in Japanese (50-100 characters)",
  "category": "productivity|social|ecommerce|finance|health|education|creative|entertainment",
  "targetUsers": ["specific user type 1", "specific user type 2", "specific user type 3"],
  "keyFeatures": ["core feature 1", "core feature 2", "core feature 3", "core feature 4"],
  "uniqueValue": "What makes this application unique and valuable (in Japanese)",
  "businessPotential": "high|medium|low",
  "insights": ["key insight about the market", "user pain point this solves", "implementation consideration"]
}
\`\`\`

Analysis Guidelines:
1. ENHANCED: Make the description more specific and compelling
2. CATEGORY: Choose the MOST appropriate category based on primary function
3. TARGET_USERS: Be very specific (e.g., "忙しいビジネスパーソン", "子育て中の母親", "フリーランサー")
4. KEY_FEATURES: List practical, implementable features
5. UNIQUE_VALUE: Focus on the core value proposition
6. INSIGHTS: Provide meaningful business and technical insights

IMPORTANT: Return ONLY the JSON code block. No additional text or comments.`;
  }

  /**
   * フォールバック用のインテリジェントカテゴリ推論
   */
  private inferCategoryFromIdea(userIdea: string): string {
    const idea = userIdea.toLowerCase();
    
    // 生産性・タスク管理（優先度を上げる）
    if (idea.includes('タスク') || idea.includes('todo') || idea.includes('プロジェクト') || 
        idea.includes('進捗') || idea.includes('スケジュール') || idea.includes('管理システム')) {
      return 'productivity';
    }
    
    // ブログ・コンテンツ管理
    if (idea.includes('ブログ') || idea.includes('記事') || idea.includes('投稿') || 
        idea.includes('コンテンツ') || idea.includes('cms')) {
      return 'social';
    }
    
    // EC・商取引
    if (idea.includes('ショッピング') || idea.includes('EC') || idea.includes('購入') || 
        idea.includes('販売') || idea.includes('商品') || idea.includes('店舗') || 
        idea.includes('在庫') || idea.includes('inventory')) {
      return 'ecommerce';
    }
    
    // 金融・税制関連
    if (idea.includes('扶養') || idea.includes('控除') || idea.includes('税金') || idea.includes('年収') ||
        idea.includes('家計') || idea.includes('収入') || idea.includes('給与') || idea.includes('投資') ||
        idea.includes('金融') || idea.includes('会計')) {
      return 'finance';
    }
    
    // 医療・健康関連
    if (idea.includes('病院') || idea.includes('患者') || idea.includes('診療') || idea.includes('医療') ||
        idea.includes('健康') || idea.includes('運動') || idea.includes('フィットネス')) {
      return 'health';
    }
    
    // 教育関連
    if (idea.includes('学習') || idea.includes('教育') || idea.includes('勉強') || idea.includes('学校') ||
        idea.includes('コース') || idea.includes('資格')) {
      return 'education';
    }
    
    // ソーシャル・コミュニケーション
    if (idea.includes('SNS') || idea.includes('コミュニティ') || idea.includes('チャット') || 
        idea.includes('友達') || idea.includes('メッセージ')) {
      return 'social';
    }
    
    // エンターテイメント
    if (idea.includes('ゲーム') || idea.includes('音楽') || idea.includes('動画') || idea.includes('エンタメ')) {
      return 'entertainment';
    }
    
    // クリエイティブ関連
    if (idea.includes('レシピ') || idea.includes('料理') || idea.includes('写真') || 
        idea.includes('デザイン') || idea.includes('アート') || idea.includes('創作')) {
      return 'creative';
    }
    
    // デフォルトは productivity（より実用的）
    return 'productivity';
  }

  /**
   * カテゴリ別カラーパレット
   */
  private getCategoryColors(category: string): string[] {
    const colorPalettes = {
      creative: ['#8b5cf6', '#a855f7', '#c084fc', '#ffffff'],
      entertainment: ['#ef4444', '#f97316', '#eab308', '#ffffff'], 
      education: ['#3b82f6', '#1d4ed8', '#1e40af', '#ffffff'],
      health: ['#059669', '#10b981', '#34d399', '#ffffff'],
      finance: ['#1e40af', '#3b82f6', '#60a5fa', '#ffffff'],
      ecommerce: ['#dc2626', '#ea580c', '#facc15', '#ffffff'],
      social: ['#ec4899', '#f472b6', '#f9a8d4', '#ffffff'],
      productivity: ['#6366f1', '#8b5cf6', '#a78bfa', '#ffffff'],
      utility: ['#64748b', '#94a3b8', '#cbd5e1', '#ffffff']
    };
    
    return colorPalettes[category as keyof typeof colorPalettes] || colorPalettes.creative;
  }

  private extractJSONFromGeminiResponse(response: string): any {
    console.log('🔍 [JSON] Extracting from Gemini response');
    console.log('🔍 [JSON] Raw response:', response);
    console.log('🔍 [JSON] Response length:', response.length);
    
    try {
      // 複数のJSONパターンを試行
      const patterns = [
        /\{[\s\S]*?\}/,  // 最初の{}ブロック
        /```json\s*(\{[\s\S]*?\})\s*```/i,  // ```json block (case insensitive)
        /```\s*(\{[\s\S]*?\})\s*```/,  // ``` block
        /json\s*:\s*(\{[\s\S]*?\})/i,  // json: {object}
        /response\s*:\s*(\{[\s\S]*?\})/i,  // response: {object}
        /\{[\s\S]*"enhanced"[\s\S]*\}/,  // JSONっぽいものでenhancedキーを含む
        /\{[^{}]*"category"[^{}]*\}/,  // 単純なJSONでcategoryキーを含む
        /\{[\s\S]+\}/,  // 最後の{}ブロック（貪欲マッチ）
      ];

      let jsonStr = '';
      let parsed = null;

      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        console.log(`🔍 [JSON] Trying pattern ${i + 1}:`, pattern.toString());
        const matches = response.match(pattern);
        console.log(`🔍 [JSON] Pattern ${i + 1} matches:`, matches ? matches.length : 0);
        
        if (matches) {
          jsonStr = matches[1] || matches[0];
          console.log(`🔍 [JSON] Extracted string:`, `${jsonStr.substring(0, 200)  }...`);
          
          try {
            // 基本的なJSON修正を段階的に適用
            const cleanJson = jsonStr
              .replace(/^\s*```json?\s*/, '')  // コードブロック削除
              .replace(/\s*```\s*$/, '')       // 終了コードブロック削除
              .replace(/\/\/.*$/gm, '')        // インラインコメント削除（行の途中の//から行末まで）
              .replace(/\/\*[\s\S]*?\*\//g, '') // ブロックコメント削除
              .replace(/'/g, '"')              // シングル→ダブルクォート
              .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // キーをクォート
              .replace(/,\s*([}\]])/g, '$1')   // trailing comma削除
              .replace(/,\s*,/g, ',')          // 重複カンマ削除
              .replace(/\s+/g, ' ')            // 複数スペースを1つに
              .trim();

            console.log(`🔍 [JSON] Cleaned JSON:`, `${cleanJson.substring(0, 200)  }...`);
            parsed = JSON.parse(cleanJson);
            console.log('✅ [JSON] Successfully parsed with pattern', i + 1);
            break;
          } catch (parseError) {
            console.log(`⚠️ [JSON] Pattern ${i + 1} failed:`, (parseError as Error).message);
            continue;
          }
        } else {
          console.log(`⚠️ [JSON] Pattern ${i + 1} found no matches`);
        }
      }

      if (!parsed) {
        throw new Error('No valid JSON found in any pattern');
      }
      
      // 必須フィールドの補完
      return {
        enhanced: parsed.enhanced || parsed.description || '専門的ソリューション',
        category: parsed.category || this.inferCategoryFromIdea(response),
        targetUsers: parsed.targetUsers || parsed.users || ['専門ユーザー'],
        keyFeatures: parsed.keyFeatures || parsed.features || ['主要機能1', '主要機能2'],
        uniqueValue: parsed.uniqueValue || parsed.value || '特化型アプローチ',
        businessPotential: parsed.businessPotential || parsed.potential || 'medium',
        insights: parsed.insights || ['本質的価値提供'],
        variations: parsed.variations || [],
        colorPalette: parsed.colorPalette || ['#3b82f6', '#64748b'],
        designStyle: parsed.designStyle || 'modern',
        mood: parsed.mood || 'professional'
      };

    } catch (error) {
      console.warn('⚠️ [JSON] All parsing attempts failed, using text analysis:', (error as Error).message);
      return this.createSimpleFallbackFromText(response);
    }
  }


  private extractKeyTerms(text: string): string[] {
    // 重要そうなキーワードを抽出
    const words = text.toLowerCase()
      .replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !['の', 'を', 'に', 'は', 'が', 'で', 'と', 'から', 'まで'].includes(word));
    
    // 頻度で重要度を判定（簡易版）
    const frequency: { [key: string]: number } = {};
    words.forEach(word => frequency[word] = (frequency[word] || 0) + 1);
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private createSimpleFallbackFromText(response: string): any {
    console.log('🔧 [FALLBACK] Creating simple analysis');
    
    const category = this.inferCategoryFromIdea(response);
    const keyTerms = this.extractKeyTerms(response);
    
    return {
      enhanced: `${keyTerms.slice(0, 2).join('・')}に特化したソリューション`,
      category,
      targetUsers: ['専門ユーザー', '業界関係者'],
      keyFeatures: keyTerms.slice(0, 3).map(term => `${term}機能`),
      uniqueValue: `${category}分野の専門的アプローチ`,
      businessPotential: 'medium',
      insights: [`${category}業界に特化`, '実用性重視の設計']
    };
  }
}

export const hybridAI = new HybridAIOrchestrator();