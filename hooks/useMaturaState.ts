import { useState, useCallback, useMemo } from 'react'
import { MaturaState, Message, Insight, UIDesign, UIStyle, UXDesign, GeneratedCode, ReleaseInfo, ExtractedStructure } from '@/lib/types'
import { generateId } from '@/lib/utils'

const initialState: MaturaState = {
  currentPhase: 0,
  conversations: [],
  insights: null,
  selectedUI: null,
  selectedUIStyle: null,
  uxDesign: null,
  generatedCode: null,
  releaseInfo: null,
  isLoading: false,
  error: null,
  // 新しいフィールド
  messageCount: 0,
  structureExtracted: false,
  extractedStructure: null,
}

export function useMaturaState() {
  const [state, setState] = useState<MaturaState>(initialState)

  const updateState = useCallback((updates: Partial<MaturaState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Batch state updates to reduce re-renders
  const batchUpdateState = useCallback((updateFn: (prevState: MaturaState) => Partial<MaturaState>) => {
    setState(prev => {
      const updates = updateFn(prev)
      return { ...prev, ...updates }
    })
  }, [])

  // 🔥 ULTRA FIX: Force state update with functional update pattern
  const addMessage = useCallback((content: string, role: 'user' | 'assistant' | 'system', phase?: string) => {
    console.log('🔥 [ULTRA-STATE] ===== FORCE ADDING MESSAGE =====')
    console.log('🔥 [ULTRA-STATE] Content:', content)
    console.log('🔥 [ULTRA-STATE] Role:', role)
    console.log('🔥 [ULTRA-STATE] Phase:', phase)
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      console.error('❌ [ULTRA-STATE] Invalid message content:', content)
      return
    }
    
    const message: Message = {
      id: generateId(),
      content: content.trim(),
      role,
      timestamp: new Date(),
      phase,
    }
    
    console.log('🔥 [ULTRA-STATE] Generated message object:', message)
    
    // 🔥 ULTRA FIX: Use functional update pattern for immediate effect
    setState(prevState => {
      console.log('🔥 [ULTRA-STATE] Previous conversations count:', prevState.conversations.length)
      
      const newConversations = [...prevState.conversations, message]
      const newState = {
        ...prevState,
        conversations: newConversations,
        messageCount: newConversations.length
      }
      
      console.log('🔥 [ULTRA-STATE] New conversations count:', newState.conversations.length)
      console.log('🔥 [ULTRA-STATE] Last message role:', newState.conversations[newState.conversations.length - 1]?.role)
      console.log('🔥 [ULTRA-STATE] Last message content preview:', newState.conversations[newState.conversations.length - 1]?.content.substring(0, 50))
      
      // Immediate verification
      if (newState.conversations.length <= prevState.conversations.length) {
        console.error('❌ [ULTRA-STATE] STATE UPDATE FAILED! Count did not increase!')
        console.error('❌ [ULTRA-STATE] Previous:', prevState.conversations.length)
        console.error('❌ [ULTRA-STATE] New:', newState.conversations.length)
      } else {
        console.log('✅ [ULTRA-STATE] STATE UPDATE SUCCESSFUL!')
      }
      
      return newState
    })
    
    console.log('🔥 [ULTRA-STATE] ===== FORCE MESSAGE ADDED =====')
  }, [])

  const nextPhase = useCallback(() => {
    batchUpdateState(prev => ({
      currentPhase: Math.min(prev.currentPhase + 1, 5),
      isLoading: false,
      error: null,
    }))
  }, [batchUpdateState])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }))
  }, [])

  const setInsights = useCallback((insights: Insight) => {
    setState(prev => ({ ...prev, insights }))
  }, [])

  const setSelectedUI = useCallback((ui: UIDesign) => {
    setState(prev => ({ ...prev, selectedUI: ui }))
  }, [])

  const setSelectedUIStyle = useCallback((style: UIStyle) => {
    setState(prev => ({ ...prev, selectedUIStyle: style }))
  }, [])

  const setUXDesign = useCallback((uxDesign: UXDesign) => {
    setState(prev => ({ ...prev, uxDesign }))
  }, [])

  const setGeneratedCode = useCallback((code: GeneratedCode) => {
    setState(prev => ({ ...prev, generatedCode: code }))
  }, [])

  const setReleaseInfo = useCallback((info: ReleaseInfo) => {
    setState(prev => ({ ...prev, releaseInfo: info }))
  }, [])

  const resetState = useCallback(() => {
    setState(initialState)
  }, [])

  // 新しいアクション
  const incrementMessageCount = useCallback(() => {
    setState(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1
    }))
  }, [])

  const setExtractedStructure = useCallback((structure: ExtractedStructure) => {
    setState(prev => ({
      ...prev,
      extractedStructure: structure,
      structureExtracted: true
    }))
  }, [])

  const resetChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      conversations: [],
      messageCount: 0,
      structureExtracted: false,
      extractedStructure: null
    }))
  }, [])

  // Batch operations for common workflows
  const setInsightAndNextPhase = useCallback((insights: Insight) => {
    batchUpdateState(prev => ({
      insights,
      currentPhase: Math.min(prev.currentPhase + 1, 5),
      isLoading: false,
      error: null,
    }))
  }, [batchUpdateState])

  const setUIAndNextPhase = useCallback((ui: UIDesign) => {
    batchUpdateState(prev => ({
      selectedUI: ui,
      currentPhase: Math.min(prev.currentPhase + 1, 5),
      isLoading: false,
      error: null,
    }))
  }, [batchUpdateState])

  const setUIStyleAndNextPhase = useCallback((style: UIStyle) => {
    batchUpdateState(prev => ({
      selectedUIStyle: style,
      currentPhase: Math.min(prev.currentPhase + 1, 5),
      isLoading: false,
      error: null,
    }))
  }, [batchUpdateState])

  const setUXAndNextPhase = useCallback((uxDesign: UXDesign) => {
    batchUpdateState(prev => ({
      uxDesign,
      currentPhase: Math.min(prev.currentPhase + 1, 5),
      isLoading: false,
      error: null,
    }))
  }, [batchUpdateState])

  const setCodeAndNextPhase = useCallback((code: GeneratedCode) => {
    batchUpdateState(prev => ({
      generatedCode: code,
      currentPhase: Math.min(prev.currentPhase + 1, 5),
      isLoading: false,
      error: null,
    }))
  }, [batchUpdateState])

  const getCurrentPhaseData = useCallback(() => {
    const { currentPhase, insights, selectedUI, selectedUIStyle, uxDesign, generatedCode, releaseInfo } = state
    
    switch (currentPhase) {
      case 1: return insights
      case 2: return selectedUIStyle || selectedUI
      case 3: return uxDesign
      case 4: return generatedCode
      case 5: return releaseInfo
      default: return null
    }
  }, [state])

  // Memoize computed values for performance
  const userMessageCount = useMemo(
    () => state.conversations.filter(m => m.role === 'user').length,
    [state.conversations]
  )

  const assistantMessageCount = useMemo(
    () => state.conversations.filter(m => m.role === 'assistant').length,
    [state.conversations]
  )

  const phaseMessages = useMemo(
    () => {
      const phases = ['FreeTalk', 'InsightRefine', 'SketchView', 'UXBuild', 'CodePlayground', 'ReleaseBoard']
      return phases.reduce((acc, phase) => {
        acc[phase] = state.conversations.filter(m => m.phase === phase)
        return acc
      }, {} as Record<string, Message[]>)
    },
    [state.conversations]
  )

  const hasCompletedPhase = useMemo(
    () => {
      const requirements = [
        state.conversations.length > 0, // FreeTalk
        state.insights !== null,         // InsightRefine
        state.selectedUIStyle !== null || state.selectedUI !== null, // SketchView
        state.uxDesign !== null,         // UXBuild
        state.generatedCode !== null,    // CodePlayground
        state.releaseInfo !== null       // ReleaseBoard
      ]
      return requirements.slice(0, state.currentPhase + 1)
    },
    [state]
  )

  return {
    state,
    updateState,
    batchUpdateState,
    addMessage,
    nextPhase,
    setLoading,
    setError,
    setInsights,
    setSelectedUI,
    setSelectedUIStyle,
    setUXDesign,
    setGeneratedCode,
    setReleaseInfo,
    resetState,
    getCurrentPhaseData,
    // 新しいアクション
    incrementMessageCount,
    setExtractedStructure,
    resetChat,
    // Batch operations
    setInsightAndNextPhase,
    setUIAndNextPhase,
    setUIStyleAndNextPhase,
    setUXAndNextPhase,
    setCodeAndNextPhase,
    // Memoized values
    userMessageCount,
    assistantMessageCount,
    phaseMessages,
    hasCompletedPhase,
  }
}