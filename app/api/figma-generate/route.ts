import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface FigmaGenerateRequest {
  figmaUrl?: string
  fileId?: string
  userRequirement?: string
  appType?: string
  generateType?: 'full' | 'ui' | 'structure'
}

export async function POST(request: NextRequest) {
  try {
    const { 
      figmaUrl, 
      fileId, 
      userRequirement, 
      appType = 'webapp',
      generateType = 'full'
    } = await request.json() as FigmaGenerateRequest

    if (!figmaUrl && !fileId) {
      return NextResponse.json(
        { error: 'figmaUrl or fileId is required' },
        { status: 400 }
      )
    }

    console.log('🚀 Starting Figma-based generation...')
    console.log('📁 Figma URL:', figmaUrl)
    console.log('🎯 App Type:', appType)
    console.log('🔧 Generate Type:', generateType)

    // Step 1: Fetch Figma data
    console.log('🎨 Step 1: Fetching Figma data...')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const figmaResponse = await fetch(`${baseUrl}/api/figma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fileId,
        fileUrl: figmaUrl 
      })
    })

    if (!figmaResponse.ok) {
      throw new Error(`Failed to fetch Figma data: ${figmaResponse.statusText}`)
    }

    const figmaData = await figmaResponse.json()
    console.log('✅ Figma data fetched successfully')

    // Step 2: Generate structure from Figma
    console.log('🏗️  Step 2: Generating structure...')
    const structureResponse = await fetch(`${baseUrl}/api/structure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        figmaData: figmaData.data,
        userRequirement,
        appType
      })
    })

    if (!structureResponse.ok) {
      throw new Error(`Failed to generate structure: ${structureResponse.statusText}`)
    }

    const structureData = await structureResponse.json()
    console.log('✅ Structure generated successfully')

    if (generateType === 'structure') {
      return NextResponse.json({
        success: true,
        data: structureData.data,
        step: 'structure_only'
      })
    }

    // Step 3: Generate UI code
    console.log('🎨 Step 3: Generating UI code...')
    const uiCode = await generateUIFromStructure(structureData.data.structure, figmaData.data)
    console.log('✅ UI code generated successfully')

    if (generateType === 'ui') {
      return NextResponse.json({
        success: true,
        data: {
          structure: structureData.data.structure,
          ui: uiCode
        },
        step: 'ui_only'
      })
    }

    // Step 4: Save generated files
    console.log('💾 Step 4: Saving generated files...')
    await saveGeneratedFiles(uiCode, structureData.data.structure)
    console.log('✅ Files saved successfully')

    // Step 5: Validate generated code
    console.log('🔍 Step 5: Validating code...')
    const validationResult = await validateGeneratedCode()
    console.log('✅ Code validation completed')

    return NextResponse.json({
      success: true,
      data: {
        structure: structureData.data.structure,
        ui: uiCode,
        validation: validationResult,
        figmaAnalysis: structureData.data.figmaAnalysis
      },
      generated: {
        pages: Object.keys(uiCode.pages).length,
        components: Object.keys(uiCode.components).length,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ Figma generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate from Figma', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

async function generateUIFromStructure(structure: any, figmaData: any) {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const genAI = new GoogleGenerativeAI(geminiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const pages: Record<string, string> = {}
  const components: Record<string, string> = {}

  // Generate pages
  for (const page of structure.pages || []) {
    const pagePrompt = `
Generate a Next.js page component based on this structure:

Page: ${page.name}
Route: ${page.route}
Components: ${page.components.join(', ')}
Layout: ${page.layout}

Design System:
${JSON.stringify(structure.designSystem, null, 2)}

Figma Data:
${JSON.stringify(figmaData.structure?.screens || [], null, 2)}

Requirements:
- Use TypeScript
- Use shadcn/ui components
- Use Tailwind CSS with extracted colors
- Make it responsive
- Include 'use client' directive
- Match Figma design as closely as possible
- Use extracted fonts and spacing
- Implement proper accessibility

Generate only the complete page component code.
`

    const result = await model.generateContent(pagePrompt)
    const response = await result.response
    let code = response.text()

    // Clean up code
    code = code.replace(/```typescript|```tsx|```jsx|```/g, '').trim()
    if (!code.startsWith("'use client'")) {
      code = "'use client'\n\n" + code
    }

    pages[page.name] = code
  }

  // Generate components
  for (const component of structure.components || []) {
    const componentPrompt = `
Generate a React component based on this Figma component:

Component: ${component.name}
Type: ${component.type}
Props: ${component.props?.join(', ') || 'none'}

Design System:
${JSON.stringify(structure.designSystem, null, 2)}

Requirements:
- Use TypeScript with proper types
- Use shadcn/ui components where applicable
- Use Tailwind CSS
- Make it reusable
- Include proper props interface
- Match Figma design

Generate only the component code.
`

    const result = await model.generateContent(componentPrompt)
    const response = await result.response
    let code = response.text()

    code = code.replace(/```typescript|```tsx|```jsx|```/g, '').trim()
    components[component.name] = code
  }

  return { pages, components }
}

async function saveGeneratedFiles(uiCode: any, structure: any) {
  const fs = await import('fs/promises')
  const path = await import('path')

  // Ensure directories exist
  const baseDir = path.join(process.cwd(), 'app', 'generated-app')
  const componentsDir = path.join(baseDir, 'components')
  
  await fs.mkdir(baseDir, { recursive: true })
  await fs.mkdir(componentsDir, { recursive: true })

  // Save pages
  for (const [pageName, code] of Object.entries(uiCode.pages)) {
    const filePath = pageName === 'HomePage' 
      ? path.join(baseDir, 'page.tsx')
      : path.join(baseDir, `${pageName.toLowerCase()}`, 'page.tsx')
    
    if (pageName !== 'HomePage') {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
    }
    
    await fs.writeFile(filePath, code as string, 'utf-8')
    console.log(`✅ Saved: ${filePath}`)
  }

  // Save components
  for (const [componentName, code] of Object.entries(uiCode.components)) {
    const filePath = path.join(componentsDir, `${componentName}.tsx`)
    await fs.writeFile(filePath, code as string, 'utf-8')
    console.log(`✅ Saved: ${filePath}`)
  }

  // Save structure JSON
  const structurePath = path.join(baseDir, 'structure.json')
  await fs.writeFile(structurePath, JSON.stringify(structure, null, 2), 'utf-8')
  console.log(`✅ Saved: ${structurePath}`)

  // Generate layout if needed
  if (structure.navigation) {
    const layoutCode = await generateLayout(structure)
    const layoutPath = path.join(baseDir, 'layout.tsx')
    await fs.writeFile(layoutPath, layoutCode, 'utf-8')
    console.log(`✅ Saved: ${layoutPath}`)
  }
}

async function generateLayout(structure: any): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const genAI = new GoogleGenerativeAI(geminiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const layoutPrompt = `
Generate a Next.js layout.tsx based on this structure:

Navigation: ${JSON.stringify(structure.navigation, null, 2)}
App Name: ${structure.app.name}
Design System: ${JSON.stringify(structure.designSystem, null, 2)}

Requirements:
- Include proper metadata
- Implement navigation based on structure
- Use extracted fonts and colors
- Include theme provider if needed
- Make it responsive
- Include proper TypeScript types

Generate only the layout.tsx code.
`

  const result = await model.generateContent(layoutPrompt)
  const response = await result.response
  let code = response.text()

  return code.replace(/```typescript|```tsx|```jsx|```/g, '').trim()
}

async function validateGeneratedCode(): Promise<any> {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    // Check TypeScript compilation
    await execAsync('cd app/generated-app && npx tsc --noEmit --skipLibCheck')
    
    return {
      typescript: true,
      errors: [],
      warnings: []
    }
  } catch (error: any) {
    return {
      typescript: false,
      errors: [error.message],
      warnings: []
    }
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Figma Generate API endpoint',
    usage: {
      method: 'POST',
      body: {
        figmaUrl: 'Optional - Figma file URL',
        fileId: 'Optional - Figma file ID',
        userRequirement: 'Optional - Additional requirements',
        appType: 'Optional - App type (webapp, landing, dashboard)',
        generateType: 'Optional - full|ui|structure (default: full)'
      }
    },
    examples: {
      basic: {
        figmaUrl: 'https://www.figma.com/file/ABC123/My-Design',
        appType: 'landing'
      },
      advanced: {
        figmaUrl: 'https://www.figma.com/file/XYZ789/Dashboard',
        userRequirement: 'Add user authentication and dark mode',
        appType: 'dashboard',
        generateType: 'full'
      }
    }
  })
}