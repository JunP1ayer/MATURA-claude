'use client'

import React, { useState, useEffect } from 'react'
import { 
  Lightbulb, Users, Package, Zap, TrendingUp, 
  ArrowRight, RefreshCw, Smartphone, Monitor, 
  Globe, Layout, Palette, Type, Navigation,
  MousePointer, Sparkles, Code2, Heart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { ProcessingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'

interface UXStructure {
  // 構造化されたアイデアから導かれるUX設計
  siteArchitecture: {
    topPage: { purpose: string; elements: string[] }
    mainFeatures: { name: string; description: string; uiElements: string[] }[]
    userFlow: string[]
  }
  designSystem: {
    layout: string
    colorUsage: { primary: string; secondary: string; accent: string; usage: string }
    typography: { heading: string; body: string; accent: string }
    spacing: string
    interactions: string[]
  }
  keyScreens: {
    name: string
    purpose: string
    components: string[]
    userAction: string
  }[]
}

export default function UXBuild() {
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [uxStructure, setUxStructure] = useState<UXStructure | null>(null)
  const [activeSection, setActiveSection] = useState<'why' | 'who' | 'what' | 'how' | 'impact'>('why')

  useEffect(() => {
    if (state.insights && state.selectedUIStyle) {
      generateUXStructure()
    }
  }, [])

  const generateUXStructure = async () => {
    try {
      // 構造化されたアイデアとUIスタイルから最適なUX構造を生成
      const prompt = `
以下の構造化されたアイデアとUIスタイルから、最適なWebアプリケーションのUX構造を設計してください。

【構造化されたアイデア】
- Why (ビジョン): ${state.insights?.vision}
- Who (ターゲット): ${state.insights?.target}
- What (主要機能): ${state.insights?.features?.join(', ')}
- How (提供価値): ${state.insights?.value}
- Impact (期待効果): ${state.insights?.motivation}

【選択されたUIスタイル】
- スタイル名: ${state.selectedUIStyle?.name}
- カテゴリ: ${state.selectedUIStyle?.category}
- 特徴: ${state.selectedUIStyle?.personality?.join(', ')}
- カラー: Primary(${state.selectedUIStyle?.colors.primary}), Secondary(${state.selectedUIStyle?.colors.secondary})

以下のJSON形式で出力してください：
{
  "siteArchitecture": {
    "topPage": {
      "purpose": "トップページの目的",
      "elements": ["ヒーローセクション", "価値提案", "CTA"]
    },
    "mainFeatures": [
      {
        "name": "機能名",
        "description": "説明",
        "uiElements": ["ボタン", "フォーム", "カード"]
      }
    ],
    "userFlow": ["ステップ1", "ステップ2", "ステップ3"]
  },
  "designSystem": {
    "layout": "レイアウトパターン",
    "colorUsage": {
      "primary": "プライマリカラーの使用箇所",
      "secondary": "セカンダリカラーの使用箇所",
      "accent": "アクセントカラーの使用箇所",
      "usage": "色の使い方の指針"
    },
    "typography": {
      "heading": "見出しのスタイル",
      "body": "本文のスタイル",
      "accent": "強調テキストのスタイル"
    },
    "spacing": "余白の取り方",
    "interactions": ["ホバー効果", "トランジション", "アニメーション"]
  },
  "keyScreens": [
    {
      "name": "画面名",
      "purpose": "画面の目的",
      "components": ["コンポーネント1", "コンポーネント2"],
      "userAction": "ユーザーが行うアクション"
    }
  ]
}
`

      const response = await chatOptimized.sendMessage(
        prompt,
        [],
        'UXBuild',
        {
          timeout: 45000,
          requestStructureExtraction: true,
          onError: (error) => {
            console.error('❌ UX構造生成エラー:', error)
            // AbortErrorの場合はUI状態をリセット
            if (error.includes('aborted') || error.includes('abort')) {
              console.log('🚫 UX Build request was aborted, not showing error to user')
              return
            }
          }
        }
      )

      if (response) {
        try {
          const parsed = JSON.parse(response)
          setUxStructure(parsed)
          actions.setUXDesign(parsed)
        } catch (error) {
          console.error('Failed to parse UX structure:', error)
          // フォールバックデータを使用
          createFallbackStructure()
        }
      }
    } catch (error) {
      console.error('UX structure generation error:', error)
      // ユーザーの意図的なキャンセルの場合はフォールバック作成しない
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🚫 Request was intentionally aborted, not creating fallback')
        return
      }
      createFallbackStructure()
    }
  }

  const createFallbackStructure = () => {
    const fallback: UXStructure = {
      siteArchitecture: {
        topPage: {
          purpose: `${state.insights?.vision || 'ビジョン'}を実現するエントリーポイント`,
          elements: ['ヒーローセクション', '価値提案', 'CTAボタン', '機能紹介']
        },
        mainFeatures: state.insights?.features?.slice(0, 3).map(feature => ({
          name: feature,
          description: `${state.insights?.target}のための${feature}機能`,
          uiElements: ['入力フォーム', 'アクションボタン', '結果表示エリア']
        })) || [],
        userFlow: ['トップページ訪問', '価値を理解', '機能を試す', '結果を確認', '継続利用']
      },
      designSystem: {
        layout: state.selectedUIStyle?.spacing === 'comfortable' ? 'カード型レイアウト' : 'グリッドレイアウト',
        colorUsage: {
          primary: 'CTAボタン、重要なアクション',
          secondary: 'サブアクション、リンク',
          accent: '通知、成功メッセージ',
          usage: `${state.selectedUIStyle?.name}スタイルに基づく統一感のある配色`
        },
        typography: {
          heading: state.selectedUIStyle?.category === 'minimal' ? 'シンプルで読みやすい' : 'インパクトのある',
          body: '可読性重視',
          accent: '重要箇所の強調'
        },
        spacing: state.selectedUIStyle?.spacing || 'balanced',
        interactions: ['スムーズなホバー効果', 'フェードトランジション', 'マイクロアニメーション']
      },
      keyScreens: [
        {
          name: 'ランディングページ',
          purpose: '価値提案と信頼構築',
          components: ['ヒーロー', 'ベネフィット', 'ソーシャルプルーフ'],
          userAction: 'サービスを理解して試す'
        }
      ]
    }
    setUxStructure(fallback)
    actions.setUXDesign(fallback)
  }

  const structuredIdea = {
    why: { 
      icon: Lightbulb, 
      label: 'Why - なぜ必要か', 
      content: state.insights?.vision,
      color: 'from-amber-500 to-orange-500'
    },
    who: { 
      icon: Users, 
      label: 'Who - 誰のために', 
      content: state.insights?.target,
      color: 'from-blue-500 to-cyan-500'
    },
    what: { 
      icon: Package, 
      label: 'What - 何を提供', 
      content: state.insights?.features?.join('、'),
      color: 'from-purple-500 to-pink-500'
    },
    how: { 
      icon: Zap, 
      label: 'How - どう実現', 
      content: state.insights?.value,
      color: 'from-green-500 to-emerald-500'
    },
    impact: { 
      icon: TrendingUp, 
      label: 'Impact - 期待効果', 
      content: state.insights?.motivation,
      color: 'from-red-500 to-rose-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4"
    >
      {/* ヘッダー：構造化されたアイデアの可視化 */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                🎯 あなたのアイデアを最適なUXに変換
              </h2>
              <p className="text-indigo-100 text-lg">
                構造化された5つの要素と{state.selectedUIStyle?.name}スタイルから、
                理想的な体験設計を導き出しました
              </p>
            </div>
            <PreviewButton 
              data={uxStructure} 
              title="UX構造"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            />
          </div>

          {/* 5つの構造要素のタブ */}
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(structuredIdea).map(([key, item]) => {
              const Icon = item.icon
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as any)}
                  className={`
                    p-3 rounded-lg transition-all transform
                    ${activeSection === key 
                      ? 'bg-white/30 scale-105 shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs font-medium">{item.label.split(' - ')[0]}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* アクティブな構造要素の詳細 */}
        <div className="p-6 bg-gray-50">
          <AnimatePresence mode="wait">
            {Object.entries(structuredIdea).map(([key, item]) => {
              if (activeSection !== key) return null
              const Icon = item.icon
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.label}</h3>
                    <p className="text-gray-700">{item.content}</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* メインコンテンツ */}
      {chatOptimized.isLoading ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <ProcessingSpinner />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <p className="text-gray-600 text-lg">構造化されたアイデアからUXを設計中...</p>
            <p className="text-gray-500 mt-2">
              {state.selectedUIStyle?.name}スタイルに最適化しています
            </p>
          </motion.div>
        </div>
      ) : uxStructure ? (
        <div className="space-y-8">
          {/* サイトアーキテクチャ */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8" />
                <h3 className="text-2xl font-bold">🏗️ サイト構成</h3>
              </div>
            </div>
            <div className="p-8">
              {/* トップページ設計 */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  トップページの役割
                </h4>
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-blue-900 font-medium mb-4">{uxStructure.siteArchitecture.topPage.purpose}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {uxStructure.siteArchitecture.topPage.elements.map((element, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <span className="text-blue-700 font-medium text-sm">{element}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 主要機能の画面設計 */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">📱 主要機能の画面構成</h4>
                <div className="grid gap-4">
                  {uxStructure.siteArchitecture.mainFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <h5 className="font-bold text-gray-900 mb-2">{feature.name}</h5>
                      <p className="text-gray-700 text-sm mb-3">{feature.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {feature.uiElements.map((ui, j) => (
                          <span key={j} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                            {ui}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ユーザーフロー */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">🚶 ユーザー体験の流れ</h4>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {uxStructure.siteArchitecture.userFlow.map((step, i) => (
                    <React.Fragment key={i}>
                      <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-4 py-2 font-medium text-sm">
                        {step}
                      </div>
                      {i < uxStructure.siteArchitecture.userFlow.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 体験スタイルのこだわり */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8" />
                <h3 className="text-2xl font-bold">💝 体験スタイルのこだわり</h3>
              </div>
              <p className="text-purple-100 mt-2">
                {state.selectedUIStyle?.name}スタイルで、あなたのアプリに込めた想いを形にします
              </p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 見た目の第一印象 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Layout className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-purple-900">見た目の第一印象</h4>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {uxStructure.designSystem.layout === 'カード型レイアウト' 
                      ? 'ひと目で情報が整理されていて、迷わず使える親しみやすいデザイン'
                      : uxStructure.designSystem.layout === 'グリッドレイアウト'
                      ? 'すっきりと整理された、プロフェッショナルな印象のデザイン'
                      : '使いやすさを重視した、親しみやすいデザイン'
                    }
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-700">
                    <Sparkles className="w-4 h-4" />
                    <span>{state.selectedUIStyle?.spacing === 'comfortable' ? 'ゆったりとした余白で見やすい' : 'コンパクトで情報量が多い'}</span>
                  </div>
                </div>

                {/* 色づかいの意味 */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-pink-900">色づかいの意味</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: state.selectedUIStyle?.colors.primary }} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">メインカラー</p>
                        <p className="text-sm text-gray-600">大切なボタンや注目してほしい場所に使用。あなたのサービスの印象を決める色</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: state.selectedUIStyle?.colors.secondary }} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">サポートカラー</p>
                        <p className="text-sm text-gray-600">補助的な情報やリンクに使用。全体のバランスを整える色</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 読みやすさへの配慮 */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Type className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-orange-900">読みやすさへの配慮</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">大きな見出し</p>
                      <p className="text-sm text-gray-600">
                        {uxStructure.designSystem.typography.heading === 'シンプルで読みやすい'
                          ? 'すっきりとした文字で、内容がすぐに理解できます'
                          : '印象的な文字で、重要な情報が目に飛び込んできます'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">説明文</p>
                      <p className="text-sm text-gray-600">
                        長時間読んでも疲れない、最適な文字サイズと行間を採用
                      </p>
                    </div>
                  </div>
                </div>

                {/* 操作の気持ちよさ */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                      <MousePointer className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-teal-900">操作の気持ちよさ</h4>
                  </div>
                  <p className="text-gray-700 mb-3">
                    クリックやタップが楽しくなる、細かな工夫を散りばめました
                  </p>
                  <div className="space-y-2">
                    {uxStructure.designSystem.interactions.map((interaction, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full" />
                        <span className="text-sm text-gray-700">
                          {interaction === 'スムーズなホバー効果' ? 'マウスを乗せると優しく反応' :
                           interaction === 'フェードトランジション' ? '画面の切り替わりがなめらか' :
                           interaction === 'マイクロアニメーション' ? '小さな動きで操作を楽しく' :
                           interaction}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* スタイルの統一感 */}
              <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h5 className="font-bold text-purple-900">このスタイルが生み出す体験</h5>
                </div>
                <p className="text-gray-700">
                  {state.selectedUIStyle?.description || 'あなたのアイデアに最適化されたデザイン'}を通じて、
                  {state.insights?.target}が{state.insights?.value || '価値を感じる'}体験を実現します。
                  すべての要素が調和して、使う人の心に残るアプリケーションになります。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 主要画面の詳細 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8" />
                <h3 className="text-2xl font-bold">📱 主要画面の設計</h3>
              </div>
            </div>
            <div className="p-8">
              <div className="grid gap-6">
                {uxStructure.keyScreens.map((screen, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className="border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition-colors"
                  >
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{screen.name}</h4>
                    <p className="text-gray-700 mb-4">{screen.purpose}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-600 mb-2">含まれる要素</h5>
                        <div className="space-y-1">
                          {screen.components.map((comp, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm text-gray-700">{comp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-600 mb-2">ユーザーアクション</h5>
                        <p className="text-sm text-gray-700 bg-green-50 rounded-lg p-3">{screen.userAction}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* コード生成への導線 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white text-center"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl font-bold mb-4">
              ✨ UX設計が完成しました！
            </h3>
            <p className="text-xl mb-2">
              {state.insights?.target}のための{state.selectedUIStyle?.name}スタイルの
            </p>
            <p className="text-2xl font-bold mb-6">
              「{state.insights?.vision}」を実現する設計
            </p>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              この設計をもとに、実際に動作するHTML・CSS・JavaScriptを自動生成します。
              あなたのアイデアが、今すぐ使えるWebアプリケーションに変わります。
            </p>
            <button
              onClick={() => actions.nextPhase()}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <Code2 className="w-7 h-7" />
              コード生成を開始
              <ArrowRight className="w-7 h-7" />
            </button>
            <p className="text-indigo-200 text-sm mt-4">
              約30秒で完全なコードが生成されます
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <p className="text-red-600 mb-4">UX構造の生成に失敗しました</p>
          <button
            onClick={generateUXStructure}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            再生成
          </button>
        </div>
      )}
    </motion.div>
  )
}