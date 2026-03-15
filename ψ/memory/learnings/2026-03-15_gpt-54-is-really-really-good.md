---
title: "gpt-5.4 is really, really good"
source: YouTube - Theo - t3.gg (https://www.youtube.com/watch?v=HD5TWE8xD7o)
gemini_conversation: "tab:1474956681 (response pending)"
date: 2026-03-15
duration: "40:20"
upload_date: 2026-03-06
tags: [gpt-5.4, openai, ai-models, coding, frontend, benchmarks, opus, gemini, skatebench]
---

# gpt-5.4 is really, really good

Theo's comprehensive review of GPT 5.4 after a week of heavy use. Covers benchmarks, pricing, coding, frontend design, prompting, and comparisons.

## Key Takeaways

1. **GPT 5.4 is the best overall AI model for coding** -- massive improvements in reasoning efficiency, tool use, context handling (1M tokens), and steerability. "Coding is essentially solved" for traditional full-stack backend work.

2. **Model lineup consolidation**: 5.3 Codex → 5.3 Instant → 5.4 Thinking (no 5.4 Codex/Instant). Likely the death of separate Codex models -- coding RL is now baked into the base model.

3. **Reasoning tiers matter**: "High" is the sweet spot. "Extra High" often overthinks and performs worse. Pro ($30/$180 per mill) is overkill for most tasks but solves previously unsolvable problems (one-shot a DEF CON crypto puzzle that took humans 3 days).

4. **Frontend design is STILL bad** -- GPT models remain a generation behind Opus and Gemini for UI work. Card-heavy layouts, poor hierarchy, terrible alignment. The "uncodexify" skill by ZyxCev helps but doesn't fix the fundamental gap.

5. **Most steerable model ever** -- follows system prompt instructions precisely. Prompting guidance from OpenAI is worth reading. You can control output format, tool routing, parallelism, and mid-conversation steering. Agent.md files matter more now.

6. **Compaction/context is significantly better** -- gigantic "god threads" work now. The model recalls past context after compaction much better than predecessors.

7. **Price increased**: $2.50/$15 per mill (up from $1.75/$14 for 5.2). Still cheaper than Opus 4.6 per Artificial Analysis benchmarks.

## Model Comparison (from Theo's experience)

| Aspect | GPT 5.4 | Opus 4.5/4.6 | Gemini 3/3.1 Pro |
|--------|---------|--------------|-----------------|
| Backend coding | Best | Great | Good |
| Frontend/UI design | Bad | Best | Good (initial), bad at refinement |
| Instruction following | Best | Good | Poor (overthinks, loops) |
| Steerability | Best | Good | Needs workarounds |
| Token efficiency | Good (uses less) | Expensive (lots of reasoning) | Varies |
| Context handling | Best (1M tokens) | Good | Good |
| Tool use | Best | Good | Good |

## Skatebench V2 Results

| Model | Score | Notes |
|-------|-------|-------|
| Gemini 3.1 Pro Preview | 97% | Absurd lead |
| GPT 5.4 High | 82% | |
| GPT 5.4 X-High | 81% | Worse than High (overthinks) |
| GPT 5.4 Pro Thinking | 79% | Even worse |

Skatebench V2 is private now -- some models scored perfectly on V1's public questions but got zero on new ones, suggesting training data contamination.

## Pricing

| Model | Input/mill | Output/mill |
|-------|-----------|------------|
| GPT 5.4 | $2.50 | $15 |
| GPT 5.4 Pro | $30 | $180 |
| GPT 5.2 (prev) | $1.75 | $14 |
| GPT 5.0/5.1 (prev) | $1.25 | $10 |

Over 272K input tokens → 2x input, 1.5x output pricing.

## Key Details

- **Knowledge cutoff**: August 31, 2025 (same as 5.2, no new training data)
- **Browser/computer use**: Massive improvement, trained to run JS for programmatic UI interactions
- **Prompt injection regression**: Better overall but regressed for function call injections (~2% vs 0% in 5.1)
- **Tool search**: New feature -- model discovers tools when needed instead of loading all upfront
- **Web search**: 89.3% vs 65.8% (5.2) -- huge jump
- **Personality**: Less sycophantic, better mental health handling, but still bullet-point-heavy

## Practical Insights

- **Tailwind V4**: Almost no model sets it up correctly. Use V3 for now.
- **Long-running tasks**: Can run for hours on a single prompt. "REPL loops" feel less necessary.
- **Multi-model workflow**: Use GPT 5.4 for coding/logic, Opus for UI refinement, Gemini for initial page scaffolds.
- **Steerability tip**: Give more upfront context. The model is highly responsive to system prompts and agent.md files.

## Transcript (key timestamps)

[00:00] GPT 5.4 intro -- best AI model ever made for developers. Questions to answer: Codex status, frontend, different apps, benchmarks, pricing.

[03:21] Model lineup: 5.3 Codex → 5.3 Instant → 5.4 Thinking. No 5.4 Codex. Death of Codex model variant.

[04:58] Key features: mid-reasoning steering, 1M context window, token-efficient reasoning (500 tokens on medium, 1100 on high, 5400 on X-high).

[07:05] Benchmarks: GPQA, SWE-Bench Pro improvements. 5.4 X-High tied with Gemini 3.1 Pro Preview on Artificial Analysis.

[08:33] Vision and computer use massive improvement. Trained to run JavaScript for programmatic browser interactions.

[10:04] SWE-Bench: slightly better, slightly less time. But SWE-Bench doesn't match real-world experience.

[11:48] Frontend still has "GPT design" problems. Made a Roller Coaster Tycoon game from scratch though.

[12:55] Skatebench V2: Gemini 3.1 Pro at 97%, GPT 5.4 High at 82%, X-High worse at 81%. V2 is private due to training data contamination concerns.

[15:05] Pricing: $2.50/$15 per mill. 5.4 Pro is $30/$180. Expensive but still cheaper than Opus 4.6 in total cost.

[16:24] Cursor internally says 5.4 is the leader. Using it for cloud agent tasks.

[17:00] Stockfish challenge: Both 5.3 and 5.4 misinterpret the prompt (run Stockfish instead of writing code to beat it).

[20:04] Codebase migration: 50-minute single-prompt run upgrading old React codebase. Compaction significantly better.

[22:40] System card: reasoning trace improvements, safety, prompt injection regression in function calls.

[25:30] Community reaction: Matt says "best model by far", coding "essentially solved". Still behind Opus/Gemini for frontend.

[27:42] 5.4 Pro solved DEF CON Goldbug crypto puzzle in 17 minutes (took humans 3 days).

[30:30] UI comparison: GPT failed at Skatebench redesign, Gemini failed at refinement, Opus nailed it (dropped Recharts, built custom with Tailwind).

[34:28] "Uncodexify" skill by ZyxCev -- documented all GPT UI anti-patterns, wrote a skill to fix them.

[35:15] Prompting guidance: output contracts, mid-conversation steering, tool routing. Most steerable model ever.

[38:40] Where to use: ChatGPT, T3 Chat ($8/month), T3 Code (upcoming). Still uses Opus/Gemini for UI work.
