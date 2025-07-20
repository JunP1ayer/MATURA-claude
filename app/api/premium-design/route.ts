import { NextRequest, NextResponse } from 'next/server';
import { premiumDesignGenerator } from '@/lib/premium-design-system';

export async function POST(request: NextRequest) {
  try {
    const { 
      industry = 'technology',
      targetAudience = 'professional',
      brandPersonality = ['modern', 'trustworthy'],
      userRequirements = {}
    } = await request.json();

    console.log('🎨 Generating premium design system...');
    console.log('Industry:', industry);
    console.log('Target Audience:', targetAudience);
    console.log('Brand Personality:', brandPersonality);

    const designSystem = premiumDesignGenerator.generateDesignSystem(
      industry,
      targetAudience,
      brandPersonality,
      userRequirements
    );

    // TailwindCSS設定も生成
    const tailwindConfig = premiumDesignGenerator.generateTailwindConfig(designSystem);

    console.log('✅ Premium design system generated successfully');
    console.log('Design Category:', designSystem.category);
    console.log('System Name:', designSystem.name);

    return NextResponse.json({
      success: true,
      data: {
        designSystem,
        tailwindConfig,
        cssVariables: generateCSSVariables(designSystem),
        previewComponents: generatePreviewComponents(designSystem)
      },
      summary: {
        category: designSystem.category,
        name: designSystem.name,
        description: designSystem.description,
        colorCount: Object.keys(designSystem.colors).length,
        typographyFamilies: designSystem.typography.fontFamily,
        spacingScale: designSystem.spacing.scale,
        motionStyle: designSystem.motion.duration.normal
      }
    });

  } catch (error) {
    console.error('💥 Premium design generation error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'プレミアムデザイン生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'premium-design',
    version: '1.0',
    description: 'Dribbble/Behanceレベル プレミアムデザインシステム生成',
    features: [
      'scientific-color-palette',
      'premium-typography-system',
      'advanced-spacing-system',
      'sophisticated-motion-design',
      'luxury-shadow-system',
      'responsive-breakpoints',
      'tailwind-integration',
      'css-variables-export'
    ],
    categories: [
      'modern',
      'minimal', 
      'luxury',
      'creative',
      'professional',
      'playful'
    ],
    industries: [
      'technology',
      'finance',
      'healthcare',
      'fashion',
      'real-estate',
      'education',
      'e-commerce',
      'entertainment'
    ],
    timestamp: new Date().toISOString()
  });
}

/**
 * CSS変数生成
 */
function generateCSSVariables(designSystem: any): string {
  return `
:root {
  /* Colors */
  --color-primary: ${designSystem.colors.primary};
  --color-primary-light: ${designSystem.colors.primaryLight};
  --color-primary-dark: ${designSystem.colors.primaryDark};
  --color-secondary: ${designSystem.colors.secondary};
  --color-secondary-light: ${designSystem.colors.secondaryLight};
  --color-secondary-dark: ${designSystem.colors.secondaryDark};
  --color-accent: ${designSystem.colors.accent};
  --color-accent-light: ${designSystem.colors.accentLight};
  --color-accent-dark: ${designSystem.colors.accentDark};
  
  /* Neutral Colors */
  --color-neutral-50: ${designSystem.colors.neutral[50]};
  --color-neutral-100: ${designSystem.colors.neutral[100]};
  --color-neutral-200: ${designSystem.colors.neutral[200]};
  --color-neutral-300: ${designSystem.colors.neutral[300]};
  --color-neutral-400: ${designSystem.colors.neutral[400]};
  --color-neutral-500: ${designSystem.colors.neutral[500]};
  --color-neutral-600: ${designSystem.colors.neutral[600]};
  --color-neutral-700: ${designSystem.colors.neutral[700]};
  --color-neutral-800: ${designSystem.colors.neutral[800]};
  --color-neutral-900: ${designSystem.colors.neutral[900]};
  
  /* Semantic Colors */
  --color-success: ${designSystem.colors.semantic.success};
  --color-warning: ${designSystem.colors.semantic.warning};
  --color-error: ${designSystem.colors.semantic.error};
  --color-info: ${designSystem.colors.semantic.info};
  
  /* Typography */
  --font-sans: ${designSystem.typography.fontFamily.sans.join(', ')};
  --font-serif: ${designSystem.typography.fontFamily.serif.join(', ')};
  --font-mono: ${designSystem.typography.fontFamily.mono.join(', ')};
  --font-display: ${designSystem.typography.fontFamily.display.join(', ')};
  
  /* Spacing */
  --spacing-base: ${designSystem.spacing.base}px;
  
  /* Motion */
  --duration-fast: ${designSystem.motion.duration.fast};
  --duration-normal: ${designSystem.motion.duration.normal};
  --duration-slow: ${designSystem.motion.duration.slow};
  
  /* Shadows */
  --shadow-sm: ${designSystem.shadows.sm};
  --shadow-md: ${designSystem.shadows.md};
  --shadow-lg: ${designSystem.shadows.lg};
  --shadow-xl: ${designSystem.shadows.xl};
  --shadow-2xl: ${designSystem.shadows['2xl']};
  --shadow-glow: ${designSystem.shadows.glow};
  
  /* Border Radius */
  --radius-sm: ${designSystem.borderRadius.sm};
  --radius-md: ${designSystem.borderRadius.md};
  --radius-lg: ${designSystem.borderRadius.lg};
  --radius-xl: ${designSystem.borderRadius.xl};
  --radius-full: ${designSystem.borderRadius.full};
}
  `.trim();
}

/**
 * プレビューコンポーネント生成
 */
function generatePreviewComponents(designSystem: any): any {
  return {
    button: {
      primary: `
        <button class="px-6 py-3 rounded-${designSystem.borderRadius.md} 
                       bg-primary text-white font-medium 
                       hover:bg-primary-dark transition-all duration-${designSystem.motion.duration.normal}
                       shadow-${designSystem.shadows.md}">
          Primary Button
        </button>
      `,
      secondary: `
        <button class="px-6 py-3 rounded-${designSystem.borderRadius.md} 
                       bg-secondary text-white font-medium 
                       hover:bg-secondary-dark transition-all duration-${designSystem.motion.duration.normal}
                       shadow-${designSystem.shadows.sm}">
          Secondary Button
        </button>
      `
    },
    card: `
      <div class="p-6 rounded-${designSystem.borderRadius.lg} 
                  bg-white shadow-${designSystem.shadows.lg} 
                  hover:shadow-${designSystem.shadows.xl} 
                  transition-all duration-${designSystem.motion.duration.normal}">
        <h3 class="text-${designSystem.typography.fontSize['xl']} font-${designSystem.typography.fontWeight.bold} 
                   text-neutral-800 mb-3">
          Premium Card
        </h3>
        <p class="text-neutral-600 leading-${designSystem.typography.lineHeight.relaxed}">
          This is a premium card component with sophisticated design system integration.
        </p>
      </div>
    `,
    form: `
      <div class="space-y-4">
        <div>
          <label class="block text-${designSystem.typography.fontSize.sm} font-${designSystem.typography.fontWeight.medium} 
                        text-neutral-700 mb-2">
            Email Address
          </label>
          <input type="email" 
                 class="w-full px-4 py-3 rounded-${designSystem.borderRadius.md} 
                        border border-neutral-300 focus:border-primary 
                        focus:ring-2 focus:ring-primary/20 
                        transition-all duration-${designSystem.motion.duration.fast}
                        font-${designSystem.typography.fontFamily.sans}">
        </div>
        <button class="w-full px-6 py-3 rounded-${designSystem.borderRadius.md} 
                       bg-primary text-white font-${designSystem.typography.fontWeight.medium} 
                       hover:bg-primary-dark transition-all duration-${designSystem.motion.duration.normal}
                       shadow-${designSystem.shadows.md}">
          Submit Form
        </button>
      </div>
    `
  };
}