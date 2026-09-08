import assert from 'node:assert/strict'
import test from 'node:test'

import { clipUtf8 } from '../src/clip-utf8.js'

test('returns input that already fits', () => {
  assert.equal(clipUtf8('hello', 5), 'hello')
})

test('clips ASCII and appends the suffix', () => {
  assert.equal(clipUtf8('abcdef', 5, '..'), 'abc..')
})

test('validates maxBytes', () => {
  assert.throws(() => clipUtf8('hello', -1), RangeError)
})
