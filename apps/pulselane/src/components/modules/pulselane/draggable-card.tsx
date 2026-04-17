import { useDraggable } from '@dnd-kit/core'
import type { CSSProperties } from 'react'
import type { BoardCard } from '../../../features/pulselane/types'
import { cn } from '../../../utils/cn'
import { CardFace } from './card-face'

interface IDraggableCardProps {
  card: BoardCard
  index: number
  columnAccent: string
  isPulsing: boolean
  isSelected: boolean
  onSelectCard: (card: BoardCard) => void
  now: number
}

export const DraggableCard = ({
  card,
  index,
  columnAccent,
  isPulsing,
  isSelected,
  onSelectCard,
  now,
}: IDraggableCardProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: card.id,
    data: {
      type: 'card',
      cardId: card.id,
      columnId: card.columnId,
      index,
    },
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={cn(
        'w-full rounded-lg border border-border bg-accent p-2.5 text-left transition-colors touch-none hover:border-input hover:bg-accent/80',
        isSelected && "border-brand ring-1 ring-brand",
        isPulsing && "animate-[card-remote-pulse_1.8s_ease]"
      )}
      style={{ '--column-accent': columnAccent } as CSSProperties}
      onClick={() => onSelectCard(card)}
      {...attributes}
      {...listeners}
    >
      <CardFace card={card} now={now} />
    </button>
  )
}
