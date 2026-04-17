import { useDroppable } from '@dnd-kit/core'
import type { CSSProperties } from 'react'
import { cn } from '../../../utils/cn'

interface IDropSlotProps {
  columnId: string
  index: number
  accent: string
  isActive: boolean
  isTerminal?: boolean
}

export const DropSlot = ({
  columnId,
  index,
  accent,
  isActive,
  isTerminal = false,
}: IDropSlotProps) => {
  const { setNodeRef } = useDroppable({
    id: `slot:${columnId}:${index}`,
    data: {
      type: 'slot',
      columnId,
      index,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-2 rounded-full bg-transparent opacity-0 transition-all",
        isActive && "opacity-100",
        isTerminal && "mt-auto"
      )}
      style={{ background: isActive ? accent : 'transparent' } as CSSProperties}
      aria-hidden="true"
    />
  )
}
