import { z } from "zod";

import { cursorWorkerInputSchema } from "../cursor/schemas.js";
import { geminiWorkerInputSchema } from "../gemini/schemas.js";
import { newId } from "../memory/lib/ids.js";
import type { WorkerJob } from "./types.js";

export const geminiWorkflowInputSchema = geminiWorkerInputSchema.omit({ taskId: true }).extend({
  taskId: z.string().trim().min(1).optional(),
});

export const cursorWorkflowInputSchema = cursorWorkerInputSchema.omit({ taskId: true }).extend({
  taskId: z.string().trim().min(1).optional(),
});

export const workflowJobSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("gemini"),
    input: geminiWorkflowInputSchema,
  }),
  z.object({
    kind: z.literal("cursor"),
    input: cursorWorkflowInputSchema,
  }),
]);

export const workflowSpecSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("parallel"),
    maxConcurrency: z.number().int().positive().max(100).optional(),
    timeoutMs: z.number().int().positive().max(600_000).optional(),
    jobs: z.array(workflowJobSchema).min(1),
  }),
  z.object({
    mode: z.literal("sequential"),
    timeoutMs: z.number().int().positive().max(600_000).optional(),
    steps: z.array(workflowJobSchema).min(1),
  }),
]);

export const orchestrateToolInputSchema = z.object({
  spec: workflowSpecSchema,
  cwd: z.string().trim().min(1).optional(),
});

export type WorkflowSpecInput = z.infer<typeof workflowSpecSchema>;

export type OrchestrateWorkflowSpec =
  | { readonly mode: "parallel"; readonly maxConcurrency?: number; readonly timeoutMs?: number; readonly jobs: readonly WorkerJob[] }
  | { readonly mode: "sequential"; readonly timeoutMs?: number; readonly steps: readonly WorkerJob[] };

export function normalizeWorkflowSpec(
  spec: WorkflowSpecInput,
  defaultCwd: string | undefined,
): OrchestrateWorkflowSpec {
  if (spec.mode === "parallel") {
    return {
      mode: spec.mode,
      maxConcurrency: spec.maxConcurrency,
      timeoutMs: spec.timeoutMs,
      jobs: spec.jobs.map((job) => normalizeJob(job, defaultCwd)),
    };
  }

  return {
    mode: spec.mode,
    timeoutMs: spec.timeoutMs,
    steps: spec.steps.map((step) => normalizeJob(step, defaultCwd)),
  };
}

function normalizeJob(
  job: z.infer<typeof workflowJobSchema>,
  defaultCwd: string | undefined,
): WorkerJob {
  if (job.kind === "gemini") {
    return {
      kind: job.kind,
      input: {
        ...job.input,
        taskId: job.input.taskId ?? newId("gemini"),
        cwd: job.input.cwd ?? defaultCwd,
      },
    };
  }

  return {
    kind: job.kind,
    input: {
      ...job.input,
      taskId: job.input.taskId ?? newId("cursor"),
      cwd: job.input.cwd ?? defaultCwd,
    },
  };
}
