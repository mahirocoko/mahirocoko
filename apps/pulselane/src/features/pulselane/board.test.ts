import { describe, it, expect } from 'vitest'
import { addCard, deleteCard, moveCard, getCardsForColumn } from './board'
import type { BoardDocument } from './types'

describe('board logic', () => {
  const mockBoard: BoardDocument = {
    schemaVersion: 1,
    title: 'Test Board',
    lastActorId: 'actor-1',
    columns: [
      { id: 'col-1', title: 'Column 1', accent: '#ff0000', order: 0 },
      { id: 'col-2', title: 'Column 2', accent: '#00ff00', order: 1 },
    ],
    cards: [
      { id: 'card-1', columnId: 'col-1', title: 'Card 1', owner: '', priority: 'medium', description: '', order: 0, updatedAt: Date.now() },
    ],
    updatedAt: Date.now(),
  }

  it('adds a card to a column', () => {
    const nextBoard = addCard(mockBoard, 'col-1', 'New Card')
    expect(nextBoard.cards).toHaveLength(2)
    expect(nextBoard.cards.find(c => c.title === 'New Card')).toBeDefined()
  })

  it('deletes a card', () => {
    const nextBoard = deleteCard(mockBoard, 'card-1')
    expect(nextBoard.cards).toHaveLength(0)
  })

  it('moves a card to another column', () => {
    const nextBoard = moveCard(mockBoard, 'card-1', 'col-2', 0)
    const card = nextBoard.cards.find(c => c.id === 'card-1')
    expect(card?.columnId).toBe('col-2')
  })

  it('gets cards for a specific column', () => {
    const cards = getCardsForColumn(mockBoard, 'col-1')
    expect(cards).toHaveLength(1)
    expect(cards[0].id).toBe('card-1')
  })
})
