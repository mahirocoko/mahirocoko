import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'icon' | 'add'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: "bg-brand text-white hover:bg-brand-hover",
      ghost: "bg-white/2 text-[#d0d6e0] border border-[#24282c] hover:bg-white/5",
      danger: "bg-transparent text-[#fecaca] border border-[#f87171]/20 hover:bg-[#7f1d1d]/10",
      icon: "bg-white/2 text-[#d0d6e0] border border-[#24282c] hover:bg-white/5",
      add: "w-full justify-center bg-white/2 text-[#d0d6e0] border border-[#24282c] hover:bg-white/5",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
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
