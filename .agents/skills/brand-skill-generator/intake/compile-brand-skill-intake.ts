import fs from "node:fs"
import path from "node:path"

import type {
  BrandSourceRole,
  IBrandSkillCommand,
  IBrandSkillPreflightResult,
  IBrandSkillSourcePlanItem,
} from "../model/normalized-brand-model"

const ensureDirectory = (targetPath: string) => {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
}

const buildGeneratedBriefPath = (command: IBrandSkillCommand) =>
  path.join(
    command.workspaceRoot,
    ".agents",
    "skills",
    "brand-skill-generator",
    ".generated",
    "briefs",
    `${command.brandSlug || "brand-skill"}-brand-brief.md`,
  )

const renderGeneratedBrief = (command: IBrandSkillCommand) => `# ${command.brandName} Brand Brief

Status: Generated from intake brief

## Summary

${command.brief.trim()}

## Notes

- This file was generated automatically because a brief was provided without explicit brand docs.
- Review and replace this file with stronger brand documentation when available.
`

const filterValuesByRole = ({
  values,
  roles,
  shouldInclude,
}: {
  values: string[]
  roles: Array<BrandSourceRole | null>
  shouldInclude: (role: BrandSourceRole | null) => boolean
}) => {
  const keptValues: string[] = []
  const keptRoles: Array<BrandSourceRole | null> = []

  for (const [index, value] of values.entries()) {
    const role = roles[index] ?? null

    if (!shouldInclude(role)) {
      continue
    }

    keptValues.push(value)
    keptRoles.push(role)
  }

  return {
    keptValues,
    keptRoles,
  }
}

const fillMissingRolesFromSourcePlan = ({
  preflight,
  roles,
  sourceType,
}: {
  preflight: IBrandSkillPreflightResult
  roles: Array<BrandSourceRole | null>
  sourceType: IBrandSkillSourcePlanItem["sourceType"]
}) => {
  const plannedRoles = preflight.sourcePlan
    .filter((sourceItem) => sourceItem.sourceType === sourceType)
    .map((sourceItem) => sourceItem.role)

  return roles.map((role, index) => role ?? plannedRoles[index] ?? null)
}

const buildCompiledSourcePlan = ({
  generatedBriefPath,
  preflight,
}: {
  generatedBriefPath: string | null
  preflight: IBrandSkillPreflightResult
}) => {
  return preflight.sourcePlan.map<IBrandSkillSourcePlanItem>((sourceItem) => {
    if (sourceItem.sourceType === "website" && sourceItem.role === "mood-reference") {
      return {
        ...sourceItem,
        includedInExecution: false,
        exclusionReason:
          "Mood-reference websites are excluded from engine execution in v2 to avoid lexical drift.",
      }
    }

    if (sourceItem.sourceType === "brief") {
      if (!generatedBriefPath) {
        return sourceItem
      }

      return {
        ...sourceItem,
        location: generatedBriefPath,
        roleOrigin: "generated",
        includedInExecution: true,
        exclusionReason: null,
      }
    }

    return sourceItem
  })
}

export const compileBrandSkillIntake = ({
  command,
  preflight,
}: {
  command: IBrandSkillCommand
  preflight: IBrandSkillPreflightResult
}) => {
  if (preflight.status !== "ready") {
    return {
      compiledCommand: null,
      compiledSourcePlan: preflight.sourcePlan,
    }
  }

  let generatedBriefPath: string | null = null
  const docsPaths = [...command.docsPaths]
  const websiteRoles = fillMissingRolesFromSourcePlan({
    preflight,
    roles: command.websiteRoles,
    sourceType: "website",
  })
  const docsRoles = fillMissingRolesFromSourcePlan({
    preflight,
    roles: command.docsRoles,
    sourceType: "brand-docs",
  })
  const screenshotRoles = fillMissingRolesFromSourcePlan({
    preflight,
    roles: command.screenshotRoles,
    sourceType: "screenshot-dir",
  })
  const codeRoles = fillMissingRolesFromSourcePlan({
    preflight,
    roles: command.codeRoles,
    sourceType: "code-reference",
  })
  const figmaRoles = fillMissingRolesFromSourcePlan({
    preflight,
    roles: command.figmaRoles,
    sourceType: "figma-url",
  })
  const autoAttachedDesignMdPath = preflight.cachedDesignMd?.absolutePath ?? null

  if (command.writeBriefDoc && command.brief.trim() && docsPaths.length === 0 && !autoAttachedDesignMdPath) {
    generatedBriefPath = buildGeneratedBriefPath(command)
    ensureDirectory(generatedBriefPath)
    fs.writeFileSync(generatedBriefPath, renderGeneratedBrief(command))
    docsPaths.push(generatedBriefPath)
    docsRoles.push("brand-truth")
  }

  if (autoAttachedDesignMdPath) {
    docsPaths.push(autoAttachedDesignMdPath)
    docsRoles.push("brand-truth")
  }

  const websiteFilter = filterValuesByRole({
    values: command.websiteUrls,
    roles: websiteRoles,
    shouldInclude: (role) => role !== "mood-reference",
  })

  const compiledCommand: IBrandSkillCommand = {
    ...command,
    docsPaths,
    docsRoles,
    websiteUrls: websiteFilter.keptValues,
    websiteRoles: websiteFilter.keptRoles,
    screenshotRoles,
    codeRoles,
    figmaRoles,
  }

  return {
    compiledCommand,
    compiledSourcePlan: buildCompiledSourcePlan({
      generatedBriefPath,
      preflight,
    }),
  }
}
