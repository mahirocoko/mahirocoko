import { runWorkerJob } from "./run-worker-job.js";
import type { SequentialWorkerContext, SequentialWorkerStep, SequentialWorkersResult, WorkerJob, WorkerJobResult } from "./types.js";
import { prepareJobForWorkflowTimeout } from "./workflow-timeout.js";

export interface RunSequentialWorkersOptions {
  readonly timeoutMs?: number;
}

export async function runSequentialWorkers(
  steps: readonly SequentialWorkerStep[],
  options: RunSequentialWorkersOptions = {},
): Promise<SequentialWorkersResult> {
  const results: WorkerJobResult[] = [];
  const deadlineAt = options.timeoutMs ? Date.now() + options.timeoutMs : undefined;

  for (const [stepIndex, step] of steps.entries()) {
    const job = resolveStep(step, {
      results,
      lastResult: results.at(-1),
      stepIndex,
    });

    if ("status" in job) {
      return {
        status: "step_failed",
        results,
        failedStepIndex: stepIndex,
        error: job.error,
      };
    }

    const preparedJob = prepareJobForWorkflowTimeout(job, deadlineAt);

    if (!preparedJob) {
      return {
        status: "timed_out",
        results,
        error: `Workflow timed out before starting step ${stepIndex + 1}.`,
      };
    }

    const result = await runWorkerJob(preparedJob.job);
    results.push(result);

    if (preparedJob.workflowTimeoutBounded && "result" in result && result.result.status === "timeout") {
      return {
        status: "timed_out",
        results,
        error: `Workflow timed out while running step ${stepIndex + 1}.`,
      };
    }
  }

  return {
    status: "completed",
    results,
  };
}

function resolveStep(
  step: SequentialWorkerStep,
  context: SequentialWorkerContext,
): WorkerJob | { readonly status: "step_failed"; readonly error: string } {
  if (typeof step !== "function") {
    return step;
  }

  try {
    return step(context);
  } catch (error) {
    return {
      status: "step_failed",
      error: formatUnexpectedError(error),
    };
  }
}

function formatUnexpectedError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown sequential step error.";
}
