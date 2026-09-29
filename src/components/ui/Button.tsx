import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-light)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 hover:-translate-y-0.5 shadow-md",
        destructive: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5",
        outline: "border border-[var(--color-border-gold)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15 hover:border-[var(--color-primary)] hover:shadow-md hover:shadow-[var(--color-primary)]/10 hover:-translate-y-0.5",
        secondary: "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-secondary)]/90 hover:border-[var(--color-border-gold)] hover:shadow-md hover:-translate-y-0.5",
        ghost: "hover:bg-[var(--color-secondary)]/80 hover:text-[var(--color-primary)] hover:border-[var(--color-border-gold)]/40",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline hover:text-[var(--color-primary-light)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
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

export { Button };
