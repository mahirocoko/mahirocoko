import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'

const solutionRoot = process.env.SOLUTION_ROOT
const moduleUrl = `${pathToFileURL(join(solutionRoot, 'src/index.js')).href}?run=${Date.now()}`
const {
  consume,
  dispatch,
  EnvelopeValidationError,
  normalizeEnvelope,
  ResultConflictError,
  ResultStore,
} = await import(moduleUrl)

test('normalizes legacy failure', () => {
  assert.deepEqual(normalizeEnvelope({
    requestId: 'legacy-error',
    ok: false,
    error: { code: 'NOPE', message: 'failed' },
  }), {
    schemaVersion: 2,
    requestId: 'legacy-error',
    outcome: { status: 'error', error: { code: 'NOPE', message: 'failed' } },
    transport: { attempt: 1, receivedAt: null },
  })
})

test('wrapper metadata overrides payload transport and preserves lease', () => {
  const normalized = normalizeEnvelope({
    payload: {
      schemaVersion: 2,
      requestId: 'wrapped',
      outcome: { status: 'ok', data: 1 },
      transport: { attempt: 2, receivedAt: 'old' },
    },
    attempt: 3,
    receivedAt: 'new',
    lease: { owner: 'worker', until: 123 },
  })
  assert.deepEqual(normalized.transport, {
    attempt: 3,
    receivedAt: 'new',
    lease: { owner: 'worker', until: 123 },
  })
})

test('normalization returns a fresh value without mutating its input', () => {
  const input = {
    schemaVersion: 2,
    requestId: 'fresh',
    outcome: { status: 'ok', data: { value: 1 } },
    transport: { attempt: 1, receivedAt: null },
  }
  const before = structuredClone(input)
  const normalized = normalizeEnvelope(input)
  normalized.outcome.data.value = 99
  assert.deepEqual(input, before)
})

test('consume trusts nested v2 outcome instead of stray top-level ok', () => {
  assert.deepEqual(consume({
    schemaVersion: 2,
    requestId: 'stray',
    ok: true,
    outcome: { status: 'error', error: { code: 'E', message: 'bad' } },
    transport: { attempt: 1, receivedAt: null },
  }), { ok: false, error: { code: 'E', message: 'bad' } })
})

test('rejects invalid request, transport, outcome, and lease contracts', () => {
  const invalid = [
    null,
    { requestId: '', ok: true, data: 1 },
    { schemaVersion: 2, requestId: 'x', outcome: { status: 'wat' }, transport: { attempt: 1, receivedAt: null } },
    { payload: { requestId: 'x', ok: true, data: 1 }, lease: { owner: '', until: 1 } },
  ]
  for (const value of invalid) assert.throws(() => normalizeEnvelope(value), EnvelopeValidationError)
})

test('dispatch produces canonical success and failure', async () => {
  assert.deepEqual(await dispatch('ok', async () => 42, { attempt: 2, receivedAt: 'now' }), {
    schemaVersion: 2,
    requestId: 'ok',
    outcome: { status: 'ok', data: 42 },
    transport: { attempt: 2, receivedAt: 'now' },
  })

  const coded = new Error('boom')
  coded.code = 'BROKEN'
  assert.deepEqual(await dispatch('bad', async () => { throw coded }), {
    schemaVersion: 2,
    requestId: 'bad',
    outcome: { status: 'error', error: { code: 'BROKEN', message: 'boom' } },
    transport: { attempt: 1, receivedAt: null },
  })
})

test('store is idempotent, detects conflicts, and returns detached values', async () => {
  const root = await mkdtemp(join(tmpdir(), 'result-store-hidden-'))
  const filePath = join(root, 'results.json')
  const store = await ResultStore.open(filePath)
  const first = { requestId: 'same', ok: true, data: { value: 1 } }
  assert.equal((await store.record(first)).inserted, true)
  assert.equal((await store.record(first)).inserted, false)
  await assert.rejects(store.record({ requestId: 'same', ok: true, data: { value: 2 } }), ResultConflictError)
  const received = store.get('same')
  received.outcome.data.value = 99
  assert.equal(store.get('same').outcome.data.value, 1)
})

test('store normalizes legacy records when reopening', async () => {
  const root = await mkdtemp(join(tmpdir(), 'result-store-legacy-'))
  const filePath = join(root, 'results.json')
  await writeFile(filePath, JSON.stringify({
    version: 1,
    records: {
      old: { requestId: 'old', ok: false, error: { code: 'OLD', message: 'legacy' } },
    },
  }))
  const store = await ResultStore.open(filePath)
  assert.equal(store.get('old').schemaVersion, 2)
  assert.equal(store.get('old').outcome.status, 'error')
})

test('malformed store fails without overwrite', async () => {
  const root = await mkdtemp(join(tmpdir(), 'result-store-malformed-'))
  const filePath = join(root, 'results.json')
  await writeFile(filePath, '{"version":1,"records":{"x":{"bad":true}}}')
  const before = await readFile(filePath, 'utf8')
  await assert.rejects(ResultStore.open(filePath))
  assert.equal(await readFile(filePath, 'utf8'), before)
})

test('atomic store persistence leaves no temporary files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'result-store-atomic-'))
  const store = await ResultStore.open(join(root, 'results.json'))
  await store.record({ requestId: 'x', ok: true, data: 1 })
  assert.deepEqual(await readdir(root), ['results.json'])
})

test('uses rename-based persistence and cleans its temp after failure', async () => {
  const source = await readFile(join(solutionRoot, 'src/result-store.js'), 'utf8')
  assert.match(source, /\brename\b/)

  const root = await mkdtemp(join(tmpdir(), 'result-store-failed-write-'))
  const filePath = join(root, 'results.json')
  const store = await ResultStore.open(filePath)
  await rm(filePath, { force: true })
  await mkdir(filePath)
  await assert.rejects(store.record({ requestId: 'x', ok: true, data: 1 }))
  assert.deepEqual(await readdir(root), ['results.json'])
})
