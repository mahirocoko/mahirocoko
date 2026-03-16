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
  "website",
  "brand-docs",
  "https",
  "http",
  "www",
  "com",
  "org",
  "net",
  "title",
  "description",
  "headings",
  "calls",
  "action",
  "include",
  "includes",
  "such",
  "like",
  "using",
  "used",
  "through",
  "define",
  "defines",
  "around",
  "direction",
  "guide",
  "guidance",
])

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

const tokenize = (value: string) =>
  unique(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length >= 4 && !stopWords.has(word)),
  )

const collectSourceSignals = (
  sourceInventory: IBrandSourceInventory,
  sourceType: BrandSourceType,
  category: IBrandEvidenceRecord["category"],
) => {
  return sourceInventory.sourceRecords
    .filter((sourceRecord) => sourceRecord.sourceType === sourceType)
    .flatMap((sourceRecord) => {
      if (sourceType === "website" && category === "brand-identity") {
        return [
          sourceRecord.metadata.title,
          sourceRecord.metadata.description,
          ...readJsonArray(sourceRecord.metadata.headings),
        ].filter((value): value is string => Boolean(value))
      }

      if (sourceType === "website" && category === "voice") {
        return [
          ...readJsonArray(sourceRecord.metadata.headings),
          ...sourceRecord.textSamples.map((sample) => sample.content),
        ]
      }

      if (sourceType === "website" && category === "interaction-behavior") {
        return [
          ...readJsonArray(sourceRecord.metadata.ctas),
          ...sourceRecord.textSamples.map((sample) => sample.content),
        ]
      }

      if (sourceType === "brand-docs" && category === "brand-identity") {
        return [
          ...readJsonArray(sourceRecord.metadata.headings),
          ...sourceRecord.textSamples.map((sample) => sample.content),
        ]
      }

      if (sourceType === "brand-docs" && category === "voice") {
        return [
          ...readJsonArray(sourceRecord.metadata.headings),
          ...sourceRecord.textSamples.map((sample) => sample.content),
        ]
      }

      if (sourceType === "brand-docs" && category === "constraints") {
        return sourceRecord.textSamples
          .map((sample) => sample.content)
          .filter((content) => /\b(must|should|avoid|prefer|never)\b/i.test(content))
      }

      if (sourceType === "screenshot-dir" && category === "brand-identity") {
        return readJsonArray(sourceRecord.metadata.svg_text)
      }

      if (sourceType === "screenshot-dir" && category === "visual-system") {
        return readJsonArray(sourceRecord.metadata.svg_colors)
      }

      if (sourceType === "code-reference" && category === "design-system") {
        return [
          ...readJsonArray(sourceRecord.metadata.export_names),
          ...sourceRecord.textSamples.map((sample) => sample.content),
        ]
      }

      if (sourceType === "code-reference" && category === "visual-system") {
        return readJsonArray(sourceRecord.metadata.style_tokens)
      }

      return []
    })
}

const collectSourceTokens = (
  sourceInventory: IBrandSourceInventory,
  sourceType: BrandSourceType,
  category: IBrandEvidenceRecord["category"],
) => unique(collectSourceSignals(sourceInventory, sourceType, category).flatMap((signal) => tokenize(signal)))

const collectSourceIds = (sourceInventory: IBrandSourceInventory, sourceType: BrandSourceType) =>
  sourceInventory.sourceRecords
    .filter((sourceRecord) => sourceRecord.sourceType === sourceType)
    .map((sourceRecord) => sourceRecord.id)

const buildTokenOverlap = (leftTokens: string[], rightTokens: string[]) => {
  const overlappingTokens = leftTokens.filter((token) => rightTokens.includes(token))
  const overlapRatio = Math.min(leftTokens.length, rightTokens.length) === 0
    ? 0
    : overlappingTokens.length / Math.min(leftTokens.length, rightTokens.length)

  return {
    overlappingTokens,
    overlapRatio,
  }
}

const preferDocsDirection = (sourceInventory: IBrandSourceInventory) => {
  const docsRecords = sourceInventory.sourceRecords.filter((sourceRecord) => sourceRecord.sourceType === "brand-docs")
  const websiteRecords = sourceInventory.sourceRecords.filter((sourceRecord) => sourceRecord.sourceType === "website")
  const hasStaleDocs = docsRecords.some((sourceRecord) => sourceRecord.freshness === "stale" || sourceRecord.freshness === "aging")
  const hasCurrentWebsite = websiteRecords.some((sourceRecord) => sourceRecord.freshness === "current")

  if (hasStaleDocs && hasCurrentWebsite) {
    return {
      resolutionMode: "split-by-profile" as const,
      chosenDirection:
        "Keep explicit brand docs as the core source of truth, but let the live website shape product-ui and interaction guidance until docs are refreshed.",
      suggestedOverride:
        "If the website reflects a rebrand, refresh or replace the docs source so the split can collapse back into a single direction.",
    }
  }

  return {
    resolutionMode: "adopt" as const,
    chosenDirection: "Prefer explicit brand docs until stronger and intentionally-approved live-product evidence is available.",
    suggestedOverride:
      "If the live product is now the intended brand truth, refresh with newer docs or explicitly bless the website as the primary source.",
  }
}

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

const buildConflicts = (
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
): IBrandConflictRecord[] => {
  if (evidenceRecords.length === 0) {
    return []
  }

  const conflicts: IBrandConflictRecord[] = []
  const docsIds = collectSourceIds(sourceInventory, "brand-docs")
  const websiteIds = collectSourceIds(sourceInventory, "website")

  if (docsIds.length === 0 || websiteIds.length === 0) {
    return conflicts
  }

  const docsIdentityTokens = collectSourceTokens(sourceInventory, "brand-docs", "brand-identity")
  const websiteIdentityTokens = collectSourceTokens(sourceInventory, "website", "brand-identity")
  const identityOverlap = buildTokenOverlap(docsIdentityTokens, websiteIdentityTokens)

  if (
    docsIdentityTokens.length >= 4 &&
    websiteIdentityTokens.length >= 3 &&
    identityOverlap.overlapRatio < 0.15
  ) {
    const resolution = preferDocsDirection(sourceInventory)

    conflicts.push({
      id: "brand-identity-docs-vs-website-drift",
      summary:
        "Explicit brand-doc identity signals and website identity signals diverge with very little shared language.",
      competingSourceIds: unique([...docsIds, ...websiteIds]),
      resolutionMode: resolution.resolutionMode,
      chosenDirection: resolution.chosenDirection,
      suggestedOverride: resolution.suggestedOverride,
    })
  }

  const docsVoiceTokens = collectSourceTokens(sourceInventory, "brand-docs", "voice")
  const websiteVoiceTokens = unique([
    ...collectSourceTokens(sourceInventory, "website", "voice"),
    ...collectSourceTokens(sourceInventory, "website", "interaction-behavior"),
  ])
  const voiceOverlap = buildTokenOverlap(docsVoiceTokens, websiteVoiceTokens)

  if (
    docsVoiceTokens.length >= 4 &&
    websiteVoiceTokens.length >= 3 &&
    voiceOverlap.overlapRatio < 0.12
  ) {
    conflicts.push({
      id: "voice-docs-vs-website-copy-drift",
      summary:
        "Live website copy and CTA language do not line up well with the explicit voice signals found in brand docs.",
      competingSourceIds: unique([...docsIds, ...websiteIds]),
      resolutionMode: "split-by-profile",
      chosenDirection:
        "Use explicit brand docs for core voice and positioning, but allow live website vocabulary to influence product-ui interaction copy until the docs catch up.",
      suggestedOverride:
        "If the live website is intentionally redefining tone, refresh the docs source or explicitly promote the website copy posture as approved voice guidance.",
    })
  }

  return conflicts
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
