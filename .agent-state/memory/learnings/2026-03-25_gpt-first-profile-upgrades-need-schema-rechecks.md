# GPT-first profile upgrades need schema rechecks

When upgrading a local OpenCode profile around a fast-moving external tool, start from the latest upstream release boundary first and only then reuse older local profile patterns. Reusing an older profile is efficient, but it can quietly carry forward stale version assumptions.

If the docs and the released schema are close but not perfectly aligned, treat the first generated profile as a practical draft rather than the final source of truth. The correct pattern is: sync the external clone, inspect the release version, create the working profile, then do a schema-specific recheck before promoting it to the default daily setup.
