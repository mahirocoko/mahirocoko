import { Buffer } from 'node:buffer'

const clipUtf8 = (input, maxBytes, suffix = '…') => {
  if (typeof input !== 'string' || typeof suffix !== 'string') {
    throw new TypeError('input and suffix must be strings')
  }

  if (!Number.isInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError('maxBytes must be a non-negative integer')
  }

  if (Buffer.byteLength(input, 'utf8') <= maxBytes) return input

  let fittedSuffix = ''
  let suffixBytes = 0
  for (const point of suffix) {
    const bytes = Buffer.byteLength(point, 'utf8')
    if (suffixBytes + bytes > maxBytes) break
    fittedSuffix += point
    suffixBytes += bytes
  }

  let prefix = ''
  let prefixBytes = 0
  const suffixStart = fittedSuffix.charCodeAt(0)
  for (const point of input) {
    const bytes = Buffer.byteLength(point, 'utf8')
    const code = point.codePointAt(0)
    // Lone surrogates can form a pair across the prefix/suffix boundary.
    const pairedBoundary = code >= 0xd800 && code <= 0xdbff &&
      suffixStart >= 0xdc00 && suffixStart <= 0xdfff
    const totalBytes = prefixBytes + bytes + suffixBytes - (pairedBoundary ? 2 : 0)
    if (totalBytes > maxBytes) break
    prefix += point
    prefixBytes += bytes
  }

  return prefix + fittedSuffix
}

export { clipUtf8 }
