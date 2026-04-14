import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { addCard, deleteCard, moveCard, updateCard } from './features/pulselane/board'
import { DEFAULT_DOCUMENT_PATH, getDefaultConfig } from './features/pulselane/schema'
import { usePulselane } from './features/pulselane/use-pulselane'
import type { BoardCard } from './features/pulselane/types'
import { BoardView } from './features/pulselane/components/BoardView'
import { Button } from './components/ui/Button'
import { Input } from './components/ui/Input'
import { Textarea } from './components/ui/Textarea'
import { cn } from './lib/utils'

const DEFAULT_CONFIG = getDefaultConfig()

export interface DraftCardEditor {
  title: string
  owner: string
  priority: BoardCard['priority']
  description: string
}

export interface DragState {
  cardId: string
  columnId: string
  index: number
}

export interface DropTarget {
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
    setCardDraft(null)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeCard()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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
    if (!title || !board) return

    commit((currentBoard) => addCard(currentBoard, columnId, title))
    setComposerValue((current) => ({ ...current, [columnId]: '' }))
    setComposerOpen((current) => ({ ...current, [columnId]: false }))
  }

  const handleSaveCardDraft = () => {
    if (!selectedCard || !cardDraft) return

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
    <div className="relative flex flex-col h-screen overflow-hidden bg-background">
      <header className="z-10 flex h-11 items-center justify-between border-b border-white/5 bg-background px-4 text-xs font-semibold">
        <div className="flex items-center gap-3">
          <div className="grid h-4 w-4 place-items-center rounded bg-brand text-[10px] font-bold text-white">PL</div>
          <span className="text-sm font-medium">PulseLane</span>

          {hasWorkspace ? (
            <>
              <span className="text-sm font-medium">{board?.title ?? 'Board'}</span>
              <span className="h-4 w-px bg-white/5" />
              <span className="text-muted font-normal">{DEFAULT_CONFIG.documentPath || DEFAULT_DOCUMENT_PATH}</span>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {hasWorkspace ? (
            <>
              <span className={cn("inline-flex items-center gap-2 rounded-full border border-white/5 px-2 py-1 text-[12px]", {
                "text-[#27a644]": connectionStatus === 'live',
                "text-[#fbbf24]": ['connecting', 'reconnecting'].includes(connectionStatus),
                "text-[#f87171]": connectionStatus === 'error',
                "text-[#94a3b8]": connectionStatus === 'idle'
              })}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {formatStatus(connectionStatus)}
              </span>
              <span className="text-muted">{totalCards} cards</span>
              <span className="text-muted">{totalColumns} columns</span>
              <span className="text-muted">Synced {formatSyncTime(lastSyncedAt)}</span>
              <Button variant="ghost" onClick={resetBoard} disabled={!board}>Reset</Button>
            </>
          ) : null}
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden p-4 md:p-6">
        <section className="h-full flex flex-col">
          {error ? <div className="mb-4 rounded-md border border-red-400/20 bg-red-900/10 p-3 text-sm text-red-200">{error}</div> : null}

          {!hasWorkspace ? (
            <div className="flex flex-1 flex-col items-center justify-center text-muted text-sm">
              <p>Environment not configured</p>
            </div>
          ) : null}

          {hasWorkspace && isHydrating ? (
            <div className="flex flex-1 flex-col items-center justify-center text-muted text-sm">
              <p>Loading board...</p>
            </div>
          ) : null}

          {hasWorkspace && !isHydrating && !board ? (
            <div className="flex flex-1 flex-col items-center justify-center text-muted text-sm gap-3">
              <p>No board found</p>
              <Button variant="primary" onClick={seedBoard} disabled={!activeConfig}>Create board</Button>
            </div>
          ) : null}

          {hasWorkspace && board ? (
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
              onDragCancel={() => { setDragState(null); setDropTarget(null); }}
              onComposerChange={(id, val) => setComposerValue(c => ({ ...c, [id]: val }))}
              onComposerOpen={(id) => setComposerOpen(c => ({ ...c, [id]: true }))}
              onComposerClose={(id) => { setComposerOpen(c => ({ ...c, [id]: false })); setComposerValue(c => ({ ...c, [id]: '' })) }}
              onComposerSubmit={handleAddCard}
              onSelectCard={openCard}
            />
          ) : null}
        </section>
      </main>

      {selectedCard && cardDraft ? (
        <aside className="fixed top-4 right-4 z-20 w-full max-w-sm h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-white/8 bg-[#191a1b] p-5 shadow-2xl animate-[drawer-enter_0.2s_ease-out]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Card detail</p>
              <h2 className="text-lg font-bold text-white">{selectedCard.title}</h2>
              {selectedColumn ? (
                <span className="inline-flex items-center mt-2 rounded-full border border-[color-mix(in_srgb,var(--column-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--column-accent)_14%,transparent)] px-2.5 py-0.5 text-xs font-medium" style={{ '--column-accent': selectedColumn.accent } as React.CSSProperties}>
                  {selectedColumn.title}
                </span>
              ) : null}
            </div>
            <Button variant="ghost" onClick={closeCard}>Close</Button>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted">Title</label>
              <Input
                value={cardDraft.title}
                onChange={(e) => setCardDraft(c => c ? { ...c, title: e.target.value } : c)}
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted">Owner</label>
              <Input
                value={cardDraft.owner}
                onChange={(e) => setCardDraft(c => c ? { ...c, owner: e.target.value } : c)}
                placeholder="Lina"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted">Priority</label>
              <select
                className="flex h-8 w-full rounded-md border border-white/8 bg-white/2 px-3 text-sm focus:border-brand focus:outline-none"
                value={cardDraft.priority}
                onChange={(e) => setCardDraft(c => c ? { ...c, priority: e.target.value as BoardCard['priority'] } : c)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted">Notes</label>
              <Textarea
                rows={5}
                value={cardDraft.description}
                onChange={(e) => setCardDraft(c => c ? { ...c, description: e.target.value } : c)}
                placeholder="Add context, links, or handoff notes."
              />
            </div>
          </div>

          <div className="my-6 flex items-center justify-between text-sm text-muted">
            <span>Updated {formatRelativeTime(selectedCard.updatedAt)}</span>
            <span className={cn("inline-flex items-center rounded-full border border-white/8 px-2 py-0.5 text-xs font-medium", {
              "text-white": selectedCard.priority === 'high',
              "text-[#d0d6e0]": selectedCard.priority === 'medium',
              "text-[#62666d]": selectedCard.priority === 'low'
            })}>
              {selectedCard.priority}
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="danger" className="flex-1" onClick={handleDeleteCard}>Delete card</Button>
            <Button variant="primary" className="flex-1" onClick={handleSaveCardDraft}>Save changes</Button>
          </div>
        </aside>
      ) : null}
    </div>
  )
}

function hasRequiredConfig(config: typeof DEFAULT_CONFIG) {
  return Boolean(config.projectId.trim() && config.apiKey.trim())
}

function formatStatus(status: ReturnType<typeof usePulselane>['connectionStatus']) {
  switch (status) {
    case 'live': return 'Pulse active'
    case 'connecting': return 'Connecting'
    case 'reconnecting': return 'Reconnecting'
    case 'error': return 'Link degraded'
    default: return 'Idle'
  }
}

function formatSyncTime(timestamp: number | null) {
  if (!timestamp) return 'No sync yet'
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatRelativeTime(timestamp: number) {
  const deltaSeconds = Math.max(1, Math.round((Date.now() - timestamp) / 1000))
  if (deltaSeconds < 60) return `${deltaSeconds}s ago`
  if (deltaSeconds < 3600) return `${Math.round(deltaSeconds / 60)}m ago`
  return `${Math.round(deltaSeconds / 3600)}h ago`
}

function resolveDropTarget(activeData: unknown, overData: unknown): DropTarget | null {
  if (!isRecord(activeData) || !isRecord(overData) || (overData.type !== 'slot' && overData.type !== 'lane-body')) return null
  const columnId = String(overData.columnId)
  const rawIndex = Number(overData.index)
  if (Number.isNaN(rawIndex)) return null
  return { columnId, index: Math.max(rawIndex, 0) }
}

function areDropTargetsEqual(left: DropTarget | null, right: DropTarget | null) {
  if (!left || !right) return left === right
  return left.columnId === right.columnId && left.index === right.index
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export default App
