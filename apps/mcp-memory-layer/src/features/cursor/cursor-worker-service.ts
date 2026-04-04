import { normalizeCursorResult } from "./core/normalize-cursor-result.js";
import { runCursorCommand } from "./core/run-cursor-command.js";
import type { CursorCommandRunResult, CursorWorkerInput, CursorWorkerResult } from "./types.js";

export interface RunCursorWorkerDependencies {
  readonly runCommand?: (input: CursorWorkerInput) => Promise<CursorCommandRunResult>;
}

export async function runCursorWorker(
  input: CursorWorkerInput,
  dependencies: RunCursorWorkerDependencies = {},
): Promise<CursorWorkerResult> {
  const runCommand = dependencies.runCommand ?? runCursorCommand;
  const commandResult = await runCommand(input);
  return normalizeCursorResult(input, commandResult);
}
