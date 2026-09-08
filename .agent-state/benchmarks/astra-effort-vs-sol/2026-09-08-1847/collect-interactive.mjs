import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const task = process.argv[2]
if (!['easy', 'medium', 'hard'].includes(task)) throw new Error(`Unknown task: ${task}`)

const manifest = JSON.parse(await readFile(join(root, 'private/interactive-manifest.json'), 'utf8'))
const timingPath = join(root, 'private', `${task}-timings.json`)
const timings = JSON.parse(await readFile(timingPath, 'utf8'))

for (const candidate of manifest.candidates) {
  const candidateDir = join(root, 'runs', task, candidate)
  await rm(candidateDir, { recursive: true, force: true })
  await mkdir(candidateDir, { recursive: true })
  await cp(join(manifest.tempRoot, task, candidate), join(candidateDir, 'workspace'), { recursive: true })
  const timing = timings[candidate]
  await writeFile(join(candidateDir, 'run.json'), `${JSON.stringify({
    task,
    candidate,
    startedAt: timing.startedAt,
    endedAt: timing.endedAt,
    elapsedMs: timing.elapsedMs,
    exitCode: timing.status === 'completed' ? 0 : 1,
    usage: timing.usage ?? null,
    execution: 'herdr-interactive-codex',
  }, null, 2)}\n`)
}
