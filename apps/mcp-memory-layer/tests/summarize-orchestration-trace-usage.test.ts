import { describe, expect, it } from "vitest";

import { summarizeOrchestrationTraceUsage } from "../src/features/orchestration/observability/summarize-orchestration-trace-usage.js";

describe("summarizeOrchestrationTraceUsage", () => {
  it("aggregates requested and reported models from jobModels", () => {
    const summary = summarizeOrchestrationTraceUsage([
      {
        requestId: "a",
        source: "cli",
        mode: "parallel",
        status: "completed",
        jobKinds: ["gemini", "cursor"],
        taskIds: ["t1", "t2"],
        jobModels: [
          {
            kind: "gemini",
            taskId: "t1",
            status: "completed",
            requestedModel: "gemini-3-flash-preview",
            reportedModel: "gemini-3-flash-preview",
          },
          {
            kind: "cursor",
            taskId: "t2",
            status: "command_failed",
            requestedModel: "composer-2",
            reportedModel: "composer-2",
          },
        ],
        totalJobs: 2,
        finishedJobs: 2,
        completedJobs: 2,
        failedJobs: 0,
        skippedJobs: 0,
        startedAt: "2026-04-05T00:00:00.000Z",
        finishedAt: "2026-04-05T00:00:01.000Z",
        durationMs: 1000,
        createdAt: "2026-04-05T00:00:01.000Z",
      },
    ]);

    expect(summary).toEqual({
      traceCount: 1,
      jobCount: 2,
      byWorkerKind: { gemini: 1, cursor: 1 },
      byRequestedModel: { "gemini-3-flash-preview": 1, "composer-2": 1 },
      byReportedModel: { "gemini-3-flash-preview": 1, "composer-2": 1 },
      bySource: { cli: 1 },
      byWorkflowStatus: { completed: 1 },
      byJobStatus: { completed: 1, command_failed: 1 },
      byDay: {
        "2026-04-05": {
          traceCount: 1,
          jobCount: 2,
          completedJobs: 2,
          failedJobs: 0,
        },
      },
      workflowOutcome: { completed: 1, failed: 0, successRate: 1 },
      jobOutcome: { completed: 2, failed: 0, successRate: 1 },
      byRequestedModelOutcome: {
        "gemini-3-flash-preview": { jobCount: 1, completed: 1, failed: 0, successRate: 1 },
        "composer-2": { jobCount: 1, completed: 0, failed: 1, successRate: 0 },
      },
    });
  });

  it("falls back to jobKinds when jobModels is absent (legacy traces)", () => {
    const summary = summarizeOrchestrationTraceUsage([
      {
        requestId: "legacy",
        source: "mcp",
        mode: "sequential",
        status: "completed",
        jobKinds: ["gemini", "gemini", "cursor"],
        taskIds: ["a", "b", "c"],
        totalJobs: 3,
        finishedJobs: 3,
        completedJobs: 3,
        failedJobs: 0,
        skippedJobs: 0,
        startedAt: "2026-04-05T00:00:00.000Z",
        finishedAt: "2026-04-05T00:00:01.000Z",
        durationMs: 1000,
        createdAt: "2026-04-05T00:00:01.000Z",
      },
    ]);

    expect(summary.traceCount).toBe(1);
    expect(summary.jobCount).toBe(3);
    expect(summary.byWorkerKind).toEqual({ gemini: 2, cursor: 1 });
    expect(summary.byRequestedModel).toEqual({});
    expect(summary.byReportedModel).toEqual({});
    expect(summary.bySource).toEqual({ mcp: 1 });
    expect(summary.byWorkflowStatus).toEqual({ completed: 1 });
    expect(summary.byJobStatus).toEqual({});
    expect(summary.byDay).toEqual({
      "2026-04-05": {
        traceCount: 1,
        jobCount: 3,
        completedJobs: 3,
        failedJobs: 0,
      },
    });
    expect(summary.workflowOutcome).toEqual({ completed: 1, failed: 0, successRate: 1 });
    expect(summary.jobOutcome).toEqual({ completed: 3, failed: 0, successRate: 1 });
    expect(summary.byRequestedModelOutcome).toEqual({});
  });

  it("counts runner failures without reportedModel", () => {
    const summary = summarizeOrchestrationTraceUsage([
      {
        requestId: "x",
        source: "cli",
        mode: "parallel",
        status: "completed",
        jobKinds: ["gemini"],
        taskIds: ["t1"],
        jobModels: [{ kind: "gemini", taskId: "t1", status: "runner_failed", requestedModel: "gemini-3-flash-preview" }],
        totalJobs: 1,
        finishedJobs: 1,
        completedJobs: 0,
        failedJobs: 1,
        skippedJobs: 0,
        startedAt: "2026-04-05T00:00:00.000Z",
        finishedAt: "2026-04-05T00:00:01.000Z",
        durationMs: 1000,
        createdAt: "2026-04-05T00:00:01.000Z",
      },
    ]);

    expect(summary.byRequestedModel).toEqual({ "gemini-3-flash-preview": 1 });
    expect(summary.byReportedModel).toEqual({});
    expect(summary.byJobStatus).toEqual({ runner_failed: 1 });
    expect(summary.byRequestedModelOutcome).toEqual({
      "gemini-3-flash-preview": { jobCount: 1, completed: 0, failed: 1, successRate: 0 },
    });
  });

  it("ignores legacy jobModels without status for status-based aggregations", () => {
    const summary = summarizeOrchestrationTraceUsage([
      {
        requestId: "legacy-jobmodels",
        source: "mcp",
        mode: "parallel",
        status: "completed",
        jobKinds: ["cursor"],
        taskIds: ["t1"],
        jobModels: [{ kind: "cursor", taskId: "t1", requestedModel: "composer-2" } as never],
        totalJobs: 1,
        finishedJobs: 1,
        completedJobs: 1,
        failedJobs: 0,
        skippedJobs: 0,
        startedAt: "2026-04-05T00:00:00.000Z",
        finishedAt: "2026-04-05T00:00:01.000Z",
        durationMs: 1000,
        createdAt: "2026-04-05T00:00:01.000Z",
      },
    ]);

    expect(summary.byRequestedModel).toEqual({ "composer-2": 1 });
    expect(summary.byJobStatus).toEqual({});
    expect(summary.byRequestedModelOutcome).toEqual({});
  });
});
