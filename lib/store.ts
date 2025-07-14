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
  
  // トークン使用量管理
  tokenUsage: {
    used: number
    limit: number
    resetDate: string
    plan: 'free' | 'pro' | 'enterprise'
    estimatedCost: number
  }
  
  // 課金関連
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'expired'
  billingInfo: {
    nextBillingDate: string | null
    amount: number | null
    currency: string
  }
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
  
  // トークン関連
  updateTokenUsage: (used: number) => void
  setTokenLimit: (limit: number) => void
  upgradeSubscription: (plan: 'free' | 'pro' | 'enterprise') => void
  updateBillingInfo: (info: Partial<UIState['billingInfo']>) => void
  addTokens: (amount: number) => void
  resetTokenUsage: () => void
  
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
  completedSteps: new Set<number>(),
  
  // トークン使用量管理
  tokenUsage: {
    used: 0,
    limit: 10000, // 無料プランのデフォルト
    resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30日後
    plan: 'free',
    estimatedCost: 0
  },
  
  // 課金関連
  subscriptionStatus: 'inactive',
  billingInfo: {
    nextBillingDate: null,
    amount: null,
    currency: 'JPY'
  }
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

          // ===== トークン関連 =====
          
          updateTokenUsage: (used: number) => {
            const tokenUsage = { ...get().tokenUsage, used }
            const estimatedCost = tokenUsage.plan === 'free' ? 0 : used * 0.01 // 仮の料金計算
            tokenUsage.estimatedCost = estimatedCost
            
            set({ tokenUsage }, false, 'updateTokenUsage')
            
            console.log('💳 Token usage updated:', { used, estimatedCost })
          },

          setTokenLimit: (limit: number) => {
            const tokenUsage = { ...get().tokenUsage, limit }
            set({ tokenUsage }, false, 'setTokenLimit')
            
            console.log('📊 Token limit updated:', { limit })
          },

          upgradeSubscription: (plan: 'free' | 'pro' | 'enterprise') => {
            const planLimits = {
              free: 10000,
              pro: 100000,
              enterprise: 1000000
            }
            
            const tokenUsage = { 
              ...get().tokenUsage, 
              plan, 
              limit: planLimits[plan]
            }
            
            const subscriptionStatus = plan === 'free' ? 'inactive' : 'active'
            
            set({ tokenUsage, subscriptionStatus }, false, 'upgradeSubscription')
            
            console.log('⬆️ Subscription upgraded:', { plan, newLimit: planLimits[plan] })
          },

          updateBillingInfo: (info: Partial<UIState['billingInfo']>) => {
            const billingInfo = { ...get().billingInfo, ...info }
            set({ billingInfo }, false, 'updateBillingInfo')
            
            console.log('💰 Billing info updated:', info)
          },

          addTokens: (amount: number) => {
            const tokenUsage = { 
              ...get().tokenUsage, 
              limit: get().tokenUsage.limit + amount 
            }
            set({ tokenUsage }, false, 'addTokens')
            
            console.log('➕ Tokens added:', { amount, newLimit: tokenUsage.limit })
          },

          resetTokenUsage: () => {
            const tokenUsage = {
              used: 0,
              limit: get().tokenUsage.plan === 'free' ? 10000 : get().tokenUsage.limit,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              plan: get().tokenUsage.plan,
              estimatedCost: 0
            }
            set({ tokenUsage }, false, 'resetTokenUsage')
            
            console.log('🔄 Token usage reset for new period')
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
export const useTokenUsage = () => useMaturaStore(state => state.tokenUsage)
export const useSubscriptionStatus = () => useMaturaStore(state => state.subscriptionStatus)
export const useBillingInfo = () => useMaturaStore(state => state.billingInfo)

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

/**
 * トークン管理用カスタムフック
 */
export const useTokenManager = () => {
  const {
    tokenUsage,
    subscriptionStatus,
    billingInfo,
    updateTokenUsage,
    setTokenLimit,
    upgradeSubscription,
    updateBillingInfo,
    addTokens,
    resetTokenUsage
  } = useMaturaStore()

  const usagePercentage = (tokenUsage.used / tokenUsage.limit) * 100
  const remainingTokens = tokenUsage.limit - tokenUsage.used

  return {
    tokenUsage,
    subscriptionStatus,
    billingInfo,
    usagePercentage,
    remainingTokens,
    updateTokenUsage,
    setTokenLimit,
    upgradeSubscription,
    updateBillingInfo,
    addTokens,
    resetTokenUsage,
    isLowOnTokens: () => usagePercentage >= 75,
    isCriticallyLowOnTokens: () => usagePercentage >= 90,
    canGenerate: () => remainingTokens > 100, // 最低100トークン必要と仮定
    estimateTokensNeeded: (complexity: 'simple' | 'medium' | 'complex') => {
      const estimates = {
        simple: 500,
        medium: 1500,
        complex: 3000
      }
      return estimates[complexity]
    },
    getRecommendedAction: () => {
      if (usagePercentage >= 90) {
        return tokenUsage.plan === 'free' ? 'upgrade' : 'buyTokens'
      }
      if (usagePercentage >= 75 && tokenUsage.plan === 'free') {
        return 'considerUpgrade'
      }
      return null
    }
  }
}

export default useMaturaStore

// ===== CRUD機能追加 =====

import type { HotelBooking, TaskItem, RecipeItem, InventoryItem, BlogPost } from './supabase'

// Universal app store interface
interface BaseAppState<T> {
  items: T[]
  loading: boolean
  error: string | null
  selectedItem: T | null
  
  // Actions
  setItems: (items: T[]) => void
  addItem: (item: T) => void
  updateItem: (id: string, updates: Partial<T>) => void
  deleteItem: (id: string) => void
  setSelectedItem: (item: T | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

// Hotel booking store
interface HotelBookingStore extends BaseAppState<HotelBooking> {
  // Hotel-specific actions
  filterByStatus: (status: HotelBooking['status']) => HotelBooking[]
  getTotalRevenue: () => number
  getBookingsByDateRange: (startDate: string, endDate: string) => HotelBooking[]
}

export const useHotelBookingStore = create<HotelBookingStore>()(
  devtools(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      selectedItem: null,

      setItems: (items) => set({ items }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
        )
      })),
      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      setSelectedItem: (item) => set({ selectedItem: item }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Hotel-specific methods
      filterByStatus: (status) => get().items.filter(booking => booking.status === status),
      getTotalRevenue: () => get().items
        .filter(booking => booking.status === 'confirmed')
        .reduce((total, booking) => total + booking.total_price, 0),
      getBookingsByDateRange: (startDate, endDate) => get().items.filter(booking => 
        booking.check_in >= startDate && booking.check_out <= endDate
      )
    }),
    { name: 'hotel-booking-store' }
  )
)

// Task management store
interface TaskStore extends BaseAppState<TaskItem> {
  filter: 'all' | 'pending' | 'completed'
  sortBy: 'created_at' | 'due_date' | 'priority'
  
  setFilter: (filter: TaskStore['filter']) => void
  setSortBy: (sortBy: TaskStore['sortBy']) => void
  getFilteredTasks: () => TaskItem[]
  toggleTaskComplete: (id: string) => void
  getTasksByPriority: (priority: TaskItem['priority']) => TaskItem[]
}

export const useTaskStore = create<TaskStore>()(
  devtools(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      selectedItem: null,
      filter: 'all',
      sortBy: 'created_at',

      setItems: (items) => set({ items }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
        )
      })),
      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      setSelectedItem: (item) => set({ selectedItem: item }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      setFilter: (filter) => set({ filter }),
      setSortBy: (sortBy) => set({ sortBy }),
      
      getFilteredTasks: () => {
        const { items, filter, sortBy } = get()
        let filtered = items
        
        if (filter === 'pending') filtered = items.filter(task => !task.completed)
        if (filter === 'completed') filtered = items.filter(task => task.completed)
        
        return filtered.sort((a, b) => {
          if (sortBy === 'due_date' && a.due_date && b.due_date) {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          }
          if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
      },
      
      toggleTaskComplete: (id) => set((state) => ({
        items: state.items.map(task => 
          task.id === id ? { ...task, completed: !task.completed, updated_at: new Date().toISOString() } : task
        )
      })),
      
      getTasksByPriority: (priority) => get().items.filter(task => task.priority === priority)
    }),
    { name: 'task-store' }
  )
)

// Recipe management store
interface RecipeStore extends BaseAppState<RecipeItem> {
  searchTerm: string
  categoryFilter: string
  
  setSearchTerm: (term: string) => void
  setCategoryFilter: (category: string) => void
  getFilteredRecipes: () => RecipeItem[]
  getRecipesByCategory: (category: string) => RecipeItem[]
}

export const useRecipeStore = create<RecipeStore>()(
  devtools(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      selectedItem: null,
      searchTerm: '',
      categoryFilter: '',

      setItems: (items) => set({ items }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
        )
      })),
      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      setSelectedItem: (item) => set({ selectedItem: item }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      setSearchTerm: (term) => set({ searchTerm: term }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      
      getFilteredRecipes: () => {
        const { items, searchTerm, categoryFilter } = get()
        return items.filter(recipe => {
          const matchesSearch = !searchTerm || 
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesCategory = !categoryFilter || recipe.category === categoryFilter
          return matchesSearch && matchesCategory
        })
      },
      
      getRecipesByCategory: (category) => get().items.filter(recipe => recipe.category === category)
    }),
    { name: 'recipe-store' }
  )
)

// App metadata store for managing current app context
interface AppMetadataStore {
  currentAppId: string | null
  currentAppType: string | null
  currentAppMetadata: any | null
  
  setCurrentApp: (appId: string, appType: string, metadata?: any) => void
  clearCurrentApp: () => void
}

export const useAppMetadataStore = create<AppMetadataStore>()(
  devtools(
    (set) => ({
      currentAppId: null,
      currentAppType: null,
      currentAppMetadata: null,

      setCurrentApp: (appId, appType, metadata) => set({
        currentAppId: appId,
        currentAppType: appType,
        currentAppMetadata: metadata
      }),
      
      clearCurrentApp: () => set({
        currentAppId: null,
        currentAppType: null,
        currentAppMetadata: null
      })
    }),
    { name: 'app-metadata-store' }
  )
)