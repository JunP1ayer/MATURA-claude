/**
 * MATURA Global State Management with Zustand
 * 
 * グローバル状態管理システム
 * - ON/OFF状態の管理
 * - UI切り替えロジック
 * - 他コンポーネントからの読み取り/更新
 */

import { create, StateCreator } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'

// ===== 型定義 =====

export interface UIState {
  // UI表示状態
  isGenerating: boolean
  isComplete: boolean
  showPatternA: boolean
  showPatternB: boolean
  
  // 機能状態
  isGeminiEnabled: boolean
  isTestMode: boolean
  isAutoSaveEnabled: boolean
  isDarkMode: boolean
  
  // ユーザー入力状態
  userPrompt: string
  selectedPattern: 'pattern-a' | 'pattern-b' | null
  
  // API状態
  apiCallCount: number
  lastApiCall: string | null
  isApiLoading: boolean
  
  // 生成結果状態
  generatedComponents: string[]
  generationProgress: number
  
  // ステップ管理
  currentStep: 1 | 2 | 3 | 4 | 5
  completedSteps: Set<number>
}

export interface UIActions {
  // 基本ON/OFF切り替え
  toggleGenerating: () => void
  toggleComplete: () => void
  togglePatternA: () => void
  togglePatternB: () => void
  
  // 機能切り替え
  toggleGemini: () => void
  toggleTestMode: () => void
  toggleAutoSave: () => void
  toggleDarkMode: () => void
  
  // パターン選択
  selectPattern: (pattern: 'pattern-a' | 'pattern-b') => void
  
  // ユーザー入力
  setUserPrompt: (prompt: string) => void
  
  // API関連
  incrementApiCall: () => void
  setApiLoading: (loading: boolean) => void
  setLastApiCall: (timestamp: string) => void
  
  // 生成結果
  addGeneratedComponent: (component: string) => void
  setGenerationProgress: (progress: number) => void
  resetGenerationResults: () => void
  
  // ステップ管理
  setCurrentStep: (step: 1 | 2 | 3 | 4 | 5) => void
  markStepCompleted: (step: number) => void
  resetAllSteps: () => void
  
  // リセット機能
  resetAllState: () => void
}

export type MaturaStore = UIState & UIActions

// ===== 初期状態 =====

const initialState: UIState = {
  // UI表示状態
  isGenerating: false,
  isComplete: false,
  showPatternA: true, // デフォルトでPattern Aを表示
  showPatternB: false,
  
  // 機能状態
  isGeminiEnabled: false,
  isTestMode: false,
  isAutoSaveEnabled: true,
  isDarkMode: false,
  
  // ユーザー入力状態
  userPrompt: '',
  selectedPattern: null,
  
  // API状態
  apiCallCount: 0,
  lastApiCall: null,
  isApiLoading: false,
  
  // 生成結果状態
  generatedComponents: [],
  generationProgress: 0,
  
  // ステップ管理
  currentStep: 1,
  completedSteps: new Set<number>()
}

// ===== Zustand Store 作成 =====

export const useMaturaStore = create<MaturaStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        (set, get) => ({
          ...initialState,

          // ===== 基本ON/OFF切り替え =====
          
          toggleGenerating: () => {
            const isGenerating = !get().isGenerating
            set({ isGenerating }, false, 'toggleGenerating')
            
            // ログ出力
            console.log('🔄 Generation state changed:', { isGenerating })
            
            // 生成開始時の処理
            if (isGenerating) {
              set({ generationProgress: 0, generatedComponents: [] })
              console.log('🚀 Starting code generation...')
            } else {
              console.log('⏹️ Stopping code generation...')
            }
          },

          toggleComplete: () => {
            const isComplete = !get().isComplete
            set({ isComplete }, false, 'toggleComplete')
            
            console.log('✅ Completion state changed:', { isComplete })
            
            if (isComplete) {
              set({ isGenerating: false, generationProgress: 100 })
              console.log('🎉 Code generation completed!')
            }
          },

          togglePatternA: () => {
            const showPatternA = !get().showPatternA
            set({ showPatternA }, false, 'togglePatternA')
            
            console.log('🎨 Pattern A visibility:', { showPatternA })
            
            // Pattern Aを表示する場合、Pattern Bを非表示に
            if (showPatternA) {
              set({ showPatternB: false, selectedPattern: 'pattern-a' })
            }
          },

          togglePatternB: () => {
            const showPatternB = !get().showPatternB
            set({ showPatternB }, false, 'togglePatternB')
            
            console.log('🎨 Pattern B visibility:', { showPatternB })
            
            // Pattern Bを表示する場合、Pattern Aを非表示に
            if (showPatternB) {
              set({ showPatternA: false, selectedPattern: 'pattern-b' })
            }
          },

          // ===== 機能切り替え =====
          
          toggleGemini: () => {
            const isGeminiEnabled = !get().isGeminiEnabled
            set({ isGeminiEnabled }, false, 'toggleGemini')
            
            console.log('🔥 Gemini API state:', { isGeminiEnabled })
            
            if (isGeminiEnabled) {
              console.log('🚀 Gemini API enabled - Real AI generation available')
            } else {
              console.log('💻 Gemini API disabled - Fallback generation will be used')
            }
          },

          toggleTestMode: () => {
            const isTestMode = !get().isTestMode
            set({ isTestMode }, false, 'toggleTestMode')
            
            console.log('🧪 Test mode:', { isTestMode })
          },

          toggleAutoSave: () => {
            const isAutoSaveEnabled = !get().isAutoSaveEnabled
            set({ isAutoSaveEnabled }, false, 'toggleAutoSave')
            
            console.log('💾 Auto-save:', { isAutoSaveEnabled })
          },

          toggleDarkMode: () => {
            const isDarkMode = !get().isDarkMode
            set({ isDarkMode }, false, 'toggleDarkMode')
            
            console.log('🌙 Dark mode:', { isDarkMode })
            
            // ダークモード切り替え時にDOM更新
            if (typeof window !== 'undefined') {
              document.documentElement.classList.toggle('dark', isDarkMode)
            }
          },

          // ===== パターン選択 =====
          
          selectPattern: (pattern: 'pattern-a' | 'pattern-b') => {
            set({ 
              selectedPattern: pattern,
              showPatternA: pattern === 'pattern-a',
              showPatternB: pattern === 'pattern-b'
            }, false, 'selectPattern')
            
            console.log('🎯 Pattern selected:', { pattern })
          },

          // ===== ユーザー入力 =====
          
          setUserPrompt: (userPrompt: string) => {
            set({ userPrompt }, false, 'setUserPrompt')
            
            console.log('📝 User prompt updated:', { length: userPrompt.length })
          },

          // ===== API関連 =====
          
          incrementApiCall: () => {
            const apiCallCount = get().apiCallCount + 1
            const lastApiCall = new Date().toISOString()
            
            set({ apiCallCount, lastApiCall }, false, 'incrementApiCall')
            
            console.log('📡 API call incremented:', { apiCallCount, lastApiCall })
          },

          setApiLoading: (isApiLoading: boolean) => {
            set({ isApiLoading }, false, 'setApiLoading')
            
            console.log('🔄 API loading state:', { isApiLoading })
          },

          setLastApiCall: (lastApiCall: string) => {
            set({ lastApiCall }, false, 'setLastApiCall')
            
            console.log('📡 Last API call updated:', { lastApiCall })
          },

          // ===== 生成結果 =====
          
          addGeneratedComponent: (component: string) => {
            const generatedComponents = [...get().generatedComponents, component]
            set({ generatedComponents }, false, 'addGeneratedComponent')
            
            console.log('📦 Component added:', { component, total: generatedComponents.length })
          },

          setGenerationProgress: (generationProgress: number) => {
            set({ generationProgress }, false, 'setGenerationProgress')
            
            console.log('📊 Progress updated:', { generationProgress })
          },

          resetGenerationResults: () => {
            set({ 
              generatedComponents: [], 
              generationProgress: 0,
              isComplete: false 
            }, false, 'resetGenerationResults')
            
            console.log('🔄 Generation results reset')
          },

          // ===== ステップ管理 =====
          
          setCurrentStep: (currentStep: 1 | 2 | 3 | 4 | 5) => {
            set({ currentStep }, false, 'setCurrentStep')
            
            console.log('📍 Current step updated:', { currentStep })
          },

          markStepCompleted: (step: number) => {
            const completedSteps = new Set(get().completedSteps)
            completedSteps.add(step)
            
            set({ completedSteps }, false, 'markStepCompleted')
            
            console.log('✅ Step completed:', { step, totalCompleted: completedSteps.size })
          },

          resetAllSteps: () => {
            set({ 
              currentStep: 1, 
              completedSteps: new Set<number>() 
            }, false, 'resetAllSteps')
            
            console.log('🔄 All steps reset')
          },

          // ===== リセット機能 =====
          
          resetAllState: () => {
            set(initialState, false, 'resetAllState')
            
            console.log('🔄 All state reset to initial values')
          }
        })
      ),
      {
        name: 'matura-store',
        version: 1,
        
        // 永続化から除外する項目（一時的な状態）
        partialize: (state) => ({
          ...state,
          isGenerating: false, // 再起動時は生成停止状態
          isApiLoading: false, // API読み込み状態はリセット
          generationProgress: 0 // 進行状況はリセット
        })
      }
    ),
    {
      name: 'matura-store'
    }
  )
)

// ===== セレクター関数（パフォーマンス最適化） =====

export const useIsGenerating = () => useMaturaStore(state => state.isGenerating)
export const useIsComplete = () => useMaturaStore(state => state.isComplete)
export const useCurrentPattern = () => useMaturaStore(state => state.selectedPattern)
export const useGenerationProgress = () => useMaturaStore(state => state.generationProgress)
export const useCurrentStep = () => useMaturaStore(state => state.currentStep)
export const useCompletedSteps = () => useMaturaStore(state => state.completedSteps)

// ===== カスタムフック =====

/**
 * パターン切り替え用カスタムフック
 */
export const usePatternToggle = () => {
  const { showPatternA, showPatternB, togglePatternA, togglePatternB, selectPattern } = useMaturaStore()
  
  return {
    showPatternA,
    showPatternB,
    togglePatternA,
    togglePatternB,
    selectPattern,
    togglePattern: (pattern: 'pattern-a' | 'pattern-b') => {
      if (pattern === 'pattern-a') {
        togglePatternA()
      } else {
        togglePatternB()
      }
    }
  }
}

/**
 * 生成制御用カスタムフック
 */
export const useGenerationControl = () => {
  const { 
    isGenerating, 
    isComplete, 
    generationProgress,
    toggleGenerating, 
    toggleComplete,
    setGenerationProgress,
    resetGenerationResults
  } = useMaturaStore()
  
  return {
    isGenerating,
    isComplete,
    generationProgress,
    toggleGenerating,
    toggleComplete,
    setGenerationProgress,
    resetGenerationResults,
    startGeneration: () => {
      if (!isGenerating) {
        toggleGenerating()
      }
    },
    completeGeneration: () => {
      if (!isComplete) {
        toggleComplete()
      }
    }
  }
}

/**
 * ステップ管理用カスタムフック
 */
export const useStepManager = () => {
  const { 
    currentStep, 
    completedSteps, 
    setCurrentStep, 
    markStepCompleted, 
    resetAllSteps 
  } = useMaturaStore()
  
  return {
    currentStep,
    completedSteps,
    setCurrentStep,
    markStepCompleted,
    resetAllSteps,
    isStepCompleted: (step: number) => completedSteps.has(step),
    nextStep: () => {
      if (currentStep < 5) {
        setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4 | 5)
      }
    },
    prevStep: () => {
      if (currentStep > 1) {
        setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4 | 5)
      }
    }
  }
}

export default useMaturaStore