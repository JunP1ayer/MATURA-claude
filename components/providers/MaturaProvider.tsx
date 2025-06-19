'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useMaturaState } from '@/hooks/useMaturaState'
import { useMaturaHistory } from '@/hooks/useLocalStorage'
import { useChatOptimized } from '@/hooks/useChatOptimized'

interface MaturaContextType {
  // State management
  state: ReturnType<typeof useMaturaState>['state']
  actions: Omit<ReturnType<typeof useMaturaState>, 'state'>
  
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

  const value: MaturaContextType = {
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
      // Batch operations
      setInsightAndNextPhase: maturaState.setInsightAndNextPhase,
      setUIAndNextPhase: maturaState.setUIAndNextPhase,
      setUXAndNextPhase: maturaState.setUXAndNextPhase,
      setCodeAndNextPhase: maturaState.setCodeAndNextPhase,
    },
    history,
    chat,
  }

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