import { detectBrandSkillUpdateMode } from "../diff/detect-brand-skill-update-mode"
import { buildBrandEvidenceRecords } from "../evidence/build-brand-evidence-records"
import type { IBrandSkillCommand, IBrandSkillExecutionPlan } from "../model/normalized-brand-model"
import { buildNormalizedBrandModelScaffold } from "../synthesis/build-normalized-brand-model-scaffold"
import { buildBrandSkillRunReport } from "../renderers/build-brand-skill-run-report"
import { planBrandSkillBundleRender } from "../renderers/plan-brand-skill-bundle-render"
import { renderBrandSkillBundle } from "../renderers/render-brand-skill-bundle"
import { buildSourceInventory } from "../sources/build-source-inventory"
import { validateBrandSkillRun } from "../validation/validate-brand-skill-run"

export const runBrandSkillCommand = async (
  command: IBrandSkillCommand,
): Promise<IBrandSkillExecutionPlan> => {
  const sourceInventory = await buildSourceInventory(command)
  const validation = validateBrandSkillRun(command, sourceInventory)
  const evidenceRecords = buildBrandEvidenceRecords(sourceInventory)
  const normalizedBrandModel = buildNormalizedBrandModelScaffold(
    command.brandName,
    evidenceRecords,
    sourceInventory,
  )
  const report = buildBrandSkillRunReport(
    command,
    sourceInventory,
    validation,
    normalizedBrandModel,
  )
  const plannedFiles = planBrandSkillBundleRender(command)
  const updateMode = detectBrandSkillUpdateMode(command.destinationDir)
  const shouldRender =
    validation.canContinue &&
    !command.dryRun &&
    (command.mode === "generate" || command.mode === "refresh")
  const renderedFiles = shouldRender
    ? renderBrandSkillBundle({
        command,
        sourceInventory,
        normalizedBrandModel,
        report,
        updateMode,
      })
    : []

  return {
    command,
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
