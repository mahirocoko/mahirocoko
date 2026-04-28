# Motionsites Scraping

Conservative Playwright scraper for public `motionsites.ai` gallery items.

It copies publicly available prompt text from free prompt cards, saves public prompt thumbnails when the card exposes a direct image URL, and downloads background media only when the card exposes a visible `Copy URL` action and does not show premium/upgrade markers.

## Run

```bash
pnpm install
pnpm run dry-run
pnpm run scrape -- --limit 25
```

Useful flags:

```bash
pnpm run scrape -- --dry-run --limit 10
pnpm run scrape -- --headful --limit 5
pnpm run scrape -- --out output --timeout-ms 15000 --delay-ms 250
```

## Output

- `output/prompts/*.txt` — copied prompt text
- `output/prompts-thumbnails/*` — downloaded public thumbnail/preview images for prompt cards
- `output/backgrounds/*` — downloaded non-premium background media
- `output/manifest.jsonl` — one JSON record per saved or skipped public item

Dry-run mode still writes the manifest and reports resolved prompt/background paths and thumbnail URLs, but it does not write media files.

## Safety rules

- Does not log in.
- Does not bypass paywalls or premium gates.
- Skips cards with `Premium`, `Pro`, `Locked`, `Upgrade`, or `Unlimited` markers.
- Skips cards that link to `/unlimited`.
- Skips copied URLs that are not direct public `https` image/video assets.
- Skips thumbnail URLs that are not direct public `https` image assets.
