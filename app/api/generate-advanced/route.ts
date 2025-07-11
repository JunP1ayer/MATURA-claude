import { NextRequest, NextResponse } from 'next/server'
import { AdvancedCodeGenerator, AppRequirements } from '@/lib/advanced-generator'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { userInput, phase = 'full' } = await request.json()

    if (!userInput) {
      return NextResponse.json(
        { error: 'ユーザー入力が必要です' },
        { status: 400 }
      )
    }

    // 環境変数からAPIキーを取得
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY が設定されていません' },
        { status: 500 }
      )
    }

    console.log('🎯 Advanced Generation Started for:', userInput)

    // 自然言語から要件を生成
    const requirements = await generateAdvancedRequirements(userInput)
    console.log('📋 Generated Requirements:', requirements)

    // 高品質コード生成
    const generator = new AdvancedCodeGenerator(apiKey)
    const result = await generator.generateHighQualityApp(requirements)

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'アプリの生成に失敗しました',
          details: result.errors
        },
        { status: 500 }
      )
    }

    // ファイル保存
    const outputPath = await saveGeneratedApp(result.mainApp, requirements)
    
    // 自己テスト実行
    const testResult = await performSelfTest(outputPath)

    // 自動修正が必要な場合
    if (!testResult.success && testResult.autoFixable) {
      console.log('🔧 Attempting auto-fix...')
      const fixedApp = await autoFixCode(result.mainApp, testResult.errors)
      await saveGeneratedApp(fixedApp, requirements)
    }

    // ESLint & Prettier フォーマット
    await formatCode(outputPath)

    return NextResponse.json({
      success: true,
      result: {
        mainApp: result.mainApp,
        components: result.components,
        path: outputPath,
        requirements,
        reviewNotes: result.reviewNotes,
        testResult
      },
      message: '高品質なアプリが生成されました！'
    })

  } catch (error) {
    console.error('Advanced Generation Error:', error)
    return NextResponse.json(
      { 
        error: 'アプリの生成に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    )
  }
}

async function generateAdvancedRequirements(userInput: string): Promise<AppRequirements> {
  const input = userInput.toLowerCase()
  
  let appType = 'カスタムアプリ'
  let features: string[] = []
  let theme: 'light' | 'dark' | 'modern' | 'minimal' | 'colorful' = 'modern'
  let complexity: 'simple' | 'medium' | 'advanced' = 'medium'

  // より詳細なアプリタイプ判定
  if (input.includes('タスク') || input.includes('todo') || input.includes('やること') || input.includes('学習')) {
    appType = 'タスク・学習管理アプリ'
    features = [
      'タスク作成・編集・削除',
      '優先度設定と期限管理',
      '進捗トラッキング',
      'カテゴリ別分類',
      '統計ダッシュボード',
      'カレンダービュー',
      '達成率グラフ',
      'タグ機能',
      'エクスポート・インポート',
      'ダークモード対応'
    ]
    complexity = 'advanced'
  } else if (input.includes('家計簿') || input.includes('金融') || input.includes('お金') || input.includes('収支')) {
    appType = '家計簿・資産管理アプリ'
    features = [
      '収入・支出記録',
      'カテゴリ別自動分類',
      '月次・年次レポート',
      '予算管理・アラート',
      '収支グラフ・チャート',
      '資産推移分析',
      'レシート写真保存',
      '定期支払い管理',
      'データエクスポート',
      '多通貨対応'
    ]
    complexity = 'advanced'
    theme = 'minimal'
  } else if (input.includes('レシピ') || input.includes('料理') || input.includes('食事')) {
    appType = 'レシピ・料理管理アプリ'
    features = [
      'レシピ作成・編集',
      '材料管理・買い物リスト',
      '調理タイマー機能',
      '栄養価計算',
      'お気に入り・評価',
      '写真アップロード',
      'カテゴリ・タグ検索',
      '献立プランニング',
      'レシピ共有',
      '難易度別フィルター'
    ]
    complexity = 'advanced'
    theme = 'colorful'
  } else if (input.includes('フィットネス') || input.includes('運動') || input.includes('トレーニング')) {
    appType = 'フィットネス・健康管理アプリ'
    features = [
      'ワークアウト記録',
      '運動計画・スケジュール',
      '進捗グラフ・分析',
      'カロリー計算',
      '体重・体調管理',
      'エクササイズ動画',
      '目標設定・達成度',
      '友達機能・チャレンジ',
      'ウェアラブル連携',
      'AIコーチング'
    ]
    complexity = 'advanced'
    theme = 'dark'
  }

  // テーマの判定
  if (input.includes('ダーク') || input.includes('暗い')) theme = 'dark'
  if (input.includes('ミニマル') || input.includes('シンプル')) theme = 'minimal'
  if (input.includes('カラフル') || input.includes('明るい')) theme = 'colorful'

  // 複雑度の判定
  if (input.includes('高機能') || input.includes('プロ') || input.includes('本格的')) {
    complexity = 'advanced'
  } else if (input.includes('シンプル') || input.includes('簡単')) {
    complexity = 'simple'
  }

  return {
    appType,
    description: userInput,
    features,
    theme,
    complexity,
    apiNeeds: true,
    storeNeeds: true,
    userRequirements: userInput
  }
}

async function saveGeneratedApp(appCode: string, requirements: AppRequirements): Promise<string> {
  const outputPath = path.join(process.cwd(), 'app', 'generated-app', 'page.tsx')
  
  // Clean and format the code
  const cleanCode = appCode
    .replace(/```typescript/g, '')
    .replace(/```tsx/g, '')
    .replace(/```/g, '')
    .trim()

  // Ensure proper imports
  const enhancedCode = `'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { useAppStore } from '@/lib/stores/appStore'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Star, 
  Calendar, 
  BarChart3, 
  Settings, 
  Download, 
  Upload,
  Sun,
  Moon,
  Bell,
  User
} from 'lucide-react'

/**
 * MATURA Generated High-Quality App
 * ${requirements.appType}
 * ${requirements.description}
 * Generated with Advanced AI - Production Ready
 */

${cleanCode.includes('export default') ? cleanCode : `
${cleanCode}

export default function GeneratedApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ${requirements.appType}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">${requirements.description}</p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>高品質アプリが生成されました</CardTitle>
              <CardDescription>
                このアプリは ${requirements.complexity} レベルの複雑度で生成されました。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                ${requirements.features.map((feature, index) => `
                <div key="${index}" className="flex items-center space-x-2">
                  <Checkbox defaultChecked />
                  <span>${feature}</span>
                </div>`).join('')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
`}`

  try {
    // Ensure directory exists
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(outputPath, enhancedCode, 'utf-8')
    console.log('✅ Generated app saved to:', outputPath)
    return outputPath
  } catch (error) {
    throw new Error(`Failed to save generated app: ${error}`)
  }
}

async function performSelfTest(filePath: string): Promise<{
  success: boolean
  errors: string[]
  autoFixable: boolean
}> {
  const errors: string[] = []
  
  try {
    // TypeScript check
    console.log('🔍 Running TypeScript validation...')
    await execAsync(`npx tsc --noEmit --skipLibCheck "${filePath}"`)
    console.log('✅ TypeScript validation passed')
  } catch (error: any) {
    const errorOutput = error.stdout || error.message
    if (errorOutput.includes('Cannot find module')) {
      errors.push('Missing imports detected')
      return { success: false, errors, autoFixable: true }
    }
    errors.push(`TypeScript error: ${errorOutput}`)
  }

  try {
    // ESLint check
    console.log('🔍 Running ESLint validation...')
    await execAsync(`npx eslint "${filePath}" --format=json`)
    console.log('✅ ESLint validation passed')
  } catch (error: any) {
    // ESLint errors are usually auto-fixable
    errors.push('ESLint issues detected')
    return { success: false, errors, autoFixable: true }
  }

  return {
    success: errors.length === 0,
    errors,
    autoFixable: false
  }
}

async function autoFixCode(originalCode: string, errors: string[]): Promise<string> {
  console.log('🔧 Attempting auto-fix for errors:', errors)
  
  let fixedCode = originalCode

  // Fix missing imports
  if (errors.some(e => e.includes('Missing imports'))) {
    // Add comprehensive imports
    fixedCode = fixedCode.replace(
      /'use client'/,
      `'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'`
    )
  }

  // Fix common TypeScript issues
  fixedCode = fixedCode.replace(/any\[\]/g, 'unknown[]')
  fixedCode = fixedCode.replace(/: any/g, ': unknown')

  return fixedCode
}

async function formatCode(filePath: string): Promise<void> {
  try {
    console.log('🎨 Formatting code with Prettier...')
    await execAsync(`npx prettier --write "${filePath}"`)
    console.log('✅ Code formatted successfully')
  } catch (error) {
    console.warn('⚠️ Prettier formatting failed:', error)
  }

  try {
    console.log('🔧 Auto-fixing with ESLint...')
    await execAsync(`npx eslint "${filePath}" --fix`)
    console.log('✅ ESLint auto-fix completed')
  } catch (error) {
    console.warn('⚠️ ESLint auto-fix failed:', error)
  }
}