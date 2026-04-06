# PulseLane

PulseLane is a FE-only sandbox for `maru-realtime`: a live kanban board that stores its state in a single realtime document.

## Stack

- Vite 8
- React 19
- TypeScript
- direct REST + WebSocket calls to `maru-realtime`

## Sandbox Warning

This app is intentionally frontend-only. Your `projectId` and `apiKey` live in the browser.

- use throwaway projects only
- do not use production secrets
- this is for local/demo/sandbox usage only

## Run

```bash
pnpm install
pnpm dev
```

PulseLane is pinned to `http://localhost:4000` in dev because the current `maru-realtime` CORS allowlist accepts `localhost:4000` rather than Vite's default `5173`.

Use `http://localhost:4000` exactly, not `127.0.0.1:4000`.

Optional env vars:

```bash
VITE_MARU_PROJECT_ID=your-project-id
VITE_MARU_API_KEY=mk_your_api_key
VITE_MARU_DOCUMENT_PATH=boards/pulselane-live
```

Without env vars, enter the credentials in the in-app connection sheet.

## Data Model

PulseLane stores one board per document path. Default path:

```text
boards/pulselane-live
```

The document contains:

- board title
- ordered columns
- ordered cards
- `updatedAt` timestamp
- `lastActorId` marker for remote pulse feedback

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm preview
```
