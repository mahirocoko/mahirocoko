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

const buildSourceStatement = (sourceRecord: IBrandSourceRecord) => {
  if (sourceRecord.sourceType === "website") {
    const title = sourceRecord.metadata.title
    const description = sourceRecord.metadata.description

    if (title && description) {
      return `Website title and meta description suggest positioning around "${title}" and "${description}".`
    }

    if (title) {
      return `Website title suggests brand framing around "${title}".`
    }

    return sourceRecord.sourceSummary
  }

  if (sourceRecord.sourceType === "brand-docs") {
    const keywords = buildKeywordSummary(sourceRecord)

    if (keywords.length > 0) {
      return `Brand documents repeatedly emphasize: ${keywords.join(", ")}.`
    }

    return sourceRecord.sourceSummary
  }

  if (sourceRecord.sourceType === "screenshot-dir") {
    return sourceRecord.itemCount > 0
      ? `Visual references include ${sourceRecord.itemCount} image assets across ${sourceRecord.discoveredPaths.join(", ")}.`
      : sourceRecord.sourceSummary
  }

  if (sourceRecord.sourceType === "code-reference") {
    const keywords = buildKeywordSummary(sourceRecord)

    if (keywords.length > 0) {
      return `Code references suggest implementation patterns around ${keywords.join(", ")}.`
    }

    return sourceRecord.sourceSummary
  }

  return sourceRecord.sourceSummary
}

const buildSampleEvidence = (sourceRecord: IBrandSourceRecord, baseIndex: number): IBrandEvidenceRecord[] => {
  return sourceRecord.textSamples.slice(0, 2).map((sample, sampleIndex) => ({
    id: `evidence-${baseIndex}-sample-${sampleIndex + 1}`,
    category:
      sourceRecord.sourceType === "brand-docs"
        ? "voice"
        : sourceRecord.sourceType === "website"
          ? "interaction-behavior"
          : sourceRecord.sourceType === "code-reference"
            ? "design-system"
            : "visual-system",
    signalType: sourceRecord.sourceType === "brand-docs" ? "explicit" : "inferred",
    statement: `${sample.label}: ${sample.content}`,
    sourceIds: [sourceRecord.id],
    confidence: sourceRecord.sourceType === "brand-docs"
      ? sourceRecord.explicitnessBaseline
      : maxConfidence("low", sourceRecord.explicitnessBaseline),
  }))
}

export const buildBrandEvidenceRecords = (
  sourceInventory: IBrandSourceInventory,
): IBrandEvidenceRecord[] => {
  const evidenceRecords: IBrandEvidenceRecord[] = []

  sourceInventory.sourceRecords.forEach((sourceRecord, index) => {
    evidenceRecords.push({
      id: `evidence-${index + 1}`,
      category: pickCategory(sourceRecord.sourceType),
      signalType: sourceRecord.sourceType === "brand-docs" || sourceRecord.sourceType === "figma-url"
        ? "explicit"
        : "inferred",
      statement: buildSourceStatement(sourceRecord),
      sourceIds: [sourceRecord.id],
      confidence: sourceRecord.explicitnessBaseline,
    })

    evidenceRecords.push(...buildSampleEvidence(sourceRecord, index + 1))
  })

  return evidenceRecords
}
