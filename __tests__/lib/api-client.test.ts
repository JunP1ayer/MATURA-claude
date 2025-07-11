/**
 * API Client Tests
 */

import { ApiClient, apiIntegration } from '@/lib/api-client'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ApiClient', () => {
  let apiClient: ApiClient

  beforeEach(() => {
    apiClient = new ApiClient()
    mockFetch.mockClear()
  })

  describe('Generation Status API', () => {
    test('getGenerationStatus calls correct endpoint', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            id: 'gen_123',
            status: 'idle',
            progress: 0
          }
        })
      })

      const result = await apiClient.getGenerationStatus()

      expect(mockFetch).toHaveBeenCalledWith('/api/generation/status', {
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result.success).toBe(true)
      expect(result.data?.status).toBe('idle')
    })

    test('startGeneration sends correct payload', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            status: 'generating',
            progress: 0
          }
        })
      })

      const result = await apiClient.startGeneration()

      expect(mockFetch).toHaveBeenCalledWith('/api/generation/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          data: {}
        })
      })
      expect(result.success).toBe(true)
    })

    test('updateGenerationProgress sends correct progress value', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { progress: 50 }
        })
      })

      const result = await apiClient.updateGenerationProgress(50)

      expect(mockFetch).toHaveBeenCalledWith('/api/generation/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_progress',
          data: { progress: 50 }
        })
      })
      expect(result.success).toBe(true)
    })

    test('completeGeneration sends complete action', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            status: 'completed',
            progress: 100
          }
        })
      })

      const result = await apiClient.completeGeneration()

      expect(mockFetch).toHaveBeenCalledWith('/api/generation/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          data: {}
        })
      })
      expect(result.success).toBe(true)
    })

    test('resetGeneration sends reset action', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            status: 'idle',
            progress: 0
          }
        })
      })

      const result = await apiClient.resetGeneration()

      expect(mockFetch).toHaveBeenCalledWith('/api/generation/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset',
          data: {}
        })
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Generation Results API', () => {
    test('getGenerationResults with default parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            projectInfo: { name: 'Test Project' },
            metrics: { totalFiles: 10 }
          }
        })
      })

      const result = await apiClient.getGenerationResults()

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/generation/results?format=full&files=true&metrics=true',
        { headers: { 'Content-Type': 'application/json' } }
      )
      expect(result.success).toBe(true)
    })

    test('getGenerationResults with custom parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} })
      })

      await apiClient.getGenerationResults('summary', false, false)

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/generation/results?format=summary&files=false&metrics=false',
        { headers: { 'Content-Type': 'application/json' } }
      )
    })

    test('exportResults sends correct format', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            exportId: 'export_123',
            format: 'pdf'
          }
        })
      })

      const result = await apiClient.exportResults('pdf')

      expect(mockFetch).toHaveBeenCalledWith('/api/generation/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          data: { format: 'pdf' }
        })
      })
      expect(result.success).toBe(true)
    })

    test('analyzeResults sends analyze action', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            complexity: { maintainabilityIndex: 87 }
          }
        })
      })

      const result = await apiClient.analyzeResults()

      expect(mockFetch).toHaveBeenCalledWith('/api/generation/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          data: {}
        })
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Settings API', () => {
    test('getSettings without parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            user: { name: 'Test User' },
            generation: { defaultPattern: 'pattern-a' }
          }
        })
      })

      const result = await apiClient.getSettings()

      expect(mockFetch).toHaveBeenCalledWith('/api/settings', {
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result.success).toBe(true)
    })

    test('getSettings with category filter', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} })
      })

      await apiClient.getSettings('user')

      expect(mockFetch).toHaveBeenCalledWith('/api/settings?category=user', {
        headers: { 'Content-Type': 'application/json' }
      })
    })

    test('updateSettings sends correct payload', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { settings: {}, validation: { valid: true } }
        })
      })

      const settings = { generation: { geminiApi: { enabled: true } } }
      const result = await apiClient.updateSettings(settings, 'generation')

      expect(mockFetch).toHaveBeenCalledWith('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'generation',
          settings
        })
      })
      expect(result.success).toBe(true)
    })

    test('resetSettings sends reset action', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} })
      })

      await apiClient.resetSettings('user')

      expect(mockFetch).toHaveBeenCalledWith('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset',
          data: { category: 'user' }
        })
      })
    })
  })

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await apiClient.getGenerationStatus()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
      expect(result.data).toBe(null)
    })

    test('handles HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({
          error: 'Internal server error'
        })
      })

      const result = await apiClient.getGenerationStatus()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Internal server error')
    })

    test('handles JSON parsing errors', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      })

      const result = await apiClient.getGenerationStatus()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid JSON')
    })
  })
})

describe('API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  test('startGeneration integration calls updateStore', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { status: 'generating', progress: 0 }
      })
    })

    const mockUpdateStore = jest.fn()
    const result = await apiIntegration.startGeneration(mockUpdateStore)

    expect(result).toBe(true)
    expect(mockUpdateStore).toHaveBeenCalledWith({
      isGenerating: true,
      isComplete: false,
      generationProgress: 0,
      apiCallCount: expect.any(Function)
    })
  })

  test('updateProgress integration calls updateStore', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { progress: 50 }
      })
    })

    const mockUpdateStore = jest.fn()
    const result = await apiIntegration.updateProgress(50, mockUpdateStore)

    expect(result).toBe(true)
    expect(mockUpdateStore).toHaveBeenCalledWith({
      generationProgress: 50,
      apiCallCount: expect.any(Function)
    })
  })

  test('completeGeneration integration calls updateStore', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { status: 'completed', progress: 100 }
      })
    })

    const mockUpdateStore = jest.fn()
    const result = await apiIntegration.completeGeneration(mockUpdateStore)

    expect(result).toBe(true)
    expect(mockUpdateStore).toHaveBeenCalledWith({
      isGenerating: false,
      isComplete: true,
      generationProgress: 100,
      apiCallCount: expect.any(Function)
    })
  })

  test('loadSettings integration handles Gemini settings', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          generation: {
            geminiApi: { enabled: true }
          }
        }
      })
    })

    const mockUpdateStore = jest.fn()
    const result = await apiIntegration.loadSettings(mockUpdateStore)

    expect(result).toBe(true)
    expect(mockUpdateStore).toHaveBeenCalledWith({
      isGeminiEnabled: true,
      apiCallCount: expect.any(Function)
    })
  })

  test('integration error handling returns false', async () => {
    mockFetch.mockRejectedValue(new Error('API error'))

    const mockUpdateStore = jest.fn()
    const result = await apiIntegration.startGeneration(mockUpdateStore)

    expect(result).toBe(false)
    expect(mockUpdateStore).not.toHaveBeenCalled()
  })
})