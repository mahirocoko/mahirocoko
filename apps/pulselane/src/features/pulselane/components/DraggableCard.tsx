import { useDraggable } from '@dnd-kit/core'
import type { BoardCard } from '../types'
import { CardFace } from './CardFace'
import { cn } from '../../../lib/utils'

export function DraggableCard({
  card,
  index,
  columnAccent,
  isPulsing,
  isSelected,
  onSelectCard,
  now,
}: {
  card: BoardCard
  index: number
  columnAccent: string
  isPulsing: boolean
  isSelected: boolean
  onSelectCard: (card: BoardCard) => void
  now: number
}) {
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
        "w-full rounded-lg border border-white/5 bg-white/2 p-2.5 text-left transition-colors touch-none hover:border-white/8 hover:bg-white/4",
        isSelected && "border-brand ring-1 ring-brand",
        isPulsing && "animate-[card-remote-pulse_1.8s_ease]"
      )}
      style={{ '--column-accent': columnAccent } as React.CSSProperties}
      onClick={() => onSelectCard(card)}
      {...attributes}
      {...listeners}
    >
      <CardFace card={card} now={now} />
    </button>
  )
}
