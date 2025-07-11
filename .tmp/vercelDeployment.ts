import { Insight, UIStyle } from './types'

interface VercelConfig {
  version: number
  builds?: Array<{
    src: string
    use: string
    config?: Record<string, any>
  }>
  routes?: Array<{
    src: string
    dest?: string
    status?: number
    headers?: Record<string, string>
    methods?: string[]
  }>
  env?: Record<string, string>
  build?: {
    env?: Record<string, string>
  }
  functions?: Record<string, any>
  regions?: string[]
  framework?: string
}

interface DeploymentPreparation {
  vercelConfig: VercelConfig
  environmentVariables: Record<string, string>
  buildCommands: string[]
  deploymentFiles: Record<string, string>
  previewConfig: any
  productionConfig: any
  recommendations: string[]
  securityChecklist: string[]
}

interface DeploymentValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  optimizations: string[]
  estimatedBuildTime: string
  estimatedBundleSize: string
}

export class VercelDeploymentManager {
  private insight: Insight
  private uiStyle: UIStyle
  private projectRoot: string

  constructor(insight: Insight, uiStyle: UIStyle, projectRoot: string = process.cwd()) {
    this.insight = insight
    this.uiStyle = uiStyle
    this.projectRoot = projectRoot
  }

  /**
   * Vercelデプロイメントの準備
   */
  async prepareDeployment(): Promise<DeploymentPreparation> {
    console.log('[VercelDeploy] Preparing Vercel deployment configuration...')

    const vercelConfig = this.generateVercelConfig()
    const environmentVariables = this.generateEnvironmentVariables()
    const buildCommands = this.generateBuildCommands()
    const deploymentFiles = await this.generateDeploymentFiles()
    const previewConfig = this.generatePreviewConfig()
    const productionConfig = this.generateProductionConfig()
    const recommendations = this.generateRecommendations()
    const securityChecklist = this.generateSecurityChecklist()

    return {
      vercelConfig,
      environmentVariables,
      buildCommands,
      deploymentFiles,
      previewConfig,
      productionConfig,
      recommendations,
      securityChecklist
    }
  }

  /**
   * デプロイメント設定の検証
   */
  async validateDeployment(preparation: DeploymentPreparation): Promise<DeploymentValidation> {
    console.log('[VercelDeploy] Validating deployment configuration...')

    const errors: string[] = []
    const warnings: string[] = []
    const optimizations: string[] = []

    // 必須設定のチェック
    if (!preparation.vercelConfig.framework) {
      errors.push('Framework not specified in Vercel configuration')
    }

    // 環境変数のチェック
    if (this.requiresDatabase() && !preparation.environmentVariables.DATABASE_URL) {
      warnings.push('DATABASE_URL environment variable may be required')
    }

    if (this.requiresAuth() && !preparation.environmentVariables.NEXTAUTH_SECRET) {
      warnings.push('NEXTAUTH_SECRET environment variable may be required')
    }

    // ビルド設定のチェック
    if (!preparation.buildCommands.includes('npm run build')) {
      errors.push('Build command not found')
    }

    // セキュリティチェック
    const sensitiveFiles = ['env.local', '.env', 'private.key']
    sensitiveFiles.forEach(file => {
      if (preparation.deploymentFiles[file]) {
        errors.push(`Sensitive file ${file} should not be included in deployment`)
      }
    })

    // 最適化の提案
    if (!preparation.vercelConfig.regions) {
      optimizations.push('Consider specifying regions for better performance')
    }

    if (!preparation.buildCommands.includes('npm run analyze')) {
      optimizations.push('Consider adding bundle analysis to build process')
    }

    const isValid = errors.length === 0
    const estimatedBuildTime = this.estimateBuildTime()
    const estimatedBundleSize = this.estimateBundleSize()

    return {
      isValid,
      errors,
      warnings,
      optimizations,
      estimatedBuildTime,
      estimatedBundleSize
    }
  }

  /**
   * Vercel設定ファイルの生成
   */
  private generateVercelConfig(): VercelConfig {
    const config: VercelConfig = {
      version: 2,
      framework: 'nextjs',
      regions: ['nrt1'], // Tokyo region for Japanese users
    }

    // Build configuration
    config.build = {
      env: {
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1'
      }
    }

    // API routes configuration
    if (this.hasAPIRoutes()) {
      config.functions = {
        'app/api/**/*.ts': {
          maxDuration: 30
        }
      }
    }

    // Static files and routing
    config.routes = [
      {
        src: '/favicon.ico',
        dest: '/favicon.ico'
      },
      {
        src: '/robots.txt',
        dest: '/robots.txt'
      },
      {
        src: '/sitemap.xml',
        dest: '/sitemap.xml'
      },
      // Security headers
      {
        src: '/(.*)',
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        }
      }
    ]

    // Environment-specific configurations
    if (this.requiresDatabase()) {
      config.env = {
        ...config.env,
        DATABASE_URL: '@database-url'
      }
    }

    if (this.requiresAuth()) {
      config.env = {
        ...config.env,
        NEXTAUTH_URL: '@nextauth-url',
        NEXTAUTH_SECRET: '@nextauth-secret'
      }
    }

    if (this.hasAIFeatures()) {
      config.env = {
        ...config.env,
        OPENAI_API_KEY: '@openai-api-key',
        GEMINI_API_KEY: '@gemini-api-key'
      }
    }

    return config
  }

  /**
   * 環境変数の生成
   */
  private generateEnvironmentVariables(): Record<string, string> {
    const envVars: Record<string, string> = {
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      APP_NAME: this.insight.appName || this.insight.vision,
      APP_DESCRIPTION: this.insight.value
    }

    // Database
    if (this.requiresDatabase()) {
      envVars.DATABASE_URL = 'your-database-connection-string'
      envVars.DIRECT_URL = 'your-direct-database-connection-string'
    }

    // Authentication
    if (this.requiresAuth()) {
      envVars.NEXTAUTH_URL = 'https://your-app.vercel.app'
      envVars.NEXTAUTH_SECRET = 'your-nextauth-secret-key'
      
      // OAuth providers (examples)
      envVars.GOOGLE_CLIENT_ID = 'your-google-client-id'
      envVars.GOOGLE_CLIENT_SECRET = 'your-google-client-secret'
      envVars.GITHUB_ID = 'your-github-app-id'
      envVars.GITHUB_SECRET = 'your-github-app-secret'
    }

    // AI Services
    if (this.hasAIFeatures()) {
      envVars.OPENAI_API_KEY = 'your-openai-api-key'
      envVars.GEMINI_API_KEY = 'your-gemini-api-key'
    }

    // Payment processing
    if (this.hasPaymentFeatures()) {
      envVars.STRIPE_SECRET_KEY = 'your-stripe-secret-key'
      envVars.STRIPE_PUBLISHABLE_KEY = 'your-stripe-publishable-key'
      envVars.STRIPE_WEBHOOK_SECRET = 'your-stripe-webhook-secret'
    }

    // External services
    if (this.hasRealtimeFeatures()) {
      envVars.PUSHER_APP_ID = 'your-pusher-app-id'
      envVars.PUSHER_KEY = 'your-pusher-key'
      envVars.PUSHER_SECRET = 'your-pusher-secret'
      envVars.PUSHER_CLUSTER = 'ap3' // Asia Pacific
    }

    // Email services
    if (this.hasEmailFeatures()) {
      envVars.RESEND_API_KEY = 'your-resend-api-key'
      envVars.FROM_EMAIL = 'noreply@your-domain.com'
    }

    // Analytics
    envVars.NEXT_PUBLIC_GA_ID = 'your-google-analytics-id'
    envVars.NEXT_PUBLIC_HOTJAR_ID = 'your-hotjar-id'

    // Feature flags
    envVars.NEXT_PUBLIC_FEATURE_AI = this.hasAIFeatures() ? 'true' : 'false'
    envVars.NEXT_PUBLIC_FEATURE_AUTH = this.requiresAuth() ? 'true' : 'false'
    envVars.NEXT_PUBLIC_FEATURE_PAYMENTS = this.hasPaymentFeatures() ? 'true' : 'false'

    return envVars
  }

  /**
   * ビルドコマンドの生成
   */
  private generateBuildCommands(): string[] {
    const commands: string[] = []

    // Pre-build checks
    commands.push('npm run type-check')
    commands.push('npm run lint')

    // Database migration (if needed)
    if (this.requiresDatabase()) {
      commands.push('npx prisma generate')
      commands.push('npx prisma db push')
    }

    // Main build
    commands.push('npm run build')

    // Post-build optimizations
    commands.push('npm run analyze')

    return commands
  }

  /**
   * デプロイメントファイルの生成
   */
  private async generateDeploymentFiles(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}

    // vercel.json
    files['vercel.json'] = JSON.stringify(this.generateVercelConfig(), null, 2)

    // .env.example
    files['.env.example'] = this.generateEnvExample()

    // README.md for deployment
    files['DEPLOYMENT.md'] = this.generateDeploymentGuide()

    // robots.txt
    files['public/robots.txt'] = this.generateRobotsTxt()

    // sitemap.xml
    files['public/sitemap.xml'] = this.generateSitemap()

    // Security files
    files['public/.well-known/security.txt'] = this.generateSecurityTxt()

    // Package.json scripts update
    files['package.json.update'] = this.generatePackageJsonUpdates()

    return files
  }

  /**
   * プレビュー環境設定の生成
   */
  private generatePreviewConfig(): any {
    return {
      branch: 'develop',
      buildCommand: 'npm run build:preview',
      environmentVariables: {
        NODE_ENV: 'preview',
        NEXT_PUBLIC_ENV: 'preview',
        ROBOTS_NOINDEX: 'true'
      },
      domains: [
        'preview-your-app.vercel.app'
      ]
    }
  }

  /**
   * 本番環境設定の生成
   */
  private generateProductionConfig(): any {
    return {
      branch: 'main',
      buildCommand: 'npm run build',
      environmentVariables: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_ENV: 'production'
      },
      domains: [
        'your-app.com',
        'www.your-app.com'
      ],
      aliases: [
        'your-app.vercel.app'
      ]
    }
  }

  /**
   * 推奨事項の生成
   */
  private generateRecommendations(): string[] {
    return [
      'Configure custom domain in Vercel dashboard',
      'Set up SSL certificate for custom domain',
      'Configure environment variables in Vercel dashboard',
      'Set up monitoring and alerts',
      'Configure database connection pooling',
      'Set up CI/CD pipeline with GitHub Actions',
      'Configure preview deployments for pull requests',
      'Set up error monitoring (e.g., Sentry)',
      'Configure analytics (Google Analytics, Mixpanel)',
      'Set up performance monitoring',
      'Configure backup strategy for database',
      'Set up log aggregation and monitoring',
      'Configure CDN for static assets',
      'Set up security headers and CSP',
      'Configure rate limiting for API routes',
      'Set up health checks and uptime monitoring'
    ]
  }

  /**
   * セキュリティチェックリストの生成
   */
  private generateSecurityChecklist(): string[] {
    return [
      '✓ Environment variables are properly configured',
      '✓ No sensitive data in client-side code',
      '✓ API routes have proper authentication',
      '✓ Input validation is implemented',
      '✓ CORS is properly configured',
      '✓ Security headers are set',
      '✓ Dependencies are up to date',
      '✓ No console.log statements in production',
      '✓ Error messages don\'t leak sensitive information',
      '✓ Rate limiting is implemented for API routes',
      '✓ HTTPS is enforced',
      '✓ Database connections are secured',
      '✓ File uploads are validated and secured',
      '✓ Session management is secure',
      '✓ XSS protection is implemented',
      '✓ CSRF protection is implemented'
    ]
  }

  /**
   * 環境変数例ファイルの生成
   */
  private generateEnvExample(): string {
    const envVars = this.generateEnvironmentVariables()
    const lines: string[] = []

    lines.push('# Environment Variables for MATURA Application')
    lines.push('# Copy this file to .env.local and fill in your values')
    lines.push('')

    // Group by category
    const categories = {
      'App Configuration': ['NODE_ENV', 'APP_NAME', 'APP_DESCRIPTION'],
      'Database': ['DATABASE_URL', 'DIRECT_URL'],
      'Authentication': ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
      'AI Services': ['OPENAI_API_KEY', 'GEMINI_API_KEY'],
      'Payment': ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY'],
      'External Services': ['PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_SECRET'],
      'Analytics': ['NEXT_PUBLIC_GA_ID', 'NEXT_PUBLIC_HOTJAR_ID']
    }

    Object.entries(categories).forEach(([category, keys]) => {
      const categoryVars = keys.filter(key => envVars[key])
      if (categoryVars.length > 0) {
        lines.push(`# ${category}`)
        categoryVars.forEach(key => {
          lines.push(`${key}="${envVars[key]}"`)
        })
        lines.push('')
      }
    })

    return lines.join('\n')
  }

  /**
   * デプロイメントガイドの生成
   */
  private generateDeploymentGuide(): string {
    return `# Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo)

## Manual Deployment

### Prerequisites

- Node.js 18+ installed
- Vercel CLI installed (\`npm i -g vercel\`)
- Git repository set up

### Steps

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your values
   \`\`\`

4. **Build and test locally**
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`

5. **Deploy to Vercel**
   \`\`\`bash
   vercel
   \`\`\`

### Environment Variables

Set these in your Vercel dashboard:

${Object.entries(this.generateEnvironmentVariables()).map(([key, value]) => 
  `- \`${key}\`: ${value.startsWith('your-') ? 'Required - ' + value : 'Optional - ' + value}`
).join('\n')}

### Custom Domain Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Configure DNS records with your domain provider

### Monitoring and Analytics

- Set up error monitoring with Sentry
- Configure performance monitoring
- Set up uptime monitoring
- Configure log aggregation

### Security

- Ensure all environment variables are set correctly
- Review security headers in vercel.json
- Set up rate limiting for API routes
- Configure CORS properly

### Troubleshooting

Common issues and solutions:

- **Build failures**: Check Node.js version compatibility
- **Environment variables**: Ensure all required variables are set
- **Database connection**: Verify connection strings and permissions
- **API routes**: Check function timeout settings

For more help, see [Vercel Documentation](https://vercel.com/docs).
`
  }

  /**
   * robots.txtの生成
   */
  private generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://your-app.com/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /dashboard/private/
`
  }

  /**
   * sitemapの生成
   */
  private generateSitemap(): string {
    const baseUrl = 'https://your-app.com'
    const currentDate = new Date().toISOString().split('T')[0]

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/features</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`
  }

  /**
   * security.txtの生成
   */
  private generateSecurityTxt(): string {
    return `Contact: mailto:security@your-app.com
Expires: 2025-12-31T23:59:59.000Z
Encryption: https://your-app.com/pgp-key.txt
Preferred-Languages: en, ja
Canonical: https://your-app.com/.well-known/security.txt
Policy: https://your-app.com/security-policy
`
  }

  /**
   * package.json更新情報の生成
   */
  private generatePackageJsonUpdates(): string {
    return JSON.stringify({
      scripts: {
        "build:preview": "NODE_ENV=preview next build",
        "analyze": "cross-env ANALYZE=true next build",
        "deploy": "vercel --prod",
        "deploy:preview": "vercel"
      },
      engines: {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      }
    }, null, 2)
  }

  /**
   * ビルド時間の推定
   */
  private estimateBuildTime(): string {
    let baseTime = 60 // 1 minute base
    
    if (this.hasAIFeatures()) baseTime += 30
    if (this.requiresDatabase()) baseTime += 20
    if (this.hasPaymentFeatures()) baseTime += 15
    
    const minutes = Math.ceil(baseTime / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }

  /**
   * バンドルサイズの推定
   */
  private estimateBundleSize(): string {
    let baseSizeKB = 200 // 200KB base
    
    if (this.hasAIFeatures()) baseSizeKB += 100
    if (this.hasPaymentFeatures()) baseSizeKB += 50
    if (this.hasRealtimeFeatures()) baseSizeKB += 30
    
    if (baseSizeKB > 1024) {
      return `${(baseSizeKB / 1024).toFixed(1)}MB`
    }
    return `${baseSizeKB}KB`
  }

  // Feature detection helpers
  private hasAPIRoutes(): boolean {
    return true // Always true for our generated apps
  }

  private requiresDatabase(): boolean {
    return this.insight.features.some(f => 
      f.includes('データ') || f.includes('保存') || f.includes('ユーザー')
    )
  }

  private requiresAuth(): boolean {
    return this.insight.features.some(f => 
      f.includes('認証') || f.includes('ログイン') || f.includes('ユーザー')
    )
  }

  private hasAIFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('AI') || f.includes('生成') || f.includes('翻訳')
    )
  }

  private hasPaymentFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('決済') || f.includes('支払い') || f.includes('購入')
    )
  }

  private hasRealtimeFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('リアルタイム') || f.includes('チャット') || f.includes('通知')
    )
  }

  private hasEmailFeatures(): boolean {
    return this.insight.features.some(f => 
      f.includes('メール') || f.includes('通知') || f.includes('連絡')
    )
  }
}

export default VercelDeploymentManager