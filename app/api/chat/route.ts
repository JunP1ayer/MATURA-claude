import { NextRequest, NextResponse } from 'next/server'
import { chatWithOpenAI } from '@/lib/openai'

// Request validation schemas
interface ChatRequest {
  message: string
  messages?: Array<{ role: string; content: string }>
  phase: string
  isStructured?: boolean
  requestStructureExtraction?: boolean
}

// Rate limiting (simple in-memory store for demo)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30

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

function validateRequest(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const { message, messages, phase, isStructured } = body as ChatRequest

  // Validate phase
  const validPhases = ['FreeTalk', 'InsightRefine', 'SketchView', 'UXBuild', 'CodePlayground', 'ReleaseBoard']
  if (!phase || !validPhases.includes(phase)) {
    return { valid: false, error: 'Invalid or missing phase' }
  }

  // Validate message for non-structured requests
  if (!isStructured) {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return { valid: false, error: 'Message is required and must be a non-empty string' }
    }
    if (message.length > 10000) {
      return { valid: false, error: 'Message too long (max 10000 characters)' }
    }
  }

  // Validate messages array
  if (messages && !Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' }
  }

  if (messages) {
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.role !== 'string' || typeof msg.content !== 'string') {
        return { valid: false, error: 'Invalid message format' }
      }
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return { valid: false, error: 'Invalid message role' }
      }
    }
  }

  return { valid: true }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let body: any

  try {
    // ***** DETAILED DEBUG LOGGING START *****
    console.log('='.repeat(50))
    console.log('[DEBUG] /api/chat POST request received')
    console.log('[DEBUG] Timestamp:', new Date().toISOString())
    console.log('[DEBUG] Request URL:', request.url)
    console.log('[DEBUG] Request method:', request.method)
    console.log('[DEBUG] Request headers:', Object.fromEntries(request.headers.entries()))
    
    // API Key debug (safely)
    const debugApiKey = process.env.OPENAI_API_KEY
    console.log('[DEBUG] Environment check:')
    console.log('[DEBUG] - OPENAI_API_KEY exists:', !!debugApiKey)
    console.log('[DEBUG] - OPENAI_API_KEY length:', debugApiKey?.length || 0)
    console.log('[DEBUG] - OPENAI_API_KEY prefix:', debugApiKey ? debugApiKey.substring(0, 3) + '...' : 'none')
    console.log('[DEBUG] - NODE_ENV:', process.env.NODE_ENV)
    console.log('='.repeat(50))
    // ***** DETAILED DEBUG LOGGING END *****

    // Get abort signal from request
    const signal = request.signal
    
    // Log request start
    console.log('[/api/chat] Request started at:', new Date().toISOString())
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
            'X-RateLimit-Reset': ((Date.now() + RATE_LIMIT_WINDOW) / 1000).toString(),
          }
        }
      )
    }

    // 🔥 DANGEROUS FIX: Use Next.js proper JSON parsing
    console.log('🔥 [ULTRA-FIX] Using Next.js request.json() method...')
    
    try {
      // Use Next.js built-in JSON parsing instead of text()
      body = await request.json()
      console.log('🔥 [ULTRA-FIX] JSON parsed successfully with request.json()')
      console.log('🔥 [ULTRA-FIX] Body contents:', JSON.stringify(body, null, 2))
      console.log('🔥 [ULTRA-FIX] Message from UI:', body?.message)
      console.log('🔥 [ULTRA-FIX] Phase:', body?.phase)
      console.log('🔥 [ULTRA-FIX] Messages count:', body?.messages?.length || 0)
    } catch (jsonError) {
      console.error('❌ [ULTRA-FIX] request.json() failed:', jsonError)
      console.error('❌ [ULTRA-FIX] Attempting fallback to request.text()...')
      
      // Fallback to text method if JSON parsing fails
      const textBody = await request.text()
      console.log('🔥 [ULTRA-FIX] Text body fallback:', textBody)
      
      if (!textBody || textBody.trim().length === 0) {
        console.error('❌ [ULTRA-FIX] Both JSON and text methods failed - empty body')
        return NextResponse.json(
          { error: 'Empty request body. Please check frontend request implementation.' },
          { status: 400 }
        )
      }
      
      try {
        body = JSON.parse(textBody)
        console.log('🔥 [ULTRA-FIX] Manual JSON parse successful')
      } catch (parseError) {
        console.error('❌ [ULTRA-FIX] Manual JSON parse failed:', parseError)
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        )
      }
    }

    const validation = validateRequest(body)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('[chat-api] OPENAI_API_KEY is not set in environment variables')
      return NextResponse.json(
        { error: 'OpenAI APIキーが設定されていません。.env.localファイルを確認してください。' },
        { status: 500 }
      )
    }
    
    // プレースホルダーキーのチェック
    if (apiKey.includes('YOUR_KEY_HERE') || apiKey.length < 20) {
      console.error('[chat-api] OPENAI_API_KEY appears to be a placeholder:', apiKey.substring(0, 10) + '...')
      return NextResponse.json(
        { error: 'OpenAI APIキーが正しく設定されていません。.env.localファイルに有効なAPIキーを設定してください。' },
        { status: 500 }
      )
    }

    const { message, messages = [], phase, isStructured = false, requestStructureExtraction = false } = body as ChatRequest

    // メッセージの構築
    let chatMessages = []
    
    if (isStructured) {
      // 構造化データ生成用
      chatMessages = [
        {
          role: 'user',
          content: message
        }
      ]
    } else {
      // 通常の対話用
      chatMessages = [
        ...messages,
        {
          role: 'user',
          content: message
        }
      ]
    }

    // OpenAI APIを呼び出し（abort signalを渡す）
    console.log('[/api/chat] Calling OpenAI API with phase:', phase)
    const aiResponse = await chatWithOpenAI(chatMessages, phase, signal)
    console.log('[/api/chat] OpenAI API response received, length:', aiResponse?.length || 0)

    if (!aiResponse) {
      console.error('[/api/chat] No response from OpenAI API')
      return NextResponse.json(
        { error: 'AIからの応答を取得できませんでした' },
        { status: 500 }
      )
    }

    const responseTime = Date.now() - startTime
    console.log('[/api/chat] Request completed successfully in', responseTime, 'ms')
    
    // Log the final response content before returning
    console.log('[/api/chat] Final AI response content:', aiResponse)

    // 🧠 ULTRA THINK: 構造抽出機能 - 10メッセージ以上で自動実行
    let extractedStructure = null
    if (requestStructureExtraction && phase === 'FreeTalk' && messages.length >= 10) {
      console.log('[/api/chat] ✨ Performing structure extraction for', messages.length, 'messages')
      
      try {
        const structureExtractionPrompt = `会話履歴：${JSON.stringify(messages)}`
        
        const structureResponse = await chatWithOpenAI(
          [{ role: 'user', content: structureExtractionPrompt }],
          'StructureExtraction',
          signal
        )
        
        if (structureResponse) {
          try {
            extractedStructure = JSON.parse(structureResponse)
            console.log('[/api/chat] ✅ Structure extraction successful:', extractedStructure)
          } catch (parseError) {
            console.error('[/api/chat] ❌ Structure extraction JSON parse failed:', parseError)
            console.error('[/api/chat] Raw structure response:', structureResponse)
          }
        }
      } catch (extractionError) {
        console.error('[/api/chat] ❌ Structure extraction failed:', extractionError)
      }
    }
    
    const response = NextResponse.json(
      {
        response: aiResponse, // Changed from 'message' to 'response' as per spec
        message: aiResponse, // Keep 'message' for backward compatibility
        phase,
        timestamp: new Date().toISOString(),
        responseTime,
        // 構造抽出結果を含める
        extractedStructure,
        hasStructureExtraction: !!extractedStructure,
      },
      {
        headers: {
          'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )
    
    console.log('[/api/chat] status:', response.status)
    return response

  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error('[chat-api] Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      body: body ? JSON.stringify(body, null, 2) : 'No body',
      responseTime,
    })
    
    // エラーの種類に応じて適切なレスポンスを返す
    if (error instanceof Error) {
      // Network timeout error or user cancellation
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        console.error('[chat-api] Request was aborted/cancelled. Reason:', error.message)
        console.error('[chat-api] Request was running for:', Date.now() - startTime, 'ms')
        return NextResponse.json(
          { error: 'リクエストがタイムアウトまたはキャンセルされました。もう一度お試しください。' },
          { status: 499 }
        )
      }
      
      // Handle OpenAI API errors
      if ('status' in error) {
        const openAIError = error as any
        console.error('[chat-api] OpenAI API error status:', openAIError.status)
        
        if (openAIError.status === 401) {
          return NextResponse.json(
            { error: 'API認証エラーが発生しました' },
            { status: 401 }
          )
        }
        
        if (openAIError.status === 429) {
          return NextResponse.json(
            { error: 'APIの利用制限に達しました。しばらく待ってから再試行してください' },
            { status: 429 }
          )
        }
        
        if (openAIError.status === 500 || openAIError.status === 503) {
          return NextResponse.json(
            { error: 'OpenAIサーバーエラーが発生しました。しばらく待ってから再試行してください' },
            { status: 503 }
          )
        }
      }
      
      // Legacy error message checks
      if (error.message.includes('API key') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'API認証エラーが発生しました' },
          { status: 401 }
        )
      }
      
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'APIの利用制限に達しました。しばらく待ってから再試行してください' },
          { status: 429 }
        )
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'リクエストがタイムアウトしました。再試行してください' },
          { status: 408 }
        )
      }
      
      // Content policy violations
      if (error.message.includes('content_policy')) {
        return NextResponse.json(
          { error: 'リクエストがコンテンツポリシーに違反しています' },
          { status: 400 }
        )
      }
      
      // Model overloaded
      if (error.message.includes('overloaded') || error.message.includes('server_error')) {
        return NextResponse.json(
          { error: 'サーバーが過負荷状態です。しばらく待ってから再試行してください' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'AIとの通信中にエラーが発生しました。再試行してください',
        timestamp: new Date().toISOString(),
        responseTime,
      },
      { status: 500 }
    )
  }
}

// オプション：GET メソッドでAPIの状態を確認
export async function GET() {
  try {
    const isConfigured = !!process.env.OPENAI_API_KEY
    
    return NextResponse.json({
      status: 'ok',
      apiConfigured: isConfigured,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    )
  }
}