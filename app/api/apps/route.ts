import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * 生成されたアプリの一覧を提供するAPI
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📱 Fetching apps list...')
    
    const appDir = path.join(process.cwd(), 'app')
    const entries = await fs.readdir(appDir, { withFileTypes: true })
    
    // app[数字] または具体的なアプリ名のディレクトリを検索
    const appDirectories = entries
      .filter(entry => entry.isDirectory() && (
        /^app\d+$/.test(entry.name) || // app1, app2, app3 など
        entry.name.includes('-app') || // カスタムアプリ名
        entry.name.includes('generated') // 生成されたアプリ
      ))
      .map(entry => entry.name)
    
    console.log(`📂 Found ${appDirectories.length} app directories:`, appDirectories)
    
    // 各アプリのメタデータを読み込み
    const apps = []
    
    for (const appId of appDirectories) {
      try {
        const metadataPath = path.join(appDir, appId, 'metadata.json')
        const pagePath = path.join(appDir, appId, 'page.tsx')
        
        // ファイルの存在確認
        await fs.access(metadataPath)
        await fs.access(pagePath)
        
        const metadataContent = await fs.readFile(metadataPath, 'utf-8')
        const metadata = JSON.parse(metadataContent)
        
        apps.push({
          id: appId,
          appType: metadata.appType || 'Unknown App',
          description: metadata.description || '',
          timestamp: metadata.timestamp || new Date().toISOString(),
          features: metadata.features || [],
          url: `/apps/${appId}`,
          directUrl: `/api/apps/${appId}/render`
        })
        
      } catch (error) {
        console.warn(`⚠️ Failed to load metadata for ${appId}:`, error)
        // メタデータが読み込めない場合もリストに含める
        apps.push({
          id: appId,
          appType: 'Generated App',
          description: 'メタデータの読み込みに失敗しました',
          timestamp: new Date().toISOString(),
          features: [],
          url: `/apps/${appId}`,
          directUrl: `/api/apps/${appId}/render`,
          hasError: true
        })
      }
    }
    
    // タイムスタンプでソート（新しい順）
    apps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    console.log(`✅ Successfully loaded ${apps.length} apps`)
    
    return NextResponse.json({
      success: true,
      count: apps.length,
      apps,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching apps list:', error)
    return NextResponse.json(
      { 
        error: 'アプリ一覧の取得に失敗しました',
        details: error.message
      },
      { status: 500 }
    )
  }
}

/**
 * 特定のアプリを削除する（将来の機能）
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('id')
    
    if (!appId) {
      return NextResponse.json(
        { error: 'App ID is required' },
        { status: 400 }
      )
    }
    
    const appDir = path.join(process.cwd(), 'app', appId)
    
    // セキュリティチェック: 安全なアプリIDのみ削除可能
    if (!/^app\d+$/.test(appId) && !appId.includes('-app')) {
      return NextResponse.json(
        { error: 'Invalid app ID format' },
        { status: 400 }
      )
    }
    
    await fs.rm(appDir, { recursive: true, force: true })
    
    console.log(`🗑️ Deleted app: ${appId}`)
    
    return NextResponse.json({
      success: true,
      message: `App ${appId} deleted successfully`
    })
    
  } catch (error: any) {
    console.error('❌ Error deleting app:', error)
    return NextResponse.json(
      { 
        error: 'アプリの削除に失敗しました',
        details: error.message
      },
      { status: 500 }
    )
  }
}