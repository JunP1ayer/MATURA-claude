import { NextResponse } from 'next/server';
import { intelligentFigmaSelector } from '@/lib/intelligent-figma-selector';
import { dynamicCustomizationEngine } from '@/lib/dynamic-customization-engine';

export async function POST(request: Request) {
  try {
    const { userInput, generateSchema = true, customizationOptions } = await request.json();

    if (!userInput?.trim()) {
      return NextResponse.json(
        { error: 'ユーザー入力が必要です' },
        { status: 400 }
      );
    }

    console.log('🚀 Starting intelligent generation process...');
    console.log('📝 User input:', userInput);

    // Step 1: Intelligent template selection and customization
    console.log('🎯 Selecting optimal template...');
    const intelligentSelection = await intelligentFigmaSelector.selectOptimalTemplate(
      userInput,
      customizationOptions || {
        adaptColors: true,
        adaptLayout: true,
        adaptComplexity: true,
        adaptComponents: true
      }
    );

    console.log('✅ Template selected:', intelligentSelection.selectedPattern.name);
    console.log('🎨 Design reasoning:', intelligentSelection.designReasoning);

    let schema = null;
    let customizationResult = null;

    // Step 2: Generate schema if requested
    if (generateSchema) {
      console.log('📊 Generating schema...');
      try {
        const schemaResponse = await fetch(`${request.url.replace('/intelligent-generate', '/infer-schema')}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput }),
        });

        if (schemaResponse.ok) {
          const schemaResult = await schemaResponse.json();
          schema = schemaResult.schema;
          console.log('✅ Schema generated:', schema.tableName);

          // Step 3: Generate customized UI
          console.log('🎨 Generating customized UI...');
          customizationResult = await dynamicCustomizationEngine.generateCustomizedUI(
            intelligentSelection,
            schema,
            userInput
          );
          console.log('✅ UI customization completed');
        } else {
          console.warn('⚠️ Schema generation failed, proceeding without schema');
        }
      } catch (schemaError) {
        console.warn('⚠️ Schema generation error:', schemaError);
      }
    }

    // Step 4: Prepare response
    const response = {
      success: true,
      data: {
        // Core intelligent selection data
        intelligentSelection: {
          selectedPattern: intelligentSelection.selectedPattern,
          customizedPattern: intelligentSelection.customizedPattern,
          designReasoning: intelligentSelection.designReasoning,
          confidenceScore: intelligentSelection.confidenceScore,
          alternatives: intelligentSelection.alternatives
        },
        
        // Analysis insights
        analysis: {
          structuredData: intelligentSelection.structuredData,
          designContext: intelligentSelection.designContext,
          colorPersonality: intelligentSelection.colorPersonality
        },
        
        // Generated code and customization
        generation: customizationResult ? {
          generatedCode: customizationResult.generatedCode,
          customStyles: customizationResult.customStyles,
          componentVariations: customizationResult.componentVariations,
          personalizedElements: customizationResult.personalizedElements,
          designExplanation: customizationResult.designExplanation,
          performanceOptimizations: customizationResult.performanceOptimizations
        } : null,
        
        // Schema data
        schema,
        
        // Meta information
        meta: {
          processingTime: Date.now(),
          version: '2.0',
          intelligentMode: true,
          hasSchema: !!schema,
          hasCustomUI: !!customizationResult,
          figmaUsed: !!(intelligentSelection.customizedPattern as any).figmaDesign
        }
      }
    };

    console.log('🎉 Intelligent generation completed successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Intelligent generation error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'インテリジェント生成中にエラーが発生しました',
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
    return NextResponse.json({
      status: 'healthy',
      service: 'intelligent-generate',
      version: '2.0',
      capabilities: [
        'intelligent-template-selection',
        'dynamic-customization',
        'figma-integration',
        'schema-generation',
        'ui-personalization'
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