import type { MemoryRecord, RetrievalRow, SearchMemoryItem } from "../types.js";

import { nowIso, toTimestamp } from "../lib/time.js";

const indexVersion = "v0";

export function toRetrievalRow(record: MemoryRecord, embedding: readonly number[], embeddingVersion: string): RetrievalRow {
  return {
    id: record.id,
    content: record.content,
    summary: record.summary ?? "",
    embedding,
    kind: record.kind,
    scope: record.scope,
    userId: record.userId ?? "",
    projectId: record.projectId ?? "",
    containerId: record.containerId ?? "",
    sessionId: record.sessionId ?? "",
    importance: record.importance,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? record.createdAt,
    sourceType: record.source.type,
    sourceUri: record.source.uri ?? "",
    sourceTitle: record.source.title ?? "",
    tags: JSON.stringify(record.tags),
    embeddingVersion,
    indexVersion,
  };
}

export function toSearchMemoryItem(
  row: RetrievalRow,
  score: number,
  reasons: readonly string[],
): SearchMemoryItem {
  return {
    id: row.id,
    kind: row.kind,
    content: row.content,
    summary: row.summary || undefined,
    score,
    reasons,
    createdAt: row.createdAt,
    importance: row.importance,
    source: {
      type: (row.sourceType || "system") as SearchMemoryItem["source"]["type"],
      uri: row.sourceUri || undefined,
      title: row.sourceTitle || undefined,
    },
  };
}

export function scoreKeywordMatch(row: RetrievalRow, query: string): number {
  const haystack = `${row.content}\n${row.summary}\n${row.tags}`.toLowerCase();
  const tokens = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}_]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

  if (tokens.length === 0) {
    return 0;
  }

  const matches = tokens.filter((token) => haystack.includes(token)).length;

  return matches / tokens.length;
}

export function scoreVectorMatch(queryVector: readonly number[], rowVector: readonly number[]): number {
  if (queryVector.length === 0 || rowVector.length === 0 || queryVector.length !== rowVector.length) {
    return 0;
  }

  let dotProduct = 0;

  for (let index = 0; index < queryVector.length; index += 1) {
    dotProduct += (queryVector[index] ?? 0) * (rowVector[index] ?? 0);
  }

  return Math.max(0, dotProduct);
}

export function scoreRecency(createdAt: string): number {
  const ageMs = Math.max(0, toTimestamp(nowIso()) - toTimestamp(createdAt));
  const dayMs = 24 * 60 * 60 * 1000;

  return 1 / (1 + ageMs / dayMs);
}

export function scoreCombined(input: {
  readonly keyword: number;
  readonly vector: number;
  readonly recency: number;
  readonly importance: number;
}): number {
  return input.keyword * 0.4 + input.vector * 0.35 + input.recency * 0.15 + input.importance * 0.1;
}
