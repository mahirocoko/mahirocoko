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
  const sourceIds = evidenceRecords.flatMap((evidenceRecord) => evidenceRecord.sourceIds)

  return {
    brandIdentity: [
      createRuleRecord(
        "brand-identity-scaffold",
        `${brandName} brand identity scaffold`,
        "Core brand identity extraction is scaffolded but not synthesized yet.",
        sourceIds,
        overallConfidence,
      ),
    ],
    voice: [
      createRuleRecord(
        "voice-scaffold",
        "Voice scaffold",
        "Voice rules will be populated from explicit brand docs and copy sources in Phase 3.",
        sourceIds,
        overallConfidence,
      ),
    ],
    visualSystem: [
      createRuleRecord(
        "visual-system-scaffold",
        "Visual system scaffold",
        "Visual system rules will be synthesized from websites, Figma, screenshots, and code references.",
        sourceIds,
        overallConfidence,
      ),
    ],
    interactionBehavior: [
      createRuleRecord(
        "interaction-behavior-scaffold",
        "Interaction behavior scaffold",
        "Interaction behavior rules will be derived once evidence extraction is category-aware.",
        sourceIds,
        overallConfidence,
      ),
    ],
    designSystem: [
      createRuleRecord(
        "design-system-scaffold",
        "Design system scaffold",
        "Design-system posture will be synthesized in a later phase from code and visual references.",
        sourceIds,
        overallConfidence,
      ),
    ],
    profiles: [
      {
        profileName: "design-system",
        confidence: "low",
        rules: [],
      },
      {
        profileName: "marketing",
        confidence: "low",
        rules: [],
      },
      {
        profileName: "product-ui",
        confidence: "low",
        rules: [],
      },
      {
        profileName: "dashboard",
        confidence: "low",
        rules: [],
      },
    ],
    evidence: evidenceRecords,
    conflicts: [],
    overallConfidence,
  }
}
