// Enhanced UI generator with Figma design integration
import { FigmaDesignData, FigmaComponent } from './figma-api';
import { UIDesignPattern } from './smart-ui-selector';

export interface ComponentMapping {
  figmaComponent: FigmaComponent;
  reactComponent: string;
  props: Record<string, any>;
  styling: string;
}

export class FigmaUIGenerator {
  // Generate React components from Figma design
  generateComponentsFromFigma(figmaDesign: FigmaDesignData, schema: any): string {
    const {tableName} = schema;
    const columns = schema.columns.filter((col: any) => 
      !col.primaryKey && 
      !col.name.includes('created_at') && 
      !col.name.includes('updated_at')
    );

    const componentMappings = this.analyzeAndMapComponents(figmaDesign.components);
    const customStyles = this.generateTailwindStyles(figmaDesign);
    
    return this.generateReactApp(tableName, columns, componentMappings, figmaDesign, customStyles);
  }

  // Analyze Figma components and map to React components
  private analyzeAndMapComponents(components: FigmaComponent[]): ComponentMapping[] {
    const mappings: ComponentMapping[] = [];
    
    const analyzeComponent = (component: FigmaComponent) => {
      const mapping = this.mapFigmaComponentToReact(component);
      if (mapping) {
        mappings.push(mapping);
      }
      
      if (component.children) {
        component.children.forEach(analyzeComponent);
      }
    };
    
    components.forEach(analyzeComponent);
    
    return mappings;
  }

  // Map individual Figma component to React component
  private mapFigmaComponentToReact(component: FigmaComponent): ComponentMapping | null {
    const name = component.name.toLowerCase();
    
    // Button mapping
    if (name.includes('button') || component.type === 'INSTANCE' && name.includes('btn')) {
      return {
        figmaComponent: component,
        reactComponent: 'Button',
        props: {
          className: this.getButtonStyles(component),
          variant: this.getButtonVariant(component),
        },
        styling: this.generateComponentStyling(component)
      };
    }
    
    // Input field mapping
    if (name.includes('input') || name.includes('field') || name.includes('textbox')) {
      return {
        figmaComponent: component,
        reactComponent: 'Input',
        props: {
          className: this.getInputStyles(component),
          type: this.inferInputType(name),
        },
        styling: this.generateComponentStyling(component)
      };
    }
    
    // Card mapping
    if (name.includes('card') || name.includes('container') || component.type === 'FRAME') {
      return {
        figmaComponent: component,
        reactComponent: 'Card',
        props: {
          className: this.getCardStyles(component),
        },
        styling: this.generateComponentStyling(component)
      };
    }
    
    // Text/Label mapping
    if (component.type === 'TEXT' || name.includes('label') || name.includes('title')) {
      return {
        figmaComponent: component,
        reactComponent: 'div',
        props: {
          className: this.getTextStyles(component),
        },
        styling: this.generateComponentStyling(component)
      };
    }
    
    return null;
  }

  // Generate Tailwind styles based on Figma design
  private generateTailwindStyles(figmaDesign: FigmaDesignData): string {
    const {colors} = figmaDesign;
    
    return `
      /* Custom Figma-based styles */
      .figma-primary { color: ${colors.primary}; }
      .figma-primary-bg { background-color: ${colors.primary}; }
      .figma-secondary { color: ${colors.secondary}; }
      .figma-secondary-bg { background-color: ${colors.secondary}; }
      .figma-accent { color: ${colors.accent}; }
      .figma-accent-bg { background-color: ${colors.accent}; }
      .figma-background { background-color: ${colors.background}; }
      .figma-text { color: ${colors.text}; }
      
      .figma-button {
        background-color: ${colors.primary};
        color: white;
        border-radius: 6px;
        padding: 8px 16px;
        font-weight: 500;
        transition: all 0.2s;
      }
      
      .figma-button:hover {
        background-color: ${this.darkenColor(colors.primary, 10)};
      }
      
      .figma-input {
        border: 1px solid ${colors.secondary};
        border-radius: 4px;
        padding: 8px 12px;
        background-color: white;
        color: ${colors.text};
      }
      
      .figma-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid ${colors.secondary};
      }
    `;
  }

  // Generate complete React application
  private generateReactApp(
    tableName: string, 
    columns: any[], 
    mappings: ComponentMapping[], 
    figmaDesign: FigmaDesignData,
    customStyles: string
  ): string {
    const componentImports = this.generateImports(mappings);
    const formFields = this.generateFormFields(columns, mappings);
    const listItems = this.generateListItems(columns, mappings);
    
    return `'use client';

import React, { useState, useEffect } from 'react';
${componentImports}
import { Loader2, Plus, Trash2, Eye } from 'lucide-react';

interface ${this.toPascalCase(tableName)}Item {
  id: string;
${columns.map((col: any) => `  ${col.name}: ${this.getTypeScriptType(col.type)};`).join('\n')}
  created_at: string;
  updated_at: string;
}

export const Figma${this.toPascalCase(tableName)}App = () => {
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
    <>
      <style jsx global>{\`
        ${customStyles}
      \`}</style>
      
      <div className="min-h-screen figma-background">
        {/* Figma-inspired Header */}
        <header className="border-b shadow-sm bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold figma-text">
                  ${figmaDesign.name} - ${this.toPascalCase(tableName)}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm figma-text opacity-75">
                  Layout: ${figmaDesign.layout} • ${figmaDesign.complexity}
                </span>
                <Eye className="h-4 w-4 figma-accent" />
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
            {/* Add Form */}
            <div className="lg:col-span-1">
              <div className="figma-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Plus className="h-5 w-5 figma-accent" />
                  <h2 className="text-lg font-semibold figma-text">Add New Item</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
${formFields}
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="figma-button w-full flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Item
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Items List */}
            <div className="lg:col-span-2">
              <div className="figma-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Eye className="h-5 w-5 figma-accent" />
                  <h2 className="text-lg font-semibold figma-text">
                    Items ({items.length})
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-8 figma-text opacity-75">
                      No items yet. Add your first item to get started!
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="figma-card p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
${listItems}
                          </div>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Figma${this.toPascalCase(tableName)}App;`;
  }

  // Helper methods
  private generateImports(mappings: ComponentMapping[]): string {
    const reactComponents = Array.from(new Set(mappings.map(m => m.reactComponent)));
    const imports = [];
    
    if (reactComponents.includes('Button')) {
      imports.push("import { Button } from '@/components/ui/button';");
    }
    if (reactComponents.includes('Input')) {
      imports.push("import { Input } from '@/components/ui/input';");
    }
    if (reactComponents.includes('Card')) {
      imports.push("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';");
    }
    
    return imports.join('\n');
  }

  private generateFormFields(columns: any[], mappings: ComponentMapping[]): string {
    return columns.map((col: any) => `                  <div>
                    <label className="block text-sm font-medium mb-1 figma-text">
                      ${col.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </label>
                    <input
                      type="${this.getInputType(col.type)}"
                      value={formData.${col.name}}
                      onChange={(e) => setFormData({...formData, ${col.name}: e.target.value})}
                      required
                      className="figma-input w-full"
                    />
                  </div>`).join('\n');
  }

  private generateListItems(columns: any[], mappings: ComponentMapping[]): string {
    return columns.map((col: any) => `                            <div className="flex gap-2">
                              <span className="text-sm font-medium figma-text opacity-75">
                                ${col.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}:
                              </span>
                              <span className="figma-text">{item.${col.name}}</span>
                            </div>`).join('\n');
  }

  // Style generation methods
  private getButtonStyles(component: FigmaComponent): string {
    return 'figma-button';
  }

  private getButtonVariant(component: FigmaComponent): string {
    return 'default';
  }

  private getInputStyles(component: FigmaComponent): string {
    return 'figma-input';
  }

  private getCardStyles(component: FigmaComponent): string {
    return 'figma-card';
  }

  private getTextStyles(component: FigmaComponent): string {
    return 'figma-text';
  }

  private generateComponentStyling(component: FigmaComponent): string {
    const styles = [];
    
    if (component.width) styles.push(`width: ${component.width}px`);
    if (component.height) styles.push(`height: ${component.height}px`);
    
    return styles.join('; ');
  }

  private inferInputType(name: string): string {
    if (name.includes('email')) return 'email';
    if (name.includes('url')) return 'url';
    if (name.includes('number')) return 'number';
    if (name.includes('date')) return 'date';
    if (name.includes('password')) return 'password';
    return 'text';
  }

  private darkenColor(color: string, percent: number): string {
    // Simple color darkening - in production would use a proper color library
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const darken = (val: number) => Math.max(0, Math.floor(val * (1 - percent / 100)));
      
      return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
    }
    
    return color;
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
}

export const figmaUIGenerator = new FigmaUIGenerator();