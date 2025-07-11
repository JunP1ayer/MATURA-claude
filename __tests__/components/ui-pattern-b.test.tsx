/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import UIPatternB from '@/app/ui-pattern-b/page'

// Mock the Zustand store
jest.mock('@/lib/store', () => ({
  useMaturaStore: () => ({
    isGenerating: false,
    isComplete: false,
    generationProgress: 0,
    isDarkMode: false,
    isGeminiEnabled: false,
    apiCallCount: 0,
    toggleGenerating: jest.fn(),
    toggleComplete: jest.fn(),
    toggleDarkMode: jest.fn(),
    toggleGemini: jest.fn(),
    incrementApiCall: jest.fn(),
    setGenerationProgress: jest.fn(),
    resetAllState: jest.fn()
  }),
  useGenerationControl: () => ({
    startGeneration: jest.fn(),
    completeGeneration: jest.fn()
  }),
  usePatternToggle: () => ({
    selectPattern: jest.fn()
  })
}))

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    getGenerationResults: jest.fn(() => Promise.resolve({ 
      success: true, 
      data: { projectInfo: { name: 'Test Project' } } 
    })),
    analyzeResults: jest.fn(() => Promise.resolve({ 
      success: true, 
      data: { performance: { score: 85 } } 
    }))
  },
  apiIntegration: {
    startGeneration: jest.fn(() => Promise.resolve(true)),
    updateProgress: jest.fn(() => Promise.resolve(true)),
    completeGeneration: jest.fn(() => Promise.resolve(true))
  }
}))

describe('UI Pattern B Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders main heading with MATURA branding', () => {
    render(<UIPatternB />)
    expect(screen.getByText('MATURA')).toBeInTheDocument()
    expect(screen.getByText(/開発を革新する/)).toBeInTheDocument()
  })

  test('renders clean minimalist design elements', () => {
    render(<UIPatternB />)
    expect(screen.getByText('次世代開発プラットフォーム')).toBeInTheDocument()
    expect(screen.getByText(/AI駆動の自律型コード生成で/)).toBeInTheDocument()
  })

  test('renders CTA buttons with proper text', () => {
    render(<UIPatternB />)
    expect(screen.getByText('今すぐ始める')).toBeInTheDocument()
    expect(screen.getByText('デモを見る')).toBeInTheDocument()
  })

  test('renders statistics section', () => {
    render(<UIPatternB />)
    expect(screen.getByText('15秒')).toBeInTheDocument()
    expect(screen.getByText('最速生成時間')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('型安全性')).toBeInTheDocument()
    expect(screen.getByText('8時間')).toBeInTheDocument()
    expect(screen.getByText('完全アプリ生成')).toBeInTheDocument()
  })

  test('renders all 6 feature cards', () => {
    render(<UIPatternB />)
    expect(screen.getByText('AI駆動生成')).toBeInTheDocument()
    expect(screen.getByText('自動品質管理')).toBeInTheDocument()
    expect(screen.getByText('状態管理統合')).toBeInTheDocument()
    expect(screen.getByText('即座デプロイ')).toBeInTheDocument()
    expect(screen.getByText('モダンスタック')).toBeInTheDocument()
    expect(screen.getByText('チーム対応')).toBeInTheDocument()
  })

  test('renders process section', () => {
    render(<UIPatternB />)
    expect(screen.getByText('簡単3ステップ')).toBeInTheDocument()
    expect(screen.getByText('要件入力')).toBeInTheDocument()
    expect(screen.getByText('AI生成')).toBeInTheDocument()
    expect(screen.getByText('即座デプロイ')).toBeInTheDocument()
  })

  test('renders final CTA with MATURA branding', () => {
    render(<UIPatternB />)
    expect(screen.getByText(/今すぐMATURAを体験/)).toBeInTheDocument()
    expect(screen.getByText('無料で開始')).toBeInTheDocument()
    expect(screen.getByText('詳細を見る')).toBeInTheDocument()
  })

  test('start generation button triggers API call', async () => {
    const { apiIntegration } = require('@/lib/api-client')
    render(<UIPatternB />)
    
    const startButton = screen.getByText('今すぐ始める')
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(apiIntegration.startGeneration).toHaveBeenCalled()
    })
  })

  test('demo button triggers API call', async () => {
    const { apiClient } = require('@/lib/api-client')
    render(<UIPatternB />)
    
    const demoButton = screen.getByText('デモを見る')
    fireEvent.click(demoButton)

    await waitFor(() => {
      expect(apiClient.getGenerationResults).toHaveBeenCalledWith('summary', false, true)
    })
  })

  test('feature cards are clickable and trigger API calls', async () => {
    const { apiIntegration } = require('@/lib/api-client')
    render(<UIPatternB />)
    
    const aiCard = screen.getByText('AI駆動生成').closest('.cursor-pointer')
    if (aiCard) {
      fireEvent.click(aiCard)

      await waitFor(() => {
        expect(apiIntegration.updateProgress).toHaveBeenCalledWith(20, expect.any(Function))
      })
    }
  })

  test('quality feature card triggers 40% progress', async () => {
    const { apiIntegration } = require('@/lib/api-client')
    render(<UIPatternB />)
    
    const qualityCard = screen.getByText('自動品質管理').closest('.cursor-pointer')
    if (qualityCard) {
      fireEvent.click(qualityCard)

      await waitFor(() => {
        expect(apiIntegration.updateProgress).toHaveBeenCalledWith(40, expect.any(Function))
      })
    }
  })

  test('final CTA buttons functionality', async () => {
    const { apiIntegration, apiClient } = require('@/lib/api-client')
    render(<UIPatternB />)
    
    // Test final start button
    const finalStartButton = screen.getAllByText('無料で開始')[0]
    fireEvent.click(finalStartButton)

    await waitFor(() => {
      expect(apiIntegration.startGeneration).toHaveBeenCalled()
    })

    // Test pricing button
    const pricingButton = screen.getByText('詳細を見る')
    fireEvent.click(pricingButton)

    await waitFor(() => {
      expect(apiClient.analyzeResults).toHaveBeenCalled()
    })
  })

  test('console logging for Pattern B interactions', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    render(<UIPatternB />)
    
    const startButton = screen.getByText('今すぐ始める')
    fireEvent.click(startButton)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Pattern B] Starting generation process with API...')
    )

    consoleSpy.mockRestore()
  })

  test('state display panel with active generation', () => {
    // Mock store with active state
    const mockStore = {
      isGenerating: true,
      isComplete: false,
      generationProgress: 75,
      isDarkMode: false,
      isGeminiEnabled: false,
      apiCallCount: 3,
      toggleGenerating: jest.fn(),
      toggleComplete: jest.fn(),
      toggleDarkMode: jest.fn(),
      toggleGemini: jest.fn(),
      incrementApiCall: jest.fn(),
      setGenerationProgress: jest.fn(),
      resetAllState: jest.fn()
    }

    jest.doMock('@/lib/store', () => ({
      useMaturaStore: () => mockStore,
      useGenerationControl: () => ({
        startGeneration: jest.fn(),
        completeGeneration: jest.fn()
      }),
      usePatternToggle: () => ({
        selectPattern: jest.fn()
      })
    }))

    render(<UIPatternB />)
    expect(screen.getByText('生成状態:')).toBeInTheDocument()
    expect(screen.getByText('実行中')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  test('tech stack information display', () => {
    render(<UIPatternB />)
    expect(screen.getByText('Next.js 14 App Router')).toBeInTheDocument()
    expect(screen.getByText('TypeScript完全対応')).toBeInTheDocument()
    expect(screen.getByText('shadcn/ui + Tailwind')).toBeInTheDocument()
  })

  test('clean design styling classes', () => {
    render(<UIPatternB />)
    
    // Check for clean background
    const container = screen.getByText('MATURA').closest('div')
    expect(container).toHaveClass('bg-gray-50')

    // Check for white card backgrounds
    const cards = screen.getAllByText('AI駆動生成')[0].closest('.bg-white')
    expect(cards).toHaveClass('bg-white', 'border-gray-200')
  })

  test('responsive layout classes', () => {
    render(<UIPatternB />)
    
    // Check responsive grid
    const featureGrid = screen.getByText('AI駆動生成').closest('.grid')
    expect(featureGrid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')

    // Check responsive text
    const heading = screen.getByText('MATURA')
    expect(heading.parentElement).toHaveClass('text-5xl', 'md:text-6xl')
  })
})