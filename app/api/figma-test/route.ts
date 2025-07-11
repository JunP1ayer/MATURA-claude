// Figma API テスト用エンドポイント
import { NextRequest, NextResponse } from 'next/server'
import { SecureFigmaClient } from '@/lib/secure-figma-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fileId = searchParams.get('fileId') || process.env.DEFAULT_FIGMA_FILE_ID
    const useSecure = searchParams.get('secure') === 'true'
    
    if (!fileId) {
      return NextResponse.json({ 
        error: 'File ID is required',
        message: 'Provide fileId as query parameter or set DEFAULT_FIGMA_FILE_ID in environment'
      }, { status: 400 })
    }

    const apiKey = process.env.FIGMA_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API Key not configured',
        message: 'Set FIGMA_API_KEY in environment variables'
      }, { status: 500 })
    }

    // リクエストコンテキストの作成
    const requestContext = {
      ip: request.ip || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'MATURA-Test/1.0',
      headers: Object.fromEntries(request.headers.entries()),
      sessionId: 'test-session-' + Date.now(),
      userId: 'test-user'
    }

    // セキュアクライアントまたは通常のクライアントを使用
    if (useSecure) {
      const secureClient = new SecureFigmaClient({
        apiKey,
        teamId: process.env.FIGMA_TEAM_ID || 'test-team',
        enableMonitoring: true,
        enableSecurity: true
      })

      const result = await secureClient.getOptimizedFileData(fileId, requestContext)
      
      return NextResponse.json({
        success: true,
        client: 'secure',
        data: result,
        usageReport: secureClient.getUsageReport(),
        recentErrors: secureClient.getRecentErrors(5)
      })
    } else {
      // 通常のHTTP APIテスト
      const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
        headers: {
          'X-Figma-Token': apiKey,
          'User-Agent': 'MATURA-Test/1.0'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json({
          success: false,
          client: 'standard',
          error: {
            status: response.status,
            statusText: response.statusText,
            data: errorData
          }
        }, { status: response.status })
      }

      const data = await response.json()
      
      return NextResponse.json({
        success: true,
        client: 'standard',
        data: {
          name: data.name,
          lastModified: data.lastModified,
          role: data.role,
          version: data.version,
          thumbnailUrl: data.thumbnailUrl,
          documentsCount: data.document?.children?.length || 0
        }
      })
    }
  } catch (error) {
    console.error('Figma API test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// POST エンドポイント：詳細テスト
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileId, tests = ['basic', 'security', 'performance'] } = body

    if (!fileId) {
      return NextResponse.json({ 
        error: 'File ID is required in request body' 
      }, { status: 400 })
    }

    const apiKey = process.env.FIGMA_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API Key not configured' 
      }, { status: 500 })
    }

    const results: any = {
      fileId,
      timestamp: new Date().toISOString(),
      tests: {} as any
    }

    // リクエストコンテキスト
    const requestContext = {
      ip: request.ip || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'MATURA-Test/1.0',
      headers: Object.fromEntries(request.headers.entries()),
      sessionId: 'test-session-' + Date.now(),
      userId: 'test-user'
    }

    // セキュアクライアントの初期化
    const secureClient = new SecureFigmaClient({
      apiKey,
      teamId: process.env.FIGMA_TEAM_ID || 'test-team',
      enableMonitoring: true,
      enableSecurity: true
    })

    // 基本テスト
    if (tests.includes('basic')) {
      const startTime = Date.now()
      try {
        const data = await secureClient.getFileSecurely(fileId, requestContext)
        results.tests.basic = {
          success: true,
          duration: Date.now() - startTime,
          data: {
            name: data.name,
            lastModified: data.lastModified,
            role: data.role
          }
        }
      } catch (error) {
        results.tests.basic = {
          success: false,
          duration: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // セキュリティテスト
    if (tests.includes('security')) {
      const startTime = Date.now()
      try {
        // 異常なリクエストを意図的に送信
        const suspiciousContext = {
          ...requestContext,
          userAgent: 'bot-crawler',
          ip: '192.168.1.1'
        }
        
        await secureClient.getFileSecurely(fileId, suspiciousContext)
        results.tests.security = {
          success: true,
          duration: Date.now() - startTime,
          message: 'Security checks passed'
        }
      } catch (error) {
        results.tests.security = {
          success: false,
          duration: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Security violation detected (expected behavior)'
        }
      }
    }

    // パフォーマンステスト
    if (tests.includes('performance')) {
      const startTime = Date.now()
      try {
        const optimizedData = await secureClient.getOptimizedFileData(fileId, requestContext)
        results.tests.performance = {
          success: true,
          duration: Date.now() - startTime,
          data: {
            name: optimizedData.name,
            designSystem: {
              colorsCount: optimizedData.designSystem.colors.length,
              fontsCount: optimizedData.designSystem.fonts.length,
              componentsCount: optimizedData.designSystem.components.length
            }
          }
        }
      } catch (error) {
        results.tests.performance = {
          success: false,
          duration: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // 使用状況レポート
    results.usageReport = secureClient.getUsageReport()
    results.recentErrors = secureClient.getRecentErrors(5)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Figma API detailed test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}