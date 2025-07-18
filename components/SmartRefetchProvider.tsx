'use client';

import { useSmartRefetch } from '@/hooks/useVisibilityRefetch';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * アプリケーション全体のスマートrefetch制御
 */
export function SmartRefetchProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // 重要なクエリキーを定義
  const criticalQueryKeys = [
    ['generatedApps'],
    ['userProfile'],
    ['appStats'],
  ];

  // スマートrefetch機能を有効化
  useSmartRefetch({
    queryKeys: criticalQueryKeys,
    enableVisibilityRefetch: true,
    enableNetworkRefetch: true,
  });

  // クエリキャッシュの監視とメモリ管理
  useEffect(() => {
    const interval = setInterval(() => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      
      // 古いクエリを削除（1時間以上アクセスされていない）
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      queries.forEach(query => {
        if (query.state.dataUpdatedAt < oneHourAgo && query.getObserversCount() === 0) {
          cache.remove(query);
        }
      });

      // メモリ使用量が多い場合は積極的にガベージコレクション
      if (queries.length > 100) {
        queryClient.clear();
      }
    }, 10 * 60 * 1000); // 10分ごとに実行

    return () => clearInterval(interval);
  }, [queryClient]);

  // パフォーマンスログ（開発環境のみ）
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const logInterval = setInterval(() => {
        const cache = queryClient.getQueryCache();
        const queries = cache.getAll();
        const activeQueries = queries.filter(q => q.state.fetchStatus === 'fetching');
        
        console.log('🔄 React Query Status:', {
          totalQueries: queries.length,
          activeQueries: activeQueries.length,
          memoryUsage: `${Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024)}MB`,
        });
      }, 30000); // 30秒ごと

      return () => clearInterval(logInterval);
    }
  }, [queryClient]);

  return <>{children}</>;
}