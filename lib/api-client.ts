/**
 * API Client Service
 * クライアントサイドAPIコール統合サービス
 */

// API レスポンス型定義
export interface ApiResponse<T = any> {
  success: boolean
  data: T | null
  error?: string
  timestamp?: string
}

export interface GenerationStatus {
  id: string
  status: 'idle' | 'generating' | 'completed' | 'error'
  progress: number
  startedAt: string | null
  completedAt: string | null
  currentPhase: string | null
  totalPhases: number
  generatedFiles: string[]
  errors: string[]
  warnings: string[]
  estimatedTimeRemaining: number | null
}

export interface GenerationResults {
  projectInfo: {
    id: string
    name: string
    description: string
    createdAt: string
    version: string
  }
  metrics: {
    totalFiles: number
    totalLines: number
    componentsGenerated: number
    pagesGenerated: number
    apiRoutesGenerated: number
    testsGenerated: number
    codeQuality: Record<string, any>
    buildStats: Record<string, any>
  }
  generatedFiles: Array<{
    path: string
    type: string
    size: number
    description: string
  }>
  techStack: Record<string, any>
  recommendations: Array<{
    type: string
    priority: string
    title: string
    description: string
    implementation: string
  }>
}

export interface AppSettings {
  user: Record<string, any>
  generation: Record<string, any>
  project: Record<string, any>
  advanced: Record<string, any>
  metadata: {
    lastUpdated: string
    version: string
    configId: string
  }
}

/**
 * API Client クラス
 */
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  /**
   * 汎用APIコール関数
   */
  private async apiCall<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      console.log(`📡 [API Client] Calling ${endpoint}`)
      
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error(`❌ [API Client] Error ${response.status}:`, data.error)
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      console.log(`✅ [API Client] Success ${endpoint}`)
      return data
    } catch (error) {
      console.error(`💥 [API Client] Failed ${endpoint}:`, error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // ===== Generation Status API =====

  /**
   * 生成ステータス取得
   */
  async getGenerationStatus(): Promise<ApiResponse<GenerationStatus>> {
    return this.apiCall<GenerationStatus>('/generation/status')
  }

  /**
   * 生成開始
   */
  async startGeneration(): Promise<ApiResponse<GenerationStatus>> {
    return this.apiCall<GenerationStatus>('/generation/status', {
      method: 'POST',
      body: JSON.stringify({
        action: 'start',
        data: {}
      })
    })
  }

  /**
   * 生成進行状況更新
   */
  async updateGenerationProgress(progress: number): Promise<ApiResponse<GenerationStatus>> {
    return this.apiCall<GenerationStatus>('/generation/status', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update_progress',
        data: { progress }
      })
    })
  }

  /**
   * 生成完了
   */
  async completeGeneration(): Promise<ApiResponse<GenerationStatus>> {
    return this.apiCall<GenerationStatus>('/generation/status', {
      method: 'POST',
      body: JSON.stringify({
        action: 'complete',
        data: {}
      })
    })
  }

  /**
   * 生成リセット
   */
  async resetGeneration(): Promise<ApiResponse<GenerationStatus>> {
    return this.apiCall<GenerationStatus>('/generation/status', {
      method: 'POST',
      body: JSON.stringify({
        action: 'reset',
        data: {}
      })
    })
  }

  // ===== Generation Results API =====

  /**
   * 生成結果取得
   */
  async getGenerationResults(
    format: 'full' | 'summary' | 'metrics' = 'full',
    includeFiles = true,
    includeMetrics = true
  ): Promise<ApiResponse<GenerationResults>> {
    const params = new URLSearchParams({
      format,
      files: includeFiles.toString(),
      metrics: includeMetrics.toString()
    })

    return this.apiCall<GenerationResults>(`/generation/results?${params}`)
  }

  /**
   * 結果エクスポート
   */
  async exportResults(format: 'json' | 'pdf' | 'xlsx' = 'json'): Promise<ApiResponse<any>> {
    return this.apiCall('/generation/results', {
      method: 'POST',
      body: JSON.stringify({
        action: 'export',
        data: { format }
      })
    })
  }

  /**
   * 追加分析実行
   */
  async analyzeResults(): Promise<ApiResponse<any>> {
    return this.apiCall('/generation/results', {
      method: 'POST',
      body: JSON.stringify({
        action: 'analyze',
        data: {}
      })
    })
  }

  // ===== Settings API =====

  /**
   * 設定取得
   */
  async getSettings(
    category?: 'user' | 'generation' | 'project' | 'advanced',
    keys?: string[]
  ): Promise<ApiResponse<AppSettings>> {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (keys) params.set('keys', keys.join(','))

    const queryString = params.toString()
    const endpoint = queryString ? `/settings?${queryString}` : '/settings'

    return this.apiCall<AppSettings>(endpoint)
  }

  /**
   * 設定更新
   */
  async updateSettings(
    settings: Partial<AppSettings>,
    category?: string
  ): Promise<ApiResponse<any>> {
    return this.apiCall('/settings', {
      method: 'PUT',
      body: JSON.stringify({
        category,
        settings
      })
    })
  }

  /**
   * 設定リセット
   */
  async resetSettings(category?: string): Promise<ApiResponse<any>> {
    return this.apiCall('/settings', {
      method: 'POST',
      body: JSON.stringify({
        action: 'reset',
        data: { category }
      })
    })
  }

  /**
   * 設定バックアップ
   */
  async backupSettings(): Promise<ApiResponse<any>> {
    return this.apiCall('/settings', {
      method: 'POST',
      body: JSON.stringify({
        action: 'backup',
        data: {}
      })
    })
  }

  /**
   * 設定検証
   */
  async validateSettings(): Promise<ApiResponse<any>> {
    return this.apiCall('/settings', {
      method: 'POST',
      body: JSON.stringify({
        action: 'validate',
        data: {}
      })
    })
  }
}

/**
 * デフォルトAPI Clientインスタンス
 */
export const apiClient = new ApiClient()

/**
 * API統合関数 - Zustand storeと連携
 */
export const apiIntegration = {
  /**
   * 生成開始（API + Store更新）
   */
  async startGeneration(
    updateStore: (updates: any) => void
  ): Promise<boolean> {
    try {
      console.log('🚀 [API Integration] Starting generation with API call...')
      
      // API call
      const response = await apiClient.startGeneration()
      
      if (response.success && response.data) {
        // Store更新
        updateStore({
          isGenerating: true,
          isComplete: false,
          generationProgress: response.data.progress,
          apiCallCount: (prev: number) => prev + 1
        })
        
        console.log('✅ [API Integration] Generation started successfully')
        return true
      } else {
        console.error('❌ [API Integration] Failed to start generation:', response.error)
        return false
      }
    } catch (error) {
      console.error('💥 [API Integration] Error starting generation:', error)
      return false
    }
  },

  /**
   * 進行状況更新（API + Store更新）
   */
  async updateProgress(
    progress: number,
    updateStore: (updates: any) => void
  ): Promise<boolean> {
    try {
      console.log(`📊 [API Integration] Updating progress to ${progress}%...`)
      
      // API call
      const response = await apiClient.updateGenerationProgress(progress)
      
      if (response.success && response.data) {
        // Store更新
        updateStore({
          generationProgress: response.data.progress,
          apiCallCount: (prev: number) => prev + 1
        })
        
        console.log(`✅ [API Integration] Progress updated to ${response.data.progress}%`)
        return true
      } else {
        console.error('❌ [API Integration] Failed to update progress:', response.error)
        return false
      }
    } catch (error) {
      console.error('💥 [API Integration] Error updating progress:', error)
      return false
    }
  },

  /**
   * 生成完了（API + Store更新）
   */
  async completeGeneration(
    updateStore: (updates: any) => void
  ): Promise<boolean> {
    try {
      console.log('🎉 [API Integration] Completing generation with API call...')
      
      // API call
      const response = await apiClient.completeGeneration()
      
      if (response.success && response.data) {
        // Store更新
        updateStore({
          isGenerating: false,
          isComplete: true,
          generationProgress: 100,
          apiCallCount: (prev: number) => prev + 1
        })
        
        console.log('✅ [API Integration] Generation completed successfully')
        return true
      } else {
        console.error('❌ [API Integration] Failed to complete generation:', response.error)
        return false
      }
    } catch (error) {
      console.error('💥 [API Integration] Error completing generation:', error)
      return false
    }
  },

  /**
   * 設定取得（API + Store更新）
   */
  async loadSettings(
    updateStore: (updates: any) => void
  ): Promise<boolean> {
    try {
      console.log('⚙️ [API Integration] Loading settings from API...')
      
      // API call
      const response = await apiClient.getSettings()
      
      if (response.success && response.data) {
        // Store更新（設定に応じて）
        const settings = response.data
        if (settings.generation?.geminiApi?.enabled) {
          updateStore({
            isGeminiEnabled: true,
            apiCallCount: (prev: number) => prev + 1
          })
        }
        
        console.log('✅ [API Integration] Settings loaded successfully')
        return true
      } else {
        console.error('❌ [API Integration] Failed to load settings:', response.error)
        return false
      }
    } catch (error) {
      console.error('💥 [API Integration] Error loading settings:', error)
      return false
    }
  }
}

export default apiClient