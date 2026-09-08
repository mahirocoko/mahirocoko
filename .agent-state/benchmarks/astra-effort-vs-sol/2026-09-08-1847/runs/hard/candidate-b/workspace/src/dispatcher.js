import { normalizeEnvelope } from './protocol.js'

const dispatch = async (requestId, handler, metadata = {}) => {
  let outcome
  try {
    const data = await handler()
    outcome = { status: 'ok', data }
  } catch (error) {
    outcome = {
      status: 'error',
      error: {
        code: typeof error?.code === 'string' && error.code.trim() ? error.code : 'HANDLER_ERROR',
        message: typeof error?.message === 'string' && error.message.trim() ? error.message : 'Unknown handler error',
      },
    }
  }
  return normalizeEnvelope({ schemaVersion: 2, requestId, outcome, transport: metadata })
}

export { dispatch }
