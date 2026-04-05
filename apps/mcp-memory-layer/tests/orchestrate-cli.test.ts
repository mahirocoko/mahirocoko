import { describe, expect, it } from "vitest";

import { parseOrchestrateCliArgs } from "../src/features/orchestration/orchestrate-cli.js";

describe("parseOrchestrateCliArgs", () => {
  it("fails when file is omitted", async () => {
    await expect(parseOrchestrateCliArgs([])).rejects.toThrowError("--file is required.");
  });

  it("fails for unknown flags", async () => {
    await expect(parseOrchestrateCliArgs(["--mystery", "value"])).rejects.toThrowError("Unknown flag: --mystery");
  });

  it("fails for unexpected positional arguments", async () => {
    await expect(parseOrchestrateCliArgs(["workflow.json"])).rejects.toThrowError("Unexpected argument: workflow.json");
  });

  it("parses parallel workflows from a file and applies default cwd", async () => {
    const spec = await parseOrchestrateCliArgs(
      ["--file", "workflow.json", "--cwd", "/tmp/project"],
      {
        readFileText: async () => JSON.stringify({
          mode: "parallel",
          maxConcurrency: 2,
          timeoutMs: 120000,
          jobs: [
            {
              kind: "gemini",
              input: {
                prompt: "Summarize this repo.",
                model: "gemini-3-flash-preview",
              },
            },
            {
              kind: "cursor",
              input: {
                taskId: "cursor-custom",
                prompt: "Review this diff.",
                model: "composer-2",
              },
            },
          ],
        }),
      },
    );

    expect(spec.mode).toBe("parallel");
    expect(spec.maxConcurrency).toBe(2);
    expect(spec.timeoutMs).toBe(120000);
    expect(spec.jobs).toHaveLength(2);
    expect(spec.jobs[0]).toMatchObject({
      kind: "gemini",
      input: {
        prompt: "Summarize this repo.",
        model: "gemini-3-flash-preview",
        cwd: "/tmp/project",
      },
    });
    expect(spec.jobs[0]?.input.taskId).toMatch(/^gemini_/);
    expect(spec.jobs[1]).toEqual({
      kind: "cursor",
      input: {
        taskId: "cursor-custom",
        prompt: "Review this diff.",
        model: "composer-2",
        cwd: "/tmp/project",
      },
    });
  });

  it("parses sequential workflows from stdin and preserves job-level cwd", async () => {
    const spec = await parseOrchestrateCliArgs(
      ["--file", "-", "--cwd", "/tmp/default"],
      {
        readStdinText: async () => JSON.stringify({
          mode: "sequential",
          timeoutMs: 30000,
          steps: [
            {
              kind: "gemini",
              input: {
                prompt: "Summarize this repo.",
                model: "gemini-3-flash-preview",
                cwd: "/tmp/custom",
              },
            },
          ],
        }),
      },
    );

    expect(spec).toEqual({
      mode: "sequential",
      timeoutMs: 30000,
      steps: [
        {
          kind: "gemini",
          input: {
            taskId: expect.stringMatching(/^gemini_/),
            prompt: "Summarize this repo.",
            model: "gemini-3-flash-preview",
            cwd: "/tmp/custom",
          },
        },
      ],
    });
  });

  it("fails when the workflow json shape is invalid", async () => {
    await expect(
      parseOrchestrateCliArgs(
        ["--file", "workflow.json"],
        {
          readFileText: async () => JSON.stringify({ mode: "parallel", jobs: [] }),
        },
      ),
    ).rejects.toThrowError();
  });

  it("fails when maxConcurrency is not a positive integer", async () => {
    await expect(
      parseOrchestrateCliArgs(
        ["--file", "workflow.json"],
        {
          readFileText: async () => JSON.stringify({ mode: "parallel", maxConcurrency: 0, jobs: [{ kind: "gemini", input: { prompt: "Summarize this repo.", model: "gemini-3-flash-preview" } }] }),
        },
      ),
    ).rejects.toThrowError();
  });

  it("fails when timeoutMs is not a positive integer", async () => {
    await expect(
      parseOrchestrateCliArgs(
        ["--file", "workflow.json"],
        {
          readFileText: async () => JSON.stringify({ mode: "parallel", timeoutMs: 0, jobs: [{ kind: "gemini", input: { prompt: "Summarize this repo.", model: "gemini-3-flash-preview" } }] }),
        },
      ),
    ).rejects.toThrowError();
  });
});
