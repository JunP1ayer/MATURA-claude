import { useState, useCallback, useMemo } from 'react'
import { MaturaState, Message, Insight, UIDesign, UXDesign, GeneratedCode, ReleaseInfo } from '@/lib/types'
import { generateId } from '@/lib/utils'

const initialState: MaturaState = {
  currentPhase: 0,
  conversations: [],
  insights: null,
  selectedUI: null,
  uxDesign: null,
  generatedCode: null,
  releaseInfo: null,
  isLoading: false,
  error: null,
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

  const addMessage = useCallback((content: string, role: 'user' | 'assistant' | 'system', phase?: string) => {
    console.log('💾 [STATE-DEBUG] ===== Adding Message to State =====')
    console.log('💾 [STATE-DEBUG] Content:', content)
    console.log('💾 [STATE-DEBUG] Role:', role)
    console.log('💾 [STATE-DEBUG] Phase:', phase)
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      console.error('❌ [STATE-DEBUG] Invalid message content:', content)
      return
    }
    
    const message: Message = {
      id: generateId(),
      content,
      role,
      timestamp: new Date(),
      phase,
    }
    
    console.log('💾 [STATE-DEBUG] Generated message:', message)
    
    setState(prev => {
      console.log('💾 [STATE-DEBUG] Previous conversations count:', prev.conversations.length)
      const newConversations = [...prev.conversations, message]
      console.log('💾 [STATE-DEBUG] New conversations count:', newConversations.length)
      console.log('💾 [STATE-DEBUG] Updated conversations:', newConversations.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content.substring(0, 50) + (m.content.length > 50 ? '...' : ''),
        phase: m.phase
      })))
      
      return {
        ...prev,
        conversations: newConversations
      }
    })
    
    console.log('💾 [STATE-DEBUG] ===== Message Added to State =====')
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
    const { currentPhase, insights, selectedUI, uxDesign, generatedCode, releaseInfo } = state
    
    switch (currentPhase) {
      case 1: return insights
      case 2: return selectedUI
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
        state.selectedUI !== null,       // SketchView
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
    setUXDesign,
    setGeneratedCode,
    setReleaseInfo,
    resetState,
    getCurrentPhaseData,
    // Batch operations
    setInsightAndNextPhase,
    setUIAndNextPhase,
    setUXAndNextPhase,
    setCodeAndNextPhase,
    // Memoized values
    userMessageCount,
    assistantMessageCount,
    phaseMessages,
    hasCompletedPhase,
  }
}