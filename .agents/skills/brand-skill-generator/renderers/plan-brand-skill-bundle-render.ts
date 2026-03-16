import path from "node:path"

import type {
  IBrandSkillCommand,
  IBrandSkillPlannedFile,
} from "../model/normalized-brand-model"
import { toWorkspaceRelativePath } from "../utils/workspace-paths"

export const planBrandSkillBundleRender = (
  command: IBrandSkillCommand,
): IBrandSkillPlannedFile[] => {
  const destinationDir = command.destinationDir
  const toDisplayPath = (targetPath: string) =>
    toWorkspaceRelativePath(command.workspaceRoot, targetPath)

  return [
    {
      path: toDisplayPath(path.join(destinationDir, "SKILL.md")),
      reason: "Skill entrypoint for the generated brand bundle.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "core", "brand-dna.md")),
      reason: "Stable brand identity rules.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "core", "voice.md")),
      reason: "Brand copy and tone doctrine.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "core", "visual-system.md")),
      reason: "Cross-surface visual rules.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "core", "behavior.md")),
      reason: "Interaction and state rules.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "core", "source-policy.md")),
      reason: "Weighted-hybrid source policy for this brand skill.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "profiles", "design-system.md")),
      reason: "Design-system-specific rules.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "profiles", "marketing.md")),
      reason: "Marketing and campaign-specific rules.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "profiles", "product-ui.md")),
      reason: "General product UI rules.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "profiles", "dashboard.md")),
      reason: "Dashboard and dense information rules.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "report", "report.md")),
      reason: "Human-readable synthesis report.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "report", "report.json")),
      reason: "Machine-readable synthesis report.",
    },
    {
      path: toDisplayPath(path.join(destinationDir, "report", "changes.md")),
      reason: "Update-in-place delta summary.",
    },
  ]
}
