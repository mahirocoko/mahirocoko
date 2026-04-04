---
title: Thin global context, fix stale facts first
created: 2026-04-04
tags: [docs, agents, repo-rules, stale-docs, cleanup, workflow]
source: local session
---

# Thin global context, fix stale facts first

When a repository has both global agent files and a docs family, the highest-value cleanup is usually not broad documentation reduction. The right first move is narrower:

1. Thin the files that an agent is likely to read every time, such as `AGENTS.md` or model-specific entry files.
2. Remove stale factual errors first, such as missing paths, outdated versions, or route structures that no longer exist.
3. Leave topic-specific reference docs alone unless they are actively misleading.

This matters because global context has a permanent cost. Topic docs do not. A long `best-practices.md` file is often acceptable if it is optional and mostly accurate. A bloated or stale `AGENTS.md` is more dangerous because it shapes every task from the start.

The practical rule from this session is simple: do not optimize for total neatness; optimize for the biggest reduction in repeated misunderstanding. Thin global guardrails, correct obvious drift, and stop once the remaining documentation is optional rather than harmful.

Retrieval hints: `thin global context`, `stale facts first`, `AGENTS cleanup`, `docs drift`, `stop point`.
