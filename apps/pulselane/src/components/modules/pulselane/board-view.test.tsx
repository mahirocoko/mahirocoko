import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { BoardCard, BoardDocument } from '../../../features/pulselane/types'
import { BoardView } from './board-view'

describe('BoardView', () => {
  const card: BoardCard = {
    id: 'card-1',
    columnId: 'column-1',
    title: 'Polish board cleanup',
    description: 'Remove stale Pulselane hooks.',
    owner: 'Mahiro',
    priority: 'high',
    order: 0,
    updatedAt: 1_000,
  }

  const board: BoardDocument = {
    schemaVersion: 2,
    title: 'Cleanup board',
    updatedAt: 61_000,
    lastActorId: 'actor-1',
    columns: [{ id: 'column-1', title: 'Inbox', accent: '#f43f5e', order: 0 }],
    cards: [card],
    members: [{ id: 'member-1', name: 'Mahiro' }],
  }

  it('renders the scroll lane and drag overlay without legacy class hooks', () => {
    const { container } = render(
      <BoardView
        board={board}
        sensors={[]}
        pulsingCardIds={[]}
        selectedCardId={null}
        dropTarget={null}
        dragState={{ cardId: card.id, columnId: card.columnId, index: 0 }}
        composerValue={{}}
        composerOpen={{}}
        onDragStart={vi.fn()}
        onDragOver={vi.fn()}
        onDragEnd={vi.fn()}
        onDragCancel={vi.fn()}
        onComposerChange={vi.fn()}
        onComposerOpen={vi.fn()}
        onComposerClose={vi.fn()}
        onComposerSubmit={vi.fn()}
        onSelectCard={vi.fn()}
      />
    )

    const laneScroller = container.querySelector('.overflow-x-auto')
    expect(laneScroller).toBeTruthy()
    expect(laneScroller?.className).not.toContain('scrollbar-thin')
    expect(container.innerHTML).not.toContain('scrollbar-thin')
    expect(container.innerHTML).not.toContain('pulse-card-overlay')
  })
})
