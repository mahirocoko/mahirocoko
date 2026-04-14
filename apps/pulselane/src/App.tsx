import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { addCard, deleteCard, getCardsForColumn, moveCard, updateCard } from './features/pulselane/board'
import { DEFAULT_DOCUMENT_PATH, getDefaultConfig } from './features/pulselane/schema'
import { usePulselane } from './features/pulselane/use-pulselane'
import type { BoardCard, BoardColumn } from './features/pulselane/types'

const DEFAULT_CONFIG = getDefaultConfig()

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

interface DraftCardEditor {
  title: string
  owner: string
  priority: BoardCard['priority']
  description: string
}

interface DragState {
  cardId: string
  columnId: string
  index: number
}

interface DropTarget {
  columnId: string
  index: number
}

function App() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [cardDraft, setCardDraft] = useState<DraftCardEditor | null>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const [composerValue, setComposerValue] = useState<Record<string, string>>({})
  const [composerOpen, setComposerOpen] = useState<Record<string, boolean>>({})

  const activeConfig = hasRequiredConfig(DEFAULT_CONFIG) ? DEFAULT_CONFIG : null
  const {
    board,
    connectionStatus,
    error,
    isHydrating,
    lastSyncedAt,
    pulsingCardIds,
    commit,
    seedBoard,
    resetBoard,
  } = usePulselane(activeConfig)

  const selectedCard = board?.cards.find((card) => card.id === selectedCardId) ?? null
  const selectedColumn = board?.columns.find((column) => column.id === selectedCard?.columnId) ?? null
  const draggedCard = board?.cards.find((card) => card.id === dragState?.cardId) ?? null
  const draggedColumn = board?.columns.find((column) => column.id === dragState?.columnId) ?? null
  const totalCards = board?.cards.length ?? 0
  const totalColumns = board?.columns.length ?? 0
  const hasWorkspace = Boolean(activeConfig)
  const cardsByColumn = useMemo(() => {
    if (!board) {
      return new Map<string, BoardCard[]>()
    }

    return new Map(board.columns.map((column) => [column.id, getCardsForColumn(board, column.id)]))
  }, [board])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  const closeCard = () => {
    setSelectedCardId(null)
    setCardDraft(null)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      setSelectedCardId(null)
      setCardDraft(null)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const openCard = (card: BoardCard) => {
    setSelectedCardId(card.id)
    setCardDraft({
      title: card.title,
      owner: card.owner,
      priority: card.priority,
      description: card.description,
    })
  }

  const handleAddCard = (columnId: string) => {
    const title = (composerValue[columnId] ?? '').trim()
    if (!title || !board) {
      return
    }

    commit((currentBoard) => addCard(currentBoard, columnId, title))
    setComposerValue((current) => ({ ...current, [columnId]: '' }))
    setComposerOpen((current) => ({ ...current, [columnId]: false }))
  }

  const handleOpenComposer = (columnId: string) => {
    setComposerOpen((current) => ({ ...current, [columnId]: true }))
  }

  const handleCloseComposer = (columnId: string) => {
    setComposerOpen((current) => ({ ...current, [columnId]: false }))
    setComposerValue((current) => ({ ...current, [columnId]: '' }))
  }

  const handleSaveCardDraft = () => {
    if (!selectedCard || !cardDraft) {
      return
    }

    commit((currentBoard) =>
      updateCard(currentBoard, selectedCard.id, {
        title: cardDraft.title.trim() || 'Untitled pulse',
        owner: cardDraft.owner.trim(),
        priority: cardDraft.priority,
        description: cardDraft.description,
      }),
    )

    closeCard()
  }

  const handleDeleteCard = () => {
    if (!selectedCard) {
      return
    }

    commit((currentBoard) => deleteCard(currentBoard, selectedCard.id))
    closeCard()
  }

  const handleDragStart = (event: DragStartEvent) => {
    const activeData = event.active.data.current
    if (activeData?.type !== 'card') {
      return
    }

    setDragState({
      cardId: String(activeData.cardId),
      columnId: String(activeData.columnId),
      index: Number(activeData.index),
    })
  }

  const handleDragOver = (event: DragOverEvent) => {
    const nextTarget = resolveDropTarget(event.active.data.current, event.over?.data.current)
    setDropTarget((current) => (areDropTargetsEqual(current, nextTarget) ? current : nextTarget))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const nextTarget = resolveDropTarget(event.active.data.current, event.over?.data.current)

    if (board && nextTarget) {
      let finalIndex = nextTarget.index
      const activeData = event.active.data.current
      
      if (
        isRecord(activeData) &&
        String(activeData.columnId) === nextTarget.columnId &&
        Number(activeData.index) < nextTarget.index
      ) {
        finalIndex = nextTarget.index - 1
      }

      commit((currentBoard) => moveCard(currentBoard, String(event.active.id), nextTarget.columnId, finalIndex))
    }

    setDragState(null)
    setDropTarget(null)
  }

  const handleDragCancel = () => {
    setDragState(null)
    setDropTarget(null)
  }

  return (
    <div className="app-shell">
      <header className="app-header surface">
        <div className="app-header-left">
          <div className="brand-mark" aria-hidden="true">PL</div>
          <span className="app-title">PulseLane</span>

          {hasWorkspace ? (
            <>
              <span className="board-context">{board?.title ?? 'Board'}</span>
              <span className="header-divider" />
              <span className="board-path">{DEFAULT_CONFIG.documentPath || DEFAULT_DOCUMENT_PATH}</span>
            </>
          ) : null}
        </div>

        <div className="app-header-right">
          {hasWorkspace ? (
            <>
              <span className={`status-pill status-${connectionStatus}`}>
                <span className="status-dot" />
                {formatStatus(connectionStatus)}
              </span>
              <span className="header-stat">{totalCards} cards</span>
              <span className="header-stat">{totalColumns} columns</span>
              <span className="header-stat">Synced {formatSyncTime(lastSyncedAt)}</span>
              <button type="button" className="ghost-button" onClick={resetBoard} disabled={!board}>
                Reset
              </button>
            </>
          ) : null}
        </div>
      </header>

      <main className="workspace-shell">
        <section className="board-shell surface">
          {error ? <div className="board-error">{error}</div> : null}

          {!hasWorkspace ? (
            <div className="board-empty-state developer-state">
              <p>Environment not configured</p>
            </div>
          ) : null}

          {hasWorkspace && isHydrating ? (
            <div className="board-empty-state">
              <p>Loading board...</p>
            </div>
          ) : null}

          {hasWorkspace && !isHydrating && !board ? (
            <div className="board-empty-state">
              <p>No board found</p>
              <button type="button" className="primary-button" onClick={seedBoard} disabled={!activeConfig}>
                Create board
              </button>
            </div>
          ) : null}

          {hasWorkspace && board ? (
            <DndContext
              sensors={sensors}
              collisionDetection={customCollisionDetection}
              measuring={{
                droppable: {
                  strategy: MeasuringStrategy.Always,
                },
              }}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <div className="lanes-scroll">
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
                    onComposerChange={(value) =>
                      setComposerValue((current) => ({ ...current, [column.id]: value }))
                    }
                    onComposerOpen={() => handleOpenComposer(column.id)}
                    onComposerClose={() => handleCloseComposer(column.id)}
                    onComposerSubmit={() => handleAddCard(column.id)}
                    onSelectCard={openCard}
                  />
                ))}
              </div>

              <DragOverlay>
                {draggedCard && draggedColumn ? (
                  <div
                    className="pulse-card pulse-card-overlay"
                    style={{ '--column-accent': draggedColumn.accent } as CSSProperties}
                  >
                    <CardFace card={draggedCard} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : null}
        </section>
      </main>

      {selectedCard && cardDraft ? (
        <aside className="detail-drawer surface">
          <div className="detail-head">
            <div>
              <p className="eyebrow">Card detail</p>
              <h2>{selectedCard.title}</h2>
              {selectedColumn ? (
                <span className="column-badge" style={{ '--column-accent': selectedColumn.accent } as CSSProperties}>
                  {selectedColumn.title}
                </span>
              ) : null}
            </div>

            <button type="button" className="icon-button" onClick={closeCard}>
              Close
            </button>
          </div>

          <div className="field-stack">
            <label className="field-block">
              <span>Title</span>
              <input
                value={cardDraft.title}
                onChange={(event) =>
                  setCardDraft((current) =>
                    current ? { ...current, title: event.target.value } : current,
                  )
                }
              />
            </label>

            <label className="field-block">
              <span>Owner</span>
              <input
                value={cardDraft.owner}
                onChange={(event) =>
                  setCardDraft((current) =>
                    current ? { ...current, owner: event.target.value } : current,
                  )
                }
                placeholder="Lina"
              />
            </label>

            <label className="field-block">
              <span>Priority</span>
              <select
                value={cardDraft.priority}
                onChange={(event) =>
                  setCardDraft((current) =>
                    current
                      ? { ...current, priority: event.target.value as BoardCard['priority'] }
                      : current,
                  )
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="field-block">
              <span>Notes</span>
              <textarea
                rows={5}
                value={cardDraft.description}
                onChange={(event) =>
                  setCardDraft((current) =>
                    current ? { ...current, description: event.target.value } : current,
                  )
                }
                placeholder="Add context, links, or handoff notes."
              />
            </label>
          </div>

          <div className="detail-meta">
            <span>Updated {formatRelativeTime(selectedCard.updatedAt)}</span>
            <span className={`priority-chip priority-${selectedCard.priority}`}>
              {selectedCard.priority}
            </span>
          </div>

          <div className="modal-actions">
            <button type="button" className="danger-button" onClick={handleDeleteCard}>
              Delete card
            </button>
            <button type="button" className="primary-button" onClick={handleSaveCardDraft}>
              Save changes
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  )
}

function LaneColumn({
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
}) {
  return (
    <section className="lane-column">
      <header className="lane-head">
        <p className="lane-kicker" style={{ color: column.accent }}>
          {column.title}
        </p>
        <div className="lane-head-meta">
          <span className="lane-count">{cards.length}</span>
          <span className="lane-dot" style={{ background: column.accent }} />
        </div>
      </header>

      <div className="lane-stack">
        {cards.map((card, index) => (
          <div key={card.id} className="lane-item">
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
          className="composer-card"
          onSubmit={(event) => {
            event.preventDefault()
            onComposerSubmit()
          }}
        >
          <input
            value={composerValue}
            onChange={(event) => onComposerChange(event.target.value)}
            placeholder={`Write the next move for ${column.title}`}
          />
          <div className="composer-actions">
            <button type="button" className="ghost-button" onClick={onComposerClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save card
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="add-card-button" onClick={onComposerOpen}>
          + New card
        </button>
      )}
    </section>
  )
}

function DraggableCard({
  card,
  index,
  columnAccent,
  isPulsing,
  isSelected,
  onSelectCard,
}: {
  card: BoardCard
  index: number
  columnAccent: string
  isPulsing: boolean
  isSelected: boolean
  onSelectCard: (card: BoardCard) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
    data: {
      type: 'card',
      cardId: card.id,
      columnId: card.columnId,
      index,
    },
  })

  const style = {
    '--column-accent': columnAccent,
    opacity: isDragging ? 0.3 : 1,
  } as CSSProperties

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`pulse-card${isSelected ? ' pulse-card-active' : ''}${isPulsing ? ' pulse-card-remote' : ''}${isDragging ? ' pulse-card-dragging' : ''}`}
      style={style}
      onClick={() => onSelectCard(card)}
      {...attributes}
      {...listeners}
    >
      <CardFace card={card} />
    </button>
  )
}

function CardFace({ card }: { card: BoardCard }) {
  return (
    <>
      <div className="card-topline">
        <span className="tiny-mono card-id">{card.id.slice(0, 8)}</span>
        <span className={`priority-dot priority-${card.priority}`} aria-hidden="true" />
      </div>
      <div className="card-title-row">
        <h4>{card.title}</h4>
        <span className={`priority-chip priority-${card.priority}`}>{card.priority}</span>
      </div>
      {card.description ? <p>{card.description}</p> : null}
      <div className="card-footer">
        <span>{card.owner || 'Unassigned'}</span>
        <span className="tiny-mono">{formatRelativeTime(card.updatedAt)}</span>
      </div>
    </>
  )
}

function DropSlot({
  columnId,
  index,
  accent,
  isActive,
  isTerminal = false,
}: {
  columnId: string
  index: number
  accent: string
  isActive: boolean
  isTerminal?: boolean
}) {
  const { setNodeRef } = useDroppable({
    id: `slot:${columnId}:${index}`,
    data: {
      type: 'slot',
      columnId,
      index,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={`drop-slot${isActive ? ' drop-slot-active' : ''}${isTerminal ? ' drop-slot-terminal' : ''}`}
      style={{ '--column-accent': accent } as CSSProperties}
      aria-hidden="true"
    />
  )
}

function LaneBlankDropZone({
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
      className={`lane-blank-drop${isActive ? ' lane-blank-drop-active' : ''}`}
      style={{ '--column-accent': accent } as CSSProperties}
      aria-hidden="true"
    />
  )
}

function hasRequiredConfig(config: typeof DEFAULT_CONFIG) {
  return Boolean(config.projectId.trim() && config.apiKey.trim())
}

function formatStatus(status: ReturnType<typeof usePulselane>['connectionStatus']) {
  switch (status) {
    case 'live':
      return 'Pulse active'
    case 'connecting':
      return 'Connecting'
    case 'reconnecting':
      return 'Reconnecting'
    case 'error':
      return 'Link degraded'
    default:
      return 'Idle'
  }
}

function formatSyncTime(timestamp: number | null) {
  if (!timestamp) {
    return 'No sync yet'
  }

  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRelativeTime(timestamp: number) {
  const deltaSeconds = Math.max(1, Math.round((Date.now() - timestamp) / 1000))

  if (deltaSeconds < 60) {
    return `${deltaSeconds}s ago`
  }

  if (deltaSeconds < 3600) {
    return `${Math.round(deltaSeconds / 60)}m ago`
  }

  return `${Math.round(deltaSeconds / 3600)}h ago`
}

function resolveDropTarget(activeData: unknown, overData: unknown): DropTarget | null {
  if (
    !isRecord(activeData) ||
    !isRecord(overData) ||
    (overData.type !== 'slot' && overData.type !== 'lane-body')
  ) {
    return null
  }

  const columnId = String(overData.columnId)
  const rawIndex = Number(overData.index)

  if (Number.isNaN(rawIndex)) {
    return null
  }

  return {
    columnId,
    index: Math.max(rawIndex, 0),
  }
}

function areDropTargetsEqual(left: DropTarget | null, right: DropTarget | null) {
  if (!left || !right) {
    return left === right
  }

  return left.columnId === right.columnId && left.index === right.index
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export default App
