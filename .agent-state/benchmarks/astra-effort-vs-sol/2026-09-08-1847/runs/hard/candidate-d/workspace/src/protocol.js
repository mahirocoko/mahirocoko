class EnvelopeValidationError extends Error {}

const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0
const own = (value, key) => Object.hasOwn(value, key)
const requireValid = (condition, message) => {
  if (!condition) throw new EnvelopeValidationError(message)
}

const normalizeEnvelope = (input) => {
  requireValid(object(input), 'Envelope must be an object')
  const wrapped = !own(input, 'requestId') && own(input, 'payload')
  const payload = wrapped ? input.payload : input
  requireValid(object(payload), 'Payload must be an envelope')
  requireValid(nonEmpty(payload.requestId), 'requestId must be non-empty')
  requireValid(!own(payload, 'schemaVersion') || payload.schemaVersion === 1 || payload.schemaVersion === 2,
    'Unsupported schemaVersion')

  let status, data, error
  if (payload.schemaVersion === 2) {
    requireValid(object(payload.outcome), 'outcome must be an object')
    ;({ status, data, error } = payload.outcome)
  } else {
    requireValid(typeof payload.ok === 'boolean', 'Legacy ok must be a boolean')
    status = payload.ok ? 'ok' : 'error'
    ;({ data, error } = payload)
  }
  requireValid(status === 'ok' || status === 'error', 'Invalid outcome status')
  if (status === 'error') {
    requireValid(object(error) && nonEmpty(error.code) && nonEmpty(error.message),
      'Error code and message must be non-empty strings')
  }

  const transport = { attempt: 1, receivedAt: null }
  if (own(payload, 'transport')) {
    requireValid(object(payload.transport), 'transport must be an object')
    for (const key of ['attempt', 'receivedAt', 'lease']) {
      if (own(payload.transport, key)) transport[key] = payload.transport[key]
    }
  }
  if (wrapped) {
    for (const key of ['attempt', 'receivedAt', 'lease']) {
      if (own(input, key)) transport[key] = input[key]
    }
  }
  requireValid(Number.isInteger(transport.attempt) && transport.attempt > 0, 'attempt must be a positive integer')
  requireValid(transport.receivedAt === null || nonEmpty(transport.receivedAt), 'Invalid receivedAt')
  if (own(transport, 'lease')) {
    const lease = transport.lease
    requireValid(object(lease) && nonEmpty(lease.owner) && Number.isFinite(lease.until), 'Invalid lease')
    transport.lease = { owner: lease.owner, until: lease.until }
  }
  return {
    schemaVersion: 2,
    requestId: payload.requestId,
    outcome: status === 'ok' ? { status, data } : { status, error: { code: error.code, message: error.message } },
    transport,
  }
}

export { EnvelopeValidationError, normalizeEnvelope }
