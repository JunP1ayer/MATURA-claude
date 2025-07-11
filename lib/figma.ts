// 環境変数からFigma設定を取得（パブリックファイルを優先）
export const DEFAULT_FIGMA_TEMPLATE_ID = process.env.DEFAULT_FIGMA_FILE_ID || 
  process.env.PUBLIC_FIGMA_FILE_ID || 
  'CzV0bcT5w8PVHxr3BRGVmL' // Material Design System (Figma Community - Public Access)
const FIGMA_API_BASE_URL = 'https://api.figma.com/v1'

// セキュアなFigmaクライアントをインポート
import { SecureFigmaClient } from './secure-figma-client'

// Figma API types
export interface FigmaNode {
  id: string
  name: string
  type: string
  visible?: boolean
  children?: FigmaNode[]
  backgroundColor?: string
  fills?: FigmaFill[]
  strokes?: FigmaStroke[]
  effects?: FigmaEffect[]
  constraints?: FigmaConstraints
  absoluteBoundingBox?: FigmaRect
  clipsContent?: boolean
  layoutMode?: string
  layoutWrap?: string
  itemSpacing?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  characters?: string
  style?: FigmaTextStyle
  componentId?: string
  componentProperties?: Record<string, any>
}

export interface FigmaFill {
  type: string
  color?: FigmaColor
  opacity?: number
  blendMode?: string
}

export interface FigmaStroke {
  type: string
  color?: FigmaColor
  opacity?: number
  weight?: number
}

export interface FigmaEffect {
  type: string
  color?: FigmaColor
  offset?: { x: number; y: number }
  radius?: number
  spread?: number
  visible?: boolean
}

export interface FigmaColor {
  r: number
  g: number
  b: number
  a: number
}

export interface FigmaRect {
  x: number
  y: number
  width: number
  height: number
}

export interface FigmaConstraints {
  vertical: string
  horizontal: string
}

export interface FigmaTextStyle {
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  lineHeight?: number
  letterSpacing?: number
  textAlign?: string
  textDecoration?: string
}

export interface FigmaComponent {
  key: string
  name: string
  description?: string
  remote?: boolean
  componentSetId?: string
  documentationLinks?: Array<{
    uri: string
    label?: string
  }>
}

export interface FigmaStyle {
  key: string
  name: string
  description?: string
  remote?: boolean
  styleType: string
}

export interface FigmaFile {
  name: string
  role: string
  lastModified: string
  editorType: string
  thumbnailUrl: string
  version: string
  document: FigmaNode
  components: Record<string, FigmaComponent>
  componentSets: Record<string, any>
  schemaVersion: number
  styles: Record<string, FigmaStyle>
  mainFileKey?: string
  branches?: Array<{
    key: string
    name: string
    thumbnail_url: string
    last_modified: string
    link_access: string
  }>
}

export interface FigmaFileResponse {
  err?: string
  status?: number
  meta?: any
  document?: FigmaNode
  components?: Record<string, FigmaComponent>
  componentSets?: Record<string, any>
  schemaVersion?: number
  styles?: Record<string, FigmaStyle>
  name?: string
  lastModified?: string
  thumbnailUrl?: string
  version?: string
  role?: string
  editorType?: string
  linkAccess?: string
}

// Enhanced Figma API Client with comprehensive error handling
export class FigmaClient {
  private apiKey: string
  private baseUrl = FIGMA_API_BASE_URL

  constructor(apiKey: string) {
    if (!apiKey || apiKey === 'your-figma-api-key-here' || apiKey.includes('your-')) {
      throw new Error('Valid Figma API key is required. Get one from https://www.figma.com/settings')
    }
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    console.log(`🎨 Figma API Request: ${url}`)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'X-Figma-Token': this.apiKey,
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Figma API Error ${response.status}:`, errorText)
        
        if (response.status === 401) {
          throw new Error('Invalid Figma API key. Please check your FIGMA_API_KEY environment variable.')
        } else if (response.status === 403) {
          throw new Error('Access denied to Figma file. Please check file permissions.')
        } else if (response.status === 404) {
          throw new Error('Figma file not found. Please check the file ID.')
        } else {
          throw new Error(`Figma API error: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()
      console.log(`✅ Figma API Success: ${endpoint}`)
      return data
    } catch (error) {
      console.error(`❌ Figma API Request Failed:`, error)
      throw error
    }
  }

  async getFile(fileKey: string): Promise<FigmaFile> {
    if (!fileKey) {
      throw new Error('Figma file key is required')
    }
    
    console.log(`📁 Fetching Figma file: ${fileKey}`)
    return await this.request<FigmaFile>(`/files/${fileKey}`)
  }

  async getFileNodes(fileKey: string, nodeIds: string[]): Promise<any> {
    if (!fileKey || !nodeIds.length) {
      throw new Error('File key and node IDs are required')
    }
    
    const ids = nodeIds.join(',')
    console.log(`🔍 Fetching Figma nodes: ${ids.slice(0, 50)}...`)
    return await this.request(`/files/${fileKey}/nodes?ids=${ids}`)
  }

  async getFileImages(fileKey: string, nodeIds: string[], options: {
    format?: 'jpg' | 'png' | 'svg' | 'pdf'
    scale?: number
    svg_outline_text?: boolean
  } = {}): Promise<any> {
    if (!fileKey || !nodeIds.length) {
      throw new Error('File key and node IDs are required')
    }
    
    const ids = nodeIds.join(',')
    const params = new URLSearchParams({
      ids,
      format: options.format || 'png',
      scale: options.scale?.toString() || '1',
      svg_outline_text: options.svg_outline_text?.toString() || 'true'
    })
    
    console.log(`🖼️ Fetching Figma images: ${options.format || 'png'}`)
    return await this.request(`/files/${fileKey}/images?${params}`)
  }

  async getTeamProjects(teamId: string): Promise<any> {
    if (!teamId) {
      throw new Error('Team ID is required')
    }
    return await this.request(`/teams/${teamId}/projects`)
  }

  async getProjectFiles(projectId: string): Promise<any> {
    if (!projectId) {
      throw new Error('Project ID is required')
    }
    return await this.request(`/projects/${projectId}/files`)
  }

  // Enhanced method to get file with component metadata
  async getFileWithComponents(fileKey: string): Promise<{
    file: FigmaFile
    componentSets: Record<string, any>
    styles: Record<string, FigmaStyle>
  }> {
    const response = await this.getFile(fileKey)
    return {
      file: response,
      componentSets: response.componentSets || {},
      styles: response.styles || {}
    }
  }

  // Method to extract only necessary data for app generation (reduces JSON size)
  async getOptimizedFileData(fileKey: string): Promise<{
    name: string
    lastModified: string
    document: FigmaNode
    designSystem: {
      colors: string[]
      fonts: string[]
      components: Array<{ name: string; type: string; id: string }>
    }
    pages: Array<{ id: string; name: string; type: string }>
    frames: Array<{ id: string; name: string; bounds: FigmaRect | undefined }>
  }> {
    const file = await this.getFile(fileKey)
    
    // Extract design system
    const colors = FigmaParser.extractColors(file.document)
    const fonts = FigmaParser.extractFonts(file.document)
    const components = FigmaParser.extractComponents(file.document)
    
    // Extract page structure
    const pages = this.extractPageStructure(file.document)
    const frames = this.extractFrames(file.document)
    
    return {
      name: file.name,
      lastModified: file.lastModified,
      document: file.document,
      designSystem: {
        colors: colors.slice(0, 10), // Limit to 10 colors
        fonts: fonts.slice(0, 5),    // Limit to 5 fonts
        components: components.slice(0, 20) // Limit to 20 components
      },
      pages,
      frames: frames.slice(0, 50) // Limit to 50 frames
    }
  }

  private extractPageStructure(document: FigmaNode): Array<{ id: string; name: string; type: string }> {
    if (document.type === 'DOCUMENT' && document.children) {
      return document.children.map(page => ({
        id: page.id,
        name: page.name,
        type: page.type
      }))
    }
    return []
  }

  private extractFrames(node: FigmaNode): Array<{ id: string; name: string; bounds: FigmaRect | undefined }> {
    const frames: Array<{ id: string; name: string; bounds: FigmaRect | undefined }> = []
    
    const traverse = (n: FigmaNode) => {
      if (n.type === 'FRAME' || n.type === 'COMPONENT') {
        frames.push({
          id: n.id,
          name: n.name,
          bounds: n.absoluteBoundingBox
        })
      }
      
      if (n.children) {
        n.children.forEach(traverse)
      }
    }
    
    traverse(node)
    return frames
  }
}

// Figma file parsing utilities
export class FigmaParser {
  static extractColors(node: FigmaNode): string[] {
    const colors: string[] = []
    
    if (node.fills) {
      node.fills.forEach(fill => {
        if (fill.color) {
          const { r, g, b, a = 1 } = fill.color
          const hex = this.rgbaToHex(r, g, b, a)
          if (hex && !colors.includes(hex)) {
            colors.push(hex)
          }
        }
      })
    }

    if (node.children) {
      node.children.forEach(child => {
        colors.push(...this.extractColors(child))
      })
    }

    return colors
  }

  static extractFonts(node: FigmaNode): string[] {
    const fonts: string[] = []
    
    if (node.style?.fontFamily) {
      if (!fonts.includes(node.style.fontFamily)) {
        fonts.push(node.style.fontFamily)
      }
    }

    if (node.children) {
      node.children.forEach(child => {
        fonts.push(...this.extractFonts(child))
      })
    }

    return fonts
  }

  static extractComponents(node: FigmaNode): Array<{
    name: string
    type: string
    id: string
    bounds?: FigmaRect
    properties?: Record<string, any>
  }> {
    const components: Array<{
      name: string
      type: string
      id: string
      bounds?: FigmaRect
      properties?: Record<string, any>
    }> = []

    if (node.componentId || node.type === 'COMPONENT') {
      components.push({
        name: node.name,
        type: node.type,
        id: node.id,
        bounds: node.absoluteBoundingBox,
        properties: node.componentProperties
      })
    }

    if (node.children) {
      node.children.forEach(child => {
        components.push(...this.extractComponents(child))
      })
    }

    return components
  }

  static extractLayoutStructure(node: FigmaNode): any {
    const structure: any = {
      name: node.name,
      type: node.type,
      id: node.id,
      layout: {
        mode: node.layoutMode,
        wrap: node.layoutWrap,
        spacing: node.itemSpacing,
        padding: {
          left: node.paddingLeft || 0,
          right: node.paddingRight || 0,
          top: node.paddingTop || 0,
          bottom: node.paddingBottom || 0
        }
      },
      bounds: node.absoluteBoundingBox,
      children: []
    }

    if (node.children) {
      structure.children = node.children.map(child => 
        this.extractLayoutStructure(child)
      )
    }

    return structure
  }

  private static rgbaToHex(r: number, g: number, b: number, a: number = 1): string | null {
    if (a === 0) return null
    
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
    return hex
  }

  static analyzeDesignSystem(figmaFile: FigmaFile): {
    colors: string[]
    fonts: string[]
    components: Array<{
      name: string
      type: string
      id: string
      bounds?: FigmaRect
      properties?: Record<string, any>
    }>
    layout: any
    styles: Record<string, FigmaStyle>
    statistics: {
      totalColors: number
      totalFonts: number
      totalComponents: number
      totalFrames: number
    }
  } {
    const colors = this.extractColors(figmaFile.document)
    const fonts = this.extractFonts(figmaFile.document)
    const components = this.extractComponents(figmaFile.document)
    const layout = this.extractLayoutStructure(figmaFile.document)

    return {
      colors,
      fonts,
      components,
      layout,
      styles: figmaFile.styles,
      statistics: {
        totalColors: colors.length,
        totalFonts: fonts.length,
        totalComponents: components.length,
        totalFrames: this.countFrames(figmaFile.document)
      }
    }
  }

  private static countFrames(node: FigmaNode): number {
    let count = 0
    if (node.type === 'FRAME' || node.type === 'COMPONENT') {
      count = 1
    }
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + this.countFrames(child), 0)
    }
    return count
  }

  // New method to convert Figma components to shadcn/ui component mappings
  static mapToShadcnComponents(components: Array<{
    name: string
    type: string
    id: string
    bounds?: FigmaRect
    properties?: Record<string, any>
  }>): Array<{
    figmaName: string
    shadcnComponent: string
    props: Record<string, any>
    description: string
  }> {
    return components.map(comp => {
      const name = comp.name.toLowerCase()
      
      // Button mappings
      if (name.includes('button') || name.includes('btn')) {
        return {
          figmaName: comp.name,
          shadcnComponent: 'Button',
          props: {
            variant: name.includes('outline') ? 'outline' : 
                    name.includes('ghost') ? 'ghost' :
                    name.includes('secondary') ? 'secondary' : 'default',
            size: name.includes('small') || name.includes('sm') ? 'sm' :
                  name.includes('large') || name.includes('lg') ? 'lg' : 'default'
          },
          description: `Button component from ${comp.name}`
        }
      }
      
      // Card mappings
      if (name.includes('card') || name.includes('panel')) {
        return {
          figmaName: comp.name,
          shadcnComponent: 'Card',
          props: {
            className: 'w-full'
          },
          description: `Card component from ${comp.name}`
        }
      }
      
      // Input mappings
      if (name.includes('input') || name.includes('textfield') || name.includes('text-field')) {
        return {
          figmaName: comp.name,
          shadcnComponent: 'Input',
          props: {
            type: name.includes('email') ? 'email' :
                  name.includes('password') ? 'password' :
                  name.includes('number') ? 'number' : 'text'
          },
          description: `Input component from ${comp.name}`
        }
      }
      
      // Badge mappings
      if (name.includes('badge') || name.includes('tag') || name.includes('chip')) {
        return {
          figmaName: comp.name,
          shadcnComponent: 'Badge',
          props: {
            variant: name.includes('outline') ? 'outline' :
                    name.includes('secondary') ? 'secondary' : 'default'
          },
          description: `Badge component from ${comp.name}`
        }
      }
      
      // Default mapping
      return {
        figmaName: comp.name,
        shadcnComponent: 'div',
        props: {
          className: 'figma-component'
        },
        description: `Custom component from ${comp.name}`
      }
    })
  }
}

// Main function to get Figma file data with enhanced processing
export async function getFigmaFile(fileKey: string): Promise<{
  file: FigmaFile
  designSystem: ReturnType<typeof FigmaParser.analyzeDesignSystem>
  shadcnMappings: ReturnType<typeof FigmaParser.mapToShadcnComponents>
}> {
  const apiKey = process.env.FIGMA_API_KEY
  if (!apiKey) {
    throw new Error('FIGMA_API_KEY is not set in environment variables')
  }

  const client = new FigmaClient(apiKey)
  const file = await client.getFile(fileKey)
  const designSystem = FigmaParser.analyzeDesignSystem(file)
  const shadcnMappings = FigmaParser.mapToShadcnComponents(designSystem.components)

  console.log(`✅ Processed Figma file: ${file.name}`)
  console.log(`📊 Design System Stats:`, designSystem.statistics)

  return {
    file,
    designSystem,
    shadcnMappings
  }
}

// Optimized function for app generation (reduces data size)
export async function getFigmaOptimizedData(fileKey?: string): Promise<{
  name: string
  lastModified: string
  designSystem: {
    colors: string[]
    fonts: string[]
    components: Array<{ name: string; type: string; id: string }>
  }
  shadcnMappings: Array<{
    figmaName: string
    shadcnComponent: string
    props: Record<string, any>
    description: string
  }>
  pages: Array<{ id: string; name: string; type: string }>
  frames: Array<{ id: string; name: string; bounds: FigmaRect | undefined }>
} | null> {
  try {
    const apiKey = process.env.FIGMA_API_KEY
    if (!apiKey || apiKey === 'your-figma-api-key-here') {
      console.warn('⚠️ Figma API key not configured, skipping Figma integration')
      return null
    }

    const targetFileKey = fileKey || DEFAULT_FIGMA_TEMPLATE_ID
    if (!targetFileKey) {
      console.warn('⚠️ No Figma file ID provided and no default configured')
      return null
    }

    console.log(`🎨 Fetching optimized Figma data for: ${targetFileKey}`)
    
    // セキュアクライアントを使用（本番環境）
    if (process.env.NODE_ENV === 'production' || process.env.FIGMA_USE_SECURE_CLIENT === 'true') {
      const secureClient = new SecureFigmaClient({
        apiKey,
        teamId: process.env.FIGMA_TEAM_ID || 'default',
        enableMonitoring: true,
        enableSecurity: true
      })
      
      const context = {
        ip: '127.0.0.1', // サーバーサイドリクエストの場合
        userAgent: 'MATURA-Server/1.0',
        sessionId: 'server-session'
      }
      
      const optimizedData = await secureClient.getOptimizedFileData(targetFileKey, context)
      
      // 安全性チェック
      if (!optimizedData || !optimizedData.designSystem) {
        console.error('❌ Invalid Figma data structure')
        return null
      }
      
      const components = optimizedData.designSystem.components || []
      const shadcnMappings = FigmaParser.mapToShadcnComponents(components)

      console.log(`✅ Secure Figma data processed: ${optimizedData.name}`)
      console.log(`📊 Data size: ${optimizedData.designSystem.colors?.length || 0} colors, ${optimizedData.designSystem.fonts?.length || 0} fonts, ${components.length} components`)

      return {
        ...optimizedData,
        shadcnMappings
      }
    } else {
      // 開発環境では従来のクライアントを使用
      const client = new FigmaClient(apiKey)
      const optimizedData = await client.getOptimizedFileData(targetFileKey)
      
      // 安全性チェック
      if (!optimizedData || !optimizedData.designSystem) {
        console.error('❌ Invalid Figma data structure')
        return null
      }
      
      const components = optimizedData.designSystem.components || []
      const shadcnMappings = FigmaParser.mapToShadcnComponents(components)

      console.log(`✅ Optimized Figma data processed: ${optimizedData.name}`)
      console.log(`📊 Data size: ${optimizedData.designSystem.colors?.length || 0} colors, ${optimizedData.designSystem.fonts?.length || 0} fonts, ${components.length} components`)

      return {
        ...optimizedData,
        shadcnMappings
      }
    }
  } catch (error) {
    console.error('❌ Failed to fetch Figma data:', error)
    return null
  }
}

// Extract file key from Figma URL
export function extractFileKeyFromUrl(url: string): string | null {
  const match = url.match(/\/file\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}