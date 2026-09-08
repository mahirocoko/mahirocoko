import assert from 'node:assert/strict'
import { mkdtemp } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

import { PersistentLeaseQueue } from '../src/persistent-lease-queue.js'

test('enqueues, claims, acknowledges, and reloads state', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lease-queue-public-'))
  const filePath = join(root, 'queue.json')
  const queue = await PersistentLeaseQueue.open(filePath, { clock: () => 100, leaseMs: 50 })

  await queue.enqueue({ id: 'job-1', payload: { value: 1 } })
  assert.deepEqual(await queue.claim('worker-a'), {
    id: 'job-1',
    payload: { value: 1 },
    attempt: 1,
    leaseUntil: 150,
  })
  assert.equal(await queue.ack('worker-a', 'job-1'), true)

  const reopened = await PersistentLeaseQueue.open(filePath)
  assert.equal(reopened.snapshot().items[0].status, 'done')
})

test('rejects acknowledgement from another owner', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lease-queue-owner-'))
  const queue = await PersistentLeaseQueue.open(join(root, 'queue.json'))
  await queue.enqueue({ id: 'job-1', payload: null })
  await queue.claim('worker-a')
  assert.equal(await queue.ack('worker-b', 'job-1'), false)
})
