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

  it("paraphrase store-distinction search pins result-store at top1 and requires trace-store in top-k", () => {
    const spec = retrievalEvalSearchCases.find((c) => c.id === "search-store-roles-paraphrase")!;

    expect(spec.expectedInTopK).toEqual({
      k: 6,
      ids: ["eval-proj-result-store", "eval-proj-trace-store"],
    });
    expect(
      evaluateSearchCase(
        [
          "eval-proj-result-store",
          "eval-proj-orchestration-store-tangle",
          "eval-proj-trace-store",
          "eval-proj-request-id",
        ],
        spec,
      ).pass,
    ).toBe(true);
    expect(evaluateSearchCase(["eval-proj-trace-store", "eval-proj-result-store"], spec).pass).toBe(false);
  });

  it("semantic replay gate search expects request-id policy at top1", () => {
    const spec = retrievalEvalSearchCases.find((c) => c.id === "search-semantic-replay-gate")!;

    expect(spec.expectedInTopK).toBeUndefined();
    expect(evaluateSearchCase(["eval-proj-request-id", "eval-proj-generic-hardening"], spec).pass).toBe(true);
    expect(evaluateSearchCase(["eval-proj-generic-hardening", "eval-proj-request-id"], spec).pass).toBe(false);
  });

  it("adversarial requestId distractor does not outrank orchestration gating", () => {
    const spec = retrievalEvalSearchCases.find((c) => c.id === "search-reqid-gating-vs-webhook-dedup")!;

    expect(evaluateSearchCase(["eval-proj-request-id", "eval-proj-webhook-reqid-distractor"], spec).pass).toBe(true);
    expect(evaluateSearchCase(["eval-proj-webhook-reqid-distractor", "eval-proj-request-id"], spec).pass).toBe(false);
  });

  it("adversarial result-store archive distractor does not outrank the live handoff contract", () => {
    const spec = retrievalEvalSearchCases.find((c) => c.id === "search-live-handoff-vs-archival-mirror")!;

    expect(evaluateSearchCase(["eval-proj-result-store", "eval-proj-result-archive-distractor"], spec).pass).toBe(true);
    expect(evaluateSearchCase(["eval-proj-result-archive-distractor", "eval-proj-result-store"], spec).pass).toBe(false);
  });

  it("same-topic embedding cache invalidation outranks cache reuse policy for staleness query", () => {
    const spec = retrievalEvalSearchCases.find(
      (c) => c.id === "search-same-topic-embedding-cache-invalidation-beats-reuse",
    )!;

    expect(evaluateSearchCase(["eval-proj-embedding-cache-invalidation", "eval-proj-embedding-cache-hit"], spec).pass).toBe(
      true,
    );
    expect(evaluateSearchCase(["eval-proj-embedding-cache-hit", "eval-proj-embedding-cache-invalidation"], spec).pass).toBe(
      false,
    );
  });

  it("long noisy sandbox rehearsal doc does not outrank canonical result-store contract", () => {
    const spec = retrievalEvalSearchCases.find((c) => c.id === "search-long-noisy-sandbox-doc-vs-result-store-contract")!;

    expect(evaluateSearchCase(["eval-proj-result-store", "eval-proj-verbose-sandbox-rehearsal"], spec).pass).toBe(true);
    expect(evaluateSearchCase(["eval-proj-verbose-sandbox-rehearsal", "eval-proj-result-store"], spec).pass).toBe(false);
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

  it("project-fallback context requires the canonical result-store item and durable wording", () => {
    const spec = retrievalEvalContextCases.find((c) => c.id === "context-project-fallback-when-session-sparse")!;

    expect(
      evaluateContextCase(
        {
          context: "Task: …\n\nRelevant memories:\n- [decision] result-store keeps durable workflow outputs for downstream tools.",
          items: ["eval-proj-result-store"],
        },
        spec,
      ).pass,
    ).toBe(true);

    expect(
      evaluateContextCase(
        {
          context: "Task: …\n\nRelevant memories:\n- [fact] trace metadata only",
          items: ["eval-proj-trace-store"],
        },
        spec,
      ).pass,
    ).toBe(false);
  });

  it("adversarial sandbox context still requires the live result-store contract as first item", () => {
    const spec = retrievalEvalContextCases.find((c) => c.id === "context-adversarial-sandbox-noise-excluded")!;

    expect(
      evaluateContextCase(
        {
          context:
            "Task: …\n\nRelevant memories:\n- [decision] orchestration result-store persists durable workflow outputs for downstream tools and integrator handoffs.\n- [fact] sandbox rehearsal note with overlapping vocabulary.",
          items: ["eval-proj-result-store", "eval-proj-verbose-sandbox-rehearsal"],
        },
        spec,
      ).pass,
    ).toBe(true);

    expect(
      evaluateContextCase(
        {
          context:
            "Task: …\n\nRelevant memories:\n- [fact] sandbox rehearsal note repeats durable workflow outputs and downstream tools for drill purposes.",
          items: ["eval-proj-verbose-sandbox-rehearsal", "eval-proj-result-store"],
        },
        spec,
      ).pass,
    ).toBe(false);
  });
});
