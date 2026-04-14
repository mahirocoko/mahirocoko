import { useDroppable } from '@dnd-kit/core'
import { cn } from '../../../lib/utils'

export function DropSlot({
  columnId,
  index,
  accent,
  isActive,
  isTerminal = false,
}: {
  columnId: string
  index: number
  accent: string
  isActive: boolean
  isTerminal?: boolean
}) {
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
      style={{ background: isActive ? accent : 'transparent' } as React.CSSProperties}
      aria-hidden="true"
    />
  )
}
