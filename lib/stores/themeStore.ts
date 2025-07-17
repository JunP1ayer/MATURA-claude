import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ThemeConfig {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  accent: string
}

export interface StyleData {
  id: string
  name: string
  description: string
  baseColor: string
  tags: string[]
  previewColor: string[]
  icon: string
  themeConfig: ThemeConfig
}

interface ThemeState {
  selectedTheme: StyleData | null
  isThemeApplied: boolean
  setSelectedTheme: (theme: StyleData) => void
  clearTheme: () => void
  applyTheme: () => void
  getThemeClasses: () => {
    primaryBg: string
    primaryText: string
    secondaryBg: string
    secondaryText: string
    surfaceBg: string
    borderColor: string
    textColor: string
    textSecondaryColor: string
    accentBg: string
    accentText: string
  }
}

const defaultTheme: StyleData = {
  id: 'default',
  name: 'デフォルト',
  description: 'システムデフォルトテーマ',
  baseColor: 'blue',
  tags: ['デフォルト'],
  previewColor: ['#3b82f6', '#6366f1', '#f8fafc'],
  icon: 'settings',
  themeConfig: {
    primary: '#3b82f6',
    secondary: '#6366f1', 
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    accent: '#8b5cf6'
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      selectedTheme: null,
      isThemeApplied: false,
      
      setSelectedTheme: (theme: StyleData) => {
        set({ selectedTheme: theme, isThemeApplied: true })
        
        // CSS変数としてテーマを適用
        if (typeof window !== 'undefined') {
          const root = document.documentElement
          const config = theme.themeConfig
          
          root.style.setProperty('--theme-primary', config.primary)
          root.style.setProperty('--theme-secondary', config.secondary)
          root.style.setProperty('--theme-background', config.background)
          root.style.setProperty('--theme-surface', config.surface)
          root.style.setProperty('--theme-text', config.text)
          root.style.setProperty('--theme-text-secondary', config.textSecondary)
          root.style.setProperty('--theme-border', config.border)
          root.style.setProperty('--theme-accent', config.accent)
        }
      },
      
      clearTheme: () => {
        set({ selectedTheme: null, isThemeApplied: false })
        
        // CSS変数をリセット
        if (typeof window !== 'undefined') {
          const root = document.documentElement
          const config = defaultTheme.themeConfig
          
          root.style.setProperty('--theme-primary', config.primary)
          root.style.setProperty('--theme-secondary', config.secondary)
          root.style.setProperty('--theme-background', config.background)
          root.style.setProperty('--theme-surface', config.surface)
          root.style.setProperty('--theme-text', config.text)
          root.style.setProperty('--theme-text-secondary', config.textSecondary)
          root.style.setProperty('--theme-border', config.border)
          root.style.setProperty('--theme-accent', config.accent)
        }
      },
      
      applyTheme: () => {
        const { selectedTheme } = get()
        if (selectedTheme) {
          set({ isThemeApplied: true })
          
          if (typeof window !== 'undefined') {
            const root = document.documentElement
            const config = selectedTheme.themeConfig
            
            root.style.setProperty('--theme-primary', config.primary)
            root.style.setProperty('--theme-secondary', config.secondary)
            root.style.setProperty('--theme-background', config.background)
            root.style.setProperty('--theme-surface', config.surface)
            root.style.setProperty('--theme-text', config.text)
            root.style.setProperty('--theme-text-secondary', config.textSecondary)
            root.style.setProperty('--theme-border', config.border)
            root.style.setProperty('--theme-accent', config.accent)
          }
        }
      },
      
      getThemeClasses: () => {
        const { selectedTheme } = get()
        const theme = selectedTheme || defaultTheme
        
        return {
          primaryBg: `bg-[${theme.themeConfig.primary}]`,
          primaryText: `text-[${theme.themeConfig.primary}]`,
          secondaryBg: `bg-[${theme.themeConfig.secondary}]`,
          secondaryText: `text-[${theme.themeConfig.secondary}]`,
          surfaceBg: `bg-[${theme.themeConfig.surface}]`,
          borderColor: `border-[${theme.themeConfig.border}]`,
          textColor: `text-[${theme.themeConfig.text}]`,
          textSecondaryColor: `text-[${theme.themeConfig.textSecondary}]`,
          accentBg: `bg-[${theme.themeConfig.accent}]`,
          accentText: `text-[${theme.themeConfig.accent}]`
        }
      }
    }),
    {
      name: 'matura-theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        selectedTheme: state.selectedTheme,
        isThemeApplied: state.isThemeApplied 
      }),
    }
  )
)