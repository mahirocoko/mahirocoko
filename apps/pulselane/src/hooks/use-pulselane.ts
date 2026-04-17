import { useCallback, useEffect, useRef, useState } from 'react'
import { stampBoard } from '../features/pulselane/board'
import { createSocket, getDocument, parseDocumentPath, putDocument, sendSocketMessage } from '../features/pulselane/maru'
import { createStarterBoard, normalizeBoard } from '../features/pulselane/schema'
import type { BoardDocument, ConnectionStatus, MaruConfig, MaruMessage } from '../features/pulselane/types'

const ACTOR_STORAGE_KEY = 'pulselane:actor-id'

export function usePulselane(config: MaruConfig | null) {
  const [actorId] = useState(() => getActorId())
  const documentPath = config?.documentPath ?? null
  const hasValidPath = documentPath ? Boolean(parseDocumentPath(documentPath)) : false
  const configError = config && !hasValidPath ? 'Board path must look like collection/board-id' : null
  const [board, setBoard] = useState<BoardDocument | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isHydrating, setIsHydrating] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null)
  const [pulsingCardIds, setPulsingCardIds] = useState<string[]>([])

  const boardRef = useRef<BoardDocument | null>(board)
  const publishRef = useRef<(nextBoard: BoardDocument) => Promise<void>>(async () => {})
  const remotePulseTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    boardRef.current = board
  }, [board])

  useEffect(() => {
    if (!config) {
      publishRef.current = async () => {}
      return
    }

    const path = parseDocumentPath(config.documentPath)
    if (!path) {
      return
    }

    let isDisposed = false
    let retryDelay = 1000
    let retryTimer: number | null = null
    let socket: WebSocket | null = null

    const clearRetryTimer = () => {
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer)
        retryTimer = null
      }
    }

    const publishOverRest = async (nextBoard: BoardDocument) => {
      await putDocument(config, nextBoard)
      setLastSyncedAt(Date.now())
    }

    const connectSocket = (isReconnect: boolean) => {
      if (isDisposed) {
        return
      }

      setConnectionStatus(isReconnect ? 'reconnecting' : 'connecting')

      socket = createSocket(config)
      publishRef.current = async (nextBoard) => {
        if (socket?.readyState === WebSocket.OPEN) {
          sendSocketMessage(socket, {
            type: 'set',
            path: config.documentPath,
            data: nextBoard,
          })
          setLastSyncedAt(Date.now())
          return
        }

        await publishOverRest(nextBoard)
      }

      socket.onopen = () => {
        retryDelay = 1000
        setConnectionStatus('live')
        sendSocketMessage(socket as WebSocket, {
          type: 'subscribe',
          path: config.documentPath,
        })
        sendSocketMessage(socket as WebSocket, {
          type: 'get',
          path: config.documentPath,
        })
      }

      socket.onmessage = (event) => {
        const message = safeParseMessage(event.data)

        if (!message) {
          return
        }

        if (message.type === 'error') {
          setError(`Realtime error: ${message.code ?? 'unknown_message_type'}`)
          setConnectionStatus('error')
          return
        }

        if (message.type !== 'data' || message.path !== config.documentPath) {
          return
        }

        if (message.event === 'delete' || message.data === null) {
          setBoard(null)
          setError('Board document was deleted remotely.')
          return
        }

        const incomingBoard = normalizeBoard(message.data)
        if (!incomingBoard) {
          setError('This document path does not contain a PulseLane board schema.')
          return
        }

        const currentBoard = boardRef.current
        if (!currentBoard || incomingBoard.updatedAt >= currentBoard.updatedAt) {
          if (incomingBoard.lastActorId !== actorId && currentBoard) {
            const nextPulseIds = collectPulsingCardIds(currentBoard, incomingBoard)
            if (nextPulseIds.length > 0) {
              if (remotePulseTimeoutRef.current !== null) {
                window.clearTimeout(remotePulseTimeoutRef.current)
              }
              setPulsingCardIds((previous) => [...new Set([...previous, ...nextPulseIds])])
              remotePulseTimeoutRef.current = window.setTimeout(() => {
                setPulsingCardIds([])
                remotePulseTimeoutRef.current = null
              }, 2200)
            }
          }

          boardRef.current = incomingBoard
          setBoard(incomingBoard)
          setLastSyncedAt(Date.now())
        }
      }

      socket.onclose = (event) => {
        if (isDisposed) {
          return
        }

        if (event.code === 4001) {
          setError('Unauthorized. Check your project ID and API key.')
          setConnectionStatus('error')
          return
        }

        setConnectionStatus('reconnecting')
        clearRetryTimer()
        retryTimer = window.setTimeout(() => {
          connectSocket(true)
        }, retryDelay)
        retryDelay = Math.min(retryDelay * 2, 30000)
      }

      socket.onerror = () => {
        setConnectionStatus('error')
      }
    }

    const hydrate = async () => {
      setIsHydrating(true)
      setError(null)

      try {
        const result = await getDocument(config)
        if (isDisposed) {
          return
        }

        if (result.kind === 'not_found') {
          const starterBoard = stampBoard(createStarterBoard(), actorId)
          await putDocument(config, starterBoard)
          boardRef.current = starterBoard
          setBoard(starterBoard)
          setLastSyncedAt(Date.now())
        } else {
          const normalized = normalizeBoard(result.data)
          if (!normalized) {
            setBoard(null)
            setError('This document path already exists, but it is not a PulseLane board.')
          } else {
            boardRef.current = normalized
            setBoard(normalized)
            setLastSyncedAt(Date.now())
          }
        }
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Failed to hydrate board')
        setConnectionStatus('error')
      } finally {
        setIsHydrating(false)
      }
    }

    void hydrate().then(() => {
      connectSocket(false)
    })

    return () => {
      isDisposed = true
      clearRetryTimer()
      if (remotePulseTimeoutRef.current !== null) {
        window.clearTimeout(remotePulseTimeoutRef.current)
      }
      socket?.close()
      publishRef.current = async () => {}
    }
  }, [actorId, config, documentPath])

  const commit = useCallback(
    (updater: (currentBoard: BoardDocument) => BoardDocument) => {
      if (!boardRef.current) {
        return
      }

      setError(null)

      setBoard((currentBoard) => {
        if (!currentBoard) {
          return currentBoard
        }

        const nextBoard = stampBoard(updater(currentBoard), actorId)
        boardRef.current = nextBoard

        void publishRef.current(nextBoard).catch((nextError) => {
          setError(nextError instanceof Error ? nextError.message : 'Failed to push board update')
          setConnectionStatus('error')
        })

        return nextBoard
      })
    },
    [actorId],
  )

  const seedBoard = useCallback(() => {
    const starterBoard = stampBoard(createStarterBoard(), actorId)
    boardRef.current = starterBoard
    setBoard(starterBoard)
    setError(null)
    void publishRef.current(starterBoard).catch((nextError) => {
      setError(nextError instanceof Error ? nextError.message : 'Failed to seed board')
      setConnectionStatus('error')
    })
  }, [actorId])

  const resetBoard = useCallback(() => {
    seedBoard()
  }, [seedBoard])

  return {
    board: config ? board : null,
    connectionStatus: config ? (configError ? 'error' : connectionStatus) : 'idle',
    error: config ? (configError ?? error) : null,
    isHydrating: config ? isHydrating : false,
    lastSyncedAt: config ? lastSyncedAt : null,
    pulsingCardIds: config ? pulsingCardIds : [],
    commit,
    seedBoard,
    resetBoard,
  }
}

function getActorId() {
  if (typeof window === 'undefined') {
    return 'server-render'
  }

  const existingActorId = window.sessionStorage.getItem(ACTOR_STORAGE_KEY)
  if (existingActorId) {
    return existingActorId
  }

  const nextActorId = crypto.randomUUID().slice(0, 8)
  window.sessionStorage.setItem(ACTOR_STORAGE_KEY, nextActorId)
  return nextActorId
}

function safeParseMessage(data: string): MaruMessage | null {
  try {
    return JSON.parse(data) as MaruMessage
  } catch {
    return null
  }
}

function collectPulsingCardIds(currentBoard: BoardDocument, incomingBoard: BoardDocument) {
  const currentById = new Map(currentBoard.cards.map((card) => [card.id, card]))
  const ids: string[] = []

  for (const incomingCard of incomingBoard.cards) {
    const currentCard = currentById.get(incomingCard.id)
    if (!currentCard || incomingCard.updatedAt > currentCard.updatedAt) {
      ids.push(incomingCard.id)
    }
  }

  return ids
}
