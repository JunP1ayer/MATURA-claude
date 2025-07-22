/**
 * Figma Design Parser
 * FigmaのJSONデータを解析してReactコンポーネント生成用の中間データに変換
 */

export interface ParsedElement {
  type: 'frame' | 'text' | 'rectangle' | 'group'
  id: string
  name: string
  styles: {
    backgroundColor?: string
    color?: string
    fontSize?: number
    fontWeight?: number
    width?: number
    height?: number
    x?: number
    y?: number
    borderRadius?: number
    padding?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
  }
  content?: string // Text要素の場合
  children?: ParsedElement[] // コンテナ要素の場合
}

export interface ParsedDesign {
  name: string
  elements: ParsedElement[]
  metadata: {
    totalElements: number
    hasText: boolean
    hasFrames: boolean
    dominantColors: string[]
  }
}

export class FigmaDesignParser {
  /**
   * Figmaファイルデータを解析してParsedDesignに変換
   * 現在は第1階層のみ解析（将来的に再帰解析に拡張可能）
   */
  static parseDesign(figmaData: any): ParsedDesign {
    console.log('🎨 Starting Figma design parsing...')
    
    if (!figmaData || !figmaData.document) {
      throw new Error('Invalid Figma data: missing document')
    }

    const elements: ParsedElement[] = []
    const dominantColors: string[] = []

    // 第1階層のページをチェック
    const pages = figmaData.document.children || []
    
    for (const page of pages) {
      if (page.children) {
        // ページ内の第1階層要素を解析
        for (const child of page.children) {
          const parsed = this.parseElement(child)
          if (parsed) {
            elements.push(parsed)
            
            // 色情報を収集
            if (parsed.styles.backgroundColor) {
              dominantColors.push(parsed.styles.backgroundColor)
            }
            if (parsed.styles.color) {
              dominantColors.push(parsed.styles.color)
            }
          }
        }
      }
    }

    const metadata = {
      totalElements: elements.length,
      hasText: elements.some(el => el.type === 'text'),
      hasFrames: elements.some(el => el.type === 'frame'),
      dominantColors: [...new Set(dominantColors)].slice(0, 5) // 重複除去して上位5色
    }

    console.log(`✅ Parsed ${elements.length} elements from Figma design`)
    
    return {
      name: figmaData.name || 'Untitled Design',
      elements,
      metadata
    }
  }

  /**
   * 個別要素の解析
   * TODO: 将来的に再帰解析、レイアウト情報、インタラクション等を追加
   */
  private static parseElement(element: any): ParsedElement | null {
    if (!element || !element.type) {
      return null
    }

    const baseElement: ParsedElement = {
      type: this.mapElementType(element.type),
      id: element.id,
      name: element.name || 'Unnamed',
      styles: {}
    }

    // 位置・サイズ情報の解析
    if (element.absoluteBoundingBox) {
      baseElement.styles.width = Math.round(element.absoluteBoundingBox.width)
      baseElement.styles.height = Math.round(element.absoluteBoundingBox.height)
      baseElement.styles.x = Math.round(element.absoluteBoundingBox.x)
      baseElement.styles.y = Math.round(element.absoluteBoundingBox.y)
    }

    // 背景色の解析
    if (element.fills && element.fills.length > 0) {
      const fill = element.fills[0]
      if (fill.type === 'SOLID' && fill.color) {
        baseElement.styles.backgroundColor = this.rgbaToHex(fill.color)
      }
    }

    // テキスト要素の特別処理
    if (element.type === 'TEXT') {
      baseElement.content = element.characters || ''
      
      // フォントスタイルの解析
      if (element.style) {
        baseElement.styles.fontSize = element.style.fontSize || 16
        baseElement.styles.fontWeight = element.style.fontWeight || 400
        
        // テキスト色の解析
        if (element.fills && element.fills[0]?.color) {
          baseElement.styles.color = this.rgbaToHex(element.fills[0].color)
        }
      }
    }

    // フレーム要素の特別処理
    if (element.type === 'FRAME' || element.type === 'GROUP') {
      // パディング情報の解析（将来的な拡張ポイント）
      if (element.paddingLeft || element.paddingTop) {
        baseElement.styles.padding = {
          top: element.paddingTop || 0,
          right: element.paddingRight || 0,
          bottom: element.paddingBottom || 0,
          left: element.paddingLeft || 0
        }
      }
      
      // TODO: 将来的に子要素も解析（現在は第1階層のみ）
      // if (element.children) {
      //   baseElement.children = element.children.map(child => this.parseElement(child)).filter(Boolean)
      // }
    }

    // 角丸の解析
    if (element.cornerRadius) {
      baseElement.styles.borderRadius = element.cornerRadius
    }

    return baseElement
  }

  /**
   * Figmaの要素タイプを内部タイプにマッピング
   */
  private static mapElementType(figmaType: string): ParsedElement['type'] {
    switch (figmaType) {
      case 'FRAME':
        return 'frame'
      case 'TEXT':
        return 'text'
      case 'RECTANGLE':
      case 'ELLIPSE':
        return 'rectangle'
      case 'GROUP':
        return 'group'
      default:
        return 'frame' // デフォルトはframe扱い
    }
  }

  /**
   * FigmaのRGBA色をHEX色に変換
   */
  private static rgbaToHex(color: { r: number; g: number; b: number; a?: number }): string {
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16)
      return hex.length === 1 ? `0${  hex}` : hex
    }

    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
  }

  /**
   * 解析結果をReactコンポーネント文字列に変換
   * TODO: より洗練されたテンプレート生成に拡張
   */
  static generateReactComponent(parsedDesign: ParsedDesign): string {
    console.log('🔧 Generating React component from parsed design...')
    
    const elements = parsedDesign.elements.map(element => {
      return this.elementToJSX(element)
    }).join('\n      ')

    const component = `
'use client'

import React from 'react'

// Generated from Figma design: ${parsedDesign.name}
// Elements: ${parsedDesign.metadata.totalElements} (Text: ${parsedDesign.metadata.hasText}, Frames: ${parsedDesign.metadata.hasFrames})
// Colors: ${parsedDesign.metadata.dominantColors.join(', ')}

export default function FigmaGeneratedPage() {
  return (
    <div className="figma-generated-container" style={{ 
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: '${parsedDesign.metadata.dominantColors[0] || '#ffffff'}'
    }}>
      <div className="figma-elements">
        ${elements}
      </div>
    </div>
  )
}
`

    return component
  }

  /**
   * 個別要素をJSX文字列に変換
   */
  private static elementToJSX(element: ParsedElement): string {
    const styles = this.stylesToCSS(element.styles)
    
    switch (element.type) {
      case 'text':
        return `<p style={${JSON.stringify(styles)}} data-figma-id="${element.id}">${element.content || ''}</p>`
      
      case 'frame':
      case 'group':
        return `<div style={${JSON.stringify(styles)}} data-figma-id="${element.id}" data-figma-name="${element.name}">
          {/* Frame: ${element.name} */}
        </div>`
      
      case 'rectangle':
        return `<div style={${JSON.stringify(styles)}} data-figma-id="${element.id}" data-figma-name="${element.name}"></div>`
      
      default:
        return `<div style={${JSON.stringify(styles)}} data-figma-id="${element.id}"><!-- ${element.type}: ${element.name} --></div>`
    }
  }

  /**
   * スタイルオブジェクトをCSS形式に変換
   */
  private static stylesToCSS(styles: ParsedElement['styles']): any {
    const css: any = {}

    if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor
    if (styles.color) css.color = styles.color
    if (styles.fontSize) css.fontSize = `${styles.fontSize}px`
    if (styles.fontWeight) css.fontWeight = styles.fontWeight
    if (styles.width) css.width = `${styles.width}px`
    if (styles.height) css.height = `${styles.height}px`
    if (styles.borderRadius) css.borderRadius = `${styles.borderRadius}px`
    
    // 位置情報（absolute positioning）
    if (styles.x !== undefined || styles.y !== undefined) {
      css.position = 'absolute'
      if (styles.x !== undefined) css.left = `${styles.x}px`
      if (styles.y !== undefined) css.top = `${styles.y}px`
    }

    // パディング
    if (styles.padding) {
      const p = styles.padding
      css.padding = `${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${p.left || 0}px`
    }

    return css
  }
}