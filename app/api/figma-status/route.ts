import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const figmaApiKey = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
    const defaultFileId = process.env.DEFAULT_FIGMA_FILE_ID;
    
    const status: any = {
      hasApiKey: !!figmaApiKey,
      hasDefaultFileId: !!defaultFileId,
      apiKeyLength: figmaApiKey ? figmaApiKey.length : 0,
      isConfigured: !!(figmaApiKey && defaultFileId),
      timestamp: new Date().toISOString()
    };
    
    // Test API connection if key is available
    if (figmaApiKey && defaultFileId) {
      try {
        const response = await fetch(`https://api.figma.com/v1/files/${defaultFileId}`, {
          headers: {
            'X-Figma-Token': figmaApiKey,
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        status.connectionTest = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText
        };
        
        if (response.ok) {
          const data = await response.json();
          status.fileInfo = {
            name: data.name,
            lastModified: data.lastModified,
            version: data.version
          };
        }
      } catch (error) {
        status.connectionTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Connection failed'
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      figmaStatus: status
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Figmaステータス確認中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}