import { Insight, UIStyle } from './types'

export interface UIPattern {
  id: string
  name: string
  description: string
  approach: 'hero-centric' | 'card-focused' | 'dashboard-style' | 'landing-page' | 'app-interface'
  layout: 'grid' | 'flex' | 'compound' | 'masonry'
  colorScheme: 'monochrome' | 'vibrant' | 'pastel' | 'dark' | 'high-contrast'
  components: string[]
  responsive: boolean
  animations: boolean
}

export interface GeneratedUIPattern {
  pattern: UIPattern
  code: string
  components: string[]
  dependencies: string[]
  assets: string[]
}

export class UIPatternGenerator {
  private insight: Insight
  private uiStyle: UIStyle
  
  private basePatterns: UIPattern[] = [
    {
      id: 'hero-centric-grid',
      name: 'Hero-Centric Grid Layout',
      description: 'Large hero section with feature grid below',
      approach: 'hero-centric',
      layout: 'grid',
      colorScheme: 'vibrant',
      components: ['Hero', 'FeatureGrid', 'CTA', 'Testimonials'],
      responsive: true,
      animations: true
    },
    {
      id: 'card-focused-flex',
      name: 'Card-Focused Flex Layout',
      description: 'Card-based interface with flexible sections',
      approach: 'card-focused',
      layout: 'flex',
      colorScheme: 'monochrome',
      components: ['Navigation', 'CardGrid', 'Sidebar', 'Footer'],
      responsive: true,
      animations: false
    },
    {
      id: 'dashboard-compound',
      name: 'Dashboard-Style Compound',
      description: 'Data-heavy dashboard with widgets',
      approach: 'dashboard-style',
      layout: 'compound',
      colorScheme: 'dark',
      components: ['TopBar', 'Sidebar', 'WidgetGrid', 'Charts'],
      responsive: true,
      animations: true
    },
    {
      id: 'landing-masonry',
      name: 'Landing Page Masonry',
      description: 'Creative masonry layout for landing pages',
      approach: 'landing-page',
      layout: 'masonry',
      colorScheme: 'pastel',
      components: ['Hero', 'MasonryGrid', 'Pricing', 'Contact'],
      responsive: true,
      animations: true
    },
    {
      id: 'app-interface-grid',
      name: 'Application Interface',
      description: 'Clean app interface with navigation',
      approach: 'app-interface',
      layout: 'grid',
      colorScheme: 'high-contrast',
      components: ['AppHeader', 'MainContent', 'ActionPanel', 'StatusBar'],
      responsive: true,
      animations: false
    }
  ]

  constructor(insight: Insight, uiStyle: UIStyle) {
    this.insight = insight
    this.uiStyle = uiStyle
  }

  /**
   * 指定された数のUIパターンを生成
   */
  generateUIPatterns(count: number = 3): UIPattern[] {
    // インサイトとUIスタイルに基づいてパターンを選択・カスタマイズ
    const selectedPatterns = this.selectOptimalPatterns(count)
    return selectedPatterns.map(pattern => this.customizePatternForProject(pattern))
  }

  /**
   * 特定のパターンの完全なコードを生成
   */
  generatePatternCode(pattern: UIPattern): GeneratedUIPattern {
    const code = this.generateCompletePatternCode(pattern)
    const components = this.extractComponentsFromCode(code)
    const dependencies = this.extractDependencies(code)
    const assets = this.extractAssets(code)

    return {
      pattern,
      code,
      components,
      dependencies,
      assets
    }
  }

  /**
   * プロジェクトに最適なパターンを選択
   */
  private selectOptimalPatterns(count: number): UIPattern[] {
    const scored = this.basePatterns.map(pattern => ({
      pattern,
      score: this.calculatePatternScore(pattern)
    }))

    // スコア順にソートして上位を選択
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, count).map(item => item.pattern)
  }

  /**
   * パターンのスコアを計算
   */
  private calculatePatternScore(pattern: UIPattern): number {
    let score = 0

    // 機能との適合性
    if (this.insight.features.length > 5 && pattern.approach === 'dashboard-style') {
      score += 30
    }
    if (this.insight.features.length <= 3 && pattern.approach === 'landing-page') {
      score += 25
    }
    if (this.insight.target.includes('ビジネス') && pattern.approach === 'app-interface') {
      score += 20
    }

    // UIスタイルとの適合性
    if (this.uiStyle.personality.includes('modern') && pattern.animations) {
      score += 15
    }
    if (this.uiStyle.personality.includes('minimal') && pattern.layout === 'grid') {
      score += 10
    }
    if (this.uiStyle.personality.includes('bold') && pattern.colorScheme === 'vibrant') {
      score += 15
    }

    // レスポンシブ対応
    if (pattern.responsive) {
      score += 10
    }

    return score
  }

  /**
   * パターンをプロジェクト用にカスタマイズ
   */
  private customizePatternForProject(pattern: UIPattern): UIPattern {
    return {
      ...pattern,
      id: `${pattern.id}-${this.insight.features[0].toLowerCase().replace(/\s+/g, '-')}`,
      components: this.adaptComponentsToFeatures(pattern.components),
      colorScheme: this.adaptColorScheme(pattern.colorScheme)
    }
  }

  /**
   * 機能に基づいてコンポーネントを適応
   */
  private adaptComponentsToFeatures(components: string[]): string[] {
    const adapted = [...components]
    
    // 特定の機能に応じてコンポーネントを追加
    if (this.insight.features.some(f => f.includes('ユーザー') || f.includes('プロフィール'))) {
      adapted.push('UserProfile', 'Avatar')
    }
    if (this.insight.features.some(f => f.includes('検索'))) {
      adapted.push('SearchBar', 'FilterPanel')
    }
    if (this.insight.features.some(f => f.includes('チャット') || f.includes('コミュニケーション'))) {
      adapted.push('ChatInterface', 'MessageList')
    }
    if (this.insight.features.some(f => f.includes('データ') || f.includes('分析'))) {
      adapted.push('Charts', 'DataTable', 'MetricsCard')
    }

    return adapted
  }

  /**
   * UIスタイルに基づいて色スキームを適応
   */
  private adaptColorScheme(colorScheme: UIPattern['colorScheme']): UIPattern['colorScheme'] {
    // UIスタイルの personality に基づいて調整
    if (this.uiStyle.personality.includes('dark')) return 'dark'
    if (this.uiStyle.personality.includes('minimal')) return 'monochrome'
    if (this.uiStyle.personality.includes('vibrant') || this.uiStyle.personality.includes('bold')) return 'vibrant'
    if (this.uiStyle.personality.includes('soft') || this.uiStyle.personality.includes('gentle')) return 'pastel'
    
    return colorScheme
  }

  /**
   * パターンの完全なコードを生成
   */
  private generateCompletePatternCode(pattern: UIPattern): string {
    const imports = this.generateImports(pattern)
    const interfaces = this.generateInterfaces(pattern)
    const component = this.generateMainComponent(pattern)
    const subComponents = this.generateSubComponents(pattern)
    const styles = this.generateTailwindStyles(pattern)
    
    return `${imports}\n\n${interfaces}\n\n${component}\n\n${subComponents}\n\n${styles}`
  }

  /**
   * インポート文を生成
   */
  private generateImports(pattern: UIPattern): string {
    const baseImports = [
      `'use client'`,
      ``,
      `import React, { useState, useEffect } from 'react'`,
      `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'`,
      `import { Button } from '@/components/ui/button'`,
      `import { Badge } from '@/components/ui/badge'`,
      `import { Progress } from '@/components/ui/progress'`,
      `import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'`,
      `import { Input } from '@/components/ui/input'`,
      `import { Textarea } from '@/components/ui/textarea'`
    ]

    // アニメーション用のインポート
    if (pattern.animations) {
      baseImports.push(`import { motion, AnimatePresence } from 'framer-motion'`)
    }

    // パターン固有のアイコン
    const icons = this.getIconsForPattern(pattern)
    if (icons.length > 0) {
      baseImports.push(`import { ${icons.join(', ')} } from 'lucide-react'`)
    }

    return baseImports.join('\n')
  }

  /**
   * インターフェースを生成
   */
  private generateInterfaces(pattern: UIPattern): string {
    const interfaces: string[] = []

    // 基本的なデータインターフェース
    interfaces.push(`interface ${this.pascalCase(this.insight.features[0])}Data {
  id: string
  title: string
  description: string
  status: 'active' | 'pending' | 'completed'
  createdAt: Date
  metadata?: Record<string, any>
}`)

    // UIステートインターフェース
    interfaces.push(`interface UIState {
  loading: boolean
  error: string | null
  selectedItem: string | null
  filters: FilterState
  view: 'grid' | 'list' | 'detail'
}`)

    // フィルターステート
    interfaces.push(`interface FilterState {
  search: string
  category: string
  sortBy: 'date' | 'name' | 'status'
  sortOrder: 'asc' | 'desc'
}`)

    return interfaces.join('\n\n')
  }

  /**
   * メインコンポーネントを生成
   */
  private generateMainComponent(pattern: UIPattern): string {
    const componentName = `${this.pascalCase(pattern.name)}Pattern`
    
    const stateHooks = this.generateStateHooks(pattern)
    const effects = this.generateEffects(pattern)
    const handlers = this.generateEventHandlers(pattern)
    const render = this.generateRenderLogic(pattern)

    return `export default function ${componentName}() {
${stateHooks}

${effects}

${handlers}

  return (
${render}
  )
}`
  }

  /**
   * ステートフックを生成
   */
  private generateStateHooks(pattern: UIPattern): string {
    const hooks: string[] = []

    // 基本的なUIステート
    hooks.push(`  const [uiState, setUIState] = useState<UIState>({
    loading: false,
    error: null,
    selectedItem: null,
    filters: {
      search: '',
      category: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    },
    view: '${pattern.layout === 'grid' ? 'grid' : 'list'}'
  })`)

    // データステート
    hooks.push(`  const [data, setData] = useState<${this.pascalCase(this.insight.features[0])}Data[]>([])`)

    // アニメーション用ステート
    if (pattern.animations) {
      hooks.push(`  const [animationKey, setAnimationKey] = useState(0)`)
    }

    return hooks.join('\n\n')
  }

  /**
   * エフェクトを生成
   */
  private generateEffects(pattern: UIPattern): string {
    const effects: string[] = []

    // データロード用エフェクト
    effects.push(`  useEffect(() => {
    const loadData = async () => {
      setUIState(prev => ({ ...prev, loading: true }))
      try {
        // TODO: 実際のAPI呼び出しに置き換え
        const mockData = generateMockData()
        setData(mockData)
        console.log('Data loaded:', mockData)
      } catch (error) {
        setUIState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }))
      } finally {
        setUIState(prev => ({ ...prev, loading: false }))
      }
    }

    loadData()
  }, [])`)

    // フィルター用エフェクト
    effects.push(`  useEffect(() => {
    console.log('Filters changed:', uiState.filters)
    // TODO: フィルター適用ロジック
  }, [uiState.filters])`)

    return effects.join('\n\n')
  }

  /**
   * イベントハンドラーを生成
   */
  private generateEventHandlers(pattern: UIPattern): string {
    const handlers: string[] = []

    // アイテム選択ハンドラー
    handlers.push(`  const handleItemSelect = (itemId: string) => {
    setUIState(prev => ({ ...prev, selectedItem: itemId }))
    console.log('Item selected:', itemId)
  }`)

    // フィルター更新ハンドラー
    handlers.push(`  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setUIState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }))
  }`)

    // ビュー切り替えハンドラー
    handlers.push(`  const handleViewChange = (view: UIState['view']) => {
    setUIState(prev => ({ ...prev, view }))
    ${pattern.animations ? 'setAnimationKey(prev => prev + 1)' : ''}
  }`)

    // アクションハンドラー
    handlers.push(`  const handleAction = async (action: string, itemId?: string) => {
    console.log('Action triggered:', action, itemId)
    // TODO: 実際のアクション処理
    
    switch (action) {
      case 'create':
        console.log('Creating new item...')
        break
      case 'edit':
        console.log('Editing item:', itemId)
        break
      case 'delete':
        console.log('Deleting item:', itemId)
        break
      default:
        console.log('Unknown action:', action)
    }
  }`)

    return handlers.join('\n\n')
  }

  /**
   * レンダリングロジックを生成
   */
  private generateRenderLogic(pattern: UIPattern): string {
    const wrapperProps = pattern.animations 
      ? 'as={motion.div} key={animationKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}'
      : ''

    switch (pattern.approach) {
      case 'hero-centric':
        return this.generateHeroCentricLayout(pattern, wrapperProps)
      case 'card-focused':
        return this.generateCardFocusedLayout(pattern, wrapperProps)
      case 'dashboard-style':
        return this.generateDashboardLayout(pattern, wrapperProps)
      case 'landing-page':
        return this.generateLandingPageLayout(pattern, wrapperProps)
      case 'app-interface':
        return this.generateAppInterfaceLayout(pattern, wrapperProps)
      default:
        return this.generateDefaultLayout(pattern, wrapperProps)
    }
  }

  /**
   * ヒーロー中心レイアウト
   */
  private generateHeroCentricLayout(pattern: UIPattern, wrapperProps: string): string {
    return `    <div className="min-h-screen bg-gradient-to-br from-${this.getColorToken('background')} via-${this.getColorToken('secondary')}/10 to-${this.getColorToken('background')}" ${wrapperProps}>
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-${this.getColorToken('primary')} mb-6">
            ${this.insight.vision}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ${this.insight.value}
          </p>
          <Button 
            size="lg" 
            className="bg-${this.getColorToken('primary')} hover:bg-${this.getColorToken('primary')}/90"
            onClick={() => handleAction('get-started')}
          >
            今すぐ始める
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${this.insight.features.map((feature, index) => `
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleItemSelect('feature-${index}')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">${index + 1}</Badge>
                  ${feature}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  この機能により、ユーザーエクスペリエンスが向上します。
                </p>
              </CardContent>
            </Card>`).join('')}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-${this.getColorToken('primary')}/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-${this.getColorToken('primary')} mb-4">
            ${this.insight.target}の皆様へ
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            今すぐ始めて、効率性を体験してください。
          </p>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => handleAction('contact')}
          >
            お問い合わせ
          </Button>
        </div>
      </section>
    </div>`
  }

  /**
   * カード中心レイアウト
   */
  private generateCardFocusedLayout(pattern: UIPattern, wrapperProps: string): string {
    return `    <div className="min-h-screen bg-gray-50" ${wrapperProps}>
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-${this.getColorToken('primary')}">
              ${this.insight.vision.split(' ')[0]}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleViewChange('grid')}>
                グリッド
              </Button>
              <Button variant="outline" onClick={() => handleViewChange('list')}>
                リスト
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>フィルター</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Input
                  placeholder="検索..."
                  value={uiState.filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="max-w-xs"
                />
                <Button variant="outline" onClick={() => handleAction('filter')}>
                  適用
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className={\`grid gap-6 \${uiState.view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}\`}>
          {data.map((item, index) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => handleAction('view', item.id)}
                  >
                    詳細
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {uiState.loading && (
          <div className="text-center py-8">
            <Progress value={66} className="max-w-md mx-auto" />
            <p className="mt-2 text-gray-600">データを読み込み中...</p>
          </div>
        )}

        {/* Error State */}
        {uiState.error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{uiState.error}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>`
  }

  /**
   * ダッシュボードレイアウト
   */
  private generateDashboardLayout(pattern: UIPattern, wrapperProps: string): string {
    return `    <div className="min-h-screen bg-gray-900 text-white" ${wrapperProps}>
      {/* Top Bar */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">${this.insight.vision}</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                オンライン
              </Badge>
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              ${this.insight.features.map((feature, index) => `
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => handleItemSelect('nav-${index}')}
                >
                  ${feature}
                </Button>
              </li>`).join('')}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: '総計', value: '1,234', change: '+12%' },
              { title: 'アクティブ', value: '567', change: '+5%' },
              { title: '完了', value: '890', change: '+8%' },
              { title: '成功率', value: '94%', change: '+2%' }
            ].map((metric, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">{metric.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <p className="text-sm text-green-400">{metric.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Data Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">データ一覧</CardTitle>
              <CardDescription className="text-gray-400">
                最新のデータを表示しています
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>`
  }

  /**
   * ランディングページレイアウト
   */
  private generateLandingPageLayout(pattern: UIPattern, wrapperProps: string): string {
    return `    <div className="min-h-screen" ${wrapperProps}>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-${this.getColorToken('primary')}/10 to-${this.getColorToken('secondary')}/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-${this.getColorToken('primary')} mb-8">
            ${this.insight.vision}
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            ${this.insight.value}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-${this.getColorToken('primary')} hover:bg-${this.getColorToken('primary')}/90">
              無料で始める
            </Button>
            <Button size="lg" variant="outline">
              デモを見る
            </Button>
          </div>
        </div>
      </section>

      {/* Masonry Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">主な機能</h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            ${this.insight.features.map((feature, index) => `
            <Card className="break-inside-avoid hover:shadow-xl transition-shadow cursor-pointer" onClick={() => handleItemSelect('feature-${index}')}>
              <CardHeader>
                <CardTitle className="text-${this.getColorToken('primary')}">${feature}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  この機能により、${this.insight.target}の皆様の業務効率が大幅に向上します。
                </p>
                <Button variant="ghost" size="sm">
                  詳細を見る →
                </Button>
              </CardContent>
            </Card>`).join('')}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-16">料金プラン</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'ベーシック', price: '無料', features: ['基本機能', 'サポート'] },
              { name: 'プロ', price: '¥2,980/月', features: ['全機能', '優先サポート', 'カスタマイズ'] },
              { name: 'エンタープライズ', price: 'お問い合わせ', features: ['無制限', '専任サポート', 'オンサイト'] }
            ].map((plan, index) => (
              <Card key={index} className={index === 1 ? 'ring-2 ring-' + this.getColorToken('primary') : ''}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-2xl font-bold text-${this.getColorToken('primary')}">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-${this.getColorToken('primary')}"></Badge>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={index === 1 ? 'default' : 'outline'}>
                    選択する
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-8">お問い合わせ</h2>
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <Input placeholder="お名前" />
                <Input type="email" placeholder="メールアドレス" />
                <Textarea placeholder="メッセージ" rows={4} />
                <Button type="submit" className="w-full bg-${this.getColorToken('primary')} hover:bg-${this.getColorToken('primary')}/90">
                  送信する
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>`
  }

  /**
   * アプリインターフェースレイアウト
   */
  private generateAppInterfaceLayout(pattern: UIPattern, wrapperProps: string): string {
    return `    <div className="min-h-screen bg-white" ${wrapperProps}>
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-${this.getColorToken('primary')}">
                ${this.insight.vision.split(' ')[0]}
              </h1>
              <Badge variant="outline">${this.insight.features.length} 機能</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleAction('settings')}>
                設定
              </Button>
              <Button size="sm" className="bg-${this.getColorToken('primary')} hover:bg-${this.getColorToken('primary')}/90">
                新規作成
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">クイックアクション</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              ${this.insight.features.slice(0, 4).map((feature, index) => `
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => handleAction('quick-action', '${index}')}
              >
                <Badge>{index + 1}</Badge>
                <span className="text-sm">${feature}</span>
              </Button>`).join('')}
            </div>
          </div>

          {/* Recent Items */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">最近のアイテム</h2>
              <Button variant="ghost" size="sm">
                すべて表示 →
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.slice(0, 4).map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" variant="ghost">
                        開く
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <div>
            <h2 className="text-lg font-semibold mb-4">進捗概要</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { label: '完了済み', value: 75, color: 'bg-green-500' },
                    { label: '進行中', value: 45, color: 'bg-blue-500' },
                    { label: '計画中', value: 30, color: 'bg-yellow-500' }
                  ].map((progress, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{progress.label}</span>
                        <span>{progress.value}%</span>
                      </div>
                      <Progress value={progress.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Action Panel */}
        <aside className="w-80 bg-gray-50 border-l border-gray-200 p-6">
          <h3 className="font-semibold mb-4">アクションパネル</h3>
          
          {/* Quick Stats */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">今日の統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>完了タスク</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>新規作成</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>効率性</span>
                  <span className="font-medium text-green-600">+15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">最近のアクティビティ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'タスクを完了', time: '2分前' },
                  { action: '新しいプロジェクト作成', time: '1時間前' },
                  { action: 'レポート生成', time: '3時間前' },
                  { action: 'チーム招待', time: '1日前' }
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{activity.action}</span>
                    <span className="text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Status Bar */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>ステータス: 正常稼働中</span>
          <div className="flex items-center gap-4">
            <span>最終更新: {new Date().toLocaleTimeString()}</span>
            <Badge variant="outline" className="text-xs">
              v2.0.0
            </Badge>
          </div>
        </div>
      </footer>
    </div>`
  }

  /**
   * デフォルトレイアウト
   */
  private generateDefaultLayout(pattern: UIPattern, wrapperProps: string): string {
    return this.generateCardFocusedLayout(pattern, wrapperProps)
  }

  /**
   * サブコンポーネントを生成
   */
  private generateSubComponents(pattern: UIPattern): string {
    const components: string[] = []

    // モックデータ生成関数
    components.push(`// Mock data generator
function generateMockData(): ${this.pascalCase(this.insight.features[0])}Data[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: \`item-\${i + 1}\`,
    title: \`${this.insight.features[0]} \${i + 1}\`,
    description: \`これは${this.insight.features[0]}の説明です。ユーザーにとって価値のある機能を提供します。\`,
    status: ['active', 'pending', 'completed'][i % 3] as any,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    metadata: { category: 'sample', priority: i % 3 }
  }))
}`)

    return components.join('\n\n')
  }

  /**
   * Tailwindスタイルを生成
   */
  private generateTailwindStyles(pattern: UIPattern): string {
    return `// Tailwind CSS classes used in this pattern:
// Layout: ${pattern.layout}
// Color scheme: ${pattern.colorScheme}
// Components: ${pattern.components.join(', ')}
// Responsive: ${pattern.responsive ? 'Yes' : 'No'}
// Animations: ${pattern.animations ? 'Yes' : 'No'}`
  }

  /**
   * パターン用のアイコンを取得
   */
  private getIconsForPattern(pattern: UIPattern): string[] {
    const iconMap: Record<string, string[]> = {
      'hero-centric': ['ArrowRight', 'Star', 'Heart'],
      'card-focused': ['Grid', 'List', 'Filter'],
      'dashboard-style': ['BarChart', 'PieChart', 'TrendingUp'],
      'landing-page': ['Zap', 'Target', 'Award'],
      'app-interface': ['Settings', 'Plus', 'User']
    }

    return iconMap[pattern.approach] || ['Circle', 'Square', 'Triangle']
  }

  /**
   * 色トークンを取得
   */
  private getColorToken(type: 'primary' | 'secondary' | 'background'): string {
    const colorMap: Record<string, string> = {
      primary: 'blue-600',
      secondary: 'purple-600', 
      background: 'gray-50'
    }

    // UIスタイルの色を使用
    if (type === 'primary') {
      return this.hexToTailwind(this.uiStyle.colors.primary)
    }
    if (type === 'secondary') {
      return this.hexToTailwind(this.uiStyle.colors.secondary)
    }
    if (type === 'background') {
      return this.hexToTailwind(this.uiStyle.colors.background)
    }

    return colorMap[type] || 'gray-500'
  }

  /**
   * HEX色をTailwindクラスに変換
   */
  private hexToTailwind(hex: string): string {
    // 簡略化された変換（実際にはより詳細な色マッピングが必要）
    const colorMap: Record<string, string> = {
      '#3B82F6': 'blue-500',
      '#8B5CF6': 'purple-500',
      '#10B981': 'green-500',
      '#F59E0B': 'yellow-500',
      '#EF4444': 'red-500',
      '#FFFFFF': 'white',
      '#000000': 'black',
      '#1F2937': 'gray-800'
    }

    return colorMap[hex] || 'blue-500'
  }

  /**
   * PascalCase変換
   */
  private pascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase())
  }

  /**
   * コードからコンポーネントを抽出
   */
  private extractComponentsFromCode(code: string): string[] {
    const componentRegex = /<([A-Z][a-zA-Z0-9]*)/g
    const matches = code.match(componentRegex) || []
    return [...new Set(matches.map(match => match.slice(1)))]
  }

  /**
   * コードから依存関係を抽出
   */
  private extractDependencies(code: string): string[] {
    const deps: string[] = []
    
    if (code.includes('framer-motion')) deps.push('framer-motion')
    if (code.includes('lucide-react')) deps.push('lucide-react')
    if (code.includes('@radix-ui')) deps.push('@radix-ui/react-*')
    
    return deps
  }

  /**
   * コードからアセットを抽出
   */
  private extractAssets(code: string): string[] {
    // 画像、フォント等のアセットを抽出
    return []
  }
}

export default UIPatternGenerator