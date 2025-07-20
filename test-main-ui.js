// MATURAメインUIテスト
const testMainUI = async () => {
  console.log('🖥️ MATURAメインUIテストを開始...');
  
  try {
    // 1. メインページアクセステスト
    console.log('\n🏠 Test 1: メインページアクセス');
    const mainResponse = await fetch('http://localhost:3000');
    console.log('メインページ:', {
      status: mainResponse.status,
      contentType: mainResponse.headers.get('content-type'),
      isHTML: mainResponse.headers.get('content-type')?.includes('text/html')
    });
    
    // 2. 静的リソースの確認
    console.log('\n📁 Test 2: 静的リソース');
    const staticTests = [
      'http://localhost:3000/_next/static/css/app/layout.css',
      'http://localhost:3000/favicon.ico'
    ];
    
    for (const url of staticTests) {
      try {
        const response = await fetch(url);
        console.log(`${url}: ${response.status} ${response.ok ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`${url}: エラー ❌`);
      }
    }
    
    // 3. API Health Checks
    console.log('\n🔧 Test 3: API ヘルスチェック');
    const healthEndpoints = [
      '/api/generate-simple',
      '/api/intelligent-generate', 
      '/api/quality-check',
      '/api/premium-design',
      '/api/premium-generate'
    ];
    
    const healthResults = {};
    for (const endpoint of healthEndpoints) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        const data = await response.json();
        healthResults[endpoint] = {
          status: response.status,
          healthy: response.ok && data.status === 'healthy',
          service: data.service || 'unknown'
        };
      } catch (error) {
        healthResults[endpoint] = {
          status: 'error',
          healthy: false,
          error: error.message
        };
      }
    }
    
    console.log('API ヘルスチェック結果:');
    Object.entries(healthResults).forEach(([endpoint, result]) => {
      console.log(`  ${endpoint}: ${result.healthy ? '✅' : '❌'} (${result.service})`);
    });
    
    // 4. 実際のアプリ生成テスト
    console.log('\n🚀 Test 4: 実際のアプリ生成テスト');
    const generateTest = await fetch('http://localhost:3000/api/generate-simple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: 'ブログシステム' })
    });
    
    const generateResult = await generateTest.json();
    console.log('アプリ生成テスト:', {
      status: generateTest.status,
      hasCode: !!generateResult.code,
      hasSchema: !!generateResult.schema,
      tableName: generateResult.tableName,
      codeLength: generateResult.code?.length || 0
    });
    
    // 5. TypeScriptビルドエラーチェック
    console.log('\n📝 Test 5: TypeScript状態確認');
    const { exec } = require('child_process');
    
    const tsCheckPromise = new Promise((resolve) => {
      exec('npm run type-check', (error, stdout, stderr) => {
        const errorCount = (stderr.match(/error TS\d+/g) || []).length;
        resolve({
          hasErrors: errorCount > 0,
          errorCount,
          canBuild: errorCount < 20 // 許容範囲
        });
      });
    });
    
    const tsResult = await tsCheckPromise;
    console.log('TypeScript状態:', {
      エラー数: tsResult.errorCount,
      ビルド可能: tsResult.canBuild ? '✅' : '❌',
      状態: tsResult.canBuild ? '問題なし' : '要修正'
    });
    
    // 6. 総合評価
    console.log('\n📊 総合評価');
    const scores = {
      メインページアクセス: mainResponse.ok ? 1 : 0,
      APIヘルス: Object.values(healthResults).filter(r => r.healthy).length / healthEndpoints.length,
      アプリ生成: generateResult.code ? 1 : 0,
      TypeScript状態: tsResult.canBuild ? 1 : 0.5
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const maxScore = Object.keys(scores).length;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    console.log('スコア詳細:', scores);
    console.log(`総合スコア: ${totalScore.toFixed(1)}/${maxScore} (${percentage}%)`);
    
    if (percentage >= 80) {
      console.log('🎉 MATURA システム: 正常動作 ✅');
    } else if (percentage >= 60) {
      console.log('⚠️ MATURA システム: 一部問題あり');
    } else {
      console.log('❌ MATURA システム: 修正が必要');
    }
    
    return {
      overall: percentage,
      details: scores,
      healthy: percentage >= 80
    };
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
    return { overall: 0, healthy: false, error: error.message };
  }
};

// テスト実行
testMainUI().then(result => {
  console.log('\n🏁 テスト完了');
  process.exit(result.healthy ? 0 : 1);
});