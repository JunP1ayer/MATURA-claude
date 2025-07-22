import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 動的生成アプリAPIエンドポイント
 * 生成されたアプリのデータとメタデータを提供
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appId = params.id
    console.log(`📱 Fetching app data for: ${appId}`)
    
    // アプリディレクトリの確認
    const appDir = path.join(process.cwd(), 'app', appId)
    const pageFilePath = path.join(appDir, 'page.tsx')
    const metadataFilePath = path.join(appDir, 'metadata.json')
    
    // ファイルの存在確認
    try {
      await fs.access(pageFilePath)
      await fs.access(metadataFilePath)
    } catch {
      console.error(`❌ App files not found for: ${appId}`)
      return NextResponse.json(
        { error: 'アプリが見つかりません', appId },
        { status: 404 }
      )
    }
    
    // ファイル内容の読み込み
    const [pageContent, metadataContent] = await Promise.all([
      fs.readFile(pageFilePath, 'utf-8'),
      fs.readFile(metadataFilePath, 'utf-8')
    ])
    
    const metadata = JSON.parse(metadataContent)
    
    console.log(`✅ Successfully loaded app: ${appId} (${metadata.appType})`)
    
    return NextResponse.json({
      success: true,
      appId,
      metadata,
      pageContent,
      url: `/apps/${appId}`,
      directUrl: `/api/apps/${appId}/render`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error(`❌ Error fetching app ${params.id}:`, error)
    return NextResponse.json(
      { 
        error: 'アプリの取得に失敗しました',
        details: error.message,
        appId: params.id
      },
      { status: 500 }
    )
  }
}