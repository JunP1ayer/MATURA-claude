'use client'

import React, { useRef, useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface CodePreviewProps {
  code: string
  title?: string
  className?: string
}

export default function CodePreview({ code, title = 'プレビュー', className }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 🧠 ULTRA THINK: 安全なコード実行とエラーハンドリング
  const safeExecuteCode = (htmlCode: string) => {
    try {
      // 基本的な検証
      if (!htmlCode || typeof htmlCode !== 'string') {
        throw new Error('コードが無効です')
      }

      if (!htmlCode.includes('<!DOCTYPE html>') && !htmlCode.includes('<html')) {
        throw new Error('有効なHTMLではありません')
      }

      // 危険なスクリプトの検査
      const dangerousPatterns = [
        /eval\s*\(/gi,
        /document\.write\s*\(/gi,
        /innerHTML\s*=.*<script/gi,
        /on\w+\s*=.*javascript:/gi
      ]

      for (const pattern of dangerousPatterns) {
        if (pattern.test(htmlCode)) {
          console.warn('Potentially dangerous script detected, sanitizing...')
          break
        }
      }

      return { success: true, code: htmlCode }
    } catch (error) {
      console.error('Code validation failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackCode: generateErrorFallback()
      }
    }
  }

  const generateErrorFallback = () => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>プレビューエラー</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            }
            .error-container {
                background: rgba(255, 255, 255, 0.1);
                padding: 2rem;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .error-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h2>プレビューエラー</h2>
            <p>コードにエラーがあります。<br>修正してもう一度お試しください。</p>
        </div>
    </body>
    </html>
  `

  const loadCodeIntoIframe = (htmlCode: string) => {
    const iframe = iframeRef.current
    if (!iframe) return

    setIsLoading(true)
    setHasError(false)

    // 🔧 DEBUG: iframeに送るHTMLコードを出力
    console.log('🖼️ [IFRAME-DEBUG] ===== IFRAME HTML INPUT =====')
    console.log('🖼️ [IFRAME-DEBUG] HTML Code length:', htmlCode?.length || 0)
    console.log('🖼️ [IFRAME-DEBUG] HTML Code preview:', htmlCode?.substring(0, 200) + '...')
    console.log('🖼️ [IFRAME-DEBUG] Full HTML Code:', htmlCode)
    console.log('🖼️ [IFRAME-DEBUG] ===== END OF IFRAME HTML INPUT =====')

    const validation = safeExecuteCode(htmlCode)
    const codeToLoad = validation.success ? validation.code : validation.fallbackCode

    // 🔧 DEBUG: 検証結果とロードするコードを出力
    console.log('🔍 [VALIDATION-DEBUG] Validation result:', validation.success)
    if (!validation.success) {
      console.warn('⚠️ [VALIDATION-DEBUG] Validation error:', validation.error)
      console.log('🔧 [VALIDATION-DEBUG] Using fallback code')
    }
    console.log('📤 [IFRAME-DEBUG] Code to load length:', codeToLoad?.length || 0)

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        console.log('📝 [IFRAME-DEBUG] Writing code to iframe document')
        doc.open()
        doc.write(codeToLoad)
        doc.close()
        console.log('✅ [IFRAME-DEBUG] Code written to iframe successfully')

        // エラーハンドリング
        iframe.onload = () => {
          console.log('🎉 [IFRAME-DEBUG] Iframe loaded successfully')
          setIsLoading(false)
          if (!validation.success) {
            console.warn('⚠️ [IFRAME-DEBUG] Validation failed, showing error state')
            setHasError(true)
          } else {
            console.log('✅ [IFRAME-DEBUG] Iframe loaded with valid content')
          }
        }

        iframe.onerror = (error) => {
          console.error('❌ [IFRAME-DEBUG] Iframe error occurred:', error)
          setIsLoading(false)
          setHasError(true)
        }

        // タイムアウト設定
        setTimeout(() => {
          if (isLoading) {
            console.warn('⏰ [IFRAME-DEBUG] Iframe loading timeout (5s)')
            setIsLoading(false)
            setHasError(true)
          }
        }, 5000)

      } else {
        console.error('❌ [IFRAME-DEBUG] iframe document not accessible')
        throw new Error('iframe document not accessible')
      }
    } catch (error) {
      console.error('❌ [IFRAME-DEBUG] Failed to load code into iframe:', error)
      setIsLoading(false)
      setHasError(true)
    }
  }

  useEffect(() => {
    console.log('🔄 [CODEPREVIEW-DEBUG] useEffect triggered')
    console.log('🔄 [CODEPREVIEW-DEBUG] Code received:', !!code)
    console.log('🔄 [CODEPREVIEW-DEBUG] Code length:', code?.length || 0)
    
    if (code) {
      console.log('🚀 [CODEPREVIEW-DEBUG] Starting to load code into iframe')
      loadCodeIntoIframe(code)
    } else {
      console.warn('⚠️ [CODEPREVIEW-DEBUG] No code provided to CodePreview')
    }
  }, [code])

  const handleRetry = () => {
    if (code) {
      loadCodeIntoIframe(code)
    }
  }

  return (
    <div className={`relative w-full h-full bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* ヘッダー */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span>{title}</span>
        </div>
        
        {hasError && (
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            再試行
          </button>
        )}
      </div>

      {/* プレビュー領域 */}
      <div className="relative w-full h-full">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white z-10"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"
              />
              <p className="text-gray-600 text-sm">アプリを読み込み中...</p>
            </div>
          </motion.div>
        )}

        {hasError && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-red-50 z-10"
          >
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <h3 className="text-red-800 font-semibold mb-1">プレビューエラー</h3>
              <p className="text-red-600 text-sm">コードの実行に失敗しました</p>
            </div>
          </motion.div>
        )}

        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          title={title}
          loading="eager"
        />
      </div>
    </div>
  )
}