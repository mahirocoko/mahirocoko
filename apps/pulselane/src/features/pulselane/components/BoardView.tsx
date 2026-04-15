import { useMemo } from 'react'
import type { BoardCard, BoardDocument } from '../types'
import { getCardsForColumn } from '../board'
import { LaneColumn } from './LaneColumn'
import { DndContext, DragOverlay, MeasuringStrategy, type DragStartEvent, type DragOverEvent, type DragEndEvent, type CollisionDetection, pointerWithin, closestCenter, type SensorDescriptor, type SensorOptions } from '@dnd-kit/core'
import { CardFace } from './CardFace'
import type { DropTarget, DragState } from '../../../App'

interface BoardViewProps {
  board: BoardDocument
  sensors: SensorDescriptor<SensorOptions>[]
  pulsingCardIds: string[]
  selectedCardId: string | null
  dropTarget: DropTarget | null
  dragState: DragState | null
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

export function BoardView({
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
}: BoardViewProps) {
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
      <div className="flex gap-4 overflow-x-auto pb-2">
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
          <div className="border border-white/5 rounded-lg p-3 bg-white/5 shadow-2xl">
            <CardFace card={draggedCard} now={now} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
