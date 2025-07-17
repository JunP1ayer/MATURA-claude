'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Star, Settings, User, Mail, Bell } from 'lucide-react'

interface ThemeConfig {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    accent: string
  }
  styles: {
    borderRadius: string
    fontSize: string
    spacing: string
  }
}

const themes: ThemeConfig[] = [
  {
    name: "モダン・ミニマル",
    description: "白ベース、余白多め、クリーンなデザイン",
    colors: {
      primary: "#000000",
      secondary: "#6b7280",
      background: "#ffffff",
      surface: "#f9fafb",
      text: "#111827",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      accent: "#3b82f6"
    },
    styles: {
      borderRadius: "8px",
      fontSize: "16px",
      spacing: "24px"
    }
  },
  {
    name: "ポップ・カラフル",
    description: "アイコンとカラーで親しみやすさ重視",
    colors: {
      primary: "#ec4899",
      secondary: "#f97316",
      background: "#fef7ff",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#fce7f3",
      accent: "#8b5cf6"
    },
    styles: {
      borderRadius: "12px",
      fontSize: "16px",
      spacing: "20px"
    }
  },
  {
    name: "ダーク・クール",
    description: "黒基調、スタイリッシュで洗練されたデザイン",
    colors: {
      primary: "#3b82f6",
      secondary: "#6366f1",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      border: "#334155",
      accent: "#06b6d4"
    },
    styles: {
      borderRadius: "6px",
      fontSize: "16px",
      spacing: "16px"
    }
  }
]

interface ThemePreviewProps {
  theme: ThemeConfig
}

function ThemePreviewComponent({ theme }: ThemePreviewProps) {
  const themeStyle = {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    borderRadius: theme.styles.borderRadius,
    padding: theme.styles.spacing
  }

  return (
    <div 
      className="w-full h-[600px] p-6 border-2 overflow-hidden"
      style={{
        ...themeStyle,
        borderColor: theme.colors.border
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between mb-6 pb-4 border-b"
        style={{ borderColor: theme.colors.border }}
      >
        <h1 
          className="text-2xl font-bold"
          style={{ color: theme.colors.text }}
        >
          {theme.name}
        </h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              borderRadius: theme.styles.borderRadius
            }}
          >
            <Settings className="w-4 h-4 mr-1" />
            設定
          </Button>
          <Button
            variant="outline"
            size="sm"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.textSecondary,
              borderRadius: theme.styles.borderRadius
            }}
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-4">
          <Card 
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.styles.borderRadius
            }}
          >
            <CardHeader>
              <CardTitle 
                className="flex items-center gap-2"
                style={{ color: theme.colors.text }}
              >
                <User className="w-5 h-5" style={{ color: theme.colors.primary }} />
                ユーザー情報
              </CardTitle>
              <CardDescription style={{ color: theme.colors.textSecondary }}>
                プロフィールを更新してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label 
                  htmlFor="name"
                  style={{ color: theme.colors.text }}
                >
                  名前
                </Label>
                <Input
                  id="name"
                  placeholder="山田太郎"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    borderRadius: theme.styles.borderRadius
                  }}
                />
              </div>
              <div>
                <Label 
                  htmlFor="email"
                  style={{ color: theme.colors.text }}
                >
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    borderRadius: theme.styles.borderRadius
                  }}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                    borderRadius: theme.styles.borderRadius
                  }}
                >
                  保存
                </Button>
                <Button
                  variant="outline"
                  style={{
                    borderColor: theme.colors.border,
                    color: theme.colors.textSecondary,
                    borderRadius: theme.styles.borderRadius
                  }}
                >
                  キャンセル
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card 
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.styles.borderRadius
              }}
            >
              <CardContent className="p-4 text-center">
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: theme.colors.primary }}
                >
                  125
                </div>
                <div 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  フォロワー
                </div>
              </CardContent>
            </Card>
            <Card 
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.styles.borderRadius
              }}
            >
              <CardContent className="p-4 text-center">
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: theme.colors.accent }}
                >
                  48
                </div>
                <div 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  投稿
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Card */}
          <Card 
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.styles.borderRadius
            }}
          >
            <CardHeader>
              <CardTitle 
                className="flex items-center gap-2"
                style={{ color: theme.colors.text }}
              >
                <Star className="w-5 h-5" style={{ color: theme.colors.accent }} />
                おすすめ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p 
                className="text-sm mb-4"
                style={{ color: theme.colors.textSecondary }}
              >
                新しい機能をお試しください
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge 
                  style={{
                    backgroundColor: theme.colors.primary + '20',
                    color: theme.colors.primary,
                    border: `1px solid ${theme.colors.primary}40`
                  }}
                >
                  新機能
                </Badge>
                <Badge 
                  style={{
                    backgroundColor: theme.colors.accent + '20',
                    color: theme.colors.accent,
                    border: `1px solid ${theme.colors.accent}40`
                  }}
                >
                  人気
                </Badge>
              </div>
              <Button
                className="w-full"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.background,
                  borderRadius: theme.styles.borderRadius
                }}
              >
                <Heart className="w-4 h-4 mr-2" />
                試してみる
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="mt-6 pt-4 border-t text-center"
        style={{ borderColor: theme.colors.border }}
      >
        <p 
          className="text-sm"
          style={{ color: theme.colors.textSecondary }}
        >
          {theme.description}
        </p>
      </div>
    </div>
  )
}

export default function ThemePreview() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          shadcn/ui テーマプレビュー
        </h1>
        <p className="text-gray-600">
          3つの異なるスタイルテーマの比較
        </p>
      </div>
      
      {themes.map((theme, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {theme.name}
          </h2>
          <ThemePreviewComponent theme={theme} />
        </div>
      ))}
    </div>
  )
}