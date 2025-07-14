import { NextRequest, NextResponse } from 'next/server';

// 簡単なルールベースのスキーマ推論（フォールバック）
function inferSchemaFromKeywords(userInput: string) {
  const input = userInput.toLowerCase();
  
  // キーワードベースのパターンマッチング
  const patterns = [
    {
      keywords: ['ブログ', 'blog', '記事', 'article', '投稿', 'post'],
      schema: {
        tableName: 'blog_posts',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'title', type: 'text', nullable: false, primaryKey: false },
          { name: 'content', type: 'text', nullable: false, primaryKey: false },
          { name: 'author', type: 'text', nullable: false, primaryKey: false },
          { name: 'published', type: 'boolean', nullable: false, primaryKey: false, defaultValue: 'false' },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['タスク', 'task', 'todo', 'やること', '管理'],
      schema: {
        tableName: 'tasks',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'title', type: 'text', nullable: false, primaryKey: false },
          { name: 'description', type: 'text', nullable: true, primaryKey: false },
          { name: 'completed', type: 'boolean', nullable: false, primaryKey: false, defaultValue: 'false' },
          { name: 'due_date', type: 'date', nullable: true, primaryKey: false },
          { name: 'priority', type: 'text', nullable: false, primaryKey: false, defaultValue: 'medium' },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['家計簿', 'budget', '収支', '支出', '収入', 'expense', 'income'],
      schema: {
        tableName: 'budget_entries',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'amount', type: 'number', nullable: false, primaryKey: false },
          { name: 'category', type: 'text', nullable: false, primaryKey: false },
          { name: 'description', type: 'text', nullable: true, primaryKey: false },
          { name: 'type', type: 'text', nullable: false, primaryKey: false },
          { name: 'date', type: 'date', nullable: false, primaryKey: false },
          { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
          { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
        ]
      }
    },
    {
      keywords: ['在庫', 'inventory', '商品', 'product', '管理'],
      schema: {
        tableName: 'inventory_items',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'name', type: 'text', nullable: false, primaryKey: false },
          { name: 'quantity', type: 'number', nullable: false, primaryKey: false },
          { name: 'price', type: 'number', nullable: true, primaryKey: false },
          { name: 'category', type: 'text', nullable: false, primaryKey: false },
          { name: 'supplier', type: 'text', nullable: true, primaryKey: false },
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

  // デフォルトのスキーマ
  return {
    tableName: 'generic_data',
    columns: [
      { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
      { name: 'name', type: 'text', nullable: false, primaryKey: false },
      { name: 'description', type: 'text', nullable: true, primaryKey: false },
      { name: 'status', type: 'text', nullable: false, primaryKey: false, defaultValue: 'active' },
      { name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false },
      { name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'ユーザー入力が必要です' }, { status: 400 });
    }

    const schema = inferSchemaFromKeywords(userInput);
    
    return NextResponse.json({ 
      schema,
      source: 'fallback_inference',
      message: 'ルールベースの推論を使用しました'
    });

  } catch (error) {
    console.error('Fallback schema inference error:', error);
    return NextResponse.json(
      { error: 'スキーマ推論中にエラーが発生しました' },
      { status: 500 }
    );
  }
}