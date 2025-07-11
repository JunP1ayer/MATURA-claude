#!/usr/bin/env node

import { StructureGenerator } from './generateStructure'
import { UIGenerator } from './generateUI'
import { StateGenerator } from './generateState'
import { APIGenerator } from './generateApi'
import { exec } from 'child_process'
import { promisify } from 'util'
import { GoogleGenerativeAI } from '@google/generative-ai'

const execAsync = promisify(exec)

interface GenerationResult {
  success: boolean
  errors: string[]
  warnings: string[]
}

class MATURAGenerator {
  private structureGen: StructureGenerator
  private uiGen: UIGenerator
  private stateGen: StateGenerator
  private apiGen: APIGenerator
  private gemini: GoogleGenerativeAI
  private maxRetries = 3

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    if (!openaiKey || !geminiKey) {
      throw new Error('Missing API keys. Set OPENAI_API_KEY and GEMINI_API_KEY')
    }

    this.structureGen = new StructureGenerator(openaiKey)
    this.uiGen = new UIGenerator(geminiKey)
    this.stateGen = new StateGenerator(geminiKey)
    this.apiGen = new APIGenerator(geminiKey)
    this.gemini = new GoogleGenerativeAI(geminiKey)
  }

  async generate(userInput: string, figmaUrl?: string): Promise<void> {
    console.log('🚀 MATURA Generation Starting...')
    console.log(`📝 User Input: "${userInput}"`)
    
    try {
      // Phase 1: Structure Generation
      console.log('\n📊 Phase 1: Analyzing Requirements...')
      const structure = await this.structureGen.generateStructure(userInput)
      
      if (figmaUrl) {
        console.log('🎨 Integrating Figma design...')
        await this.structureGen.analyzeWithFigma(structure, figmaUrl)
      }
      
      await this.structureGen.saveStructure(structure)

      // Phase 2: UI Generation
      console.log('\n🎨 Phase 2: Generating UI...')
      const uiFiles = await this.uiGen.generateAllUI({
        structure,
        style: 'modern',
        darkMode: true
      })
      await this.uiGen.saveFiles(uiFiles)

      // Phase 3: State Management
      console.log('\n🏪 Phase 3: Generating State Management...')
      const stateFiles = await this.stateGen.generateStateManagement(structure)
      await this.stateGen.saveFiles(stateFiles)

      // Phase 4: API Generation
      console.log('\n🔌 Phase 4: Generating APIs...')
      const apiFiles = await this.apiGen.generateAllAPIs(structure)
      await this.apiGen.saveFiles(apiFiles)

      // Phase 5: Integration & Validation
      console.log('\n🔧 Phase 5: Integration & Validation...')
      await this.integrateAndValidate()

      console.log('\n✅ Generation Complete!')
      console.log('📁 Output: /app/generated-app')
      console.log('🚀 Run: cd app/generated-app && npm run dev')

    } catch (error) {
      console.error('❌ Generation failed:', error)
      throw error
    }
  }

  private async integrateAndValidate(): Promise<void> {
    let retries = 0
    let success = false

    while (retries < this.maxRetries && !success) {
      const result = await this.validate()
      
      if (result.success) {
        success = true
      } else {
        console.log(`\n🔧 Attempting self-repair (${retries + 1}/${this.maxRetries})...`)
        await this.selfRepair(result.errors)
        retries++
      }
    }

    if (!success) {
      throw new Error('Failed to generate valid application after ' + this.maxRetries + ' attempts')
    }
  }

  private async validate(): Promise<GenerationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    console.log('  🔍 Running TypeScript check...')
    try {
      await execAsync('cd app/generated-app && npx tsc --noEmit')
      console.log('  ✅ TypeScript check passed')
    } catch (error: any) {
      console.log('  ❌ TypeScript errors found')
      errors.push(error.stdout || error.message)
    }

    console.log('  🔍 Running ESLint...')
    try {
      await execAsync('cd app/generated-app && npx eslint . --fix')
      console.log('  ✅ ESLint check passed')
    } catch (error: any) {
      console.log('  ⚠️  ESLint warnings')
      warnings.push(error.stdout || error.message)
    }

    console.log('  🔍 Checking imports...')
    const importErrors = await this.checkImports()
    errors.push(...importErrors)

    return {
      success: errors.length === 0,
      errors,
      warnings
    }
  }

  private async checkImports(): Promise<string[]> {
    const errors: string[] = []
    
    try {
      // Check for missing packages
      const { stdout } = await execAsync('cd app/generated-app && npm ls --depth=0 --json')
      const deps = JSON.parse(stdout)
      
      // Common missing imports
      const requiredPackages = ['zustand', 'framer-motion', '@radix-ui/react-*']
      
      for (const pkg of requiredPackages) {
        if (!deps.dependencies[pkg]) {
          errors.push(`Missing package: ${pkg}`)
        }
      }
    } catch (error) {
      // Ignore npm ls errors
    }

    return errors
  }

  private async selfRepair(errors: string[]): Promise<void> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' })

    for (const error of errors) {
      console.log(`  🔧 Fixing: ${error.substring(0, 100)}...`)

      const prompt = `
Fix this error in a Next.js TypeScript application:

Error:
${error}

Provide only the corrected code or the command to fix it.
If it's a missing import, provide the npm install command.
If it's a code error, provide the corrected code snippet.
`

      try {
        const result = await model.generateContent(prompt)
        const fix = result.response.text()

        // Apply fix
        if (fix.includes('npm install')) {
          const command = fix.match(/npm install [^\n]+/)?.[0]
          if (command) {
            console.log(`  📦 Running: ${command}`)
            await execAsync(`cd app/generated-app && ${command}`)
          }
        } else {
          // Apply code fix (would need more sophisticated logic here)
          console.log('  📝 Code fix suggested (manual intervention may be needed)')
        }
      } catch (error) {
        console.error('  ❌ Failed to generate fix:', error)
      }
    }
  }

  async installDependencies(): Promise<void> {
    console.log('\n📦 Installing dependencies...')
    
    const packages = [
      'zustand',
      'framer-motion',
      'zod',
      'lucide-react',
      '@tanstack/react-query',
      'react-hook-form',
      '@hookform/resolvers'
    ]

    try {
      await execAsync(`cd app/generated-app && npm install ${packages.join(' ')}`)
      console.log('✅ Dependencies installed')
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error)
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
🚀 MATURA - Natural Language App Generator

Usage:
  matura "your app description"
  matura "your app description" --figma="figma_url"

Examples:
  matura "タスク管理アプリを作って"
  matura "ECサイトを作って。商品一覧と買い物かご機能付き"
  matura "ブログサイト" --figma="https://figma.com/..."
`)
    process.exit(0)
  }

  const userInput = args[0]
  const figmaUrl = args.find(arg => arg.startsWith('--figma='))?.split('=')[1]

  const generator = new MATURAGenerator()
  
  try {
    await generator.generate(userInput, figmaUrl)
    await generator.installDependencies()
  } catch (error) {
    console.error('\n❌ Generation failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { MATURAGenerator }