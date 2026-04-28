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
  skillRoot: string
  workspaceRoot: string
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

type BriefOptions = ComposeOptions & {
  referencePaths: string[]
}

type SearchMatch = {
  kind: "general" | "direction" | "prompt"
  key: string
  title: string
  summary: string
  score: number
}

type RepoLocalFile = {
  absolutePath: string
  displayPath: string
  sandboxOnly: boolean
  referenceCorpus: boolean
}

const PROMPT_ASSETS_RELATIVE_PATH = join("resources", "prompt-assets")
const DESIGN_PROMPTS_RELATIVE_PATH = join(PROMPT_ASSETS_RELATIVE_PATH, "design-prompts.json")
const DESIGN_SKILL_PROMPTS_RELATIVE_PATH = join(PROMPT_ASSETS_RELATIVE_PATH, "design-skill-prompts.json")
const REFERENCE_EXCERPTS_RELATIVE_PATH = join("resources", "reference-excerpts")
const SKILL_ROOT = resolve(import.meta.dir, "..")

function resolveWorkspaceRoot(): string {
  return process.cwd()
}

function getAssetPaths(skillRoot: string, workspaceRoot: string): AssetPaths {
  return {
    skillRoot,
    workspaceRoot,
    designPromptsPath: join(skillRoot, DESIGN_PROMPTS_RELATIVE_PATH),
    designSkillPromptsPath: join(skillRoot, DESIGN_SKILL_PROMPTS_RELATIVE_PATH),
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
  bun scripts/main.ts list
  bun scripts/main.ts search <query>
  bun scripts/main.ts compose --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>]
  bun scripts/main.ts brief --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>] [--reference <path> ...]

Composition order:
  1. generalSystemPrompt
  2. generalSystemPrompts.<key>
  3. directionSystemPrompts.<key> in CLI order
  4. design-skill-prompts entries in CLI order
  5. optional --handoff file content

Notes:
  - Reads bundled prompt assets from resources/prompt-assets
  - --handoff and --reference resolve from the current workspace or skill root
  - --reference files are treated as evidence, not prompt canon
  - resources/reference-excerpts/* is bundled non-canonical evidence`)
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
  console.log(`Skill root: ${assetPaths.skillRoot}`)
  console.log(`Workspace root: ${assetPaths.workspaceRoot}`)
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

function parseBriefArgs(args: string[]): BriefOptions {
  const composeArgs: string[] = []
  const referencePaths: string[] = []

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    if (argument === "--reference") {
      referencePaths.push(readRequiredOptionValue(args, index, "--reference"))
      index += 1
      continue
    }

    composeArgs.push(argument)
  }

  assertNoDuplicates(referencePaths, "reference path")

  return {
    ...parseComposeArgs(composeArgs),
    referencePaths,
  }
}

function isInsidePath(parentPath: string, candidatePath: string): boolean {
  const relativePath = relative(parentPath, candidatePath)
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath))
}

function formatDisplayPath(assetPaths: AssetPaths, absolutePath: string): string {
  const skillRelativePath = relative(assetPaths.skillRoot, absolutePath)
  if (skillRelativePath === "" || (!skillRelativePath.startsWith("..") && !isAbsolute(skillRelativePath))) {
    return skillRelativePath
  }

  const workspaceRelativePath = relative(assetPaths.workspaceRoot, absolutePath)
  if (workspaceRelativePath === "" || (!workspaceRelativePath.startsWith("..") && !isAbsolute(workspaceRelativePath))) {
    return workspaceRelativePath
  }

  return absolutePath
}

function isSkillReferenceExcerptPath(skillRoot: string, candidatePath: string): boolean {
  const referenceExcerptPath = join(skillRoot, REFERENCE_EXCERPTS_RELATIVE_PATH)
  return isInsidePath(referenceExcerptPath, candidatePath)
}

function resolveInputFilePath(assetPaths: AssetPaths, inputPath: string): RepoLocalFile {
  const candidatePaths = isAbsolute(inputPath)
    ? [inputPath]
    : Array.from(new Set([resolve(assetPaths.workspaceRoot, inputPath), resolve(assetPaths.skillRoot, inputPath)]))

  let foundOutsideAllowedRoots = false
  let foundNonFilePath = false

  const matchedPath = candidatePaths.find((candidatePath) => {
    if (!existsSync(candidatePath)) {
      return false
    }

    const realPath = realpathSync(candidatePath)
    const insideWorkspace = isInsidePath(assetPaths.workspaceRoot, realPath)
    const insideSkill = isInsidePath(assetPaths.skillRoot, realPath)
    if (!insideWorkspace && !insideSkill) {
      foundOutsideAllowedRoots = true
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
    if (foundOutsideAllowedRoots) {
      throw new Error(`Input path must stay inside the current workspace or skill bundle: ${inputPath}`)
    }

    if (foundNonFilePath) {
      throw new Error(`Input path must be a file: ${inputPath}`)
    }

    throw new Error(`Input file not found: ${inputPath}`)
  }

  const realPath = realpathSync(matchedPath)
  const displayPath = formatDisplayPath(assetPaths, realPath)
  const referenceCorpus = isSkillReferenceExcerptPath(assetPaths.skillRoot, realPath)

  return {
    absolutePath: realPath,
    displayPath,
    sandboxOnly: referenceCorpus,
    referenceCorpus,
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
    ? resolveInputFilePath(assetPaths, options.handoffPath)
    : null

  const handoffSection = handoff
    ? (() => {
        const fileContent = readFileSync(handoff.absolutePath, "utf8").trim()
        const lines = handoff.sandboxOnly
          ? [
              `Sandbox note: ${handoff.displayPath} is skill-local sample input only and is not validated prompt canon.`,
              "",
              fileContent,
            ]
          : [fileContent]

        return formatSection(`handoff: ${handoff.displayPath}`, lines.join("\n"))
      })()
    : null

  const orderLines = [
    "1. shared baseline: generalSystemPrompt",
    `2. general: ${options.generalKey}`,
    ...options.directionKeys.map((key, index) => `${index + 3}. direction: ${key}`),
    ...options.promptIds.map((id, index) => `${index + 3 + options.directionKeys.length}. prompt: ${id}`),
  ]

  if (handoffSection) {
    orderLines.push(`${orderLines.length + 1}. handoff: ${handoff?.displayPath}`)
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
  console.log(`Skill root: ${assetPaths.skillRoot}`)
  console.log(`Workspace root: ${assetPaths.workspaceRoot}`)
  console.log(`Assets: ${DESIGN_PROMPTS_RELATIVE_PATH}, ${DESIGN_SKILL_PROMPTS_RELATIVE_PATH}`)
  console.log("")
  console.log("## Composition order")
  for (const line of orderLines) {
    console.log(line)
  }
  console.log("")
  console.log(sections.join("\n\n"))
}

function truncateContent(content: string, maxLength: number): string {
  const normalized = content.trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength).trimEnd()}\n\n[truncated: ${normalized.length - maxLength} chars omitted]`
}

function formatSourceList(title: string, entries: string[]): string {
  const body = entries.length > 0 ? entries.map((entry) => `- ${entry}`).join("\n") : "- none"
  return formatSection(title, body)
}

function runBrief(assetPaths: AssetPaths, assets: LoadedAssets, options: BriefOptions): void {
  const generalPrompt = assets.promptLibrary.generalSystemPrompts[options.generalKey]
  if (!generalPrompt) {
    throw new Error(`Unknown general key '${options.generalKey}'. Run 'list' to inspect available keys.`)
  }

  const directionSummaries = options.directionKeys.map((key) => {
    const prompt = assets.promptLibrary.directionSystemPrompts[key]
    if (!prompt) {
      throw new Error(`Unknown direction key '${key}'. Run 'list' to inspect available keys.`)
    }

    return `${key}: ${prompt}`
  })

  const promptEntryMap = resolvePromptEntryMap(assets.skillPromptEntries)
  const promptSummaries = options.promptIds.map((id) => {
    const entry = promptEntryMap.get(id)
    if (!entry) {
      throw new Error(`Unknown prompt id '${id}'. Run 'list' to inspect available ids.`)
    }

    return `${id} (${entry.label}): ${entry.description}`
  })

  const handoff = options.handoffPath
    ? resolveInputFilePath(assetPaths, options.handoffPath)
    : null

  const references = options.referencePaths.map((referencePath) =>
    resolveInputFilePath(assetPaths, referencePath),
  )

  const sections = [
    formatSection(
      "intent / page job",
      [
        `General prompt key: ${options.generalKey}`,
        `Canonical general prompt length: ${generalPrompt.length} chars`,
        "Use selected canonical prompt assets to define the page job, not to blindly concatenate a final implementation prompt.",
        "Preserve product intent, information architecture, and explicit user constraints before applying visual style.",
      ].join("\n"),
    ),
    formatSourceList("selected direction modifiers", directionSummaries),
    formatSourceList("selected reusable prompt fragments", promptSummaries),
    formatSection(
      "visual reference anatomy",
      [
        "Extract only reusable anatomy from references:",
        "- page type and section sequence",
        "- typography roles and hierarchy",
        "- color/material system cues",
        "- media/background role and crop behavior",
        "- motion timing and interaction purpose",
        "- component responsibilities and responsive constraints",
        "Do not copy reference aesthetics unless they are explicitly required by product or brand.",
      ].join("\n"),
    ),
    formatSection(
      "information architecture",
      [
        "Define content hierarchy before styling:",
        "- primary message and audience",
        "- navigation and action hierarchy",
        "- section jobs and proof/supporting content",
        "- above-the-fold requirements versus later-page content",
      ].join("\n"),
    ),
    formatSection(
      "design system cues",
      [
        "Turn the prompt stack into explicit design-system decisions:",
        "- font roles, weights, and hierarchy constraints",
        "- color tokens or palette source",
        "- radius, border, shadow, and surface rules",
        "- spacing scale and container behavior",
        "- component states that are functional rather than decorative",
      ].join("\n"),
    ),
    formatSection(
      "motion / media guidance",
      [
        "Use motion and media only when they serve comprehension, sequencing, or brand atmosphere.",
        "For video/background references, specify role, overlay/readability needs, crop focal point, fallback, and reduced-motion behavior.",
        "Avoid importing motion-heavy recreation specs as default product UI behavior.",
      ].join("\n"),
    ),
    formatSection(
      "asset needs",
      [
        "Route asset planning to asset-designer when the page needs images, videos, cutouts, crops, shadows, or delivery variants.",
        "Route single image-generation prompt rewrites to web-asset-prompts.",
        "Every asset should have a role: hero media, overlay-safe background, card image, transparent cutout, foreground layer, shadow layer, or responsive variant.",
      ].join("\n"),
    ),
    formatSection(
      "uncodixify guardrails",
      [
        "Apply uncodixify after extracting design intent:",
        "- keep explicit brand/product constraints",
        "- remove generic AI defaults that do not improve hierarchy, grouping, affordance, accessibility, or brand clarity",
        "- treat liquid glass, pill nav, cinematic dark SaaS, giant video hero, hover scale, glows, and decorative gradients as risks, not defaults",
        "- reduce over-large typography before using scale as hierarchy",
      ].join("\n"),
    ),
    formatSection(
      "implementation constraints",
      [
        "Write implementation instructions only after the brief is coherent.",
        "Keep repo/framework constraints explicit. Do not invent asset URLs, libraries, fonts, or routes.",
        "Prefer existing project tokens/components when implementing in a real codebase.",
        "The brief is not complete until reference-derived ideas are separated from canonical prompt assets.",
      ].join("\n"),
    ),
  ]

  if (handoff) {
    const content = truncateContent(readFileSync(handoff.absolutePath, "utf8"), 3600)
    const posture = handoff.sandboxOnly
      ? `Sandbox note: ${handoff.displayPath} is skill-local sample input only and is not validated prompt canon.`
      : `Handoff source: ${handoff.displayPath}`

    sections.push(formatSection("handoff context", [posture, "", content].join("\n")))
  }

  for (const reference of references) {
    const content = truncateContent(readFileSync(reference.absolutePath, "utf8"), 2400)
    const posture = reference.referenceCorpus
      ? "Reference posture: use this for anatomy and constraints only; do not treat its aesthetic as canonical."
      : "Reference posture: workspace-local reference evidence. Extract intent before copying style."

    sections.push(formatSection(`reference: ${reference.displayPath}`, [posture, "", content].join("\n")))
  }

  console.log("# frontend-design brief")
  console.log("")
  console.log(`Skill root: ${assetPaths.skillRoot}`)
  console.log(`Workspace root: ${assetPaths.workspaceRoot}`)
  console.log(`Assets: ${DESIGN_PROMPTS_RELATIVE_PATH}, ${DESIGN_SKILL_PROMPTS_RELATIVE_PATH}`)
  console.log("")
  console.log(sections.join("\n\n"))
}

function main(): void {
  const [command, ...rest] = process.argv.slice(2)
  const assetPaths = getAssetPaths(SKILL_ROOT, resolveWorkspaceRoot())

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

    case "brief": {
      const assets = loadAssets(assetPaths)
      const options = parseBriefArgs(rest)
      runBrief(assetPaths, assets, options)
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
