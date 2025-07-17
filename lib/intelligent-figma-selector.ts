// Intelligent Figma Template Selector and Customizer
import { intelligentDesignAnalyzer, StructuredData, DesignContext, ColorPersonality } from './intelligent-design-analyzer';
import { PREMIUM_DESIGN_PATTERNS, UIDesignPattern } from './smart-ui-selector';
import { figmaExtractor, FigmaDesignData } from './figma-api';

export interface IntelligentSelection {
  selectedPattern: UIDesignPattern;
  customizedPattern: UIDesignPattern;
  designReasoning: string;
  confidenceScore: number;
  alternatives: UIDesignPattern[];
  structuredData: StructuredData;
  designContext: DesignContext;
  colorPersonality: ColorPersonality;
}

export interface CustomizationOptions {
  adaptColors: boolean;
  adaptLayout: boolean;
  adaptComplexity: boolean;
  adaptComponents: boolean;
}

export class IntelligentFigmaSelector {
  // Main entry point: analyze user input and select optimal Figma template
  async selectOptimalTemplate(
    userInput: string, 
    options: CustomizationOptions = {
      adaptColors: true,
      adaptLayout: true,
      adaptComplexity: true,
      adaptComponents: true
    }
  ): Promise<IntelligentSelection> {
    
    // Step 1: Analyze user input
    console.log('🔍 Analyzing user input...');
    const structuredData = intelligentDesignAnalyzer.analyzeUserInput(userInput);
    
    // Step 2: Derive design context
    console.log('🎨 Deriving design context...');
    const designContext = intelligentDesignAnalyzer.deriveDesignContext(structuredData);
    
    // Step 3: Generate color personality
    console.log('🌈 Generating color personality...');
    const colorPersonality = intelligentDesignAnalyzer.generateColorPersonality(structuredData, designContext);
    
    // Step 4: Score and rank templates
    console.log('📊 Scoring templates...');
    const rankedTemplates = this.scoreAndRankTemplates(designContext, structuredData);
    
    // Step 5: Select best template
    const selectedPattern = rankedTemplates[0];
    console.log(`✅ Selected template: ${selectedPattern.name}`);
    
    // Step 6: Customize template based on analysis
    console.log('🔧 Customizing template...');
    const customizedPattern = await this.customizeTemplate(
      selectedPattern, 
      designContext, 
      colorPersonality, 
      options
    );
    
    // Step 7: Generate reasoning
    const designReasoning = this.generateDesignReasoning(
      structuredData, 
      designContext, 
      selectedPattern, 
      customizedPattern
    );
    
    // Step 8: Get alternatives
    const alternatives = rankedTemplates.slice(1, 4);
    
    return {
      selectedPattern,
      customizedPattern,
      designReasoning,
      confidenceScore: designContext.confidenceScore,
      alternatives,
      structuredData,
      designContext,
      colorPersonality
    };
  }

  // Score templates based on design context
  private scoreAndRankTemplates(context: DesignContext, structured: StructuredData): UIDesignPattern[] {
    const scoredTemplates = PREMIUM_DESIGN_PATTERNS.map(template => {
      let score = 0;
      
      // Category match (highest weight)
      if (template.category === context.category) {
        score += 40;
      } else if (this.getCategoryCompatibility(template.category, context.category) > 0.5) {
        score += 20;
      }
      
      // Complexity match
      if (template.complexity === context.complexity) {
        score += 25;
      } else {
        const complexityScore = this.getComplexityCompatibility(template.complexity, context.complexity);
        score += complexityScore * 15;
      }
      
      // Layout style compatibility
      const layoutScore = this.getLayoutCompatibility(template.layout, context.emotionalTone, context.targetAudience);
      score += layoutScore * 20;
      
      // MVP score influence
      score += template.mvpScore * 1.5;
      
      // Target audience compatibility
      const audienceScore = this.getAudienceCompatibility(template, context.targetAudience);
      score += audienceScore * 10;
      
      // Primary goal alignment
      const goalScore = this.getGoalCompatibility(template, context.primaryGoal);
      score += goalScore * 15;
      
      return { template, score };
    });
    
    // Sort by score (descending)
    scoredTemplates.sort((a, b) => b.score - a.score);
    
    console.log('📈 Template scores:', scoredTemplates.map(st => ({
      name: st.template.name,
      score: Math.round(st.score * 100) / 100
    })));
    
    return scoredTemplates.map(st => st.template);
  }

  // Customize selected template based on context
  private async customizeTemplate(
    template: UIDesignPattern,
    context: DesignContext,
    colorPersonality: ColorPersonality,
    options: CustomizationOptions
  ): Promise<UIDesignPattern> {
    
    const customized: UIDesignPattern = {
      ...template,
      id: `customized-${template.id}-${Date.now()}`,
      name: this.generateCustomizedName(template.name, context)
    };
    
    // Adapt colors
    if (options.adaptColors) {
      customized.colors = {
        primary: colorPersonality.primary,
        secondary: colorPersonality.secondary,
        accent: colorPersonality.accent,
        background: colorPersonality.background,
        text: colorPersonality.text
      };
    }
    
    // Adapt complexity
    if (options.adaptComplexity && template.complexity !== context.complexity) {
      customized.complexity = context.complexity;
      customized.components = this.adaptComponentsForComplexity(template.components, context.complexity);
    }
    
    // Adapt layout style
    if (options.adaptLayout) {
      customized.layout = this.adaptLayoutForContext(template.layout, context);
    }
    
    // Enhance MVP score based on personalization
    customized.mvpScore = Math.min(template.mvpScore + 1, 10);
    
    // Try to fetch and customize from Figma if URL is available
    if (options.adaptComponents && template.figmaUrl) {
      try {
        console.log(`🔗 Fetching Figma design from: ${template.figmaUrl}`);
        const figmaDesign = await figmaExtractor.fetchDesignFromUrl(template.figmaUrl);
        
        if (figmaDesign) {
          // Apply color customization to Figma design
          figmaDesign.colors = customized.colors;
          
          // Store the customized Figma design for later use
          (customized as any).figmaDesign = figmaDesign;
          console.log('✅ Figma design successfully fetched and customized');
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch Figma design, using default customization:', error);
      }
    }
    
    return customized;
  }

  // Generate human-readable design reasoning
  private generateDesignReasoning(
    structured: StructuredData,
    context: DesignContext,
    original: UIDesignPattern,
    customized: UIDesignPattern
  ): string {
    const reasons = [];
    
    // Category reasoning
    reasons.push(`「${context.category}」カテゴリーに最適化されたテンプレートを選択`);
    
    // Complexity reasoning
    if (context.complexity !== 'moderate') {
      reasons.push(`${context.complexity === 'simple' ? 'シンプル' : '高機能'}な設計で${context.targetAudience}のニーズに対応`);
    }
    
    // Emotional tone reasoning
    reasons.push(`${context.emotionalTone}な印象を与える${customized.layout}レイアウトを採用`);
    
    // Color reasoning
    reasons.push(customized.colors !== original.colors ? 
      `あなたのプロダクトの性格に合わせて配色をカスタマイズ` : 
      `業界標準の配色を使用`);
    
    // Primary goal reasoning
    reasons.push(`${context.primaryGoal}を最大化する要素配置とユーザー導線を設計`);
    
    // Confidence reasoning
    if (context.confidenceScore >= 8) {
      reasons.push(`高い情報密度に基づく確信度${context.confidenceScore}/10での選択`);
    } else if (context.confidenceScore <= 5) {
      reasons.push(`汎用性を重視した安全な選択（確信度${context.confidenceScore}/10）`);
    }
    
    return reasons.join('。') + '。';
  }

  // Helper methods for compatibility scoring
  private getCategoryCompatibility(template: string, target: string): number {
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      dashboard: { business: 0.8, productivity: 0.6, ecommerce: 0.4 },
      productivity: { business: 0.7, dashboard: 0.6, social: 0.3 },
      creative: { social: 0.5, ecommerce: 0.4, business: 0.2 },
      business: { dashboard: 0.8, productivity: 0.7, ecommerce: 0.6 },
      social: { creative: 0.5, productivity: 0.3, ecommerce: 0.4 },
      ecommerce: { business: 0.6, dashboard: 0.4, social: 0.4 }
    };
    
    return compatibilityMatrix[template]?.[target] || 0;
  }

  private getComplexityCompatibility(template: string, target: string): number {
    const complexityMap = { simple: 1, moderate: 2, complex: 3 };
    const diff = Math.abs(complexityMap[template as keyof typeof complexityMap] - complexityMap[target as keyof typeof complexityMap]);
    return Math.max(0, 1 - diff * 0.3);
  }

  private getLayoutCompatibility(layout: string, tone: string, audience: string): number {
    const layoutScores: Record<string, Record<string, number>> = {
      professional: { serious: 1, professional: 1, enterprise: 1 },
      modern: { modern: 1, friendly: 0.8, general: 0.9 },
      minimal: { serious: 0.7, professional: 0.8, creative: 0.6 },
      creative: { creative: 1, friendly: 0.8, general: 0.6 }
    };
    
    return Math.max(
      layoutScores[layout]?.[tone] || 0.5,
      layoutScores[layout]?.[audience] || 0.5
    );
  }

  private getAudienceCompatibility(template: UIDesignPattern, audience: string): number {
    const audienceMapping: Record<string, string[]> = {
      general: ['productivity', 'social'],
      professional: ['business', 'dashboard', 'productivity'],
      enterprise: ['business', 'dashboard'],
      creative: ['creative', 'social'],
      technical: ['dashboard', 'productivity']
    };
    
    return audienceMapping[audience]?.includes(template.category) ? 1 : 0.3;
  }

  private getGoalCompatibility(template: UIDesignPattern, goal: string): number {
    const goalMapping: Record<string, string[]> = {
      efficiency: ['productivity', 'dashboard'],
      engagement: ['social', 'creative'],
      conversion: ['ecommerce', 'business'],
      analysis: ['dashboard', 'business'],
      collaboration: ['productivity', 'social']
    };
    
    return goalMapping[goal]?.includes(template.category) ? 1 : 0.4;
  }

  // Customization helper methods
  private generateCustomizedName(originalName: string, context: DesignContext): string {
    const prefixes = {
      dashboard: 'データ駆動型',
      productivity: '効率重視',
      creative: 'クリエイティブ',
      business: 'ビジネス最適化',
      social: 'コミュニティ中心',
      ecommerce: 'コンバージョン特化'
    };
    
    const prefix = prefixes[context.category] || 'カスタム';
    return `${prefix} ${originalName}`;
  }

  private adaptComponentsForComplexity(components: string[], complexity: string): string[] {
    if (complexity === 'simple') {
      // Reduce to essential components
      return components.slice(0, 3);
    } else if (complexity === 'complex') {
      // Add advanced components
      const additionalComponents = ['search', 'filters', 'analytics', 'notifications'];
      return [...components, ...additionalComponents.filter(comp => !components.includes(comp))];
    }
    
    return components;
  }

  private adaptLayoutForContext(originalLayout: string, context: DesignContext): UIDesignPattern['layout'] {
    const layoutMapping: Record<string, UIDesignPattern['layout']> = {
      serious: 'professional',
      professional: 'professional',
      friendly: 'modern',
      creative: 'creative',
      modern: 'modern'
    };
    
    return layoutMapping[context.emotionalTone] || originalLayout as UIDesignPattern['layout'];
  }
}

export const intelligentFigmaSelector = new IntelligentFigmaSelector();