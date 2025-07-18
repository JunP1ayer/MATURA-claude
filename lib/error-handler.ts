/**
 * エラーハンドリング用のユーティリティ関数
 */

export interface ErrorResponse {
  message: string;
  type: 'api_error' | 'network_error' | 'validation_error' | 'unknown_error';
  details?: string;
  statusCode?: number;
}

export interface ToastOptions {
  type: 'error' | 'success' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}

/**
 * APIエラーを解析してユーザーフレンドリーなメッセージを生成
 */
export function handleApiError(error: unknown): ErrorResponse {
  // fetch APIのエラー
  if (error instanceof Response) {
    const statusCode = error.status;
    
    switch (statusCode) {
      case 400:
        return {
          message: 'リクエストに問題があります。入力内容を確認してください。',
          type: 'validation_error',
          statusCode,
        };
      case 401:
        return {
          message: '認証が必要です。ログインしてください。',
          type: 'api_error',
          statusCode,
        };
      case 403:
        return {
          message: 'アクセス権限がありません。',
          type: 'api_error',
          statusCode,
        };
      case 404:
        return {
          message: 'リソースが見つかりません。',
          type: 'api_error',
          statusCode,
        };
      case 429:
        return {
          message: 'リクエストが多すぎます。しばらく待ってから再度お試しください。',
          type: 'api_error',
          statusCode,
        };
      case 500:
        return {
          message: 'サーバーエラーが発生しました。しばらく待ってから再度お試しください。',
          type: 'api_error',
          statusCode,
        };
      default:
        return {
          message: 'エラーが発生しました。しばらく待ってから再度お試しください。',
          type: 'api_error',
          statusCode,
        };
    }
  }

  // ネットワークエラー
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
      type: 'network_error',
    };
  }

  // Error オブジェクト
  if (error instanceof Error) {
    // OpenAI APIエラーの特定
    if (error.message.includes('OpenAI')) {
      return {
        message: 'AI生成サービスでエラーが発生しました。しばらく待ってから再度お試しください。',
        type: 'api_error',
        details: error.message,
      };
    }

    // Gemini APIエラーの特定
    if (error.message.includes('Gemini') || error.message.includes('Google')) {
      return {
        message: 'AI生成サービスでエラーが発生しました。しばらく待ってから再度お試しください。',
        type: 'api_error',
        details: error.message,
      };
    }

    // Figma APIエラーの特定
    if (error.message.includes('Figma')) {
      return {
        message: 'Figmaサービスでエラーが発生しました。APIキーを確認してください。',
        type: 'api_error',
        details: error.message,
      };
    }

    // タイムアウトエラー
    if (error.message.includes('timeout')) {
      return {
        message: 'リクエストがタイムアウトしました。しばらく待ってから再度お試しください。',
        type: 'network_error',
        details: error.message,
      };
    }

    return {
      message: error.message || '予期しないエラーが発生しました。',
      type: 'unknown_error',
      details: error.message,
    };
  }

  // その他のエラー
  return {
    message: '予期しないエラーが発生しました。',
    type: 'unknown_error',
    details: typeof error === 'string' ? error : JSON.stringify(error),
  };
}

/**
 * エラーからToastオプションを生成
 */
export function errorToToast(error: ErrorResponse): ToastOptions {
  const baseOptions: ToastOptions = {
    type: 'error',
    title: 'エラー',
    duration: 5000,
  };

  switch (error.type) {
    case 'validation_error':
      return {
        ...baseOptions,
        title: '入力エラー',
        description: error.message,
        duration: 4000,
      };
    case 'network_error':
      return {
        ...baseOptions,
        title: 'ネットワークエラー',
        description: error.message,
        duration: 6000,
      };
    case 'api_error':
      return {
        ...baseOptions,
        title: 'サービスエラー',
        description: error.message,
        duration: 5000,
      };
    default:
      return {
        ...baseOptions,
        description: error.message,
      };
  }
}

/**
 * fetch APIのレスポンスをチェックし、エラーの場合は適切なエラーを投げる
 */
export async function checkFetchResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    let errorMessage = 'リクエストに失敗しました';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // JSONパースに失敗した場合はデフォルトメッセージを使用
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }
  
  return response;
}

/**
 * 非同期処理を実行し、エラーをキャッチして適切に処理する
 */
export async function executeWithErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    onError?: (error: ErrorResponse) => void;
    fallback?: T;
  }
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const errorResponse = handleApiError(error);
    
    if (options?.onError) {
      options.onError(errorResponse);
    }
    
    if (options?.fallback !== undefined) {
      return options.fallback;
    }
    
    return null;
  }
}