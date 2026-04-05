import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import type { OrchestrationRunResult } from "../run-orchestration-workflow.js";
import type { OrchestrateWorkflowSpec } from "../workflow-spec.js";
import type { OrchestrationTraceEntry } from "../types.js";

export class OrchestrationTraceStore {
  public constructor(private readonly filePath: string) {}

  public async append(entry: OrchestrationTraceEntry): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(entry)}\n`, "utf8");
  }
}

export function buildOrchestrationTraceEntry(
  requestId: string,
  source: OrchestrationTraceEntry["source"],
  spec: OrchestrateWorkflowSpec,
  result: OrchestrationRunResult,
): OrchestrationTraceEntry {
  return {
    requestId,
    source,
    mode: spec.mode,
    status: result.status,
    maxConcurrency: spec.mode === "parallel" ? spec.maxConcurrency : undefined,
    timeoutMs: spec.timeoutMs,
    jobKinds: result.results.map((job) => job.kind),
    taskIds: result.results.map((job) => job.input.taskId),
    totalJobs: result.summary.totalJobs,
    finishedJobs: result.summary.finishedJobs,
    completedJobs: result.summary.completedJobs,
    failedJobs: result.summary.failedJobs,
    skippedJobs: result.summary.skippedJobs,
    failedStepIndex: result.mode === "sequential" ? result.failedStepIndex : undefined,
    error: result.mode === "sequential" ? result.error : undefined,
    startedAt: result.summary.startedAt,
    finishedAt: result.summary.finishedAt,
    durationMs: result.summary.durationMs,
    createdAt: new Date().toISOString(),
  };
}
