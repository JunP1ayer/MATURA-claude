import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface GeneratedApp {
  id: string
  appType: string
  timestamp: string
  path: string
  url: string
}

export async function GET(request: NextRequest) {
  try {
    // 実際のファイルシステムから生成されたアプリの情報を読み取る
    const appDirectory = path.join(process.cwd(), 'app', 'generated')
    const generatedApps = await scanGeneratedApps(appDirectory)

    return NextResponse.json({
      success: true,
      apps: generatedApps
    })
  } catch (error) {
    console.error('Generated apps fetch error:', error)
    return NextResponse.json(
      { error: 'アプリ一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// ファイルシステムから生成されたアプリを検索する関数
async function scanGeneratedApps(directory: string): Promise<GeneratedApp[]> {
  const apps: GeneratedApp[] = []
  
  try {
    // スロット1-10をチェック
    for (let i = 1; i <= 10; i++) {
      const slotName = `app${i}`
      const appPath = path.join(process.cwd(), 'app', slotName)
      const pagePath = path.join(appPath, 'page.tsx')
      
      try {
        // Check if page.tsx exists
        await fs.access(pagePath)
        
        let appType = 'Generated App'
        let timestamp = new Date().toISOString()
        let description = ''
        
        // Try to read metadata
        const metadataPath = path.join(appPath, 'metadata.json')
        try {
          const metadataContent = await fs.readFile(metadataPath, 'utf-8')
          const metadata = JSON.parse(metadataContent)
          appType = metadata.appType || 'Generated App'
          timestamp = metadata.timestamp || new Date().toISOString()
          description = metadata.description || ''
        } catch (metadataError) {
          // Use file modification time as fallback
          const stats = await fs.stat(pagePath)
          timestamp = stats.mtime.toISOString()
        }
        
        apps.push({
          id: slotName,
          appType: appType,
          timestamp: timestamp,
          path: `/${slotName}`,
          url: `/generated-app?id=${slotName}`
        })
      } catch {
        // page.tsx doesn't exist in this slot, skip
        continue
      }
    }
    
    // 既存のgeneratedディレクトリもチェック（後方互換性のため）
    const legacyPath = path.join(process.cwd(), 'app', 'generated-app', 'page.tsx')
    try {
      await fs.access(legacyPath)
      apps.push({
        id: 'generated-app',
        appType: 'レガシーアプリ',
        timestamp: new Date().toISOString(),
        path: '/generated-app',
        url: '/generated-app'
      })
    } catch {
      // generated-app doesn't exist
    }
    
  } catch (error) {
    console.error('Error scanning generated apps:', error)
  }
  
  // Sort by timestamp (newest first)
  apps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
  return apps
}