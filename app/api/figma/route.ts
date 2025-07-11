import { NextRequest, NextResponse } from 'next/server'
import { getFigmaFile, extractFileKeyFromUrl } from '@/lib/figma'

export async function POST(request: NextRequest) {
  try {
    const { fileId, fileUrl } = await request.json()

    if (!fileId && !fileUrl) {
      return NextResponse.json(
        { error: 'fileId or fileUrl is required' },
        { status: 400 }
      )
    }

    // Extract file key from URL if URL is provided
    let fileKey = fileId
    if (fileUrl) {
      fileKey = extractFileKeyFromUrl(fileUrl)
      if (!fileKey) {
        return NextResponse.json(
          { error: 'Invalid Figma URL format' },
          { status: 400 }
        )
      }
    }

    console.log('🎨 Fetching Figma file:', fileKey)

    // Get Figma file data
    const { file, designSystem } = await getFigmaFile(fileKey)

    console.log('✅ Figma file fetched successfully')
    console.log('📊 Design system extracted:', {
      colors: designSystem.colors.length,
      fonts: designSystem.fonts.length,
      components: designSystem.components.length
    })

    return NextResponse.json({
      success: true,
      data: {
        file: {
          name: file.name,
          lastModified: file.lastModified,
          thumbnailUrl: file.thumbnailUrl,
          version: file.version
        },
        designSystem,
        structure: {
          pages: extractPages(file.document),
          screens: extractScreens(file.document),
          wireframes: extractWireframes(file.document)
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Figma API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Figma file', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('fileId')
  const fileUrl = searchParams.get('fileUrl')

  if (!fileId && !fileUrl) {
    return NextResponse.json(
      { error: 'fileId or fileUrl query parameter is required' },
      { status: 400 }
    )
  }

  try {
    // Extract file key from URL if URL is provided
    let fileKey = fileId
    if (fileUrl) {
      fileKey = extractFileKeyFromUrl(fileUrl)
      if (!fileKey) {
        return NextResponse.json(
          { error: 'Invalid Figma URL format' },
          { status: 400 }
        )
      }
    }

    console.log('🎨 Fetching Figma file (GET):', fileKey)

    // Get Figma file data
    const { file, designSystem } = await getFigmaFile(fileKey!)

    return NextResponse.json({
      success: true,
      data: {
        file: {
          name: file.name,
          lastModified: file.lastModified,
          thumbnailUrl: file.thumbnailUrl,
          version: file.version
        },
        designSystem,
        structure: {
          pages: extractPages(file.document),
          screens: extractScreens(file.document),
          wireframes: extractWireframes(file.document)
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Figma API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Figma file', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// Helper functions to extract structure data
function extractPages(node: any): any[] {
  if (node.type === 'DOCUMENT') {
    return node.children?.map((child: any) => ({
      id: child.id,
      name: child.name,
      type: child.type,
      children: child.children?.length || 0,
      frames: extractFrames(child)
    })) || []
  }
  return []
}

function extractFrames(node: any): any[] {
  if (node.type === 'CANVAS') {
    return node.children?.filter((child: any) => child.type === 'FRAME').map((frame: any) => ({
      id: frame.id,
      name: frame.name,
      type: frame.type,
      bounds: frame.absoluteBoundingBox,
      backgroundColor: frame.backgroundColor,
      layoutMode: frame.layoutMode,
      children: frame.children?.length || 0,
      elements: extractElements(frame)
    })) || []
  }
  return []
}

function extractElements(node: any): any[] {
  if (!node.children) return []
  
  return node.children.map((child: any) => ({
    id: child.id,
    name: child.name,
    type: child.type,
    bounds: child.absoluteBoundingBox,
    visible: child.visible,
    text: child.characters,
    style: child.style,
    fills: child.fills,
    effects: child.effects,
    componentId: child.componentId,
    children: extractElements(child)
  }))
}

function extractScreens(node: any): any[] {
  const screens: any[] = []
  
  function traverse(n: any) {
    if (n.type === 'FRAME' && n.name.toLowerCase().includes('screen')) {
      screens.push({
        id: n.id,
        name: n.name,
        type: n.type,
        bounds: n.absoluteBoundingBox,
        layoutMode: n.layoutMode,
        elements: extractElements(n)
      })
    }
    
    if (n.children) {
      n.children.forEach(traverse)
    }
  }
  
  traverse(node)
  return screens
}

function extractWireframes(node: any): any[] {
  const wireframes: any[] = []
  
  function traverse(n: any) {
    if (n.type === 'FRAME' && (
      n.name.toLowerCase().includes('wireframe') ||
      n.name.toLowerCase().includes('wire') ||
      n.name.toLowerCase().includes('mockup')
    )) {
      wireframes.push({
        id: n.id,
        name: n.name,
        type: n.type,
        bounds: n.absoluteBoundingBox,
        layoutMode: n.layoutMode,
        elements: extractElements(n)
      })
    }
    
    if (n.children) {
      n.children.forEach(traverse)
    }
  }
  
  traverse(node)
  return wireframes
}