import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import test from 'node:test'

const solutionRoot = process.env.SOLUTION_ROOT
const moduleUrl = `${pathToFileURL(join(solutionRoot, 'src/clip-utf8.js')).href}?run=${Date.now()}`
const { clipUtf8 } = await import(moduleUrl)

test('clips Thai text by UTF-8 bytes', () => {
  assert.equal(clipUtf8('ภาษาไทย', 10), 'ภา…')
})

test('never splits an emoji code point', () => {
  assert.equal(clipUtf8('A😀B', 5), 'A…')
  assert.ok(Buffer.byteLength(clipUtf8('A😀B', 5)) <= 5)
})

test('returns exact multibyte input unchanged', () => {
  assert.equal(clipUtf8('ไทย', 9), 'ไทย')
})

test('fits the suffix itself by code point', () => {
  assert.equal(clipUtf8('abcdef', 2, 'XYZ'), 'XY')
  assert.equal(clipUtf8('abcdef', 2, '…'), 'ab')
})

test('handles zero budget and empty suffix', () => {
  assert.equal(clipUtf8('hello', 0), '')
  assert.equal(clipUtf8('😀x', 4, ''), '😀')
})

test('validates string inputs', () => {
  assert.throws(() => clipUtf8(42, 3), TypeError)
  assert.throws(() => clipUtf8('hello', 3, null), TypeError)
})

test('rejects non-integer and non-finite budgets', () => {
  assert.throws(() => clipUtf8('hello', 2.5), RangeError)
  assert.throws(() => clipUtf8('hello', Number.POSITIVE_INFINITY), RangeError)
})
