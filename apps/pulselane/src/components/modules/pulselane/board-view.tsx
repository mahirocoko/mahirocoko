import { useMemo } from 'react'
import { DndContext, DragOverlay, MeasuringStrategy, type DragStartEvent, type DragOverEvent, type DragEndEvent, type CollisionDetection, pointerWithin, closestCenter, type SensorDescriptor, type SensorOptions } from '@dnd-kit/core'
import type { BoardCard, BoardDocument } from '../../../features/pulselane/types'
import { getCardsForColumn } from '../../../features/pulselane/board'
import { CardFace } from './card-face'
import { LaneColumn } from './lane-column'
import type { IDropTarget, IDragState } from './ui-types'

interface IBoardViewProps {
  board: BoardDocument
  sensors: SensorDescriptor<SensorOptions>[]
  pulsingCardIds: string[]
  selectedCardId: string | null
  dropTarget: IDropTarget | null
  dragState: IDragState | null
  composerValue: Record<string, string>
  composerOpen: Record<string, boolean>
  onDragStart: (event: DragStartEvent) => void
  onDragOver: (event: DragOverEvent) => void
  onDragEnd: (event: DragEndEvent) => void
  onDragCancel: () => void
  onComposerChange: (columnId: string, value: string) => void
  onComposerOpen: (columnId: string) => void
  onComposerClose: (columnId: string) => void
  onComposerSubmit: (columnId: string) => void
  onSelectCard: (card: BoardCard) => void
}

const customCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  const slotCollision = pointerCollisions.find(
    (c) => c.data?.droppableContainer?.data?.current?.type === 'slot'
  )

  if (slotCollision) {
    return [slotCollision]
  }

  return closestCenter(args)
}

export const BoardView = ({
  board,
  sensors,
  pulsingCardIds,
  selectedCardId,
  dropTarget,
  dragState,
  composerValue,
  composerOpen,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
  onComposerChange,
  onComposerOpen,
  onComposerClose,
  onComposerSubmit,
  onSelectCard,
}: IBoardViewProps) => {
  const cardsByColumn = useMemo(() => {
    return new Map(board.columns.map((column) => [column.id, getCardsForColumn(board, column.id)]))
  }, [board])

  const draggedCard = board.cards.find((card) => card.id === dragState?.cardId) ?? null
  const draggedColumn = board.columns.find((column) => column.id === dragState?.columnId) ?? null
  const now = board.updatedAt

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {board.columns.map((column) => (
          <LaneColumn
            key={column.id}
            column={column}
            cards={cardsByColumn.get(column.id) ?? []}
            composerValue={composerValue[column.id] ?? ''}
            isComposerOpen={composerOpen[column.id] ?? false}
            pulsingCardIds={pulsingCardIds}
            selectedCardId={selectedCardId}
            dropTarget={dropTarget}
            onComposerChange={(value) => onComposerChange(column.id, value)}
            onComposerOpen={() => onComposerOpen(column.id)}
            onComposerClose={() => onComposerClose(column.id)}
            onComposerSubmit={() => onComposerSubmit(column.id)}
            onSelectCard={onSelectCard}
            now={now}
          />
        ))}
      </div>

      <DragOverlay>
        {draggedCard && draggedColumn ? (
          <div className="rounded-lg border border-white/8 bg-popover/90 p-3 backdrop-blur-sm">
            <CardFace card={draggedCard} now={now} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
