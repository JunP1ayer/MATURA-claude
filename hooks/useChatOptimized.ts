import { useState, useCallback, useRef } from 'react'
import { Message } from '@/lib/types'
import { generateId } from '@/lib/utils'

interface ChatOptions {
  onNewMessage?: (message: string) => void
  onError?: (error: string) => void
  timeout?: number
}

export function useChatOptimized() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cancel ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (
    content: string,
    messages: Message[],
    phase: string,
    options?: ChatOptions
  ): Promise<string | null> => {
    // Only cancel if there's an active request and we're loading
    if (isLoading && abortControllerRef.current) {
      console.log('[useChatOptimized] Cancelling previous request')
      cancelRequest()
    }

    setIsLoading(true)
    setError(null)

    // Create new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Increase default timeout to 90 seconds to match OpenAI timeout
    const timeoutMs = options?.timeout || 90000
    const timeoutId = setTimeout(() => {
      console.error('[useChatOptimized] Request timed out after', timeoutMs, 'ms')
      controller.abort()
    }, timeoutMs)

    try {
      console.log('[useChatOptimized] Starting fetch to /api/chat, phase:', phase)
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
        signal: controller.signal,
      })
      
      console.log('[useChatOptimized] Fetch completed, status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[useChatOptimized] HTTP error:', response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('[useChatOptimized] Response data received:', {
        hasMessage: !!data.message,
        messageLength: data.message?.length || 0,
        hasError: !!data.error
      })
      
      if (data.error) {
        console.error('[useChatOptimized] API returned error:', data.error)
        throw new Error(data.error)
      }

      const aiResponse = data.message
      options?.onNewMessage?.(aiResponse)
      
      return aiResponse
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          const errorMessage = 'OpenAIに接続できませんでした。もう一度お試しください。'
          setError(errorMessage)
          options?.onError?.(errorMessage)
          console.error('[useChatOptimized] Request aborted:', err)
          return null
        }
        
        const errorMessage = err.message
        setError(errorMessage)
        options?.onError?.(errorMessage)
        console.error('Chat error:', err)
        return null
      }
      
      const errorMessage = '通信エラーが発生しました'
      setError(errorMessage)
      options?.onError?.(errorMessage)
      return null
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [cancelRequest])

  const generateStructuredData = useCallback(async (
    conversations: Message[],
    phase: string,
    options?: ChatOptions
  ): Promise<any> => {
    // Only cancel if there's an active request and we're loading
    if (isLoading && abortControllerRef.current) {
      console.log('[useChatOptimized] Cancelling previous structured data request')
      cancelRequest()
    }

    setIsLoading(true)
    setError(null)

    // Create new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Increase default timeout to 90 seconds to match OpenAI timeout
    const timeoutMs = options?.timeout || 90000
    const timeoutId = setTimeout(() => {
      console.error('[useChatOptimized] Request timed out after', timeoutMs, 'ms')
      controller.abort()
    }, timeoutMs)

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
        signal: controller.signal,
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
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          const errorMessage = 'OpenAIに接続できませんでした。もう一度お試しください。'
          setError(errorMessage)
          options?.onError?.(errorMessage)
          console.error('[useChatOptimized] Request aborted:', err)
          return null
        }
        
        const errorMessage = err.message
        setError(errorMessage)
        options?.onError?.(errorMessage)
        console.error('Structured data generation error:', err)
        return null
      }
      
      const errorMessage = 'データ生成エラーが発生しました'
      setError(errorMessage)
      options?.onError?.(errorMessage)
      return null
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [cancelRequest])

  // Cleanup function to cancel request when component unmounts
  const cleanup = useCallback(() => {
    cancelRequest()
  }, [cancelRequest])

  return {
    sendMessage,
    generateStructuredData,
    cancelRequest,
    cleanup,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}