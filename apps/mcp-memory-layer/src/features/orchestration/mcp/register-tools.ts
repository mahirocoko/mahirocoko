import { getAppEnv } from "../../../config/env.js";
import { newId } from "../../../lib/ids.js";
import type { RegisteredTool } from "../../../lib/mcp/registered-tool.js";
import { listOrchestrationTraces } from "../observability/list-orchestration-traces.js";
import { OrchestrationTraceStore } from "../observability/orchestration-trace.js";
import { runOrchestrationWorkflow } from "../run-orchestration-workflow.js";
import { listOrchestrationTracesInputSchema } from "../schemas.js";
import { normalizeWorkflowSpec, orchestrateToolInputSchema } from "../workflow-spec.js";

export function getRegisteredOrchestrationTools(): readonly RegisteredTool[] {
  const env = getAppEnv();
  const orchestrationTraceStore = new OrchestrationTraceStore(env.dataPaths.orchestrationTraceFilePath);

  return [
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
