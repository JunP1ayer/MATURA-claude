import { useState, useCallback, useRef, useEffect } from 'react'
import { Message } from '@/lib/types'
import { generateId } from '@/lib/utils'

interface ChatOptions {
  onNewMessage?: (message: string, data?: any) => void
  onError?: (error: string) => void
  timeout?: number
  requestStructureExtraction?: boolean
}

export function useChatOptimized() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Reset loading state on mount
  useEffect(() => {
    setIsLoading(false)
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

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
    // Prevent concurrent requests
    if (isLoading) {
      const errorMessage = 'リクエストが既に進行中です。完了をお待ちください。'
      options?.onError?.(errorMessage)
      return null
    }

    setIsLoading(true)
    setError(null)

    // Create AbortController for request cancellation
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Set timeout for OpenAI requests
    const timeoutMs = options?.timeout || 120000
    const timeoutId = setTimeout(() => {
      controller.abort('timeout')
    }, timeoutMs)

    try {
      // Prepare request body
      const requestBody = {
        message: content,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        phase,
        requestStructureExtraction: options?.requestStructureExtraction || false,
      }
      
      // Serialize request body
      let serializedBody: string
      try {
        serializedBody = JSON.stringify(requestBody)
      } catch (serializationError) {
        throw new Error(`Failed to serialize request body: ${serializationError}`)
      }
      
      // Validate body exists
      if (!serializedBody || serializedBody.length === 0) {
        throw new Error('Empty request body before fetch')
      }
      
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: serializedBody,
        signal: controller.signal,
      }
      
      // Check if signal is already aborted
      if (fetchOptions.signal?.aborted) {
        throw new Error('Request aborted before fetch')
      }
      
      const response = await fetch('/api/chat', fetchOptions)
      
      // Read response text
      let responseText: string
      try {
        responseText = await response.text()
      } catch (textError) {
        responseText = ''
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, text: ${responseText}`)
      }

      // Parse JSON response
      let data: any
      try {
        data = JSON.parse(responseText)
      } catch (jsonError) {
        throw new Error('Invalid JSON response')
      }
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Support both 'message' and 'response' fields for compatibility
      const aiResponse = data.response || data.message
      
      // Validate response content
      if (!aiResponse || typeof aiResponse !== 'string' || aiResponse.trim().length === 0) {
        const errorMessage = 'OpenAIから無効な応答を受け取りました。もう一度お試しください。'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        return null
      }
      
      // Clear any previous errors
      setError(null)
      
      // Notify about the new message
      if (options?.onNewMessage) {
        try {
          // 構造抽出結果も一緒に渡す
          options.onNewMessage(aiResponse, data)
          
          // Add a small delay to let any state updates complete
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (callbackError) {
          // Error in callback
        }
      }
      
      return aiResponse
    } catch (err) {
      console.error('💥 [FETCH-DEBUG] Error caught in fetch operation!')
      console.error('💥 [FETCH-DEBUG] Error type:', typeof err)
      console.error('💥 [FETCH-DEBUG] Error constructor:', err?.constructor?.name)
      
      // Handle both Error objects and thrown strings
      const error = err instanceof Error ? err : new Error(String(err))
      
      if (error instanceof Error) {
        console.error('💥 [FETCH-DEBUG] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
        
        if (error.name === 'AbortError') {
          console.warn('🚫 [FETCH-DEBUG] AbortError detected - request was cancelled')
          console.warn('🚫 [FETCH-DEBUG] This might be intentional (user navigation, timeout, etc.)')
          console.warn('🚫 [FETCH-DEBUG] Not showing error to user since this could be normal behavior')
          
          // AbortErrorの場合、多くは意図的なキャンセルなのでエラー表示しない
          // ただし、明示的にタイムアウトと判明している場合のみエラー表示
          if (error.message.includes('timeout') || error.message.includes('Timeout')) {
            console.error('🚫 [FETCH-DEBUG] Confirmed timeout error')
            const errorMessage = 'リクエストがタイムアウトしました。ネットワーク接続を確認してもう一度お試しください。'
            setError(errorMessage)
            options?.onError?.(errorMessage)
          } else {
            console.warn('🚫 [FETCH-DEBUG] Likely intentional abort - not showing error to user')
            // 意図的なキャンセルの場合はエラー状態をクリア
            setError(null)
          }
          
          return null
        }
        
        console.error('⚠️ [FETCH-DEBUG] Non-abort error:', error.message)
        const errorMessage = error.message
        setError(errorMessage)
        options?.onError?.(errorMessage)
        return null
      }
      
      const errorMessage = '通信エラーが発生しました'
      setError(errorMessage)
      options?.onError?.(errorMessage)
      return null
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [isLoading, cancelRequest]) // 【Ultra Think】: isLoading must be in dependencies to prevent stale closure

  const generateStructuredData = useCallback(async (
    conversations: Message[],
    phase: string,
    options?: ChatOptions
  ): Promise<any> => {
    console.log('🔧 generateStructuredData called:', {
      conversationsLength: conversations?.length,
      phase,
      isCurrentlyLoading: isLoading,
      hasOptions: !!options
    })

    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log('❌ Already loading, returning null')
      return null
    }

    setIsLoading(true)
    setError(null)

    // Create new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Set timeout for OpenAI responses
    const timeoutMs = options?.timeout || 120000
    const timeoutId = setTimeout(() => {
      console.log('⏰ Request timeout triggered')
      controller.abort('timeout')
    }, timeoutMs)

    try {
      const requestBody = {
        message: JSON.stringify(conversations),
        messages: [],
        phase,
        isStructured: true,
      }

      console.log('📤 Sending request to /api/chat:', {
        bodySize: JSON.stringify(requestBody).length,
        phase,
        isStructured: true,
        timeout: timeoutMs
      })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      console.log('📥 Response received:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      console.log('📊 Response data:', {
        hasError: !!data.error,
        hasMessage: !!data.message,
        messageType: typeof data.message,
        messageLength: data.message?.length || 0
      })
      
      if (data.error) {
        throw new Error(data.error)
      }

      // JSONレスポンスをパース
      try {
        const parsed = JSON.parse(data.message)
        console.log('✅ Successfully parsed JSON:', {
          type: typeof parsed,
          keys: parsed ? Object.keys(parsed) : null
        })
        return parsed
      } catch (parseError) {
        console.log('⚠️ JSON parse failed, returning raw message:', {
          error: parseError,
          messageType: typeof data.message
        })
        // JSONパースに失敗した場合は生の文字列を返す
        return data.message
      }
    } catch (err) {
      console.error('💥 Error in generateStructuredData:', err)
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Handle abort errors
          if (err.message.includes('timeout') || err.message.includes('Timeout')) {
            console.log('⏰ Confirmed timeout error')
            const errorMessage = 'データ生成がタイムアウトしました。ネットワーク接続を確認してもう一度お試しください。'
            setError(errorMessage)
            options?.onError?.(errorMessage)
          } else {
            console.log('🚫 Abort error (likely intentional)')
            // 意図的なキャンセルの場合はエラー状態をクリア
            setError(null)
          }
          return null
        }
        
        console.log('❌ Non-abort error:', err.message)
        const errorMessage = err.message
        setError(errorMessage)
        options?.onError?.(errorMessage)
        return null
      }
      
      const errorMessage = 'データ生成エラーが発生しました'
      setError(errorMessage)
      options?.onError?.(errorMessage)
      return null
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      console.log('🏁 generateStructuredData finishing, setting isLoading to false')
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