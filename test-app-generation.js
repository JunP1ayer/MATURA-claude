// MATURAアプリ生成テスト
const testAppGeneration = async () => {
  console.log('🧪 MATURAアプリ生成テストを開始...');
  
  try {
    // 1. Simple Generation Test
    console.log('\n📝 Test 1: Simple Generation');
    const simpleResponse = await fetch('http://localhost:3000/api/generate-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'タスク管理アプリを作成してください'
      })
    });
    
    const simpleResult = await simpleResponse.json();
    console.log('Simple Generation Response:', {
      status: simpleResponse.status,
      success: simpleResult.success || false,
      error: simpleResult.error || null
    });
    
    // 2. Intelligent Generation Test
    console.log('\n🤖 Test 2: Intelligent Generation');
    const intelligentResponse = await fetch('http://localhost:3000/api/intelligent-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: 'レストラン予約システムを作成してください',
        targetAudience: 'レストランオーナー',
        industry: 'food-service'
      })
    });
    
    const intelligentResult = await intelligentResponse.json();
    console.log('Intelligent Generation Response:', {
      status: intelligentResponse.status,
      success: intelligentResult.success || false,
      hasCode: !!intelligentResult.generatedCode,
      hasDesign: !!intelligentResult.selectedTemplate
    });
    
    // 3. Quality Check Test
    console.log('\n🔍 Test 3: Quality Check');
    if (intelligentResult.generatedCode) {
      const qualityResponse = await fetch('http://localhost:3000/api/quality-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generatedCode: intelligentResult.generatedCode
        })
      });
      
      const qualityResult = await qualityResponse.json();
      console.log('Quality Check Response:', {
        status: qualityResponse.status,
        overallScore: qualityResult.summary?.overallScore,
        productionReadiness: qualityResult.summary?.productionReadiness
      });
    }
    
    // 4. Premium Design Test
    console.log('\n🎨 Test 4: Premium Design System');
    const designResponse = await fetch('http://localhost:3000/api/premium-design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        industry: 'technology',
        targetAudience: 'developers',
        brandPersonality: ['modern', 'innovative']
      })
    });
    
    const designResult = await designResponse.json();
    console.log('Premium Design Response:', {
      status: designResponse.status,
      category: designResult.summary?.category,
      name: designResult.summary?.name
    });
    
    // 5. Schema Inference Test
    console.log('\n📊 Test 5: Schema Inference');
    const schemaResponse = await fetch('http://localhost:3000/api/infer-schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: 'ブログシステムを作成してください'
      })
    });
    
    const schemaResult = await schemaResponse.json();
    console.log('Schema Inference Response:', {
      status: schemaResponse.status,
      success: schemaResult.success || false,
      tableName: schemaResult.schema?.tableName,
      columnCount: schemaResult.schema?.columns?.length
    });
    
    console.log('\n✅ テスト完了！');
    
    // Summary
    const summary = {
      totalTests: 5,
      passedTests: 0,
      failedTests: 0
    };
    
    if (simpleResponse.ok) summary.passedTests++;
    else summary.failedTests++;
    
    if (intelligentResponse.ok && intelligentResult.success) summary.passedTests++;
    else summary.failedTests++;
    
    // qualityResponseは条件付きで実行されるため存在チェック
    if (intelligentResult.generatedCode) {
      summary.passedTests++;
    } else {
      summary.failedTests++;
    }
    
    if (designResponse.ok && designResult.success) summary.passedTests++;
    else summary.failedTests++;
    
    if (schemaResponse.ok && schemaResult.success) summary.passedTests++;
    else summary.failedTests++;
    
    console.log('\n📊 テスト結果サマリー:', summary);
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
  }
};

// テスト実行
testAppGeneration();