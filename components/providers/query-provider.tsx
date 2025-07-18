'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { toast } from 'sonner'
import { handleApiError, errorToToast } from '@/lib/error-handler'
import { SmartRefetchProvider } from '@/components/SmartRefetchProvider'

// 高性能キャッシュ設定
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分間はフレッシュとみなす
      gcTime: 30 * 60 * 1000, // 30分間キャッシュを保持
      retry: (failureCount, error: any) => {
        // ネットワークエラーの場合は3回リトライ、それ以外は1回
        if (error?.status >= 500) return failureCount < 3
        if (error?.status === 404) return false
        return failureCount < 1
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // インテリジェントなrefetch戦略
      refetchOnWindowFocus: true,     // ウィンドウフォーカス時に更新
      refetchOnMount: 'always',       // マウント時に常に更新
      refetchOnReconnect: true,       // ネットワーク再接続時に更新
      // デフォルトのrefetchIntervalは無効化（個別設定に委ねる）
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 1,
      // 楽観的更新のためのコールバック
      onMutate: async () => {
        // 楽観的更新前の処理
      },
      onError: (error, variables, context) => {
        console.error('Mutation error:', error)
        
        // エラーをトーストで表示
        const errorResponse = handleApiError(error);
        const toastOptions = errorToToast(errorResponse);
        
        toast.error(toastOptions.title, {
          description: toastOptions.description,
          duration: toastOptions.duration,
        });
      },
      onSuccess: () => {
        // 成功時の処理
      },
    },
  },
})

// オフライン対応のためのpersister
const persister = typeof window !== 'undefined' 
  ? createSyncStoragePersister({
      storage: window.localStorage,
      key: 'MATURA_CACHE',
      throttleTime: 1000,
    })
  : undefined

// 予測的prefetch機能
export const PrefetchManager = {
  // 関連データの事前読み込み
  async prefetchRelatedData(appId: string, appType: string) {
    // アプリの基本情報をprefetch
    await queryClient.prefetchQuery({
      queryKey: ['apps', appId],
      queryFn: () => fetch(`/api/apps/${appId}`).then(res => res.json()),
      staleTime: 10 * 60 * 1000,
    })

    // アプリタイプに応じて関連データをprefetch
    if (appType.includes('ホテル') || appType.includes('hotel')) {
      await queryClient.prefetchQuery({
        queryKey: ['hotel-bookings', appId],
        queryFn: () => fetch(`/api/apps/${appId}/bookings`).then(res => res.json()),
        staleTime: 5 * 60 * 1000,
      })
    }

    if (appType.includes('家計簿') || appType.includes('budget')) {
      await queryClient.prefetchQuery({
        queryKey: ['transactions', appId],
        queryFn: () => fetch(`/api/apps/${appId}/transactions`).then(res => res.json()),
        staleTime: 5 * 60 * 1000,
      })
    }
  },

  // ユーザーの行動パターンに基づくインテリジェントprefetch
  async intelligentPrefetch(userActivity: any[]) {
    const frequentlyAccessedApps = userActivity
      .reduce((acc, activity) => {
        acc[activity.appId] = (acc[activity.appId] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    // よくアクセスされるアプリのデータを事前読み込み
    const topApps = Object.entries(frequentlyAccessedApps)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    for (const [appId] of topApps) {
      await queryClient.prefetchQuery({
        queryKey: ['apps', appId],
        queryFn: () => fetch(`/api/apps/${appId}`).then(res => res.json()),
      })
    }
  },

  // 時間帯に基づくスマートprefetch
  async timeBasedPrefetch() {
    const hour = new Date().getHours()
    
    // 朝の時間帯 (7-10時) - タスク管理アプリを優先
    if (hour >= 7 && hour <= 10) {
      await queryClient.prefetchQuery({
        queryKey: ['popular-apps', 'morning'],
        queryFn: () => fetch('/api/apps?category=productivity').then(res => res.json()),
      })
    }
    
    // 夜の時間帯 (19-23時) - 家計簿アプリを優先
    if (hour >= 19 && hour <= 23) {
      await queryClient.prefetchQuery({
        queryKey: ['popular-apps', 'evening'],
        queryFn: () => fetch('/api/apps?category=finance').then(res => res.json()),
      })
    }
  }
}

// パフォーマンス監視
export const PerformanceMonitor = {
  // クエリ実行時間の計測
  measureQueryTime: (queryKey: string[]) => {
    const startTime = performance.now()
    
    return {
      end: () => {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        // 遅いクエリをログ出力
        if (duration > 1000) {
          console.warn(`Slow query detected: ${queryKey.join('/')} took ${duration.toFixed(2)}ms`)
        }
        
        return duration
      }
    }
  },

  // キャッシュヒット率の監視
  cacheHitRate: {
    hits: 0,
    misses: 0,
    getRate: () => {
      const total = PerformanceMonitor.cacheHitRate.hits + PerformanceMonitor.cacheHitRate.misses
      return total > 0 ? (PerformanceMonitor.cacheHitRate.hits / total) * 100 : 0
    }
  }
}

// React Query設定の最適化
queryClient.setMutationDefaults(['create'], {
  mutationFn: async (variables: any) => {
    const timer = PerformanceMonitor.measureQueryTime(['mutation', 'create'])
    try {
      const result = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      }).then(res => res.json())
      
      timer.end()
      return result
    } catch (error) {
      timer.end()
      throw error
    }
  },
  // 楽観的更新
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: [variables.type, variables.appId] })
    const previousData = queryClient.getQueryData([variables.type, variables.appId])
    
    // 楽観的にデータを更新
    queryClient.setQueryData([variables.type, variables.appId], (old: any[]) => {
      return [...(old || []), { ...variables, id: `temp-${Date.now()}` }]
    })
    
    return { previousData }
  },
  onError: (err, variables, context) => {
    // エラー時に元のデータに戻す
    if (context?.previousData) {
      queryClient.setQueryData([variables.type, variables.appId], context.previousData)
    }
  },
  onSettled: (data, error, variables) => {
    // 最終的にサーバーから最新データを取得
    queryClient.invalidateQueries({ queryKey: [variables.type, variables.appId] })
  },
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = React.useState(false)
  
  React.useEffect(() => {
    setIsClient(true)
    
    // 初期化時にインテリジェントprefetchを実行
    PrefetchManager.timeBasedPrefetch()
    
    // パフォーマンス監視の開始
    const interval = setInterval(() => {
      const hitRate = PerformanceMonitor.cacheHitRate.getRate()
      console.log(`Cache hit rate: ${hitRate.toFixed(2)}%`)
    }, 60000) // 1分ごと
    
    return () => clearInterval(interval)
  }, [])

  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
    </div>
  }

  // persisterが利用可能な場合は永続化機能を使用
  if (persister) {
    return (
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <SmartRefetchProvider>
          {children}
          <ReactQueryDevtools 
            initialIsOpen={false} 
            toggleButtonProps={{
              style: {
                marginLeft: '5px',
                transform: 'translateY(-5px)',
              },
            }}
          />
        </SmartRefetchProvider>
      </PersistQueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SmartRefetchProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </SmartRefetchProvider>
    </QueryClientProvider>
  )
}