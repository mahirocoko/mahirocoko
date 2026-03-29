# Lesson Learned: RTK scope docs-only fixes can be enough

When RTK confusion is mostly about command scope and mental model, the right fix is not always a hook rewrite or a tooling refactor. A small documentation correction can be enough if it clearly teaches two separate rules: use `rtk` directly for RTK-native commands like `rtk gain`, `rtk learn`, or `rtk rewrite`, and preserve the repo's original command shape for normal development commands before prepending `rtk`, such as `pnpm lint -> rtk pnpm lint` or `git status -> rtk git status`.

The important pattern is proportionality. Earlier learnings about hook/runtime alignment still matter, but they should not force a deeper intervention when the user's real pain is only that the local guidance is underspecified. If the issue is mental-model drift, fix the teaching surface first and stop when the user says the result is already good enough.
