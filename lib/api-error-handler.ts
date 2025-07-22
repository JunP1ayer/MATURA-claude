import { NextRequest, NextResponse } from 'next/server';

/**
 * APIルート用のエラーハンドリング
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

/**
 * APIエラーレスポンスを生成
 */
export function createErrorResponse(
  error: unknown,
  request?: NextRequest
): NextResponse<ApiErrorResponse> {
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
  } else if (error instanceof Error) {
    message = error.message;
    
    // 特定のエラーパターンに応じたステータスコードの設定
    if (error.message.includes('validation') || error.message.includes('required')) {
      statusCode = 400;
      code = 'VALIDATION_ERROR';
    } else if (error.message.includes('not found') || error.message.includes('404')) {
      statusCode = 404;
      code = 'NOT_FOUND';
    } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
      statusCode = 401;
      code = 'UNAUTHORIZED';
    } else if (error.message.includes('forbidden') || error.message.includes('403')) {
      statusCode = 403;
      code = 'FORBIDDEN';
    } else if (error.message.includes('timeout')) {
      statusCode = 408;
      code = 'TIMEOUT';
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      statusCode = 429;
      code = 'RATE_LIMIT';
    }
  }

  const errorResponse: ApiErrorResponse = {
    error: code,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: request?.nextUrl?.pathname,
  };

  // 開発環境でのみスタックトレースを含める
  if (process.env.NODE_ENV === 'development' && error instanceof Error) {
    (errorResponse as any).stack = error.stack;
  }

  console.error('API Error:', {
    ...errorResponse,
    userAgent: request?.headers.get('user-agent'),
    ip: request?.ip,
  });

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * APIルートのエラーハンドリング用デコレーター
 */
export function withErrorHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return createErrorResponse(error, request);
    }
  };
}

/**
 * 入力値のバリデーション
 */
export function validateRequest(data: unknown, schema: any): void {
  // 簡単なバリデーション例
  if (!data || typeof data !== 'object') {
    throw new ApiError('Invalid request data', 400, 'VALIDATION_ERROR');
  }

  const dataObj = data as Record<string, any>;

  // 必須フィールドのチェック
  if (schema.required) {
    for (const field of schema.required) {
      if (!dataObj[field]) {
        throw new ApiError(`Missing required field: ${field}`, 400, 'VALIDATION_ERROR');
      }
    }
  }

  // 文字列長のチェック
  if (schema.maxLength) {
    for (const [field, maxLength] of Object.entries(schema.maxLength)) {
      if (dataObj[field] && typeof dataObj[field] === 'string' && dataObj[field].length > (maxLength as number)) {
        throw new ApiError(`Field ${field} exceeds maximum length of ${maxLength}`, 400, 'VALIDATION_ERROR');
      }
    }
  }
}

/**
 * レート制限チェック
 */
export function checkRateLimit(request: NextRequest, maxRequests = 100, windowMs = 60000): void {
  // 実際のレート制限実装はRedisやメモリベースのストレージを使用
  // ここでは簡単な例を示す
  const ip = request.ip || 'unknown';
  const key = `rate_limit:${ip}`;
  
  // 実装例：メモリベースの簡単なレート制限
  if (typeof window === 'undefined' && globalThis) {
    if (!(globalThis as any).rateLimitStore) {
      (globalThis as any).rateLimitStore = new Map();
    }
    
    const store = (globalThis as any).rateLimitStore;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // 古いエントリを削除
    const userRequests = store.get(key) || [];
    const validRequests = userRequests.filter((time: number) => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      throw new ApiError('Rate limit exceeded', 429, 'RATE_LIMIT');
    }
    
    // 新しいリクエストを追加
    validRequests.push(now);
    store.set(key, validRequests);
  }
}