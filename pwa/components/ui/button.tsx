import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-premium",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    premium: "bg-primary text-white border border-white/10 hover:bg-primary/95 shadow-premium backdrop-blur-md",
  },
  size: {
    default: "h-11 px-6 py-2.5",
    sm: "h-9 rounded-xl px-4 text-xs",
    lg: "h-14 rounded-2xl px-10 text-base",
    icon: "h-11 w-11",
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    // Note: asChild functionality not fully implemented here to avoid additional dependencies (Radix Slot)
    // If needed, we can implement a simple switch or use Slot if/when installed.
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-black uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
