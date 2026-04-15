import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardFace } from './CardFace'
import type { BoardCard } from '../types'

describe('CardFace', () => {
  const baseCard: BoardCard = {
    id: 'card-12345678',
    columnId: 'column-1',
    title: 'Polish drag overlay',
    description: 'Make the card feel native while dragging.',
    owner: 'Mahiro',
    priority: 'medium',
    order: 0,
    updatedAt: 1_000,
  }

  it('renders the card metadata without legacy priority hooks', () => {
    const { container } = render(<CardFace card={baseCard} now={61_000} />)

    expect(screen.getByText('Polish drag overlay')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('Mahiro')).toBeInTheDocument()
    expect(screen.getByText('1m ago')).toBeInTheDocument()
    expect(container.innerHTML).not.toContain('priority-chip')
    expect(container.innerHTML).not.toContain('priority-medium')
  })

  it('applies explicit priority styling for high-priority cards', () => {
    const { container } = render(
      <CardFace
        card={{
          ...baseCard,
          id: 'card-99999999',
          priority: 'high',
        }}
        now={61_000}
      />
    )

    const highPriorityBadge = screen.getByText('high')

    expect(container.querySelector('.text-rose-400')).toBeTruthy()
    expect(highPriorityBadge.className).toContain('bg-rose-400/10')
    expect(container.innerHTML).not.toContain('priority-high')
  })
})
