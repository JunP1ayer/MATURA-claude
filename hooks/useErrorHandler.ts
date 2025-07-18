import { useCallback } from 'react';
import { toast } from 'sonner';
import { handleApiError, errorToToast, type ErrorResponse } from '@/lib/error-handler';

/**
 * エラーハンドリング用のカスタムフック
 */
export function useErrorHandler() {
  /**
   * エラーをトーストで表示
   */
  const showErrorToast = useCallback((error: unknown) => {
    const errorResponse = handleApiError(error);
    const toastOptions = errorToToast(errorResponse);
    
    toast.error(toastOptions.title, {
      description: toastOptions.description,
      duration: toastOptions.duration,
    });
  }, []);

  /**
   * 成功メッセージをトーストで表示
   */
  const showSuccessToast = useCallback((message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  }, []);

  /**
   * 情報メッセージをトーストで表示
   */
  const showInfoToast = useCallback((message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  }, []);

  /**
   * 警告メッセージをトーストで表示
   */
  const showWarningToast = useCallback((message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  }, []);

  /**
   * エラーを処理し、適切なアクションを実行
   */
  const handleError = useCallback((error: unknown, options?: {
    showToast?: boolean;
    customMessage?: string;
    onError?: (errorResponse: ErrorResponse) => void;
  }) => {
    const errorResponse = handleApiError(error);
    
    // カスタムメッセージがある場合は上書き
    if (options?.customMessage) {
      errorResponse.message = options.customMessage;
    }
    
    // トーストで表示
    if (options?.showToast !== false) {
      showErrorToast(errorResponse);
    }
    
    // カスタムエラーハンドラを実行
    if (options?.onError) {
      options.onError(errorResponse);
    }
    
    return errorResponse;
  }, [showErrorToast]);

  return {
    handleError,
    showErrorToast,
    showSuccessToast,
    showInfoToast,
    showWarningToast,
  };
}