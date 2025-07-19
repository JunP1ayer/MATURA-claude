import { NextRequest, NextResponse } from 'next/server';
import { 
  setTableSchema, 
  getTableSchema, 
  deleteTableSchema, 
  hasTableSchema,
  getAllTableSchemas
} from '@/lib/tableSchema';

/**
 * GET /api/schema/[table] - Get schema for a specific table
 * GET /api/schema/[table]?all=true - Get all table schemas
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params;
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    if (all && table === 'all') {
      // Return all schemas
      const schemas = getAllTableSchemas();
      return NextResponse.json({ schemas });
    }

    // Get specific table schema
    const schema = getTableSchema(table);
    
    if (!schema) {
      return NextResponse.json(
        { error: 'スキーマが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ schema });
  } catch (error) {
    console.error('GET schema error:', error);
    return NextResponse.json(
      { error: 'スキーマの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/schema/[table] - Create or update schema for a table
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params;
    const schema = await req.json();

    if (!schema || typeof schema !== 'object') {
      return NextResponse.json(
        { error: '有効なスキーマを提供してください' },
        { status: 400 }
      );
    }

    setTableSchema(table, schema);

    return NextResponse.json(
      { 
        message: 'スキーマが設定されました',
        table,
        schema
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST schema error:', error);
    return NextResponse.json(
      { error: 'スキーマの設定に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/schema/[table] - Delete schema for a table
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params;

    if (!hasTableSchema(table)) {
      return NextResponse.json(
        { error: 'スキーマが見つかりません' },
        { status: 404 }
      );
    }

    deleteTableSchema(table);

    return NextResponse.json({
      message: 'スキーマが削除されました',
      table
    });
  } catch (error) {
    console.error('DELETE schema error:', error);
    return NextResponse.json(
      { error: 'スキーマの削除に失敗しました' },
      { status: 500 }
    );
  }
}