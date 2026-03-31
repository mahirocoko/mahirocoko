# Lesson Learned: learn skill is best when grounded after delegation

**Tags:** learn, research, delegation, grounding, retrospectives

When using the local `/learn` workflow on an unfamiliar repository, the best pattern is not “delegate and trust” or “manually inspect everything.” The strong pattern is: delegate broad discovery in parallel, then ground the synthesized write-up against a very small set of authoritative files such as `README.md`, root config, and core operational docs.

This matters because delegated outputs are great at coverage, but not always great at precision or emphasis. In the `Claude-Code-Game-Studios` session, the parallel study tracks quickly surfaced architecture, API surface, testing, snippets, and quick reference material. But the highest-value conclusion only became obvious after a grounding pass: the repository is not a game codebase, it is a Claude Code workflow template for structured game development.

So the durable rule is:

1. Use parallel study agents for breadth.
2. Read the repo’s control files yourself for truth.
3. Write the final note only after those two layers agree.

This produces learn artifacts that are both fast and trustworthy.
