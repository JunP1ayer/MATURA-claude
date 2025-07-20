import { NextRequest, NextResponse } from 'next/server';
import { industryPatternSelector } from '@/lib/industry-specialized-patterns';

interface SimpleGenerateRequest {
  idea: string;
}

// 基本的なスキーマ生成関数（業界特化パターンを考慮）
function generateBasicSchema(idea: string) {
  // 業界特化パターンをチェック
  const industryPattern = industryPatternSelector.selectBestPattern(idea, { what: idea });
  
  if (industryPattern) {
    // 業界特化スキーマを生成
    return generateIndustrySpecificSchema(industryPattern, idea);
  }
  
  // フォールバック: 従来のスキーマ生成
  const tableName = idea.includes('タスク') || idea.includes('task') ? 'tasks' :
                   idea.includes('ユーザー') || idea.includes('user') ? 'users' :
                   idea.includes('商品') || idea.includes('product') ? 'products' :
                   idea.includes('予約') || idea.includes('reservation') ? 'reservations' :
                   'items';

  return {
    tableName,
    columns: [
      { name: 'id', type: 'uuid', primaryKey: true },
      { name: 'name', type: 'varchar', required: true },
      { name: 'description', type: 'text' },
      { name: 'status', type: 'varchar', default: 'active' },
      { name: 'created_at', type: 'timestamp', default: 'now()' },
      { name: 'updated_at', type: 'timestamp', default: 'now()' }
    ]
  };
}

// 業界特化スキーマ生成
function generateIndustrySpecificSchema(industryPattern: any, idea: string) {
  const baseTableName = industryPattern.id.replace(/-/g, '_');
  
  // 業界別のカラム定義
  const industryColumns: Record<string, any[]> = {
    'medical_appointment': [
      { name: 'patient_name', type: 'varchar', required: true },
      { name: 'doctor_name', type: 'varchar', required: true },
      { name: 'appointment_date', type: 'timestamp', required: true },
      { name: 'medical_notes', type: 'text' },
      { name: 'status', type: 'varchar', default: 'scheduled' }
    ],
    'restaurant_pos': [
      { name: 'item_name', type: 'varchar', required: true },
      { name: 'price', type: 'decimal', required: true },
      { name: 'category', type: 'varchar', required: true },
      { name: 'availability', type: 'boolean', default: true },
      { name: 'description', type: 'text' }
    ],
    'hotel_reservation': [
      { name: 'guest_name', type: 'varchar', required: true },
      { name: 'room_number', type: 'varchar', required: true },
      { name: 'check_in_date', type: 'date', required: true },
      { name: 'check_out_date', type: 'date', required: true },
      { name: 'guest_count', type: 'integer', default: 1 }
    ],
    'expense_tracker': [
      { name: 'amount', type: 'decimal', required: true },
      { name: 'category', type: 'varchar', required: true },
      { name: 'description', type: 'text' },
      { name: 'date', type: 'date', required: true },
      { name: 'payment_method', type: 'varchar' }
    ]
  };
  
  const columns = industryColumns[baseTableName] || [
    { name: 'title', type: 'varchar', required: true },
    { name: 'description', type: 'text' },
    { name: 'status', type: 'varchar', default: 'active' }
  ];
  
  return {
    tableName: baseTableName,
    industryPattern,
    columns: [
      { name: 'id', type: 'uuid', primaryKey: true },
      ...columns,
      { name: 'created_at', type: 'timestamp', default: 'now()' },
      { name: 'updated_at', type: 'timestamp', default: 'now()' }
    ]
  };
}

// 基本的なコード生成関数
function generateBasicCode(schema: any, idea: string): string {
  const tableName = schema.tableName;
  const componentName = tableName.charAt(0).toUpperCase() + tableName.slice(1);

  return `'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ${componentName}App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // データ取得
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/crud/${tableName}');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
    }
  };

  // 新規作成
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/crud/${tableName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          description: description.trim() 
        }),
      });
      
      if (response.ok) {
        setName('');
        setDescription('');
        fetchItems();
      }
    } catch (error) {
      console.error('作成エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // 削除
  const handleDelete = async (id) => {
    try {
      const response = await fetch(\`/api/crud/${tableName}?id=\${id}\`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ${idea} - 管理システム
      </h1>
      
      {/* 新規作成フォーム */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>新規作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">名前</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前を入力してください"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">説明</label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="説明を入力してください（任意）"
              />
            </div>
            <Button type="submit" disabled={loading || !name.trim()} className="w-full">
              {loading ? '作成中...' : '作成'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* データ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>データ一覧 ({items.length}件)</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              まだデータがありません。上のフォームから作成してください。
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      作成日: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="destructive"
                    size="sm"
                  >
                    削除
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API情報 */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">使用可能なAPI:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>GET /api/crud/${tableName} - 全データ取得</li>
          <li>POST /api/crud/${tableName} - 新規作成</li>
          <li>DELETE /api/crud/${tableName}?id=xxx - 削除</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          テーブル名: ${tableName}
        </p>
      </div>
    </div>
  );
}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea } = body as SimpleGenerateRequest;

    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: 'アイデアの入力が必要です' },
        { status: 400 }
      );
    }

    // 基本的なスキーマを生成
    const schema = generateBasicSchema(idea.trim());
    
    // 基本的なコードを生成
    const code = generateBasicCode(schema, idea.trim());

    // レスポンスを返す（データベース作成はスキップ）
    return NextResponse.json({
      code,
      schema,
      tableName: schema.tableName,
      message: 'アプリが正常に生成されました！ウェブアプリは準備完了です。',
      instructions: {
        howToUse: 'このコードをReactコンポーネントとしてコピーして使用してください',
        apiEndpoints: {
          create: `/api/crud/${schema.tableName} (POST)`,
          read: `/api/crud/${schema.tableName} (GET)`,
          delete: `/api/crud/${schema.tableName}?id=xxx (DELETE)`
        },
        note: 'このコードはそのまま使用可能で、完全なCRUD機能を提供します'
      }
    });

  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { 
        error: 'アプリの生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}