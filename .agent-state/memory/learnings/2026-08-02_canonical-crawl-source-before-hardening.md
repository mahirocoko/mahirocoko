# Canonical crawl source before hardening

**Tags**: crawling, scraping, architecture, overengineering, source-of-truth, verification, ownership

When building a crawler, identify and falsify the canonical data source before adding retries, robots layers, persistence, image validation, or importer integration. Start with the cheapest count invariant: compare SSR/API/bundle extraction against the catalog's advertised total. If SSR returns only a visible page subset, inspect loaded bundles or data endpoints before committing to per-detail crawling.

For minified catalog object literals, field-order-dependent regex is brittle. Prefer bounded brace-balanced extraction, then parse/filter/deduplicate records using required semantic fields. Treat detail-page requests as optional enrichment rather than the primary catalog source when the bundle already owns slug, title, category, website, screenshot paths, and flags.

Safety work is still required, but sequence it after the source and output contracts are proven. A hardened implementation around the wrong source is overengineering, not robustness. Validate a complete representative slice or total-count invariant before handoff so the human does not have to report heterogeneous record failures one by one.

Ownership is part of correctness: if a relevant untracked directory belongs to another active lane, do not edit or adapt it without explicit permission. Read its method only when asked, preserve independent authorship, and keep implementation scopes separate.
