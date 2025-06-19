'use client'

import { useState, useEffect } from 'react'
import { Code2, Download, Eye, ArrowRight, DollarSign, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { GeneratingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'
import { GeneratedCode } from '@/lib/types'
import { estimateAPICost } from '@/lib/utils'

export default function CodePlayground() {
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [progress, setProgress] = useState(0)
  const [showCostModal, setShowCostModal] = useState(true)
  const [userConsent, setUserConsent] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // API利用コスト計算
  const estimatedCost = estimateAPICost(state.conversations.length, 'CodePlayground')

  useEffect(() => {
    if (userConsent && !generatedCode) {
      generateCode()
    }
  }, [userConsent])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chatOptimized.cleanup()
    }
  }, [chatOptimized])

  const generateCode = async () => {
    setIsGenerating(true)
    setProgress(0)

    // プログレスアニメーション
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 15
      })
    }, 800)

    try {
      // コード生成仕様を作成
      const codeSpec = {
        insights: state.insights,
        selectedUI: state.selectedUI,
        uxDesign: state.uxDesign,
        conversations: state.conversations
      }

      const codeResponse = await chatOptimized.generateStructuredData(
        [{ 
          id: 'code-spec', 
          role: 'user' as const, 
          content: `以下の仕様に基づいて、完全に動作するHTML/CSS/JavaScriptコードを生成してください：
          
          ビジョン: ${state.insights?.vision}
          ターゲット: ${state.insights?.target}
          主要機能: ${state.insights?.features?.join(', ')}
          UIスタイル: ${state.selectedUI?.name} (${state.selectedUI?.style})
          レイアウト: ${state.uxDesign?.layout}
          カラーテーマ: ${state.uxDesign?.colorScheme}
          
          要件:
          - レスポンシブデザイン
          - モダンで美しいUI
          - 実用的な機能
          - アクセシビリティ対応`,
          timestamp: new Date()
        }],
        'CodePlayground',
        {
          timeout: 60000, // 60 second timeout for code generation
          onError: (error) => {
            console.error('Code generation error:', error)
            clearInterval(progressInterval)
            setIsGenerating(false)
          }
        }
      )

      clearInterval(progressInterval)
      setProgress(100)

      if (codeResponse) {
        // 生成されたコードを構造化
        const code: GeneratedCode = {
          html: codeResponse.html || generateFallbackHTML(),
          css: codeResponse.css || generateFallbackCSS(),
          javascript: codeResponse.javascript || generateFallbackJS(),
          framework: 'Vanilla',
          dependencies: codeResponse.dependencies || []
        }
        
        setGeneratedCode(code)
        actions.setGeneratedCode(code)
      } else {
        // フォールバック
        const fallbackCode = generateFallbackCode()
        setGeneratedCode(fallbackCode)
        actions.setGeneratedCode(fallbackCode)
      }
    } catch (error) {
      console.error('コード生成エラー:', error)
      clearInterval(progressInterval)
      const fallbackCode = generateFallbackCode()
      setGeneratedCode(fallbackCode)
      actions.setGeneratedCode(fallbackCode)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFallbackCode = (): GeneratedCode => {
    const vision = state.insights?.vision || 'Webアプリケーション'
    const features = state.insights?.features || ['機能1', '機能2', '機能3']
    const isDark = state.selectedUI?.style === 'dark'
    
    return {
      html: generateFallbackHTML(),
      css: generateFallbackCSS(),
      javascript: generateFallbackJS(),
      framework: 'Vanilla HTML/CSS/JS',
      dependencies: []
    }
  }

  const generateFallbackHTML = () => {
    const vision = state.insights?.vision || 'Webアプリケーション'
    const features = state.insights?.features || ['機能1', '機能2', '機能3']
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${vision}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">${vision}</div>
            <ul class="nav-links">
                <li><a href="#home">ホーム</a></li>
                <li><a href="#features">機能</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>

    <main class="main">
        <section class="hero">
            <h1 class="hero-title">${vision}</h1>
            <p class="hero-subtitle">${state.insights?.value || 'あなたの生活をより良くする'}</p>
            <button class="cta-button">始める</button>
        </section>

        <section class="features" id="features">
            <h2>主な機能</h2>
            <div class="feature-grid">
                ${features.map((feature, index) => `
                <div class="feature-card">
                    <h3>${feature}</h3>
                    <p>この機能により、より良い体験を提供します。</p>
                </div>`).join('')}
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2024 ${vision}. Created with MATURA.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`
  }

  const generateFallbackCSS = () => {
    const isDark = state.selectedUI?.style === 'dark'
    const isColorful = state.selectedUI?.style === 'colorful'
    
    return `/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    ${isDark ? 'background: #1a1a1a; color: #fff;' : 'background: #f8fafc; color: #333;'}
}

/* Header */
.header {
    ${isDark ? 'background: #2a2a2a;' : 'background: white;'}
    padding: 1rem 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    ${isColorful ? 'background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : isDark ? 'color: #fff;' : 'color: #4f46e5;'}
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    ${isDark ? 'color: #ccc;' : 'color: #666;'}
    transition: color 0.3s;
}

.nav-links a:hover {
    ${isColorful ? 'color: #ff6b6b;' : 'color: #4f46e5;'}
}

/* Main */
.main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

/* Hero */
.hero {
    text-align: center;
    padding: 4rem 0;
    ${isColorful ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' : ''}
    border-radius: 1rem;
    margin-bottom: 4rem;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    ${isColorful ? 'color: white;' : ''}
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    ${isColorful ? 'color: rgba(255,255,255,0.9);' : isDark ? 'color: #ccc;' : 'color: #666;'}
}

.cta-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    ${isColorful ? 'background: #ff6b6b;' : 'background: #4f46e5;'}
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

/* Features */
.features h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    ${isDark ? 'background: #2a2a2a;' : 'background: white;'}
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-card h3 {
    margin-bottom: 1rem;
    ${isColorful ? 'color: #ff6b6b;' : 'color: #4f46e5;'}
}

/* Footer */
.footer {
    ${isDark ? 'background: #2a2a2a;' : 'background: white;'}
    text-align: center;
    padding: 2rem;
    margin-top: 4rem;
    ${isDark ? 'color: #ccc;' : 'color: #666;'}
}

/* Responsive */
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        gap: 1rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
}`
  }

  const generateFallbackJS = () => {
    return `// MATURA Generated App
document.addEventListener('DOMContentLoaded', function() {
    console.log('${state.insights?.vision || 'アプリ'}が読み込まれました');
    
    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // CTAボタンのアクション
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            alert('${state.insights?.vision || 'アプリ'}をご利用いただき、ありがとうございます！');
        });
    }
    
    // フィーチャーカードのアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});`
  }

  const handleConsent = () => {
    setUserConsent(true)
    setShowCostModal(false)
  }

  const handleNext = () => {
    if (generatedCode) {
      actions.nextPhase()
    }
  }

  const copyCode = async (codeType: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(codeType)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('コピーに失敗しました:', err)
    }
  }

  const downloadCode = () => {
    if (!generatedCode) return

    // ZIPファイル風のダウンロード（実際はファイル別ダウンロード）
    const files = [
      { name: 'index.html', content: generatedCode.html },
      { name: 'styles.css', content: generatedCode.css },
      { name: 'script.js', content: generatedCode.javascript }
    ]

    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* コスト確認モーダル */}
      <AnimatePresence>
        {showCostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-matura-accent" />
                API利用コストの確認
              </h3>
              <div className="space-y-3 mb-6">
                <p className="text-gray-600">コード生成には以下のコストが発生します：</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-bold text-matura-primary">
                    推定コスト: ¥{estimatedCost.toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ※ 実際の使用量により変動する場合があります
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleConsent}
                  className="flex-1 px-6 py-3 bg-matura-primary text-white rounded-lg font-medium hover:bg-matura-secondary transition-colors"
                >
                  1. 同意して進む
                </button>
                <button
                  onClick={() => setShowCostModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Code2 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold mb-2">CodePlayground - コード生成</h2>
                <p className="text-white/90">
                  完全に動作するWebアプリケーションを生成します
                </p>
              </div>
            </div>
            <PreviewButton 
              data={generatedCode} 
              title="生成されたコード"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            />
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-8">
          {isGenerating ? (
            <div className="space-y-8">
              <div className="text-center">
                <GeneratingSpinner />
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">
                  コードを生成しています...
                </h3>
              </div>
              
              {/* プログレスバー */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>進捗</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              {/* ステップ表示 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <motion.div 
                  className={progress >= 30 ? 'text-orange-600 font-medium' : 'text-gray-400'}
                  animate={progress >= 30 ? { scale: [1, 1.05, 1] } : {}}
                >
                  HTML構造を生成中...
                </motion.div>
                <motion.div 
                  className={progress >= 60 ? 'text-orange-600 font-medium' : 'text-gray-400'}
                  animate={progress >= 60 ? { scale: [1, 1.05, 1] } : {}}
                >
                  CSS スタイルを最適化中...
                </motion.div>
                <motion.div 
                  className={progress >= 90 ? 'text-orange-600 font-medium' : 'text-gray-400'}
                  animate={progress >= 90 ? { scale: [1, 1.05, 1] } : {}}
                >
                  JavaScript機能を追加中...
                </motion.div>
              </div>
            </div>
          ) : generatedCode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* 生成完了メッセージ */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  コード生成完了！
                </h3>
                <p className="text-green-700">
                  {state.insights?.vision}の完全なWebアプリケーションが生成されました
                </p>
              </div>

              {/* コードタブ */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setPreviewMode(false)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          !previewMode ? 'bg-matura-primary text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        コード表示
                      </button>
                      <button
                        onClick={() => setPreviewMode(true)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          previewMode ? 'bg-matura-primary text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        プレビュー
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadCode}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        ダウンロード
                      </button>
                    </div>
                  </div>
                </div>

                {previewMode ? (
                  <div className="p-4">
                    <iframe
                      srcDoc={generatedCode.html.replace('<link rel="stylesheet" href="styles.css">', `<style>${generatedCode.css}</style>`).replace('<script src="script.js"></script>', `<script>${generatedCode.javascript}</script>`)}
                      className="w-full h-96 border border-gray-300 rounded"
                      title="プレビュー"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* HTML */}
                    <div className="border-b border-gray-200">
                      <div className="flex items-center justify-between p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-800">index.html</h4>
                        <button
                          onClick={() => copyCode('html', generatedCode.html)}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                        >
                          {copiedCode === 'html' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedCode === 'html' ? 'コピー済み' : 'コピー'}
                        </button>
                      </div>
                      <div className="p-4 bg-gray-900 text-gray-100 overflow-x-auto">
                        <pre className="text-sm">
                          <code>{generatedCode.html}</code>
                        </pre>
                      </div>
                    </div>

                    {/* CSS */}
                    <div className="border-b border-gray-200">
                      <div className="flex items-center justify-between p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-800">styles.css</h4>
                        <button
                          onClick={() => copyCode('css', generatedCode.css)}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                        >
                          {copiedCode === 'css' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedCode === 'css' ? 'コピー済み' : 'コピー'}
                        </button>
                      </div>
                      <div className="p-4 bg-gray-900 text-gray-100 overflow-x-auto max-h-64">
                        <pre className="text-sm">
                          <code>{generatedCode.css}</code>
                        </pre>
                      </div>
                    </div>

                    {/* JavaScript */}
                    <div>
                      <div className="flex items-center justify-between p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-800">script.js</h4>
                        <button
                          onClick={() => copyCode('js', generatedCode.javascript)}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                        >
                          {copiedCode === 'js' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedCode === 'js' ? 'コピー済み' : 'コピー'}
                        </button>
                      </div>
                      <div className="p-4 bg-gray-900 text-gray-100 overflow-x-auto max-h-64">
                        <pre className="text-sm">
                          <code>{generatedCode.javascript}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 次へボタン */}
              <div className="text-center pt-4">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-matura-primary to-matura-secondary text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
                >
                  リリース準備へ進む
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">コストに同意後、コード生成を開始します</p>
              <button
                onClick={() => setShowCostModal(true)}
                className="px-6 py-2 bg-matura-primary text-white rounded-lg hover:bg-matura-secondary transition-colors"
              >
                コスト確認
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}