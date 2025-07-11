import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface FigmaStructureRequest {
  figmaData: any
  userRequirement?: string
  appType?: string
}

export async function POST(request: NextRequest) {
  try {
    const { figmaData, userRequirement, appType } = await request.json() as FigmaStructureRequest

    if (!figmaData) {
      return NextResponse.json(
        { error: 'figmaData is required' },
        { status: 400 }
      )
    }

    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      )
    }

    console.log('🤖 Analyzing Figma structure with Gemini...')

    const genAI = new GoogleGenerativeAI(geminiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
You are an expert UI/UX analyzer. Analyze this Figma design data and generate a comprehensive Next.js app structure.

Figma Design Data:
${JSON.stringify(figmaData, null, 2)}

User Requirement: ${userRequirement || 'Not specified'}
App Type: ${appType || 'Not specified'}

Generate a JSON structure with:
1. App metadata (name, type, description)
2. Page structure (routes, components, layout)
3. Design system (colors, fonts, spacing)
4. Component hierarchy
5. State management requirements
6. API requirements
7. Navigation structure
8. Responsive breakpoints
9. Animation requirements
10. Accessibility considerations

Focus on:
- Extract actual colors, fonts, and spacing from Figma
- Identify reusable components
- Map Figma frames to Next.js pages
- Determine layout patterns (grid, flex, etc.)
- Extract text content and button labels
- Identify form elements and their validation
- Determine image requirements
- Map interactive elements to React components

Return only valid JSON in this format:
{
  "app": {
    "name": "extracted from Figma",
    "type": "determined from layout",
    "description": "based on content analysis"
  },
  "pages": [
    {
      "route": "/",
      "name": "HomePage",
      "figmaFrameId": "frame_id",
      "components": ["Hero", "Features", "CTA"],
      "layout": "responsive",
      "sections": []
    }
  ],
  "designSystem": {
    "colors": {
      "primary": "#extracted_color",
      "secondary": "#extracted_color",
      "accent": "#extracted_color",
      "background": "#extracted_color",
      "text": "#extracted_color"
    },
    "fonts": {
      "heading": "extracted_font",
      "body": "extracted_font"
    },
    "spacing": {
      "xs": "4px",
      "sm": "8px",
      "md": "16px",
      "lg": "24px",
      "xl": "32px"
    },
    "borderRadius": "8px",
    "shadows": ["shadow definitions"]
  },
  "components": [
    {
      "name": "ComponentName",
      "type": "component_type",
      "figmaId": "component_id",
      "props": ["prop1", "prop2"],
      "children": []
    }
  ],
  "state": {
    "entities": ["extracted entities"],
    "actions": ["required actions"],
    "stores": ["store definitions"]
  },
  "navigation": {
    "type": "header|sidebar|tabs",
    "items": [
      {
        "label": "extracted_label",
        "route": "/route",
        "icon": "icon_name"
      }
    ]
  },
  "responsive": {
    "breakpoints": {
      "mobile": "768px",
      "tablet": "1024px",
      "desktop": "1280px"
    }
  },
  "animations": {
    "transitions": ["fade", "slide"],
    "durations": ["200ms", "300ms"],
    "easings": ["ease-in-out"]
  },
  "accessibility": {
    "ariaLabels": true,
    "focusManagement": true,
    "colorContrast": "AA"
  }
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let structureText = response.text()

    // Clean up the response
    structureText = structureText.replace(/```json|```/g, '').trim()

    let structure
    try {
      structure = JSON.parse(structureText)
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError)
      console.log('Raw response:', structureText)
      
      // Fallback structure
      structure = {
        app: {
          name: figmaData.file?.name || 'Generated App',
          type: appType || 'webapp',
          description: 'Generated from Figma design'
        },
        pages: [
          {
            route: '/',
            name: 'HomePage',
            components: ['Hero', 'Features', 'CTA'],
            layout: 'responsive'
          }
        ],
        designSystem: {
          colors: {
            primary: figmaData.designSystem?.colors?.[0] || '#3B82F6',
            secondary: figmaData.designSystem?.colors?.[1] || '#64748B',
            accent: figmaData.designSystem?.colors?.[2] || '#F59E0B',
            background: '#FFFFFF',
            text: '#1F2937'
          },
          fonts: {
            heading: figmaData.designSystem?.fonts?.[0] || 'Inter',
            body: figmaData.designSystem?.fonts?.[0] || 'Inter'
          }
        },
        components: figmaData.designSystem?.components || [],
        navigation: {
          type: 'header',
          items: []
        }
      }
    }

    console.log('✅ Structure generated successfully')

    return NextResponse.json({
      success: true,
      data: {
        structure,
        figmaAnalysis: {
          pagesFound: figmaData.structure?.pages?.length || 0,
          screensFound: figmaData.structure?.screens?.length || 0,
          wireframesFound: figmaData.structure?.wireframes?.length || 0,
          colorsExtracted: figmaData.designSystem?.colors?.length || 0,
          fontsExtracted: figmaData.designSystem?.fonts?.length || 0,
          componentsExtracted: figmaData.designSystem?.components?.length || 0
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Structure generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate structure', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Structure API endpoint',
    usage: {
      method: 'POST',
      body: {
        figmaData: 'Required - Figma file data from /api/figma',
        userRequirement: 'Optional - User requirements',
        appType: 'Optional - App type (webapp, landing, dashboard, etc.)'
      }
    }
  })
}