import { buildContextForTaskInputSchema } from "../schemas.js";
import { defaultContextMaxChars, defaultContextMaxItems } from "../constants.js";
import type { BuildContextForTaskInput, BuildContextForTaskResult } from "../types.js";
import { buildContextFromItems } from "../retrieval/context-builder.js";
import { searchMemories } from "./search-memories.js";
import type { EmbeddingProvider } from "../index/embedding-provider.js";
import type { MemoryRecordsTable } from "../index/memory-records-table.js";
import type { RetrievalTraceStore } from "../observability/retrieval-trace.js";

export async function buildContextForTask(input: {
  readonly payload: BuildContextForTaskInput;
  readonly table: MemoryRecordsTable;
  readonly embeddingProvider: EmbeddingProvider;
  readonly traceStore: RetrievalTraceStore;
}): Promise<BuildContextForTaskResult> {
  const payload = buildContextForTaskInputSchema.parse(input.payload);
  const result = await searchMemories({
    payload: {
      query: payload.task,
      mode: payload.mode,
      scope: payload.sessionId ? "session" : "project",
      userId: payload.userId,
      projectId: payload.projectId,
      containerId: payload.containerId,
      sessionId: payload.sessionId,
      limit: payload.maxItems ?? defaultContextMaxItems,
    },
    table: input.table,
    embeddingProvider: input.embeddingProvider,
    traceStore: input.traceStore,
  });

  return buildContextFromItems({
    task: payload.task,
    items: result.items,
    maxItems: payload.maxItems ?? defaultContextMaxItems,
    maxChars: payload.maxChars ?? defaultContextMaxChars,
    degraded: result.degraded,
  });
}
