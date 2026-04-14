import type { BoardCard, BoardColumn } from '../types'
import { Button } from '../../../components/ui/Button'
import { DraggableCard } from './DraggableCard'
import { DropSlot } from './DropSlot'
import { LaneBlankDropZone } from './LaneBlankDropZone'
import type { DropTarget } from '../../../App'

export function LaneColumn({
  column,
  cards,
  composerValue,
  isComposerOpen,
  pulsingCardIds,
  selectedCardId,
  dropTarget,
  onComposerChange,
  onComposerOpen,
  onComposerClose,
  onComposerSubmit,
  onSelectCard,
  now,
}: {
  column: BoardColumn
  cards: BoardCard[]
  composerValue: string
  isComposerOpen: boolean
  pulsingCardIds: string[]
  selectedCardId: string | null
  dropTarget: DropTarget | null
  onComposerChange: (value: string) => void
  onComposerOpen: () => void
  onComposerClose: () => void
  onComposerSubmit: () => void
  onSelectCard: (card: BoardCard) => void
  now: number
}) {
  return (
    <section className="flex flex-col gap-2 min-w-[300px] flex-1">
      <header className="flex items-center justify-between px-1 py-2 text-sm font-medium">
        <p className="font-mono text-xs" style={{ color: column.accent }}>
          {column.title}
        </p>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-5 items-center justify-center rounded-full bg-white/5 px-2 text-[11px] text-muted">
            {cards.length}
          </span>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: column.accent }} />
        </div>
      </header>

      <div className="flex flex-col gap-2 min-h-[8rem] flex-1 overflow-y-auto">
        {cards.map((card, index) => (
          <div key={card.id} className="grid">
            <DropSlot
              columnId={column.id}
              index={index}
              accent={column.accent}
              isActive={dropTarget?.columnId === column.id && dropTarget.index === index}
            />

            <DraggableCard
              card={card}
              index={index}
              columnAccent={column.accent}
              isPulsing={pulsingCardIds.includes(card.id)}
              isSelected={selectedCardId === card.id}
              onSelectCard={onSelectCard}
              now={now}
            />
          </div>
        ))}

        {cards.length > 0 ? (
          <DropSlot
            columnId={column.id}
            index={cards.length}
            accent={column.accent}
            isActive={dropTarget?.columnId === column.id && dropTarget.index === cards.length}
            isTerminal
          />
        ) : null}

        <LaneBlankDropZone
          columnId={column.id}
          index={cards.length}
          accent={column.accent}
          isActive={cards.length === 0 && dropTarget?.columnId === column.id && dropTarget.index === cards.length}
          isDisabled={cards.length > 0}
        />
      </div>

      {isComposerOpen ? (
        <form
          className="mt-auto grid gap-3 p-3 rounded-lg border border-dashed border-white/18"
          onSubmit={(event) => {
            event.preventDefault()
            onComposerSubmit()
          }}
        >
          <input
            className="w-full bg-white/4 border-0 rounded-md px-3 py-1.5 text-sm focus:ring-0 focus:outline-none"
            value={composerValue}
            onChange={(event) => onComposerChange(event.target.value)}
            placeholder={`Write the next move for ${column.title}`}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={onComposerClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save card
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="add" type="button" className="mt-auto" onClick={onComposerOpen}>
          + New card
        </Button>
      )}
    </section>
  )
}
