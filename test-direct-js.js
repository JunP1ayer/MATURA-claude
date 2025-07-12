// Test the direct JavaScript implementation
const { autoFillStructure, isAbstractInput } = require('./lib/structure-autofill.js');

console.log('=== 直接JavaScript実装テスト ===\n');

const testInputs = [
  'カフェのWebサイトを作りたい',
  'オンラインショップを作りたい', 
  'ブログサイトを作りたい',
  'ニュースサイトを作りたい',
  'コミュニティサイトを作りたい',
  'フィットネスジムのサイトを作りたい',
  'レストラン予約システムを作りたい',
  '学園祭のサイトを作りたい',
  '企業サイトを作りたい',
  'ポートフォリオサイトを作りたい',
  '健康管理アプリを作りたい',
  '日記アプリを作りたい'
];

testInputs.forEach((input, index) => {
  console.log(`テスト ${index + 1}: "${input}"`);
  const result = autoFillStructure(input);
  console.log('結果:');
  console.log(`  Why: ${result.why}`);
  console.log(`  Who: ${result.who}`);
  console.log(`  What: [${result.what.join(', ')}]`);
  console.log(`  How: ${result.how}`);
  console.log(`  Impact: ${result.impact}`);
  console.log('---\n');
});

console.log('JavaScript実装テスト完了');