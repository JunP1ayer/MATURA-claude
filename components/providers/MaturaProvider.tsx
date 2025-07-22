'use client'

import React, { createContext, useContext, ReactNode, useMemo } from 'react'
import { useChatOptimized } from '@/hooks/useChatOptimized'
import { useMaturaHistory } from '@/hooks/useLocalStorage'
import { useMaturaState } from '@/hooks/useMaturaState'

interface MaturaContextType {
  // State management
  state: ReturnType<typeof useMaturaState>['state']
  actions: {
    updateState: any
    batchUpdateState: any
    addMessage: any
    nextPhase: any
    setLoading: any
    setError: any
    setInsights: any
    setSelectedUI: any
    setUXDesign: any
    setGeneratedCode: any
    setReleaseInfo: any
    resetState: any
    getCurrentPhaseData: any
    incrementMessageCount: any
    setExtractedStructure: any
    resetChat: any
    setInsightAndNextPhase: any
    setUIAndNextPhase: any
    setUXAndNextPhase: any
    setCodeAndNextPhase: any
    generateUnifiedUX: () => Promise<any>
  }
  
  // Additional context properties
  userMessageCount: number
  assistantMessageCount: number
  phaseMessages: any[]
  hasCompletedPhase: boolean[]
  
  // History management
  history: ReturnType<typeof useMaturaHistory>
  
  // Chat functionality
  chat: ReturnType<typeof useChatOptimized>
}

const MaturaContext = createContext<MaturaContextType | undefined>(undefined)

export function MaturaProvider({ children }: { children: ReactNode }) {
  const maturaState = useMaturaState()
  const history = useMaturaHistory()
  const chat = useChatOptimized()

  // Debug logging for context value changes
  React.useEffect(() => {
    console.log('🔄 [PROVIDER-DEBUG] MaturaProvider re-rendered')
    console.log('🔄 [PROVIDER-DEBUG] Current state conversations:', maturaState.state.conversations.length)
    console.log('🔄 [PROVIDER-DEBUG] addMessage function reference:', maturaState.addMessage)
  }, [maturaState.state.conversations.length, maturaState.addMessage])

  // Memoize the context value to prevent unnecessary re-renders and stale closures
  const value: MaturaContextType = useMemo(() => {
    console.log('🔄 [PROVIDER-DEBUG] Creating new context value')
    console.log('🔄 [PROVIDER-DEBUG] State conversations count:', maturaState.state.conversations.length)
    console.log('🔄 [PROVIDER-DEBUG] addMessage function:', typeof maturaState.addMessage)
    
    return {
      state: maturaState.state,
      actions: {
        updateState: maturaState.updateState,
        batchUpdateState: maturaState.batchUpdateState,
        addMessage: maturaState.addMessage,
        nextPhase: maturaState.nextPhase,
        setLoading: maturaState.setLoading,
        setError: maturaState.setError,
        setInsights: maturaState.setInsights,
        setSelectedUI: maturaState.setSelectedUI,
        setUXDesign: maturaState.setUXDesign,
        setGeneratedCode: maturaState.setGeneratedCode,
        setReleaseInfo: maturaState.setReleaseInfo,
        resetState: maturaState.resetState,
        getCurrentPhaseData: maturaState.getCurrentPhaseData,
        // 新しいアクション
        incrementMessageCount: maturaState.incrementMessageCount,
        setExtractedStructure: maturaState.setExtractedStructure,
        resetChat: maturaState.resetChat,
        // Batch operations
        setInsightAndNextPhase: maturaState.setInsightAndNextPhase,
        setUIAndNextPhase: maturaState.setUIAndNextPhase,
        setUXAndNextPhase: maturaState.setUXAndNextPhase,
        setCodeAndNextPhase: maturaState.setCodeAndNextPhase,
        generateUnifiedUX: async () => ({})
      },
      // Additional context properties
      userMessageCount: 0,
      assistantMessageCount: 0,
      phaseMessages: [],
      hasCompletedPhase: [false, false, false, false, false, false],
      history,
      chat,
    }
  }, [
    maturaState.state,
    maturaState.updateState,
    maturaState.batchUpdateState,
    maturaState.addMessage,
    maturaState.nextPhase,
    maturaState.setLoading,
    maturaState.setError,
    maturaState.setInsights,
    maturaState.setSelectedUI,
    maturaState.setUXDesign,
    maturaState.setGeneratedCode,
    maturaState.setReleaseInfo,
    maturaState.resetState,
    maturaState.getCurrentPhaseData,
    maturaState.incrementMessageCount,
    maturaState.setExtractedStructure,
    maturaState.resetChat,
    maturaState.setInsightAndNextPhase,
    maturaState.setUIAndNextPhase,
    maturaState.setUXAndNextPhase,
    maturaState.setCodeAndNextPhase,
    history,
    chat,
  ])

  return (
    <MaturaContext.Provider value={value}>
      {children}
    </MaturaContext.Provider>
  )
}

export function useMatura() {
  const context = useContext(MaturaContext)
  if (!context) {
    throw new Error('useMatura must be used within MaturaProvider')
  }
  return context
}

// 個別のフックも提供
export function useMaturaActions() {
  const { actions } = useMatura()
  return actions
}

export function useMaturaChat() {
  const { chat } = useMatura()
  return chat
}

export function useMaturaHistoryContext() {
  const { history } = useMatura()
  return history
}