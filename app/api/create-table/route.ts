import { NextRequest, NextResponse } from 'next/server';
import { AuthHelpers } from '@/lib/auth';
import { createGeneratedApp, generateAppName } from '@/lib/supabase-apps';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue?: string;
}

interface Schema {
  tableName: string;
  columns: Column[];
}

export async function POST(req: NextRequest) {
  try {
    // 認証チェック（オプショナル）
    const user = await AuthHelpers.validateSession(req);
    const userId = user?.id;

    const { schema, user_idea, generated_code }: { 
      schema: Schema; 
      user_idea: string; 
      generated_code: string; 
    } = await req.json();

    if (!schema || !schema.tableName || !schema.columns) {
      return NextResponse.json({ error: '無効なスキーマです' }, { status: 400 });
    }

    if (!user_idea || !generated_code) {
      return NextResponse.json({ error: 'ユーザーアイデアと生成コードが必要です' }, { status: 400 });
    }

    // アプリ名を生成
    const appName = generateAppName(user_idea);

    // generated_appsテーブルに保存
    const savedApp = await createGeneratedApp({
      name: appName,
      description: `Generated from: ${user_idea.substring(0, 100)}...`,
      user_idea,
      schema,
      generated_code
    }, userId);

    return NextResponse.json({
      success: true,
      app: savedApp,
      message: 'アプリが正常に保存されました'
    });

  } catch (error) {
    console.error('App creation error:', error);
    return NextResponse.json(
      { error: 'アプリ作成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}