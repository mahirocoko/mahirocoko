import type {
  BrandSourceRole,
  BrandSourceType,
  IBrandSkillCommand,
  IBrandSkillSourcePlanItem,
} from "../model/normalized-brand-model"

const defaultRoleBySourceType: Partial<Record<BrandSourceType, BrandSourceRole>> = {
  "brand-docs": "brand-truth",
  "screenshot-dir": "supporting-reference",
  "code-reference": "supporting-reference",
  "figma-url": "supporting-reference",
}

const buildSourceItems = ({
  sourceType,
  values,
  roles,
}: {
  sourceType: BrandSourceType
  values: string[]
  roles: Array<BrandSourceRole | null>
}) => {
  const defaultRole = defaultRoleBySourceType[sourceType] ?? null

  return values.map<IBrandSkillSourcePlanItem>((location, index) => {
    const explicitRole = roles[index] ?? null
    const role = explicitRole ?? defaultRole
    const isMoodReferenceWebsite = sourceType === "website" && role === "mood-reference"

    return {
      sourceType,
      location,
      role,
      roleOrigin: explicitRole ? "explicit" : defaultRole ? "default" : "unknown",
      includedInExecution: !isMoodReferenceWebsite,
      exclusionReason: isMoodReferenceWebsite
        ? "Mood-reference websites are excluded from engine execution in v2 to avoid lexical drift."
        : null,
    }
  })
}

export const buildBrandSkillSourcePlan = (
  command: IBrandSkillCommand,
): IBrandSkillSourcePlanItem[] => {
  const sourcePlan: IBrandSkillSourcePlanItem[] = []

  if (command.brief.trim()) {
    sourcePlan.push({
      sourceType: "brief",
      location: "[inline brief]",
      role: "brand-truth",
      roleOrigin: "explicit",
      includedInExecution: false,
      exclusionReason: command.writeBriefDoc
        ? null
        : "Brief text must be converted into a temporary brand brief before engine execution.",
    })
  }

  sourcePlan.push(
    ...buildSourceItems({
      sourceType: "website",
      values: command.websiteUrls,
      roles: command.websiteRoles,
    }),
    ...buildSourceItems({
      sourceType: "brand-docs",
      values: command.docsPaths,
      roles: command.docsRoles,
    }),
    ...buildSourceItems({
      sourceType: "screenshot-dir",
      values: command.screenshotPaths,
      roles: command.screenshotRoles,
    }),
    ...buildSourceItems({
      sourceType: "code-reference",
      values: command.codePaths,
      roles: command.codeRoles,
    }),
    ...buildSourceItems({
      sourceType: "figma-url",
      values: command.figmaUrls,
      roles: command.figmaRoles,
    }),
  )

  return sourcePlan
}
