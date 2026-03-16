import fs from "node:fs"
import path from "node:path"

import type {
  BrandSourceType,
  ConfidenceLevel,
  IBrandSourceRecord,
  SourceFreshness,
  SourceLocationType,
  SourcePathKind,
} from "../model/normalized-brand-model"
import {
  collectTextSamples,
  isImageFile,
  summarizeFileTypes,
  toRelativePath,
  walkDirectoryFiles,
} from "./source-file-utils"

const isUrl = (value: string) => /^https?:\/\//.test(value)

const buildPathKind = (location: string): SourcePathKind => {
  if (isUrl(location)) {
    return "unknown"
  }

  if (!fs.existsSync(location)) {
    return "missing"
  }

  const stats = fs.statSync(location)
  return stats.isDirectory() ? "directory" : "file"
}

const buildFreshness = (modifiedAt: Date | null): SourceFreshness => {
  if (!modifiedAt) {
    return "unknown"
  }

  const ageInDays = Math.floor((Date.now() - modifiedAt.getTime()) / (1000 * 60 * 60 * 24))

  if (ageInDays <= 30) {
    return "current"
  }

  if (ageInDays <= 120) {
    return "aging"
  }

  return "stale"
}

const explicitnessBySourceType: Record<BrandSourceType, ConfidenceLevel> = {
  website: "medium",
  "brand-docs": "high",
  "screenshot-dir": "medium",
  "code-reference": "medium",
  "figma-url": "high",
}

const coverageBySourceType: Record<BrandSourceType, ConfidenceLevel> = {
  website: "medium",
  "brand-docs": "high",
  "screenshot-dir": "medium",
  "code-reference": "medium",
  "figma-url": "high",
}

const stripHtml = (value: string) => value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()

const readWebsiteDetails = async (location: string) => {
  const metadata: Record<string, string> = {}
  const notes: string[] = []
  const textSamples: IBrandSourceRecord["textSamples"] = []

  try {
    const response = await fetch(location, {
      signal: AbortSignal.timeout(5000),
    })

    metadata.http_status = String(response.status)
    metadata.final_url = response.url

    if (!response.ok) {
      notes.push(`Website fetch returned HTTP ${response.status}.`)
      return {
        exists: false,
        itemCount: 0,
        discoveredPaths: [],
        textSamples,
        metadata,
        notes,
        sourceSummary: `Website fetch failed with HTTP ${response.status}.`,
      }
    }

    const html = await response.text()
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const descriptionMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
    )
    const strippedText = stripHtml(html).slice(0, 560)

    if (titleMatch?.[1]) {
      metadata.title = titleMatch[1].replace(/\s+/g, " ").trim()
    }

    if (descriptionMatch?.[1]) {
      metadata.description = descriptionMatch[1].replace(/\s+/g, " ").trim()
    }

    if (strippedText) {
      textSamples.push({
        label: "website-body",
        content: strippedText.slice(0, 280),
      })
      textSamples.push({
        label: "website-body-continued",
        content: strippedText.slice(280, 560),
      })
    }

    const sourceSummaryParts = [
      metadata.title ? `title: ${metadata.title}` : null,
      metadata.description ? `description: ${metadata.description}` : null,
    ].filter(Boolean)

    return {
      exists: true,
      itemCount: 1,
      discoveredPaths: [],
      textSamples: textSamples.filter((sample) => sample.content),
      metadata,
      notes,
      sourceSummary:
        sourceSummaryParts.length > 0
          ? `Website metadata extracted (${sourceSummaryParts.join(" | ")}).`
          : "Website content fetched successfully.",
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fetch error"

    notes.push(`Website fetch failed: ${message}`)

    return {
      exists: false,
      itemCount: 0,
      discoveredPaths: [],
      textSamples,
      metadata,
      notes,
      sourceSummary: "Website content could not be fetched.",
    }
  }
}

const readLocalPathDetails = (sourceType: BrandSourceType, location: string, pathKind: SourcePathKind) => {
  const resolvedLocation = path.resolve(location)
  const metadata: Record<string, string> = {}
  const notes: string[] = []

  if (pathKind === "missing") {
    notes.push("Source is missing or not accessible from the current workspace.")

    return {
      exists: false,
      itemCount: 0,
      discoveredPaths: [],
      textSamples: [],
      metadata,
      notes,
      sourceSummary: "Local source is missing.",
    }
  }

  const stats = fs.statSync(location)
  const allFiles =
    pathKind === "directory"
      ? walkDirectoryFiles(location, { includeImages: true, maxFiles: 60 })
      : [location]
  const discoveredPaths = allFiles.slice(0, 8).map((filePath) => toRelativePath(resolvedLocation, filePath))

  if (sourceType === "screenshot-dir") {
    const imageFiles = allFiles.filter((filePath) => isImageFile(filePath))
    metadata.image_count = String(imageFiles.length)
    metadata.file_types = JSON.stringify(summarizeFileTypes(imageFiles))

    return {
      exists: true,
      itemCount: imageFiles.length,
      discoveredPaths: imageFiles.slice(0, 8).map((filePath) => toRelativePath(resolvedLocation, filePath)),
      textSamples: [],
      metadata,
      notes,
      sourceSummary:
        imageFiles.length > 0
          ? `Found ${imageFiles.length} visual references.`
          : "No image files were found in the screenshot directory.",
    }
  }

  const textSamples = collectTextSamples(resolvedLocation, allFiles, 4)
  metadata.file_count = String(allFiles.length)
  metadata.file_types = JSON.stringify(summarizeFileTypes(allFiles))
  metadata.modified_at = stats.mtime.toISOString()

  if (pathKind === "directory") {
    notes.push("Directory source scanned recursively with common build and dependency directories ignored.")
  }

  return {
    exists: true,
    itemCount: allFiles.length,
    discoveredPaths,
    textSamples,
    metadata,
    notes,
    sourceSummary:
      sourceType === "brand-docs"
        ? `Scanned ${allFiles.length} brand document files.`
        : `Scanned ${allFiles.length} reference files.`,
  }
}

export const loadSourceRecordDetails = async (
  sourceType: BrandSourceType,
  location: string,
  recordIndex: number,
): Promise<IBrandSourceRecord> => {
  const locationType: SourceLocationType = isUrl(location) ? "url" : "path"
  const resolvedLocation = locationType === "url" ? location : path.resolve(location)
  const pathKind = buildPathKind(location)
  const modifiedAt =
    locationType === "path" && pathKind !== "missing" ? fs.statSync(location).mtime.toISOString() : null
  const freshness = buildFreshness(modifiedAt ? new Date(modifiedAt) : null)

  const detailResult =
    sourceType === "website"
      ? await readWebsiteDetails(location)
      : sourceType === "figma-url"
        ? {
            exists: true,
            itemCount: 1,
            discoveredPaths: [],
            textSamples: [],
            metadata: {
              provider: "figma",
              url: location,
            },
            notes: ["Figma URLs are recorded now and will be resolved by a later adapter."],
            sourceSummary: "Figma reference recorded for future visual extraction.",
          }
        : readLocalPathDetails(sourceType, location, pathKind)

  return {
    id: `${sourceType}-${recordIndex}`,
    sourceType,
    locationType,
    location,
    resolvedLocation,
    pathKind,
    exists: detailResult.exists,
    modifiedAt,
    freshness,
    explicitnessBaseline: explicitnessBySourceType[sourceType],
    coverageEstimate: coverageBySourceType[sourceType],
    itemCount: detailResult.itemCount,
    discoveredPaths: detailResult.discoveredPaths,
    textSamples: detailResult.textSamples,
    metadata: detailResult.metadata,
    sourceSummary: detailResult.sourceSummary,
    notes: detailResult.notes,
  }
}
