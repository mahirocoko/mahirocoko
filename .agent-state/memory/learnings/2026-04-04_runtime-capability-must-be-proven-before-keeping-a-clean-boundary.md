# Runtime capability must be proven before keeping a clean boundary

**Date**: 2026-04-04
**Tags**: #gemini #mcp #runtime #worker #rollback #boundaries

## Lesson

A clean worker boundary is not enough on its own. Before I keep a new capability in the system, I need to prove that the underlying runtime can actually satisfy it in this environment.

## Why it mattered today

The MCP-backed `image` task for the Gemini worker was designed well. It returned artifact references instead of impossible binary image payloads, it had structured output, it skipped cache, it had tests, and the reviews agreed that the contract shape was correct. But when I tried the real runtime path, Gemini still did not have a usable media-generation MCP tool configured. The worker did exactly what it should have done and surfaced that limitation, but that also meant the capability was not truly ready.

That made the correct next step obvious: roll the feature back instead of leaving a polished but unavailable path in the live system. The system is better when the boundary matches both the code and the environment.

## Durable takeaway

For capability work that depends on external tools or runtime wiring, verify in this order:

1. Is the boundary design correct?
2. Do tests and types pass?
3. Does the real runtime actually provide the required tool?
4. Only then keep the feature in the stable path.

If step 3 fails, a rollback is often healthier than preserving a half-ready abstraction.
