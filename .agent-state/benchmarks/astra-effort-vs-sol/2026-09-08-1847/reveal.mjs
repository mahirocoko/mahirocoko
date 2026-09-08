import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
let mapping
try {
  mapping = JSON.parse(await readFile(join(root, 'private/interactive-manifest.json'), 'utf8')).mapping
} catch {
  mapping = JSON.parse(await readFile(join(root, 'private/config-map.json'), 'utf8'))
}
const grades = JSON.parse(await readFile(join(root, 'blind-grades.json'), 'utf8'))
const tasks = ['easy', 'medium', 'hard']
const taskWeights = { easy: 0.2, medium: 0.3, hard: 0.5 }
const rows = []

for (const [candidate, config] of Object.entries(mapping)) {
  const taskResults = {}
  let weightedScore = 0
  let elapsedTotal = 0
  const usage = { context_used_tokens_approx: 0 }
  for (const task of tasks) {
    const run = JSON.parse(await readFile(join(root, 'runs', task, candidate, 'run.json'), 'utf8'))
    const grade = grades[task][candidate]
    taskResults[task] = { score: grade.score, elapsedMs: run.elapsedMs, usage: run.usage, exitCode: run.exitCode }
    weightedScore += grade.score * taskWeights[task]
    elapsedTotal += run.elapsedMs
    for (const key of Object.keys(usage)) usage[key] += Number(run.usage?.[key] ?? 0)
  }
  rows.push({
    candidate,
    model: config.model,
    effort: config.effort,
    weightedScore: Number(weightedScore.toFixed(2)),
    elapsedTotalMs: elapsedTotal,
    usage,
    tasks: taskResults,
  })
}

rows.sort((left, right) => right.weightedScore - left.weightedScore || left.elapsedTotalMs - right.elapsedTotalMs)
await writeFile(join(root, 'revealed-results.json'), `${JSON.stringify(rows, null, 2)}\n`)
console.log(JSON.stringify(rows, null, 2))
