import type { ZodRawShape } from "zod";

import { getAppEnv } from "../../../config/env.js";
import { listOrchestrationTraces } from "../../orchestration/observability/list-orchestration-traces.js";
import { runOrchestrationWorkflow } from "../../orchestration/run-orchestration-workflow.js";
import { listOrchestrationTracesInputSchema } from "../../orchestration/schemas.js";
import { normalizeWorkflowSpec, orchestrateToolInputSchema } from "../../orchestration/workflow-spec.js";
import { OrchestrationTraceStore } from "../../orchestration/observability/orchestration-trace.js";
import { rememberInputSchema, searchMemoriesInputSchema, buildContextForTaskInputSchema, upsertDocumentInputSchema, listMemoriesInputSchema } from "../schemas.js";
import type { MemoryService } from "../memory-service.js";
import { newId } from "../lib/ids.js";

export interface RegisteredTool {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: ZodRawShape;
  readonly execute: (input: Record<string, unknown>) => Promise<unknown>;
}

export function getRegisteredTools(memoryService: MemoryService): readonly RegisteredTool[] {
  const env = getAppEnv();
  const orchestrationTraceStore = new OrchestrationTraceStore(env.dataPaths.orchestrationTraceFilePath);

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
    {
      name: "orchestrate_workflow",
      description: "Run a static parallel or sequential worker workflow.",
      inputSchema: orchestrateToolInputSchema.shape,
      execute: async (input) => {
        const parsed = orchestrateToolInputSchema.parse(input);
        return runOrchestrationWorkflow(normalizeWorkflowSpec(parsed.spec, parsed.cwd), {
          traceStore: orchestrationTraceStore,
          traceSource: "mcp",
          traceRequestId: newId("workflow"),
        });
      },
    },
    {
      name: "list_orchestration_traces",
      description: "List orchestration workflow trace entries for inspection.",
      inputSchema: listOrchestrationTracesInputSchema.shape,
      execute: (input) =>
        listOrchestrationTraces({
          payload: input as never,
          filePath: env.dataPaths.orchestrationTraceFilePath,
        }),
    },
  ];
}
