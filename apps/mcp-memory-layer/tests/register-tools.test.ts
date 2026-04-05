import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/features/orchestration/run-orchestration-workflow.js", () => ({
  runOrchestrationWorkflow: vi.fn(async (spec) => ({
    mode: spec.mode,
    status: "completed",
    results: [],
  })),
}));

vi.mock("../src/features/orchestration/observability/list-orchestration-traces.js", () => ({
  listOrchestrationTraces: vi.fn(async () => []),
}));

import type { MemoryService } from "../src/features/memory/memory-service.js";
import { getRegisteredTools } from "../src/features/memory/mcp/register-tools.js";
import { listOrchestrationTraces } from "../src/features/orchestration/observability/list-orchestration-traces.js";
import { runOrchestrationWorkflow } from "../src/features/orchestration/run-orchestration-workflow.js";

describe("getRegisteredTools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers the orchestration workflow MCP tool", () => {
    const tools = getRegisteredTools({} as MemoryService);
    const tool = tools.find((item) => item.name === "orchestrate_workflow");

    expect(tool).toBeDefined();
    expect(tool?.description).toContain("parallel or sequential worker workflow");
    expect(Object.keys(tool?.inputSchema ?? {})).toEqual(expect.arrayContaining(["spec", "cwd"]));
  });

  it("executes the orchestration tool with normalized workflow input", async () => {
    const tools = getRegisteredTools({} as MemoryService);
    const tool = tools.find((item) => item.name === "orchestrate_workflow");
    const runOrchestrationWorkflowMock = vi.mocked(runOrchestrationWorkflow);

    const result = await tool?.execute({
      spec: {
        mode: "parallel",
        jobs: [
          {
            kind: "gemini",
            input: {
              prompt: "Summarize this repo.",
              model: "gemini-3-flash-preview",
            },
          },
        ],
      },
      cwd: "/tmp/project",
    });

    expect(runOrchestrationWorkflowMock).toHaveBeenCalledTimes(1);

    const forwardedSpec = runOrchestrationWorkflowMock.mock.calls[0]?.[0];
    const forwardedOptions = runOrchestrationWorkflowMock.mock.calls[0]?.[1];

    expect(forwardedSpec).toMatchObject({
      mode: "parallel",
      jobs: [
        {
          kind: "gemini",
          input: {
            prompt: "Summarize this repo.",
            model: "gemini-3-flash-preview",
            cwd: "/tmp/project",
          },
        },
      ],
    });
    expect(forwardedSpec?.jobs[0]?.input.taskId).toMatch(/^gemini_/);
    expect(forwardedOptions).toMatchObject({
      traceSource: "mcp",
      traceRequestId: expect.stringMatching(/^workflow_/),
      traceStore: expect.any(Object),
    });
    expect(result).toEqual({
      mode: "parallel",
      status: "completed",
      results: [],
    });
  });

  it("rejects invalid orchestration tool input before runtime execution", async () => {
    const tools = getRegisteredTools({} as MemoryService);
    const tool = tools.find((item) => item.name === "orchestrate_workflow");
    const runOrchestrationWorkflowMock = vi.mocked(runOrchestrationWorkflow);

    await expect(
      tool?.execute({
        spec: {
          mode: "parallel",
          jobs: [],
        },
      }),
    ).rejects.toThrowError();

    expect(runOrchestrationWorkflowMock).not.toHaveBeenCalled();
  });

  it("executes the orchestration trace listing tool", async () => {
    const tools = getRegisteredTools({} as MemoryService);
    const tool = tools.find((item) => item.name === "list_orchestration_traces");
    const listOrchestrationTracesMock = vi.mocked(listOrchestrationTraces);

    await tool?.execute({
      source: "mcp",
      limit: 5,
    });

    expect(listOrchestrationTracesMock).toHaveBeenCalledTimes(1);
    expect(listOrchestrationTracesMock.mock.calls[0]?.[0]).toMatchObject({
      payload: {
        source: "mcp",
        limit: 5,
      },
      filePath: expect.stringContaining("orchestration-trace.jsonl"),
    });
  });
});
