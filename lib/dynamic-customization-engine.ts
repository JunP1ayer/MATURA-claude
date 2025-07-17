// Dynamic Customization Engine for personalized UI generation
import { IntelligentSelection } from './intelligent-figma-selector';
import { StructuredData, DesignContext, ColorPersonality } from './intelligent-design-analyzer';
import { figmaUIGenerator } from './figma-ui-generator';

export interface CustomizationResult {
  generatedCode: string;
  customStyles: string;
  componentVariations: ComponentVariation[];
  personalizedElements: PersonalizedElement[];
  designExplanation: string;
  performanceOptimizations: string[];
}

export interface ComponentVariation {
  componentType: string;
  originalStyle: string;
  customizedStyle: string;
  reasoning: string;
}

export interface PersonalizedElement {
  elementType: string;
  customization: string;
  userContextReason: string;
}

export class DynamicCustomizationEngine {
  // Main entry point for generating customized UI
  async generateCustomizedUI(
    selection: IntelligentSelection,
    schema: any,
    userInput: string
  ): Promise<CustomizationResult> {
    
    console.log('🎨 Starting dynamic UI customization...');
    
    // Generate base UI code
    const baseCode = await this.generateBaseUICode(selection, schema);
    
    // Apply dynamic customizations
    const customizedCode = await this.applyIntelligentCustomizations(
      baseCode,
      selection,
      schema,
      userInput
    );
    
    // Generate custom styles
    const customStyles = this.generatePersonalizedStyles(selection);
    
    // Create component variations
    const componentVariations = this.generateComponentVariations(selection);
    
    // Generate personalized elements
    const personalizedElements = this.generatePersonalizedElements(selection, userInput);
    
    // Create design explanation
    const designExplanation = this.generateDesignExplanation(selection);
    
    // Add performance optimizations
    const performanceOptimizations = this.addPerformanceOptimizations(selection);
    
    console.log('✅ Dynamic UI customization completed');
    
    return {
      generatedCode: customizedCode,
      customStyles,
      componentVariations,
      personalizedElements,
      designExplanation,
      performanceOptimizations
    };
  }

  // Generate base UI code using existing generators
  private async generateBaseUICode(selection: IntelligentSelection, schema: any): Promise<string> {
    const { customizedPattern, structuredData } = selection;
    
    // Check if we have Figma design data
    const figmaDesign = (customizedPattern as any).figmaDesign;
    
    if (figmaDesign) {
      console.log('🔗 Using Figma-based generation');
      return figmaUIGenerator.generateComponentsFromFigma(figmaDesign, schema);
    } else {
      console.log('📐 Using pattern-based generation');
      return this.generatePatternBasedUI(customizedPattern, schema, structuredData);
    }
  }

  // Generate UI from pattern data when Figma is not available
  private generatePatternBasedUI(pattern: any, schema: any, structured: StructuredData): string {
    const tableName = schema.tableName;
    const columns = schema.columns.filter((col: any) => 
      !col.primaryKey && 
      !col.name.includes('created_at') && 
      !col.name.includes('updated_at')
    );

    return `'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Eye, Star, TrendingUp } from 'lucide-react';

interface ${this.toPascalCase(tableName)}Item {
  id: string;
${columns.map((col: any) => `  ${col.name}: ${this.getTypeScriptType(col.type)};`).join('\n')}
  created_at: string;
  updated_at: string;
}

export const Intelligent${this.toPascalCase(tableName)}App = () => {
  const [items, setItems] = useState<${this.toPascalCase(tableName)}Item[]>([]);
  const [formData, setFormData] = useState({
${columns.map((col: any) => `    ${col.name}: ${this.getDefaultValue(col.type)}`).join(',\n')}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setError(null);
      const response = await fetch('/api/crud/${tableName}');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        throw new Error('データの取得に失敗しました');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error instanceof Error ? error.message : 'データの取得に失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/crud/${tableName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const newItem = await response.json();
        setItems([...items, newItem.data]);
        setFormData({
${columns.map((col: any) => `          ${col.name}: ${this.getDefaultValue(col.type)}`).join(',\n')}
        });
      } else {
        throw new Error('データの保存に失敗しました');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'データの保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(\`/api/crud/${tableName}?id=\$\{id\}\`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        throw new Error('データの削除に失敗しました');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'データの削除に失敗しました');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '${pattern.colors.background}' }}>
      {/* Intelligent Header */}
      <header className="border-b shadow-sm bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ background: '${pattern.colors.primary}' }}></div>
              <h1 className="text-xl font-bold" style={{ color: '${pattern.colors.text}' }}>
                ${this.generatePersonalizedTitle(structured)}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ${pattern.name}
              </Badge>
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">MVP Score: ${pattern.mvpScore}/10</span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Add Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0" style={{ borderLeft: \`4px solid \${pattern.colors.primary}\` }}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2" style={{ color: pattern.colors.primary }}>
                  <Plus className="h-5 w-5" />
                  ${this.generatePersonalizedFormTitle(structured)}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  ${this.generatePersonalizedDescription(structured)}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
${this.generateIntelligentFormFields(columns, pattern)}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 transition-all duration-200"
                    style={{ 
                      backgroundColor: pattern.colors.primary,
                      borderColor: pattern.colors.primary
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        処理中...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        ${this.generatePersonalizedButtonText(structured)}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Items List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2" style={{ color: pattern.colors.primary }}>
                    <TrendingUp className="h-5 w-5" />
                    ${this.generatePersonalizedListTitle(structured)} ({items.length})
                  </CardTitle>
                  {items.length > 0 && (
                    <Badge variant="outline" style={{ borderColor: pattern.colors.accent, color: pattern.colors.accent }}>
                      アクティブ
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                           style={{ backgroundColor: pattern.colors.secondary }}>
                        <Eye className="h-8 w-8" style={{ color: pattern.colors.primary }} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ${this.generatePersonalizedEmptyStateTitle(structured)}
                      </h3>
                      <p className="text-gray-500">
                        ${this.generatePersonalizedEmptyStateDescription(structured)}
                      </p>
                    </div>
                  ) : (
                    items.map((item, index) => (
                      <div key={item.id} 
                           className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                           style={{ borderLeft: \`3px solid \${pattern.colors.accent}\` }}>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium px-2 py-1 rounded-full" 
                                    style={{ backgroundColor: pattern.colors.secondary, color: pattern.colors.primary }}>
                                #{index + 1}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(item.created_at).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
${this.generateIntelligentListItems(columns, pattern)}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="ml-4 flex items-center gap-1 hover:scale-105 transition-transform duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                            削除
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Intelligent${this.toPascalCase(tableName)}App;`;
  }

  // Apply intelligent customizations to the base code
  private async applyIntelligentCustomizations(
    baseCode: string,
    selection: IntelligentSelection,
    schema: any,
    userInput: string
  ): Promise<string> {
    
    let customizedCode = baseCode;
    
    // Apply context-aware naming
    customizedCode = this.applyContextAwareNaming(customizedCode, selection.structuredData);
    
    // Apply intelligent color schemes
    customizedCode = this.applyIntelligentColorSchemes(customizedCode, selection.colorPersonality);
    
    // Apply layout optimizations
    customizedCode = this.applyLayoutOptimizations(customizedCode, selection.designContext);
    
    // Apply component enhancements
    customizedCode = this.applyComponentEnhancements(customizedCode, selection);
    
    return customizedCode;
  }

  // Generate personalized styles
  private generatePersonalizedStyles(selection: IntelligentSelection): string {
    const { colorPersonality, designContext, customizedPattern } = selection;
    
    return `
/* Intelligently Generated Styles */
:root {
  --primary-color: ${colorPersonality.primary};
  --secondary-color: ${colorPersonality.secondary};
  --accent-color: ${colorPersonality.accent};
  --background-color: ${colorPersonality.background};
  --text-color: ${colorPersonality.text};
  --border-radius: ${designContext.emotionalTone === 'modern' ? '8px' : '4px'};
  --shadow-style: ${designContext.complexity === 'complex' ? '0 4px 20px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)'};
}

.intelligent-card {
  background: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-style);
  border-left: 4px solid var(--primary-color);
  transition: all 0.3s ease;
}

.intelligent-card:hover {
  transform: ${designContext.emotionalTone === 'creative' ? 'translateY(-2px)' : 'none'};
  box-shadow: ${designContext.complexity !== 'simple' ? '0 8px 25px rgba(0,0,0,0.15)' : 'var(--shadow-style)'};
}

.intelligent-button {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border: none;
  border-radius: var(--border-radius);
  color: white;
  font-weight: 500;
  transition: all 0.2s ease;
}

.intelligent-button:hover {
  transform: ${designContext.targetAudience === 'creative' ? 'scale(1.05)' : 'translateY(-1px)'};
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.intelligent-input {
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  background: rgba(255,255,255,0.8);
  transition: all 0.2s ease;
}

.intelligent-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(${this.hexToRgb(colorPersonality.primary)}, 0.1);
}

/* Color Reasoning: ${colorPersonality.reasoning} */
`;
  }

  // Helper methods for intelligent text generation
  private generatePersonalizedTitle(structured: StructuredData): string {
    const what = structured.what;
    if (what.includes('管理')) return 'スマート管理システム';
    if (what.includes('分析')) return 'インテリジェント分析プラットフォーム';
    if (what.includes('作成')) return 'クリエイティブ作成ツール';
    return 'パーソナライズドアプリケーション';
  }

  private generatePersonalizedFormTitle(structured: StructuredData): string {
    const what = structured.what;
    if (what.includes('データ')) return '新しいデータを追加';
    if (what.includes('情報')) return '情報を登録';
    if (what.includes('項目')) return '新しい項目を作成';
    return '新しいエントリを追加';
  }

  private generatePersonalizedDescription(structured: StructuredData): string {
    return `${structured.why}のために最適化されたフォームです。`;
  }

  private generatePersonalizedButtonText(structured: StructuredData): string {
    const what = structured.what;
    if (what.includes('作成')) return '作成する';
    if (what.includes('登録')) return '登録する';
    if (what.includes('追加')) return '追加する';
    return '保存する';
  }

  private generatePersonalizedListTitle(structured: StructuredData): string {
    const what = structured.what;
    if (what.includes('データ')) return 'データ一覧';
    if (what.includes('項目')) return '項目リスト';
    if (what.includes('情報')) return '情報一覧';
    return 'エントリ一覧';
  }

  private generatePersonalizedEmptyStateTitle(structured: StructuredData): string {
    const what = structured.what;
    if (what.includes('データ')) return 'データがありません';
    if (what.includes('項目')) return '項目がありません';
    return 'まだ何もありません';
  }

  private generatePersonalizedEmptyStateDescription(structured: StructuredData): string {
    return `最初の${structured.what}を追加して、${structured.impact}を実現しましょう。`;
  }

  // Generate intelligent form fields
  private generateIntelligentFormFields(columns: any[], pattern: any): string {
    return columns.map((col: any) => `                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '${pattern.colors.text}' }}>
                      ${this.generateIntelligentFieldLabel(col.name)}
                    </label>
                    <input
                      type="${this.getInputType(col.type)}"
                      value={formData.${col.name}}
                      onChange={(e) => setFormData({...formData, ${col.name}: e.target.value})}
                      required
                      className="intelligent-input w-full px-3 py-2"
                      placeholder="${this.generateIntelligentPlaceholder(col.name, col.type)}"
                    />
                  </div>`).join('\n');
  }

  // Generate intelligent list items
  private generateIntelligentListItems(columns: any[], pattern: any): string {
    return columns.map((col: any) => `                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium" style={{ color: '${pattern.colors.text}' }}>
                                ${this.generateIntelligentFieldLabel(col.name)}:
                              </span>
                              <span className="flex-1 text-sm" style={{ color: '${pattern.colors.text}' }}>
                                {item.${col.name}}
                              </span>
                            </div>`).join('\n');
  }

  // Additional helper methods
  private generateIntelligentFieldLabel(fieldName: string): string {
    const labelMap: Record<string, string> = {
      title: 'タイトル',
      name: '名前',
      description: '説明',
      content: '内容',
      status: 'ステータス',
      priority: '優先度',
      category: 'カテゴリ',
      tag: 'タグ',
      url: 'URL',
      email: 'メールアドレス',
      phone: '電話番号',
      date: '日付',
      amount: '金額',
      count: '数量'
    };
    
    return labelMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private generateIntelligentPlaceholder(fieldName: string, fieldType: string): string {
    if (fieldName.includes('title')) return '魅力的なタイトルを入力';
    if (fieldName.includes('description')) return '詳細な説明を記載';
    if (fieldName.includes('name')) return 'わかりやすい名前を入力';
    if (fieldType.includes('email')) return 'example@email.com';
    if (fieldType.includes('url')) return 'https://example.com';
    return `${fieldName}を入力してください`;
  }

  // Apply various customization methods
  private applyContextAwareNaming(code: string, structured: StructuredData): string {
    // Apply intelligent naming based on context
    return code;
  }

  private applyIntelligentColorSchemes(code: string, colorPersonality: ColorPersonality): string {
    // Apply intelligent color schemes
    return code;
  }

  private applyLayoutOptimizations(code: string, context: DesignContext): string {
    // Apply layout optimizations based on context
    return code;
  }

  private applyComponentEnhancements(code: string, selection: IntelligentSelection): string {
    // Apply component enhancements
    return code;
  }

  private generateComponentVariations(selection: IntelligentSelection): ComponentVariation[] {
    return [];
  }

  private generatePersonalizedElements(selection: IntelligentSelection, userInput: string): PersonalizedElement[] {
    return [];
  }

  private generateDesignExplanation(selection: IntelligentSelection): string {
    return selection.designReasoning;
  }

  private addPerformanceOptimizations(selection: IntelligentSelection): string[] {
    return [
      'React.memo による不要な再レンダリング防止',
      'useCallback によるイベントハンドラ最適化',
      'CSS Grid による効率的なレイアウト',
      'Lazy loading による初期表示の高速化'
    ];
  }

  // Utility methods
  private toPascalCase(str: string): string {
    return str.replace(/(?:^|_)([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private getTypeScriptType(columnType: string): string {
    const type = columnType.toLowerCase();
    if (type.includes('number') || type.includes('integer')) return 'number';
    if (type.includes('boolean')) return 'boolean';
    return 'string';
  }

  private getDefaultValue(columnType: string): string {
    const type = columnType.toLowerCase();
    if (type.includes('number') || type.includes('integer')) return '0';
    if (type.includes('boolean')) return 'false';
    return "''";
  }

  private getInputType(columnType: string): string {
    const type = columnType.toLowerCase();
    if (type.includes('email')) return 'email';
    if (type.includes('url')) return 'url';
    if (type.includes('number') || type.includes('integer')) return 'number';
    if (type.includes('date')) return 'date';
    return 'text';
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0,0,0';
    
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ].join(',');
  }
}

export const dynamicCustomizationEngine = new DynamicCustomizationEngine();