#!/usr/bin/env bun
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

type ProfileName = 'next' | 'vite-react-ts' | 'react-router-framework'
type SectionConfig = {
  title: string
  key: string
  aliases: string[]
  lookupTitles?: string[]
  resourcePath?: string
}
type RenderedLine = {
  line: string
  sectionKey: string
}

const args = process.argv.slice(2)
const focus = args.join(' ').trim().toLowerCase()
const tokens = focus.length > 0 ? focus.split(/\s+/).filter(Boolean) : []
const agentsPath = resolve(process.cwd(), 'AGENTS.md')
const resourcesGuidePath = fileURLToPath(new URL('../resources/guide.md', import.meta.url))
const i18nGuidePath = fileURLToPath(new URL('../resources/i18n.md', import.meta.url))
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
const i18nGuideLines = readFileSync(i18nGuidePath, 'utf8').split('\n')

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

const readWholeDocumentBody = (documentLines: string[]): string => {
  const firstSectionIndex = documentLines.findIndex((line) => line.startsWith('## '))
  const contentLines = firstSectionIndex >= 0 ? documentLines.slice(firstSectionIndex) : documentLines
  return contentLines.join('\n').trim()
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

const sections: SectionConfig[] = [
  { title: 'Code Style Guide', key: 'style', aliases: ['style', 'code-style'] },
  { title: 'Navigation and Screen Rules', key: 'route', aliases: ['route', 'routes', 'navigation'], lookupTitles: ['Navigation and Screen Rules', 'Routing Rules'] },
  { title: 'Testing Rules', key: 'test', aliases: ['test', 'tests', 'testing'] },
  { title: 'State and Data Rules', key: 'state', aliases: ['state', 'data'] },
  { title: 'Implementation Patterns', key: 'patterns', aliases: ['patterns', 'pattern'] },
  { title: 'Anti-Patterns', key: 'anti', aliases: ['anti', 'antipatterns'] },
  { title: 'Verification Cadence', key: 'verify', aliases: ['verify', 'verification', 'review'] },
  { title: 'I18n Rules', key: 'i18n', aliases: ['i18n', 'lingui', 'translation'], resourcePath: i18nGuidePath },
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
  'setup',
  'build',
  'create',
  'ปรับ',
  'แก้',
  'รีแฟคเตอร์',
  'ทำ',
  'วาง',
  'ช่วย',
]

const sectionAliasToKey = new Map<string, string>()
for (const section of sections) {
  sectionAliasToKey.set(normalizeText(section.key), section.key)
  for (const alias of section.aliases) {
    sectionAliasToKey.set(normalizeText(alias), section.key)
  }
}

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

const buildFocusTokens = (query: string): { direct: Set<string>, expanded: Set<string>, sectionKeys: Set<string> } => {
  const raw = tokenize(query).filter((token) => !FOCUS_STOPWORDS.has(token))
  const direct = new Set<string>()
  const expanded = new Set<string>()
  const sectionKeys = new Set<string>()

  for (const token of raw) {
    const sectionKey = sectionAliasToKey.get(token)
    if (sectionKey) {
      sectionKeys.add(sectionKey)
    }

    direct.add(token)
    expanded.add(token)

    const aliases = FOCUS_ALIASES[token] ?? []
    for (const alias of aliases) {
      expanded.add(alias)
    }
  }

  return { direct, expanded, sectionKeys }
}

const scoreLine = (entry: RenderedLine, focusTokens: { direct: Set<string>, expanded: Set<string>, sectionKeys: Set<string> }): number => {
  if (focusTokens.expanded.size === 0 && focusTokens.sectionKeys.size === 0) {
    return 0
  }

  const normalizedLine = normalizeText(entry.line)
  if (!normalizedLine) {
    return 0
  }

  let score = 0
  if (focusTokens.sectionKeys.has(entry.sectionKey)) {
    score += 5
  }

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

const resolveSectionContent = (section: SectionConfig): { content: string, sourceLabel: string } => {
  if (section.resourcePath === i18nGuidePath) {
    return {
      content: readWholeDocumentBody(i18nGuideLines),
      sourceLabel: 'resources/i18n.md',
    }
  }

  const titles = section.lookupTitles ?? [section.title]
  const readFromLines = (sectionLines: string[]): string =>
    titles.length > 1 ? readFirstSection(sectionLines, titles) : readSection(sectionLines, titles[0])

  const primaryContent = readFromLines(lines)
  if (primaryContent !== '(not found)' && primaryContent !== '(empty)') {
    return {
      content: primaryContent,
      sourceLabel: sourcePath.endsWith('AGENTS.md') ? 'AGENTS.md' : 'resources/guide.md',
    }
  }

  return {
    content: readFromLines(fallbackGuideLines),
    sourceLabel: 'resources/guide.md',
  }
}

console.log('# Mahiro Frontend Doctrine')
console.log('')
console.log(`Primary source: ${sourcePath.endsWith('AGENTS.md') ? 'AGENTS.md' : 'resources/guide.md'}`)
console.log('Doctrine mode: personal frontend judgment, not strict lint output')
console.log('')

if (selectedProfile) {
  console.log('## Stack Profile')
  console.log(`- Selected: ${selectedProfile} (${profileMode})`)
  console.log('')
}

const profileLines = selectedProfile ? loadProfileLines(selectedProfile) : []
const renderedLines: RenderedLine[] = []

for (const section of sections) {
  console.log(`## ${section.title}`)
  const resolved = resolveSectionContent(section)
  console.log(`Source: ${resolved.sourceLabel}`)
  console.log('')
  console.log(resolved.content)
  renderedLines.push(...resolved.content.split('\n').map((line) => ({ line, sectionKey: section.key })))

  if (profileLines.length > 0) {
    const profileSection = section.lookupTitles
      ? readFirstSection(profileLines, section.lookupTitles)
      : readSection(profileLines, section.title)

    if (profileSection !== '(not found)' && profileSection !== '(empty)') {
      console.log('')
      console.log(`### Stack Additions (${selectedProfile})`)
      console.log(profileSection)
      renderedLines.push(...profileSection.split('\n').map((line) => ({ line, sectionKey: section.key })))
    }
  }
  console.log('')
}

if (focus.length > 0) {
  const focusTokens = buildFocusTokens(focus)
  const scored = renderedLines
    .map((entry, index) => ({
      line: entry.line.trim().replace(/^[-*]\s+/, ''),
      score: scoreLine(entry, focusTokens),
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
    console.log('- No direct doctrine lines matched')
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
    console.log('## AI Handoff')
    console.log('- Interpreted mode: doctrine-guided implementation intent')
    if (fileTargets.length > 0) {
      console.log(`- File targets: ${fileTargets.join(', ')}`)
    }

    const hintLines = summarizeFocusHints(uniqueFocused)
    if (hintLines.length > 0) {
      console.log('- Relevant doctrine to keep while implementing:')
      for (const hint of hintLines) {
        console.log(`  - ${hint}`)
      }
    }

    console.log('- Suggested handoff prompt:')
    console.log(
      `  Implement this request in Mahiro frontend style: "${focus}". Keep route orchestration clean, preserve token-first semantic classes, respect service/provider boundaries, and use verify as a review lens before calling it done.`
    )
  }
}
