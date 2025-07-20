import { NextRequest, NextResponse } from 'next/server'
import { createGeneratedApp, getAllGeneratedApps, supabaseAdmin } from '@/lib/supabase-apps'

/**
 * 生成されたアプリの一覧を提供するAPI
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📱 Fetching apps list from Supabase...')
    
    const apps = await getAllGeneratedApps(50)
    
    const formattedApps = apps.map(app => ({
      id: app.id,
      appType: app.name,
      description: app.description || '',
      timestamp: app.created_at,
      features: [],
      url: `/apps/${app.id}`,
      directUrl: `/preview/${app.id}`
    }))
    
    console.log(`✅ Successfully loaded ${apps.length} apps`)
    
    return NextResponse.json({
      success: true,
      count: apps.length,
      apps: formattedApps,
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
 * 新しいアプリを保存する
 */
export async function POST(request: NextRequest) {
  try {
    console.log('💾 Saving new app to Supabase...')
    
    const body = await request.json()
    const { name, description, user_idea, schema, generated_code, status } = body
    
    if (!name || !generated_code || !user_idea) {
      return NextResponse.json(
        { error: 'Name, generated_code, and user_idea are required' },
        { status: 400 }
      )
    }
    
    // Supabaseに保存
    const savedApp = await createGeneratedApp({
      name,
      description: description || '',
      user_idea,
      schema: schema || {},
      generated_code
    })
    
    console.log(`✅ App saved successfully: ${savedApp.id}`)
    
    const responseApp = {
      id: savedApp.id,
      name: savedApp.name,
      description: savedApp.description,
      url: `/apps/${savedApp.id}`,
      previewUrl: `/preview/${savedApp.id}`,
      timestamp: savedApp.created_at
    }
    
    return NextResponse.json({
      success: true,
      app: responseApp,
      message: 'App saved successfully'
    })
    
  } catch (error: any) {
    console.error('❌ Error saving app:', error)
    return NextResponse.json(
      { 
        error: 'アプリの保存に失敗しました',
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
    
    // Supabaseから削除（status を archived に変更）
    const { error } = await supabaseAdmin
      .from('generated_apps')
      .update({ status: 'archived' })
      .eq('id', appId)
    
    if (error) {
      throw error
    }
    
    console.log(`🗑️ Archived app: ${appId}`)
    
    return NextResponse.json({
      success: true,
      message: `App ${appId} archived successfully`
    })
    
  } catch (error: any) {
    console.error('❌ Error archiving app:', error)
    return NextResponse.json(
      { 
        error: 'アプリのアーカイブに失敗しました',
        details: error.message
      },
      { status: 500 }
    )
  }
}