#!/usr/bin/env bun
import { parseBrandSkillCommand } from "./parse-brand-skill-command"
import { printBrandSkillHelp } from "./print-brand-skill-help"
import { runBrandSkillCommand } from "../runtime/run-brand-skill-command"

const printTextOutput = (executionPlan: Awaited<ReturnType<typeof runBrandSkillCommand>>) => {
  console.log(`# brand-skill ${executionPlan.command.mode}`)
  console.log("")
  console.log(`Brand: ${executionPlan.command.brandName}`)
  console.log(`Slug: ${executionPlan.command.brandSlug}`)
  console.log(`Destination: ${executionPlan.report.destinationDir}`)
  console.log(`Update mode: ${executionPlan.updateMode}`)
  console.log(`Status: ${executionPlan.status}`)
  console.log("")

  console.log("## Preflight")
  console.log(`Status: ${executionPlan.preflight.status}`)

  if (executionPlan.report.preflightKnownInputs.length > 0) {
    console.log("")
    console.log("### Known Inputs")

    for (const knownInput of executionPlan.report.preflightKnownInputs) {
      console.log(`- ${knownInput}`)
    }
  }

  if (executionPlan.report.preflightMissingCoverage.length > 0) {
    console.log("")
    console.log("### Missing Coverage")

    for (const missingCoverage of executionPlan.report.preflightMissingCoverage) {
      console.log(`- ${missingCoverage}`)
    }
  }

  if (executionPlan.report.preflightAmbiguities.length > 0) {
    console.log("")
    console.log("### Ambiguities")

    for (const ambiguity of executionPlan.report.preflightAmbiguities) {
      console.log(`- ${ambiguity}`)
    }
  }

  if (executionPlan.report.preflightWarnings.length > 0) {
    console.log("")
    console.log("### Preflight Warnings")

    for (const warning of executionPlan.report.preflightWarnings) {
      console.log(`- ${warning}`)
    }
  }

  if (executionPlan.report.preflightNextQuestion) {
    console.log("")
    console.log("### Next Question")
    console.log(
      `- [${executionPlan.report.preflightNextQuestion.code}] ${executionPlan.report.preflightNextQuestion.prompt}`,
    )
  }

  console.log("")
  console.log("### Source Plan")

  for (const sourceItem of executionPlan.report.sourcePlan) {
    const inclusionLine = sourceItem.includedInExecution ? "included" : "excluded"
    const roleLine = sourceItem.role ?? "unspecified"
    const exclusionReason = sourceItem.exclusionReason
      ? ` (${sourceItem.exclusionReason})`
      : ""

    console.log(`- ${sourceItem.sourceType}: ${sourceItem.location}`)
    console.log(`  role: ${roleLine} [${sourceItem.roleOrigin}]`)
    console.log(`  execution: ${inclusionLine}${exclusionReason}`)
  }

  console.log("")
  console.log("## Source Summary")
  console.log(`Total sources: ${executionPlan.report.sourceSummary.totalSources}`)

  for (const [sourceType, count] of Object.entries(executionPlan.report.sourceSummary.byType)) {
    console.log(`- ${sourceType}: ${count}`)
  }

  console.log("")
  console.log("## Source Details")

  for (const sourceRecord of executionPlan.sourceInventory.sourceRecords) {
    console.log(`- ${sourceRecord.id} (${sourceRecord.sourceType})`)
    console.log(`  role: ${sourceRecord.sourceRole ?? "unspecified"}`)
    console.log(`  summary: ${sourceRecord.sourceSummary}`)
    console.log(`  confidence baseline: ${sourceRecord.explicitnessBaseline}`)

    if (sourceRecord.discoveredPaths.length > 0) {
      console.log(`  discovered: ${sourceRecord.discoveredPaths.join(", ")}`)
    }

    if (sourceRecord.notes.length > 0) {
      console.log(`  notes: ${sourceRecord.notes.join(" | ")}`)
    }
  }

  console.log("")
  console.log("## Validation")

  if (executionPlan.validation.issues.length === 0) {
    console.log("- No validation issues")
  } else {
    for (const issue of executionPlan.validation.issues) {
      console.log(`- [${issue.level}] ${issue.code}: ${issue.message}`)
    }
  }

  console.log("")
  console.log("## Conflicts")

  if (executionPlan.report.topConflicts.length === 0) {
    console.log("- None")
  } else {
    for (const conflict of executionPlan.report.topConflicts) {
      console.log(`- ${conflict.summary}`)
      console.log(`  resolution: ${conflict.chosenDirection}`)

      if (conflict.suggestedOverride) {
        console.log(`  suggested override: ${conflict.suggestedOverride}`)
      }
    }
  }

  console.log("")
  console.log("## Planned Files")

  for (const plannedFile of executionPlan.plannedFiles) {
    console.log(`- ${plannedFile.path} — ${plannedFile.reason}`)
  }

  if (executionPlan.renderedFiles.length > 0) {
    console.log("")
    console.log("## Rendered Files")

    for (const renderedFile of executionPlan.renderedFiles) {
      console.log(`- ${renderedFile}`)
    }
  }

  console.log("")
  console.log("## Missing Source Suggestions")

  if (executionPlan.report.missingSourceSuggestions.length === 0) {
    console.log("- None")
  } else {
    for (const suggestion of executionPlan.report.missingSourceSuggestions) {
      console.log(`- ${suggestion}`)
    }
  }

  console.log("")
  console.log(
    executionPlan.status === "bundle-rendered"
      ? "Phase 3 note: weighted synthesis and bundle rendering are active. Conflict handling is now source-aware, but still heuristic and will deepen in later phases."
      : "Phase 3 note: weighted synthesis is active. Conflict handling is source-aware, and bundle rendering runs during generate/refresh when validation passes.",
  )
}

const main = async () => {
  try {
    const command = parseBrandSkillCommand(process.argv)

    if (!command) {
      printBrandSkillHelp()
      return
    }

    const executionPlan = await runBrandSkillCommand(command)

    if (command.outputFormat === "json") {
      console.log(JSON.stringify(executionPlan, null, 2))
    } else {
      printTextOutput(executionPlan)
    }

    if (executionPlan.status === "needs-user-input" || !executionPlan.validation.canContinue) {
      process.exitCode = 1
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error(`brand-skill failed: ${message}`)
    process.exitCode = 1
  }
}

await main()
