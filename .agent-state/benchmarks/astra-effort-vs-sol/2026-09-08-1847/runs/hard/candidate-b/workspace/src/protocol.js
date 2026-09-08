class EnvelopeValidationError extends Error {}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0
const requireValid = (condition, message) => {
  if (!condition) throw new EnvelopeValidationError(message)
}

const normalizeEnvelope = (input) => {
  requireValid(isObject(input), 'Envelope must be an object')
  const wrapper = Object.hasOwn(input, 'payload') ? input : null
  const payload = wrapper ? wrapper.payload : input
  requireValid(isObject(payload), 'Payload must be an envelope')
  requireValid(nonEmpty(payload.requestId), 'requestId must be a non-empty string')

  let outcome
  if (Object.hasOwn(payload, 'schemaVersion')) {
    requireValid(payload.schemaVersion === 2, 'Unsupported schemaVersion')
    requireValid(isObject(payload.outcome), 'outcome must be an object')
    outcome = payload.outcome
  } else {
    requireValid(typeof payload.ok === 'boolean', 'Legacy ok must be a boolean')
    outcome = payload.ok
      ? { status: 'ok', data: payload.data }
      : { status: 'error', error: payload.error }
  }

  requireValid(outcome.status === 'ok' || outcome.status === 'error', 'Invalid outcome status')
  if (outcome.status === 'error') {
    requireValid(isObject(outcome.error), 'error must be an object')
    requireValid(nonEmpty(outcome.error.code), 'error.code must be a non-empty string')
    requireValid(nonEmpty(outcome.error.message), 'error.message must be a non-empty string')
  }

  const transport = { attempt: 1, receivedAt: null }
  if (Object.hasOwn(payload, 'transport')) {
    requireValid(isObject(payload.transport), 'transport must be an object')
  }
  for (const source of [payload.transport, wrapper]) {
    if (!source) continue
    for (const key of ['attempt', 'receivedAt', 'lease']) {
      if (Object.hasOwn(source, key)) transport[key] = source[key]
    }
  }
  requireValid(Number.isInteger(transport.attempt) && transport.attempt > 0, 'attempt must be a positive integer')
  requireValid(transport.receivedAt === null || nonEmpty(transport.receivedAt), 'Invalid receivedAt')
  if (Object.hasOwn(transport, 'lease')) {
    requireValid(isObject(transport.lease), 'lease must be an object')
    requireValid(nonEmpty(transport.lease.owner), 'lease.owner must be a non-empty string')
    requireValid(Number.isFinite(transport.lease.until), 'lease.until must be finite')
    transport.lease = { owner: transport.lease.owner, until: transport.lease.until }
  }

  return {
    schemaVersion: 2,
    requestId: payload.requestId,
    outcome: outcome.status === 'ok'
      ? { status: 'ok', data: outcome.data }
      : { status: 'error', error: { code: outcome.error.code, message: outcome.error.message } },
    transport,
  }
}

export { EnvelopeValidationError, normalizeEnvelope }
