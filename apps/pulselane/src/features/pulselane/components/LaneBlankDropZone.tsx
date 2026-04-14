import { useDroppable } from '@dnd-kit/core'
import { cn } from '../../../lib/utils'

export function LaneBlankDropZone({
  columnId,
  index,
  accent,
  isActive,
  isDisabled,
}: {
  columnId: string
  index: number
  accent: string
  isActive: boolean
  isDisabled: boolean
}) {
  const { setNodeRef } = useDroppable({
    id: `lane:${columnId}`,
    data: {
      type: 'lane-body',
      columnId,
      index,
    },
    disabled: isDisabled,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-h-[3.5rem] rounded-2xl border border-dashed border-transparent transition-all",
        isActive && "border-[color-mix(in_srgb,var(--column-accent)_68%,transparent)] bg-[color-mix(in_srgb,var(--column-accent)_10%,transparent)]"
      )}
      style={{ '--column-accent': accent } as React.CSSProperties}
      aria-hidden="true"
    />
  )
}
