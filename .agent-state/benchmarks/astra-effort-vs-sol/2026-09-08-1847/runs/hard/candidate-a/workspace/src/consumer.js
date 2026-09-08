import { normalizeEnvelope } from './protocol.js'

const consume = (input) => {
  const { outcome } = normalizeEnvelope(input)
  if (outcome.status === 'ok') return { ok: true, value: outcome.data }
  return { ok: false, error: outcome.error }
}

export { consume }
