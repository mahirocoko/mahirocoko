# mahiro docs skill needs restraint after bootstrap

Once a docs initializer successfully establishes a baseline, the next important behavior is restraint.

In this session, `mahiro-docs-rules-init` was verified against an existing Vite React starter that already had its generated docs family in place. The strongest signal was not that the skill rewrote many files. The strongest signal was that it inspected the repo, recognized the baseline was already present, and made only two narrow corrections where the docs were overstating certainty: import ordering and formatting examples. That proved the skill was starting to distinguish between bootstrap work and sync-like refinement.

The pattern is worth preserving: a repo-aware docs skill should expand confidently only when the repo lacks structure, then become conservative once the baseline exists. After bootstrap, small truthful edits are better than broad regeneration. This keeps the docs trustworthy, reduces churn, and prevents a house-style skill from acting like a blind template engine.
