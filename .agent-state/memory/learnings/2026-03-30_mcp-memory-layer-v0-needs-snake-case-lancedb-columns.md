# MCP memory layer v0 needs snake_case LanceDB columns

**Date**: 2026-03-30
**Tags**: mcp, memory-layer, lancedb, typescript, bun, retrieval, verification

## Context

While building the first real `apps/mcp-memory-layer` app, the initial LanceDB integration stored rows successfully but failed to retrieve them correctly once scoped filtering was applied. The first design used camelCase application field names directly in the LanceDB table and built SQL-like predicates around those same names.

## What happened

- Rows were inserted into the `memory_records` table.
- Raw unfiltered reads returned the expected data.
- Scoped filtered queries either errored or returned empty results.
- The failure came from DataFusion/LanceDB SQL behavior around identifier normalization and camelCase field names.

## Lesson

Keep the application model and the database row shape separate.

For the app-facing TypeScript model, names like `userId`, `projectId`, and `containerId` are still fine. For the LanceDB-facing storage row, use SQL-safe snake_case columns such as:

- `user_id`
- `project_id`
- `container_id`
- `session_id`
- `created_at`
- `updated_at`

Then translate between the two at the storage boundary.

## Why it matters

This keeps retrieval logic predictable and removes a class of runtime-only bugs that are easy to miss during a compile-only review. It also makes the scope-filter builder simpler and more robust. The storage layer should optimize for query reliability, not mirror the exact shape of the app model.

## Durable rule

When integrating LanceDB or similar SQL-like query layers:

1. keep app model names ergonomic
2. keep storage column names query-safe
3. validate retrieval with actual runtime queries, not just inserts
4. add tests that prove scoped reads work after writes and after reindex

This is now a durable pattern for future memory-layer work in this repo.
