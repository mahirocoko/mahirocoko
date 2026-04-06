import type { MaruConfig, MaruMessage } from './types'

const API_BASE_URL = 'https://api-realtime.maru-it.com'

export function parseDocumentPath(documentPath: string) {
  const [collection, documentId] = documentPath.trim().split('/')
  if (!collection || !documentId) {
    return null
  }

  return { collection, documentId }
}

export async function getDocument(config: MaruConfig) {
  const path = parseDocumentPath(config.documentPath)
  if (!path) {
    throw new Error('Document path must look like collection/documentId')
  }

  const response = await fetch(
    `${API_BASE_URL}/api/projects/${config.projectId}/collections/${path.collection}/${path.documentId}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    },
  )

  if (response.status === 404) {
    return { kind: 'not_found' as const }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to read board document'))
  }

  return {
    kind: 'success' as const,
    data: (await response.json()) as unknown,
  }
}

export async function putDocument(config: MaruConfig, data: unknown) {
  const path = parseDocumentPath(config.documentPath)
  if (!path) {
    throw new Error('Document path must look like collection/documentId')
  }

  const response = await fetch(
    `${API_BASE_URL}/api/projects/${config.projectId}/collections/${path.collection}/${path.documentId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to write board document'))
  }
}

export function createSocket(config: MaruConfig) {
  return new WebSocket(
    `wss://api-realtime.maru-it.com/ws/${config.projectId}?key=${encodeURIComponent(config.apiKey)}`,
  )
}

export function sendSocketMessage(socket: WebSocket, message: MaruMessage) {
  socket.send(JSON.stringify(message))
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: string }
    return data.error ?? fallback
  } catch {
    return fallback
  }
}
