import path from "node:path"

import type { BrandSkillMode, IBrandSkillCommand } from "../model/normalized-brand-model"
import { resolveWorkspacePath, resolveWorkspaceRoot } from "../utils/workspace-paths"

const brandSkillModes = new Set<BrandSkillMode>(["inspect", "generate", "refresh", "reconcile"])

const slugifyBrandName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

interface IParsedFlagValue {
  index: number
  value: string
}

const readFlagValue = (args: string[], index: number, flag: string): IParsedFlagValue => {
  const value = args[index + 1]

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}`)
  }

  return {
    index: index + 1,
    value,
  }
}

export const parseBrandSkillCommand = (argv: string[]): IBrandSkillCommand | null => {
  const args = argv.slice(2)
  const firstArg = args[0]

  if (!firstArg || firstArg === "--help" || firstArg === "-h") {
    return null
  }

  if (!brandSkillModes.has(firstArg as BrandSkillMode)) {
    throw new Error(`Unknown mode: ${firstArg}`)
  }

  let brandName = ""
  let destinationDir = ""
  let outputFormat: "text" | "json" = "text"
  let dryRun = false

  const websiteUrls: string[] = []
  const docsPaths: string[] = []
  const screenshotPaths: string[] = []
  const codePaths: string[] = []
  const figmaUrls: string[] = []

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index]

    if (!arg) {
      continue
    }

    switch (arg) {
      case "--brand": {
        const nextValue = readFlagValue(args, index, arg)
        brandName = nextValue.value
        index = nextValue.index
        break
      }

      case "--website": {
        const nextValue = readFlagValue(args, index, arg)
        websiteUrls.push(nextValue.value)
        index = nextValue.index
        break
      }

      case "--docs": {
        const nextValue = readFlagValue(args, index, arg)
        docsPaths.push(nextValue.value)
        index = nextValue.index
        break
      }

      case "--screenshots": {
        const nextValue = readFlagValue(args, index, arg)
        screenshotPaths.push(nextValue.value)
        index = nextValue.index
        break
      }

      case "--code": {
        const nextValue = readFlagValue(args, index, arg)
        codePaths.push(nextValue.value)
        index = nextValue.index
        break
      }

      case "--figma": {
        const nextValue = readFlagValue(args, index, arg)
        figmaUrls.push(nextValue.value)
        index = nextValue.index
        break
      }

      case "--dest": {
        const nextValue = readFlagValue(args, index, arg)
        destinationDir = nextValue.value
        index = nextValue.index
        break
      }

      case "--json":
        outputFormat = "json"
        break

      case "--dry-run":
        dryRun = true
        break

      case "--help":
      case "-h":
        return null

      default:
        throw new Error(`Unknown flag: ${arg}`)
    }
  }

  const brandSlug = slugifyBrandName(brandName)
  const workspaceRoot = resolveWorkspaceRoot()
  const resolvedDestinationDir = resolveWorkspacePath(
    workspaceRoot,
    destinationDir || path.join(".agents", "skills", brandSlug || "brand-skill"),
  )

  return {
    mode: firstArg as BrandSkillMode,
    brandName,
    brandSlug,
    workspaceRoot,
    destinationDir: resolvedDestinationDir,
    websiteUrls,
    docsPaths,
    screenshotPaths,
    codePaths,
    figmaUrls,
    outputFormat,
    dryRun,
  }
}
