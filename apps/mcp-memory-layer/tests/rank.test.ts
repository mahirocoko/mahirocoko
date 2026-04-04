import { describe, expect, it } from "vitest";

import { scoreCombined, weightsForMode } from "../src/features/memory/retrieval/rank.js";

describe("retrieval rank helpers", () => {
  it("applies weight profiles correctly", () => {
    const input = {
      keyword: 0.2,
      vector: 0.4,
      recency: 0.6,
      importance: 0.8,
    };

    const fullScore = scoreCombined(input, weightsForMode("full"));
    const recentScore = scoreCombined(input, weightsForMode("recent"));

    expect(fullScore).toBeCloseTo(0.43);
    expect(recentScore).toBeCloseTo(0.51);
    expect(recentScore).toBeGreaterThan(fullScore);
  });

  it("returns distinct weight profiles for each mode", () => {
    const modes = ["profile", "query", "full", "recent"] as const;
    const entries = modes.map((mode) => [mode, weightsForMode(mode)] as const);

    for (const [, weights] of entries) {
      expect(weights.keyword + weights.vector + weights.recency + weights.importance).toBeCloseTo(1);
    }

    expect(entries.map(([, weights]) => JSON.stringify(weights))).toEqual([
      '{"keyword":0.2,"vector":0.15,"recency":0.1,"importance":0.55}',
      '{"keyword":0.4,"vector":0.4,"recency":0.1,"importance":0.1}',
      '{"keyword":0.35,"vector":0.3,"recency":0.2,"importance":0.15}',
      '{"keyword":0.2,"vector":0.15,"recency":0.55,"importance":0.1}',
    ]);
  });
});
