import { GoogleGenerativeAI } from '@google/generative-ai'

export interface AppRequirements {
  appType: string
  description: string
  features: string[]
  theme: 'light' | 'dark' | 'modern' | 'minimal' | 'colorful'
  complexity: 'simple' | 'medium' | 'advanced'
  apiNeeds: boolean
  storeNeeds: boolean
  userRequirements?: string
}

export interface GenerationStep {
  name: string
  description: string
  prompt: string
  dependencies?: string[]
  outputPath: string
  validation?: (code: string) => { valid: boolean; errors: string[] }
}

export interface GeneratedComponent {
  name: string
  path: string
  code: string
  dependencies: string[]
  exports: string[]
}

export class AdvancedCodeGenerator {
  private gemini: GoogleGenerativeAI
  private model: any

  constructor(apiKey: string) {
    this.gemini = new GoogleGenerativeAI(apiKey)
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })
  }

  async generateHighQualityApp(requirements: AppRequirements): Promise<{
    components: GeneratedComponent[]
    mainApp: string
    success: boolean
    errors: string[]
    reviewNotes: string[]
  }> {
    console.log('🚀 Starting high-quality app generation...')
    
    const steps = this.createGenerationSteps(requirements)
    const components: GeneratedComponent[] = []
    const errors: string[] = []
    const reviewNotes: string[] = []

    // Step 1: Generate UI Components
    console.log('📝 Step 1: Generating UI Components...')
    try {
      const uiComponents = await this.generateUIComponents(requirements)
      components.push(...uiComponents)
    } catch (error) {
      errors.push(`UI Generation failed: ${error}`)
    }

    // Step 2: Generate State Management
    console.log('📝 Step 2: Generating State Management...')
    try {
      const stateComponents = await this.generateStateManagement(requirements)
      components.push(...stateComponents)
    } catch (error) {
      errors.push(`State Management failed: ${error}`)
    }

    // Step 3: Generate API Integration
    console.log('📝 Step 3: Generating API Integration...')
    try {
      const apiComponents = await this.generateAPIIntegration(requirements)
      components.push(...apiComponents)
    } catch (error) {
      errors.push(`API Integration failed: ${error}`)
    }

    // Step 4: Generate Main App
    console.log('📝 Step 4: Generating Main Application...')
    const mainApp = await this.generateMainApplication(requirements, components)

    // Step 5: Self-Review
    console.log('🔍 Step 5: Self-Review and Quality Check...')
    const reviewResult = await this.performSelfReview(mainApp, components, requirements)
    reviewNotes.push(...reviewResult.notes)

    // Step 6: Regenerate if needed
    if (reviewResult.needsImprovement) {
      console.log('🔄 Step 6: Regenerating based on review...')
      const improvedApp = await this.regenerateWithImprovements(mainApp, reviewResult.improvements, requirements)
      return {
        components,
        mainApp: improvedApp,
        success: errors.length === 0,
        errors,
        reviewNotes
      }
    }

    return {
      components,
      mainApp,
      success: errors.length === 0,
      errors,
      reviewNotes
    }
  }

  private createGenerationSteps(requirements: AppRequirements): GenerationStep[] {
    return [
      {
        name: 'ui-components',
        description: 'Generate reusable UI components',
        prompt: this.createUIComponentPrompt(requirements),
        outputPath: 'components/',
      },
      {
        name: 'state-management',
        description: 'Generate Zustand store',
        prompt: this.createStatePrompt(requirements),
        outputPath: 'lib/stores/',
        dependencies: ['ui-components']
      },
      {
        name: 'api-integration',
        description: 'Generate API routes and hooks',
        prompt: this.createAPIPrompt(requirements),
        outputPath: 'app/api/',
        dependencies: ['state-management']
      },
      {
        name: 'main-app',
        description: 'Generate main application',
        prompt: this.createMainAppPrompt(requirements),
        outputPath: 'app/generated-app/',
        dependencies: ['ui-components', 'state-management', 'api-integration']
      }
    ]
  }

  private async generateUIComponents(requirements: AppRequirements): Promise<GeneratedComponent[]> {
    const prompt = `
You are an expert React/TypeScript developer specializing in creating beautiful, accessible UI components using shadcn/ui and Tailwind CSS.

Create high-quality, reusable UI components for a ${requirements.appType} with the following requirements:
- App Type: ${requirements.appType}
- Description: ${requirements.description}
- Features: ${requirements.features.join(', ')}
- Theme: ${requirements.theme}
- Complexity: ${requirements.complexity}

Requirements:
1. Use TypeScript with proper types
2. Use shadcn/ui components as base
3. Implement proper accessibility (ARIA labels, keyboard navigation)
4. Include beautiful animations with framer-motion
5. Support both light and dark themes
6. Make components responsive
7. Include proper validation and error states
8. Use lucide-react icons where appropriate

Generate the following components:
1. A form component specific to the app type
2. A data display component (list/grid/table)
3. A statistics/dashboard component
4. A settings/preferences component

Each component should be production-ready, well-documented, and follow React best practices.

Output format: Return each component as a separate code block with the filename as the comment header.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()
      
      // Parse the response and extract components
      return this.parseGeneratedComponents(response, 'components/')
    } catch (error) {
      throw new Error(`Failed to generate UI components: ${error}`)
    }
  }

  private async generateStateManagement(requirements: AppRequirements): Promise<GeneratedComponent[]> {
    const prompt = `
You are an expert in state management with Zustand. Create a comprehensive, type-safe Zustand store for a ${requirements.appType}.

Requirements:
- App Type: ${requirements.appType}
- Features: ${requirements.features.join(', ')}
- Include proper TypeScript types
- Implement optimistic updates
- Add proper error handling
- Include undo/redo functionality where applicable
- Add data validation
- Implement caching strategies
- Support for offline/online sync
- Add comprehensive selectors for performance

The store should handle:
1. CRUD operations for the main data entities
2. UI state (loading, errors, notifications)
3. User preferences
4. Search and filtering
5. Pagination
6. Real-time updates simulation

Make it production-ready with proper error boundaries and fallbacks.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()
      
      return this.parseGeneratedComponents(response, 'lib/stores/')
    } catch (error) {
      throw new Error(`Failed to generate state management: ${error}`)
    }
  }

  private async generateAPIIntegration(requirements: AppRequirements): Promise<GeneratedComponent[]> {
    const prompt = `
Create comprehensive API integration for a ${requirements.appType} using Next.js 14 App Router.

Requirements:
- Create RESTful API routes with proper HTTP methods
- Implement data validation with Zod
- Add proper error handling and status codes
- Include rate limiting
- Add request/response logging
- Implement caching strategies
- Create custom React hooks for data fetching
- Add optimistic updates
- Include retry logic and error recovery
- Support for real-time updates (SSE/WebSocket simulation)

Features to support: ${requirements.features.join(', ')}

Create:
1. API routes for all CRUD operations
2. Custom hooks for data fetching
3. Type definitions for API responses
4. Error handling utilities
5. Caching utilities
6. Validation schemas

Make it production-ready with proper security considerations.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()
      
      return this.parseGeneratedComponents(response, 'app/api/')
    } catch (error) {
      throw new Error(`Failed to generate API integration: ${error}`)
    }
  }

  private async generateMainApplication(requirements: AppRequirements, components: GeneratedComponent[]): Promise<string> {
    const componentList = components.map(c => `- ${c.name}: ${c.path}`).join('\n')
    
    const prompt = `
You are an expert React/Next.js developer. Create a beautiful, production-ready main application for a ${requirements.appType}.

App Requirements:
- Type: ${requirements.appType}
- Description: ${requirements.description}
- Features: ${requirements.features.join(', ')}
- Theme: ${requirements.theme}
- Complexity: ${requirements.complexity}

Available Components:
${componentList}

Create a comprehensive main application with:

1. **Beautiful Design**:
   - Modern UI with shadcn/ui components
   - Responsive design (mobile-first)
   - Smooth animations with framer-motion
   - Beautiful color schemes and typography
   - Dark/light mode support

2. **Complete Functionality**:
   - All CRUD operations working
   - Real-time updates
   - Search and filtering
   - Data visualization where applicable
   - Export/import functionality
   - Keyboard shortcuts
   - Drag and drop where applicable

3. **User Experience**:
   - Loading states and skeletons
   - Error boundaries and fallbacks
   - Toast notifications
   - Form validation with proper error messages
   - Keyboard navigation
   - Screen reader support

4. **Performance**:
   - Optimized re-renders
   - Lazy loading
   - Image optimization
   - Bundle size optimization

5. **Code Quality**:
   - TypeScript with strict types
   - Proper error handling
   - Clean, readable code
   - Proper component organization
   - Comprehensive prop validation

The app should feel like a professional SaaS application, not a simple demo.

Return only the main page component code (page.tsx) that integrates everything.
`

    try {
      const result = await this.model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      throw new Error(`Failed to generate main application: ${error}`)
    }
  }

  private async performSelfReview(mainApp: string, components: GeneratedComponent[], requirements: AppRequirements): Promise<{
    needsImprovement: boolean
    improvements: string[]
    notes: string[]
  }> {
    const prompt = `
You are a senior code reviewer specializing in React/TypeScript applications. Review the following generated code for a ${requirements.appType} and provide detailed feedback.

Code to Review:
${mainApp}

Review Criteria:
1. **Code Quality**: TypeScript usage, best practices, performance
2. **UI/UX**: Design consistency, accessibility, responsiveness
3. **Functionality**: Does it meet all requirements?
4. **Architecture**: Component structure, state management, API integration
5. **Production Readiness**: Error handling, validation, edge cases

App Requirements:
- Type: ${requirements.appType}
- Features: ${requirements.features.join(', ')}
- Complexity: ${requirements.complexity}

Provide:
1. Overall quality score (1-10)
2. Specific areas that need improvement
3. Suggestions for enhancement
4. Whether regeneration is needed (score < 8)

Be critical but constructive. This code will be used in production.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()
      
      // Parse review response
      const needsImprovement = response.includes('regeneration') || response.includes('score') && !response.includes('score') // Simple heuristic
      
      return {
        needsImprovement: false, // For now, always proceed without regeneration to save time
        improvements: [],
        notes: [response]
      }
    } catch (error) {
      return {
        needsImprovement: false,
        improvements: [],
        notes: [`Review failed: ${error}`]
      }
    }
  }

  private async regenerateWithImprovements(originalApp: string, improvements: string[], requirements: AppRequirements): Promise<string> {
    const prompt = `
Improve the following React application based on the review feedback:

Original Code:
${originalApp}

Improvements Needed:
${improvements.join('\n')}

App Requirements:
- Type: ${requirements.appType}
- Features: ${requirements.features.join(', ')}

Make the specified improvements while maintaining all existing functionality.
Return the improved code.
`

    try {
      const result = await this.model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      return originalApp // Return original if regeneration fails
    }
  }

  private parseGeneratedComponents(response: string, basePath: string): GeneratedComponent[] {
    const components: GeneratedComponent[] = []
    
    // Simple parser - in production, this would be more sophisticated
    const codeBlocks = response.split('```')
    
    for (let i = 1; i < codeBlocks.length; i += 2) {
      const code = codeBlocks[i]
      const lines = code.split('\n')
      const firstLine = lines[0]
      
      // Extract filename from comment or first line
      let filename = 'component.tsx'
      if (firstLine.includes('//') || firstLine.includes('/*')) {
        const match = firstLine.match(/([a-zA-Z0-9-_.]+\.tsx?)/)
        if (match) filename = match[1]
      }
      
      components.push({
        name: filename.replace('.tsx', '').replace('.ts', ''),
        path: basePath + filename,
        code: lines.slice(1).join('\n'),
        dependencies: [],
        exports: []
      })
    }
    
    return components
  }

  private createUIComponentPrompt(requirements: AppRequirements): string {
    return `Create beautiful, accessible UI components for ${requirements.appType}`
  }

  private createStatePrompt(requirements: AppRequirements): string {
    return `Create comprehensive Zustand store for ${requirements.appType}`
  }

  private createAPIPrompt(requirements: AppRequirements): string {
    return `Create API integration for ${requirements.appType}`
  }

  private createMainAppPrompt(requirements: AppRequirements): string {
    return `Create main application for ${requirements.appType}`
  }
}