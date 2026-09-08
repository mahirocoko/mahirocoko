import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'

class DuplicateIdError extends Error {}

const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const copy = (value) => structuredClone(value)

function validateState(state) {
  const invalid = () => { throw new Error('Malformed or unsupported persistent lease queue state') }
  if (!state || state.version !== 1 || !Array.isArray(state.items) || !Array.isArray(state.seenIds)) invalid()
  const seen = new Set()
  for (const id of state.seenIds) {
    if (!nonEmptyString(id) || seen.has(id)) invalid()
    seen.add(id)
  }
  const ids = new Set()
  for (const item of state.items) {
    if (!item || !nonEmptyString(item.id) || ids.has(item.id) || !seen.has(item.id) ||
        !['queued', 'claimed', 'done'].includes(item.status) ||
        !Number.isSafeInteger(item.attempt) || item.attempt < 0) invalid()
    if (item.status === 'claimed' && (!nonEmptyString(item.owner) ||
        !Number.isFinite(item.leaseUntil) || item.attempt < 1)) invalid()
    ids.add(item.id)
  }
}

function requeue(item) {
  item.status = 'queued'
  delete item.owner
  delete item.leaseUntil
}

function expire(state, now) {
  let changed = false
  for (const item of state.items) {
    if (item.status === 'claimed' && item.leaseUntil <= now) {
      requeue(item)
      changed = true
    }
  }
  return changed
}

class PersistentLeaseQueue {
  constructor(filePath, state, options) {
    this.filePath = filePath
    this.state = state
    this.clock = options.clock
    this.leaseMs = options.leaseMs
    this.pending = Promise.resolve()
  }

  static async open(filePath, { clock = Date.now, leaseMs = 30000 } = {}) {
    if (typeof clock !== 'function' || !Number.isFinite(leaseMs) || leaseMs <= 0) {
      throw new TypeError('Expected a clock function and a positive finite leaseMs')
    }
    let state
    let absent = false
    try {
      state = JSON.parse(await readFile(filePath, 'utf8'))
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
      absent = true
      state = { version: 1, items: [], seenIds: [] }
    }
    validateState(state)
    const queue = new PersistentLeaseQueue(filePath, state, { clock, leaseMs })
    if (absent) await queue.persist(state)
    return queue
  }

  async persist(state = this.state) {
    const data = JSON.stringify(state, null, 2)
    const directory = dirname(this.filePath)
    await mkdir(directory, { recursive: true })
    const temporary = join(directory, `.lease-queue-${randomUUID()}.tmp`)
    let handle
    let owned = false
    try {
      handle = await open(temporary, 'wx')
      owned = true
      await handle.writeFile(data)
      await handle.close()
      handle = undefined
      await rename(temporary, this.filePath)
      owned = false
    } finally {
      try {
        if (handle) await handle.close()
      } finally {
        if (owned) await unlink(temporary)
      }
    }
  }

  // Rejected operations must not poison the serialization chain.
  mutate(operation) {
    const result = this.pending.then(async () => {
      const state = copy(this.state)
      const { changed, value } = operation(state)
      if (changed) {
        await this.persist(state)
        this.state = state
      }
      return value
    })
    this.pending = result.catch(() => {})
    return result
  }

  async enqueue({ id, payload }) {
    if (!nonEmptyString(id)) throw new TypeError('ID must be a non-empty string')
    return this.mutate((state) => {
      if (state.seenIds.includes(id)) throw new DuplicateIdError(`Duplicate ID: ${id}`)
      state.items.push({ id, payload: copy(payload), status: 'queued', attempt: 0 })
      state.seenIds.push(id)
      return { changed: true }
    })
  }

  async claim(owner) {
    if (!nonEmptyString(owner)) throw new TypeError('Owner must be a non-empty string')
    return this.mutate((state) => {
      const now = this.clock()
      const changed = expire(state, now)
      const item = state.items.find((entry) => entry.status === 'queued')
      if (!item) return { changed, value: null }
      item.status = 'claimed'
      item.owner = owner
      item.attempt += 1
      item.leaseUntil = now + this.leaseMs
      return {
        changed: true,
        value: { id: item.id, payload: copy(item.payload), attempt: item.attempt, leaseUntil: item.leaseUntil },
      }
    })
  }

  settle(owner, id, status) {
    return this.mutate((state) => {
      const now = this.clock()
      const changed = expire(state, now)
      const item = state.items.find((entry) => entry.id === id)
      if (!item || item.status !== 'claimed' || item.owner !== owner || !(item.leaseUntil > now)) {
        return { changed, value: false }
      }
      requeue(item)
      item.status = status
      return { changed: true, value: true }
    })
  }

  async ack(owner, id) {
    return this.settle(owner, id, 'done')
  }

  async fail(owner, id) {
    return this.settle(owner, id, 'queued')
  }

  snapshot() {
    return copy(this.state)
  }
}

export { DuplicateIdError, PersistentLeaseQueue }
