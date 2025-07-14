'use client';

import React from 'react';
import { useGetItems, useDeleteItem } from '@/lib/dynamic-crud';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Loader2, Database, Calendar, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

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

interface DesignTheme {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
  };
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
}

interface StylishDataTableProps {
  schema: Schema;
  theme: DesignTheme;
}

export function StylishDataTable({ schema, theme }: StylishDataTableProps) {
  const { data: items, isLoading, error } = useGetItems(schema.tableName);
  const deleteItem = useDeleteItem(schema.tableName);

  const handleDelete = async (id: string) => {
    if (confirm('このデータを削除してもよろしいですか？')) {
      try {
        await deleteItem.mutateAsync(id);
        toast.success('データが削除されました', {
          description: 'アイテムが正常に削除されました',
        });
      } catch (error) {
        toast.error('削除に失敗しました', {
          description: 'もう一度お試しください',
        });
      }
    }
  };

  const formatValue = (value: any, columnType: string) => {
    if (value === null || value === undefined) return (
      <span className="text-gray-400 italic">-</span>
    );
    
    switch (columnType.toLowerCase()) {
      case 'boolean':
      case 'bool':
        return value ? (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            はい
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            いいえ
          </Badge>
        );
      case 'timestamp':
      case 'datetime':
        return (
          <span className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-gray-500" />
            {new Date(value).toLocaleString('ja-JP')}
          </span>
        );
      case 'date':
        return (
          <span className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-gray-500" />
            {new Date(value).toLocaleDateString('ja-JP')}
          </span>
        );
      case 'number':
      case 'integer':
        return (
          <Badge variant="outline" className="font-mono">
            {value.toLocaleString()}
          </Badge>
        );
      default:
        if (typeof value === 'string' && value.length > 50) {
          return (
            <div className="max-w-xs">
              <p className="truncate text-sm">{value}</p>
              <span className="text-xs text-gray-500">{value.length}文字</span>
            </div>
          );
        }
        return <span className="text-sm">{String(value)}</span>;
    }
  };

  const getThemeClasses = () => {
    switch (theme.style) {
      case 'elegant':
        return {
          card: 'bg-gradient-to-br from-white to-gray-50 shadow-xl border-0',
          header: `bg-gradient-to-r from-${theme.colors.primary} to-${theme.colors.accent} text-white`,
          table: 'border-gray-100',
          headerRow: 'bg-gray-50/80 border-gray-200',
          row: 'hover:bg-purple-50/50 transition-colors duration-200 border-gray-100',
          deleteButton: 'bg-red-500 hover:bg-red-600 shadow-sm'
        };
      case 'modern':
        return {
          card: 'bg-white shadow-lg border border-gray-100',
          header: `bg-${theme.colors.primary} text-white`,
          table: 'border-gray-200',
          headerRow: 'bg-gray-100 border-gray-300',
          row: 'hover:bg-blue-50 transition-colors duration-150 border-gray-200',
          deleteButton: 'bg-red-500 hover:bg-red-600 rounded-lg hover:scale-105 transition-transform'
        };
      case 'minimal':
        return {
          card: 'bg-white shadow-sm border border-gray-200',
          header: 'bg-gray-50 text-gray-800 border-b',
          table: 'border-gray-300',
          headerRow: 'bg-gray-50 border-gray-300',
          row: 'hover:bg-gray-50 transition-colors border-gray-300',
          deleteButton: 'bg-red-500 hover:bg-red-600 rounded-none'
        };
      default:
        return {
          card: 'bg-white shadow-md',
          header: `bg-${theme.colors.primary} text-white`,
          table: 'border-gray-200',
          headerRow: 'bg-gray-100',
          row: 'hover:bg-gray-50 transition-colors',
          deleteButton: 'bg-red-500 hover:bg-red-600'
        };
    }
  };

  const themeClasses = getThemeClasses();
  const displayColumns = schema.columns.filter(col => 
    !col.name.includes('created_at') && !col.name.includes('updated_at')
  );

  if (isLoading) {
    return (
      <Card className={`w-full max-w-6xl mx-auto ${themeClasses.card}`}>
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
            <p className="text-lg text-gray-500">データを読み込み中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full max-w-6xl mx-auto ${themeClasses.card}`}>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg text-red-600">データの読み込みに失敗しました</p>
            <p className="text-sm text-gray-500">ページを再読み込みしてお試しください</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-6xl mx-auto ${themeClasses.card} overflow-hidden`}>
      <CardHeader className={`${themeClasses.header} py-6`}>
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <Database className="h-6 w-6" />
          {schema.tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - データ一覧
        </CardTitle>
        <div className="flex items-center gap-4 text-sm opacity-90 mt-2">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            登録件数: {items?.length || 0}件
          </span>
          {items && items.length > 0 && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              最終更新: {new Date(items[0].updated_at || items[0].created_at).toLocaleDateString('ja-JP')}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!items || items.length === 0 ? (
          <div className="text-center py-16 px-8">
            <div className="flex flex-col items-center gap-4">
              <Database className="h-16 w-16 text-gray-300" />
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  データがまだ登録されていません
                </h3>
                <p className="text-sm text-gray-500">
                  「データ入力」タブから最初のアイテムを追加してみましょう
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className={themeClasses.table}>
              <TableHeader>
                <TableRow className={themeClasses.headerRow}>
                  {displayColumns.map((column) => (
                    <TableHead key={column.name} className="font-semibold">
                      {column.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </TableHead>
                  ))}
                  <TableHead className="w-20 text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.id} className={themeClasses.row}>
                    {displayColumns.map((column) => (
                      <TableCell key={column.name} className="py-4">
                        {formatValue(item[column.name], column.type)}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                        className={`${themeClasses.deleteButton} h-8 w-8 p-0`}
                      >
                        {deleteItem.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}