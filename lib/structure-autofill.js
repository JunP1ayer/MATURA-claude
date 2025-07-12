// JavaScript version for immediate deployment
function autoFillStructure(userInput) {
  const input = userInput.trim().toLowerCase();
  
  // カフェ・飲食店系
  if (input.includes('カフェ') || input.includes('レストラン') || input.includes('飲食店')) {
    return {
      why: '美味しい料理とサービスを多くの人に知ってもらいたい',
      who: '地域住民、観光客、グルメ愛好家',
      what: ['メニュー', '店舗情報', 'アクセス', '予約フォーム', 'お知らせ'],
      how: 'WordPressまたはCMSで構築',
      impact: '来店者数を月30%増加させる'
    };
  }
  
  // ECサイト・オンラインショップ系
  if (input.includes('オンライン') || input.includes('ショップ') || input.includes('ec') || input.includes('通販')) {
    return {
      why: '商品の魅力を伝えて売上を伸ばしたい',
      who: '購入検討者、既存顧客、リピーター',
      what: ['商品一覧', '商品詳細', 'カート機能', '決済システム', 'レビュー'],
      how: 'ECプラットフォーム（Shopify / BASE）で構築',
      impact: '売上を月20%向上させる'
    };
  }
  
  // ブログ・メディア系
  if (input.includes('ブログ') || input.includes('メディア') || input.includes('記事')) {
    return {
      why: '価値のある情報を発信して読者とつながりたい',
      who: '情報収集者、専門分野に関心のある人',
      what: ['記事一覧', '記事詳細', 'カテゴリー', '検索機能', 'コメント'],
      how: 'WordPressまたはCMSで構築',
      impact: '月間PV数を3倍に増加させる'
    };
  }
  
  // ニュース・情報系
  if (input.includes('ニュース') || input.includes('情報') || input.includes('データ')) {
    return {
      why: '最新の情報を整理して分かりやすく伝えたい',
      who: '一般読者、業界関係者、研究者',
      what: ['ニュース一覧', '詳細記事', '検索機能', 'カテゴリー', 'アーカイブ'],
      how: 'WordPressまたはCMSで構築',
      impact: '日間アクセス数を5倍に増加させる'
    };
  }
  
  // コミュニティ・SNS系
  if (input.includes('コミュニティ') || input.includes('sns') || input.includes('交流')) {
    return {
      why: '人同士のつながりを促進したい',
      who: '同じ興味を持つ人、交流を求める人',
      what: ['投稿機能', 'プロフィール', 'メッセージ', '検索機能', 'グループ'],
      how: 'Webアプリとして開発',
      impact: 'アクティブユーザー数を月100人獲得'
    };
  }
  
  // フィットネス・健康系
  if (input.includes('フィットネス') || input.includes('健康') || input.includes('運動') || input.includes('ジム')) {
    return {
      why: '健康的な生活をサポートしたい',
      who: '健康志向の人、運動初心者、トレーニー',
      what: ['プログラム紹介', '料金案内', '体験予約', 'トレーナー紹介', '施設案内'],
      how: 'Webサイトビルダーで作成',
      impact: '新規会員を月20名獲得'
    };
  }
  
  // 予約・管理系
  if (input.includes('予約') || input.includes('管理') || input.includes('システム')) {
    return {
      why: '業務を効率化して顧客満足度を向上させたい',
      who: 'サービス利用者、管理者、スタッフ',
      what: ['予約フォーム', 'スケジュール', '確認画面', '管理画面', '通知機能'],
      how: 'Webアプリとして開発',
      impact: '業務効率を40%向上させる'
    };
  }
  
  // 学園祭・イベント系
  if (input.includes('学園祭') || input.includes('文化祭') || input.includes('大学祭')) {
    return {
      why: '学園祭の情報を学生や地域の人に届けたい',
      who: '大学生、地域住民、家族連れ',
      what: ['ヒーローセクション', 'タイムテーブル', '出展紹介', 'アクセスマップ', 'お知らせ'],
      how: 'ノーコードツール（Wix / STUDIO）で実装',
      impact: '来場者数を昨年比120%に増やす'
    };
  }
  
  // 企業・ビジネス系
  if (input.includes('企業') || input.includes('会社') || input.includes('コーポレート')) {
    return {
      why: '企業の信頼性を高めて顧客との関係を築きたい',
      who: '見込み客、既存顧客、パートナー企業',
      what: ['会社概要', 'サービス紹介', '実績・事例', 'お問い合わせ', 'ニュース'],
      how: 'WordPressまたはCMSで構築',
      impact: '問い合わせ数を月10件以上増やす'
    };
  }
  
  // ポートフォリオ・個人作品系
  if (input.includes('ポートフォリオ') || input.includes('作品')) {
    return {
      why: '自分の作品・スキルを効果的に見せたい',
      who: '採用担当者、クライアント、同業者',
      what: ['プロフィール', '作品ギャラリー', 'スキル一覧', '連絡先', '経歴'],
      how: 'Webサイトビルダーで作成',
      impact: '仕事の依頼獲得、転職活動の成功'
    };
  }
  
  // アプリ・サービス系
  if (input.includes('アプリ') || input.includes('サービス')) {
    if (input.includes('日記') || input.includes('記録')) {
      return {
        why: '思い出を楽しく残せるようにしたい',
        who: '個人ユーザー（10代〜30代）',
        what: ['投稿機能', '写真添付', 'カレンダー表示', '検索機能'],
        how: 'モバイルアプリとして開発',
        impact: '継続利用率80%以上を達成'
      };
    } else if (input.includes('学習') || input.includes('勉強')) {
      return {
        why: '効率的な学習をサポートしたい',
        who: '学生、社会人学習者',
        what: ['学習コンテンツ', '進捗管理', 'テスト機能', '復習システム'],
        how: 'Webアプリとして開発',
        impact: '学習効率を30%向上させる'
      };
    }
    return {
      why: 'ユーザーの課題を解決したい',
      who: '一般ユーザー',
      what: ['基本機能', 'ユーザー管理', 'データ管理'],
      how: 'モバイルアプリとして開発',
      impact: 'ユーザー満足度の向上'
    };
  }
  
  // 汎用的な場合
  return {
    why: input.includes('したい') ? input.replace('したい', '').trim() + 'を実現したい' : `${input}の目的を達成したい`,
    who: '想定ユーザー',
    what: ['メインコンテンツ', 'ナビゲーション', 'お問い合わせ'],
    how: 'Webサイトとして実装',
    impact: '認知度向上と目標達成'
  };
}

function isAbstractInput(input) {
  const abstractKeywords = ['したい', '欲しい', '作りたい', '何か', 'いい感じ', 'おしゃれ', 'かっこいい', 'すごい'];
  const concreteKeywords = ['アプリ', 'サイト', 'システム', 'ゲーム', 'ショップ', 'ブログ', 'ポートフォリオ'];
  
  const hasAbstractKeywords = abstractKeywords.some(keyword => input.includes(keyword));
  const hasConcreteKeywords = concreteKeywords.some(keyword => input.includes(keyword));
  
  return hasAbstractKeywords && !hasConcreteKeywords && input.length < 50;
}

module.exports = {
  autoFillStructure,
  isAbstractInput
};