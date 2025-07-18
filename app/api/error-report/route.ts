import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const errorReport = await request.json();
    
    // Vercelのログに出力
    console.error('🚨 Client Error Report:', {
      timestamp: new Date().toISOString(),
      ...errorReport,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process error report:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}