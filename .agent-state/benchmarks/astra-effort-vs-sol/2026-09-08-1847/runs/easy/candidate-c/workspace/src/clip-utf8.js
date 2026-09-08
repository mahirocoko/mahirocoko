import { Buffer } from 'node:buffer'

const fitPrefix = (value, maxBytes) => {
  const codePoints = []
  let byteLength = 0

  for (const codePoint of value) {
    const codePointBytes = Buffer.byteLength(codePoint, 'utf8')
    if (byteLength + codePointBytes > maxBytes) break

    codePoints.push(codePoint)
    byteLength += codePointBytes
  }

  return { value: codePoints.join(''), byteLength }
}

const clipUtf8 = (input, maxBytes, suffix = '…') => {
  if (typeof input !== 'string' || typeof suffix !== 'string') {
    throw new TypeError('input and suffix must be strings')
  }

  if (!Number.isInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError('maxBytes must be a non-negative integer')
  }

  if (Buffer.byteLength(input, 'utf8') <= maxBytes) return input

  const fittedSuffix = fitPrefix(suffix, maxBytes)
  const prefix = fitPrefix(input, maxBytes - fittedSuffix.byteLength)

  return `${prefix.value}${fittedSuffix.value}`
}

export { clipUtf8 }
