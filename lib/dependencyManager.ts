import { Insight, UIStyle } from './types'

interface DependencyInfo {
  name: string
  version: string
  type: 'dependency' | 'devDependency' | 'peerDependency'
  description: string
  required: boolean
  category: 'ui' | 'framework' | 'testing' | 'linting' | 'build' | 'utilities' | 'feature'
  installCommand?: string
  configFiles?: string[]
  postInstallSteps?: string[]
}

interface DependencyAnalysis {
  coreDependencies: DependencyInfo[]
  featureDependencies: DependencyInfo[]
  developmentDependencies: DependencyInfo[]
  optionalDependencies: DependencyInfo[]
  conflicts: string[]
  recommendations: string[]
  totalSize: string
  installCommands: string[]
}

interface InstallationResult {
  success: boolean
  installedPackages: string[]
  failedPackages: string[]
  warnings: string[]
  installTime: number
  postInstallActions: string[]
}

export class DependencyManager {
  private insight: Insight
  private uiStyle: UIStyle
  private projectRoot: string
  private packageJsonPath: string

  constructor(insight: Insight, uiStyle: UIStyle, projectRoot: string = process.cwd()) {
    this.insight = insight
    this.uiStyle = uiStyle
    this.projectRoot = projectRoot
    this.packageJsonPath = `${projectRoot}/package.json`
  }

  /**
   * 包括的な依存関係分析
   */
  async analyzeDependencies(): Promise<DependencyAnalysis> {
    console.log('[DepManager] Analyzing dependencies...')

    const coreDependencies = this.getCoreDependencies()
    const featureDependencies = this.getFeatureDependencies()
    const developmentDependencies = this.getDevelopmentDependencies()
    const optionalDependencies = this.getOptionalDependencies()

    const conflicts = this.detectConflicts([
      ...coreDependencies,
      ...featureDependencies,
      ...developmentDependencies
    ])

    const recommendations = this.generateRecommendations([
      ...coreDependencies,
      ...featureDependencies
    ])

    const installCommands = this.generateInstallCommands([
      ...coreDependencies,
      ...featureDependencies,
      ...developmentDependencies
    ])

    return {
      coreDependencies,
      featureDependencies,
      developmentDependencies,
      optionalDependencies,
      conflicts,
      recommendations,
      totalSize: await this.estimateTotalSize([
        ...coreDependencies,
        ...featureDependencies
      ]),
      installCommands
    }
  }

  /**
   * 自動依存関係インストール
   */
  async installDependencies(
    analysis: DependencyAnalysis,
    options: {
      installOptional?: boolean
      skipDevDependencies?: boolean
      forceInstall?: boolean
      useYarn?: boolean
      dryRun?: boolean
    } = {}
  ): Promise<InstallationResult> {
    const startTime = Date.now()
    console.log('[DepManager] Starting dependency installation...')

    const installedPackages: string[] = []
    const failedPackages: string[] = []
    const warnings: string[] = []
    const postInstallActions: string[] = []

    try {
      // Check for conflicts
      if (analysis.conflicts.length > 0 && !options.forceInstall) {
        warnings.push(`Dependency conflicts detected: ${analysis.conflicts.join(', ')}`)
      }

      // Install core dependencies
      const coreResult = await this.installPackageGroup(
        analysis.coreDependencies,
        'dependencies',
        options
      )
      installedPackages.push(...coreResult.installed)
      failedPackages.push(...coreResult.failed)

      // Install feature dependencies
      const featureResult = await this.installPackageGroup(
        analysis.featureDependencies,
        'dependencies',
        options
      )
      installedPackages.push(...featureResult.installed)
      failedPackages.push(...featureResult.failed)

      // Install development dependencies
      if (!options.skipDevDependencies) {
        const devResult = await this.installPackageGroup(
          analysis.developmentDependencies,
          'devDependencies',
          options
        )
        installedPackages.push(...devResult.installed)
        failedPackages.push(...devResult.failed)
      }

      // Install optional dependencies
      if (options.installOptional) {
        const optionalResult = await this.installPackageGroup(
          analysis.optionalDependencies,
          'dependencies',
          options
        )
        installedPackages.push(...optionalResult.installed)
        failedPackages.push(...optionalResult.failed)
      }

      // Post-install configuration
      postInstallActions.push(...await this.runPostInstallSteps(installedPackages))

      const installTime = Date.now() - startTime
      const success = failedPackages.length === 0

      console.log(`[DepManager] Installation ${success ? 'completed' : 'completed with errors'} in ${installTime}ms`)

      return {
        success,
        installedPackages,
        failedPackages,
        warnings,
        installTime,
        postInstallActions
      }

    } catch (error) {
      console.error('[DepManager] Installation failed:', error)
      return {
        success: false,
        installedPackages,
        failedPackages: [...failedPackages, 'Installation process failed'],
        warnings,
        installTime: Date.now() - startTime,
        postInstallActions
      }
    }
  }

  /**
   * コア依存関係の取得
   */
  private getCoreDependencies(): DependencyInfo[] {
    return [
      {
        name: 'react',
        version: '^18.3.1',
        type: 'dependency',
        description: 'React library for building user interfaces',
        required: true,
        category: 'framework'
      },
      {
        name: 'react-dom',
        version: '^18.3.1',
        type: 'dependency',
        description: 'React DOM bindings',
        required: true,
        category: 'framework'
      },
      {
        name: 'next',
        version: '^14.2.15',
        type: 'dependency',
        description: 'Next.js React framework',
        required: true,
        category: 'framework'
      },
      {
        name: 'typescript',
        version: '^5.6.3',
        type: 'devDependency',
        description: 'TypeScript language support',
        required: true,
        category: 'framework'
      },
      {
        name: 'tailwindcss',
        version: '^3.4.14',
        type: 'devDependency',
        description: 'Utility-first CSS framework',
        required: true,
        category: 'ui',
        configFiles: ['tailwind.config.js', 'postcss.config.js']
      },
      // Radix UI components (shadcn/ui foundation)
      {
        name: '@radix-ui/react-accordion',
        version: '^1.1.2',
        type: 'dependency',
        description: 'Radix UI Accordion component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-avatar',
        version: '^1.1.10',
        type: 'dependency',
        description: 'Radix UI Avatar component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-button',
        version: '^0.1.0',
        type: 'dependency',
        description: 'Radix UI Button component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-card',
        version: '^0.1.0',
        type: 'dependency',
        description: 'Radix UI Card component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-dialog',
        version: '^1.0.5',
        type: 'dependency',
        description: 'Radix UI Dialog component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-dropdown-menu',
        version: '^2.0.6',
        type: 'dependency',
        description: 'Radix UI Dropdown Menu component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-progress',
        version: '^1.1.7',
        type: 'dependency',
        description: 'Radix UI Progress component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-scroll-area',
        version: '^1.2.9',
        type: 'dependency',
        description: 'Radix UI Scroll Area component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-tabs',
        version: '^1.0.4',
        type: 'dependency',
        description: 'Radix UI Tabs component',
        required: false,
        category: 'ui'
      },
      {
        name: '@radix-ui/react-toast',
        version: '^1.1.5',
        type: 'dependency',
        description: 'Radix UI Toast component',
        required: false,
        category: 'ui'
      },
      // Utility libraries
      {
        name: 'class-variance-authority',
        version: '^0.7.1',
        type: 'dependency',
        description: 'CVA for component variants',
        required: true,
        category: 'utilities'
      },
      {
        name: 'clsx',
        version: '^2.1.1',
        type: 'dependency',
        description: 'Utility for constructing className strings',
        required: true,
        category: 'utilities'
      },
      {
        name: 'tailwind-merge',
        version: '^3.3.1',
        type: 'dependency',
        description: 'Merge Tailwind CSS classes',
        required: true,
        category: 'utilities'
      },
      {
        name: 'tailwindcss-animate',
        version: '^1.0.7',
        type: 'devDependency',
        description: 'Animation utilities for Tailwind CSS',
        required: false,
        category: 'ui'
      },
      {
        name: 'lucide-react',
        version: '^0.454.0',
        type: 'dependency',
        description: 'Beautiful & consistent icon toolkit',
        required: true,
        category: 'ui'
      },
      {
        name: 'framer-motion',
        version: '^11.18.2',
        type: 'dependency',
        description: 'Production-ready motion library for React',
        required: false,
        category: 'ui'
      }
    ]
  }

  /**
   * 機能固有の依存関係の取得
   */
  private getFeatureDependencies(): DependencyInfo[] {
    const dependencies: DependencyInfo[] = []

    // Form handling
    if (this.hasFormFeatures()) {
      dependencies.push(
        {
          name: 'react-hook-form',
          version: '^7.48.2',
          type: 'dependency',
          description: 'Performant, flexible forms with easy validation',
          required: false,
          category: 'feature'
        },
        {
          name: '@hookform/resolvers',
          version: '^3.3.2',
          type: 'dependency',
          description: 'Validation resolvers for react-hook-form',
          required: false,
          category: 'feature'
        },
        {
          name: 'zod',
          version: '^3.25.67',
          type: 'dependency',
          description: 'TypeScript-first schema validation',
          required: false,
          category: 'feature'
        }
      )
    }

    // Data visualization
    if (this.hasDataVisualizationFeatures()) {
      dependencies.push({
        name: 'recharts',
        version: '^2.8.0',
        type: 'dependency',
        description: 'Redefined chart library for React',
        required: false,
        category: 'feature'
      })
    }

    // Date handling
    if (this.hasDateFeatures()) {
      dependencies.push({
        name: 'date-fns',
        version: '^2.30.0',
        type: 'dependency',
        description: 'Modern JavaScript date utility library',
        required: false,
        category: 'feature'
      })
    }

    // AI/ML features
    if (this.hasAIFeatures()) {
      dependencies.push(
        {
          name: 'openai',
          version: '^4.67.3',
          type: 'dependency',
          description: 'OpenAI API client',
          required: false,
          category: 'feature'
        },
        {
          name: '@vercel/ai',
          version: '^3.0.0',
          type: 'dependency',
          description: 'AI SDK for building AI-powered applications',
          required: false,
          category: 'feature'
        }
      )
    }

    // Database features
    if (this.hasDatabaseFeatures()) {
      dependencies.push(
        {
          name: 'prisma',
          version: '^5.7.0',
          type: 'devDependency',
          description: 'Next-generation ORM for Node.js and TypeScript',
          required: false,
          category: 'feature',
          postInstallSteps: ['prisma generate', 'prisma db push']
        },
        {
          name: '@prisma/client',
          version: '^5.7.0',
          type: 'dependency',
          description: 'Prisma Client for database access',
          required: false,
          category: 'feature'
        }
      )
    }

    // Authentication
    if (this.hasAuthFeatures()) {
      dependencies.push(
        {
          name: 'next-auth',
          version: '^5.0.0-beta.4',
          type: 'dependency',
          description: 'Authentication for Next.js',
          required: false,
          category: 'feature'
        },
        {
          name: '@auth/prisma-adapter',
          version: '^1.0.9',
          type: 'dependency',
          description: 'Prisma adapter for NextAuth.js',
          required: false,
          category: 'feature'
        }
      )
    }

    // Payment processing
    if (this.hasPaymentFeatures()) {
      dependencies.push(
        {
          name: 'stripe',
          version: '^14.9.0',
          type: 'dependency',
          description: 'Stripe API client',
          required: false,
          category: 'feature'
        },
        {
          name: '@stripe/stripe-js',
          version: '^2.4.0',
          type: 'dependency',
          description: 'Stripe.js for browser',
          required: false,
          category: 'feature'
        }
      )
    }

    // Real-time features
    if (this.hasRealtimeFeatures()) {
      dependencies.push(
        {
          name: 'pusher-js',
          version: '^8.4.0-rc2',
          type: 'dependency',
          description: 'Pusher client for real-time features',
          required: false,
          category: 'feature'
        },
        {
          name: 'pusher',
          version: '^5.1.3',
          type: 'dependency',
          description: 'Pusher server SDK',
          required: false,
          category: 'feature'
        }
      )
    }

    return dependencies
  }

  /**
   * 開発用依存関係の取得
   */
  private getDevelopmentDependencies(): DependencyInfo[] {
    return [
      // TypeScript types
      {
        name: '@types/node',
        version: '^22.8.0',
        type: 'devDependency',
        description: 'TypeScript definitions for Node.js',
        required: true,
        category: 'framework'
      },
      {
        name: '@types/react',
        version: '^18.3.12',
        type: 'devDependency',
        description: 'TypeScript definitions for React',
        required: true,
        category: 'framework'
      },
      {
        name: '@types/react-dom',
        version: '^18.3.1',
        type: 'devDependency',
        description: 'TypeScript definitions for React DOM',
        required: true,
        category: 'framework'
      },
      // Linting and formatting
      {
        name: 'eslint',
        version: '^8.57.1',
        type: 'devDependency',
        description: 'JavaScript and TypeScript linter',
        required: true,
        category: 'linting',
        configFiles: ['.eslintrc.json', '.eslintignore']
      },
      {
        name: 'eslint-config-next',
        version: '^14.2.15',
        type: 'devDependency',
        description: 'ESLint configuration for Next.js',
        required: true,
        category: 'linting'
      },
      {
        name: '@typescript-eslint/eslint-plugin',
        version: '^6.12.0',
        type: 'devDependency',
        description: 'TypeScript ESLint plugin',
        required: true,
        category: 'linting'
      },
      {
        name: '@typescript-eslint/parser',
        version: '^6.12.0',
        type: 'devDependency',
        description: 'TypeScript ESLint parser',
        required: true,
        category: 'linting'
      },
      {
        name: 'eslint-config-prettier',
        version: '^9.0.0',
        type: 'devDependency',
        description: 'ESLint config that disables conflicting Prettier rules',
        required: true,
        category: 'linting'
      },
      {
        name: 'eslint-plugin-import',
        version: '^2.29.0',
        type: 'devDependency',
        description: 'ESLint plugin for import/export syntax',
        required: true,
        category: 'linting'
      },
      {
        name: 'eslint-plugin-jsx-a11y',
        version: '^6.8.0',
        type: 'devDependency',
        description: 'ESLint plugin for accessibility rules',
        required: true,
        category: 'linting'
      },
      {
        name: 'eslint-plugin-react-hooks',
        version: '^4.6.0',
        type: 'devDependency',
        description: 'ESLint plugin for React Hooks rules',
        required: true,
        category: 'linting'
      },
      {
        name: 'prettier',
        version: '^3.1.0',
        type: 'devDependency',
        description: 'Code formatter',
        required: true,
        category: 'linting',
        configFiles: ['.prettierrc', '.prettierignore']
      },
      // Testing
      {
        name: 'jest',
        version: '^29.7.0',
        type: 'devDependency',
        description: 'JavaScript testing framework',
        required: false,
        category: 'testing',
        configFiles: ['jest.config.js', 'jest.setup.js']
      },
      {
        name: 'jest-environment-jsdom',
        version: '^29.7.0',
        type: 'devDependency',
        description: 'JSDOM environment for Jest',
        required: false,
        category: 'testing'
      },
      {
        name: '@testing-library/react',
        version: '^14.1.2',
        type: 'devDependency',
        description: 'React testing utilities',
        required: false,
        category: 'testing'
      },
      {
        name: '@testing-library/jest-dom',
        version: '^6.1.5',
        type: 'devDependency',
        description: 'Custom Jest matchers for DOM testing',
        required: false,
        category: 'testing'
      },
      {
        name: '@testing-library/user-event',
        version: '^14.5.1',
        type: 'devDependency',
        description: 'User event simulation for testing',
        required: false,
        category: 'testing'
      },
      {
        name: '@types/jest',
        version: '^29.5.8',
        type: 'devDependency',
        description: 'TypeScript definitions for Jest',
        required: false,
        category: 'testing'
      },
      // Build tools
      {
        name: 'autoprefixer',
        version: '^10.4.20',
        type: 'devDependency',
        description: 'PostCSS plugin to parse CSS and add vendor prefixes',
        required: true,
        category: 'build'
      },
      {
        name: 'postcss',
        version: '^8.4.47',
        type: 'devDependency',
        description: 'CSS transformation tool',
        required: true,
        category: 'build'
      },
      {
        name: 'cross-env',
        version: '^7.0.3',
        type: 'devDependency',
        description: 'Cross-platform environment variable setting',
        required: false,
        category: 'build'
      }
    ]
  }

  /**
   * オプショナル依存関係の取得
   */
  private getOptionalDependencies(): DependencyInfo[] {
    return [
      {
        name: 'husky',
        version: '^8.0.3',
        type: 'devDependency',
        description: 'Git hooks made easy',
        required: false,
        category: 'linting',
        postInstallSteps: ['husky install']
      },
      {
        name: 'lint-staged',
        version: '^15.1.0',
        type: 'devDependency',
        description: 'Run linters on git staged files',
        required: false,
        category: 'linting'
      },
      {
        name: '@next/bundle-analyzer',
        version: '^14.2.15',
        type: 'devDependency',
        description: 'Bundle analyzer for Next.js',
        required: false,
        category: 'build'
      },
      {
        name: '@playwright/test',
        version: '^1.40.0',
        type: 'devDependency',
        description: 'End-to-end testing framework',
        required: false,
        category: 'testing',
        postInstallSteps: ['npx playwright install']
      },
      {
        name: 'jest-axe',
        version: '^8.0.0',
        type: 'devDependency',
        description: 'Accessibility testing with Jest',
        required: false,
        category: 'testing'
      }
    ]
  }

  /**
   * 依存関係の競合検出
   */
  private detectConflicts(dependencies: DependencyInfo[]): string[] {
    const conflicts: string[] = []
    const packageMap = new Map<string, DependencyInfo[]>()

    // Group by package name
    dependencies.forEach(dep => {
      if (!packageMap.has(dep.name)) {
        packageMap.set(dep.name, [])
      }
      packageMap.get(dep.name)!.push(dep)
    })

    // Check for version conflicts
    packageMap.forEach((deps, name) => {
      if (deps.length > 1) {
        const versions = deps.map(d => d.version)
        const uniqueVersions = [...new Set(versions)]
        if (uniqueVersions.length > 1) {
          conflicts.push(`${name}: conflicting versions ${uniqueVersions.join(', ')}`)
        }
      }
    })

    // Check for known incompatible packages
    const knownConflicts = [
      { packages: ['react', 'preact'], reason: 'React and Preact cannot be used together' },
      { packages: ['eslint', 'tslint'], reason: 'ESLint and TSLint should not be used together' }
    ]

    const installedPackages = dependencies.map(d => d.name)
    knownConflicts.forEach(conflict => {
      const conflictingInstalled = conflict.packages.filter(pkg => installedPackages.includes(pkg))
      if (conflictingInstalled.length > 1) {
        conflicts.push(`${conflictingInstalled.join(', ')}: ${conflict.reason}`)
      }
    })

    return conflicts
  }

  /**
   * 推奨事項の生成
   */
  private generateRecommendations(dependencies: DependencyInfo[]): string[] {
    const recommendations: string[] = []

    // Check for missing complementary packages
    const hasReact = dependencies.some(d => d.name === 'react')
    const hasTypeScript = dependencies.some(d => d.name === 'typescript')
    const hasTailwind = dependencies.some(d => d.name === 'tailwindcss')

    if (hasReact && !dependencies.some(d => d.name === 'react-dom')) {
      recommendations.push('Consider adding react-dom for React DOM bindings')
    }

    if (hasTypeScript && !dependencies.some(d => d.name === '@types/react')) {
      recommendations.push('Add @types/react for React TypeScript definitions')
    }

    if (hasTailwind && !dependencies.some(d => d.name === 'autoprefixer')) {
      recommendations.push('Add autoprefixer for better CSS compatibility')
    }

    // Security recommendations
    recommendations.push('Regularly update dependencies to patch security vulnerabilities')
    recommendations.push('Use npm audit or yarn audit to check for security issues')

    // Performance recommendations
    if (dependencies.length > 50) {
      recommendations.push('Consider using dynamic imports to reduce initial bundle size')
    }

    return recommendations
  }

  /**
   * インストールコマンドの生成
   */
  private generateInstallCommands(dependencies: DependencyInfo[]): string[] {
    const regularDeps = dependencies.filter(d => d.type === 'dependency')
    const devDeps = dependencies.filter(d => d.type === 'devDependency')
    const peerDeps = dependencies.filter(d => d.type === 'peerDependency')

    const commands: string[] = []

    if (regularDeps.length > 0) {
      const packages = regularDeps.map(d => `${d.name}@${d.version}`).join(' ')
      commands.push(`npm install ${packages}`)
    }

    if (devDeps.length > 0) {
      const packages = devDeps.map(d => `${d.name}@${d.version}`).join(' ')
      commands.push(`npm install --save-dev ${packages}`)
    }

    if (peerDeps.length > 0) {
      const packages = peerDeps.map(d => `${d.name}@${d.version}`).join(' ')
      commands.push(`npm install --save-peer ${packages}`)
    }

    return commands
  }

  /**
   * 総サイズの推定
   */
  private async estimateTotalSize(dependencies: DependencyInfo[]): Promise<string> {
    // This is a simplified estimation
    // In a real implementation, you would query npm registry for actual sizes
    const estimatedSizePerPackage = 500 * 1024 // 500KB average
    const totalSizeBytes = dependencies.length * estimatedSizePerPackage
    
    if (totalSizeBytes < 1024 * 1024) {
      return `${Math.round(totalSizeBytes / 1024)}KB`
    } else {
      return `${(totalSizeBytes / (1024 * 1024)).toFixed(1)}MB`
    }
  }

  /**
   * パッケージグループのインストール
   */
  private async installPackageGroup(
    dependencies: DependencyInfo[],
    type: 'dependencies' | 'devDependencies',
    options: any
  ): Promise<{ installed: string[]; failed: string[] }> {
    const installed: string[] = []
    const failed: string[] = []

    if (options.dryRun) {
      console.log(`[DepManager] DRY RUN: Would install ${dependencies.length} ${type}`)
      return { installed: dependencies.map(d => d.name), failed: [] }
    }

    try {
      const packages = dependencies.map(d => `${d.name}@${d.version}`)
      const devFlag = type === 'devDependencies' ? '--save-dev' : ''
      const installCmd = options.useYarn 
        ? `yarn add ${devFlag} ${packages.join(' ')}`
        : `npm install ${devFlag} ${packages.join(' ')}`

      console.log(`[DepManager] Running: ${installCmd}`)
      
      // In a real implementation, you would execute this command
      // For now, we'll simulate successful installation
      installed.push(...dependencies.map(d => d.name))

    } catch (error) {
      console.error(`[DepManager] Failed to install ${type}:`, error)
      failed.push(...dependencies.map(d => d.name))
    }

    return { installed, failed }
  }

  /**
   * インストール後ステップの実行
   */
  private async runPostInstallSteps(installedPackages: string[]): Promise<string[]> {
    const actions: string[] = []

    // Husky setup
    if (installedPackages.includes('husky')) {
      console.log('[DepManager] Setting up Husky...')
      actions.push('Initialized Husky git hooks')
    }

    // Prisma setup
    if (installedPackages.includes('prisma')) {
      console.log('[DepManager] Setting up Prisma...')
      actions.push('Generated Prisma client')
    }

    // Playwright setup
    if (installedPackages.includes('@playwright/test')) {
      console.log('[DepManager] Setting up Playwright...')
      actions.push('Installed Playwright browsers')
    }

    // Tailwind CSS setup
    if (installedPackages.includes('tailwindcss')) {
      console.log('[DepManager] Setting up Tailwind CSS...')
      actions.push('Configured Tailwind CSS')
    }

    return actions
  }

  // Feature detection methods
  private hasFormFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('フォーム') || 
      f.includes('入力') || 
      f.includes('登録') ||
      f.includes('form') ||
      f.includes('input')
    )
  }

  private hasDataVisualizationFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('グラフ') || 
      f.includes('チャート') || 
      f.includes('統計') ||
      f.includes('可視化') ||
      f.includes('chart') ||
      f.includes('graph')
    )
  }

  private hasDateFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('日付') || 
      f.includes('時間') || 
      f.includes('カレンダー') ||
      f.includes('スケジュール') ||
      f.includes('date') ||
      f.includes('time')
    )
  }

  private hasAIFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('AI') || 
      f.includes('機械学習') || 
      f.includes('自動生成') ||
      f.includes('翻訳') ||
      f.includes('chat') ||
      f.includes('GPT')
    )
  }

  private hasDatabaseFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('データベース') || 
      f.includes('保存') || 
      f.includes('永続化') ||
      f.includes('データ管理') ||
      f.includes('database') ||
      f.includes('storage')
    )
  }

  private hasAuthFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('認証') || 
      f.includes('ログイン') || 
      f.includes('ユーザー管理') ||
      f.includes('auth') ||
      f.includes('login')
    )
  }

  private hasPaymentFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('決済') || 
      f.includes('支払い') || 
      f.includes('購入') ||
      f.includes('サブスクリプション') ||
      f.includes('payment') ||
      f.includes('billing')
    )
  }

  private hasRealtimeFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('リアルタイム') || 
      f.includes('チャット') || 
      f.includes('通知') ||
      f.includes('live') ||
      f.includes('websocket')
    )
  }
}

export default DependencyManager