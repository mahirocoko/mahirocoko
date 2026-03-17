import type {
  IBrandSkillCommand,
  IBrandSkillPreflightQuestion,
  IBrandSkillPreflightResult,
  IBrandSkillValidationIssue,
} from "../model/normalized-brand-model"
import { buildBrandSkillSourcePlan } from "./build-brand-skill-source-plan"

const buildIssue = (
  level: "error" | "warning",
  code: string,
  message: string,
): IBrandSkillValidationIssue => ({
  level,
  code,
  message,
})

const buildNextQuestion = (
  command: IBrandSkillCommand,
  sourcePlan: IBrandSkillPreflightResult["sourcePlan"],
  issues: IBrandSkillValidationIssue[],
): IBrandSkillPreflightQuestion | null => {
  const blockingIssueCodes = new Set(
    issues.filter((issue) => issue.level === "error").map((issue) => issue.code),
  )

  if (blockingIssueCodes.has("missing-brand-name")) {
    return {
      code: "missing-brand-name",
      prompt: "What is the brand name for this run?",
    }
  }

  const ambiguousWebsite = sourcePlan.find(
    (sourceItem) => sourceItem.sourceType === "website" && sourceItem.role === null,
  )

  if (ambiguousWebsite) {
    return {
      code: "ambiguous-website-role",
      prompt: `How should I treat ${ambiguousWebsite.location}: brand truth, live product, or mood reference?`,
    }
  }

  if (blockingIssueCodes.has("needs-brief-doc-decision")) {
    return {
      code: "needs-brief-doc-decision",
      prompt:
        "You provided a brief but no explicit brand docs. Should I create a temporary brand brief before running the generator?",
    }
  }

  if (blockingIssueCodes.has("missing-sources")) {
    return {
      code: "missing-sources",
      prompt:
        "I still need at least one usable source. Do you want to add docs, a live product URL, screenshots, code, Figma, or a brief?",
    }
  }

  if (blockingIssueCodes.has("missing-execution-sources")) {
    return {
      code: "missing-execution-sources",
      prompt:
        "The current source plan would compile to zero execution sources. Do you want to add brand docs, a live product source, screenshots, code, Figma, or enable temporary brief-doc generation?",
    }
  }

  if (command.mode === "generate" || command.mode === "refresh") {
    const hasVisualReferences = sourcePlan.some(
      (sourceItem) =>
        sourceItem.sourceType === "screenshot-dir" || sourceItem.sourceType === "figma-url",
    )

    if (!hasVisualReferences) {
      return {
        code: "missing-visual-references",
        prompt:
          "Do you want to continue without screenshots or Figma references? Visual-system confidence will stay lower.",
      }
    }
  }

  return null
}

export const analyzeBrandSkillPreflight = (
  command: IBrandSkillCommand,
): IBrandSkillPreflightResult => {
  const sourcePlan = buildBrandSkillSourcePlan(command)
  const issues: IBrandSkillValidationIssue[] = []
  const knownInputs: string[] = []
  const missingCoverage: string[] = []
  const ambiguities: string[] = []
  const warnings: string[] = []

  if (command.brandName.trim()) {
    knownInputs.push(`Brand name: ${command.brandName}`)
  } else {
    issues.push(buildIssue("error", "missing-brand-name", "A brand name is required before execution."))
    missingCoverage.push("Brand name")
  }

  knownInputs.push(`Requested mode: ${command.mode}`)

  if (command.brief.trim()) {
    knownInputs.push("Brief text provided")
  }

  if (sourcePlan.length === 0) {
    issues.push(
      buildIssue("error", "missing-sources", "Provide at least one usable source or brief before execution."),
    )
    missingCoverage.push("At least one source or brief")
  }

  const ambiguousWebsites = sourcePlan.filter(
    (sourceItem) => sourceItem.sourceType === "website" && sourceItem.role === null,
  )

  for (const sourceItem of ambiguousWebsites) {
    issues.push(
      buildIssue(
        "error",
        "ambiguous-website-role",
        `Website role is ambiguous: ${sourceItem.location}`,
      ),
    )
    ambiguities.push(`Website role is unresolved for ${sourceItem.location}`)
  }

  const explicitDocsCount = sourcePlan.filter((sourceItem) => sourceItem.sourceType === "brand-docs").length
  const visualReferenceCount = sourcePlan.filter(
    (sourceItem) =>
      sourceItem.sourceType === "screenshot-dir" || sourceItem.sourceType === "figma-url",
  ).length
  const liveWebsiteCount = sourcePlan.filter(
    (sourceItem) =>
      sourceItem.sourceType === "website" &&
      (sourceItem.role === "brand-truth" || sourceItem.role === "live-product"),
  ).length

  if (explicitDocsCount > 0) {
    knownInputs.push(`Explicit brand docs: ${explicitDocsCount}`)
  } else if (command.brief.trim() && !command.writeBriefDoc) {
    issues.push(
      buildIssue(
        "error",
        "needs-brief-doc-decision",
        "A brief was provided without explicit brand docs. Decide whether to create a temporary brand brief before execution.",
      ),
    )
    missingCoverage.push("Decision on temporary brand brief creation")
  } else if (command.brief.trim() && command.writeBriefDoc) {
    knownInputs.push("Temporary brand brief generation enabled")
  } else {
    warnings.push("No explicit brand docs were provided. Voice and positioning confidence will stay lower.")
  }

  if (visualReferenceCount > 0) {
    knownInputs.push(`Visual references: ${visualReferenceCount}`)
  } else {
    warnings.push("No screenshots or Figma references were provided. Visual-system confidence will stay lower.")
    missingCoverage.push("Visual references")
  }

  if (liveWebsiteCount > 0) {
    knownInputs.push(`Live product or brand-truth websites: ${liveWebsiteCount}`)
  } else {
    warnings.push("No live product or brand-truth website source was provided. Behavior confidence will stay lower.")
  }

  const executionReadySourceCount = sourcePlan.filter((sourceItem) => {
    if (sourceItem.sourceType === "brief") {
      return command.writeBriefDoc
    }

    if (sourceItem.sourceType === "website" && sourceItem.role === "mood-reference") {
      return false
    }

    return true
  }).length

  if (executionReadySourceCount === 0) {
    issues.push(
      buildIssue(
        "error",
        "missing-execution-sources",
        "The current source plan would compile to zero execution sources. Add brand docs, a live product source, screenshots, code, Figma, or enable temporary brief-doc generation.",
      ),
    )
    missingCoverage.push("At least one execution-ready source")
  }

  const nextQuestion = buildNextQuestion(command, sourcePlan, issues)

  return {
    status: issues.some((issue) => issue.level === "error") ? "needs-clarification" : "ready",
    knownInputs,
    missingCoverage,
    ambiguities,
    warnings,
    issues: [...issues, ...warnings.map((warning) => buildIssue("warning", "preflight-warning", warning))],
    nextQuestion,
    sourcePlan,
  }
}
