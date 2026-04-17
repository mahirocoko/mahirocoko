import { Button } from '../../ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '../../ui/field'
import { Input } from '../../ui/input'
import type { BoardCard, BoardColumn } from '../../../features/pulselane/types'
import { DraggableCard } from './draggable-card'
import { DropSlot } from './drop-slot'
import { LaneBlankDropZone } from './lane-blank-drop-zone'
import type { IDropTarget } from './ui-types'

interface ILaneColumnProps {
  column: BoardColumn
  cards: BoardCard[]
  composerValue: string
  isComposerOpen: boolean
  pulsingCardIds: string[]
  selectedCardId: string | null
  dropTarget: IDropTarget | null
  onComposerChange: (value: string) => void
  onComposerOpen: () => void
  onComposerClose: () => void
  onComposerSubmit: () => void
  onSelectCard: (card: BoardCard) => void
  now: number
}

export const LaneColumn = ({
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
}: ILaneColumnProps) => {
  return (
    <section className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg bg-surface p-2">
      <header className="flex items-center justify-between px-1 py-1.5 text-sm font-medium">
        <div className="flex items-center gap-1.5">
          <p className="font-mono text-xs" style={{ color: column.accent }}>
            {column.title}
          </p>
          <span className="inline-flex h-5 items-center justify-center rounded-full border border-border bg-accent px-2 text-[11px] text-muted">
            {cards.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: column.accent }} />
        </div>
      </header>

      <div className="flex min-h-[8rem] flex-1 flex-col gap-2 overflow-y-auto">
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
          className="mt-auto grid gap-3 rounded-lg border border-border bg-popover p-2.5"
          onSubmit={(event) => {
            event.preventDefault()
            onComposerSubmit()
          }}
        >
          <Field>
            <FieldContent>
              <FieldLabel className="sr-only" htmlFor={`composer-${column.id}`}>
                New card in {column.title}
              </FieldLabel>
              <Input
                id={`composer-${column.id}`}
                value={composerValue}
                onChange={(event) => onComposerChange(event.target.value)}
                placeholder={`Write the next move for ${column.title}`}
                autoFocus
              />
              <FieldDescription>Add the next concrete move for this lane.</FieldDescription>
            </FieldContent>
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onComposerClose}>
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit">
              Save card
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="ghost" type="button" className="mt-auto w-full justify-center text-muted-foreground hover:text-foreground" onClick={onComposerOpen}>
          + New card
        </Button>
      )}
    </section>
  )
}
