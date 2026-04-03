import { z } from "zod";

export const geminiWorkerInputSchema = z.object({
  taskId: z.string().trim().min(1),
  prompt: z.string().trim().min(1),
  model: z.string().trim().min(1),
  timeoutMs: z.number().int().positive().max(300_000).optional(),
  cwd: z.string().trim().min(1).optional(),
  binaryPath: z.string().trim().min(1).optional(),
});

export const geminiJsonResponseSchema = z.object({
  response: z.string().optional(),
  stats: z.record(z.string(), z.unknown()).optional(),
  error: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
}).catchall(z.unknown());
