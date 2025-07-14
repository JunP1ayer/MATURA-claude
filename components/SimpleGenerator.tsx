'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Code2, Database, RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface GeneratedResult {
  code: string;
  schema: any;
  app?: any;
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

export function SimpleGenerator() {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // React Query for fetching generated apps
  const { data: generatedApps, isLoading: isLoadingApps } = useQuery({
    queryKey: ['generatedApps'],
    queryFn: async () => {
      const response = await fetch('/api/crud/generated_apps');
      if (!response.ok) throw new Error('Failed to fetch apps');
      return response.json() as Promise<GeneratedApp[]>;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // リロード時に入力欄をフォーカス
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Supabase real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('generated_apps_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generated_apps'
        },
        () => {
          // Refetch apps when changes occur
          queryClient.invalidateQueries({ queryKey: ['generatedApps'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      if (!response.ok) {
        throw new Error('生成に失敗しました');
      }

      const data = await response.json();
      setResult(data);
      
      // アプリが正常に生成されたら、リストを更新
      queryClient.invalidateQueries({ queryKey: ['generatedApps'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setIdea('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* 左上のロゴヘッダー */}
      <div className="fixed top-0 left-0 p-6 z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl shadow-md">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            MATURA
          </h1>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-6 py-24">

        {/* プレミアム入力セクション */}
        <div className="space-y-6">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Describe your app idea..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-32 text-base border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl px-6 py-5 focus:ring-2 focus:ring-slate-900/10 focus:shadow-xl transition-all duration-300 resize-none placeholder:text-slate-400"
              disabled={isGenerating}
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium">
              {idea.length} characters
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={!idea.trim() || isGenerating}
              className="flex-1 h-14 text-base font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  <span>Building your app...</span>
                </>
              ) : (
                <>
                  <span>Create App</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </Button>
            
            {result && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-14 px-8 text-base border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-300"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* エレガントなエラー表示 */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-sm">
            <p className="text-red-600 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        {/* プレミアムプレビュー */}
        {result && (
          <div className="space-y-8 mt-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Your app is ready
              </h2>
              <p className="text-slate-600 font-light">
                Generated database schema and React components
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* プレミアムスキーマ表示 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    Database Schema
                  </h3>
                </div>
                <pre className="bg-slate-50 text-slate-700 p-4 rounded-xl text-xs overflow-auto max-h-72 font-mono border">
                  {JSON.stringify(result.schema, null, 2)}
                </pre>
              </div>

              {/* プレミアムコード表示 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Code2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    React Components
                  </h3>
                </div>
                <pre className="bg-slate-50 text-slate-700 p-4 rounded-xl text-xs overflow-auto max-h-72 font-mono border">
                  {result.code}
                </pre>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => window.open('/app-creator', '_blank')}
                variant="outline"
                className="px-8 py-3 border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition-all duration-300"
              >
                Advanced Editor
              </Button>
            </div>
          </div>
        )}

        {/* Generated Apps List */}
        {generatedApps && generatedApps.length > 0 && (
          <div className="space-y-6 mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Generated Apps ({generatedApps.length})
              </h2>
              <Button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['generatedApps'] })}
                variant="outline"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="grid gap-4">
              {generatedApps.slice(0, 5).map((app) => (
                <div key={app.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-slate-200/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 truncate">
                        {app.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {app.description || app.user_idea}
                      </p>
                      <div className="text-xs text-slate-400 mt-2">
                        {new Date(app.created_at).toLocaleString('ja-JP')}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <div className="text-xs text-slate-500">
                        {(app.schema as any)?.tableName || 'Unknown'}
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* エレガントなローディング */}
        {isGenerating && (
          <div className="text-center space-y-6 py-12">
            <div className="relative">
              <div className="w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-slate-900 rounded-full animate-spin border-t-transparent"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Creating your app</h3>
              <p className="text-slate-600 font-light">Analyzing requirements and generating code...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}