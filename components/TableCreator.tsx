'use client';

import React, { useState } from 'react';
import { Plus, Minus, Database, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue?: string;
}

interface TableCreatorProps {
  onTableCreated?: (tableName: string, columns: Column[]) => void;
}

const COLUMN_TYPES = [
  { value: 'text', label: 'テキスト', icon: '📝' },
  { value: 'integer', label: '整数', icon: '🔢' },
  { value: 'boolean', label: 'はい/いいえ', icon: '✓' },
  { value: 'timestamp', label: '日時', icon: '📅' },
  { value: 'email', label: 'メール', icon: '📧' },
  { value: 'url', label: 'URL', icon: '🔗' },
  { value: 'json', label: 'JSON', icon: '{}' },
  { value: 'uuid', label: 'ID', icon: '🆔' }
];

export function TableCreator({ onTableCreated }: TableCreatorProps) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    {
      id: '1',
      name: 'id',
      type: 'uuid',
      nullable: false,
      primaryKey: true,
      defaultValue: 'gen_random_uuid()'
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      nullable: true,
      primaryKey: false
    };
    setColumns([...columns, newColumn]);
  };

  const removeColumn = (id: string) => {
    if (columns.length > 1) {
      setColumns(columns.filter(col => col.id !== id));
    }
  };

  const updateColumn = (id: string, field: keyof Column, value: any) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const generateSampleColumns = () => {
    const samples: Column[] = [
      {
        id: '1',
        name: 'id',
        type: 'uuid',
        nullable: false,
        primaryKey: true,
        defaultValue: 'gen_random_uuid()'
      },
      {
        id: '2',
        name: 'name',
        type: 'text',
        nullable: false,
        primaryKey: false
      },
      {
        id: '3',
        name: 'email',
        type: 'email',
        nullable: true,
        primaryKey: false
      },
      {
        id: '4',
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
        primaryKey: false,
        defaultValue: 'now()'
      }
    ];
    setColumns(samples);
    setTableName('users');
    toast.success('サンプル構造を生成しました');
  };

  const validateTable = () => {
    if (!tableName.trim()) {
      toast.error('テーブル名を入力してください');
      return false;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
      toast.error('テーブル名は英字、数字、アンダースコアのみ使用できます');
      return false;
    }

    const validColumns = columns.filter(col => col.name.trim());
    if (validColumns.length === 0) {
      toast.error('少なくとも1つのカラムが必要です');
      return false;
    }

    const duplicateNames = validColumns.some((col, index) => 
      validColumns.findIndex(c => c.name === col.name) !== index
    );
    if (duplicateNames) {
      toast.error('カラム名が重複しています');
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateTable()) return;

    setIsCreating(true);
    try {
      const validColumns = columns.filter(col => col.name.trim());
      onTableCreated?.(tableName, validColumns);
      
      toast.success('テーブルが作成されました');
      
      // リセット
      setTableName('');
      setColumns([{
        id: '1',
        name: 'id',
        type: 'uuid',
        nullable: false,
        primaryKey: true,
        defaultValue: 'gen_random_uuid()'
      }]);
    } catch (error) {
      toast.error('テーブルの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>テーブル設計</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                データベーステーブルの構造を定義します
              </p>
            </div>
          </div>
          <Button
            onClick={generateSampleColumns}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            サンプル
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* テーブル名入力 */}
        <div>
          <Label htmlFor="tableName">テーブル名</Label>
          <Input
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="例: users, products, orders"
            className="mt-1"
          />
        </div>

        {/* カラム設定 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">カラム設定</Label>
            <Button
              onClick={addColumn}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              カラム追加
            </Button>
          </div>

          <div className="space-y-3">
            {columns.map((column, index) => (
              <div key={column.id} className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg">
                {/* カラム名 */}
                <div className="col-span-3">
                  <Label className="text-xs text-gray-500">カラム名</Label>
                  <Input
                    value={column.name}
                    onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                    placeholder="カラム名"
                    className="mt-1 text-sm"
                    disabled={column.primaryKey && index === 0}
                  />
                </div>

                {/* データ型 */}
                <div className="col-span-3">
                  <Label className="text-xs text-gray-500">データ型</Label>
                  <Select
                    value={column.type}
                    onValueChange={(value) => updateColumn(column.id, 'type', value)}
                  >
                    <SelectTrigger className="mt-1 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLUMN_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* デフォルト値 */}
                <div className="col-span-3">
                  <Label className="text-xs text-gray-500">デフォルト値</Label>
                  <Input
                    value={column.defaultValue || ''}
                    onChange={(e) => updateColumn(column.id, 'defaultValue', e.target.value)}
                    placeholder="省略可"
                    className="mt-1 text-sm"
                  />
                </div>

                {/* オプション */}
                <div className="col-span-2 flex flex-col gap-1 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`nullable-${column.id}`}
                      checked={column.nullable}
                      onCheckedChange={(checked) => updateColumn(column.id, 'nullable', checked)}
                      disabled={column.primaryKey}
                    />
                    <Label htmlFor={`nullable-${column.id}`} className="text-xs">
                      NULL許可
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`primary-${column.id}`}
                      checked={column.primaryKey}
                      onCheckedChange={(checked) => {
                        updateColumn(column.id, 'primaryKey', checked);
                        if (checked) {
                          updateColumn(column.id, 'nullable', false);
                        }
                      }}
                    />
                    <Label htmlFor={`primary-${column.id}`} className="text-xs">
                      主キー
                    </Label>
                  </div>
                </div>

                {/* 削除ボタン */}
                <div className="col-span-1 flex items-center justify-center pt-4">
                  {columns.length > 1 && (
                    <Button
                      onClick={() => removeColumn(column.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* プレビュー */}
        <div className="bg-slate-50 rounded-lg p-4">
          <Label className="text-sm font-medium mb-2 block">SQL プレビュー</Label>
          <pre className="text-xs text-slate-700 font-mono">
            {`CREATE TABLE ${tableName || '${テーブル名}'} (\n${columns
              .filter(col => col.name.trim())
              .map(col => 
                `  ${col.name} ${col.type.toUpperCase()}${!col.nullable ? ' NOT NULL' : ''}${
                  col.primaryKey ? ' PRIMARY KEY' : ''
                }${col.defaultValue ? ` DEFAULT ${col.defaultValue}` : ''}`
              )
              .join(',\n')}\n);`}
          </pre>
        </div>

        {/* 作成ボタン */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleCreate}
            disabled={isCreating || !tableName.trim()}
            className="px-6"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                作成中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                テーブル作成
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}