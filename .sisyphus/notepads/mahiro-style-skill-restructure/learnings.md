# 2026-03-08 - Task 1 inventory/crosswalk learnings

- Current skill tree has 20 markdown files: 2 root docs, 8 `resources/*`, 10 `examples/*`.
- Split-source behavior is active and hard-linked from entry docs: `SKILL.md`, `README.md`, and `resources/README.md` all route to `examples/` and/or `resources/guide.md`.
- `examples/*` currently carries most concrete contrastive guidance (`Do`/`Avoid`/`Why` with code snippets); canonical prose in `resources/*` is higher-level.
- Crosswalk posture that preserves history and retrieval quality: keep hub files (`SKILL.md`, `README.md`) but rewrite; retire `examples/README.md`; treat `resources/guide.md` as compatibility shim during migration.
- `services-state.md` should split ownership into separate service and store/state canonical pages to avoid mixed topic ownership in the future IA.
- Grounding posture remains aligned with agreed context: thin-hub shape inspired by `eizypay-fe`, doctrine grounding from `jit-flow` and `haabiz-hrm-fe`, and `AGENTS.md`-first precedence preserved.
- Task 2 locks the canonical split as `Foundations` for repo-reading doctrine and `Patterns` for query-shaped implementation domains.
- Naming guidance fits retrieval better as `patterns/naming.md` than as a subsection of `foundations/code-style.md`, because most naming prompts ask about how to name code artifacts in context, not about formatting mechanics.
- Project structure should stay foundational, but route boundaries and shared UI boundaries need separate pattern pages so structure guidance does not become another mixed catch-all document.
- Provider placement is best owned by `patterns/stores-state.md`, because provider scope follows state lifetime and feature scope more than service transport concerns.

# 2026-03-08 - Task 3 precedence doctrine learnings

- The missing retrieval gap was not just "`AGENTS.md` first". The doctrine also needed the middle layers spelled out: other repo-local instruction files, then established repo patterns, then Mahiro fallback doctrine.
- Conflict resolution needs both order and method. The useful sequence is explicit local docs first, inferred repo patterns second, fallback Mahiro shape last.
- The hybrid posture only stays stable when partial local doctrine can hold the boundary while Mahiro fallback fills the undecided implementation details.
- Future canonical docs should avoid soft wording like "read `AGENTS.md` first" and instead state the full winner order directly.
- Task 4 verification spec now defines seven explicit check classes: structure, schema/heading, precedence completeness, stale references, links, smoke retrieval, and intentional failure-mode.
- Smoke retrieval checks are binary by design: each prompt maps to an exact expected winner `{doc path, heading}`, including precedence and thick-route edge prompts.
- Verification design explicitly encodes the environment constraint that `.md`/`.txt` validation is content-based (Read/Grep), not LSP-based.
- Stale-source protection is formalized around the known risk cluster: `examples/`, `resources/guide.md`, and `resources/README.md`.

# 2026-03-08 - Task 5 hub rewrite learnings

- `SKILL.md` works better as a routing page when it names ownership directly, not when it re-explains doctrine already owned by canonical topic docs.
- Surfacing the full four-level precedence order in the hub closes the old gap where `AGENTS.md` was named but other repo-local instruction files were invisible.
- Keeping `structure` and `boundaries` lenses multi-target is useful because the IA now splits project layout, route thickness, and shared UI seams into separate owners.
- The thin-hub posture is easier to preserve when the document map is grouped by `foundations/` and `patterns/` rather than by legacy `resources/` and `examples/` origins.

# 2026-03-08 - Task 6 README rewrite learnings

- `README.md` is strongest as a human overview when it explains the skill's role, non-goals, and precedence posture without trying to summarize every doctrine page.
- Naming the four-level winner order directly in the README keeps the hybrid contract visible even for readers who never open `foundations/precedence.md` first.
- Replacing `examples/README.md` guidance with a `foundations/` plus `patterns/` map makes the new IA legible without creating another monolithic hub.

# 2026-03-08 - Task 7 Foundations rewrite learnings

- The Foundations layer reads cleanest when `README.md` stays a directory router and the four doctrine pages carry the schema-bearing canonical guidance.
- `foundations/precedence.md` needs the exact four-level winner order stated both as prose and as an explicit ordered list, or the hybrid posture becomes fuzzy again.
- `foundations/project-structure.md` stays sharper when it owns repo and feature layout only, while concrete route and shared UI boundary mechanics remain deferred to `patterns/`.
- `foundations/code-style.md` is more retrieval-friendly when it focuses on imports, TypeScript surface shape, section order, export posture, and formatter alignment, while leaving naming to `patterns/naming.md`.
- Grounding the doctrine in `eizypay-fe`, `jit-flow`, and `haabiz-hrm-fe` works best when the docs capture the shared pattern of local-doctrine-first ownership rather than copying stack-specific rules verbatim.

# 2026-03-08 - Task 8 review checklist rewrite learnings

- `foundations/review-checklist.md` works better as an operational diff lens when it names the two drift classes directly: repo-rule drift and Mahiro-shape drift.
- The checklist becomes more usable when the four-level precedence order is embedded into the review flow instead of assumed as background knowledge.
- Anti-pattern guidance is stronger when folded into concrete review prompts about route thickness, Lingui-safe constants extraction, naming/contracts, and shared UI leakage rather than left as a separate primary doc.

# 2026-03-08 - Task 10 constants+i18n doctrine learnings

- `patterns/constants-i18n.md` needs to own the full extraction rule, not just a generic warning about Lingui safety, because `msg` versus `t` versus `<Trans>` confusion is a retrieval problem, not a small API note.
- The clearest stable rule from the HRM console refactor is descriptor at definition, translation at render: extracted config stores `msg` descriptors, and the component or layout that renders UI text performs the final `i18n._(...)`, `t(...)`, or `<Trans>` call.
- Keeping component-local copy in React must stay explicit, or agents will over-extract text just to shorten files and weaken JSX-local readability.
- HRM console grounding is useful because it shows both sides of the boundary in one feature: shared route and sidebar metadata extracted into constants, while screen-specific copy still lives beside JSX flow.

# 2026-03-08 - Task 9 pattern rewrite learnings

- The Pattern layer reads cleanest when each page owns one implementation decision family and names the adjacent pages it does not own.
- `route-boundaries.md`, `shared-ui-boundaries.md`, and `stores-state.md` need especially sharp ownership lines or they collapse back into a mixed structure doc.
- Grounding the pattern pages in `jit-flow`, `haabiz-hrm-fe`, and `eizypay-fe` works best when the docs distill shared ownership moves instead of copying stack-specific syntax or library recipes.
- `best-practices.md` stays useful only as a short synthesis page. Once it starts reteaching services, hooks, or naming in full, retrieval quality drops.

# 2026-03-08 - Canonical path casing correction

- Canonical directory names are now kebab-case lowercase: `foundations/` and `patterns/`.
- Any earlier uppercase canonical path references (`Foundations/`, `Patterns/`) are superseded by this correction and should not be used for active guidance.

# 2026-03-09 - Task 11 embedded examples learnings

- Canonical pages become retrieval-ready when `## Examples` and `## Anti-Examples` carry the concrete contrast inline, not just a high-level rule plus a pointer to `examples/*`.
- `foundations/code-style.md` needs to own the practical `interface` versus `type`, section-order, and export-posture contrasts directly, because those questions are often asked without opening any legacy example page.
- Pattern pages read more cleanly when each one embeds one short positive snippet and one short negative snippet tied to its ownership boundary, such as route thickness, shared UI leakage, service transport, store sprawl, and naming drift.

# 2026-03-09 - Task 12 guide retirement learnings

- `resources/guide.md` should remain present only as a compatibility shim; replacing long doctrine content with a short redirect eliminates dual-source ambiguity.
- Retirement messaging is clearest when the shim declares deprecated status in the first lines and immediately lists canonical successors under `foundations/` and `patterns/`.
- Keeping the locked four-level precedence order inside the shim prevents old links from reintroducing the older, incomplete precedence posture.
- `resources/README.md` must label `guide.md` as deprecated compatibility redirect to avoid accidental promotion back to a primary source.

# 2026-03-09 - Task 13 retired examples tree learnings

- Converting each `examples/*.md` page into a short deprecation redirect preserves file history while removing split-source behavior.
- Retrieval cleanliness is easiest to prove with one strict stale-reference check: `rtk grep -n "examples/" .agents/skills/mahiro-style` should only hit compatibility-marked text inside `examples/README.md`.
- Explicit `Canonical owner:` lines in every legacy example file make crosswalk compliance auditable and keep successor mapping unambiguous for future cleanup tasks.

# 2026-03-09 - Task 14 regression guard learnings

- The stale-reference failure mode is easy to prove deterministically by adding one required-reading line to `SKILL.md`, capturing the exact offending line from V-04, then restoring the file and confirming the original SHA-256 returns.
- The aggregate verification log should record the pinned local link-check resolution rules and the V-07 restore hash so reviewer agents can reuse the evidence without rerunning the temporary break.

# 2026-03-09 - Final QA compliance audit learning

- Final plan-compliance approval was still auditable without a `.sisyphus/plans/*.md` file in the worktree because the F1 task payload, Task 4 verification spec, and Task 14 aggregate evidence described the same binary contract.

# 2026-03-09 - Final Wave F4 legacy resources redirect fix learnings

- Converting all remaining `resources/*.md` leaf pages to short deprecation redirects removes the last hidden fallback doctrine surface under `resources/`.
- The most auditable redirect shape is: explicit deprecated status plus explicit `Canonical owner:` path list, with no remaining guidance bullets.
- `resources/README.md` should describe the whole tree as compatibility-only so leaf redirects are interpreted correctly during retrieval.
