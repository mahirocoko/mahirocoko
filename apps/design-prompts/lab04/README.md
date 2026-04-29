# lab04

This lab captures a Thai-localized personal income/expense console mockup inspired by Wise's bold fintech design system.

Files:

- `prompt.txt` — compact standalone prompt for direct HTML + CSS generation
- `full-page-handoff.md` — page-specific handoff for `frontend-design compose`
- `index.html` — reference static mockup with embedded CSS, no framework or external dependency

Goal:

Create a practical console for Thai people tracking household income, expenses, bills, debt, and savings. The UI borrows Wise's off-white canvas, near-black text, lime-green CTA accent, thick display typography, pill buttons, and ring borders while staying readable, accessible, and grounded for Thai personal-finance use.

Pick a path:

- **Standalone** — paste or run against `prompt.txt` when you want plain HTML + CSS only.
- **Compose** — use the command below when you want the repo prompt-library baseline plus this lab's structure and Thai finance framing.

Run the compose command from the repo root when you want the prompt-library baseline plus this lab's handoff:

```bash
bun .agents/skills/frontend-design/scripts/main.ts compose \
  --general landing-page \
  --direction design-details \
  --direction remix-colors \
  --direction explore-typography \
  --prompt clean-minimal-beige-light-mode \
  --prompt container-lines \
  --prompt number-details \
  --handoff apps/design-prompts/lab04/full-page-handoff.md
```

Notes:

- this folder is sandbox input only, not canonical prompt truth
- canonical prompt assets remain in `docs/design-prompts/`
- Thai copy should stay plain, human, and practical
- income/expense states must use text plus color, never color alone
- Wise-inspired treatments are allowed here because the user explicitly supplied the design system
