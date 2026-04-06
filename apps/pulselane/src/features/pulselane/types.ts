export interface MaruConfig {
  projectId: string
  apiKey: string
  documentPath: string
}

export type ConnectionStatus = 'idle' | 'connecting' | 'live' | 'reconnecting' | 'error'

export interface BoardColumn {
  id: string
  title: string
  accent: string
  order: number
}

export type CardPriority = 'low' | 'medium' | 'high'

export interface BoardCard {
  id: string
  columnId: string
  title: string
  description: string
  owner: string
  priority: CardPriority
  order: number
  updatedAt: number
}

export interface BoardDocument {
  schemaVersion: 1
  title: string
  updatedAt: number
  lastActorId: string
  columns: BoardColumn[]
  cards: BoardCard[]
}

export interface MaruMessage {
  type?: string
  path?: string
  event?: 'set' | 'update' | 'delete'
  data?: unknown
  code?: string
}
