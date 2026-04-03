import { normalizeGeminiResult } from "./core/normalize-gemini-result.js";
import { runGeminiCommand } from "./core/run-gemini-command.js";
import type { GeminiCommandRunResult, GeminiWorkerInput, GeminiWorkerResult } from "./types.js";

export interface RunGeminiWorkerDependencies {
  readonly runCommand?: (input: GeminiWorkerInput) => Promise<GeminiCommandRunResult>;
}

export async function runGeminiWorker(
  input: GeminiWorkerInput,
  dependencies: RunGeminiWorkerDependencies = {},
): Promise<GeminiWorkerResult> {
  const runCommand = dependencies.runCommand ?? runGeminiCommand;
  const commandResult = await runCommand(input);
  return normalizeGeminiResult(input, commandResult);
}
