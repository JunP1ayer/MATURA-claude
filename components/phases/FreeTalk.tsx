'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatMessage, { WelcomeMessage } from '@/components/shared/ChatMessage'
import PreviewButton from '@/components/shared/PreviewButton'
import { ThinkingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'
import { sanitizeInput } from '@/lib/utils'

export default function FreeTalk() {
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [input, setInput] = useState('')
  const [showContinueButton, setShowContinueButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.conversations, chatOptimized.isLoading])

  // Cleanup only on component unmount
  useEffect(() => {
    return () => {
      chatOptimized.cleanup()
    }
  }, [])

  // 5往復以上で次のフェーズボタンを表示
  useEffect(() => {
    const userMessages = state.conversations.filter(m => m.role === 'user').length
    if (userMessages >= 3) {
      setShowContinueButton(true)
    }
  }, [state.conversations])


  const handleSend = React.useCallback(async () => {
    if (!input.trim() || chatOptimized.isLoading) {
      return
    }

    const sanitizedInput = sanitizeInput(input)
    actions.addMessage(sanitizedInput, 'user', 'FreeTalk')
    setInput('')

    // Create updated conversations array manually since state might not be updated yet
    const updatedConversations = [
      ...state.conversations,
      {
        id: `temp-${Date.now()}`,
        content: sanitizedInput,
        role: 'user' as const,
        timestamp: new Date(),
        phase: 'FreeTalk'
      }
    ]

    try {
      const result = await chatOptimized.sendMessage(
        sanitizedInput,
        updatedConversations,
        'FreeTalk',
        {
          onNewMessage: (response: string) => {
            if (!response || typeof response !== 'string' || response.trim().length === 0) {
              return
            }
            
            actions.addMessage(response.trim(), 'assistant', 'FreeTalk')
          },
          onError: (error) => {
            // Error handling without debug logs
          }
        }
      )
      
    } catch (sendError) {
      // Error handled silently
    }
  }, [input, state.conversations, chatOptimized.isLoading, actions.addMessage])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleContinue = () => {
    actions.nextPhase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-matura-primary to-matura-secondary p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">FreeTalk - 自由対話</h2>
              <p className="text-white/90">
                あなたのアイデアを自由にお話しください。なんでも大丈夫です！
              </p>
            </div>
            <PreviewButton 
              data={state.conversations} 
              title="対話履歴"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            />
          </div>
        </div>

        {/* チャット領域 */}
        <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
          
          {state.conversations.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <div className="space-y-4">
              {state.conversations.map((message, index) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}
          
          {/* ローディング */}
          {chatOptimized.isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm border border-gray-200">
                <ThinkingSpinner />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* エラー表示 */}
        {chatOptimized.error && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-100">
            <div className="flex justify-between items-center">
              <p className="text-red-600 text-sm">{chatOptimized.error}</p>
              <button
                onClick={chatOptimized.clearError}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 入力エリア */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="アイデアを入力してください...（例：英語学習に特化したToDoアプリを作りたい）"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-matura-primary focus:border-transparent resize-none"
                rows={3}
                disabled={chatOptimized.isLoading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatOptimized.isLoading}
              className="px-6 py-3 bg-matura-primary text-white rounded-lg font-medium transition-all hover:bg-matura-secondary disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* 次のフェーズボタン */}
          <AnimatePresence>
            {showContinueButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center"
              >
                <button
                  onClick={handleContinue}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-matura-secondary to-matura-accent text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
                >
                  洞察を精製する
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  十分に対話ができました！次のステップに進みましょう
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}