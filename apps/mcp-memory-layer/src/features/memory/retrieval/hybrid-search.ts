import { defaultKeywordCandidateLimit, defaultSearchLimit, defaultVectorCandidateLimit } from "../constants.js";
import { dedupeSearchItems } from "./dedupe.js";
import { scoreCombined, scoreKeywordMatch, scoreRecency, scoreVectorMatch, toSearchMemoryItem } from "./rank.js";
import type { EmbeddingProvider } from "../index/embedding-provider.js";
import type { MemoryRecordsTable } from "../index/memory-records-table.js";
import type { RetrievalTraceEntry, ScopeFilter, SearchMemoriesInput, SearchMemoriesResult } from "../types.js";
import { newId } from "../lib/ids.js";
import { nowIso } from "../lib/time.js";

export async function runHybridSearch(input: {
  readonly search: SearchMemoriesInput;
  readonly filter: ScopeFilter;
  readonly table: MemoryRecordsTable;
  readonly embeddingProvider: EmbeddingProvider;
}): Promise<{ readonly result: SearchMemoriesResult; readonly trace: RetrievalTraceEntry }> {
  const limit = input.search.limit ?? defaultSearchLimit;
  const queryVector = await input.embeddingProvider.embedText(input.search.query);
  const [keywordRows, vectorRows] = await Promise.all([
    input.table.queryScopedRows(input.filter, Math.max(limit * 4, defaultKeywordCandidateLimit)),
    input.table.vectorSearch(input.filter, queryVector, Math.max(limit * 3, defaultVectorCandidateLimit)),
  ]);

  const rowsById = new Map<string, { row: (typeof keywordRows)[number]; reasons: Set<string>; score: number }>();

  for (const row of keywordRows) {
    const keywordScore = scoreKeywordMatch(row, input.search.query);

    if (keywordScore <= 0) {
      continue;
    }

    const combinedScore = scoreCombined({
      keyword: keywordScore,
      vector: 0,
      recency: scoreRecency(row.createdAt),
      importance: row.importance,
    });

    rowsById.set(row.id, {
      row,
      reasons: new Set(["scope_match", "keyword_match"]),
      score: combinedScore,
    });
  }

  for (const row of vectorRows) {
    const vectorScore = scoreVectorMatch(queryVector, row.embedding);

    if (vectorScore <= 0) {
      continue;
    }

    const combinedScore = scoreCombined({
      keyword: scoreKeywordMatch(row, input.search.query),
      vector: vectorScore,
      recency: scoreRecency(row.createdAt),
      importance: row.importance,
    });
    const existing = rowsById.get(row.id);

    if (existing) {
      existing.reasons.add("semantic_match");
      existing.score = Math.max(existing.score, combinedScore);
      continue;
    }

    rowsById.set(row.id, {
      row,
      reasons: new Set(["scope_match", "semantic_match"]),
      score: combinedScore,
    });
  }

  const items = dedupeSearchItems(
    [...rowsById.values()]
      .sort((left, right) => right.score - left.score)
      .slice(0, limit)
      .map((entry) => toSearchMemoryItem(entry.row, entry.score, [...entry.reasons])),
  );

  const trace: RetrievalTraceEntry = {
    requestId: newId("req"),
    query: input.search.query,
    retrievalMode: input.search.mode,
    enforcedFilters: input.filter,
    returnedMemoryIds: items.map((item) => item.id),
    rankingReasonsById: Object.fromEntries(items.map((item) => [item.id, item.reasons])),
    contextSize: 0,
    embeddingVersion: input.embeddingProvider.version,
    indexVersion: "v0",
    degraded: false,
    createdAt: nowIso(),
  };

  return {
    result: {
      items,
      degraded: false,
    },
    trace,
  };
}
