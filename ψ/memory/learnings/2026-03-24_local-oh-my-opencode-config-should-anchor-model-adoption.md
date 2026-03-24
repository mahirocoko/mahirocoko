# Local oh-my-opencode config should anchor model adoption

When evaluating new model lines for `oh-my-opencode`, do not let generic external comparisons override the learned local operating model. The safe baseline in this toolchain remains `gpt-5.4` for orchestration and `gpt-5.3-codex` for coding-heavy paths because that split is already reflected in the learned repo guidance and the current local profile family.

If a new model such as `gpt-5.4-mini` looks promising, introduce it first in lower-risk or throughput-oriented lanes like `librarian`, `atlas`, `writing`, or `unspecified-low`. Treat profile creation as a constrained experiment: preserve the existing structure, change only the justified lanes, and keep the active profile untouched until the new variant proves itself.
