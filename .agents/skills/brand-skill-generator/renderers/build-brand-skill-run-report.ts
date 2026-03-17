import type {
  BrandSourceType,
  ConfidenceLevel,
  IBrandSkillCommand,
  IBrandSkillPreflightResult,
  IBrandSkillRunReport,
  IBrandSkillValidationResult,
  IBrandSourceInventory,
  INormalizedBrandModel,
} from "../model/normalized-brand-model"
import { toWorkspaceRelativePath } from "../utils/workspace-paths"

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

const buildMissingSourceSuggestions = ({
  preflight,
  sourceInventory,
}: {
  preflight: IBrandSkillPreflightResult
  sourceInventory: IBrandSourceInventory
}) => {
  const sourcePlan = preflight.sourcePlan
  const hasWebsite =
    sourceInventory.sourceRecords.some((sourceRecord) => sourceRecord.sourceType === "website") ||
    sourcePlan.some((sourceItem) => sourceItem.sourceType === "website")
  const hasDocs =
    sourceInventory.sourceRecords.some((sourceRecord) => sourceRecord.sourceType === "brand-docs") ||
    sourcePlan.some(
      (sourceItem) =>
        sourceItem.sourceType === "brand-docs" ||
        (sourceItem.sourceType === "brief" && sourceItem.includedInExecution),
    )
  const hasVisualReference =
    sourceInventory.sourceRecords.some(
      (sourceRecord) =>
        sourceRecord.sourceType === "figma-url" || sourceRecord.sourceType === "screenshot-dir",
    ) ||
    sourcePlan.some(
      (sourceItem) =>
        sourceItem.sourceType === "figma-url" || sourceItem.sourceType === "screenshot-dir",
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

  const hasThinTextCoverage = sourceInventory.sourceRecords.some(
    (sourceRecord) =>
      sourceRecord.sourceType !== "screenshot-dir" &&
      sourceRecord.sourceType !== "figma-url" &&
      sourceRecord.textSamples.length === 0,
  )

  if (hasThinTextCoverage) {
    suggestions.push("Add richer text-based sources or point docs/code paths at readable files.")
  }

  return suggestions
}

const buildValidationIssues = ({
  preflight,
  validation,
}: {
  preflight: IBrandSkillPreflightResult
  validation: IBrandSkillValidationResult
}) => {
  const seenKeys = new Set<string>()

  return [...preflight.issues, ...validation.issues].filter((issue) => {
    const issueKey = `${issue.level}:${issue.code}:${issue.message}`

    if (seenKeys.has(issueKey)) {
      return false
    }

    seenKeys.add(issueKey)
    return true
  })
}

const buildOverallConfidence = (
  preflight: IBrandSkillPreflightResult,
  validation: IBrandSkillValidationResult,
  normalizedBrandModel: INormalizedBrandModel,
): ConfidenceLevel => {
  if (preflight.status !== "ready") {
    return "low"
  }

  if (!validation.canContinue) {
    return "low"
  }

  return normalizedBrandModel.overallConfidence
}

export const buildBrandSkillRunReport = (
  command: IBrandSkillCommand,
  preflight: IBrandSkillPreflightResult,
  sourceInventory: IBrandSourceInventory,
  validation: IBrandSkillValidationResult,
  normalizedBrandModel: INormalizedBrandModel,
): IBrandSkillRunReport => {
  return {
    brandName: command.brandName,
    brandSlug: command.brandSlug,
    mode: command.mode,
    destinationDir: toWorkspaceRelativePath(command.workspaceRoot, command.destinationDir),
    overallConfidence: buildOverallConfidence(preflight, validation, normalizedBrandModel),
    preflightStatus: preflight.status,
    preflightKnownInputs: preflight.knownInputs,
    preflightMissingCoverage: preflight.missingCoverage,
    preflightAmbiguities: preflight.ambiguities,
    preflightWarnings: preflight.warnings,
    preflightNextQuestion: preflight.nextQuestion,
    sourcePlan: preflight.sourcePlan,
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
        rationale: "Derived from first-pass source extraction and weighted source posture.",
      })),
    missingSourceSuggestions: buildMissingSourceSuggestions({ preflight, sourceInventory }),
    validationIssues: buildValidationIssues({ preflight, validation }),
  }
}
