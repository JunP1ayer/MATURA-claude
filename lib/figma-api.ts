// Figma API integration for design template processing
import { PREMIUM_DESIGN_PATTERNS, UIDesignPattern } from './smart-ui-selector';

export interface FigmaComponent {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: Array<{
    type: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }>;
  strokes?: Array<{
    type: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }>;
  children?: FigmaComponent[];
}

export interface FigmaDesignData {
  name: string;
  components: FigmaComponent[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout: 'minimal' | 'modern' | 'professional' | 'creative';
  complexity: 'simple' | 'moderate' | 'complex';
}

export class FigmaDesignExtractor {
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN || null;
  }

  // Extract file ID from Figma URL
  private extractFileId(figmaUrl: string): string | null {
    const match = figmaUrl.match(/\/file\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  // Convert Figma color to hex
  private figmaColorToHex(color: { r: number; g: number; b: number; a: number }): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Analyze component layout to determine UI pattern
  private analyzeLayout(components: FigmaComponent[]): 'minimal' | 'modern' | 'professional' | 'creative' {
    const componentCount = components.length;
    const hasComplexStructure = components.some(comp => comp.children && comp.children.length > 5);
    const hasNavigationElements = components.some(comp => 
      comp.name.toLowerCase().includes('nav') || 
      comp.name.toLowerCase().includes('menu') ||
      comp.name.toLowerCase().includes('header')
    );
    
    if (componentCount > 15 && hasComplexStructure && hasNavigationElements) {
      return 'professional';
    } else if (componentCount > 10 && hasComplexStructure) {
      return 'modern';
    } else if (componentCount < 5) {
      return 'minimal';
    } else {
      return 'creative';
    }
  }

  // Determine complexity based on component structure
  private determineComplexity(components: FigmaComponent[]): 'simple' | 'moderate' | 'complex' {
    const componentCount = components.length;
    const maxDepth = this.getMaxDepth(components);
    
    if (componentCount > 20 || maxDepth > 4) {
      return 'complex';
    } else if (componentCount > 10 || maxDepth > 2) {
      return 'moderate';
    } else {
      return 'simple';
    }
  }

  // Get maximum component nesting depth
  private getMaxDepth(components: FigmaComponent[], currentDepth = 0): number {
    let maxDepth = currentDepth;
    
    for (const component of components) {
      if (component.children && component.children.length > 0) {
        const depth = this.getMaxDepth(component.children, currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    
    return maxDepth;
  }

  // Extract dominant colors from components
  private extractColors(components: FigmaComponent[]): {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  } {
    const colors: string[] = [];
    
    const extractColorsFromComponent = (component: FigmaComponent) => {
      if (component.fills) {
        component.fills.forEach(fill => {
          if (fill.type === 'SOLID' && fill.color) {
            colors.push(this.figmaColorToHex(fill.color));
          }
        });
      }
      
      if (component.strokes) {
        component.strokes.forEach(stroke => {
          if (stroke.type === 'SOLID' && stroke.color) {
            colors.push(this.figmaColorToHex(stroke.color));
          }
        });
      }
      
      if (component.children) {
        component.children.forEach(extractColorsFromComponent);
      }
    };
    
    components.forEach(extractColorsFromComponent);
    
    // Count color frequency
    const colorFreq = colors.reduce((acc, color) => {
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Sort by frequency
    const sortedColors = Object.entries(colorFreq)
      .sort(([,a], [,b]) => b - a)
      .map(([color]) => color);
    
    // Default colors if extraction fails
    const defaultColors = {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#3b82f6',
      background: '#f9fafb',
      text: '#111827'
    };
    
    return {
      primary: sortedColors[0] || defaultColors.primary,
      secondary: sortedColors[1] || defaultColors.secondary,
      accent: sortedColors[2] || defaultColors.accent,
      background: sortedColors[3] || defaultColors.background,
      text: sortedColors[4] || defaultColors.text,
    };
  }

  // Fetch design data from Figma API
  async fetchDesignFromUrl(figmaUrl: string): Promise<FigmaDesignData | null> {
    if (!this.accessToken) {
      console.warn('Figma access token not found, using default design patterns');
      return null;
    }

    const fileId = this.extractFileId(figmaUrl);
    if (!fileId) {
      throw new Error('Invalid Figma URL format');
    }

    try {
      const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
        headers: {
          'X-Figma-Token': this.accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Figma API error: ${response.status}`);
      }

      const data = await response.json();
      const document = data.document;
      
      // Extract components from the first page
      const firstPage = document.children[0];
      const components = this.extractComponentsFromNode(firstPage);
      
      const colors = this.extractColors(components);
      const layout = this.analyzeLayout(components);
      const complexity = this.determineComplexity(components);
      
      return {
        name: data.name || 'Figma Design',
        components,
        colors,
        layout,
        complexity
      };
    } catch (error) {
      console.error('Error fetching Figma design:', error);
      throw error;
    }
  }

  // Extract components from Figma node recursively
  private extractComponentsFromNode(node: any): FigmaComponent[] {
    const components: FigmaComponent[] = [];
    
    const processNode = (figmaNode: any): FigmaComponent => {
      const component: FigmaComponent = {
        id: figmaNode.id,
        name: figmaNode.name,
        type: figmaNode.type,
        x: figmaNode.absoluteBoundingBox?.x || 0,
        y: figmaNode.absoluteBoundingBox?.y || 0,
        width: figmaNode.absoluteBoundingBox?.width || 0,
        height: figmaNode.absoluteBoundingBox?.height || 0,
        fills: figmaNode.fills,
        strokes: figmaNode.strokes,
      };
      
      if (figmaNode.children && figmaNode.children.length > 0) {
        component.children = figmaNode.children.map(processNode);
      }
      
      return component;
    };
    
    if (node.children) {
      node.children.forEach((child: any) => {
        components.push(processNode(child));
      });
    }
    
    return components;
  }

  // Convert Figma design to UI pattern
  convertToUIPattern(figmaDesign: FigmaDesignData): UIDesignPattern {
    // Determine category based on component analysis
    const category = this.determineCategoryFromComponents(figmaDesign.components);
    
    // Generate MVP score based on complexity and component count
    const mvpScore = this.calculateMVPScore(figmaDesign);
    
    return {
      id: `figma-${Date.now()}`,
      name: `Figma ${figmaDesign.name}`,
      category,
      complexity: figmaDesign.complexity,
      colors: figmaDesign.colors,
      components: this.extractComponentTypes(figmaDesign.components),
      layout: figmaDesign.layout,
      mvpScore,
    };
  }

  // Determine app category from component names and structure
  private determineCategoryFromComponents(components: FigmaComponent[]): UIDesignPattern['category'] {
    const componentNames = components.map(c => c.name.toLowerCase()).join(' ');
    
    if (componentNames.includes('chart') || componentNames.includes('graph') || componentNames.includes('metric')) {
      return 'dashboard';
    } else if (componentNames.includes('product') || componentNames.includes('cart') || componentNames.includes('shop')) {
      return 'ecommerce';
    } else if (componentNames.includes('post') || componentNames.includes('feed') || componentNames.includes('profile')) {
      return 'social';
    } else if (componentNames.includes('portfolio') || componentNames.includes('gallery') || componentNames.includes('showcase')) {
      return 'creative';
    } else if (componentNames.includes('enterprise') || componentNames.includes('business') || componentNames.includes('pricing')) {
      return 'business';
    } else {
      return 'productivity';
    }
  }

  // Extract component types for UI generation
  private extractComponentTypes(components: FigmaComponent[]): string[] {
    const types = new Set<string>();
    
    const processComponent = (component: FigmaComponent) => {
      const name = component.name.toLowerCase();
      
      if (name.includes('button')) types.add('buttons');
      if (name.includes('input') || name.includes('form')) types.add('forms');
      if (name.includes('card')) types.add('cards');
      if (name.includes('list')) types.add('lists');
      if (name.includes('nav') || name.includes('menu')) types.add('navigation');
      if (name.includes('chart') || name.includes('graph')) types.add('charts');
      if (name.includes('table')) types.add('tables');
      if (name.includes('gallery') || name.includes('image')) types.add('galleries');
      
      if (component.children) {
        component.children.forEach(processComponent);
      }
    };
    
    components.forEach(processComponent);
    
    return Array.from(types);
  }

  // Calculate MVP score based on design quality and complexity
  private calculateMVPScore(figmaDesign: FigmaDesignData): number {
    let score = 5; // Base score
    
    // Add points for good design practices
    if (figmaDesign.components.length > 5) score += 1;
    if (figmaDesign.components.length > 15) score += 1;
    if (figmaDesign.layout === 'professional' || figmaDesign.layout === 'modern') score += 1;
    if (figmaDesign.complexity === 'moderate' || figmaDesign.complexity === 'complex') score += 1;
    
    // Color palette quality (simplified check)
    const uniqueColors = new Set([
      figmaDesign.colors.primary,
      figmaDesign.colors.secondary,
      figmaDesign.colors.accent
    ]);
    if (uniqueColors.size >= 3) score += 1;
    
    return Math.min(score, 10);
  }

  // Get default pattern when Figma is not available
  getDefaultPattern(userIdea: string): UIDesignPattern {
    // Use existing smart selector as fallback
    return PREMIUM_DESIGN_PATTERNS.find(p => p.figmaUrl) || PREMIUM_DESIGN_PATTERNS[0];
  }
}

export const figmaExtractor = new FigmaDesignExtractor();