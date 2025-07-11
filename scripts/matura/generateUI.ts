import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AppStructure } from './generateStructure'

interface UIGenerationConfig {
  structure: AppStructure
  figmaTemplate?: string
  style: 'modern' | 'minimal' | 'corporate' | 'playful'
  darkMode: boolean
}

export class UIGenerator {
  private gemini: GoogleGenerativeAI

  constructor(apiKey: string) {
    this.gemini = new GoogleGenerativeAI(apiKey)
  }

  async generatePage(pageName: string, pageConfig: any, config: UIGenerationConfig): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Generate a Next.js page component with these requirements:

Page: ${pageName}
Route: ${pageConfig.route}
Components: ${pageConfig.components.join(', ')}
Style: ${config.style}
Dark Mode: ${config.darkMode}

Requirements:
- Use TypeScript
- Import shadcn/ui components
- Use Tailwind CSS
- Make it fully responsive
- Include proper accessibility
- Use 'use client' directive
- Import from '@/components/ui/*'

Theme:
${JSON.stringify(config.structure.theme, null, 2)}

Generate only the complete page.tsx code without any explanations.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let code = response.text()

    // Clean up code
    code = code.replace(/```typescript|```tsx|```jsx|```/g, '').trim()
    
    return code
  }

  async generateComponent(componentName: string, requirements: string, config: UIGenerationConfig): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Generate a React component with these specifications:

Component: ${componentName}
Requirements: ${requirements}
Style: ${config.style}

Use:
- TypeScript with proper types
- shadcn/ui components where applicable
- Tailwind CSS for styling
- framer-motion for animations
- Responsive design patterns
- Accessibility best practices

Available shadcn components: Button, Card, Input, Select, Dialog, Tabs, Badge, Alert

Generate only the component code.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let code = response.text()

    code = code.replace(/```typescript|```tsx|```jsx|```/g, '').trim()
    
    return code
  }

  async generateLayout(config: UIGenerationConfig): Promise<string> {
    const hasAuth = config.structure.features.some(f => 
      f.toLowerCase().includes('auth') || 
      f.toLowerCase().includes('login')
    )

    const prompt = `
Generate a Next.js layout.tsx with:

App Type: ${config.structure.appType}
Features: ${config.structure.features.join(', ')}
Has Auth: ${hasAuth}
Style: ${config.style}

Include:
- Proper metadata
- Font imports
- Global providers if needed
- Theme provider for dark mode
- Responsive navigation if applicable

Generate complete layout.tsx code only.
`

    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    
    return response.text().replace(/```typescript|```tsx|```jsx|```/g, '').trim()
  }

  async generateAllUI(config: UIGenerationConfig): Promise<Map<string, string>> {
    const files = new Map<string, string>()

    // Generate layout
    console.log('🎨 Generating layout...')
    const layout = await this.generateLayout(config)
    files.set('app/generated-app/layout.tsx', layout)

    // Generate pages
    for (const [pageName, pageConfig] of Object.entries(config.structure.pages)) {
      console.log(`📄 Generating page: ${pageName}...`)
      const pageCode = await this.generatePage(pageName, pageConfig, config)
      
      const filePath = pageConfig.route === '/' 
        ? 'app/generated-app/page.tsx'
        : `app/generated-app/${pageName}/page.tsx`
      
      files.set(filePath, pageCode)
    }

    // Generate custom components
    for (const component of config.structure.uiComponents.custom) {
      console.log(`🧩 Generating component: ${component}...`)
      const componentCode = await this.generateComponent(
        component,
        `Component for ${config.structure.appType} app`,
        config
      )
      files.set(`app/generated-app/components/${component}.tsx`, componentCode)
    }

    return files
  }

  async installShadcnComponents(components: string[]): Promise<void> {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    console.log('📦 Installing shadcn/ui components...')
    
    for (const component of components) {
      try {
        console.log(`  Installing ${component}...`)
        await execAsync(`npx shadcn-ui@latest add ${component} --yes`)
      } catch (error) {
        console.warn(`  ⚠️  Failed to install ${component}:`, error)
      }
    }
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

  const generator = new UIGenerator(process.env.GEMINI_API_KEY!)
  
  const config: UIGenerationConfig = {
    structure,
    style: 'modern',
    darkMode: true
  }

  console.log('🚀 Starting UI generation...')
  const files = await generator.generateAllUI(config)
  
  console.log('💾 Saving files...')
  await generator.saveFiles(files)
  
  console.log('📦 Installing components...')
  await generator.installShadcnComponents(structure.uiComponents.shadcn)
  
  console.log('✅ UI generation complete!')
}

if (require.main === module) {
  main().catch(console.error)
}