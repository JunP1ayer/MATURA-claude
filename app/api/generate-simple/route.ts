import { NextRequest, NextResponse } from 'next/server';
import { selectOptimalDesignPattern, generateOptimizedUI } from '@/lib/smart-ui-selector';
import { withErrorHandler, validateRequest, checkRateLimit, ApiError } from '@/lib/api-error-handler';

interface SimpleGenerateRequest {
  idea: string;
}

async function handlePOST(req: NextRequest) {
  // レート制限チェック
  checkRateLimit(req, 10, 60000); // 1分間に10リクエストまで

  const body = await req.json();
  
  // リクエストの検証
  validateRequest(body, {
    required: ['idea'],
    maxLength: { idea: 1000 }
  });

  const { idea } = body as SimpleGenerateRequest;

  if (!idea.trim()) {
    throw new ApiError('アイデアの入力が必要です', 400, 'VALIDATION_ERROR');
  }

    // Step 1: スキーマ推論
    const schemaResponse = await fetch(`${req.nextUrl.origin}/api/infer-schema`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: idea.trim() }),
    });

    if (!schemaResponse.ok) {
      throw new Error('スキーマ生成に失敗しました');
    }

    const schemaResult = await schemaResponse.json();
    const schema = schemaResult.schema;

    if (!schema) {
      throw new Error('スキーマが生成されませんでした');
    }

    // Step 2: AIが最適なデザインパターンを選択
    const optimalPattern = selectOptimalDesignPattern(idea.trim());
    
    // Step 3: 品質最適化されたコードを生成
    const generatedCode = generateOptimizedUI(optimalPattern, idea.trim(), schema);

    // Step 4: generated_appsテーブルに保存（デザインパターン情報も含めて）
    const tableResponse = await fetch(`${req.nextUrl.origin}/api/create-table`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        schema, 
        user_idea: idea.trim(),
        generated_code: generatedCode,
        design_pattern: optimalPattern.name,
        mvp_score: optimalPattern.mvpScore
      }),
    });

    if (!tableResponse.ok) {
      throw new Error('アプリ保存に失敗しました');
    }

    const tableResult = await tableResponse.json();

    return NextResponse.json({
      code: generatedCode,
      schema: schema,
      message: `高品質MVPが生成されました (${optimalPattern.name})`,
      tableName: schema.tableName,
      designPattern: optimalPattern.name,
      mvpScore: optimalPattern.mvpScore
    });
}

function generateCodeSample(schema: any, idea: string): string {
  const tableName = schema.tableName;
  const columns = schema.columns.filter((col: any) => 
    !col.primaryKey && 
    !col.name.includes('created_at') && 
    !col.name.includes('updated_at')
  );

  return `// 生成されたアプリケーション: ${idea}
// テーブル名: ${tableName}

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ${toPascalCase(tableName)}App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
${columns.map((col: any) => `    ${col.name}: ${getDefaultValue(col.type)}`).join(',\n')}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/crud/${tableName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const newItem = await response.json();
        setItems([...items, newItem.data]);
        setFormData({
${columns.map((col: any) => `          ${col.name}: ${getDefaultValue(col.type)}`).join(',\n')}
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(\`/api/crud/${tableName}?id=\${id}\`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">${toTitleCase(tableName)} 管理</h1>
      
      {/* フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>新規追加</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
${columns.map((col: any) => `            <div>
              <label className="block text-sm font-medium mb-1">
                ${toTitleCase(col.name)}
              </label>
              <Input
                type="${getInputType(col.type)}"
                value={formData.${col.name}}
                onChange={(e) => setFormData({
                  ...formData,
                  ${col.name}: ${getValueConverter(col.type)}
                })}
                ${!col.nullable ? 'required' : ''}
              />
            </div>`).join('\n')}
            <Button type="submit" className="w-full">
              追加
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
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                <div className="space-y-1">
${columns.slice(0, 3).map((col: any) => `                  <div className="text-sm">
                    <strong>${toTitleCase(col.name)}:</strong> {item.${col.name}}
                  </div>`).join('\n')}
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
            {items.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                まだデータがありません
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 使用可能なAPI エンドポイント:
// GET    /api/crud/${tableName}     - 全データ取得
// POST   /api/crud/${tableName}     - 新規作成
// PUT    /api/crud/${tableName}?id=xxx - 更新
// DELETE /api/crud/${tableName}?id=xxx - 削除

/* データベーススキーマ:
${JSON.stringify(schema, null, 2)}
*/`;
}

function toPascalCase(str: string): string {
  return str.replace(/(^\w|_\w)/g, (match) => 
    match.replace('_', '').toUpperCase()
  );
}

function toTitleCase(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getInputType(type: string): string {
  switch (type.toLowerCase()) {
    case 'number':
    case 'integer':
      return 'number';
    case 'email':
      return 'email';
    case 'url':
      return 'url';
    case 'tel':
    case 'phone':
      return 'tel';
    case 'date':
      return 'date';
    case 'datetime':
    case 'timestamp':
      return 'datetime-local';
    case 'boolean':
      return 'checkbox';
    default:
      return 'text';
  }
}

function getDefaultValue(type: string): string {
  switch (type.toLowerCase()) {
    case 'number':
    case 'integer':
      return '0';
    case 'boolean':
      return 'false';
    default:
      return "''";
  }
}

function getValueConverter(type: string): string {
  switch (type.toLowerCase()) {
    case 'number':
    case 'integer':
      return 'parseInt(e.target.value) || 0';
    case 'boolean':
      return 'e.target.checked';
    default:
      return 'e.target.value';
  }
}

// エラーハンドリングでラップしてエクスポート
export const POST = withErrorHandler(handlePOST);