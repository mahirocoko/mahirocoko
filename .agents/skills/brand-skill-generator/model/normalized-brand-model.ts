export type BrandSkillMode = "inspect" | "generate" | "refresh" | "reconcile"
export type BrandSourceRole =
  | "brand-truth"
  | "live-product"
  | "mood-reference"
  | "supporting-reference"

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
export type BrandSkillPreflightStatus = "needs-clarification" | "ready"

export interface IBrandSourceTextSample {
  label: string
  content: string
}

export interface IBrandSkillCommand {
  mode: BrandSkillMode
  brandName: string
  brandSlug: string
  workspaceRoot: string
  destinationDir: string
  brief: string
  writeBriefDoc: boolean
  websiteUrls: string[]
  websiteRoles: Array<BrandSourceRole | null>
  docsPaths: string[]
  docsRoles: Array<BrandSourceRole | null>
  screenshotPaths: string[]
  screenshotRoles: Array<BrandSourceRole | null>
  codePaths: string[]
  codeRoles: Array<BrandSourceRole | null>
  figmaUrls: string[]
  figmaRoles: Array<BrandSourceRole | null>
  outputFormat: "text" | "json"
  dryRun: boolean
}

export interface IBrandSourceRecord {
  id: string
  sourceType: BrandSourceType
  locationType: SourceLocationType
  location: string
  resolvedLocation: string
  pathKind: SourcePathKind
  exists: boolean
  modifiedAt: string | null
  freshness: SourceFreshness
  sourceRole: BrandSourceRole | null
  explicitnessBaseline: ConfidenceLevel
  coverageEstimate: ConfidenceLevel
  itemCount: number
  discoveredPaths: string[]
  textSamples: IBrandSourceTextSample[]
  metadata: Record<string, string>
  sourceSummary: string
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

export interface IBrandSkillPreflightQuestion {
  code: string
  prompt: string
}

export interface IBrandSkillSourcePlanItem {
  sourceType: BrandSourceType | "brief"
  location: string
  role: BrandSourceRole | null
  roleOrigin: "explicit" | "default" | "generated" | "unknown"
  includedInExecution: boolean
  exclusionReason: string | null
}

export interface IBrandSkillPreflightResult {
  status: BrandSkillPreflightStatus
  knownInputs: string[]
  missingCoverage: string[]
  ambiguities: string[]
  warnings: string[]
  issues: IBrandSkillValidationIssue[]
  nextQuestion: IBrandSkillPreflightQuestion | null
  sourcePlan: IBrandSkillSourcePlanItem[]
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
  preflightStatus: BrandSkillPreflightStatus
  preflightKnownInputs: string[]
  preflightMissingCoverage: string[]
  preflightAmbiguities: string[]
  preflightWarnings: string[]
  preflightNextQuestion: IBrandSkillPreflightQuestion | null
  sourcePlan: IBrandSkillSourcePlanItem[]
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
  compiledCommand: IBrandSkillCommand | null
  preflight: IBrandSkillPreflightResult
  sourceInventory: IBrandSourceInventory
  validation: IBrandSkillValidationResult
  normalizedBrandModel: INormalizedBrandModel
  report: IBrandSkillRunReport
  plannedFiles: IBrandSkillPlannedFile[]
  renderedFiles: string[]
  updateMode: "create" | "update"
  status: "needs-user-input" | "source-extracted" | "bundle-rendered"
}
