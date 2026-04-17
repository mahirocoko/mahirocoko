import type { BoardCard, BoardColumn, BoardDocument, IBoardMember, MaruConfig } from './types'

export const DEFAULT_COLLECTION = 'boards'
export const DEFAULT_DOCUMENT_ID = 'launch-radar'
export const DEFAULT_DOCUMENT_PATH = `${DEFAULT_COLLECTION}/${DEFAULT_DOCUMENT_ID}`

const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: 'backlog', title: 'Backlog', accent: '#8b5cf6', order: 0 },
  { id: 'in-flight', title: 'In Flight', accent: '#06b6d4', order: 1 },
  { id: 'review', title: 'Review', accent: '#f59e0b', order: 2 },
  { id: 'shipped', title: 'Shipped', accent: '#22c55e', order: 3 },
]

export function createStarterBoard(): BoardDocument {
  const now = Date.now()
  const members = createMembers(['Mina', 'Kai', 'Lina', 'Arun', 'You'])

  return {
    schemaVersion: 2,
    title: 'Launch Radar',
    updatedAt: now,
    lastActorId: 'starter-kit',
    columns: DEFAULT_COLUMNS,
    members,
    cards: [
      createStarterCard('pulse-01', 'backlog', 'Lock the launch-day KPI glossary', 'Mina', 'high', 0, now - 600000),
      createStarterCard('pulse-02', 'backlog', 'Tighten the customer invite sequence', 'Kai', 'medium', 1, now - 480000),
      createStarterCard('pulse-03', 'in-flight', 'Dry-run incident handoff in realtime', 'Lina', 'high', 0, now - 300000),
      createStarterCard('pulse-04', 'review', 'Review board pulse feedback on card edits', 'Arun', 'medium', 0, now - 180000),
      createStarterCard('pulse-05', 'shipped', 'Publish the sandbox walkthrough', 'You', 'low', 0, now - 90000),
    ],
  }
}

export function splitDocumentPath(documentPath: string) {
  const [rawCollection, rawDocumentId] = documentPath.trim().split('/').filter(Boolean)

  return {
    collection: sanitizePathSegment(rawCollection, DEFAULT_COLLECTION),
    documentId: sanitizePathSegment(rawDocumentId, DEFAULT_DOCUMENT_ID),
  }
}

export function joinDocumentPath(collection: string, documentId: string) {
  return `${sanitizePathSegment(collection, DEFAULT_COLLECTION)}/${sanitizePathSegment(documentId, DEFAULT_DOCUMENT_ID)}`
}

export function normalizeDocumentPath(documentPath?: string) {
  const { collection, documentId } = splitDocumentPath(documentPath ?? DEFAULT_DOCUMENT_PATH)
  return joinDocumentPath(collection, documentId)
}

export function getDefaultConfig(): MaruConfig {
  return {
    projectId: import.meta.env.VITE_MARU_PROJECT_ID?.trim() ?? '',
    apiKey: import.meta.env.VITE_MARU_API_KEY?.trim() ?? '',
    documentPath: normalizeDocumentPath(import.meta.env.VITE_MARU_DOCUMENT_PATH?.trim()),
  }
}

export function normalizeBoard(value: unknown): BoardDocument | null {
  if (!isRecord(value)) {
    return null
  }

  if ((value.schemaVersion !== 1 && value.schemaVersion !== 2) || typeof value.title !== 'string') {
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

  const members = Array.isArray(value.members)
    ? value.members
        .map((member): IBoardMember | null => {
          if (!isRecord(member) || typeof member.id !== 'string' || typeof member.name !== 'string') {
            return null
          }

          const name = member.name.trim()
          if (!name) {
            return null
          }

          return {
            id: member.id,
            name,
          }
        })
        .filter((member): member is IBoardMember => Boolean(member))
    : createMembers(cards.map((card) => card.owner))

  return {
    schemaVersion: 2,
    title: value.title,
    updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : Date.now(),
    lastActorId: typeof value.lastActorId === 'string' ? value.lastActorId : 'unknown-actor',
    columns,
    cards,
    members,
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

function sanitizePathSegment(value: string | undefined, fallback: string) {
  const normalized = value?.trim().replace(/^\/+|\/+$/g, '').split('/')[0]
  return normalized || fallback
}

function createMembers(names: string[]) {
  const seen = new Set<string>()

  return names
    .map((name) => name.trim())
    .filter(Boolean)
    .filter((name) => {
      const normalized = name.toLocaleLowerCase()
      if (seen.has(normalized)) {
        return false
      }

      seen.add(normalized)
      return true
    })
    .map((name, index) => ({
      id: `member-${index + 1}`,
      name,
    }))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
