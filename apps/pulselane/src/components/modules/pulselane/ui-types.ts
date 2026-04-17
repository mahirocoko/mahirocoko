import type { BoardCard } from '../../../features/pulselane/types'

export interface IDraftCardEditor {
  title: string
  owner: string
  priority: BoardCard['priority']
  description: string
}

export interface IDragState {
  cardId: string
  columnId: string
  index: number
}

export interface IDropTarget {
  columnId: string
  index: number
}
