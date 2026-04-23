# lab02

This lab captures an eco-car landing-page prompt package for local design and HTML generation experiments.

Files:

- `prompt.txt` — compact standalone prompt for direct HTML + CSS generation (no compose stack)
- `full-page-handoff.md` — page-specific handoff for `frontend-design compose`; inherits the canonical output rules from `docs/design-prompts` (for example the shared HTML/Tailwind baseline), and does not swap that contract to plain CSS
- `index.html` — reference landing page (plain HTML + embedded CSS) aligned with this lab’s prompt and handoff

Goal:

Generate a premium electric vehicle landing page that feels editorial, performance-forward, and sustainability-aware without drifting into generic greenwashing.

Pick a path:

- **Standalone** — paste or run against `prompt.txt` when you want plain HTML + CSS only.
- **Compose** — use the command below when you want the repo prompt library baseline plus this lab’s structure and eco-car framing.

Run the compose command from the repo root (or keep the handoff path repo-relative; the script also resolves `--handoff` relative to the current working directory):

```bash
bun .agents/skills/frontend-design/scripts/main.ts compose \
  --general landing-page \
  --direction explore-typography \
  --direction remix-colors \
  --prompt image-first-grid-layout \
  --prompt clean-minimal-beige-light-mode \
  --prompt editorial-tech \
  --prompt number-details \
  --handoff apps/design-prompts/lab02/full-page-handoff.md
```

Notes:

- this folder is sandbox input only, not canonical prompt truth
- canonical prompt assets remain in `docs/design-prompts/`
- sustainability claims in this lab should stay specific, qualified, and evidence-led
- `full-page-handoff.md` adds page intent and sections; it does not override upstream output-format rules from the composed stack—see the opening of that file
