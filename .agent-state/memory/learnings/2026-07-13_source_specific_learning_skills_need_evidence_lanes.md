# Learning: Source-specific skills need evidence lanes, not style doctrine

**Date**: 2026-07-13
**Tags**: codrops, skills, evidence, provenance, frontend-design, research, security, retention

## Lesson

A skill built around one influential source should teach the agent how to study that source, not instruct the agent to imitate it.

For Codrops, the useful unit is not “Codrops style.” It is an evidence chain:

```text
editorial intent
→ observed live behavior
→ matched source mechanism when available
→ license and asset boundary
→ target-project Keep / Adapt / Reject / Prototype decision
```

Different lanes answer different questions:

- Tutorials explain sequence and claimed mechanism.
- Live demos prove visible states and interaction behavior.
- Source repositories prove architecture only after repository, revision, file, and license checks.
- Case Studies explain intent and production trade-offs.
- Webzibition and roundups discover references but do not prove implementation quality.
- Spotlights reveal practice and decision culture.
- Historical examples preserve interaction anatomy while requiring current browser, accessibility, dependency, and license review.

Use explicit evidence statuses: `discovered`, `metadata-checked`, `read`, `observed-live`, `source-inspected`, `license-checked`, `blocked`, `stale`, and `unverifiable`. A corpus size does not grant confidence by itself. Keep a claim-to-evidence matrix and reserve unseen holdouts before promoting durable guidance.

The supporting tooling must respect the same discipline. Default to session-only stdout. Accept only necessary hosts, revalidate redirects, bound retries/time/requests/response size, fail softly on malformed metadata, and do not retain article bodies or demo assets. Browser automation should own arbitrary external demo observation rather than broadening a metadata helper into an unsafe crawler.

Finally, route ownership clearly:

- `studying-codrops` gathers and translates Codrops evidence.
- `frontend-design` owns final product and brand decisions.
- `learn` owns full linked-repository study.
- `deep-research` owns broad multi-source synthesis.
- `uncodixify` owns evidence-triggered generic-AI UI audit.

This boundary lets an agent learn from a strong source without turning every project into that source.
