import { NextRequest, NextResponse } from 'next/server';
import { AuthHelpers } from '@/lib/auth';
import { getAllGeneratedApps, getGeneratedApp, createGeneratedApp } from '@/lib/supabase-apps';

export async function GET(req: NextRequest) {
  try {
    // 認証チェック（オプショナル）
    const user = await AuthHelpers.validateSession(req);
    const userId = user?.id;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');

    if (id) {
      // 特定のアプリを取得
      const app = await getGeneratedApp(id);
      if (!app) {
        return NextResponse.json({ error: 'アプリが見つかりません' }, { status: 404 });
      }
      return NextResponse.json(app);
    } else {
      // 全アプリを取得（ユーザー認証されている場合は、そのユーザーのアプリのみ）
      const limitNum = limit ? parseInt(limit) : 50;
      const apps = await getAllGeneratedApps(limitNum, userId);
      return NextResponse.json(apps);
    }

  } catch (error) {
    console.error('GET /api/crud/generated_apps error:', error);
    return NextResponse.json(
      { error: 'データ取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 認証チェック（オプショナル）
    const user = await AuthHelpers.validateSession(req);
    const userId = user?.id;

    const body = await req.json();
    const { name, description, user_idea, schema, generated_code } = body;

    if (!name || !user_idea || !schema || !generated_code) {
      return NextResponse.json(
        { error: '必須フィールドが不足しています' },
        { status: 400 }
      );
    }

    const newApp = await createGeneratedApp({
      name,
      description,
      user_idea,
      schema,
      generated_code
    }, userId);

    return NextResponse.json(newApp, { status: 201 });

  } catch (error) {
    console.error('POST /api/crud/generated_apps error:', error);
    return NextResponse.json(
      { error: 'アプリ作成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'IDが必要です' },
        { status: 400 }
      );
    }

    // 現在は更新機能は未実装（必要に応じて実装）
    return NextResponse.json(
      { error: '更新機能は未実装です' },
      { status: 501 }
    );

  } catch (error) {
    console.error('PUT /api/crud/generated_apps error:', error);
    return NextResponse.json(
      { error: '更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'IDが必要です' },
        { status: 400 }
      );
    }

    // 現在は削除機能は未実装（必要に応じて実装）
    return NextResponse.json(
      { error: '削除機能は未実装です' },
      { status: 501 }
    );

  } catch (error) {
    console.error('DELETE /api/crud/generated_apps error:', error);
    return NextResponse.json(
      { error: '削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
}