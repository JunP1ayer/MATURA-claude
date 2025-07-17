import { NextRequest, NextResponse } from 'next/server';
import { AuthHelpers } from '@/lib/auth';

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  authentication?: {
    type: 'none' | 'bearer' | 'apikey' | 'basic';
    token?: string;
    username?: string;
    password?: string;
  };
  params?: Record<string, string>;
  body?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 認証チェック（オプショナル）
    const user = await AuthHelpers.validateSession(req);
    
    const { tableName, endpoint }: { tableName: string; endpoint: ApiEndpoint } = await req.json();
    
    if (!endpoint || !endpoint.url) {
      return NextResponse.json({
        success: false,
        error: 'エンドポイントの設定が不完全です'
      }, { status: 400 });
    }

    // API テストを実行
    const testResult = await testApiEndpoint(endpoint);
    
    return NextResponse.json(testResult);

  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json({
      success: false,
      error: 'API テスト中にエラーが発生しました'
    }, { status: 500 });
  }
}

async function testApiEndpoint(endpoint: ApiEndpoint) {
  try {
    // リクエストヘッダーを構築
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // カスタムヘッダーを追加
    if (endpoint.headers) {
      Object.entries(endpoint.headers).forEach(([key, value]) => {
        if (key.trim() && value.trim()) {
          headers.set(key, value);
        }
      });
    }

    // 認証情報を追加
    if (endpoint.authentication) {
      switch (endpoint.authentication.type) {
        case 'bearer':
          if (endpoint.authentication.token) {
            headers.set('Authorization', `Bearer ${endpoint.authentication.token}`);
          }
          break;
        case 'apikey':
          if (endpoint.authentication.token) {
            headers.set('X-API-Key', endpoint.authentication.token);
          }
          break;
        case 'basic':
          if (endpoint.authentication.username && endpoint.authentication.password) {
            const credentials = Buffer.from(`${endpoint.authentication.username}:${endpoint.authentication.password}`).toString('base64');
            headers.set('Authorization', `Basic ${credentials}`);
          }
          break;
      }
    }

    // リクエストオプションを構築
    const requestOptions: RequestInit = {
      method: endpoint.method,
      headers,
    };

    // POSTやPUTの場合はボディを追加
    if (['POST', 'PUT'].includes(endpoint.method) && endpoint.body) {
      requestOptions.body = endpoint.body;
    }

    // URLパラメータを追加
    let url = endpoint.url;
    if (endpoint.params) {
      const params = new URLSearchParams();
      Object.entries(endpoint.params).forEach(([key, value]) => {
        if (key.trim() && value.trim()) {
          params.append(key, value);
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    // APIリクエストを実行（タイムアウト設定）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒タイムアウト

    requestOptions.signal = controller.signal;

    const startTime = Date.now();
    const response = await fetch(url, requestOptions);
    const endTime = Date.now();
    
    clearTimeout(timeoutId);

    const responseTime = endTime - startTime;
    
    // レスポンスの処理
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      error: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'リクエストがタイムアウトしました（10秒）',
          timestamp: new Date().toISOString()
        };
      }
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      success: false,
      error: '不明なエラーが発生しました',
      timestamp: new Date().toISOString()
    };
  }
}

// 保存されたエンドポイントの一覧を取得
export async function GET(req: NextRequest) {
  try {
    const user = await AuthHelpers.validateSession(req);
    const { searchParams } = new URL(req.url);
    const tableName = searchParams.get('table');
    
    if (!tableName) {
      return NextResponse.json({
        error: 'テーブル名が必要です'
      }, { status: 400 });
    }

    // 実際の実装では、データベースからエンドポイント設定を取得
    // 現在はサンプルデータを返す
    const endpoints = [
      {
        id: '1',
        name: 'サンプルAPI',
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'GET',
        headers: {},
        authentication: { type: 'none' },
        enabled: true
      }
    ];

    return NextResponse.json({
      endpoints,
      tableName
    });

  } catch (error) {
    console.error('Endpoints fetch error:', error);
    return NextResponse.json({
      error: 'エンドポイント一覧の取得中にエラーが発生しました'
    }, { status: 500 });
  }
}