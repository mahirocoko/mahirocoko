import type { ParallelWorkersResult, WorkerJob, WorkerJobResult } from "./types.js";
import { runWorkerJob } from "./run-worker-job.js";
import { prepareJobForWorkflowTimeout } from "./workflow-timeout.js";

export interface RunParallelWorkersOptions {
  readonly maxConcurrency?: number;
  readonly timeoutMs?: number;
}

export async function runParallelWorkers(
  jobs: readonly WorkerJob[],
  options: RunParallelWorkersOptions = {},
): Promise<ParallelWorkersResult> {
  const maxConcurrency = normalizeMaxConcurrency(jobs.length, options.maxConcurrency);
  const deadlineAt = options.timeoutMs ? Date.now() + options.timeoutMs : undefined;

  if (jobs.length === 0) {
    return {
      results: [],
      timedOut: false,
    };
  }

  const results = new Array<WorkerJobResult | undefined>(jobs.length);
  let nextIndex = 0;
  let timedOut = false;

  const workers = Array.from({ length: maxConcurrency }, async () => {
    while (nextIndex < jobs.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      const preparedJob = prepareJobForWorkflowTimeout(jobs[currentIndex] as WorkerJob, deadlineAt);

      if (!preparedJob) {
        timedOut = true;
        return;
      }

      const result = await runWorkerJob(preparedJob.job);
      results[currentIndex] = result;

      if (preparedJob.workflowTimeoutBounded && "result" in result && result.result.status === "timeout") {
        timedOut = true;
      }
    }
  });

  await Promise.all(workers);

  return {
    results: results.filter((result): result is WorkerJobResult => result !== undefined),
    timedOut,
  };
}

function normalizeMaxConcurrency(jobCount: number, maxConcurrency: number | undefined): number {
  if (!maxConcurrency) {
    return Math.max(jobCount, 1);
  }

  return Math.min(maxConcurrency, Math.max(jobCount, 1));
}
