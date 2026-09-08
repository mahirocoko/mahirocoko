import { normalizeEnvelope } from './protocol.js'

const consume = (input) => {
  const { outcome } = normalizeEnvelope(input)
  return outcome.status === 'ok'
    ? { ok: true, value: outcome.data }
    : { ok: false, error: outcome.error }
}

export { consume }
