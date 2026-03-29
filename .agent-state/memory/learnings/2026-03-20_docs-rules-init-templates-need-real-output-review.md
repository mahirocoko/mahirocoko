# docs-rules-init templates need real output review

Hardening bootstrap documentation templates is much more reliable when the work is driven by a real generated repo output instead of template inspection alone.

In this session, the most valuable changes came after repeatedly generating docs for a small Vite React starter and reviewing where the output still felt generic, inflated, or meta. The templates looked better after the first edits, but the generated files still exposed problems that were easy to miss in isolation: `AGENTS.md` carried meta-template voice, `file-organization.md` kept leaning toward future folder trees, and starter-repo pages still risked sounding larger than the codebase really was.

The pattern is clear: when improving a docs bootstrap skill, use real output as the truth surface. Tighten templates only after checking whether the generated docs read like trustworthy repo guidance. Favor current reality, explicit "not established yet" language, verified commands, and minimal truthful trees over polished but speculative structure.

This keeps the skill aligned with repo reality and removes the subtle AI-doc smell that static template review often misses.
