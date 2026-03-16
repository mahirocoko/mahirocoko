#!/usr/bin/env bun
import { parseBrandSkillCommand } from "./parse-brand-skill-command"
import { printBrandSkillHelp } from "./print-brand-skill-help"
import { runBrandSkillCommand } from "../runtime/run-brand-skill-command"

const printTextOutput = (executionPlan: ReturnType<typeof runBrandSkillCommand>) => {
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
    "Phase 1 note: this CLI currently scaffolds contracts, validation, and execution planning. Real synthesis and file rendering land in later phases.",
  )
}

const main = () => {
  try {
    const command = parseBrandSkillCommand(process.argv)

    if (!command) {
      printBrandSkillHelp()
      return
    }

    const executionPlan = runBrandSkillCommand(command)

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

main()
