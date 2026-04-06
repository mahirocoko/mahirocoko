import type { BoardCard, BoardDocument } from './types'

export function getCardsForColumn(board: BoardDocument, columnId: string) {
  return board.cards
    .filter((card) => card.columnId === columnId)
    .sort((left, right) => left.order - right.order)
}

export function addCard(board: BoardDocument, columnId: string, title: string): BoardDocument {
  const cards = getCardsForColumn(board, columnId)
  const now = Date.now()
  const nextCard: BoardCard = {
    id: crypto.randomUUID().slice(0, 8),
    columnId,
    title,
    description: '',
    owner: '',
    priority: 'medium',
    order: cards.length,
    updatedAt: now,
  }

  return {
    ...board,
    cards: [...board.cards, nextCard],
  }
}

export function updateCard(
  board: BoardDocument,
  cardId: string,
  updates: Partial<Pick<BoardCard, 'title' | 'owner' | 'priority' | 'description'>>,
): BoardDocument {
  return {
    ...board,
    cards: board.cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            ...updates,
            updatedAt: Date.now(),
          }
        : card,
    ),
  }
}

export function deleteCard(board: BoardDocument, cardId: string): BoardDocument {
  const card = board.cards.find((entry) => entry.id === cardId)
  if (!card) {
    return board
  }

  const remaining = board.cards.filter((entry) => entry.id !== cardId)
  return {
    ...board,
    cards: reindexColumnCards(remaining, card.columnId),
  }
}

export function moveCard(
  board: BoardDocument,
  cardId: string,
  targetColumnId: string,
  targetIndex: number,
): BoardDocument {
  const movingCard = board.cards.find((card) => card.id === cardId)
  if (!movingCard) {
    return board
  }

  const columns = board.columns.map((column) => column.id)
  const lists = new Map(
    columns.map((columnId) => [columnId, getCardsForColumn(board, columnId)]),
  )

  lists.set(
    movingCard.columnId,
    (lists.get(movingCard.columnId) ?? []).filter((card) => card.id !== cardId),
  )

  const destinationCards = [...(lists.get(targetColumnId) ?? [])]
  const insertionIndex = Math.max(0, Math.min(targetIndex, destinationCards.length))
  destinationCards.splice(insertionIndex, 0, {
    ...movingCard,
    columnId: targetColumnId,
    updatedAt: Date.now(),
  })
  lists.set(targetColumnId, destinationCards)

  const nextCards = columns.flatMap((columnId) =>
    (lists.get(columnId) ?? []).map((card, index) => ({
      ...card,
      columnId,
      order: index,
    })),
  )

  return {
    ...board,
    cards: nextCards,
  }
}

export function stampBoard(board: BoardDocument, actorId: string): BoardDocument {
  return {
    ...board,
    updatedAt: Date.now(),
    lastActorId: actorId,
  }
}

function reindexColumnCards(cards: BoardCard[], columnId: string) {
  const nextCards = [...cards]
  const columnCards = nextCards
    .filter((card) => card.columnId === columnId)
    .sort((left, right) => left.order - right.order)

  const reindexed = columnCards.map((card, index) => ({ ...card, order: index }))

  return nextCards.map((card) => reindexed.find((entry) => entry.id === card.id) ?? card)
}
