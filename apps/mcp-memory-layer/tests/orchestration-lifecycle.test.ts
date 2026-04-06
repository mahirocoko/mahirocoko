import { describe, expect, it, vi } from "vitest";

import { OrchestrationLifecycle } from "../src/features/orchestration/observability/orchestration-lifecycle.js";

describe("OrchestrationLifecycle", () => {
  it("coordinates runner failure writes across trace and result stores", async () => {
    const traceStore = {
      append: vi.fn(async () => undefined),
    } as const;
    const resultStore = {
      writeRunning: vi.fn(async () => undefined),
      writeCompleted: vi.fn(async () => undefined),
      writeRunnerFailed: vi.fn(async () => undefined),
    } as const;
    const lifecycle = new OrchestrationLifecycle(traceStore as never, resultStore as never);

    await lifecycle.markRunnerFailed({
      requestId: "workflow_123",
      source: "mcp",
      spec: {
        mode: "parallel",
        jobs: [
          {
            kind: "cursor",
            input: { taskId: "cursor_123", prompt: "Review", model: "composer-2" },
          },
        ],
      },
      error: "boom",
      startedAt: "2026-04-06T00:00:00.000Z",
    });

    expect(traceStore.append).toHaveBeenCalledTimes(1);
    expect(resultStore.writeRunnerFailed).toHaveBeenCalledWith({
      requestId: "workflow_123",
      source: "mcp",
      spec: {
        mode: "parallel",
        jobs: [
          {
            kind: "cursor",
            input: { taskId: "cursor_123", prompt: "Review", model: "composer-2" },
          },
        ],
      },
      error: "boom",
      startedAt: "2026-04-06T00:00:00.000Z",
    });
  });
});
