import { NextRequest, NextResponse } from 'next/server'
import { handleSelfExpansionRequest } from '@/lib/ai-self-expansion'
import { SecurityMiddleware, AuditLogger } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // セキュリティチェック
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!SecurityMiddleware.checkRateLimit(ip, 10, 60000)) { // 1分間に10回まで
      return NextResponse.json(
        { error: 'レート制限に達しました。しばらく待ってから再試行してください。' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // 入力値のサニタイゼーション
    const sanitizedBody = SecurityMiddleware.sanitizeInput(body)
    
    console.log('🤖 AI Self-Expansion Request:', {
      appId: sanitizedBody.appId,
      requestLength: sanitizedBody.userRequest?.length,
      timestamp: new Date().toISOString()
    })

    // 自己拡張の実行
    const result = await handleSelfExpansionRequest(sanitizedBody)
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.executionReport,
        analysis: result.analysis
      }, { status: 400 })
    }

    // 成功した場合、実際にファイルを更新
    if (result.modifications.length > 0) {
      await applyCodeModifications(sanitizedBody.appId, result.modifications)
    }

    if (result.uiImprovements.length > 0) {
      await applyUIImprovements(sanitizedBody.appId, result.uiImprovements)
    }

    // 監査ログの記録
    await AuditLogger.log('ai_expansion', 'system', {
      appId: sanitizedBody.appId,
      modifications: result.modifications.length,
      uiImprovements: result.uiImprovements.length,
      processingTime: Date.now() - startTime
    })

    console.log('✅ AI Self-Expansion Completed:', {
      appId: sanitizedBody.appId,
      modifications: result.modifications.length,
      uiImprovements: result.uiImprovements.length,
      processingTime: Date.now() - startTime
    })

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      modifications: result.modifications.length,
      uiImprovements: result.uiImprovements.length,
      executionReport: result.executionReport,
      processingTime: Date.now() - startTime
    })

  } catch (error: any) {
    console.error('❌ AI Self-Expansion Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'AI拡張機能の実行中にエラーが発生しました。',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

// コード変更の適用
async function applyCodeModifications(appId: string, modifications: any[]) {
  const appDir = path.join(process.cwd(), 'app', appId)
  
  for (const mod of modifications) {
    try {
      if (mod.type === 'create' || mod.type === 'modify') {
        const filePath = path.join(appDir, mod.file)
        const dirPath = path.dirname(filePath)
        
        // ディレクトリが存在しない場合は作成
        await fs.mkdir(dirPath, { recursive: true })
        
        // ファイルに書き込み
        await fs.writeFile(filePath, mod.code || '', 'utf-8')
        
        console.log(`📝 Applied modification: ${mod.file}`)
      } else if (mod.type === 'delete') {
        const filePath = path.join(appDir, mod.file)
        
        try {
          await fs.unlink(filePath)
          console.log(`🗑️ Deleted file: ${mod.file}`)
        } catch (error) {
          // ファイルが存在しない場合は無視
          console.log(`⚠️ File not found for deletion: ${mod.file}`)
        }
      }
    } catch (error) {
      console.error(`❌ Failed to apply modification for ${mod.file}:`, error)
    }
  }
}

// UI改善の適用
async function applyUIImprovements(appId: string, improvements: any[]) {
  const appDir = path.join(process.cwd(), 'app', appId)
  
  for (const improvement of improvements) {
    try {
      // UI改善は既存のpage.tsxファイルを更新
      const pageFile = path.join(appDir, 'page.tsx')
      
      // 既存のファイルを読み取り
      let existingCode = ''
      try {
        existingCode = await fs.readFile(pageFile, 'utf-8')
      } catch (error) {
        console.log(`⚠️ Original page.tsx not found for ${appId}, creating new one`)
      }

      // 改善されたコードを追加または置換
      let improvedCode = existingCode
      
      if (improvement.code) {
        // 簡単な統合ロジック（本番環境ではより洗練された方法を使用）
        if (improvement.description.includes('コンポーネント追加')) {
          improvedCode = `${existingCode}\n\n// AI Generated Improvement\n${improvement.code}`
        } else if (improvement.description.includes('スタイル改善')) {
          // Tailwindクラスの更新など
          improvedCode = improvement.code
        } else {
          // デフォルトでは既存コードの末尾に追加
          improvedCode = `${existingCode}\n\n// UI Improvement\n${improvement.code}`
        }
      }

      await fs.writeFile(pageFile, improvedCode, 'utf-8')
      console.log(`🎨 Applied UI improvement: ${improvement.description.substring(0, 50)}...`)
      
    } catch (error) {
      console.error(`❌ Failed to apply UI improvement:`, error)
    }
  }
}

// メタデータの更新
// TODO: This function is currently not used but might be needed for tracking AI expansions
// Remove the underscore prefix when implementing metadata tracking
async function _updateAppMetadata(appId: string, changes: any) {
  try {
    const metadataPath = path.join(process.cwd(), 'app', appId, 'metadata.json')
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'))
    
    // AIによる拡張記録を追加
    metadata.aiExpansions = metadata.aiExpansions || []
    metadata.aiExpansions.push({
      timestamp: new Date().toISOString(),
      changes: changes.modifications || 0,
      improvements: changes.uiImprovements || 0,
      lastExpansionId: Date.now().toString()
    })
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')
    console.log(`📊 Updated metadata for ${appId}`)
  } catch (error) {
    console.error(`❌ Failed to update metadata for ${appId}:`, error)
  }
}