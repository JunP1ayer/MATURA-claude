import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Page Visibility API を使用したスマートなrefetch制御
 */
export function useVisibilityRefetch(queryKeys: string[][] = []) {
  const queryClient = useQueryClient();
  const wasHidden = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasHidden.current = true;
        // ページが非表示になったら全てのクエリを一時停止
        queryClient.getQueryCache().getAll().forEach(query => {
          if (query.state.fetchStatus === 'fetching') {
            query.cancel();
          }
        });
      } else if (wasHidden.current) {
        // ページが表示に戻ったら重要なクエリを更新
        if (queryKeys.length > 0) {
          queryKeys.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey });
          });
        } else {
          // 全てのクエリを更新
          queryClient.invalidateQueries();
        }
        wasHidden.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryClient, queryKeys]);
}

/**
 * ネットワーク状態による自動refetch制御
 */
export function useNetworkRefetch(queryKeys: string[][] = []) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      // オンラインに戻ったら重要なクエリを更新
      if (queryKeys.length > 0) {
        queryKeys.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      } else {
        queryClient.invalidateQueries();
      }
    };

    const handleOffline = () => {
      // オフラインになったら全てのクエリを一時停止
      queryClient.getQueryCache().getAll().forEach(query => {
        if (query.state.fetchStatus === 'fetching') {
          query.cancel();
        }
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient, queryKeys]);
}

/**
 * 統合されたスマートrefetch hook
 */
export function useSmartRefetch(options: {
  queryKeys?: string[][];
  enableVisibilityRefetch?: boolean;
  enableNetworkRefetch?: boolean;
} = {}) {
  const {
    queryKeys = [],
    enableVisibilityRefetch = true,
    enableNetworkRefetch = true,
  } = options;

  if (enableVisibilityRefetch) {
    useVisibilityRefetch(queryKeys);
  }

  if (enableNetworkRefetch) {
    useNetworkRefetch(queryKeys);
  }
}