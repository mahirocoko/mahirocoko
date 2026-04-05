import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export type LabelProps = ComponentProps<'label'>

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn('text-sm font-medium text-ledger-muted', className)}
      {...props}
    />
  )
}
