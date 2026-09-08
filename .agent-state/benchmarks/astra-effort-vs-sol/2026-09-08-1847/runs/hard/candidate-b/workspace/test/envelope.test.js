import assert from 'node:assert/strict'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { consume, normalizeEnvelope, ResultStore } from '../src/index.js'

const success = {
  schemaVersion: 2,
  requestId: 'req-1',
  outcome: { status: 'ok', data: { value: 42 } },
  transport: { attempt: 1, receivedAt: null },
}

test('normalizes and consumes direct v2 success', () => {
  assert.deepEqual(normalizeEnvelope(success), success)
  assert.deepEqual(consume(success), { ok: true, value: { value: 42 } })
})

test('normalizes legacy success', () => {
  assert.deepEqual(normalizeEnvelope({ requestId: 'legacy-1', ok: true, data: 'done' }), {
    schemaVersion: 2,
    requestId: 'legacy-1',
    outcome: { status: 'ok', data: 'done' },
    transport: { attempt: 1, receivedAt: null },
  })
})

test('stores an exact duplicate idempotently', async () => {
  const root = await mkdtemp(join(tmpdir(), 'result-store-public-'))
  const store = await ResultStore.open(join(root, 'results.json'))
  assert.equal((await store.record(success)).inserted, true)
  assert.equal((await store.record(success)).inserted, false)
})
