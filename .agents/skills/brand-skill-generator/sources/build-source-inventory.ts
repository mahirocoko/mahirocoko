import type {
  BrandSourceType,
  IBrandSkillCommand,
  IBrandSourceInventory,
  IBrandSourceRecord,
} from "../model/normalized-brand-model"
import { loadSourceRecordDetails } from "./load-source-record-details"

export const buildSourceInventory = async (
  command: IBrandSkillCommand,
): Promise<IBrandSourceInventory> => {
  const sourceRecords: IBrandSourceRecord[] = []

  const sourceGroups: Array<{ sourceType: BrandSourceType; values: string[] }> = [
    {
      sourceType: "website",
      values: command.websiteUrls,
    },
    {
      sourceType: "brand-docs",
      values: command.docsPaths,
    },
    {
      sourceType: "screenshot-dir",
      values: command.screenshotPaths,
    },
    {
      sourceType: "code-reference",
      values: command.codePaths,
    },
    {
      sourceType: "figma-url",
      values: command.figmaUrls,
    },
  ]

  for (const sourceGroup of sourceGroups) {
    for (const [index, value] of sourceGroup.values.entries()) {
      sourceRecords.push(await loadSourceRecordDetails(sourceGroup.sourceType, value, index + 1))
    }
  }

  return {
    brandName: command.brandName,
    destinationDir: command.destinationDir,
    sourceRecords,
  }
}
