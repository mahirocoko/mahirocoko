export interface GeminiWorkerInput {
  readonly taskId: string;
  readonly prompt: string;
  readonly model: string;
  readonly timeoutMs?: number;
  readonly cwd?: string;
  readonly binaryPath?: string;
}

export interface GeminiCommandRunResult {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly timedOut: boolean;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly durationMs: number;
  readonly spawnError?: string;
}

export interface GeminiJsonResponse {
  readonly response?: string;
  readonly stats?: Record<string, unknown>;
  readonly error?: string | Record<string, unknown>;
  readonly [key: string]: unknown;
}

export interface GeminiWorkerResult {
  readonly taskId?: string;
  readonly status:
    | "completed"
    | "command_failed"
    | "invalid_json"
    | "empty_output"
    | "timeout"
    | "spawn_error"
    | "invalid_input";
  readonly requestedModel?: string;
  readonly reportedModel?: string;
  readonly response?: string;
  readonly raw?: GeminiJsonResponse;
  readonly stderr?: string;
  readonly stdout?: string;
  readonly exitCode?: number | null;
  readonly signal?: NodeJS.Signals | null;
  readonly durationMs: number;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly error?: string;
}
