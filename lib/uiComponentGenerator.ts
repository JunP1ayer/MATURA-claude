/**
 * UI Component Generator
 * 
 * shadcn/ui + Tailwind CSS でモダンで美しいUIコンポーネントを生成
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export class UIComponentGenerator {
  private projectRoot: string
  private generatedFiles: string[] = []

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot
  }

  /**
   * 完全なUI システムを生成
   */
  async generateCompleteUISystem(): Promise<void> {
    console.log('🎨 Generating complete UI system with shadcn/ui + Tailwind...')

    // 1. CSS変数システム
    await this.generateGlobalStyles()

    // 2. ユーティリティ関数
    await this.generateUtilities()

    // 3. shadcn/ui 基盤コンポーネント
    await this.generateShadcnComponents()

    // 4. カスタムコンポーネント
    await this.generateCustomComponents()

    // 5. レイアウトコンポーネント
    await this.generateLayoutComponents()

    // 6. フィーチャーコンポーネント
    await this.generateFeatureComponents()

    console.log(`✅ Generated ${this.generatedFiles.length} UI files`)
  }

  /**
   * グローバルスタイルとCSS変数
   */
  private async generateGlobalStyles(): Promise<void> {
    const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .gradient-bg {
    @apply bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }

  .glass-morphism {
    @apply bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl;
  }

  .card-hover {
    @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
  }
}`

    const globalCssPath = join(this.projectRoot, 'app', 'globals.css')
    this.ensureDirectoryExists(join(this.projectRoot, 'app'))
    writeFileSync(globalCssPath, globalCss)
    this.generatedFiles.push(globalCssPath)
  }

  /**
   * ユーティリティ関数
   */
  private async generateUtilities(): Promise<void> {
    const utils = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

export function formatCurrency(amount: number, currency = 'JPY'): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency
  }).format(amount)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}`

    const utilsPath = join(this.projectRoot, 'lib', 'utils.ts')
    this.ensureDirectoryExists(join(this.projectRoot, 'lib'))
    writeFileSync(utilsPath, utils)
    this.generatedFiles.push(utilsPath)
  }

  /**
   * shadcn/ui 基盤コンポーネント
   */
  private async generateShadcnComponents(): Promise<void> {
    const componentsDir = join(this.projectRoot, 'components', 'ui')
    this.ensureDirectoryExists(componentsDir)

    // Button コンポーネント
    const buttonComponent = `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`

    const buttonPath = join(componentsDir, 'button.tsx')
    writeFileSync(buttonPath, buttonComponent)
    this.generatedFiles.push(buttonPath)

    // Card コンポーネント
    const cardComponent = `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`

    const cardPath = join(componentsDir, 'card.tsx')
    writeFileSync(cardPath, cardComponent)
    this.generatedFiles.push(cardPath)

    // Input コンポーネント
    const inputComponent = `import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }`

    const inputPath = join(componentsDir, 'input.tsx')
    writeFileSync(inputPath, inputComponent)
    this.generatedFiles.push(inputPath)

    // Badge コンポーネント
    const badgeComponent = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }`

    const badgePath = join(componentsDir, 'badge.tsx')
    writeFileSync(badgePath, badgeComponent)
    this.generatedFiles.push(badgePath)
  }

  /**
   * カスタムコンポーネント
   */
  private async generateCustomComponents(): Promise<void> {
    const componentsDir = join(this.projectRoot, 'components')
    this.ensureDirectoryExists(componentsDir)

    // Loading Spinner
    const loadingSpinner = `import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-primary", sizeClasses[size], className)} />
  )
}`

    const spinnerPath = join(componentsDir, 'loading-spinner.tsx')
    writeFileSync(spinnerPath, loadingSpinner)
    this.generatedFiles.push(spinnerPath)

    // Error Boundary
    const errorBoundary = `'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error} 
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle>エラーが発生しました</CardTitle>
          <CardDescription>
            アプリケーションで予期しないエラーが発生しました
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 font-mono">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1">
              再試行
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
              リロード
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}`

    const errorBoundaryPath = join(componentsDir, 'error-boundary.tsx')
    writeFileSync(errorBoundaryPath, errorBoundary)
    this.generatedFiles.push(errorBoundaryPath)

    // Empty State
    const emptyState = `import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon: LucideIcon
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardContent>
          <Button onClick={action.onClick} className="w-full">
            {action.label}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}`

    const emptyStatePath = join(componentsDir, 'empty-state.tsx')
    writeFileSync(emptyStatePath, emptyState)
    this.generatedFiles.push(emptyStatePath)
  }

  /**
   * レイアウトコンポーネント
   */
  private async generateLayoutComponents(): Promise<void> {
    const layoutDir = join(this.projectRoot, 'components', 'layout')
    this.ensureDirectoryExists(layoutDir)

    // App Layout
    const appLayout = `'use client'

import { ReactNode } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { Footer } from './footer'
import ErrorBoundary from '@/components/error-boundary'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="container">
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </ErrorBoundary>
    </div>
  )
}`

    const layoutPath = join(layoutDir, 'app-layout.tsx')
    writeFileSync(layoutPath, appLayout)
    this.generatedFiles.push(layoutPath)

    // Header
    const header = `'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Bell, User, Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <div className="h-6 w-6 bg-primary rounded"></div>
            <span className="hidden font-bold sm:inline-block gradient-text">
              MATURA
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <a className="text-foreground/60 transition-colors hover:text-foreground/80" href="/dashboard">
            ダッシュボード
          </a>
          <a className="text-foreground/60 transition-colors hover:text-foreground/80" href="/features">
            機能
          </a>
          <a className="text-foreground/60 transition-colors hover:text-foreground/80" href="/analytics">
            分析
          </a>
        </nav>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="検索..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}`

    const headerPath = join(layoutDir, 'header.tsx')
    writeFileSync(headerPath, header)
    this.generatedFiles.push(headerPath)

    // Sidebar
    const sidebar = `'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  FileText, 
  Calendar,
  TrendingUp,
  Database
} from 'lucide-react'

const navigation = [
  { name: 'ホーム', href: '/dashboard', icon: Home, count: null },
  { name: '分析', href: '/analytics', icon: BarChart3, count: null },
  { name: 'ユーザー', href: '/users', icon: Users, count: 12 },
  { name: 'レポート', href: '/reports', icon: FileText, count: 3 },
  { name: 'カレンダー', href: '/calendar', icon: Calendar, count: null },
  { name: 'トレンド', href: '/trends', icon: TrendingUp, count: null },
  { name: 'データ', href: '/data', icon: Database, count: null },
  { name: '設定', href: '/settings', icon: Settings, count: null },
]

export function Sidebar() {
  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto p-4">
          <nav className="grid gap-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 hover:bg-accent",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}`

    const sidebarPath = join(layoutDir, 'sidebar.tsx')
    writeFileSync(sidebarPath, sidebar)
    this.generatedFiles.push(sidebarPath)

    // Footer
    const footer = `export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex h-14 items-center justify-between text-sm text-muted-foreground">
        <p>&copy; 2024 MATURA. All rights reserved.</p>
        <div className="flex items-center space-x-4">
          <a href="/privacy" className="hover:text-foreground">プライバシー</a>
          <a href="/terms" className="hover:text-foreground">利用規約</a>
          <a href="/support" className="hover:text-foreground">サポート</a>
        </div>
      </div>
    </footer>
  )
}`

    const footerPath = join(layoutDir, 'footer.tsx')
    writeFileSync(footerPath, footer)
    this.generatedFiles.push(footerPath)
  }

  /**
   * フィーチャーコンポーネント
   */
  private async generateFeatureComponents(): Promise<void> {
    const featuresDir = join(this.projectRoot, 'components', 'features')
    this.ensureDirectoryExists(featuresDir)

    // Dashboard Stats
    const dashboardStats = `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, FileText, Calendar, DollarSign } from 'lucide-react'

interface StatCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: any
}

const stats: StatCard[] = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users
  },
  {
    title: 'Revenue',
    value: '¥1,234,567',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign
  },
  {
    title: 'Projects',
    value: '156',
    change: '-2.1%',
    trend: 'down',
    icon: FileText
  },
  {
    title: 'Events',
    value: '89',
    change: '+15.3%',
    trend: 'up',
    icon: Calendar
  }
]

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.trend === 'up' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              )}
              <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}`

    const statsPath = join(featuresDir, 'dashboard-stats.tsx')
    writeFileSync(statsPath, dashboardStats)
    this.generatedFiles.push(statsPath)

    // Data Table
    const dataTable = `'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash } from 'lucide-react'

interface TableItem {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  email: string
  role: string
  lastActive: string
}

const sampleData: TableItem[] = [
  {
    id: '1',
    name: '田中太郎',
    status: 'active',
    email: 'tanaka@example.com',
    role: 'Admin',
    lastActive: '2024-01-15'
  },
  {
    id: '2', 
    name: '佐藤花子',
    status: 'inactive',
    email: 'sato@example.com',
    role: 'User',
    lastActive: '2024-01-10'
  },
  {
    id: '3',
    name: '山田次郎',
    status: 'pending',
    email: 'yamada@example.com', 
    role: 'Editor',
    lastActive: '2024-01-12'
  }
]

export default function DataTable() {
  const [data, setData] = useState<TableItem[]>(sampleData)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAction = (action: string, id: string) => {
    console.log(\`\${action} action for item \${id}\`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage and organize your data efficiently
            </CardDescription>
          </div>
          <Button>
            Add New
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Last Active</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-4">{item.role}</td>
                  <td className="p-4">{item.lastActive}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleAction('view', item.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAction('edit', item.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAction('delete', item.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}`

    const tableePath = join(featuresDir, 'data-table.tsx')
    writeFileSync(tableePath, dataTable)
    this.generatedFiles.push(tableePath)
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
  }

  getGeneratedFiles(): string[] {
    return this.generatedFiles
  }
}

export default UIComponentGenerator