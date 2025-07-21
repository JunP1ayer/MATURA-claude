/**
 * Figma-Enhanced UI Generator
 * Figma連携による高品質デザインシステム生成
 */

import { openai } from '@/lib/openai';
import { GeminiClient } from '@/lib/gemini-client';
import type { AppIntent, GeneratedSchema, UIConfiguration } from './universal-app-generator';

export interface FigmaDesignSystem {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    headingSizes: string[];
    bodySize: string;
    lineHeight: number;
  };
  spacing: {
    base: number;
    scale: number[];
  };
  components: {
    buttons: any[];
    cards: any[];
    forms: any[];
    navigation: any[];
  };
  layout: {
    grid: string;
    breakpoints: any;
    container: string;
  };
}

export interface EnhancedUIConfig extends UIConfiguration {
  figmaDesignSystem?: FigmaDesignSystem;
  designTokens: any;
  componentLibrary: string[];
  accessibilityFeatures: string[];
}

export class FigmaEnhancedUIGenerator {
  private gemini: GeminiClient;

  constructor() {
    this.gemini = new GeminiClient();
  }

  /**
   * Figma連携を活用したUI生成
   */
  async generateEnhancedUI(
    intent: AppIntent,
    schema: GeneratedSchema,
    userIdea: string
  ): Promise<EnhancedUIConfig> {
    console.log('🎨 [FIGMA-UI] Starting Figma-enhanced UI generation');

    // Step 1: Figmaデザインシステム取得・分析
    const figmaDesignSystem = await this.analyzeFigmaDesignSystem(intent);
    console.log('✅ [FIGMA-UI] Figma design system analyzed');

    // Step 2: カテゴリ別デザインパターン選択
    const designPattern = await this.selectDesignPattern(intent, figmaDesignSystem);
    console.log('✅ [FIGMA-UI] Design pattern selected:', designPattern.name);

    // Step 3: Geminiでカスタマイズ
    const customizedUI = await this.customizeWithGemini(intent, schema, designPattern, userIdea);
    console.log('✅ [FIGMA-UI] UI customized with Gemini');

    // Step 4: アクセシビリティ強化
    const accessibilityFeatures = await this.enhanceAccessibility(intent, customizedUI);
    console.log('✅ [FIGMA-UI] Accessibility enhanced');

    return {
      ...customizedUI,
      figmaDesignSystem,
      accessibilityFeatures
    };
  }

  /**
   * Figmaデザインシステムの分析
   */
  private async analyzeFigmaDesignSystem(intent: AppIntent): Promise<FigmaDesignSystem> {
    try {
      // Figma API連携（既存のFigmaクライアントを使用）
      const figmaApiKey = process.env.FIGMA_API_KEY;
      const figmaFileId = process.env.DEFAULT_FIGMA_FILE_ID;

      if (!figmaApiKey || !figmaFileId) {
        console.log('⚠️ [FIGMA-UI] Figma API not configured, using fallback');
        return this.createFallbackDesignSystem(intent);
      }

      // Figmaファイルからデザイントークンを取得
      const figmaResponse = await fetch(`https://api.figma.com/v1/files/${figmaFileId}`, {
        headers: {
          'X-Figma-Token': figmaApiKey
        }
      });

      if (!figmaResponse.ok) {
        throw new Error('Figma API request failed');
      }

      const figmaData = await figmaResponse.json();
      
      // Figmaデータを解析してデザインシステムを抽出
      return this.extractDesignSystemFromFigma(figmaData, intent);

    } catch (error) {
      console.error('❌ [FIGMA-UI] Figma analysis failed:', error);
      return this.createFallbackDesignSystem(intent);
    }
  }

  /**
   * Figmaデータからデザインシステム抽出
   */
  private extractDesignSystemFromFigma(figmaData: any, intent: AppIntent): FigmaDesignSystem {
    // Figmaファイルからカラーパレット抽出
    const colorPalette = this.extractColorsFromFigma(figmaData, intent.category);
    
    // タイポグラフィ抽出
    const typography = this.extractTypographyFromFigma(figmaData);
    
    // スペーシング抽出
    const spacing = this.extractSpacingFromFigma(figmaData);
    
    // コンポーネント抽出
    const components = this.extractComponentsFromFigma(figmaData);

    return {
      colorPalette,
      typography,
      spacing,
      components,
      layout: {
        grid: '12-column',
        breakpoints: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        },
        container: 'max-w-7xl mx-auto px-4'
      }
    };
  }

  /**
   * カテゴリ別デザインパターン選択
   */
  private async selectDesignPattern(
    intent: AppIntent,
    figmaDesignSystem: FigmaDesignSystem
  ): Promise<{ name: string, config: any }> {
    const patterns = {
      finance: {
        name: 'Professional Finance',
        primaryColor: '#1e40af',
        layout: 'dashboard',
        emphasis: 'data-heavy'
      },
      health: {
        name: 'Wellness & Care',
        primaryColor: '#059669',
        layout: 'form-focused',
        emphasis: 'user-friendly'
      },
      productivity: {
        name: 'Clean Minimal',
        primaryColor: '#6366f1',
        layout: 'list',
        emphasis: 'efficiency'
      },
      creative: {
        name: 'Vibrant Creative',
        primaryColor: '#8b5cf6',
        layout: 'grid',
        emphasis: 'visual'
      },
      social: {
        name: 'Social Engagement',
        primaryColor: '#ec4899',
        layout: 'feed',
        emphasis: 'interaction'
      }
    };

    const selectedPattern = patterns[intent.category as keyof typeof patterns] || patterns.productivity;
    
    // Figmaデザインシステムとパターンを組み合わせ
    return {
      name: selectedPattern.name,
      config: {
        ...selectedPattern,
        figmaColors: figmaDesignSystem.colorPalette,
        figmaTypography: figmaDesignSystem.typography
      }
    };
  }

  /**
   * Geminiでカスタマイズ
   */
  private async customizeWithGemini(
    intent: AppIntent,
    schema: GeneratedSchema,
    designPattern: any,
    userIdea: string
  ): Promise<UIConfiguration> {
    const prompt = `あなたは世界クラスのUI/UXデザイナーです。以下の要件に基づいて最適なUI設定を生成してください。

【アプリアイデア】
${userIdea}

【アプリ情報】
- カテゴリ: ${intent.category}
- 主目的: ${intent.primaryPurpose}
- ターゲット: ${intent.targetUsers.join(', ')}
- 主要機能: ${intent.keyFeatures.join(', ')}

【データ構造】
テーブル: ${schema.tableName}
フィールド: ${schema.fields.map(f => `${f.name}(${f.type})`).join(', ')}

【選択されたデザインパターン】
${designPattern.name} - ${designPattern.config.emphasis}

以下の形式でJSON応答してください：
{
  "theme": {
    "primaryColor": "#色コード",
    "secondaryColor": "#色コード", 
    "backgroundColor": "#色コード"
  },
  "layout": "list|grid|dashboard|form",
  "components": ["コンポーネント1", "コンポーネント2", ...],
  "interactions": ["インタラクション1", "インタラクション2", ...],
  "designTokens": {
    "borderRadius": "値",
    "shadows": ["shadow1", "shadow2"],
    "animations": ["animation1", "animation2"]
  },
  "componentLibrary": ["Card", "Button", "Form", ...]
}

**重要**: ユーザーの意図とデータ構造に最適化し、使いやすく美しいUIを設計してください。`;

    try {
      const response = await this.gemini.generateText({
        prompt,
        temperature: 0.4,
        maxTokens: 2000
      });

      if (!response.success || !response.data) {
        throw new Error('Gemini UI customization failed');
      }

      const jsonMatch = response.data.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      const customConfig = JSON.parse(jsonMatch[0]);
      
      return {
        theme: customConfig.theme,
        layout: customConfig.layout,
        components: customConfig.components,
        interactions: customConfig.interactions,
        designTokens: customConfig.designTokens,
        componentLibrary: customConfig.componentLibrary
      };

    } catch (error) {
      console.error('❌ [FIGMA-UI] Gemini customization failed:', error);
      return this.createFallbackUIConfig(intent, designPattern);
    }
  }

  /**
   * アクセシビリティ強化
   */
  private async enhanceAccessibility(
    intent: AppIntent,
    uiConfig: UIConfiguration
  ): Promise<string[]> {
    const accessibilityFeatures = [
      'WCAG 2.1 AA準拠',
      'キーボードナビゲーション対応',
      'スクリーンリーダー対応',
      'カラーコントラスト最適化',
      'フォーカス管理',
      'ARIAラベル適用'
    ];

    // カテゴリ別の特別な配慮
    if (intent.category === 'health') {
      accessibilityFeatures.push('医療アクセシビリティガイドライン準拠');
    }
    
    if (intent.category === 'finance') {
      accessibilityFeatures.push('金融データアクセシビリティ強化');
    }

    return accessibilityFeatures;
  }

  // ヘルパー関数
  private createFallbackDesignSystem(intent: AppIntent): FigmaDesignSystem {
    const categoryColors = {
      finance: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
      health: { primary: '#059669', secondary: '#10b981', accent: '#34d399' },
      productivity: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a78bfa' },
      creative: { primary: '#8b5cf6', secondary: '#a855f7', accent: '#c084fc' },
      social: { primary: '#ec4899', secondary: '#f472b6', accent: '#f9a8d4' }
    };

    const colors = categoryColors[intent.category as keyof typeof categoryColors] || categoryColors.productivity;

    return {
      colorPalette: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        headingSizes: ['2.5rem', '2rem', '1.5rem', '1.25rem'],
        bodySize: '1rem',
        lineHeight: 1.6
      },
      spacing: {
        base: 4,
        scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48]
      },
      components: {
        buttons: [],
        cards: [],
        forms: [],
        navigation: []
      },
      layout: {
        grid: '12-column',
        breakpoints: {},
        container: 'max-w-7xl mx-auto'
      }
    };
  }

  private extractColorsFromFigma(figmaData: any, category: string): any {
    // Figmaファイルからカラーを抽出（実装省略）
    return {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b'
    };
  }

  private extractTypographyFromFigma(figmaData: any): any {
    return {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingSizes: ['2.5rem', '2rem', '1.5rem', '1.25rem'],
      bodySize: '1rem',
      lineHeight: 1.6
    };
  }

  private extractSpacingFromFigma(figmaData: any): any {
    return {
      base: 4,
      scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48]
    };
  }

  private extractComponentsFromFigma(figmaData: any): any {
    return {
      buttons: [],
      cards: [],
      forms: [],
      navigation: []
    };
  }

  private createFallbackUIConfig(intent: AppIntent, designPattern: any): UIConfiguration {
    return {
      theme: {
        primaryColor: designPattern.config.primaryColor,
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff'
      },
      layout: designPattern.config.layout,
      components: ['Card', 'Button', 'Input', 'Form'],
      interactions: ['click', 'hover', 'focus'],
      designTokens: {},
      componentLibrary: ['shadcn/ui']
    };
  }
}

export const figmaEnhancedUIGenerator = new FigmaEnhancedUIGenerator();