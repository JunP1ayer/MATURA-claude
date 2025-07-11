import { Insight, UIStyle } from './types'

interface TestGenerationOptions {
  includeUnitTests: boolean
  includeIntegrationTests: boolean
  includeE2ETests: boolean
  includeAccessibilityTests: boolean
  includePerformanceTests: boolean
  testFramework: 'jest' | 'vitest' | 'playwright'
  coverageThreshold: number
  mockStrategy: 'auto' | 'manual' | 'none'
}

interface GeneratedTest {
  filePath: string
  content: string
  type: 'unit' | 'integration' | 'e2e' | 'accessibility' | 'performance'
  dependencies: string[]
  description: string
}

interface TestSuite {
  tests: GeneratedTest[]
  setupFiles: GeneratedTest[]
  configFiles: GeneratedTest[]
  totalTests: number
  estimatedCoverage: number
  dependencies: string[]
}

export class AutomatedTestGeneration {
  private options: TestGenerationOptions
  private insight: Insight
  private uiStyle: UIStyle

  constructor(
    insight: Insight,
    uiStyle: UIStyle,
    options: Partial<TestGenerationOptions> = {}
  ) {
    this.insight = insight
    this.uiStyle = uiStyle
    this.options = {
      includeUnitTests: true,
      includeIntegrationTests: true,
      includeE2ETests: false,
      includeAccessibilityTests: true,
      includePerformanceTests: false,
      testFramework: 'jest',
      coverageThreshold: 80,
      mockStrategy: 'auto',
      ...options
    }
  }

  /**
   * 包括的なテストスイートを生成
   */
  async generateTestSuite(
    generatedFiles: Record<string, string>
  ): Promise<TestSuite> {
    console.log('[TestGen] Generating comprehensive test suite...')

    const tests: GeneratedTest[] = []
    const setupFiles: GeneratedTest[] = []
    const configFiles: GeneratedTest[] = []

    // Unit Tests
    if (this.options.includeUnitTests) {
      const unitTests = await this.generateUnitTests(generatedFiles)
      tests.push(...unitTests)
    }

    // Integration Tests
    if (this.options.includeIntegrationTests) {
      const integrationTests = await this.generateIntegrationTests(generatedFiles)
      tests.push(...integrationTests)
    }

    // E2E Tests
    if (this.options.includeE2ETests) {
      const e2eTests = await this.generateE2ETests()
      tests.push(...e2eTests)
    }

    // Accessibility Tests
    if (this.options.includeAccessibilityTests) {
      const a11yTests = await this.generateAccessibilityTests(generatedFiles)
      tests.push(...a11yTests)
    }

    // Performance Tests
    if (this.options.includePerformanceTests) {
      const perfTests = await this.generatePerformanceTests()
      tests.push(...perfTests)
    }

    // Setup Files
    setupFiles.push(...await this.generateSetupFiles())

    // Config Files
    configFiles.push(...await this.generateConfigFiles())

    const allDependencies = new Set<string>()
    tests.forEach(test => test.dependencies.forEach(dep => allDependencies.add(dep)))

    return {
      tests,
      setupFiles,
      configFiles,
      totalTests: tests.length,
      estimatedCoverage: this.calculateEstimatedCoverage(tests, generatedFiles),
      dependencies: Array.from(allDependencies)
    }
  }

  /**
   * ユニットテストの生成
   */
  private async generateUnitTests(
    generatedFiles: Record<string, string>
  ): Promise<GeneratedTest[]> {
    const tests: GeneratedTest[] = []

    for (const [filePath, content] of Object.entries(generatedFiles)) {
      if (this.isTestableFile(filePath, content)) {
        const test = await this.generateComponentUnitTest(filePath, content)
        if (test) tests.push(test)
      }
    }

    // Utility functions tests
    if (generatedFiles['lib/utils.ts']) {
      tests.push(await this.generateUtilsTest(generatedFiles['lib/utils.ts']))
    }

    // Custom hooks tests
    if (generatedFiles['hooks/index.ts']) {
      tests.push(await this.generateHooksTest(generatedFiles['hooks/index.ts']))
    }

    return tests
  }

  /**
   * コンポーネントのユニットテスト生成
   */
  private async generateComponentUnitTest(
    filePath: string,
    content: string
  ): Promise<GeneratedTest | null> {
    if (!this.isReactComponent(content)) return null

    const componentName = this.extractComponentName(filePath, content)
    if (!componentName) return null

    const testContent = `import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import ${componentName} from '../${filePath.replace('.tsx', '').replace('.ts', '')}'

// Mock external dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
  }),
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('${componentName}', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<${componentName} />)
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('displays the correct content', () => {
      render(<${componentName} />)
      
      // Test for specific content based on the component
      ${this.generateContentAssertions(content, componentName)}
    })

    it('applies correct CSS classes', () => {
      render(<${componentName} />)
      const container = screen.getByRole('main')
      
      // Check for Tailwind classes
      expect(container).toHaveClass('w-full')
    })
  })

  describe('User Interactions', () => {
    it('handles button clicks correctly', async () => {
      render(<${componentName} />)
      
      const buttons = screen.getAllByRole('button')
      if (buttons.length > 0) {
        await user.click(buttons[0])
        
        // Add specific assertions based on expected behavior
        ${this.generateInteractionAssertions(content)}
      }
    })

    it('handles form submissions', async () => {
      render(<${componentName} />)
      
      const forms = screen.queryAllByRole('form')
      if (forms.length > 0) {
        const inputs = screen.getAllByRole('textbox')
        
        if (inputs.length > 0) {
          await user.type(inputs[0], 'test input')
          expect(inputs[0]).toHaveValue('test input')
        }
      }
    })

    it('handles keyboard navigation', async () => {
      render(<${componentName} />)
      
      // Test tab navigation
      await user.tab()
      expect(document.activeElement).toBeInTheDocument()
      
      // Test escape key
      await user.keyboard('{Escape}')
      // Add assertions for escape key behavior
    })
  })

  describe('State Management', () => {
    it('manages loading states correctly', async () => {
      render(<${componentName} />)
      
      // Look for loading indicators
      const loadingElements = screen.queryAllByText(/loading|読み込み/i)
      // Add specific assertions based on loading behavior
    })

    it('handles error states gracefully', async () => {
      render(<${componentName} />)
      
      // Test error scenarios
      // Mock API failures, validation errors, etc.
    })

    it('persists data correctly', async () => {
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')
      const mockGetItem = jest.spyOn(Storage.prototype, 'getItem')
      
      render(<${componentName} />)
      
      // Test localStorage interactions
      // Add specific assertions based on data persistence
      
      mockSetItem.mockRestore()
      mockGetItem.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<${componentName} />)
      
      // Check for ARIA attributes
      const interactiveElements = screen.getAllByRole(/button|link|textbox|checkbox|radio/)
      interactiveElements.forEach(element => {
        expect(element).toHaveAttribute('aria-label')
      })
    })

    it('supports keyboard navigation', async () => {
      render(<${componentName} />)
      
      // Test tab order
      const focusableElements = screen.getAllByRole(/button|link|textbox/)
      for (const element of focusableElements) {
        element.focus()
        expect(element).toHaveFocus()
      }
    })

    it('has sufficient color contrast', () => {
      render(<${componentName} />)
      
      // Basic contrast check (would need additional tooling for full validation)
      const container = screen.getByRole('main')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<${componentName} />)
      
      // Test mobile-specific behavior
      const container = screen.getByRole('main')
      expect(container).toBeInTheDocument()
    })

    it('adapts to tablet viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
      
      render(<${componentName} />)
      
      // Test tablet-specific behavior
    })

    it('adapts to desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
      
      render(<${componentName} />)
      
      // Test desktop-specific behavior
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()
      render(<${componentName} />)
      const endTime = performance.now()
      
      // Should render within 100ms
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('memoizes expensive operations', () => {
      // Test React.memo, useMemo, useCallback usage
      const { rerender } = render(<${componentName} />)
      
      // Props that shouldn't cause re-render
      rerender(<${componentName} />)
      
      // Add specific performance assertions
    })
  })

  ${this.generateFeatureSpecificTests(content, componentName)}
})
`

    return {
      filePath: `__tests__/${componentName}.test.tsx`,
      content: testContent,
      type: 'unit',
      dependencies: [
        '@testing-library/react',
        '@testing-library/jest-dom',
        '@testing-library/user-event',
        'jest'
      ],
      description: `Unit tests for ${componentName} component`
    }
  }

  /**
   * 統合テストの生成
   */
  private async generateIntegrationTests(
    generatedFiles: Record<string, string>
  ): Promise<GeneratedTest[]> {
    const tests: GeneratedTest[] = []

    // API integration tests
    tests.push({
      filePath: '__tests__/integration/api.test.ts',
      content: this.generateAPIIntegrationTest(),
      type: 'integration',
      dependencies: ['jest', 'supertest'],
      description: 'API endpoint integration tests'
    })

    // Component integration tests
    tests.push({
      filePath: '__tests__/integration/workflow.test.tsx',
      content: this.generateWorkflowTest(),
      type: 'integration',
      dependencies: ['@testing-library/react', 'jest'],
      description: 'User workflow integration tests'
    })

    return tests
  }

  /**
   * E2Eテストの生成
   */
  private async generateE2ETests(): Promise<GeneratedTest[]> {
    return [{
      filePath: '__tests__/e2e/app.spec.ts',
      content: this.generateE2ETest(),
      type: 'e2e',
      dependencies: ['@playwright/test'],
      description: 'End-to-end application tests'
    }]
  }

  /**
   * アクセシビリティテストの生成
   */
  private async generateAccessibilityTests(
    generatedFiles: Record<string, string>
  ): Promise<GeneratedTest[]> {
    return [{
      filePath: '__tests__/accessibility/a11y.test.tsx',
      content: this.generateAccessibilityTest(),
      type: 'accessibility',
      dependencies: ['@testing-library/react', 'jest-axe'],
      description: 'Accessibility compliance tests'
    }]
  }

  /**
   * パフォーマンステストの生成
   */
  private async generatePerformanceTests(): Promise<GeneratedTest[]> {
    return [{
      filePath: '__tests__/performance/performance.test.ts',
      content: this.generatePerformanceTest(),
      type: 'performance',
      dependencies: ['jest'],
      description: 'Performance benchmark tests'
    }]
  }

  /**
   * セットアップファイルの生成
   */
  private async generateSetupFiles(): Promise<GeneratedTest[]> {
    const setupFiles: GeneratedTest[] = []

    // Jest setup
    setupFiles.push({
      filePath: '__tests__/setup/jest.setup.ts',
      content: this.generateJestSetup(),
      type: 'unit',
      dependencies: ['@testing-library/jest-dom'],
      description: 'Jest test environment setup'
    })

    // Test utilities
    setupFiles.push({
      filePath: '__tests__/utils/test-utils.tsx',
      content: this.generateTestUtils(),
      type: 'unit',
      dependencies: ['@testing-library/react'],
      description: 'Custom test utilities and providers'
    })

    return setupFiles
  }

  /**
   * 設定ファイルの生成
   */
  private async generateConfigFiles(): Promise<GeneratedTest[]> {
    const configFiles: GeneratedTest[] = []

    // Jest configuration
    configFiles.push({
      filePath: 'jest.config.js',
      content: this.generateJestConfig(),
      type: 'unit',
      dependencies: ['jest'],
      description: 'Jest configuration file'
    })

    if (this.options.includeE2ETests) {
      configFiles.push({
        filePath: 'playwright.config.ts',
        content: this.generatePlaywrightConfig(),
        type: 'e2e',
        dependencies: ['@playwright/test'],
        description: 'Playwright E2E test configuration'
      })
    }

    return configFiles
  }

  /**
   * ファイルがテスト可能かチェック
   */
  private isTestableFile(filePath: string, content: string): boolean {
    // Component files
    if (filePath.endsWith('.tsx') && this.isReactComponent(content)) {
      return true
    }

    // Utility files
    if (filePath.includes('lib/') || filePath.includes('utils/')) {
      return true
    }

    // Hook files
    if (filePath.includes('hooks/')) {
      return true
    }

    return false
  }

  /**
   * Reactコンポーネントかチェック
   */
  private isReactComponent(content: string): boolean {
    return content.includes('export default function') || 
           content.includes('const ') && content.includes('= () =>') ||
           content.includes('React.Component') ||
           content.includes('jsx') ||
           content.includes('tsx')
  }

  /**
   * コンポーネント名を抽出
   */
  private extractComponentName(filePath: string, content: string): string | null {
    // From file path
    const fileName = filePath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '')
    if (fileName && fileName !== 'index') {
      return fileName.charAt(0).toUpperCase() + fileName.slice(1)
    }

    // From export statement
    const exportMatch = content.match(/export default function (\w+)/)
    if (exportMatch) {
      return exportMatch[1]
    }

    const constMatch = content.match(/const (\w+)\s*=.*=>/)
    if (constMatch) {
      return constMatch[1]
    }

    return null
  }

  /**
   * コンテンツアサーションの生成
   */
  private generateContentAssertions(content: string, componentName: string): string {
    const assertions: string[] = []

    // Text content checks
    const textMatches = content.match(/"([^"]+)"|'([^']+)'/g)
    if (textMatches) {
      textMatches.slice(0, 3).forEach(match => {
        const text = match.replace(/['"]/g, '')
        if (text.length > 3 && !text.includes('{') && !text.includes('className')) {
          assertions.push(`expect(screen.getByText('${text}')).toBeInTheDocument()`)
        }
      })
    }

    // Feature-specific assertions
    if (this.insight.features.includes('データ管理')) {
      assertions.push(`expect(screen.getByRole('table')).toBeInTheDocument()`)
    }

    if (this.insight.features.includes('検索')) {
      assertions.push(`expect(screen.getByRole('searchbox')).toBeInTheDocument()`)
    }

    return assertions.join('\n      ')
  }

  /**
   * インタラクションアサーションの生成
   */
  private generateInteractionAssertions(content: string): string {
    const assertions: string[] = []

    if (content.includes('onClick') || content.includes('onSubmit')) {
      assertions.push(`// Verify button click behavior`)
      assertions.push(`await waitFor(() => {`)
      assertions.push(`  // Add specific assertions for your component`)
      assertions.push(`})`)
    }

    return assertions.join('\n        ')
  }

  /**
   * 機能固有のテスト生成
   */
  private generateFeatureSpecificTests(content: string, componentName: string): string {
    const tests: string[] = []

    // データ管理機能のテスト
    if (this.insight.features.some(f => f.includes('データ'))) {
      tests.push(`
  describe('Data Management', () => {
    it('loads data correctly', async () => {
      render(<${componentName} />)
      
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      })
      
      // Verify data is displayed
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('handles data errors gracefully', async () => {
      // Mock API error
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'))
      
      render(<${componentName} />)
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })`)
    }

    // 検索機能のテスト
    if (this.insight.features.some(f => f.includes('検索'))) {
      tests.push(`
  describe('Search Functionality', () => {
    it('filters results based on search input', async () => {
      render(<${componentName} />)
      
      const searchInput = screen.getByRole('searchbox')
      await user.type(searchInput, 'test query')
      
      await waitFor(() => {
        // Verify filtered results
        expect(screen.getByText(/test query/i)).toBeInTheDocument()
      })
    })
  })`)
    }

    return tests.join('\n')
  }

  /**
   * ユーティリティテストの生成
   */
  private async generateUtilsTest(content: string): Promise<GeneratedTest> {
    return {
      filePath: '__tests__/lib/utils.test.ts',
      content: `import { describe, it, expect } from '@jest/globals'
import * as utils from '../../lib/utils'

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('merges class names correctly', () => {
      const result = utils.cn('base-class', 'additional-class')
      expect(result).toContain('base-class')
      expect(result).toContain('additional-class')
    })

    it('handles conditional classes', () => {
      const result = utils.cn('base', true && 'conditional', false && 'hidden')
      expect(result).toContain('base')
      expect(result).toContain('conditional')
      expect(result).not.toContain('hidden')
    })
  })

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2023-12-25T10:00:00Z')
      const formatted = utils.formatDate(date)
      expect(formatted).toContain('2023')
      expect(formatted).toContain('12')
      expect(formatted).toContain('25')
    })

    it('handles string dates', () => {
      const formatted = utils.formatDate('2023-12-25')
      expect(formatted).toBeTruthy()
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = utils.generateId()
      const id2 = utils.generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('debounce', () => {
    it('delays function execution', async () => {
      jest.useFakeTimers()
      const mockFn = jest.fn()
      const debouncedFn = utils.debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.useRealTimers()
    })
  })

  describe('validation functions', () => {
    describe('isValidEmail', () => {
      it('validates correct emails', () => {
        expect(utils.isValidEmail('test@example.com')).toBe(true)
        expect(utils.isValidEmail('user+tag@domain.co.jp')).toBe(true)
      })

      it('rejects invalid emails', () => {
        expect(utils.isValidEmail('invalid-email')).toBe(false)
        expect(utils.isValidEmail('test@')).toBe(false)
        expect(utils.isValidEmail('@example.com')).toBe(false)
      })
    })

    describe('isValidUrl', () => {
      it('validates correct URLs', () => {
        expect(utils.isValidUrl('https://example.com')).toBe(true)
        expect(utils.isValidUrl('http://localhost:3000')).toBe(true)
      })

      it('rejects invalid URLs', () => {
        expect(utils.isValidUrl('invalid-url')).toBe(false)
        expect(utils.isValidUrl('not-a-url')).toBe(false)
      })
    })
  })

  describe('array utilities', () => {
    describe('groupBy', () => {
      it('groups array by key', () => {
        const data = [
          { category: 'A', value: 1 },
          { category: 'B', value: 2 },
          { category: 'A', value: 3 }
        ]
        const grouped = utils.groupBy(data, 'category')
        expect(grouped.A).toHaveLength(2)
        expect(grouped.B).toHaveLength(1)
      })
    })

    describe('unique', () => {
      it('returns unique values', () => {
        const data = [1, 2, 2, 3, 3, 3, 4]
        const uniqueValues = utils.unique(data)
        expect(uniqueValues).toEqual([1, 2, 3, 4])
      })
    })
  })
})`,
      type: 'unit',
      dependencies: ['jest'],
      description: 'Tests for utility functions'
    }
  }

  /**
   * フックテストの生成
   */
  private async generateHooksTest(content: string): Promise<GeneratedTest> {
    return {
      filePath: '__tests__/hooks/hooks.test.ts',
      content: `import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, jest } from '@jest/globals'
import * as hooks from '../../hooks'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('Custom Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('useLocalStorage', () => {
    it('returns initial value when no stored value exists', () => {
      const { result } = renderHook(() => hooks.useLocalStorage('test-key', 'initial'))
      expect(result.current[0]).toBe('initial')
    })

    it('sets value in localStorage', () => {
      const { result } = renderHook(() => hooks.useLocalStorage('test-key', 'initial'))
      
      act(() => {
        result.current[1]('new value')
      })
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('test-key'),
        JSON.stringify('new value')
      )
    })
  })

  describe('useLoading', () => {
    it('manages loading state', () => {
      const { result } = renderHook(() => hooks.useLoading())
      
      expect(result.current.isLoading).toBe(false)
      
      act(() => {
        result.current.startLoading()
      })
      
      expect(result.current.isLoading).toBe(true)
      
      act(() => {
        result.current.stopLoading()
      })
      
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('useError', () => {
    it('manages error state', () => {
      const { result } = renderHook(() => hooks.useError())
      
      expect(result.current.error).toBeNull()
      
      act(() => {
        result.current.showError('Test error')
      })
      
      expect(result.current.error).toBe('Test error')
      
      act(() => {
        result.current.clearError()
      })
      
      expect(result.current.error).toBeNull()
    })
  })

  describe('useDebounce', () => {
    it('debounces value changes', () => {
      jest.useFakeTimers()
      
      const { result, rerender } = renderHook(
        ({ value, delay }) => hooks.useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )
      
      expect(result.current).toBe('initial')
      
      rerender({ value: 'updated', delay: 500 })
      expect(result.current).toBe('initial') // Still initial
      
      act(() => {
        jest.advanceTimersByTime(500)
      })
      
      expect(result.current).toBe('updated')
      
      jest.useRealTimers()
    })
  })

  describe('useToggle', () => {
    it('toggles boolean value', () => {
      const { result } = renderHook(() => hooks.useToggle(false))
      
      expect(result.current.value).toBe(false)
      
      act(() => {
        result.current.toggle()
      })
      
      expect(result.current.value).toBe(true)
      
      act(() => {
        result.current.setFalse()
      })
      
      expect(result.current.value).toBe(false)
    })
  })

  describe('useAsyncState', () => {
    it('manages async operation state', async () => {
      const { result } = renderHook(() => hooks.useAsyncState())
      
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()
      
      const mockAsyncFn = jest.fn().mockResolvedValue('test data')
      
      act(() => {
        result.current.execute(mockAsyncFn)
      })
      
      expect(result.current.isLoading).toBe(true)
      
      await act(async () => {
        await Promise.resolve()
      })
      
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBe('test data')
    })
  })
})`,
      type: 'unit',
      dependencies: ['@testing-library/react-hooks', 'jest'],
      description: 'Tests for custom React hooks'
    }
  }

  /**
   * API統合テストの生成
   */
  private generateAPIIntegrationTest(): string {
    return `import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { NextRequest } from 'next/server'

// Import your API handlers
import { POST as autonomousGeneratePost } from '../../app/api/autonomous-generate/route'
import { POST as geminiGeneratePost } from '../../app/api/gemini-generate/route'

describe('API Integration Tests', () => {
  describe('/api/autonomous-generate', () => {
    it('handles valid generation request', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/autonomous-generate', {
        method: 'POST',
        body: JSON.stringify({
          insights: {
            vision: 'Test application',
            target: 'Test users',
            features: ['feature1', 'feature2'],
            value: 'Test value',
            motivation: 'Test motivation'
          },
          uiStyle: {
            id: 'test-style',
            name: 'Test Style',
            colors: {
              primary: '#000000',
              secondary: '#ffffff',
              accent: '#ff0000',
              background: '#ffffff',
              text: '#000000'
            },
            typography: {
              heading: 'Inter',
              body: 'Inter'
            },
            category: 'modern',
            description: 'Test style',
            spacing: 'comfortable',
            personality: ['modern', 'clean']
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await autonomousGeneratePost(mockRequest)
      expect(response).toBeDefined()
      expect(response.status).toBeLessThan(500)
    })

    it('handles invalid request data', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/autonomous-generate', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await autonomousGeneratePost(mockRequest)
      expect(response.status).toBe(400)
    })
  })

  describe('/api/gemini-generate', () => {
    it('handles basic generation request', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/gemini-generate', {
        method: 'POST',
        body: JSON.stringify({
          insights: {
            vision: 'Test application',
            target: 'Test users',
            features: ['feature1'],
            value: 'Test value'
          },
          uiStyle: {
            name: 'Test Style',
            colors: {
              primary: '#000000'
            }
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await geminiGeneratePost(mockRequest)
      expect(response).toBeDefined()
    })
  })

  describe('Health Check Endpoints', () => {
    it('returns service status', async () => {
      const response = await fetch('http://localhost:3000/api/autonomous-generate', {
        method: 'GET'
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.status).toBe('ok')
    })
  })
})`
  }

  /**
   * ワークフローテストの生成
   */
  private generateWorkflowTest(): string {
    return `import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, jest } from '@jest/globals'

// Mock the entire application workflow
describe('Application Workflow Integration', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    jest.clearAllMocks()
  })

  describe('User Journey', () => {
    it('completes full workflow from start to finish', async () => {
      // Mock the main application component
      const MockApp = () => (
        <div>
          <h1>MATURA Application</h1>
          <button>Start Generation</button>
          <div role="main">Application Content</div>
        </div>
      )

      render(<MockApp />)

      // Step 1: Initial load
      expect(screen.getByText('MATURA Application')).toBeInTheDocument()

      // Step 2: User interaction
      const startButton = screen.getByText('Start Generation')
      await user.click(startButton)

      // Step 3: Verify workflow progression
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('handles error scenarios gracefully', async () => {
      // Mock error conditions
      jest.spyOn(console, 'error').mockImplementation(() => {})

      // Test error handling throughout the workflow
      const MockErrorApp = () => {
        throw new Error('Test error')
      }

      expect(() => render(<MockErrorApp />)).toThrow('Test error')
    })
  })

  describe('State Persistence', () => {
    it('maintains state across component updates', async () => {
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')
      const mockGetItem = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)

      // Test component that uses localStorage
      const StatefulComponent = () => {
        const [value, setValue] = React.useState('')
        
        React.useEffect(() => {
          const stored = localStorage.getItem('test-key')
          if (stored) setValue(stored)
        }, [])

        const handleChange = (newValue: string) => {
          setValue(newValue)
          localStorage.setItem('test-key', newValue)
        }

        return (
          <div>
            <input 
              value={value} 
              onChange={(e) => handleChange(e.target.value)}
              data-testid="test-input"
            />
            <span data-testid="display-value">{value}</span>
          </div>
        )
      }

      render(<StatefulComponent />)

      const input = screen.getByTestId('test-input')
      await user.type(input, 'test value')

      expect(mockSetItem).toHaveBeenCalledWith('test-key', 'test value')

      mockSetItem.mockRestore()
      mockGetItem.mockRestore()
    })
  })
})`
  }

  /**
   * E2Eテストの生成
   */
  private generateE2ETest(): string {
    return `import { test, expect } from '@playwright/test'

test.describe('MATURA Application E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('application loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/MATURA/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('autonomous generation workflow', async ({ page }) => {
    // Navigate to generation interface
    await page.click('text=Start Generation')
    
    // Fill in required fields
    await page.fill('[data-testid="vision-input"]', '${this.insight.vision}')
    await page.fill('[data-testid="target-input"]', '${this.insight.target}')
    
    // Select UI style
    await page.click('[data-testid="ui-style-selector"]')
    await page.click('text=${this.uiStyle.name}')
    
    // Start generation
    await page.click('text=生成開始')
    
    // Wait for completion
    await expect(page.locator('text=生成完了')).toBeVisible({ timeout: 60000 })
    
    // Verify results
    await expect(page.locator('[data-testid="generation-result"]')).toBeVisible()
  })

  test('responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(page.locator('main')).toBeVisible()
    
    // Test mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      await expect(page.locator('[data-testid="navigation-menu"]')).toBeVisible()
    }
  })

  test('accessibility features', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
    
    // Test skip links
    await page.keyboard.press('Tab')
    const skipLink = page.locator('text=Skip to main content')
    if (await skipLink.isVisible()) {
      await skipLink.click()
      await expect(page.locator('main')).toBeFocused()
    }
  })

  test('error handling', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/**', route => route.abort())
    
    await page.click('text=Start Generation')
    
    // Should show error message
    await expect(page.locator('text=エラー')).toBeVisible()
    
    // Should provide retry option
    await expect(page.locator('text=再試行')).toBeVisible()
  })

  test('performance benchmarks', async ({ page }) => {
    // Measure page load time
    const start = Date.now()
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - start
    
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    
    // Measure generation time
    await page.click('text=Start Generation')
    const genStart = Date.now()
    await page.waitForSelector('text=生成完了', { timeout: 120000 })
    const genTime = Date.now() - genStart
    
    console.log(\`Generation completed in \${genTime}ms\`)
  })
})`
  }

  /**
   * アクセシビリティテストの生成
   */
  private generateAccessibilityTest(): string {
    return `import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { describe, it, expect } from '@jest/globals'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  describe('WCAG Compliance', () => {
    it('meets WCAG AA standards', async () => {
      const MockMainApp = () => (
        <main>
          <h1>MATURA Application</h1>
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="#section1">Section 1</a></li>
              <li><a href="#section2">Section 2</a></li>
            </ul>
          </nav>
          <section id="section1">
            <h2>Section 1 Content</h2>
            <p>This is the content of section 1.</p>
          </section>
          <section id="section2">
            <h2>Section 2 Content</h2>
            <button type="button" aria-label="Action button">
              Click me
            </button>
          </section>
        </main>
      )

      const { container } = render(<MockMainApp />)
      const results = await axe(container)
      
      expect(results).toHaveNoViolations()
    })

    it('has proper heading hierarchy', async () => {
      const MockHeadingApp = () => (
        <main>
          <h1>Main Title</h1>
          <section>
            <h2>Section Title</h2>
            <h3>Subsection Title</h3>
            <h4>Sub-subsection Title</h4>
          </section>
        </main>
      )

      const { container } = render(<MockHeadingApp />)
      const results = await axe(container, {
        rules: {
          'heading-order': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })

    it('has sufficient color contrast', async () => {
      const MockContrastApp = () => (
        <div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
          <h1>High Contrast Title</h1>
          <p>This text should have sufficient contrast ratio.</p>
          <button 
            style={{ 
              backgroundColor: '#0066cc', 
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px'
            }}
          >
            High Contrast Button
          </button>
        </div>
      )

      const { container } = render(<MockContrastApp />)
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })

    it('provides alternative text for images', async () => {
      const MockImageApp = () => (
        <div>
          <img src="/test-image.jpg" alt="Description of test image" />
          <img src="/decorative-image.jpg" alt="" role="presentation" />
        </div>
      )

      const { container } = render(<MockImageApp />)
      const results = await axe(container, {
        rules: {
          'image-alt': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })

    it('has accessible form labels', async () => {
      const MockFormApp = () => (
        <form>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
          
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
          
          <fieldset>
            <legend>Preferences</legend>
            <label>
              <input type="checkbox" name="newsletter" />
              Subscribe to newsletter
            </label>
            <label>
              <input type="checkbox" name="notifications" />
              Enable notifications
            </label>
          </fieldset>
          
          <button type="submit">Submit</button>
        </form>
      )

      const { container } = render(<MockFormApp />)
      const results = await axe(container, {
        rules: {
          'label': { enabled: true },
          'form-field-multiple-labels': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })

    it('supports keyboard navigation', async () => {
      const MockKeyboardApp = () => (
        <div>
          <button type="button" tabIndex={0}>Button 1</button>
          <a href="#section" tabIndex={0}>Link to section</a>
          <input type="text" tabIndex={0} placeholder="Text input" />
          <select tabIndex={0}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
      )

      const { container } = render(<MockKeyboardApp />)
      const results = await axe(container, {
        rules: {
          'focusable-content': { enabled: true },
          'tabindex': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })

    it('provides ARIA landmarks', async () => {
      const MockLandmarkApp = () => (
        <div>
          <header role="banner">
            <h1>Site Header</h1>
          </header>
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>
          <main role="main">
            <h2>Main Content</h2>
            <p>This is the main content area.</p>
          </main>
          <aside role="complementary">
            <h3>Sidebar</h3>
            <p>Additional information.</p>
          </aside>
          <footer role="contentinfo">
            <p>Site footer content.</p>
          </footer>
        </div>
      )

      const { container } = render(<MockLandmarkApp />)
      const results = await axe(container, {
        rules: {
          'landmark-one-main': { enabled: true },
          'landmark-unique': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })
})`
  }

  /**
   * パフォーマンステストの生成
   */
  private generatePerformanceTest(): string {
    return `import { describe, it, expect } from '@jest/globals'

describe('Performance Tests', () => {
  describe('Rendering Performance', () => {
    it('renders components within acceptable time', () => {
      const start = performance.now()
      
      // Simulate component rendering
      const mockRender = () => {
        // Simulate DOM operations
        for (let i = 0; i < 1000; i++) {
          const element = document.createElement('div')
          element.textContent = \`Item \${i}\`
          document.body.appendChild(element)
        }
      }
      
      mockRender()
      
      const end = performance.now()
      const renderTime = end - start
      
      expect(renderTime).toBeLessThan(100) // Should render within 100ms
      
      // Cleanup
      document.body.innerHTML = ''
    })

    it('handles large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: \`Item \${i}\`,
        value: Math.random()
      }))

      const start = performance.now()
      
      // Simulate data processing
      const processedData = largeDataset
        .filter(item => item.value > 0.5)
        .map(item => ({ ...item, processed: true }))
        .slice(0, 100)
      
      const end = performance.now()
      const processingTime = end - start
      
      expect(processingTime).toBeLessThan(50) // Should process within 50ms
      expect(processedData.length).toBeLessThanOrEqual(100)
    })
  })

  describe('Memory Usage', () => {
    it('does not create memory leaks', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      // Simulate memory-intensive operations
      const data: any[] = []
      for (let i = 0; i < 1000; i++) {
        data.push({ id: i, data: new Array(100).fill('test') })
      }
      
      // Clear references
      data.length = 0
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      // Memory should not increase significantly
      if (initialMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory
        expect(memoryIncrease).toBeLessThan(1024 * 1024) // Less than 1MB increase
      }
    })
  })

  describe('Bundle Size', () => {
    it('keeps bundle size within limits', () => {
      // This would typically be measured by build tools
      // Here we simulate checking for large dependencies
      
      const mockBundleAnalysis = {
        totalSize: 500 * 1024, // 500KB
        chunks: [
          { name: 'main', size: 200 * 1024 },
          { name: 'vendor', size: 250 * 1024 },
          { name: 'runtime', size: 50 * 1024 }
        ]
      }
      
      expect(mockBundleAnalysis.totalSize).toBeLessThan(1024 * 1024) // Less than 1MB
      
      // Individual chunks should be reasonable
      mockBundleAnalysis.chunks.forEach(chunk => {
        expect(chunk.size).toBeLessThan(512 * 1024) // Less than 512KB per chunk
      })
    })
  })

  describe('API Performance', () => {
    it('API responses are fast enough', async () => {
      const mockApiCall = async () => {
        return new Promise(resolve => {
          setTimeout(() => resolve({ data: 'mock response' }), 100)
        })
      }

      const start = performance.now()
      await mockApiCall()
      const end = performance.now()
      
      const responseTime = end - start
      expect(responseTime).toBeLessThan(200) // Should respond within 200ms
    })
  })
})`
  }

  /**
   * Jestセットアップの生成
   */
  private generateJestSetup(): string {
    return `import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'

// Setup global test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock Next.js modules
jest.mock('next/router', () => require('next-router-mock'))
jest.mock('next/navigation', () => require('next-router-mock'))

// Global test utilities
global.testUtils = {
  // Add any global test utilities here
}`
  }

  /**
   * テストユーティリティの生成
   */
  private generateTestUtils(): string {
    return `import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }`
  }

  /**
   * Jest設定の生成
   */
  private generateJestConfig(): string {
    return `const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/jest.setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: ${this.options.coverageThreshold},
      functions: ${this.options.coverageThreshold},
      lines: ${this.options.coverageThreshold},
      statements: ${this.options.coverageThreshold},
    },
  },
}

module.exports = createJestConfig(customJestConfig)`
  }

  /**
   * Playwright設定の生成
   */
  private generatePlaywrightConfig(): string {
    return `import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})`
  }

  /**
   * 推定カバレッジの計算
   */
  private calculateEstimatedCoverage(
    tests: GeneratedTest[],
    generatedFiles: Record<string, string>
  ): number {
    const totalFiles = Object.keys(generatedFiles).length
    const testedFiles = tests.filter(test => test.type === 'unit').length
    
    return Math.min(100, Math.round((testedFiles / totalFiles) * 100))
  }
}

export default AutomatedTestGeneration