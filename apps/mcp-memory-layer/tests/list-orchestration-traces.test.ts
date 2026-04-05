import { mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import { listOrchestrationTraces } from "../src/features/orchestration/observability/list-orchestration-traces.js";

const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("listOrchestrationTraces", () => {
  it("returns newest matching traces first and applies filters", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "orchestration-traces-"));
    tempDirectories.push(directory);

    const filePath = path.join(directory, "orchestration-trace.jsonl");

    await writeFile(
      filePath,
      [
        JSON.stringify({
          requestId: "workflow-1",
          source: "cli",
          mode: "parallel",
          status: "completed",
          jobKinds: ["gemini"],
          taskIds: ["gemini-1"],
          totalJobs: 1,
          finishedJobs: 1,
          completedJobs: 1,
          failedJobs: 0,
          skippedJobs: 0,
          startedAt: "2026-04-05T00:00:00.000Z",
          finishedAt: "2026-04-05T00:00:01.000Z",
          durationMs: 1000,
          createdAt: "2026-04-05T00:00:01.000Z",
        }),
        JSON.stringify({
          requestId: "workflow-2",
          source: "mcp",
          mode: "sequential",
          status: "timed_out",
          jobKinds: ["gemini", "cursor"],
          taskIds: ["gemini-2", "cursor-2"],
          totalJobs: 2,
          finishedJobs: 1,
          completedJobs: 0,
          failedJobs: 1,
          skippedJobs: 1,
          failedStepIndex: 1,
          error: "Workflow timed out.",
          startedAt: "2026-04-05T00:00:02.000Z",
          finishedAt: "2026-04-05T00:00:03.000Z",
          durationMs: 1000,
          createdAt: "2026-04-05T00:00:03.000Z",
        }),
      ].join("\n"),
      "utf8",
    );

    const traces = await listOrchestrationTraces({
      payload: {
        source: "mcp",
        taskId: "cursor-2",
      },
      filePath,
    });

    expect(traces).toHaveLength(1);
    expect(traces[0]).toMatchObject({
      requestId: "workflow-2",
      source: "mcp",
      status: "timed_out",
    });
  });

  it("returns an empty list when the trace file does not exist", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "orchestration-traces-"));
    tempDirectories.push(directory);

    await expect(
      listOrchestrationTraces({
        payload: {},
        filePath: path.join(directory, "missing.jsonl"),
      }),
    ).resolves.toEqual([]);
  });
});
