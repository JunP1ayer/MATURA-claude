// Test the improved pattern recognition
console.log('=== 改善されたパターン認識テスト ===\n');

// Simulate the improved logic for testing
function testImprovedAutoFill(input) {
  const inputLower = input.toLowerCase();
  
  // Test pattern recognition
  if (inputLower.includes('カフェ')) {
    return {
      why: '美味しい料理とサービスを多くの人に知ってもらいたい',
      who: '地域住民、観光客、グルメ愛好家',
      what: ['メニュー', '店舗情報', 'アクセス', '予約フォーム', 'お知らせ'],
      how: 'WordPressまたはCMSで構築',
      impact: '来店者数を月30%増加させる'
    };
  }
  
  if (inputLower.includes('オンライン') && inputLower.includes('ショップ')) {
    return {
      why: '商品の魅力を伝えて売上を伸ばしたい',
      who: '購入検討者、既存顧客、リピーター',
      what: ['商品一覧', '商品詳細', 'カート機能', '決済システム', 'レビュー'],
      how: 'ECプラットフォーム（Shopify / BASE）で構築',
      impact: '売上を月20%向上させる'
    };
  }
  
  if (inputLower.includes('ブログ')) {
    return {
      why: '価値のある情報を発信して読者とつながりたい',
      who: '情報収集者、専門分野に関心のある人',
      what: ['記事一覧', '記事詳細', 'カテゴリー', '検索機能', 'コメント'],
      how: 'WordPressまたはCMSで構築',
      impact: '月間PV数を3倍に増加させる'
    };
  }
  
  if (inputLower.includes('フィットネス')) {
    return {
      why: '健康的な生活をサポートしたい',
      who: '健康志向の人、運動初心者、トレーニー',
      what: ['プログラム紹介', '料金案内', '体験予約', 'トレーナー紹介', '施設案内'],
      how: 'Webサイトビルダーで作成',
      impact: '新規会員を月20名獲得'
    };
  }
  
  if (inputLower.includes('コミュニティ')) {
    return {
      why: '人同士のつながりを促進したい',
      who: '同じ興味を持つ人、交流を求める人',
      what: ['投稿機能', 'プロフィール', 'メッセージ', '検索機能', 'グループ'],
      how: 'Webアプリとして開発',
      impact: 'アクティブユーザー数を月100人獲得'
    };
  }
  
  // Default case for testing
  return {
    why: '目的を達成したい',
    who: '想定ユーザー',
    what: ['メインコンテンツ', 'ナビゲーション', 'お問い合わせ'],
    how: 'Webサイトとして実装',
    impact: '認知度向上と目標達成'
  };
}

// Test various inputs
const diverseInputs = [
  'カフェのWebサイトを作りたい',
  'オンラインショップを作りたい',
  'ブログサイトを作りたい',
  'フィットネスジムのサイトを作りたい',
  'コミュニティサイトを作りたい',
  'ニュースサイトを作りたい',
  'レストラン予約システムを作りたい',
  '健康管理アプリを作りたい'
];

diverseInputs.forEach((input, index) => {
  console.log(`テスト ${index + 1}: "${input}"`);
  const result = testImprovedAutoFill(input);
  console.log('結果:');
  console.log(`  Why: ${result.why}`);
  console.log(`  Who: ${result.who}`);
  console.log(`  What: [${result.what.join(', ')}]`);
  console.log(`  How: ${result.how}`);
  console.log(`  Impact: ${result.impact}`);
  console.log('---\n');
});

console.log('改善されたパターン認識テスト完了');