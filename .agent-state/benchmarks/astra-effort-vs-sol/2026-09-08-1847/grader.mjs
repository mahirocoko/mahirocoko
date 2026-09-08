import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const tasks = ['easy', 'medium', 'hard']
const candidates = ['candidate-a', 'candidate-b', 'candidate-c', 'candidate-d']

const listFiles = async (directory) => {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) result.push(...await listFiles(path))
    else result.push(path)
  }
  return result.sort()
}

const digest = async (path) => createHash('sha256').update(await readFile(path)).digest('hex')

const runTests = (workspace, args, env = {}) => {
  const result = spawnSync(process.execPath, args, {
    cwd: workspace,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    timeout: 120000,
  })
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  const count = (name) => {
    const matches = [...output.matchAll(new RegExp(`^# ${name} (\\d+)$`, 'gm'))]
    return Number(matches.at(-1)?.[1] ?? 0)
  }
  const tests = count('tests')
  const pass = count('pass')
  const fail = count('fail')
  const validSummary = Number.isInteger(tests) && Number.isInteger(pass) && Number.isInteger(fail)
    && tests >= 0 && pass >= 0 && fail >= 0 && pass <= tests && fail <= tests && pass + fail <= tests
  return {
    exitCode: result.status,
    tests: validSummary ? tests : 0,
    pass: validSummary ? pass : 0,
    fail: validSummary ? fail : 0,
    output,
  }
}

const integrityCheck = async (task, workspace) => {
  const fixture = join(root, 'fixtures', task)
  const protectedPaths = ['package.json', ...(await listFiles(join(fixture, 'test'))).map((path) => relative(fixture, path))]
  const protectedUnchanged = (await Promise.all(protectedPaths.map(async (path) => {
    try {
      return await digest(join(fixture, path)) === await digest(join(workspace, path))
    } catch {
      return false
    }
  }))).every(Boolean)

  const allowedSource = task === 'hard'
    ? (path) => path.startsWith('src/')
    : (path) => path === (task === 'easy' ? 'src/clip-utf8.js' : 'src/persistent-lease-queue.js')
  const workspaceFiles = (await listFiles(workspace)).map((path) => relative(workspace, path))
  const extraFiles = workspaceFiles.filter((path) => !protectedPaths.includes(path) && !allowedSource(path))
  return { passed: protectedUnchanged && extraFiles.length === 0, protectedUnchanged, extraFiles }
}

const grades = {}
for (const task of tasks) {
  grades[task] = {}
  for (const candidate of candidates) {
    const candidateDir = join(root, 'runs', task, candidate)
    const workspace = join(candidateDir, 'workspace')
    try {
      await stat(workspace)
    } catch {
      grades[task][candidate] = { missing: true, score: 0 }
      continue
    }

    const publicFiles = (await listFiles(join(workspace, 'test'))).filter((path) => path.endsWith('.test.js'))
    const publicResult = runTests(workspace, ['--test', '--test-reporter=tap', ...publicFiles])
    const hiddenResult = runTests(workspace, ['--test', '--test-reporter=tap', join(root, 'hidden', `${task}.hidden.test.mjs`)], { SOLUTION_ROOT: workspace })
    const integrity = await integrityCheck(task, workspace)
    const publicRatio = publicResult.tests ? Math.min(1, publicResult.pass / publicResult.tests) : 0
    const hiddenRatio = hiddenResult.tests ? Math.min(1, hiddenResult.pass / hiddenResult.tests) : 0
    const score = Number((publicRatio * 20 + hiddenRatio * 70 + (integrity.passed ? 10 : 0)).toFixed(2))
    grades[task][candidate] = {
      score,
      public: { exitCode: publicResult.exitCode, tests: publicResult.tests, pass: publicResult.pass, fail: publicResult.fail },
      hidden: { exitCode: hiddenResult.exitCode, tests: hiddenResult.tests, pass: hiddenResult.pass, fail: hiddenResult.fail },
      integrity,
    }
    await writeFile(join(candidateDir, 'public-test.tap'), publicResult.output)
    await writeFile(join(candidateDir, 'hidden-test.tap'), hiddenResult.output)
  }
}

await writeFile(join(root, 'blind-grades.json'), `${JSON.stringify(grades, null, 2)}\n`)
console.log(JSON.stringify(grades, null, 2))
