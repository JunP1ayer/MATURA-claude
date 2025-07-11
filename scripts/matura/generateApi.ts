import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AppStructure } from './generateStructure'

interface APIEndpoint {
  route: string
  methods: string[]
  entity?: string
  description: string
}

export class APIGenerator {
  private gemini: GoogleGenerativeAI

  constructor(apiKey: string) {
    this.gemini = new GoogleGenerativeAI(apiKey)
  }

  async generateAPIRoute(endpoint: APIEndpoint, structure: AppStructure): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Generate a Next.js API route handler for:

Route: ${endpoint.route}
Methods: ${endpoint.methods.join(', ')}
Entity: ${endpoint.entity || 'general'}
Description: ${endpoint.description}

Requirements:
- Use Next.js 14 App Router API format
- TypeScript with proper types
- Include request validation
- Error handling with proper status codes
- Mock data for development
- CORS headers if needed
- Rate limiting comments
- Input sanitization

Generate only the route.ts file content.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let code = response.text()

    code = code.replace(/```typescript|```ts|```/g, '').trim()
    
    return code
  }

  async generateMockData(structure: AppStructure): Promise<Map<string, string>> {
    const mockData = new Map<string, string>()
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    for (const entity of structure.state.entities) {
      const prompt = `
Generate realistic mock data for ${entity} entity.

App Type: ${structure.appType}
Features: ${structure.features.join(', ')}

Requirements:
- TypeScript array of 10-20 items
- Realistic data in Japanese where appropriate
- Include all necessary fields
- Use consistent IDs
- Varied but realistic values

Generate only the mock data array.
`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const code = response.text().replace(/```typescript|```ts|```/g, '').trim()
      
      mockData.set(`${entity}.mock.ts`, code)
    }

    return mockData
  }

  async generateMiddleware(structure: AppStructure): Promise<Map<string, string>> {
    const middleware = new Map<string, string>()
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    // Auth middleware
    if (structure.features.some(f => f.toLowerCase().includes('auth'))) {
      const authMiddleware = await this.generateAuthMiddleware()
      middleware.set('auth.ts', authMiddleware)
    }

    // Validation middleware
    const validationMiddleware = await this.generateValidationMiddleware(structure)
    middleware.set('validation.ts', validationMiddleware)

    // Rate limiting
    const rateLimitMiddleware = await this.generateRateLimitMiddleware()
    middleware.set('rateLimit.ts', rateLimitMiddleware)

    return middleware
  }

  private async generateAuthMiddleware(): Promise<string> {
    const prompt = `
Generate authentication middleware for Next.js API routes.

Include:
- JWT token validation
- Session checking
- Role-based access control
- TypeScript types
- Error responses

Generate only the middleware function.
`

    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    
    return result.response.text().replace(/```typescript|```ts|```/g, '').trim()
  }

  private async generateValidationMiddleware(structure: AppStructure): Promise<string> {
    const prompt = `
Generate validation middleware using Zod for these entities:
${structure.state.entities.join(', ')}

Include:
- Request body validation
- Query parameter validation
- Type inference
- Error formatting

Generate the complete validation middleware.
`

    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    
    return result.response.text().replace(/```typescript|```ts|```/g, '').trim()
  }

  private async generateRateLimitMiddleware(): Promise<string> {
    const prompt = `
Generate rate limiting middleware for Next.js API routes.

Include:
- IP-based rate limiting
- Configurable limits
- Redis integration comments
- TypeScript types

Generate only the middleware function.
`

    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    
    return result.response.text().replace(/```typescript|```ts|```/g, '').trim()
  }

  async generateAllAPIs(structure: AppStructure): Promise<Map<string, string>> {
    const files = new Map<string, string>()

    // Define endpoints based on entities
    const endpoints: APIEndpoint[] = []
    
    for (const entity of structure.state.entities) {
      endpoints.push({
        route: `/api/${entity}`,
        methods: ['GET', 'POST'],
        entity,
        description: `CRUD operations for ${entity}`
      })
      
      endpoints.push({
        route: `/api/${entity}/[id]`,
        methods: ['GET', 'PUT', 'DELETE'],
        entity,
        description: `Single ${entity} operations`
      })
    }

    // Add custom endpoints based on features
    if (structure.features.some(f => f.toLowerCase().includes('search'))) {
      endpoints.push({
        route: '/api/search',
        methods: ['GET'],
        description: 'Search across entities'
      })
    }

    // Generate API routes
    for (const endpoint of endpoints) {
      console.log(`🔌 Generating API: ${endpoint.route}...`)
      const code = await this.generateAPIRoute(endpoint, structure)
      
      const filePath = endpoint.route.includes('[id]')
        ? `app${endpoint.route.replace('[id]', '[id]/route.ts')}`
        : `app${endpoint.route}/route.ts`
      
      files.set(filePath, code)
    }

    // Generate mock data
    console.log('🎲 Generating mock data...')
    const mockData = await this.generateMockData(structure)
    for (const [filename, code] of mockData) {
      files.set(`app/generated-app/data/${filename}`, code)
    }

    // Generate middleware
    console.log('🛡️ Generating middleware...')
    const middleware = await this.generateMiddleware(structure)
    for (const [filename, code] of middleware) {
      files.set(`app/generated-app/middleware/${filename}`, code)
    }

    return files
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

  const generator = new APIGenerator(process.env.GEMINI_API_KEY!)
  
  console.log('🚀 Starting API generation...')
  const files = await generator.generateAllAPIs(structure)
  
  console.log('💾 Saving files...')
  await generator.saveFiles(files)
  
  console.log('✅ API generation complete!')
}

if (require.main === module) {
  main().catch(console.error)
}