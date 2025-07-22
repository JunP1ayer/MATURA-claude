'use client';

import React, { useState } from 'react';
import { Loader2, Sparkles, Database, FormInput } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '@/components/DataTable';
import { DynamicForm } from '@/components/DynamicForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue?: string;
}

interface Schema {
  tableName: string;
  columns: Column[];
}

export default function DynamicAppGeneratorPage() {
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [schema, setSchema] = useState<Schema | null>(null);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [tableCreated, setTableCreated] = useState(false);

  const generateSchema = async () => {
    if (!userInput.trim()) {
      toast.error('アプリのアイデアを入力してください');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/infer-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error('スキーマ生成に失敗しました');
      }

      const result = await response.json();
      setSchema(result.schema);
      setTableCreated(false);
      toast.success('スキーマが生成されました！');
    } catch (error) {
      toast.error('スキーマ生成中にエラーが発生しました');
      console.error('Schema generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const createTable = async () => {
    if (!schema) return;

    setIsCreatingTable(true);
    try {
      const response = await fetch('/api/create-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema }),
      });

      if (!response.ok) {
        throw new Error('テーブル作成に失敗しました');
      }

      setTableCreated(true);
      toast.success('データベーステーブルが作成されました！');
    } catch (error) {
      toast.error('テーブル作成中にエラーが発生しました');
      console.error('Table creation error:', error);
    } finally {
      setIsCreatingTable(false);
    }
  };

  const resetApp = () => {
    setUserInput('');
    setSchema(null);
    setTableCreated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 自動アプリ生成システム
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            自然言語でアイデアを入力するだけで、AIが自動的にデータベーススキーマを推論し、
            完全動作可能なCRUDアプリケーションを生成します
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              STEP 1: アプリのアイデアを入力
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-input">あなたのアプリアイデア</Label>
              <Textarea
                id="user-input"
                placeholder="例: ブログ記事を管理するアプリを作りたい。記事にはタイトル、内容、作成者、公開状態が必要です。"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={4}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={generateSchema} 
                disabled={isGenerating || !userInput.trim()}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI分析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    スキーマを生成
                  </>
                )}
              </Button>
              
              {schema && (
                <Button variant="outline" onClick={resetApp}>
                  リセット
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {schema && (
          <>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  STEP 2: 生成されたスキーマ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">テーブル名: {schema.tableName}</h3>
                  <div className="space-y-2">
                    {schema.columns.map((column, index) => (
                      <div key={index} className="flex items-center gap-4 text-sm">
                        <span className="font-mono bg-white px-2 py-1 rounded">
                          {column.name}
                        </span>
                        <span className="text-blue-600">{column.type}</span>
                        {column.primaryKey && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                            PRIMARY KEY
                          </span>
                        )}
                        {!column.nullable && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            NOT NULL
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={createTable} 
                  disabled={isCreatingTable || tableCreated}
                  className="w-full"
                >
                  {isCreatingTable ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      テーブル作成中...
                    </>
                  ) : tableCreated ? (
                    'テーブル作成完了 ✓'
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      データベーステーブルを作成
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {tableCreated && (
              <Card className="max-w-7xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FormInput className="h-5 w-5" />
                    STEP 3: 完成！あなたのアプリケーション
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="form" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="form">データ入力</TabsTrigger>
                      <TabsTrigger value="data">データ一覧</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="form" className="mt-6">
                      <DynamicForm schema={schema} />
                    </TabsContent>
                    
                    <TabsContent value="data" className="mt-6">
                      <DataTable schema={schema} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}