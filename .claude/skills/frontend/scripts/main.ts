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

  if (profileLines.length > 0) {
    const profileSection = section === 'Navigation and Screen Rules'
      ? readFirstSection(profileLines, ['Navigation and Screen Rules', 'Routing Rules'])
      : readSection(profileLines, section)

    if (profileSection !== '(not found)' && profileSection !== '(empty)') {
      console.log('')
      console.log(`### Stack Additions (${selectedProfile})`)
      console.log(profileSection)
    }
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
