#!/usr/bin/env bun

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs"
import { isAbsolute, join, relative, resolve } from "node:path"

type PromptLibrary = {
  directionSystemPrompts: Record<string, string>
  generalSystemPrompts: Record<string, string>
  generalSystemPrompt: string
}

type SkillPromptEntry = {
  id: string
  label: string
  description: string
  prompt_lines: string[]
  tags: string[]
}

type AssetPaths = {
  repoRoot: string
  designPromptsPath: string
  designSkillPromptsPath: string
}

type LoadedAssets = {
  promptLibrary: PromptLibrary
  skillPromptEntries: SkillPromptEntry[]
}

type ComposeOptions = {
  generalKey: string
  directionKeys: string[]
  promptIds: string[]
  handoffPath: string | null
}

type SearchMatch = {
  kind: "general" | "direction" | "prompt"
  key: string
  title: string
  summary: string
  score: number
}

const DESIGN_PROMPTS_RELATIVE_PATH = join("docs", "design-prompts", "design-prompts.json")
const DESIGN_SKILL_PROMPTS_RELATIVE_PATH = join("docs", "design-prompts", "design-skill-prompts.json")
const LAB01_RELATIVE_PATH = join("apps", "design-prompts", "lab01")
const SKILL_REPO_ROOT = resolve(import.meta.dir, "..", "..", "..", "..")

function resolveRepoRoot(): string {
  return SKILL_REPO_ROOT
}

function getAssetPaths(repoRoot: string): AssetPaths {
  return {
    repoRoot,
    designPromptsPath: join(repoRoot, DESIGN_PROMPTS_RELATIVE_PATH),
    designSkillPromptsPath: join(repoRoot, DESIGN_SKILL_PROMPTS_RELATIVE_PATH),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false
  }

  return Object.values(value).every((entry) => typeof entry === "string")
}

function readJsonFile(path: string, label: string): unknown {
  if (!existsSync(path)) {
    throw new Error(`${label} not found at ${path}.`)
  }

  try {
    return JSON.parse(readFileSync(path, "utf8")) as unknown
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse ${label} at ${path}: ${message}`)
  }
}

function validatePromptLibrary(value: unknown, path: string): PromptLibrary {
  if (!isRecord(value)) {
    throw new Error(`Expected ${path} to contain a JSON object.`)
  }

  const directionSystemPrompts = value.directionSystemPrompts
  const generalSystemPrompts = value.generalSystemPrompts
  const generalSystemPrompt = value.generalSystemPrompt

  if (!isStringRecord(directionSystemPrompts)) {
    throw new Error(`Expected directionSystemPrompts in ${path} to be an object of string values.`)
  }

  if (!isStringRecord(generalSystemPrompts)) {
    throw new Error(`Expected generalSystemPrompts in ${path} to be an object of string values.`)
  }

  if (typeof generalSystemPrompt !== "string" || generalSystemPrompt.trim().length === 0) {
    throw new Error(`Expected generalSystemPrompt in ${path} to be a non-empty string.`)
  }

  return {
    directionSystemPrompts,
    generalSystemPrompts,
    generalSystemPrompt,
  }
}

function validateSkillPromptEntries(value: unknown, path: string): SkillPromptEntry[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected ${path} to contain a JSON array.`)
  }

  const seenIds = new Set<string>()

  return value.map((entry, index) => {
    if (!isRecord(entry)) {
      throw new Error(`Expected ${path}[${index}] to be an object.`)
    }

    const { id, label, description, prompt_lines: promptLines, tags } = entry

    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error(`Expected ${path}[${index}].id to be a non-empty string.`)
    }

    if (seenIds.has(id)) {
      throw new Error(`Duplicate prompt id '${id}' found in ${path}.`)
    }

    if (typeof label !== "string" || label.trim().length === 0) {
      throw new Error(`Expected ${path}[${index}].label to be a non-empty string.`)
    }

    if (typeof description !== "string" || description.trim().length === 0) {
      throw new Error(`Expected ${path}[${index}].description to be a non-empty string.`)
    }

    if (!Array.isArray(promptLines) || promptLines.length === 0 || !promptLines.every((line) => typeof line === "string")) {
      throw new Error(`Expected ${path}[${index}].prompt_lines to be a non-empty string array.`)
    }

    if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
      throw new Error(`Expected ${path}[${index}].tags to be a string array.`)
    }

    seenIds.add(id)

    return {
      id,
      label,
      description,
      prompt_lines: promptLines,
      tags,
    }
  })
}

function loadAssets(assetPaths: AssetPaths): LoadedAssets {
  const promptLibrary = validatePromptLibrary(
    readJsonFile(assetPaths.designPromptsPath, "design prompts"),
    assetPaths.designPromptsPath,
  )

  const skillPromptEntries = validateSkillPromptEntries(
    readJsonFile(assetPaths.designSkillPromptsPath, "design skill prompts"),
    assetPaths.designSkillPromptsPath,
  )

  return {
    promptLibrary,
    skillPromptEntries,
  }
}

function printHelp(): void {
  console.log(`frontend-design

Usage:
  bun .agents/skills/frontend-design/scripts/main.ts list
  bun .agents/skills/frontend-design/scripts/main.ts search <query>
  bun .agents/skills/frontend-design/scripts/main.ts compose --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>]

Composition order:
  1. generalSystemPrompt
  2. generalSystemPrompts.<key>
  3. directionSystemPrompts.<key> in CLI order
  4. design-skill-prompts entries in CLI order
  5. optional --handoff file content

Notes:
  - Reads only local prompt assets from docs/design-prompts
  - --handoff must resolve to a repo-local file
  - apps/design-prompts/lab01 is sandbox input only`)
}

function formatPromptEntry(entry: SkillPromptEntry): string {
  const tagSuffix = entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : ""
  return `- ${entry.id} — ${entry.label}${tagSuffix}`
}

function runList(assetPaths: AssetPaths, assets: LoadedAssets): void {
  const generalKeys = Object.keys(assets.promptLibrary.generalSystemPrompts).sort((left, right) => left.localeCompare(right))
  const directionKeys = Object.keys(assets.promptLibrary.directionSystemPrompts).sort((left, right) => left.localeCompare(right))
  const promptEntries = [...assets.skillPromptEntries].sort((left, right) => left.id.localeCompare(right.id))

  console.log("# frontend-design list")
  console.log("")
  console.log(`Repo root: ${assetPaths.repoRoot}`)
  console.log(`Assets: ${DESIGN_PROMPTS_RELATIVE_PATH}, ${DESIGN_SKILL_PROMPTS_RELATIVE_PATH}`)
  console.log("")
  console.log(`Shared baseline: generalSystemPrompt (${assets.promptLibrary.generalSystemPrompt.length} chars)`)
  console.log("")
  console.log(`## General prompts (${generalKeys.length})`)
  for (const key of generalKeys) {
    console.log(`- ${key}`)
  }
  console.log("")
  console.log(`## Direction prompts (${directionKeys.length})`)
  for (const key of directionKeys) {
    console.log(`- ${key}`)
  }
  console.log("")
  console.log(`## Reusable prompt entries (${promptEntries.length})`)
  for (const entry of promptEntries) {
    console.log(formatPromptEntry(entry))
  }
}

function scoreText(text: string, query: string): number {
  const normalized = text.toLowerCase()

  if (normalized === query) return 100
  if (normalized.startsWith(query)) return 65
  if (normalized.includes(query)) return 35

  return 0
}

function searchAssets(assets: LoadedAssets, query: string): SearchMatch[] {
  const generalMatches: SearchMatch[] = Object.entries(assets.promptLibrary.generalSystemPrompts)
    .map(([key, prompt]) => ({
      kind: "general" as const,
      key,
      title: key,
      summary: prompt.split("\n")[0]?.trim() ?? "",
      score: scoreText(key, query) + scoreText(prompt, query),
    }))
    .filter((entry) => entry.score > 0)

  const directionMatches: SearchMatch[] = Object.entries(assets.promptLibrary.directionSystemPrompts)
    .map(([key, prompt]) => ({
      kind: "direction" as const,
      key,
      title: key,
      summary: prompt,
      score: scoreText(key, query) + scoreText(prompt, query),
    }))
    .filter((entry) => entry.score > 0)

  const promptMatches: SearchMatch[] = assets.skillPromptEntries
    .map((entry) => {
      const searchableText = [
        entry.id,
        entry.label,
        entry.description,
        entry.tags.join(" "),
        entry.prompt_lines.join("\n"),
      ].join("\n")

      return {
        kind: "prompt" as const,
        key: entry.id,
        title: entry.label,
        summary: entry.description,
        score: scoreText(searchableText, query) + scoreText(entry.id, query) + scoreText(entry.label, query),
      }
    })
    .filter((entry) => entry.score > 0)

  return [...generalMatches, ...directionMatches, ...promptMatches].sort(
    (left, right) => right.score - left.score || left.key.localeCompare(right.key),
  )
}

function runSearch(assets: LoadedAssets, queryRaw: string | undefined): void {
  const query = queryRaw?.trim().toLowerCase()
  if (!query) {
    throw new Error("Missing search query. Usage: search <query>")
  }

  const results = searchAssets(assets, query)
  const generalResults = results.filter((entry) => entry.kind === "general")
  const directionResults = results.filter((entry) => entry.kind === "direction")
  const promptResults = results.filter((entry) => entry.kind === "prompt")

  console.log("# frontend-design search")
  console.log("")
  console.log(`Query: ${query}`)
  console.log(`Matches: ${results.length}`)
  console.log("")

  if (results.length === 0) {
    console.log("No matching prompt assets found.")
    return
  }

  console.log(`## General prompts (${generalResults.length})`)
  for (const entry of generalResults) {
    console.log(`- ${entry.key} — ${entry.summary}`)
  }
  console.log("")
  console.log(`## Direction prompts (${directionResults.length})`)
  for (const entry of directionResults) {
    console.log(`- ${entry.key} — ${entry.summary}`)
  }
  console.log("")
  console.log(`## Reusable prompt entries (${promptResults.length})`)
  for (const entry of promptResults) {
    console.log(`- ${entry.key} — ${entry.title}: ${entry.summary}`)
  }
}

function readRequiredOptionValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1]?.trim()

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}.`)
  }

  return value
}

function assertNoDuplicates(values: string[], label: string): void {
  const seen = new Set<string>()

  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`Duplicate ${label} '${value}' is not allowed.`)
    }

    seen.add(value)
  }
}

function parseComposeArgs(args: string[]): ComposeOptions {
  let generalKey: string | null = null
  const directionKeys: string[] = []
  const promptIds: string[] = []
  let handoffPath: string | null = null

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    switch (argument) {
      case "--general": {
        if (generalKey !== null) {
          throw new Error("Duplicate --general flag is not allowed.")
        }

        generalKey = readRequiredOptionValue(args, index, "--general")
        index += 1
        break
      }

      case "--direction": {
        directionKeys.push(readRequiredOptionValue(args, index, "--direction"))
        index += 1
        break
      }

      case "--prompt": {
        promptIds.push(readRequiredOptionValue(args, index, "--prompt"))
        index += 1
        break
      }

      case "--handoff": {
        if (handoffPath !== null) {
          throw new Error("Duplicate --handoff flag is not allowed.")
        }

        handoffPath = readRequiredOptionValue(args, index, "--handoff")
        index += 1
        break
      }

      default:
        throw new Error(`Unsupported compose argument '${argument}'.`)
    }
  }

  if (generalKey === null) {
    throw new Error("Missing required --general <key> for compose.")
  }

  assertNoDuplicates(directionKeys, "direction key")
  assertNoDuplicates(promptIds, "prompt id")

  return {
    generalKey,
    directionKeys,
    promptIds,
    handoffPath,
  }
}

function isRepoLocalPath(repoRoot: string, candidatePath: string): boolean {
  const relativePath = relative(repoRoot, candidatePath)
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath))
}

function resolveRepoLocalFilePath(repoRoot: string, inputPath: string): { absolutePath: string; repoRelativePath: string; sandboxOnly: boolean } {
  const candidatePaths = isAbsolute(inputPath)
    ? [inputPath]
    : Array.from(new Set([resolve(process.cwd(), inputPath), resolve(repoRoot, inputPath)]))

  let foundOutsideRepo = false
  let foundNonFilePath = false

  const matchedPath = candidatePaths.find((candidatePath) => {
    if (!existsSync(candidatePath)) {
      return false
    }

    const realPath = realpathSync(candidatePath)
    if (!isRepoLocalPath(repoRoot, realPath)) {
      foundOutsideRepo = true
      return false
    }

    const stats = statSync(realPath)
    if (!stats.isFile()) {
      foundNonFilePath = true
      return false
    }

    return true
  })

  if (!matchedPath) {
    if (foundOutsideRepo) {
      throw new Error(`Handoff path must stay inside the repo: ${inputPath}`)
    }

    if (foundNonFilePath) {
      throw new Error(`Handoff path must be a file: ${inputPath}`)
    }

    throw new Error(`Handoff file not found: ${inputPath}`)
  }

  const realPath = realpathSync(matchedPath)

  const repoRelativePath = relative(repoRoot, realPath)
  const sandboxOnly = repoRelativePath === LAB01_RELATIVE_PATH || repoRelativePath.startsWith(`${LAB01_RELATIVE_PATH}/`)

  return {
    absolutePath: realPath,
    repoRelativePath,
    sandboxOnly,
  }
}

function resolvePromptEntryMap(entries: SkillPromptEntry[]): Map<string, SkillPromptEntry> {
  return new Map(entries.map((entry) => [entry.id, entry]))
}

function formatSection(title: string, body: string): string {
  return [`## ${title}`, "", body.trim()].join("\n")
}

function runCompose(assetPaths: AssetPaths, assets: LoadedAssets, options: ComposeOptions): void {
  const generalPrompt = assets.promptLibrary.generalSystemPrompts[options.generalKey]
  if (!generalPrompt) {
    throw new Error(`Unknown general key '${options.generalKey}'. Run 'list' to inspect available keys.`)
  }

  const directionSections = options.directionKeys.map((key) => {
    const prompt = assets.promptLibrary.directionSystemPrompts[key]
    if (!prompt) {
      throw new Error(`Unknown direction key '${key}'. Run 'list' to inspect available keys.`)
    }

    return formatSection(`direction: ${key}`, prompt)
  })

  const promptEntryMap = resolvePromptEntryMap(assets.skillPromptEntries)
  const promptSections = options.promptIds.map((id) => {
    const entry = promptEntryMap.get(id)
    if (!entry) {
      throw new Error(`Unknown prompt id '${id}'. Run 'list' to inspect available ids.`)
    }

    return formatSection(`prompt: ${id} (${entry.label})`, entry.prompt_lines.join("\n"))
  })

  const handoff = options.handoffPath
    ? resolveRepoLocalFilePath(assetPaths.repoRoot, options.handoffPath)
    : null

  const handoffSection = handoff
    ? (() => {
        const fileContent = readFileSync(handoff.absolutePath, "utf8").trim()
        const lines = handoff.sandboxOnly
          ? [
              `Sandbox note: ${handoff.repoRelativePath} is experimental input only and is not validated prompt canon.`,
              "",
              fileContent,
            ]
          : [fileContent]

        return formatSection(`handoff: ${handoff.repoRelativePath}`, lines.join("\n"))
      })()
    : null

  const orderLines = [
    "1. shared baseline: generalSystemPrompt",
    `2. general: ${options.generalKey}`,
    ...options.directionKeys.map((key, index) => `${index + 3}. direction: ${key}`),
    ...options.promptIds.map((id, index) => `${index + 3 + options.directionKeys.length}. prompt: ${id}`),
  ]

  if (handoffSection) {
    orderLines.push(`${orderLines.length + 1}. handoff: ${handoff?.repoRelativePath}`)
  }

  const sections = [
    formatSection("shared baseline", assets.promptLibrary.generalSystemPrompt),
    formatSection(`general: ${options.generalKey}`, generalPrompt),
    ...directionSections,
    ...promptSections,
  ]

  if (handoffSection) {
    sections.push(handoffSection)
  }

  console.log("# frontend-design compose")
  console.log("")
  console.log(`Repo root: ${assetPaths.repoRoot}`)
  console.log(`Assets: ${DESIGN_PROMPTS_RELATIVE_PATH}, ${DESIGN_SKILL_PROMPTS_RELATIVE_PATH}`)
  console.log("")
  console.log("## Composition order")
  for (const line of orderLines) {
    console.log(line)
  }
  console.log("")
  console.log(sections.join("\n\n"))
}

function main(): void {
  const [command, ...rest] = process.argv.slice(2)
  const repoRoot = resolveRepoRoot()
  const assetPaths = getAssetPaths(repoRoot)

  switch (command) {
    case undefined:
    case "help":
    case "--help":
    case "-h":
      printHelp()
      return

    case "list": {
      if (rest.length > 0) {
        throw new Error("The list command does not accept additional arguments.")
      }

      runList(assetPaths, loadAssets(assetPaths))
      return
    }

    case "search": {
      runSearch(loadAssets(assetPaths), rest.join(" "))
      return
    }

    case "compose": {
      const assets = loadAssets(assetPaths)
      const options = parseComposeArgs(rest)
      runCompose(assetPaths, assets, options)
      return
    }

    default:
      throw new Error(`Unsupported command '${command}'.`)
  }
}

try {
  main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
}
