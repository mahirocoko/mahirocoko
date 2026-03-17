# Blue Ledger

Simple personal income and expense tracker built with `Vite + React + TypeScript`.

## What It Includes

- one-screen dashboard
- balance, income, and expense summary cards
- quick-add form with inline validation
- recent activity capped to the latest `8` entries
- learned category suggestions from saved entries
- browser persistence with `localStorage`
- Thai-first copy with selected English finance labels

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## App Structure

- `src/App.tsx`
  composes the screen
- `src/features/ledger/components/`
  presentational UI for the ledger screen
- `src/features/ledger/storage.ts`
  local persistence boundary
- `src/features/ledger/selectors.ts`
  pure derived-state helpers
- `src/features/ledger/constants.ts`
  storage key and starter categories

## Notes

- all data lives only in the current browser
- corrupted local data is reset safely to an empty state
- the app is intended as `v1`, so there is no edit/delete flow or backend sync yet
