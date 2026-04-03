import { geminiJsonResponseSchema } from "../schemas.js";
import type { GeminiCommandRunResult, GeminiWorkerInput, GeminiWorkerResult } from "../types.js";

export function normalizeGeminiResult(
  input: GeminiWorkerInput,
  commandResult: GeminiCommandRunResult,
): GeminiWorkerResult {
  const baseResult = {
    taskId: input.taskId,
    requestedModel: input.model,
    stderr: commandResult.stderr.trim() || undefined,
    stdout: commandResult.stdout,
    exitCode: commandResult.exitCode,
    signal: commandResult.signal,
    durationMs: commandResult.durationMs,
    startedAt: commandResult.startedAt,
    finishedAt: commandResult.finishedAt,
  } satisfies Omit<GeminiWorkerResult, "status">;

  if (commandResult.timedOut) {
    return {
      ...baseResult,
      status: "timeout",
      error: `Gemini command timed out after ${input.timeoutMs}ms.`,
    };
  }

  if (commandResult.spawnError) {
    return {
      ...baseResult,
      status: "spawn_error",
      error: commandResult.spawnError,
    };
  }

  const trimmedStdout = commandResult.stdout.trim();

  if (!trimmedStdout) {
    return {
      ...baseResult,
      status: "empty_output",
      error: commandResult.exitCode === 0 ? "Gemini returned no stdout." : "Gemini failed without stdout.",
    };
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(trimmedStdout);
  } catch (error) {
    return {
      ...baseResult,
      status: "invalid_json",
      error: error instanceof Error ? error.message : "Failed to parse Gemini JSON output.",
    };
  }

  const rawResult = geminiJsonResponseSchema.safeParse(parsedJson);

  if (!rawResult.success) {
    return {
      ...baseResult,
      status: "invalid_json",
      error: rawResult.error.issues
        .map((issue) => `${issue.path.join(".") || "output"}: ${issue.message}`)
        .join("; "),
    };
  }

  const raw = rawResult.data;
  const reportedModel = readReportedModel(raw);

  if (commandResult.exitCode !== 0) {
    return {
      ...baseResult,
      status: "command_failed",
      reportedModel,
      response: raw.response,
      raw,
      error: readCommandFailureError(raw),
    };
  }

  return {
    ...baseResult,
    status: "completed",
    reportedModel,
    response: raw.response,
    raw,
    error: readStructuredError(raw),
  };
}

function readReportedModel(raw: { readonly [key: string]: unknown }): string | undefined {
  const topLevelModel = typeof raw.model === "string" ? raw.model : undefined;
  if (topLevelModel) {
    return topLevelModel;
  }

  const stats = raw.stats;
  if (!stats || typeof stats !== "object") {
    return undefined;
  }

  const statsRecord = stats as Record<string, unknown>;
  return typeof statsRecord.model === "string" ? statsRecord.model : undefined;
}

function readStructuredError(raw: { readonly [key: string]: unknown }): string | undefined {
  if (typeof raw.error === "string") {
    return raw.error;
  }

  if (raw.error && typeof raw.error === "object") {
    return JSON.stringify(raw.error);
  }

  return undefined;
}

function readCommandFailureError(raw: { readonly [key: string]: unknown }): string {
  return readStructuredError(raw) ?? "Gemini command exited with a non-zero code.";
}
