import type { ZodRawShape } from "zod";

import { rememberInputSchema, searchMemoriesInputSchema, buildContextForTaskInputSchema, upsertDocumentInputSchema, listMemoriesInputSchema } from "../schemas.js";
import type { MemoryService } from "../memory-service.js";

export interface RegisteredTool {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: ZodRawShape;
  readonly execute: (input: Record<string, unknown>) => Promise<unknown>;
}

export function getRegisteredTools(memoryService: MemoryService): readonly RegisteredTool[] {
  return [
    {
      name: "remember",
      description: "Write one scoped memory record.",
      inputSchema: rememberInputSchema.shape,
      execute: (input) => memoryService.remember(input as never),
    },
    {
      name: "search_memories",
      description: "Search scoped memories with keyword and vector retrieval.",
      inputSchema: searchMemoriesInputSchema.shape,
      execute: (input) => memoryService.search(input as never),
    },
    {
      name: "build_context_for_task",
      description: "Build a model-ready context bundle for a task.",
      inputSchema: buildContextForTaskInputSchema.shape,
      execute: (input) => memoryService.buildContext(input as never),
    },
    {
      name: "upsert_document",
      description: "Store or refresh a document-shaped memory source.",
      inputSchema: upsertDocumentInputSchema.shape,
      execute: (input) => memoryService.upsertDocument(input as never),
    },
    {
      name: "list_memories",
      description: "List stored memories for inspection.",
      inputSchema: listMemoriesInputSchema.shape,
      execute: (input) => memoryService.list(input as never),
    },
  ];
}
