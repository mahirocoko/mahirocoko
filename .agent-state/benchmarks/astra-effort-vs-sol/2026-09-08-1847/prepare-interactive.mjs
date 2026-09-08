import { randomInt } from 'node:crypto'
import { chmod, cp, mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const privateDir = join(root, 'private')
const manifestPath = join(privateDir, 'interactive-manifest.json')
const candidates = ['candidate-a', 'candidate-b', 'candidate-c', 'candidate-d']
const tasks = ['easy', 'medium', 'hard']
const configurations = [
  { model: 'gpt-6-astra', effort: 'low' },
  { model: 'gpt-6-astra', effort: 'medium' },
  { model: 'gpt-6-astra', effort: 'high' },
  { model: 'gpt-5.6-sol', effort: 'high' },
]

const shuffle = (values) => {
  const result = [...values]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1)
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

try {
  const existing = JSON.parse(await readFile(manifestPath, 'utf8'))
  await stat(existing.tempRoot)
  console.log(JSON.stringify(existing, null, 2))
  process.exit(0)
} catch {}

await mkdir(privateDir, { recursive: true })
const tempRoot = await mkdtemp(join(tmpdir(), 'astra-effort-direct-'))
const shuffled = shuffle(configurations)
const mapping = Object.fromEntries(candidates.map((candidate, index) => [candidate, shuffled[index]]))

for (const task of tasks) {
  for (const candidate of candidates) {
    await cp(join(root, 'fixtures', task), join(tempRoot, task, candidate), { recursive: true })
  }
}

const manifest = {
  createdAt: new Date().toISOString(),
  tempRoot,
  mapping,
  tasks,
  candidates,
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 })
await chmod(manifestPath, 0o600)
console.log(JSON.stringify(manifest, null, 2))
