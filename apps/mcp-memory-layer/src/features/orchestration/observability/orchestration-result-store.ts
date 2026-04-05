import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { OrchestrationRunResult } from "../run-orchestration-workflow.js";
import type { OrchestrateWorkflowSpec } from "../workflow-spec.js";

interface OrchestrationResultMetadata {
  readonly mode: OrchestrateWorkflowSpec["mode"];
  readonly maxConcurrency?: number;
  readonly timeoutMs?: number;
  readonly taskIds: readonly string[];
}

interface BaseOrchestrationResultRecord {
  readonly requestId: string;
  readonly source: "cli" | "mcp";
  readonly metadata: OrchestrationResultMetadata;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type OrchestrationResultRecord =
  | (BaseOrchestrationResultRecord & {
      readonly status: "running";
    })
  | (BaseOrchestrationResultRecord & {
      readonly status: "completed" | "step_failed" | "timed_out";
      readonly result: OrchestrationRunResult;
    })
  | (BaseOrchestrationResultRecord & {
      readonly status: "runner_failed";
      readonly error: string;
    });

export class OrchestrationResultStore {
  public constructor(private readonly directoryPath: string) {}

  public async writeRunning(input: {
    readonly requestId: string;
    readonly source: "cli" | "mcp";
    readonly spec: OrchestrateWorkflowSpec;
  }): Promise<OrchestrationResultRecord> {
    const timestamp = new Date().toISOString();
    const record: OrchestrationResultRecord = {
      requestId: input.requestId,
      source: input.source,
      metadata: buildMetadata(input.spec),
      status: "running",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.writeRecord(record);
    return record;
  }

  public async writeCompleted(input: {
    readonly requestId: string;
    readonly source: "cli" | "mcp";
    readonly spec: OrchestrateWorkflowSpec;
    readonly result: OrchestrationRunResult;
  }): Promise<OrchestrationResultRecord> {
    const existing = await this.read(input.requestId);
    const timestamp = new Date().toISOString();
    const record: OrchestrationResultRecord = {
      requestId: input.requestId,
      source: input.source,
      metadata: buildMetadata(input.spec),
      status: input.result.status,
      result: input.result,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    await this.writeRecord(record);
    return record;
  }

  public async writeRunnerFailed(input: {
    readonly requestId: string;
    readonly source: "cli" | "mcp";
    readonly spec: OrchestrateWorkflowSpec;
    readonly error: string;
  }): Promise<OrchestrationResultRecord> {
    const existing = await this.read(input.requestId);
    const timestamp = new Date().toISOString();
    const record: OrchestrationResultRecord = {
      requestId: input.requestId,
      source: input.source,
      metadata: buildMetadata(input.spec),
      status: "runner_failed",
      error: input.error,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    await this.writeRecord(record);
    return record;
  }

  public async read(requestId: string): Promise<OrchestrationResultRecord | null> {
    try {
      const content = await readFile(this.getFilePath(requestId), "utf8");
      return JSON.parse(content) as OrchestrationResultRecord;
    } catch (error) {
      if (isFileNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  private async writeRecord(record: OrchestrationResultRecord): Promise<void> {
    await mkdir(this.directoryPath, { recursive: true });
    await writeFile(this.getFilePath(record.requestId), JSON.stringify(record, null, 2), "utf8");
  }

  private getFilePath(requestId: string): string {
    return path.join(this.directoryPath, `${requestId}.json`);
  }
}

function buildMetadata(spec: OrchestrateWorkflowSpec): OrchestrationResultMetadata {
  if (spec.mode === "parallel") {
    return {
      mode: spec.mode,
      maxConcurrency: spec.maxConcurrency,
      timeoutMs: spec.timeoutMs,
      taskIds: spec.jobs.map((job) => job.input.taskId),
    };
  }

  return {
    mode: spec.mode,
    timeoutMs: spec.timeoutMs,
    taskIds: spec.steps.flatMap((step) => (typeof step === "function" ? [] : [step.input.taskId])),
  };
}

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
