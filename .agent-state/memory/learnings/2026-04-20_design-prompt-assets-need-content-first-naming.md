# Lesson Learned: Design prompt assets need content-first naming

**Date**: 2026-04-20
**Tags**: #design-prompts #naming #documentation #information-architecture #repo-structure

When a prompt library is primarily about visual direction, layout systems, styling, motion, and presentation behavior, its filenames and docs should reflect that content directly. Naming it after a single consumer context like `opencode` creates unnecessary ambiguity, even if that consumer does use the assets.

The practical rule is simple: prefer content-first naming over integration-first naming unless the artifact is truly consumer-specific. In this session, the structure became much clearer once the docs folder, markdown pages, and JSON assets all converged on `design-*` naming. That reduced conceptual drift and made the documentation easier to trust.

This matters because small naming inaccuracies multiply. They make future readers ask whether the files are generic design assets, OpenCode-only config, generated runtime artifacts, or something else entirely. A cleaner name avoids that tax.
