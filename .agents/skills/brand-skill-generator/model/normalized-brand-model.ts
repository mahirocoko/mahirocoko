export type BrandSkillMode = "inspect" | "generate" | "refresh" | "reconcile"

export type BrandSourceType =
  | "website"
  | "brand-docs"
  | "screenshot-dir"
  | "code-reference"
  | "figma-url"

export type SourceLocationType = "url" | "path"
export type SourcePathKind = "file" | "directory" | "missing" | "unknown"
export type SourceFreshness = "unknown" | "current" | "aging" | "stale"
export type EvidenceSignalType = "explicit" | "inferred"
export type ConfidenceLevel = "low" | "medium" | "high"
export type ConflictResolutionMode = "adopt" | "split-by-profile" | "unresolved"

export interface IBrandSkillCommand {
  mode: BrandSkillMode
  brandName: string
  brandSlug: string
  destinationDir: string
  websiteUrls: string[]
  docsPaths: string[]
  screenshotPaths: string[]
  codePaths: string[]
  figmaUrls: string[]
  outputFormat: "text" | "json"
  dryRun: boolean
}

export interface IBrandSourceRecord {
  id: string
  sourceType: BrandSourceType
  locationType: SourceLocationType
  location: string
  pathKind: SourcePathKind
  exists: boolean
  modifiedAt: string | null
  freshness: SourceFreshness
  explicitnessBaseline: ConfidenceLevel
  coverageEstimate: ConfidenceLevel
  notes: string[]
}

export interface IBrandSourceInventory {
  brandName: string
  destinationDir: string
  sourceRecords: IBrandSourceRecord[]
}

export interface IBrandEvidenceRecord {
  id: string
  category:
    | "brand-identity"
    | "voice"
    | "visual-system"
    | "interaction-behavior"
    | "design-system"
    | "constraints"
  signalType: EvidenceSignalType
  statement: string
  sourceIds: string[]
  confidence: ConfidenceLevel
}

export interface IBrandRuleRecord {
  id: string
  title: string
  summary: string
  sourceIds: string[]
  confidence: ConfidenceLevel
  rationale: string
}

export interface IBrandProfileModel {
  profileName: "design-system" | "marketing" | "product-ui" | "dashboard"
  confidence: ConfidenceLevel
  rules: IBrandRuleRecord[]
}

export interface IBrandConflictRecord {
  id: string
  summary: string
  competingSourceIds: string[]
  resolutionMode: ConflictResolutionMode
  chosenDirection: string
  suggestedOverride: string | null
}

export interface INormalizedBrandModel {
  brandIdentity: IBrandRuleRecord[]
  voice: IBrandRuleRecord[]
  visualSystem: IBrandRuleRecord[]
  interactionBehavior: IBrandRuleRecord[]
  designSystem: IBrandRuleRecord[]
  profiles: IBrandProfileModel[]
  evidence: IBrandEvidenceRecord[]
  conflicts: IBrandConflictRecord[]
  overallConfidence: ConfidenceLevel
}

export interface IBrandSkillValidationIssue {
  level: "error" | "warning"
  code: string
  message: string
}

export interface IBrandSkillValidationResult {
  canContinue: boolean
  issues: IBrandSkillValidationIssue[]
}

export interface IBrandSkillPlannedFile {
  path: string
  reason: string
}

export interface IBrandSkillRunReport {
  brandName: string
  brandSlug: string
  mode: BrandSkillMode
  destinationDir: string
  overallConfidence: ConfidenceLevel
  sourceSummary: {
    totalSources: number
    byType: Partial<Record<BrandSourceType, number>>
  }
  topConflicts: IBrandConflictRecord[]
  topInferredRules: IBrandRuleRecord[]
  missingSourceSuggestions: string[]
  validationIssues: IBrandSkillValidationIssue[]
}

export interface IBrandSkillExecutionPlan {
  command: IBrandSkillCommand
  sourceInventory: IBrandSourceInventory
  validation: IBrandSkillValidationResult
  normalizedBrandModel: INormalizedBrandModel
  report: IBrandSkillRunReport
  plannedFiles: IBrandSkillPlannedFile[]
  updateMode: "create" | "update"
  status: "scaffold-ready"
}
