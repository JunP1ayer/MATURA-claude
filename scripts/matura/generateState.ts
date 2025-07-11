import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AppStructure } from './generateStructure'

export class StateGenerator {
  private gemini: GoogleGenerativeAI

  constructor(apiKey: string) {
    this.gemini = new GoogleGenerativeAI(apiKey)
  }

  async generateStore(structure: AppStructure): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Generate a Zustand store for this app structure:

App Type: ${structure.appType}
Entities: ${structure.state.entities.join(', ')}
Actions: ${structure.state.actions.join(', ')}

Requirements:
- Use TypeScript with proper interfaces
- Include all CRUD operations for entities
- Add async actions with loading states
- Include error handling
- Add persistence with localStorage
- Use immer for immutable updates
- Include selectors for computed values

Generate only the complete store code with these imports:
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

Output format should be a single store file.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let code = response.text()

    code = code.replace(/```typescript|```ts|```/g, '').trim()
    
    return code
  }

  async generateHooks(structure: AppStructure): Promise<Map<string, string>> {
    const hooks = new Map<string, string>()
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    // Generate hooks for each entity
    for (const entity of structure.state.entities) {
      const prompt = `
Generate a custom React hook for managing ${entity} entity.

Include:
- TypeScript types
- CRUD operations using the store
- Loading and error states
- Optimistic updates
- Data validation
- Memoization where needed

Import from '../store' for the store.

Generate only the hook code.
`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const code = response.text().replace(/```typescript|```ts|```/g, '').trim()
      
      hooks.set(`use${entity.charAt(0).toUpperCase() + entity.slice(1)}.ts`, code)
    }

    return hooks
  }

  async generateTypes(structure: AppStructure): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Generate TypeScript type definitions for:

App Type: ${structure.appType}
Entities: ${structure.state.entities.join(', ')}
Features: ${structure.features.join(', ')}

Include:
- Entity interfaces with all necessary fields
- API response types
- Form input types
- Error types
- Common utility types

Generate a complete types.ts file.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    
    return response.text().replace(/```typescript|```ts|```/g, '').trim()
  }

  async generateStateManagement(structure: AppStructure): Promise<Map<string, string>> {
    const files = new Map<string, string>()

    console.log('🏪 Generating Zustand store...')
    const store = await this.generateStore(structure)
    files.set('app/generated-app/store/index.ts', store)

    console.log('📝 Generating TypeScript types...')
    const types = await this.generateTypes(structure)
    files.set('app/generated-app/types/index.ts', types)

    console.log('🪝 Generating custom hooks...')
    const hooks = await this.generateHooks(structure)
    for (const [filename, code] of hooks) {
      files.set(`app/generated-app/hooks/${filename}`, code)
    }

    // Generate store provider if needed
    if (structure.appType === 'dashboard' || structure.appType === 'saas') {
      const provider = await this.generateStoreProvider(structure)
      files.set('app/generated-app/providers/StoreProvider.tsx', provider)
    }

    return files
  }

  private async generateStoreProvider(structure: AppStructure): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Generate a React context provider for the Zustand store.

Include:
- Store initialization
- Hydration handling for SSR
- TypeScript types
- Children prop

Use 'use client' directive.

Generate only the provider component.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    
    return response.text().replace(/```typescript|```tsx|```/g, '').trim()
  }

  async saveFiles(files: Map<string, string>): Promise<void> {
    const fs = await import('fs/promises')
    const path = await import('path')

    for (const [filePath, content] of files) {
      const fullPath = path.join(process.cwd(), filePath)
      const dir = path.dirname(fullPath)
      
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(fullPath, content, 'utf-8')
      console.log(`✅ Created: ${filePath}`)
    }
  }
}

// 実行例
async function main() {
  const structure: AppStructure = JSON.parse(
    await (await import('fs/promises')).readFile('./app-structure.json', 'utf-8')
  )

  const generator = new StateGenerator(process.env.GEMINI_API_KEY!)
  
  console.log('🚀 Starting state management generation...')
  const files = await generator.generateStateManagement(structure)
  
  console.log('💾 Saving files...')
  await generator.saveFiles(files)
  
  console.log('✅ State management generation complete!')
}

if (require.main === module) {
  main().catch(console.error)
}