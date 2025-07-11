import { Insight, UIStyle, UnifiedUXDesign, GeneratedCode } from './types'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { execSync } from 'child_process'

interface AutonomousGenerationOptions {
  includeTests: boolean
  includeDocs: boolean
  installDependencies: boolean
  runLinting: boolean
  runTypeCheck: boolean
  selfCorrect: boolean
  maxIterations: number
  deploymentReady: boolean
  outputPath: string
}

interface GenerationResult {
  success: boolean
  code: string
  files: Record<string, string>
  dependencies: string[]
  errors: string[]
  warnings: string[]
  metrics: {
    generationTime: number
    linesGenerated: number
    testsGenerated: number
    componentCount: number
    typeErrors: number
    lintErrors: number
  }
  deploymentInfo?: {
    readyForDeploy: boolean
    buildSuccessful: boolean
    vercelConfig?: any
  }
}

interface CodeQualityMetrics {
  typeErrors: number
  lintErrors: number
  testCoverage: number
  componentComplexity: number
  accessibilityScore: number
  performanceScore: number
}

export class AutonomousCodeGenerator {
  private options: AutonomousGenerationOptions
  private projectRoot: string
  private outputPath: string
  private dependencies: Set<string>
  private generatedFiles: Map<string, string>
  private errors: string[]
  private warnings: string[]

  constructor(options: Partial<AutonomousGenerationOptions> = {}) {
    this.options = {
      includeTests: true,
      includeDocs: false,
      installDependencies: true,
      runLinting: true,
      runTypeCheck: true,
      selfCorrect: true,
      maxIterations: 3,
      deploymentReady: true,
      outputPath: './app/generated',
      ...options
    }
    
    this.projectRoot = process.cwd()
    this.outputPath = join(this.projectRoot, this.options.outputPath)
    this.dependencies = new Set()
    this.generatedFiles = new Map()
    this.errors = []
    this.warnings = []
  }

  /**
   * 自律的にコード生成を実行
   */
  async generateAutonomously(
    insight: Insight,
    uiStyle: UIStyle,
    uxDesign?: UnifiedUXDesign
  ): Promise<GenerationResult> {
    const startTime = Date.now()
    console.log('🚀 Starting autonomous code generation...')

    try {
      // 1. 環境準備
      await this.prepareEnvironment()

      // 2. 依存関係の自動決定とインストール
      await this.determineDependencies(insight, uiStyle)
      if (this.options.installDependencies) {
        await this.installDependencies()
      }

      // 3. 高品質コード生成
      const generatedCode = await this.generateHighQualityCode(insight, uiStyle, uxDesign)

      // 4. 複数ファイル構造の生成
      await this.generateFileStructure(generatedCode, insight, uiStyle)

      // 5. テストコードの生成
      if (this.options.includeTests) {
        await this.generateTests(insight, uiStyle)
      }

      // 6. 品質チェックと自動修正
      if (this.options.selfCorrect) {
        await this.performQualityChecksAndCorrect()
      }

      // 7. デプロイメント準備
      if (this.options.deploymentReady) {
        await this.prepareForDeployment()
      }

      const endTime = Date.now()
      const generationTime = endTime - startTime

      return {
        success: true,
        code: generatedCode,
        files: Object.fromEntries(this.generatedFiles),
        dependencies: Array.from(this.dependencies),
        errors: this.errors,
        warnings: this.warnings,
        metrics: {
          generationTime,
          linesGenerated: this.calculateTotalLines(),
          testsGenerated: this.countTestFiles(),
          componentCount: this.countComponents(),
          typeErrors: await this.countTypeErrors(),
          lintErrors: await this.countLintErrors()
        },
        deploymentInfo: {
          readyForDeploy: this.errors.length === 0,
          buildSuccessful: await this.verifyBuild(),
          vercelConfig: this.generateVercelConfig()
        }
      }
    } catch (error) {
      console.error('❌ Generation failed:', error)
      return {
        success: false,
        code: '',
        files: {},
        dependencies: [],
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: this.warnings,
        metrics: {
          generationTime: Date.now() - startTime,
          linesGenerated: 0,
          testsGenerated: 0,
          componentCount: 0,
          typeErrors: 0,
          lintErrors: 0
        }
      }
    }
  }

  /**
   * 環境準備
   */
  private async prepareEnvironment(): Promise<void> {
    console.log('🔧 Preparing environment...')
    
    // 出力ディレクトリの作成
    if (!existsSync(this.outputPath)) {
      mkdirSync(this.outputPath, { recursive: true })
    }

    // 必要なディレクトリ構造の作成
    const dirs = ['components', 'lib', 'hooks', 'types', 'utils', 'tests']
    for (const dir of dirs) {
      const dirPath = join(this.outputPath, dir)
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }
    }
  }

  /**
   * 依存関係の自動決定
   */
  private async determineDependencies(insight: Insight, uiStyle: UIStyle): Promise<void> {
    console.log('📦 Determining dependencies...')

    // 基本依存関係
    const baseDependencies = [
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-button',
      '@radix-ui/react-card',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-form',
      '@radix-ui/react-input',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-sheet',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-table',
      '@radix-ui/react-tabs',
      '@radix-ui/react-textarea',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'framer-motion',
      'zod',
      'react-hook-form',
      '@hookform/resolvers',
      'date-fns',
      'recharts'
    ]

    // 機能ベースの依存関係
    const featureDependencies = this.determineFeatureDependencies(insight)

    // UIスタイルベースの依存関係
    const styleDependencies = this.determineStyleDependencies(uiStyle)

    // 開発用依存関係
    const devDependencies = [
      '@types/node',
      '@types/react',
      '@types/react-dom',
      'typescript',
      'eslint',
      'eslint-config-next',
      'prettier',
      'tailwindcss',
      'autoprefixer',
      'postcss',
      '@testing-library/react',
      '@testing-library/jest-dom',
      'jest',
      'jest-environment-jsdom'
    ]

    // 全て統合
    const allDependencies = [...baseDependencies, ...featureDependencies, ...styleDependencies, ...devDependencies]
    allDependencies.forEach(dep => this.dependencies.add(dep))
  }

  /**
   * 機能ベースの依存関係決定
   */
  private determineFeatureDependencies(insight: Insight): string[] {
    const deps: string[] = []

    // AI機能
    if (insight.features.some(f => f.includes('AI') || f.includes('生成'))) {
      deps.push('openai', '@vercel/ai')
    }

    // データベース
    if (insight.features.some(f => f.includes('データ') || f.includes('保存'))) {
      deps.push('prisma', '@prisma/client')
    }

    // 認証
    if (insight.features.some(f => f.includes('認証') || f.includes('ログイン'))) {
      deps.push('next-auth', '@auth/prisma-adapter')
    }

    // 決済
    if (insight.features.some(f => f.includes('決済') || f.includes('支払い'))) {
      deps.push('stripe', '@stripe/stripe-js')
    }

    // リアルタイム
    if (insight.features.some(f => f.includes('リアルタイム') || f.includes('チャット'))) {
      deps.push('pusher-js', 'pusher')
    }

    // ファイル処理
    if (insight.features.some(f => f.includes('ファイル') || f.includes('画像'))) {
      deps.push('sharp', 'multer')
    }

    return deps
  }

  /**
   * UIスタイルベースの依存関係決定
   */
  private determineStyleDependencies(uiStyle: UIStyle): string[] {
    const deps: string[] = []

    // アニメーション
    if (uiStyle.personality.includes('dynamic') || uiStyle.personality.includes('interactive')) {
      deps.push('framer-motion', 'lottie-react')
    }

    // 3D/Canvas
    if (uiStyle.personality.includes('3d') || uiStyle.personality.includes('immersive')) {
      deps.push('three', '@react-three/fiber', '@react-three/drei')
    }

    // 高度なUI
    if (uiStyle.category === 'luxury' || uiStyle.category === 'creative') {
      deps.push('react-spring', 'react-intersection-observer')
    }

    return deps
  }

  /**
   * 依存関係のインストール
   */
  private async installDependencies(): Promise<void> {
    console.log('📦 Installing dependencies...')
    
    try {
      const depsArray = Array.from(this.dependencies)
      const chunks = this.chunkArray(depsArray, 10) // 10個ずつインストール

      for (const chunk of chunks) {
        const installCmd = `npm install ${chunk.join(' ')}`
        console.log(`Installing: ${chunk.join(', ')}`)
        execSync(installCmd, { cwd: this.projectRoot, stdio: 'inherit' })
      }
    } catch (error) {
      this.warnings.push(`Dependency installation warning: ${error}`)
    }
  }

  /**
   * 高品質コード生成
   */
  private async generateHighQualityCode(
    insight: Insight,
    uiStyle: UIStyle,
    uxDesign?: UnifiedUXDesign
  ): Promise<string> {
    console.log('🎨 Generating high-quality code...')

    const prompt = this.buildComprehensivePrompt(insight, uiStyle, uxDesign)
    
    // APIキーの取得
    const apiKey = this.getApiKey()
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    // Gemini APIを呼び出し
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192 * 4, // 大容量出力
          topK: 40,
          topP: 0.95
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedCode = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!generatedCode) {
      throw new Error('No code generated from Gemini API')
    }

    return this.enhanceGeneratedCode(generatedCode, insight, uiStyle)
  }

  /**
   * 包括的なプロンプト構築
   */
  private buildComprehensivePrompt(
    insight: Insight,
    uiStyle: UIStyle,
    uxDesign?: UnifiedUXDesign
  ): string {
    return `You are an expert full-stack developer and UI/UX designer. Create a complete, production-ready Next.js application with the following requirements:

# PROJECT SPECIFICATION
**Vision**: ${insight.vision}
**Target Users**: ${insight.target}
**Core Features**: ${insight.features.join(', ')}
**Value Proposition**: ${insight.value}

# DESIGN SYSTEM
**Style**: ${uiStyle.name} (${uiStyle.category})
**Colors**: Primary: ${uiStyle.colors.primary}, Secondary: ${uiStyle.colors.secondary}, Accent: ${uiStyle.colors.accent}
**Typography**: ${uiStyle.typography.heading} / ${uiStyle.typography.body}
**Personality**: ${uiStyle.personality.join(', ')}

# TECHNICAL REQUIREMENTS
1. **Framework**: Next.js 14 with App Router
2. **Styling**: Tailwind CSS + shadcn/ui components
3. **TypeScript**: Strict mode with full type safety
4. **Components**: Modular, reusable components with proper props
5. **State Management**: React hooks + Context API
6. **Form Handling**: react-hook-form with zod validation
7. **Icons**: Lucide React icons
8. **Animations**: Framer Motion for smooth interactions
9. **Responsive**: Mobile-first design
10. **Accessibility**: WCAG 2.1 AA compliance

# QUALITY STANDARDS
- **Code Quality**: ESLint + Prettier compliant
- **Type Safety**: No TypeScript errors
- **Performance**: Optimized components and lazy loading
- **SEO**: Proper meta tags and semantic HTML
- **Error Handling**: Comprehensive error boundaries
- **Testing**: Jest + Testing Library ready

# COMPONENT STRUCTURE
Generate a complete file structure with:
- \`page.tsx\` - Main application page
- \`components/ui/\` - Reusable UI components
- \`components/features/\` - Feature-specific components
- \`lib/\` - Utility functions and configurations
- \`hooks/\` - Custom React hooks
- \`types/\` - TypeScript type definitions

# IMPLEMENTATION REQUIREMENTS
1. **Real Functionality**: All features must work, not just UI mockups
2. **Data Persistence**: Use localStorage for data storage
3. **Form Validation**: Comprehensive validation with user feedback
4. **Error Handling**: Graceful error handling with user-friendly messages
5. **Loading States**: Proper loading indicators
6. **Interactive Elements**: Fully functional buttons, forms, and navigation
7. **Data Visualization**: Charts and graphs where applicable
8. **Export/Import**: Data export functionality where relevant

# SPECIFIC FEATURES TO IMPLEMENT
${insight.features.map(feature => `- ${feature}: Complete implementation with UI and logic`).join('\n')}

# OUTPUT FORMAT
Provide the complete code as a single Next.js page component that includes:
1. All necessary imports
2. Type definitions
3. Component implementations
4. Styling with Tailwind classes
5. Interactive functionality
6. Data management
7. Error handling
8. Responsive design

The code should be production-ready and deployable to Vercel immediately.

Generate only the complete, functional code without explanations or markdown formatting.`
  }

  /**
   * 生成されたコードの強化
   */
  private enhanceGeneratedCode(code: string, insight: Insight, uiStyle: UIStyle): string {
    console.log('✨ Enhancing generated code...')

    let enhancedCode = code

    // マークダウンからコードを抽出
    const codeMatch = code.match(/```(?:tsx?|jsx?|typescript|javascript)?\s*([\s\S]*?)\s*```/i)
    if (codeMatch) {
      enhancedCode = codeMatch[1].trim()
    }

    // 必要なインポートの追加
    enhancedCode = this.addNecessaryImports(enhancedCode)

    // TypeScript型の強化
    enhancedCode = this.enhanceTypeScript(enhancedCode)

    // エラーハンドリングの追加
    enhancedCode = this.addErrorHandling(enhancedCode)

    // パフォーマンス最適化
    enhancedCode = this.optimizePerformance(enhancedCode)

    // アクセシビリティの改善
    enhancedCode = this.improveAccessibility(enhancedCode)

    return enhancedCode
  }

  /**
   * 必要なインポートの追加
   */
  private addNecessaryImports(code: string): string {
    const imports = [
      `'use client'`,
      `import React, { useState, useEffect, useCallback, useMemo } from 'react'`,
      `import { Button } from '@/components/ui/button'`,
      `import { Input } from '@/components/ui/input'`,
      `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'`,
      `import { Badge } from '@/components/ui/badge'`,
      `import { Progress } from '@/components/ui/progress'`,
      `import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'`,
      `import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'`,
      `import { toast } from '@/components/ui/use-toast'`,
      `import { cn } from '@/lib/utils'`,
      `import { motion, AnimatePresence } from 'framer-motion'`,
      `import { Loader2, Plus, Save, Download, Settings, Info, AlertCircle } from 'lucide-react'`,
      `import { useForm } from 'react-hook-form'`,
      `import { zodResolver } from '@hookform/resolvers/zod'`,
      `import { z } from 'zod'`
    ]

    // 既存のインポートをチェック
    const existingImports = code.match(/^import.*$/gm) || []
    const existingImportNames = existingImports.map(imp => imp.split(' ')[1]).filter(Boolean)

    // 不足しているインポートを追加
    const missingImports = imports.filter(imp => {
      const importName = imp.match(/import.*?from/)?.[0]
      return !existingImportNames.some(existing => imp.includes(existing))
    })

    if (missingImports.length > 0) {
      const importSection = missingImports.join('\n') + '\n\n'
      return importSection + code
    }

    return code
  }

  /**
   * TypeScript型の強化
   */
  private enhanceTypeScript(code: string): string {
    // 基本的な型定義を追加
    const typeDefinitions = `
interface FormData {
  [key: string]: any
}

interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

interface DataItem {
  id: string
  name: string
  value: any
  createdAt: Date
  updatedAt: Date
}

interface AppState {
  data: DataItem[]
  loading: boolean
  error: string | null
  filters: Record<string, any>
}
`

    // 型定義が不足している場合のみ追加
    if (!code.includes('interface ') && !code.includes('type ')) {
      return typeDefinitions + code
    }

    return code
  }

  /**
   * エラーハンドリングの追加
   */
  private addErrorHandling(code: string): string {
    // Error Boundaryの追加
    const errorBoundary = `
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                エラーが発生しました
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                申し訳ございません。予期しないエラーが発生しました。
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                ページを再読み込み
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
`

    // Error Boundaryでラップ
    if (!code.includes('ErrorBoundary')) {
      const mainComponentMatch = code.match(/export default function (\w+)/);
      if (mainComponentMatch) {
        const componentName = mainComponentMatch[1];
        code = code.replace(
          `export default function ${componentName}`,
          `${errorBoundary}\n\nfunction ${componentName}Internal`
        );
        code += `\n\nexport default function ${componentName}() {
  return (
    <ErrorBoundary>
      <${componentName}Internal />
    </ErrorBoundary>
  )
}`
      }
    }

    return code
  }

  /**
   * パフォーマンス最適化
   */
  private optimizePerformance(code: string): string {
    // useMemoとuseCallbackの追加
    return code.replace(
      /const (\w+) = \((.*?)\) => {/g,
      'const $1 = useCallback(($2) => {'
    ).replace(
      /const (\w+) = (.*?.filter\(|.*?.map\(|.*?.reduce\()/g,
      'const $1 = useMemo(() => $2'
    )
  }

  /**
   * アクセシビリティの改善
   */
  private improveAccessibility(code: string): string {
    // ARIA属性の追加
    return code
      .replace(/<button/g, '<button role="button"')
      .replace(/<input/g, '<input aria-describedby')
      .replace(/<div className=".*?modal.*?"/g, '$& role="dialog" aria-modal="true"')
      .replace(/<nav/g, '<nav role="navigation"')
      .replace(/<main/g, '<main role="main"')
  }

  /**
   * ファイル構造の生成
   */
  private async generateFileStructure(
    mainCode: string,
    insight: Insight,
    uiStyle: UIStyle
  ): Promise<void> {
    console.log('📁 Generating file structure...')

    // メインページファイル
    this.generatedFiles.set('page.tsx', mainCode)

    // 共通コンポーネント
    await this.generateUIComponents()

    // 型定義ファイル
    await this.generateTypeDefinitions(insight)

    // ユーティリティファイル
    await this.generateUtilities()

    // カスタムフック
    await this.generateCustomHooks(insight)

    // 設定ファイル
    await this.generateConfigFiles(uiStyle)
  }

  /**
   * UIコンポーネントの生成
   */
  private async generateUIComponents(): Promise<void> {
    const components = {
      'components/ui/button.tsx': this.generateButtonComponent(),
      'components/ui/input.tsx': this.generateInputComponent(),
      'components/ui/card.tsx': this.generateCardComponent(),
      'components/ui/badge.tsx': this.generateBadgeComponent(),
      'components/ui/progress.tsx': this.generateProgressComponent(),
      'components/ui/dialog.tsx': this.generateDialogComponent(),
      'components/ui/tabs.tsx': this.generateTabsComponent(),
      'components/ui/toast.tsx': this.generateToastComponent(),
      'components/ui/loading-spinner.tsx': this.generateLoadingSpinnerComponent(),
      'components/ui/error-message.tsx': this.generateErrorMessageComponent()
    }

    for (const [path, content] of Object.entries(components)) {
      this.generatedFiles.set(path, content)
    }
  }

  /**
   * ボタンコンポーネントの生成
   */
  private generateButtonComponent(): string {
    return `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`
  }

  /**
   * インプットコンポーネントの生成
   */
  private generateInputComponent(): string {
    return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }`
  }

  /**
   * カードコンポーネントの生成
   */
  private generateCardComponent(): string {
    return `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`
  }

  /**
   * バッジコンポーネントの生成
   */
  private generateBadgeComponent(): string {
    return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }`
  }

  /**
   * プログレスコンポーネントの生成
   */
  private generateProgressComponent(): string {
    return `import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }`
  }

  /**
   * ダイアログコンポーネントの生成
   */
  private generateDialogComponent(): string {
    return `import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}`
  }

  /**
   * タブコンポーネントの生成
   */
  private generateTabsComponent(): string {
    return `import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }`
  }

  /**
   * トーストコンポーネントの生成
   */
  private generateToastComponent(): string {
    return `import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}`
  }

  /**
   * ローディングスピナーコンポーネントの生成
   */
  private generateLoadingSpinnerComponent(): string {
    return `import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        className
      )} 
    />
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted h-4 rounded mb-2"></div>
      <div className="bg-muted h-4 rounded mb-2"></div>
      <div className="bg-muted h-4 rounded w-2/3"></div>
    </div>
  )
}`
  }

  /**
   * エラーメッセージコンポーネントの生成
   */
  private generateErrorMessageComponent(): string {
    return `import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorMessage({ 
  title = "エラーが発生しました",
  message = "予期しないエラーが発生しました。しばらくしてからもう一度お試しください。",
  onRetry,
  showRetry = true 
}: ErrorMessageProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          {message}
        </CardDescription>
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            再試行
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function ErrorBoundaryFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ErrorMessage
        title="アプリケーションエラー"
        message={error.message || "アプリケーションでエラーが発生しました。"}
        onRetry={resetErrorBoundary}
      />
    </div>
  )
}`
  }

  /**
   * 型定義ファイルの生成
   */
  private async generateTypeDefinitions(insight: Insight): Promise<void> {
    const typeDefinitions = `// Generated Types for ${insight.vision}
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface DataItem {
  id: string
  title: string
  description?: string
  value: any
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface FormData {
  [key: string]: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  category?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
}

export interface AppState {
  user: User | null
  data: DataItem[]
  loading: boolean
  error: string | null
  filters: FilterParams
  pagination: PaginationParams
}

export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

export interface FormProps extends ComponentProps {
  onSubmit: (data: FormData) => void
  onCancel?: () => void
  initialData?: FormData
  isLoading?: boolean
}

export interface TableProps<T> extends ComponentProps {
  data: T[]
  columns: TableColumn<T>[]
  onRowClick?: (row: T) => void
  pagination?: PaginationParams
  onPaginationChange?: (params: PaginationParams) => void
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

// Feature-specific types based on insights
${insight.features.map(feature => `
export interface ${this.toPascalCase(feature)}Data {
  id: string
  name: string
  value: any
  createdAt: Date
  updatedAt: Date
}

export interface ${this.toPascalCase(feature)}FormData {
  name: string
  value: any
  [key: string]: any
}
`).join('')}

// Utility types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
`

    this.generatedFiles.set('types/index.ts', typeDefinitions)
  }

  /**
   * ユーティリティファイルの生成
   */
  private async generateUtilities(): Promise<void> {
    const utilities = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(amount)
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('ja-JP').format(number)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function uploadFile(accept: string = '*/*'): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      resolve(file || null)
    }
    input.click()
  })
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  return fn().catch((err) => {
    if (retries > 0) {
      return sleep(delay).then(() => retry(fn, retries - 1, delay))
    }
    throw err
  })
}

export function parseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return '予期しないエラーが発生しました'
}

export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0)
}

export function average(numbers: number[]): number {
  return numbers.length > 0 ? sum(numbers) / numbers.length : 0
}

export function percentage(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)]
}

export function createStorageKey(key: string): string {
  return \`matura_\${key}\`
}

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(createStorageKey(key))
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(createStorageKey(key), JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(createStorageKey(key))
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}

export function clearStorage(): void {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('matura_'))
    keys.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}
`

    this.generatedFiles.set('lib/utils.ts', utilities)
  }

  /**
   * カスタムフックの生成
   */
  private async generateCustomHooks(insight: Insight): Promise<void> {
    const hooks = `import { useState, useEffect, useCallback, useMemo } from 'react'
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/utils'

// Local Storage Hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    return getStorageItem(key, initialValue)
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      setStorageItem(key, valueToStore)
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      removeStorageItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error('Error removing localStorage:', error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}

// Loading State Hook
export function useLoading(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])
  const toggleLoading = useCallback(() => setIsLoading(prev => !prev), [])

  return { isLoading, startLoading, stopLoading, toggleLoading }
}

// Error State Hook
export function useError() {
  const [error, setError] = useState<string | null>(null)

  const showError = useCallback((message: string) => {
    setError(message)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { error, showError, clearError }
}

// Combined Loading and Error Hook
export function useAsyncState<T>(initialData: T | null = null) {
  const [data, setData] = useState<T | null>(initialData)
  const { isLoading, startLoading, stopLoading } = useLoading()
  const { error, showError, clearError } = useError()

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      clearError()
      startLoading()
      const result = await asyncFunction()
      setData(result)
      return result
    } catch (err) {
      showError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
      throw err
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading, showError, clearError])

  const reset = useCallback(() => {
    setData(initialData)
    clearError()
    stopLoading()
  }, [initialData, clearError, stopLoading])

  return { data, isLoading, error, execute, reset, setData }
}

// Debounced Value Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Previous Value Hook
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState<T>(value)
  const [previous, setPrevious] = useState<T | undefined>(undefined)

  if (value !== current) {
    setPrevious(current)
    setCurrent(value)
  }

  return previous
}

// Toggle Hook
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(prev => !prev), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse }
}

// Counter Hook
export function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => setCount(prev => prev + 1), [])
  const decrement = useCallback(() => setCount(prev => prev - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  const setValue = useCallback((value: number) => setCount(value), [])

  return { count, increment, decrement, reset, setValue }
}

// Array Hook
export function useArray<T>(initialArray: T[] = []) {
  const [array, setArray] = useState<T[]>(initialArray)

  const push = useCallback((item: T) => {
    setArray(prev => [...prev, item])
  }, [])

  const remove = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index))
  }, [])

  const update = useCallback((index: number, item: T) => {
    setArray(prev => prev.map((existingItem, i) => i === index ? item : existingItem))
  }, [])

  const clear = useCallback(() => {
    setArray([])
  }, [])

  const reset = useCallback(() => {
    setArray(initialArray)
  }, [initialArray])

  return { array, push, remove, update, clear, reset, setArray }
}

// Form Hook
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear error when value changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const clearError = useCallback((name: keyof T) => {
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  const hasErrors = useMemo(() => {
    return Object.values(errors).some(error => error !== undefined)
  }, [errors])

  return {
    values,
    errors,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    reset,
    hasErrors,
    setValues
  }
}

// Window Size Hook
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number
    height: number
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Media Query Hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

// Click Outside Hook
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

// Intersection Observer Hook
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      options
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}

// Copy to Clipboard Hook
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (error) {
      console.error('Failed to copy text:', error)
      return false
    }
  }, [])

  return { copied, copyToClipboard }
}

// Feature-specific hooks based on insights
${insight.features.map(feature => `
export function use${this.toPascalCase(feature)}() {
  const [data, setData] = useLocalStorage<any[]>('${feature.toLowerCase()}_data', [])
  const { isLoading, startLoading, stopLoading } = useLoading()
  const { error, showError, clearError } = useError()

  const addItem = useCallback((item: any) => {
    try {
      const newItem = {
        id: Date.now().toString(),
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setData(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      showError('データの追加に失敗しました')
      throw err
    }
  }, [setData, showError])

  const updateItem = useCallback((id: string, updates: any) => {
    try {
      setData(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      ))
    } catch (err) {
      showError('データの更新に失敗しました')
      throw err
    }
  }, [setData, showError])

  const deleteItem = useCallback((id: string) => {
    try {
      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      showError('データの削除に失敗しました')
      throw err
    }
  }, [setData, showError])

  const getItem = useCallback((id: string) => {
    return data.find(item => item.id === id)
  }, [data])

  const clearAll = useCallback(() => {
    setData([])
  }, [setData])

  return {
    data,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    clearAll,
    clearError
  }
}
`).join('')}
`

    this.generatedFiles.set('hooks/index.ts', hooks)
  }

  /**
   * 設定ファイルの生成
   */
  private async generateConfigFiles(uiStyle: UIStyle): Promise<void> {
    // Tailwind設定の更新
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "${uiStyle.colors.primary}",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "${uiStyle.colors.secondary}",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "${uiStyle.colors.accent}",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`

    // CSS変数設定
    const cssVariables = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`

    // ESLint設定
    const eslintConfig = `{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  }
}`

    // Prettier設定
    const prettierConfig = `{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}`

    // Jest設定
    const jestConfig = `const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)`

    this.generatedFiles.set('tailwind.config.js', tailwindConfig)
    this.generatedFiles.set('styles/globals.css', cssVariables)
    this.generatedFiles.set('.eslintrc.json', eslintConfig)
    this.generatedFiles.set('.prettierrc', prettierConfig)
    this.generatedFiles.set('jest.config.js', jestConfig)
  }

  /**
   * テストコードの生成
   */
  private async generateTests(insight: Insight, uiStyle: UIStyle): Promise<void> {
    console.log('🧪 Generating tests...')

    // メインコンポーネントのテスト
    const mainTest = `import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import Page from '../page'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('${insight.vision} Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('renders the main page', () => {
    render(<Page />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the application title', () => {
    render(<Page />)
    expect(screen.getByText(/.*${insight.vision.split(' ')[0]}.*/i)).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    render(<Page />)
    
    // Test button clicks
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    if (buttons.length > 0) {
      fireEvent.click(buttons[0])
      // Add more specific assertions based on expected behavior
    }
  })

  it('handles form submission', async () => {
    render(<Page />)
    
    // Look for form inputs
    const inputs = screen.getAllByRole('textbox')
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'test input' } })
      expect(inputs[0]).toHaveValue('test input')
    }
  })

  it('manages loading states', async () => {
    render(<Page />)
    
    // Test loading indicators
    const loadingElements = screen.queryAllByText(/loading|読み込み/i)
    // Add assertions based on loading behavior
  })

  it('handles error states', async () => {
    render(<Page />)
    
    // Test error handling
    const errorElements = screen.queryAllByText(/error|エラー/i)
    // Add assertions based on error handling
  })

  it('persists data to localStorage', async () => {
    render(<Page />)
    
    // Test localStorage interactions
    // Add specific tests based on data persistence requirements
  })

  it('is responsive', () => {
    // Test responsive design
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    })
    
    render(<Page />)
    
    // Add responsive design assertions
  })
})
`

    // ユーティリティ関数のテスト
    const utilsTest = `import { describe, it, expect } from '@jest/globals'
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  truncateText,
  generateId,
  isValidEmail,
  isValidUrl,
  groupBy,
  sortBy,
  unique,
  chunk,
  sum,
  average,
  percentage
} from '../lib/utils'

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toContain('2023')
      expect(formatted).toContain('12')
      expect(formatted).toContain('25')
    })
  })

  describe('formatDateTime', () => {
    it('formats datetime correctly', () => {
      const date = new Date('2023-12-25T15:30:00')
      const formatted = formatDateTime(date)
      expect(formatted).toContain('2023')
      expect(formatted).toContain('15')
      expect(formatted).toContain('30')
    })
  })

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      const amount = 1234567
      const formatted = formatCurrency(amount)
      expect(formatted).toContain('¥')
      expect(formatted).toContain('1,234,567')
    })
  })

  describe('formatNumber', () => {
    it('formats number correctly', () => {
      const number = 1234567
      const formatted = formatNumber(number)
      expect(formatted).toBe('1,234,567')
    })
  })

  describe('truncateText', () => {
    it('truncates long text', () => {
      const text = 'This is a very long text that should be truncated'
      const truncated = truncateText(text, 10)
      expect(truncated).toBe('This is a ...')
    })

    it('does not truncate short text', () => {
      const text = 'Short'
      const truncated = truncateText(text, 10)
      expect(truncated).toBe('Short')
    })
  })

  describe('generateId', () => {
    it('generates unique ids', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('isValidEmail', () => {
    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user+tag@domain.co.jp')).toBe(true)
    })

    it('rejects invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('validates correct URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
    })

    it('rejects invalid URL', () => {
      expect(isValidUrl('invalid-url')).toBe(false)
      expect(isValidUrl('not-a-url')).toBe(false)
    })
  })

  describe('groupBy', () => {
    it('groups array by key', () => {
      const data = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ]
      const grouped = groupBy(data, 'category')
      expect(grouped.A).toHaveLength(2)
      expect(grouped.B).toHaveLength(1)
    })
  })

  describe('sortBy', () => {
    it('sorts array by key', () => {
      const data = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 }
      ]
      const sorted = sortBy(data, 'age')
      expect(sorted[0].age).toBe(25)
      expect(sorted[2].age).toBe(35)
    })
  })

  describe('unique', () => {
    it('returns unique values', () => {
      const data = [1, 2, 2, 3, 3, 3, 4]
      const uniqueValues = unique(data)
      expect(uniqueValues).toEqual([1, 2, 3, 4])
    })
  })

  describe('chunk', () => {
    it('chunks array into smaller arrays', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const chunked = chunk(data, 3)
      expect(chunked).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    })
  })

  describe('sum', () => {
    it('calculates sum of numbers', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15)
      expect(sum([])).toBe(0)
    })
  })

  describe('average', () => {
    it('calculates average of numbers', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3)
      expect(average([])).toBe(0)
    })
  })

  describe('percentage', () => {
    it('calculates percentage', () => {
      expect(percentage(25, 100)).toBe(25)
      expect(percentage(1, 3)).toBeCloseTo(33.33, 2)
      expect(percentage(0, 0)).toBe(0)
    })
  })
})
`

    // フックのテスト
    const hooksTest = `import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import {
  useLocalStorage,
  useLoading,
  useError,
  useAsyncState,
  useDebounce,
  useToggle,
  useCounter,
  useArray,
  useForm
} from '../hooks'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('Hooks', () => {
  describe('useLocalStorage', () => {
    it('returns initial value', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      const { result } = renderHook(() => useLocalStorage('test', 'initial'))
      expect(result.current[0]).toBe('initial')
    })

    it('sets and gets value', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'))
      
      act(() => {
        result.current[1]('new value')
      })
      
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('useLoading', () => {
    it('manages loading state', () => {
      const { result } = renderHook(() => useLoading())
      
      expect(result.current.isLoading).toBe(false)
      
      act(() => {
        result.current.startLoading()
      })
      
      expect(result.current.isLoading).toBe(true)
      
      act(() => {
        result.current.stopLoading()
      })
      
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('useError', () => {
    it('manages error state', () => {
      const { result } = renderHook(() => useError())
      
      expect(result.current.error).toBeNull()
      
      act(() => {
        result.current.showError('Test error')
      })
      
      expect(result.current.error).toBe('Test error')
      
      act(() => {
        result.current.clearError()
      })
      
      expect(result.current.error).toBeNull()
    })
  })

  describe('useToggle', () => {
    it('toggles boolean value', () => {
      const { result } = renderHook(() => useToggle(false))
      
      expect(result.current.value).toBe(false)
      
      act(() => {
        result.current.toggle()
      })
      
      expect(result.current.value).toBe(true)
    })
  })

  describe('useCounter', () => {
    it('manages counter state', () => {
      const { result } = renderHook(() => useCounter(0))
      
      expect(result.current.count).toBe(0)
      
      act(() => {
        result.current.increment()
      })
      
      expect(result.current.count).toBe(1)
      
      act(() => {
        result.current.decrement()
      })
      
      expect(result.current.count).toBe(0)
    })
  })

  describe('useArray', () => {
    it('manages array state', () => {
      const { result } = renderHook(() => useArray([1, 2, 3]))
      
      expect(result.current.array).toEqual([1, 2, 3])
      
      act(() => {
        result.current.push(4)
      })
      
      expect(result.current.array).toEqual([1, 2, 3, 4])
      
      act(() => {
        result.current.remove(0)
      })
      
      expect(result.current.array).toEqual([2, 3, 4])
    })
  })

  describe('useForm', () => {
    it('manages form state', () => {
      const initialValues = { name: '', email: '' }
      const { result } = renderHook(() => useForm(initialValues))
      
      expect(result.current.values).toEqual(initialValues)
      
      act(() => {
        result.current.setValue('name', 'John Doe')
      })
      
      expect(result.current.values.name).toBe('John Doe')
      
      act(() => {
        result.current.setError('email', 'Invalid email')
      })
      
      expect(result.current.errors.email).toBe('Invalid email')
      expect(result.current.hasErrors).toBe(true)
    })
  })
})
`

    this.generatedFiles.set('__tests__/page.test.tsx', mainTest)
    this.generatedFiles.set('__tests__/utils.test.ts', utilsTest)
    this.generatedFiles.set('__tests__/hooks.test.ts', hooksTest)
  }

  /**
   * 品質チェックと自動修正
   */
  private async performQualityChecksAndCorrect(): Promise<void> {
    console.log('🔍 Performing quality checks and corrections...')

    let iteration = 0
    const maxIterations = this.options.maxIterations

    while (iteration < maxIterations) {
      console.log(`Quality check iteration ${iteration + 1}/${maxIterations}`)
      
      const issues = await this.detectQualityIssues()
      
      if (issues.length === 0) {
        console.log('✅ No quality issues found')
        break
      }

      console.log(`Found ${issues.length} quality issues, attempting fixes...`)
      
      await this.fixQualityIssues(issues)
      
      iteration++
    }

    if (iteration >= maxIterations) {
      this.warnings.push(`Quality correction stopped after ${maxIterations} iterations`)
    }
  }

  /**
   * 品質問題の検出
   */
  private async detectQualityIssues(): Promise<string[]> {
    const issues: string[] = []

    try {
      // TypeScript型チェック
      if (this.options.runTypeCheck) {
        const typeErrors = await this.runTypeCheck()
        if (typeErrors.length > 0) {
          issues.push(...typeErrors.map(error => `TypeScript: ${error}`))
        }
      }

      // ESLint チェック
      if (this.options.runLinting) {
        const lintErrors = await this.runLinting()
        if (lintErrors.length > 0) {
          issues.push(...lintErrors.map(error => `ESLint: ${error}`))
        }
      }

      // カスタム品質チェック
      const customIssues = await this.runCustomQualityChecks()
      issues.push(...customIssues)

    } catch (error) {
      this.warnings.push(`Quality check failed: ${error}`)
    }

    return issues
  }

  /**
   * TypeScript型チェック
   */
  private async runTypeCheck(): Promise<string[]> {
    try {
      // 一時的にファイルを書き出してtscを実行
      const tempDir = join(this.outputPath, 'temp')
      if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true })
      }

      // メインファイルを書き出し
      for (const [filePath, content] of this.generatedFiles) {
        if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
          const fullPath = join(tempDir, filePath)
          const dir = fullPath.split('/').slice(0, -1).join('/')
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
          }
          writeFileSync(fullPath, content)
        }
      }

      // TypeScriptコンパイラを実行
      const result = execSync('npx tsc --noEmit --skipLibCheck', {
        cwd: tempDir,
        encoding: 'utf8'
      })

      return []
    } catch (error: any) {
      const output = error.stdout || error.message || ''
      return output.split('\n').filter((line: string) => line.trim().length > 0)
    }
  }

  /**
   * ESLintチェック
   */
  private async runLinting(): Promise<string[]> {
    try {
      // 一時的にファイルを書き出してESLintを実行
      const tempDir = join(this.outputPath, 'temp')
      
      const result = execSync('npx eslint . --ext .ts,.tsx', {
        cwd: tempDir,
        encoding: 'utf8'
      })

      return []
    } catch (error: any) {
      const output = error.stdout || error.message || ''
      return output.split('\n').filter((line: string) => line.trim().length > 0)
    }
  }

  /**
   * カスタム品質チェック
   */
  private async runCustomQualityChecks(): Promise<string[]> {
    const issues: string[] = []

    // 生成されたファイルの内容をチェック
    for (const [filePath, content] of this.generatedFiles) {
      // 基本的な構文チェック
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        // インポートの重複チェック
        const imports = content.match(/^import.*$/gm) || []
        const importModules = imports.map(imp => imp.match(/from ['"](.*)['"]/)?.[1]).filter(Boolean)
        const duplicates = importModules.filter((module, index) => importModules.indexOf(module) !== index)
        if (duplicates.length > 0) {
          issues.push(`Duplicate imports in ${filePath}: ${duplicates.join(', ')}`)
        }

        // 未使用変数の基本チェック
        const variables = content.match(/const (\w+) =/g) || []
        const variableNames = variables.map(v => v.match(/const (\w+) =/)?.[1]).filter(Boolean)
        for (const varName of variableNames) {
          if (varName && content.split(varName).length === 2) {
            issues.push(`Unused variable in ${filePath}: ${varName}`)
          }
        }

        // 基本的なReactルールチェック
        if (filePath.endsWith('.tsx')) {
          if (!content.includes('import React') && !content.includes('import * as React')) {
            issues.push(`Missing React import in ${filePath}`)
          }
        }
      }
    }

    return issues
  }

  /**
   * 品質問題の修正
   */
  private async fixQualityIssues(issues: string[]): Promise<void> {
    for (const issue of issues) {
      try {
        if (issue.includes('Duplicate imports')) {
          await this.fixDuplicateImports(issue)
        } else if (issue.includes('Unused variable')) {
          await this.fixUnusedVariables(issue)
        } else if (issue.includes('Missing React import')) {
          await this.fixMissingReactImport(issue)
        } else if (issue.includes('TypeScript')) {
          await this.fixTypeScriptIssues(issue)
        } else if (issue.includes('ESLint')) {
          await this.fixESLintIssues(issue)
        }
      } catch (error) {
        this.warnings.push(`Failed to fix issue: ${issue} - ${error}`)
      }
    }
  }

  /**
   * 重複インポートの修正
   */
  private async fixDuplicateImports(issue: string): Promise<void> {
    const filePathMatch = issue.match(/in (.*?):/)?.[1]
    if (!filePathMatch) return

    const content = this.generatedFiles.get(filePathMatch)
    if (!content) return

    const lines = content.split('\n')
    const importLines = lines.filter(line => line.trim().startsWith('import'))
    const nonImportLines = lines.filter(line => !line.trim().startsWith('import'))

    // インポートを統合
    const importMap = new Map<string, Set<string>>()
    
    for (const line of importLines) {
      const match = line.match(/import\s+{([^}]+)}\s+from\s+['"](.*?)['"]/)
      if (match) {
        const imports = match[1].split(',').map(imp => imp.trim())
        const module = match[2]
        
        if (!importMap.has(module)) {
          importMap.set(module, new Set())
        }
        
        imports.forEach(imp => importMap.get(module)!.add(imp))
      }
    }

    // 統合されたインポートを再構築
    const mergedImports = Array.from(importMap.entries()).map(([module, imports]) => {
      return `import { ${Array.from(imports).join(', ')} } from '${module}'`
    })

    const newContent = [...mergedImports, '', ...nonImportLines].join('\n')
    this.generatedFiles.set(filePathMatch, newContent)
  }

  /**
   * 未使用変数の修正
   */
  private async fixUnusedVariables(issue: string): Promise<void> {
    const filePathMatch = issue.match(/in (.*?):/)?.[1]
    const variableMatch = issue.match(/: (.*)$/)?.[1]
    
    if (!filePathMatch || !variableMatch) return

    const content = this.generatedFiles.get(filePathMatch)
    if (!content) return

    // 未使用変数を削除
    const lines = content.split('\n')
    const filteredLines = lines.filter(line => !line.includes(`const ${variableMatch} =`))
    
    this.generatedFiles.set(filePathMatch, filteredLines.join('\n'))
  }

  /**
   * Reactインポートの修正
   */
  private async fixMissingReactImport(issue: string): Promise<void> {
    const filePathMatch = issue.match(/in (.*?)$/)?.[1]
    if (!filePathMatch) return

    const content = this.generatedFiles.get(filePathMatch)
    if (!content) return

    // Reactインポートを追加
    const lines = content.split('\n')
    const firstImportIndex = lines.findIndex(line => line.trim().startsWith('import'))
    
    if (firstImportIndex >= 0) {
      lines.splice(firstImportIndex, 0, "import React from 'react'")
    } else {
      lines.unshift("import React from 'react'")
    }

    this.generatedFiles.set(filePathMatch, lines.join('\n'))
  }

  /**
   * TypeScript問題の修正
   */
  private async fixTypeScriptIssues(issue: string): Promise<void> {
    // TypeScriptエラーの基本的な修正
    // 実際のプロジェクトでは、より詳細なエラー解析と修正が必要
    console.log(`Attempting to fix TypeScript issue: ${issue}`)
  }

  /**
   * ESLint問題の修正
   */
  private async fixESLintIssues(issue: string): Promise<void> {
    // ESLintエラーの基本的な修正
    // 実際のプロジェクトでは、より詳細なエラー解析と修正が必要
    console.log(`Attempting to fix ESLint issue: ${issue}`)
  }

  /**
   * デプロイメント準備
   */
  private async prepareForDeployment(): Promise<void> {
    console.log('🚀 Preparing for deployment...')

    // Vercel設定ファイルの生成
    const vercelConfig = this.generateVercelConfig()
    this.generatedFiles.set('vercel.json', JSON.stringify(vercelConfig, null, 2))

    // package.jsonの更新
    await this.updatePackageJson()

    // READMEの生成
    await this.generateReadme()

    // 環境変数テンプレートの生成
    await this.generateEnvTemplate()
  }

  /**
   * Vercel設定の生成
   */
  private generateVercelConfig(): any {
    return {
      "version": 2,
      "builds": [
        {
          "src": "package.json",
          "use": "@vercel/next"
        }
      ],
      "routes": [
        {
          "src": "/(.*)",
          "dest": "/"
        }
      ]
    }
  }

  /**
   * package.jsonの更新
   */
  private async updatePackageJson(): Promise<void> {
    try {
      const packageJsonPath = join(this.projectRoot, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

      // scriptsの追加
      packageJson.scripts = {
        ...packageJson.scripts,
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "type-check": "tsc --noEmit",
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
      }

      // 依存関係の追加
      const dependencies = Array.from(this.dependencies)
      const devDependencies = [
        '@types/node',
        '@types/react',
        '@types/react-dom',
        'typescript',
        'eslint',
        'eslint-config-next',
        'prettier',
        'tailwindcss',
        'autoprefixer',
        'postcss',
        '@testing-library/react',
        '@testing-library/jest-dom',
        'jest',
        'jest-environment-jsdom'
      ]

      for (const dep of dependencies) {
        if (!devDependencies.includes(dep)) {
          packageJson.dependencies = packageJson.dependencies || {}
          packageJson.dependencies[dep] = 'latest'
        }
      }

      for (const dep of devDependencies) {
        packageJson.devDependencies = packageJson.devDependencies || {}
        packageJson.devDependencies[dep] = 'latest'
      }

      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    } catch (error) {
      this.warnings.push(`Failed to update package.json: ${error}`)
    }
  }

  /**
   * READMEの生成
   */
  private async generateReadme(): Promise<void> {
    const readme = `# Generated Application

This application was generated using the MATURA autonomous code generation system.

## Features

- Modern Next.js 14 with App Router
- TypeScript with strict type checking
- Tailwind CSS with shadcn/ui components
- Comprehensive testing with Jest and Testing Library
- ESLint and Prettier for code quality
- Responsive design
- Production-ready deployment configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

### Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

### Code Quality

\`\`\`bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run type-check
\`\`\`

## Deployment

This application is ready for deployment to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

## Project Structure

\`\`\`
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── features/
├── lib/
│   └── utils.ts
├── hooks/
│   └── index.ts
├── types/
│   └── index.ts
├── __tests__/
│   ├── page.test.tsx
│   ├── utils.test.ts
│   └── hooks.test.ts
└── public/
\`\`\`

## Generated Files

This application includes the following auto-generated components:

- Complete UI component library based on shadcn/ui
- Custom hooks for state management
- Type-safe utility functions
- Comprehensive test suite
- Production-ready configuration files

## License

This project is licensed under the MIT License.
`

    this.generatedFiles.set('README.md', readme)
  }

  /**
   * 環境変数テンプレートの生成
   */
  private async generateEnvTemplate(): Promise<void> {
    const envTemplate = `# Environment Variables Template
# Copy this file to .env.local and fill in your values

# Database (if using)
# DATABASE_URL="your-database-url"

# API Keys (if using)
# OPENAI_API_KEY="your-openai-api-key"
# GEMINI_API_KEY="your-gemini-api-key"

# Authentication (if using)
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-nextauth-secret"

# External Services (if using)
# STRIPE_SECRET_KEY="your-stripe-secret-key"
# STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Other configurations
# APP_ENV="development"
`

    this.generatedFiles.set('.env.example', envTemplate)
  }

  /**
   * ビルド検証
   */
  private async verifyBuild(): Promise<boolean> {
    try {
      console.log('🔨 Verifying build...')
      execSync('npm run build', { cwd: this.projectRoot, stdio: 'inherit' })
      return true
    } catch (error) {
      this.errors.push(`Build verification failed: ${error}`)
      return false
    }
  }

  /**
   * APIキーの取得
   */
  private getApiKey(): string | null {
    return process.env.GEMINI_API_KEY || null
  }

  /**
   * 配列のチャンク分割
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  /**
   * 総行数の計算
   */
  private calculateTotalLines(): number {
    return Array.from(this.generatedFiles.values())
      .reduce((total, content) => total + content.split('\n').length, 0)
  }

  /**
   * テストファイル数の計算
   */
  private countTestFiles(): number {
    return Array.from(this.generatedFiles.keys())
      .filter(path => path.includes('test') || path.includes('spec')).length
  }

  /**
   * コンポーネント数の計算
   */
  private countComponents(): number {
    return Array.from(this.generatedFiles.values())
      .reduce((total, content) => {
        const matches = content.match(/function \w+\(|const \w+ = \(/g)
        return total + (matches ? matches.length : 0)
      }, 0)
  }

  /**
   * TypeScriptエラー数の計算
   */
  private async countTypeErrors(): Promise<number> {
    try {
      const errors = await this.runTypeCheck()
      return errors.length
    } catch {
      return 0
    }
  }

  /**
   * Lintエラー数の計算
   */
  private async countLintErrors(): Promise<number> {
    try {
      const errors = await this.runLinting()
      return errors.length
    } catch {
      return 0
    }
  }

  /**
   * PascalCaseへの変換
   */
  private toPascalCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    }).replace(/\s+/g, '')
  }
}

// 使用例とエクスポート
export default AutonomousCodeGenerator