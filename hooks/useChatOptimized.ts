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
    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log('[useChatOptimized] Request already in progress, ignoring new request')
      return null
    }

    setIsLoading(true)
    setError(null)

    // Create new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Use a more reasonable timeout - 60 seconds
    const timeoutMs = options?.timeout || 60000
    const timeoutId = setTimeout(() => {
      console.error('[useChatOptimized] Request timed out after', timeoutMs, 'ms')
      console.error('[useChatOptimized] Aborting request due to timeout')
      controller.abort()
    }, timeoutMs)

    try {
      console.log('🚀 [FETCH-DEBUG] Starting fetch to /api/chat')
      console.log('🚀 [FETCH-DEBUG] Phase:', phase)
      console.log('🚀 [FETCH-DEBUG] Message content:', content)
      console.log('🚀 [FETCH-DEBUG] Messages count:', messages.length)
      
      const requestBody = {
        message: content,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        phase,
      }
      console.log('🚀 [FETCH-DEBUG] Request body:', JSON.stringify(requestBody, null, 2))
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })
      
      console.log('✅ [FETCH-DEBUG] Fetch completed!')
      console.log('✅ [FETCH-DEBUG] Response status:', response.status)
      console.log('✅ [FETCH-DEBUG] Response ok:', response.ok)
      console.log('✅ [FETCH-DEBUG] Response statusText:', response.statusText)
      console.log('✅ [FETCH-DEBUG] Response headers:', Object.fromEntries(response.headers.entries()))

      // Always try to get response text for debugging
      let responseText: string
      try {
        responseText = await response.text()
        console.log('✅ [FETCH-DEBUG] Response text length:', responseText.length)
        console.log('✅ [FETCH-DEBUG] Response text preview:', responseText.substring(0, 200) + '...')
      } catch (textError) {
        console.error('❌ [FETCH-DEBUG] Failed to read response text:', textError)
        responseText = ''
      }

      if (!response.ok) {
        console.error('❌ [FETCH-DEBUG] HTTP error detected!')
        console.error('❌ [FETCH-DEBUG] Status:', response.status)
        console.error('❌ [FETCH-DEBUG] StatusText:', response.statusText)
        console.error('❌ [FETCH-DEBUG] Error text:', responseText)
        throw new Error(`HTTP error! status: ${response.status}, text: ${responseText}`)
      }

      // Parse the response text as JSON
      let data: any
      try {
        data = JSON.parse(responseText)
        console.log('✅ [FETCH-DEBUG] JSON parsed successfully')
        console.log('✅ [FETCH-DEBUG] Data structure:', {
          hasMessage: !!data.message,
          messageLength: data.message?.length || 0,
          hasError: !!data.error,
          keys: Object.keys(data)
        })
      } catch (jsonError) {
        console.error('❌ [FETCH-DEBUG] Failed to parse JSON:', jsonError)
        console.error('❌ [FETCH-DEBUG] Raw response:', responseText)
        throw new Error('Invalid JSON response')
      }
      
      if (data.error) {
        console.error('❌ [FETCH-DEBUG] API returned error:', data.error)
        throw new Error(data.error)
      }

      const aiResponse = data.message
      options?.onNewMessage?.(aiResponse)
      
      return aiResponse
    } catch (err) {
      console.error('💥 [FETCH-DEBUG] Error caught in fetch operation!')
      console.error('💥 [FETCH-DEBUG] Error type:', typeof err)
      console.error('💥 [FETCH-DEBUG] Error constructor:', err?.constructor?.name)
      
      if (err instanceof Error) {
        console.error('💥 [FETCH-DEBUG] Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        })
        
        if (err.name === 'AbortError') {
          console.error('🚫 [FETCH-DEBUG] AbortError detected!')
          console.error('🚫 [FETCH-DEBUG] This indicates the request was cancelled')
          console.error('🚫 [FETCH-DEBUG] Possible causes:')
          console.error('🚫 [FETCH-DEBUG] - User navigation')
          console.error('🚫 [FETCH-DEBUG] - Timeout reached')
          console.error('🚫 [FETCH-DEBUG] - Component unmount')
          console.error('🚫 [FETCH-DEBUG] - Manual abort() call')
          
          const errorMessage = err.message.includes('timeout') || err.message.includes('Timeout')
            ? 'リクエストがタイムアウトしました。ネットワーク接続を確認してもう一度お試しください。'
            : 'リクエストがキャンセルされました。もう一度お試しください。'
            
          setError(errorMessage)
          options?.onError?.(errorMessage)
          return null
        }
        
        console.error('⚠️ [FETCH-DEBUG] Non-abort error:', err.message)
        const errorMessage = err.message
        setError(errorMessage)
        options?.onError?.(errorMessage)
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
    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log('[useChatOptimized] Structured data request already in progress, ignoring new request')
      return null
    }

    setIsLoading(true)
    setError(null)

    // Create new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Use a more reasonable timeout - 60 seconds
    const timeoutMs = options?.timeout || 60000
    const timeoutId = setTimeout(() => {
      console.error('[useChatOptimized] Request timed out after', timeoutMs, 'ms')
      console.error('[useChatOptimized] Aborting request due to timeout')
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
          console.error('[useChatOptimized] Request was aborted. Details:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
            timeElapsed: 'tracking not implemented'
          })
          
          // Check if this was a timeout or manual abort
          const errorMessage = err.message.includes('timeout') || err.message.includes('Timeout')
            ? 'リクエストがタイムアウトしました。ネットワーク接続を確認してもう一度お試しください。'
            : 'リクエストがキャンセルされました。もう一度お試しください。'
            
          setError(errorMessage)
          options?.onError?.(errorMessage)
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