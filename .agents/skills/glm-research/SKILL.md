---
name: glm-research
description: Run exhaustive web research with parallel search+read workflow using web-reader, web-search-prime, websearch, and zread. Use when user asks "research", "look up", "find sources", "deep dive", or "compare sources".
---

# /glm-research - Parallel Web Research

Run high-effort, source-backed research with query decomposition, parallel search, triangulation, and citations.

## Usage

```bash
/glm-research <query>
/glm-research --deep <query>
/glm-research --quick <query>
```

## Modes

- `--quick`: Fast scan, 3-5 sources, concise synthesis.
- `default`: Balanced, 5-8 sources, conflict check.
- `--deep`: Exhaustive, 8-12+ sources, cross-source validation + gaps list.

## Workflow (Do In Order)

### 1) Decompose query

- Extract core intent, constraints, and timeframe.
- Split into focused sub-queries (definition, latest state, implementation examples, tradeoffs, risks).

### 2) Search in parallel (mandatory)

- Use **both** search engines for coverage:
  - `web-search-prime_webSearchPrime`
  - `websearch_web_search_exa`
- Run multiple targeted searches in parallel (different wording angles, not duplicated wording).
- For time-sensitive topics, add recency filters where available.

### 3) Read pages (mandatory)

- Use `web-reader_webReader` to convert candidate URLs into model-friendly content.
- If `zread` MCP is available in the environment, read key URLs with `zread` as a second reader for comparison.
- If `zread` is unavailable, continue with `web-reader_webReader` only and explicitly note fallback.

### 4) Triangulate and score confidence

- Prefer claims supported by at least 2 independent sources.
- Mark disagreements explicitly instead of hiding them.
- Label confidence as `high` / `medium` / `low` based on source agreement and freshness.

### 5) Return citations

- Every important claim must include source URL(s).
- Use compact citation style: `[Title](URL)`.
- Include a short `Limitations` section for unknowns or sparse evidence.

## Hard Rules

1. Always run parallel searches first; never rely on one engine.
2. Never stop at the first acceptable result.
3. Do not present single-source claims as fact.
4. If tools fail, return partial findings with explicit failure notes.
5. Separate facts from interpretation in the final synthesis.

## Suggested Output Shape

```markdown
## Findings
- Key finding A ... [Source](https://...)
- Key finding B ... [Source](https://...)

## Conflicts / Nuance
- Source X says ... while Source Y says ...

## Recommendation
- Practical recommendation based on evidence.

## Limitations
- Missing/weak evidence areas.
```

ARGUMENTS: $ARGUMENTS
