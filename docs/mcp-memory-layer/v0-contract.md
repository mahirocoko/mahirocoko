# MCP Memory Layer v0 Contract

This document defines the minimum contract for a LanceDB-backed MCP memory layer.

The goal is to make memory useful in real agent workflows before trying to solve every memory problem.

## Scope

The v0 contract is responsible for:

- storing durable memory records
- indexing them for retrieval
- retrieving scoped memories for exact and semantic recall
- building model-ready context for task execution

It is not responsible for:

- cross-product orchestration
- globally distributed replication
- product-specific prompt engineering
- replacing every relational store in the system

## Core Concepts

### Canonical record

The write-time source of truth.

### Retrieval record

A derived row or chunk used for search, ranking, and context assembly.

### Scope

The boundary that controls what memory can be seen together.

### Retrieval mode

An explicit read strategy selected by the caller.

## Required Record Fields

Every memory write must produce a canonical record with at least:

- `id`
- `kind`
- `scope`
- `content`
- `source.type`
- `createdAt`

Recommended fields for v0:

- `userId`
- `projectId`
- `containerId`
- `sessionId`
- `summary`
- `tags`
- `importance`

## MCP Tools

### `remember`

Write one memory record.

Suggested input:

```json
{
  "content": "The repo uses Bun and project-local MCP config.",
  "kind": "fact",
  "scope": "project",
  "userId": "mahiro",
  "projectId": "agentbus",
  "containerId": "workspace:agentbus",
  "sessionId": "ses_123",
  "source": {
    "type": "chat",
    "uri": "thread://ses_123"
  },
  "tags": ["tooling", "repo"],
  "importance": 0.8
}
```

Suggested output:

```json
{
  "id": "mem_123",
  "status": "accepted",
  "indexed": false
}
```

### `search_memories`

Search scoped memory.

Suggested input:

```json
{
  "query": "How does project-local MCP config work?",
  "mode": "full",
  "scope": "project",
  "userId": "mahiro",
  "projectId": "agentbus",
  "containerId": "workspace:agentbus",
  "limit": 8
}
```

Suggested output:

```json
{
  "items": [
    {
      "id": "mem_123",
      "kind": "fact",
      "content": "The repo uses Bun and project-local MCP config.",
      "score": 0.92,
      "reasons": ["scope_match", "keyword_match", "semantic_match"]
    }
  ]
}
```

### `build_context_for_task`

Build a model-ready context bundle from scoped memory.

Suggested input:

```json
{
  "task": "Update AgentBus MCP docs for local runtime join flow",
  "mode": "full",
  "userId": "mahiro",
  "projectId": "agentbus",
  "containerId": "workspace:agentbus",
  "maxItems": 10,
  "maxChars": 6000
}
```

Suggested output:

```json
{
  "context": "Relevant project memories...",
  "items": ["mem_123", "mem_124"],
  "truncated": false
}
```

### `upsert_document`

Store or refresh a document-style memory source.

Suggested input:

```json
{
  "projectId": "agentbus",
  "source": {
    "type": "document",
    "uri": "file://docs/v2-architecture.md",
    "title": "AgentBus v2 Architecture"
  },
  "content": "...full markdown content...",
  "tags": ["docs", "architecture"]
}
```

### `list_memories`

List memory records for inspection or debugging.

Suggested input:

```json
{
  "scope": "project",
  "projectId": "agentbus",
  "kind": "decision",
  "limit": 20
}
```

## MCP Resources

Recommended resources for v0:

- `memory://profile`
- `memory://recent`
- `memory://projects/{projectId}`
- `memory://decisions/{projectId}`

These resources should be derived from the same memory core, not assembled separately in MCP handlers.

## Retrieval Modes

Recommended v0 modes:

- `profile` — facts and stable preferences
- `query` — search-focused results for the current ask
- `full` — profile plus search results
- `recent` — strongest recent-session or recent-project context

## Ranking Rules

v0 ranking should combine:

- hard scope match
- keyword or FTS match
- vector similarity
- recency bonus
- importance bonus

Suggested rule:

- filter first
- score second
- deduplicate third
- shape final context last

## Storage Shape

v0 should separate canonical records from retrieval rows.

Suggested logical tables:

### Canonical records

Append-only events or records with stable IDs.

### Retrieval rows

One row per memory or chunk with:

- `memoryId`
- `chunkId`
- `content`
- `summary`
- `embedding`
- `kind`
- `scope`
- `userId`
- `projectId`
- `containerId`
- `sessionId`
- `importance`
- `createdAt`
- `updatedAt`
- `embeddingVersion`
- `indexVersion`

## Embedding Requirements

v0 should use one embedding model.

Rules:

- store the embedding model version with each indexed row
- support reindexing when the model changes
- do not make embeddings the only retrieval signal

If multilingual use is expected, choose a multilingual embedding model from the beginning.

## Caching

Per-turn caching is recommended when the same runtime may call memory more than once in one task cycle.

Suggested cache inputs:

- caller identity
- retrieval mode
- normalized query
- project or container scope

## Observability

Every retrieval should emit enough debug information to explain itself.

Minimum fields:

- request ID
- query
- retrieval mode
- enforced filters
- returned memory IDs
- scores or ranking reasons
- context size

## Failure Rules

When the retrieval system is degraded:

- fail closed on missing scope
- allow keyword-only fallback if embeddings are unavailable
- never silently widen scope to return something “helpful”
- mark partial or degraded retrieval in the response

## Migration Posture

The MCP contract should not expose LanceDB-specific language.

That keeps the migration path open to:

- Postgres + pgvector
- Qdrant
- another future engine

The caller should depend on memory semantics, not index internals.

## Recommended v0 Build Order

1. canonical memory record type
2. append-only write path
3. LanceDB retrieval row schema
4. `remember`
5. `search_memories`
6. `build_context_for_task`
7. `upsert_document`
8. `list_memories`
9. reindex command
10. retrieval trace logging

## Summary

v0 succeeds if it does four things well:

1. stores memory durably
2. retrieves memory within strict scope
3. supports exact and semantic recall together
4. builds context that an agent can actually use
