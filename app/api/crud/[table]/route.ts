import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { setTableSchema, getTableSchema } from '@/lib/tableSchema';
import { 
  getTableData, 
  setTableData, 
  initializeTable, 
  addTableItem, 
  updateTableItem, 
  removeTableItem 
} from '@/lib/virtualDataStore';

export async function GET(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // テーブルのデータを取得
    const tableData = getTableData(table);

    if (id) {
      const item = tableData.find(item => item.id === id);
      if (!item) {
        return NextResponse.json({ error: 'データが見つかりません' }, { status: 404 });
      }
      return NextResponse.json({ data: item });
    } else {
      // created_at で降順ソート
      const sortedData = tableData.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      return NextResponse.json({ data: sortedData });
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params;
    const body = await req.json();

    // テーブルが存在しない場合は初期化
    initializeTable(table);

    const newItem = {
      id: uuidv4(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addTableItem(table, newItem);

    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'データの作成に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'IDが必要です' }, { status: 400 });
    }

    const tableData = getTableData(table);
    const itemIndex = tableData.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'データが見つかりません' }, { status: 404 });
    }

    const updatedItem = {
      ...tableData[itemIndex],
      ...body,
      updated_at: new Date().toISOString()
    };

    // id, created_atは更新しない
    delete updatedItem.id;
    updatedItem.id = id;
    updatedItem.created_at = tableData[itemIndex].created_at;

    updateTableItem(table, itemIndex, updatedItem);

    return NextResponse.json({ data: updatedItem });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'データの更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const { table } = params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'IDが必要です' }, { status: 400 });
    }

    const tableData = getTableData(table);
    const itemIndex = tableData.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'データが見つかりません' }, { status: 404 });
    }

    removeTableItem(table, itemIndex);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'データの削除に失敗しました' },
      { status: 500 }
    );
  }
}

