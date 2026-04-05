import { describe, expect, it } from "vitest";

import { parseListOrchestrationTracesCliArgs } from "../src/features/orchestration/list-orchestration-traces-cli.js";

describe("parseListOrchestrationTracesCliArgs", () => {
  it("parses supported orchestration trace filter flags", () => {
    expect(
      parseListOrchestrationTracesCliArgs([
        "--format",
        "text",
        "--source",
        "cli",
        "--mode",
        "parallel",
        "--status",
        "completed",
        "--request-id",
        "workflow-1",
        "--task-id",
        "cursor-1",
        "--limit",
        "25",
      ]),
    ).toEqual({
      format: "text",
      payload: {
        source: "cli",
        mode: "parallel",
        status: "completed",
        requestId: "workflow-1",
        taskId: "cursor-1",
        limit: 25,
      },
    });
  });

  it("returns an empty filter object when no flags are provided", () => {
    expect(parseListOrchestrationTracesCliArgs([])).toEqual({
      format: "json",
      payload: {},
    });
  });

  it("fails for unknown flags", () => {
    expect(() => parseListOrchestrationTracesCliArgs(["--mystery", "value"])).toThrowError(
      "Unknown flag: --mystery",
    );
  });

  it("fails for unexpected positional arguments", () => {
    expect(() => parseListOrchestrationTracesCliArgs(["oops"])).toThrowError(
      "Unexpected argument: oops",
    );
  });

  it("fails when limit is not numeric", () => {
    expect(() => parseListOrchestrationTracesCliArgs(["--limit", "many"])).toThrowError(
      "--limit must be a number.",
    );
  });

  it("fails when format is unsupported", () => {
    expect(() => parseListOrchestrationTracesCliArgs(["--format", "table"])).toThrowError(
      "--format must be one of: json, text, detail.",
    );
  });

  it("accepts detail format", () => {
    expect(parseListOrchestrationTracesCliArgs(["--format", "detail"])).toEqual({
      format: "detail",
      payload: {},
    });
  });
});
