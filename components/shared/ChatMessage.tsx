'use client'

import { User, Bot, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Message } from '@/lib/types'
import { formatDate, cn } from '@/lib/utils'

interface ChatMessageProps {
  message: Message
  isTyping?: boolean
  className?: string
}

export default function ChatMessage({ message, isTyping = false, className }: ChatMessageProps) {
  // Enhanced debugging for render issues
  console.log('🎨 [CHATMESSAGE-DEBUG] Rendering message:', message)
  console.log('🎨 [CHATMESSAGE-DEBUG] Message details:', {
    id: message.id,
    role: message.role,
    contentLength: message.content?.length || 0,
    content: message.content?.substring(0, 30) + (message.content?.length > 30 ? '...' : ''),
    contentType: typeof message.content,
    phase: message.phase,
    timestamp: message.timestamp,
    isContentEmpty: !message.content || message.content.trim().length === 0
  })
  
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  
  if (!message.content) {
    console.error('❌ [CHATMESSAGE-DEBUG] Message has no content!', message)
    return null
  }

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('flex justify-center my-4', className)}
      >
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {message.content}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      {/* アバター（アシスタントの場合） */}
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-matura-primary to-matura-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      {/* メッセージバブル */}
      <div
        className={cn(
          'max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 relative',
          isUser
            ? 'bg-matura-primary text-white rounded-br-md'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
        )}
      >
        {/* タイピングアニメーション */}
        {isTyping && !isUser && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        
        {/* メッセージ内容 */}
        {!isTyping && (
          <>
            <p className="leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            
            {/* タイムスタンプ */}
            <div
              className={cn(
                'text-xs mt-2 opacity-70',
                isUser ? 'text-white/70' : 'text-gray-500'
              )}
            >
              {formatDate(message.timestamp)}
            </div>
          </>
        )}
      </div>

      {/* アバター（ユーザーの場合） */}
      {isUser && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </motion.div>
  )
}

// 特殊なメッセージコンポーネント
export function WelcomeMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-matura-primary to-matura-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-matura-dark mb-2">
        MATURAへようこそ！
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        どんなアプリやサービスを作りたいですか？あなたのアイデアを聞かせてください。一緒に素晴らしいものを作りましょう！
      </p>
    </motion.div>
  )
}