'use client'

import { useState, useEffect } from 'react'
import { Code2, Download, Eye, ArrowRight, DollarSign, Copy, Check, Monitor, FileText, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { GeneratingSpinner } from '@/components/shared/LoadingSpinner'
import CodePreview from '@/components/shared/CodePreview'
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
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
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
      // 🔧 TEST MODE: 固定のテストHTMLを使用してプレビュー機能をテスト
      console.log('🧪 [TEST-MODE] Using fixed test HTML instead of OpenAI generation')
      
      const testHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>テストアプリ</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        h1 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        .test-button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px;
        }
        .test-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .result {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9ff;
            border-radius: 10px;
            display: none;
        }
        .input-field {
            width: 100%;
            padding: 10px;
            border: 2px solid #667eea;
            border-radius: 10px;
            margin: 10px 0;
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 テストアプリ</h1>
        <p>このボタンをクリックして動作確認してください</p>
        
        <button class="test-button" onclick="testAlert()">
            アラートテスト
        </button>
        
        <button class="test-button" onclick="testInteraction()">
            インタラクションテスト
        </button>
        
        <input type="text" class="input-field" id="testInput" placeholder="何か入力してください">
        
        <button class="test-button" onclick="testInput()">
            入力テスト
        </button>
        
        <div id="result" class="result"></div>
    </div>

    <script>
        console.log('🧪 Test App loaded successfully!');
        
        function testAlert() {
            alert('✅ 動作確認OK! プレビューが正しく動作しています！');
            console.log('🎉 Alert test executed successfully');
        }
        
        function testInteraction() {
            const result = document.getElementById('result');
            result.style.display = 'block';
            result.innerHTML = '<h3>✅ インタラクションテスト成功!</h3><p>JavaScriptが正しく動作しています。</p>';
            console.log('🎉 Interaction test executed successfully');
        }
        
        function testInput() {
            const input = document.getElementById('testInput');
            const result = document.getElementById('result');
            
            if (input.value.trim()) {
                result.style.display = 'block';
                result.innerHTML = '<h3>✅ 入力テスト成功!</h3><p>入力された内容: <strong>' + input.value + '</strong></p>';
                console.log('🎉 Input test executed with value:', input.value);
            } else {
                alert('⚠️ 何か文字を入力してください');
            }
        }
        
        // ページ読み込み完了時の処理
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📱 Test app fully loaded and ready');
            
            // 自動テスト実行
            setTimeout(() => {
                console.log('🔍 Running automatic validation test...');
                if (typeof testAlert === 'function' && typeof testInteraction === 'function') {
                    console.log('✅ All functions are properly defined');
                } else {
                    console.error('❌ Some functions are not defined');
                }
            }, 1000);
        });
    </script>
</body>
</html>`

      // テスト用のcodeResponseをシミュレート
      const codeResponse: Partial<GeneratedCode> | string = {
        fullHtml: testHTML,
        title: 'テストアプリ',
        description: 'プレビュー機能のテスト用アプリケーション'
      }

      clearInterval(progressInterval)
      setProgress(100)

      if (codeResponse) {
        console.log('🎯 [CODE-GENERATION] Raw response:', codeResponse)
        console.log('🎯 [CODE-GENERATION] Response type:', typeof codeResponse)
        console.log('🎯 [CODE-GENERATION] Response length:', typeof codeResponse === 'string' ? codeResponse.length : (codeResponse as Partial<GeneratedCode>)?.fullHtml?.length || 'N/A')
        
        // 🧠 ULTRA THINK: 新しいJSON形式に対応
        let parsedCode
        try {
          // OpenAIからのレスポンスがJSONかチェック
          if (typeof codeResponse === 'string' && codeResponse.includes('fullHtml')) {
            parsedCode = JSON.parse(codeResponse)
            console.log('✅ [CODE-GENERATION] JSON parsed successfully:', parsedCode)
          } else if (typeof codeResponse === 'object' && (codeResponse as Partial<GeneratedCode>).fullHtml) {
            parsedCode = codeResponse
            console.log('✅ [CODE-GENERATION] Object format detected:', parsedCode)
          } else {
            throw new Error('Invalid response format')
          }
        } catch (parseError) {
          console.warn('❌ [CODE-GENERATION] Failed to parse JSON response:', parseError)
          console.warn('❌ [CODE-GENERATION] Raw response content:', codeResponse)
          parsedCode = null
        }

        const codeResponseObj = typeof codeResponse === 'object' ? codeResponse as Partial<GeneratedCode> : {};
        const code: GeneratedCode = {
          // 既存形式との互換性
          html: parsedCode?.fullHtml || codeResponseObj.html || generateFallbackHTML(),
          css: extractCSSFromHTML(parsedCode?.fullHtml) || codeResponseObj.css || generateFallbackCSS(),
          javascript: extractJSFromHTML(parsedCode?.fullHtml) || codeResponseObj.javascript || generateFallbackJS(),
          framework: 'Vanilla HTML/CSS/JS',
          dependencies: codeResponseObj.dependencies || [],
          // 新しいフィールド
          fullHtml: parsedCode?.fullHtml || generateCompleteHTML(codeResponse),
          title: parsedCode?.title || state.insights?.vision || 'Generated App',
          description: parsedCode?.description || 'AI generated web application',
          isComplete: !!parsedCode?.fullHtml
        }
        
        console.log('✅ [CODE-GENERATION] Processed code:', {
          hasFullHtml: !!code.fullHtml,
          title: code.title,
          isComplete: code.isComplete
        })
        
        // 🔧 DEBUG: 最終的に生成されたHTMLコードを出力
        if (code.fullHtml) {
          console.log('📝 [HTML-DEBUG] ===== GENERATED HTML CODE =====')
          console.log(code.fullHtml)
          console.log('📝 [HTML-DEBUG] ===== END OF HTML CODE =====')
          console.log('📝 [HTML-DEBUG] HTML length:', code.fullHtml.length)
          console.log('📝 [HTML-DEBUG] Contains DOCTYPE:', code.fullHtml.includes('<!DOCTYPE html>'))
          console.log('📝 [HTML-DEBUG] Contains script tag:', code.fullHtml.includes('<script>'))
          console.log('📝 [HTML-DEBUG] Contains style tag:', code.fullHtml.includes('<style>'))
        } else {
          console.warn('⚠️ [HTML-DEBUG] No fullHtml content available!')
        }
        
        setGeneratedCode(code)
        actions.setGeneratedCode(code)
      } else {
        // フォールバック
        console.warn('⚠️ [CODE-GENERATION] No response from OpenAI, using fallback')
        const fallbackCode = generateFallbackCode()
        
        // 🔧 DEBUG: フォールバックHTMLコードを出力
        if (fallbackCode.fullHtml) {
          console.log('📝 [FALLBACK-DEBUG] ===== FALLBACK HTML CODE =====')
          console.log(fallbackCode.fullHtml)
          console.log('📝 [FALLBACK-DEBUG] ===== END OF FALLBACK CODE =====')
          console.log('📝 [FALLBACK-DEBUG] HTML length:', fallbackCode.fullHtml.length)
        }
        
        setGeneratedCode(fallbackCode)
        actions.setGeneratedCode(fallbackCode)
      }
    } catch (error) {
      console.error('❌ [CODE-GENERATION] Code generation error:', error)
      clearInterval(progressInterval)
      const fallbackCode = generateFallbackCode()
      
      // 🔧 DEBUG: エラー時のフォールバックHTMLコードを出力
      console.log('📝 [ERROR-FALLBACK-DEBUG] ===== ERROR FALLBACK HTML CODE =====')
      console.log(fallbackCode.fullHtml)
      console.log('📝 [ERROR-FALLBACK-DEBUG] ===== END OF ERROR FALLBACK CODE =====')
      
      setGeneratedCode(fallbackCode)
      actions.setGeneratedCode(fallbackCode)
    } finally {
      setIsGenerating(false)
    }
  }

  // 🧠 ULTRA THINK: ユーティリティ関数群
  const extractCSSFromHTML = (html: string | undefined): string => {
    if (!html) return ''
    const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
    return cssMatch ? cssMatch[1].trim() : ''
  }

  const extractJSFromHTML = (html: string | undefined): string => {
    if (!html) return ''
    const jsMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i)
    return jsMatch ? jsMatch[1].trim() : ''
  }

  const generateCompleteHTML = (codeResponse: any): string => {
    if (!codeResponse) return generateFallbackCompleteHTML()
    
    // 既存の分離されたコードを統合
    const html = codeResponse.html || generateFallbackHTML()
    const css = codeResponse.css || generateFallbackCSS()
    const javascript = codeResponse.javascript || generateFallbackJS()
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.insights?.vision || 'Generated App'}</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${javascript}
    </script>
</body>
</html>`
  }

  const generateFallbackCompleteHTML = (): string => {
    const vision = state.insights?.vision || state.extractedStructure?.vision || 'シンプルアプリ'
    const features = state.insights?.features || state.extractedStructure?.features || ['機能1', '機能2']
    const isDark = state.selectedUI?.style === 'dark'
    const uiStyle = state.selectedUI?.style || 'modern'
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${vision}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            ${isDark ? 'background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #fff;' : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #333;'}
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            ${isDark ? 'background: rgba(255, 255, 255, 0.05);' : 'background: rgba(255, 255, 255, 0.95);'}
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        h1 {
            text-align: center;
            margin-bottom: 2rem;
            ${isDark ? 'color: #4fc3f7;' : 'color: #667eea;'}
            font-size: 2.5rem;
            font-weight: 700;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .feature-card {
            ${isDark ? 'background: rgba(255, 255, 255, 0.1);' : 'background: rgba(255, 255, 255, 0.9);'}
            padding: 1.5rem;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
        }

        .feature-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            ${isDark ? 'color: #81c784;' : 'color: #4a5568;'}
        }

        .cta-button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            margin: 2rem auto;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .demo-area {
            margin-top: 2rem;
            padding: 1.5rem;
            ${isDark ? 'background: rgba(255, 255, 255, 0.05);' : 'background: rgba(246, 250, 255, 0.8);'}
            border-radius: 15px;
            text-align: center;
        }

        .input-group {
            margin: 1rem 0;
        }

        .demo-input {
            width: 70%;
            padding: 0.8rem 1.2rem;
            border: 2px solid #667eea;
            border-radius: 25px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s ease;
        }

        .demo-input:focus {
            border-color: #764ba2;
        }

        .demo-button {
            margin-left: 1rem;
            padding: 0.8rem 1.5rem;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .demo-button:hover {
            background: #764ba2;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
                padding: 1rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .feature-grid {
                grid-template-columns: 1fr;
            }
            
            .demo-input {
                width: 100%;
                margin-bottom: 1rem;
            }
            
            .demo-button {
                margin-left: 0;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✨ ${vision}</h1>
        
        <div class="feature-grid">
            ${features.map((feature, index) => `
            <div class="feature-card" onclick="showFeature('${feature}')">
                <span class="feature-icon">${['🚀', '💡', '⚡', '🎯', '🔥', '🌟'][index] || '✨'}</span>
                <div class="feature-title">${feature}</div>
                <p>この機能で${vision}をより便利に使えます</p>
            </div>
            `).join('')}
        </div>

        <button class="cta-button" onclick="startDemo()">
            🎮 アプリを試してみる
        </button>

        <div class="demo-area" id="demoArea" style="display: none;">
            <h3>📱 デモエリア</h3>
            <p>実際の${vision}の機能をお試しください</p>
            
            <div class="input-group">
                <input type="text" class="demo-input" placeholder="何かを入力してみてください..." id="userInput">
                <button class="demo-button" onclick="handleDemoAction()">実行</button>
            </div>
            
            <div id="demoResult" style="margin-top: 1rem; padding: 1rem; background: rgba(102, 126, 234, 0.1); border-radius: 10px; display: none;">
                <p>結果がここに表示されます</p>
            </div>
        </div>
    </div>

    <script>
        function showFeature(featureName) {
            alert('🌟 ' + featureName + ' の機能です！\\n\\n' + '${vision}' + 'で重要な役割を果たします。');
        }

        function startDemo() {
            const demoArea = document.getElementById('demoArea');
            const button = event.target;
            
            demoArea.style.display = 'block';
            demoArea.scrollIntoView({ behavior: 'smooth' });
            
            button.textContent = '✅ デモを表示中';
            button.style.background = 'linear-gradient(45deg, #81c784, #66bb6a)';
        }

        function handleDemoAction() {
            const input = document.getElementById('userInput');
            const result = document.getElementById('demoResult');
            
            if (input.value.trim()) {
                result.innerHTML = \`
                    <p><strong>入力内容:</strong> \${input.value}</p>
                    <p><strong>処理結果:</strong> ✨ "\${input.value}" を${vision}で処理しました！</p>
                    <p><strong>ステータス:</strong> <span style="color: #4caf50;">✅ 正常に完了</span></p>
                \`;
                result.style.display = 'block';
                
                // 入力をクリア
                input.value = '';
                
                // 成功メッセージを表示
                setTimeout(() => {
                    alert('🎉 処理が完了しました！\\n\\n${vision}での操作が成功しました。');
                }, 500);
            } else {
                alert('⚠️ 何か文字を入力してください！');
                input.focus();
            }
        }

        // ページ読み込み時のアニメーション
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📱 ${vision} が読み込まれました！');
            
            // フィーチャーカードのアニメーション
            const cards = document.querySelectorAll('.feature-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        });

        // キーボードショートカット
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.id === 'userInput') {
                handleDemoAction();
            }
        });
    </script>
</body>
</html>`
  }

  const generateFallbackCode = (): GeneratedCode => {
    const completeHTML = generateFallbackCompleteHTML()
    
    return {
      html: generateFallbackHTML(),
      css: generateFallbackCSS(),
      javascript: generateFallbackJS(),
      framework: 'Vanilla HTML/CSS/JS',
      dependencies: [],
      fullHtml: completeHTML,
      title: state.insights?.vision || 'Generated App',
      description: 'AI generated web application',
      isComplete: true
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

  // 🧠 ULTRA THINK: 改善されたコピー機能
  const copyCode = async (codeType: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(codeType)
      setTimeout(() => setCopiedCode(null), 2000)
      
      // 成功通知（ユーザビリティ向上）
      console.log(`✅ ${codeType} コードをクリップボードにコピーしました`)
    } catch (err) {
      console.error('コピーに失敗しました:', err)
      
      // フォールバック: 古いブラウザ対応
      try {
        const textArea = document.createElement('textarea')
        textArea.value = code
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        setCopiedCode(codeType)
        setTimeout(() => setCopiedCode(null), 2000)
        console.log(`✅ ${codeType} コードをコピーしました（フォールバック）`)
      } catch (fallbackErr) {
        console.error('フォールバックコピーも失敗:', fallbackErr)
        alert('コピーに失敗しました。手動でコードを選択してコピーしてください。')
      }
    }
  }

  // 🧠 ULTRA THINK: 改善されたダウンロード機能
  const downloadCode = () => {
    if (!generatedCode) return

    try {
      if (generatedCode.fullHtml && generatedCode.isComplete) {
        // 完全なHTMLファイルとしてダウンロード
        const fileName = `${(generatedCode.title || 'generated-app').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.html`
        
        const blob = new Blob([generatedCode.fullHtml], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
        
        console.log(`✅ 完全なWebアプリを ${fileName} としてダウンロードしました`)
      } else {
        // 分離されたファイルとしてダウンロード
        const files = [
          { name: 'index.html', content: generatedCode.html },
          { name: 'styles.css', content: generatedCode.css },
          { name: 'script.js', content: generatedCode.javascript }
        ]

        files.forEach((file, index) => {
          setTimeout(() => {
            const blob = new Blob([file.content], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = file.name
            a.click()
            URL.revokeObjectURL(url)
          }, index * 200) // 少し遅延を入れてブラウザの制限を回避
        })
        
        console.log('✅ 分離されたファイルをダウンロードしました')
      }
    } catch (error) {
      console.error('ダウンロードに失敗しました:', error)
      alert('ダウンロードに失敗しました。ブラウザの設定を確認してください。')
    }
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
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  🎉 {generatedCode?.title || '完全なWebアプリ'}が完成！
                </h3>
                <p className="text-green-700 mb-2">
                  {generatedCode?.description || 'AI generated web application'}
                </p>
                {generatedCode?.isComplete && (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    実際に動作するアプリです
                  </div>
                )}
              </div>

              {/* 🧠 ULTRA THINK: 改善されたタブシステム */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          activeTab === 'preview' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Monitor className="w-4 h-4" />
                        {generatedCode?.isComplete ? '✨ ライブプレビュー' : 'プレビュー'}
                      </motion.button>
                      <motion.button
                        onClick={() => setActiveTab('code')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          activeTab === 'code' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FileText className="w-4 h-4" />
                        ソースコード
                      </motion.button>
                    </div>
                    <div className="flex gap-2">
                      {generatedCode?.fullHtml && (
                        <motion.button
                          onClick={() => copyCode('fullHtml', generatedCode.fullHtml!)}
                          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {copiedCode === 'fullHtml' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedCode === 'fullHtml' ? 'コピー済み' : '完全版コピー'}
                        </motion.button>
                      )}
                      <motion.button
                        onClick={downloadCode}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download className="w-4 h-4" />
                        ダウンロード
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* 🧠 ULTRA THINK: 改善されたコンテンツエリア */}
                {activeTab === 'preview' ? (
                  <div className="h-[600px]">
                    {generatedCode?.fullHtml ? (
                      <CodePreview 
                        code={generatedCode.fullHtml}
                        title={generatedCode.title || 'Generated App'}
                        className="h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <div className="text-center">
                          <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">プレビュー準備中</h3>
                          <p className="text-gray-500">完全なHTMLコードを生成中です...</p>
                        </div>
                      </div>
                    )}
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