import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSmartQuery, useGeneratedAppsQuery } from '@/hooks/useSmartQuery'
import React from 'react'

// Mock fetch
global.fetch = jest.fn()

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  })
}

const createWrapper = () => {
  const queryClient = createTestQueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Mock document for user activity detection
Object.defineProperty(document, 'addEventListener', {
  value: jest.fn(),
  writable: true,
})

Object.defineProperty(document, 'removeEventListener', {
  value: jest.fn(),
  writable: true,
})

describe('useSmartQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock successful API response
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    })
  })

  it('should initialize with correct default options', () => {
    const { result } = renderHook(
      () => useSmartQuery(['test'], () => Promise.resolve('test')),
      { wrapper: createWrapper() }
    )

    expect(result.current.status).toBe('success')
  })

  it('should handle refetch interval based on smart settings', async () => {
    const mockQueryFn = jest.fn().mockResolvedValue('test')
    
    const { result } = renderHook(
      () => useSmartQuery(['test'], mockQueryFn, {
        smartRefetch: {
          activeInterval: 1000,
          normalInterval: 5000,
        },
      }),
      { wrapper: createWrapper() }
    )

    expect(result.current.status).toBe('success')
  })

  it('should handle conditional refetch', () => {
    const mockQueryFn = jest.fn().mockResolvedValue('test')
    
    const { result } = renderHook(
      () => useSmartQuery(['test'], mockQueryFn, {
        conditionalRefetch: {
          onlyWhenActive: true,
          condition: () => true,
        },
      }),
      { wrapper: createWrapper() }
    )

    expect(result.current.status).toBe('success')
  })
})

describe('useGeneratedAppsQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch generated apps successfully', async () => {
    const mockApps = [
      { id: '1', name: 'Test App 1', created_at: new Date().toISOString() },
      { id: '2', name: 'Test App 2', created_at: new Date().toISOString() },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApps),
    })

    const { result } = renderHook(() => useGeneratedAppsQuery(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.status).toBe('success')
    expect(result.current.data).toEqual(mockApps)
  })

  it('should handle API error gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useGeneratedAppsQuery(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toBeTruthy()
  })

  it('should handle apps with missing created_at gracefully', async () => {
    const mockApps = [
      { id: '1', name: 'Test App 1' }, // missing created_at
      { id: '2', name: 'Test App 2', created_at: new Date().toISOString() },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApps),
    })

    const { result } = renderHook(() => useGeneratedAppsQuery(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.status).toBe('success')
    expect(result.current.data).toEqual(mockApps)
  })
})