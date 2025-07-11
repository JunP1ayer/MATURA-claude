import { Insight, UIStyle, UnifiedUXDesign } from './types'

export interface AdvancedGenerationConfig {
  patterns: number // 3-5パターンの生成
  includeStateManagement: boolean
  includeAPILayer: boolean
  includeTests: boolean
  stateManager: 'context' | 'zustand'
  deployTarget: 'vercel' | 'netlify'
  qualityLevel: 'standard' | 'high' | 'production'
}

export class AdvancedGeminiPromptGenerator {
  private insight: Insight
  private uiStyle: UIStyle
  private uxDesign?: UnifiedUXDesign
  private config: AdvancedGenerationConfig

  constructor(
    insight: Insight,
    uiStyle: UIStyle,
    uxDesign?: UnifiedUXDesign,
    config: Partial<AdvancedGenerationConfig> = {}
  ) {
    this.insight = insight
    this.uiStyle = uiStyle
    this.uxDesign = uxDesign
    this.config = {
      patterns: 3,
      includeStateManagement: true,
      includeAPILayer: true,
      includeTests: true,
      stateManager: 'zustand',
      deployTarget: 'vercel',
      qualityLevel: 'production',
      ...config
    }
  }

  /**
   * フェーズ1: UI構造生成用プロンプト
   */
  generateUIStructurePrompt(): string {
    return `# ADVANCED UI STRUCTURE GENERATION

## PROJECT CONTEXT
Vision: ${this.insight.vision}
Target Users: ${this.insight.target}
Core Features: ${this.insight.features.join(', ')}
Value Proposition: ${this.insight.value}

## UI STYLE REQUIREMENTS
Style: ${this.uiStyle.name} (${this.uiStyle.description})
Primary Color: ${this.uiStyle.colors.primary}
Secondary Color: ${this.uiStyle.colors.secondary}
Accent Color: ${this.uiStyle.colors.accent}
Typography: ${this.uiStyle.typography.heading} / ${this.uiStyle.typography.body}
Personality: ${this.uiStyle.personality.join(', ')}

## TECHNICAL REQUIREMENTS
- Framework: Next.js 14 with App Router
- UI Library: shadcn/ui + Radix UI
- Styling: Tailwind CSS v3.4
- TypeScript: Strict mode enabled
- State Management: ${this.config.stateManager}
- Testing: Jest + Testing Library

## GENERATION INSTRUCTIONS

### 1. CREATE ${this.config.patterns} DISTINCT UI PATTERNS
For each pattern, generate:
- Unique layout approach (grid vs flex vs compound layouts)
- Different component hierarchy
- Distinct visual emphasis (hero-centric, card-focused, dashboard-style)
- Varied interaction patterns

### 2. IMPLEMENT CORE SECTIONS
Each pattern MUST include:
- **Hero Section**: Compelling headline + CTA reflecting the vision
- **Feature Showcase**: Visual representation of core features
- **Interactive Elements**: Forms, buttons, toggles that will connect to state
- **Navigation**: Intuitive routing structure
- **Footer**: Contact/social links

### 3. SHADCN/UI COMPONENT INTEGRATION
Use these components strategically:
- Card, Button, Input, Select, Switch, Tabs, Dialog
- Form, Label, Textarea, Badge, Progress, Avatar
- DropdownMenu, Popover, Tooltip, Sheet, Alert

### 4. RESPONSIVE DESIGN STANDARDS
- Mobile-first approach with Tailwind breakpoints
- Touch-friendly interactive elements (min 44px)
- Optimal typography scaling (text-sm to text-4xl)
- Proper spacing using Tailwind scale (px-4, py-8, gap-6)

### 5. ACCESSIBILITY FOUNDATIONS
- Semantic HTML structure (main, section, article, nav)
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader friendly

### 6. PLACEHOLDER STATE HOOKS
Add placeholder hooks for state management:
\`\`\`typescript
// These will be replaced in Phase 2
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)
const [error, setError] = useState(null)
\`\`\`

## OUTPUT FORMAT
Generate a complete Next.js page component for each pattern:
- Pattern A: \`/app/generated/pattern-a/page.tsx\`
- Pattern B: \`/app/generated/pattern-b/page.tsx\`  
- Pattern C: \`/app/generated/pattern-c/page.tsx\`

Each file should be 300-500 lines of production-ready code with:
- Full TypeScript typing
- Comprehensive JSX structure
- Tailwind styling
- shadcn/ui integration
- State placeholders
- Responsive design
- Accessibility features

## CRITICAL REQUIREMENTS
1. ZERO hardcoded colors - use CSS variables and Tailwind classes
2. Every interactive element must have onClick/onChange handlers (even if placeholder)
3. Use proper semantic HTML throughout
4. Include loading states and error boundaries
5. Add comprehensive TypeScript interfaces
6. Follow Next.js 14 App Router conventions exactly

Generate Pattern A first, ensure it's complete and production-ready before proceeding to Patterns B and C.`
  }

  /**
   * フェーズ2: 状態管理生成用プロンプト
   */
  generateStateManagementPrompt(): string {
    const stateManagerInstructions = this.config.stateManager === 'zustand' 
      ? this.getZustandInstructions()
      : this.getContextInstructions()

    return `# PHASE 2: STATE MANAGEMENT IMPLEMENTATION

## CONTEXT
You are implementing state management for the UI structures generated in Phase 1.
Features to manage: ${this.insight.features.join(', ')}

## STATE MANAGER: ${this.config.stateManager.toUpperCase()}

${stateManagerInstructions}

## REQUIRED STATE STRUCTURE

### 1. Application State
\`\`\`typescript
interface AppState {
  // User & Authentication
  user: User | null
  isAuthenticated: boolean
  
  // Core Feature States
  ${this.insight.features.map(feature => `${this.camelCase(feature)}: ${this.camelCase(feature)}State`).join('\n  ')}
  
  // UI State
  loading: LoadingState
  errors: ErrorState
  notifications: Notification[]
  
  // Navigation & Routing
  currentView: ViewType
  sidebarOpen: boolean
  mobileMenuOpen: boolean
}
\`\`\`

### 2. Feature-Specific States
${this.insight.features.map(feature => this.generateFeatureStateDefinition(feature)).join('\n\n')}

### 3. Actions Implementation
For each feature, implement:
- **Create/Add actions**: Add new items, validate inputs
- **Read/Fetch actions**: Load data, handle pagination
- **Update actions**: Modify existing items, bulk operations  
- **Delete actions**: Remove items, undo functionality
- **UI actions**: Toggle modals, change views, handle forms

### 4. Real-time Updates
Implement optimistic updates:
\`\`\`typescript
// Example for ${this.insight.features[0]}
const add${this.pascalCase(this.insight.features[0])} = async (item: New${this.pascalCase(this.insight.features[0])}) => {
  // Optimistic update
  set(state => ({
    ${this.camelCase(this.insight.features[0])}: {
      ...state.${this.camelCase(this.insight.features[0])},
      items: [...state.${this.camelCase(this.insight.features[0])}.items, { ...item, id: generateTempId() }]
    }
  }))
  
  try {
    const result = await api.${this.camelCase(this.insight.features[0])}.create(item)
    // Replace temp with real data
    set(state => ({ /* update with real data */ }))
  } catch (error) {
    // Rollback optimistic update
    set(state => ({ /* rollback changes */ }))
    handleError(error)
  }
}
\`\`\`

## INTEGRATION REQUIREMENTS

### 1. Replace All Placeholder State
Update all Pattern A/B/C components to use the real state:
- Remove \`useState\` hooks
- Connect to ${this.config.stateManager} store
- Add proper TypeScript typing
- Implement real event handlers

### 2. Form Handling
Use react-hook-form + zod for all forms:
\`\`\`typescript
const form = useForm<FormSchema>({
  resolver: zodResolver(schema),
  defaultValues: getDefaultValues()
})
\`\`\`

### 3. Error Handling
Implement comprehensive error boundaries:
- Network errors
- Validation errors  
- Runtime errors
- User-friendly messages

### 4. Loading States
Add granular loading indicators:
- Global app loading
- Feature-specific loading
- Button loading states
- Skeleton components

## OUTPUT DELIVERABLES
1. **Store Definition**: \`/lib/store/${this.config.stateManager}Store.ts\`
2. **Type Definitions**: \`/lib/types/stateTypes.ts\`
3. **Updated Components**: Modified Pattern A/B/C with real state
4. **Custom Hooks**: \`/hooks/use{FeatureName}.ts\` for each feature
5. **Form Schemas**: \`/lib/schemas/\` with zod validation

## CRITICAL SUCCESS CRITERIA
- Every button/form must trigger real state changes
- All state changes must be visible in the UI immediately
- TypeScript strict mode compliance
- Zero runtime errors
- Proper error handling and loading states
- Console.log statements showing state changes for debugging

Start with the core store definition, then update Pattern A completely before proceeding to Patterns B and C.`
  }

  /**
   * フェーズ3: ロジック・API層生成用プロンプト
   */
  generateLogicLayerPrompt(): string {
    return `# PHASE 3: BUSINESS LOGIC & API LAYER

## CONTEXT  
Implement complete business logic and API communication layer for:
Features: ${this.insight.features.join(', ')}
Vision: ${this.insight.vision}

## API ARCHITECTURE

### 1. API Client Structure
\`\`\`typescript
// /lib/api/client.ts
export class APIClient {
  private baseURL: string
  private timeout: number
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'
    this.timeout = 10000
  }
  
  // HTTP methods with automatic retry, error handling
  async get<T>(endpoint: string, options?: RequestOptions): Promise<APIResponse<T>>
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>>
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>>
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<APIResponse<T>>
}
\`\`\`

### 2. Feature-Specific API Services
${this.insight.features.map(feature => this.generateAPIServiceDefinition(feature)).join('\n\n')}

### 3. Mock API Implementation
Create functioning mock APIs using MSW (Mock Service Worker):
\`\`\`typescript
// /lib/mocks/handlers.ts
export const handlers = [
  ${this.insight.features.map(feature => this.generateMockHandlers(feature)).join(',\n  ')}
]
\`\`\`

## BUSINESS LOGIC IMPLEMENTATION

### 1. Core Business Rules
${this.generateBusinessRulesForFeatures()}

### 2. Data Validation & Transformation
\`\`\`typescript
// /lib/validators/
export const ${this.camelCase(this.insight.features[0])}Validator = {
  create: (data: unknown) => CreateSchema.parse(data),
  update: (data: unknown) => UpdateSchema.parse(data),
  query: (params: unknown) => QuerySchema.parse(params)
}
\`\`\`

### 3. Business Logic Services
\`\`\`typescript
// /lib/services/
export class ${this.pascalCase(this.insight.features[0])}Service {
  static async calculateMetrics(items: ${this.pascalCase(this.insight.features[0])}[]): Promise<Metrics>
  static async applyBusinessRules(item: ${this.pascalCase(this.insight.features[0])}): Promise<ValidationResult>
  static async generateRecommendations(context: Context): Promise<Recommendation[]>
}
\`\`\`

## INTEGRATION REQUIREMENTS

### 1. Connect State to API
Update ${this.config.stateManager} store actions to use real API calls:
- Replace mock data with API responses
- Add proper error handling and retry logic
- Implement caching strategies
- Add request deduplication

### 2. Real-time Features (if applicable)
Implement WebSocket or Server-Sent Events for:
- Live updates
- Collaborative features
- Real-time notifications
- Progress tracking

### 3. Offline Support
Add service worker for:
- Cache API responses
- Queue failed requests
- Sync when back online
- Progressive Web App features

### 4. Performance Optimization
- Request/response caching
- Optimistic updates
- Pagination implementation
- Image lazy loading
- Code splitting

## NEXT.JS API ROUTES

### 1. Create API Endpoints
\`\`\`typescript
// /app/api/[feature]/route.ts
export async function GET(request: NextRequest) {
  try {
    const data = await ${this.camelCase(this.insight.features[0])}Service.getAll()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
\`\`\`

### 2. Middleware Implementation
- Authentication checks
- Rate limiting
- Request logging
- CORS handling
- Input validation

## TESTING INTEGRATION

### 1. API Testing
\`\`\`typescript
// /tests/api/
describe('${this.pascalCase(this.insight.features[0])} API', () => {
  test('should create ${this.camelCase(this.insight.features[0])}', async () => {
    const response = await request(app)
      .post('/api/${this.camelCase(this.insight.features[0])}')
      .send(mockData)
      .expect(201)
    
    expect(response.body.data).toMatchObject(expectedResult)
  })
})
\`\`\`

### 2. Integration Testing
- End-to-end user flows
- State management integration
- Error scenario testing
- Performance testing

## OUTPUT DELIVERABLES
1. **API Client**: \`/lib/api/client.ts\`
2. **Service Classes**: \`/lib/services/{feature}Service.ts\`
3. **API Routes**: \`/app/api/{feature}/route.ts\`
4. **Mock Handlers**: \`/lib/mocks/handlers.ts\`
5. **Validators**: \`/lib/validators/{feature}Validator.ts\`
6. **Types**: \`/lib/types/apiTypes.ts\`
7. **Tests**: \`/tests/api/\` and \`/tests/integration/\`

## CRITICAL SUCCESS CRITERIA
- All forms submit to real API endpoints
- Data persists between page refreshes
- Error handling with user feedback
- Loading states during API calls
- Proper TypeScript typing throughout
- Zero console errors
- Working offline/online detection
- Performance metrics under 2s load time

Implement the core API client first, then build feature services progressively starting with the primary feature: ${this.insight.features[0]}.`
  }

  /**
   * フェーズ4: テスト・品質保証プロンプト
   */
  generateTestingPrompt(): string {
    return `# PHASE 4: COMPREHENSIVE TESTING & QUALITY ASSURANCE

## TESTING STRATEGY
Implement complete test coverage for the generated application:
Features: ${this.insight.features.join(', ')}

## TEST FRAMEWORK SETUP

### 1. Jest Configuration
\`\`\`javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
\`\`\`

### 2. Testing Library Setup
\`\`\`typescript
// jest.setup.js
import '@testing-library/jest-dom'
import { server } from './lib/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
\`\`\`

## UNIT TESTING

### 1. Component Tests
${this.insight.features.map(feature => this.generateComponentTestTemplate(feature)).join('\n\n')}

### 2. Hook Tests
\`\`\`typescript
// /tests/hooks/use${this.pascalCase(this.insight.features[0])}.test.ts
import { renderHook, act } from '@testing-library/react'
import { use${this.pascalCase(this.insight.features[0])} } from '@/hooks/use${this.pascalCase(this.insight.features[0])}'

describe('use${this.pascalCase(this.insight.features[0])}', () => {
  test('should add new ${this.camelCase(this.insight.features[0])}', async () => {
    const { result } = renderHook(() => use${this.pascalCase(this.insight.features[0])}())
    
    await act(async () => {
      await result.current.add(mockData)
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]).toMatchObject(mockData)
  })
})
\`\`\`

### 3. Service Tests
\`\`\`typescript
// /tests/services/${this.camelCase(this.insight.features[0])}Service.test.ts
import { ${this.pascalCase(this.insight.features[0])}Service } from '@/lib/services/${this.camelCase(this.insight.features[0])}Service'

describe('${this.pascalCase(this.insight.features[0])}Service', () => {
  test('should calculate metrics correctly', () => {
    const result = ${this.pascalCase(this.insight.features[0])}Service.calculateMetrics(mockItems)
    expect(result.total).toBe(5)
    expect(result.average).toBeCloseTo(3.4)
  })
})
\`\`\`

## INTEGRATION TESTING

### 1. API Integration Tests
\`\`\`typescript
// /tests/integration/api.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/${this.camelCase(this.insight.features[0])}/route'

describe('/api/${this.camelCase(this.insight.features[0])}', () => {
  test('should create ${this.camelCase(this.insight.features[0])} successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: validPayload,
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toMatchObject({
      success: true,
      data: expect.any(Object)
    })
  })
})
\`\`\`

### 2. End-to-End User Flows
\`\`\`typescript
// /tests/e2e/userFlows.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/app/page'

describe('Complete User Flow', () => {
  test('user can complete primary workflow', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Step 1: Navigate to feature
    await user.click(screen.getByText('${this.insight.features[0]}'))
    
    // Step 2: Fill form
    await user.type(screen.getByLabelText(/name/i), 'Test Item')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Step 3: Verify result
    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })
  })
})
\`\`\`

## ACCESSIBILITY TESTING

### 1. A11y Tests
\`\`\`typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('should not have accessibility violations', async () => {
  const { container } = render(<ComponentUnderTest />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
\`\`\`

### 2. Keyboard Navigation Tests
\`\`\`typescript
test('should be navigable with keyboard', async () => {
  const user = userEvent.setup()
  render(<InteractiveComponent />)
  
  await user.tab()
  expect(screen.getByRole('button')).toHaveFocus()
  
  await user.keyboard('{Enter}')
  await waitFor(() => {
    expect(mockAction).toHaveBeenCalled()
  })
})
\`\`\`

## PERFORMANCE TESTING

### 1. Load Time Tests
\`\`\`typescript
// /tests/performance/loadTime.test.ts
import { performance } from 'perf_hooks'

test('page should load within 2 seconds', async () => {
  const start = performance.now()
  render(<PageComponent />)
  const end = performance.now()
  
  expect(end - start).toBeLessThan(2000)
})
\`\`\`

### 2. Memory Leak Tests
\`\`\`typescript
test('should not leak memory on unmount', () => {
  const { unmount } = render(<ComponentWithEffects />)
  
  // Simulate multiple mount/unmount cycles
  for (let i = 0; i < 100; i++) {
    unmount()
    render(<ComponentWithEffects />)
  }
  
  // Check memory usage doesn't grow indefinitely
  expect(global.gc && global.gc()).toBeUndefined()
})
\`\`\`

## VISUAL REGRESSION TESTING

### 1. Storybook Stories
\`\`\`typescript
// /stories/${this.pascalCase(this.insight.features[0])}.stories.ts
export default {
  title: 'Features/${this.pascalCase(this.insight.features[0])}',
  component: ${this.pascalCase(this.insight.features[0])}Component,
} as Meta

export const Default = () => <${this.pascalCase(this.insight.features[0])}Component />
export const WithData = () => <${this.pascalCase(this.insight.features[0])}Component data={mockData} />
export const Loading = () => <${this.pascalCase(this.insight.features[0])}Component loading />
export const Error = () => <${this.pascalCase(this.insight.features[0])}Component error="Failed to load" />
\`\`\`

## ERROR BOUNDARY TESTING

### 1. Error Handling Tests
\`\`\`typescript
test('should handle API errors gracefully', async () => {
  server.use(
    rest.get('/api/${this.camelCase(this.insight.features[0])}', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: 'Server error' }))
    })
  )
  
  render(<ComponentThatFetchesData />)
  
  await waitFor(() => {
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument()
  })
})
\`\`\`

## TEST AUTOMATION

### 1. GitHub Actions Workflow
\`\`\`yaml
# /.github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:ci
      - run: npm run test:e2e
      - run: npm run lint
      - run: npm run type-check
\`\`\`

## OUTPUT DELIVERABLES
1. **Unit Tests**: \`/tests/components/\`, \`/tests/hooks/\`, \`/tests/services/\`
2. **Integration Tests**: \`/tests/integration/\`
3. **E2E Tests**: \`/tests/e2e/\`
4. **Performance Tests**: \`/tests/performance/\`
5. **Storybook Stories**: \`/stories/\`
6. **Test Configuration**: Jest, Testing Library, MSW setup
7. **CI/CD Pipeline**: GitHub Actions workflow

## SUCCESS CRITERIA
- 85%+ test coverage across all modules
- All tests pass in CI environment
- Zero accessibility violations
- Performance benchmarks met (<2s load time)
- Error scenarios properly handled
- Visual regression tests pass
- Memory leaks detected and fixed

Generate comprehensive test suites starting with the core ${this.insight.features[0]} feature, ensuring every user interaction is covered.`
  }

  // Helper methods
  private camelCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase())
  }

  private pascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase())
  }

  private generateFeatureStateDefinition(feature: string): string {
    const camelFeature = this.camelCase(feature)
    const pascalFeature = this.pascalCase(feature)
    
    return `### ${pascalFeature}State
\`\`\`typescript
interface ${pascalFeature}State {
  items: ${pascalFeature}[]
  currentItem: ${pascalFeature} | null
  filters: ${pascalFeature}Filters
  sortBy: ${pascalFeature}SortOptions
  pagination: PaginationState
  loading: boolean
  error: string | null
}
\`\`\``
  }

  private generateAPIServiceDefinition(feature: string): string {
    const camelFeature = this.camelCase(feature)
    const pascalFeature = this.pascalCase(feature)

    return `### ${pascalFeature}Service
\`\`\`typescript
// /lib/api/${camelFeature}Service.ts
export class ${pascalFeature}Service {
  static async getAll(params?: QueryParams): Promise<${pascalFeature}[]>
  static async getById(id: string): Promise<${pascalFeature}>
  static async create(data: Create${pascalFeature}Request): Promise<${pascalFeature}>
  static async update(id: string, data: Update${pascalFeature}Request): Promise<${pascalFeature}>
  static async delete(id: string): Promise<void>
  static async search(query: string): Promise<${pascalFeature}[]>
}
\`\`\``
  }

  private generateMockHandlers(feature: string): string {
    const camelFeature = this.camelCase(feature)
    
    return `  rest.get('/api/${camelFeature}', (req, res, ctx) => {
    return res(ctx.json({ success: true, data: mock${this.pascalCase(feature)}Data }))
  }),
  rest.post('/api/${camelFeature}', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ success: true, data: req.body }))
  })`
  }

  private generateBusinessRulesForFeatures(): string {
    return this.insight.features.map(feature => {
      const pascalFeature = this.pascalCase(feature)
      return `#### ${pascalFeature} Business Rules
- Validation: Required fields, format checks, business constraints
- Authorization: User permissions, role-based access
- Workflow: State transitions, approval processes
- Calculations: Metrics, aggregations, derived values`
    }).join('\n\n')
  }

  private generateComponentTestTemplate(feature: string): string {
    const pascalFeature = this.pascalCase(feature)
    
    return `### ${pascalFeature} Component Tests
\`\`\`typescript
// /tests/components/${pascalFeature}.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ${pascalFeature}Component } from '@/components/${pascalFeature}Component'

describe('${pascalFeature}Component', () => {
  test('should render with default props', () => {
    render(<${pascalFeature}Component />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
  
  test('should handle user interactions', async () => {
    const mockAction = jest.fn()
    render(<${pascalFeature}Component onAction={mockAction} />)
    
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled()
    })
  })
})
\`\`\``
  }

  private getZustandInstructions(): string {
    return `### Zustand Implementation
\`\`\`typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppStore extends AppState {
  // Actions
  ${this.insight.features.map(feature => {
    const camelFeature = this.camelCase(feature)
    return `  // ${this.pascalCase(feature)} actions
  add${this.pascalCase(feature)}: (item: New${this.pascalCase(feature)}) => Promise<void>
  update${this.pascalCase(feature)}: (id: string, updates: Partial<${this.pascalCase(feature)}>) => Promise<void>
  delete${this.pascalCase(feature)}: (id: string) => Promise<void>
  fetch${this.pascalCase(feature)}s: () => Promise<void>`
  }).join('\n  ')}
  
  // UI actions
  setLoading: (feature: string, loading: boolean) => void
  setError: (feature: string, error: string | null) => void
  addNotification: (notification: Notification) => void
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ${this.insight.features.map(feature => `${this.camelCase(feature)}: initial${this.pascalCase(feature)}State`).join(',\n        ')},
        loading: {},
        errors: {},
        notifications: [],
        
        // Actions implementation
        ${this.insight.features.map(feature => this.generateZustandActions(feature)).join(',\n        ')}
      }),
      { name: 'app-store' }
    )
  )
)
\`\`\``
  }

  private getContextInstructions(): string {
    return `### React Context Implementation
\`\`\`typescript
import { createContext, useContext, useReducer, ReactNode } from 'react'

// Action types
type AppAction = 
  ${this.insight.features.map(feature => `| { type: 'ADD_${feature.toUpperCase()}'; payload: ${this.pascalCase(feature)} }
  | { type: 'UPDATE_${feature.toUpperCase()}'; payload: { id: string; updates: Partial<${this.pascalCase(feature)}> } }
  | { type: 'DELETE_${feature.toUpperCase()}'; payload: string }`).join('\n  ')}
  | { type: 'SET_LOADING'; payload: { feature: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { feature: string; error: string | null } }

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    ${this.insight.features.map(feature => this.generateContextReducerCases(feature)).join('\n    ')}
    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
\`\`\``
  }

  private generateZustandActions(feature: string): string {
    const camelFeature = this.camelCase(feature)
    const pascalFeature = this.pascalCase(feature)
    
    return `add${pascalFeature}: async (item) => {
          set(state => ({ loading: { ...state.loading, ${camelFeature}: true } }))
          try {
            const newItem = await ${pascalFeature}Service.create(item)
            set(state => ({
              ${camelFeature}: {
                ...state.${camelFeature},
                items: [...state.${camelFeature}.items, newItem]
              },
              loading: { ...state.loading, ${camelFeature}: false }
            }))
          } catch (error) {
            set(state => ({ 
              errors: { ...state.errors, ${camelFeature}: error.message },
              loading: { ...state.loading, ${camelFeature}: false }
            }))
          }
        }`
  }

  private generateContextReducerCases(feature: string): string {
    const camelFeature = this.camelCase(feature)
    const upperFeature = feature.toUpperCase()
    
    return `case 'ADD_${upperFeature}':
      return {
        ...state,
        ${camelFeature}: {
          ...state.${camelFeature},
          items: [...state.${camelFeature}.items, action.payload]
        }
      }`
  }
}

export default AdvancedGeminiPromptGenerator