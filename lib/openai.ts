import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

export async function chatWithOpenAI(messages: any[], phase: string, signal?: AbortSignal) {
  const systemPrompt = PHASE_PROMPTS[phase as keyof typeof PHASE_PROMPTS] || PHASE_PROMPTS.FreeTalk

  try {
    console.log('🤖 [OPENAI-DEBUG] Starting OpenAI API call')
    console.log('🤖 [OPENAI-DEBUG] Phase:', phase)
    console.log('🤖 [OPENAI-DEBUG] Messages count:', messages.length)
    console.log('🤖 [OPENAI-DEBUG] Signal provided:', !!signal)
    console.log('🤖 [OPENAI-DEBUG] Model: gpt-4')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: phase === 'FreeTalk' ? 0.9 : 0.7, // More creative for natural dialogue
      max_tokens: phase === 'CodePlayground' ? 2000 : 1000,
      stream: false, // Explicitly disable streaming
    }, {
      signal,
      // OpenAI SDK supports timeout in milliseconds
      timeout: 90000, // 90 seconds timeout
    })
    
    console.log('🤖 [OPENAI-DEBUG] OpenAI API call completed successfully')
    console.log('🤖 [OPENAI-DEBUG] Response choices:', completion.choices?.length || 0)
    console.log('🤖 [OPENAI-DEBUG] First choice content length:', completion.choices[0]?.message?.content?.length || 0)

    return completion.choices[0].message.content
  } catch (error) {
    console.error('💥 [OPENAI-DEBUG] OpenAI API error occurred!')
    console.error('💥 [OPENAI-DEBUG] Error type:', typeof error)
    console.error('💥 [OPENAI-DEBUG] Error constructor:', error?.constructor?.name)
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