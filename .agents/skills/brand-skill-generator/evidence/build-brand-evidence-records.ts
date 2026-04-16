import type {
  BrandSourceType,
  ConfidenceLevel,
  IBrandEvidenceRecord,
  IBrandSourceInventory,
  IBrandSourceRecord,
} from "../model/normalized-brand-model"

const stopWords = new Set([
  "the",
  "and",
  "for",
  "that",
  "with",
  "from",
  "this",
  "your",
  "have",
  "will",
  "you",
  "are",
  "our",
  "into",
  "about",
  "their",
  "they",
  "was",
  "but",
  "not",
  "use",
  "using",
  "into",
  "http",
  "https",
])

const confidenceRank: Record<ConfidenceLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

const maxConfidence = (left: ConfidenceLevel, right: ConfidenceLevel): ConfidenceLevel =>
  confidenceRank[left] >= confidenceRank[right] ? left : right

const unique = <T>(values: T[]) => [...new Set(values)]

const pickCategory = (sourceType: BrandSourceType): IBrandEvidenceRecord["category"] => {
  if (sourceType === "brand-docs") {
    return "voice"
  }

  if (sourceType === "website") {
    return "brand-identity"
  }

  if (sourceType === "figma-url") {
    return "visual-system"
  }

  if (sourceType === "code-reference") {
    return "design-system"
  }

  return "constraints"
}

const readJsonArray = (value: string | undefined) => {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
  } catch {
    return []
  }
}

const buildKeywordSummary = (sourceRecord: IBrandSourceRecord) => {
  const counts = new Map<string, number>()

  for (const sample of sourceRecord.textSamples) {
    const words = sample.content
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length >= 4 && !stopWords.has(word))

    for (const word of words) {
      counts.set(word, (counts.get(word) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([word]) => word)
}

const createEvidenceRecord = (
  id: string,
  category: IBrandEvidenceRecord["category"],
  signalType: IBrandEvidenceRecord["signalType"],
  statement: string,
  sourceRecord: IBrandSourceRecord,
  confidence = sourceRecord.explicitnessBaseline,
): IBrandEvidenceRecord => ({
  id,
  category,
  signalType,
  statement,
  sourceIds: [sourceRecord.id],
  confidence,
})

const buildWebsiteEvidence = (sourceRecord: IBrandSourceRecord, baseIndex: number) => {
  const title = sourceRecord.metadata.title
  const description = sourceRecord.metadata.description
  const headings = readJsonArray(sourceRecord.metadata.headings).slice(0, 4)
  const ctas = readJsonArray(sourceRecord.metadata.ctas).slice(0, 6)
  const evidenceRecords: IBrandEvidenceRecord[] = []

  if (title || description) {
    const titlePart = title ? `title "${title}"` : null
    const descriptionPart = description ? `description "${description}"` : null
    const parts = [titlePart, descriptionPart].filter(Boolean)

    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-website-brand`,
        "brand-identity",
        "inferred",
        `Website metadata frames the brand through ${parts.join(" and ")}.`,
        sourceRecord,
      ),
    )
  }

  if (headings.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-website-headings`,
        "voice",
        "inferred",
        `Website headings emphasize: ${headings.join(" | ")}.`,
        sourceRecord,
      ),
    )
  }

  if (ctas.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-website-ctas`,
        "interaction-behavior",
        "inferred",
        `Website calls to action include: ${ctas.join(", ")}.`,
        sourceRecord,
      ),
    )
  }

  return evidenceRecords
}

const buildBrandDocsEvidence = (sourceRecord: IBrandSourceRecord, baseIndex: number) => {
  const headings = readJsonArray(sourceRecord.metadata.headings).slice(0, 6)
  const keywords = buildKeywordSummary(sourceRecord)
  const designMdVisualTheme = sourceRecord.metadata.design_md_visual_theme
  const designMdKeyCharacteristics = readJsonArray(sourceRecord.metadata.design_md_key_characteristics).slice(0, 6)
  const designMdColorRoles = readJsonArray(sourceRecord.metadata.design_md_color_roles).slice(0, 8)
  const designMdTypographyScale = readJsonArray(sourceRecord.metadata.design_md_typography_scale).slice(0, 5)
  const designMdTypographyPrinciples = readJsonArray(sourceRecord.metadata.design_md_typography_principles).slice(0, 6)
  const designMdComponentPatterns = readJsonArray(sourceRecord.metadata.design_md_component_patterns).slice(0, 8)
  const designMdLayoutPrinciples = readJsonArray(sourceRecord.metadata.design_md_layout_principles).slice(0, 8)
  const designMdDos = readJsonArray(sourceRecord.metadata.design_md_dos).slice(0, 6)
  const designMdDonts = readJsonArray(sourceRecord.metadata.design_md_donts).slice(0, 6)
  const designMdResponsive = readJsonArray(sourceRecord.metadata.design_md_responsive).slice(0, 6)
  const directiveSamples = sourceRecord.textSamples
    .map((sample) => sample.content)
    .filter((content) => /\b(must|should|avoid|prefer|never)\b/i.test(content))
    .slice(0, 2)
  const evidenceRecords: IBrandEvidenceRecord[] = []

  if (headings.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-docs-identity`,
        "brand-identity",
        "explicit",
        `Brand documentation headings define themes around: ${headings.join(" | ")}.`,
        sourceRecord,
      ),
    )
  }

  if (keywords.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-docs-voice`,
        "voice",
        "explicit",
        `Brand documents repeatedly emphasize: ${keywords.join(", ")}.`,
        sourceRecord,
      ),
    )
  }

  if (designMdVisualTheme) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-design-md-visual-theme`,
        "visual-system",
        "explicit",
        `DESIGN.md visual theme guidance: ${designMdVisualTheme}`,
        sourceRecord,
      ),
    )
  }

  if (designMdKeyCharacteristics.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-design-md-characteristics`,
        "brand-identity",
        "explicit",
        `DESIGN.md key characteristics include: ${designMdKeyCharacteristics.join(" | ")}.`,
        sourceRecord,
      ),
    )
  }

  if (designMdColorRoles.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-design-md-colors`,
        "visual-system",
        "explicit",
        `DESIGN.md color roles define: ${designMdColorRoles.join(" | ")}.`,
        sourceRecord,
      ),
    )
  }

  if (designMdTypographyScale.length > 0 || designMdTypographyPrinciples.length > 0) {
    const typographyParts = [
      designMdTypographyScale.length > 0 ? `typography scale ${designMdTypographyScale.join(" | ")}` : null,
      designMdTypographyPrinciples.length > 0
        ? `typography principles ${designMdTypographyPrinciples.join(" | ")}`
        : null,
    ].filter(Boolean)

    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-design-md-typography`,
        "visual-system",
        "explicit",
        `DESIGN.md typography guidance captures ${typographyParts.join(" and ")}.`,
        sourceRecord,
      ),
    )
  }

  if (designMdComponentPatterns.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-design-md-components`,
        "design-system",
        "explicit",
        `DESIGN.md component patterns include: ${designMdComponentPatterns.join(" | ")}.`,
        sourceRecord,
      ),
    )
  }

  if (designMdLayoutPrinciples.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-design-md-layout`,
        "visual-system",
        "explicit",
        `DESIGN.md layout principles include: ${designMdLayoutPrinciples.join(" | ")}.`,
        sourceRecord,
      ),
    )
  }

  if (designMdResponsive.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-design-md-responsive`,
        "interaction-behavior",
        "explicit",
        `DESIGN.md responsive behavior includes: ${designMdResponsive.join(" | ")}.`,
        sourceRecord,
      ),
    )
  }

  if (designMdDos.length > 0 || designMdDonts.length > 0) {
    const constraintParts = [
      designMdDos.length > 0 ? `Do: ${designMdDos.join(" | ")}` : null,
      designMdDonts.length > 0 ? `Don't: ${designMdDonts.join(" | ")}` : null,
    ].filter(Boolean)

    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-design-md-constraints`,
        "constraints",
        "explicit",
        `DESIGN.md usage constraints include ${constraintParts.join(" ; ")}.`,
        sourceRecord,
      ),
    )
  }

  directiveSamples.forEach((directiveSample, directiveIndex) => {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-docs-constraint-${directiveIndex + 1}`,
        "constraints",
        "explicit",
        `Brand docs include directive language: ${directiveSample}`,
        sourceRecord,
      ),
    )
  })

  return evidenceRecords
}

const buildScreenshotEvidence = (sourceRecord: IBrandSourceRecord, baseIndex: number) => {
  const svgColors = readJsonArray(sourceRecord.metadata.svg_colors).slice(0, 8)
  const svgText = readJsonArray(sourceRecord.metadata.svg_text).slice(0, 6)
  const evidenceRecords: IBrandEvidenceRecord[] = []

  if (svgColors.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-screens-colors`,
        "visual-system",
        "inferred",
        `Visual references use colors such as ${svgColors.join(", ")}.`,
        sourceRecord,
      ),
    )
  }

  if (svgText.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-screens-text`,
        "brand-identity",
        "inferred",
        `Visible text inside visual references includes: ${svgText.join(" | ")}.`,
        sourceRecord,
      ),
    )
  }

  if (evidenceRecords.length === 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-screens-summary`,
        "visual-system",
        "inferred",
        `Visual references include ${sourceRecord.itemCount} image assets across ${sourceRecord.discoveredPaths.join(", ")}.`,
        sourceRecord,
      ),
    )
  }

  return evidenceRecords
}

const buildCodeReferenceEvidence = (sourceRecord: IBrandSourceRecord, baseIndex: number) => {
  const keywords = buildKeywordSummary(sourceRecord)
  const exportNames = readJsonArray(sourceRecord.metadata.export_names).slice(0, 10)
  const styleTokens = readJsonArray(sourceRecord.metadata.style_tokens).slice(0, 12)
  const evidenceRecords: IBrandEvidenceRecord[] = []

  if (exportNames.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-code-exports`,
        "design-system",
        "inferred",
        `Code references expose symbols such as ${exportNames.join(", ")}.`,
        sourceRecord,
      ),
    )
  }

  if (styleTokens.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-code-style-tokens`,
        "visual-system",
        "inferred",
        `Implementation references contain style tokens like ${styleTokens.join(", ")}.`,
        sourceRecord,
        maxConfidence("medium", sourceRecord.explicitnessBaseline),
      ),
    )
  }

  if (keywords.length > 0) {
    evidenceRecords.push(
      createEvidenceRecord(
        `evidence-${baseIndex}-code-keywords`,
        "design-system",
        "inferred",
        `Code references suggest implementation patterns around ${keywords.join(", ")}.`,
        sourceRecord,
      ),
    )
  }

  return evidenceRecords
}

const buildFigmaEvidence = (sourceRecord: IBrandSourceRecord, baseIndex: number) => {
  return [
    createEvidenceRecord(
      `evidence-${baseIndex}-figma-ref`,
      "visual-system",
      "explicit",
      `Figma reference recorded at ${sourceRecord.location}.`,
      sourceRecord,
      "high",
    ),
  ]
}

const buildSampleEvidence = (sourceRecord: IBrandSourceRecord, baseIndex: number): IBrandEvidenceRecord[] => {
  return sourceRecord.textSamples.slice(0, 2).map((sample, sampleIndex) =>
    createEvidenceRecord(
      `evidence-${baseIndex}-sample-${sampleIndex + 1}`,
      sourceRecord.sourceType === "brand-docs"
        ? "voice"
        : sourceRecord.sourceType === "website"
          ? "interaction-behavior"
          : sourceRecord.sourceType === "code-reference"
            ? "design-system"
            : "visual-system",
      sourceRecord.sourceType === "brand-docs" ? "explicit" : "inferred",
      `${sample.label}: ${sample.content}`,
      sourceRecord,
      sourceRecord.sourceType === "brand-docs"
        ? sourceRecord.explicitnessBaseline
        : maxConfidence("low", sourceRecord.explicitnessBaseline),
    ),
  )
}

const buildSourceEvidence = (sourceRecord: IBrandSourceRecord, baseIndex: number) => {
  if (sourceRecord.sourceType === "website") {
    return buildWebsiteEvidence(sourceRecord, baseIndex)
  }

  if (sourceRecord.sourceType === "brand-docs") {
    return buildBrandDocsEvidence(sourceRecord, baseIndex)
  }

  if (sourceRecord.sourceType === "screenshot-dir") {
    return buildScreenshotEvidence(sourceRecord, baseIndex)
  }

  if (sourceRecord.sourceType === "code-reference") {
    return buildCodeReferenceEvidence(sourceRecord, baseIndex)
  }

  if (sourceRecord.sourceType === "figma-url") {
    return buildFigmaEvidence(sourceRecord, baseIndex)
  }

  return [
    createEvidenceRecord(
      `evidence-${baseIndex}-summary`,
      pickCategory(sourceRecord.sourceType),
      "inferred",
      sourceRecord.sourceSummary,
      sourceRecord,
    ),
  ]
}

export const buildBrandEvidenceRecords = (
  sourceInventory: IBrandSourceInventory,
): IBrandEvidenceRecord[] => {
  const evidenceRecords: IBrandEvidenceRecord[] = []

  sourceInventory.sourceRecords.forEach((sourceRecord, index) => {
    evidenceRecords.push(...buildSourceEvidence(sourceRecord, index + 1))
    evidenceRecords.push(...buildSampleEvidence(sourceRecord, index + 1))
  })

  return unique(evidenceRecords.map((record) => JSON.stringify(record))).map((record) =>
    JSON.parse(record) as IBrandEvidenceRecord,
  )
}
