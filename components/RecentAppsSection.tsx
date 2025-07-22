'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Sparkles, 
  Eye, 
  ExternalLink, 
  RefreshCw, 
  Database,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export const RecentAppsSection: React.FC = () => {
  // React Query for fetching generated apps
  const { data: generatedApps, isLoading: isLoadingApps, refetch } = useQuery({
    queryKey: ['generatedApps'],
    queryFn: async () => {
      const response = await fetch('/api/crud/generated_apps');
      if (!response.ok) throw new Error('Failed to fetch apps');
      return response.json() as Promise<GeneratedApp[]>;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoadingApps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Recent Apps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <RefreshCw className="h-6 w-6 text-gray-400" />
            </div>
            <span className="ml-2 text-gray-600">読み込み中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!generatedApps || generatedApps.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Recent Apps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              まだ生成されたアプリがありません
            </h3>
            <p className="text-gray-600 mb-6">
              AI アプリクリエーターで最初のアプリを作成してみましょう
            </p>
            <Button
              onClick={() => window.open('/app-creator', '_blank')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              アプリを作成
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Recent Apps ({generatedApps.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              更新
            </Button>
            <Button
              onClick={() => window.open('/app-creator', '_blank')}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedApps.slice(0, 6).map((app) => (
            <div key={app.id} className="group border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Database className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {app.name || 'Generated App'}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-600">
                        {new Date(app.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={app.status === 'active' ? 'default' : 'secondary'} 
                  className="text-xs"
                >
                  {app.status}
                </Badge>
              </div>

              {app.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {app.description}
                </p>
              )}

              <div className="text-xs text-gray-500 mb-4 line-clamp-2 bg-gray-50 p-2 rounded">
                <span className="font-medium">アイデア:</span> {app.user_idea}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  onClick={() => window.open(`/preview/${app.id}`, '_blank')}
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  プレビュー
                </Button>
                <Button
                  onClick={() => window.open(`/apps/${app.id}`, '_blank')}
                  size="sm"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  開く
                </Button>
              </div>
            </div>
          ))}
        </div>

        {generatedApps.length > 6 && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => window.open('/apps', '_blank')}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              すべてのアプリを見る
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAppsSection;