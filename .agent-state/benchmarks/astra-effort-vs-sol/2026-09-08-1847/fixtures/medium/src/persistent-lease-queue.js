import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

class DuplicateIdError extends Error {}

class PersistentLeaseQueue {
  constructor(filePath, state, options) {
    this.filePath = filePath
    this.state = state
    this.clock = options.clock
    this.leaseMs = options.leaseMs
  }

  static async open(filePath, { clock = Date.now, leaseMs = 30000 } = {}) {
    let state = { version: 1, items: [], seenIds: [] }
    try {
      state = JSON.parse(await readFile(filePath, 'utf8'))
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    return new PersistentLeaseQueue(filePath, state, { clock, leaseMs })
  }

  async persist() {
    await mkdir(dirname(this.filePath), { recursive: true })
    await writeFile(this.filePath, JSON.stringify(this.state, null, 2))
  }

  async enqueue({ id, payload }) {
    this.state.items.push({ id, payload, status: 'queued', attempt: 0 })
    this.state.seenIds.push(id)
    await this.persist()
  }

  async claim(owner) {
    const item = this.state.items.find((entry) => entry.status === 'queued')
    if (!item) return null
    item.status = 'claimed'
    item.owner = owner
    item.attempt += 1
    item.leaseUntil = this.clock() + this.leaseMs
    await this.persist()
    return { id: item.id, payload: item.payload, attempt: item.attempt, leaseUntil: item.leaseUntil }
  }

  async ack(owner, id) {
    const item = this.state.items.find((entry) => entry.id === id)
    if (!item || item.owner !== owner) return false
    item.status = 'done'
    await this.persist()
    return true
  }

  async fail(owner, id) {
    const item = this.state.items.find((entry) => entry.id === id)
    if (!item || item.owner !== owner) return false
    item.status = 'queued'
    await this.persist()
    return true
  }

  snapshot() {
    return this.state
  }
}

export { DuplicateIdError, PersistentLeaseQueue }
