import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

class ResultConflictError extends Error {}

class ResultStore {
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
    return new ResultStore(filePath, state)
  }

  async record(envelope) {
    this.state.records[envelope.requestId] = envelope
    await mkdir(dirname(this.filePath), { recursive: true })
    await writeFile(this.filePath, JSON.stringify(this.state, null, 2))
    return { inserted: true, envelope }
  }

  get(requestId) {
    return this.state.records[requestId] ?? null
  }
}

export { ResultConflictError, ResultStore }
