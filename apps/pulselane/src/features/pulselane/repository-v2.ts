import { splitDocumentPath } from './schema'
import type { MaruConfig } from './types'
import type { BoardActivityDocument, BoardCardDocument, BoardMetaDocument, BoardV2Snapshot } from './schema-v2'

export interface BoardV2ResourcePaths {
  boardPath: string
  cardsCollectionPath: string
  activityCollectionPath: string
}

export interface BoardV2Repository {
  getSnapshot(config: MaruConfig, paths: BoardV2ResourcePaths): Promise<BoardV2Snapshot | null>
  getMeta(config: MaruConfig, paths: BoardV2ResourcePaths): Promise<BoardMetaDocument | null>
  listCards(config: MaruConfig, paths: BoardV2ResourcePaths): Promise<BoardCardDocument[]>
  listActivity(config: MaruConfig, paths: BoardV2ResourcePaths): Promise<BoardActivityDocument[]>
  putMeta(config: MaruConfig, paths: BoardV2ResourcePaths, meta: BoardMetaDocument): Promise<void>
  putCard(config: MaruConfig, paths: BoardV2ResourcePaths, card: BoardCardDocument): Promise<void>
  deleteCard(config: MaruConfig, paths: BoardV2ResourcePaths, cardId: string): Promise<void>
  appendActivity(config: MaruConfig, paths: BoardV2ResourcePaths, event: BoardActivityDocument): Promise<void>
}

export function buildBoardV2ResourcePaths(documentPath: string): BoardV2ResourcePaths {
  const { collection, documentId } = splitDocumentPath(documentPath)
  const boardPath = `${collection}/${documentId}`

  return {
    boardPath,
    cardsCollectionPath: `${boardPath}/cards`,
    activityCollectionPath: `${boardPath}/activity`,
  }
}
