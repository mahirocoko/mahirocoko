import { describe, expect, it } from "vitest";

import { mkdir, mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { JsonlLogStore } from "../src/features/memory/log/jsonl-log-store.js";
import { DeterministicEmbeddingProvider } from "../src/features/memory/index/embedding-provider.js";
import { connectToLanceDb } from "../src/features/memory/index/lancedb-client.js";
import { MemoryRecordsTable } from "../src/features/memory/index/memory-records-table.js";
import { RetrievalTraceStore } from "../src/features/memory/observability/retrieval-trace.js";
import { rememberMemory } from "../src/features/memory/core/remember.js";
import { searchMemories } from "../src/features/memory/core/search-memories.js";
import { buildContextForTask } from "../src/features/memory/core/build-context-for-task.js";
import { reindexMemoryRecords } from "../src/features/memory/index/reindex.js";

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "mcp-memory-layer-"));
  await Promise.all([
    mkdir(path.join(root, "log"), { recursive: true }),
    mkdir(path.join(root, "traces"), { recursive: true }),
    mkdir(path.join(root, "lancedb"), { recursive: true }),
  ]);

  const logStore = new JsonlLogStore(path.join(root, "log", "canonical-log.jsonl"));
  const embeddingProvider = new DeterministicEmbeddingProvider(64);
  const connection = await connectToLanceDb(path.join(root, "lancedb"));
  const table = new MemoryRecordsTable(connection);
  const traceStore = new RetrievalTraceStore(path.join(root, "traces", "retrieval-trace.jsonl"));

  return {
    logStore,
    embeddingProvider,
    table,
    traceStore,
  };
}

describe("memory service core", () => {
  it("stores a memory and retrieves it within the same scope", async () => {
    const fixture = await createFixture();

    const remembered = await rememberMemory({
      payload: {
        content: "The repo uses Bun for runtime scripts.",
        kind: "fact",
        scope: "project",
        userId: "mahiro",
        projectId: "mcp-memory-layer",
        containerId: "workspace:mcp-memory-layer",
        source: {
          type: "manual",
        },
      },
      logStore: fixture.logStore,
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
    });

    const result = await searchMemories({
      payload: {
        query: "What runtime scripts does the repo use?",
        mode: "full",
        scope: "project",
        userId: "mahiro",
        projectId: "mcp-memory-layer",
        containerId: "workspace:mcp-memory-layer",
      },
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
      traceStore: fixture.traceStore,
    });

    expect(remembered.status).toBe("accepted");
    expect(result.items.some((item) => item.id === remembered.id)).toBe(true);
  });

  it("does not leak results across project scope", async () => {
    const fixture = await createFixture();

    await rememberMemory({
      payload: {
        content: "Private memory for project A.",
        kind: "fact",
        scope: "project",
        userId: "mahiro",
        projectId: "project-a",
        containerId: "workspace:project-a",
        source: {
          type: "manual",
        },
      },
      logStore: fixture.logStore,
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
    });

    const result = await searchMemories({
      payload: {
        query: "private memory",
        mode: "full",
        scope: "project",
        userId: "mahiro",
        projectId: "project-b",
        containerId: "workspace:project-b",
      },
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
      traceStore: fixture.traceStore,
    });

    expect(result.items).toHaveLength(0);
  });

  it("builds a bounded context block", async () => {
    const fixture = await createFixture();

    await rememberMemory({
      payload: {
        content: "Use LanceDB as the retrieval layer and keep a canonical append-only log.",
        kind: "decision",
        scope: "project",
        userId: "mahiro",
        projectId: "mcp-memory-layer",
        containerId: "workspace:mcp-memory-layer",
        source: {
          type: "manual",
        },
      },
      logStore: fixture.logStore,
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
    });

    const result = await buildContextForTask({
      payload: {
        task: "Implement the memory retrieval layer",
        mode: "full",
        userId: "mahiro",
        projectId: "mcp-memory-layer",
        containerId: "workspace:mcp-memory-layer",
        maxItems: 5,
        maxChars: 500,
      },
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
      traceStore: fixture.traceStore,
    });

    expect(result.context).toContain("Relevant memories");
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.context.length).toBeLessThanOrEqual(500);
  });

  it("rebuilds the LanceDB index from the canonical log", async () => {
    const fixture = await createFixture();

    const remembered = await rememberMemory({
      payload: {
        content: "Reindex should restore retrieval from the canonical log.",
        kind: "fact",
        scope: "project",
        userId: "mahiro",
        projectId: "mcp-memory-layer",
        containerId: "workspace:mcp-memory-layer",
        source: {
          type: "manual",
        },
      },
      logStore: fixture.logStore,
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
    });

    await reindexMemoryRecords({
      logStore: fixture.logStore,
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
    });

    const result = await searchMemories({
      payload: {
        query: "restore retrieval from the canonical log",
        mode: "full",
        scope: "project",
        userId: "mahiro",
        projectId: "mcp-memory-layer",
        containerId: "workspace:mcp-memory-layer",
      },
      table: fixture.table,
      embeddingProvider: fixture.embeddingProvider,
      traceStore: fixture.traceStore,
    });

    expect(result.items.some((item) => item.id === remembered.id)).toBe(true);
  });
});
