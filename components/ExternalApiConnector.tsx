'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Key, 
  Link, 
  CheckCircle, 
  AlertCircle,
  Play,
  Settings,
  Monitor,
  Zap,
  Database,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  authentication?: {
    type: 'none' | 'bearer' | 'apikey' | 'basic';
    token?: string;
    username?: string;
    password?: string;
  };
  params?: Record<string, string>;
  body?: string;
  enabled: boolean;
  lastTested?: string;
  status?: 'success' | 'error' | 'pending';
}

interface ExternalApiConnectorProps {
  tableName: string;
  onApiConnected?: (endpoint: ApiEndpoint) => void;
}

export function ExternalApiConnector({ tableName, onApiConnected }: ExternalApiConnectorProps) {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [editingEndpoint, setEditingEndpoint] = useState<ApiEndpoint | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('endpoints');

  const createNewEndpoint = (): ApiEndpoint => ({
    id: Date.now().toString(),
    name: '',
    url: '',
    method: 'GET',
    headers: {},
    authentication: { type: 'none' },
    params: {},
    enabled: true
  });

  const handleCreateEndpoint = () => {
    const newEndpoint = createNewEndpoint();
    setEditingEndpoint(newEndpoint);
    setIsCreating(true);
    setActiveTab('configure');
  };

  const handleSaveEndpoint = () => {
    if (!editingEndpoint) return;

    if (!editingEndpoint.name.trim() || !editingEndpoint.url.trim()) {
      toast.error('名前とURLは必須です');
      return;
    }

    if (isCreating) {
      setEndpoints([...endpoints, editingEndpoint]);
    } else {
      setEndpoints(endpoints.map(ep => 
        ep.id === editingEndpoint.id ? editingEndpoint : ep
      ));
    }

    setEditingEndpoint(null);
    setIsCreating(false);
    setActiveTab('endpoints');
    toast.success('エンドポイントを保存しました');
  };

  const handleTestEndpoint = async (endpoint: ApiEndpoint) => {
    try {
      setTestResults(prev => ({ ...prev, [endpoint.id]: { status: 'testing' } }));

      const response = await fetch('/api/external-api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName,
          endpoint
        }),
      });

      const result = await response.json();

      setTestResults(prev => ({ ...prev, [endpoint.id]: result }));
      
      // エンドポイントのステータスを更新
      setEndpoints(endpoints.map(ep => 
        ep.id === endpoint.id 
          ? { ...ep, status: result.success ? 'success' : 'error', lastTested: new Date().toISOString() }
          : ep
      ));

      if (result.success) {
        toast.success('API接続テストが成功しました');
      } else {
        toast.error(`API接続テストが失敗しました: ${result.error}`);
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [endpoint.id]: { 
          success: false, 
          error: 'テスト中にエラーが発生しました' 
        } 
      }));
      toast.error('テスト中にエラーが発生しました');
    }
  };

  const handleDeleteEndpoint = (id: string) => {
    if (confirm('このエンドポイントを削除してもよろしいですか？')) {
      setEndpoints(endpoints.filter(ep => ep.id !== id));
      toast.success('エンドポイントを削除しました');
    }
  };

  const updateEditingEndpoint = (updates: Partial<ApiEndpoint>) => {
    if (!editingEndpoint) return;
    setEditingEndpoint({ ...editingEndpoint, ...updates });
  };

  const addHeader = () => {
    if (!editingEndpoint) return;
    updateEditingEndpoint({
      headers: { ...editingEndpoint.headers, '': '' }
    });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    if (!editingEndpoint) return;
    const newHeaders = { ...editingEndpoint.headers };
    delete newHeaders[oldKey];
    newHeaders[newKey] = value;
    updateEditingEndpoint({ headers: newHeaders });
  };

  const removeHeader = (key: string) => {
    if (!editingEndpoint) return;
    const newHeaders = { ...editingEndpoint.headers };
    delete newHeaders[key];
    updateEditingEndpoint({ headers: newHeaders });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>外部API連携</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  外部サービスとの連携を設定・管理
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {tableName}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="endpoints">エンドポイント</TabsTrigger>
              <TabsTrigger value="configure">設定</TabsTrigger>
              <TabsTrigger value="monitor">監視</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">API エンドポイント</h3>
                <Button onClick={handleCreateEndpoint} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新規追加
                </Button>
              </div>

              {endpoints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>設定されたAPIエンドポイントがありません</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {endpoints.map((endpoint) => (
                    <Card key={endpoint.id} className="border-l-4 border-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-gray-900">
                                {endpoint.name}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {endpoint.method}
                              </Badge>
                              {endpoint.status && (
                                <Badge 
                                  variant={endpoint.status === 'success' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {endpoint.status === 'success' ? '正常' : 'エラー'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {endpoint.url}
                            </p>
                            {endpoint.lastTested && (
                              <p className="text-xs text-gray-500 mt-1">
                                最終テスト: {new Date(endpoint.lastTested).toLocaleString('ja-JP')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleTestEndpoint(endpoint)}
                              variant="outline"
                              size="sm"
                              disabled={testResults[endpoint.id]?.status === 'testing'}
                            >
                              {testResults[endpoint.id]?.status === 'testing' ? (
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <Play className="h-3 w-3 mr-1" />
                              )}
                              テスト
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingEndpoint(endpoint);
                                setIsCreating(false);
                                setActiveTab('configure');
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteEndpoint(endpoint.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {testResults[endpoint.id] && (
                          <div className="mt-3">
                            <Alert className={testResults[endpoint.id].success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                              {testResults[endpoint.id].success ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                              <AlertDescription>
                                {testResults[endpoint.id].success ? (
                                  <span>接続成功</span>
                                ) : (
                                  <span>エラー: {testResults[endpoint.id].error}</span>
                                )}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="configure" className="space-y-6">
              {editingEndpoint ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {isCreating ? '新規エンドポイント' : 'エンドポイント編集'}
                    </h3>
                    <Button
                      onClick={() => {
                        setEditingEndpoint(null);
                        setIsCreating(false);
                        setActiveTab('endpoints');
                      }}
                      variant="outline"
                      size="sm"
                    >
                      キャンセル
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">名前</Label>
                      <Input
                        id="name"
                        value={editingEndpoint.name}
                        onChange={(e) => updateEditingEndpoint({ name: e.target.value })}
                        placeholder="例: ユーザー情報取得API"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="method">HTTPメソッド</Label>
                      <Select
                        value={editingEndpoint.method}
                        onValueChange={(value) => updateEditingEndpoint({ method: value as any })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={editingEndpoint.url}
                      onChange={(e) => updateEditingEndpoint({ url: e.target.value })}
                      placeholder="https://api.example.com/users"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>認証</Label>
                    <Select
                      value={editingEndpoint.authentication?.type || 'none'}
                      onValueChange={(value) => updateEditingEndpoint({ 
                        authentication: { ...editingEndpoint.authentication, type: value as any } 
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">なし</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="apikey">API Key</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                      </SelectContent>
                    </Select>

                    {editingEndpoint.authentication?.type === 'bearer' && (
                      <Input
                        value={editingEndpoint.authentication.token || ''}
                        onChange={(e) => updateEditingEndpoint({ 
                          authentication: { ...editingEndpoint.authentication, token: e.target.value } 
                        })}
                        placeholder="Bearer Token"
                        className="mt-2"
                      />
                    )}

                    {editingEndpoint.authentication?.type === 'basic' && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Input
                          value={editingEndpoint.authentication.username || ''}
                          onChange={(e) => updateEditingEndpoint({ 
                            authentication: { ...editingEndpoint.authentication, username: e.target.value } 
                          })}
                          placeholder="ユーザー名"
                        />
                        <Input
                          type="password"
                          value={editingEndpoint.authentication.password || ''}
                          onChange={(e) => updateEditingEndpoint({ 
                            authentication: { ...editingEndpoint.authentication, password: e.target.value } 
                          })}
                          placeholder="パスワード"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>ヘッダー</Label>
                      <Button onClick={addHeader} variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        追加
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(editingEndpoint.headers || {}).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <Input
                            value={key}
                            onChange={(e) => updateHeader(key, e.target.value, value)}
                            placeholder="ヘッダー名"
                          />
                          <Input
                            value={value}
                            onChange={(e) => updateHeader(key, key, e.target.value)}
                            placeholder="値"
                          />
                          <Button
                            onClick={() => removeHeader(key)}
                            variant="outline"
                            size="sm"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {['POST', 'PUT'].includes(editingEndpoint.method) && (
                    <div>
                      <Label htmlFor="body">リクエストボディ</Label>
                      <Textarea
                        id="body"
                        value={editingEndpoint.body || ''}
                        onChange={(e) => updateEditingEndpoint({ body: e.target.value })}
                        placeholder='{"key": "value"}'
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleSaveEndpoint} className="bg-purple-600 hover:bg-purple-700">
                      保存
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>エンドポイントを選択して設定を変更してください</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="monitor" className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>監視機能は今後実装予定です</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}