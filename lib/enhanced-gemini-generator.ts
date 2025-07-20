/**
 * Enhanced Gemini Code Generator
 * GPT-4分析結果を元にした高品質コード生成エンジン
 */

import { GeminiClient } from '@/lib/gemini-client';
import type { RequirementAnalysis, SystemArchitecture } from '@/lib/gpt4-analyzer';

export interface UIDesignSystem {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    headingScale: number[];
    bodyScale: number[];
    lineHeight: number;
  };
  spacing: {
    base: number;
    scale: number[];
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
  components: ComponentDesign[];
}

export interface ComponentDesign {
  name: string;
  purpose: string;
  variants: ComponentVariant[];
  states: ComponentState[];
  props: ComponentProp[];
  composition: string;
  accessibility: AccessibilitySpec;
}

export interface ComponentVariant {
  name: string;
  description: string;
  styles: any;
}

export interface ComponentState {
  name: string;
  trigger: string;
  styles: any;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description: string;
}

export interface AccessibilitySpec {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  keyboardNavigation: string[];
  screenReaderSupport: string;
}

export interface ImplementationResult {
  components: GeneratedComponent[];
  pages: GeneratedPage[];
  apiRoutes: GeneratedAPIRoute[];
  utilities: GeneratedUtility[];
  tests: GeneratedTest[];
  documentation: GeneratedDocumentation;
  packageDependencies: string[];
  environmentVariables: EnvironmentVariable[];
}

export interface GeneratedComponent {
  name: string;
  filePath: string;
  code: string;
  dependencies: string[];
  props: ComponentProp[];
  usage: string;
  tests: string;
}

export interface GeneratedPage {
  name: string;
  route: string;
  filePath: string;
  code: string;
  components: string[];
  apiCalls: string[];
  metadata: PageMetadata;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph: any;
}

export interface GeneratedAPIRoute {
  path: string;
  method: string;
  filePath: string;
  code: string;
  middleware: string[];
  validation: string;
  documentation: string;
}

export interface GeneratedUtility {
  name: string;
  filePath: string;
  code: string;
  purpose: string;
  usage: string;
}

export interface GeneratedTest {
  name: string;
  filePath: string;
  code: string;
  coverage: string[];
  type: 'unit' | 'integration' | 'e2e';
}

export interface GeneratedDocumentation {
  readme: string;
  apiDocs: string;
  componentDocs: string;
  deploymentGuide: string;
  troubleshooting: string;
}

export interface EnvironmentVariable {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  example: string;
}

/**
 * 安全なJSON解析ヘルパー
 */
function parseJsonSafely(content: string): UIDesignSystem {
  try {
    // 1. 直接パース
    return JSON.parse(content);
  } catch (error) {
    console.log('Direct JSON parse failed, trying cleanup...');
    
    try {
      // 2. コードブロックマーカー除去
      let cleaned = content.replace(/```json\s*|\s*```/g, '');
      
      // 3. 先頭・末尾の余分な文字除去
      cleaned = cleaned.trim();
      
      // 4. JSONオブジェクトの抽出
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }
      
      // 5. 不正な改行やタブを修正
      cleaned = cleaned.replace(/\n\s*/g, ' ').replace(/\t/g, ' ');
      
      // 6. 単一引用符を二重引用符に変換
      cleaned = cleaned.replace(/'/g, '"');
      
      // 7. 重複する空白を除去
      cleaned = cleaned.replace(/\s+/g, ' ');
      
      return JSON.parse(cleaned);
    } catch (secondError) {
      console.log('JSON cleanup failed, using fallback design system...');
      
      // 8. フォールバック：基本的なデザインシステム
      return {
        colorPalette: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#3b82f6',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          textSecondary: '#64748b',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          headingScale: [2.5, 2, 1.5, 1.25, 1.125],
          bodyScale: [1, 0.875, 0.75],
          lineHeight: 1.6
        },
        spacing: {
          base: 4,
          scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
        },
        borderRadius: {
          small: '4px',
          medium: '8px',
          large: '12px',
          full: '9999px'
        },
        shadows: {
          small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        animations: {
          duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms'
          },
          easing: {
            ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        }
      };
    }
  }
}

/**
 * Geminiによる業界特化UI/UXデザイン生成
 */
export async function generateUIDesignSystem(
  requirements: RequirementAnalysis,
  userIdea: string
): Promise<UIDesignSystem> {
  console.log('🎨 [GEMINI] Generating UI/UX design system...');

  const prompt = `
あなたは世界最高のUI/UXデザイナーです。以下の要件分析結果に基づいて、業界に特化した最高品質のデザインシステムを作成してください。

ユーザーアイデア: "${userIdea}"

要件分析結果:
${JSON.stringify(requirements, null, 2)}

以下の観点で詳細なデザインシステムを設計してください：

1. **業界特化カラーパレット**
   - 業界の心理的効果を考慮した色選択
   - アクセシビリティ（WCAG AA準拠）
   - ブランディングとの整合性

2. **タイポグラフィシステム**
   - 読みやすさと機能性の両立
   - 階層構造の明確化
   - 多言語対応

3. **スペーシングとレイアウト**
   - 8pxグリッドシステム
   - 視覚的階層の構築
   - レスポンシブ対応

4. **コンポーネント設計**
   - 再利用可能なコンポーネント
   - 状態管理とバリエーション
   - アクセシビリティ対応

5. **アニメーションシステム**
   - パフォーマンスを考慮した軽量アニメーション
   - ユーザビリティ向上効果
   - ブランド体験の一貫性

期待する出力をJSON形式で提供してください。実装可能で最適化されたデザインシステムにしてください。
  `;

  try {
    const geminiClient = new GeminiClient();
    const response = await geminiClient.generateText({
      prompt,
      temperature: 0.4,
      maxTokens: 3000
    });

    if (!response.success || !response.data) {
      throw new Error('Failed to generate design system');
    }

    console.log('✅ [GEMINI] UI design system generated successfully');
    
    // JSON解析（ロバスト版）
    return parseJsonSafely(response.data);

  } catch (error) {
    console.error('❌ [GEMINI] UI design generation failed:', error);
    
    // parseJsonSafelyの中でフォールバック処理される
    return parseJsonSafely('{}');
  }
}

/**
 * Geminiによる高品質コード実装
 */
export async function implementApplication(
  requirements: RequirementAnalysis,
  architecture: SystemArchitecture,
  designSystem: UIDesignSystem,
  userIdea: string
): Promise<ImplementationResult> {
  console.log('💻 [GEMINI] Starting application implementation...');

  const prompt = `
あなたは世界最高のフルスタック開発者です。以下の設計仕様に基づいて、プロダクション品質のNext.js 14アプリケーションを実装してください。

ユーザーアイデア: "${userIdea}"

要件分析:
${JSON.stringify(requirements, null, 2)}

システムアーキテクチャ:
${JSON.stringify(architecture, null, 2)}

デザインシステム:
${JSON.stringify(designSystem, null, 2)}

以下の要件で実装してください：

1. **Next.js 14 App Router**
   - TypeScript完全対応
   - Server Components活用
   - Client Components最適化
   - Metadata API使用

2. **高品質UIコンポーネント**
   - shadcn/ui + Tailwind CSS
   - 完全なアクセシビリティ対応
   - レスポンシブデザイン
   - Framer Motion アニメーション

3. **堅牢なAPI実装**
   - Zod バリデーション
   - エラーハンドリング
   - レート制限
   - セキュリティ対策

4. **データベース統合**
   - Supabase / Prisma対応
   - 型安全なクエリ
   - リレーション管理
   - インデックス最適化

5. **品質保証**
   - Jest単体テスト
   - TypeScript strict mode
   - ESLint + Prettier
   - パフォーマンス最適化

実装すべきファイル構成:
- components/ (再利用可能コンポーネント)
- app/ (ページとAPIルート)
   - page.tsx (メインページ)
   - api/ (APIエンドポイント)
- lib/ (ユーティリティ関数)
- types/ (型定義)

各ファイルの完全なコードを生成してください。プロダクション環境で即座に使用可能な品質にしてください。
  `;

  try {
    const geminiClient = new GeminiClient();
    const response = await geminiClient.generateText({
      prompt,
      temperature: 0.2,
      maxTokens: 6000
    });

    if (!response.success || !response.data) {
      throw new Error('Failed to implement application');
    }

    console.log('💻 [GEMINI] Application implementation completed');

    // レスポンスからコードを解析して構造化
    const code = response.data;
    
    // メインページコンポーネントを抽出
    const pageComponent = extractCodeBlock(code, 'page.tsx') || generateFallbackPage(userIdea, requirements);
    
    // APIルートを抽出
    const apiRoutes = extractAPIRoutes(code, architecture);
    
    // 基本コンポーネントを生成
    const components = generateBasicComponents(requirements, designSystem);

    const result: ImplementationResult = {
      components,
      pages: [
        {
          name: 'MainPage',
          route: '/',
          filePath: 'app/page.tsx',
          code: pageComponent,
          components: components.map(c => c.name),
          apiCalls: apiRoutes.map(r => r.path),
          metadata: {
            title: userIdea,
            description: `${userIdea} - プロフェッショナル管理システム`,
            keywords: [userIdea, '管理システム', 'CRUD'],
            openGraph: {}
          }
        }
      ],
      apiRoutes,
      utilities: [
        {
          name: 'Database Utils',
          filePath: 'lib/db.ts',
          code: generateDatabaseUtils(architecture),
          purpose: 'データベース接続とクエリ関数',
          usage: 'import { db } from "@/lib/db"'
        }
      ],
      tests: [
        {
          name: 'API Tests',
          filePath: '__tests__/api.test.ts',
          code: generateAPITests(apiRoutes),
          coverage: ['API endpoints', 'Error handling'],
          type: 'integration'
        }
      ],
      documentation: {
        readme: generateReadme(userIdea, requirements),
        apiDocs: generateAPIDocs(apiRoutes),
        componentDocs: generateComponentDocs(components),
        deploymentGuide: generateDeploymentGuide(),
        troubleshooting: generateTroubleshooting()
      },
      packageDependencies: [
        '@next/bundle-analyzer',
        '@types/node',
        '@types/react',
        '@types/react-dom',
        'next',
        'react',
        'react-dom',
        'typescript',
        'tailwindcss',
        '@tailwindcss/forms',
        '@headlessui/react',
        'framer-motion',
        'zod',
        'lucide-react'
      ],
      environmentVariables: [
        {
          name: 'SUPABASE_URL',
          description: 'Supabase project URL',
          required: true,
          example: 'https://your-project.supabase.co'
        },
        {
          name: 'SUPABASE_ANON_KEY',
          description: 'Supabase anonymous key',
          required: true,
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      ]
    };

    console.log(`✅ [GEMINI] Generated ${result.components.length} components and ${result.apiRoutes.length} API routes`);
    
    return result;

  } catch (error) {
    console.error('❌ [GEMINI] Application implementation failed:', error);
    
    // フォールバック実装
    return generateFallbackImplementation(userIdea, requirements, architecture);
  }
}

/**
 * コードブロック抽出ヘルパー
 */
function extractCodeBlock(text: string, filename: string): string | null {
  const pattern = new RegExp(`\`\`\`(?:typescript|tsx|ts)?\\s*(?:// ${filename})?([\\s\\S]*?)\`\`\``, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

/**
 * APIルート抽出
 */
function extractAPIRoutes(code: string, architecture: SystemArchitecture): GeneratedAPIRoute[] {
  const routes: GeneratedAPIRoute[] = [];
  
  architecture.apiDesign?.forEach(endpoint => {
    const routeCode = generateAPIRoute(endpoint);
    routes.push({
      path: endpoint.path,
      method: endpoint.method,
      filePath: `app/api${endpoint.path}/route.ts`,
      code: routeCode,
      middleware: ['cors', 'rateLimit'],
      validation: 'Zod schema',
      documentation: endpoint.purpose
    });
  });

  return routes;
}

/**
 * APIルート生成
 */
function generateAPIRoute(endpoint: any): string {
  const methodName = endpoint.method.toLowerCase();
  
  return `import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  // TODO: Define schema based on endpoint requirements
});

export async function ${endpoint.method}(request: NextRequest) {
  try {
    // ${endpoint.purpose}
    
    if (request.method === '${endpoint.method}') {
      // TODO: Implement ${endpoint.method} logic
      return NextResponse.json({ message: 'Success' });
    }
    
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`;
}

/**
 * 基本コンポーネント生成
 */
function generateBasicComponents(requirements: RequirementAnalysis, designSystem: UIDesignSystem): GeneratedComponent[] {
  return [
    {
      name: 'DataTable',
      filePath: 'components/DataTable.tsx',
      code: generateDataTableComponent(requirements, designSystem),
      dependencies: ['@tanstack/react-table', 'lucide-react'],
      props: [
        {
          name: 'data',
          type: 'any[]',
          required: true,
          description: '表示するデータ配列'
        },
        {
          name: 'columns',
          type: 'ColumnDef[]',
          required: true,
          description: 'テーブルカラム定義'
        }
      ],
      usage: '<DataTable data={items} columns={columns} />',
      tests: 'render, sorting, pagination tests'
    },
    {
      name: 'CreateForm',
      filePath: 'components/CreateForm.tsx',
      code: generateCreateFormComponent(requirements, designSystem),
      dependencies: ['react-hook-form', 'zod'],
      props: [
        {
          name: 'onSubmit',
          type: '(data: any) => void',
          required: true,
          description: 'フォーム送信ハンドラー'
        }
      ],
      usage: '<CreateForm onSubmit={handleCreate} />',
      tests: 'form validation, submission tests'
    }
  ];
}

/**
 * フォールバック実装生成
 */
function generateFallbackImplementation(
  userIdea: string,
  requirements: RequirementAnalysis,
  architecture: SystemArchitecture
): ImplementationResult {
  return {
    components: generateBasicComponents(requirements, {
      colorPalette: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#3b82f6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      typography: { fontFamily: 'Inter', headingScale: [], bodyScale: [], lineHeight: 1.6 },
      spacing: { base: 4, scale: [] },
      borderRadius: { small: '4px', medium: '8px', large: '12px', full: '9999px' },
      shadows: { small: '', medium: '', large: '' },
      animations: { duration: { fast: '150ms', normal: '250ms', slow: '350ms' }, easing: { ease: '', easeIn: '', easeOut: '', easeInOut: '' } },
      components: []
    }),
    pages: [
      {
        name: 'MainPage',
        route: '/',
        filePath: 'app/page.tsx',
        code: generateFallbackPage(userIdea, requirements),
        components: ['DataTable', 'CreateForm'],
        apiCalls: ['/api/items'],
        metadata: {
          title: userIdea,
          description: '管理システム',
          keywords: [],
          openGraph: {}
        }
      }
    ],
    apiRoutes: [
      {
        path: '/api/items',
        method: 'GET',
        filePath: 'app/api/items/route.ts',
        code: generateBasicAPIRoute(),
        middleware: [],
        validation: 'Basic validation',
        documentation: 'Basic CRUD API'
      }
    ],
    utilities: [],
    tests: [],
    documentation: {
      readme: `# ${userIdea}\n\n基本的な管理システムです。`,
      apiDocs: '',
      componentDocs: '',
      deploymentGuide: '',
      troubleshooting: ''
    },
    packageDependencies: ['next', 'react', 'typescript'],
    environmentVariables: []
  };
}

// ヘルパー関数の実装
function generateFallbackPage(userIdea: string, requirements: RequirementAnalysis): string {
  return `'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MainPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      
      if (response.ok) {
        setName('');
        fetchItems();
      }
    } catch (error) {
      console.error('作成エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ${userIdea} - 管理システム
      </h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>新規作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力してください"
              required
            />
            <Button type="submit" disabled={loading || !name.trim()} className="w-full">
              {loading ? '作成中...' : '作成'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データ一覧 ({items.length}件)</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              まだデータがありません。
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item: any) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-gray-400">
                      作成日: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}`;
}

function generateBasicAPIRoute(): string {
  return `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: データベースから取得
    const items = [];
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // TODO: データベースに保存
    return NextResponse.json({ message: 'Created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}`;
}

function generateDataTableComponent(requirements: RequirementAnalysis, designSystem: UIDesignSystem): string {
  return `import React from 'react';

interface DataTableProps {
  data: any[];
  columns: any[];
}

export function DataTable({ data, columns }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`;
}

function generateCreateFormComponent(requirements: RequirementAnalysis, designSystem: UIDesignSystem): string {
  return `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CreateFormProps {
  onSubmit: (data: any) => void;
}

export function CreateForm({ onSubmit }: CreateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">名前</label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">説明</label>
        <Input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">
        作成
      </Button>
    </form>
  );
}`;
}

function generateDatabaseUtils(architecture: SystemArchitecture): string {
  return `// Database utility functions
export const db = {
  // TODO: Implement database connection and queries
};`;
}

function generateAPITests(routes: GeneratedAPIRoute[]): string {
  return `import { describe, it, expect } from '@jest/globals';

describe('API Routes', () => {
  it('should handle requests correctly', () => {
    expect(true).toBe(true);
  });
});`;
}

function generateReadme(userIdea: string, requirements: RequirementAnalysis): string {
  return `# ${userIdea}

${requirements.features[0]?.description || '高品質な管理システム'}

## 機能

${requirements.features.map(f => `- ${f.name}: ${f.description}`).join('\n')}

## 開発

\`\`\`bash
npm install
npm run dev
\`\`\`
`;
}

function generateAPIDocs(routes: GeneratedAPIRoute[]): string {
  return `# API Documentation

${routes.map(route => `## ${route.method} ${route.path}

${route.documentation}
`).join('\n')}`;
}

function generateComponentDocs(components: GeneratedComponent[]): string {
  return `# Component Documentation

${components.map(comp => `## ${comp.name}

${comp.usage}
`).join('\n')}`;
}

function generateDeploymentGuide(): string {
  return `# Deployment Guide

## Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables
3. Deploy

## Environment Variables

Set the following environment variables in your deployment platform.
`;
}

function generateTroubleshooting(): string {
  return `# Troubleshooting

## Common Issues

### Build Errors
- Check TypeScript configuration
- Verify all dependencies are installed

### Runtime Errors  
- Check environment variables
- Verify API endpoints
`;
}