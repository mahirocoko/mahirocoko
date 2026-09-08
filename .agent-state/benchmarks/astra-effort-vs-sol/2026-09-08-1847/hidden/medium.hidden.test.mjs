import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'

const solutionRoot = process.env.SOLUTION_ROOT
const moduleUrl = `${pathToFileURL(join(solutionRoot, 'src/persistent-lease-queue.js')).href}?run=${Date.now()}`
const { DuplicateIdError, PersistentLeaseQueue } = await import(moduleUrl)

const createQueue = async (options = {}) => {
  const root = await mkdtemp(join(tmpdir(), 'lease-queue-hidden-'))
  const filePath = join(root, 'queue.json')
  const queue = await PersistentLeaseQueue.open(filePath, options)
  return { filePath, queue, root }
}

test('rejects duplicate IDs permanently without changing persisted state', async () => {
  const { filePath, queue } = await createQueue()
  await queue.enqueue({ id: 'same', payload: 1 })
  await queue.claim('worker')
  await queue.ack('worker', 'same')
  const before = await readFile(filePath, 'utf8')
  await assert.rejects(queue.enqueue({ id: 'same', payload: 2 }), DuplicateIdError)
  assert.equal(await readFile(filePath, 'utf8'), before)
})

test('validates IDs and owners without mutating persisted state', async () => {
  const { queue } = await createQueue()
  await assert.rejects(queue.enqueue({ id: '', payload: null }))
  await assert.rejects(queue.claim(''))
  assert.deepEqual(queue.snapshot(), { version: 1, items: [], seenIds: [] })
})

test('claims queued items in insertion order', async () => {
  const { queue } = await createQueue()
  await queue.enqueue({ id: 'first', payload: 1 })
  await queue.enqueue({ id: 'second', payload: 2 })
  assert.equal((await queue.claim('a')).id, 'first')
  assert.equal((await queue.claim('b')).id, 'second')
})

test('reclaims an expired lease and increments attempt', async () => {
  let now = 100
  const { queue } = await createQueue({ clock: () => now, leaseMs: 10 })
  await queue.enqueue({ id: 'job', payload: 'value' })
  assert.equal((await queue.claim('a')).attempt, 1)
  now = 110
  assert.deepEqual(await queue.claim('b'), {
    id: 'job',
    payload: 'value',
    attempt: 2,
    leaseUntil: 120,
  })
})

test('expired acknowledgement fails and persists reconciliation', async () => {
  let now = 0
  const { filePath, queue } = await createQueue({ clock: () => now, leaseMs: 5 })
  await queue.enqueue({ id: 'job', payload: null })
  await queue.claim('a')
  now = 5
  assert.equal(await queue.ack('a', 'job'), false)
  const reopened = await PersistentLeaseQueue.open(filePath)
  assert.equal(reopened.snapshot().items[0].status, 'queued')
})

test('fail requeues a valid claim and permits a later claim', async () => {
  const { queue } = await createQueue({ clock: () => 50, leaseMs: 10 })
  await queue.enqueue({ id: 'job', payload: 7 })
  await queue.claim('a')
  assert.equal(await queue.fail('a', 'job'), true)
  assert.equal((await queue.claim('b')).attempt, 2)
})

test('serializes simultaneous claims', async () => {
  const { queue } = await createQueue()
  await queue.enqueue({ id: 'only', payload: null })
  const claims = await Promise.all([queue.claim('a'), queue.claim('b')])
  assert.equal(claims.filter(Boolean).length, 1)
})

test('snapshot is detached from internal state', async () => {
  const { queue } = await createQueue()
  await queue.enqueue({ id: 'job', payload: { value: 1 } })
  const snapshot = queue.snapshot()
  snapshot.items[0].payload.value = 99
  assert.equal(queue.snapshot().items[0].payload.value, 1)
})

test('rejects malformed persisted state without overwriting it', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lease-queue-malformed-'))
  const filePath = join(root, 'queue.json')
  await writeFile(filePath, '{"version":99,"items":[]}', 'utf8')
  const before = await readFile(filePath, 'utf8')
  await assert.rejects(PersistentLeaseQueue.open(filePath))
  assert.equal(await readFile(filePath, 'utf8'), before)
})

test('rejects malformed item records', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lease-queue-item-'))
  const filePath = join(root, 'queue.json')
  await writeFile(filePath, JSON.stringify({ version: 1, items: [{ id: '', status: 'queued' }], seenIds: [] }))
  await assert.rejects(PersistentLeaseQueue.open(filePath))
})

test('leaves no owned temporary files after successful persistence', async () => {
  const { queue, root } = await createQueue()
  await queue.enqueue({ id: 'job', payload: null })
  assert.deepEqual(await readdir(root), ['queue.json'])
})

test('uses rename-based persistence and cleans its temp after failure', async () => {
  const source = await readFile(join(solutionRoot, 'src/persistent-lease-queue.js'), 'utf8')
  assert.match(source, /\brename\b/)

  const root = await mkdtemp(join(tmpdir(), 'lease-queue-failed-write-'))
  const filePath = join(root, 'queue.json')
  const queue = await PersistentLeaseQueue.open(filePath)
  await rm(filePath, { force: true })
  await mkdir(filePath)
  await assert.rejects(queue.enqueue({ id: 'job', payload: null }))
  assert.deepEqual(await readdir(root), ['queue.json'])
})
