import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Testing OpenAI API connection...');
    
    const openaiKey = process.env.OPENAI_API_KEY;
    console.log('OpenAI API Key exists:', !!openaiKey);
    console.log('OpenAI API Key length:', openaiKey?.length || 0);
    console.log('OpenAI API Key prefix:', openaiKey?.substring(0, 15));
    console.log('OpenAI API Key suffix:', openaiKey?.substring(-15));
    
    if (!openaiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY not found'
      });
    }

    // Test OpenAI models endpoint
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('OpenAI API Status:', response.status);
    console.log('OpenAI API Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('OpenAI API Error Response:', errorText);
      
      return NextResponse.json({
        success: false,
        status: response.status,
        error: errorText,
        keyInfo: {
          exists: !!openaiKey,
          length: openaiKey?.length || 0,
          prefix: openaiKey?.substring(0, 15),
          suffix: openaiKey?.substring(-15)
        }
      });
    }

    const data = await response.json();
    console.log('OpenAI Models available:', data.data?.length || 0);

    return NextResponse.json({
      success: true,
      status: response.status,
      modelsCount: data.data?.length || 0,
      keyInfo: {
        exists: !!openaiKey,
        length: openaiKey?.length || 0,
        prefix: openaiKey?.substring(0, 15),
        suffix: openaiKey?.substring(-15)
      }
    });

  } catch (error) {
    console.error('OpenAI Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}