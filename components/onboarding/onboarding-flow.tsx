'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Rocket, 
  Brain, 
  Wand2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Play,
  Settings,
  Users,
  Zap,
  Code,
  Palette
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { InteractiveButton, InteractiveCard } from '../ui/interactive-feedback'
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  staggerContainer, 
  scaleIn,
  pageTransition 
} from '@/lib/animations'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  content: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'MATURAへようこそ！',
    description: 'AIが駆動する次世代アプリ生成プラットフォーム',
    icon: Sparkles,
    content: (
      <div className="text-center space-y-6">
        <motion.div
          variants={scaleIn}
          animate="animate"
          className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center"
        >
          <Sparkles className="h-12 w-12 text-white" />
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MATURA
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            あなたのアイデアを、わずか数分で実動するアプリケーションに変換します
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          animate="animate"
          className="grid grid-cols-2 gap-4 mt-8"
        >
          {[
            { icon: Brain, text: 'AI駆動' },
            { icon: Zap, text: '高速生成' },
            { icon: Code, text: '実用機能' },
            { icon: Palette, text: '美しいUI' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg"
            >
              <feature.icon className="h-8 w-8 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    ),
  },
  {
    id: 'how-it-works',
    title: 'どのように動作するか',
    description: '3つのシンプルなステップでアプリを生成',
    icon: Rocket,
    content: (
      <motion.div
        variants={staggerContainer}
        animate="animate"
        className="space-y-6"
      >
        {[
          {
            step: 1,
            title: 'アイデア入力',
            description: '作りたいアプリのアイデアを自然言語で入力',
            icon: Wand2,
            example: '「タスク管理アプリが欲しい」',
          },
          {
            step: 2,
            title: '構造化分析',
            description: 'AIがアイデアを詳細に分析・構造化',
            icon: Brain,
            example: 'Why・Who・What・How・Impact',
          },
          {
            step: 3,
            title: 'アプリ生成',
            description: '実用的なCRUD機能付きアプリを生成',
            icon: Rocket,
            example: 'Next.js + TypeScript + DB連携',
          },
        ].map((step, index) => (
          <motion.div
            key={step.step}
            variants={fadeInLeft}
            className="flex items-start space-x-4"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {step.step}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <step.icon className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-lg">{step.title}</h3>
              </div>
              <p className="text-gray-600 mb-2">{step.description}</p>
              <Badge variant="secondary" className="text-sm">
                例: {step.example}
              </Badge>
            </div>
          </motion.div>
        ))}
      </motion.div>
    ),
  },
  {
    id: 'features',
    title: '主要機能',
    description: 'MATURAが提供する強力な機能',
    icon: Settings,
    content: (
      <motion.div
        variants={staggerContainer}
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          {
            title: 'CRUD機能',
            description: '完全なデータ操作機能を自動生成',
            icon: Code,
            color: 'bg-blue-500',
          },
          {
            title: '状態管理',
            description: 'Zustand + React Query自動統合',
            icon: Zap,
            color: 'bg-green-500',
          },
          {
            title: 'セキュリティ',
            description: 'RLS・認証・データ保護を標準装備',
            icon: CheckCircle2,
            color: 'bg-purple-500',
          },
          {
            title: 'AI拡張',
            description: '自然言語での機能追加・改善',
            icon: Brain,
            color: 'bg-orange-500',
          },
          {
            title: 'レスポンシブUI',
            description: 'Tailwind CSS + shadcn/ui',
            icon: Palette,
            color: 'bg-pink-500',
          },
          {
            title: 'パフォーマンス',
            description: 'キャッシュ最適化・高速読み込み',
            icon: Rocket,
            color: 'bg-indigo-500',
          },
        ].map((feature, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <InteractiveCard className="h-full">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        ))}
      </motion.div>
    ),
  },
  {
    id: 'examples',
    title: 'アプリ例',
    description: 'MATURAで生成できるアプリケーション',
    icon: Users,
    content: (
      <motion.div
        variants={staggerContainer}
        animate="animate"
        className="space-y-4"
      >
        {[
          {
            name: 'ホテル予約システム',
            description: '予約管理・検索・決済機能付き',
            features: ['予約CRUD', '統計ダッシュボード', '検索・フィルター'],
            color: 'from-blue-400 to-blue-600',
          },
          {
            name: '家計簿アプリ',
            description: '収支管理・分析・目標設定',
            features: ['取引記録', 'カテゴリ分析', '収支レポート'],
            color: 'from-green-400 to-green-600',
          },
          {
            name: 'タスク管理アプリ',
            description: 'プロジェクト管理・進捗追跡',
            features: ['タスクCRUD', '期限管理', '進捗可視化'],
            color: 'from-purple-400 to-purple-600',
          },
        ].map((example, index) => (
          <motion.div key={index} variants={fadeInRight}>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`h-20 bg-gradient-to-r ${example.color} flex items-center justify-center`}>
                  <h3 className="text-white font-bold text-lg">{example.name}</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-3">{example.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {example.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    ),
  },
  {
    id: 'ready',
    title: 'さあ、始めましょう！',
    description: '最初のアプリを作成する準備ができました',
    icon: Play,
    content: (
      <div className="text-center space-y-6">
        <motion.div
          variants={scaleIn}
          animate="animate"
          className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center"
        >
          <Play className="h-10 w-10 text-white ml-1" />
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            準備完了！
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            どんなアプリでも作ることができます。シンプルなアイデアから、複雑なビジネスアプリケーションまで。
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          animate="animate"
          className="space-y-3"
        >
          <motion.div variants={fadeInUp}>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              ✅ セキュリティ設定済み
            </Badge>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              ⚡ パフォーマンス最適化済み
            </Badge>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              🤖 AI拡張機能有効
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    ),
    action: {
      label: '最初のアプリを作成',
      onClick: () => {
        window.location.href = '/generator'
      },
    },
  },
]

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const currentStepData = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      setIsVisible(false)
      setTimeout(onComplete, 300)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    setIsVisible(false)
    setTimeout(onComplete, 300)
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <currentStepData.icon className="h-6 w-6 text-purple-500" />
            <div>
              <h1 className="font-bold text-lg text-gray-900">{currentStepData.title}</h1>
              <p className="text-sm text-gray-500">{currentStepData.description}</p>
            </div>
          </div>
          
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            スキップ
          </button>
        </div>

        {/* プログレスバー */}
        <div className="px-6 py-2">
          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>ステップ {currentStep + 1}</span>
            <span>{onboardingSteps.length} / {onboardingSteps.length}</span>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-8 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>戻る</span>
          </Button>

          <div className="flex space-x-3">
            {currentStepData.action ? (
              <InteractiveButton
                onClick={currentStepData.action.onClick}
                className="flex items-center space-x-2"
              >
                <span>{currentStepData.action.label}</span>
                <Rocket className="h-4 w-4" />
              </InteractiveButton>
            ) : (
              <InteractiveButton
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>{isLastStep ? '完了' : '次へ'}</span>
                <ArrowRight className="h-4 w-4" />
              </InteractiveButton>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// オンボーディングの表示制御フック
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('matura_onboarding_completed')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem('matura_onboarding_completed', 'true')
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem('matura_onboarding_completed')
    setShowOnboarding(true)
  }

  return {
    showOnboarding,
    completeOnboarding,
    resetOnboarding,
  }
}