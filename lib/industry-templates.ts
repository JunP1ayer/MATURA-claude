/**
 * 業界特化テンプレート定義
 * 各業界に最適化されたシステムテンプレート
 */

export interface IndustryTemplate {
  id: string
  name: string
  industry: string
  description: string
  prompt: string
  schema: any
  features: string[]
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  sampleData?: Record<string, any[]>
  placeholders?: Record<string, string>
}

export const industryTemplates: IndustryTemplate[] = [
  {
    id: 'beauty-reservation',
    name: '美容院予約管理システム',
    industry: '美容院・サロン',
    description: 'オンライン予約、顧客管理、スタッフスケジュール管理を統合したシステム',
    prompt: '美容院向けの予約管理システムを作成してください。以下の機能が必要です：\n1. オンライン予約機能（日時選択、スタッフ指名）\n2. 顧客管理（来店履歴、施術記録、連絡先）\n3. スタッフ管理（スケジュール、技術レベル、売上実績）\n4. メニュー管理（サービス内容、料金、所要時間）\n5. 予約状況の可視化（カレンダー表示、空き時間確認）',
    schema: {
      customers: {
        fields: {
          id: { type: 'uuid', primary: true },
          name: { type: 'varchar', required: true, label: 'お客様名' },
          phone: { type: 'varchar', required: true, label: '電話番号' },
          email: { type: 'varchar', label: 'メールアドレス' },
          birthday: { type: 'date', label: '誕生日' },
          last_visit: { type: 'timestamp', label: '最終来店日' },
          notes: { type: 'text', label: '備考・アレルギー等' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      },
      staff: {
        fields: {
          id: { type: 'uuid', primary: true },
          name: { type: 'varchar', required: true, label: 'スタッフ名' },
          specialties: { type: 'varchar', label: '専門技術' },
          experience_years: { type: 'integer', label: '経験年数' },
          hourly_rate: { type: 'decimal', label: '時給' },
          is_active: { type: 'boolean', default: true, label: '勤務中' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      },
      services: {
        fields: {
          id: { type: 'uuid', primary: true },
          name: { type: 'varchar', required: true, label: 'サービス名' },
          description: { type: 'text', label: '詳細説明' },
          duration_minutes: { type: 'integer', required: true, label: '所要時間（分）' },
          price: { type: 'decimal', required: true, label: '料金' },
          category: { type: 'varchar', label: 'カテゴリ' },
          is_active: { type: 'boolean', default: true, label: '提供中' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      },
      reservations: {
        fields: {
          id: { type: 'uuid', primary: true },
          customer_id: { type: 'uuid', foreign_key: 'customers.id', required: true },
          staff_id: { type: 'uuid', foreign_key: 'staff.id', required: true },
          service_id: { type: 'uuid', foreign_key: 'services.id', required: true },
          reservation_date: { type: 'date', required: true, label: '予約日' },
          start_time: { type: 'time', required: true, label: '開始時間' },
          end_time: { type: 'time', required: true, label: '終了時間' },
          status: { type: 'varchar', default: 'confirmed', label: 'ステータス' },
          notes: { type: 'text', label: '備考' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      }
    },
    features: [
      '24時間オンライン予約受付',
      'スタッフ指名機能',
      '顧客来店履歴管理',
      '予約リマインダー',
      'カレンダー表示',
      '売上集計機能'
    ],
    estimatedTime: '30分',
    difficulty: 'beginner',
    sampleData: {
      customers: [
        { name: '田中花子', phone: '090-1234-5678', email: 'hanako@example.com', birthday: '1985-05-15', notes: 'カラーアレルギーなし' },
        { name: '佐藤太郎', phone: '080-9876-5432', email: 'taro@example.com', birthday: '1992-10-20', notes: '肌が敏感' },
        { name: '山田美咲', phone: '070-1111-2222', email: 'misaki@example.com', birthday: '1990-03-08', notes: 'ロングヘア希望' }
      ],
      services: [
        { name: 'カット', description: 'シャンプー・ブロー込み', duration_minutes: 60, price: 4500, category: 'ベーシック' },
        { name: 'カラー', description: 'リタッチカラー', duration_minutes: 90, price: 6500, category: 'カラー' },
        { name: 'パーマ', description: 'デジタルパーマ', duration_minutes: 120, price: 9800, category: 'パーマ' },
        { name: 'トリートメント', description: 'ケラチントリートメント', duration_minutes: 30, price: 3000, category: 'ケア' }
      ]
    },
    placeholders: {
      customerName: '例：田中花子',
      phone: '例：090-1234-5678',
      serviceName: '例：カット・シャンプー・ブロー',
      notes: '例：アレルギー情報、特別な要望など'
    }
  },
  {
    id: 'inventory-management',
    name: '在庫管理システム',
    industry: '製造業・小売業',
    description: '商品・原材料の入出庫管理、在庫状況の可視化、発注管理システム',
    prompt: '在庫管理システムを作成してください。以下の機能が必要です：\n1. 商品・原材料管理（商品コード、名称、カテゴリ、単価）\n2. 入出庫管理（入庫・出庫記録、在庫数リアルタイム更新）\n3. 発注管理（発注点設定、自動発注アラート、仕入先管理）\n4. 在庫状況確認（一覧表示、検索、フィルタ機能）\n5. 在庫分析（回転率、滞留在庫、ABC分析）',
    schema: {
      products: {
        fields: {
          id: { type: 'uuid', primary: true },
          code: { type: 'varchar', required: true, unique: true, label: '商品コード' },
          name: { type: 'varchar', required: true, label: '商品名' },
          category: { type: 'varchar', label: 'カテゴリ' },
          unit: { type: 'varchar', default: '個', label: '単位' },
          unit_price: { type: 'decimal', label: '単価' },
          current_stock: { type: 'integer', default: 0, label: '現在庫数' },
          min_stock: { type: 'integer', default: 10, label: '最小在庫数' },
          max_stock: { type: 'integer', label: '最大在庫数' },
          supplier: { type: 'varchar', label: '仕入先' },
          location: { type: 'varchar', label: '保管場所' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      },
      stock_movements: {
        fields: {
          id: { type: 'uuid', primary: true },
          product_id: { type: 'uuid', foreign_key: 'products.id', required: true },
          movement_type: { type: 'varchar', required: true, label: '入出庫区分' },
          quantity: { type: 'integer', required: true, label: '数量' },
          unit_price: { type: 'decimal', label: '単価' },
          reference_number: { type: 'varchar', label: '伝票番号' },
          notes: { type: 'text', label: '備考' },
          movement_date: { type: 'timestamp', default: 'now()', label: '日時' },
          created_by: { type: 'varchar', label: '担当者' }
        }
      },
      suppliers: {
        fields: {
          id: { type: 'uuid', primary: true },
          name: { type: 'varchar', required: true, label: '仕入先名' },
          contact_person: { type: 'varchar', label: '担当者' },
          phone: { type: 'varchar', label: '電話番号' },
          email: { type: 'varchar', label: 'メールアドレス' },
          address: { type: 'text', label: '住所' },
          payment_terms: { type: 'varchar', label: '支払条件' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      }
    },
    features: [
      'リアルタイム在庫管理',
      '入出庫履歴追跡',
      '発注アラート',
      '仕入先管理',
      '在庫分析レポート',
      'バーコード対応'
    ],
    estimatedTime: '45分',
    difficulty: 'intermediate'
  },
  {
    id: 'pos-system',
    name: 'POSシステム',
    industry: '小売業・飲食業',
    description: '販売時点管理、売上集計、商品管理、顧客管理を統合したシステム',
    prompt: 'POS（販売時点管理）システムを作成してください。以下の機能が必要です：\n1. 商品管理（商品登録、価格設定、在庫数管理）\n2. 販売処理（バーコード読取、会計処理、レシート発行）\n3. 売上管理（日別・商品別売上、時間帯分析）\n4. 顧客管理（会員登録、ポイント管理、購入履歴）\n5. 店舗運営（レジ締め、返品処理、割引管理）',
    schema: {
      products: {
        fields: {
          id: { type: 'uuid', primary: true },
          barcode: { type: 'varchar', unique: true, label: 'バーコード' },
          name: { type: 'varchar', required: true, label: '商品名' },
          category: { type: 'varchar', label: 'カテゴリ' },
          price: { type: 'decimal', required: true, label: '販売価格' },
          cost: { type: 'decimal', label: '原価' },
          stock_quantity: { type: 'integer', default: 0, label: '在庫数' },
          tax_rate: { type: 'decimal', default: 0.10, label: '税率' },
          is_active: { type: 'boolean', default: true, label: '販売中' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      },
      customers: {
        fields: {
          id: { type: 'uuid', primary: true },
          member_number: { type: 'varchar', unique: true, label: '会員番号' },
          name: { type: 'varchar', required: true, label: '顧客名' },
          phone: { type: 'varchar', label: '電話番号' },
          email: { type: 'varchar', label: 'メールアドレス' },
          points: { type: 'integer', default: 0, label: 'ポイント' },
          total_purchases: { type: 'decimal', default: 0, label: '累計購入額' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      },
      sales: {
        fields: {
          id: { type: 'uuid', primary: true },
          receipt_number: { type: 'varchar', unique: true, label: 'レシート番号' },
          customer_id: { type: 'uuid', foreign_key: 'customers.id', nullable: true },
          total_amount: { type: 'decimal', required: true, label: '合計金額' },
          tax_amount: { type: 'decimal', default: 0, label: '税額' },
          discount_amount: { type: 'decimal', default: 0, label: '割引額' },
          payment_method: { type: 'varchar', default: 'cash', label: '支払方法' },
          cashier: { type: 'varchar', label: 'レジ担当者' },
          sale_date: { type: 'timestamp', default: 'now()', label: '販売日時' }
        }
      },
      sale_items: {
        fields: {
          id: { type: 'uuid', primary: true },
          sale_id: { type: 'uuid', foreign_key: 'sales.id', required: true },
          product_id: { type: 'uuid', foreign_key: 'products.id', required: true },
          quantity: { type: 'integer', required: true, label: '数量' },
          unit_price: { type: 'decimal', required: true, label: '単価' },
          subtotal: { type: 'decimal', required: true, label: '小計' }
        }
      }
    },
    features: [
      'バーコード読取対応',
      'リアルタイム売上集計',
      '会員ポイント管理',
      '時間帯別売上分析',
      'レシート発行',
      '返品・交換処理'
    ],
    estimatedTime: '60分',
    difficulty: 'advanced'
  },
  {
    id: 'task-management',
    name: 'タスク管理システム',
    industry: '全業種',
    description: 'チーム・個人のタスク管理、プロジェクト進捗管理、工数管理システム',
    prompt: 'タスク管理システムを作成してください。以下の機能が必要です：\n1. タスク管理（作成、編集、削除、ステータス管理）\n2. プロジェクト管理（プロジェクト作成、メンバー管理、進捗追跡）\n3. 工数管理（作業時間記録、工数集計、予実管理）\n4. チーム管理（メンバー管理、権限設定、通知機能）\n5. レポート機能（進捗レポート、工数レポート、生産性分析）',
    schema: {
      projects: {
        fields: {
          id: { type: 'uuid', primary: true },
          name: { type: 'varchar', required: true, label: 'プロジェクト名' },
          description: { type: 'text', label: '説明' },
          start_date: { type: 'date', label: '開始日' },
          end_date: { type: 'date', label: '終了予定日' },
          status: { type: 'varchar', default: 'active', label: 'ステータス' },
          manager_id: { type: 'uuid', label: 'プロジェクトマネージャー' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      },
      members: {
        fields: {
          id: { type: 'uuid', primary: true },
          name: { type: 'varchar', required: true, label: 'メンバー名' },
          email: { type: 'varchar', unique: true, label: 'メールアドレス' },
          role: { type: 'varchar', default: 'member', label: '役割' },
          hourly_rate: { type: 'decimal', label: '時給' },
          is_active: { type: 'boolean', default: true, label: 'アクティブ' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      },
      tasks: {
        fields: {
          id: { type: 'uuid', primary: true },
          project_id: { type: 'uuid', foreign_key: 'projects.id', required: true },
          assignee_id: { type: 'uuid', foreign_key: 'members.id', nullable: true },
          title: { type: 'varchar', required: true, label: 'タスク名' },
          description: { type: 'text', label: '詳細' },
          priority: { type: 'varchar', default: 'medium', label: '優先度' },
          status: { type: 'varchar', default: 'todo', label: 'ステータス' },
          estimated_hours: { type: 'decimal', label: '見積工数' },
          actual_hours: { type: 'decimal', default: 0, label: '実績工数' },
          due_date: { type: 'date', label: '期限' },
          created_at: { type: 'timestamp', default: 'now()' },
          updated_at: { type: 'timestamp', default: 'now()' }
        }
      },
      time_logs: {
        fields: {
          id: { type: 'uuid', primary: true },
          task_id: { type: 'uuid', foreign_key: 'tasks.id', required: true },
          member_id: { type: 'uuid', foreign_key: 'members.id', required: true },
          hours: { type: 'decimal', required: true, label: '作業時間' },
          description: { type: 'text', label: '作業内容' },
          work_date: { type: 'date', required: true, label: '作業日' },
          created_at: { type: 'timestamp', default: 'now()' }
        }
      }
    },
    features: [
      'カンバンボード表示',
      'ガントチャート',
      '工数管理・集計',
      'プロジェクト進捗追跡',
      'メンバー生産性分析',
      '通知・リマインダー'
    ],
    estimatedTime: '45分',
    difficulty: 'intermediate'
  }
]

/**
 * 業界・キーワードから最適なテンプレートを検索
 */
export function findTemplateByKeywords(input: string): IndustryTemplate | null {
  const keywords = input.toLowerCase()
  
  // 美容院・サロン関連キーワード
  if (keywords.includes('美容院') || keywords.includes('サロン') || keywords.includes('予約') || 
      keywords.includes('カット') || keywords.includes('美容師') || keywords.includes('施術')) {
    return industryTemplates.find(t => t.id === 'beauty-reservation') || null
  }
  
  // 在庫管理関連キーワード
  if (keywords.includes('在庫') || keywords.includes('inventory') || keywords.includes('発注') ||
      keywords.includes('入庫') || keywords.includes('出庫') || keywords.includes('倉庫')) {
    return industryTemplates.find(t => t.id === 'inventory-management') || null
  }
  
  // POS・販売関連キーワード
  if (keywords.includes('pos') || keywords.includes('販売') || keywords.includes('レジ') ||
      keywords.includes('小売') || keywords.includes('店舗') || keywords.includes('会計')) {
    return industryTemplates.find(t => t.id === 'pos-system') || null
  }
  
  // タスク管理関連キーワード
  if (keywords.includes('タスク') || keywords.includes('プロジェクト') || keywords.includes('todo') ||
      keywords.includes('進捗') || keywords.includes('工数') || keywords.includes('チーム')) {
    return industryTemplates.find(t => t.id === 'task-management') || null
  }
  
  return null
}

/**
 * 業界IDから特定のテンプレートを取得
 */
export function getTemplateById(id: string): IndustryTemplate | null {
  return industryTemplates.find(t => t.id === id) || null
}

/**
 * 業界別にテンプレートをグループ化
 */
export function getTemplatesByIndustry(): Record<string, IndustryTemplate[]> {
  return industryTemplates.reduce((acc, template) => {
    if (!acc[template.industry]) {
      acc[template.industry] = []
    }
    acc[template.industry].push(template)
    return acc
  }, {} as Record<string, IndustryTemplate[]>)
}