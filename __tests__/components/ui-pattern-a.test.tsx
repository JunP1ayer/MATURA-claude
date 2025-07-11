/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import UIPatternA from '@/app/ui-pattern-a/page'

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
    updateSettings: jest.fn(() => Promise.resolve({ success: true })),
    analyzeResults: jest.fn(() => Promise.resolve({ 
      success: true, 
      data: { performance: { score: 85 } } 
    })),
    resetGeneration: jest.fn(() => Promise.resolve({ success: true }))
  },
  apiIntegration: {
    startGeneration: jest.fn(() => Promise.resolve(true)),
    updateProgress: jest.fn(() => Promise.resolve(true)),
    completeGeneration: jest.fn(() => Promise.resolve(true))
  }
}))

describe('UI Pattern A Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders main heading', () => {
    render(<UIPatternA />)
    expect(screen.getByText('MATURA')).toBeInTheDocument()
    expect(screen.getByText('Code Generation')).toBeInTheDocument()
  })

  test('renders hero section with subtitle', () => {
    render(<UIPatternA />)
    expect(screen.getByText(/15秒から8時間で完璧なアプリケーションを生成する/)).toBeInTheDocument()
    expect(screen.getByText('次世代自律型')).toBeInTheDocument()
  })

  test('renders CTA buttons', () => {
    render(<UIPatternA />)
    expect(screen.getByText('今すぐ開始')).toBeInTheDocument()
    expect(screen.getByText('デモを見る')).toBeInTheDocument()
  })

  test('renders feature cards', () => {
    render(<UIPatternA />)
    expect(screen.getByText('超高速生成')).toBeInTheDocument()
    expect(screen.getByText('品質保証')).toBeInTheDocument()
    expect(screen.getByText('即座デプロイ')).toBeInTheDocument()
  })

  test('renders final CTA section', () => {
    render(<UIPatternA />)
    expect(screen.getByText(/今すぐ体験してみませんか？/)).toBeInTheDocument()
    expect(screen.getByText('無料で開始')).toBeInTheDocument()
    expect(screen.getByText('料金プランを見る')).toBeInTheDocument()
  })

  test('start generation button functionality', async () => {
    const { apiIntegration } = require('@/lib/api-client')
    render(<UIPatternA />)
    
    const startButton = screen.getByText('今すぐ開始')
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(apiIntegration.startGeneration).toHaveBeenCalled()
    })
  })

  test('demo button functionality', async () => {
    const { apiClient } = require('@/lib/api-client')
    render(<UIPatternA />)
    
    const demoButton = screen.getByText('デモを見る')
    fireEvent.click(demoButton)

    await waitFor(() => {
      expect(apiClient.getGenerationResults).toHaveBeenCalledWith('summary', false, true)
    })
  })

  test('feature card click functionality', async () => {
    const { apiIntegration } = require('@/lib/api-client')
    render(<UIPatternA />)
    
    const speedCard = screen.getByText('超高速生成').closest('.cursor-pointer')
    if (speedCard) {
      fireEvent.click(speedCard)

      await waitFor(() => {
        expect(apiIntegration.updateProgress).toHaveBeenCalledWith(25, expect.any(Function))
      })
    }
  })

  test('pricing button functionality', async () => {
    const { apiClient } = require('@/lib/api-client')
    render(<UIPatternA />)
    
    const pricingButton = screen.getByText('料金プランを見る')
    fireEvent.click(pricingButton)

    await waitFor(() => {
      expect(apiClient.analyzeResults).toHaveBeenCalled()
    })
  })

  test('console logging on interactions', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    render(<UIPatternA />)
    
    const startButton = screen.getByText('今すぐ開始')
    fireEvent.click(startButton)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Pattern A] Starting generation process with API...')
    )

    consoleSpy.mockRestore()
  })

  test('state display panel visibility', () => {
    // Mock store with active state
    const mockStore = {
      isGenerating: true,
      isComplete: false,
      generationProgress: 50,
      isDarkMode: false,
      isGeminiEnabled: true,
      apiCallCount: 5,
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

    render(<UIPatternA />)
    expect(screen.getByText('生成状態:')).toBeInTheDocument()
    expect(screen.getByText('実行中')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  test('accessibility attributes', () => {
    render(<UIPatternA />)
    
    // Check for button roles
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)

    // Check for proper headings
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
  })

  test('responsive design classes', () => {
    render(<UIPatternA />)
    
    // Check for responsive text classes
    const mainHeading = screen.getByText('MATURA')
    expect(mainHeading).toHaveClass('text-6xl', 'md:text-7xl')

    // Check for responsive flex classes
    const ctaSection = screen.getByText('今すぐ開始').parentElement
    expect(ctaSection).toHaveClass('flex-col', 'sm:flex-row')
  })
})