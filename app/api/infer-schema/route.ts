import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 高度なルールベースのスキーマ推論（フォールバック）
function inferSchemaFromKeywords(userInput: string) {
  const input = userInput.toLowerCase();
  
  // キーワードベースのパターンマッチング（拡張版）
  const patterns = [
    {
      keywords: ['扶養', '収入', '年収', '103万', '130万', '扶養控除', '所得制限', '扶養ライン'],
      schema: {
        tableName: 'income_records',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'amount', type: 'number', nullable: false, primaryKey: false },
          { name: 'source', type: 'text', nullable: false, primaryKey: false },
          { name: 'income_type', type: 'text', nullable: false, primaryKey: false },
          { name: 'date', type: 'date', nullable: false, primaryKey: false },
          { name: 'year', type: 'number', nullable: false, primaryKey: false },
          { name: 'threshold_type', type: 'text', nullable: false, primaryKey: false, defaultValue: '103万' },
          { name: 'cumulative_amount', type: 'number', nullable: false, primaryKey: false, defaultValue: '0' },
          { name: 'notes', type: 'text', nullable: true, primaryKey: false },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['ブログ', 'blog', '記事', 'article', '投稿', 'post', 'ニュース', 'news'],
      schema: {
        tableName: 'blog_posts',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'title', type: 'text', nullable: false, primaryKey: false },
          { name: 'content', type: 'text', nullable: false, primaryKey: false },
          { name: 'author', type: 'text', nullable: false, primaryKey: false },
          { name: 'category', type: 'text', nullable: true, primaryKey: false },
          { name: 'tags', type: 'text', nullable: true, primaryKey: false },
          { name: 'featured_image', type: 'text', nullable: true, primaryKey: false },
          { name: 'published', type: 'boolean', nullable: false, primaryKey: false, defaultValue: 'false' },
          { name: 'view_count', type: 'number', nullable: false, primaryKey: false, defaultValue: '0' },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['タスク', 'task', 'todo', 'やること', '管理', 'プロジェクト'],
      schema: {
        tableName: 'tasks',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'title', type: 'text', nullable: false, primaryKey: false },
          { name: 'description', type: 'text', nullable: true, primaryKey: false },
          { name: 'status', type: 'text', nullable: false, primaryKey: false, defaultValue: 'pending' },
          { name: 'priority', type: 'text', nullable: false, primaryKey: false, defaultValue: 'medium' },
          { name: 'assigned_to', type: 'text', nullable: true, primaryKey: false },
          { name: 'due_date', type: 'date', nullable: true, primaryKey: false },
          { name: 'completed', type: 'boolean', nullable: false, primaryKey: false, defaultValue: 'false' },
          { name: 'progress', type: 'number', nullable: false, primaryKey: false, defaultValue: '0' },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['家計簿', 'budget', '収支', '支出', '収入', 'expense', 'income', '家計', '財務'],
      schema: {
        tableName: 'budget_entries',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'amount', type: 'number', nullable: false, primaryKey: false },
          { name: 'category', type: 'text', nullable: false, primaryKey: false },
          { name: 'subcategory', type: 'text', nullable: true, primaryKey: false },
          { name: 'description', type: 'text', nullable: true, primaryKey: false },
          { name: 'type', type: 'text', nullable: false, primaryKey: false },
          { name: 'payment_method', type: 'text', nullable: true, primaryKey: false },
          { name: 'date', type: 'date', nullable: false, primaryKey: false },
          { name: 'receipt_url', type: 'text', nullable: true, primaryKey: false },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['在庫', 'inventory', '商品', 'product', '倉庫', 'stock'],
      schema: {
        tableName: 'inventory_items',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'name', type: 'text', nullable: false, primaryKey: false },
          { name: 'sku', type: 'text', nullable: true, primaryKey: false },
          { name: 'quantity', type: 'number', nullable: false, primaryKey: false },
          { name: 'unit_price', type: 'number', nullable: true, primaryKey: false },
          { name: 'total_value', type: 'number', nullable: true, primaryKey: false },
          { name: 'category', type: 'text', nullable: false, primaryKey: false },
          { name: 'supplier', type: 'text', nullable: true, primaryKey: false },
          { name: 'location', type: 'text', nullable: true, primaryKey: false },
          { name: 'minimum_stock', type: 'number', nullable: true, primaryKey: false },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['顧客', 'customer', 'client', 'user', 'ユーザー', '会員', 'member'],
      schema: {
        tableName: 'customers',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'name', type: 'text', nullable: false, primaryKey: false },
          { name: 'email', type: 'email', nullable: false, primaryKey: false },
          { name: 'phone', type: 'tel', nullable: true, primaryKey: false },
          { name: 'address', type: 'text', nullable: true, primaryKey: false },
          { name: 'company', type: 'text', nullable: true, primaryKey: false },
          { name: 'status', type: 'text', nullable: false, primaryKey: false, defaultValue: 'active' },
          { name: 'notes', type: 'text', nullable: true, primaryKey: false },
          { name: 'last_contact', type: 'date', nullable: true, primaryKey: false },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['イベント', 'event', '予約', 'booking', 'reservation', '予定', 'schedule'],
      schema: {
        tableName: 'events',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'title', type: 'text', nullable: false, primaryKey: false },
          { name: 'description', type: 'text', nullable: true, primaryKey: false },
          { name: 'start_time', type: 'datetime', nullable: false, primaryKey: false },
          { name: 'end_time', type: 'datetime', nullable: false, primaryKey: false },
          { name: 'location', type: 'text', nullable: true, primaryKey: false },
          { name: 'organizer', type: 'text', nullable: false, primaryKey: false },
          { name: 'max_participants', type: 'number', nullable: true, primaryKey: false },
          { name: 'current_participants', type: 'number', nullable: false, primaryKey: false, defaultValue: '0' },
          { name: 'status', type: 'text', nullable: false, primaryKey: false, defaultValue: 'planned' },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    }
  ];

  // マッチするパターンを探す
  for (const pattern of patterns) {
    if (pattern.keywords.some(keyword => input.includes(keyword))) {
      return pattern.schema;
    }
  }

  // デフォルトのスキーマ（汎用的で使いやすい）
  return {
    tableName: 'custom_data',
    columns: [
      { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
      { name: 'title', type: 'text', nullable: false, primaryKey: false },
      { name: 'description', type: 'text', nullable: true, primaryKey: false },
      { name: 'category', type: 'text', nullable: true, primaryKey: false },
      { name: 'priority', type: 'text', nullable: false, primaryKey: false, defaultValue: 'normal' },
      { name: 'status', type: 'text', nullable: false, primaryKey: false, defaultValue: 'active' },
      { name: 'tags', type: 'text', nullable: true, primaryKey: false },
      { name: 'value', type: 'number', nullable: true, primaryKey: false },
      { name: 'url', type: 'url', nullable: true, primaryKey: false },
      { name: 'notes', type: 'text', nullable: true, primaryKey: false },
      { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
      { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
    ]
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate API key
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set');
}

export async function POST(req: NextRequest) {
  let userInput = '';
  
  try {
    const requestBody = await req.json();
    userInput = requestBody.userInput;

    if (!userInput) {
      return NextResponse.json({ error: 'ユーザー入力が必要です' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not available, using fallback');
      const fallbackSchema = inferSchemaFromKeywords(userInput);
      return NextResponse.json({
        schema: fallbackSchema,
        fallback: true,
        source: 'rule_based_inference',
        message: 'OpenAI API key not configured, using rule-based inference'
      });
    }

    const prompt = `あなたはアプリケーションのDBスキーマをJSON形式で推論するAIです。以下のユーザー入力をもとに必要なデータベース構造を生成してください。

ルール:
1. id列(uuid)は必須で、主キーとして設定
2. スキーマはシンプルで最小限に
3. 適切なデータ型を選択（text, integer, boolean, timestamp, uuid等）
4. created_at, updated_atも基本的に含める
5. レスポンスは以下の形式の純粋なJSONのみを返してください（説明文は不要）

形式:
{
  "tableName": "テーブル名（英語、snake_case）",
  "columns": [
    {
      "name": "カラム名",
      "type": "データ型",
      "nullable": true/false,
      "primaryKey": true/false,
      "defaultValue": "デフォルト値（あれば）"
    }
  ]
}

ユーザー入力: ${userInput}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたはデータベース設計の専門家です。ユーザーの要求から最適なスキーマを推論してください。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('GPTからの応答が取得できませんでした');
    }

    let schema;
    try {
      schema = JSON.parse(response);
    } catch (parseError) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        schema = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSONの解析に失敗しました');
      }
    }

    if (!schema.tableName || !schema.columns) {
      throw new Error('無効なスキーマ形式です');
    }

    return NextResponse.json({ schema });

  } catch (error) {
    console.error('Schema inference error:', error);
    
    // フォールバック推論を使用
    try {
      console.log('Using fallback schema inference');
      const fallbackSchema = inferSchemaFromKeywords(userInput);
      return NextResponse.json({
        schema: fallbackSchema,
        fallback: true,
        source: 'rule_based_inference',
        originalError: error instanceof Error ? error.message : 'GPT API failed'
      });
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
    
    // より詳細なエラー情報を提供
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'スキーマ推論中にエラーが発生しました',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}