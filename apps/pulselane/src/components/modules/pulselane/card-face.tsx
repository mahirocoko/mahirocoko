import { cn } from '../../../utils/cn'
import type { BoardCard, CardPriority } from '../../../features/pulselane/types'

const priorityDotClassName: Record<CardPriority, string> = {
  low: 'text-signal-low',
  medium: 'text-signal-medium',
  high: 'text-signal-high',
}

const priorityChipClassName: Record<CardPriority, string> = {
  low: 'border-signal-low-border bg-signal-low-soft text-signal-low',
  medium: 'border-signal-medium-border bg-signal-medium-soft text-signal-medium',
  high: 'border-signal-high-border bg-signal-high-soft text-signal-high',
}

const formatRelativeTime = (timestamp: number, now: number) => {
  const deltaSeconds = Math.max(1, Math.round((now - timestamp) / 1000))
  if (deltaSeconds < 60) return `${deltaSeconds}s ago`
  if (deltaSeconds < 3600) return `${Math.round(deltaSeconds / 60)}m ago`
  return `${Math.round(deltaSeconds / 3600)}h ago`
}

interface ICardFaceProps {
  card: BoardCard
  now: number
}

export const CardFace = ({ card, now }: ICardFaceProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] text-muted">{card.id.slice(0, 8)}</span>
        <span className={cn('h-2 w-2 rounded-full bg-current', priorityDotClassName[card.priority])} aria-hidden="true" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[13px] font-medium leading-tight text-foreground">{card.title}</h4>
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[11px] font-medium',
            priorityChipClassName[card.priority]
          )}
        >
          {card.priority}
        </span>
      </div>
      {card.description ? <p className="mt-2 text-xs text-muted line-clamp-2">{card.description}</p> : null}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[12px] text-muted">
        <span>{card.owner || 'Unassigned'}</span>
        <span className="font-mono text-[11px]">{formatRelativeTime(card.updatedAt, now)}</span>
      </div>
    </>
  )
}
