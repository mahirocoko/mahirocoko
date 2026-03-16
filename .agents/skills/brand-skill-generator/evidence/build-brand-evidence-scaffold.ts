import type {
  IBrandEvidenceRecord,
  IBrandSourceInventory,
} from "../model/normalized-brand-model"

export const buildBrandEvidenceScaffold = (
  sourceInventory: IBrandSourceInventory,
): IBrandEvidenceRecord[] => {
  return sourceInventory.sourceRecords.map((sourceRecord, index) => ({
    id: `evidence-${index + 1}`,
    category:
      sourceRecord.sourceType === "brand-docs"
        ? "voice"
        : sourceRecord.sourceType === "website"
          ? "interaction-behavior"
          : sourceRecord.sourceType === "figma-url"
            ? "visual-system"
            : sourceRecord.sourceType === "code-reference"
              ? "design-system"
              : "constraints",
    signalType: sourceRecord.sourceType === "brand-docs" ? "explicit" : "inferred",
    statement: `Placeholder evidence scaffold for ${sourceRecord.sourceType}`,
    sourceIds: [sourceRecord.id],
    confidence: sourceRecord.explicitnessBaseline,
  }))
}
