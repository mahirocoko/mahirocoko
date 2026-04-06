import type { BoardCard, BoardColumn, BoardDocument, MaruConfig } from './types'

export const DEFAULT_DOCUMENT_PATH = 'boards/pulselane-live'

const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: 'backlog', title: 'Backlog', accent: '#8b5cf6', order: 0 },
  { id: 'in-flight', title: 'In Flight', accent: '#06b6d4', order: 1 },
  { id: 'review', title: 'Review', accent: '#f59e0b', order: 2 },
  { id: 'shipped', title: 'Shipped', accent: '#22c55e', order: 3 },
]

export function createStarterBoard(): BoardDocument {
  const now = Date.now()

  return {
    schemaVersion: 1,
    title: 'PulseLane Sandbox',
    updatedAt: now,
    lastActorId: 'starter-kit',
    columns: DEFAULT_COLUMNS,
    cards: [
      createStarterCard('pulse-01', 'backlog', 'Map the live data contract', 'Mina', 'high', 0, now - 600000),
      createStarterCard('pulse-02', 'backlog', 'Shape onboarding copy', 'Kai', 'medium', 1, now - 480000),
      createStarterCard('pulse-03', 'in-flight', 'Prototype card drag feel', 'Lina', 'high', 0, now - 300000),
      createStarterCard('pulse-04', 'review', 'Verify multi-tab sync pulse', 'Arun', 'medium', 0, now - 180000),
      createStarterCard('pulse-05', 'shipped', 'Seed sandbox starter board', 'You', 'low', 0, now - 90000),
    ],
  }
}

export function getDefaultConfig(): MaruConfig {
  return {
    projectId: import.meta.env.VITE_MARU_PROJECT_ID?.trim() ?? '',
    apiKey: import.meta.env.VITE_MARU_API_KEY?.trim() ?? '',
    documentPath: import.meta.env.VITE_MARU_DOCUMENT_PATH?.trim() || DEFAULT_DOCUMENT_PATH,
  }
}

export function normalizeBoard(value: unknown): BoardDocument | null {
  if (!isRecord(value)) {
    return null
  }

  if (value.schemaVersion !== 1 || typeof value.title !== 'string') {
    return null
  }

  if (!Array.isArray(value.columns) || !Array.isArray(value.cards)) {
    return null
  }

  const columns = value.columns
    .map((column): BoardColumn | null => {
      if (!isRecord(column)) {
        return null
      }

      if (
        typeof column.id !== 'string' ||
        typeof column.title !== 'string' ||
        typeof column.accent !== 'string' ||
        typeof column.order !== 'number'
      ) {
        return null
      }

      return {
        id: column.id,
        title: column.title,
        accent: column.accent,
        order: column.order,
      }
    })
    .filter((column): column is BoardColumn => Boolean(column))
    .sort((left, right) => left.order - right.order)

  const knownColumnIds = new Set(columns.map((column) => column.id))

  const cards = value.cards
    .map((card): BoardCard | null => {
      if (!isRecord(card)) {
        return null
      }

      if (
        typeof card.id !== 'string' ||
        typeof card.columnId !== 'string' ||
        typeof card.title !== 'string' ||
        typeof card.description !== 'string' ||
        typeof card.owner !== 'string' ||
        typeof card.priority !== 'string' ||
        typeof card.order !== 'number' ||
        typeof card.updatedAt !== 'number'
      ) {
        return null
      }

      if (!knownColumnIds.has(card.columnId)) {
        return null
      }

      if (!['low', 'medium', 'high'].includes(card.priority)) {
        return null
      }

      return {
        id: card.id,
        columnId: card.columnId,
        title: card.title,
        description: card.description,
        owner: card.owner,
        priority: card.priority as BoardCard['priority'],
        order: card.order,
        updatedAt: card.updatedAt,
      }
    })
    .filter((card): card is BoardCard => Boolean(card))

  return {
    schemaVersion: 1,
    title: value.title,
    updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : Date.now(),
    lastActorId: typeof value.lastActorId === 'string' ? value.lastActorId : 'unknown-actor',
    columns,
    cards,
  }
}

function createStarterCard(
  id: string,
  columnId: string,
  title: string,
  owner: string,
  priority: BoardCard['priority'],
  order: number,
  updatedAt: number,
): BoardCard {
  return {
    id,
    columnId,
    title,
    description: '',
    owner,
    priority,
    order,
    updatedAt,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
