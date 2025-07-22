// Intelligent Design Analyzer for automatic Figma template selection
export interface StructuredData {
  why: string;      // 課題・動機
  who: string;      // ターゲットユーザー
  what: string;     // 提供価値・機能
  how: string;      // 実現方法・手段
  impact: string;   // 期待効果・結果
}

export interface DesignContext {
  category: 'productivity' | 'creative' | 'business' | 'social' | 'ecommerce' | 'dashboard';
  complexity: 'simple' | 'moderate' | 'complex';
  targetAudience: 'general' | 'professional' | 'enterprise' | 'creative' | 'technical';
  primaryGoal: 'efficiency' | 'engagement' | 'conversion' | 'analysis' | 'collaboration';
  emotionalTone: 'serious' | 'friendly' | 'professional' | 'creative' | 'modern';
  confidenceScore: number; // 1-10
}

export interface ColorPersonality {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  reasoning: string;
}

export class IntelligentDesignAnalyzer {
  // Analyze user input and extract structured data
  analyzeUserInput(userInput: string): StructuredData {
    const input = userInput.toLowerCase();
    
    // Extract Why (problems, motivations)
    const why = this.extractWhy(input);
    
    // Extract Who (target users)
    const who = this.extractWho(input);
    
    // Extract What (features, value proposition)
    const what = this.extractWhat(input);
    
    // Extract How (implementation approach)
    const how = this.extractHow(input);
    
    // Extract Impact (expected outcomes)
    const impact = this.extractImpact(input);
    
    return { why, who, what, how, impact };
  }

  // Derive design context from structured data
  deriveDesignContext(structured: StructuredData): DesignContext {
    const category = this.determineCategory(structured);
    const complexity = this.determineComplexity(structured);
    const targetAudience = this.determineTargetAudience(structured);
    const primaryGoal = this.determinePrimaryGoal(structured);
    const emotionalTone = this.determineEmotionalTone(structured);
    const confidenceScore = this.calculateConfidenceScore(structured);
    
    return {
      category,
      complexity,
      targetAudience,
      primaryGoal,
      emotionalTone,
      confidenceScore
    };
  }

  // Generate personalized color palette
  generateColorPersonality(structured: StructuredData, context: DesignContext): ColorPersonality {
    const colorMapping = this.getColorMappingForContext(context);
    const emotionalColors = this.getEmotionalColors(context.emotionalTone);
    const industryColors = this.getIndustryColors(context.category);
    
    // Blend colors based on analysis
    const colors = this.blendColorSchemesIntelligently(colorMapping, emotionalColors, industryColors);
    
    const reasoning = this.generateColorReasoning(structured, context, colors);
    
    return {
      ...colors,
      reasoning
    };
  }

  private extractWhy(input: string): string {
    const whyPatterns = [
      /(?:なぜなら|理由は|課題は|問題は|困っている|解決したい)([^。]+)/g,
      /(?:because|since|due to|problem|issue|challenge)([^.]+)/gi,
      /(?:効率化|改善|最適化|解決)([^。]+)/g
    ];
    
    return this.extractByPatterns(input, whyPatterns) || 
           this.inferFromContext(input, 'why') ||
           '効率性と利便性の向上';
  }

  private extractWho(input: string): string {
    const whoPatterns = [
      /(?:ユーザーは|対象は|利用者は|ターゲットは)([^。]+)/g,
      /(?:users|customers|clients|target|audience)([^.]+)/gi,
      /(?:個人|企業|チーム|開発者|デザイナー|学生|ビジネス)([^。]*)/g
    ];
    
    return this.extractByPatterns(input, whoPatterns) || 
           this.inferFromContext(input, 'who') ||
           '一般的なユーザー';
  }

  private extractWhat(input: string): string {
    const whatPatterns = [
      /(?:機能は|提供するのは|できることは)([^。]+)/g,
      /(?:features|functionality|capabilities|provides)([^.]+)/gi,
      /(?:管理|作成|編集|共有|分析|表示)([^。]*)/g
    ];
    
    return this.extractByPatterns(input, whatPatterns) || 
           this.inferFromContext(input, 'what') ||
           'データの管理と操作';
  }

  private extractHow(input: string): string {
    const howPatterns = [
      /(?:方法は|手段は|どうやって|実現方法)([^。]+)/g,
      /(?:using|through|via|by means of)([^.]+)/gi,
      /(?:Web|アプリ|システム|プラットフォーム|インターフェース)([^。]*)/g
    ];
    
    return this.extractByPatterns(input, howPatterns) || 
           this.inferFromContext(input, 'how') ||
           'Webアプリケーションとして';
  }

  private extractImpact(input: string): string {
    const impactPatterns = [
      /(?:効果は|結果は|期待は|目標は)([^。]+)/g,
      /(?:impact|result|outcome|goal|objective)([^.]+)/gi,
      /(?:向上|改善|効率化|最適化|削減)([^。]*)/g
    ];
    
    return this.extractByPatterns(input, impactPatterns) || 
           this.inferFromContext(input, 'impact') ||
           '生産性とユーザー満足度の向上';
  }

  private extractByPatterns(input: string, patterns: RegExp[]): string | null {
    for (const pattern of patterns) {
      const matches = Array.from(input.matchAll(pattern));
      if (matches.length > 0) {
        return matches.map(m => m[1]?.trim()).filter(Boolean).join(', ') || null;
      }
    }
    return null;
  }

  private inferFromContext(input: string, type: string): string | null {
    const keywords = {
      why: ['効率', '改善', '解決', '最適化', '課題', '問題'],
      who: ['ユーザー', '企業', '個人', 'チーム', '開発者', 'ビジネス'],
      what: ['管理', '作成', '分析', '表示', '共有', '編集'],
      how: ['Web', 'アプリ', 'システム', 'ダッシュボード', 'フォーム'],
      impact: ['向上', '改善', '効率化', '削減', '最適化', '増加']
    };
    
    const typeKeywords = keywords[type as keyof typeof keywords] || [];
    const foundKeywords = typeKeywords.filter(keyword => input.includes(keyword));
    
    return foundKeywords.length > 0 ? `${foundKeywords.join('、')  }に関連` : null;
  }

  private determineCategory(structured: StructuredData): DesignContext['category'] {
    const categoryKeywords = {
      dashboard: ['分析', 'メトリクス', 'データ', 'レポート', 'グラフ', 'チャート', 'ダッシュボード'],
      productivity: ['タスク', '管理', 'TODO', 'プロジェクト', '効率', 'ワークフロー', '生産性', '業務管理', 'スケジュール'],
      creative: ['デザイン', 'クリエイティブ', 'アート', 'ポートフォリオ', '作品', '制作', 'レシピ', '料理', 'クリエーター', '創作', 'コンテンツ', 'メディア', '表現'],
      business: ['ビジネス', '企業', '営業', 'CRM', 'SaaS', '業務', '法人'],
      social: ['SNS', 'ソーシャル', 'コミュニティ', 'チャット', '交流', '共有', 'フォーラム', '掲示板', 'グループ'],
      ecommerce: ['EC', 'ショッピング', '販売', '商品', 'カート', '決済', 'オンラインストア', '通販', 'マーケット']
    };
    
    // 拡張カテゴリキーワード - より幅広いドメインをカバー
    const extendedKeywords = {
      creative: ['ゲーム', '攻略', 'エンターテイメント', '娯楽', '趣味', 'ホビー', '映画', '音楽', 'ブログ', 'メディア', 'コレクション', '図鑑', 'カタログ', '写真', 'ギャラリー'],
      social: ['フレンド', '友達', 'メンバー', '仲間', 'サークル', 'クラブ', 'イベント', 'ミーティング'],
      dashboard: ['統計', '集計', '監視', 'モニタリング', '追跡', 'トラッキング'],
      business: ['顧客', 'クライアント', '売上', '収益', '利益', '会計', '財務']
    };
    
    const allText = Object.values(structured).join(' ').toLowerCase();
    let maxScore = 0;
    let bestCategory: DesignContext['category'] = 'creative'; // デフォルトを変更
    
    // 基本キーワードマッチング
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      const score = keywords.reduce((sum, keyword) => {
        const count = (allText.match(new RegExp(keyword, 'g')) || []).length;
        return sum + count * 2; // 基本キーワードの重み増加
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category as DesignContext['category'];
      }
    });
    
    // 拡張キーワードマッチング
    Object.entries(extendedKeywords).forEach(([category, keywords]) => {
      const score = keywords.reduce((sum, keyword) => {
        const count = (allText.match(new RegExp(keyword, 'g')) || []).length;
        return sum + count;
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category as DesignContext['category'];
      }
    });
    
    // 強制的なカテゴリマッチング（確実に適用されるように）
    console.log('🔍 [CATEGORY-DEBUG] AllText:', allText);
    console.log('🔍 [CATEGORY-DEBUG] Current bestCategory before override:', bestCategory, 'maxScore:', maxScore);
    
    // 強制的な上書きルール
    if (allText.includes('ゲーム') || allText.includes('攻略') || allText.includes('データベース')) {
      console.log('🎮 [CATEGORY-OVERRIDE] Gaming/Database detected, forcing creative');
      bestCategory = 'creative';
      maxScore = 100; // 強制的に高スコア
    }
    if (allText.includes('レシピ') || allText.includes('料理') || allText.includes('調理')) {
      console.log('🍳 [CATEGORY-OVERRIDE] Recipe detected, forcing creative');
      bestCategory = 'creative';
      maxScore = 100; // 強制的に高スコア
    }
    
    console.log('🔍 [CATEGORY-DEBUG] Final bestCategory after override:', bestCategory);
    if (allText.includes('コレクション') || allText.includes('図鑑') || allText.includes('データベース')) {
      // データベース系は創作的な用途が多い
      if (allText.includes('ゲーム') || allText.includes('趣味') || allText.includes('コレクション')) {
        return 'creative';
      }
      return 'dashboard';
    }
    
    return bestCategory;
  }

  private determineComplexity(structured: StructuredData): DesignContext['complexity'] {
    const complexityIndicators = {
      simple: ['簡単', 'シンプル', '基本', '最小限', '単純'],
      moderate: ['中程度', '標準', '一般的', '普通'],
      complex: ['複雑', '高度', '詳細', '多機能', '企業級', 'エンタープライズ']
    };
    
    const allText = Object.values(structured).join(' ').toLowerCase();
    
    // Count feature mentions
    const featureCount = (allText.match(/機能|フィーチャー|できる/g) || []).length;
    const userTypeCount = (allText.match(/ユーザー|利用者|顧客/g) || []).length;
    
    if (featureCount > 5 || userTypeCount > 3) return 'complex';
    if (featureCount > 2 || userTypeCount > 1) return 'moderate';
    return 'simple';
  }

  private determineTargetAudience(structured: StructuredData): DesignContext['targetAudience'] {
    const audienceKeywords = {
      general: ['一般', '誰でも', '全員', 'みんな', '個人'],
      professional: ['プロフェッショナル', '専門家', '職業'],
      enterprise: ['企業', '法人', 'エンタープライズ', '大企業'],
      creative: ['クリエイター', 'デザイナー', 'アーティスト'],
      technical: ['開発者', 'エンジニア', 'プログラマー', '技術者']
    };
    
    const whoText = structured.who.toLowerCase();
    
    for (const [audience, keywords] of Object.entries(audienceKeywords)) {
      if (keywords.some(keyword => whoText.includes(keyword))) {
        return audience as DesignContext['targetAudience'];
      }
    }
    
    return 'general';
  }

  private determinePrimaryGoal(structured: StructuredData): DesignContext['primaryGoal'] {
    const goalKeywords = {
      efficiency: ['効率', '生産性', '時間短縮', '最適化'],
      engagement: ['エンゲージ', '交流', '参加', '活性化'],
      conversion: ['変換', '売上', '成約', 'コンバージョン'],
      analysis: ['分析', '解析', 'データ', '洞察'],
      collaboration: ['協力', 'チーム', '共同', 'コラボ']
    };
    
    const allText = Object.values(structured).join(' ').toLowerCase();
    
    for (const [goal, keywords] of Object.entries(goalKeywords)) {
      if (keywords.some(keyword => allText.includes(keyword))) {
        return goal as DesignContext['primaryGoal'];
      }
    }
    
    return 'efficiency';
  }

  private determineEmotionalTone(structured: StructuredData): DesignContext['emotionalTone'] {
    const toneKeywords = {
      serious: ['真剣', '厳格', '重要', 'ビジネス'],
      friendly: ['親しみやすい', 'フレンドリー', '気軽', 'カジュアル'],
      professional: ['プロフェッショナル', '専門的', '信頼性'],
      creative: ['クリエイティブ', '創造的', '革新的', 'イノベーティブ'],
      modern: ['モダン', '現代的', '最新', 'スタイリッシュ']
    };
    
    const allText = Object.values(structured).join(' ').toLowerCase();
    
    for (const [tone, keywords] of Object.entries(toneKeywords)) {
      if (keywords.some(keyword => allText.includes(keyword))) {
        return tone as DesignContext['emotionalTone'];
      }
    }
    
    return 'modern';
  }

  private calculateConfidenceScore(structured: StructuredData): number {
    let score = 5; // Base score
    
    // Add points for detailed information
    Object.values(structured).forEach(value => {
      if (value.length > 10) score += 1;
      if (value.length > 30) score += 1;
    });
    
    // Add points for specific keywords
    const allText = Object.values(structured).join(' ');
    const specificKeywords = ['具体的', '詳細', '明確', '目標', '要求'];
    specificKeywords.forEach(keyword => {
      if (allText.includes(keyword)) score += 0.5;
    });
    
    return Math.min(Math.max(score, 1), 10);
  }

  private getColorMappingForContext(context: DesignContext): Record<string, string> {
    const colorMap = {
      dashboard: { primary: '#1f2937', secondary: '#374151', accent: '#3b82f6' },
      productivity: { primary: '#059669', secondary: '#d1fae5', accent: '#10b981' },
      creative: { primary: '#7c3aed', secondary: '#ede9fe', accent: '#a855f7' },
      business: { primary: '#1e40af', secondary: '#dbeafe', accent: '#2563eb' },
      social: { primary: '#dc2626', secondary: '#fecaca', accent: '#ef4444' },
      ecommerce: { primary: '#f59e0b', secondary: '#fef3c7', accent: '#d97706' }
    };
    
    return colorMap[context.category] || colorMap.productivity;
  }

  private getEmotionalColors(tone: DesignContext['emotionalTone']): Record<string, string> {
    const emotionalMap = {
      serious: { primary: '#1f2937', secondary: '#4b5563', accent: '#374151' },
      friendly: { primary: '#22c55e', secondary: '#bbf7d0', accent: '#16a34a' },
      professional: { primary: '#1e40af', secondary: '#dbeafe', accent: '#3730a3' },
      creative: { primary: '#a855f7', secondary: '#e879f9', accent: '#c026d3' },
      modern: { primary: '#0ea5e9', secondary: '#38bdf8', accent: '#0284c7' }
    };
    
    return emotionalMap[tone] || emotionalMap.modern;
  }

  private getIndustryColors(category: DesignContext['category']): Record<string, string> {
    return this.getColorMappingForContext({ category } as DesignContext);
  }

  private blendColorSchemesIntelligently(
    base: Record<string, string>,
    emotional: Record<string, string>,
    industry: Record<string, string>
  ): Omit<ColorPersonality, 'reasoning'> {
    // Intelligent color blending algorithm
    return {
      primary: base.primary, // Keep base primary
      secondary: emotional.secondary, // Use emotional for secondary
      accent: industry.accent, // Use industry-specific accent
      background: '#ffffff',
      text: '#1f2937'
    };
  }

  private generateColorReasoning(
    structured: StructuredData,
    context: DesignContext,
    colors: Omit<ColorPersonality, 'reasoning'>
  ): string {
    return `${context.category}カテゴリーの${context.emotionalTone}な印象を重視し、${context.targetAudience}向けの配色を選択。${context.primaryGoal}を促進する色彩心理学に基づいて調整。`;
  }
}

export const intelligentDesignAnalyzer = new IntelligentDesignAnalyzer();