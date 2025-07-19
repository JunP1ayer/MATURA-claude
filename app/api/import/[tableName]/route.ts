import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AuthHelpers } from '@/lib/auth';

interface ImportRequest {
  data: any[];
  fileType: string;
  fileName: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    // 認証チェック（オプショナル）
    const user = await AuthHelpers.validateSession(req);
    const tableName = params.tableName;
    
    if (!tableName) {
      return NextResponse.json(
        { error: 'テーブル名が必要です' },
        { status: 400 }
      );
    }

    const body: ImportRequest = await req.json();
    const { data, fileType, fileName } = body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'インポートするデータがありません' },
        { status: 400 }
      );
    }

    // データの検証と前処理
    const processedData = await processImportData(data, fileType);
    
    // データベースに挿入
    const result = await insertImportData(tableName, processedData);

    return NextResponse.json({
      success: true,
      rowsProcessed: result.count,
      columnsDetected: Object.keys(processedData[0] || {}),
      message: `${result.count}件のデータをインポートしました`
    });

  } catch (error) {
    console.error('Import error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'インポート中にエラーが発生しました';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        rowsProcessed: 0,
        columnsDetected: []
      },
      { status: 500 }
    );
  }
}

async function processImportData(data: any[], fileType: string): Promise<any[]> {
  const processedData: any[] = [];
  
  for (const item of data) {
    const processedItem: any = {};
    
    // 各フィールドの型推論と変換
    for (const [key, value] of Object.entries(item)) {
      if (value === null || value === undefined || value === '') {
        processedItem[key] = null;
        continue;
      }
      
      const stringValue = String(value).trim();
      
      // 数値の検出
      if (/^\d+$/.test(stringValue)) {
        processedItem[key] = parseInt(stringValue, 10);
      } else if (/^\d+\.\d+$/.test(stringValue)) {
        processedItem[key] = parseFloat(stringValue);
      }
      // 真偽値の検出
      else if (/^(true|false)$/i.test(stringValue)) {
        processedItem[key] = stringValue.toLowerCase() === 'true';
      }
      // 日付の検出
      else if (isValidDate(stringValue)) {
        processedItem[key] = new Date(stringValue).toISOString();
      }
      // デフォルトは文字列
      else {
        processedItem[key] = stringValue;
      }
    }
    
    // IDが存在しない場合は追加
    if (!processedItem.id) {
      processedItem.id = generateUUID();
    }
    
    // タイムスタンプの追加
    if (!processedItem.created_at) {
      processedItem.created_at = new Date().toISOString();
    }
    
    processedData.push(processedItem);
  }
  
  return processedData;
}

async function insertImportData(tableName: string, data: any[]): Promise<{ count: number }> {
  try {
    // バッチサイズを制限してメモリ使用量を抑制
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const { error, count } = await supabase
        .from(tableName)
        .insert(batch)
        .select('id');
      
      if (error) {
        throw new Error(`データベースエラー: ${error.message}`);
      }
      
      totalInserted += count || 0;
    }
    
    return { count: totalInserted };
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  }
}

function isValidDate(dateString: string): boolean {
  // 日付形式のパターンをチェック
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,                    // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO 8601
    /^\d{2}\/\d{2}\/\d{4}$/,                 // MM/DD/YYYY
    /^\d{4}\/\d{2}\/\d{2}$/,                 // YYYY/MM/DD
  ];
  
  const hasValidPattern = datePatterns.some(pattern => pattern.test(dateString));
  if (!hasValidPattern) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// テーブルのスキーマ情報を取得する関数
export async function GET(
  req: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    const tableName = params.tableName;
    
    // テーブルの存在確認とスキーマ取得
    const { data: schemaData, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', tableName);
    
    if (error) {
      return NextResponse.json(
        { error: 'テーブル情報の取得に失敗しました' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      tableName,
      columns: schemaData || [],
      exists: (schemaData?.length || 0) > 0
    });
    
  } catch (error) {
    console.error('Schema fetch error:', error);
    return NextResponse.json(
      { error: 'テーブル情報の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}