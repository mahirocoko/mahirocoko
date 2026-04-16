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
const genericCtaLabels = new Set(["learn more", "read more", "submit", "click here", "view more", "more info"])
const identityMetaStopWords = new Set([
  "phase",
  "plan",
  "implementation",
  "objective",
  "source",
  "bundle",
  "delivery",
  "status",
  "approved",
  "draft",
  "summary",
  "project",
  "single",
  "multiple",
  "inputs",
  "weight",
  "rendering",
  "scaffolding",
  "ingestion",
  "extraction",
  "synthesis",
  "conflict",
  "spec",
  "docs",
  "design",
  "date",
  "local",
  "flexible",
  "sources",
  "strategy",
  "current",
  "example",
  "domain",
])
const voiceMetaStopWords = new Set([
  "phase",
  "plan",
  "implementation",
  "objective",
  "source",
  "bundle",
  "delivery",
  "status",
  "approved",
  "draft",
  "summary",
  "project",
  "single",
  "multiple",
  "inputs",
  "weight",
  "rendering",
  "scaffolding",
  "ingestion",
  "extraction",
  "synthesis",
  "conflict",
  "spec",
  "docs",
  "design",
])
const infraExportPrefixes = ["build", "run", "parse", "print", "resolve", "detect", "collect", "read", "render", "format", "create"]
const infraExportSuffixes = ["Command", "Report", "Inventory", "Model", "Mode", "Type", "Freshness", "Confidence", "Resolution", "Level"]

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

const normalizePhrase = (value: string) => value.replace(/\s+/g, " ").trim()

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

      if (sourceType === "brand-docs" && category === "visual-system") {
        return [
          sourceRecord.metadata.design_md_visual_theme,
          ...readJsonArray(sourceRecord.metadata.design_md_color_roles),
          ...readJsonArray(sourceRecord.metadata.design_md_typography_scale),
          ...readJsonArray(sourceRecord.metadata.design_md_typography_principles),
          ...readJsonArray(sourceRecord.metadata.design_md_layout_principles),
        ].filter((value): value is string => Boolean(value))
      }

      if (sourceType === "brand-docs" && category === "design-system") {
        return [
          ...readJsonArray(sourceRecord.metadata.design_md_component_patterns),
          ...readJsonArray(sourceRecord.metadata.design_md_layout_principles),
          ...readJsonArray(sourceRecord.metadata.design_md_responsive),
          ...readJsonArray(sourceRecord.metadata.design_md_dos).map((value) => `Do: ${value}`),
          ...readJsonArray(sourceRecord.metadata.design_md_donts).map((value) => `Don't: ${value}`),
        ]
      }

      if (sourceType === "brand-docs" && category === "constraints") {
        return [
          ...readJsonArray(sourceRecord.metadata.design_md_dos).map((value) => `Do: ${value}`),
          ...readJsonArray(sourceRecord.metadata.design_md_donts).map((value) => `Don't: ${value}`),
          ...sourceRecord.textSamples
            .map((sample) => sample.content)
            .filter((content) => /\b(must|should|avoid|prefer|never)\b/i.test(content)),
        ]
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

const collectSourceMetadataValues = (
  sourceInventory: IBrandSourceInventory,
  sourceType: BrandSourceType,
  key: string,
) =>
  sourceInventory.sourceRecords
    .filter((sourceRecord) => sourceRecord.sourceType === sourceType)
    .flatMap((sourceRecord) => readJsonArray(sourceRecord.metadata[key]))

const collectSourceMetadataScalars = (
  sourceInventory: IBrandSourceInventory,
  sourceType: BrandSourceType,
  key: string,
) =>
  sourceInventory.sourceRecords
    .filter((sourceRecord) => sourceRecord.sourceType === sourceType)
    .map((sourceRecord) => sourceRecord.metadata[key])
    .filter((value): value is string => Boolean(value))

const collectSourceSamples = (sourceInventory: IBrandSourceInventory, sourceType: BrandSourceType) =>
  sourceInventory.sourceRecords
    .filter((sourceRecord) => sourceRecord.sourceType === sourceType)
    .flatMap((sourceRecord) => sourceRecord.textSamples.map((sample) => sample.content))

const buildKeywordCounts = (values: string[]) => {
  const counts = new Map<string, number>()

  for (const value of values) {
    for (const token of tokenize(value)) {
      counts.set(token, (counts.get(token) ?? 0) + 1)
    }
  }

  return counts
}

const pickTopKeywords = (values: string[], maxKeywords: number, blockedWords?: Set<string>) => {
  return [...buildKeywordCounts(values).entries()]
    .filter(([token]) => !blockedWords?.has(token))
    .sort((left, right) => right[1] - left[1])
    .slice(0, maxKeywords)
    .map(([token]) => token)
}

const quoteList = (values: string[]) => values.map((value) => `"${value}"`).join(", ")

const isLikelyMetaPhrase = (value: string) => {
  const normalizedValue = normalizePhrase(value)

  if (!normalizedValue) {
    return true
  }

  return /(implementation plan|source spec|approved design draft|weighted synthesis|bundle rendering|phase \d|objective|delivery strategy|v1 cut line|status:)/i.test(
    normalizedValue,
  )
}

const pickMeaningfulPhrases = (
  values: string[],
  maxPhrases: number,
  options?: {
    minWords?: number
    maxWords?: number
    allowAllCaps?: boolean
  },
) => {
  const minWords = options?.minWords ?? 1
  const maxWords = options?.maxWords ?? 12
  const allowAllCaps = options?.allowAllCaps ?? true

  return unique(
    values
      .map((value) => normalizePhrase(value))
      .filter((value) => !isLikelyMetaPhrase(value))
      .filter((value) => value.length > 0 && value.length <= 120)
      .filter((value) => {
        const words = value.split(/\s+/).filter(Boolean)

        if (words.length < minWords || words.length > maxWords) {
          return false
        }

        if (allowAllCaps) {
          return true
        }

        return value !== value.toUpperCase()
      }),
  ).slice(0, maxPhrases)
}

const pickRepresentativeSentence = (values: string[]) => {
  const phrases = pickMeaningfulPhrases(values, 6, { minWords: 4, maxWords: 18 })

  return phrases
    .sort((left, right) => right.length - left.length)
    .find((phrase) => /[a-z]/i.test(phrase)) ?? null
}

const extractSentences = (values: string[]) => {
  return unique(
    values
      .flatMap((value) => value.split(/(?<=[.!?])\s+/))
      .map((value) => normalizePhrase(value))
      .filter(Boolean),
  )
}

const extractGuardrailSnippet = (values: string[]) => {
  for (const value of values) {
    const normalizedValue = normalizePhrase(value)
    const matchedFragment = normalizedValue.match(/\b(avoid|never|must|without)\b[^.?!]*/i)

    if (matchedFragment?.[0]) {
      return normalizePhrase(matchedFragment[0])
    }
  }

  return null
}

const isDarkHexColor = (value: string) => {
  const normalized = value.trim().replace("#", "")

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return false
  }

  const red = parseInt(normalized.slice(0, 2), 16)
  const green = parseInt(normalized.slice(2, 4), 16)
  const blue = parseInt(normalized.slice(4, 6), 16)
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue

  return luminance < 110
}

const isBrightHexColor = (value: string) => {
  const normalized = value.trim().replace("#", "")

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return false
  }

  const red = parseInt(normalized.slice(0, 2), 16)
  const green = parseInt(normalized.slice(2, 4), 16)
  const blue = parseInt(normalized.slice(4, 6), 16)
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue

  return luminance > 180
}

const isLikelySystemExport = (value: string) => {
  if (infraExportPrefixes.some((prefix) => value.startsWith(prefix))) {
    return false
  }

  if (infraExportSuffixes.some((suffix) => value.endsWith(suffix))) {
    return false
  }

  return /^[A-Z]/.test(value) || /(Token|Theme|Palette|Typography|Button|Input|Card|Modal|Badge|Avatar|Icon)/.test(value)
}

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

const buildProfileFallbackRules = (
  profileName: "design-system" | "marketing" | "product-ui" | "dashboard",
  category: IBrandEvidenceRecord["category"],
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
) =>
  buildCategoryRules(
    category,
    `${profileName} guidance`,
    `No direct evidence was extracted for the ${profileName} profile yet.`,
    evidenceRecords,
    sourceInventory,
  )

const combineRuleSourceIds = (rules: IBrandRuleRecord[]) =>
  unique(rules.flatMap((rule) => rule.sourceIds))

const findRuleById = (rules: IBrandRuleRecord[], id: string) => rules.find((rule) => rule.id === id)

const buildVoiceRules = (
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
) => {
  const fallbackRules = buildCategoryRules(
    "voice",
    "Voice direction",
    "Voice rules will deepen as explicit copy extraction improves.",
    evidenceRecords,
    sourceInventory,
  )
  const docsIds = collectSourceIds(sourceInventory, "brand-docs")
  const screenshotIds = collectSourceIds(sourceInventory, "screenshot-dir")
  const websiteIds = collectSourceIds(sourceInventory, "website")
  const docsVoiceSignals = [
    ...collectSourceMetadataValues(sourceInventory, "brand-docs", "headings"),
    ...collectSourceSamples(sourceInventory, "brand-docs"),
  ]
  const screenshotVoiceSignals = collectSourceSignals(sourceInventory, "screenshot-dir", "brand-identity")
  const websiteCtas = collectSourceMetadataValues(sourceInventory, "website", "ctas").slice(0, 4)
  const docsConstraints = collectSourceSignals(sourceInventory, "brand-docs", "constraints").slice(0, 2)
  const voiceAnchorSignals = screenshotVoiceSignals.length > 0 ? screenshotVoiceSignals : docsVoiceSignals
  const voiceKeywords = pickTopKeywords(voiceAnchorSignals, 6, voiceMetaStopWords)
  const rules: IBrandRuleRecord[] = []

  if (voiceKeywords.length > 0) {
    rules.push(
      createRuleRecord(
        "voice-preferred-language",
        "Voice anchor",
        `Anchor copy around recurring brand language such as ${voiceKeywords.join(", ")}.`,
        unique([...docsIds, ...screenshotIds]),
        docsIds.length > 0 && screenshotIds.length > 0 ? "high" : docsIds.length > 0 ? "high" : "medium",
        "Synthesized from repeated terms in explicit brand-doc language, then grounded with visible screenshot copy when available.",
      ),
    )
  }

  if (websiteCtas.length > 0) {
    rules.push(
      createRuleRecord(
        "voice-cta-posture",
        "CTA posture",
        `Keep calls to action short and direct. Current live examples include ${quoteList(websiteCtas)}.`,
        websiteIds,
        "medium",
        "Derived from CTA labels extracted from the live website.",
      ),
    )
  }

  const genericCtas = websiteCtas.filter((cta) => genericCtaLabels.has(cta.toLowerCase()))

  if (genericCtas.length > 0) {
    rules.push(
      createRuleRecord(
        "voice-avoid-generic-cta",
        "Avoid generic fallback copy",
        `Avoid overusing generic CTA language such as ${quoteList(genericCtas)} when stronger brand-specific verbs are available.`,
        websiteIds,
        "medium",
        "Flagged from live CTA extraction because the current labels are generic and should not automatically become the long-term voice rule.",
      ),
    )
  } else if (docsConstraints.length > 0) {
    rules.push(
      createRuleRecord(
        "voice-guardrails",
        "Voice guardrails",
        `Honor explicit brand directives from docs, including guidance like: ${docsConstraints.join(" | ")}.`,
        docsIds,
        "high",
        "Pulled from directive-style language found in brand docs.",
      ),
    )
  }

  return rules.length > 0 ? rules.slice(0, 3) : fallbackRules
}

const buildBrandIdentityRules = (
  brandName: string,
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
) => {
  const fallbackRules = buildCategoryRules(
    "brand-identity",
    `${brandName} brand identity`,
    "Core brand identity extraction remains light until richer source analysis lands.",
    evidenceRecords,
    sourceInventory,
  )
  const docsIds = collectSourceIds(sourceInventory, "brand-docs")
  const websiteIds = collectSourceIds(sourceInventory, "website")
  const screenshotIds = collectSourceIds(sourceInventory, "screenshot-dir")
  const websiteIdentitySignals = [
    ...collectSourceSignals(sourceInventory, "website", "brand-identity"),
    ...collectSourceSignals(sourceInventory, "website", "voice"),
  ]
  const docsIdentitySignals = collectSourceSignals(sourceInventory, "brand-docs", "brand-identity")
  const screenshotIdentitySignals = collectSourceSignals(sourceInventory, "screenshot-dir", "brand-identity")
  const primaryLabels = pickMeaningfulPhrases(
    [...screenshotIdentitySignals, ...websiteIdentitySignals],
    3,
    { minWords: 1, maxWords: 6 },
  )
  const positioningLine = pickRepresentativeSentence([
    ...screenshotIdentitySignals,
    ...websiteIdentitySignals,
    ...docsIdentitySignals,
  ])
  const supportingCues = pickTopKeywords(
    [...screenshotIdentitySignals, ...websiteIdentitySignals],
    5,
    identityMetaStopWords,
  )
  const rules: IBrandRuleRecord[] = []

  if (primaryLabels.length > 0) {
    rules.push(
      createRuleRecord(
        "brand-identity-surface-labels",
        "Surface identity",
        `Keep the brand instantly legible through surface labels such as ${quoteList(primaryLabels)}.`,
        unique([...websiteIds, ...screenshotIds]),
        screenshotIds.length > 0 ? "high" : "medium",
        "Synthesized from visible website and screenshot labels rather than abstract internal docs alone.",
      ),
    )
  }

  if (positioningLine) {
    rules.push(
      createRuleRecord(
        "brand-identity-positioning-line",
        "Positioning line",
        `Reinforce the brand with a clear positioning statement in the spirit of "${positioningLine}".`,
        unique([...docsIds, ...websiteIds, ...screenshotIds]),
        screenshotIds.length > 0 || websiteIds.length > 0 ? "high" : "medium",
        "Derived from the strongest surface-facing sentence found across website, docs, and visual references.",
      ),
    )
  }

  if (supportingCues.length > 0) {
    rules.push(
      createRuleRecord(
        "brand-identity-supporting-cues",
        "Supporting cues",
        `Use secondary cues such as ${supportingCues.join(", ")} to quickly place the brand's domain and personality.`,
        unique([...websiteIds, ...screenshotIds]),
        "medium",
        "Built from repeated non-meta surface terms that help orient the audience fast.",
      ),
    )
  }

  return rules.length > 0 ? rules.slice(0, 3) : fallbackRules
}

const buildInteractionBehaviorRules = (
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
) => {
  const fallbackRules = buildCategoryRules(
    "interaction-behavior",
    "Interaction behavior direction",
    "Interaction behavior rules will deepen as website and product references are parsed more deeply.",
    evidenceRecords,
    sourceInventory,
  )
  const websiteIds = collectSourceIds(sourceInventory, "website")
  const docsIds = collectSourceIds(sourceInventory, "brand-docs")
  const websiteCtas = collectSourceMetadataValues(sourceInventory, "website", "ctas").slice(0, 4)
  const websiteHeadings = collectSourceMetadataValues(sourceInventory, "website", "headings").slice(0, 4)
  const websiteSentences = extractSentences(collectSourceSamples(sourceInventory, "website"))
  const docsConstraints = collectSourceSignals(sourceInventory, "brand-docs", "constraints").slice(0, 2)
  const cautionSentence = extractGuardrailSnippet(collectSourceSamples(sourceInventory, "website"))
    ?? websiteSentences.find((sentence) => /\b(avoid|must|never|warning|without)\b/i.test(sentence))
  const explanatorySentence = websiteSentences
    .filter((sentence) => sentence !== cautionSentence)
    .find((sentence) => sentence.split(/\s+/).length >= 6)
  const cleanedExplanatorySentence = explanatorySentence
    ? websiteHeadings.reduce((currentSentence, heading) => {
        const repeatedHeadingPattern = new RegExp(`^(?:${heading}\\s+)+`, "i")
        return normalizePhrase(currentSentence.replace(repeatedHeadingPattern, ""))
      }, explanatorySentence)
    : null
  const rules: IBrandRuleRecord[] = []

  if (websiteCtas.length > 0) {
    rules.push(
      createRuleRecord(
        "interaction-primary-actions",
        "Primary action labels",
        `Keep primary actions concise and scannable. Current examples include ${quoteList(websiteCtas)}.`,
        websiteIds,
        "medium",
        "Derived from CTA labels extracted from the live website.",
      ),
    )
  }

  if (websiteHeadings.length > 0 || explanatorySentence) {
    const headingPart = websiteHeadings.length > 0 ? `short headings like ${quoteList(websiteHeadings.slice(0, 2))}` : "short headings"
    const sentencePart = cleanedExplanatorySentence
      ? `followed by one explanatory sentence such as "${cleanedExplanatorySentence}"`
      : "followed by one explanatory sentence"

    rules.push(
      createRuleRecord(
        "interaction-content-rhythm",
        "Interaction rhythm",
        `Structure interactive surfaces with ${headingPart}, ${sentencePart}, then the action.`,
        websiteIds,
        "medium",
        "Synthesized from the heading plus body rhythm of the live website.",
      ),
    )
  }

  if (cautionSentence || docsConstraints.length > 0) {
    const guardrailSnippet = cautionSentence ?? docsConstraints[0]

    rules.push(
      createRuleRecord(
        "interaction-operational-guardrails",
        "Operational guardrails",
        `Surface cautionary or boundary-setting guidance clearly when needed, following patterns like "${guardrailSnippet}".`,
        cautionSentence ? unique([...websiteIds, ...docsIds]) : docsIds,
        cautionSentence && docsConstraints.length > 0 ? "high" : "medium",
        "Pulled from cautionary live copy and explicit directive language in docs.",
      ),
    )
  }

  return rules.length > 0 ? rules.slice(0, 3) : fallbackRules
}

const buildDesignSystemRules = (
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
) => {
  const fallbackRules = buildCategoryRules(
    "design-system",
    "Design system direction",
    "Design-system posture will deepen as code and component references are parsed more deeply.",
    evidenceRecords,
    sourceInventory,
  )
  const codeIds = collectSourceIds(sourceInventory, "code-reference")
  const screenshotIds = collectSourceIds(sourceInventory, "screenshot-dir")
  const docsIds = collectSourceIds(sourceInventory, "brand-docs")
  const exportNames = collectSourceMetadataValues(sourceInventory, "code-reference", "export_names")
    .filter(isLikelySystemExport)
    .slice(0, 8)
  const styleTokens = collectSourceMetadataValues(sourceInventory, "code-reference", "style_tokens").slice(0, 8)
  const screenshotColors = collectSourceMetadataValues(sourceInventory, "screenshot-dir", "svg_colors").slice(0, 6)
  const designMdComponentPatterns = collectSourceMetadataValues(
    sourceInventory,
    "brand-docs",
    "design_md_component_patterns",
  ).slice(0, 6)
  const designMdLayoutPrinciples = collectSourceMetadataValues(
    sourceInventory,
    "brand-docs",
    "design_md_layout_principles",
  ).slice(0, 6)
  const designMdResponsive = collectSourceMetadataValues(
    sourceInventory,
    "brand-docs",
    "design_md_responsive",
  ).slice(0, 4)
  const designMdDos = collectSourceMetadataValues(sourceInventory, "brand-docs", "design_md_dos")
    .slice(0, 4)
    .map((value) => `Do: ${value}`)
  const designMdDonts = collectSourceMetadataValues(sourceInventory, "brand-docs", "design_md_donts")
    .slice(0, 4)
    .map((value) => `Don't: ${value}`)
  const rules: IBrandRuleRecord[] = []

  if (designMdComponentPatterns.length > 0) {
    rules.push(
      createRuleRecord(
        "design-system-component-patterns",
        "Component patterns",
        `Keep reusable UI patterns aligned with documented DESIGN.md guidance such as ${quoteList(designMdComponentPatterns)}.`,
        docsIds,
        "high",
        "Derived from explicit component and UI pattern guidance in DESIGN.md brand docs.",
      ),
    )
  }

  if (designMdLayoutPrinciples.length > 0 || designMdResponsive.length > 0) {
    const layoutParts = [
      designMdLayoutPrinciples.length > 0
        ? `layout principles such as ${quoteList(designMdLayoutPrinciples)}`
        : null,
      designMdResponsive.length > 0
        ? `responsive guidance like ${quoteList(designMdResponsive)}`
        : null,
    ].filter((value): value is string => Boolean(value))

    rules.push(
      createRuleRecord(
        "design-system-layout-rhythm",
        "Layout rhythm",
        `Compose reusable surfaces around ${layoutParts.join(" and ")}.`,
        docsIds,
        "high",
        "Derived from explicit layout and responsive guidance in DESIGN.md brand docs.",
      ),
    )
  }

  if (exportNames.length >= 2) {
    rules.push(
      createRuleRecord(
        "design-system-component-vocabulary",
        "Component vocabulary",
        `Keep a reusable component vocabulary with explicit exported primitives such as ${exportNames.join(", ")}.`,
        codeIds,
        "medium",
        "Derived from exported symbols found in code references.",
      ),
    )
  }

  if (styleTokens.length > 0 || screenshotColors.length > 0) {
    const summaryParts = [
      styleTokens.length > 0 ? `style tokens like ${styleTokens.join(", ")}` : null,
      screenshotColors.length > 0 ? `visual palette references such as ${screenshotColors.join(", ")}` : null,
    ].filter((value): value is string => Boolean(value))

    rules.push(
      createRuleRecord(
        "design-system-token-posture",
        "Token posture",
        `Express visual decisions through reusable named primitives, backed by ${summaryParts.join(" and ")}.`,
        unique([...codeIds, ...screenshotIds]),
        summaryParts.length > 1 ? "high" : "medium",
        "Synthesized from implementation tokens and visual references instead of isolated one-off values.",
      ),
    )
  }

  if (
    codeIds.length > 0 ||
    designMdDos.length > 0 ||
    designMdDonts.length > 0 ||
    designMdComponentPatterns.length > 0 ||
    designMdLayoutPrinciples.length > 0
  ) {
    const docBoundaryExamples = [...designMdDos, ...designMdDonts].slice(0, 4)
    const implementationParts = [
      codeIds.length > 0
        ? "Keep brand primitives centralized behind explicit exports so downstream surfaces compose the system instead of redefining it ad hoc."
        : null,
      docBoundaryExamples.length > 0
        ? `Honor documented system guidance such as ${quoteList(docBoundaryExamples)}.`
        : designMdComponentPatterns.length > 0 || designMdLayoutPrinciples.length > 0
          ? "Honor documented system guidance so downstream surfaces compose the same system instead of redefining it ad hoc."
          : null,
    ].filter((value): value is string => Boolean(value))

    const implementationSummary = implementationParts.join(" ")

    rules.push(
      createRuleRecord(
        "design-system-implementation-boundary",
        "Implementation boundary",
        implementationSummary,
        codeIds.length > 0 ? [...codeIds, ...docsIds] : docsIds,
        codeIds.length > 0 && docsIds.length === 0 ? "medium" : "high",
        codeIds.length > 0 && docsIds.length > 0
          ? "Combined from reusable code exports and explicit system do/don't guidance in DESIGN.md brand docs."
          : codeIds.length > 0
            ? "Inferred from the presence of reusable exports and shared reference files in the code source."
            : "Derived from explicit system do/don't guidance in DESIGN.md brand docs.",
      ),
    )
  }

  if (rules.length === 0) {
    return fallbackRules
  }

  const requiredRuleIds = new Set([
    "design-system-component-patterns",
    "design-system-layout-rhythm",
    "design-system-token-posture",
    "design-system-implementation-boundary",
  ])
  const prioritizedRules = rules.filter((rule) => requiredRuleIds.has(rule.id))
  const remainingRules = rules.filter((rule) => !requiredRuleIds.has(rule.id))

  return [...prioritizedRules, ...remainingRules]
}

const buildVisualSystemRules = (
  evidenceRecords: IBrandEvidenceRecord[],
  sourceInventory: IBrandSourceInventory,
) => {
  const fallbackRules = buildCategoryRules(
    "visual-system",
    "Visual system direction",
    "Visual system rules will deepen as visual adapters expand.",
    evidenceRecords,
    sourceInventory,
  )
  const screenshotIds = collectSourceIds(sourceInventory, "screenshot-dir")
  const codeIds = collectSourceIds(sourceInventory, "code-reference")
  const docsIds = collectSourceIds(sourceInventory, "brand-docs")
  const screenshotColors = collectSourceMetadataValues(sourceInventory, "screenshot-dir", "svg_colors")
    .filter((value) => /^#[0-9a-fA-F]{6}$/.test(value))
    .slice(0, 10)
  const darkColors = screenshotColors.filter(isDarkHexColor).slice(0, 3)
  const brightColors = screenshotColors.filter(isBrightHexColor).slice(0, 4)
  const styleTokens = collectSourceMetadataValues(sourceInventory, "code-reference", "style_tokens").slice(0, 8)
  const designMdColorRoles = collectSourceMetadataValues(
    sourceInventory,
    "brand-docs",
    "design_md_color_roles",
  ).slice(0, 6)
  const designMdVisualThemes = collectSourceMetadataScalars(
    sourceInventory,
    "brand-docs",
    "design_md_visual_theme",
  ).slice(0, 2)
  const designMdTypographyScale = collectSourceMetadataValues(
    sourceInventory,
    "brand-docs",
    "design_md_typography_scale",
  ).slice(0, 4)
  const designMdTypographyPrinciples = collectSourceMetadataValues(
    sourceInventory,
    "brand-docs",
    "design_md_typography_principles",
  ).slice(0, 4)
  const rules: IBrandRuleRecord[] = []

  if (designMdVisualThemes.length > 0 || designMdColorRoles.length > 0) {
    const visualParts = [
      designMdVisualThemes.length > 0 ? `documented visual themes like ${quoteList(designMdVisualThemes)}` : null,
      designMdColorRoles.length > 0 ? `color roles such as ${quoteList(designMdColorRoles)}` : null,
    ].filter((value): value is string => Boolean(value))

    rules.push(
      createRuleRecord(
        "visual-system-design-md-foundation",
        "Documented visual foundation",
        `Anchor the visual system in ${visualParts.join(" and ")}.`,
        docsIds,
        "high",
        "Derived from explicit visual-system guidance captured from DESIGN.md brand docs.",
      ),
    )
  }

  if (designMdTypographyScale.length > 0 || designMdTypographyPrinciples.length > 0) {
    const typographyParts = [
      designMdTypographyScale.length > 0 ? `type scales like ${quoteList(designMdTypographyScale)}` : null,
      designMdTypographyPrinciples.length > 0
        ? `documented principles such as ${quoteList(designMdTypographyPrinciples)}`
        : null,
    ].filter((value): value is string => Boolean(value))

    rules.push(
      createRuleRecord(
        "visual-system-typography-foundation",
        "Typography foundation",
        `Keep typography aligned with ${typographyParts.join(" and ")}.`,
        docsIds,
        "high",
        "Derived from explicit typography guidance in DESIGN.md brand docs.",
      ),
    )
  }

  if (darkColors.length > 0 || brightColors.length > 0) {
    const paletteParts = [
      darkColors.length > 0 ? `dark anchors like ${darkColors.join(", ")}` : null,
      brightColors.length > 0 ? `bright accents like ${brightColors.join(", ")}` : null,
    ].filter((value): value is string => Boolean(value))

    rules.push(
      createRuleRecord(
        "visual-system-palette-balance",
        "Palette balance",
        `Balance the visual palette through ${paletteParts.join(" and ")}.`,
        screenshotIds,
        "medium",
        "Derived from repeated color usage in visual references.",
      ),
    )
  }

  if (darkColors.length > 0 && brightColors.length > 0) {
    rules.push(
      createRuleRecord(
        "visual-system-contrast-posture",
        "Contrast posture",
        "Use strong contrast between dark structural surfaces and lighter or brighter highlights so key moments read immediately.",
        screenshotIds,
        "medium",
        "Inferred from the coexistence of dark anchor colors and bright accent colors in the visual references.",
      ),
    )
  }

  if (styleTokens.length > 0) {
    rules.push(
      createRuleRecord(
        "visual-system-tokenized-styling",
        "Tokenized styling",
        `Route styling choices through reusable tokens or utilities such as ${styleTokens.join(", ")} instead of one-off visual values.`,
        unique([...codeIds, ...screenshotIds]),
        "medium",
        "Synthesized from implementation style tokens paired with visual references.",
      ),
    )
  }

  return rules.length > 0 ? rules.slice(0, 3) : fallbackRules
}

const buildMarketingProfileRules = ({
  brandIdentity,
  voice,
  visualSystem,
  evidenceRecords,
  sourceInventory,
}: {
  brandIdentity: IBrandRuleRecord[]
  voice: IBrandRuleRecord[]
  visualSystem: IBrandRuleRecord[]
  evidenceRecords: IBrandEvidenceRecord[]
  sourceInventory: IBrandSourceInventory
}) => {
  const fallbackRules = buildProfileFallbackRules("marketing", "brand-identity", evidenceRecords, sourceInventory)
  const surfaceIdentity = findRuleById(brandIdentity, "brand-identity-surface-labels")
  const positioningLine = findRuleById(brandIdentity, "brand-identity-positioning-line")
  const voiceAnchor = findRuleById(voice, "voice-preferred-language")
  const ctaPosture = findRuleById(voice, "voice-cta-posture")
  const paletteBalance = findRuleById(visualSystem, "visual-system-palette-balance")
  const contrastPosture = findRuleById(visualSystem, "visual-system-contrast-posture")
  const rules: IBrandRuleRecord[] = []

  if (surfaceIdentity || positioningLine) {
    rules.push(
      createRuleRecord(
        "marketing-message-hierarchy",
        "Message hierarchy",
        `Lead marketing surfaces with an instantly readable identity layer, then reinforce it with a positioning line.${positioningLine ? ` Preferred posture: ${positioningLine.summary}` : ""}`,
        combineRuleSourceIds([surfaceIdentity, positioningLine].filter((rule): rule is IBrandRuleRecord => Boolean(rule))),
        "high",
        "Composed from the synthesized brand-identity rules so marketing pages open with recognition first and explanation second.",
      ),
    )
  }

  if (voiceAnchor || ctaPosture) {
    rules.push(
      createRuleRecord(
        "marketing-copy-posture",
        "Marketing copy posture",
        `Keep campaign copy anchored in the core voice, then close with short direct CTAs.${voiceAnchor ? ` Voice anchor: ${voiceAnchor.summary}` : ""}${ctaPosture ? ` CTA posture: ${ctaPosture.summary}` : ""}`,
        combineRuleSourceIds([voiceAnchor, ctaPosture].filter((rule): rule is IBrandRuleRecord => Boolean(rule))),
        "high",
        "Composed from voice rules so marketing copy stays on-brand without drifting into generic campaign language.",
      ),
    )
  }

  if (paletteBalance || contrastPosture) {
    rules.push(
      createRuleRecord(
        "marketing-visual-expression",
        "Visual expression",
        `Let marketing surfaces carry the stronger end of the brand's visual personality through deliberate palette and contrast choices.${paletteBalance ? ` ${paletteBalance.summary}` : ""}${contrastPosture ? ` ${contrastPosture.summary}` : ""}`,
        combineRuleSourceIds([paletteBalance, contrastPosture].filter((rule): rule is IBrandRuleRecord => Boolean(rule))),
        "medium",
        "Composed from visual-system rules so campaigns feel expressive without inventing a separate visual language.",
      ),
    )
  }

  return rules.length > 0 ? rules.slice(0, 3) : fallbackRules
}

const buildProductUiProfileRules = ({
  interactionBehavior,
  voice,
  designSystem,
  evidenceRecords,
  sourceInventory,
}: {
  interactionBehavior: IBrandRuleRecord[]
  voice: IBrandRuleRecord[]
  designSystem: IBrandRuleRecord[]
  evidenceRecords: IBrandEvidenceRecord[]
  sourceInventory: IBrandSourceInventory
}) => {
  const fallbackRules = buildProfileFallbackRules("product-ui", "interaction-behavior", evidenceRecords, sourceInventory)
  const primaryActions = findRuleById(interactionBehavior, "interaction-primary-actions")
  const interactionRhythm = findRuleById(interactionBehavior, "interaction-content-rhythm")
  const guardrails = findRuleById(interactionBehavior, "interaction-operational-guardrails")
  const ctaPosture = findRuleById(voice, "voice-cta-posture")
  const avoidGenericCta = findRuleById(voice, "voice-avoid-generic-cta")
  const componentPatterns = findRuleById(designSystem, "design-system-component-patterns")
  const layoutRhythm = findRuleById(designSystem, "design-system-layout-rhythm")
  const tokenPosture = findRuleById(designSystem, "design-system-token-posture")
  const implementationBoundary = findRuleById(designSystem, "design-system-implementation-boundary")
  const rules: IBrandRuleRecord[] = []

  if (primaryActions || interactionRhythm) {
    rules.push(
      createRuleRecord(
        "product-ui-flow-clarity",
        "Flow clarity",
        `Keep in-product flows terse and readable: the user should see the heading, understand the context, and spot the action immediately.${primaryActions ? ` ${primaryActions.summary}` : ""}${interactionRhythm ? ` ${interactionRhythm.summary}` : ""}`,
        combineRuleSourceIds([primaryActions, interactionRhythm].filter((rule): rule is IBrandRuleRecord => Boolean(rule))),
        "high",
        "Composed from interaction-behavior rules to optimize product surfaces for task completion rather than campaign storytelling.",
      ),
    )
  }

  if (ctaPosture || avoidGenericCta || guardrails) {
    rules.push(
      createRuleRecord(
        "product-ui-copy-discipline",
        "Product copy discipline",
        `Keep in-product copy direct and operational, and surface boundaries clearly when they matter.${ctaPosture ? ` ${ctaPosture.summary}` : ""}${avoidGenericCta ? ` ${avoidGenericCta.summary}` : ""}${guardrails ? ` ${guardrails.summary}` : ""}`,
        combineRuleSourceIds([ctaPosture, avoidGenericCta, guardrails].filter((rule): rule is IBrandRuleRecord => Boolean(rule))),
        "medium",
        "Composed from voice and behavior rules so product copy stays useful, not promotional.",
      ),
    )
  }

  if (componentPatterns || layoutRhythm || tokenPosture || implementationBoundary) {
    rules.push(
      createRuleRecord(
        "product-ui-system-reuse",
        "System reuse",
        `Build product screens from the shared system first, then customize only where the product truly needs it.${componentPatterns ? ` ${componentPatterns.summary}` : ""}${layoutRhythm ? ` ${layoutRhythm.summary}` : ""}${tokenPosture ? ` ${tokenPosture.summary}` : ""}${implementationBoundary ? ` ${implementationBoundary.summary}` : ""}`,
        combineRuleSourceIds(
          [componentPatterns, layoutRhythm, tokenPosture, implementationBoundary].filter(
            (rule): rule is IBrandRuleRecord => Boolean(rule),
          ),
        ),
        "medium",
        "Composed from design-system rules so product UI scales through reuse instead of one-off screen styling.",
      ),
    )
  }

  return rules.length > 0 ? rules.slice(0, 3) : fallbackRules
}

const buildDashboardProfileRules = ({
  interactionBehavior,
  visualSystem,
  designSystem,
  evidenceRecords,
  sourceInventory,
}: {
  interactionBehavior: IBrandRuleRecord[]
  visualSystem: IBrandRuleRecord[]
  designSystem: IBrandRuleRecord[]
  evidenceRecords: IBrandEvidenceRecord[]
  sourceInventory: IBrandSourceInventory
}) => {
  const fallbackRules = buildProfileFallbackRules("dashboard", "constraints", evidenceRecords, sourceInventory)
  const primaryActions = findRuleById(interactionBehavior, "interaction-primary-actions")
  const guardrails = findRuleById(interactionBehavior, "interaction-operational-guardrails")
  const paletteBalance = findRuleById(visualSystem, "visual-system-palette-balance")
  const contrastPosture = findRuleById(visualSystem, "visual-system-contrast-posture")
  const componentPatterns = findRuleById(designSystem, "design-system-component-patterns")
  const layoutRhythm = findRuleById(designSystem, "design-system-layout-rhythm")
  const tokenPosture = findRuleById(designSystem, "design-system-token-posture")
  const implementationBoundary = findRuleById(designSystem, "design-system-implementation-boundary")
  const rules: IBrandRuleRecord[] = []

  if (primaryActions || guardrails) {
    rules.push(
      createRuleRecord(
        "dashboard-operational-clarity",
        "Operational clarity",
        `Dashboard actions and labels should be terse, obvious, and safe to scan under time pressure.${primaryActions ? ` ${primaryActions.summary}` : ""}${guardrails ? ` ${guardrails.summary}` : ""}`,
        combineRuleSourceIds([primaryActions, guardrails].filter((rule): rule is IBrandRuleRecord => Boolean(rule))),
        "high",
        "Composed from behavior rules so dense operational surfaces privilege clarity and boundaries over flourish.",
      ),
    )
  }

  if (contrastPosture || paletteBalance) {
    rules.push(
      createRuleRecord(
        "dashboard-visual-restraint",
        "Visual restraint",
        `Use the visual system for hierarchy, not decoration. Let contrast do most of the work and keep accents purposeful.${contrastPosture ? ` ${contrastPosture.summary}` : ""}${paletteBalance ? ` ${paletteBalance.summary}` : ""}`,
        combineRuleSourceIds([contrastPosture, paletteBalance].filter((rule): rule is IBrandRuleRecord => Boolean(rule))),
        "medium",
        "Composed from visual-system rules so dashboards stay legible while still feeling on-brand.",
      ),
    )
  }

  if (componentPatterns || layoutRhythm || tokenPosture || implementationBoundary) {
    rules.push(
      createRuleRecord(
        "dashboard-system-consistency",
        "System consistency",
        `Keep dashboard surfaces tightly coupled to the shared design system so dense views remain consistent across states and modules.${componentPatterns ? ` ${componentPatterns.summary}` : ""}${layoutRhythm ? ` ${layoutRhythm.summary}` : ""}${tokenPosture ? ` ${tokenPosture.summary}` : ""}${implementationBoundary ? ` ${implementationBoundary.summary}` : ""}`,
        combineRuleSourceIds(
          [componentPatterns, layoutRhythm, tokenPosture, implementationBoundary].filter(
            (rule): rule is IBrandRuleRecord => Boolean(rule),
          ),
        ),
        "medium",
        "Composed from design-system rules to prevent dense information surfaces from drifting into bespoke UI patterns.",
      ),
    )
  }

  return rules.length > 0 ? rules.slice(0, 3) : fallbackRules
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
  const brandIdentity = buildBrandIdentityRules(brandName, evidenceRecords, sourceInventory)
  const voice = buildVoiceRules(evidenceRecords, sourceInventory)
  const visualSystem = buildVisualSystemRules(evidenceRecords, sourceInventory)
  const interactionBehavior = buildInteractionBehaviorRules(evidenceRecords, sourceInventory)
  const designSystem = buildDesignSystemRules(evidenceRecords, sourceInventory)
  const marketingRules = buildMarketingProfileRules({
    brandIdentity,
    voice,
    visualSystem,
    evidenceRecords,
    sourceInventory,
  })
  const productUiRules = buildProductUiProfileRules({
    interactionBehavior,
    voice,
    designSystem,
    evidenceRecords,
    sourceInventory,
  })
  const dashboardRules = buildDashboardProfileRules({
    interactionBehavior,
    visualSystem,
    designSystem,
    evidenceRecords,
    sourceInventory,
  })

  return {
    brandIdentity,
    voice,
    visualSystem,
    interactionBehavior,
    designSystem,
    profiles: [
      {
        profileName: "design-system",
        confidence: overallConfidence,
        rules: designSystem,
      },
      {
        profileName: "marketing",
        confidence: overallConfidence,
        rules: marketingRules,
      },
      {
        profileName: "product-ui",
        confidence: overallConfidence,
        rules: productUiRules,
      },
      {
        profileName: "dashboard",
        confidence: overallConfidence,
        rules: dashboardRules,
      },
    ],
    evidence: evidenceRecords,
    conflicts,
    overallConfidence,
  }
}
