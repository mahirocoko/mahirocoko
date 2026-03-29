---
title: No-OMO profiles should disable the whole agent set
date: 2026-03-18
source: rrr: mahirocoko
tags:
  - opencode
  - oh-my-openagent
  - profiles
  - config
  - agents
---

# No-OMO profiles should disable the whole agent set

When creating a dedicated profile to turn off the Oh My OpenAgent layer, the safest pattern is to start from the documented bypass mechanism and then explicitly disable the full agent roster.

In practice, this means:

- Use `sisyphus_agent.disabled: true` as the primary documented switch to restore the original build-plan behavior.
- Add a complete `disabled_agents` list instead of assuming omission is enough.
- Match that list against the actual locally configured agents, including entries that are easy to forget like `hephaestus`.
- Keep the profile minimal unless there is a proven need to also disable hooks, commands, or skills.

The key pattern is simple: a trustworthy no-OMO profile is explicit and exhaustive about agent shutdown, not merely lighter than the default OMO profile.
