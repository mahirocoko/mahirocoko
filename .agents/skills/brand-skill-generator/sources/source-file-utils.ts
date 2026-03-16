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
const unique = <T>(values: T[]) => [...new Set(values)]
const styleTokenStopWords = new Set([
  "help",
  "brand",
  "website",
  "docs",
  "screenshots",
  "code",
  "figma",
  "dest",
  "json",
  "dry-run",
  "show-toplevel",
  "toplevel",
  "based",
])

const isLikelyStyleToken = (token: string) => {
  const [, suffix = ""] = token.split(/-(.+)/)

  if (!suffix || suffix.length < 2) {
    return false
  }

  if (styleTokenStopWords.has(suffix.toLowerCase())) {
    return false
  }

  return /[0-9[\]/]/.test(suffix) || /(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|pink|rose|sm|md|lg|xl|full|none|solid|transparent|current)/i.test(
    suffix,
  )
}

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

export const readFileText = (filePath: string) => fs.readFileSync(filePath, "utf8")

export const extractMarkdownHeadings = (rawText: string) => {
  return rawText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^#{1,3}\s+/.test(line))
    .map((line) => normalizeWhitespace(line.replace(/^#{1,3}\s+/, "")))
    .filter(Boolean)
}

export const extractHtmlHeadings = (rawText: string) => {
  return [...rawText.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map((match) => match[1] ?? "")
    .map((value) => normalizeWhitespace(value.replace(/<[^>]+>/g, " ")))
    .filter(Boolean)
}

export const extractHtmlCtas = (rawText: string) => {
  const buttonLabels = [...rawText.matchAll(/<(button|a)[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => match[2] ?? "")
    .map((value) => normalizeWhitespace(value.replace(/<[^>]+>/g, " ")))
    .filter((text) => text.length > 0 && text.length <= 60)

  return unique(buttonLabels)
}

export const extractCodeExportNames = (rawText: string) => {
  const exportMatches = [
    ...rawText.matchAll(/export\s+(?:const|function|class|type|interface)\s+([A-Za-z0-9_]+)/g),
    ...rawText.matchAll(/export\s*\{\s*([^}]+)\s*\}/g),
  ]

  const exportNames: string[] = []

  for (const match of exportMatches) {
    const directName = match[1]

    if (!directName) {
      continue
    }

    if (directName.includes(",")) {
      const namedExports = directName
        .split(",")
        .map((part) => part.trim().split(/\s+as\s+/i)[0]?.trim())
        .filter((part): part is string => Boolean(part))

      exportNames.push(...namedExports)
      continue
    }

    exportNames.push(directName.trim())
  }

  return unique(exportNames)
}

export const extractStyleTokens = (rawText: string) => {
  const cssVars = [...rawText.matchAll(/--([a-z][a-z0-9-]{2,})(?=\s*:|\s*\))/gi)].map((match) => match[1])
  const tailwindLikeTokens = [...rawText.matchAll(/\b(bg|text|border|shadow|rounded|px|py|gap)-[a-z0-9-:/[\].]+/gi)].map(
    (match) => match[0],
  ).filter(isLikelyStyleToken)

  return unique([...cssVars, ...tailwindLikeTokens]).slice(0, 20)
}

export const extractSvgColors = (rawText: string) => {
  const colorMatches = [
    ...rawText.matchAll(/(?:fill|stroke)=["'](#[0-9a-fA-F]{3,8}|rgba?\([^"']+\)|[a-zA-Z]+)["']/g),
    ...rawText.matchAll(/stop-color=["'](#[0-9a-fA-F]{3,8}|rgba?\([^"']+\)|[a-zA-Z]+)["']/g),
  ].map((match) => match[1])

  return unique(colorMatches.filter(Boolean)).slice(0, 12)
}

export const extractSvgText = (rawText: string) => {
  const textMatches = [...rawText.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/gi)]
    .map((match) => match[1] ?? "")
    .map((value) => normalizeWhitespace(value.replace(/<[^>]+>/g, " ")))
    .filter(Boolean)

  return unique(textMatches).slice(0, 10)
}
