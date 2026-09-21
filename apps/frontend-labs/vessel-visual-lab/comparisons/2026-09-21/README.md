# Cursor Kimi vs Grok — Vessel Blind A/B

Status: **preserved first-shot comparison; no candidate promoted**

This archive preserves two independent Cursor CLI implementations created from
the same seed workspace, raw references, clean landscape asset, and exact prompt.
Neither candidate could inspect the other candidate or the earlier Vessel
implementation before writing.

## Candidate mapping

| Blind label | Executor | Exact model |
| --- | --- | --- |
| Candidate A | Cursor CLI | `kimi-k3-max` |
| Candidate B | Cursor CLI | `cursor-grok-4.6-high` |

Shared prompt SHA-256:
`4a7a21fc463833deb42461a7ad5ad4265de89f4540e07710c1ce54409fd0fbd2`

Input hashes were identical in both workspaces:

- Website reference: `9900fb1742de05a68cc14ce602771d043fc5e4cbbd53fb5199d5f7135e7c5eaf`
- App reference: `1fe68d51c9c03fae90ce9d26397754e1736367c7b0677834ec7ef7063fbf9ff1`
- Landscape asset: `e5ecf24e1aea11b25a31cdb36875427d9117ef7384a96d377849c205003fa72c`

## Human verdict

Mahiro's blind review on 2026-09-21:

- Website: tie
- Mac App: tie
- Overall: no winner selected
- Strong shared result: both candidates implemented a real draggable comparison
  whose source and derivative layers have a visibly meaningful difference.

This last point corrected the earlier main Vessel implementation. A divider that
moves over effectively identical pixels is not a comparison, even when pointer,
keyboard, and ARIA mechanics pass.

## Technical evidence

Both raw candidates independently passed typecheck, tests, lint, and production
build. Fresh serialized browser QA found:

- Candidate A / Kimi: clean console and interactions; one non-blocking 10px
  desktop App vertical overflow.
- Candidate B / Grok: stronger literal Website-reference anatomy, plus
  non-blocking App telemetry clipping, missing favicon, form-control warnings,
  and a primary App action outside the initial mobile pan viewport.

These findings establish only this exact first-shot trial. They are not universal
model rankings. See `evidence/browser-qa-report.md` for the dated detailed record.

## Archive boundaries

- `shared-prompt.md` is the exact prompt sent to both lanes.
- `cursor-kimi/` and `cursor-grok/` preserve the raw source and each model's
  `REPORT.md`; Main did not polish candidate presentation code.
- Reference images and the shared landscape are repository-relative symlinks to
  the canonical Vessel copies, avoiding duplicate binaries.
- Browser screenshots were transient QA evidence and are intentionally omitted.
- Candidate URLs and `/tmp` paths in the browser report are historical only.

Run either candidate from its directory with the repository's pinned pnpm:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm dev
```

