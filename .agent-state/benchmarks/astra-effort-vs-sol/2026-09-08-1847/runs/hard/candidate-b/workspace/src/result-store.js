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
    // Serialize writes so concurrent callers cannot overwrite one another's snapshots.
    const operation = this.pending.then(async () => {
      const existing = this.state.records[envelope.requestId]
      if (existing) {
        if (!isDeepStrictEqual(existing, envelope)) {
          throw new ResultConflictError(`Conflicting result for ${envelope.requestId}`)
        }
        return { inserted: false, envelope: structuredClone(existing) }
      }
      const state = {
        version: 1,
        records: { ...this.state.records, [envelope.requestId]: envelope },
      }
      const serialized = JSON.stringify(state, null, 2)
      const directory = dirname(this.filePath)
      await mkdir(directory, { recursive: true })
      const temporary = join(directory, `.${basename(this.filePath)}.${randomUUID()}.tmp`)
      try {
        await writeFile(temporary, serialized, { flag: 'wx' })
        await rename(temporary, this.filePath)
      } finally {
        await unlink(temporary).catch((error) => {
          if (error.code !== 'ENOENT') throw error
        })
      }
      this.state = { version: 1, records: Object.assign(Object.create(null), state.records) }
      return { inserted: true, envelope: structuredClone(envelope) }
    })
    this.pending = operation.catch(() => {})
    return operation
  }

  get(requestId) {
    const envelope = this.state.records[requestId]
    return envelope ? structuredClone(envelope) : null
  }
}

export { ResultConflictError, ResultStore }
