'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Database, 
  Plus, 
  Table, 
  Settings, 
  Eye, 
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  ArrowLeft,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';
import { DataExporter } from '@/components/DataExporter';
import { DataImporter } from '@/components/DataImporter';
import { DataTable } from '@/components/DataTable';
import { DynamicForm } from '@/components/DynamicForm';
import { RecentAppsSection } from '@/components/RecentAppsSection';
import { TableCreator } from '@/components/TableCreator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGeneratedAppsQuery } from '@/hooks/useSmartQuery';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue?: string;
}

interface TableSchema {
  tableName: string;
  columns: Column[];
  createdAt?: string;
  recordCount?: number;
}

interface GeneratedApp {
  id: string;
  name: string;
  description?: string;
  user_idea: string;
  schema: object;
  generated_code: string;
  preview_url?: string;
  status: 'active' | 'archived' | 'draft';
  created_at: string;
  updated_at: string;
}

export default function TableManagerPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableSchema | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAppsModal, setShowAppsModal] = useState(false);

  // スマートクエリで生成されたアプリを取得
  const { data: generatedApps, isLoading: isLoadingApps } = useGeneratedAppsQuery();

  const handleTableCreated = (tableName: string, columns: Column[]) => {
    const newTable: TableSchema = {
      tableName,
      columns,
      createdAt: new Date().toISOString(),
      recordCount: 0
    };
    setTables([...tables, newTable]);
    setActiveTab('overview');
  };

  const handleViewTable = (table: TableSchema) => {
    setSelectedTable(table);
    setActiveTab('data');
  };

  const handleEditTable = (table: TableSchema) => {
    setSelectedTable(table);
    setActiveTab('edit');
  };

  const handleDeleteTable = (tableName: string) => {
    if (confirm(`テーブル "${tableName}" を削除してもよろしいですか？`)) {
      setTables(tables.filter(t => t.tableName !== tableName));
      if (selectedTable?.tableName === tableName) {
        setSelectedTable(null);
      }
    }
  };

  const filteredTables = tables.filter(table =>
    table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* ヘッダー */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    テーブルマネージャー
                  </h1>
                  <p className="text-xs text-gray-500">
                    動的テーブルの作成と管理
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowAppsModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Apps</span>
                {generatedApps && generatedApps.length > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {generatedApps.length}
                  </Badge>
                )}
              </Button>
              <Badge variant="secondary" className="text-xs">
                {tables.length} テーブル
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">概要</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">作成</span>
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              disabled={!selectedTable}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">データ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="import" 
              disabled={!selectedTable}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">インポート</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              disabled={!selectedTable}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">エクスポート</span>
            </TabsTrigger>
            <TabsTrigger 
              value="edit" 
              disabled={!selectedTable}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">編集</span>
            </TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="space-y-6">
            {/* 検索バー */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="テーブルを検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setActiveTab('create')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                新しいテーブル
              </Button>
            </div>


            {/* テーブル一覧 */}
            {tables.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    テーブルがありません
                  </h3>
                  <p className="text-gray-600 mb-6">
                    最初のテーブルを作成して始めましょう
                  </p>
                  <Button
                    onClick={() => setActiveTab('create')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    テーブルを作成
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTables.map((table, index) => (
                  <motion.div
                    key={table.tableName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-gray-900">
                              {table.tableName}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {table.columns.length} カラム
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {table.recordCount || 0} レコード
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-xs text-gray-500">
                            作成日: {table.createdAt ? new Date(table.createdAt).toLocaleDateString('ja-JP') : '不明'}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {table.columns.slice(0, 3).map((column) => (
                              <Badge key={column.name} variant="secondary" className="text-xs">
                                {column.name}
                              </Badge>
                            ))}
                            {table.columns.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{table.columns.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleViewTable(table)}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              表示
                            </Button>
                            <Button
                              onClick={() => handleEditTable(table)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteTable(table.tableName)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 作成タブ */}
          <TabsContent value="create">
            <TableCreator onTableCreated={handleTableCreated} />
          </TabsContent>

          {/* データタブ */}
          <TabsContent value="data" className="space-y-6">
            {selectedTable && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedTable.tableName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      テーブルデータの表示と管理
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      エクスポート
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      フィルター
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <DataTable schema={selectedTable} />
                  </div>
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">データ追加</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DynamicForm schema={selectedTable} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* インポートタブ */}
          <TabsContent value="import">
            {selectedTable && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      データインポート: {selectedTable.tableName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      CSV、JSON形式のファイルからデータをインポート
                    </p>
                  </div>
                </div>
                
                <DataImporter 
                  tableName={selectedTable.tableName}
                  onImportComplete={(result) => {
                    if (result.success) {
                      // テーブルデータを更新
                      const updatedTables = tables.map(table => 
                        table.tableName === selectedTable.tableName 
                          ? { ...table, recordCount: (table.recordCount || 0) + result.rowsProcessed }
                          : table
                      );
                      setTables(updatedTables);
                      setActiveTab('data');
                    }
                  }}
                />
              </div>
            )}
          </TabsContent>

          {/* エクスポートタブ */}
          <TabsContent value="export">
            {selectedTable && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      データエクスポート: {selectedTable.tableName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      テーブルデータを様々な形式でエクスポート
                    </p>
                  </div>
                </div>
                
                <DataExporter 
                  tableName={selectedTable.tableName}
                  columns={selectedTable.columns.map(col => ({
                    name: col.name,
                    type: col.type
                  }))}
                  totalRows={selectedTable.recordCount || 0}
                />
              </div>
            )}
          </TabsContent>

          {/* 編集タブ */}
          <TabsContent value="edit">
            {selectedTable && (
              <Card>
                <CardHeader>
                  <CardTitle>テーブル編集: {selectedTable.tableName}</CardTitle>
                  <p className="text-sm text-gray-600">
                    テーブル構造の編集（今後実装予定）
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>テーブル編集機能は開発中です</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Apps Modal */}
      {showAppsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Apps
                  </h2>
                  <p className="text-sm text-gray-600">
                    {generatedApps?.length || 0} apps generated
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowAppsModal(false)}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoadingApps ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading apps...</p>
                </div>
              ) : generatedApps && generatedApps.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {generatedApps.map((app) => (
                    <Card key={app.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-100 rounded-lg">
                              <Database className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">
                                {app.name || 'Generated App'}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {new Date(app.created_at).toLocaleDateString('ja-JP')}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={app.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {app.status}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-700 mb-4 line-clamp-2">
                          {app.user_idea}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => window.open(`/preview/${app.id}`, '_blank')}
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            onClick={() => window.open(`/app/${app.id}`, '_blank')}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No apps yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first app to see it here
                  </p>
                  <Button
                    onClick={() => {
                      setShowAppsModal(false);
                      window.open('/', '_blank');
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create App
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}