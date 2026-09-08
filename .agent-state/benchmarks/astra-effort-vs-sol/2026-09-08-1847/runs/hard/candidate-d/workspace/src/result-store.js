import { mkdir, readFile, writeFile, rename, unlink } from 'node:fs/promises'
import { dirname, basename, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'
import { EnvelopeValidationError, normalizeEnvelope } from './protocol.js'

class ResultConflictError extends Error {}

class ResultStore {
  constructor(filePath, state) {
    this.filePath = filePath
    this.state = state
    this.pending = Promise.resolve()
  }

  static async open(filePath) {
    let state = { version: 1, records: {} }
    try {
      state = JSON.parse(await readFile(filePath, 'utf8'))
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    if (!state || state.version !== 1 || !state.records ||
        typeof state.records !== 'object' || Array.isArray(state.records)) {
      throw new EnvelopeValidationError('Invalid result store state')
    }
    const records = Object.create(null)
    for (const [requestId, input] of Object.entries(state.records)) {
      const envelope = normalizeEnvelope(input)
      if (envelope.requestId !== requestId) {
        throw new EnvelopeValidationError('Stored requestId does not match its key')
      }
      records[requestId] = envelope
    }
    return new ResultStore(filePath, { version: 1, records })
  }

  async record(input) {
    const envelope = structuredClone(normalizeEnvelope(input))
    const operation = this.pending.then(() => this.persist(envelope))
    this.pending = operation.catch(() => {})
    return operation
  }

  async persist(envelope) {
    const existing = Object.hasOwn(this.state.records, envelope.requestId)
      ? this.state.records[envelope.requestId]
      : null
    if (existing) {
      if (!isDeepStrictEqual(existing, envelope)) {
        throw new ResultConflictError(`Conflicting result for ${envelope.requestId}`)
      }
      return { inserted: false, envelope: structuredClone(existing) }
    }
    const next = {
      version: 1,
      records: { ...this.state.records, [envelope.requestId]: envelope },
    }
    const directory = dirname(this.filePath)
    const temporary = join(directory, `.${basename(this.filePath)}.${randomUUID()}.tmp`)
    const serialized = JSON.stringify(next, null, 2)
    await mkdir(directory, { recursive: true })
    try {
      await writeFile(temporary, serialized, { flag: 'wx' })
      await rename(temporary, this.filePath)
    } finally {
      await unlink(temporary).catch((error) => {
        if (error.code !== 'ENOENT') throw error
      })
    }
    this.state = next
    return { inserted: true, envelope: structuredClone(envelope) }
  }

  get(requestId) {
    return Object.hasOwn(this.state.records, requestId)
      ? structuredClone(this.state.records[requestId])
      : null
  }
}

export { ResultConflictError, ResultStore }
