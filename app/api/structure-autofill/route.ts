import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface StructureAutofillRequest {
  userInput: string
  stage?: string
}

export async function POST(request: NextRequest) {
  try {
    const { userInput, stage } = await request.json() as StructureAutofillRequest

    console.log('🔍 [DEBUG] 受信した入力:', userInput)
    console.log('🔍 [DEBUG] ステージ:', stage)

    if (!userInput || userInput.trim().length === 0) {
      return NextResponse.json(
        { error: 'ユーザー入力が必要です' },
        { status: 400 }
      )
    }

    let prompt = ''
    if (stage) {
      // 個別ステージの支援
      prompt = `あなたは思考構造化のエキスパートです。以下の入力内容に基づいて、${stage}フィールドの内容を生成してください。

入力内容: ${userInput}

以下の形式で回答してください：
- why: 目的・理由（なぜやるのか）
- who: 対象ユーザー（だれのためか）
- what: 提供する機能・価値（なにを提供するか）※配列形式
- how: 実現方法（どうやって実現するか）
- impact: 期待される効果（どんな効果・変化を生むか）

特に${stage}フィールドに焦点を当てて、具体的で実用的な内容を生成してください。
JSON形式で回答してください。`
    } else {
      // 全体構造化
      prompt = `あなたは思考構造化のエキスパートです。以下のユーザー要求を分析して、Why/Who/What/How/Impactの5つの観点で構造化してください。

ユーザー要求: ${userInput}

以下の形式で回答してください：
- why: 目的・理由（なぜやるのか）
- who: 対象ユーザー（だれのためか）
- what: 提供する機能・価値（なにを提供するか）※配列形式で3-5個
- how: 実現方法（どうやって実現するか）
- impact: 期待される効果（どんな効果・変化を生むか）

具体的で実用的な内容を生成してください。JSON形式で回答してください。`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('OpenAI APIからの応答が空です')
    }

    console.log('🔍 [DEBUG] OpenAI応答:', response)

    // JSONパース
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('JSON形式の応答が見つかりません')
    }

    const structure = JSON.parse(jsonMatch[0])
    console.log('🔍 [DEBUG] パース済み構造:', structure)

    return NextResponse.json({
      success: true,
      data: {
        userInput,
        stage,
        structure,
        note: stage ? `${stage}フィールドを生成しました` : '全体構造を生成しました'
      }
    })

  } catch (error: any) {
    console.error('構造化エラー:', error)
    
    return NextResponse.json(
      { 
        error: '構造化に失敗しました', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: '構造化自動入力API',
    usage: {
      method: 'POST',
      body: {
        userInput: '必須 - ユーザーの要求内容'
      },
      example: {
        userInput: '楽しい日記アプリを作りたい'
      }
    },
    output: {
      why: '目的・理由',
      who: '対象ユーザー',
      what: '提供する機能・価値',
      how: '実現方法',
      impact: '期待される効果'
    }
  })
}