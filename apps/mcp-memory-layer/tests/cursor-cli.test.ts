import { describe, expect, it } from "vitest";

import { parseCursorCliArgs } from "../src/features/cursor/cursor-cli.js";

describe("parseCursorCliArgs", () => {
  it("maps positional prompt into worker input", () => {
    const input = parseCursorCliArgs(["Review", "this", "diff"]);

    expect(input.prompt).toBe("Review this diff");
    expect(input.model).toBe("composer-2");
    expect(input.taskId.startsWith("cursor_")).toBe(true);
  });

  it("uses Opus by default for plan mode", () => {
    const input = parseCursorCliArgs(["--mode", "plan", "Plan", "this", "refactor"]);

    expect(input.mode).toBe("plan");
    expect(input.model).toBe("claude-4.6-opus-high");
  });

  it("maps explicit flags into worker input", () => {
    const input = parseCursorCliArgs([
      "--model",
      "gpt-5",
      "--cwd",
      "/tmp/project",
      "--timeout-ms",
      "30000",
      "--binary-path",
      "/usr/local/bin/agent",
      "--mode",
      "plan",
      "--force",
      "--trust",
      "Review",
      "this",
      "architecture",
    ]);

    expect(input.model).toBe("gpt-5");
    expect(input.cwd).toBe("/tmp/project");
    expect(input.timeoutMs).toBe(30000);
    expect(input.binaryPath).toBe("/usr/local/bin/agent");
    expect(input.mode).toBe("plan");
    expect(input.force).toBe(true);
    expect(input.trust).toBe(true);
  });

  it("keeps explicit model override above plan-mode defaults", () => {
    const input = parseCursorCliArgs([
      "--mode",
      "plan",
      "--model",
      "claude-4.6-sonnet-medium",
      "Plan",
      "this",
      "refactor",
    ]);

    expect(input.model).toBe("claude-4.6-sonnet-medium");
  });

  it("allows explicit prompt tail after double dash", () => {
    const input = parseCursorCliArgs(["--", "--not-a-flag", "prompt"]);

    expect(input.prompt).toBe("--not-a-flag prompt");
  });

  it("fails when prompt is missing", () => {
    expect(() => parseCursorCliArgs(["--mode", "ask"])).toThrowError("Prompt is required.");
  });

  it("fails when timeout is not a positive integer", () => {
    expect(() => parseCursorCliArgs(["--timeout-ms", "0", "hello"]))
      .toThrowError("--timeout-ms must be a positive integer.");
  });

  it("fails for unknown modes", () => {
    expect(() => parseCursorCliArgs(["--mode", "mystery", "hello"]))
      .toThrowError("Unknown mode: mystery");
  });
});
