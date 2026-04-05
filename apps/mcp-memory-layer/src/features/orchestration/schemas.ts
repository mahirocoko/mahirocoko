import { z } from "zod";

export const listOrchestrationTracesInputSchema = z.object({
  source: z.enum(["cli", "mcp"]).optional(),
  mode: z.enum(["parallel", "sequential"]).optional(),
  status: z.enum(["completed", "step_failed", "timed_out"]).optional(),
  requestId: z.string().trim().min(1).optional(),
  taskId: z.string().trim().min(1).optional(),
  limit: z.number().int().positive().max(100).optional(),
});
