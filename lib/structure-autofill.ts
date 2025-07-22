interface StructureOutput {
  why: string
  who: string
  what: string[]
  how: string
  impact: string
}

export function autoFillStructure(userInput: string): StructureOutput {
  const input = userInput.trim().toLowerCase()
  
  // 基本的な要素抽出
  const purpose = extractPurpose(input)
  const targetUsers = extractTargetUsers(input)
  const necessaryBlocks = extractNecessaryBlocks(input)
  const implementation = extractImplementation(input)
  const expectedImpact = extractExpectedImpact(input)

  return {
    why: purpose,
    who: targetUsers,
    what: necessaryBlocks,
    how: implementation,
    impact: expectedImpact
  }
}

function extractPurpose(input: string): string {
  // 学園祭・イベント系
  if (input.includes('学園祭') || input.includes('文化祭') || input.includes('大学祭')) {
    return '学園祭の情報を学生や地域の人に届けたい'
  }
  
  // 広報・PR系
  if (input.includes('広報') || input.includes('pr') || input.includes('宣伝')) {
    return '情報を効果的に発信して認知を広げたい'
  }
  
  // 企業・ビジネス系
  if (input.includes('企業') || input.includes('会社') || input.includes('コーポレート')) {
    return '企業の信頼性を高めて顧客との関係を築きたい'
  }
  
  // ポートフォリオ・個人作品系
  if (input.includes('ポートフォリオ') || input.includes('作品')) {
    return '自分の作品・スキルを効果的に見せたい'
  }
  
  // カフェ・飲食店系
  if (input.includes('カフェ') || input.includes('レストラン') || input.includes('飲食店')) {
    return '美味しい料理とサービスを多くの人に知ってもらいたい'
  }
  
  // ECサイト・オンラインショップ系
  if (input.includes('ec') || input.includes('ショップ') || input.includes('店舗') || input.includes('オンライン')) {
    return '商品の魅力を伝えて売上を伸ばしたい'
  }
  
  // ブログ・メディア系
  if (input.includes('ブログ') || input.includes('メディア') || input.includes('記事')) {
    return '価値のある情報を発信して読者とつながりたい'
  }
  
  // ニュース・情報系
  if (input.includes('ニュース') || input.includes('情報') || input.includes('データ')) {
    return '最新の情報を整理して分かりやすく伝えたい'
  }
  
  // コミュニティ・SNS系
  if (input.includes('コミュニティ') || input.includes('sns') || input.includes('交流')) {
    return '人同士のつながりを促進したい'
  }
  
  // 予約・管理系
  if (input.includes('予約') || input.includes('管理') || input.includes('システム')) {
    return '業務を効率化して顧客満足度を向上させたい'
  }
  
  // フィットネス・健康系
  if (input.includes('フィットネス') || input.includes('健康') || input.includes('運動')) {
    return '健康的な生活をサポートしたい'
  }
  
  // アプリ・サービス系
  if (input.includes('アプリ') || input.includes('サービス')) {
    if (input.includes('日記') || input.includes('記録')) {
      return '思い出を楽しく残せるようにしたい'
    } else if (input.includes('学習') || input.includes('勉強')) {
      return '効率的な学習をサポートしたい'
    } else if (input.includes('ec') || input.includes('ショッピング')) {
      return '便利な買い物体験を提供したい'
    }
    return 'ユーザーの課題を解決したい'
  }
  
  // 汎用的な場合
  return input.includes('したい') ? `${input.replace('したい', '').trim()  }を実現したい` : `${input}の目的を達成したい`
}

function extractTargetUsers(input: string): string {
  // 学園祭・イベント系
  if (input.includes('学園祭') || input.includes('文化祭') || input.includes('大学祭')) {
    return '大学生、地域住民、家族連れ'
  }
  
  // 企業・ビジネス系
  if (input.includes('企業') || input.includes('会社') || input.includes('コーポレート')) {
    return '見込み客、既存顧客、パートナー企業'
  }
  
  // ポートフォリオ・個人作品系
  if (input.includes('ポートフォリオ') || input.includes('作品')) {
    return '採用担当者、クライアント、同業者'
  }
  
  // カフェ・飲食店系
  if (input.includes('カフェ') || input.includes('レストラン') || input.includes('飲食店')) {
    return '地域住民、観光客、グルメ愛好家'
  }
  
  // ECサイト・オンラインショップ系
  if (input.includes('ec') || input.includes('ショップ') || input.includes('店舗') || input.includes('オンライン')) {
    return '購入検討者、既存顧客、リピーター'
  }
  
  // ブログ・メディア系
  if (input.includes('ブログ') || input.includes('メディア') || input.includes('記事')) {
    return '情報収集者、専門分野に関心のある人'
  }
  
  // ニュース・情報系
  if (input.includes('ニュース') || input.includes('情報') || input.includes('データ')) {
    return '一般読者、業界関係者、研究者'
  }
  
  // コミュニティ・SNS系
  if (input.includes('コミュニティ') || input.includes('sns') || input.includes('交流')) {
    return '同じ興味を持つ人、交流を求める人'
  }
  
  // 予約・管理系
  if (input.includes('予約') || input.includes('管理') || input.includes('システム')) {
    return 'サービス利用者、管理者、スタッフ'
  }
  
  // フィットネス・健康系
  if (input.includes('フィットネス') || input.includes('健康') || input.includes('運動')) {
    return '健康志向の人、運動初心者、トレーニー'
  }
  
  // アプリ・サービス系
  if (input.includes('アプリ') || input.includes('サービス')) {
    if (input.includes('日記') || input.includes('記録')) {
      return '個人ユーザー（10代〜30代）'
    } else if (input.includes('学習') || input.includes('勉強')) {
      return '学生、社会人学習者'
    } else if (input.includes('ec') || input.includes('ショッピング')) {
      return '一般消費者'
    }
    return '一般ユーザー'
  }
  
  return '想定ユーザー'
}

function extractNecessaryBlocks(input: string): string[] {
  // 学園祭・イベント系
  if (input.includes('学園祭') || input.includes('文化祭') || input.includes('大学祭')) {
    return ['ヒーローセクション', 'タイムテーブル', '出展紹介', 'アクセスマップ', 'お知らせ']
  }
  
  // 企業・ビジネス系
  if (input.includes('企業') || input.includes('会社') || input.includes('コーポレート')) {
    return ['会社概要', 'サービス紹介', '実績・事例', 'お問い合わせ', 'ニュース']
  }
  
  // ポートフォリオ・個人作品系
  if (input.includes('ポートフォリオ') || input.includes('作品')) {
    return ['プロフィール', '作品ギャラリー', 'スキル一覧', '連絡先', '経歴']
  }
  
  // カフェ・飲食店系
  if (input.includes('カフェ') || input.includes('レストラン') || input.includes('飲食店')) {
    return ['メニュー', '店舗情報', 'アクセス', '予約フォーム', 'お知らせ']
  }
  
  // ECサイト・オンラインショップ系
  if (input.includes('ec') || input.includes('ショップ') || input.includes('店舗') || input.includes('オンライン')) {
    return ['商品一覧', '商品詳細', 'カート機能', '決済システム', 'レビュー']
  }
  
  // ブログ・メディア系
  if (input.includes('ブログ') || input.includes('メディア') || input.includes('記事')) {
    return ['記事一覧', '記事詳細', 'カテゴリー', '検索機能', 'コメント']
  }
  
  // ニュース・情報系
  if (input.includes('ニュース') || input.includes('情報') || input.includes('データ')) {
    return ['ニュース一覧', '詳細記事', '検索機能', 'カテゴリー', 'アーカイブ']
  }
  
  // コミュニティ・SNS系
  if (input.includes('コミュニティ') || input.includes('sns') || input.includes('交流')) {
    return ['投稿機能', 'プロフィール', 'メッセージ', '検索機能', 'グループ']
  }
  
  // 予約・管理系
  if (input.includes('予約') || input.includes('管理') || input.includes('システム')) {
    return ['予約フォーム', 'スケジュール', '確認画面', '管理画面', '通知機能']
  }
  
  // フィットネス・健康系
  if (input.includes('フィットネス') || input.includes('健康') || input.includes('運動')) {
    return ['プログラム紹介', '料金案内', '体験予約', 'トレーナー紹介', '施設案内']
  }
  
  // LP・ランディングページ系
  if (input.includes('lp') || input.includes('ランディング')) {
    return ['キャッチコピー', '特徴説明', 'お客様の声', 'CTA', 'FAQ']
  }
  
  // アプリ・サービス系
  if (input.includes('アプリ') || input.includes('サービス')) {
    if (input.includes('日記') || input.includes('記録')) {
      return ['投稿機能', '写真添付', 'カレンダー表示', '検索機能']
    } else if (input.includes('学習') || input.includes('勉強')) {
      return ['学習コンテンツ', '進捗管理', 'テスト機能', '復習システム']
    } else if (input.includes('ec') || input.includes('ショッピング')) {
      return ['商品検索', '購入機能', 'レビュー機能', 'お気に入り']
    }
    return ['基本機能', 'ユーザー管理', 'データ管理']
  }
  
  // 汎用的な場合
  return ['メインコンテンツ', 'ナビゲーション', 'お問い合わせ']
}

function extractImplementation(input: string): string {
  // 学園祭・イベント系
  if (input.includes('学園祭') || input.includes('文化祭') || input.includes('大学祭')) {
    return 'ノーコードツール（Wix / STUDIO）で実装'
  }
  
  // 企業・ビジネス系
  if (input.includes('企業') || input.includes('会社') || input.includes('コーポレート')) {
    return 'WordPressまたはCMSで構築'
  }
  
  // ポートフォリオ・個人作品系
  if (input.includes('ポートフォリオ') || input.includes('作品')) {
    return 'Webサイトビルダーで作成'
  }
  
  // アプリ・サービス系
  if (input.includes('アプリ') || input.includes('サービス')) {
    if (input.includes('web') || input.includes('ウェブ')) {
      return 'Webアプリとして開発'
    }
    return 'モバイルアプリとして開発'
  }
  
  // ECサイト系
  if (input.includes('ec') || input.includes('ショップ') || input.includes('店舗')) {
    return 'ECプラットフォーム（Shopify / BASE）で構築'
  }
  
  // LP・ランディングページ系
  if (input.includes('lp') || input.includes('ランディング')) {
    return 'LPツール（Unbounce / Leadpages）で作成'
  }
  
  return 'Webサイトとして実装'
}

function extractExpectedImpact(input: string): string {
  // 学園祭・イベント系
  if (input.includes('学園祭') || input.includes('文化祭') || input.includes('大学祭')) {
    return '来場者数を昨年比120%に増やす'
  }
  
  // 企業・ビジネス系
  if (input.includes('企業') || input.includes('会社') || input.includes('コーポレート')) {
    return '問い合わせ数を月10件以上増やす'
  }
  
  // ポートフォリオ・個人作品系
  if (input.includes('ポートフォリオ') || input.includes('作品')) {
    return '仕事の依頼獲得、転職活動の成功'
  }
  
  // ECサイト系
  if (input.includes('ec') || input.includes('ショップ') || input.includes('店舗')) {
    return '売上を月20%向上させる'
  }
  
  // アプリ・サービス系
  if (input.includes('アプリ') || input.includes('サービス')) {
    if (input.includes('日記') || input.includes('記録')) {
      return '継続利用率80%以上を達成'
    } else if (input.includes('学習') || input.includes('勉強')) {
      return '学習効率を30%向上させる'
    }
    return 'ユーザー満足度の向上'
  }
  
  return '認知度向上と目標達成'
}

// 入力内容の抽象度をチェック
export function isAbstractInput(input: string): boolean {
  const abstractKeywords = ['したい', '欲しい', '作りたい', '何か', 'いい感じ', 'おしゃれ', 'かっこいい', 'すごい']
  const concreteKeywords = ['アプリ', 'サイト', 'システム', 'ゲーム', 'ショップ', 'ブログ', 'ポートフォリオ']
  
  const hasAbstractKeywords = abstractKeywords.some(keyword => input.includes(keyword))
  const hasConcreteKeywords = concreteKeywords.some(keyword => input.includes(keyword))
  
  return hasAbstractKeywords && !hasConcreteKeywords && input.length < 50
}