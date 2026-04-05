import { getAppEnv } from "../../../config/env.js";
import { newId } from "../../../lib/ids.js";
import type { RegisteredTool } from "../../../lib/mcp/registered-tool.js";
import { z } from "zod";
import { listOrchestrationTraces } from "../observability/list-orchestration-traces.js";
import { OrchestrationResultStore } from "../observability/orchestration-result-store.js";
import {
  buildRunnerFailedOrchestrationTraceEntry,
  OrchestrationTraceStore,
} from "../observability/orchestration-trace.js";
import { runOrchestrationWorkflow } from "../run-orchestration-workflow.js";
import { listOrchestrationTracesInputSchema } from "../schemas.js";
import { normalizeWorkflowSpec, orchestrateToolInputSchema } from "../workflow-spec.js";

const getOrchestrationResultInputSchema = z.object({
  requestId: z.string().trim().min(1),
});

export function getRegisteredOrchestrationTools(): readonly RegisteredTool[] {
  const env = getAppEnv();
  const orchestrationTraceStore = new OrchestrationTraceStore(env.dataPaths.orchestrationTraceFilePath);
  const orchestrationResultStore = new OrchestrationResultStore(env.dataPaths.orchestrationResultDirectory);

  return [
    {
      name: "orchestrate_workflow",
      description: "Run a static parallel or sequential worker workflow.",
      inputSchema: orchestrateToolInputSchema.shape,
      execute: async (input) => {
        const parsed = orchestrateToolInputSchema.parse(input);
        const requestId = newId("workflow");
        const spec = normalizeWorkflowSpec(parsed.spec, parsed.cwd);
        const startedAt = new Date().toISOString();
        const options = {
          traceStore: orchestrationTraceStore,
          traceSource: "mcp",
          traceRequestId: requestId,
        } as const;

        await orchestrationResultStore.writeRunning({
          requestId,
          source: "mcp",
          spec,
        });

        if (parsed.waitForCompletion === false) {
          void runOrchestrationWorkflow(spec, options)
            .then(async (result) => {
              await orchestrationResultStore.writeCompleted({
                requestId,
                source: "mcp",
                spec,
                result,
              });
            })
            .catch(async (error: unknown) => {
              const errorMessage = error instanceof Error ? error.message : String(error);

              await orchestrationTraceStore.append(
                buildRunnerFailedOrchestrationTraceEntry({
                  requestId,
                  source: "mcp",
                  spec,
                  error: errorMessage,
                  startedAt,
                }),
              );

              await orchestrationResultStore.writeRunnerFailed({
                requestId,
                source: "mcp",
                spec,
                error: errorMessage,
              });
            });

          return {
            requestId,
            status: "running",
          };
        }

        try {
          const result = await runOrchestrationWorkflow(spec, options);

          await orchestrationResultStore.writeCompleted({
            requestId,
            source: "mcp",
            spec,
            result,
          });

          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          await orchestrationTraceStore.append(
            buildRunnerFailedOrchestrationTraceEntry({
              requestId,
              source: "mcp",
              spec,
              error: errorMessage,
              startedAt,
            }),
          );

          await orchestrationResultStore.writeRunnerFailed({
            requestId,
            source: "mcp",
            spec,
            error: errorMessage,
          });

          throw error;
        }
      },
    },
    {
      name: "get_orchestration_result",
      description: "Get the latest stored orchestration workflow result by request ID.",
      inputSchema: getOrchestrationResultInputSchema.shape,
      execute: async (input) => {
        const parsed = getOrchestrationResultInputSchema.parse(input);
        return orchestrationResultStore.read(parsed.requestId);
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
