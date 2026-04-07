import { mkdir, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { getAppEnv } from "../../../config/env.js";
import { buildContextForTask } from "../core/build-context-for-task.js";
import { searchMemories } from "../core/search-memories.js";
import { DeterministicEmbeddingProvider } from "../index/embedding-provider.js";
import { connectToLanceDb } from "../index/lancedb-client.js";
import { MemoryRecordsTable } from "../index/memory-records-table.js";
import { RetrievalTraceStore } from "../observability/retrieval-trace.js";
import { toRetrievalRow } from "../retrieval/rank.js";
import type { BuildContextForTaskInput, MemoryRecord, RetrievalMode, MemoryScope } from "../types.js";

/** Shared timestamp so within-run recency contributions match across all seeded rows (ties broken by keyword/vector/importance). */
const EVAL_CREATED_AT = "2026-04-01T12:00:00.000Z";

export const retrievalEvalScope = {
  userId: "mahiro",
  projectId: "mcp-memory-layer-eval",
  containerId: "workspace:mcp-memory-layer-eval",
  sessionWithNotes: "eval-session-probes",
  sessionSparse: "eval-session-sparse",
} as const;

const manualSource = { type: "manual" as const };

/**
 * Fixed corpus: requestId / result-store vs trace-store probes plus one session-scoped row.
 * Importance nudges break ties when keyword + vector + recency align.
 */
export const retrievalEvalMemoryRecords: readonly MemoryRecord[] = [
  {
    id: "eval-proj-request-id",
    kind: "decision",
    scope: "project",
    userId: retrievalEvalScope.userId,
    projectId: retrievalEvalScope.projectId,
    containerId: retrievalEvalScope.containerId,
    source: manualSource,
    content:
      "requestId hardening: reject payloads when request_id is missing, malformed, or replayed; hooks validate before result-store writes.",
    summary: "",
    tags: [],
    importance: 0.92,
    createdAt: EVAL_CREATED_AT,
    updatedAt: EVAL_CREATED_AT,
  },
  {
    id: "eval-proj-generic-hardening",
    kind: "fact",
    scope: "project",
    userId: retrievalEvalScope.userId,
    projectId: retrievalEvalScope.projectId,
    containerId: retrievalEvalScope.containerId,
    source: manualSource,
    content: "Security hardening: rate limits, auth checks, and audit logging on the API layer.",
    summary: "",
    tags: [],
    importance: 0.35,
    createdAt: EVAL_CREATED_AT,
    updatedAt: EVAL_CREATED_AT,
  },
  {
    id: "eval-proj-result-store",
    kind: "decision",
    scope: "project",
    userId: retrievalEvalScope.userId,
    projectId: retrievalEvalScope.projectId,
    containerId: retrievalEvalScope.containerId,
    source: manualSource,
    content:
      "orchestration result-store persists durable workflow outputs (structured results) for downstream tools; distinct from trace metadata.",
    summary: "",
    tags: [],
    importance: 0.88,
    createdAt: EVAL_CREATED_AT,
    updatedAt: EVAL_CREATED_AT,
  },
  {
    id: "eval-proj-trace-store",
    kind: "fact",
    scope: "project",
    userId: retrievalEvalScope.userId,
    projectId: retrievalEvalScope.projectId,
    containerId: retrievalEvalScope.containerId,
    source: manualSource,
    content:
      "orchestration trace-store is append-only canonical jsonl for lifecycle/debugging; not a substitute for durable result payloads.",
    summary: "",
    tags: [],
    importance: 0.5,
    createdAt: EVAL_CREATED_AT,
    updatedAt: EVAL_CREATED_AT,
  },
  {
    id: "eval-sess-reqid",
    kind: "fact",
    scope: "session",
    userId: retrievalEvalScope.userId,
    projectId: retrievalEvalScope.projectId,
    containerId: retrievalEvalScope.containerId,
    sessionId: retrievalEvalScope.sessionWithNotes,
    source: manualSource,
    content:
      "Session probe: requestId must be rejected when missing before touching result-store; session-first retrieval should surface this.",
    summary: "",
    tags: [],
    importance: 0.75,
    createdAt: EVAL_CREATED_AT,
    updatedAt: EVAL_CREATED_AT,
  },
];

export interface RetrievalEvalSearchCase {
  readonly id: string;
  readonly query: string;
  readonly mode: RetrievalMode;
  readonly scope: MemoryScope;
  readonly sessionId?: string;
  readonly limit: number;
  readonly expectedTop1: string;
  readonly expectedInTopK?: { readonly k: number; readonly ids: readonly string[] };
}

export interface RetrievalEvalContextCase {
  readonly id: string;
  readonly payload: BuildContextForTaskInput;
  /** First returned memory id must match (session-first / primary hit). */
  readonly expectedFirstItemId: string;
  /** All substrings must appear in built context (usefulness signal). */
  readonly contextMustInclude: readonly string[];
  /** Optional: second id must appear when session + project both contribute. */
  readonly mustIncludeItemIds?: readonly string[];
}

export const retrievalEvalSearchCases: readonly RetrievalEvalSearchCase[] = [
  {
    id: "search-request-id-project",
    query: "requestId reject malformed replay hook hardening",
    mode: "full",
    scope: "project",
    limit: 8,
    expectedTop1: "eval-proj-request-id",
  },
  {
    id: "search-result-store-project",
    query: "durable workflow outputs result store downstream tools",
    mode: "full",
    scope: "project",
    limit: 8,
    expectedTop1: "eval-proj-result-store",
  },
  {
    id: "search-trace-store-project",
    query: "append-only canonical orchestration trace jsonl debugging",
    mode: "full",
    scope: "project",
    limit: 8,
    expectedTop1: "eval-proj-trace-store",
  },
  {
    id: "search-session-request-id",
    query: "session probe requestId rejected result-store",
    mode: "full",
    scope: "session",
    sessionId: retrievalEvalScope.sessionWithNotes,
    limit: 8,
    expectedTop1: "eval-sess-reqid",
  },
];

export const retrievalEvalContextCases: readonly RetrievalEvalContextCase[] = [
  {
    id: "context-session-first-then-project",
    payload: {
      task: "requestId hardening and session probe before result-store writes",
      mode: "full",
      userId: retrievalEvalScope.userId,
      projectId: retrievalEvalScope.projectId,
      containerId: retrievalEvalScope.containerId,
      sessionId: retrievalEvalScope.sessionWithNotes,
      maxItems: 6,
      maxChars: 8000,
    },
    expectedFirstItemId: "eval-sess-reqid",
    contextMustInclude: ["Session probe:", "requestId"],
    mustIncludeItemIds: ["eval-sess-reqid", "eval-proj-request-id"],
  },
  {
    id: "context-project-fallback-when-session-sparse",
    payload: {
      task: "Explain durable workflow outputs in the result store versus trace jsonl",
      mode: "full",
      userId: retrievalEvalScope.userId,
      projectId: retrievalEvalScope.projectId,
      containerId: retrievalEvalScope.containerId,
      sessionId: retrievalEvalScope.sessionSparse,
      maxItems: 6,
      maxChars: 8000,
    },
    expectedFirstItemId: "eval-proj-result-store",
    contextMustInclude: ["result-store", "durable"],
  },
];

export interface RetrievalEvalSearchCaseResult {
  readonly caseId: string;
  readonly pass: boolean;
  readonly top1: string | null;
  readonly expectedTop1: string;
  readonly rankOfExpected: number;
  readonly topKMisses: readonly string[];
  readonly returnedIds: readonly string[];
}

export interface RetrievalEvalContextCaseResult {
  readonly caseId: string;
  readonly pass: boolean;
  readonly firstItemId: string | null;
  readonly expectedFirstItemId: string;
  readonly missingSubstrings: readonly string[];
  readonly missingItemIds: readonly string[];
  readonly itemIds: readonly string[];
}

export interface RetrievalEvalSummary {
  readonly searchCasesTotal: number;
  readonly searchCasesPassed: number;
  readonly searchTop1Accuracy: number;
  readonly contextCasesTotal: number;
  readonly contextCasesPassed: number;
  readonly contextUsefulnessRate: number;
  readonly overallPass: boolean;
}

export interface RetrievalEvalOkResult {
  readonly status: "ok";
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly durationMs: number;
  readonly summary: RetrievalEvalSummary;
  readonly search: readonly RetrievalEvalSearchCaseResult[];
  readonly context: readonly RetrievalEvalContextCaseResult[];
}

function rankOfId(ids: readonly string[], target: string): number {
  const index = ids.indexOf(target);

  return index < 0 ? -1 : index + 1;
}

export function evaluateSearchCase(
  returnedIds: readonly string[],
  spec: RetrievalEvalSearchCase,
): { readonly pass: boolean; readonly topKMisses: readonly string[] } {
  const top1 = returnedIds[0] ?? null;
  const top1Ok = top1 === spec.expectedTop1;
  const k = spec.expectedInTopK?.k;
  const required = spec.expectedInTopK?.ids;

  if (!k || !required || required.length === 0) {
    return { pass: top1Ok, topKMisses: [] };
  }

  const slice = returnedIds.slice(0, k);
  const topKMisses = required.filter((id) => !slice.includes(id));

  return { pass: top1Ok && topKMisses.length === 0, topKMisses };
}

export function evaluateContextCase(
  result: { readonly context: string; readonly items: readonly string[] },
  spec: RetrievalEvalContextCase,
): {
  readonly pass: boolean;
  readonly missingSubstrings: readonly string[];
  readonly missingItemIds: readonly string[];
} {
  const first = result.items[0] ?? null;
  const firstOk = first === spec.expectedFirstItemId;
  const missingSubstrings = spec.contextMustInclude.filter((s) => !result.context.includes(s));
  const requiredIds = spec.mustIncludeItemIds ?? [];
  const missingItemIds = requiredIds.filter((id) => !result.items.includes(id));

  return {
    pass: firstOk && missingSubstrings.length === 0 && missingItemIds.length === 0,
    missingSubstrings,
    missingItemIds,
  };
}

async function rowsFromRecords(
  records: readonly MemoryRecord[],
  embeddingProvider: DeterministicEmbeddingProvider,
): Promise<ReturnType<typeof toRetrievalRow>[]> {
  return Promise.all(
    records.map(async (record) => {
      const embedding = await embeddingProvider.embedText(
        [record.content, record.summary ?? "", ...record.tags].join("\n"),
      );

      return toRetrievalRow(record, embedding, embeddingProvider.version);
    }),
  );
}

export async function runRetrievalEval(): Promise<RetrievalEvalOkResult> {
  const startedAtDate = new Date();
  const startedAt = startedAtDate.toISOString();
  const env = getAppEnv();
  const root = await mkdtemp(path.join(os.tmpdir(), "mcp-memory-retrieval-eval-"));

  try {
    await Promise.all([
      mkdir(path.join(root, "traces"), { recursive: true }),
      mkdir(path.join(root, "lancedb"), { recursive: true }),
    ]);

    const embeddingProvider = new DeterministicEmbeddingProvider(env.embeddingDimensions);
    const connection = await connectToLanceDb(path.join(root, "lancedb"));
    const table = new MemoryRecordsTable(connection);
    const traceStore = new RetrievalTraceStore(path.join(root, "traces", "retrieval-trace.jsonl"));

    const rows = await rowsFromRecords(retrievalEvalMemoryRecords, embeddingProvider);
    await table.replaceAll(rows);

    const baseScope = {
      userId: retrievalEvalScope.userId,
      projectId: retrievalEvalScope.projectId,
      containerId: retrievalEvalScope.containerId,
    };

    const searchResults: RetrievalEvalSearchCaseResult[] = [];

    for (const spec of retrievalEvalSearchCases) {
      const searchResult = await searchMemories({
        payload: {
          query: spec.query,
          mode: spec.mode,
          scope: spec.scope,
          ...baseScope,
          ...(spec.sessionId ? { sessionId: spec.sessionId } : {}),
          limit: spec.limit,
        },
        table,
        embeddingProvider,
        traceStore,
      });

      const returnedIds = searchResult.items.map((item) => item.id);
      const { pass, topKMisses } = evaluateSearchCase(returnedIds, spec);

      searchResults.push({
        caseId: spec.id,
        pass,
        top1: returnedIds[0] ?? null,
        expectedTop1: spec.expectedTop1,
        rankOfExpected: rankOfId(returnedIds, spec.expectedTop1),
        topKMisses,
        returnedIds,
      });
    }

    const contextResults: RetrievalEvalContextCaseResult[] = [];

    for (const spec of retrievalEvalContextCases) {
      const built = await buildContextForTask({
        payload: spec.payload,
        table,
        embeddingProvider,
        traceStore,
      });

      const { pass, missingSubstrings, missingItemIds } = evaluateContextCase(built, spec);

      contextResults.push({
        caseId: spec.id,
        pass,
        firstItemId: built.items[0] ?? null,
        expectedFirstItemId: spec.expectedFirstItemId,
        missingSubstrings,
        missingItemIds,
        itemIds: [...built.items],
      });
    }

    const finishedAtDate = new Date();
    const searchPassed = searchResults.filter((r) => r.pass).length;
    const contextPassed = contextResults.filter((r) => r.pass).length;
    const searchTop1Hits = searchResults.filter((r) => r.top1 === r.expectedTop1).length;

    const summary: RetrievalEvalSummary = {
      searchCasesTotal: searchResults.length,
      searchCasesPassed: searchPassed,
      searchTop1Accuracy: searchResults.length === 0 ? 1 : searchTop1Hits / searchResults.length,
      contextCasesTotal: contextResults.length,
      contextCasesPassed: contextPassed,
      contextUsefulnessRate:
        contextResults.length === 0
          ? 1
          : contextResults.filter((r) => r.missingSubstrings.length === 0).length / contextResults.length,
      overallPass: searchPassed === searchResults.length && contextPassed === contextResults.length,
    };

    return {
      status: "ok",
      startedAt,
      finishedAt: finishedAtDate.toISOString(),
      durationMs: finishedAtDate.getTime() - startedAtDate.getTime(),
      summary,
      search: searchResults,
      context: contextResults,
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

export function formatRetrievalEvalAsText(result: RetrievalEvalOkResult): string {
  const lines: string[] = [
    `retrieval eval: ${result.summary.overallPass ? "PASS" : "FAIL"}`,
    `durationMs: ${result.durationMs}`,
    `search: ${result.summary.searchCasesPassed}/${result.summary.searchCasesTotal} cases (top1 accuracy ${result.summary.searchTop1Accuracy.toFixed(2)})`,
    `context: ${result.summary.contextCasesPassed}/${result.summary.contextCasesTotal} cases (substring usefulness ${result.summary.contextUsefulnessRate.toFixed(2)})`,
    "",
    "search cases:",
  ];

  for (const row of result.search) {
    lines.push(
      `  ${row.pass ? "ok" : "FAIL"} ${row.caseId} top1=${row.top1 ?? "∅"} expected=${row.expectedTop1} rank=${row.rankOfExpected}`,
    );

    if (row.topKMisses.length > 0) {
      lines.push(`    topK misses: ${row.topKMisses.join(", ")}`);
    }
  }

  lines.push("", "context cases:");

  for (const row of result.context) {
    lines.push(
      `  ${row.pass ? "ok" : "FAIL"} ${row.caseId} first=${row.firstItemId ?? "∅"} expected=${row.expectedFirstItemId}`,
    );

    if (row.missingSubstrings.length > 0) {
      lines.push(`    missing substrings: ${row.missingSubstrings.join(" | ")}`);
    }

    if (row.missingItemIds.length > 0) {
      lines.push(`    missing item ids: ${row.missingItemIds.join(", ")}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
