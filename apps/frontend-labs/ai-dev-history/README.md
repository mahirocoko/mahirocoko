# AI Dev History

A simple chronological reading page about Mahiro's history of working with AI, from AI Chat and Claude Code through Soul Vibe, OpenCode, Mahiro Code, Agent Halo, and Herdr.

The canonical long-form source is [`../../../docs/ai-reliability/mahiro-ai-dev-history.md`](../../../docs/ai-reliability/mahiro-ai-dev-history.md). `src/content.ts` is the public-safe structured projection used by the UI.

## Run

```bash
pnpm install
pnpm dev
```

Local URL: `http://localhost:4318`

## Verify

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Browser review targets:

- desktop: `1440 × 1000`
- mobile: `390 × 844`
- keyboard focus and readable long-form content
- reduced-motion rendering
- no horizontal overflow or console errors

Technical checks do not imply Mahiro's visual/product acceptance.

## Content boundary

The public-facing projection intentionally excludes client repository names, provider accounts, credential details, private URLs, and sensitive local paths.
