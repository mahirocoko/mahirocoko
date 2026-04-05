import { runCursorWorker } from "../cursor/cursor-worker-service.js";
import { runGeminiWorker } from "../gemini/gemini-worker-service.js";
import type { WorkerJob, WorkerJobResult } from "./types.js";

export async function runWorkerJob(job: WorkerJob): Promise<WorkerJobResult> {
  if (job.kind === "gemini") {
    try {
      return {
        kind: job.kind,
        input: job.input,
        result: await runGeminiWorker(job.input, job.dependencies),
      };
    } catch (error) {
      return {
        kind: job.kind,
        input: job.input,
        status: "runner_failed",
        error: formatUnexpectedError(error),
      };
    }
  }

  try {
    return {
      kind: job.kind,
      input: job.input,
      result: await runCursorWorker(job.input, job.dependencies),
    };
  } catch (error) {
    return {
      kind: job.kind,
      input: job.input,
      status: "runner_failed",
      error: formatUnexpectedError(error),
    };
  }
}

function formatUnexpectedError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown worker execution error.";
}
