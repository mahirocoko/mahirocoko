import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { EnvelopeValidationError, normalizeEnvelope } from './protocol.js'

class ResultConflictError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ResultConflictError'
  }
}

class ResultStore {
  #pending = Promise.resolve()

  constructor(filePath, state) {
    this.filePath = filePath
    this.state = state
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
      throw new EnvelopeValidationError('Invalid version-1 result store state')
    }
    const records = Object.create(null)
    for (const [requestId, input] of Object.entries(state.records)) {
      const envelope = normalizeEnvelope(input)
      if (envelope.requestId !== requestId) {
        throw new EnvelopeValidationError('Stored requestId must match its record key')
      }
      records[requestId] = envelope
    }
    return new ResultStore(filePath, { version: 1, records })
  }

  async record(input) {
    const envelope = structuredClone(normalizeEnvelope(input))
    // Serialize writes so concurrent calls observe the first committed record.
    const operation = this.#pending.then(() => this.#record(envelope))
    this.#pending = operation.catch(() => {})
    return operation
  }

  async #record(envelope) {
    const { requestId } = envelope
    if (Object.hasOwn(this.state.records, requestId)) {
      const existing = this.state.records[requestId]
      if (!isDeepStrictEqual(existing, envelope)) {
        throw new ResultConflictError(`Conflicting result for requestId: ${requestId}`)
      }
      return { inserted: false, envelope: structuredClone(existing) }
    }

    const state = {
      version: 1,
      records: { ...this.state.records, [requestId]: envelope },
    }
    const serialized = JSON.stringify(state, null, 2)
    const directory = dirname(this.filePath)
    const temporary = join(directory, `.${basename(this.filePath)}.${randomUUID()}.tmp`)
    await mkdir(directory, { recursive: true })
    try {
      await writeFile(temporary, serialized, { flag: 'wx' })
      await rename(temporary, this.filePath)
    } catch (error) {
      await rm(temporary, { force: true }).catch(() => {})
      throw error
    }
    // Publish in memory only after persistence succeeds.
    this.state = state
    return { inserted: true, envelope: structuredClone(envelope) }
  }

  get(requestId) {
    return Object.hasOwn(this.state.records, requestId)
      ? structuredClone(this.state.records[requestId])
      : null
  }
}

export { ResultConflictError, ResultStore }
