import { NextRequest, NextResponse } from 'next/server'

interface GeminiGenerateRequest {
  insights: {
    vision: string
    target: string
    features: string[]
    value: string
    motivation?: string
    appName?: string
    description?: string
  }
  uiStyle: {
    name: string
    category?: string
    description?: string
    primaryColor?: string
    accentColor?: string
    secondaryColor?: string
    colors?: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
    }
    personality?: string[]
  }
  uxDesign?: {
    layout?: {
      principles: string[]
      structure: string
    }
    colorScheme?: {
      guidelines: string[]
      accessibility: string
    }
    navigation?: {
      strategy: string[]
      userFlow: string
    }
    typography?: {
      guidelines: string[]
      hierarchy: string
    }
    animations?: {
      principles: string[]
      interactions: string
    }
  }
  selectedTopPageDesign?: {
    name: string
    description: string
    layout: string
    components: string[]
  }
  mode?: 'standard' | 'premium'
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 10

function getRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = requestCounts.get(ip)
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 }
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 }
  }
  
  record.count++
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count }
}

// Simple and reliable code generation
function createProgressStream(insights: any, uiStyle: any, uxDesign: any, topPageDesign: any, apiKey: string) {
  const encoder = new TextEncoder()
  
  return new ReadableStream({
    async start(controller) {
      try {
        console.log('[gemini-generate] Starting simple code generation')
        
        // Step 1: Analysis
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          message: '📋 要件を分析中...', 
          progress: 20
        })}\n\n`))

        await new Promise(resolve => setTimeout(resolve, 2000))

        // Step 2: Generate Code
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          message: '🚀 Gemini AIでコードを生成中...', 
          progress: 60 
        })}\n\n`))

        // Build a comprehensive prompt
        const prompt = buildProfessionalPrompt(insights, uiStyle, uxDesign, topPageDesign)
        console.log('[gemini-generate] Calling Gemini API with prompt length:', prompt.length)
        
        // Call Gemini API with correct endpoint
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 8192
            }
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('[gemini-generate] API error:', response.status, errorText)
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
        }

        const geminiData = await response.json()
        console.log('[gemini-generate] Gemini response:', geminiData)
        
        const generatedCode = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
        
        if (!generatedCode) {
          throw new Error('Gemini APIからレスポンスが取得できませんでした')
        }

        console.log('[gemini-generate] Generated code length:', generatedCode.length)

        // Step 3: Enhancement
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          message: '✨ コードを最適化中...', 
          progress: 90 
        })}\n\n`))

        await new Promise(resolve => setTimeout(resolve, 1000))

        // Enhance the generated code
        const enhancedCode = enhanceGeneratedCode(generatedCode, insights, uiStyle)
        
        console.log('[gemini-generate] Enhanced code length:', enhancedCode.length)

        // Send final result
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'complete', 
          code: enhancedCode,
          metadata: {
            title: insights.vision,
            description: insights.value,
            features: insights.features,
            uiStyle: uiStyle.name,
            generatedAt: new Date().toISOString()
          },
          message: '🎉 コード生成完了！',
          progress: 100
        })}\n\n`))

        controller.close()

      } catch (error: any) {
        console.error('[gemini-generate] Error:', error)
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'error', 
          error: error.message || '不明なエラー',
          message: '❌ エラーが発生しました'
        })}\n\n`))
        
        controller.close()
      }
    }
  })
}

// Professional prompt builder with detailed design requirements
function buildProfessionalPrompt(insights: any, uiStyle: any, uxDesign: any, topPageDesign: any): string {
  const { vision, target, features, value, appName } = insights
  const isIncomeApp = vision?.includes('収入') || vision?.includes('アルバイト') || features?.some((f: string) => f.includes('収入'))

  // Extract detailed color information
  const colors = uiStyle?.colors || {
    primary: uiStyle?.primaryColor || '#3B82F6',
    secondary: uiStyle?.secondaryColor || '#6B7280', 
    accent: uiStyle?.accentColor || '#10B981',
    background: uiStyle?.category === 'dark' ? '#1F2937' : '#FFFFFF',
    text: uiStyle?.category === 'dark' ? '#F9FAFB' : '#1F2937'
  }

  // UX Design guidelines
  const layoutPrinciples = uxDesign?.layout?.principles || []
  const colorGuidelines = uxDesign?.colorScheme?.guidelines || []
  const navigationStrategy = uxDesign?.navigation?.strategy || []
  const typographyGuidelines = uxDesign?.typography?.guidelines || []
  const animationPrinciples = uxDesign?.animations?.principles || []

  return `あなたは経験豊富なUI/UXデザイナー兼フルスタック開発者です。以下の詳細な要件に基づいて、プロダクションレベルの美しく実用的なWebアプリケーションを作成してください。

# 🎯 プロジェクト概要
**アプリ名**: ${appName || vision}
**ビジョン**: ${vision}
**ターゲットユーザー**: ${target}
**提供価値**: ${value}
**主要機能**: ${features?.join('、') || 'カスタム機能'}

# 🎨 UI/UXデザインシステム

## カラーパレット
- **プライマリ**: ${colors.primary} (メインアクション、ブランドカラー)
- **セカンダリ**: ${colors.secondary} (サブ要素、テキスト)
- **アクセント**: ${colors.accent} (強調、成功状態)
- **背景**: ${colors.background}
- **テキスト**: ${colors.text}
- **UIスタイル**: ${uiStyle?.name} - ${uiStyle?.description || ''}
- **パーソナリティ**: ${uiStyle?.personality?.join('、') || 'モダン、洗練された'}

## レイアウト設計原則
${layoutPrinciples.length > 0 ? layoutPrinciples.map((p: any) => `- ${p}`).join('\n') : `
- モバイルファーストアプローチ
- グリッドシステムベースのレイアウト
- 視覚的階層の明確化
- 適切な余白とパディング`}

## 配色ガイドライン
${colorGuidelines.length > 0 ? colorGuidelines.map((g: any) => `- ${g}`).join('\n') : `
- 高コントラストで読みやすさを重視
- ブランドカラーの一貫した使用
- アクセシビリティ基準AAA準拠`}

## ナビゲーション戦略
${navigationStrategy.length > 0 ? navigationStrategy.map((s: any) => `- ${s}`).join('\n') : `
- 直感的なメニュー構造
- パンくずナビゲーション
- 明確なCTAボタン配置`}

## タイポグラフィ
${typographyGuidelines.length > 0 ? typographyGuidelines.map((t: any) => `- ${t}`).join('\n') : `
- 見出しは階層的なサイズ設定
- 本文は読みやすいフォントサイズ
- 重要情報の適切な強調表示`}

## アニメーション・インタラクション
${animationPrinciples.length > 0 ? animationPrinciples.map((a: any) => `- ${a}`).join('\n') : `
- 微細なホバーエフェクト
- スムーズなページ遷移
- ローディング状態の表現`}

${topPageDesign ? `
## トップページデザイン指定
**レイアウト**: ${topPageDesign.name} - ${topPageDesign.description}
**構成要素**: ${topPageDesign.components?.join('、') || ''}
**レイアウト詳細**: ${topPageDesign.layout || ''}
` : ''}

# 🛠️ 技術実装要件

## 基本構造
1. **単一HTMLファイル** - CSS、JavaScriptを内包
2. **Tailwind CSS** - CDN経由で最新版使用
3. **Vanilla JavaScript** - ES6+、モジュラー設計
4. **localStorage** - データ永続化
5. **レスポンシブデザイン** - 全デバイス対応

## UI コンポーネント要件
- **ヘッダー**: ロゴ、ナビゲーション、ユーザーアクション
- **サイドバー**: 機能別メニュー（モバイル時ハンバーガー）
- **メインエリア**: ダッシュボード、データ表示
- **フォーム**: 入力検証、エラー表示
- **データテーブル**: ソート、フィルタ、ページネーション
- **モーダル**: 確認ダイアログ、詳細表示
- **トースト**: 操作結果フィードバック
- **ローディング**: プログレスバー、スケルトン

${isIncomeApp ? `
# 💰 収入管理アプリ特別要件

## 核心機能
- **時給計算エンジン**: 基本時給、残業手当（1.25倍）、深夜手当（0.25倍追加）
- **シフト管理**: 勤務開始・終了時刻、休憩時間自動計算
- **収入追跡**: 日別、週別、月別収入サマリー
- **103万円限度額**: プログレスバー、アラート機能
- **予測機能**: 現在のペースでの年収予測
- **エクスポート**: CSV、PDF形式での給与明細出力

## データ可視化
- **月間収入グラフ**: Chart.js使用
- **時間別労働統計**: 効率分析
- **目標達成率**: プログレス表示

## 税金計算機能
- **所得税概算**: 基本控除込み
- **住民税概算**: 地域差考慮
- **社会保険料**: 概算計算
` : `
# 📊 データ管理アプリ要件

## 高度な機能
- **多層検索**: キーワード、カテゴリ、日付範囲
- **高度フィルタ**: 複数条件組み合わせ
- **データ統計**: グラフィカルな分析表示
- **バルク操作**: 一括編集、削除
- **インポート/エクスポート**: CSV、JSON、PDF
- **データバックアップ**: 自動保存機能
`}

# 🎯 品質基準

## デザイン品質
- **Pixel Perfect**: デザインシステム完全準拠
- **一貫性**: 全ページ統一されたUI/UX
- **アクセシビリティ**: WCAG 2.1 AAA基準
- **パフォーマンス**: 2秒以内ロード時間

## 機能品質  
- **エラーハンドリング**: 全入力の検証とフィードバック
- **データ検証**: 型チェック、範囲チェック
- **状態管理**: 一貫したアプリケーション状態
- **セキュリティ**: XSS対策、データサニタイズ

# 📝 出力指示

**重要**: 以下の要件を全て満たした完全なHTMLファイルを出力してください：

1. **完全性**: 全機能が実装され、実際に使用可能
2. **美しさ**: プロのデザイナーが作成したレベルの視覚的品質
3. **実用性**: 実際のユーザーが日常的に使えるアプリケーション
4. **技術性**: モダンなWeb開発のベストプラクティス準拠

<!DOCTYPE html>から始まる完全なHTMLファイルのみを出力してください。説明や前置きは不要です。`
}

// Code enhancement function
function enhanceGeneratedCode(code: string, insights: any, uiStyle: any): string {
  let enhancedCode = code

  // Extract HTML if it's wrapped in markdown
  const htmlMatch = code.match(/```html\s*([\s\S]*?)\s*```/i)
  if (htmlMatch) {
    enhancedCode = htmlMatch[1].trim()
  }

  // Ensure proper HTML structure
  if (!enhancedCode.includes('<!DOCTYPE html>')) {
    enhancedCode = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${insights.vision || 'アプリケーション'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${enhancedCode}
</body>
</html>`
  }

  // Add Tailwind if not present
  if (!enhancedCode.includes('tailwindcss')) {
    enhancedCode = enhancedCode.replace('</head>', '    <script src="https://cdn.tailwindcss.com"></script>\n</head>')
  }

  // Add meta tags for better SEO
  if (!enhancedCode.includes('<meta name="description"')) {
    enhancedCode = enhancedCode.replace('</head>', `    <meta name="description" content="${insights.value || 'プロフェッショナルなWebアプリケーション'}">\n</head>`)
  }

  return enhancedCode
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('[gemini-generate] Request started at:', new Date().toISOString())
    
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limit
    const rateLimit = getRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'レート制限に達しました。しばらく待ってから再試行してください。' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }

    // Parse request body
    const body = await request.json() as GeminiGenerateRequest

    // Validate request
    if (!body.insights || !body.uiStyle) {
      return NextResponse.json(
        { error: 'Insights and UI style are required' },
        { status: 400 }
      )
    }

    // Check Gemini API key with manual fallback
    let apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      // Try manual .env.local loading
      try {
        const fs = require('fs')
        const path = require('path')
        const envPath = path.join(process.cwd(), '.env.local')
        
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8')
          const lines = envContent.split('\n')
          
          for (const line of lines) {
            const trimmedLine = line.trim()
            if (trimmedLine.startsWith('GEMINI_API_KEY=')) {
              apiKey = trimmedLine.split('=')[1].trim()
              console.log('[gemini-generate] Loaded GEMINI_API_KEY from .env.local')
              break
            }
          }
        }
      } catch (error) {
        console.error('[gemini-generate] Error loading .env.local:', error)
      }
    }
    
    if (!apiKey) {
      console.error('[gemini-generate] GEMINI_API_KEY is not set')
      return NextResponse.json(
        { error: 'Gemini APIキーが設定されていません。' },
        { status: 500 }
      )
    }

    // Create progress stream
    const stream = createProgressStream(body.insights, body.uiStyle, body.uxDesign, body.selectedTopPageDesign, apiKey)

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
    })

  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error('[gemini-generate] Unexpected error:', error)
    
    return NextResponse.json(
      { 
        error: 'Gemini API実行中に予期しないエラーが発生しました。',
        details: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const hasApiKey = !!process.env.GEMINI_API_KEY
    
    return NextResponse.json({
      status: 'ok',
      geminiApiKeyConfigured: hasApiKey,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}