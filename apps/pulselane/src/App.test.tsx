import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BoardDocument } from './features/pulselane/types'

const { usePulselaneMock } = vi.hoisted(() => ({
  usePulselaneMock: vi.fn(),
}))

vi.mock('./features/pulselane/use-pulselane', () => ({
  usePulselane: usePulselaneMock,
}))

describe('App card editing flow', () => {
  const initialBoard: BoardDocument = {
    schemaVersion: 1,
    title: 'Launch Radar',
    updatedAt: 1_000,
    lastActorId: 'actor-1',
    columns: [
      { id: 'backlog', title: 'Backlog', accent: '#8b5cf6', order: 0 },
    ],
    cards: [
      {
        id: 'pulse-01',
        columnId: 'backlog',
        title: 'Lock the launch-day KPI glossary',
        description: 'Need a clearer owner handoff before launch.',
        owner: 'Mina',
        priority: 'high',
        order: 0,
        updatedAt: 900,
      },
    ],
  }

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.stubEnv('VITE_MARU_PROJECT_ID', 'proj_test')
    vi.stubEnv('VITE_MARU_API_KEY', 'mk_test')
    vi.stubEnv('VITE_MARU_DOCUMENT_PATH', 'boards/launch-radar')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('opens a card, edits its draft, and saves through commit', async () => {
    const commit = vi.fn()
    const user = userEvent.setup()

    usePulselaneMock.mockReturnValue({
      board: initialBoard,
      connectionStatus: 'live',
      error: null,
      isHydrating: false,
      lastSyncedAt: initialBoard.updatedAt,
      pulsingCardIds: [],
      commit,
      seedBoard: vi.fn(),
      resetBoard: vi.fn(),
    })

    const { default: App } = await import('./App')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /lock the launch-day kpi glossary/i }))

    expect(screen.getByText('Card detail')).toBeInTheDocument()

    const titleInput = screen.getByDisplayValue('Lock the launch-day KPI glossary')
    const ownerInput = screen.getByDisplayValue('Mina')
    const notesInput = screen.getByDisplayValue('Need a clearer owner handoff before launch.')
    const prioritySelect = screen.getByRole('combobox')

    await user.clear(titleInput)
    await user.type(titleInput, 'Ship the launch-day KPI glossary')
    await user.clear(ownerInput)
    await user.type(ownerInput, 'Lina')
    await user.selectOptions(prioritySelect, 'medium')
    await user.clear(notesInput)
    await user.type(notesInput, 'Expanded the rollout notes for launch review.')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(commit).toHaveBeenCalledTimes(1)

    const updater = commit.mock.calls[0]?.[0] as ((board: BoardDocument) => BoardDocument) | undefined
    expect(updater).toBeTypeOf('function')

    const nextBoard = updater?.(initialBoard)
    const nextCard = nextBoard?.cards.find((card) => card.id === 'pulse-01')

    expect(nextCard).toMatchObject({
      title: 'Ship the launch-day KPI glossary',
      owner: 'Lina',
      priority: 'medium',
      description: 'Expanded the rollout notes for launch review.',
    })
    expect(nextCard?.updatedAt).toBeGreaterThanOrEqual(initialBoard.cards[0].updatedAt)
    expect(screen.queryByText('Card detail')).not.toBeInTheDocument()
  })
})
