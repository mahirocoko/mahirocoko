import { stdout } from "node:process";

import { ZodError } from "zod";

import { getAppEnv } from "./config/env.js";
import { parseOrchestrateCliArgs } from "./features/orchestration/orchestrate-cli.js";
import { OrchestrationTraceStore } from "./features/orchestration/observability/orchestration-trace.js";
import { hasOrchestrationFailures, runOrchestrationWorkflow, type OrchestrationRunResult } from "./features/orchestration/run-orchestration-workflow.js";
import { newId } from "./features/memory/lib/ids.js";

interface InvalidInputResult {
  readonly status: "invalid_input";
  readonly durationMs: number;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly error: string;
}

async function main(): Promise<void> {
  const startedAtDate = new Date();
  const startedAt = startedAtDate.toISOString();

  try {
    const spec = await parseOrchestrateCliArgs(process.argv.slice(2));
    const env = getAppEnv();
    const result = await runOrchestrationWorkflow(spec, {
      traceStore: new OrchestrationTraceStore(env.dataPaths.orchestrationTraceFilePath),
      traceSource: "cli",
      traceRequestId: newId("workflow"),
    });

    writeJson(result);
    if (hasOrchestrationFailures(result)) {
      process.exitCode = 1;
    }
  } catch (error) {
    const failedAtDate = new Date();

    writeJson({
      status: "invalid_input",
      durationMs: failedAtDate.getTime() - startedAtDate.getTime(),
      startedAt,
      finishedAt: failedAtDate.toISOString(),
      error: formatInputError(error),
    } satisfies InvalidInputResult);

    process.exitCode = 1;
  }
}

function writeJson(value: OrchestrationRunResult | InvalidInputResult): void {
  stdout.write(`${JSON.stringify(value)}\n`);
}

function formatInputError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`).join("; ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown input error.";
}

void main();
