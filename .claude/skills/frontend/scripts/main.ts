#!/usr/bin/env bun
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

type ProfileName = 'next' | 'vite-react-ts' | 'react-router-framework'

const args = process.argv.slice(2)
const focus = args.join(' ').trim().toLowerCase()
const tokens = focus.length > 0 ? focus.split(/\s+/).filter(Boolean) : []
const agentsPath = resolve(process.cwd(), 'AGENTS.md')
const resourcesGuidePath = fileURLToPath(new URL('../resources/guide.md', import.meta.url))
const packageJsonPath = resolve(process.cwd(), 'package.json')

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
const fallbackGuideLines = readFileSync(resourcesGuidePath, 'utf8').split('\n')

const readSection = (sectionLines: string[], title: string): string => {
  const marker = `## ${title}`
  const start = sectionLines.findIndex((line) => line.trim() === marker)
  if (start < 0) {
    return '(not found)'
  }

  const chunk: string[] = []
  for (let i = start + 1; i < sectionLines.length; i += 1) {
    const line = sectionLines[i]
    if (line.startsWith('## ')) {
      break
    }
    chunk.push(line)
  }

  const output = chunk.join('\n').trim()
  return output || '(empty)'
}

const readFirstSection = (sectionLines: string[], titles: string[]): string => {
  for (const title of titles) {
    const content = readSection(sectionLines, title)
    if (content !== '(not found)') {
      return content
    }
  }
  return '(not found)'
}

const fileExists = (relativePath: string): boolean => existsSync(resolve(process.cwd(), relativePath))

const hasDependency = (packageJson: Record<string, unknown>, dependency: string): boolean => {
  const dependencies = (packageJson.dependencies as Record<string, string> | undefined) ?? {}
  const devDependencies = (packageJson.devDependencies as Record<string, string> | undefined) ?? {}
  return dependency in dependencies || dependency in devDependencies
}

const readPackageJson = (): Record<string, unknown> => {
  if (!existsSync(packageJsonPath)) {
    return {}
  }

  try {
    return JSON.parse(readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>
  } catch {
    return {}
  }
}

const resolveExplicitProfile = (parts: string[]): ProfileName | '' => {
  if (parts.includes('next')) {
    return 'next'
  }

  if (
    parts.includes('rr') ||
    parts.includes('react-router') ||
    parts.includes('react-router-framework') ||
    parts.includes('reactrouter')
  ) {
    return 'react-router-framework'
  }

  if (parts.includes('vite') || parts.includes('vite-react-ts') || parts.includes('react-ts')) {
    return 'vite-react-ts'
  }

  return ''
}

const detectAutoProfile = (): ProfileName | '' => {
  const packageJson = readPackageJson()
  const scripts = (packageJson.scripts as Record<string, string> | undefined) ?? {}

  const hasNextConfig =
    fileExists('next.config.js') ||
    fileExists('next.config.mjs') ||
    fileExists('next.config.ts') ||
    fileExists('next.config.cjs')
  if (hasNextConfig || hasDependency(packageJson, 'next')) {
    return 'next'
  }

  const hasReactRouterConfig =
    fileExists('react-router.config.ts') ||
    fileExists('react-router.config.js') ||
    fileExists('react-router.config.mjs') ||
    fileExists('react-router.config.cjs')
  const hasReactRouterScript = Object.values(scripts).some((value) => value.includes('react-router '))
  if (hasReactRouterConfig || hasReactRouterScript || hasDependency(packageJson, '@react-router/dev')) {
    return 'react-router-framework'
  }

  const hasViteConfig =
    fileExists('vite.config.ts') || fileExists('vite.config.js') || fileExists('vite.config.mjs') || fileExists('vite.config.cjs')
  if (hasViteConfig && hasDependency(packageJson, 'vite') && hasDependency(packageJson, 'react')) {
    return 'vite-react-ts'
  }

  return ''
}

const selectedProfile = resolveExplicitProfile(tokens) || detectAutoProfile()
const profileMode = resolveExplicitProfile(tokens) ? 'forced' : selectedProfile ? 'auto-detected' : 'none'

const loadProfileLines = (profile: ProfileName): string[] => {
  const profilePath = fileURLToPath(new URL(`../resources/profiles/${profile}.md`, import.meta.url))
  if (!existsSync(profilePath)) {
    return []
  }
  return readFileSync(profilePath, 'utf8').split('\n')
}

const sections = [
  'Code Style Guide',
  'Navigation and Screen Rules',
  'Testing Rules',
  'State and Data Rules',
  'Implementation Patterns',
  'Anti-Patterns',
]

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\.tsx\b|\.ts\b|\.jsx\b|\.js\b/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

const tokenize = (value: string): string[] =>
  normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length > 1)

const FOCUS_STOPWORDS = new Set([
  'frontend',
  'guide',
  'focus',
  'style',
  'patterns',
  'pattern',
  'route',
  'routes',
  'navigation',
  'state',
  'data',
  'test',
  'tests',
  'verify',
  'anti',
  'next',
  'vite',
  'rr',
])

const FOCUS_ALIASES: Record<string, string[]> = {
  label: ['field', 'input', 'checkbox', 'description'],
  field: ['label', 'input', 'checkbox', 'textarea', 'description'],
  input: ['field', 'label', 'form', 'control'],
  checkbox: ['field', 'label', 'control', 'size', 'scale'],
  button: ['input', 'checkbox', 'scale', 'height', 'control'],
  form: ['field', 'label', 'input', 'checkbox', 'control'],
}

const NATURAL_ACTION_KEYWORDS = [
  'refactor',
  'fix',
  'update',
  'implement',
  'rewrite',
  'align',
  'clean',
  'improve',
  'ปรับ',
  'แก้',
  'รีแฟคเตอร์',
]

const extractFileTargets = (query: string): string[] => {
  const matches = query.match(/[a-z0-9._-]+\.(tsx|ts|jsx|js)\b/gi) ?? []
  return [...new Set(matches.map((item) => item.toLowerCase()))]
}

const hasNaturalActionIntent = (query: string): boolean => {
  const normalized = normalizeText(query)
  return NATURAL_ACTION_KEYWORDS.some((keyword) => normalized.includes(keyword))
}

const summarizeFocusHints = (hints: string[]): string[] => {
  return hints
    .filter((line) => line.length > 0)
    .slice(0, 5)
    .map((line) => line.replace(/^[-*]\s+/, ''))
}

const buildFocusTokens = (query: string): { direct: Set<string>, expanded: Set<string> } => {
  const raw = tokenize(query).filter((token) => !FOCUS_STOPWORDS.has(token))
  const direct = new Set<string>()
  const expanded = new Set<string>()

  for (const token of raw) {
    direct.add(token)
    expanded.add(token)
    const aliases = FOCUS_ALIASES[token] ?? []
    for (const alias of aliases) {
      expanded.add(alias)
    }
  }

  return { direct, expanded }
}

const scoreLine = (line: string, focusTokens: { direct: Set<string>, expanded: Set<string> }): number => {
  if (focusTokens.expanded.size === 0) {
    return 0
  }

  const normalizedLine = normalizeText(line)
  if (!normalizedLine) {
    return 0
  }

  let score = 0
  for (const token of focusTokens.direct) {
    if (normalizedLine.includes(token)) {
      score += 4
    }
  }

  for (const token of focusTokens.expanded) {
    if (focusTokens.direct.has(token)) {
      continue
    }
    if (normalizedLine.includes(token)) {
      score += 1
    }
  }

  if (normalizedLine.startsWith('```') || normalizedLine.includes('{') || normalizedLine.includes('}')) {
    score -= 1
  }

  return score
}

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

if (selectedProfile) {
  console.log('## Stack Profile')
  console.log(`- Selected: ${selectedProfile} (${profileMode})`)
  console.log('')
}

const profileLines = selectedProfile ? loadProfileLines(selectedProfile) : []
const isPrimaryAgents = sourcePath.endsWith('AGENTS.md')
const renderedLines: string[] = []

for (const section of sections) {
  console.log(`## ${section}`)
  let coreSection = '(not found)'

  if (section === 'Navigation and Screen Rules') {
    coreSection = readFirstSection(lines, ['Navigation and Screen Rules', 'Routing Rules'])
    if ((coreSection === '(not found)' || coreSection === '(empty)') && isPrimaryAgents) {
      coreSection = readFirstSection(fallbackGuideLines, ['Navigation and Screen Rules', 'Routing Rules'])
    }
  } else {
    coreSection = readSection(lines, section)
    if ((coreSection === '(not found)' || coreSection === '(empty)') && isPrimaryAgents) {
      coreSection = readSection(fallbackGuideLines, section)
    }
  }

  console.log(coreSection)
  renderedLines.push(...coreSection.split('\n'))

  if (profileLines.length > 0) {
    const profileSection = section === 'Navigation and Screen Rules'
      ? readFirstSection(profileLines, ['Navigation and Screen Rules', 'Routing Rules'])
      : readSection(profileLines, section)

    if (profileSection !== '(not found)' && profileSection !== '(empty)') {
      console.log('')
      console.log(`### Stack Additions (${selectedProfile})`)
      console.log(profileSection)
      renderedLines.push(...profileSection.split('\n'))
    }
  }
  console.log('')
}

if (focus.length > 0) {
  const focusTokens = buildFocusTokens(focus)
  const scored = renderedLines
    .map((line, index) => ({
      line: line.trim().replace(/^[-*]\s+/, ''),
      score: scoreLine(line, focusTokens),
      index,
    }))
    .filter((entry) => entry.line.length > 0 && entry.score >= 2)
    .sort((a, b) => b.score - a.score || a.index - b.index)

  const uniqueFocused: string[] = []
  for (const entry of scored) {
    if (!uniqueFocused.includes(entry.line)) {
      uniqueFocused.push(entry.line)
    }
    if (uniqueFocused.length >= 25) {
      break
    }
  }

  console.log(`## Focus: ${focus}`)
  if (uniqueFocused.length === 0) {
    console.log('- No matching lines found')
  } else {
    for (const line of uniqueFocused) {
      console.log(`- ${line}`)
    }
  }

  const fileTargets = extractFileTargets(focus)
  const naturalIntent = hasNaturalActionIntent(focus)
  const shouldFallback = naturalIntent || uniqueFocused.length < 3 || fileTargets.length > 0

  if (shouldFallback) {
    console.log('')
    console.log('## AI Fallback')
    console.log('- Interpreted mode: natural-language implementation intent')
    if (fileTargets.length > 0) {
      console.log(`- File targets: ${fileTargets.join(', ')}`)
    }

    const hintLines = summarizeFocusHints(uniqueFocused)
    if (hintLines.length > 0) {
      console.log('- Relevant guidance to keep while implementing:')
      for (const hint of hintLines) {
        console.log(`  - ${hint}`)
      }
    }

    console.log('- Suggested handoff prompt:')
    console.log(
      `  Refactor/implement based on this request: "${focus}". Follow project-local snippets/templates first, preserve token-first semantic classes, and verify with lint/typecheck/test/build.`
    )
  }
}
