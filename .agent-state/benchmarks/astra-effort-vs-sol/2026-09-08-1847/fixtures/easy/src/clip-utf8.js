import { Buffer } from 'node:buffer'

const clipUtf8 = (input, maxBytes, suffix = '…') => {
  if (typeof input !== 'string' || typeof suffix !== 'string') {
    throw new TypeError('input and suffix must be strings')
  }

  if (!Number.isInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError('maxBytes must be a non-negative integer')
  }

  if (Buffer.byteLength(input, 'utf8') <= maxBytes) return input

  const remaining = Math.max(0, maxBytes - suffix.length)
  return `${input.slice(0, remaining)}${suffix}`
}

export { clipUtf8 }
