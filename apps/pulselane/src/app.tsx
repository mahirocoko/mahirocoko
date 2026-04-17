import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Columns3, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BoardSidebar } from './components/modules/pulselane/board-sidebar'
import { BoardView } from './components/modules/pulselane/board-view'
import { CardDetailSheet } from './components/modules/pulselane/card-detail-sheet'
import { ColumnManagerSheet } from './components/modules/pulselane/column-manager-sheet'
import { ConfirmActionButton } from './components/modules/pulselane/confirm-action-button'
import { MemberManagerSheet } from './components/modules/pulselane/member-manager-sheet'
import type { IDragState, IDropTarget } from './components/modules/pulselane/ui-types'
import { Button } from './components/ui/button'
import {
  addCard,
  addColumn,
  addMember,
  deleteCard,
  ensureMember,
  moveCard,
  moveColumn,
  removeColumn,
  removeMember,
  updateCard,
  updateColumn,
  updateMember,
} from './features/pulselane/board'
import { DEFAULT_DOCUMENT_PATH, getDefaultConfig } from './features/pulselane/schema'
import type { BoardCard } from './features/pulselane/types'
import { usePulselane } from './hooks/use-pulselane'
import { cn } from './utils/cn'

const DEFAULT_CONFIG = getDefaultConfig()

const App = () => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [dragState, setDragState] = useState<IDragState | null>(null)
  const [dropTarget, setDropTarget] = useState<IDropTarget | null>(null)
  const [composerValue, setComposerValue] = useState<Record<string, string>>({})
  const [composerOpen, setComposerOpen] = useState<Record<string, boolean>>({})
  const [isMemberManagerOpen, setIsMemberManagerOpen] = useState(false)
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false)

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
  const totalCards = board?.cards.length ?? 0
  const totalColumns = board?.columns.length ?? 0
  const hasWorkspace = Boolean(activeConfig)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  const closeCard = () => {
    setSelectedCardId(null)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.key !== 'Escape') return
      closeCard()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openCard = (card: BoardCard) => {
    setSelectedCardId(card.id)
  }

  const handleAddCard = (columnId: string) => {
    const title = (composerValue[columnId] ?? '').trim()
    if (!title || !board) return

    commit((currentBoard) => addCard(currentBoard, columnId, title))
    setComposerValue((current) => ({ ...current, [columnId]: '' }))
    setComposerOpen((current) => ({ ...current, [columnId]: false }))
  }

  const handleSaveCardDraft = (draft: ReturnType<typeof toDraftCardEditor>) => {
    if (!selectedCard) return
    const nextTitle = draft.title.trim()

    commit((currentBoard) =>
      updateCard(ensureMember(currentBoard, draft.owner), selectedCard.id, {
        title: nextTitle,
        owner: draft.owner.trim(),
        priority: draft.priority,
        description: draft.description,
      }),
    )
    closeCard()
  }

  const handleDeleteCard = () => {
    if (!selectedCard) return
    commit((currentBoard) => deleteCard(currentBoard, selectedCard.id))
    closeCard()
  }

  const handleDragStart = (event: DragStartEvent) => {
    const activeData = event.active.data.current
    if (activeData?.type !== 'card') return

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

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <header className="z-10 border-b border-border bg-background px-4 py-3 text-xs font-medium">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-4 w-4 place-items-center rounded bg-brand text-[10px] font-bold text-primary-foreground">PL</div>
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-sm text-foreground">PulseLane</span>

                {hasWorkspace ? (
                  <>
                    <span className="hidden h-3.5 w-px bg-border sm:block" />
                    <span className="truncate text-sm text-foreground">{board?.title ?? 'Board'}</span>
                  </>
                ) : null}
              </div>
              {hasWorkspace ? (
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5', {
                    'text-brand': connectionStatus === 'live',
                    'text-warning': ['connecting', 'reconnecting'].includes(connectionStatus),
                    'text-error': connectionStatus === 'error',
                    'text-muted': connectionStatus === 'idle',
                  })}>
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {formatStatus(connectionStatus)}
                  </span>
                  <span className="truncate font-mono">{DEFAULT_CONFIG.documentPath || DEFAULT_DOCUMENT_PATH}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:hidden">
            {hasWorkspace ? (
              <>
                <span className="mr-auto text-[11px] text-muted">{totalCards} cards · {totalColumns} columns</span>
                <Button variant="ghost" size="sm" onClick={() => setIsMemberManagerOpen(true)} disabled={!board}>
                <Users className="size-4" />
                Members
              </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsColumnManagerOpen(true)} disabled={!board}>
                <Columns3 className="size-4" />
                Columns
              </Button>
                <ConfirmActionButton
                  trigger={<>Reset</>}
                  title="Reset board"
                  description="This replaces the current board with a fresh starter board and removes your in-progress layout changes."
                  actionLabel="Reset"
                  onConfirm={resetBoard}
                  triggerVariant="ghost"
                  triggerSize="sm"
                  disabled={!board}
                />
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden p-3 md:p-4">
        <section className="grid h-full gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
          {error ? <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive-foreground">{error}</div> : null}

          {!hasWorkspace ? (
            <div className="flex flex-1 flex-col items-center justify-center text-sm text-muted">
              <p>Environment not configured</p>
            </div>
          ) : null}

          {hasWorkspace && isHydrating ? (
            <div className="flex flex-1 flex-col items-center justify-center text-sm text-muted">
              <p>Loading board...</p>
            </div>
          ) : null}

          {hasWorkspace && !isHydrating && !board ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-muted">
              <p>No board found</p>
              <Button variant="default" onClick={seedBoard} disabled={!activeConfig}>Create board</Button>
            </div>
          ) : null}

          {hasWorkspace && board ? (
            <>
              <BoardSidebar
                board={board}
                connectionStatus={connectionStatus}
                lastSyncedAt={lastSyncedAt}
                documentPath={DEFAULT_CONFIG.documentPath || DEFAULT_DOCUMENT_PATH}
                onOpenMembers={() => setIsMemberManagerOpen(true)}
                onOpenColumns={() => setIsColumnManagerOpen(true)}
                onResetBoard={resetBoard}
              />
              <BoardView
              board={board}
              sensors={sensors}
              pulsingCardIds={pulsingCardIds}
              selectedCardId={selectedCardId}
              dropTarget={dropTarget}
              dragState={dragState}
              composerValue={composerValue}
              composerOpen={composerOpen}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={() => {
                setDragState(null)
                setDropTarget(null)
              }}
              onComposerChange={(id, value) => setComposerValue((current) => ({ ...current, [id]: value }))}
              onComposerOpen={(id) => setComposerOpen((current) => ({ ...current, [id]: true }))}
              onComposerClose={(id) => {
                setComposerOpen((current) => ({ ...current, [id]: false }))
                setComposerValue((current) => ({ ...current, [id]: '' }))
              }}
              onComposerSubmit={handleAddCard}
              onSelectCard={openCard}
              />
            </>
          ) : null}
        </section>
      </main>

      {selectedCard && board ? (
        <CardDetailSheet
          card={selectedCard}
          column={selectedColumn}
          members={board.members}
          draft={toDraftCardEditor(selectedCard)}
          onClose={closeCard}
          onSave={handleSaveCardDraft}
          onDelete={handleDeleteCard}
        />
      ) : null}

      {board && isMemberManagerOpen ? (
        <MemberManagerSheet
          board={board}
          onClose={() => setIsMemberManagerOpen(false)}
          onAddMember={(name) => commit((currentBoard) => addMember(currentBoard, name))}
          onUpdateMember={(memberId, name) => commit((currentBoard) => updateMember(currentBoard, memberId, name))}
          onRemoveMember={(memberId) => commit((currentBoard) => removeMember(currentBoard, memberId))}
        />
      ) : null}

      {board && isColumnManagerOpen ? (
        <ColumnManagerSheet
          board={board}
          onClose={() => setIsColumnManagerOpen(false)}
          onAddColumn={(title, accent) => commit((currentBoard) => addColumn(currentBoard, title, accent))}
          onUpdateColumn={(columnId, updates) => commit((currentBoard) => updateColumn(currentBoard, columnId, updates))}
          onMoveColumn={(columnId, direction) => commit((currentBoard) => moveColumn(currentBoard, columnId, direction))}
          onRemoveColumn={(columnId) => commit((currentBoard) => removeColumn(currentBoard, columnId))}
        />
      ) : null}
    </div>
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

function resolveDropTarget(activeData: unknown, overData: unknown): IDropTarget | null {
  if (!isRecord(activeData) || !isRecord(overData) || (overData.type !== 'slot' && overData.type !== 'lane-body')) {
    return null
  }

  const columnId = String(overData.columnId)
  const rawIndex = Number(overData.index)
  if (Number.isNaN(rawIndex)) return null

  return { columnId, index: Math.max(rawIndex, 0) }
}

function areDropTargetsEqual(left: IDropTarget | null, right: IDropTarget | null) {
  if (!left || !right) return left === right
  return left.columnId === right.columnId && left.index === right.index
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toDraftCardEditor(card: BoardCard) {
  return {
    title: card.title,
    owner: card.owner,
    priority: card.priority,
    description: card.description,
  }
}

export default App
