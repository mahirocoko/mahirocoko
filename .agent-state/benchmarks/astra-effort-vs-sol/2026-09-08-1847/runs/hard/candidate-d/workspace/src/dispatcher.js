import { normalizeEnvelope } from './protocol.js'

const dispatch = async (requestId, handler, metadata = {}) => {
  let payload
  try {
    payload = { requestId, ok: true, data: await handler() }
  } catch (error) {
    const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0
    payload = {
      requestId,
      ok: false,
      error: {
        code: nonEmpty(error?.code) ? error.code : 'HANDLER_ERROR',
        message: nonEmpty(error?.message) ? error.message : 'Unknown handler error',
      },
    }
  }
  const wrapper = { payload }
  for (const key of ['attempt', 'receivedAt', 'lease']) {
    if (Object.hasOwn(metadata, key)) wrapper[key] = metadata[key]
  }
  return normalizeEnvelope(wrapper)
}

export { dispatch }
