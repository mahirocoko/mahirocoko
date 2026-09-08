import { normalizeEnvelope } from './protocol.js'

const dispatch = async (requestId, handler, metadata = {}) => {
  let outcome
  try {
    const data = await handler()
    outcome = { status: 'ok', data }
  } catch (error) {
    const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0
    outcome = {
      status: 'error',
      error: {
        code: nonEmpty(error?.code) ? error.code : 'HANDLER_ERROR',
        message: nonEmpty(error?.message) ? error.message : 'Unknown handler error',
      },
    }
  }
  return normalizeEnvelope({ schemaVersion: 2, requestId, outcome, transport: metadata })
}

export { dispatch }
