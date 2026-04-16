#!/usr/bin/env bun

import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { execFileSync } from "node:child_process"

type DesignBrandRecord = {
  slug: string
  name: string
  category: string
  summary: string
  pageUrl: string
  rawDesignUrl: string
  previewUrl: string
  previewDarkUrl: string
}

type SyncedBrandMeta = {
  slug: string
  name: string
  category: string
  summary: string
  sourceUrl: string
  checksum: string
  fetchedAt: string
  bytes: number
}

type SyncState = {
  fetchedAt: string
  source: string
  syncedBrandCount: number
  failedBrands: { slug: string; reason: string }[]
}

const REMOTE_CATALOG_URL = "https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/README.md"

function resolveRepoRoot(): string {
  try {
    const output = execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })

    return output.trim()
  } catch {
    return process.cwd()
  }
}

function resolveAgentStateDir(repoRoot: string): string {
  return process.env.AGENT_STATE_DIR ?? join(repoRoot, ".agent-state")
}

function getStorePaths(repoRoot: string) {
  const agentStateDir = resolveAgentStateDir(repoRoot)
  const baseDir = join(agentStateDir, "design-md")

  return {
    agentStateDir,
    baseDir,
    brandsDir: join(baseDir, "brands"),
    catalogPath: join(baseDir, "catalog.json"),
    syncStatePath: join(baseDir, "sync-state.json"),
    localCatalogReadmePath: join(agentStateDir, "learn", "VoltAgent", "awesome-design-md", "origin", "README.md"),
  }
}

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true })
}

function readJsonFile<T>(path: string): T | null {
  if (!existsSync(path)) {
    return null
  }

  return JSON.parse(readFileSync(path, "utf8")) as T
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "mahiro-design-md-sync/0.1",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`)
  }

  return await response.text()
}

async function loadCatalogMarkdown(storePaths: ReturnType<typeof getStorePaths>): Promise<{ markdown: string; source: string }> {
  if (existsSync(storePaths.localCatalogReadmePath)) {
    return {
      markdown: readFileSync(storePaths.localCatalogReadmePath, "utf8"),
      source: storePaths.localCatalogReadmePath,
    }
  }

  return {
    markdown: await fetchText(REMOTE_CATALOG_URL),
    source: REMOTE_CATALOG_URL,
  }
}

function parseCatalog(markdown: string): DesignBrandRecord[] {
  const records: DesignBrandRecord[] = []
  let currentCategory = "Uncategorized"

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim()

    const categoryMatch = /^###\s+(.+)$/.exec(line)
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim()
      continue
    }

    const brandMatch = /^- \[\*\*(.+?)\*\*\]\(https:\/\/getdesign\.md\/([^/]+)\/design-md\) - (.+)$/.exec(line)
    if (!brandMatch) {
      continue
    }

    const [, name, slug, summary] = brandMatch

    records.push({
      slug,
      name,
      category: currentCategory,
      summary,
      pageUrl: `https://getdesign.md/${slug}/design-md`,
      rawDesignUrl: `https://getdesign.md/design-md/${slug}/DESIGN.md`,
      previewUrl: `https://getdesign.md/design-md/${slug}/preview.html`,
      previewDarkUrl: `https://getdesign.md/design-md/${slug}/preview-dark.html`,
    })
  }

  return records
}

async function loadCatalog(storePaths: ReturnType<typeof getStorePaths>): Promise<{ records: DesignBrandRecord[]; source: string; cacheState: "cached" | "live" }> {
  const cachedCatalog = readJsonFile<DesignBrandRecord[]>(storePaths.catalogPath)
  if (cachedCatalog) {
    return {
      records: cachedCatalog,
      source: storePaths.catalogPath,
      cacheState: "cached",
    }
  }

  const { markdown, source } = await loadCatalogMarkdown(storePaths)
  return {
    records: parseCatalog(markdown),
    source,
    cacheState: "live",
  }
}

function formatCategoryGroup(records: DesignBrandRecord[]): string {
  const grouped = new Map<string, DesignBrandRecord[]>()

  for (const record of records) {
    const group = grouped.get(record.category) ?? []
    group.push(record)
    grouped.set(record.category, group)
  }

  const sections: string[] = []

  for (const [category, items] of grouped.entries()) {
    sections.push(`## ${category}`)
    for (const item of items.sort((left, right) => left.name.localeCompare(right.name))) {
      sections.push(`- ${item.name} (${item.slug}) — ${item.summary}`)
    }
    sections.push("")
  }

  return sections.join("\n").trim()
}

function scoreRecord(record: DesignBrandRecord, query: string, cachedContent: string | null): number {
  const haystack = `${record.name} ${record.slug} ${record.category} ${record.summary}`.toLowerCase()
  let score = 0

  if (record.slug.toLowerCase() === query) score += 120
  if (record.name.toLowerCase() === query) score += 110
  if (record.slug.toLowerCase().includes(query)) score += 70
  if (record.name.toLowerCase().includes(query)) score += 60
  if (record.category.toLowerCase().includes(query)) score += 35
  if (record.summary.toLowerCase().includes(query)) score += 25
  if (haystack.includes(query)) score += 10
  if (cachedContent && cachedContent.toLowerCase().includes(query)) score += 40

  return score
}

function checksumText(content: string): string {
  return createHash("sha256").update(content).digest("hex")
}

function printHelp(): void {
  console.log(`design-md\n\nUsage:\n  bun .agents/skills/design-md/scripts/main.ts list\n  bun .agents/skills/design-md/scripts/main.ts search <query>\n  bun .agents/skills/design-md/scripts/main.ts sync [slug ...]`)
}

async function runList(storePaths: ReturnType<typeof getStorePaths>): Promise<void> {
  const catalog = await loadCatalog(storePaths)

  console.log(`# design-md list`)
  console.log("")
  console.log(`Source: ${catalog.source} [${catalog.cacheState}]`)
  console.log(`Brands: ${catalog.records.length}`)
  console.log("")
  console.log(formatCategoryGroup(catalog.records))
}

async function runSearch(storePaths: ReturnType<typeof getStorePaths>, queryRaw: string | undefined): Promise<void> {
  const query = queryRaw?.trim().toLowerCase()
  if (!query) {
    throw new Error("Missing search query.")
  }

  const catalog = await loadCatalog(storePaths)
  const results = catalog.records
    .map((record) => {
      const designPath = join(storePaths.brandsDir, record.slug, "DESIGN.md")
      const cachedContent = existsSync(designPath) ? readFileSync(designPath, "utf8") : null

      return {
        record,
        cached: cachedContent !== null,
        score: scoreRecord(record, query, cachedContent),
      }
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.record.name.localeCompare(right.record.name))

  console.log(`# design-md search`)
  console.log("")
  console.log(`Query: ${query}`)
  console.log(`Matches: ${results.length}`)
  console.log("")

  if (results.length === 0) {
    console.log("No matching brands found.")
    return
  }

  for (const entry of results) {
    console.log(`- ${entry.record.name} (${entry.record.slug})${entry.cached ? " [cached]" : ""}`)
    console.log(`  category: ${entry.record.category}`)
    console.log(`  summary: ${entry.record.summary}`)
    console.log(`  page: ${entry.record.pageUrl}`)
  }
}

async function runSync(storePaths: ReturnType<typeof getStorePaths>, requestedSlugs: string[]): Promise<void> {
  ensureDir(storePaths.baseDir)
  ensureDir(storePaths.brandsDir)

  const { markdown, source } = await loadCatalogMarkdown(storePaths)
  const catalog = parseCatalog(markdown)
  writeFileSync(storePaths.catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8")

  const targetSlugs = requestedSlugs.length > 0 ? new Set(requestedSlugs.map((slug) => slug.toLowerCase())) : null
  const targetRecords = targetSlugs
    ? catalog.filter((record) => targetSlugs.has(record.slug.toLowerCase()))
    : catalog

  const missingRequestedSlugs = targetSlugs
    ? [...targetSlugs].filter((slug) => !catalog.some((record) => record.slug.toLowerCase() === slug))
    : []

  const failedBrands: { slug: string; reason: string }[] = []
  let changedCount = 0
  let unchangedCount = 0

  for (const record of targetRecords) {
    try {
      const content = await fetchText(record.rawDesignUrl)
      const checksum = checksumText(content)
      const brandDir = join(storePaths.brandsDir, record.slug)
      const designPath = join(brandDir, "DESIGN.md")
      const metaPath = join(brandDir, "meta.json")
      const previousMeta = readJsonFile<SyncedBrandMeta>(metaPath)

      ensureDir(brandDir)
      writeFileSync(designPath, content, "utf8")

      const meta: SyncedBrandMeta = {
        slug: record.slug,
        name: record.name,
        category: record.category,
        summary: record.summary,
        sourceUrl: record.rawDesignUrl,
        checksum,
        fetchedAt: new Date().toISOString(),
        bytes: Buffer.byteLength(content, "utf8"),
      }

      writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8")

      if (previousMeta?.checksum === checksum) {
        unchangedCount += 1
      } else {
        changedCount += 1
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      failedBrands.push({ slug: record.slug, reason })
    }
  }

  for (const missingSlug of missingRequestedSlugs) {
    failedBrands.push({ slug: missingSlug, reason: "Slug not found in catalog." })
  }

  const syncState: SyncState = {
    fetchedAt: new Date().toISOString(),
    source,
    syncedBrandCount: targetRecords.length - failedBrands.length,
    failedBrands,
  }

  writeFileSync(storePaths.syncStatePath, `${JSON.stringify(syncState, null, 2)}\n`, "utf8")

  console.log(`# design-md sync`)
  console.log("")
  console.log(`Catalog source: ${source}`)
  console.log(`Catalog brands: ${catalog.length}`)
  console.log(`Requested brands: ${requestedSlugs.length > 0 ? requestedSlugs.join(", ") : "all"}`)
  console.log(`Synced targets: ${targetRecords.length}`)
  console.log(`Changed: ${changedCount}`)
  console.log(`Unchanged: ${unchangedCount}`)
  console.log(`Failed: ${failedBrands.length}`)

  if (failedBrands.length > 0) {
    console.log("")
    console.log("## Failures")

    for (const failedBrand of failedBrands) {
      console.log(`- ${failedBrand.slug}: ${failedBrand.reason}`)
    }
  }
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2)
  const repoRoot = resolveRepoRoot()
  const storePaths = getStorePaths(repoRoot)

  switch (command) {
    case undefined:
    case "help":
    case "--help":
    case "-h":
      printHelp()
      return
    case "list":
      await runList(storePaths)
      return
    case "search":
      await runSearch(storePaths, rest.join(" "))
      return
    case "sync":
      await runSync(storePaths, rest)
      return
    default:
      throw new Error(`Unsupported command '${command}'.`)
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
})
