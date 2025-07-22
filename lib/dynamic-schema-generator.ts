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
    const prompt = `Parse this app idea and return valid JSON. Reply with ONLY the JSON object, nothing else.

"${userInput}"

Format:
{"category":"finance","dataType":"income_records","primaryActions":["record","track","alert"],"targetUser":"students and part-time workers","keyFeatures":["income tracking","threshold alerts","automatic calculation"],"requiredFields":[{"name":"amount","type":"number","description":"income amount","required":true},{"name":"source","type":"text","description":"income source","required":true},{"name":"date","type":"date","description":"income date","required":true}]}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a creative JSON formatter. Generate diverse and creative schema designs. Return only valid JSON objects, no other text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3, // ランダム性を追加（0.1 → 0.3）
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No analysis received');
    
    // レスポンス内容をログ出力
    console.log('🔍 OpenAI Raw Response:', content);
    console.log('🔍 Response Length:', content.length);
    
    // JSON解析の改善：複数の方法で試行
    return this.parseJsonSafely(content);
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

  /**
   * 安全なJSON解析
   */
  private parseJsonSafely(content: string): any {
    try {
      // 1. 直接パース
      return JSON.parse(content);
    } catch (error) {
      console.log('❌ Direct JSON parse failed:', error.message);
      console.log('🔍 Content preview:', content.substring(0, 200));
      
      try {
        // 2. コードブロックマーカー除去
        let cleaned = content.replace(/```json\s*|\s*```/g, '');
        
        // 3. 先頭・末尾の余分な文字除去
        cleaned = cleaned.trim();
        
        // 4. JSONオブジェクトの抽出
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleaned = jsonMatch[0];
          console.log('🔧 Extracted JSON object');
        }
        
        // 5. 不正な改行やタブを修正
        cleaned = cleaned.replace(/\n\s*/g, ' ').replace(/\t/g, ' ');
        
        // 6. 単一引用符を二重引用符に変換
        cleaned = cleaned.replace(/'/g, '"');
        
        // 7. 重複する空白を除去
        cleaned = cleaned.replace(/\s+/g, ' ');
        
        console.log('🔧 Cleaned JSON:', cleaned.substring(0, 200));
        return JSON.parse(cleaned);
      } catch (secondError) {
        console.log('JSON cleanup failed, using fallback structure...');
        
        // 8. フォールバック：基本構造を返す
        return {
          category: 'utility',
          dataType: 'app_data',
          primaryActions: ['作成', '編集', '削除'],
          targetUser: '一般ユーザー',
          keyFeatures: ['データ管理', 'CRUD操作', 'リスト表示'],
          requiredFields: [
            { name: 'title', type: 'text', description: 'タイトル', required: true },
            { name: 'description', type: 'text', description: '説明', required: false },
            { name: 'status', type: 'text', description: 'ステータス', required: true }
          ]
        };
      }
    }
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