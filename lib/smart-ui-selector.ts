// AI-powered UI selection engine with quality optimization
export interface UIDesignPattern {
  id: string;
  name: string;
  category: 'productivity' | 'creative' | 'business' | 'social' | 'ecommerce' | 'dashboard';
  complexity: 'simple' | 'moderate' | 'complex';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  components: string[];
  layout: 'minimal' | 'modern' | 'professional' | 'creative';
  mvpScore: number; // 1-10, higher = better MVP experience
  figmaUrl?: string;
}

// High-quality design patterns optimized for MVP satisfaction
export const PREMIUM_DESIGN_PATTERNS: UIDesignPattern[] = [
  {
    id: 'modern-dashboard',
    name: 'Modern Analytics Dashboard',
    category: 'dashboard',
    complexity: 'moderate',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#3b82f6',
      background: '#f9fafb',
      text: '#111827'
    },
    components: ['charts', 'metrics-cards', 'tables', 'filters'],
    layout: 'professional',
    mvpScore: 9,
    figmaUrl: 'https://www.figma.com/design/dashboard-analytics-template'
  },
  {
    id: 'minimal-productivity',
    name: 'Clean Productivity App',
    category: 'productivity',
    complexity: 'simple',
    colors: {
      primary: '#059669',
      secondary: '#d1fae5',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1f2937'
    },
    components: ['forms', 'lists', 'buttons', 'cards'],
    layout: 'minimal',
    mvpScore: 8,
    figmaUrl: 'https://www.figma.com/design/productivity-minimal-template'
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio Showcase',
    category: 'creative',
    complexity: 'moderate',
    colors: {
      primary: '#7c3aed',
      secondary: '#ede9fe',
      accent: '#a855f7',
      background: '#fafafa',
      text: '#1f2937'
    },
    components: ['galleries', 'hero-sections', 'testimonials', 'contact-forms'],
    layout: 'creative',
    mvpScore: 7,
    figmaUrl: 'https://www.figma.com/design/creative-portfolio-template'
  },
  {
    id: 'business-saas',
    name: 'Professional SaaS Platform',
    category: 'business',
    complexity: 'complex',
    colors: {
      primary: '#1e40af',
      secondary: '#dbeafe',
      accent: '#2563eb',
      background: '#ffffff',
      text: '#1f2937'
    },
    components: ['navigation', 'pricing-tables', 'feature-sections', 'auth-forms'],
    layout: 'professional',
    mvpScore: 9,
    figmaUrl: 'https://www.figma.com/design/business-saas-template'
  },
  {
    id: 'social-community',
    name: 'Social Community Platform',
    category: 'social',
    complexity: 'moderate',
    colors: {
      primary: '#dc2626',
      secondary: '#fecaca',
      accent: '#ef4444',
      background: '#ffffff',
      text: '#1f2937'
    },
    components: ['feeds', 'user-profiles', 'messaging', 'notifications'],
    layout: 'modern',
    mvpScore: 8,
    figmaUrl: 'https://www.figma.com/design/social-community-template'
  },
  {
    id: 'ecommerce-shop',
    name: 'Modern E-commerce Store',
    category: 'ecommerce',
    complexity: 'complex',
    colors: {
      primary: '#f59e0b',
      secondary: '#fef3c7',
      accent: '#d97706',
      background: '#ffffff',
      text: '#1f2937'
    },
    components: ['product-grids', 'cart', 'checkout', 'search'],
    layout: 'modern',
    mvpScore: 9,
    figmaUrl: 'https://www.figma.com/design/ecommerce-modern-template'
  }
];

// AI-powered pattern selection based on user requirements
export function selectOptimalDesignPattern(userIdea: string): UIDesignPattern {
  const idea = userIdea.toLowerCase();
  
  // Advanced keyword analysis for better pattern matching (English + Japanese)
  const categoryKeywords = {
    dashboard: ['dashboard', 'analytics', 'metrics', 'data', 'chart', 'graph', 'report', 'ダッシュボード', 'データ', 'グラフ', 'レポート', '分析', 'メトリクス'],
    productivity: ['todo', 'task', 'note', 'manage', 'organize', 'schedule', 'plan', 'タスク', '管理', 'ノート', 'メモ', 'スケジュール', '予定', '計画', 'チーム', 'プロジェクト'],
    creative: ['portfolio', 'gallery', 'showcase', 'design', 'art', 'creative', 'visual', 'ポートフォリオ', 'ギャラリー', 'デザイン', 'アート', '作品', '制作'],
    business: ['business', 'saas', 'professional', 'enterprise', 'corporate', 'service', 'ビジネス', '企業', '法人', '会社', 'サービス', '営業'],
    social: ['social', 'community', 'chat', 'message', 'share', 'connect', 'network', 'ソーシャル', 'コミュニティ', 'チャット', 'メッセージ', '共有', 'ネットワーク', 'sns'],
    ecommerce: ['shop', 'store', 'buy', 'sell', 'product', 'cart', 'payment', 'ecommerce', 'ショップ', '店舗', '購入', '販売', '商品', 'カート', '決済', 'ec']
  };
  
  // Calculate category scores
  const categoryScores: Record<string, number> = {};
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    categoryScores[category] = keywords.reduce((score, keyword) => {
      const matches = (idea.match(new RegExp(keyword, 'g')) || []).length;
      return score + matches * (keyword.length > 4 ? 2 : 1); // Longer keywords get more weight
    }, 0);
  });
  
  // Find the best matching category
  const bestCategory = Object.entries(categoryScores).reduce((best, [category, score]) => 
    score > best.score ? { category, score } : best
  , { category: 'productivity', score: 0 });
  
  // Get patterns for the best category, sorted by MVP score
  const categoryPatterns = PREMIUM_DESIGN_PATTERNS
    .filter(pattern => pattern.category === bestCategory.category)
    .sort((a, b) => b.mvpScore - a.mvpScore);
  
  // Return the highest MVP score pattern, or fallback to minimal productivity
  return categoryPatterns[0] || PREMIUM_DESIGN_PATTERNS.find(p => p.id === 'minimal-productivity')!;
}

// Import Figma UI generator
import { figmaUIGenerator } from './figma-ui-generator';

// Generate optimized UI code with selected pattern
export function generateOptimizedUI(pattern: UIDesignPattern, userIdea: string, schema: any, figmaDesign?: any): string {
  // If Figma design is provided, use the Figma UI generator
  if (figmaDesign) {
    return figmaUIGenerator.generateComponentsFromFigma(figmaDesign, schema);
  }
  
  // Otherwise use the standard generator
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
import { ${getIconImports(pattern.components)} } from 'lucide-react';

interface ${toPascalCase(tableName)}Item {
  id: string;
${columns.map((col: any) => `  ${col.name}: ${getTypeScriptType(col.type)};`).join('\n')}
  created_at: string;
  updated_at: string;
}

export const ${toPascalCase(tableName)}App = () => {
  const [items, setItems] = useState<${toPascalCase(tableName)}Item[]>([]);
  const [formData, setFormData] = useState({
${columns.map((col: any) => `    ${col.name}: ${getDefaultValue(col.type)}`).join(',\n')}
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
${columns.map((col: any) => `          ${col.name}: ${getDefaultValue(col.type)}`).join(',\n')}
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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  ${userIdea}
                </h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ${pattern.name} • MVP Ready
            </Badge>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Add New Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
${columns.map((col: any) => `                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ${col.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <Input
                      type="${getInputType(col.type)}"
                      value={formData.${col.name}}
                      onChange={(e) => setFormData({...formData, ${col.name}: e.target.value})}
                      required
                      className="w-full"
                    />
                  </div>`).join('\n')}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? 'Adding...' : 'Add Item'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-green-600" />
                  Items ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No items yet. Add your first item to get started!
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
${columns.map((col: any) => `                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                ${col.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </span>
                              <span className="ml-2">{item.${col.name}}</span>
                            </div>`).join('\n')}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
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

export default ${toPascalCase(tableName)}App;`;
}

// Helper functions
function getIconImports(components: string[]): string {
  const iconMap = {
    'charts': 'BarChart3',
    'metrics-cards': 'TrendingUp',
    'tables': 'Table',
    'filters': 'Filter',
    'forms': 'Plus',
    'lists': 'List',
    'buttons': 'MousePointer',
    'cards': 'Layout',
    'galleries': 'Images',
    'hero-sections': 'Star',
    'testimonials': 'Quote',
    'contact-forms': 'Mail'
  };
  
  const icons = components.map(comp => iconMap[comp] || 'Star').filter(Boolean);
  return Array.from(new Set(['Plus', 'List', 'Trash2', ...icons])).join(', ');
}

function getInputType(columnType: string): string {
  const type = columnType.toLowerCase();
  if (type.includes('email')) return 'email';
  if (type.includes('url')) return 'url';
  if (type.includes('number') || type.includes('integer')) return 'number';
  if (type.includes('date')) return 'date';
  if (type.includes('time')) return 'time';
  return 'text';
}

function getDefaultValue(columnType: string): string {
  const type = columnType.toLowerCase();
  if (type.includes('number') || type.includes('integer')) return '0';
  if (type.includes('boolean')) return 'false';
  return "''";
}

function toPascalCase(str: string): string {
  return str.replace(/(?:^|_)([a-z])/g, (_, letter) => letter.toUpperCase());
}

function getTypeScriptType(columnType: string): string {
  const type = columnType.toLowerCase();
  if (type.includes('number') || type.includes('integer')) return 'number';
  if (type.includes('boolean')) return 'boolean';
  if (type.includes('date') || type.includes('time')) return 'string';
  return 'string';
}