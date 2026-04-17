import type { ReactNode } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog'
import { Button } from '../../ui/button'

interface IConfirmActionButtonProps {
  trigger: ReactNode
  title: string
  description: string
  actionLabel: string
  onConfirm: () => void
  triggerVariant?: React.ComponentProps<typeof Button>['variant']
  triggerSize?: React.ComponentProps<typeof Button>['size']
  actionVariant?: React.ComponentProps<typeof Button>['variant']
  className?: string
  disabled?: boolean
}

export const ConfirmActionButton = ({
  trigger,
  title,
  description,
  actionLabel,
  onConfirm,
  triggerVariant = 'ghost',
  triggerSize = 'sm',
  actionVariant = 'destructive',
  className,
  disabled = false,
}: IConfirmActionButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize} className={className} disabled={disabled}>
          {trigger}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={actionVariant} onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
