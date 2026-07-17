# รอยเมือง — Thai Font Selection

Selected pair: **Maitree + Anuphan Variable**

## Compared pairs

| Option | Headline | Body | Decision |
| --- | --- | --- | --- |
| A | Noto Serif Thai Variable | Noto Sans Thai Looped Variable | Safe readability fallback; not selected because the issue voice felt closer to a general editorial default |
| B | Pridi | IBM Plex Sans Thai Looped | Strong print authority; retain only as a possible special-cover accent because the main system became heavy and poster-like on mobile |
| C | Maitree | Anuphan Variable | Selected for a recognizably Thai contemporary journal voice, warmer long-form texture, and intentional mobile headline rhythm without nostalgic craft styling |

`Not selected` does not mean rejected universally. A remains the fallback if later long-form evidence exposes a readability issue. B may be reconsidered for a bounded cover treatment, but not as the article system.

## Evidence

- Matched content and hierarchy at 1440×1000 for A/B/C
- Matched mobile content at 390×844 for A/B/C
- Thai issue title, deck, body paragraph, pull quote, metadata, and issue spine
- Independent UI review recommended C; Mahiro selected C after reviewing the live specimen

Rendered evidence: [`docs/qa/font-selection/`](./qa/font-selection/)

## Production rule

Only Maitree and Anuphan packages remain in the production dependency graph. The comparison implementation is removed; this document and its screenshots preserve the decision trail.
