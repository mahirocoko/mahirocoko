import type {
  BrandSourceType,
  ConfidenceLevel,
  IBrandConflictRecord,
  IBrandEvidenceRecord,
  IBrandSourceInventory,
  INormalizedBrandModel,
  IBrandRuleRecord,
} from "../model/normalized-brand-model"

const confidenceRank: Record<ConfidenceLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

const sourceTypeWeight: Record<BrandSourceType, number> = {
  "brand-docs": 5,
  website: 4,
  "figma-url": 4,
  "code-reference": 3,
  "screenshot-dir": 2,
}

const confidenceWeight: Record<ConfidenceLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

const buildConfidenceFromEvidence = (evidenceRecords: IBrandEvidenceRecord[]): ConfidenceLevel => {
  const totalScore = evidenceRecords.reduce(
    (sum, evidenceRecord) => sum + confidenceWeight[evidenceRecord.confidence],
    0,
  )

  if (totalScore >= 12) {
    return "high"
  }

  if (totalScore >= 5) {
    return "medium"
  }

  return "low"
}

const inferConfidence = (score: number): ConfidenceLevel => {
  if (score >= 7) {
    return "high"
  }

  if (score >= 4) {
    return "medium"
  }

  return "low"
}

const unique = <T>(values: T[]) => [...new Set(values)]
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
  "about",
  "into",
  "without",
  "when",
  "what",
  "where",
  "their",
  "them",
  "brand",
  "skill",
  "generator",
])

const createRuleRecord = (
  id: string,
  title: string,
  summary: string,
  sourceIds: string[],
  confidence: ConfidenceLevel,
  rationale: string,
): IBrandRuleRecord => ({ id, title, summary, sourceIds, confidence, rationale })

const buildSourceTypeMap = (sourceInventory: IBrandSourceInventory) => {
  return new Map(sourceInventory.sourceRecords.map((sourceRecord) => [sourceRecord.id, sourceRecord.sourceType]))
}

const scoreEvidence = (
  evidenceRecord: IBrandEvidenceRecord,
  sourceTypeMap: Map<string, BrandSourceType>,
) => {
  const sourceTypes = unique(
    evidenceRecord.sourceIds
      .map((sourceId) => sourceTypeMap.get(sourceId))
      .filter((sourceType): sourceType is BrandSourceType => Boolean(sourceType)),
  )

  const sourceScore = sourceTypes.reduce((sum, sourceType) => sum + sourceTypeWeight[sourceType], 0)
  const score =
    sourceScore +
    confidenceWeight[evidenceRecord.confidence] +
    (evidenceRecord.signalType === "explicit" ? 2 : 0)

  return {
    score,
    sourceTypes,
  }
}

const buildCategoryRules = (
  category: IBrandEvidenceRecord["category"],
  fallbackTitle: string,
  fallbackSummary: string,
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
): IBrandRuleRecord[] => {
  const categoryEvidence = evidenceRecords.filter((evidenceRecord) => evidenceRecord.category === category)

  if (categoryEvidence.length === 0) {
    return [
      createRuleRecord(
        `${category}-fallback`,
        fallbackTitle,
        fallbackSummary,
        [],
        "low",
        "No direct evidence was extracted for this category yet.",
      ),
    ]
  }

  const sourceTypeMap = buildSourceTypeMap(sourceInventory)
  const rankedEvidence = categoryEvidence
    .map((evidenceRecord) => ({
      evidenceRecord,
      ...scoreEvidence(evidenceRecord, sourceTypeMap),
    }))
    .sort((left, right) => right.score - left.score)

  return rankedEvidence.slice(0, 3).map(({ evidenceRecord, score, sourceTypes }, index) =>
    createRuleRecord(
      `${category}-${index + 1}`,
      index === 0 ? fallbackTitle : `${fallbackTitle} ${index + 1}`,
      evidenceRecord.statement,
      evidenceRecord.sourceIds,
      inferConfidence(score),
      `Weighted from ${sourceTypes.join(", ") || "unknown sources"} with ${evidenceRecord.signalType} evidence.`,
    ),
  )
}

const buildProfileRules = (
  profileName: "design-system" | "marketing" | "product-ui" | "dashboard",
  category: IBrandEvidenceRecord["category"],
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
) => {
  return buildCategoryRules(
    category,
    `${profileName} guidance`,
    `No direct evidence was extracted for the ${profileName} profile yet.`,
    evidenceRecords,
    sourceInventory,
  )
}

const extractKeywords = (value: string) =>
  unique(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length >= 4 && !stopWords.has(word)),
  )

const buildConflicts = (
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
): IBrandConflictRecord[] => {
  const sourceTypeMap = buildSourceTypeMap(sourceInventory)
  const websiteIdentityEvidence = evidenceRecords.filter((evidenceRecord) =>
    evidenceRecord.sourceIds.some((sourceId) => sourceTypeMap.get(sourceId) === "website"),
  )
  const brandDocsEvidence = evidenceRecords.filter((evidenceRecord) =>
    evidenceRecord.sourceIds.some((sourceId) => sourceTypeMap.get(sourceId) === "brand-docs"),
  )

  if (websiteIdentityEvidence.length === 0 || brandDocsEvidence.length === 0) {
    return []
  }

  const websiteKeywords = unique(websiteIdentityEvidence.flatMap((evidenceRecord) => extractKeywords(evidenceRecord.statement)))
  const docsKeywords = unique(brandDocsEvidence.flatMap((evidenceRecord) => extractKeywords(evidenceRecord.statement)))
  const overlappingKeywords = websiteKeywords.filter((keyword) => docsKeywords.includes(keyword))

  if (overlappingKeywords.length > 0) {
    return []
  }

  return [
    {
      id: "website-vs-docs-keyword-conflict",
      summary: "Website positioning signals and brand-doc language share no obvious keyword overlap.",
      competingSourceIds: unique([
        ...websiteIdentityEvidence.flatMap((evidenceRecord) => evidenceRecord.sourceIds),
        ...brandDocsEvidence.flatMap((evidenceRecord) => evidenceRecord.sourceIds),
      ]),
      resolutionMode: "adopt",
      chosenDirection: "Prefer explicit brand docs until stronger live-product evidence is available.",
      suggestedOverride:
        "If the live product is the true source of brand direction now, refresh with newer docs or approve the website as the primary source.",
    },
  ]
}

export const buildNormalizedBrandModelScaffold = (
  brandName: string,
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
): INormalizedBrandModel => {
  const overallConfidence = buildConfidenceFromEvidence(evidenceRecords)
  const conflicts = buildConflicts(evidenceRecords, sourceInventory)

  return {
    brandIdentity: buildCategoryRules(
      "brand-identity",
      `${brandName} brand identity`,
      "Core brand identity extraction remains light until richer source analysis lands.",
      evidenceRecords,
      sourceInventory,
    ),
    voice: buildCategoryRules(
      "voice",
      "Voice direction",
      "Voice rules will deepen as explicit copy extraction improves.",
      evidenceRecords,
      sourceInventory,
    ),
    visualSystem: buildCategoryRules(
      "visual-system",
      "Visual system direction",
      "Visual system rules will deepen as visual adapters expand.",
      evidenceRecords,
      sourceInventory,
    ),
    interactionBehavior: buildCategoryRules(
      "interaction-behavior",
      "Interaction behavior direction",
      "Interaction behavior rules will deepen as website and product references are parsed more deeply.",
      evidenceRecords,
      sourceInventory,
    ),
    designSystem: buildCategoryRules(
      "design-system",
      "Design system direction",
      "Design-system posture will deepen as code and component references are parsed more deeply.",
      evidenceRecords,
      sourceInventory,
    ),
    profiles: [
      {
        profileName: "design-system",
        confidence: overallConfidence,
        rules: buildProfileRules("design-system", "design-system", evidenceRecords, sourceInventory),
      },
      {
        profileName: "marketing",
        confidence: overallConfidence,
        rules: buildProfileRules("marketing", "brand-identity", evidenceRecords, sourceInventory),
      },
      {
        profileName: "product-ui",
        confidence: overallConfidence,
        rules: buildProfileRules("product-ui", "interaction-behavior", evidenceRecords, sourceInventory),
      },
      {
        profileName: "dashboard",
        confidence: overallConfidence,
        rules: buildProfileRules("dashboard", "constraints", evidenceRecords, sourceInventory),
      },
    ],
    evidence: evidenceRecords,
    conflicts,
    overallConfidence,
  }
}
