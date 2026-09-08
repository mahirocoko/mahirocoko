class EnvelopeValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'EnvelopeValidationError'
  }
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const requireValid = (condition, message) => {
  if (!condition) throw new EnvelopeValidationError(message)
}

const normalizeEnvelope = (input) => {
  requireValid(isObject(input), 'Envelope must be an object')
  const wrapped = Object.hasOwn(input, 'payload') &&
    !Object.hasOwn(input, 'requestId') && !Object.hasOwn(input, 'schemaVersion')
  const payload = wrapped ? input.payload : input
  requireValid(isObject(payload), 'Payload must be an envelope object')
  requireValid(isNonEmptyString(payload.requestId), 'requestId must be a non-empty string')

  let outcome
  if (payload.schemaVersion === 2) {
    requireValid(isObject(payload.outcome), 'outcome must be an object')
    outcome = payload.outcome
  } else {
    requireValid(!Object.hasOwn(payload, 'schemaVersion') || payload.schemaVersion === 1,
      'Unsupported schemaVersion')
    requireValid(typeof payload.ok === 'boolean', 'Legacy ok must be a boolean')
    outcome = payload.ok
      ? { status: 'ok', data: payload.data }
      : { status: 'error', error: payload.error }
  }

  requireValid(outcome.status === 'ok' || outcome.status === 'error', 'Invalid outcome status')
  let canonicalOutcome
  if (outcome.status === 'ok') {
    canonicalOutcome = { status: 'ok', data: outcome.data }
  } else {
    requireValid(isObject(outcome.error), 'error must be an object')
    requireValid(isNonEmptyString(outcome.error.code), 'error.code must be a non-empty string')
    requireValid(isNonEmptyString(outcome.error.message), 'error.message must be a non-empty string')
    canonicalOutcome = {
      status: 'error',
      error: { code: outcome.error.code, message: outcome.error.message },
    }
  }

  const transport = { attempt: 1, receivedAt: null }
  if (Object.hasOwn(payload, 'transport')) {
    requireValid(isObject(payload.transport), 'transport must be an object')
  }
  for (const source of [payload.transport, wrapped ? input : undefined]) {
    if (!source) continue
    for (const key of ['attempt', 'receivedAt', 'lease']) {
      if (Object.hasOwn(source, key)) transport[key] = source[key]
    }
  }
  requireValid(Number.isInteger(transport.attempt) && transport.attempt > 0,
    'transport.attempt must be a positive integer')
  requireValid(transport.receivedAt === null || isNonEmptyString(transport.receivedAt),
    'transport.receivedAt must be null or a non-empty string')
  if (Object.hasOwn(transport, 'lease')) {
    requireValid(isObject(transport.lease), 'transport.lease must be an object')
    requireValid(isNonEmptyString(transport.lease.owner), 'lease.owner must be a non-empty string')
    requireValid(Number.isFinite(transport.lease.until), 'lease.until must be a finite number')
    transport.lease = { owner: transport.lease.owner, until: transport.lease.until }
  }

  return { schemaVersion: 2, requestId: payload.requestId, outcome: canonicalOutcome, transport }
}

export { EnvelopeValidationError, normalizeEnvelope }
