import { NextRequest, NextResponse } from 'next/server';
import { AuthHelpers } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  includeHeaders: boolean;
  dateFormat: 'iso' | 'locale' | 'timestamp';
  selectedColumns: string[];
  filters?: {
    dateRange?: {
      start: string;
      end: string;
    };
    conditions?: Array<{
      column: string;
      operator: string;
      value: string;
    }>;
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    // 認証チェック（オプショナル）
    const user = await AuthHelpers.validateSession(req);
    const {tableName} = params;
    
    if (!tableName) {
      return NextResponse.json(
        { error: 'テーブル名が必要です' },
        { status: 400 }
      );
    }

    const exportOptions: ExportOptions = await req.json();
    
    if (!exportOptions.selectedColumns || exportOptions.selectedColumns.length === 0) {
      return NextResponse.json(
        { error: 'エクスポートするカラムを選択してください' },
        { status: 400 }
      );
    }

    // データを取得
    const data = await fetchTableData(tableName, exportOptions);
    
    // 指定された形式でエクスポート
    const exportedData = await generateExportData(data, exportOptions);
    
    const headers = getExportHeaders(exportOptions.format, tableName);
    
    return new NextResponse(exportedData, {
      headers,
      status: 200
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'エクスポート中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

async function fetchTableData(tableName: string, options: ExportOptions): Promise<any[]> {
  let query = supabase
    .from(tableName)
    .select(options.selectedColumns.join(','));

  // フィルターの適用
  if (options.filters?.dateRange) {
    query = query
      .gte('created_at', options.filters.dateRange.start)
      .lte('created_at', options.filters.dateRange.end);
  }

  if (options.filters?.conditions) {
    options.filters.conditions.forEach(condition => {
      switch (condition.operator) {
        case 'equals':
          query = query.eq(condition.column, condition.value);
          break;
        case 'contains':
          query = query.ilike(condition.column, `%${condition.value}%`);
          break;
        case 'greater_than':
          query = query.gt(condition.column, condition.value);
          break;
        case 'less_than':
          query = query.lt(condition.column, condition.value);
          break;
      }
    });
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(`データの取得に失敗しました: ${error.message}`);
  }
  
  return data || [];
}

async function generateExportData(data: any[], options: ExportOptions): Promise<string | Buffer> {
  const processedData = data.map(row => {
    const processedRow: any = {};
    
    options.selectedColumns.forEach(column => {
      let value = row[column];
      
      // 日付の形式変換
      if (value && typeof value === 'string' && isValidDate(value)) {
        const date = new Date(value);
        
        switch (options.dateFormat) {
          case 'iso':
            value = date.toISOString();
            break;
          case 'locale':
            value = `${date.toLocaleDateString('ja-JP')  } ${  date.toLocaleTimeString('ja-JP')}`;
            break;
          case 'timestamp':
            value = date.getTime().toString();
            break;
        }
      }
      
      processedRow[column] = value;
    });
    
    return processedRow;
  });

  switch (options.format) {
    case 'csv':
      return generateCSV(processedData, options);
    case 'json':
      return generateJSON(processedData, options);
    case 'excel':
      return generateExcel(processedData, options);
    default:
      throw new Error('サポートされていない形式です');
  }
}

function generateCSV(data: any[], options: ExportOptions): string {
  const lines: string[] = [];
  
  // ヘッダー行
  if (options.includeHeaders) {
    lines.push(options.selectedColumns.join(','));
  }
  
  // データ行
  data.forEach(row => {
    const values = options.selectedColumns.map(column => {
      const value = row[column];
      
      if (value === null || value === undefined) {
        return '';
      }
      
      // CSVエスケープ
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    });
    
    lines.push(values.join(','));
  });
  
  return lines.join('\n');
}

function generateJSON(data: any[], options: ExportOptions): string {
  const jsonData = {
    exportedAt: new Date().toISOString(),
    totalRows: data.length,
    columns: options.selectedColumns,
    data
  };
  
  return JSON.stringify(jsonData, null, 2);
}

function generateExcel(data: any[], options: ExportOptions): Buffer {
  // 簡単な実装 - 実際にはexcel4nodeやsheetjsを使用
  // ここではCSV形式をBase64でエンコードして返す
  const csvData = generateCSV(data, options);
  return Buffer.from(csvData, 'utf-8');
}

function getExportHeaders(format: string, tableName: string): Record<string, string> {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${tableName}_${timestamp}`;
  
  switch (format) {
    case 'csv':
      return {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
        'Cache-Control': 'no-cache'
      };
    case 'json':
      return {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.json"`,
        'Cache-Control': 'no-cache'
      };
    case 'excel':
      return {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
        'Cache-Control': 'no-cache'
      };
    default:
      return {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      };
  }
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// テーブルデータの統計情報を取得
export async function GET(
  req: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    const {tableName} = params;
    
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw new Error(`データの取得に失敗しました: ${error.message}`);
    }
    
    return NextResponse.json({
      tableName,
      totalRows: count || 0,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'テーブル統計の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}