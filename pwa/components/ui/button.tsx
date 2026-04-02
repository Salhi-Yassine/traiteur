import * as React from "react"
import { cn } from "@/lib/utils"

// v3.0 — Airbnb-style button variants aligned to PRD design system
const buttonVariants = {
  variant: {
    // Primary: terracotta fill
    default:     "bg-[#E8472A] text-white hover:bg-[#C43A20] border border-transparent",
    primary:     "bg-[#E8472A] text-white hover:bg-[#C43A20] border border-transparent",
    // Secondary: outlined neutral-900
    secondary:   "border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] bg-transparent hover:bg-[#F7F7F7]",
    // Ghost: light border
    ghost:       "border border-[#DDDDDD] text-[#484848] bg-transparent hover:bg-[#F7F7F7] hover:border-[#B0B0B0]",
    // Outline: alias for ghost (backward compat)
    outline:     "border border-[#DDDDDD] text-[#484848] bg-transparent hover:bg-[#F7F7F7] hover:border-[#B0B0B0]",
    // Danger: outlined red
    danger:      "border-[1.5px] border-[#C13030] text-[#C13030] bg-transparent hover:bg-[#FEECEC]",
    destructive: "border-[1.5px] border-[#C13030] text-[#C13030] bg-transparent hover:bg-[#FEECEC]",
    // WhatsApp — always green, never rendered at sm size
    whatsapp:    "bg-[#25D366] text-white font-semibold hover:bg-[#20BA5A] border border-transparent",
    // Link
    link:        "text-[#E8472A] underline-offset-4 hover:underline bg-transparent border-transparent",
  },
  size: {
    // sm: 32px height — NOT for whatsapp
    sm:      "h-8 px-4 text-[13px] rounded-lg",
    // md: 40px height — default
    default: "h-10 px-5 text-[15px] rounded-lg",
    md:      "h-10 px-5 text-[15px] rounded-lg",
    // lg: 48px height
    lg:      "h-12 px-7 text-base rounded-lg",
    // icon-only
    icon:    "h-10 w-10 rounded-lg",
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
  asChild?: boolean
  loading?: boolean
}

import { Slot } from "@radix-ui/react-slot"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, disabled, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          // Base
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
          "transition-all duration-150 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8472A] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-45",
          "active:scale-[0.98]",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && !asChild ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="sr-only">Chargement…</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
