#!/usr/bin/env bun
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const focus = process.argv.slice(2).join(' ').trim().toLowerCase()
const agentsPath = resolve(process.cwd(), 'AGENTS.md')
const resourcesGuidePath = fileURLToPath(new URL('../resources/guide.md', import.meta.url))

const sourcePath = existsSync(agentsPath)
  ? agentsPath
  : existsSync(resourcesGuidePath)
    ? resourcesGuidePath
    : ''

if (!sourcePath) {
  console.log('Neither AGENTS.md nor resources/guide.md was found.')
  process.exit(1)
}

const text = readFileSync(sourcePath, 'utf8')
const lines = text.split('\n')

const readSection = (title: string): string => {
  const marker = `## ${title}`
  const start = lines.findIndex((line) => line.trim() === marker)
  if (start < 0) {
    return '(not found)'
  }

  const chunk: string[] = []
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (line.startsWith('## ')) {
      break
    }
    chunk.push(line)
  }

  const output = chunk.join('\n').trim()
  return output || '(empty)'
}

const readFirstSection = (titles: string[]): string => {
  for (const title of titles) {
    const content = readSection(title)
    if (content !== '(not found)') {
      return content
    }
  }
  return '(not found)'
}

const sections = [
  'Code Style Guide',
  'Navigation and Screen Rules',
  'Testing Rules',
  'State and Data Rules',
  'Implementation Patterns',
  'Anti-Patterns',
]

console.log('# Frontend Guide')
console.log('')
console.log(
  `Source: ${
    sourcePath.endsWith('AGENTS.md')
      ? 'AGENTS.md'
      : 'resources/guide.md'
  }`,
)
console.log('')
for (const section of sections) {
  console.log(`## ${section}`)
  if (section === 'Navigation and Screen Rules') {
    console.log(readFirstSection(['Navigation and Screen Rules', 'Routing Rules']))
  } else {
    console.log(readSection(section))
  }
  console.log('')
}

if (focus.length > 0) {
  const escaped = focus.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const matcher = new RegExp(escaped, 'i')
  const focused = lines.filter((line) => matcher.test(line)).slice(0, 25)

  console.log(`## Focus: ${focus}`)
  if (focused.length === 0) {
    console.log('- No matching lines found')
  } else {
    for (const line of focused) {
      console.log(`- ${line.trim()}`)
    }
  }
}
