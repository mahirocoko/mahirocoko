import fs from "node:fs"
import path from "node:path"

import type { IBrandSourceTextSample } from "../model/normalized-brand-model"

const ignoredDirectoryNames = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  ".playwright",
  ".playwright-cli",
  ".sisyphus",
])

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"])
const textExtensions = new Set([
  ".md",
  ".mdx",
  ".txt",
  ".html",
  ".css",
  ".scss",
  ".json",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".yml",
  ".yaml",
  ".svg",
])

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim()

export const isImageFile = (filePath: string) => imageExtensions.has(path.extname(filePath).toLowerCase())

export const isLikelyTextFile = (filePath: string) => {
  const extension = path.extname(filePath).toLowerCase()

  if (textExtensions.has(extension)) {
    return true
  }

  return extension === ""
}

export const toRelativePath = (rootDir: string, filePath: string) => {
  const relativePath = path.relative(rootDir, filePath)
  return relativePath || path.basename(filePath)
}

export const walkDirectoryFiles = (
  rootDir: string,
  options?: {
    maxFiles?: number
    includeImages?: boolean
  },
) => {
  const maxFiles = options?.maxFiles ?? 50
  const includeImages = options?.includeImages ?? true
  const files: string[] = []

  const walk = (currentDir: string) => {
    if (files.length >= maxFiles) {
      return
    }

    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      if (files.length >= maxFiles) {
        return
      }

      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        if (ignoredDirectoryNames.has(entry.name)) {
          continue
        }

        walk(fullPath)
        continue
      }

      if (!entry.isFile()) {
        continue
      }

      if (!includeImages && isImageFile(fullPath)) {
        continue
      }

      files.push(fullPath)
    }
  }

  walk(rootDir)

  return files
}

export const readTextSample = (
  filePath: string,
  rootDir: string,
  maxLength = 280,
): IBrandSourceTextSample | null => {
  if (!isLikelyTextFile(filePath)) {
    return null
  }

  const rawText = fs.readFileSync(filePath, "utf8")
  const content = normalizeWhitespace(rawText).slice(0, maxLength)

  if (!content) {
    return null
  }

  return {
    label: toRelativePath(rootDir, filePath),
    content,
  }
}

export const collectTextSamples = (
  rootDir: string,
  filePaths: string[],
  maxSamples = 3,
): IBrandSourceTextSample[] => {
  const samples: IBrandSourceTextSample[] = []

  for (const filePath of filePaths) {
    if (samples.length >= maxSamples) {
      break
    }

    const sample = readTextSample(filePath, rootDir)

    if (sample) {
      samples.push(sample)
    }
  }

  return samples
}

export const summarizeFileTypes = (filePaths: string[]) => {
  const counts: Record<string, number> = {}

  for (const filePath of filePaths) {
    const extension = path.extname(filePath).toLowerCase() || "[no-extension]"
    counts[extension] = (counts[extension] ?? 0) + 1
  }

  return counts
}
