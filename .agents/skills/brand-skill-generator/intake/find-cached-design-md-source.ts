import fs from "node:fs"
import path from "node:path"

import type {
  IBrandSkillCachedDesignMdInfo,
  IBrandSkillCommand,
  IBrandSkillSourcePlanItem,
} from "../model/normalized-brand-model"
import { toWorkspaceRelativePath } from "../utils/workspace-paths"

interface IDesignMdCatalogEntry {
  slug?: string
  name?: string
}

export interface ICachedDesignMdSource extends IBrandSkillCachedDesignMdInfo {
  sourcePlanItem: IBrandSkillSourcePlanItem
}

const tryResolveFileIdentity = (targetPath: string) => {
  try {
    return fs.realpathSync(targetPath)
  } catch {
    return path.resolve(targetPath)
  }
}

const normalizeLookupValue = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "")

const pathContainsTargetFile = (candidatePath: string, targetFileIdentity: string) => {
  try {
    const stats = fs.statSync(candidatePath)

    if (stats.isDirectory()) {
      const nestedDesignMdPath = path.join(candidatePath, "DESIGN.md")

      return fs.existsSync(nestedDesignMdPath) && tryResolveFileIdentity(nestedDesignMdPath) === targetFileIdentity
    }

    return tryResolveFileIdentity(candidatePath) === targetFileIdentity
  } catch {
    return false
  }
}

const loadDesignMdCatalog = (workspaceRoot: string): IDesignMdCatalogEntry[] => {
  const catalogPath = path.join(workspaceRoot, ".agent-state", "design-md", "catalog.json")

  if (!fs.existsSync(catalogPath)) {
    return []
  }

  try {
    const rawValue = fs.readFileSync(catalogPath, "utf8")
    const parsedValue = JSON.parse(rawValue)

    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

const findCatalogMatchedSlug = (command: IBrandSkillCommand) => {
  const catalogEntries = loadDesignMdCatalog(command.workspaceRoot)

  if (catalogEntries.length === 0) {
    return null
  }

  const brandNameLower = command.brandName.trim().toLowerCase()
  const normalizedBrandName = normalizeLookupValue(command.brandName)
  const normalizedBrandSlug = normalizeLookupValue(command.brandSlug)

  const exactNameMatches = catalogEntries.filter(
    (entry) => entry.slug && entry.name?.trim().toLowerCase() === brandNameLower,
  )

  if (exactNameMatches.length === 1 && exactNameMatches[0]?.slug) {
    return exactNameMatches[0].slug
  }

  if (exactNameMatches.length > 1) {
    return null
  }

  const normalizedMatches = catalogEntries.filter((entry) => {
    if (!entry.slug || !entry.name) {
      return false
    }

    const normalizedEntryName = normalizeLookupValue(entry.name)
    const normalizedEntrySlug = normalizeLookupValue(entry.slug)

    return (
      normalizedEntryName === normalizedBrandName ||
      normalizedEntrySlug === normalizedBrandName ||
      normalizedEntrySlug === normalizedBrandSlug
    )
  })

  return normalizedMatches.length === 1 ? normalizedMatches[0]?.slug ?? null : null
}

const resolveCachedDesignMdPath = (
  command: IBrandSkillCommand,
): { absolutePath: string; lookupMode: "exact-slug" | "catalog-fallback"; matchedSlug: string } | null => {
  const exactSlugPath = path.join(
    command.workspaceRoot,
    ".agent-state",
    "design-md",
    "brands",
    command.brandSlug,
    "DESIGN.md",
  )

  if (fs.existsSync(exactSlugPath)) {
    return {
      absolutePath: exactSlugPath,
      lookupMode: "exact-slug",
      matchedSlug: command.brandSlug,
    }
  }

  const catalogMatchedSlug = findCatalogMatchedSlug(command)

  if (!catalogMatchedSlug) {
    return null
  }

  const fallbackPath = path.join(
    command.workspaceRoot,
    ".agent-state",
    "design-md",
    "brands",
    catalogMatchedSlug,
    "DESIGN.md",
  )

  return fs.existsSync(fallbackPath)
    ? {
        absolutePath: fallbackPath,
        lookupMode: "catalog-fallback",
        matchedSlug: catalogMatchedSlug,
      }
    : null
}

export const findCachedDesignMdSource = (
  command: IBrandSkillCommand,
): ICachedDesignMdSource | null => {
  if (!command.brandSlug) {
    return null
  }

  const resolvedCachedPath = resolveCachedDesignMdPath(command)

  if (!resolvedCachedPath) {
    return null
  }

  const { absolutePath, lookupMode, matchedSlug } = resolvedCachedPath

  const targetFileIdentity = tryResolveFileIdentity(absolutePath)

  if (
    command.docsPaths.some((docsPath) => {
      const resolvedDocsPath = path.resolve(command.workspaceRoot, docsPath)

      return pathContainsTargetFile(resolvedDocsPath, targetFileIdentity)
    })
  ) {
    return null
  }

  const displayPath = toWorkspaceRelativePath(command.workspaceRoot, absolutePath)

  return {
    absolutePath,
    displayPath,
    lookupMode,
    matchedSlug,
    sourcePlanItem: {
      sourceType: "brand-docs",
      location: displayPath,
      role: "brand-truth",
      roleOrigin: "generated",
      includedInExecution: true,
      exclusionReason: null,
    },
  }
}
