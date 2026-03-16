import type {
  BrandSourceType,
  ConfidenceLevel,
  IBrandSkillCommand,
  IBrandSkillRunReport,
  IBrandSkillValidationResult,
  IBrandSourceInventory,
  INormalizedBrandModel,
} from "../model/normalized-brand-model"

const buildSourceSummary = (sourceInventory: IBrandSourceInventory) => {
  const byType: Partial<Record<BrandSourceType, number>> = {}

  for (const sourceRecord of sourceInventory.sourceRecords) {
    byType[sourceRecord.sourceType] = (byType[sourceRecord.sourceType] ?? 0) + 1
  }

  return {
    totalSources: sourceInventory.sourceRecords.length,
    byType,
  }
}

const buildMissingSourceSuggestions = (sourceInventory: IBrandSourceInventory) => {
  const hasWebsite = sourceInventory.sourceRecords.some((sourceRecord) => sourceRecord.sourceType === "website")
  const hasDocs = sourceInventory.sourceRecords.some((sourceRecord) => sourceRecord.sourceType === "brand-docs")
  const hasVisualReference = sourceInventory.sourceRecords.some(
    (sourceRecord) =>
      sourceRecord.sourceType === "figma-url" || sourceRecord.sourceType === "screenshot-dir",
  )

  const suggestions: string[] = []

  if (!hasDocs) {
    suggestions.push("Add explicit brand docs or positioning notes.")
  }

  if (!hasWebsite) {
    suggestions.push("Add a website or live product reference.")
  }

  if (!hasVisualReference) {
    suggestions.push("Add screenshots or Figma references.")
  }

  return suggestions
}

const buildOverallConfidence = (
  validation: IBrandSkillValidationResult,
  normalizedBrandModel: INormalizedBrandModel,
): ConfidenceLevel => {
  if (!validation.canContinue) {
    return "low"
  }

  return normalizedBrandModel.overallConfidence
}

export const buildBrandSkillRunReport = (
  command: IBrandSkillCommand,
  sourceInventory: IBrandSourceInventory,
  validation: IBrandSkillValidationResult,
  normalizedBrandModel: INormalizedBrandModel,
): IBrandSkillRunReport => {
  return {
    brandName: command.brandName,
    brandSlug: command.brandSlug,
    mode: command.mode,
    destinationDir: command.destinationDir,
    overallConfidence: buildOverallConfidence(validation, normalizedBrandModel),
    sourceSummary: buildSourceSummary(sourceInventory),
    topConflicts: normalizedBrandModel.conflicts,
    topInferredRules: normalizedBrandModel.evidence
      .filter((evidenceRecord) => evidenceRecord.signalType === "inferred")
      .slice(0, 3)
      .map((evidenceRecord) => ({
        id: evidenceRecord.id,
        title: evidenceRecord.statement,
        summary: evidenceRecord.statement,
        sourceIds: evidenceRecord.sourceIds,
        confidence: evidenceRecord.confidence,
        rationale: "Phase 1 scaffold inferred signal.",
      })),
    missingSourceSuggestions: buildMissingSourceSuggestions(sourceInventory),
    validationIssues: validation.issues,
  }
}
