import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SimpleGenerator } from '@/components/SimpleGenerator'

// Mock the hooks
jest.mock('@/hooks/useSmartQuery', () => ({
  useGeneratedAppsQuery: () => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}))

jest.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleError: jest.fn(),
  }),
}))

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

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('SimpleGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the generator form', () => {
    renderWithQueryClient(<SimpleGenerator />)
    
    expect(screen.getByText('アプリを作成')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('どんなアプリを作りたいですか？')).toBeInTheDocument()
    expect(screen.getByText('アプリ生成')).toBeInTheDocument()
  })

  it('allows user to enter app idea', () => {
    renderWithQueryClient(<SimpleGenerator />)
    
    const textArea = screen.getByPlaceholderText('どんなアプリを作りたいですか？')
    fireEvent.change(textArea, { target: { value: 'タスク管理アプリ' } })
    
    expect(textArea).toHaveValue('タスク管理アプリ')
  })

  it('disables submit button when input is empty', () => {
    renderWithQueryClient(<SimpleGenerator />)
    
    const submitButton = screen.getByText('アプリ生成')
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when input has content', () => {
    renderWithQueryClient(<SimpleGenerator />)
    
    const textArea = screen.getByPlaceholderText('どんなアプリを作りたいですか？')
    const submitButton = screen.getByText('アプリ生成')
    
    fireEvent.change(textArea, { target: { value: 'タスク管理アプリ' } })
    
    expect(submitButton).not.toBeDisabled()
  })

  it('shows loading state during generation', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, app: { id: '123' } }),
    })
    global.fetch = mockFetch

    renderWithQueryClient(<SimpleGenerator />)
    
    const textArea = screen.getByPlaceholderText('どんなアプリを作りたいですか？')
    const submitButton = screen.getByText('アプリ生成')
    
    fireEvent.change(textArea, { target: { value: 'タスク管理アプリ' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('生成中...')).toBeInTheDocument()
    })
  })

  it('handles generation error gracefully', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('API Error'))
    global.fetch = mockFetch

    renderWithQueryClient(<SimpleGenerator />)
    
    const textArea = screen.getByPlaceholderText('どんなアプリを作りたいですか？')
    const submitButton = screen.getByText('アプリ生成')
    
    fireEvent.change(textArea, { target: { value: 'タスク管理アプリ' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('アプリ生成')).toBeInTheDocument()
    })
  })

  it('displays recent apps section', () => {
    renderWithQueryClient(<SimpleGenerator />)
    
    expect(screen.getByText('最近のアプリ')).toBeInTheDocument()
  })
})