import { describe, expect, it } from "vitest";

import { parseRetrievalEvalCliArgs } from "../src/features/memory/eval/retrieval-eval-cli.js";
import {
  evaluateContextCase,
  evaluateSearchCase,
  retrievalEvalContextCases,
  retrievalEvalSearchCases,
} from "../src/features/memory/eval/retrieval-eval.js";

describe("parseRetrievalEvalCliArgs", () => {
  it("defaults to json format", () => {
    expect(parseRetrievalEvalCliArgs([])).toEqual({ format: "json" });
  });

  it("parses --format text", () => {
    expect(parseRetrievalEvalCliArgs(["--format", "text"])).toEqual({ format: "text" });
  });

  it("rejects unknown flags", () => {
    expect(() => parseRetrievalEvalCliArgs(["--what"])).toThrowError("Unknown flag: --what");
  });

  it("rejects positional arguments", () => {
    expect(() => parseRetrievalEvalCliArgs(["nope"])).toThrowError("Unexpected argument: nope");
  });
});

describe("evaluateSearchCase", () => {
  it("requires top1 match", () => {
    const spec = retrievalEvalSearchCases.find((c) => c.id === "search-request-id-project")!;

    expect(evaluateSearchCase(["eval-proj-request-id", "x"], spec).pass).toBe(true);
    expect(evaluateSearchCase(["other", "eval-proj-request-id"], spec).pass).toBe(false);
  });

  it("session probe case expects session-scoped primary id", () => {
    const spec = retrievalEvalSearchCases.find((c) => c.id === "search-session-probe-beats-reqid-noise")!;

    expect(evaluateSearchCase(["eval-sess-reqid", "eval-sess-reqid-noise"], spec).pass).toBe(true);
    expect(evaluateSearchCase(["eval-sess-reqid-noise", "eval-sess-reqid"], spec).pass).toBe(false);
  });

  it("requires expected ids inside top-k when provided", () => {
    const spec = {
      id: "fixture",
      query: "",
      mode: "full" as const,
      scope: "project" as const,
      limit: 8,
      expectedTop1: "a",
      expectedInTopK: { k: 2, ids: ["a", "b"] as const },
    };

    expect(evaluateSearchCase(["a", "b", "c"], spec).pass).toBe(true);
    expect(evaluateSearchCase(["a", "c", "b"], spec).pass).toBe(false);
    expect(evaluateSearchCase(["a", "c", "b"], spec).topKMisses).toEqual(["b"]);
  });
});

describe("evaluateContextCase", () => {
  it("checks first item, substrings, and optional item ids", () => {
    const spec = retrievalEvalContextCases.find((c) => c.id === "context-session-first-then-project")!;

    expect(
      evaluateContextCase(
        {
          context: "Session probe: requestId x",
          items: ["eval-sess-reqid", "eval-proj-request-id"],
        },
        spec,
      ).pass,
    ).toBe(true);

    expect(
      evaluateContextCase(
        {
          context: "missing",
          items: ["eval-sess-reqid", "eval-proj-request-id"],
        },
        spec,
      ).pass,
    ).toBe(false);

    expect(
      evaluateContextCase(
        {
          context: "Session probe: requestId x",
          items: ["eval-proj-request-id"],
        },
        spec,
      ).pass,
    ).toBe(false);
  });
});
