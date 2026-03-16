import fs from "node:fs"

import type {
  BrandSourceType,
  ConfidenceLevel,
  IBrandSkillCommand,
  IBrandSourceInventory,
  IBrandSourceRecord,
  SourceFreshness,
  SourceLocationType,
  SourcePathKind,
} from "../model/normalized-brand-model"

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

const buildSourceNotes = (sourceType: BrandSourceType, pathKind: SourcePathKind, exists: boolean) => {
  const notes: string[] = []

  if (!exists) {
    notes.push("Source is missing or not accessible from the current workspace.")
  }

  if (sourceType === "website") {
    notes.push("Website sources are treated as live-product signals until a fetch adapter is implemented.")
  }

  if (sourceType === "figma-url") {
    notes.push("Figma URLs are recorded now and will be resolved by a later adapter.")
  }

  if (pathKind === "directory") {
    notes.push("Directory sources will need recursive extraction in the next phase.")
  }

  return notes
}

const createSourceRecord = (
  sourceType: BrandSourceType,
  location: string,
  recordIndex: number,
): IBrandSourceRecord => {
  const locationType: SourceLocationType = isUrl(location) ? "url" : "path"
  const pathKind = buildPathKind(location)
  const exists = locationType === "url" ? true : pathKind !== "missing"
  const modifiedAt =
    locationType === "path" && exists ? fs.statSync(location).mtime.toISOString() : null
  const freshness = buildFreshness(modifiedAt ? new Date(modifiedAt) : null)

  return {
    id: `${sourceType}-${recordIndex}`,
    sourceType,
    locationType,
    location,
    pathKind,
    exists,
    modifiedAt,
    freshness,
    explicitnessBaseline: explicitnessBySourceType[sourceType],
    coverageEstimate: coverageBySourceType[sourceType],
    notes: buildSourceNotes(sourceType, pathKind, exists),
  }
}

export const buildSourceInventory = (command: IBrandSkillCommand): IBrandSourceInventory => {
  const sourceRecords: IBrandSourceRecord[] = []

  const sourceGroups: Array<{ sourceType: BrandSourceType; values: string[] }> = [
    {
      sourceType: "website",
      values: command.websiteUrls,
    },
    {
      sourceType: "brand-docs",
      values: command.docsPaths,
    },
    {
      sourceType: "screenshot-dir",
      values: command.screenshotPaths,
    },
    {
      sourceType: "code-reference",
      values: command.codePaths,
    },
    {
      sourceType: "figma-url",
      values: command.figmaUrls,
    },
  ]

  for (const sourceGroup of sourceGroups) {
    sourceGroup.values.forEach((value, index) => {
      sourceRecords.push(createSourceRecord(sourceGroup.sourceType, value, index + 1))
    })
  }

  return {
    brandName: command.brandName,
    destinationDir: command.destinationDir,
    sourceRecords,
  }
}
