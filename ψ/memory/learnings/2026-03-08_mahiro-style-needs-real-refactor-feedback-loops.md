# Mahiro Style Needs Real Refactor Feedback Loops

The cleanest way to build a personal style skill is not to start from abstract principles alone. Start with a real refactor, observe where the code feels wrong, fix it, and then write the skill from those pressures. That process surfaced a concrete Mahiro pattern: route files should orchestrate, not hold every contract and fixture; names should be domain-first; `interface` and `type` should be used deliberately; and constants extraction must preserve the repo's i18n flow rather than “cleaning up” strings into plain blobs.

Another important lesson is that cross-repo doctrine and repo-local doctrine are not the same thing. `AGENTS.md` remains the local source of truth. A `mahiro-style` skill is most useful as a review lens and fallback doctrine, not as a way to override each repository's established conventions. That distinction matters most around i18n and service boundaries, where one repo may already have a strong local pattern and another may not.

Finally, examples matter as much as principles. `Do / Avoid` examples for interfaces, route boundaries, constants plus i18n, services, stores, section order, and export style make the doctrine actionable. Without them, style advice stays too abstract and AI output drifts back toward generic code even when the intentions are correct.
