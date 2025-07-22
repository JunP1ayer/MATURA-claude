'use client';

import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  Database, 
  CheckCircle, 
  AlertCircle,
  X,
  Download,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  Braces
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImportResult {
  success: boolean;
  data?: any[];
  errors?: string[];
  rowsProcessed: number;
  columnsDetected: string[];
}

interface DataImporterProps {
  tableName: string;
  onImportComplete?: (result: ImportResult) => void;
}

export function DataImporter({ tableName, onImportComplete }: DataImporterProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // ファイルサイズチェック（10MB）
      if (file.size > 10 * 1024 * 1024) {
        toast.error('ファイルサイズが10MBを超えています');
        return;
      }
      
      // ファイル形式チェック
      const allowedTypes = ['.csv', '.json', '.txt'];
      const fileExtension = `.${  file.name.split('.').pop()?.toLowerCase()}`;
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('対応していないファイル形式です');
        return;
      }
      
      setSelectedFile(file);
      handleFilePreview(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const {files} = e.dataTransfer;
    handleFileSelect(files);
  };

  const handleFilePreview = async (file: File) => {
    try {
      const text = await file.text();
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'json') {
        const jsonData = JSON.parse(text);
        const preview = Array.isArray(jsonData) ? jsonData.slice(0, 5) : [jsonData];
        setPreviewData(preview);
      } else if (fileType === 'csv') {
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const preview = lines.slice(1, 6).map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {} as any);
        });
        setPreviewData(preview);
      }
    } catch (error) {
      toast.error('ファイルのプレビューに失敗しました');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      const text = await selectedFile.text();
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      
      // プログレスシミュレーション
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      let processedData: any[] = [];
      
      if (fileType === 'json') {
        const jsonData = JSON.parse(text);
        processedData = Array.isArray(jsonData) ? jsonData : [jsonData];
      } else if (fileType === 'csv') {
        processedData = parseCSV(text);
      }

      // データをサーバーに送信
      const response = await fetch(`/api/import/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: processedData,
          fileType,
          fileName: selectedFile.name
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result: ImportResult = await response.json();
        setResult(result);
        onImportComplete?.(result);
        toast.success(`${result.rowsProcessed}件のデータをインポートしました`);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'インポートに失敗しました');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'インポート中にエラーが発生しました';
      setResult({
        success: false,
        errors: [errorMessage],
        rowsProcessed: 0,
        columnsDetected: []
      });
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {} as any);
    });
  };

  const resetImporter = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Upload className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>データインポート</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  CSV、JSON形式のファイルをアップロードしてデータをインポート
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {tableName}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">アップロード</TabsTrigger>
              <TabsTrigger value="preview" disabled={!selectedFile}>プレビュー</TabsTrigger>
              <TabsTrigger value="result" disabled={!result}>結果</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isDragActive ? 'ファイルをドロップしてください' : 'ファイルをアップロード'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      CSV、JSON形式のファイルをドラッグ&ドロップまたはクリックして選択
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </div>
                    <div className="flex items-center gap-1">
                      <Braces className="h-4 w-4" />
                      JSON
                    </div>
                    <div className="text-gray-400">
                      最大10MB
                    </div>
                  </div>
                </div>
              </div>

              {selectedFile && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>{selectedFile.name}</strong>
                        <span className="text-sm text-gray-500 ml-2">
                          ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        onClick={resetImporter}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>インポート中...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onClick={resetImporter}
                  variant="outline"
                  disabled={isProcessing}
                >
                  リセット
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      処理中...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      インポート実行
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">データプレビュー</h3>
                <Badge variant="secondary">
                  {previewData.length} 件表示
                </Badge>
              </div>
              
              {previewData.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(previewData[0]).map((key) => (
                            <th key={key} className="px-4 py-2 text-left font-medium text-gray-700">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className="border-t">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="result" className="space-y-4">
              {result && (
                <div>
                  <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="font-medium">
                          {result.success ? 'インポート完了' : 'インポート失敗'}
                        </div>
                        <div className="text-sm">
                          {result.success ? (
                            <>
                              <p>{result.rowsProcessed} 件のデータを正常にインポートしました</p>
                              <p>検出されたカラム: {result.columnsDetected.join(', ')}</p>
                            </>
                          ) : (
                            <div>
                              <p>エラーが発生しました:</p>
                              <ul className="list-disc list-inside mt-1">
                                {result.errors?.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}