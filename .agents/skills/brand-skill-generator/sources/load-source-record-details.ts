import fs from "node:fs"
import path from "node:path"

import type {
  BrandSourceRole,
  BrandSourceType,
  ConfidenceLevel,
  IBrandSourceRecord,
  SourceFreshness,
  SourceLocationType,
  SourcePathKind,
} from "../model/normalized-brand-model"
import {
  collectTextSamples,
  extractCodeExportNames,
  extractHtmlCtas,
  extractHtmlHeadings,
  extractMarkdownHeadings,
  extractStyleTokens,
  extractSvgColors,
  extractSvgText,
  findFirstFileByBasename,
  isImageFile,
  isLikelyTextFile,
  readFileText,
  summarizeFileTypes,
  toRelativePath,
  walkDirectoryFiles,
} from "./source-file-utils"

const isUrl = (value: string) => /^https?:\/\//.test(value)

const readJsonString = (value: unknown) => JSON.stringify(value)

const parseMarkdownSections = (rawText: string) => {
  const lines = rawText.split(/\r?\n/)
  const sections: Array<{ title: string; level: number; lines: string[] }> = []
  let currentSection: { title: string; level: number; lines: string[] } | null = null

  for (const line of lines) {
    const headingMatch = line.match(/^(#{2,3})\s+(.*)$/)

    if (headingMatch) {
      const hashes = headingMatch[1] ?? ""
      const title = headingMatch[2] ?? ""

      currentSection = {
        title: title.trim(),
        level: hashes.length,
        lines: [],
      }
      sections.push(currentSection)
      continue
    }

    if (currentSection) {
      currentSection.lines.push(line)
    }
  }

  return sections
}

const collectSectionTreeLines = (
  sections: Array<{ title: string; level: number; lines: string[] }>,
  matcher: RegExp,
) => {
  const rootIndex = sections.findIndex((section) => matcher.test(section.title))

  if (rootIndex === -1) {
    return []
  }

  const rootSection = sections[rootIndex]

  if (!rootSection) {
    return []
  }

  const collectedLines = [...rootSection.lines]

  for (let index = rootIndex + 1; index < sections.length; index += 1) {
    const section = sections[index]

    if (!section) {
      continue
    }

    if (section.level <= rootSection.level) {
      break
    }

    collectedLines.push(`### ${section.title}`)
    collectedLines.push(...section.lines)
  }

  return collectedLines
}

const normalizeInlineCode = (value: string) => value.replace(/`([^`]+)`/g, "$1").trim()

const collectBulletItems = (lines: string[]) =>
  lines
    .map((line) => line.trim())
    .filter((line) => /^-\s+/.test(line))
    .map((line) => normalizeInlineCode(line.replace(/^-\s+/, "")))

const collectParagraphs = (lines: string[]) =>
  lines
    .join("\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)

const collectTableRows = (lines: string[]) => {
  return lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"))
    .filter((line) => !/^\|[-\s|]+\|$/.test(line))
    .map((line) =>
      line
        .slice(1, -1)
        .split("|")
        .map((cell) => normalizeInlineCode(cell.trim())),
    )
}

const buildSectionKey = (title: string) =>
  title
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const prioritizeDesignMdFile = (filePaths: string[]) => {
  const designMdFiles = filePaths.filter((filePath) => path.basename(filePath) === "DESIGN.md")
  const otherFiles = filePaths.filter((filePath) => path.basename(filePath) !== "DESIGN.md")

  return [...designMdFiles, ...otherFiles]
}

const ensureDesignMdIncluded = (rootDir: string, filePaths: string[]) => {
  const prioritizedFiles = prioritizeDesignMdFile(filePaths)
  const existingDesignMdFile = prioritizedFiles.find((filePath) => path.basename(filePath) === "DESIGN.md")

  if (existingDesignMdFile) {
    return prioritizedFiles
  }

  const discoveredDesignMdFile = findFirstFileByBasename(rootDir, "DESIGN.md")

  return discoveredDesignMdFile ? [discoveredDesignMdFile, ...prioritizedFiles] : prioritizedFiles
}

const extractDesignMdMetadata = (rawText: string) => {
  const sections = parseMarkdownSections(rawText)
  const getSection = (matcher: RegExp) => sections.find((section) => matcher.test(section.title))
  const visualThemeSection = getSection(/visual theme|atmosphere/i)
  const typographyLines = collectSectionTreeLines(sections, /typography rules/i)
  const componentLines = collectSectionTreeLines(sections, /component stylings/i)
  const layoutLines = collectSectionTreeLines(sections, /layout principles/i)
  const responsiveLines = collectSectionTreeLines(sections, /responsive behavior/i)
  const dosSection = getSection(/^do$/i)
  const dontsSection = getSection(/^don'?ts$/i)

  const keyCharacteristicsSection = getSection(/key characteristics/i)
  const colorSections = sections.filter((section) => section.level === 3 && /primary|accent|interactive|neutral|surface|shadow|brand|text|premium/i.test(section.title))
  const typographyPrinciplesSection = getSection(/^principles$/i)

  const typographyRows = collectTableRows(typographyLines).slice(1, 7)
  const componentBullets = collectBulletItems(componentLines).slice(0, 10)
  const layoutBullets = collectBulletItems(layoutLines).slice(0, 10)
  const responsiveBullets = collectBulletItems(responsiveLines).slice(0, 10)
  const colorRoleBullets = colorSections.flatMap((section) =>
    collectBulletItems(section.lines).map((item) => `${section.title}: ${item}`),
  )

  const metadata: Record<string, string> = {
    design_md_detected: "true",
    design_md_section_keys: readJsonString(sections.map((section) => buildSectionKey(section.title))),
  }

  const visualThemeParagraph = visualThemeSection ? collectParagraphs(visualThemeSection.lines)[0] : null
  if (visualThemeParagraph) {
    metadata.design_md_visual_theme = visualThemeParagraph
  }

  const keyCharacteristics = keyCharacteristicsSection ? collectBulletItems(keyCharacteristicsSection.lines).slice(0, 8) : []
  if (keyCharacteristics.length > 0) {
    metadata.design_md_key_characteristics = readJsonString(keyCharacteristics)
  }

  if (colorRoleBullets.length > 0) {
    metadata.design_md_color_roles = readJsonString(colorRoleBullets.slice(0, 12))
  }

  if (typographyRows.length > 0) {
    metadata.design_md_typography_scale = readJsonString(
      typographyRows.map((cells) => cells.filter(Boolean).join(" | ")),
    )
  }

  const typographyPrinciples = typographyPrinciplesSection
    ? collectBulletItems(typographyPrinciplesSection.lines).slice(0, 8)
    : []
  if (typographyPrinciples.length > 0) {
    metadata.design_md_typography_principles = readJsonString(typographyPrinciples)
  }

  if (componentBullets.length > 0) {
    metadata.design_md_component_patterns = readJsonString(componentBullets)
  }

  if (layoutBullets.length > 0) {
    metadata.design_md_layout_principles = readJsonString(layoutBullets)
  }

  const dos = dosSection ? collectBulletItems(dosSection.lines).slice(0, 8) : []
  if (dos.length > 0) {
    metadata.design_md_dos = readJsonString(dos)
  }

  const donts = dontsSection ? collectBulletItems(dontsSection.lines).slice(0, 8) : []
  if (donts.length > 0) {
    metadata.design_md_donts = readJsonString(donts)
  }

  if (responsiveBullets.length > 0) {
    metadata.design_md_responsive = readJsonString(responsiveBullets)
  }

  return metadata
}

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
    const headings = extractHtmlHeadings(html).slice(0, 6)
    const ctas = extractHtmlCtas(html).slice(0, 8)
    const strippedText = stripHtml(html).slice(0, 560)

    if (titleMatch?.[1]) {
      metadata.title = titleMatch[1].replace(/\s+/g, " ").trim()
    }

    if (descriptionMatch?.[1]) {
      metadata.description = descriptionMatch[1].replace(/\s+/g, " ").trim()
    }

    if (headings.length > 0) {
      metadata.headings = JSON.stringify(headings)
    }

    if (ctas.length > 0) {
      metadata.ctas = JSON.stringify(ctas)
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
  const scannedFiles =
    pathKind === "directory"
      ? walkDirectoryFiles(location, { includeImages: true, maxFiles: 60 })
      : [location]
  const allFiles =
    sourceType === "brand-docs" && pathKind === "directory"
      ? ensureDesignMdIncluded(location, scannedFiles)
      : sourceType === "brand-docs"
        ? prioritizeDesignMdFile(scannedFiles)
        : scannedFiles
  const discoveredPaths = allFiles.slice(0, 8).map((filePath) => toRelativePath(resolvedLocation, filePath))

  if (sourceType === "screenshot-dir") {
    const imageFiles = allFiles.filter((filePath) => isImageFile(filePath))
    const svgFiles = imageFiles.filter((filePath) => path.extname(filePath).toLowerCase() === ".svg")
    const svgColors = svgFiles.flatMap((filePath) => extractSvgColors(readFileText(filePath))).slice(0, 12)
    const svgText = svgFiles.flatMap((filePath) => extractSvgText(readFileText(filePath))).slice(0, 12)
    metadata.image_count = String(imageFiles.length)
    metadata.file_types = JSON.stringify(summarizeFileTypes(imageFiles))

    if (svgColors.length > 0) {
      metadata.svg_colors = JSON.stringify(svgColors)
    }

    if (svgText.length > 0) {
      metadata.svg_text = JSON.stringify(svgText)
    }

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

  if (sourceType === "brand-docs") {
    const headings = allFiles
      .filter((filePath) => isLikelyTextFile(filePath))
      .flatMap((filePath) => {
        const rawText = readFileText(filePath)
        return [...extractMarkdownHeadings(rawText), ...extractHtmlHeadings(rawText)]
      })
      .slice(0, 10)

    if (headings.length > 0) {
      metadata.headings = JSON.stringify(headings)
    }

    const designMdFile = allFiles.find((filePath) => path.basename(filePath) === "DESIGN.md")

    if (designMdFile) {
      const rawText = readFileText(designMdFile)
      Object.assign(metadata, extractDesignMdMetadata(rawText))
    }
  }

  if (sourceType === "code-reference") {
    const exportNames = allFiles
      .filter((filePath) => /\.(ts|tsx|js|jsx)$/.test(path.extname(filePath).toLowerCase()))
      .flatMap((filePath) => extractCodeExportNames(readFileText(filePath)))
      .slice(0, 20)
    const styleTokens = allFiles
      .filter((filePath) => isLikelyTextFile(filePath))
      .flatMap((filePath) => extractStyleTokens(readFileText(filePath)))
      .slice(0, 20)

    if (exportNames.length > 0) {
      metadata.export_names = JSON.stringify(exportNames)
    }

    if (styleTokens.length > 0) {
      metadata.style_tokens = JSON.stringify(styleTokens)
    }
  }

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
  sourceRole: BrandSourceRole | null,
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
    sourceRole,
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
