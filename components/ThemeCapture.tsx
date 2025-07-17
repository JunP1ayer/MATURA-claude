'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, User, Heart, Star, Bell } from 'lucide-react'

interface ThemeData {
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
}

const themes: ThemeData[] = [
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
    }
  }
]

interface SingleThemeDisplayProps {
  theme: ThemeData
  className?: string
}

function SingleThemeDisplay({ theme, className = "" }: SingleThemeDisplayProps) {
  return (
    <div 
      className={`w-full h-[500px] p-6 rounded-lg border-2 ${className}`}
      style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between mb-6 pb-3 border-b"
        style={{ borderColor: theme.colors.border }}
      >
        <h1 
          className="text-xl font-bold"
          style={{ color: theme.colors.text }}
        >
          Dashboard
        </h1>
        <div className="flex gap-2">
          <div 
            className="px-3 py-1 rounded-md text-sm font-medium"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background
            }}
          >
            <Settings className="w-4 h-4 inline mr-1" />
            設定
          </div>
          <div 
            className="p-2 rounded-md border"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.textSecondary
            }}
          >
            <Bell className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Form Card */}
        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <h3 className="font-semibold text-sm" style={{ color: theme.colors.text }}>
              ユーザー情報
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>
                名前
              </div>
              <div 
                className="w-full h-8 px-2 text-xs rounded border"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.textSecondary
                }}
              >
                山田太郎
              </div>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>
                メール
              </div>
              <div 
                className="w-full h-8 px-2 text-xs rounded border"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.textSecondary
                }}
              >
                example@email.com
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <div 
                className="px-3 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background
                }}
              >
                保存
              </div>
              <div 
                className="px-3 py-1 rounded text-xs border"
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.textSecondary
                }}
              >
                キャンセル
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div 
              className="p-3 rounded-lg border text-center"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }}
            >
              <div 
                className="text-lg font-bold"
                style={{ color: theme.colors.primary }}
              >
                125
              </div>
              <div 
                className="text-xs"
                style={{ color: theme.colors.textSecondary }}
              >
                フォロワー
              </div>
            </div>
            <div 
              className="p-3 rounded-lg border text-center"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }}
            >
              <div 
                className="text-lg font-bold"
                style={{ color: theme.colors.accent }}
              >
                48
              </div>
              <div 
                className="text-xs"
                style={{ color: theme.colors.textSecondary }}
              >
                投稿
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div 
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4" style={{ color: theme.colors.accent }} />
              <h4 className="font-semibold text-sm" style={{ color: theme.colors.text }}>
                おすすめ
              </h4>
            </div>
            <p 
              className="text-xs mb-3"
              style={{ color: theme.colors.textSecondary }}
            >
              新しい機能をお試しください
            </p>
            <div className="flex gap-1 mb-3">
              <span 
                className="px-2 py-1 text-xs rounded border"
                style={{
                  backgroundColor: theme.colors.primary + '20',
                  color: theme.colors.primary,
                  borderColor: theme.colors.primary + '40'
                }}
              >
                新機能
              </span>
              <span 
                className="px-2 py-1 text-xs rounded border"
                style={{
                  backgroundColor: theme.colors.accent + '20',
                  color: theme.colors.accent,
                  borderColor: theme.colors.accent + '40'
                }}
              >
                人気
              </span>
            </div>
            <div 
              className="w-full py-2 px-3 rounded text-xs text-center font-medium"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.background
              }}
            >
              <Heart className="w-3 h-3 inline mr-1" />
              試してみる
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="pt-3 border-t text-center"
        style={{ borderColor: theme.colors.border }}
      >
        <div className="text-xs font-medium mb-1" style={{ color: theme.colors.text }}>
          {theme.name}
        </div>
        <div 
          className="text-xs"
          style={{ color: theme.colors.textSecondary }}
        >
          {theme.description}
        </div>
      </div>
    </div>
  )
}

export default function ThemeCapture() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
      {themes.map((theme, index) => (
        <div key={index} className="space-y-2">
          <h2 className="text-lg font-bold text-gray-800 text-center">
            {theme.name}
          </h2>
          <SingleThemeDisplay theme={theme} />
        </div>
      ))}
    </div>
  )
}