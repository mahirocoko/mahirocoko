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
