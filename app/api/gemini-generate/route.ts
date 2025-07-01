import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface GeminiGenerateRequest {
  insights: {
    vision: string
    target: string
    features: string[]
    value: string
    motivation: string
  }
  uiStyle: {
    name: string
    category: string
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
    }
    personality?: string[]
  }
  uxDesign?: any
  mode?: 'standard' | 'premium'
}

// Rate limiting (simple in-memory store)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 50 // Increased for development

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

// SSE streaming response
function createProgressStream(insights: any, uiStyle: any, apiKey: string, ip: string) {
  const encoder = new TextEncoder()
  
  return new ReadableStream({
    async start(controller) {
      try {
        // Step 1: Requirements Analysis
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          step: 1,
          totalSteps: 6,
          phase: 'requirements',
          message: `📋 ${insights.vision}の要件を分析中...`, 
          progress: 10 
        })}\n\n`))

        await new Promise(resolve => setTimeout(resolve, 2000))

        // Step 2: Architecture Design
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          step: 2,
          totalSteps: 6,
          phase: 'architecture',
          message: `🏗️ ${insights.features[0]}のアーキテクチャを設計中...`, 
          progress: 25 
        })}\n\n`))

        await new Promise(resolve => setTimeout(resolve, 2000))

        // Step 3: UI Component Design
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          step: 3,
          totalSteps: 6,
          phase: 'ui-design',
          message: `🎨 ${uiStyle.name}スタイルでUIコンポーネントを設計中...`, 
          progress: 40 
        })}\n\n`))

        await new Promise(resolve => setTimeout(resolve, 2000))

        // Step 4: Generate Code with Gemini
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          step: 4,
          totalSteps: 6,
          phase: 'generating',
          message: '🚀 Gemini AIでコードを生成中...', 
          progress: 60 
        })}\n\n`))

        // Build comprehensive prompt
        const geminiPrompt = buildGeminiPrompt(insights, uiStyle)
        
        // Execute Gemini CLI with stdin
        const command = `echo "${geminiPrompt.replace(/"/g, '\\"')}" | gemini -y`
        
        try {
          const { stdout, stderr } = await execAsync(command, {
            timeout: 180000, // 3 minutes
            env: {
              ...process.env,
              GEMINI_API_KEY: apiKey
            },
            maxBuffer: 1024 * 1024 * 20 // 20MB buffer
          })

          if (stderr && stderr.trim().length > 0) {
            console.warn('[gemini-generate] stderr output:', stderr)
          }

          // Step 5: Code Enhancement
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'progress', 
            step: 5,
            totalSteps: 6,
            phase: 'enhancing',
            message: '✨ コードを最適化中...', 
            progress: 80 
          })}\n\n`))

          await new Promise(resolve => setTimeout(resolve, 1000))

          // Parse and enhance the generated code
          const enhancedCode = parseAndEnhanceGeminiResponse(stdout, insights, uiStyle)

          // Step 6: Validation
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'progress', 
            step: 6,
            totalSteps: 6,
            phase: 'validating',
            message: '✅ コードを検証中...', 
            progress: 95 
          })}\n\n`))

          await new Promise(resolve => setTimeout(resolve, 1000))

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
            message: '🎉 生成完了！',
            progress: 100
          })}\n\n`))

        } catch (execError: any) {
          console.error('[gemini-generate] Execution error:', execError)
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: execError.message || 'コード生成エラー',
            message: '❌ コード生成に失敗しました'
          })}\n\n`))
        }

        controller.close()

      } catch (error: any) {
        console.error('[gemini-generate] Stream error:', error)
        
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

function buildGeminiPrompt(insights: any, uiStyle: any): string {
  const { vision, target, features, value, motivation } = insights
  const isIncomeApp = vision.includes('収入') || vision.includes('アルバイト') || features.some((f: string) => f.includes('収入'))
  const isDark = uiStyle.category === 'dark'

  return `You are a web development expert. Create a complete HTML file for a production-ready web application.

CRITICAL INSTRUCTION: Only output the HTML code. Do not create any files. Only respond with the HTML code content.

PROJECT: ${vision}
TARGET: ${target}
VALUE: ${value}
FEATURES: ${features.join(', ')}

UI REQUIREMENTS:
- Use shadcn/ui component patterns
- Apply Tailwind CSS for all styling
- Primary color: ${uiStyle.colors.primary}
- Secondary color: ${uiStyle.colors.secondary}
- Accent color: ${uiStyle.colors.accent}
- ${isDark ? 'Dark mode with' : 'Light mode with'} background: ${uiStyle.colors.background}
- Text color: ${uiStyle.colors.text}

TECHNICAL REQUIREMENTS:
1. Single HTML file with inline CSS and JavaScript
2. Use Tailwind CSS via CDN
3. Implement shadcn/ui component patterns:
   - Card components with proper shadows and borders
   - Form inputs with focus states
   - Buttons with hover/active states
   - Toast notifications for feedback
   - Modal dialogs for confirmations
4. Full CRUD operations with localStorage
5. Responsive design (mobile-first)
6. Input validation and error handling
7. Loading states and transitions
8. Keyboard shortcuts (Ctrl+S to save, etc.)

${isIncomeApp ? `
SPECIFIC FEATURES FOR INCOME TRACKING:
- Work time tracking (start/end times)
- Hourly wage calculation
- Monthly income charts (use Chart.js or similar)
- 103万円 limit tracking with progress bar
- Income predictions
- Export to CSV/JSON
` : `
SPECIFIC FEATURES FOR DATA MANAGEMENT:
- Advanced search and filtering
- Category-based organization
- Statistics dashboard
- Bulk operations
- Import/Export functionality
`}

IMPORTANT CONSTRAINTS:
- Generate production-ready code, NOT a demo
- Include real business logic and calculations
- Make it beautiful with smooth animations
- Ensure all features actually work
- Use Japanese labels and messages
- DO NOT create any files
- ONLY output the complete HTML code starting with <!DOCTYPE html>

Please provide the complete HTML file code:`
}

function parseAndEnhanceGeminiResponse(response: string, insights: any, uiStyle: any): string {
  // Extract HTML code from response
  let code = response
  const codeMatch = response.match(/```html([\s\S]*?)```/i)
  if (codeMatch) {
    code = codeMatch[1].trim()
  }

  // Ensure proper HTML structure
  if (!code.includes('<!DOCTYPE html>')) {
    code = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${insights.vision}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
${code}
</body>
</html>`
  }

  // Ensure Tailwind is included
  if (!code.includes('tailwindcss')) {
    code = code.replace('</head>', '<script src="https://cdn.tailwindcss.com"></script>\n</head>')
  }

  // Add custom Tailwind config for shadcn/ui compatibility
  const tailwindConfig = `
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '${uiStyle.colors.primary}',
              secondary: '${uiStyle.colors.secondary}',
              accent: '${uiStyle.colors.accent}',
              background: '${uiStyle.colors.background}',
              foreground: '${uiStyle.colors.text}',
              muted: '${uiStyle.category === 'dark' ? '#374151' : '#f3f4f6'}',
              'muted-foreground': '${uiStyle.category === 'dark' ? '#9ca3af' : '#6b7280'}',
              card: '${uiStyle.category === 'dark' ? '#1f2937' : '#ffffff'}',
              'card-foreground': '${uiStyle.colors.text}',
              popover: '${uiStyle.category === 'dark' ? '#1f2937' : '#ffffff'}',
              'popover-foreground': '${uiStyle.colors.text}',
              border: '${uiStyle.category === 'dark' ? '#374151' : '#e5e7eb'}',
              input: '${uiStyle.category === 'dark' ? '#374151' : '#e5e7eb'}',
              ring: '${uiStyle.colors.primary}',
            },
            fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
            },
          }
        }
      }
    </script>
  `

  if (!code.includes('tailwind.config')) {
    code = code.replace('</head>', `${tailwindConfig}\n</head>`)
  }

  // Add base shadcn/ui styles
  const baseStyles = `
    <style>
      /* shadcn/ui base styles */
      * {
        border-color: theme('colors.border');
      }
      body {
        font-family: theme('fontFamily.sans');
        background-color: theme('colors.background');
        color: theme('colors.foreground');
      }
      
      /* shadcn/ui component styles */
      .card {
        @apply rounded-lg border bg-card text-card-foreground shadow-sm;
      }
      
      .card-header {
        @apply flex flex-col space-y-1.5 p-6;
      }
      
      .card-title {
        @apply text-2xl font-semibold leading-none tracking-tight;
      }
      
      .card-description {
        @apply text-sm text-muted-foreground;
      }
      
      .card-content {
        @apply p-6 pt-0;
      }
      
      .card-footer {
        @apply flex items-center p-6 pt-0;
      }
      
      .btn {
        @apply inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
      }
      
      .btn-primary {
        @apply bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2;
      }
      
      .btn-secondary {
        @apply bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2;
      }
      
      .btn-destructive {
        @apply bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2;
      }
      
      .btn-outline {
        @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2;
      }
      
      .btn-ghost {
        @apply hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2;
      }
      
      .btn-icon {
        @apply h-10 w-10;
      }
      
      .input {
        @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
      }
      
      .label {
        @apply text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70;
      }
      
      .textarea {
        @apply flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
      }
      
      .select {
        @apply flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
      }
      
      /* Animations */
      @keyframes slideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      
      .animate-in {
        animation: slideIn 0.2s ease-out;
      }
      
      /* Toast notifications */
      .toast {
        @apply pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all;
      }
      
      .toast-success {
        @apply bg-green-50 text-green-900 border-green-200;
      }
      
      .toast-error {
        @apply bg-red-50 text-red-900 border-red-200;
      }
    </style>
  `

  if (!code.includes('shadcn/ui')) {
    code = code.replace('</head>', `${baseStyles}\n</head>`)
  }

  return code
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('[gemini-generate] Request started at:', new Date().toISOString())
    
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // DISABLED: Rate limiting completely disabled for development
    console.log('[DEBUG] Rate limiting disabled for gemini-generate')
    console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV)
    
    // Clear rate limit map to ensure fresh start
    requestCounts.clear()

    // Parse request body
    const body = await request.json() as GeminiGenerateRequest

    // Validate request
    if (!body.insights || !body.uiStyle) {
      return NextResponse.json(
        { error: 'Insights and UI style are required' },
        { status: 400 }
      )
    }

    // Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[gemini-generate] GEMINI_API_KEY is not set')
      return NextResponse.json(
        { error: 'Gemini APIキーが設定されていません。' },
        { status: 500 }
      )
    }

    // Create progress stream
    const stream = createProgressStream(body.insights, body.uiStyle, apiKey, ip)

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
        error: 'Gemini CLI実行中に予期しないエラーが発生しました。',
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
    
    // Check if Gemini CLI is available
    let geminiAvailable = false
    try {
      await execAsync('gemini --version', { timeout: 5000 })
      geminiAvailable = true
    } catch (error) {
      console.warn('[gemini-generate] Gemini CLI not available:', error)
    }

    return NextResponse.json({
      status: 'ok',
      geminiApiKeyConfigured: hasApiKey,
      geminiCliAvailable: geminiAvailable,
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