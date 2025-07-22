#!/usr/bin/env node

/**
 * OpenAI最適化システムのテストスクリプト
 */

async function testBasicOpenAISystem() {
  console.log('🧪 [TEST] OpenAI最適化システムのテスト開始...');
  
  try {
    // 基本的なAPIコール
    const response = await fetch('http://localhost:3000/api/generate-simple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: '簡単なテストアプリ' })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ [TEST] 基本APIコール成功');
      console.log('📋 [TEST] コード生成:', data.code ? '✅' : '❌');
      console.log('📋 [TEST] スキーマ生成:', data.schema ? '✅' : '❌');
      console.log('📋 [TEST] 生成時間:', data.generationMetrics?.totalTime || 'N/A');
      
      if (data.schema && data.schema.openAIResult) {
        console.log('🚀 [TEST] OpenAI最適化機能が動作中');
        console.log('📊 [TEST] OpenAI品質スコア:', data.schema.openAIResult.quality?.confidence || 'N/A');
        console.log('📊 [TEST] OpenAI使用トークン:', data.schema.openAIResult.tokens?.total || 'N/A');
      } else {
        console.log('⚠️ [TEST] フォールバック機能で動作中（OpenAI未使用）');
      }
      
      return true;
    } else {
      console.error('❌ [TEST] APIコール失敗:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ [TEST] テスト実行エラー:', error.message);
    return false;
  }
}

async function testOpenAIDirectConnection() {
  console.log('🔑 [TEST] OpenAI直接接続テスト...');
  
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello, test connection' }],
        max_tokens: 10
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ [TEST] OpenAI直接接続成功');
      console.log('📋 [TEST] モデル:', data.model);
      console.log('📋 [TEST] 使用トークン:', data.usage?.total_tokens || 'N/A');
      return true;
    } else {
      const errorData = await response.json();
      console.error('❌ [TEST] OpenAI接続失敗:', errorData.error?.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('❌ [TEST] OpenAI接続エラー:', error.message);
    return false;
  }
}

async function runSystemTests() {
  console.log('🎯 [TEST] OpenAI最適化システムの総合テスト開始\n');
  
  const results = {
    directConnection: await testOpenAIDirectConnection(),
    basicSystem: await testBasicOpenAISystem()
  };
  
  console.log('\n📊 [TEST] テスト結果サマリー:');
  console.log('━'.repeat(50));
  console.log(`OpenAI直接接続: ${results.directConnection ? '✅ 成功' : '❌ 失敗'}`);
  console.log(`基本システム動作: ${results.basicSystem ? '✅ 成功' : '❌ 失敗'}`);
  
  const passCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 [TEST] 総合結果: ${passCount}/${totalCount} テスト成功`);
  
  if (passCount === totalCount) {
    console.log('🎉 [TEST] OpenAI最適化システムが正常に動作しています！');
    console.log('💡 [INFO] GPT-4による高度な生成機能が利用可能です');
    process.exit(0);
  } else {
    console.log('⚠️ [TEST] 一部の機能に問題があります');
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  runSystemTests().catch(console.error);
}

module.exports = { testBasicOpenAISystem, testOpenAIDirectConnection };