/**
 * アイデア本質理解システムのテスト
 */

import { hybridAI } from '@/lib/hybrid-ai-orchestrator';

const testCases = [
  {
    name: '具体的業界特化アイデア',
    idea: 'カフェの注文管理システム',
    expectedCategory: 'productivity', // 店舗管理なので
    expectedFeatures: ['注文', '管理', 'POS']
  },
  {
    name: '医療特化アイデア',
    idea: '病院の患者待ち時間管理',
    expectedCategory: 'health',
    expectedFeatures: ['患者', '待ち時間', '予約']
  },
  {
    name: '教育分野アイデア',
    idea: '小学生向け算数学習ゲーム',
    expectedCategory: 'education',
    expectedFeatures: ['学習', 'ゲーム', '算数']
  },
  {
    name: '金融業界アイデア',
    idea: '家計簿と投資ポートフォリオ管理',
    expectedCategory: 'finance',
    expectedFeatures: ['家計簿', '投資', 'ポートフォリオ']
  },
  {
    name: 'クリエイティブアイデア',
    idea: 'レシピ共有とコミュニティ',
    expectedCategory: 'creative',
    expectedFeatures: ['レシピ', '共有', 'コミュニティ']
  }
];

async function runTests() {
  console.log('🧪 アイデア本質理解システムテスト開始\n');
  
  let passedTests = 0;
  const totalTests = testCases.length;
  
  for (const testCase of testCases) {
    console.log(`📝 テスト: ${testCase.name}`);
    console.log(`💭 アイデア: "${testCase.idea}"`);
    
    try {
      const result = await hybridAI.generateApp(testCase.idea, {
        mode: 'balanced',
        useDesignSystem: false, // テスト用に高速化
        creativityLevel: 'medium',
        qualityPriority: 'speed'
      });
      
      // 結果検証
      const categoryMatch = result.idea.category === testCase.expectedCategory;
      const hasExpectedFeatures = testCase.expectedFeatures.some(feature =>
        result.idea.enhanced.toLowerCase().includes(feature.toLowerCase()) ||
        (result.idea.keyFeatures && result.idea.keyFeatures.some((kf: string) => 
          kf.toLowerCase().includes(feature.toLowerCase())
        ))
      );
      
      console.log(`✅ 分析結果:`);
      console.log(`   カテゴリ: ${result.idea.category} ${categoryMatch ? '✅' : '❌'}`);
      console.log(`   本質価値: ${result.idea.coreValue || '未設定'}`);
      console.log(`   対象ユーザー: ${result.idea.targetUsers?.join(', ') || '未設定'}`);
      console.log(`   主要機能: ${result.idea.keyFeatures?.join(', ') || '未設定'}`);
      console.log(`   業界文脈: ${result.idea.industryContext || '未設定'}`);
      console.log(`   期待機能含有: ${hasExpectedFeatures ? '✅' : '❌'}`);
      
      if (categoryMatch && hasExpectedFeatures) {
        console.log('🎉 テスト合格\n');
        passedTests++;
      } else {
        console.log('❌ テスト不合格\n');
      }
      
    } catch (error) {
      console.error(`❌ テストエラー: ${error}\n`);
    }
  }
  
  console.log('📊 テスト結果サマリー');
  console.log(`合格: ${passedTests}/${totalTests}`);
  console.log(`成功率: ${Math.round(passedTests / totalTests * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 全テスト合格！アイデア本質理解システム正常動作');
  } else {
    console.log('⚠️ 一部テスト失敗。システム改善が必要');
  }
}

// Node.js環境でのテスト実行
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };