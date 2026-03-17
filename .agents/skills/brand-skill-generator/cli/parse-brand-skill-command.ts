import path from "node:path"

import type {
  BrandSkillMode,
  BrandSourceRole,
  IBrandSkillCommand,
} from "../model/normalized-brand-model"
import { resolveWorkspacePath, resolveWorkspaceRoot } from "../utils/workspace-paths"

const brandSkillModes = new Set<BrandSkillMode>(["inspect", "generate", "refresh", "reconcile"])
const brandSourceRoles = new Set<BrandSourceRole>([
  "brand-truth",
  "live-product",
  "mood-reference",
  "supporting-reference",
])

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

const readRoleValue = (args: string[], index: number, flag: string) => {
  const nextValue = readFlagValue(args, index, flag)

  if (!brandSourceRoles.has(nextValue.value as BrandSourceRole)) {
    throw new Error(`Invalid source role for ${flag}: ${nextValue.value}`)
  }

  return {
    index: nextValue.index,
    value: nextValue.value as BrandSourceRole,
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
  let brief = ""
  let outputFormat: "text" | "json" = "text"
  let dryRun = false
  let writeBriefDoc = false

  const websiteUrls: string[] = []
  const websiteRoles: Array<BrandSourceRole | null> = []
  const docsPaths: string[] = []
  const docsRoles: Array<BrandSourceRole | null> = []
  const screenshotPaths: string[] = []
  const screenshotRoles: Array<BrandSourceRole | null> = []
  const codePaths: string[] = []
  const codeRoles: Array<BrandSourceRole | null> = []
  const figmaUrls: string[] = []
  const figmaRoles: Array<BrandSourceRole | null> = []

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

      case "--brief": {
        const nextValue = readFlagValue(args, index, arg)
        brief = nextValue.value
        index = nextValue.index
        break
      }

      case "--website": {
        const nextValue = readFlagValue(args, index, arg)
        websiteUrls.push(nextValue.value)
        websiteRoles.push(null)
        index = nextValue.index
        break
      }

      case "--website-role": {
        if (websiteRoles.length === 0) {
          throw new Error("--website-role must follow a --website value")
        }

        const nextValue = readRoleValue(args, index, arg)
        websiteRoles[websiteRoles.length - 1] = nextValue.value
        index = nextValue.index
        break
      }

      case "--docs": {
        const nextValue = readFlagValue(args, index, arg)
        docsPaths.push(nextValue.value)
        docsRoles.push(null)
        index = nextValue.index
        break
      }

      case "--docs-role": {
        if (docsRoles.length === 0) {
          throw new Error("--docs-role must follow a --docs value")
        }

        const nextValue = readRoleValue(args, index, arg)
        docsRoles[docsRoles.length - 1] = nextValue.value
        index = nextValue.index
        break
      }

      case "--screenshots": {
        const nextValue = readFlagValue(args, index, arg)
        screenshotPaths.push(nextValue.value)
        screenshotRoles.push(null)
        index = nextValue.index
        break
      }

      case "--screenshots-role": {
        if (screenshotRoles.length === 0) {
          throw new Error("--screenshots-role must follow a --screenshots value")
        }

        const nextValue = readRoleValue(args, index, arg)
        screenshotRoles[screenshotRoles.length - 1] = nextValue.value
        index = nextValue.index
        break
      }

      case "--code": {
        const nextValue = readFlagValue(args, index, arg)
        codePaths.push(nextValue.value)
        codeRoles.push(null)
        index = nextValue.index
        break
      }

      case "--code-role": {
        if (codeRoles.length === 0) {
          throw new Error("--code-role must follow a --code value")
        }

        const nextValue = readRoleValue(args, index, arg)
        codeRoles[codeRoles.length - 1] = nextValue.value
        index = nextValue.index
        break
      }

      case "--figma": {
        const nextValue = readFlagValue(args, index, arg)
        figmaUrls.push(nextValue.value)
        figmaRoles.push(null)
        index = nextValue.index
        break
      }

      case "--figma-role": {
        if (figmaRoles.length === 0) {
          throw new Error("--figma-role must follow a --figma value")
        }

        const nextValue = readRoleValue(args, index, arg)
        figmaRoles[figmaRoles.length - 1] = nextValue.value
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

      case "--write-brief-doc":
        writeBriefDoc = true
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
    brief,
    writeBriefDoc,
    websiteUrls,
    websiteRoles,
    docsPaths,
    docsRoles,
    screenshotPaths,
    screenshotRoles,
    codePaths,
    codeRoles,
    figmaUrls,
    figmaRoles,
    outputFormat,
    dryRun,
  }
}
