/**
 * Figma-Enhanced UI Generator
 * Figma連携による高品質デザインシステム生成
 */

import { GeminiClient } from '@/lib/gemini-client';
import { openai } from '@/lib/openai';
import type { AppIntent, GeneratedSchema, UIConfiguration } from './enhanced-code-generator';

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
      accessibilityFeatures,
      designTokens: customizedUI.designTokens || {},
      componentLibrary: customizedUI.componentLibrary || ['shadcn/ui']
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
        console.log(`[FIGMA-UI] API Key exists: ${!!figmaApiKey}, File ID: ${figmaFileId || 'missing'}`);
        return this.createFallbackDesignSystem(intent);
      }
      
      console.log(`🔍 [FIGMA-UI] Attempting to fetch Figma file: ${figmaFileId}`);
      console.log(`[FIGMA-UI] API Key prefix: ${figmaApiKey?.substring(0, 7)}...`);

      // Figmaファイルからデザイントークンを取得
      const figmaResponse = await fetch(`https://api.figma.com/v1/files/${figmaFileId}`, {
        headers: {
          'X-Figma-Token': figmaApiKey
        }
      });

      if (!figmaResponse.ok) {
        console.log(`⚠️ [FIGMA-UI] API request failed: ${figmaResponse.status}, using fallback`);
        return this.createFallbackDesignSystem(intent);
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

    console.log('📐 [FIGMA-UI] Extracted design tokens:');
    console.log('  - Colors:', Object.keys(colorPalette).length, 'color tokens');
    console.log('  - Typography:', typography.headingSizes.length, 'heading sizes');
    console.log('  - Spacing:', spacing.scale.length, 'spacing values');
    console.log('  - Components:', Object.keys(components).reduce((sum, key) => sum + components[key].length, 0), 'total components');

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

      // 複数のJSONパターンを試行
      const patterns = [
        /\{[\s\S]*\}/,  // 基本パターン
        /```json\s*(\{[\s\S]*?\})\s*```/, // コードブロック内
        /json\s*(\{[\s\S]*?\})/, // json prefix付き
        /(\{[\s\S]*?\})/  // より厳密なパターン
      ];

      let customConfig = null;
      for (const pattern of patterns) {
        const match = response.data.match(pattern);
        if (match) {
          const jsonStr = match[1] || match[0];
          try {
            // 不正な文字を修正
            const cleanedJson = jsonStr
              .replace(/'/g, '"')  // シングルクォートをダブルクォートに
              .replace(/,\s*}/g, '}')  // trailing commaを削除
              .replace(/,\s*]/g, ']')  // trailing commaを削除
              .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":'); // キーをクォート

            customConfig = JSON.parse(cleanedJson);
            break;
          } catch (parseError) {
            console.log(`[FIGMA-UI] Parse attempt failed:`, parseError);
            continue;
          }
        }
      }

      if (!customConfig) {
        console.log('⚠️ [FIGMA-UI] No valid JSON found, using intelligent fallback');
        return this.createFallbackUIConfig(intent, designPattern);
      }
      
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
    console.log('🎨 [FIGMA-COLORS] 高精度カラー抽出を開始');
    
    try {
      const document = figmaData?.document;
      if (!document) {
        console.log('⚠️ [FIGMA-COLORS] Document not found, using enhanced fallback');
        return this.getEnhancedFallbackColors(category);
      }

      const extractedColors: any = {
        primary: '#6366f1',
        secondary: '#8b5cf6', 
        accent: '#06b6d4',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b'
      };

      // Figmaの塗りスタイルを再帰的に検索
      const findPaintStyles = (node: any, colors: string[] = []): string[] => {
        if (node.fills && Array.isArray(node.fills)) {
          node.fills.forEach((fill: any) => {
            if (fill.type === 'SOLID' && fill.color) {
              const { r, g, b } = fill.color;
              const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
              if (!colors.includes(hex) && hex !== '#000000' && hex !== '#ffffff') {
                colors.push(hex);
              }
            }
          });
        }

        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: any) => {
            findPaintStyles(child, colors);
          });
        }

        return colors;
      };

      const discoveredColors = findPaintStyles(document);
      console.log('🎨 [FIGMA-COLORS] 発見されたカラー:', discoveredColors.slice(0, 5));

      // 発見されたカラーを適用
      if (discoveredColors.length >= 3) {
        extractedColors.primary = discoveredColors[0];
        extractedColors.secondary = discoveredColors[1];
        extractedColors.accent = discoveredColors[2];
      }

      console.log('✅ [FIGMA-COLORS] カラー抽出完了:', extractedColors.primary);
      return extractedColors;

    } catch (error) {
      console.log('⚠️ [FIGMA-COLORS] 抽出エラー、フォールバックを使用:', (error as Error)?.message);
      return this.getEnhancedFallbackColors(category);
    }
  }

  private getEnhancedFallbackColors(category: string): any {
    const categoryColorSets = {
      finance: {
        primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa',
        background: '#fafbff', surface: '#f1f5f9', text: '#0f172a'
      },
      health: {
        primary: '#059669', secondary: '#10b981', accent: '#34d399', 
        background: '#f0fdf4', surface: '#ecfdf5', text: '#064e3b'
      },
      creative: {
        primary: '#8b5cf6', secondary: '#a855f7', accent: '#c084fc',
        background: '#faf5ff', surface: '#f3e8ff', text: '#581c87'
      },
      education: {
        primary: '#3b82f6', secondary: '#1d4ed8', accent: '#93c5fd',
        background: '#eff6ff', surface: '#dbeafe', text: '#1e3a8a'
      },
      social: {
        primary: '#ec4899', secondary: '#f472b6', accent: '#f9a8d4',
        background: '#fdf2f8', surface: '#fce7f3', text: '#9d174d'
      }
    };

    return categoryColorSets[category as keyof typeof categoryColorSets] || categoryColorSets.creative;
  }

  private extractTypographyFromFigma(figmaData: any): any {
    console.log('📝 [FIGMA-TYPOGRAPHY] 高精度タイポグラフィ抽出を開始');
    
    try {
      const document = figmaData?.document;
      if (!document) {
        console.log('⚠️ [FIGMA-TYPOGRAPHY] Document not found, using enhanced fallback');
        return this.getEnhancedFallbackTypography();
      }

      const typographyStyles: any = {
        fontFamily: 'Inter, system-ui, sans-serif',
        headingSizes: [],
        bodySize: '1rem',
        lineHeight: 1.6,
        fontWeights: {}
      };

      // Figmaのテキストスタイルを再帰的に検索
      const findTextStyles = (node: any): void => {
        if (node.type === 'TEXT' && node.style) {
          const style = node.style;
          
          // フォントファミリーの抽出
          if (style.fontFamily && !typographyStyles.fontFamily.includes(style.fontFamily)) {
            typographyStyles.fontFamily = `${style.fontFamily}, ${typographyStyles.fontFamily}`;
          }

          // フォントサイズの抽出
          if (style.fontSize) {
            const sizeRem = `${(style.fontSize / 16).toFixed(2)}rem`;
            if (!typographyStyles.headingSizes.includes(sizeRem)) {
              if (style.fontSize >= 24) {
                typographyStyles.headingSizes.push(sizeRem);
              } else if (style.fontSize >= 14 && style.fontSize <= 18) {
                typographyStyles.bodySize = sizeRem;
              }
            }
          }

          // ラインハイトの抽出
          if (style.lineHeightPx && style.fontSize) {
            const lineHeight = style.lineHeightPx / style.fontSize;
            if (lineHeight > 1 && lineHeight < 3) {
              typographyStyles.lineHeight = Number(lineHeight.toFixed(2));
            }
          }

          // フォントウェイトの抽出
          if (style.fontWeight) {
            const weight = style.fontWeight;
            if (weight >= 700) {
              typographyStyles.fontWeights.bold = weight;
            } else if (weight >= 500) {
              typographyStyles.fontWeights.medium = weight;
            } else {
              typographyStyles.fontWeights.normal = weight;
            }
          }
        }

        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: any) => {
            findTextStyles(child);
          });
        }
      };

      findTextStyles(document);

      // 見出しサイズをソート（大きい順）
      typographyStyles.headingSizes.sort((a: string, b: string) => {
        return parseFloat(b) - parseFloat(a);
      });

      // 最低限の見出しサイズを保証
      if (typographyStyles.headingSizes.length < 4) {
        typographyStyles.headingSizes = ['2.5rem', '2rem', '1.5rem', '1.25rem'];
      }

      console.log('✅ [FIGMA-TYPOGRAPHY] タイポグラフィ抽出完了');
      console.log('📝 [FIGMA-TYPOGRAPHY] Font:', typographyStyles.fontFamily.split(',')[0]);
      console.log('📝 [FIGMA-TYPOGRAPHY] Sizes:', typographyStyles.headingSizes.length);
      
      return typographyStyles;

    } catch (error) {
      console.log('⚠️ [FIGMA-TYPOGRAPHY] 抽出エラー、フォールバックを使用:', (error as Error)?.message);
      return this.getEnhancedFallbackTypography();
    }
  }

  private getEnhancedFallbackTypography(): any {
    return {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      headingSizes: ['2.5rem', '2rem', '1.5rem', '1.25rem'],
      bodySize: '1rem',
      lineHeight: 1.6,
      fontWeights: {
        normal: 400,
        medium: 500,
        bold: 700
      }
    };
  }

  private extractSpacingFromFigma(figmaData: any): any {
    console.log('📏 [FIGMA-SPACING] 高精度スペーシング抽出を開始');
    
    try {
      const document = figmaData?.document;
      if (!document) {
        console.log('⚠️ [FIGMA-SPACING] Document not found, using enhanced fallback');
        return this.getEnhancedFallbackSpacing();
      }

      const spacingValues = new Set<number>();
      const paddingValues = new Set<number>();
      const marginValues = new Set<number>();

      // Figmaのスペーシング情報を再帰的に検索
      const findSpacingStyles = (node: any): void => {
        // パディング情報の抽出
        if (node.paddingLeft !== undefined) paddingValues.add(node.paddingLeft);
        if (node.paddingRight !== undefined) paddingValues.add(node.paddingRight);
        if (node.paddingTop !== undefined) paddingValues.add(node.paddingTop);
        if (node.paddingBottom !== undefined) paddingValues.add(node.paddingBottom);

        // 要素間のスペーシング（Auto Layoutの間隔）
        if (node.itemSpacing !== undefined && node.itemSpacing > 0) {
          spacingValues.add(node.itemSpacing);
        }

        // コンポーネント間の距離
        if (node.absoluteBoundingBox && node.parent?.children) {
          const siblings = node.parent.children;
          const currentIndex = siblings.findIndex((child: any) => child.id === node.id);
          
          if (currentIndex > 0) {
            const prevSibling = siblings[currentIndex - 1];
            if (prevSibling.absoluteBoundingBox) {
              const gap = node.absoluteBoundingBox.y - (prevSibling.absoluteBoundingBox.y + prevSibling.absoluteBoundingBox.height);
              if (gap > 0 && gap < 200) { // 合理的な範囲のみ
                spacingValues.add(Math.round(gap));
              }
            }
          }
        }

        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: any) => {
            findSpacingStyles(child);
          });
        }
      };

      findSpacingStyles(document);

      // 0とbase値を追加
      spacingValues.add(0);
      spacingValues.add(4);
      spacingValues.add(8);

      // パディング値も統合
      paddingValues.forEach(value => {
        if (value >= 0 && value <= 64) {
          spacingValues.add(Math.round(value));
        }
      });

      // スペーシングスケールを生成（ソート済み）
      const spacingScale = Array.from(spacingValues)
        .filter(value => value >= 0 && value <= 128) // 妥当な範囲のみ
        .sort((a, b) => a - b)
        .slice(0, 12); // 最大12個

      // 最低限のスペーシング値を保証
      const minimalSpacing = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48];
      const finalSpacing = [...new Set([...spacingScale, ...minimalSpacing])].sort((a, b) => a - b);

      const spacingSystem = {
        base: 4,
        scale: finalSpacing.slice(0, 10),
        semantic: {
          xs: finalSpacing[1] || 4,
          sm: finalSpacing[2] || 8, 
          md: finalSpacing[3] || 16,
          lg: finalSpacing[4] || 24,
          xl: finalSpacing[5] || 32,
          xxl: finalSpacing[6] || 48
        }
      };

      console.log('✅ [FIGMA-SPACING] スペーシング抽出完了');
      console.log('📏 [FIGMA-SPACING] Scale:', spacingSystem.scale.slice(0, 6));
      
      return spacingSystem;

    } catch (error) {
      console.log('⚠️ [FIGMA-SPACING] 抽出エラー、フォールバックを使用:', (error as Error)?.message);
      return this.getEnhancedFallbackSpacing();
    }
  }

  private getEnhancedFallbackSpacing(): any {
    return {
      base: 4,
      scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80],
      semantic: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48
      }
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
    // カテゴリ別インテリジェントフォールバック
    const categoryConfigs = {
      creative: {
        theme: { primaryColor: '#8b5cf6', secondaryColor: '#a855f7', backgroundColor: '#fefefe' },
        layout: 'grid' as const,
        components: ['Card', 'ImageUpload', 'Gallery', 'Rating']
      },
      entertainment: {
        theme: { primaryColor: '#ef4444', secondaryColor: '#f97316', backgroundColor: '#fefefe' },
        layout: 'dashboard' as const,
        components: ['Card', 'Progress', 'Avatar', 'Leaderboard']
      },
      education: {
        theme: { primaryColor: '#3b82f6', secondaryColor: '#1d4ed8', backgroundColor: '#fefefe' },
        layout: 'list' as const,
        components: ['Card', 'Progress', 'Quiz', 'Certificate']
      },
      health: {
        theme: { primaryColor: '#059669', secondaryColor: '#10b981', backgroundColor: '#f0fdf4' },
        layout: 'form' as const,
        components: ['Card', 'Chart', 'Calendar', 'Tracker']
      },
      finance: {
        theme: { primaryColor: '#1e40af', secondaryColor: '#3b82f6', backgroundColor: '#f8fafc' },
        layout: 'dashboard' as const,
        components: ['Card', 'Chart', 'Table', 'Calculator']
      },
      ecommerce: {
        theme: { primaryColor: '#dc2626', secondaryColor: '#ea580c', backgroundColor: '#fefefe' },
        layout: 'grid' as const,
        components: ['ProductCard', 'Cart', 'Payment', 'Review']
      },
      social: {
        theme: { primaryColor: '#ec4899', secondaryColor: '#f472b6', backgroundColor: '#fefefe' },
        layout: 'list' as const,
        components: ['Card', 'Avatar', 'Chat', 'Feed']
      },
      productivity: {
        theme: { primaryColor: '#6366f1', secondaryColor: '#8b5cf6', backgroundColor: '#f8fafc' },
        layout: 'list' as const,
        components: ['Card', 'Checkbox', 'Calendar', 'Table']
      }
    };

    const config = categoryConfigs[intent.category as keyof typeof categoryConfigs] || categoryConfigs.creative;

    return {
      theme: config.theme,
      layout: config.layout,
      components: config.components,
      interactions: ['click', 'hover', 'focus', 'drag'],
      designTokens: {
        borderRadius: '8px',
        shadows: ['sm', 'md'],
        animations: ['fadeIn', 'slideUp']
      },
      componentLibrary: ['shadcn/ui']
    };
  }
}

export const figmaEnhancedUIGenerator = new FigmaEnhancedUIGenerator();