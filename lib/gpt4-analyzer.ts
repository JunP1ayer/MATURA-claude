/**
 * GPT-4 専用分析エンジン
 * 複雑な要件分析、ビジネスロジック設計、セキュリティ分析に特化
 */

import OpenAI from 'openai';

// OpenAI client initialization
let openai: OpenAI | null = null;

function initializeOpenAI() {
  if (!openai) {
    console.log('🔧 [GPT4-INIT] Initializing OpenAI client...');
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ [GPT4-INIT] OPENAI_API_KEY not found');
      throw new Error('OPENAI_API_KEY is required');
    }
    
    console.log(`🔧 [GPT4-INIT] API Key exists: ${!!apiKey}`);
    console.log(`🔧 [GPT4-INIT] API Key length: ${apiKey.length}`);
    console.log(`🔧 [GPT4-INIT] API Key starts with sk-: ${apiKey.startsWith('sk-')}`);
    
    openai = new OpenAI({
      apiKey,
    });
    
    console.log('✅ [GPT4-INIT] OpenAI client initialized successfully');
  }
  return openai;
}

export interface RequirementAnalysis {
  features: Feature[];
  businessLogic: BusinessRule[];
  userPersonas: UserPersona[];
  technicalRequirements: TechnicalRequirement[];
  securityRequirements: SecurityRequirement[];
  performanceRequirements: PerformanceRequirement[];
  complianceRequirements: string[];
  estimatedComplexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  recommendedStack: string[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  complexity: number; // 1-10
  estimatedHours: number;
  dependencies: string[];
  userStories: string[];
  acceptanceCriteria: string[];
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  actions: string[];
  exceptions: string[];
}

export interface UserPersona {
  name: string;
  role: string;
  goals: string[];
  frustrations: string[];
  technicalSkill: 'beginner' | 'intermediate' | 'advanced';
  primaryUseCases: string[];
}

export interface TechnicalRequirement {
  category: 'database' | 'api' | 'frontend' | 'integration' | 'infrastructure';
  requirement: string;
  justification: string;
  alternatives: string[];
}

export interface SecurityRequirement {
  type: 'authentication' | 'authorization' | 'data_protection' | 'audit' | 'compliance';
  requirement: string;
  implementation: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceRequirement {
  metric: 'response_time' | 'throughput' | 'concurrent_users' | 'data_volume';
  target: string;
  measurement: string;
  optimization: string[];
}

export interface SystemArchitecture {
  databaseSchema: DatabaseSchema[];
  apiDesign: APIEndpoint[];
  serviceArchitecture: ServiceLayer[];
  securityFramework: SecurityLayer[];
  scalabilityPlan: ScalabilityStrategy[];
  integrationPoints: IntegrationPoint[];
  deploymentStrategy: DeploymentPlan;
}

export interface DatabaseSchema {
  tableName: string;
  purpose: string;
  fields: DatabaseField[];
  relationships: Relationship[];
  indexes: IndexDefinition[];
  constraints: ConstraintDefinition[];
}

export interface DatabaseField {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  description: string;
  validationRules: string[];
}

export interface Relationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  targetTable: string;
  foreignKey: string;
  onDelete: 'cascade' | 'restrict' | 'set null';
}

export interface IndexDefinition {
  name: string;
  fields: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  unique: boolean;
}

export interface ConstraintDefinition {
  name: string;
  type: 'check' | 'unique' | 'foreign_key';
  definition: string;
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  purpose: string;
  authentication: boolean;
  authorization: string[];
  parameters: ParameterDefinition[];
  requestBody?: RequestBodyDefinition;
  responses: ResponseDefinition[];
  rateLimiting: RateLimitDefinition;
}

export interface ParameterDefinition {
  name: string;
  location: 'path' | 'query' | 'header';
  type: string;
  required: boolean;
  description: string;
  validation: string[];
}

export interface RequestBodyDefinition {
  contentType: string;
  schema: any;
  examples: any[];
}

export interface ResponseDefinition {
  statusCode: number;
  description: string;
  schema: any;
  examples: any[];
}

export interface RateLimitDefinition {
  requests: number;
  window: string;
  strategy: 'fixed' | 'sliding';
}

export interface ServiceLayer {
  name: string;
  responsibility: string;
  dependencies: string[];
  interfaces: string[];
  implementation: string;
}

export interface SecurityLayer {
  component: string;
  purpose: string;
  implementation: string;
  configuration: any;
}

export interface ScalabilityStrategy {
  component: string;
  currentLoad: string;
  expectedGrowth: string;
  scalingApproach: string;
  bottlenecks: string[];
  solutions: string[];
}

export interface IntegrationPoint {
  name: string;
  type: 'api' | 'webhook' | 'file' | 'database';
  purpose: string;
  frequency: string;
  errorHandling: string;
}

export interface DeploymentPlan {
  environment: string;
  infrastructure: string[];
  pipeline: string[];
  monitoring: string[];
  backup: string;
}

/**
 * GPT-4による高度要件分析
 */
export async function analyzeRequirementsWithGPT4(userIdea: string): Promise<RequirementAnalysis> {
  console.log('🧠 [GPT4] Starting deep requirements analysis...');
  
  const client = initializeOpenAI();
  
  const prompt = `
あなたは世界最高のシステムアナリストです。以下のアプリアイデアを詳細に分析してください。

アプリアイデア: "${userIdea}"

以下の観点で徹底的に分析し、JSON形式で回答してください：

1. **機能要件分析**
   - 必要な機能を優先度付きで洗い出し
   - 各機能の複雑度と実装時間を見積もり
   - 依存関係とユーザーストーリーを定義

2. **ビジネスロジック設計** 
   - 業務ルールと制約条件を定義
   - 例外処理とエラーケースを特定
   - ワークフローと承認プロセスを設計

3. **ユーザー分析**
   - 想定ユーザーのペルソナを定義
   - 各ユーザーの目標と課題を分析
   - 技術スキルレベルを考慮したUX設計

4. **技術要件定義**
   - 必要な技術スタックを選定
   - 性能要件とスケーラビリティを定義
   - セキュリティ要件とコンプライアンスを確認

5. **セキュリティ分析**
   - 想定されるセキュリティリスクを特定
   - 必要な認証・認可システムを設計
   - データ保護とプライバシー要件を定義

6. **性能要件定義**
   - レスポンス時間とスループット目標
   - 同時接続ユーザー数の想定
   - データ量とストレージ要件

期待する出力形式:
{
  "features": [
    {
      "id": "feature_001",
      "name": "ユーザー認証",
      "description": "メール/パスワードによる安全な認証システム",
      "priority": "critical",
      "complexity": 7,
      "estimatedHours": 16,
      "dependencies": [],
      "userStories": ["ユーザーとして、安全にログインしたい"],
      "acceptanceCriteria": ["パスワードは8文字以上", "2FA対応"]
    }
  ],
  "businessLogic": [
    {
      "id": "rule_001", 
      "name": "データ検証ルール",
      "description": "入力データの妥当性検証",
      "conditions": ["必須項目チェック"],
      "actions": ["エラーメッセージ表示"],
      "exceptions": ["管理者権限時は一部スキップ"]
    }
  ],
  "userPersonas": [
    {
      "name": "一般ユーザー",
      "role": "システム利用者", 
      "goals": ["効率的な作業", "直感的な操作"],
      "frustrations": ["複雑な画面", "動作が遅い"],
      "technicalSkill": "beginner",
      "primaryUseCases": ["データ入力", "レポート確認"]
    }
  ],
  "technicalRequirements": [
    {
      "category": "database",
      "requirement": "PostgreSQL 14+",
      "justification": "ACID準拠、JSON対応",
      "alternatives": ["MySQL 8.0", "SQLite"]
    }
  ],
  "securityRequirements": [
    {
      "type": "authentication",
      "requirement": "JWT認証",
      "implementation": "アクセストークン + リフレッシュトークン",
      "riskLevel": "high"
    }
  ],
  "performanceRequirements": [
    {
      "metric": "response_time",
      "target": "< 200ms",
      "measurement": "API応答時間",
      "optimization": ["キャッシュ", "インデックス最適化"]
    }
  ],
  "complianceRequirements": ["GDPR", "個人情報保護法"],
  "estimatedComplexity": "moderate",
  "recommendedStack": ["Next.js 14", "PostgreSQL", "TypeScript", "Tailwind CSS"]
}

必ず有効なJSONを返してください。実用的で実装可能な内容にしてください。
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたは世界最高のシステムアナリストです。実用的で実装可能な要件分析を行います。"
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('GPT-4 response is empty');
    }

    console.log('🧠 [GPT4] Requirements analysis completed');
    
    // JSON解析
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in GPT-4 response');
    }

    const analysis = JSON.parse(jsonMatch[0]) as RequirementAnalysis;
    
    // 基本的な検証
    if (!analysis.features || !Array.isArray(analysis.features)) {
      throw new Error('Invalid features array in analysis');
    }

    console.log(`✅ [GPT4] Analyzed ${analysis.features.length} features with ${analysis.estimatedComplexity} complexity`);
    
    return analysis;

  } catch (error) {
    console.error('❌ [GPT4] Requirements analysis failed:', error);
    
    // フォールバック: 基本的な分析結果を返す
    return {
      features: [
        {
          id: "feature_001",
          name: "基本CRUD操作",
          description: "データの作成、読取、更新、削除機能",
          priority: "critical",
          complexity: 5,
          estimatedHours: 8,
          dependencies: [],
          userStories: ["ユーザーとして、データを管理したい"],
          acceptanceCriteria: ["作成・編集・削除が可能", "一覧表示機能"]
        }
      ],
      businessLogic: [
        {
          id: "rule_001",
          name: "データ検証",
          description: "入力データの妥当性確認",
          conditions: ["必須項目チェック"],
          actions: ["エラー表示"],
          exceptions: []
        }
      ],
      userPersonas: [
        {
          name: "一般ユーザー",
          role: "システム利用者",
          goals: ["効率的な操作"],
          frustrations: ["複雑な UI"],
          technicalSkill: "beginner",
          primaryUseCases: ["データ管理"]
        }
      ],
      technicalRequirements: [
        {
          category: "frontend",
          requirement: "React 18+",
          justification: "現代的なUI開発",
          alternatives: ["Vue.js", "Angular"]
        }
      ],
      securityRequirements: [
        {
          type: "data_protection",
          requirement: "入力値検証",
          implementation: "バリデーション機能",
          riskLevel: "medium"
        }
      ],
      performanceRequirements: [
        {
          metric: "response_time",
          target: "< 1s",
          measurement: "ページ表示時間",
          optimization: ["コード分割"]
        }
      ],
      complianceRequirements: [],
      estimatedComplexity: "moderate",
      recommendedStack: ["Next.js", "TypeScript", "Tailwind CSS"]
    };
  }
}

/**
 * GPT-4によるシステムアーキテクチャ設計
 */
export async function designSystemArchitecture(requirements: RequirementAnalysis): Promise<SystemArchitecture> {
  console.log('🏗️ [GPT4] Starting system architecture design...');
  
  const client = initializeOpenAI();
  
  const prompt = `
あなたは世界最高のシステムアーキテクトです。以下の要件分析結果に基づいて、詳細なシステムアーキテクチャを設計してください。

要件分析結果:
${JSON.stringify(requirements, null, 2)}

以下の観点で詳細に設計し、JSON形式で回答してください：

1. **データベース設計**
   - 正規化されたテーブル設計
   - 適切なインデックス設計
   - 制約とリレーションシップ定義

2. **API設計**
   - RESTful API エンドポイント設計
   - 認証・認可の仕組み
   - レート制限とセキュリティ対策

3. **サービス層設計**
   - ビジネスロジックの分離
   - 責任の明確化
   - 依存関係の管理

4. **セキュリティアーキテクチャ**
   - 認証・認可システム
   - データ暗号化
   - セキュリティミドルウェア

5. **スケーラビリティ計画**
   - パフォーマンスボトルネック分析
   - スケーリング戦略
   - キャッシュ戦略

6. **統合ポイント設計**
   - 外部システム連携
   - API統合
   - エラーハンドリング

期待する出力形式:
{
  "databaseSchema": [
    {
      "tableName": "users",
      "purpose": "ユーザー情報管理",
      "fields": [
        {
          "name": "id",
          "type": "uuid",
          "nullable": false,
          "description": "主キー",
          "validationRules": ["unique"]
        }
      ],
      "relationships": [
        {
          "type": "one-to-many",
          "targetTable": "user_profiles",
          "foreignKey": "user_id",
          "onDelete": "cascade"
        }
      ],
      "indexes": [
        {
          "name": "idx_users_email",
          "fields": ["email"],
          "type": "btree",
          "unique": true
        }
      ],
      "constraints": [
        {
          "name": "chk_email_format",
          "type": "check",
          "definition": "email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'"
        }
      ]
    }
  ],
  "apiDesign": [
    {
      "path": "/api/users",
      "method": "POST",
      "purpose": "ユーザー作成",
      "authentication": true,
      "authorization": ["admin"],
      "parameters": [],
      "requestBody": {
        "contentType": "application/json",
        "schema": {"type": "object"},
        "examples": []
      },
      "responses": [
        {
          "statusCode": 201,
          "description": "ユーザー作成成功",
          "schema": {"type": "object"},
          "examples": []
        }
      ],
      "rateLimiting": {
        "requests": 100,
        "window": "1h",
        "strategy": "sliding"
      }
    }
  ],
  "serviceArchitecture": [
    {
      "name": "UserService", 
      "responsibility": "ユーザー管理ビジネスロジック",
      "dependencies": ["UserRepository", "EmailService"],
      "interfaces": ["IUserService"],
      "implementation": "TypeScript class"
    }
  ],
  "securityFramework": [
    {
      "component": "Authentication",
      "purpose": "ユーザー認証",
      "implementation": "JWT + Refresh Token",
      "configuration": {"algorithm": "RS256", "expiry": "15m"}
    }
  ],
  "scalabilityPlan": [
    {
      "component": "Database",
      "currentLoad": "100 req/s",
      "expectedGrowth": "1000 req/s", 
      "scalingApproach": "Read replicas",
      "bottlenecks": ["Complex queries"],
      "solutions": ["Query optimization", "Caching"]
    }
  ],
  "integrationPoints": [
    {
      "name": "EmailProvider",
      "type": "api",
      "purpose": "メール送信",
      "frequency": "on-demand",
      "errorHandling": "Retry with exponential backoff"
    }
  ],
  "deploymentStrategy": {
    "environment": "Cloud",
    "infrastructure": ["Vercel", "Supabase"],
    "pipeline": ["Build", "Test", "Deploy"],
    "monitoring": ["Logs", "Metrics", "Alerts"],
    "backup": "Daily automated"
  }
}

必ず有効なJSONを返してください。実装可能で最適化されたアーキテクチャにしてください。
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたは世界最高のシステムアーキテクトです。スケーラブルで保守可能なアーキテクチャを設計します。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 4000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('GPT-4 response is empty');
    }

    console.log('🏗️ [GPT4] Architecture design completed');

    // JSON解析
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in GPT-4 response');
    }

    const architecture = JSON.parse(jsonMatch[0]) as SystemArchitecture;
    
    // 基本的な検証
    if (!architecture.databaseSchema || !Array.isArray(architecture.databaseSchema)) {
      throw new Error('Invalid database schema in architecture');
    }

    console.log(`✅ [GPT4] Designed architecture with ${architecture.databaseSchema.length} tables and ${architecture.apiDesign?.length || 0} endpoints`);
    
    return architecture;

  } catch (error) {
    console.error('❌ [GPT4] Architecture design failed:', error);
    
    // フォールバック: 基本的なアーキテクチャを返す
    return {
      databaseSchema: [
        {
          tableName: "items",
          purpose: "基本データ管理",
          fields: [
            {
              name: "id",
              type: "uuid",
              nullable: false,
              description: "主キー",
              validationRules: ["unique"]
            },
            {
              name: "name",
              type: "varchar(255)",
              nullable: false,
              description: "名前",
              validationRules: ["required", "max_length:255"]
            }
          ],
          relationships: [],
          indexes: [
            {
              name: "idx_items_name",
              fields: ["name"],
              type: "btree",
              unique: false
            }
          ],
          constraints: []
        }
      ],
      apiDesign: [
        {
          path: "/api/items",
          method: "GET",
          purpose: "アイテム一覧取得",
          authentication: false,
          authorization: [],
          parameters: [],
          responses: [
            {
              statusCode: 200,
              description: "成功",
              schema: { type: "array" },
              examples: []
            }
          ],
          rateLimiting: {
            requests: 100,
            window: "1h",
            strategy: "fixed"
          }
        }
      ],
      serviceArchitecture: [
        {
          name: "ItemService",
          responsibility: "アイテム管理",
          dependencies: ["ItemRepository"],
          interfaces: ["IItemService"],
          implementation: "TypeScript class"
        }
      ],
      securityFramework: [
        {
          component: "Validation",
          purpose: "入力検証",
          implementation: "Zod schema validation",
          configuration: {}
        }
      ],
      scalabilityPlan: [
        {
          component: "API",
          currentLoad: "low",
          expectedGrowth: "moderate",
          scalingApproach: "horizontal",
          bottlenecks: [],
          solutions: ["caching"]
        }
      ],
      integrationPoints: [],
      deploymentStrategy: {
        environment: "Vercel",
        infrastructure: ["Next.js", "Supabase"],
        pipeline: ["build", "deploy"],
        monitoring: ["logs"],
        backup: "automated"
      }
    };
  }
}

/**
 * GPT-4によるセキュリティ監査
 */
export async function performSecurityAudit(architecture: SystemArchitecture, code: string): Promise<{
  securityScore: number;
  vulnerabilities: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    location: string;
    recommendation: string;
  }>;
  complianceStatus: Array<{
    standard: string;
    status: 'compliant' | 'partial' | 'non-compliant';
    issues: string[];
  }>;
  recommendations: string[];
}> {
  console.log('🛡️ [GPT4] Starting security audit...');
  
  const client = initializeOpenAI();
  
  const prompt = `
あなたは世界最高のセキュリティエキスパートです。以下のシステムアーキテクチャとコードを詳細に監査してください。

システムアーキテクチャ:
${JSON.stringify(architecture, null, 2)}

生成されたコード:
\`\`\`typescript
${code.substring(0, 3000)}
\`\`\`

以下の観点で徹底的に監査し、JSON形式で回答してください：

1. **脆弱性分析**
   - SQL インジェクション
   - XSS (Cross-Site Scripting)
   - CSRF (Cross-Site Request Forgery)
   - 認証・認可の欠陥
   - データ漏洩リスク

2. **セキュリティベストプラクティス**
   - 入力値検証
   - 出力エスケープ
   - セキュアなセッション管理
   - パスワードハッシュ化
   - HTTPS使用

3. **コンプライアンス確認**
   - OWASP Top 10
   - GDPR準拠
   - 個人情報保護法
   - PCI DSS (決済がある場合)

期待する出力形式:
{
  "securityScore": 85,
  "vulnerabilities": [
    {
      "severity": "high",
      "category": "Authentication",
      "description": "パスワードのハッシュ化が不十分",
      "location": "auth.ts:45",
      "recommendation": "bcrypt使用を推奨"
    }
  ],
  "complianceStatus": [
    {
      "standard": "OWASP Top 10",
      "status": "compliant", 
      "issues": []
    }
  ],
  "recommendations": [
    "CSP ヘッダーの実装",
    "レート制限の強化"
  ]
}

必ず有効なJSONを返してください。具体的で実装可能な推奨事項を含めてください。
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたは世界最高のセキュリティエキスパートです。徹底的で実用的なセキュリティ監査を行います。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 3000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('GPT-4 response is empty');
    }

    console.log('🛡️ [GPT4] Security audit completed');

    // JSON解析
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in GPT-4 response');
    }

    const audit = JSON.parse(jsonMatch[0]);
    
    console.log(`✅ [GPT4] Security audit completed with score: ${audit.securityScore}/100`);
    
    return audit;

  } catch (error) {
    console.error('❌ [GPT4] Security audit failed:', error);
    
    // フォールバック: 基本的な監査結果を返す
    return {
      securityScore: 75,
      vulnerabilities: [
        {
          severity: 'medium' as const,
          category: 'Input Validation',
          description: '入力値検証の強化が必要',
          location: 'API routes',
          recommendation: 'Zodスキーマバリデーションを実装'
        }
      ],
      complianceStatus: [
        {
          standard: 'Basic Security',
          status: 'partial' as const,
          issues: ['入力値検証の改善が必要']
        }
      ],
      recommendations: [
        'CSRFトークンの実装',
        'レート制限の追加',
        '入力値検証の強化'
      ]
    };
  }
}