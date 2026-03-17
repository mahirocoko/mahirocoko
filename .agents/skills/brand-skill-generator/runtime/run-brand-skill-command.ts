import { detectBrandSkillUpdateMode } from "../diff/detect-brand-skill-update-mode"
import { buildBrandEvidenceRecords } from "../evidence/build-brand-evidence-records"
import type { IBrandSkillCommand, IBrandSkillExecutionPlan } from "../model/normalized-brand-model"
import { analyzeBrandSkillPreflight } from "../intake/analyze-brand-skill-preflight"
import { compileBrandSkillIntake } from "../intake/compile-brand-skill-intake"
import { buildNormalizedBrandModelScaffold } from "../synthesis/build-normalized-brand-model-scaffold"
import { buildBrandSkillRunReport } from "../renderers/build-brand-skill-run-report"
import { planBrandSkillBundleRender } from "../renderers/plan-brand-skill-bundle-render"
import { renderBrandSkillBundle } from "../renderers/render-brand-skill-bundle"
import { buildSourceInventory } from "../sources/build-source-inventory"
import { validateBrandSkillRun } from "../validation/validate-brand-skill-run"

const buildEmptySourceInventory = (command: IBrandSkillCommand) => ({
  brandName: command.brandName,
  destinationDir: command.destinationDir,
  sourceRecords: [],
})

const buildEmptyNormalizedBrandModel = () => ({
  brandIdentity: [],
  voice: [],
  visualSystem: [],
  interactionBehavior: [],
  designSystem: [],
  profiles: [
    {
      profileName: "design-system" as const,
      confidence: "low" as const,
      rules: [],
    },
    {
      profileName: "marketing" as const,
      confidence: "low" as const,
      rules: [],
    },
    {
      profileName: "product-ui" as const,
      confidence: "low" as const,
      rules: [],
    },
    {
      profileName: "dashboard" as const,
      confidence: "low" as const,
      rules: [],
    },
  ],
  evidence: [],
  conflicts: [],
  overallConfidence: "low" as const,
})

export const runBrandSkillCommand = async (
  command: IBrandSkillCommand,
): Promise<IBrandSkillExecutionPlan> => {
  const preflight = analyzeBrandSkillPreflight(command)
  const compiled = compileBrandSkillIntake({
    command,
    preflight,
  })
  const compiledCommand = compiled.compiledCommand
  const updateMode = detectBrandSkillUpdateMode(command.destinationDir)

  if (!compiledCommand) {
    const sourceInventory = buildEmptySourceInventory(command)
    const validation = {
      canContinue: false,
      issues: preflight.issues,
    }
    const normalizedBrandModel = buildEmptyNormalizedBrandModel()
    const report = buildBrandSkillRunReport(
      command,
      {
        ...preflight,
        sourcePlan: compiled.compiledSourcePlan,
      },
      sourceInventory,
      validation,
      normalizedBrandModel,
    )
    const plannedFiles = planBrandSkillBundleRender(command)

    return {
      command,
      compiledCommand: null,
      preflight: {
        ...preflight,
        sourcePlan: compiled.compiledSourcePlan,
      },
      sourceInventory,
      validation,
      normalizedBrandModel,
      report,
      plannedFiles,
      renderedFiles: [],
      updateMode,
      status: "needs-user-input",
    }
  }

  const sourceInventory = await buildSourceInventory(compiledCommand)
  const validation = validateBrandSkillRun(compiledCommand, sourceInventory)
  const evidenceRecords = buildBrandEvidenceRecords(sourceInventory)
  const normalizedBrandModel = buildNormalizedBrandModelScaffold(
    compiledCommand.brandName,
    evidenceRecords,
    sourceInventory,
  )
  const report = buildBrandSkillRunReport(
    command,
    {
      ...preflight,
      sourcePlan: compiled.compiledSourcePlan,
    },
    sourceInventory,
    validation,
    normalizedBrandModel,
  )
  const plannedFiles = planBrandSkillBundleRender(compiledCommand)
  const shouldRender =
    validation.canContinue &&
    !compiledCommand.dryRun &&
    (compiledCommand.mode === "generate" || compiledCommand.mode === "refresh")
  const renderedFiles = shouldRender
    ? renderBrandSkillBundle({
        command: compiledCommand,
        sourceInventory,
        normalizedBrandModel,
        report,
        updateMode,
      })
    : []

  return {
    command,
    compiledCommand,
    preflight: {
      ...preflight,
      sourcePlan: compiled.compiledSourcePlan,
    },
    sourceInventory,
    validation,
    normalizedBrandModel,
    report,
    plannedFiles,
    renderedFiles,
    updateMode,
    status: renderedFiles.length > 0 ? "bundle-rendered" : "source-extracted",
  }
}
