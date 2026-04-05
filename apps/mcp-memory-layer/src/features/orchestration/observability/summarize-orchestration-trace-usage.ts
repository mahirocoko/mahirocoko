import type { OrchestrationJobStatus, OrchestrationTraceEntry } from "../types.js";

export interface OrchestrationTraceDaySummary {
  readonly traceCount: number;
  readonly jobCount: number;
  readonly completedJobs: number;
  readonly failedJobs: number;
}

interface MutableOrchestrationTraceDaySummary {
  traceCount: number;
  jobCount: number;
  completedJobs: number;
  failedJobs: number;
}

export interface OrchestrationOutcomeSummary {
  readonly completed: number;
  readonly failed: number;
  readonly successRate: number;
}

export interface OrchestrationModelOutcomeSummary {
  readonly jobCount: number;
  readonly completed: number;
  readonly failed: number;
  readonly successRate: number;
}

export interface OrchestrationTraceUsageSummary {
  readonly traceCount: number;
  readonly jobCount: number;
  readonly byWorkerKind: Readonly<Record<string, number>>;
  readonly byRequestedModel: Readonly<Record<string, number>>;
  readonly byReportedModel: Readonly<Record<string, number>>;
  readonly bySource: Readonly<Record<string, number>>;
  readonly byWorkflowStatus: Readonly<Record<string, number>>;
  readonly byJobStatus: Readonly<Record<string, number>>;
  readonly byDay: Readonly<Record<string, OrchestrationTraceDaySummary>>;
  readonly workflowOutcome: OrchestrationOutcomeSummary;
  readonly jobOutcome: OrchestrationOutcomeSummary;
  readonly byRequestedModelOutcome: Readonly<Record<string, OrchestrationModelOutcomeSummary>>;
}

/**
 * Aggregates worker/model counts from persisted orchestration traces.
 * Entries without `jobModels` still contribute `byWorkerKind` via `jobKinds`.
 */
export function summarizeOrchestrationTraceUsage(
  traces: readonly OrchestrationTraceEntry[],
): OrchestrationTraceUsageSummary {
  const byWorkerKind: Record<string, number> = {};
  const byRequestedModel: Record<string, number> = {};
  const byReportedModel: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const byWorkflowStatus: Record<string, number> = {};
  const byJobStatus: Record<string, number> = {};
  const byDay: Record<string, MutableOrchestrationTraceDaySummary> = {};
  const byRequestedModelOutcome: Record<string, { jobCount: number; completed: number; failed: number }> = {};
  let jobCount = 0;
  let completedWorkflows = 0;
  let failedWorkflows = 0;
  let completedJobs = 0;
  let failedJobs = 0;

  for (const trace of traces) {
    bySource[trace.source] = (bySource[trace.source] ?? 0) + 1;
    byWorkflowStatus[trace.status] = (byWorkflowStatus[trace.status] ?? 0) + 1;

    if (trace.status === "completed") {
      completedWorkflows += 1;
    } else {
      failedWorkflows += 1;
    }

    completedJobs += trace.completedJobs;
    failedJobs += trace.failedJobs;
    accumulateByDay(byDay, trace);

    if (trace.jobModels && trace.jobModels.length > 0) {
      for (const job of trace.jobModels) {
        jobCount += 1;
        byWorkerKind[job.kind] = (byWorkerKind[job.kind] ?? 0) + 1;
        byRequestedModel[job.requestedModel] = (byRequestedModel[job.requestedModel] ?? 0) + 1;
        const jobStatus = typeof job.status === "string" ? job.status : undefined;

        if (jobStatus) {
          byJobStatus[jobStatus] = (byJobStatus[jobStatus] ?? 0) + 1;

          let modelOutcome = byRequestedModelOutcome[job.requestedModel];

          if (!modelOutcome) {
            modelOutcome = {
              jobCount: 0,
              completed: 0,
              failed: 0,
            };
            byRequestedModelOutcome[job.requestedModel] = modelOutcome;
          }

          modelOutcome.jobCount += 1;

          if (isSuccessfulJobStatus(jobStatus)) {
            modelOutcome.completed += 1;
          } else {
            modelOutcome.failed += 1;
          }
        }

        if (job.reportedModel !== undefined) {
          byReportedModel[job.reportedModel] = (byReportedModel[job.reportedModel] ?? 0) + 1;
        }
      }
      continue;
    }

    for (const kind of trace.jobKinds) {
      jobCount += 1;
      byWorkerKind[kind] = (byWorkerKind[kind] ?? 0) + 1;
    }
  }

  return {
    traceCount: traces.length,
    jobCount,
    byWorkerKind,
    byRequestedModel,
    byReportedModel,
    bySource,
    byWorkflowStatus,
    byJobStatus,
    byDay,
    workflowOutcome: buildOutcomeSummary(completedWorkflows, failedWorkflows),
    jobOutcome: buildOutcomeSummary(completedJobs, failedJobs),
    byRequestedModelOutcome: Object.fromEntries(
      Object.entries(byRequestedModelOutcome).map(([model, summary]) => [
        model,
        {
          ...summary,
          successRate: calculateSuccessRate(summary.completed, summary.failed),
        },
      ]),
    ),
  };
}

function accumulateByDay(byDay: Record<string, MutableOrchestrationTraceDaySummary>, trace: OrchestrationTraceEntry): void {
  const day = trace.startedAt.slice(0, 10);
  let summary = byDay[day];

  if (!summary) {
    summary = {
      traceCount: 0,
      jobCount: 0,
      completedJobs: 0,
      failedJobs: 0,
    };
    byDay[day] = summary;
  }

  summary.traceCount += 1;
  summary.jobCount += trace.jobKinds.length;
  summary.completedJobs += trace.completedJobs;
  summary.failedJobs += trace.failedJobs;
}

function buildOutcomeSummary(completed: number, failed: number): OrchestrationOutcomeSummary {
  return {
    completed,
    failed,
    successRate: calculateSuccessRate(completed, failed),
  };
}

function calculateSuccessRate(completed: number, failed: number): number {
  const total = completed + failed;

  if (total === 0) {
    return 0;
  }

  return completed / total;
}

function isSuccessfulJobStatus(status: OrchestrationJobStatus): boolean {
  return status === "completed";
}
