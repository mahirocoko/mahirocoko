#!/usr/bin/env bun
import { parseBrandSkillCommand } from "./parse-brand-skill-command"
import { printBrandSkillHelp } from "./print-brand-skill-help"
import { runBrandSkillCommand } from "../runtime/run-brand-skill-command"

const printTextOutput = (executionPlan: Awaited<ReturnType<typeof runBrandSkillCommand>>) => {
  console.log(`# brand-skill ${executionPlan.command.mode}`)
  console.log("")
  console.log(`Brand: ${executionPlan.command.brandName}`)
  console.log(`Slug: ${executionPlan.command.brandSlug}`)
  console.log(`Destination: ${executionPlan.command.destinationDir}`)
  console.log(`Update mode: ${executionPlan.updateMode}`)
  console.log(`Status: ${executionPlan.status}`)
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
  console.log("## Planned Files")

  for (const plannedFile of executionPlan.plannedFiles) {
    console.log(`- ${plannedFile.path} — ${plannedFile.reason}`)
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
    "Phase 2 note: source ingestion and first-pass evidence extraction are live. Weighted synthesis depth, conflict handling, and file rendering still land in later phases.",
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

    if (!executionPlan.validation.canContinue) {
      process.exitCode = 1
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error(`brand-skill failed: ${message}`)
    process.exitCode = 1
  }
}

await main()
