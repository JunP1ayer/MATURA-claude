import { GoogleGenerativeAI } from '@google/generative-ai';

interface ComponentTemplate {
  name: string;
  description: string;
  complexity: 'simple' | 'medium' | 'complex';
  category: 'layout' | 'form' | 'display' | 'interactive' | 'navigation';
  requiredProps: string[];
  optionalProps: string[];
  stateManagement: boolean;
  hooks: string[];
  dependencies: string[];
}

interface UIPattern {
  id: string;
  name: string;
  description: string;
  components: ComponentTemplate[];
  layout: 'grid' | 'flex' | 'absolute' | 'stack';
  responsive: boolean;
  theme: 'modern' | 'minimal' | 'corporate' | 'creative';
}

export class ComplexUIGenerator {
  private gemini: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.gemini = new GoogleGenerativeAI(apiKey);
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
  }

  // 複雑なUIパターンのテンプレート
  private getUIPatterns(): UIPattern[] {
    return [
      {
        id: 'dashboard',
        name: 'ダッシュボード',
        description: '統計カード、チャート、テーブルを含むダッシュボード',
        components: [
          {
            name: 'MetricsCard',
            description: '数値指標を表示するカード',
            complexity: 'simple',
            category: 'display',
            requiredProps: ['title', 'value'],
            optionalProps: ['subtitle', 'icon', 'trend'],
            stateManagement: false,
            hooks: [],
            dependencies: ['lucide-react']
          },
          {
            name: 'ChartContainer',
            description: 'グラフ表示コンテナ',
            complexity: 'complex',
            category: 'display',
            requiredProps: ['data', 'type'],
            optionalProps: ['title', 'height', 'options'],
            stateManagement: true,
            hooks: ['useState', 'useEffect'],
            dependencies: ['recharts']
          },
          {
            name: 'DataTable',
            description: 'ソート・フィルタ機能付きテーブル',
            complexity: 'complex',
            category: 'display',
            requiredProps: ['data', 'columns'],
            optionalProps: ['pagination', 'sorting', 'filtering'],
            stateManagement: true,
            hooks: ['useState', 'useMemo'],
            dependencies: []
          }
        ],
        layout: 'grid',
        responsive: true,
        theme: 'modern'
      },
      {
        id: 'crud-form',
        name: 'CRUD フォーム',
        description: 'データの作成・更新・削除機能を持つフォーム',
        components: [
          {
            name: 'DynamicForm',
            description: '動的なフォームフィールド',
            complexity: 'complex',
            category: 'form',
            requiredProps: ['schema', 'onSubmit'],
            optionalProps: ['initialData', 'validation'],
            stateManagement: true,
            hooks: ['useState', 'useEffect', 'useCallback'],
            dependencies: ['react-hook-form', 'zod']
          },
          {
            name: 'FieldRenderer',
            description: '型に応じたフィールドレンダラー',
            complexity: 'medium',
            category: 'form',
            requiredProps: ['field', 'value', 'onChange'],
            optionalProps: ['error', 'disabled'],
            stateManagement: false,
            hooks: [],
            dependencies: []
          },
          {
            name: 'ActionButtons',
            description: '操作ボタン群',
            complexity: 'simple',
            category: 'interactive',
            requiredProps: ['actions'],
            optionalProps: ['loading', 'disabled'],
            stateManagement: false,
            hooks: [],
            dependencies: []
          }
        ],
        layout: 'flex',
        responsive: true,
        theme: 'modern'
      },
      {
        id: 'data-explorer',
        name: 'データエクスプローラー',
        description: '検索・フィルタ・詳細表示機能を持つデータ閲覧UI',
        components: [
          {
            name: 'SearchBar',
            description: '高度検索機能',
            complexity: 'medium',
            category: 'form',
            requiredProps: ['onSearch'],
            optionalProps: ['placeholder', 'filters'],
            stateManagement: true,
            hooks: ['useState', 'useDebounce'],
            dependencies: []
          },
          {
            name: 'FilterPanel',
            description: 'フィルタリングパネル',
            complexity: 'complex',
            category: 'form',
            requiredProps: ['filters', 'onFilterChange'],
            optionalProps: ['resetFilters'],
            stateManagement: true,
            hooks: ['useState', 'useEffect'],
            dependencies: []
          },
          {
            name: 'DetailView',
            description: '詳細表示モーダル',
            complexity: 'medium',
            category: 'display',
            requiredProps: ['data', 'onClose'],
            optionalProps: ['actions'],
            stateManagement: false,
            hooks: [],
            dependencies: []
          }
        ],
        layout: 'grid',
        responsive: true,
        theme: 'modern'
      }
    ];
  }

  async generateComplexUI(
    pattern: string,
    userRequirements: string,
    dataSchema?: any
  ): Promise<{
    components: { name: string; code: string; path: string }[];
    mainComponent: string;
    stateManagement: string;
    success: boolean;
    errors: string[];
  }> {
    const uiPattern = this.getUIPatterns().find(p => p.id === pattern);
    if (!uiPattern) {
      return {
        components: [],
        mainComponent: '',
        stateManagement: '',
        success: false,
        errors: [`パターン "${pattern}" が見つかりません`]
      };
    }

    const components: { name: string; code: string; path: string }[] = [];
    const errors: string[] = [];

    try {
      // 各コンポーネントを生成
      for (const componentTemplate of uiPattern.components) {
        const componentCode = await this.generateComponent(
          componentTemplate,
          userRequirements,
          dataSchema
        );

        components.push({
          name: componentTemplate.name,
          code: componentCode,
          path: `components/${componentTemplate.name}.tsx`
        });
      }

      // メインコンポーネントを生成
      const mainComponent = await this.generateMainComponent(
        uiPattern,
        components,
        userRequirements
      );

      // 状態管理コードを生成
      const stateManagement = await this.generateStateManagement(
        uiPattern,
        dataSchema
      );

      return {
        components,
        mainComponent,
        stateManagement,
        success: true,
        errors: []
      };

    } catch (error) {
      errors.push(`生成中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
      return {
        components,
        mainComponent: '',
        stateManagement: '',
        success: false,
        errors
      };
    }
  }

  private async generateComponent(
    template: ComponentTemplate,
    userRequirements: string,
    dataSchema?: any
  ): Promise<string> {
    const prompt = `
以下の要件に基づいて、高品質なReactコンポーネントを生成してください：

コンポーネント名: ${template.name}
説明: ${template.description}
カテゴリ: ${template.category}
複雑度: ${template.complexity}

必須Props: ${template.requiredProps.join(', ')}
オプションProps: ${template.optionalProps.join(', ')}
状態管理: ${template.stateManagement ? 'あり' : 'なし'}
使用するHooks: ${template.hooks.join(', ')}
依存関係: ${template.dependencies.join(', ')}

ユーザー要件: ${userRequirements}

${dataSchema ? `データスキーマ: ${JSON.stringify(dataSchema, null, 2)}` : ''}

要件:
1. TypeScriptで記述
2. 適切な型定義を含める
3. アクセシビリティを考慮
4. レスポンシブデザイン
5. エラーハンドリング
6. パフォーマンス最適化
7. 美しいUI/UX
8. TailwindCSSを使用
9. 適切なコメントを含める

コンポーネントのコードのみを返してください。説明は不要です。
`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  private async generateMainComponent(
    pattern: UIPattern,
    components: { name: string; code: string; path: string }[],
    userRequirements: string
  ): Promise<string> {
    const componentNames = components.map(c => c.name);
    
    const prompt = `
以下のUIパターンに基づいて、メインコンポーネントを生成してください：

パターン: ${pattern.name}
説明: ${pattern.description}
レイアウト: ${pattern.layout}
レスポンシブ: ${pattern.responsive}
テーマ: ${pattern.theme}

使用するコンポーネント: ${componentNames.join(', ')}
ユーザー要件: ${userRequirements}

要件:
1. TypeScriptで記述
2. 適切な型定義を含める
3. ${pattern.layout}レイアウトを使用
4. ${pattern.responsive ? 'レスポンシブデザイン' : '固定レイアウト'}
5. ${pattern.theme}テーマに合わせたスタイル
6. 状態管理を含める
7. エラーハンドリング
8. ローディング状態の管理
9. TailwindCSSを使用
10. 美しいUI/UX

メインコンポーネントのコードのみを返してください。説明は不要です。
`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  private async generateStateManagement(
    pattern: UIPattern,
    dataSchema?: any
  ): Promise<string> {
    const hasStateManagement = pattern.components.some(c => c.stateManagement);
    
    if (!hasStateManagement) {
      return '';
    }

    const prompt = `
以下のUIパターンに基づいて、状態管理のコードを生成してください：

パターン: ${pattern.name}
説明: ${pattern.description}

${dataSchema ? `データスキーマ: ${JSON.stringify(dataSchema, null, 2)}` : ''}

要件:
1. TypeScriptで記述
2. Zustandまたは React Context を使用
3. 適切な型定義を含める
4. 永続化機能（必要に応じて）
5. エラーハンドリング
6. 非同期処理のサポート
7. パフォーマンス最適化

状態管理のコードのみを返してください。説明は不要です。
`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async generateAdvancedForm(
    schema: any,
    formType: 'create' | 'edit' | 'search' | 'wizard',
    validationRules?: any
  ): Promise<{
    formComponent: string;
    validationSchema: string;
    success: boolean;
    errors: string[];
  }> {
    try {
      const prompt = `
以下のスキーマに基づいて、高度なフォームコンポーネントを生成してください：

スキーマ: ${JSON.stringify(schema, null, 2)}
フォームタイプ: ${formType}
バリデーションルール: ${validationRules ? JSON.stringify(validationRules, null, 2) : 'なし'}

要件:
1. TypeScriptで記述
2. React Hook Form を使用
3. Zod によるバリデーション
4. 動的フィールド生成
5. 条件付きフィールド表示
6. リアルタイムバリデーション
7. 美しいUI/UX
8. アクセシビリティ対応
9. エラーハンドリング
10. ローディング状態の管理

${formType === 'wizard' ? '複数ステップのウィザード形式' : ''}
${formType === 'search' ? '検索フィルタ機能' : ''}

フォームコンポーネントとバリデーションスキーマを分けて返してください。
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const generatedCode = response.text();

      // フォームコンポーネントとバリデーションスキーマを分離
      const formComponent = this.extractFormComponent(generatedCode);
      const validationSchema = this.extractValidationSchema(generatedCode);

      return {
        formComponent,
        validationSchema,
        success: true,
        errors: []
      };

    } catch (error) {
      return {
        formComponent: '',
        validationSchema: '',
        success: false,
        errors: [`フォーム生成中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`]
      };
    }
  }

  private extractFormComponent(code: string): string {
    // コードからフォームコンポーネント部分を抽出
    const componentMatch = code.match(/export\s+(?:default\s+)?function\s+\w+.*?\{[\s\S]*?\n\}/);
    return componentMatch ? componentMatch[0] : code;
  }

  private extractValidationSchema(code: string): string {
    // コードからバリデーションスキーマ部分を抽出
    const schemaMatch = code.match(/const\s+\w*[Ss]chema\s*=\s*z\.[\s\S]*?(?=\n\n|$)/);
    return schemaMatch ? schemaMatch[0] : '';
  }

  async generateDataVisualization(
    data: any[],
    visualizationType: 'chart' | 'table' | 'cards' | 'timeline',
    customization?: {
      colors?: string[];
      theme?: 'light' | 'dark';
      interactive?: boolean;
      responsive?: boolean;
    }
  ): Promise<{
    component: string;
    success: boolean;
    errors: string[];
  }> {
    try {
      const prompt = `
以下のデータに基づいて、データ可視化コンポーネントを生成してください：

データサンプル: ${JSON.stringify(data.slice(0, 3), null, 2)}
可視化タイプ: ${visualizationType}
カスタマイズ: ${customization ? JSON.stringify(customization, null, 2) : 'デフォルト'}

要件:
1. TypeScriptで記述
2. 適切なライブラリを使用（Recharts, Chart.js等）
3. レスポンシブデザイン
4. ${customization?.interactive ? 'インタラクティブ機能' : '静的表示'}
5. ${customization?.theme || 'light'}テーマ
6. 美しいUI/UX
7. アクセシビリティ対応
8. エラーハンドリング
9. ローディング状態の管理
10. パフォーマンス最適化

コンポーネントのコードのみを返してください。説明は不要です。
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      return {
        component: response.text(),
        success: true,
        errors: []
      };

    } catch (error) {
      return {
        component: '',
        success: false,
        errors: [`データ可視化生成中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`]
      };
    }
  }

  getAvailablePatterns(): UIPattern[] {
    return this.getUIPatterns();
  }
}