import { describe, it, expect } from 'vitest'
import {
  addCard,
  addColumn,
  addMember,
  deleteCard,
  getCardsForColumn,
  moveCard,
  moveColumn,
  removeColumn,
  removeMember,
  updateMember,
} from './board'
import type { BoardDocument } from './types'

describe('board logic', () => {
  const mockBoard: BoardDocument = {
    schemaVersion: 2,
    title: 'Test Board',
    lastActorId: 'actor-1',
    columns: [
      { id: 'col-1', title: 'Column 1', accent: '#ff0000', order: 0 },
      { id: 'col-2', title: 'Column 2', accent: '#00ff00', order: 1 },
    ],
    cards: [
      { id: 'card-1', columnId: 'col-1', title: 'Card 1', owner: '', priority: 'medium', description: '', order: 0, updatedAt: Date.now() },
    ],
    members: [{ id: 'member-1', name: 'Mahiro' }],
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

  it('adds a member without duplicating names', () => {
    const nextBoard = addMember(mockBoard, 'Lina')
    const duplicateBoard = addMember(nextBoard, 'lina')

    expect(nextBoard.members).toHaveLength(2)
    expect(duplicateBoard.members).toHaveLength(2)
  })

  it('renames a member and updates assigned cards', () => {
    const assignedBoard: BoardDocument = {
      ...mockBoard,
      cards: [{ ...mockBoard.cards[0], owner: 'Mahiro' }],
    }

    const nextBoard = updateMember(assignedBoard, 'member-1', 'Lina')

    expect(nextBoard.members[0].name).toBe('Lina')
    expect(nextBoard.cards[0].owner).toBe('Lina')
  })

  it('removes a member and clears owners using that member', () => {
    const assignedBoard: BoardDocument = {
      ...mockBoard,
      cards: [{ ...mockBoard.cards[0], owner: 'Mahiro' }],
    }

    const nextBoard = removeMember(assignedBoard, 'member-1')

    expect(nextBoard.members).toHaveLength(0)
    expect(nextBoard.cards[0].owner).toBe('')
  })

  it('adds and reorders columns', () => {
    const withExtraColumn = addColumn(mockBoard, 'Blocked', '#111111')
    const movedBoard = moveColumn(withExtraColumn, withExtraColumn.columns[2].id, -1)

    expect(withExtraColumn.columns).toHaveLength(3)
    expect(movedBoard.columns[1].title).toBe('Blocked')
  })

  it('removes a column and moves cards to a fallback column', () => {
    const boardWithThreeColumns: BoardDocument = {
      ...mockBoard,
      columns: [
        { id: 'col-1', title: 'Column 1', accent: '#ff0000', order: 0 },
        { id: 'col-2', title: 'Column 2', accent: '#00ff00', order: 1 },
        { id: 'col-3', title: 'Column 3', accent: '#0000ff', order: 2 },
      ],
      cards: [{ ...mockBoard.cards[0], columnId: 'col-2' }],
    }

    const nextBoard = removeColumn(boardWithThreeColumns, 'col-2')

    expect(nextBoard.columns).toHaveLength(2)
    expect(nextBoard.cards[0].columnId).toBe('col-1')
  })
})
