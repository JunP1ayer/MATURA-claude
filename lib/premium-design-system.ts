/**
 * Premium Design System
 * Dribbble/Behanceレベルの高品質デザインシステム
 */

export interface PremiumColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradient: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface PremiumTypography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
    display: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface PremiumSpacing {
  scale: 'tight' | 'normal' | 'comfortable' | 'spacious';
  base: number;
  multipliers: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
}

export interface PremiumMotion {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
    elastic: string;
  };
  transitions: {
    fade: string;
    slide: string;
    scale: string;
    bounce: string;
  };
}

export interface PremiumShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  glow: string;
  colored: string;
}

export interface PremiumDesignSystem {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'minimal' | 'luxury' | 'creative' | 'professional' | 'playful';
  mood: string[];
  colors: PremiumColorPalette;
  typography: PremiumTypography;
  spacing: PremiumSpacing;
  motion: PremiumMotion;
  shadows: PremiumShadows;
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export class PremiumDesignGenerator {
  
  /**
   * 業界とターゲットに基づいて最適なプレミアムデザインシステムを生成
   */
  generateDesignSystem(
    industry: string, 
    targetAudience: string, 
    brandPersonality: string[], 
    userRequirements: any
  ): PremiumDesignSystem {
    
    const category = this.determineCategory(industry, targetAudience, brandPersonality);
    const colors = this.generatePremiumColors(category, industry, brandPersonality);
    const typography = this.generatePremiumTypography(category, targetAudience);
    const spacing = this.generatePremiumSpacing(category);
    const motion = this.generatePremiumMotion(category, brandPersonality);
    const shadows = this.generatePremiumShadows(category);
    
    return {
      id: this.generateId(),
      name: this.generateSystemName(category, industry),
      description: this.generateDescription(category, industry, targetAudience),
      category,
      mood: brandPersonality,
      colors,
      typography,
      spacing,
      motion,
      shadows,
      borderRadius: this.generateBorderRadius(category),
      breakpoints: this.generateBreakpoints()
    };
  }
  
  /**
   * 科学的カラーパレット生成
   */
  private generatePremiumColors(
    category: string, 
    industry: string, 
    personality: string[]
  ): PremiumColorPalette {
    
    const colorSchemes = {
      modern: {
        primary: '#3B82F6',     // 信頼感のあるブルー
        secondary: '#8B5CF6',   // 革新的なパープル
        accent: '#F59E0B'       // エネルギッシュなオレンジ
      },
      minimal: {
        primary: '#1F2937',     // 洗練されたダークグレー
        secondary: '#6B7280',   // ニュートラルグレー
        accent: '#10B981'       // フレッシュなグリーン
      },
      luxury: {
        primary: '#1E1B4B',     // ディープパープル
        secondary: '#BE123C',   // リッチレッド
        accent: '#F59E0B'       // ゴールド
      },
      creative: {
        primary: '#EC4899',     // ビビッドピンク
        secondary: '#8B5CF6',   // クリエイティブパープル
        accent: '#06B6D4'       // シアン
      },
      professional: {
        primary: '#1E40AF',     // ビジネスブルー
        secondary: '#374151',   // プロフェッショナルグレー
        accent: '#059669'       // グリーン
      },
      playful: {
        primary: '#F59E0B',     // 楽しいオレンジ
        secondary: '#EC4899',   // プレイフルピンク
        accent: '#8B5CF6'       // ファンパープル
      }
    };

    const scheme = colorSchemes[category as keyof typeof colorSchemes] || colorSchemes.modern;
    
    return {
      primary: scheme.primary,
      primaryLight: this.lightenColor(scheme.primary, 20),
      primaryDark: this.darkenColor(scheme.primary, 20),
      secondary: scheme.secondary,
      secondaryLight: this.lightenColor(scheme.secondary, 20),
      secondaryDark: this.darkenColor(scheme.secondary, 20),
      accent: scheme.accent,
      accentLight: this.lightenColor(scheme.accent, 20),
      accentDark: this.darkenColor(scheme.accent, 20),
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827'
      },
      semantic: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      gradient: {
        primary: `linear-gradient(135deg, ${scheme.primary} 0%, ${this.lightenColor(scheme.primary, 30)} 100%)`,
        secondary: `linear-gradient(135deg, ${scheme.secondary} 0%, ${this.lightenColor(scheme.secondary, 30)} 100%)`,
        accent: `linear-gradient(135deg, ${scheme.accent} 0%, ${this.lightenColor(scheme.accent, 30)} 100%)`
      }
    };
  }
  
  /**
   * プレミアムタイポグラフィシステム生成
   */
  private generatePremiumTypography(category: string, targetAudience: string): PremiumTypography {
    const typographySchemes = {
      modern: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif']
      },
      minimal: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Helvetica Neue', 'sans-serif']
      },
      luxury: {
        sans: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'serif']
      },
      creative: {
        sans: ['Nunito', 'Montserrat', 'sans-serif'],
        display: ['Nunito', 'sans-serif']
      },
      professional: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        display: ['Roboto', 'sans-serif']
      },
      playful: {
        sans: ['Comic Neue', 'Quicksand', 'sans-serif'],
        display: ['Quicksand', 'sans-serif']
      }
    };

    const scheme = typographySchemes[category as keyof typeof typographySchemes] || typographySchemes.modern;
    
    return {
      fontFamily: {
        sans: scheme.sans,
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
        display: scheme.display
      },
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
        '6xl': '4rem'     // 64px
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0em',
        wide: '0.05em'
      }
    };
  }
  
  /**
   * プレミアムスペーシングシステム生成
   */
  private generatePremiumSpacing(category: string): PremiumSpacing {
    const spacingSchemes = {
      modern: { scale: 'normal' as const, base: 16 },
      minimal: { scale: 'spacious' as const, base: 20 },
      luxury: { scale: 'comfortable' as const, base: 18 },
      creative: { scale: 'comfortable' as const, base: 16 },
      professional: { scale: 'normal' as const, base: 16 },
      playful: { scale: 'tight' as const, base: 14 }
    };

    const scheme = spacingSchemes[category as keyof typeof spacingSchemes] || spacingSchemes.modern;
    
    return {
      scale: scheme.scale,
      base: scheme.base,
      multipliers: {
        xs: 0.25,   // 4px (base 16)
        sm: 0.5,    // 8px
        md: 1,      // 16px
        lg: 1.5,    // 24px
        xl: 2,      // 32px
        '2xl': 3,   // 48px
        '3xl': 4    // 64px
      }
    };
  }
  
  /**
   * プレミアムモーションシステム生成
   */
  private generatePremiumMotion(category: string, personality: string[]): PremiumMotion {
    const isPlayful = personality.includes('playful') || personality.includes('fun');
    const isLuxury = category === 'luxury';
    
    return {
      duration: {
        fast: isPlayful ? '200ms' : '150ms',
        normal: isLuxury ? '400ms' : '300ms',
        slow: isLuxury ? '800ms' : '500ms'
      },
      easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
        easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        bounce: isPlayful ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        elastic: isPlayful ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'cubic-bezier(0.4, 0.0, 0.2, 1)'
      },
      transitions: {
        fade: `opacity ${isLuxury ? '400ms' : '300ms'} cubic-bezier(0.4, 0.0, 0.2, 1)`,
        slide: `transform ${isPlayful ? '350ms' : '300ms'} cubic-bezier(0.4, 0.0, 0.2, 1)`,
        scale: `transform ${isPlayful ? '250ms' : '200ms'} cubic-bezier(0.4, 0.0, 0.2, 1)`,
        bounce: `transform ${isPlayful ? '400ms' : '300ms'} cubic-bezier(0.68, -0.55, 0.265, 1.55)`
      }
    };
  }
  
  /**
   * プレミアムシャドウシステム生成
   */
  private generatePremiumShadows(category: string): PremiumShadows {
    const isLuxury = category === 'luxury';
    const isMinimal = category === 'minimal';
    
    if (isMinimal) {
      return {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(0, 0, 0, 0.1)',
        colored: '0 4px 14px 0 rgba(0, 118, 255, 0.15)'
      };
    }
    
    if (isLuxury) {
      return {
        sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        md: '0 8px 25px -3px rgba(0, 0, 0, 0.15)',
        lg: '0 20px 40px -7px rgba(0, 0, 0, 0.2)',
        xl: '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.35)',
        inner: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        glow: '0 0 40px rgba(123, 97, 255, 0.3)',
        colored: '0 8px 32px 0 rgba(123, 97, 255, 0.25)'
      };
    }
    
    // Default modern shadows
    return {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 12px -2px rgba(0, 0, 0, 0.12)',
      lg: '0 12px 24px -4px rgba(0, 0, 0, 0.15)',
      xl: '0 24px 48px -8px rgba(0, 0, 0, 0.18)',
      '2xl': '0 32px 64px -16px rgba(0, 0, 0, 0.2)',
      inner: 'inset 0 2px 6px 0 rgba(0, 0, 0, 0.08)',
      glow: '0 0 24px rgba(59, 130, 246, 0.25)',
      colored: '0 6px 20px 0 rgba(59, 130, 246, 0.2)'
    };
  }
  
  /**
   * カテゴリ決定ロジック
   */
  private determineCategory(
    industry: string, 
    targetAudience: string, 
    personality: string[]
  ): 'modern' | 'minimal' | 'luxury' | 'creative' | 'professional' | 'playful' {
    
    // 業界ベースの判定
    if (industry.includes('finance') || industry.includes('banking') || industry.includes('insurance')) {
      return 'professional';
    }
    
    if (industry.includes('fashion') || industry.includes('jewelry') || industry.includes('real estate')) {
      return 'luxury';
    }
    
    if (industry.includes('design') || industry.includes('art') || industry.includes('media')) {
      return 'creative';
    }
    
    if (industry.includes('tech') || industry.includes('startup') || industry.includes('software')) {
      return 'modern';
    }
    
    // パーソナリティベースの判定
    if (personality.includes('fun') || personality.includes('playful') || personality.includes('energetic')) {
      return 'playful';
    }
    
    if (personality.includes('minimal') || personality.includes('clean') || personality.includes('simple')) {
      return 'minimal';
    }
    
    if (personality.includes('luxury') || personality.includes('premium') || personality.includes('elegant')) {
      return 'luxury';
    }
    
    // ターゲットオーディエンスベースの判定
    if (targetAudience.includes('children') || targetAudience.includes('young')) {
      return 'playful';
    }
    
    if (targetAudience.includes('professional') || targetAudience.includes('business')) {
      return 'professional';
    }
    
    if (targetAudience.includes('creative') || targetAudience.includes('artist')) {
      return 'creative';
    }
    
    // デフォルト
    return 'modern';
  }
  
  /**
   * ユーティリティメソッド
   */
  private generateId(): string {
    return `premium-design-${  Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateSystemName(category: string, industry: string): string {
    const categoryNames = {
      modern: 'Modern Precision',
      minimal: 'Pure Essence',
      luxury: 'Luxury Elegance',
      creative: 'Creative Flow',
      professional: 'Professional Excellence',
      playful: 'Playful Energy'
    };
    
    return categoryNames[category as keyof typeof categoryNames] || 'Premium Design';
  }
  
  private generateDescription(category: string, industry: string, audience: string): string {
    return `${category}スタイルの高品質デザインシステム。${industry}業界の${audience}向けに最適化されています。`;
  }
  
  private generateBorderRadius(category: string) {
    const radiusSchemes = {
      modern: { none: '0', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
      minimal: { none: '0', sm: '2px', md: '4px', lg: '8px', xl: '12px', full: '9999px' },
      luxury: { none: '0', sm: '6px', md: '12px', lg: '18px', xl: '24px', full: '9999px' },
      creative: { none: '0', sm: '8px', md: '16px', lg: '24px', xl: '32px', full: '9999px' },
      professional: { none: '0', sm: '3px', md: '6px', lg: '9px', xl: '12px', full: '9999px' },
      playful: { none: '0', sm: '8px', md: '16px', lg: '24px', xl: '32px', full: '9999px' }
    };
    
    return radiusSchemes[category as keyof typeof radiusSchemes] || radiusSchemes.modern;
  }
  
  private generateBreakpoints() {
    return {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    };
  }
  
  private lightenColor(color: string, percent: number): string {
    // 簡単な色の明度調整（実際の実装ではより精密な色計算を使用）
    return color; // プレースホルダー
  }
  
  private darkenColor(color: string, percent: number): string {
    // 簡単な色の暗度調整（実際の実装ではより精密な色計算を使用）
    return color; // プレースホルダー
  }
  
  /**
   * TailwindCSS設定生成
   */
  generateTailwindConfig(designSystem: PremiumDesignSystem): any {
    return {
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: designSystem.colors.primary,
              light: designSystem.colors.primaryLight,
              dark: designSystem.colors.primaryDark
            },
            secondary: {
              DEFAULT: designSystem.colors.secondary,
              light: designSystem.colors.secondaryLight,
              dark: designSystem.colors.secondaryDark
            },
            accent: {
              DEFAULT: designSystem.colors.accent,
              light: designSystem.colors.accentLight,
              dark: designSystem.colors.accentDark
            },
            neutral: designSystem.colors.neutral,
            success: designSystem.colors.semantic.success,
            warning: designSystem.colors.semantic.warning,
            error: designSystem.colors.semantic.error,
            info: designSystem.colors.semantic.info
          },
          fontFamily: designSystem.typography.fontFamily,
          fontSize: designSystem.typography.fontSize,
          fontWeight: designSystem.typography.fontWeight,
          lineHeight: designSystem.typography.lineHeight,
          letterSpacing: designSystem.typography.letterSpacing,
          borderRadius: designSystem.borderRadius,
          boxShadow: designSystem.shadows,
          screens: designSystem.breakpoints,
          transitionDuration: designSystem.motion.duration,
          transitionTimingFunction: designSystem.motion.easing
        }
      }
    };
  }
}

export const premiumDesignGenerator = new PremiumDesignGenerator();