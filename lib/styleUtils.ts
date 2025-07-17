export interface StyleData {
  id?: string
  name: string
  description: string
  baseColor: string
  tags: string[]
  previewColor: string[]
  icon: string
  themeConfig?: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    accent: string
  }
}

// デフォルトのテーマ設定
const DEFAULT_THEME_CONFIG = {
  primary: '#000000',
  secondary: '#888888',
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e0e0e0',
  accent: '#888888'
}

// デフォルトのスタイルデータ
const DEFAULT_STYLE_DATA: StyleData = {
  name: 'Unnamed Style',
  description: '',
  baseColor: '#000000',
  tags: [],
  previewColor: ['#000000', '#888888', '#ffffff'],
  icon: 'Palette',
  themeConfig: DEFAULT_THEME_CONFIG
}

/**
 * スタイルオブジェクトを安全な形式に変換する
 * null, undefined, 空文字列などを適切なデフォルト値に置き換える
 */
export function createSafeStyle(style: Partial<StyleData> | null | undefined): StyleData {
  // スタイルがnullまたはundefinedの場合はデフォルトを返す
  if (!style) {
    return { ...DEFAULT_STYLE_DATA }
  }

  // 配列の安全な処理
  const safePreviewColor = Array.isArray(style.previewColor) && style.previewColor.length > 0
    ? style.previewColor.map(color => 
        (typeof color === 'string' && color.trim() !== '') ? color : '#888888'
      )
    : DEFAULT_STYLE_DATA.previewColor

  // previewColorが足りない場合は補完
  while (safePreviewColor.length < 3) {
    const defaultIndex = safePreviewColor.length
    const defaultColor = DEFAULT_STYLE_DATA.previewColor[defaultIndex] || '#888888'
    safePreviewColor.push(defaultColor)
  }
  
  // 最低限の長さを保証
  if (safePreviewColor.length === 0) {
    safePreviewColor.push('#000000', '#888888', '#ffffff')
  }

  const safeTags = Array.isArray(style.tags)
    ? style.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '')
    : DEFAULT_STYLE_DATA.tags

  // themeConfigの安全な処理
  let safeThemeConfig = DEFAULT_THEME_CONFIG
  if (style.themeConfig && typeof style.themeConfig === 'object') {
    safeThemeConfig = {
      primary: (typeof style.themeConfig.primary === 'string' && style.themeConfig.primary.trim() !== '') 
        ? style.themeConfig.primary 
        : safePreviewColor[0],
      secondary: (typeof style.themeConfig.secondary === 'string' && style.themeConfig.secondary.trim() !== '') 
        ? style.themeConfig.secondary 
        : safePreviewColor[1],
      background: (typeof style.themeConfig.background === 'string' && style.themeConfig.background.trim() !== '') 
        ? style.themeConfig.background 
        : safePreviewColor[2],
      surface: (typeof style.themeConfig.surface === 'string' && style.themeConfig.surface.trim() !== '') 
        ? style.themeConfig.surface 
        : safePreviewColor[2],
      text: (typeof style.themeConfig.text === 'string' && style.themeConfig.text.trim() !== '') 
        ? style.themeConfig.text 
        : safePreviewColor[0],
      textSecondary: (typeof style.themeConfig.textSecondary === 'string' && style.themeConfig.textSecondary.trim() !== '') 
        ? style.themeConfig.textSecondary 
        : safePreviewColor[1],
      border: (typeof style.themeConfig.border === 'string' && style.themeConfig.border.trim() !== '') 
        ? style.themeConfig.border 
        : safePreviewColor[1] + '40',
      accent: (typeof style.themeConfig.accent === 'string' && style.themeConfig.accent.trim() !== '') 
        ? style.themeConfig.accent 
        : safePreviewColor[1]
    }
  }

  return {
    id: style.id,
    name: (typeof style.name === 'string' && style.name.trim() !== '') 
      ? style.name 
      : DEFAULT_STYLE_DATA.name,
    description: (typeof style.description === 'string' && style.description.trim() !== '') 
      ? style.description 
      : DEFAULT_STYLE_DATA.description,
    baseColor: (typeof style.baseColor === 'string' && style.baseColor.trim() !== '') 
      ? style.baseColor 
      : DEFAULT_STYLE_DATA.baseColor,
    tags: safeTags,
    previewColor: safePreviewColor,
    icon: (typeof style.icon === 'string' && style.icon.trim() !== '') 
      ? style.icon 
      : DEFAULT_STYLE_DATA.icon,
    themeConfig: safeThemeConfig
  }
}

/**
 * 複数のスタイルを安全な形式に変換する
 */
export function createSafeStyles(styles: Array<Partial<StyleData> | null | undefined> | null | undefined): StyleData[] {
  if (!Array.isArray(styles)) {
    return []
  }
  
  return styles.map(style => createSafeStyle(style))
}