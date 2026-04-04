import { describe, expect, it } from "vitest";

import { runHybridSearch } from "../src/features/memory/retrieval/hybrid-search.js";
import type { EmbeddingProvider } from "../src/features/memory/index/embedding-provider.js";
import type { RetrievalRow, ScopeFilter } from "../src/features/memory/types.js";

const baseFilter: ScopeFilter = {
  scope: "project",
  userId: "mahiro",
  projectId: "mcp-memory-layer",
  containerId: "workspace:mcp-memory-layer",
};

function createRow(input: Partial<RetrievalRow> & Pick<RetrievalRow, "id" | "content" | "createdAt">): RetrievalRow {
  return {
    id: input.id,
    content: input.content,
    summary: input.summary ?? "",
    embedding: input.embedding ?? [1, 0],
    kind: input.kind ?? "fact",
    scope: input.scope ?? "project",
    userId: input.userId ?? "mahiro",
    projectId: input.projectId ?? "mcp-memory-layer",
    containerId: input.containerId ?? "workspace:mcp-memory-layer",
    sessionId: input.sessionId ?? "",
    importance: input.importance ?? 0.5,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt ?? input.createdAt,
    sourceType: input.sourceType ?? "manual",
    sourceUri: input.sourceUri ?? "",
    sourceTitle: input.sourceTitle ?? "",
    tags: input.tags ?? "[]",
    embeddingVersion: input.embeddingVersion ?? "test-v1",
    indexVersion: input.indexVersion ?? "v0",
  };
}

describe("runHybridSearch", () => {
  it("degrades to keyword-only results when embedding lookup fails", async () => {
    const keywordRows = [
      createRow({
        id: "mem-1",
        content: "Keyword only fallback result",
        createdAt: "2026-04-05T00:00:00.000Z",
      }),
    ];

    const table = {
      queryScopedRows: async () => keywordRows,
      vectorSearch: async () => {
        throw new Error("should not run vector search when embeddings fail");
      },
    };

    const embeddingProvider: EmbeddingProvider = {
      version: "test-v1",
      dimensions: 2,
      embedText: async () => {
        throw new Error("embedding unavailable");
      },
    };

    const { result, trace } = await runHybridSearch({
      search: {
        query: "keyword fallback",
        mode: "full",
        scope: "project",
        userId: "mahiro",
        projectId: "mcp-memory-layer",
        containerId: "workspace:mcp-memory-layer",
        limit: 5,
      },
      filter: baseFilter,
      table: table as never,
      embeddingProvider,
    });

    expect(result.degraded).toBe(true);
    expect(result.items.map((item) => item.id)).toEqual(["mem-1"]);
    expect(trace.degraded).toBe(true);
    expect(trace.rankingReasonsById["mem-1"]).toContain("keyword_match");
    expect(trace.rankingReasonsById["mem-1"]).not.toContain("semantic_match");
  });
});
