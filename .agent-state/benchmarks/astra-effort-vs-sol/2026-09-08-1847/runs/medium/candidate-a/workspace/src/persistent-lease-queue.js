import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname } from 'node:path'

class DuplicateIdError extends Error {}

const isNonEmptyString = (value) => typeof value === 'string' && value.length > 0

function validateState(state) {
  const invalid = () => { throw new Error('Invalid persisted queue state') }
  if (!state || state.version !== 1 || !Array.isArray(state.items) || !Array.isArray(state.seenIds)) {
    invalid()
  }
  const seenIds = new Set(state.seenIds)
  if (seenIds.size !== state.seenIds.length || !state.seenIds.every(isNonEmptyString)) invalid()
  const itemIds = new Set()
  for (const item of state.items) {
    if (!item || !isNonEmptyString(item.id) || itemIds.has(item.id) || !seenIds.has(item.id) ||
        !['queued', 'claimed', 'done'].includes(item.status) ||
        !Number.isSafeInteger(item.attempt) || item.attempt < 0) invalid()
    if (item.status === 'claimed' &&
        (!isNonEmptyString(item.owner) || !Number.isFinite(item.leaseUntil) || item.attempt === 0)) invalid()
    itemIds.add(item.id)
  }
}

function clearClaim(item) {
  delete item.owner
  delete item.leaseUntil
}

function expireClaims(state, now) {
  let changed = false
  for (const item of state.items) {
    if (item.status === 'claimed' && item.leaseUntil <= now) {
      item.status = 'queued'
      clearClaim(item)
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
    let state = { version: 1, items: [], seenIds: [] }
    let absent = false
    try {
      state = JSON.parse(await readFile(filePath, 'utf8'))
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
      absent = true
    }
    validateState(state)
    const queue = new PersistentLeaseQueue(filePath, state, { clock, leaseMs })
    if (absent) await queue.persist()
    return queue
  }

  serialize(operation) {
    const result = this.pending.then(operation)
    // A rejected operation must not prevent later operations from running.
    this.pending = result.catch(() => {})
    return result
  }

  persist() {
    return this.serialize(() => this.writeState(this.state))
  }

  async writeState(state) {
    const json = JSON.stringify(state, null, 2)
    await mkdir(dirname(this.filePath), { recursive: true })
    const temporaryPath = `${this.filePath}.${randomUUID()}.tmp`
    let handle
    let owned = false
    try {
      handle = await open(temporaryPath, 'wx')
      owned = true
      await handle.writeFile(json, 'utf8')
      await handle.close()
      handle = undefined
      await rename(temporaryPath, this.filePath)
      owned = false
    } finally {
      if (handle) await handle.close().catch(() => {})
      if (owned) await unlink(temporaryPath).catch(() => {})
    }
  }

  mutate(operation) {
    return this.serialize(async () => {
      const state = structuredClone(this.state)
      const { changed, result } = operation(state)
      if (changed) {
        await this.writeState(state)
        this.state = state
      }
      return result
    })
  }

  async enqueue({ id, payload }) {
    return this.mutate((state) => {
      if (!isNonEmptyString(id)) throw new TypeError('ID must be a non-empty string')
      if (state.seenIds.includes(id)) throw new DuplicateIdError(`Duplicate ID: ${id}`)
      state.items.push({ id, payload: structuredClone(payload), status: 'queued', attempt: 0 })
      state.seenIds.push(id)
      return { changed: true }
    })
  }

  async claim(owner) {
    return this.mutate((state) => {
      if (!isNonEmptyString(owner)) throw new TypeError('Owner must be a non-empty string')
      const now = this.clock()
      const changed = expireClaims(state, now)
      const item = state.items.find((entry) => entry.status === 'queued')
      if (!item) return { changed, result: null }
      item.status = 'claimed'
      item.owner = owner
      item.attempt += 1
      item.leaseUntil = now + this.leaseMs
      return {
        changed: true,
        result: { id: item.id, payload: structuredClone(item.payload), attempt: item.attempt, leaseUntil: item.leaseUntil },
      }
    })
  }

  async ack(owner, id) {
    return this.finishClaim(owner, id, 'done')
  }

  async fail(owner, id) {
    return this.finishClaim(owner, id, 'queued')
  }

  finishClaim(owner, id, status) {
    return this.mutate((state) => {
      const changed = expireClaims(state, this.clock())
      const item = state.items.find((entry) => entry.id === id)
      if (!item || item.status !== 'claimed' || item.owner !== owner) {
        return { changed, result: false }
      }
      item.status = status
      clearClaim(item)
      return { changed: true, result: true }
    })
  }

  snapshot() {
    return structuredClone(this.state)
  }
}

export { DuplicateIdError, PersistentLeaseQueue }
