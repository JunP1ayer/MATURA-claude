// Test for festival LP structure
const fs = require('fs');
const path = require('path');

// Read the TypeScript file content
const tsContent = fs.readFileSync('./lib/structure-autofill.ts', 'utf8');

// Extract the logic manually for testing
function autoFillStructure(userInput) {
  const input = userInput.trim();
  
  const result = {
    why: '',
    who: '',
    what: '',
    how: '',
    impact: ''
  };

  // Test the new logic specifically
  if (input.includes('学園祭') || input.includes('文化祭') || input.includes('大学祭')) {
    result.why = '学園祭への参加者を増やしたい';
    result.who = '学生・地域住民・家族連れ（10代〜50代）';
    result.what = 'イベント情報、タイムスケジュール、アクセス情報、出店情報';
    result.how = 'レスポンシブLP（スマホ対応重視）';
    result.impact = '来場者数増加、学園祭の認知度向上';
  } else if (input.includes('広報') || input.includes('PR') || input.includes('宣伝')) {
    result.why = '情報を広く効果的に発信したい';
    result.who = 'ターゲットオーディエンス（年代は内容による）';
    result.what = '魅力的な情報コンテンツ、ビジュアル、行動促進';
    result.how = 'レスポンシブLP（SNSシェア機能付き）';
    result.impact = '認知度向上、参加・利用促進';
  }

  return result;
}

// Test cases
const testInputs = [
  '名古屋大学の学園祭の広報のLP作りたい',
  '楽しい日記アプリを作りたい',
  '学園祭のサイトを作りたい',
  '広報用のランディングページを作りたい'
];

console.log('=== 学園祭LP構造化テスト ===\n');

testInputs.forEach((input, index) => {
  console.log(`テスト ${index + 1}: "${input}"`);
  const result = autoFillStructure(input);
  console.log('結果:');
  console.log(`  Why: ${result.why}`);
  console.log(`  Who: ${result.who}`);
  console.log(`  What: ${result.what}`);
  console.log(`  How: ${result.how}`);
  console.log(`  Impact: ${result.impact}`);
  console.log('---\n');
});

console.log('テスト完了');