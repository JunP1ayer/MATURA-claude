import { useState, useCallback } from 'react'
import { Message } from '@/lib/types'
import { generateId } from '@/lib/utils'

export function useChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (
    content: string,
    messages: Message[],
    phase: string,
    onNewMessage?: (message: string) => void
  ): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          phase,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      const aiResponse = data.message
      onNewMessage?.(aiResponse)
      
      return aiResponse
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '通信エラーが発生しました'
      setError(errorMessage)
      console.error('Chat error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateStructuredData = useCallback(async (
    conversations: Message[],
    phase: string
  ): Promise<any> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: JSON.stringify(conversations),
          messages: [],
          phase,
          isStructured: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // JSONレスポンスをパース
      try {
        return JSON.parse(data.message)
      } catch {
        // JSONパースに失敗した場合は生の文字列を返す
        return data.message
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'データ生成エラーが発生しました'
      setError(errorMessage)
      console.error('Structured data generation error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    sendMessage,
    generateStructuredData,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}