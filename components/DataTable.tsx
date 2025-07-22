'use client';

import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetItems, useDeleteItem } from '@/lib/dynamic-crud';

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

interface DataTableProps {
  schema: Schema;
}

export function DataTable({ schema }: DataTableProps) {
  const { data: items, isLoading, error } = useGetItems(schema.tableName);
  const deleteItem = useDeleteItem(schema.tableName);

  const handleDelete = async (id: string) => {
    if (confirm('このデータを削除してもよろしいですか？')) {
      try {
        await deleteItem.mutateAsync(id);
        toast.success('データが削除されました');
      } catch (error) {
        toast.error('削除に失敗しました');
      }
    }
  };

  const formatValue = (value: any, columnType: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (columnType.toLowerCase()) {
      case 'boolean':
      case 'bool':
        return value ? '✓' : '✗';
      case 'timestamp':
      case 'datetime':
        return new Date(value).toLocaleString('ja-JP');
      case 'date':
        return new Date(value).toLocaleDateString('ja-JP');
      default:
        return String(value);
    }
  };

  const displayColumns = schema.columns.filter(col => 
    !col.name.includes('created_at') && !col.name.includes('updated_at')
  );

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">データを読み込み中...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-8">
          <p className="text-red-500">データの読み込みに失敗しました</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {schema.tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - データ一覧
        </CardTitle>
        <p className="text-sm text-gray-600">
          登録件数: {items?.length || 0}件
        </p>
      </CardHeader>
      <CardContent>
        {!items || items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            データがまだ登録されていません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {displayColumns.map((column) => (
                    <TableHead key={column.name}>
                      {column.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </TableHead>
                  ))}
                  <TableHead className="w-20">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.id}>
                    {displayColumns.map((column) => (
                      <TableCell key={column.name}>
                        {formatValue(item[column.name], column.type)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
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