'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Braces, 
  Database,
  Settings,
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  includeHeaders: boolean;
  dateFormat: 'iso' | 'locale' | 'timestamp';
  selectedColumns: string[];
  filters?: {
    dateRange?: {
      start: string;
      end: string;
    };
    conditions?: Array<{
      column: string;
      operator: string;
      value: string;
    }>;
  };
}

interface DataExporterProps {
  tableName: string;
  columns: Array<{
    name: string;
    type: string;
  }>;
  totalRows?: number;
}

export function DataExporter({ tableName, columns, totalRows = 0 }: DataExporterProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeHeaders: true,
    dateFormat: 'locale',
    selectedColumns: columns.map(col => col.name)
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportedRows, setExportedRows] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setExportStatus('idle');
    setExportedRows(0);

    try {
      // プログレスシミュレーション
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch(`/api/export/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportOptions),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('エクスポートに失敗しました');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const fileExtension = exportOptions.format === 'excel' ? 'xlsx' : exportOptions.format;
      const timestamp = new Date().toISOString().split('T')[0];
      a.download = `${tableName}_${timestamp}.${fileExtension}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setExportStatus('success');
      setExportedRows(totalRows);
      toast.success('データをエクスポートしました');

    } catch (error) {
      setExportStatus('error');
      toast.error('エクスポートに失敗しました');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const updateExportOptions = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleColumn = (columnName: string) => {
    setExportOptions(prev => ({
      ...prev,
      selectedColumns: prev.selectedColumns.includes(columnName)
        ? prev.selectedColumns.filter(col => col !== columnName)
        : [...prev.selectedColumns, columnName]
    }));
  };

  const selectAllColumns = () => {
    setExportOptions(prev => ({
      ...prev,
      selectedColumns: columns.map(col => col.name)
    }));
  };

  const deselectAllColumns = () => {
    setExportOptions(prev => ({
      ...prev,
      selectedColumns: []
    }));
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'json':
        return <Braces className="h-4 w-4" />;
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Download className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>データエクスポート</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              テーブルデータを様々な形式でエクスポート
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 基本設定 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">基本設定</Label>
            <Badge variant="outline">
              {totalRows} 件のデータ
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">出力形式</Label>
              <Select
                value={exportOptions.format}
                onValueChange={(value) => updateExportOptions('format', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <Braces className="h-4 w-4" />
                      JSON
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateFormat">日付形式</Label>
              <Select
                value={exportOptions.dateFormat}
                onValueChange={(value) => updateExportOptions('dateFormat', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iso">ISO 8601</SelectItem>
                  <SelectItem value="locale">ローカル形式</SelectItem>
                  <SelectItem value="timestamp">タイムスタンプ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeHeaders"
              checked={exportOptions.includeHeaders}
              onCheckedChange={(checked) => updateExportOptions('includeHeaders', checked)}
            />
            <Label htmlFor="includeHeaders" className="text-sm">
              ヘッダー行を含める
            </Label>
          </div>
        </div>

        {/* カラム選択 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">エクスポートするカラム</Label>
            <div className="flex gap-2">
              <Button
                onClick={selectAllColumns}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                全て選択
              </Button>
              <Button
                onClick={deselectAllColumns}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                全て解除
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {columns.map((column) => (
              <div key={column.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`col-${column.name}`}
                  checked={exportOptions.selectedColumns.includes(column.name)}
                  onCheckedChange={() => toggleColumn(column.name)}
                />
                <Label htmlFor={`col-${column.name}`} className="text-sm">
                  {column.name}
                  <span className="text-xs text-gray-500 ml-1">
                    ({column.type})
                  </span>
                </Label>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-600">
            選択中: {exportOptions.selectedColumns.length} / {columns.length} カラム
          </div>
        </div>

        {/* プログレス表示 */}
        {isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>エクスポート中...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* ステータス表示 */}
        {exportStatus !== 'idle' && (
          <Alert className={exportStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {exportStatus === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription>
              {exportStatus === 'success' ? (
                `${exportedRows} 件のデータをエクスポートしました`
              ) : (
                'エクスポート中にエラーが発生しました'
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* エクスポートボタン */}
        <div className="flex justify-end">
          <Button
            onClick={handleExport}
            disabled={isExporting || exportOptions.selectedColumns.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                エクスポート中...
              </>
            ) : (
              <>
                {getFormatIcon(exportOptions.format)}
                <span className="ml-2">
                  {exportOptions.format.toUpperCase()}でエクスポート
                </span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}