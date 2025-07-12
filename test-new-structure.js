// Test for new flexible structure autofill
const fs = require('fs');

// Simulate the new structure logic
function autoFillStructure(userInput) {
  const input = userInput.trim().toLowerCase();
  
  // Test the new logic for festival LP
  if (input.includes('学園祭') || input.includes('文化祭') || input.includes('大学祭')) {
    return {
      why: '学園祭の情報を学生や地域の人に届けたい',
      who: '大学生、地域住民、家族連れ',
      what: ['ヒーローセクション', 'タイムテーブル', '出展紹介', 'アクセスマップ', 'お知らせ'],
      how: 'ノーコードツール（Wix / STUDIO）で実装',
      impact: '来場者数を昨年比120%に増やす'
    };
  }
  
  // Test for corporate site
  if (input.includes('企業') || input.includes('会社') || input.includes('コーポレート')) {
    return {
      why: '企業の信頼性を高めて顧客との関係を築きたい',
      who: '見込み客、既存顧客、パートナー企業',
      what: ['会社概要', 'サービス紹介', '実績・事例', 'お問い合わせ', 'ニュース'],
      how: 'WordPressまたはCMSで構築',
      impact: '問い合わせ数を月10件以上増やす'
    };
  }
  
  // Test for portfolio
  if (input.includes('ポートフォリオ') || input.includes('作品')) {
    return {
      why: '自分の作品・スキルを効果的に見せたい',
      who: '採用担当者、クライアント、同業者',
      what: ['プロフィール', '作品ギャラリー', 'スキル一覧', '連絡先', '経歴'],
      how: 'Webサイトビルダーで作成',
      impact: '仕事の依頼獲得、転職活動の成功'
    };
  }
  
  // Test for diary app
  if (input.includes('日記') && input.includes('アプリ')) {
    return {
      why: '思い出を楽しく残せるようにしたい',
      who: '個人ユーザー（10代〜30代）',
      what: ['投稿機能', '写真添付', 'カレンダー表示', '検索機能'],
      how: 'モバイルアプリとして開発',
      impact: '継続利用率80%以上を達成'
    };
  }
  
  return {
    why: '目的を達成したい',
    who: '想定ユーザー',
    what: ['メインコンテンツ', 'ナビゲーション', 'お問い合わせ'],
    how: 'Webサイトとして実装',
    impact: '認知度向上と目標達成'
  };
}

// Test cases
const testInputs = [
  '名古屋大学の学園祭の広報のLP作りたい',
  '学園祭のウェブページを作りたい',
  '企業サイトを作りたい',
  'ポートフォリオサイトを作りたい',
  '楽しい日記アプリを作りたい',
  '何かいいサイトを作りたい'
];

console.log('=== 新しい構造化ロジックテスト ===\n');

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

// Test JSON output format
console.log('=== JSON出力テスト ===');
const testResult = autoFillStructure('学園祭のウェブページを作りたい');
console.log(JSON.stringify(testResult, null, 2));

console.log('\nテスト完了');