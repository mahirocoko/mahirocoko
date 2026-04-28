# Lesson Learned: Portable skills own their references

**Tags**: skills, portability, frontend-design, asset-workflow, docs

When a project-local skill is expected to leave the repo, external examples and runtime dependencies should be converted into skill-owned resources or explicit placeholders. Runtime prompt data belongs inside the skill bundle if commands depend on it. Large app-local or scraped corpora should not be copied wholesale; reduce them into small, curated, non-canonical excerpts that teach anatomy and constraints without becoming taste canon.

For design skills, keep the durable boundary: `script = scaffolding`, `docs = judgment`, and `agent = synthesis`. Scripts should load bundled assets, validate paths, preserve ordering, and print scaffolds. Markdown resources should carry judgment, examples, and anti-patterns. The recommended portable chain is `frontend-design brief -> uncodixify -> asset-designer -> web-asset-prompts`.
