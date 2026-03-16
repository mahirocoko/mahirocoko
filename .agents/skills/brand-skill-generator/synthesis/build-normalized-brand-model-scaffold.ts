import type {
  ConfidenceLevel,
  IBrandEvidenceRecord,
  INormalizedBrandModel,
  IBrandRuleRecord,
} from "../model/normalized-brand-model"

const buildConfidenceFromEvidence = (evidenceRecords: IBrandEvidenceRecord[]): ConfidenceLevel => {
  if (evidenceRecords.some((evidenceRecord) => evidenceRecord.confidence === "high")) {
    return "medium"
  }

  if (evidenceRecords.length > 0) {
    return "low"
  }

  return "low"
}

const createRuleRecord = (
  id: string,
  title: string,
  summary: string,
  sourceIds: string[],
  confidence: ConfidenceLevel,
): IBrandRuleRecord => ({
  id,
  title,
  summary,
  sourceIds,
  confidence,
  rationale: "Phase 1 scaffold only. Real synthesis and rationale generation lands in later phases.",
})

export const buildNormalizedBrandModelScaffold = (
  brandName: string,
  evidenceRecords: IBrandEvidenceRecord[],
): INormalizedBrandModel => {
  const overallConfidence = buildConfidenceFromEvidence(evidenceRecords)

  const buildRulesForCategory = (
    category: IBrandEvidenceRecord["category"],
    fallbackTitle: string,
    fallbackSummary: string,
  ): IBrandRuleRecord[] => {
    const categoryEvidence = evidenceRecords.filter((evidenceRecord) => evidenceRecord.category === category)

    if (categoryEvidence.length === 0) {
      return [
        createRuleRecord(
          `${category}-scaffold`,
          fallbackTitle,
          fallbackSummary,
          [],
          "low",
        ),
      ]
    }

    return categoryEvidence.map((evidenceRecord, index) =>
      createRuleRecord(
        `${category}-${index + 1}`,
        `${fallbackTitle} ${index + 1}`,
        evidenceRecord.statement,
        evidenceRecord.sourceIds,
        evidenceRecord.confidence,
      ),
    )
  }

  return {
    brandIdentity: buildRulesForCategory(
      "brand-identity",
      `${brandName} brand identity`,
      "Core brand identity extraction remains light until richer source analysis lands.",
    ),
    voice: buildRulesForCategory(
      "voice",
      "Voice direction",
      "Voice rules will deepen as explicit copy extraction improves.",
    ),
    visualSystem: buildRulesForCategory(
      "visual-system",
      "Visual system direction",
      "Visual system rules will deepen as visual adapters expand.",
    ),
    interactionBehavior: buildRulesForCategory(
      "interaction-behavior",
      "Interaction behavior direction",
      "Interaction behavior rules will deepen as website and product references are parsed more deeply.",
    ),
    designSystem: buildRulesForCategory(
      "design-system",
      "Design system direction",
      "Design-system posture will deepen as code and component references are parsed more deeply.",
    ),
    profiles: [
      {
        profileName: "design-system",
        confidence: overallConfidence,
        rules: evidenceRecords
          .filter((evidenceRecord) => evidenceRecord.category === "design-system")
          .map((evidenceRecord, index) =>
            createRuleRecord(
              `design-system-profile-${index + 1}`,
              `Design-system profile rule ${index + 1}`,
              evidenceRecord.statement,
              evidenceRecord.sourceIds,
              evidenceRecord.confidence,
            ),
          ),
      },
      {
        profileName: "marketing",
        confidence: overallConfidence,
        rules: evidenceRecords
          .filter((evidenceRecord) => evidenceRecord.category === "brand-identity")
          .map((evidenceRecord, index) =>
            createRuleRecord(
              `marketing-profile-${index + 1}`,
              `Marketing profile rule ${index + 1}`,
              evidenceRecord.statement,
              evidenceRecord.sourceIds,
              evidenceRecord.confidence,
            ),
          ),
      },
      {
        profileName: "product-ui",
        confidence: overallConfidence,
        rules: evidenceRecords
          .filter((evidenceRecord) => evidenceRecord.category === "interaction-behavior")
          .map((evidenceRecord, index) =>
            createRuleRecord(
              `product-ui-profile-${index + 1}`,
              `Product UI profile rule ${index + 1}`,
              evidenceRecord.statement,
              evidenceRecord.sourceIds,
              evidenceRecord.confidence,
            ),
          ),
      },
      {
        profileName: "dashboard",
        confidence: overallConfidence,
        rules: evidenceRecords
          .filter((evidenceRecord) => evidenceRecord.category === "constraints")
          .map((evidenceRecord, index) =>
            createRuleRecord(
              `dashboard-profile-${index + 1}`,
              `Dashboard profile rule ${index + 1}`,
              evidenceRecord.statement,
              evidenceRecord.sourceIds,
              evidenceRecord.confidence,
            ),
          ),
      },
    ],
    evidence: evidenceRecords,
    conflicts: [],
    overallConfidence,
  }
}
