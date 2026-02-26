# Learning: README Sync Needs Runtime Source-of-Truth Checks

When refreshing documentation in a live app repository, accuracy comes from runtime contracts first, not inherited template docs. The highest-signal order is: verify scripts in `package.json`, verify required env keys from `.env.example`, verify active routes from `app/routes/`, then rewrite README sections to match those facts.

Cross-repo work adds operational risk (wrong cwd, wrong commit target), so the workflow should include explicit directory confirmation before commit/push. Even for docs-only changes, run `typecheck`, tests, and build when README includes executable commands or environment guidance; this validates that documented commands still represent a working system.

Practical pattern:
1. Detect drift by comparing README claims against current repo structure.
2. Rewrite around the product's real identity (not starter template language).
3. Verify with project commands.
4. Commit and push immediately to avoid "done but not shipped" state.
