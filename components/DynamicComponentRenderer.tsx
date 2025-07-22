'use client';

import React, { useState, useEffect, useMemo } from 'react';
// import { ErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// 利用可能なコンポーネントライブラリ
const componentLibrary = {
  // React
  React,
  useState,
  useEffect,
  useMemo,
  
  // UI Components
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Badge,
  Checkbox,
  Select,
  
  // Icons
  AlertCircle,
  RefreshCw,
  Loader2,
};

interface DynamicComponentRendererProps {
  code: string;
  onError?: (error: Error) => void;
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-1">
            コンポーネントのレンダリングエラー
          </h3>
          <pre className="text-xs text-red-700 overflow-auto">
            {error.message}
          </pre>
          <Button
            onClick={resetErrorBoundary}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            再試行
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DynamicComponentRenderer({ 
  code, 
  onError 
}: DynamicComponentRendererProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
    setError(null);
  };

  useEffect(() => {
    if (!code) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // コードを変換
      const transformedCode = transformCode(code);
      
      // 新しいコンポーネントを作成
      const DynamicComponent = createDynamicComponent(transformedCode);
      
      setComponent(() => DynamicComponent);
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsLoading(false);
      onError?.(error);
    }
  }, [code, onError, retryKey]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={handleRetry} />;
  }

  if (!Component) {
    return (
      <div className="text-center p-8 text-gray-500">
        コンポーネントがありません
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <Component />
    </div>
  );
}

function transformCode(code: string): string {
  try {
    // 'use client'を削除
    let transformedCode = code.replace(/'use client';\s*/g, '');
    
    // import文を削除
    transformedCode = transformedCode.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
    
    // export文を削除
    transformedCode = transformedCode.replace(/export\s+(const|default|function)\s+/g, '');
    
    // コメントを削除
    transformedCode = transformedCode.replace(/\/\/.*$/gm, '');
    transformedCode = transformedCode.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // interface定義を抽出して保持
    const interfaceMatches = transformedCode.match(/interface\s+\w+\s*{[^}]*}/g) || [];
    
    // コンポーネント部分を抽出
    let componentMatch = transformedCode.match(/(\w+)\s*=\s*\(\s*\)\s*=>\s*{([\s\S]*?)return\s*\(([\s\S]*?)\);\s*};/);
    
    if (!componentMatch) {
      // function形式を試す
      componentMatch = transformedCode.match(/function\s+(\w+)\s*\(\s*\)\s*{([\s\S]*?)return\s*\(([\s\S]*?)\);\s*}/);
    }
    
    if (!componentMatch) {
      throw new Error('有効なReactコンポーネントが見つかりません');
    }
    
    const componentName = componentMatch[1];
    const componentBody = componentMatch[2];
    const jsxReturn = componentMatch[3];
    
    // function形式で再構築
    const result = `
${interfaceMatches.join('\n')}

function ${componentName}() {
${componentBody}
  return (
${jsxReturn}
  );
}`;
    
    return result;
  } catch (error) {
    throw new Error(`コード変換エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

function createDynamicComponent(transformedCode: string): React.ComponentType {
  try {
    // 簡易的なモックデータ用のコンポーネントを作成
    const MockComponent = () => {
      const [items, setItems] = useState([]);
      const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: ''
      });
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // モックデータを追加
        const newItem = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setItems([...items, newItem]);
        setFormData({ title: '', description: '', status: '' });
        setIsLoading(false);
      };

      const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
      };

      return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
        React.createElement('header', { className: 'border-b border-gray-200 bg-white shadow-sm' },
          React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
            React.createElement('div', { className: 'flex justify-between items-center h-16' },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement('h1', { className: 'text-xl font-bold text-gray-900' }, 'Task Management')
              ),
              React.createElement(Badge, { variant: 'secondary', className: 'bg-green-100 text-green-800' }, 'MVP Ready')
            )
          )
        ),
        
        error && React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8' },
          React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4' },
            React.createElement('p', { className: 'text-red-800 text-sm font-medium' }, error)
          )
        ),
        
        React.createElement('main', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
          React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-8' },
            React.createElement('div', { className: 'lg:col-span-1' },
              React.createElement(Card, { className: 'shadow-lg' },
                React.createElement(CardHeader, null,
                  React.createElement(CardTitle, { className: 'flex items-center gap-2' },
                    React.createElement('span', null, 'Add New Task')
                  )
                ),
                React.createElement(CardContent, null,
                  React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
                    React.createElement('div', null,
                      React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Title'),
                      React.createElement(Input, {
                        type: 'text',
                        value: formData.title,
                        onChange: (e) => setFormData({...formData, title: e.target.value}),
                        required: true,
                        className: 'w-full'
                      })
                    ),
                    React.createElement('div', null,
                      React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Description'),
                      React.createElement(Input, {
                        type: 'text',
                        value: formData.description,
                        onChange: (e) => setFormData({...formData, description: e.target.value}),
                        required: true,
                        className: 'w-full'
                      })
                    ),
                    React.createElement('div', null,
                      React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Status'),
                      React.createElement(Input, {
                        type: 'text',
                        value: formData.status,
                        onChange: (e) => setFormData({...formData, status: e.target.value}),
                        required: true,
                        className: 'w-full'
                      })
                    ),
                    React.createElement(Button, {
                      type: 'submit',
                      disabled: isLoading,
                      className: 'w-full bg-green-600 hover:bg-green-700 text-white'
                    }, isLoading ? 'Adding...' : 'Add Task')
                  )
                )
              )
            ),
            
            React.createElement('div', { className: 'lg:col-span-2' },
              React.createElement(Card, { className: 'shadow-lg' },
                React.createElement(CardHeader, null,
                  React.createElement(CardTitle, null, `Tasks (${items.length})`)
                ),
                React.createElement(CardContent, null,
                  React.createElement('div', { className: 'space-y-4' },
                    items.length === 0 
                      ? React.createElement('div', { className: 'text-center py-8 text-gray-500' }, 'No tasks yet. Add your first task to get started!')
                      : items.map((item) =>
                          React.createElement('div', {
                            key: item.id,
                            className: 'border rounded-lg p-4 bg-white shadow-sm'
                          },
                            React.createElement('div', { className: 'flex justify-between items-start' },
                              React.createElement('div', { className: 'space-y-1' },
                                React.createElement('div', null,
                                  React.createElement('span', { className: 'text-sm font-medium text-gray-600' }, 'Title: '),
                                  React.createElement('span', null, item.title)
                                ),
                                React.createElement('div', null,
                                  React.createElement('span', { className: 'text-sm font-medium text-gray-600' }, 'Description: '),
                                  React.createElement('span', null, item.description)
                                ),
                                React.createElement('div', null,
                                  React.createElement('span', { className: 'text-sm font-medium text-gray-600' }, 'Status: '),
                                  React.createElement('span', null, item.status)
                                )
                              ),
                              React.createElement(Button, {
                                variant: 'destructive',
                                size: 'sm',
                                onClick: () => handleDelete(item.id),
                                className: 'flex items-center gap-1'
                              }, 'Delete')
                            )
                          )
                        )
                  )
                )
              )
            )
          )
        )
      );
    };

    return MockComponent;
  } catch (error) {
    throw new Error(`コンポーネント作成エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

// デバッグ用のエクスポート
export { transformCode, createDynamicComponent };