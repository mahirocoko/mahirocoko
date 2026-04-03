import { describe, expect, it } from "vitest";

import { runGeminiWorker } from "../src/features/gemini/gemini-worker-service.js";
import type { GeminiCommandRunResult, GeminiWorkerInput } from "../src/features/gemini/types.js";

const baseInput: GeminiWorkerInput = {
  taskId: "task-123",
  prompt: "Summarize this file.",
  model: "gemini-2.5-flash",
};

function createCommandResult(
  overrides: Partial<GeminiCommandRunResult> = {},
): GeminiCommandRunResult {
  return {
    stdout: "",
    stderr: "",
    exitCode: 0,
    signal: null,
    timedOut: false,
    startedAt: "2026-04-03T06:19:00.000Z",
    finishedAt: "2026-04-03T06:19:01.000Z",
    durationMs: 1000,
    ...overrides,
  };
}

describe("runGeminiWorker", () => {
  it("returns a completed normalized result for valid Gemini JSON", async () => {
    const result = await runGeminiWorker(baseInput, {
      runCommand: async () =>
        createCommandResult({
          stdout: JSON.stringify({
            response: "Done.",
            stats: {
              model: "gemini-2.5-flash",
            },
          }),
        }),
    });

    expect(result.status).toBe("completed");
    expect(result.requestedModel).toBe("gemini-2.5-flash");
    expect(result.reportedModel).toBe("gemini-2.5-flash");
    expect(result.response).toBe("Done.");
  });

  it("returns command_failed when Gemini exits non-zero with structured JSON", async () => {
    const result = await runGeminiWorker(baseInput, {
      runCommand: async () =>
        createCommandResult({
          exitCode: 2,
          stderr: "command failed",
          stdout: JSON.stringify({
            error: "rate limited",
          }),
        }),
    });

    expect(result.status).toBe("command_failed");
    expect(result.error).toContain("rate limited");
    expect(result.exitCode).toBe(2);
  });

  it("returns invalid_json when stdout cannot be parsed", async () => {
    const result = await runGeminiWorker(baseInput, {
      runCommand: async () =>
        createCommandResult({
          stdout: "not-json",
        }),
    });

    expect(result.status).toBe("invalid_json");
    expect(result.error).toBeTruthy();
  });

  it("returns invalid_json when stdout is JSON but not a valid Gemini envelope", async () => {
    const result = await runGeminiWorker(baseInput, {
      runCommand: async () =>
        createCommandResult({
          stdout: JSON.stringify(["unexpected"]),
        }),
    });

    expect(result.status).toBe("invalid_json");
    expect(result.error).toContain("output");
  });

  it("returns empty_output when Gemini prints nothing", async () => {
    const result = await runGeminiWorker(baseInput, {
      runCommand: async () => createCommandResult(),
    });

    expect(result.status).toBe("empty_output");
    expect(result.error).toContain("no stdout");
  });

  it("returns timeout when the command times out", async () => {
    const result = await runGeminiWorker(
      {
        ...baseInput,
        timeoutMs: 5000,
      },
      {
        runCommand: async () =>
          createCommandResult({
            timedOut: true,
          }),
      },
    );

    expect(result.status).toBe("timeout");
    expect(result.error).toContain("5000ms");
  });

  it("returns spawn_error when the binary cannot be launched", async () => {
    const result = await runGeminiWorker(baseInput, {
      runCommand: async () =>
        createCommandResult({
          spawnError: "spawn gemini ENOENT",
          exitCode: null,
        }),
    });

    expect(result.status).toBe("spawn_error");
    expect(result.error).toContain("ENOENT");
  });
});
