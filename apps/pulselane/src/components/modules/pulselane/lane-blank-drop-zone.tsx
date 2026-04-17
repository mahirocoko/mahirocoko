import { useDroppable } from '@dnd-kit/core'
import type { CSSProperties } from 'react'
import { cn } from '../../../utils/cn'

interface ILaneBlankDropZoneProps {
  columnId: string
  index: number
  accent: string
  isActive: boolean
  isDisabled: boolean
}

export const LaneBlankDropZone = ({
  columnId,
  index,
  accent,
  isActive,
  isDisabled,
}: ILaneBlankDropZoneProps) => {
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
      style={{ '--column-accent': accent } as CSSProperties}
      aria-hidden="true"
    />
  )
}
