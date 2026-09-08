import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { basename, dirname, join, resolve } from 'node:path'

class DuplicateIdError extends Error {}

const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const copy = (value) => JSON.parse(JSON.stringify(value))

function validateState(state) {
  const invalid = () => { throw new Error('Invalid persisted lease queue state') }
  if (!state || state.version !== 1 || !Array.isArray(state.items) || !Array.isArray(state.seenIds)) invalid()
  const seenIds = new Set(state.seenIds)
  if (seenIds.size !== state.seenIds.length || !state.seenIds.every(nonEmptyString)) invalid()
  const itemIds = new Set()
  for (const item of state.items) {
    if (!item || !nonEmptyString(item.id) || itemIds.has(item.id) || !seenIds.has(item.id)
      || !['queued', 'claimed', 'done'].includes(item.status)
      || !Number.isSafeInteger(item.attempt) || item.attempt < 0) invalid()
    if (item.status === 'claimed' && (!nonEmptyString(item.owner)
      || !Number.isFinite(item.leaseUntil) || item.attempt === 0)) invalid()
    itemIds.add(item.id)
  }
}

function expireClaims(state, now) {
  let changed = false
  for (const item of state.items) {
    if (item.status === 'claimed' && item.leaseUntil <= now) {
      item.status = 'queued'
      delete item.owner
      delete item.leaseUntil
      changed = true
    }
  }
  return changed
}

class PersistentLeaseQueue {
  constructor(filePath, state, options) {
    this.filePath = resolve(filePath)
    this.state = state
    this.clock = options.clock
    this.leaseMs = options.leaseMs
    this.pending = Promise.resolve()
  }

  static async open(filePath, { clock = Date.now, leaseMs = 30000 } = {}) {
    if (typeof clock !== 'function' || !Number.isFinite(leaseMs) || leaseMs <= 0) {
      throw new TypeError('A clock function and positive finite leaseMs are required')
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

  // A rejected operation must not prevent later operations from running.
  serialize(operation) {
    const result = this.pending.then(operation)
    this.pending = result.catch(() => {})
    return result
  }

  async persist(state = this.state) {
    const data = JSON.stringify(state, null, 2)
    const directory = dirname(this.filePath)
    await mkdir(directory, { recursive: true })
    const temporary = join(directory, `.${basename(this.filePath)}.${randomUUID()}.tmp`)
    let handle
    let owned = false
    try {
      handle = await open(temporary, 'wx')
      owned = true
      await handle.writeFile(data, 'utf8')
      await handle.close()
      handle = undefined
      await rename(temporary, this.filePath)
      owned = false
    } catch (error) {
      if (handle) await handle.close().catch(() => {})
      if (owned) await unlink(temporary).catch(() => {})
      throw error
    }
  }

  async commit(state) {
    await this.persist(state)
    this.state = state
  }

  async enqueue({ id, payload }) {
    return this.serialize(async () => {
      if (!nonEmptyString(id)) throw new TypeError('ID must be a non-empty string')
      if (this.state.seenIds.includes(id)) throw new DuplicateIdError(`Duplicate ID: ${id}`)
      const state = this.snapshot()
      // Normalize payloads to the same JSON representation used after reopening.
      state.items.push(copy({ id, payload, status: 'queued', attempt: 0 }))
      state.seenIds.push(id)
      await this.commit(state)
    })
  }

  async claim(owner) {
    return this.serialize(async () => {
      if (!nonEmptyString(owner)) throw new TypeError('Owner must be a non-empty string')
      const now = this.clock()
      const state = this.snapshot()
      const expired = expireClaims(state, now)
      const item = state.items.find((entry) => entry.status === 'queued')
      if (!item) {
        if (expired) await this.commit(state)
        return null
      }
      item.status = 'claimed'
      item.owner = owner
      item.attempt += 1
      item.leaseUntil = now + this.leaseMs
      await this.commit(state)
      return { id: item.id, payload: copy(item).payload, attempt: item.attempt, leaseUntil: item.leaseUntil }
    })
  }

  async finish(owner, id, status) {
    return this.serialize(async () => {
      const state = this.snapshot()
      const expired = expireClaims(state, this.clock())
      const item = state.items.find((entry) => entry.id === id)
      if (!item || item.status !== 'claimed' || item.owner !== owner) {
        if (expired) await this.commit(state)
        return false
      }
      item.status = status
      delete item.owner
      delete item.leaseUntil
      await this.commit(state)
      return true
    })
  }

  async ack(owner, id) {
    return this.finish(owner, id, 'done')
  }

  async fail(owner, id) {
    return this.finish(owner, id, 'queued')
  }

  snapshot() {
    return copy(this.state)
  }
}

export { DuplicateIdError, PersistentLeaseQueue }
