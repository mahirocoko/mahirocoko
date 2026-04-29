# Lab 04 Page Image Assets

Generated raster UI mockups for the `สมุดเงิน` mobile-first product flow.

Workflow:

- `web-asset-prompts`: each screen was treated as a production UI mockup asset with an explicit web role, ratio, crop safety, and no-logo/no-watermark constraints.
- `imagegen`: each screen was generated as a separate PNG, not as one crowded dashboard image.
- `asset-designer`: files are packaged by surface so home, modal/sheet, ledger, summary, and settings can be reviewed independently.

## Manifest

| filename | role | ratio | format | source strategy | notes |
| --- | --- | --- | --- | --- | --- |
| `mobile-home.png` | mobile home overview | 9:16 | PNG | generated UI mockup | Overview, primary action, recent rows, one reminder only. |
| `mobile-entry-sheet.png` | mobile quick-entry bottom sheet | 9:16 | PNG | generated UI mockup | Modal/sheet state for transaction entry. |
| `mobile-ledger.png` | mobile ledger page | 9:16 | PNG | generated UI mockup | Dedicated transaction list surface. |
| `mobile-summary.png` | mobile summary/reminders page | 9:16 | PNG | generated UI mockup | Category insights, savings, and due reminders. |
| `mobile-settings.png` | mobile settings/export/privacy page | 9:16 | PNG | generated UI mockup | Secondary data and privacy actions. |
| `desktop-home.png` | desktop home overview | 16:9-ish | PNG | generated UI mockup | Wide responsive home without full ledger. |
| `desktop-entry-modal.png` | desktop quick-entry modal | 16:9-ish | PNG | generated UI mockup | Centered modal state over dimmed home. |
| `desktop-ledger.png` | desktop ledger workspace | 16:9-ish | PNG | generated UI mockup | Dedicated table and filtering surface. |
| `desktop-summary.png` | desktop summary/reminders page | 16:9-ish | PNG | generated UI mockup | Practical insights with reminder rail. |
| `desktop-settings.png` | desktop settings/export/privacy page | 16:9-ish | PNG | generated UI mockup | Secondary management actions. |
| `contact-sheet.png` | QA contact sheet | 5x2 grid | PNG | composed from generated assets | Quick visual scan of the whole set. |

## QA Notes

- Assets are visual direction references, not source UI implementation.
- Text fidelity should be checked again if any image is used as final presentation material.
- The flow intentionally keeps the home screen light; detail-heavy work appears on dedicated pages or modal/sheet states.
