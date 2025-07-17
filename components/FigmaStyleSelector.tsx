'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Figma, ExternalLink, Sparkles, Palette } from 'lucide-react';
import { PREMIUM_DESIGN_PATTERNS } from '@/lib/smart-ui-selector';
import { FigmaStatusIndicator } from './FigmaStatusIndicator';

interface FigmaStyleSelectorProps {
  onStyleSelect: (pattern: any, figmaUrl?: string) => void;
  selectedPattern?: any;
  customFigmaUrl?: string;
  onFigmaUrlChange?: (url: string) => void;
}

export const FigmaStyleSelector: React.FC<FigmaStyleSelectorProps> = ({
  onStyleSelect,
  selectedPattern,
  customFigmaUrl = '',
  onFigmaUrlChange
}) => {
  const [useCustomFigma, setUseCustomFigma] = useState(false);
  const [customUrl, setCustomUrl] = useState(customFigmaUrl);

  const handlePatternSelect = (pattern: any) => {
    if (useCustomFigma && customUrl) {
      onStyleSelect(pattern, customUrl);
    } else {
      onStyleSelect(pattern, pattern.figmaUrl);
    }
  };

  const handleCustomUrlChange = (url: string) => {
    setCustomUrl(url);
    if (onFigmaUrlChange) {
      onFigmaUrlChange(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Figma Status Indicator */}
      <FigmaStatusIndicator />
      
      {/* Custom Figma URL Option */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Figma className="h-5 w-5" />
            Figmaデザインテンプレート
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="useCustomFigma"
              checked={useCustomFigma}
              onChange={(e) => setUseCustomFigma(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="useCustomFigma" className="text-sm font-medium text-gray-700">
              カスタムFigmaファイルを使用
            </label>
          </div>
          
          {useCustomFigma && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                FigmaファイルURL
              </label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://www.figma.com/file/..."
                  value={customUrl}
                  onChange={(e) => handleCustomUrlChange(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.figma.com', '_blank')}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Figma
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                ※ Figma APIトークンが設定されていない場合、デザイン要素の自動解析は行われません
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Design Patterns */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">プレミアムデザインパターン</h3>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Figma連携対応
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PREMIUM_DESIGN_PATTERNS.map((pattern) => (
            <Card 
              key={pattern.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPattern?.id === pattern.id 
                  ? 'ring-2 ring-purple-500 shadow-lg bg-purple-50' 
                  : 'hover:shadow-md border-gray-200'
              }`}
              onClick={() => handlePatternSelect(pattern)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{pattern.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {pattern.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {pattern.complexity}
                        </Badge>
                      </div>
                    </div>
                    {pattern.figmaUrl && (
                      <Figma className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    )}
                  </div>

                  {/* Color Preview */}
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200" 
                      style={{ backgroundColor: pattern.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200" 
                      style={{ backgroundColor: pattern.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200" 
                      style={{ backgroundColor: pattern.colors.accent }}
                      title="Accent"
                    />
                  </div>

                  {/* MVP Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">MVP Score: {pattern.mvpScore}/10</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {pattern.layout}
                    </Badge>
                  </div>

                  {/* Components */}
                  <div className="flex flex-wrap gap-1">
                    {pattern.components.slice(0, 3).map((component) => (
                      <Badge key={component} variant="outline" className="text-xs px-1 py-0">
                        {component}
                      </Badge>
                    ))}
                    {pattern.components.length > 3 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{pattern.components.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Figma URL Preview */}
                  {pattern.figmaUrl && !useCustomFigma && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">Figmaテンプレート利用可能</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Usage Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Figma連携について
              </p>
              <p className="text-xs text-blue-700">
                Figma APIトークンが設定されている場合、指定されたデザインファイルから色、レイアウト、コンポーネント構造を自動解析してUIを生成します。
                トークンが未設定の場合は、選択されたデザインパターンのスタイルが適用されます。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FigmaStyleSelector;