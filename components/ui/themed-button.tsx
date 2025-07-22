import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useThemedStyles } from "@/components/providers/ThemeProvider"
import { cn } from "@/lib/cn"

const themedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-white hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "text-white hover:opacity-90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ThemedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof themedButtonVariants> {
  asChild?: boolean
}

const ThemedButton = React.forwardRef<HTMLButtonElement, ThemedButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const { inlineStyles } = useThemedStyles()
    const Comp = asChild ? Slot : "button"
    
    const getVariantStyle = () => {
      switch (variant) {
        case 'default':
          return inlineStyles.primary
        case 'secondary':
          return inlineStyles.secondary
        case 'outline':
          return { 
            ...inlineStyles.surface, 
            color: inlineStyles.text.color,
            borderColor: inlineStyles.border.borderColor 
          }
        default:
          return {}
      }
    }

    return (
      <Comp
        className={cn(themedButtonVariants({ variant, size, className }))}
        style={{ ...getVariantStyle(), ...style }}
        ref={ref}
        {...props}
      />
    )
  }
)
ThemedButton.displayName = "ThemedButton"

export { ThemedButton, themedButtonVariants }