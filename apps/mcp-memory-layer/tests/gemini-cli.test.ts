import { describe, expect, it } from "vitest";

import { parseGeminiCliArgs } from "../src/features/gemini/gemini-cli.js";

describe("parseGeminiCliArgs", () => {
  it("maps positional prompt and defaults the model", () => {
    const input = parseGeminiCliArgs(["Summarize", "this", "repo"]);

    expect(input.prompt).toBe("Summarize this repo");
    expect(input.model).toBe("gemini-3-flash-preview");
    expect(input.taskId.startsWith("gemini_")).toBe(true);
  });

  it("uses the hard model policy when --hard is present", () => {
    const input = parseGeminiCliArgs(["--hard", "Review", "this", "architecture"]);

    expect(input.model).toBe("gemini-3.1-pro-preview");
    expect(input.prompt).toBe("Review this architecture");
  });

  it("maps explicit flags into worker input", () => {
    const input = parseGeminiCliArgs([
      "--model",
      "gemini-2.5-pro",
      "--cwd",
      "/tmp/project",
      "--timeout-ms",
      "30000",
      "--binary-path",
      "/usr/local/bin/gemini",
      "Explain",
      "the",
      "diff",
    ]);

    expect(input.model).toBe("gemini-2.5-pro");
    expect(input.cwd).toBe("/tmp/project");
    expect(input.timeoutMs).toBe(30000);
    expect(input.binaryPath).toBe("/usr/local/bin/gemini");
    expect(input.prompt).toBe("Explain the diff");
  });

  it("keeps explicit --model as the highest priority even with --hard", () => {
    const input = parseGeminiCliArgs([
      "--hard",
      "--model",
      "gemini-2.5-pro",
      "Explain",
      "the",
      "diff",
    ]);

    expect(input.model).toBe("gemini-2.5-pro");
  });

  it("allows explicit prompt tail after double dash", () => {
    const input = parseGeminiCliArgs(["--model", "gemini-2.5-flash", "--", "--not-a-flag", "prompt"]);

    expect(input.prompt).toBe("--not-a-flag prompt");
  });

  it("parses task routing flags", () => {
    const input = parseGeminiCliArgs(["--task", "timeline", "Summarize", "the", "changes"]);

    expect(input.taskKind).toBe("timeline");
    expect(input.prompt).toBe("Summarize the changes");
  });

  it("fails when the prompt is missing", () => {
    expect(() => parseGeminiCliArgs(["--model", "gemini-2.5-flash"]))
      .toThrowError("Prompt is required.");
  });

  it("fails when timeout is not a positive integer", () => {
    expect(() => parseGeminiCliArgs(["--timeout-ms", "0", "hello"]))
      .toThrowError("--timeout-ms must be a positive integer.");
  });

  it("fails for unknown task kinds", () => {
    expect(() => parseGeminiCliArgs(["--task", "mystery", "hello"]))
      .toThrowError("Unknown task kind: mystery");
  });
});
