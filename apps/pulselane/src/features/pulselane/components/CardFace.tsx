import type { BoardCard } from '../types'

function formatRelativeTime(timestamp: number, now: number) {
  const deltaSeconds = Math.max(1, Math.round((now - timestamp) / 1000))
  if (deltaSeconds < 60) return `${deltaSeconds}s ago`
  if (deltaSeconds < 3600) return `${Math.round(deltaSeconds / 60)}m ago`
  return `${Math.round(deltaSeconds / 3600)}h ago`
}

export function CardFace({ card, now }: { card: BoardCard, now: number }) {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] text-[#62666d]">{card.id.slice(0, 8)}</span>
        <span className={`h-2 w-2 rounded-full bg-current priority-${card.priority}`} aria-hidden="true" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[13px] font-medium leading-tight text-[#d0d6e0]">{card.title}</h4>
        <span className={`inline-flex items-center rounded-full border border-white/8 px-1.5 py-0.5 text-[11px] font-medium text-muted priority-chip priority-${card.priority}`}>
          {card.priority}
        </span>
      </div>
      {card.description ? <p className="mt-2 text-xs text-muted line-clamp-2">{card.description}</p> : null}
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-[12px] text-muted">
        <span>{card.owner || 'Unassigned'}</span>
        <span className="font-mono text-[11px]">{formatRelativeTime(card.updatedAt, now)}</span>
      </div>
    </>
  )
}
