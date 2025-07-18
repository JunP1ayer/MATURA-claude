import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface SmartQueryOptions<TData> extends Omit<UseQueryOptions<TData>, 'refetchInterval'> {
  /**
   * スマートrefetch設定
   */
  smartRefetch?: {
    /** 最近のアクティビティがある場合の間隔（ms） */
    activeInterval?: number;
    /** 通常時の間隔（ms） */
    normalInterval?: number;
    /** アクティビティの判定時間（ms） */
    activityThreshold?: number;
    /** アクティビティの判定関数 */
    isActive?: (data: TData) => boolean;
    /** 最大refetch間隔（ms） */
    maxInterval?: number;
    /** 最小refetch間隔（ms） */
    minInterval?: number;
  };
  
  /**
   * 条件付きrefetch
   */
  conditionalRefetch?: {
    /** ユーザーがアクティブな場合のみrefetch */
    onlyWhenActive?: boolean;
    /** 特定の条件が満たされた場合のみrefetch */
    condition?: (data: TData) => boolean;
  };
}

/**
 * ユーザーのアクティビティを検出するhook
 */
function useUserActivity() {
  const isActive = useRef(true);
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const updateActivity = () => {
      isActive.current = true;
      lastActivity.current = Date.now();
    };

    // ユーザーのアクティビティを検出
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // 30秒間アクティビティがない場合は非アクティブとみなす
    const checkActivity = setInterval(() => {
      if (Date.now() - lastActivity.current > 30000) {
        isActive.current = false;
      }
    }, 5000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(checkActivity);
    };
  }, []);

  return {
    isActive: isActive.current,
    lastActivity: lastActivity.current,
  };
}

/**
 * スマートなrefetch戦略を持つQuery hook
 */
export function useSmartQuery<TData = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options: SmartQueryOptions<TData> = {}
) {
  const { smartRefetch, conditionalRefetch, ...queryOptions } = options;
  const { isActive } = useUserActivity();

  const query = useQuery({
    queryKey,
    queryFn,
    ...queryOptions,
    refetchInterval: (data) => {
      // 条件付きrefetch: ユーザーがアクティブでない場合は停止
      if (conditionalRefetch?.onlyWhenActive && !isActive) {
        return false;
      }

      // 条件付きrefetch: カスタム条件
      if (conditionalRefetch?.condition && data && !conditionalRefetch.condition(data)) {
        return false;
      }

      // スマートrefetch設定が無い場合はデフォルト値
      if (!smartRefetch) {
        return false;
      }

      const {
        activeInterval = 30000,      // 30秒
        normalInterval = 5 * 60 * 1000, // 5分
        activityThreshold = 5 * 60 * 1000, // 5分
        isActive: isActiveCheck,
        maxInterval = 15 * 60 * 1000,    // 15分
        minInterval = 10000,             // 10秒
      } = smartRefetch;

      if (!data) {
        return Math.max(minInterval, Math.min(normalInterval, maxInterval));
      }

      // カスタムアクティビティ判定
      if (isActiveCheck) {
        const active = isActiveCheck(data);
        const interval = active ? activeInterval : normalInterval;
        return Math.max(minInterval, Math.min(interval, maxInterval));
      }

      // デフォルト：通常間隔
      return Math.max(minInterval, Math.min(normalInterval, maxInterval));
    },
  });

  return query;
}

/**
 * 生成されたアプリ用のスマートQuery
 */
export function useGeneratedAppsQuery() {
  return useSmartQuery(
    ['generatedApps'],
    async () => {
      const response = await fetch('/api/crud/generated_apps');
      if (!response.ok) throw new Error('Failed to fetch apps');
      return response.json();
    },
    {
      staleTime: 30000,
      gcTime: 5 * 60 * 1000,
      smartRefetch: {
        activeInterval: 30000,        // 30秒間隔
        normalInterval: 5 * 60 * 1000, // 5分間隔
        activityThreshold: 5 * 60 * 1000, // 5分以内の新しいアプリがある場合
        isActive: (data: any[]) => {
          if (!data || data.length === 0) return false;
          const latestApp = data[0];
          if (!latestApp || !latestApp.created_at) return false;
          const timeSinceLatest = Date.now() - new Date(latestApp.created_at).getTime();
          return timeSinceLatest < 5 * 60 * 1000;
        },
        maxInterval: 10 * 60 * 1000,  // 最大10分間隔
        minInterval: 30000,           // 最小30秒間隔
      },
      conditionalRefetch: {
        onlyWhenActive: true,         // ユーザーがアクティブな場合のみ
      },
    }
  );
}

/**
 * 条件付きクエリ実行hook
 */
export function useConditionalQuery<TData = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  condition: boolean,
  options: UseQueryOptions<TData> = {}
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: condition,
    ...options,
  });
}

/**
 * 依存関係があるクエリのhook
 */
export function useDependentQuery<TData = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  dependency: any,
  options: UseQueryOptions<TData> = {}
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: !!dependency,
    ...options,
  });
}