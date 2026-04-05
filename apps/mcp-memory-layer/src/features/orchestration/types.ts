import type { RunCursorWorkerDependencies } from "../cursor/cursor-worker-service.js";
import type { CursorWorkerInput, CursorWorkerResult } from "../cursor/types.js";
import type { RunGeminiWorkerDependencies } from "../gemini/gemini-worker-service.js";
import type { GeminiWorkerInput, GeminiWorkerResult } from "../gemini/types.js";

export interface GeminiWorkerJob {
  readonly kind: "gemini";
  readonly input: GeminiWorkerInput;
  readonly dependencies?: RunGeminiWorkerDependencies;
  readonly retries?: number;
  readonly retryDelayMs?: number;
  readonly continueOnFailure?: boolean;
}

export interface CursorWorkerJob {
  readonly kind: "cursor";
  readonly input: CursorWorkerInput;
  readonly dependencies?: RunCursorWorkerDependencies;
  readonly retries?: number;
  readonly retryDelayMs?: number;
  readonly continueOnFailure?: boolean;
}

export type WorkerJob = GeminiWorkerJob | CursorWorkerJob;

export interface GeminiWorkerJobResult {
  readonly kind: "gemini";
  readonly input: GeminiWorkerInput;
  readonly result: GeminiWorkerResult;
}

export interface CursorWorkerJobResult {
  readonly kind: "cursor";
  readonly input: CursorWorkerInput;
  readonly result: CursorWorkerResult;
}

export interface GeminiWorkerJobFailure {
  readonly kind: "gemini";
  readonly input: GeminiWorkerInput;
  readonly status: "runner_failed";
  readonly error: string;
}

export interface CursorWorkerJobFailure {
  readonly kind: "cursor";
  readonly input: CursorWorkerInput;
  readonly status: "runner_failed";
  readonly error: string;
}

export type WorkerJobResult =
  | GeminiWorkerJobResult
  | CursorWorkerJobResult
  | GeminiWorkerJobFailure
  | CursorWorkerJobFailure;

export interface JobCompleteEvent {
  readonly mode: "parallel" | "sequential";
  readonly jobIndex: number;
  readonly finishedJobs: number;
  readonly totalJobs: number;
  readonly job: WorkerJob;
  readonly result: WorkerJobResult;
}

// Library-only runtime hook for callers that want incremental progress.
// Parallel events arrive in completion order, not job index order.
// Sequential totalJobs counts declared steps, including ones that may be skipped via `null`.

export interface SequentialWorkerContext {
  readonly results: readonly WorkerJobResult[];
  readonly lastResult?: WorkerJobResult;
  readonly stepIndex: number;
}

export type SequentialWorkerStep = WorkerJob | ((context: SequentialWorkerContext) => WorkerJob | null);

export interface OrchestrationTraceEntry {
  readonly requestId: string;
  readonly source: "cli" | "mcp";
  readonly mode: "parallel" | "sequential";
  readonly status: "completed" | "step_failed" | "timed_out";
  readonly maxConcurrency?: number;
  readonly timeoutMs?: number;
  readonly jobKinds: readonly WorkerJob["kind"][];
  readonly taskIds: readonly string[];
  readonly totalJobs: number;
  readonly finishedJobs: number;
  readonly completedJobs: number;
  readonly failedJobs: number;
  readonly skippedJobs: number;
  readonly failedStepIndex?: number;
  readonly error?: string;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly durationMs: number;
  readonly createdAt: string;
}

export interface ListOrchestrationTracesInput {
  readonly source?: OrchestrationTraceEntry["source"];
  readonly mode?: OrchestrationTraceEntry["mode"];
  readonly status?: OrchestrationTraceEntry["status"];
  readonly requestId?: string;
  readonly taskId?: string;
  readonly limit?: number;
}

export interface ParallelWorkersResult {
  readonly results: readonly WorkerJobResult[];
  readonly timedOut: boolean;
}

export interface SequentialWorkersResult {
  readonly status: "completed" | "step_failed" | "timed_out";
  readonly results: readonly WorkerJobResult[];
  readonly failedStepIndex?: number;
  readonly error?: string;
}
