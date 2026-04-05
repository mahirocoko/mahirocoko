import { Button as BaseButton } from '@base-ui/react/button'
import { cn } from '@/lib/utils'

const variants = {
  default:
    'bg-ledger-primary text-white shadow-sm hover:bg-ledger-primary-deep focus-visible:outline-ledger-primary/40',
  outline:
    'border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-slate-400',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400',
} as const

export type ButtonProps = BaseButton.Props & {
  variant?: keyof typeof variants
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
