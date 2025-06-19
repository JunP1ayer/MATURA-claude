import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const PHASE_PROMPTS = {
  FreeTalk: `あなたは温かく共感的なAIアシスタント「MATURA」です。
ユーザーのアイデアを深掘りし、なぜそれを作りたいのか、誰のために作るのか、どんな価値があるのかを自然な対話で引き出してください。

特徴：
- 温かく肯定的なトーン
- 共感的で伴走するキャラクター
- 簡潔で親しみやすい返答
- ユーザーが話しやすい雰囲気作り
- 構造化や分析は裏で行い、表面的には自由対話を維持

返答は200文字以内で、次の質問に繋がるような内容にしてください。`,

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

  CodePlayground: `以下の仕様に基づいて、完全に動作するHTML/CSS/JavaScriptコードを生成してください。
モダンで美しく、レスポンシブなWebアプリケーションを作成してください。`
}

export async function chatWithOpenAI(messages: any[], phase: string, signal?: AbortSignal) {
  const systemPrompt = PHASE_PROMPTS[phase as keyof typeof PHASE_PROMPTS] || PHASE_PROMPTS.FreeTalk

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: phase === 'CodePlayground' ? 2000 : 1000,
    }, {
      signal,
      // OpenAI SDK supports timeout in milliseconds
      timeout: 90000, // 90 seconds timeout
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('[chat-openai] OpenAI API error:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      console.error('[chat-openai] Status:', error.status)
      console.error('[chat-openai] Type:', error.type)
      console.error('[chat-openai] Code:', error.code)
      
      // Preserve original error for better handling in route
      throw error
    }
    
    // Handle abort errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }
    
    // Generic error
    throw new Error('AI応答の生成に失敗しました')
  }
}