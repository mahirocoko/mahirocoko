# Whole-product review and typography token ownership

Tags: frontend-design, commerce, typography, ui-review, imagegen, DOVEL, acceptance-scope

## Durable lesson

A rendered UI can pass a targeted audit while still failing as a whole product. Never report a bare “PASS” unless the reviewer prompt and evidence cover the same scope as the human's request.

Use explicit acceptance labels:

- typography regression passed
- interaction flow passed
- asset promotion passed
- whole-product composition passed

Whole-product review should include:

1. full-page desktop and mobile screenshots
2. first-viewport proposition and proof
3. section rhythm and repetition
4. expected product/commerce anatomy
5. modal, search, cart, configuration, focus, and reduced-motion states
6. truthful labels for visual state
7. source-token ownership checks

## Typography rule learned

Font tokens must describe ownership, not broad style vibes.

Bad:

```css
--display: "Arial Narrow", ...;
```

when `--display` is used for logo, headings, products, prices, builder, cart, and footer.

Better:

```css
--logo: "Arial Narrow", ...;
--headline: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
```

Then use `--logo` only on the brand mark and `--headline` everywhere else that needs display hierarchy. After replacing a condensed font, re-check every dependent size, width, weight, tracking, line-height, and responsive wrap. Prove the rule with exact source search and computed-font inspection.

## Skill contribution model

- `frontend-design` supplied the primary product/brand/whole-composition lens.
- `studying-codrops` supplied mechanism-level state-continuity evidence, not the visual style.
- `codex-asset-production`, `web-asset-prompts`, `asset-designer`, and `direct-cli` supplied the asset contract, generation lane, provenance, and QA discipline.
- `playwright-cli` supplied rendered and interaction evidence.
- UI-review agents supplied critique, but their verdict was only as broad as the prompt given to them.

## Reusable trigger

When a human says “review the whole thing again,” do not reuse a narrow acceptance prompt. Start from full-page evidence and define whole-product acceptance before editing.
