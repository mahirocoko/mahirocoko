# Lesson Learned — mahiro-skills porting needs doctrine and release alignment

- **Date**: 2026-04-16
- **Tags**: skills, migration, release, docs, testing, agent-state

When porting skills from one repo into another, the main risk is not code loss but doctrine drift. The correct unit of migration is the behavior contract: paths, state model, wrapper wording, install-time transformations, and release-coupled examples/tests. In `mahiro-skills`, even description strings are part of the public surface because install and release tests assert against them. That means a real migration must align implementation, docs, wrappers, version references, and release tests in one pass.

The practical rule is: if a skill changes and the repo is meant to ship immediately afterward, scan release-linked surfaces early. Specifically check `package.json`, `README.md`, `install.sh`, install/release tests, and any wrapper descriptions that the installer copies verbatim. Also prefer repo-root-first `.agent-state` conventions consistently across examples and scripts, because partial path adaptation leaves the repo in an uncanny in-between state.
