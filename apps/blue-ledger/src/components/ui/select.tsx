import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Select = ({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-ledger-ink shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ledger-primary/35 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
  </select>
)
