/**
 * Industry-Specialized Design Patterns
 * 業界特化型デザインパターンライブラリ
 */

export interface IndustryPattern {
  id: string;
  name: string;
  industry: string;
  useCase: string;
  category: 'productivity' | 'creative' | 'business' | 'social' | 'ecommerce' | 'dashboard' | 'healthcare' | 'education' | 'finance' | 'hospitality' | 'logistics' | 'real-estate';
  complexity: 'simple' | 'moderate' | 'complex';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  components: string[];
  layout: 'minimal' | 'modern' | 'professional' | 'creative' | 'enterprise' | 'consumer';
  mvpScore: number;
  keyFeatures: string[];
  targetUsers: string[];
  businessLogic: string[];
}

export const INDUSTRY_SPECIALIZED_PATTERNS: IndustryPattern[] = [
  // 🏥 Healthcare Patterns
  {
    id: 'medical-appointment',
    name: '医療予約管理システム',
    industry: 'healthcare',
    useCase: '病院・クリニックの予約管理',
    category: 'healthcare',
    complexity: 'moderate',
    colors: {
      primary: '#2563eb',
      secondary: '#dbeafe', 
      accent: '#1d4ed8',
      background: '#f8fafc',
      text: '#1e293b'
    },
    components: ['calendar', 'patient-forms', 'doctor-schedule', 'medical-records', 'notification-system'],
    layout: 'professional',
    mvpScore: 9,
    keyFeatures: ['患者情報管理', '予約スケジューリング', '診療履歴', '通知システム'],
    targetUsers: ['医師', '看護師', '受付', '患者'],
    businessLogic: ['予約重複防止', '患者プライバシー保護', '診療時間管理', 'キャンセル処理']
  },
  {
    id: 'pharmacy-inventory',
    name: '薬局在庫管理システム',
    industry: 'healthcare',
    useCase: '薬局の在庫・処方薬管理',
    category: 'healthcare',
    complexity: 'complex',
    colors: {
      primary: '#059669',
      secondary: '#d1fae5',
      accent: '#10b981',
      background: '#ffffff',
      text: '#064e3b'
    },
    components: ['drug-database', 'inventory-tracking', 'prescription-forms', 'expiry-alerts', 'supplier-management'],
    layout: 'enterprise',
    mvpScore: 8,
    keyFeatures: ['薬品在庫追跡', '処方薬管理', '期限切れアラート', '仕入先管理'],
    targetUsers: ['薬剤師', '薬局経営者', '仕入担当者'],
    businessLogic: ['在庫最適化', '期限管理', '処方箋照合', '法規制遵守']
  },

  // 🏫 Education Patterns  
  {
    id: 'lms-platform',
    name: 'オンライン学習管理システム',
    industry: 'education',
    useCase: 'e-ラーニングプラットフォーム',
    category: 'education',
    complexity: 'complex',
    colors: {
      primary: '#7c3aed',
      secondary: '#ede9fe',
      accent: '#a855f7',
      background: '#fafafa',
      text: '#4c1d95'
    },
    components: ['course-catalog', 'video-player', 'quiz-system', 'progress-tracking', 'discussion-forums'],
    layout: 'modern',
    mvpScore: 9,
    keyFeatures: ['コース管理', '進捗追跡', 'クイズ・テスト', '動画学習', 'ディスカッション'],
    targetUsers: ['学生', '教師', '管理者', '保護者'],
    businessLogic: ['学習進捗管理', '成績評価', 'コンテンツ配信', 'ユーザー認証']
  },
  {
    id: 'school-administration',
    name: '学校運営管理システム',
    industry: 'education',
    useCase: '学校の総合管理システム',
    category: 'education',
    complexity: 'complex',
    colors: {
      primary: '#dc2626',
      secondary: '#fecaca',
      accent: '#ef4444',
      background: '#ffffff',
      text: '#7f1d1d'
    },
    components: ['student-records', 'attendance-tracking', 'grade-management', 'parent-portal', 'staff-scheduling'],
    layout: 'enterprise',
    mvpScore: 8,
    keyFeatures: ['生徒情報管理', '出席管理', '成績管理', '保護者連絡', 'スタッフ管理'],
    targetUsers: ['教師', '管理者', '保護者', '生徒'],
    businessLogic: ['出席率計算', '成績統計', '保護者通知', '時間割管理']
  },

  // 💰 Finance Patterns
  {
    id: 'expense-tracker',
    name: '経費管理・家計簿アプリ',
    industry: 'finance',
    useCase: '個人・法人の経費管理',
    category: 'finance',
    complexity: 'moderate',
    colors: {
      primary: '#059669',
      secondary: '#ecfdf5',
      accent: '#10b981',
      background: '#ffffff',
      text: '#064e3b'
    },
    components: ['expense-forms', 'category-management', 'receipt-scanner', 'budget-tracking', 'reports-dashboard'],
    layout: 'modern',
    mvpScore: 9,
    keyFeatures: ['支出記録', 'カテゴリ分類', '予算管理', 'レシート読取', 'レポート生成'],
    targetUsers: ['個人ユーザー', '経理担当者', '中小企業経営者'],
    businessLogic: ['自動分類', '予算超過アラート', '月次集計', '税務対応']
  },
  {
    id: 'investment-portfolio',
    name: '投資ポートフォリオ管理',
    industry: 'finance',
    useCase: '投資資産の管理・分析',
    category: 'finance',
    complexity: 'complex',
    colors: {
      primary: '#1e40af',
      secondary: '#dbeafe',
      accent: '#2563eb',
      background: '#f8fafc',
      text: '#1e3a8a'
    },
    components: ['portfolio-dashboard', 'stock-charts', 'performance-analytics', 'risk-assessment', 'trading-interface'],
    layout: 'professional',
    mvpScore: 8,
    keyFeatures: ['ポートフォリオ分析', '銘柄チャート', 'リスク評価', 'パフォーマンス追跡'],
    targetUsers: ['個人投資家', 'ファイナンシャルアドバイザー', '機関投資家'],
    businessLogic: ['リアルタイム価格更新', 'リスク計算', 'リバランス提案', '税金計算']
  },

  // 🏨 Hospitality Patterns
  {
    id: 'hotel-reservation',
    name: 'ホテル予約管理システム',
    industry: 'hospitality',
    useCase: 'ホテル・旅館の予約管理',
    category: 'hospitality',
    complexity: 'moderate',
    colors: {
      primary: '#dc2626',
      secondary: '#fef2f2',
      accent: '#ef4444',
      background: '#ffffff',
      text: '#7f1d1d'
    },
    components: ['room-calendar', 'booking-forms', 'guest-management', 'pricing-engine', 'housekeeping-schedule'],
    layout: 'modern',
    mvpScore: 9,
    keyFeatures: ['客室管理', '予約カレンダー', 'ゲスト情報', '料金設定', 'ハウスキーピング'],
    targetUsers: ['フロントスタッフ', 'マネージャー', 'ハウスキーピング', 'ゲスト'],
    businessLogic: ['客室稼働率最適化', '季節料金調整', 'オーバーブッキング防止', 'チェックイン/アウト管理']
  },
  {
    id: 'restaurant-pos',
    name: 'レストランPOSシステム',
    industry: 'hospitality',
    useCase: 'レストランの注文・決済管理',
    category: 'hospitality',
    complexity: 'moderate',
    colors: {
      primary: '#ea580c',
      secondary: '#fed7aa',
      accent: '#f97316',
      background: '#ffffff',
      text: '#9a3412'
    },
    components: ['menu-display', 'order-management', 'payment-processing', 'table-management', 'kitchen-display'],
    layout: 'consumer',
    mvpScore: 8,
    keyFeatures: ['メニュー管理', '注文処理', '決済システム', 'テーブル管理', 'キッチン連携'],
    targetUsers: ['ウェイター', 'キッチンスタッフ', 'マネージャー', 'お客様'],
    businessLogic: ['注文フロー管理', '在庫連動', '売上分析', 'スタッフ管理']
  },

  // 🚚 Logistics Patterns
  {
    id: 'delivery-tracking',
    name: '配送追跡システム',
    industry: 'logistics',
    useCase: '荷物の配送状況管理',
    category: 'logistics',
    complexity: 'moderate',
    colors: {
      primary: '#0369a1',
      secondary: '#e0f2fe',
      accent: '#0284c7',
      background: '#f8fafc',
      text: '#0c4a6e'
    },
    components: ['tracking-map', 'delivery-status', 'driver-interface', 'customer-notifications', 'route-optimization'],
    layout: 'modern',
    mvpScore: 9,
    keyFeatures: ['リアルタイム追跡', 'ルート最適化', 'ドライバー管理', '配送状況通知'],
    targetUsers: ['配送ドライバー', 'オペレーター', 'お客様', '管理者'],
    businessLogic: ['GPS追跡', 'ルート計算', '配送予定計算', '異常検知']
  },
  {
    id: 'warehouse-management',
    name: '倉庫管理システム',
    industry: 'logistics',
    useCase: '倉庫内の在庫・作業管理',
    category: 'logistics',
    complexity: 'complex',
    colors: {
      primary: '#374151',
      secondary: '#f3f4f6',
      accent: '#6b7280',
      background: '#ffffff',
      text: '#111827'
    },
    components: ['inventory-grid', 'barcode-scanner', 'picking-lists', 'shipping-labels', 'stock-alerts'],
    layout: 'enterprise',
    mvpScore: 8,
    keyFeatures: ['在庫管理', 'バーコード管理', 'ピッキング', '出荷管理', 'アラート機能'],
    targetUsers: ['倉庫作業員', '在庫管理者', '出荷担当者', 'マネージャー'],
    businessLogic: ['在庫最適化', 'ピッキング効率化', '入出庫管理', 'ロケーション管理']
  },

  // 🏠 Real Estate Patterns
  {
    id: 'property-listing',
    name: '不動産物件検索サイト',
    industry: 'real-estate',
    useCase: '不動産物件の検索・閲覧',
    category: 'real-estate',
    complexity: 'moderate',
    colors: {
      primary: '#059669',
      secondary: '#ecfdf5',
      accent: '#10b981',
      background: '#ffffff',
      text: '#064e3b'
    },
    components: ['property-grid', 'search-filters', 'map-view', 'property-details', 'contact-forms'],
    layout: 'modern',
    mvpScore: 9,
    keyFeatures: ['物件検索', '地図表示', '詳細情報', '写真ギャラリー', '問い合わせ'],
    targetUsers: ['購入希望者', '賃貸希望者', '不動産業者', '売主'],
    businessLogic: ['検索最適化', '価格算定', '地域分析', 'マッチング機能']
  },
  {
    id: 'property-management',
    name: '不動産管理システム',
    industry: 'real-estate',
    useCase: '賃貸物件の管理・運営',
    category: 'real-estate',
    complexity: 'complex',
    colors: {
      primary: '#1e40af',
      secondary: '#dbeafe',
      accent: '#2563eb',
      background: '#f8fafc',
      text: '#1e3a8a'
    },
    components: ['tenant-management', 'rent-tracking', 'maintenance-requests', 'financial-reports', 'lease-management'],
    layout: 'professional',
    mvpScore: 8,
    keyFeatures: ['入居者管理', '賃料管理', 'メンテナンス', '財務レポート', '契約管理'],
    targetUsers: ['不動産管理会社', '大家', 'メンテナンス業者', '入居者'],
    businessLogic: ['賃料計算', '契約期間管理', 'メンテナンス調整', '収支管理']
  },

  // 🛒 E-commerce Variations
  {
    id: 'marketplace-platform',
    name: 'マルチベンダーマーケットプレイス',
    industry: 'ecommerce',
    useCase: '複数店舗が出店するECサイト',
    category: 'ecommerce',
    complexity: 'complex',
    colors: {
      primary: '#dc2626',
      secondary: '#fef2f2',
      accent: '#ef4444',
      background: '#ffffff',
      text: '#7f1d1d'
    },
    components: ['vendor-dashboard', 'product-catalog', 'order-management', 'payment-gateway', 'review-system'],
    layout: 'modern',
    mvpScore: 9,
    keyFeatures: ['店舗管理', '商品カタログ', '注文処理', '決済機能', 'レビューシステム'],
    targetUsers: ['出店者', '購入者', 'プラットフォーム運営者', '配送業者'],
    businessLogic: ['手数料計算', '売上分配', '在庫管理', '配送調整']
  },
  {
    id: 'subscription-commerce',
    name: 'サブスクリプションコマース',
    industry: 'ecommerce',
    useCase: '定期購入・サブスク型ECサイト',
    category: 'ecommerce',
    complexity: 'moderate',
    colors: {
      primary: '#7c3aed',
      secondary: '#ede9fe',
      accent: '#a855f7',
      background: '#fafafa',
      text: '#4c1d95'
    },
    components: ['subscription-plans', 'billing-management', 'delivery-schedule', 'customer-portal', 'analytics-dashboard'],
    layout: 'modern',
    mvpScore: 8,
    keyFeatures: ['プラン管理', '定期課金', '配送スケジュール', '顧客ポータル', '分析機能'],
    targetUsers: ['サブスク利用者', 'カスタマーサポート', 'マーケター', '経営者'],
    businessLogic: ['継続課金', '解約処理', '配送最適化', 'チャーン分析']
  }
];

/**
 * 業界特化パターン選択エンジン
 */
export class IndustryPatternSelector {
  
  /**
   * ユーザー入力から最適な業界パターンを選択
   */
  selectBestPattern(userInput: string, structuredData: any): IndustryPattern | null {
    const keywords = this.extractKeywords(userInput);
    console.log('🔍 [PATTERN] Input:', userInput);
    console.log('🔍 [PATTERN] Keywords found:', keywords);
    
    const scores = INDUSTRY_SPECIALIZED_PATTERNS.map(pattern => {
      const score = this.calculatePatternScore(pattern, keywords, structuredData);
      console.log(`🔍 [PATTERN] ${pattern.id}: score=${score.toFixed(3)} (industry=${pattern.industry})`);
      return { pattern, score };
    });
    
    // スコアでソート
    scores.sort((a, b) => b.score - a.score);
    
    // 最高スコアのパターンを返す（厳格な閾値チェック）
    const bestMatch = scores[0];
    console.log(`🔍 [PATTERN] Best match: ${bestMatch.pattern.id} (score=${bestMatch.score.toFixed(3)})`);
    console.log(`🔍 [PATTERN] Threshold check: ${bestMatch.score >= 0.7 ? 'PASS' : 'FAIL'}`);
    
    // 厳格な閾値（0.7）を設定して、確実にマッチする場合のみ業界パターンを使用
    return bestMatch.score >= 0.7 ? bestMatch.pattern : null;
  }

  /**
   * キーワード抽出
   */
  private extractKeywords(input: string): string[] {
    const industryKeywords = {
      'healthcare': ['医療', '病院', 'クリニック', '薬局', '患者', '診療', '予約', '健康'],
      'education': ['学校', '教育', '学習', '授業', '学生', '先生', 'eラーニング', 'LMS'],
      'finance': ['金融', '投資', '経費', '家計簿', '予算', '資産', 'ポートフォリオ', '銀行'],
      'hospitality': ['ホテル', 'レストラン', '予約', '宿泊', '料理', '接客', '旅館', 'POS'],
      'logistics': ['配送', '物流', '倉庫', '在庫', 'トラッキング', '運送', '配達'],
      'real-estate': ['不動産', '物件', '賃貸', '売買', '管理', 'マンション', '土地'],
      'ecommerce': ['ECサイト', 'ネットショップ', '通販', 'オンラインストア', '商品', '決済']
    };

    const found: string[] = [];
    Object.entries(industryKeywords).forEach(([industry, keywords]) => {
      if (keywords.some(keyword => input.includes(keyword))) {
        found.push(industry);
      }
    });

    return found;
  }

  /**
   * パターンスコア計算
   */
  private calculatePatternScore(pattern: IndustryPattern, keywords: string[], structuredData: any): number {
    let score = 0;

    // 業界マッチング（重要度: 50%）
    if (keywords.includes(pattern.industry)) {
      score += 0.5;
    }

    // 使用事例マッチング（重要度: 20%）
    const useCaseMatch = this.calculateTextSimilarity(structuredData.what || '', pattern.useCase);
    score += useCaseMatch * 0.2;

    // 機能マッチング（重要度: 15%）
    const featureMatch = pattern.keyFeatures.some(feature => 
      (structuredData.what || '').includes(feature)
    );
    if (featureMatch) score += 0.15;

    // キーワード密度ボーナス（重要度: 10%）
    const userInput = structuredData.what || '';
    const industryKeywords = this.getIndustryKeywords(pattern.industry);
    const keywordDensity = industryKeywords.filter(keyword => userInput.includes(keyword)).length / industryKeywords.length;
    score += keywordDensity * 0.1;

    // MVPスコア（重要度: 5%）
    score += (pattern.mvpScore / 10) * 0.05;

    return Math.min(score, 1.0);
  }

  private getIndustryKeywords(industry: string): string[] {
    const industryKeywords = {
      'healthcare': ['医療', '病院', 'クリニック', '薬局', '患者', '診療', '予約', '健康'],
      'education': ['学校', '教育', '学習', '授業', '学生', '先生', 'eラーニング', 'LMS'],
      'finance': ['金融', '投資', '経費', '家計簿', '予算', '資産', 'ポートフォリオ', '銀行'],
      'hospitality': ['ホテル', 'レストラン', '予約', '宿泊', '料理', '接客', '旅館', 'POS'],
      'logistics': ['配送', '物流', '倉庫', '在庫', 'トラッキング', '運送', '配達'],
      'real-estate': ['不動産', '物件', '賃貸', '売買', '管理', 'マンション', '土地'],
      'ecommerce': ['ECサイト', 'ネットショップ', '通販', 'オンラインストア', '商品', '決済']
    };
    return industryKeywords[industry] || [];
  }

  /**
   * テキスト類似度計算（簡易版）
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  /**
   * 全パターンリスト取得
   */
  getAllPatterns(): IndustryPattern[] {
    return INDUSTRY_SPECIALIZED_PATTERNS;
  }

  /**
   * 業界別パターン取得
   */
  getPatternsByIndustry(industry: string): IndustryPattern[] {
    return INDUSTRY_SPECIALIZED_PATTERNS.filter(pattern => pattern.industry === industry);
  }
}

export const industryPatternSelector = new IndustryPatternSelector();