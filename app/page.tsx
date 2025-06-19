'use client'

import { motion, AnimatePresence } from 'framer-motion'
import PhaseIndicator from '@/components/shared/PhaseIndicator'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useEffect, lazy, Suspense } from 'react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

// Dynamic imports with React.lazy for code splitting
const FreeTalk = lazy(() => import('@/components/phases/FreeTalk'))
const InsightRefine = lazy(() => import('@/components/phases/InsightRefine'))
const SketchView = lazy(() => import('@/components/phases/SketchView'))
const UXBuild = lazy(() => import('@/components/phases/UXBuild'))
const CodePlayground = lazy(() => import('@/components/phases/CodePlayground'))
const ReleaseBoard = lazy(() => import('@/components/phases/ReleaseBoard'))

const phases = [
  { component: FreeTalk, name: 'FreeTalk' },
  { component: InsightRefine, name: 'InsightRefine' },
  { component: SketchView, name: 'SketchView' },
  { component: UXBuild, name: 'UXBuild' },
  { component: CodePlayground, name: 'CodePlayground' },
  { component: ReleaseBoard, name: 'ReleaseBoard' },
]

export default function Home() {
  const { state, userMessageCount } = useMatura()

  // ページタイトルを動的に更新
  useEffect(() => {
    const phaseNames = ['FreeTalk', 'InsightRefine', 'SketchView', 'UXBuild', 'CodePlayground', 'ReleaseBoard']
    const currentPhaseName = phaseNames[state.currentPhase] || 'MATURA'
    document.title = `${currentPhaseName} - MATURA`
  }, [state.currentPhase])

  const CurrentPhaseComponent = phases[state.currentPhase]?.component

  return (
    <main className="min-h-screen bg-matura-bg">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold matura-text-gradient mb-2">
              MATURA
            </h1>
            <p className="text-gray-600 text-lg">
              思いつきから収益化まで、AIと一緒に創造の旅へ
            </p>
          </motion.div>
        </div>
      </header>

      {/* フェーズインジケーター */}
      <div className="container mx-auto px-4 py-8">
        <PhaseIndicator currentPhase={state.currentPhase} />
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 pb-12">
        <AnimatePresence mode="wait">
          {CurrentPhaseComponent && (
            <motion.div
              key={state.currentPhase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner />
                </div>
              }>
                <CurrentPhaseComponent />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center space-x-6 text-sm text-gray-500"
            >
              <span>フェーズ {state.currentPhase + 1}/6</span>
              <span>•</span>
              <span>
                対話数: {userMessageCount}
              </span>
              <span>•</span>
              <span>
                {state.insights ? '✓ 洞察完了' : '洞察待ち'}
              </span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-gray-400"
            >
              © 2024 MATURA. Powered by OpenAI GPT-4 & Next.js
            </motion.p>
          </div>
        </div>
      </footer>

      {/* グローバルエラー表示 */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">エラーが発生しました</span>
              <button
                onClick={() => window.location.reload()}
                className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition-colors"
              >
                再読み込み
              </button>
            </div>
            <p className="text-xs mt-1 opacity-90">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* グローバルローディング */}
      {state.isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-matura-primary"></div>
              <span className="text-gray-700">処理中...</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}