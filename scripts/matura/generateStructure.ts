import OpenAI from 'openai'

interface AppStructure {
  appType: 'landing' | 'dashboard' | 'ecommerce' | 'blog' | 'saas' | 'portfolio'
  features: string[]
  pages: {
    [key: string]: {
      route: string
      components: string[]
      meta?: {
        title: string
        description: string
      }
    }
  }
  state: {
    entities: string[]
    actions: string[]
    stores: {
      [key: string]: {
        state: Record<string, any>
        actions: string[]
      }
    }
  }
  apis: {
    routes: string[]
    methods: string[]
    mockData: boolean
  }
  packages: string[]
  uiComponents: {
    shadcn: string[]
    custom: string[]
  }
  theme: {
    colors: Record<string, string>
    fonts: {
      heading: string
      body: string
    }
  }
}

export class StructureGenerator {
  private openai: OpenAI

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })
  }

  async generateStructure(userInput: string): Promise<AppStructure> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert app structure analyzer. Analyze user requirements and generate a comprehensive app structure JSON.`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      functions: [
        {
          name: "generateAppStructure",
          description: "Generate complete app structure from natural language",
          parameters: {
            type: "object",
            properties: {
              appType: {
                type: "string",
                enum: ["landing", "dashboard", "ecommerce", "blog", "saas", "portfolio"],
                description: "Type of application"
              },
              features: {
                type: "array",
                items: { type: "string" },
                description: "List of main features"
              },
              pages: {
                type: "object",
                description: "Page structure with routes and components"
              },
              state: {
                type: "object",
                properties: {
                  entities: {
                    type: "array",
                    items: { type: "string" }
                  },
                  actions: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              },
              apis: {
                type: "object",
                properties: {
                  routes: {
                    type: "array",
                    items: { type: "string" }
                  },
                  methods: {
                    type: "array",
                    items: { type: "string" }
                  },
                  mockData: { type: "boolean" }
                }
              },
              packages: {
                type: "array",
                items: { type: "string" },
                description: "Required npm packages"
              },
              uiComponents: {
                type: "object",
                properties: {
                  shadcn: {
                    type: "array",
                    items: { type: "string" }
                  },
                  custom: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              },
              theme: {
                type: "object",
                properties: {
                  colors: { type: "object" },
                  fonts: { type: "object" }
                }
              }
            },
            required: ["appType", "features", "pages", "state", "apis", "packages"]
          }
        }
      ],
      function_call: { name: "generateAppStructure" }
    })

    const functionCall = completion.choices[0].message.function_call
    if (!functionCall) {
      throw new Error('Function call failed')
    }

    return JSON.parse(functionCall.arguments)
  }

  async analyzeWithFigma(structure: AppStructure, figmaUrl?: string): Promise<AppStructure> {
    if (!figmaUrl) return structure

    const figmaPrompt = `
    Given this Figma design: ${figmaUrl}
    And this app structure: ${JSON.stringify(structure)}
    
    Update the structure to match the Figma design:
    - Extract color palette
    - Identify UI components
    - Map sections to pages
    - Define responsive breakpoints
    `

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: figmaPrompt
        }
      ]
    })

    // Merge Figma insights with structure
    return structure
  }

  validateStructure(structure: AppStructure): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!structure.appType) {
      errors.push('App type is required')
    }

    if (!structure.features || structure.features.length === 0) {
      errors.push('At least one feature is required')
    }

    if (!structure.pages || Object.keys(structure.pages).length === 0) {
      errors.push('At least one page is required')
    }

    const requiredPackages = ['next', 'react', 'react-dom', 'typescript']
    const missingPackages = requiredPackages.filter(pkg => !structure.packages.includes(pkg))
    if (missingPackages.length > 0) {
      errors.push(`Missing required packages: ${missingPackages.join(', ')}`)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  async saveStructure(structure: AppStructure, outputPath: string = './app-structure.json') {
    const fs = await import('fs/promises')
    await fs.writeFile(outputPath, JSON.stringify(structure, null, 2))
    console.log(`Structure saved to ${outputPath}`)
  }
}

// 実行例
async function main() {
  const generator = new StructureGenerator(process.env.OPENAI_API_KEY!)
  
  const userInput = "タスク管理アプリを作って。ドラッグ&ドロップでタスクを移動できて、期限とラベルを設定できるようにして。"
  
  console.log('🔍 Analyzing requirements...')
  const structure = await generator.generateStructure(userInput)
  
  console.log('✅ Structure generated:')
  console.log(JSON.stringify(structure, null, 2))
  
  const validation = generator.validateStructure(structure)
  if (!validation.valid) {
    console.error('❌ Validation errors:', validation.errors)
    process.exit(1)
  }
  
  await generator.saveStructure(structure)
}

if (require.main === module) {
  main().catch(console.error)
}