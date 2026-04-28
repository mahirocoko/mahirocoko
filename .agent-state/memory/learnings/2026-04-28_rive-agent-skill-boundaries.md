---
tags:
  - rive
  - skills
  - ai-agent
  - documentation
  - guardrails
---

# Rive agent skills need explicit capability boundaries

When building an AI-agent skill around Rive, separate three capabilities:

1. **Runtime Integration** — app code for loading `.riv`, choosing WebGL2/Canvas/native runtimes, wiring data binding, and troubleshooting rendering.
2. **Rive Scripting** — Luau scripts and protocols that a human can run or attach inside the Rive Editor.
3. **Editor Handoff** — precise human steps for artboards, animations, view models, exports, and validation.

Rive's `llms.txt` is valuable because it gives agents an official map of editor, runtime, data binding, state machine, and scripting docs. It should not be treated as proof that an external agent can control the Rive Editor or edit `.riv` binaries directly. Unless a verified editor/file automation API exists, the skill should phrase visual creation as handoff steps or Rive-internal AI Agent usage, not as completed external automation.
