import { Buffer } from 'node:buffer'

const clipUtf8 = (input, maxBytes, suffix = '…') => {
  if (typeof input !== 'string' || typeof suffix !== 'string') {
    throw new TypeError('input and suffix must be strings')
  }

  if (!Number.isInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError('maxBytes must be a non-negative integer')
  }

  if (Buffer.byteLength(input, 'utf8') <= maxBytes) return input

  let remaining = maxBytes
  let fittedSuffix = ''
  for (const codePoint of suffix) {
    const bytes = Buffer.byteLength(codePoint, 'utf8')
    if (bytes > remaining) break
    fittedSuffix += codePoint
    remaining -= bytes
  }

  let prefix = ''
  for (const codePoint of input) {
    const bytes = Buffer.byteLength(codePoint, 'utf8')
    if (bytes > remaining) break
    prefix += codePoint
    remaining -= bytes
  }

  return prefix + fittedSuffix
}

export { clipUtf8 }
