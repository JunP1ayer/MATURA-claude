import { NextRequest, NextResponse } from 'next/server';
import { geminiClient } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const { userInput, schema, designPattern, enhancementType } = await request.json();

    if (!userInput?.trim()) {
      return NextResponse.json(
        { error: 'ユーザー入力が必要です' },
        { status: 400 }
      );
    }

    console.log('🚀 Starting Gemini enhancement process...');
    console.log('📝 User input:', userInput);
    console.log('🎯 Enhancement type:', enhancementType);

    let result;

    switch (enhancementType) {
      case 'code_generation':
        console.log('⚡ Generating high-quality code with Gemini...');
        result = await geminiClient.generateHighQualityCode(
          userInput,
          schema,
          designPattern
        );
        break;

      case 'design_analysis':
        console.log('🎨 Analyzing design requirements with Gemini...');
        result = await geminiClient.analyzeDesignRequirements(userInput);
        break;

      case 'schema_inference':
        console.log('📊 Inferring database schema with Gemini...');
        result = await geminiClient.inferDatabaseSchema(userInput);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid enhancement type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      console.error('❌ Gemini enhancement failed:', result.error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Gemini API処理中にエラーが発生しました',
          details: result.error
        },
        { status: 500 }
      );
    }

    console.log('✅ Gemini enhancement completed successfully');

    // Parse JSON responses for structured data
    let enhancedData = result.data;
    if (enhancementType === 'design_analysis' || enhancementType === 'schema_inference') {
      try {
        enhancedData = JSON.parse(result.data || '{}');
      } catch (parseError) {
        console.warn('⚠️ Failed to parse Gemini JSON response, using raw text');
      }
    }

    return NextResponse.json({
      success: true,
      enhancementType,
      data: enhancedData,
      metadata: {
        processingTime: Date.now(),
        apiProvider: 'gemini',
        usage: result.usage,
        version: '1.0'
      }
    });

  } catch (error) {
    console.error('💥 Gemini enhancement error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Gemini enhancement中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    
    return NextResponse.json({
      status: 'healthy',
      service: 'gemini-enhance',
      version: '1.0',
      apiConfigured: hasApiKey,
      capabilities: [
        'high-quality-code-generation',
        'design-requirement-analysis',
        'database-schema-inference',
        'enhanced-ui-customization'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 500 }
    );
  }
}