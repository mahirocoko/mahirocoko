import type { BoardCard, BoardColumn, BoardDocument, IBoardMember } from './types'

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

export function ensureMember(board: BoardDocument, rawName: string): BoardDocument {
  const name = rawName.trim()
  if (!name) {
    return board
  }

  const normalizedName = name.toLocaleLowerCase()
  if (board.members.some((member) => member.name.toLocaleLowerCase() === normalizedName)) {
    return board
  }

  const nextMember: IBoardMember = {
    id: crypto.randomUUID().slice(0, 8),
    name,
  }

  return {
    ...board,
    members: [...board.members, nextMember],
  }
}

export function addMember(board: BoardDocument, name: string) {
  return ensureMember(board, name)
}

export function updateMember(board: BoardDocument, memberId: string, rawName: string): BoardDocument {
  const name = rawName.trim()
  if (!name) {
    return board
  }

  const member = board.members.find((entry) => entry.id === memberId)
  if (!member) {
    return board
  }

  const duplicate = board.members.find(
    (entry) => entry.id !== memberId && entry.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  )
  if (duplicate) {
    return board
  }

  return {
    ...board,
    members: board.members.map((entry) => (entry.id === memberId ? { ...entry, name } : entry)),
    cards: board.cards.map((card) => (card.owner === member.name ? { ...card, owner: name } : card)),
  }
}

export function removeMember(board: BoardDocument, memberId: string): BoardDocument {
  const member = board.members.find((entry) => entry.id === memberId)
  if (!member) {
    return board
  }

  return {
    ...board,
    members: board.members.filter((entry) => entry.id !== memberId),
    cards: board.cards.map((card) => (card.owner === member.name ? { ...card, owner: '' } : card)),
  }
}

export function addColumn(board: BoardDocument, rawTitle: string, rawAccent: string): BoardDocument {
  const title = rawTitle.trim()
  if (!title) {
    return board
  }

  const nextColumn: BoardColumn = {
    id: createColumnId(title),
    title,
    accent: rawAccent,
    order: board.columns.length,
  }

  return {
    ...board,
    columns: [...board.columns, nextColumn],
  }
}

export function updateColumn(
  board: BoardDocument,
  columnId: string,
  updates: Partial<Pick<BoardColumn, 'title' | 'accent'>>,
): BoardDocument {
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            ...updates,
            title: typeof updates.title === 'string' ? updates.title.trim() || column.title : column.title,
          }
        : column,
    ),
  }
}

export function moveColumn(board: BoardDocument, columnId: string, direction: -1 | 1): BoardDocument {
  const currentIndex = board.columns.findIndex((column) => column.id === columnId)
  if (currentIndex === -1) {
    return board
  }

  const nextIndex = currentIndex + direction
  if (nextIndex < 0 || nextIndex >= board.columns.length) {
    return board
  }

  const nextColumns = [...board.columns]
  const [column] = nextColumns.splice(currentIndex, 1)
  nextColumns.splice(nextIndex, 0, column)

  return {
    ...board,
    columns: nextColumns.map((entry, index) => ({ ...entry, order: index })),
  }
}

export function removeColumn(board: BoardDocument, columnId: string): BoardDocument {
  if (board.columns.length <= 1) {
    return board
  }

  const columnIndex = board.columns.findIndex((column) => column.id === columnId)
  if (columnIndex === -1) {
    return board
  }

  const fallbackColumn = board.columns[columnIndex - 1] ?? board.columns[columnIndex + 1]
  if (!fallbackColumn) {
    return board
  }

  const remainingColumns = board.columns
    .filter((column) => column.id !== columnId)
    .map((column, index) => ({ ...column, order: index }))

  const nextCards = remainingColumns.flatMap((column) => {
    const cards = board.cards
      .filter((card) => (card.columnId === columnId ? fallbackColumn.id : card.columnId) === column.id)
      .sort((left, right) => left.order - right.order)

    return cards.map((card, index) => ({
      ...card,
      columnId: card.columnId === columnId ? fallbackColumn.id : card.columnId,
      order: index,
    }))
  })

  return {
    ...board,
    columns: remainingColumns,
    cards: nextCards,
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

function createColumnId(title: string) {
  const baseId = title
    .toLocaleLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${baseId || 'column'}-${crypto.randomUUID().slice(0, 4)}`
}
