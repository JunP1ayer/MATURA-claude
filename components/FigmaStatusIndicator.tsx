'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Figma, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface FigmaStatus {
  hasApiKey: boolean;
  hasDefaultFileId: boolean;
  apiKeyLength: number;
  isConfigured: boolean;
  timestamp: string;
  connectionTest?: {
    success: boolean;
    status?: number;
    statusText?: string;
    error?: string;
  };
  fileInfo?: {
    name: string;
    lastModified: string;
    version: string;
  };
}

export const FigmaStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<FigmaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFigmaStatus();
  }, []);

  const fetchFigmaStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/figma-status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.figmaStatus);
      } else {
        setError(data.error || 'ステータス取得に失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <span className="text-sm text-gray-600">Figmaステータス確認中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !status) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">
              {error || 'ステータス情報が取得できませんでした'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    if (status.isConfigured && status.connectionTest?.success) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status.hasApiKey) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (status.isConfigured && status.connectionTest?.success) {
      return 'Figma API 接続済み';
    } else if (status.hasApiKey && !status.connectionTest?.success) {
      return 'API Key設定済み（接続エラー）';
    } else if (status.hasApiKey) {
      return 'API Key設定済み';
    } else {
      return 'API Key未設定';
    }
  };

  const getStatusColor = () => {
    if (status.isConfigured && status.connectionTest?.success) {
      return 'border-green-200 bg-green-50';
    } else if (status.hasApiKey) {
      return 'border-yellow-200 bg-yellow-50';
    } else {
      return 'border-red-200 bg-red-50';
    }
  };

  return (
    <Card className={`${getStatusColor()}`}>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Figma className="h-4 w-4 text-purple-600" />
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {status.isConfigured ? '利用可能' : '制限モード'}
            </Badge>
          </div>
          
          {status.fileInfo && (
            <div className="text-xs text-gray-600">
              デフォルトファイル: {status.fileInfo.name}
            </div>
          )}
          
          {status.connectionTest && !status.connectionTest.success && (
            <div className="text-xs text-red-600">
              接続エラー: {status.connectionTest.error || `HTTP ${status.connectionTest.status}`}
            </div>
          )}
          
          {!status.hasApiKey && (
            <div className="text-xs text-gray-600">
              FIGMA_API_KEY環境変数を設定してください
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FigmaStatusIndicator;