import { splitDocumentPath } from './schema'
import type { BoardCard, BoardColumn, BoardDocument, CardPriority } from './types'

export type BoardActivityType = 'card.created' | 'card.updated' | 'card.moved' | 'card.deleted'

export interface BoardMetaDocument {
  schemaVersion: 2
  boardId: string
  title: string
  createdAt: number
  updatedAt: number
  lastActorId: string
  columnOrder: string[]
  columns: BoardColumn[]
}

export interface BoardCardDocument {
  schemaVersion: 1
  cardId: string
  boardId: string
  columnId: string
  title: string
  description: string
  owner: string
  priority: CardPriority
  order: number
  createdAt: number
  updatedAt: number
  archivedAt: number | null
}

export interface BoardActivityDocument {
  schemaVersion: 1
  eventId: string
  boardId: string
  actorId: string
  type: BoardActivityType
  entityId: string
  createdAt: number
  payload: Record<string, unknown>
}

export interface BoardV2Snapshot {
  meta: BoardMetaDocument
  cards: BoardCardDocument[]
  activity: BoardActivityDocument[]
}

export function normalizeBoardMetaDocument(value: unknown): BoardMetaDocument | null {
  if (!isRecord(value)) {
    return null
  }

  if (value.schemaVersion !== 2 || typeof value.boardId !== 'string' || typeof value.title !== 'string') {
    return null
  }

  if (!Array.isArray(value.columnOrder) || !Array.isArray(value.columns)) {
    return null
  }

  const columns = normalizeColumns(value.columns)
  const knownColumnIds = new Set(columns.map((column) => column.id))
  const columnOrder = value.columnOrder.filter((columnId): columnId is string => typeof columnId === 'string')

  return {
    schemaVersion: 2,
    boardId: value.boardId,
    title: value.title,
    createdAt: typeof value.createdAt === 'number' ? value.createdAt : Date.now(),
    updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : Date.now(),
    lastActorId: typeof value.lastActorId === 'string' ? value.lastActorId : 'unknown-actor',
    columnOrder: columnOrder.filter((columnId) => knownColumnIds.has(columnId)),
    columns,
  }
}

export function normalizeBoardCardDocument(
  value: unknown,
  options?: { boardId?: string; knownColumnIds?: Set<string> },
): BoardCardDocument | null {
  if (!isRecord(value)) {
    return null
  }

  if (
    value.schemaVersion !== 1 ||
    typeof value.cardId !== 'string' ||
    typeof value.boardId !== 'string' ||
    typeof value.columnId !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.description !== 'string' ||
    typeof value.owner !== 'string' ||
    typeof value.order !== 'number' ||
    typeof value.updatedAt !== 'number'
  ) {
    return null
  }

  if (!isCardPriority(value.priority)) {
    return null
  }

  if (options?.boardId && value.boardId !== options.boardId) {
    return null
  }

  if (options?.knownColumnIds && !options.knownColumnIds.has(value.columnId)) {
    return null
  }

  return {
    schemaVersion: 1,
    cardId: value.cardId,
    boardId: value.boardId,
    columnId: value.columnId,
    title: value.title,
    description: value.description,
    owner: value.owner,
    priority: value.priority,
    order: value.order,
    createdAt: typeof value.createdAt === 'number' ? value.createdAt : value.updatedAt,
    updatedAt: value.updatedAt,
    archivedAt: typeof value.archivedAt === 'number' ? value.archivedAt : null,
  }
}

export function normalizeBoardActivityDocument(
  value: unknown,
  options?: { boardId?: string },
): BoardActivityDocument | null {
  if (!isRecord(value)) {
    return null
  }

  if (
    value.schemaVersion !== 1 ||
    typeof value.eventId !== 'string' ||
    typeof value.boardId !== 'string' ||
    typeof value.actorId !== 'string' ||
    typeof value.entityId !== 'string' ||
    typeof value.createdAt !== 'number' ||
    !isBoardActivityType(value.type) ||
    !isRecord(value.payload)
  ) {
    return null
  }

  if (options?.boardId && value.boardId !== options.boardId) {
    return null
  }

  return {
    schemaVersion: 1,
    eventId: value.eventId,
    boardId: value.boardId,
    actorId: value.actorId,
    type: value.type,
    entityId: value.entityId,
    createdAt: value.createdAt,
    payload: value.payload,
  }
}

export function createBoardV2Snapshot(
  metaValue: unknown,
  cardValues: unknown[],
  activityValues: unknown[] = [],
): BoardV2Snapshot | null {
  const meta = normalizeBoardMetaDocument(metaValue)
  if (!meta) {
    return null
  }

  const knownColumnIds = new Set(meta.columns.map((column) => column.id))

  const cards = cardValues
    .map((cardValue) => normalizeBoardCardDocument(cardValue, { boardId: meta.boardId, knownColumnIds }))
    .filter((card): card is BoardCardDocument => Boolean(card))
    .sort((left, right) => left.order - right.order)

  const activity = activityValues
    .map((activityValue) => normalizeBoardActivityDocument(activityValue, { boardId: meta.boardId }))
    .filter((event): event is BoardActivityDocument => Boolean(event))
    .sort((left, right) => left.createdAt - right.createdAt)

  return { meta, cards, activity }
}

export function projectBoardDocumentToV2Snapshot(board: BoardDocument, documentPath: string): BoardV2Snapshot {
  const { documentId } = splitDocumentPath(documentPath)
  const createdAt = inferBoardCreatedAt(board.cards, board.updatedAt)

  return {
    meta: {
      schemaVersion: 2,
      boardId: documentId,
      title: board.title,
      createdAt,
      updatedAt: board.updatedAt,
      lastActorId: board.lastActorId,
      columnOrder: board.columns
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((column) => column.id),
      columns: board.columns.slice().sort((left, right) => left.order - right.order),
    },
    cards: board.cards
      .map((card) => projectBoardCardToV2(card, documentId, createdAt))
      .sort((left, right) => left.order - right.order),
    activity: [],
  }
}

function projectBoardCardToV2(card: BoardCard, boardId: string, fallbackCreatedAt: number): BoardCardDocument {
  return {
    schemaVersion: 1,
    cardId: card.id,
    boardId,
    columnId: card.columnId,
    title: card.title,
    description: card.description,
    owner: card.owner,
    priority: card.priority,
    order: card.order,
    createdAt: card.updatedAt || fallbackCreatedAt,
    updatedAt: card.updatedAt,
    archivedAt: null,
  }
}

function inferBoardCreatedAt(cards: BoardCard[], fallback: number) {
  const timestamps = cards.map((card) => card.updatedAt).filter((value) => typeof value === 'number')
  return timestamps.length > 0 ? Math.min(...timestamps) : fallback
}

function normalizeColumns(values: unknown[]): BoardColumn[] {
  return values
    .map((value): BoardColumn | null => {
      if (!isRecord(value)) {
        return null
      }

      if (
        typeof value.id !== 'string' ||
        typeof value.title !== 'string' ||
        typeof value.accent !== 'string' ||
        typeof value.order !== 'number'
      ) {
        return null
      }

      return {
        id: value.id,
        title: value.title,
        accent: value.accent,
        order: value.order,
      }
    })
    .filter((column): column is BoardColumn => Boolean(column))
    .sort((left, right) => left.order - right.order)
}

function isBoardActivityType(value: unknown): value is BoardActivityType {
  return value === 'card.created' || value === 'card.updated' || value === 'card.moved' || value === 'card.deleted'
}

function isCardPriority(value: unknown): value is CardPriority {
  return value === 'low' || value === 'medium' || value === 'high'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
