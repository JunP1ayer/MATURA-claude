'use client';

import Link from 'next/link';
import { ArrowLeft, Code2, Database, Calendar } from 'lucide-react';
import { DynamicComponentRenderer } from '@/components/DynamicComponentRenderer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface PreviewPageClientProps {
  app: {
    id: string;
    name: string;
    description?: string;
    user_idea: string;
    schema: object;
    generated_code: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export function PreviewPageClient({ app }: PreviewPageClientProps) {
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
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {app.name}
                </h1>
                <p className="text-xs text-gray-500">
                  プレビューモード
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                {app.status}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(app.created_at).toLocaleDateString('ja-JP')}
              </Badge>
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={() => window.open(`/apps/${app.id}`, '_blank')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  詳細
                </button>
                <div className="w-px h-4 bg-gray-300" />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('プレビューURLをコピーしました');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  共有
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* モバイル用アクションボタン */}
        <div className="sm:hidden mb-4 flex gap-2">
          <button 
            onClick={() => window.open(`/apps/${app.id}`, '_blank')}
            className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium"
          >
            詳細
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('URLをコピーしました');
            }}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium"
          >
            共有
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインプレビューエリア */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
                      <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm" />
                    </div>
                    <span className="text-xs text-gray-600 font-mono bg-white px-2 py-1 rounded">
                      {app.name.toLowerCase().replace(/\s+/g, '-')}.tsx
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live Preview
                  </Badge>
                </div>
              </div>
              <div className="p-8 bg-white min-h-[500px]">
                <div className="max-w-none">
                  <DynamicComponentRenderer 
                    code={app.generated_code}
                    onError={(error) => console.error('Preview error:', error)}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* サイドバー情報 */}
          <div className="space-y-6">
            {/* アプリ情報 */}
            <Card>
              <div className="p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  アプリ情報
                </h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">ユーザーのアイデア</dt>
                    <dd className="text-sm text-gray-900">
                      {app.user_idea}
                    </dd>
                  </div>
                  {app.description && (
                    <div>
                      <dt className="text-xs text-gray-500 mb-1">説明</dt>
                      <dd className="text-sm text-gray-900">
                        {app.description}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">作成日時</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(app.created_at).toLocaleString('ja-JP')}
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>

            {/* スキーマ情報 */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-4 w-4 text-gray-600" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    データベーススキーマ
                  </h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <pre className="text-xs text-gray-700 overflow-auto">
                    {JSON.stringify(app.schema, null, 2)}
                  </pre>
                </div>
              </div>
            </Card>

            {/* コード表示トグル */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="h-4 w-4 text-gray-600" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    生成されたコード
                  </h2>
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                    コードを表示
                  </summary>
                  <div className="mt-3 bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                    <pre className="text-xs text-gray-300 font-mono">
                      {app.generated_code}
                    </pre>
                  </div>
                </details>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}