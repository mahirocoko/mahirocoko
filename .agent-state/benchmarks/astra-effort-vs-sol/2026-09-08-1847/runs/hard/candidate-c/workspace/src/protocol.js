class EnvelopeValidationError extends Error {}

const normalizeEnvelope = (input) => {
  if (!input || input.schemaVersion !== 2) {
    throw new EnvelopeValidationError('Only v2 envelopes are supported')
  }
  return input
}

export { EnvelopeValidationError, normalizeEnvelope }
