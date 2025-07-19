'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as Icons from 'lucide-react'
import { ArrowLeft, Palette, Layout, Smartphone } from 'lucide-react'
import { createSafeStyle, type StyleData } from '@/lib/styleUtils'


interface ThemeBuilderProps {
  selectedStyle: StyleData
  onBack: () => void
  onApplyTheme?: () => void
}

export default function ThemeBuilder({ selectedStyle, onBack, onApplyTheme }: ThemeBuilderProps) {
  const safeStyle = createSafeStyle(selectedStyle)
  const IconComponent = Icons[safeStyle.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">テーマビルダー</h1>
          <p className="text-gray-600">選択したスタイルでUIを構築しています</p>
        </div>
      </div>

      {/* 選択されたスタイル情報 */}
      <Card className="mb-8" style={{ borderColor: (safeStyle?.previewColor?.[1] || '#888888') + '40' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {IconComponent && (
              <IconComponent 
                className="w-6 h-6" 
                {...({ style: { color: (safeStyle?.previewColor?.[1] || '#888888') } } as any)}
              />
            )}
            {safeStyle.name} スタイル
          </CardTitle>
          <CardDescription>{safeStyle.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {safeStyle.tags.map((tag, index) => (
              <Badge
                key={index}
                style={{
                  backgroundColor: (safeStyle?.previewColor?.[1] || '#888888') + '15',
                  color: (safeStyle?.previewColor?.[0] || '#000000'),
                  border: `1px solid ${(safeStyle?.previewColor?.[1] || '#888888')}30`
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            {safeStyle.previewColor.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UIプレビューセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ライブプレビュー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              ライブプレビュー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 rounded-lg min-h-[300px]"
              style={{ 
                backgroundColor: (safeStyle?.previewColor?.[2] || '#ffffff'),
                border: `2px solid ${(safeStyle?.previewColor?.[1] || '#888888')}20`
              }}
            >
              {/* サンプルUI要素 */}
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: (safeStyle?.previewColor?.[1] || '#888888') }}
                >
                  <h3 className="text-white font-bold">ヘッダー</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      backgroundColor: 'white',
                      border: `1px solid ${(safeStyle?.previewColor?.[1] || '#888888')}30`
                    }}
                  >
                    <div 
                      className="w-full h-2 rounded"
                      style={{ backgroundColor: (safeStyle?.previewColor?.[1] || '#888888') + '30' }}
                    />
                  </div>
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      backgroundColor: 'white',
                      border: `1px solid ${(safeStyle?.previewColor?.[1] || '#888888')}30`
                    }}
                  >
                    <div 
                      className="w-3/4 h-2 rounded"
                      style={{ backgroundColor: (safeStyle?.previewColor?.[1] || '#888888') + '30' }}
                    />
                  </div>
                </div>

                <div 
                  className="p-4 rounded-lg text-center text-white font-semibold"
                  style={{ backgroundColor: (safeStyle?.previewColor?.[0] || '#000000') }}
                >
                  アクションボタン
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* コンポーネント設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              コンポーネント設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プライマリカラー
              </label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: (safeStyle?.previewColor?.[1] || '#888888') }}
                />
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {(safeStyle?.previewColor?.[1] || '#888888')}
                </code>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                セカンダリカラー
              </label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: (safeStyle?.previewColor?.[0] || '#000000') }}
                />
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {(safeStyle?.previewColor?.[0] || '#000000')}
                </code>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                背景カラー
              </label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: (safeStyle?.previewColor?.[2] || '#ffffff') }}
                />
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {(safeStyle?.previewColor?.[2] || '#ffffff')}
                </code>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ベースカラー設定
              </label>
              <Badge variant="outline" className="text-xs">
                {safeStyle.baseColor}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          カスタマイズ
        </Button>
        <Button 
          size="lg"
          onClick={onApplyTheme}
          style={{ 
            backgroundColor: (safeStyle?.previewColor?.[1] || '#888888'),
            borderColor: (safeStyle?.previewColor?.[1] || '#888888')
          }}
          className="text-white hover:opacity-90"
        >
          テーマを適用
        </Button>
      </div>
    </div>
  )
}