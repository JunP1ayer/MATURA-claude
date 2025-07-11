import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const apiKey = process.env.FIGMA_API_KEY
  const fileId = request.nextUrl.searchParams.get('fileId') || process.env.DEFAULT_FIGMA_FILE_ID
  
  if (!apiKey || apiKey.includes('your-')) {
    return NextResponse.json({ 
      error: 'APIキーが設定されていません',
      hint: '.env.local に FIGMA_API_KEY を設定してください'
    }, { status: 500 })
  }

  // テスト1: APIキーの検証（ユーザー情報は不要なのでスキップ）
  
  // テスト2: ファイルアクセス
  try {
    const fileResponse = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
      headers: {
        'X-Figma-Token': apiKey
      }
    })
    
    const fileData = await fileResponse.json()
    
    if (!fileResponse.ok) {
      return NextResponse.json({
        test: 'file_access',
        status: fileResponse.status,
        error: fileData.err || 'Unknown error',
        fileId,
        suggestions: [
          '1. APIキーが正しいか確認',
          '2. ファイルIDが正しいか確認', 
          '3. ファイルが共有設定になっているか確認',
          '4. Figmaで: Share > Anyone with the link > Can view',
          '5. または別のパブリックファイルIDを試す'
        ]
      }, { status: fileResponse.status })
    }
    
    // 成功！
    return NextResponse.json({
      success: true,
      file: {
        name: fileData.name,
        lastModified: fileData.lastModified,
        version: fileData.version,
        role: fileData.role
      },
      components: Object.keys(fileData.components || {}).length,
      pages: fileData.document?.children?.length || 0,
      apiKeyValid: true,
      fileAccessible: true
    })
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'APIリクエストエラー',
      details: error.message,
      fileId
    }, { status: 500 })
  }
}