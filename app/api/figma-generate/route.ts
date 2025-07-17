import { NextResponse } from 'next/server';
import { figmaExtractor, FigmaDesignExtractor } from '@/lib/figma-api';
import { generateOptimizedUI, selectOptimalDesignPattern } from '@/lib/smart-ui-selector';

export async function POST(request: Request) {
  try {
    const { figmaUrl, userRequirement, appType = 'webapp', generateType = 'full' } = await request.json();

    if (!userRequirement) {
      return NextResponse.json(
        { error: 'ユーザー要求が必要です' },
        { status: 400 }
      );
    }

    let uiPattern;
    let generatedCode = '';
    
    try {
      // Figma URLが提供されている場合はFigmaから取得
      if (figmaUrl) {
        console.log('Figma URLからデザインを取得中:', figmaUrl);
        
        const figmaDesign = await figmaExtractor.fetchDesignFromUrl(figmaUrl);
        
        if (figmaDesign) {
          // FigmaデザインをUIパターンに変換
          uiPattern = figmaExtractor.convertToUIPattern(figmaDesign);
          console.log('Figmaデザインパターンが生成されました:', uiPattern.name);
        } else {
          // Figma APIが利用できない場合はデフォルトパターンを使用
          console.log('Figma APIが利用できません。デフォルトパターンを使用します。');
          uiPattern = figmaExtractor.getDefaultPattern(userRequirement);
        }
      } else {
        // FigmaURLが提供されていない場合はスマートセレクターを使用
        console.log('スマートパターンセレクションを使用');
        uiPattern = selectOptimalDesignPattern(userRequirement);
      }

      // 生成タイプに応じてコードを生成
      if (generateType === 'full') {
        // フルアプリケーション生成の場合はスキーマも推論する必要がある
        const schemaResponse = await fetch(`${request.url.replace('/figma-generate', '/infer-schema')}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput: userRequirement }),
        });

        if (schemaResponse.ok) {
          const schemaResult = await schemaResponse.json();
          // Pass figmaDesign to the UI generator if available
          const figmaDesignData = figmaDesign || null;
          generatedCode = generateOptimizedUI(uiPattern, userRequirement, schemaResult.schema, figmaDesignData);
        } else {
          throw new Error('スキーマ生成に失敗しました');
        }
      }

      const response = {
        success: true,
        data: {
          pattern: uiPattern,
          generatedCode: generateType === 'full' ? generatedCode : null,
          figmaUsed: !!figmaUrl,
          designInfo: {
            name: uiPattern.name,
            category: uiPattern.category,
            complexity: uiPattern.complexity,
            layout: uiPattern.layout,
            mvpScore: uiPattern.mvpScore,
            components: uiPattern.components,
            colors: uiPattern.colors,
          },
        },
      };

      return NextResponse.json(response);
    } catch (figmaError) {
      console.error('Figma処理エラー:', figmaError);
      
      // Figmaエラーの場合はフォールバックを試行
      console.log('フォールバックパターンを使用');
      uiPattern = selectOptimalDesignPattern(userRequirement);
      
      const response = {
        success: true,
        data: {
          pattern: uiPattern,
          generatedCode: null,
          figmaUsed: false,
          fallbackUsed: true,
          warning: 'Figmaデザインの取得に失敗したため、デフォルトパターンを使用しました',
          designInfo: {
            name: uiPattern.name,
            category: uiPattern.category,
            complexity: uiPattern.complexity,
            layout: uiPattern.layout,
            mvpScore: uiPattern.mvpScore,
            components: uiPattern.components,
            colors: uiPattern.colors,
          },
        },
      };

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Figma生成API エラー:', error);
    
    return NextResponse.json(
      { 
        error: 'Figma生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}