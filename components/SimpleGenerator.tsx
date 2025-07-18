'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Database, RefreshCw, Eye, ExternalLink } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Logo } from '@/components/Logo';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { checkFetchResponse } from '@/lib/error-handler';
import { useGeneratedAppsQuery } from '@/hooks/useSmartQuery';

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

interface SimpleGeneratorProps {
  showRecentApps?: boolean;
}

export function SimpleGenerator({ showRecentApps = true }: SimpleGeneratorProps = {}) {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { handleError, showSuccessToast, showErrorToast } = useErrorHandler();

  // スマートクエリで生成されたアプリを取得
  const { data: generatedApps, isLoading: isLoadingApps } = useGeneratedAppsQuery();

  // リロード時に入力欄をフォーカス
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);


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

      // レスポンスのチェック
      await checkFetchResponse(response);

      const data = await response.json();
      setResult(data);
      
      // 成功メッセージを表示
      showSuccessToast('アプリが正常に生成されました！', 'プレビューで確認できます');
      
      // アプリが正常に生成されたら、リストを更新
      queryClient.invalidateQueries({ queryKey: ['generatedApps'] });
    } catch (err) {
      // 統一されたエラーハンドリング
      const errorResponse = handleError(err, {
        customMessage: 'アプリの生成中にエラーが発生しました。もう一度お試しください。',
        showToast: true,
      });
      
      setError(errorResponse.message);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Modern Header */}
      <div className="fixed top-0 left-0 right-0 p-4 md:p-6 z-10 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Logo variant="compact" />
          <div className="flex items-center gap-2">
            <a
              href="/table-manager"
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white backdrop-blur-sm"
            >
              <Database className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">テーブル管理</span>
              <span className="sm:hidden">DB</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="flex min-h-screen items-center justify-center px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Typography */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              What do you want to
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                build?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Describe your app idea and we'll generate a complete, functional MVP in seconds.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="relative group">
              <Textarea
                ref={textareaRef}
                placeholder="A task management app for teams..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className={`min-h-32 md:min-h-40 text-base md:text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-6 focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 resize-none placeholder:text-white/50 text-white shadow-2xl ${
                  idea.length > 0 ? 'bg-white/15 border-white/30' : ''
                }`}
                disabled={isGenerating}
              />
              <div className="absolute bottom-4 right-6 text-xs text-white/40 font-medium">
                {idea.length} characters
              </div>
              {idea.length > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl -z-10 blur-xl animate-pulse" />
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleGenerate}
                disabled={!idea.trim() || isGenerating}
                className="flex-1 h-12 md:h-14 text-base md:text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed group backdrop-blur-sm"
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
                  className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Error Display */}
      {error && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl p-4 shadow-2xl max-w-md mx-auto z-50">
          <p className="text-red-200 text-sm text-center font-medium">{error}</p>
        </div>
      )}

      {/* Modern Result Display */}
      {result && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
                <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Your app is ready
              </h2>
              <p className="text-white/70 text-lg">
                Generated database schema and React components
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Modern Schema Display */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Database className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">
                    Database Schema
                  </h3>
                </div>
                <pre className="bg-black/40 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-72 font-mono border border-white/10">
                  {JSON.stringify(result.schema, null, 2)}
                </pre>
              </div>

              {/* Modern Code Display */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Database className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white">
                    React Components
                  </h3>
                </div>
                <pre className="bg-black/40 text-blue-400 p-4 rounded-xl text-xs overflow-auto max-h-72 font-mono border border-white/10">
                  {result.code}
                </pre>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  if (result?.app?.id) {
                    window.open(`/preview/${result.app.id}`, '_blank');
                  }
                }}
                disabled={!result?.app?.id}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-2xl"
              >
                <Eye className="h-5 w-5 mr-2" />
                プレビューを見る
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-8 py-3 border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Generated Apps List - Only show on main generator page */}
      {showRecentApps && generatedApps && generatedApps.length > 0 && !result && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md border-t border-white/10 p-6 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Apps ({generatedApps.length})
              </h2>
              <Button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['generatedApps'] })}
                variant="outline"
                size="sm"
                className="text-white/70 hover:text-white border-white/20 bg-white/10 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedApps.slice(0, 6).map((app) => (
                <div key={app.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-500/20 rounded-lg">
                        <Database className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm">
                          {app.name || 'Generated App'}
                        </h3>
                        <p className="text-xs text-white/60">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => window.open(`/preview/${app.id}`, '_blank')}
                        size="sm"
                        variant="outline"
                        className="text-white/70 hover:text-white border-white/20 bg-white/10 hover:bg-white/20 h-8 px-2"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => window.open(`/app/${app.id}`, '_blank')}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-8 px-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 truncate">
                    {app.user_idea}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modern Loading State */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Creating your app</h3>
              <p className="text-white/70 font-light">Analyzing requirements and generating code...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}