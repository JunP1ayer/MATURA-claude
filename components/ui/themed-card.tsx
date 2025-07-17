import * as React from "react"
import { cn } from "@/lib/cn"
import { useThemedStyles } from "@/components/providers/ThemeProvider"

const ThemedCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const { inlineStyles } = useThemedStyles()
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      style={{ 
        ...inlineStyles.surface,
        ...style 
      }}
      {...props}
    />
  )
})
ThemedCard.displayName = "ThemedCard"

const ThemedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
ThemedCardHeader.displayName = "ThemedCardHeader"

const ThemedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, style, ...props }, ref) => {
  const { inlineStyles } = useThemedStyles()
  
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      style={{ 
        ...inlineStyles.text,
        ...style 
      }}
      {...props}
    />
  )
})
ThemedCardTitle.displayName = "ThemedCardTitle"

const ThemedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, style, ...props }, ref) => {
  const { inlineStyles } = useThemedStyles()
  
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      style={{ 
        ...inlineStyles.textSecondary,
        ...style 
      }}
      {...props}
    />
  )
})
ThemedCardDescription.displayName = "ThemedCardDescription"

const ThemedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
ThemedCardContent.displayName = "ThemedCardContent"

const ThemedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
ThemedCardFooter.displayName = "ThemedCardFooter"

export { 
  ThemedCard, 
  ThemedCardHeader, 
  ThemedCardFooter, 
  ThemedCardTitle, 
  ThemedCardDescription, 
  ThemedCardContent 
}