import OpenAI from 'openai'

console.log('🔧 [OPENAI-INIT] Initializing OpenAI client...')
console.log('🔧 [OPENAI-INIT] API Key exists:', !!process.env.OPENAI_API_KEY)
console.log('🔧 [OPENAI-INIT] API Key length:', process.env.OPENAI_API_KEY?.length || 0)
console.log('🔧 [OPENAI-INIT] API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-') || false)

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ [OPENAI-INIT] Missing OPENAI_API_KEY environment variable')
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
  console.error('❌ [OPENAI-INIT] Invalid API key format. Must start with sk-')
  throw new Error('Invalid OpenAI API key format')
}

console.log('✅ [OPENAI-INIT] OpenAI API key validation passed')

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 second timeout
  maxRetries: 2,
})

console.log('✅ [OPENAI-INIT] OpenAI client initialized successfully')

export const PHASE_PROMPTS = {
  FreeTalk: `あなたは友達のように自然に会話しながら、アイデアを一緒に膨らませるパートナーです。

重要なルール：
1. 質問攻めにしない（尋問NG）
2. 具体例を出して想像を刺激する
3. 「いいね！」「なるほど！」など共感から始める
4. ユーザーの言葉を拾って発展させる
5. 楽しい雰囲気を保つ

会話の進め方：
- 相手のアイデアに乗っかる
- 「例えば〜」で具体例を提示
- 「〜とかどう？」で軽く提案
- 相手が詳しく話したそうなら深掘り
- そうでなければ別の角度から

絶対NGワード：
- 「なぜ」「どうして」（詰問っぽい）
- 「誰が」「いつ」（5W1Hの直接質問）
- 「教えてください」（上から目線）

良い返答例：
ユーザー「料理アプリ作りたい」
あなた「料理アプリいいですね！レシピ検索とか、冷蔵庫の余り物から提案とかできたら便利そう🍳 あと、作った料理の写真を記録できたりしたら楽しいかも！」

返答は200文字以内で、絵文字を使って親しみやすく。`,

  InsightRefine: `以下の対話から重要な洞察を抽出し、構造化してください。
必ずJSON形式で返してください：

{
  "vision": "プロジェクトのビジョン（1文で）",
  "target": "ターゲットユーザー（具体的に）", 
  "features": ["主要機能1", "主要機能2", "主要機能3"],
  "value": "提供価値（ユーザーにとってのメリット）",
  "motivation": "作りたい理由・動機"
}`,

  UXBuild: `選択されたUIデザインに基づいて、具体的なUX設計を行ってください。
JSON形式で返してください：

{
  "layout": "レイアウト構造",
  "colorScheme": "カラーテーマ", 
  "typography": "タイポグラフィ",
  "navigation": "ナビゲーション方式",
  "components": ["コンポーネント1", "コンポーネント2"],
  "interactions": ["インタラクション1", "インタラクション2"]
}`,

  CodePlayground: `以下の要件で、必ず動作するシンプルなWebアプリを単一のHTMLファイルとして生成してください。

重要な制約：
1. 単一のHTMLファイルで完結すること
2. 外部ライブラリはCDNから読み込む
3. エラーが起きないシンプルな実装
4. 最低限の機能は必ず動作すること
5. レスポンシブデザイン対応

応答形式：
必ずJSONで返してください：
{
  "fullHtml": "完全なHTMLコード（<!DOCTYPE html>から</html>まで）",
  "title": "アプリのタイトル",
  "description": "アプリの簡単な説明"
}

生成するHTMLの構造：
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[アプリ名]</title>
    <style>
        /* 必要なCSS */
    </style>
</head>
<body>
    <!-- 必要なHTML -->
    <script>
        // 必要なJavaScript
    </script>
</body>
</html>`,

  StructureExtraction: `以下の会話履歴から、アプリのアイデアを整理してJSON形式で出力してください。
ユーザーに直接聞いていない情報は、会話の文脈から推測してください。

{
  "vision": "このアプリで実現したいこと",
  "target": "使ってくれそうな人",
  "features": ["会話に出てきた機能1", "機能2", "機能3"],
  "uiStyle": "modern/classic/playful/minimal から推測",
  "keywords": ["会話から拾ったキーワード"]
}

会話が自然に発展した後に実行される機能です。厳密な質問でなく、会話の流れから柔軟に解釈してください。`
}

export async function chatWithOpenAI(messages: any[], phase: string, signal?: AbortSignal, apiKeyOverride?: string) {
  const systemPrompt = PHASE_PROMPTS[phase as keyof typeof PHASE_PROMPTS] || PHASE_PROMPTS.FreeTalk

  try {
    // 2️⃣ GPTクライアント生成部分で明示的にAPIキー設定
    const API_KEY = apiKeyOverride || process.env.OPENAI_API_KEY
    console.log('🤖 [OPENAI-DEBUG] === GPT API 呼び出し準備 ===')
    console.log('🤖 [OPENAI-DEBUG] Phase:', phase)
    console.log('🤖 [OPENAI-DEBUG] Messages count:', messages.length)
    console.log('🤖 [OPENAI-DEBUG] Override key provided:', !!apiKeyOverride)
    console.log('🤖 [OPENAI-DEBUG] Final API key exists:', !!API_KEY)
    console.log('🤖 [OPENAI-DEBUG] Final API key length:', API_KEY?.length || 0)
    console.log('🤖 [OPENAI-DEBUG] Final API key preview:', API_KEY?.substring(0, 10) + '...')
    console.log('🤖 [OPENAI-DEBUG] API key format valid:', API_KEY?.startsWith('sk-'))
    
    if (!API_KEY) {
      throw new Error('OPENAI_API_KEY is required but not provided')
    }
    
    if (!API_KEY.startsWith('sk-')) {
      throw new Error(`Invalid OpenAI API key format: ${API_KEY.substring(0, 10)}...`)
    }
    
    // Validate messages format
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array')
    }
    
    const validatedMessages = messages.map((msg, index) => {
      if (!msg || typeof msg !== 'object') {
        throw new Error(`Message ${index} is not a valid object`)
      }
      if (!msg.role || !msg.content) {
        throw new Error(`Message ${index} is missing role or content`)
      }
      return {
        role: msg.role,
        content: String(msg.content)
      }
    })
    
    console.log('🤖 [OPENAI-DEBUG] Validated messages:', validatedMessages.length)
    console.log('🤖 [OPENAI-DEBUG] System prompt length:', systemPrompt.length)
    
    // OpenAI APIのモデルとボディ構造
    const model = 'gpt-3.5-turbo' // gpt-4ではなくgpt-3.5-turboを使用
    
    const requestBody = {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...validatedMessages,
      ],
      temperature: phase === 'FreeTalk' ? 0.9 : 0.7,
      max_tokens: phase === 'CodePlayground' ? 2000 : 1000,
      stream: false, // streamは必ずfalse
    }
    
    console.log('🤖 [OPENAI-DEBUG] Request body prepared:', {
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      temperature: requestBody.temperature,
      max_tokens: requestBody.max_tokens
    })
    
    // 2️⃣ 明示的にAPIキーを設定してfetchで使用
    console.log('🔑 [FETCH-PREP] === fetch準備でAPIキー確認 ===')
    console.log('🔑 [FETCH-PREP] API_KEY exists:', !!API_KEY)
    console.log('🔑 [FETCH-PREP] API_KEY preview:', API_KEY.substring(0, 10) + '...')
    
    // Use direct fetch instead of OpenAI SDK to avoid potential issues
    console.log('🌐 [OPENAI-DEBUG] Making direct API call to OpenAI...')
    console.log('🌐 [OPENAI-DEBUG] Request body preview:', {
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      temperature: requestBody.temperature,
      max_tokens: requestBody.max_tokens
    })
    
    const authHeader = `Bearer ${API_KEY}`
    
    // 🔍 Authorization ヘッダーの詳細ログ
    console.log('🔍 [AUTH-DEBUG] ===== Authorization ヘッダー確認 =====')
    console.log('🔍 [AUTH-DEBUG] API_KEY値:', API_KEY)
    console.log('🔍 [AUTH-DEBUG] authHeader全体:', authHeader)
    console.log('🔍 [AUTH-DEBUG] authHeaderプレビュー:', authHeader.substring(0, 25) + '...')
    console.log('🔍 [AUTH-DEBUG] Bearer形式正確:', authHeader.startsWith('Bearer sk-'))
    console.log('🔍 [AUTH-DEBUG] ==========================================')
    
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'User-Agent': 'MATURA-App/1.0'
      },
      body: JSON.stringify(requestBody),
      signal,
    }
    
    // 🔍 fetchOptionsの詳細ログ
    console.log('🔍 [FETCH-DEBUG] ===== fetchOptions確認 =====')
    console.log('🔍 [FETCH-DEBUG] method:', fetchOptions.method)
    console.log('🔍 [FETCH-DEBUG] Content-Type:', fetchOptions.headers['Content-Type'])
    console.log('🔍 [FETCH-DEBUG] Authorization:', fetchOptions.headers['Authorization'])
    console.log('🔍 [FETCH-DEBUG] User-Agent:', fetchOptions.headers['User-Agent'])
    console.log('🔍 [FETCH-DEBUG] bodyサイズ:', fetchOptions.body.length)
    console.log('🔍 [FETCH-DEBUG] ==========================================')
    
    console.log('🌐 [FETCH-DEBUG] Fetch options:', {
      method: fetchOptions.method,
      headers: {
        'Content-Type': fetchOptions.headers['Content-Type'],
        'Authorization': fetchOptions.headers['Authorization'].substring(0, 20) + '...',
        'User-Agent': fetchOptions.headers['User-Agent']
      },
      bodyLength: fetchOptions.body.length
    })
    
    // 🔴 Fetchボディの確認
    console.log('🔴 [FETCH-BODY] === リクエストボディ確認 ===')
    console.log('🔴 [FETCH-BODY] model:', requestBody.model)
    console.log('🔴 [FETCH-BODY] messages count:', requestBody.messages.length)
    console.log('🔴 [FETCH-BODY] messages[0]:', requestBody.messages[0])
    console.log('🔴 [FETCH-BODY] stream:', requestBody.stream)
    console.log('🔴 [FETCH-BODY] Full body:', JSON.stringify(requestBody, null, 2))
    console.log('='.repeat(60))
    
    let response
    let responseText = ''
    
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', fetchOptions)
      
      console.log('🌐 [OPENAI-RESPONSE] Status:', response.status)
      console.log('🌐 [OPENAI-RESPONSE] StatusText:', response.statusText)
      console.log('🌐 [OPENAI-RESPONSE] Headers:', Object.fromEntries(response.headers.entries()))
      
      responseText = await response.text()
      console.log('🌐 [OPENAI-RESPONSE] Response length:', responseText.length)
      console.log('🌐 [OPENAI-RESPONSE] Full response:', responseText)
      
    } catch (fetchError) {
      console.error('💥 [FETCH-ERROR] Fetch failed:', fetchError)
      console.error('💥 [FETCH-ERROR] Error type:', typeof fetchError)
      console.error('💥 [FETCH-ERROR] Error message:', fetchError instanceof Error ? fetchError.message : String(fetchError))
      throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'}`)
    }
    
    if (!response.ok) {
      console.error('🔴 [OPENAI-HTTP-ERROR] HTTP error:', response.status, response.statusText)
      console.error('🔴 [OPENAI-HTTP-ERROR] Response body:', responseText)
      
      // Try fallback to gpt-3.5-turbo if gpt-4 fails
      if (response.status === 404 && requestBody.model === 'gpt-4') {
        console.log('🤖 [OPENAI-DEBUG] gpt-4 not available, falling back to gpt-3.5-turbo')
        requestBody.model = 'gpt-3.5-turbo'
        
        const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
            'User-Agent': 'MATURA-App/1.0'
          },
          body: JSON.stringify(requestBody),
          signal,
        })
        
        const fallbackText = await fallbackResponse.text()
        if (!fallbackResponse.ok) {
          throw new Error(`OpenAI API Error (${fallbackResponse.status}): ${fallbackText}`)
        }
        
        const completion = JSON.parse(fallbackText)
        return completion.choices[0].message.content
      }
      
      throw new Error(`OpenAI API Error (${response.status}): ${responseText}`)
    }
    
    const completion = JSON.parse(responseText)
    
    console.log('🤖 [OPENAI-DEBUG] OpenAI API call completed successfully')
    console.log('🤖 [OPENAI-DEBUG] Response choices:', completion.choices?.length || 0)
    console.log('🤖 [OPENAI-DEBUG] First choice content length:', completion.choices[0]?.message?.content?.length || 0)

    return completion.choices[0].message.content
  } catch (error) {
    console.error('💥 [OPENAI-DEBUG] OpenAI API error occurred!')
    console.error('💥 [OPENAI-DEBUG] Error type:', typeof error)
    console.error('💥 [OPENAI-DEBUG] Error constructor:', error?.constructor?.name)
    console.error('💥 [OPENAI-DEBUG] Error name:', error instanceof Error ? error.name : 'Unknown')
    console.error('💥 [OPENAI-DEBUG] Error message:', error instanceof Error ? error.message : String(error))
    console.error('💥 [OPENAI-DEBUG] Full error object:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      console.error('🔴 [OPENAI-API-ERROR] Status:', error.status)
      console.error('🔴 [OPENAI-API-ERROR] Type:', error.type)
      console.error('🔴 [OPENAI-API-ERROR] Code:', error.code)
      console.error('🔴 [OPENAI-API-ERROR] Headers:', error.headers)
      console.error('🔴 [OPENAI-API-ERROR] Request ID:', error.headers?.['x-request-id'])
      
      // Log specific error types
      if (error.status === 401) {
        console.error('🔴 [OPENAI-API-ERROR] Authentication failed - check API key')
      } else if (error.status === 403) {
        console.error('🔴 [OPENAI-API-ERROR] Permission denied - check API key permissions')
      } else if (error.status === 429) {
        console.error('🔴 [OPENAI-API-ERROR] Rate limit exceeded')
      } else if (error.status === 500) {
        console.error('🔴 [OPENAI-API-ERROR] OpenAI server error')
      }
      
      // Create a more descriptive error message for API errors
      const apiErrorMessage = `OpenAI API Error (${error.status}): ${error.message}`
      throw new Error(apiErrorMessage)
    }
    
    // Handle connection errors
    if (error instanceof Error && (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('network') ||
      error.message.includes('timeout')
    )) {
      console.error('🌐 [OPENAI-NETWORK-ERROR] Network connection issue:', error.message)
      throw new Error(`ネットワークエラー: ${error.message}`)
    }
    
    // Handle abort errors
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏹️ [OPENAI-ABORT] Request was aborted')
      throw error
    }
    
    // Handle JSON parsing errors
    if (error instanceof Error && error.message.includes('JSON')) {
      console.error('📄 [OPENAI-JSON-ERROR] JSON parsing failed:', error.message)
      throw new Error(`レスポンス解析エラー: ${error.message}`)
    }
    
    // Handle other Error objects
    if (error instanceof Error) {
      console.error('❓ [OPENAI-UNKNOWN-ERROR] Unhandled error type:', error.name)
      throw new Error(`AI応答エラー: ${error.message}`)
    }
    
    // Handle non-Error objects (strings, etc.)
    console.error('❓ [OPENAI-UNKNOWN-ERROR] Non-Error object thrown:', error)
    throw new Error(`AI応答の生成に失敗しました: ${String(error)}`)
  }
}