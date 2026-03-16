import type {
  IBrandSkillCommand,
  IBrandSkillValidationIssue,
  IBrandSkillValidationResult,
  IBrandSourceInventory,
} from "../model/normalized-brand-model"

export const validateBrandSkillRun = (
  command: IBrandSkillCommand,
  sourceInventory: IBrandSourceInventory,
): IBrandSkillValidationResult => {
  const issues: IBrandSkillValidationIssue[] = []

  if (!command.brandName.trim()) {
    issues.push({
      level: "error",
      code: "missing-brand-name",
      message: "A brand name is required.",
    })
  }

  if (!command.brandSlug) {
    issues.push({
      level: "error",
      code: "invalid-brand-slug",
      message: "The brand name did not produce a usable slug.",
    })
  }

  if (sourceInventory.sourceRecords.length === 0) {
    issues.push({
      level: "error",
      code: "missing-sources",
      message: "Provide at least one source before running the brand skill pipeline.",
    })
  }

  const missingLocalSources = sourceInventory.sourceRecords.filter(
    (sourceRecord) => sourceRecord.locationType === "path" && !sourceRecord.exists,
  )

  for (const sourceRecord of missingLocalSources) {
    issues.push({
      level: "warning",
      code: "missing-local-source",
      message: `Local source is missing: ${sourceRecord.location}`,
    })
  }

  const docsCount = command.docsPaths.length
  const websiteCount = command.websiteUrls.length
  const visualReferenceCount = command.screenshotPaths.length + command.figmaUrls.length

  if (docsCount === 0) {
    issues.push({
      level: "warning",
      code: "missing-explicit-brand-docs",
      message: "No explicit brand docs were provided. Voice and positioning confidence will stay lower.",
    })
  }

  if (websiteCount === 0) {
    issues.push({
      level: "warning",
      code: "missing-live-product-reference",
      message: "No website or live product URL was provided. Live-behavior confidence will stay lower.",
    })
  }

  if (visualReferenceCount === 0) {
    issues.push({
      level: "warning",
      code: "missing-visual-references",
      message: "No screenshots or Figma references were provided. Visual-system confidence will stay lower.",
    })
  }

  return {
    canContinue: !issues.some((issue) => issue.level === "error"),
    issues,
  }
}
