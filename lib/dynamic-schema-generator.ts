/**
 * Dynamic Schema Generator - LLMを使用してクリエイティブなアイデアに対応
 */

import { openai } from '@/lib/openai';

export interface DynamicSchemaRequest {
  userInput: string;
  context?: {
    industry?: string;
    userType?: string;
    complexity?: 'simple' | 'moderate' | 'complex';
  };
}

export interface GeneratedSchema {
  tableName: string;
  description: string;
  category: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    defaultValue?: string;
  }>;
  uiConfig: {
    icon: string;
    primaryColor: string;
    description: string;
    actionLabel: string;
  };
}

export class DynamicSchemaGenerator {
  
  /**
   * メイン関数: どんなアイデアでも動的にスキーマを生成
   */
  async generateSchema(request: DynamicSchemaRequest): Promise<GeneratedSchema> {
    try {
      // 1. セマンティック分析
      const analysis = await this.analyzeIdea(request.userInput);
      
      // 2. 動的スキーマ生成
      const schema = await this.generateDynamicSchema(analysis, request.userInput);
      
      return schema;
      
    } catch (error) {
      console.error('Dynamic schema generation failed:', error);
      // フォールバック: 汎用スキーマ
      return this.generateGenericSchema(request.userInput);
    }
  }

  /**
   * LLMを使った意味分析
   */
  private async analyzeIdea(userInput: string): Promise<any> {
    const prompt = `以下のアプリアイデアを分析して、JSON形式で返してください：

アイデア: "${userInput}"

分析内容:
{
  "category": "アプリのカテゴリ（例: productivity, social, ecommerce, creative, utility, finance, health, education, entertainment）",
  "dataType": "管理するデータの種類（例: users, products, transactions, content, records, events）",
  "primaryActions": ["主要な操作1", "主要な操作2", "主要な操作3"],
  "targetUser": "想定ユーザー",
  "keyFeatures": ["機能1", "機能2", "機能3"],
  "requiredFields": [
    {
      "name": "フィールド名",
      "type": "データ型",
      "description": "説明",
      "required": true/false
    }
  ]
}

純粋なJSONのみを返してください。説明は不要です。`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No analysis received');
    
    return JSON.parse(content);
  }

  /**
   * 分析結果から動的スキーマ生成
   */
  private async generateDynamicSchema(analysis: any, originalInput: string): Promise<GeneratedSchema> {
    // 分析結果を基にスキーマを構築
    const tableName = this.generateTableName(analysis.dataType);
    
    const fields = analysis.requiredFields.map((field: any) => ({
      name: field.name,
      label: this.generateLabel(field.name, field.description),
      type: this.mapDataType(field.type),
      required: field.required,
      placeholder: this.generatePlaceholder(field.name, field.type)
    }));

    // 基本フィールドを追加
    fields.unshift(
      { name: 'id', label: 'ID', type: 'uuid', required: true },
    );
    fields.push(
      { name: 'created_at', label: '作成日時', type: 'timestamp', required: true },
      { name: 'updated_at', label: '更新日時', type: 'timestamp', required: true }
    );

    return {
      tableName,
      description: `${analysis.category}カテゴリの${analysis.targetUser}向けアプリ`,
      category: analysis.category,
      fields,
      uiConfig: {
        icon: this.selectIcon(analysis.category),
        primaryColor: this.selectColor(analysis.category),
        description: `${originalInput}の管理システム`,
        actionLabel: `${analysis.dataType}を追加`
      }
    };
  }

  /**
   * フォールバック: 汎用スキーマ生成
   */
  private generateGenericSchema(userInput: string): GeneratedSchema {
    return {
      tableName: 'app_data',
      description: 'カスタムアプリケーション',
      category: 'utility',
      fields: [
        { name: 'id', label: 'ID', type: 'uuid', required: true },
        { name: 'title', label: 'タイトル', type: 'text', required: true, placeholder: 'タイトルを入力' },
        { name: 'description', label: '説明', type: 'text', required: false, placeholder: '説明を入力' },
        { name: 'status', label: 'ステータス', type: 'text', required: true, defaultValue: 'active' },
        { name: 'created_at', label: '作成日時', type: 'timestamp', required: true },
        { name: 'updated_at', label: '更新日時', type: 'timestamp', required: true }
      ],
      uiConfig: {
        icon: 'Database',
        primaryColor: 'blue',
        description: `${userInput}の管理システム`,
        actionLabel: 'データを追加'
      }
    };
  }

  // ヘルパー関数
  private generateTableName(dataType: string): string {
    return dataType.toLowerCase().replace(/\s+/g, '_');
  }

  private generateLabel(name: string, description: string): string {
    return description || name.charAt(0).toUpperCase() + name.slice(1);
  }

  private mapDataType(type: string): string {
    const typeMapping: { [key: string]: string } = {
      'string': 'text',
      'number': 'number',
      'date': 'date',
      'boolean': 'boolean',
      'email': 'email',
      'url': 'url',
      'phone': 'tel'
    };
    return typeMapping[type.toLowerCase()] || 'text';
  }

  private generatePlaceholder(name: string, type: string): string {
    if (type === 'email') return '例: user@example.com';
    if (type === 'date') return '';
    if (type === 'number') return '例: 100';
    if (type === 'url') return '例: https://example.com';
    return `${name}を入力`;
  }

  private selectIcon(category: string): string {
    const iconMapping: { [key: string]: string } = {
      'productivity': 'CheckSquare',
      'social': 'Users',
      'ecommerce': 'ShoppingCart',
      'creative': 'Palette',
      'utility': 'Tool',
      'finance': 'DollarSign',
      'health': 'Heart',
      'education': 'BookOpen',
      'entertainment': 'Play'
    };
    return iconMapping[category] || 'Database';
  }

  private selectColor(category: string): string {
    const colorMapping: { [key: string]: string } = {
      'productivity': 'green',
      'social': 'blue',
      'ecommerce': 'purple',
      'creative': 'pink',
      'utility': 'gray',
      'finance': 'emerald',
      'health': 'red',
      'education': 'indigo',
      'entertainment': 'orange'
    };
    return colorMapping[category] || 'blue';
  }
}