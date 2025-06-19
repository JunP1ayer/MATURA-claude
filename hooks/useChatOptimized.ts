import { useState, useCallback, useRef, useEffect } from 'react'
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
  
  // 【Ultra Think】: Ensure isLoading is reset on mount to prevent stale state
  useEffect(() => {
    console.log('🔄 [HOOK-DEBUG] useChatOptimized mounted, resetting isLoading')
    setIsLoading(false)
    return () => {
      console.log('🔄 [HOOK-DEBUG] useChatOptimized unmounting, cleaning up')
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
    console.log('🚀 [FETCH-DEBUG] === sendMessage called ===')
    console.log('🚀 [FETCH-DEBUG] isLoading state:', isLoading)
    console.log('🚀 [FETCH-DEBUG] AbortController exists:', !!abortControllerRef.current)
    
    // Prevent multiple simultaneous requests with better error recovery
    if (isLoading) {
      console.warn('⚠️ [FETCH-DEBUG] Request already in progress')
      console.warn('⚠️ [FETCH-DEBUG] Current loading state:', isLoading)
      console.warn('⚠️ [FETCH-DEBUG] AbortController exists:', !!abortControllerRef.current)
      
      // 【Ultra Think】: Force cleanup if stuck in loading state for too long
      if (abortControllerRef.current) {
        console.warn('⚠️ [FETCH-DEBUG] Forcing cleanup of stuck request')
        abortControllerRef.current.abort()
        abortControllerRef.current = null
        setIsLoading(false)
        // Continue with new request after cleanup
      } else {
        // No controller but still loading - reset state
        console.warn('⚠️ [FETCH-DEBUG] No controller but loading=true, resetting state')
        setIsLoading(false)
        // Continue with new request
      }
    }
    
    console.log('🚀 [FETCH-DEBUG] Starting new sendMessage request')
    console.log('🚀 [FETCH-DEBUG] Content:', content)
    console.log('🚀 [FETCH-DEBUG] Phase:', phase)

    setIsLoading(true)
    setError(null)

    // Create new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Use a more generous timeout - 120 seconds for OpenAI responses
    const timeoutMs = options?.timeout || 120000
    const timeoutId = setTimeout(() => {
      console.error('[useChatOptimized] Request timed out after', timeoutMs, 'ms')
      console.error('[useChatOptimized] Aborting request due to timeout')
      // Mark this as a timeout before aborting
      controller.abort('timeout')
    }, timeoutMs)

    try {
      console.log('🚀 [FETCH-DEBUG] Starting fetch to /api/chat')
      console.log('🚀 [FETCH-DEBUG] Phase:', phase)
      console.log('🚀 [FETCH-DEBUG] Message content:', content)
      console.log('🚀 [FETCH-DEBUG] Messages count:', messages.length)
      
      // 【Ultra Think】: Ensure JSON serialization integrity for reliable conversation flow
      const requestBody = {
        message: content,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        phase,
      }
      
      // Validate request body structure before serialization
      console.log('🚀 [FETCH-DEBUG] Pre-serialization validation:')
      console.log('🚀 [FETCH-DEBUG] - Content type:', typeof content)
      console.log('🚀 [FETCH-DEBUG] - Content length:', content?.length || 0)
      console.log('🚀 [FETCH-DEBUG] - Messages count:', messages?.length || 0)
      console.log('🚀 [FETCH-DEBUG] - Phase:', phase)
      console.log('🚀 [FETCH-DEBUG] - Request body structure:', requestBody)
      
      // Safe JSON serialization with error handling
      let serializedBody: string
      try {
        serializedBody = JSON.stringify(requestBody)
        console.log('🚀 [FETCH-DEBUG] JSON serialization successful')
        console.log('🚀 [FETCH-DEBUG] Serialized length:', serializedBody.length)
        console.log('🚀 [FETCH-DEBUG] Serialized preview:', serializedBody.substring(0, 200) + '...')
      } catch (serializationError) {
        console.error('❌ [FETCH-DEBUG] JSON serialization failed:', serializationError)
        throw new Error(`Failed to serialize request body: ${serializationError}`)
      }
      
      console.log('🚀 [FETCH-DEBUG] Starting fetch request to /api/chat')
      console.log('🚀 [FETCH-DEBUG] - Method: POST')
      console.log('🚀 [FETCH-DEBUG] - Content-Type: application/json')
      console.log('🚀 [FETCH-DEBUG] - Body length:', serializedBody.length)
      console.log('🚀 [FETCH-DEBUG] - Signal provided:', !!controller.signal)
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: serializedBody,
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
      console.log('🎉 [RESPONSE-DEBUG] ===== OpenAI Response Analysis =====')
      console.log('🎉 [RESPONSE-DEBUG] Raw data:', data)
      console.log('🎉 [RESPONSE-DEBUG] Message content:', aiResponse)
      console.log('🎉 [RESPONSE-DEBUG] Message type:', typeof aiResponse)
      console.log('🎉 [RESPONSE-DEBUG] Message length:', aiResponse?.length || 0)
      console.log('🎉 [RESPONSE-DEBUG] Is string:', typeof aiResponse === 'string')
      console.log('🎉 [RESPONSE-DEBUG] Is truthy:', !!aiResponse)
      
      // Validate response content
      if (!aiResponse || typeof aiResponse !== 'string' || aiResponse.trim().length === 0) {
        console.error('❌ [RESPONSE-DEBUG] Invalid or empty response detected!')
        console.error('❌ [RESPONSE-DEBUG] aiResponse value:', aiResponse)
        console.error('❌ [RESPONSE-DEBUG] Full data object:', JSON.stringify(data, null, 2))
        
        const errorMessage = 'OpenAIから無効な応答を受け取りました。もう一度お試しください。'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        return null
      }
      
      // Clear any previous errors since we got a successful response
      setError(null)
      
      console.log('🎉 [RESPONSE-DEBUG] Calling onNewMessage with:', aiResponse)
      console.log('🎉 [RESPONSE-DEBUG] onNewMessage function exists:', !!options?.onNewMessage)
      
      // Notify about the new message
      if (options?.onNewMessage) {
        try {
          console.log('🎉 [RESPONSE-DEBUG] About to call onNewMessage with:', aiResponse)
          console.log('🎉 [RESPONSE-DEBUG] onNewMessage function type:', typeof options.onNewMessage)
          console.log('🎉 [RESPONSE-DEBUG] onNewMessage function details:', options.onNewMessage.toString().substring(0, 200))
          
          options.onNewMessage(aiResponse)
          console.log('🎉 [RESPONSE-DEBUG] onNewMessage called successfully')
          
          // Add a small delay to let any state updates complete
          await new Promise(resolve => setTimeout(resolve, 100))
          console.log('🎉 [RESPONSE-DEBUG] Post-callback delay completed')
        } catch (callbackError) {
          console.error('❌ [RESPONSE-DEBUG] Error in onNewMessage callback:', callbackError)
          console.error('❌ [RESPONSE-DEBUG] Callback error stack:', callbackError instanceof Error ? callbackError.stack : 'No stack available')
        }
      } else {
        console.warn('⚠️ [RESPONSE-DEBUG] No onNewMessage callback provided!')
      }
      
      console.log('🎉 [RESPONSE-DEBUG] ===== Response Analysis Complete =====')
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
          console.warn('🚫 [FETCH-DEBUG] AbortError detected - request was cancelled')
          console.warn('🚫 [FETCH-DEBUG] This might be intentional (user navigation, timeout, etc.)')
          console.warn('🚫 [FETCH-DEBUG] Not showing error to user since this could be normal behavior')
          
          // AbortErrorの場合、多くは意図的なキャンセルなのでエラー表示しない
          // ただし、明示的にタイムアウトと判明している場合のみエラー表示
          if (err.message.includes('timeout') || err.message.includes('Timeout')) {
            console.error('🚫 [FETCH-DEBUG] Confirmed timeout error')
            const errorMessage = 'リクエストがタイムアウトしました。ネットワーク接続を確認してもう一度お試しください。'
            setError(errorMessage)
            options?.onError?.(errorMessage)
          } else {
            console.warn('🚫 [FETCH-DEBUG] Likely intentional abort - not showing error to user')
            // エラー表示しない（意図的なキャンセルの可能性が高い）
          }
          
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
      console.log('🔄 [FETCH-DEBUG] Cleaning up fetch operation')
      if (timeoutId) {
        clearTimeout(timeoutId)
        console.log('🔄 [FETCH-DEBUG] Timeout cleared')
      }
      setIsLoading(false)
      abortControllerRef.current = null
      console.log('🔄 [FETCH-DEBUG] Loading state cleared, abort controller reset')
    }
  }, [isLoading, cancelRequest]) // 【Ultra Think】: isLoading must be in dependencies to prevent stale closure

  const generateStructuredData = useCallback(async (
    conversations: Message[],
    phase: string,
    options?: ChatOptions
  ): Promise<any> => {
    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.warn('⚠️ [FETCH-DEBUG] Structured data request already in progress, ignoring new request')
      console.warn('⚠️ [FETCH-DEBUG] Current loading state:', isLoading)
      return null
    }
    
    console.log('🚀 [FETCH-DEBUG] Starting generateStructuredData request')
    console.log('🚀 [FETCH-DEBUG] Conversations count:', conversations.length)
    console.log('🚀 [FETCH-DEBUG] Phase:', phase)

    setIsLoading(true)
    setError(null)

    // Create new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Use a more generous timeout - 120 seconds for OpenAI responses
    const timeoutMs = options?.timeout || 120000
    const timeoutId = setTimeout(() => {
      console.error('[useChatOptimized] Request timed out after', timeoutMs, 'ms')
      console.error('[useChatOptimized] Aborting request due to timeout')
      // Mark this as a timeout before aborting
      controller.abort('timeout')
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
          console.warn('🚫 [FETCH-DEBUG] AbortError in generateStructuredData - request was cancelled')
          console.warn('🚫 [FETCH-DEBUG] Details:', {
            name: err.name,
            message: err.message
          })
          
          // AbortErrorの場合、多くは意図的なキャンセルなのでエラー表示しない
          // ただし、明示的にタイムアウトと判明している場合のみエラー表示
          if (err.message.includes('timeout') || err.message.includes('Timeout')) {
            console.error('🚫 [FETCH-DEBUG] Confirmed timeout error in structured data generation')
            const errorMessage = 'データ生成がタイムアウトしました。ネットワーク接続を確認してもう一度お試しください。'
            setError(errorMessage)
            options?.onError?.(errorMessage)
          } else {
            console.warn('🚫 [FETCH-DEBUG] Likely intentional abort in structured data - not showing error to user')
            // エラー表示しない（意図的なキャンセルの可能性が高い）
          }
          
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
      console.log('🔄 [FETCH-DEBUG] Cleaning up fetch operation')
      if (timeoutId) {
        clearTimeout(timeoutId)
        console.log('🔄 [FETCH-DEBUG] Timeout cleared')
      }
      setIsLoading(false)
      abortControllerRef.current = null
      console.log('🔄 [FETCH-DEBUG] Loading state cleared, abort controller reset')
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