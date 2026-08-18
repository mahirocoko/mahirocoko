# Asset provenance

> **Current usage note — 18 August 2026.** The active 9-slide workflow deck loads only `filament-memory.png`, `filament.svg`, and `grain.svg`. Claude, OpenCode, Letta, Oh My OpenAgent, and notch assets below are retained as historical evidence for the superseded tool-history candidate; they are not loaded by current projected slides.

Retrieved: 18 August 2026  
Use: internal knowledge-sharing slides. Product marks identify the tools in a personal timeline. They are trademarks of their owners and are not modified except for layout sizing/cropping noted below.

## Official product marks

### Claude (Anthropic)

| Field | Value |
| --- | --- |
| Source URL | https://claude.com/favicon.svg |
| Owner | Anthropic, PBC |
| Retrieved | 2026-08-18 |
| Original filename | favicon.svg (served from claude.com) |
| Local filename | `assets/claude-mark.svg` |
| SHA-256 | `b150888bc7257af83e3b85d3c2be4294f88986026f8168f6c12fc1fde6697350` |
| License / trademark | Official first-party SVG from Anthropic’s Claude site. Claude and Anthropic marks are trademarks of Anthropic. Used here for identification only. |
| Note | The 32×32 PNG favicon was also inspected but was too small for the stage and was not retained. Brandfolder press kit was not downloaded because the first-party SVG on claude.com resolved directly. |

### OpenCode

| Field | Value |
| --- | --- |
| Source URL | https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/console/app/src/asset/brand/opencode-logo-light-square.svg |
| Canonical brand page | https://opencode.ai/brand |
| Owner | OpenCode / anomalyco |
| Retrieved | 2026-08-18 |
| Original filename | `opencode-logo-light-square.svg` |
| Local filename | `assets/opencode-mark.svg` |
| SHA-256 | `b1c48d82ebd304eab820658387642bcf4c9b8350d6860894d0fe21ddca25ef3f` |
| License / trademark | First-party brand asset from the official OpenCode repo (MIT-licensed project; brand marks remain the owner’s trademarks). Light-square variant chosen for the paper Slide 1 ground. Used for identification only. |

Dark-slide variant:

| Field | Value |
| --- | --- |
| Source URL | https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/console/app/src/asset/brand/opencode-logo-dark-square.svg |
| Local filename | `assets/opencode-mark-dark.svg` |
| SHA-256 | `d6a0e3b8a295f413543f41cb73957e670351b5cb088c8d9dbd186b9e9d633cca` |
| Usage | Official dark-background square variant used on Slide 5 without a custom frame or padding. |

### Letta

| Field | Value |
| --- | --- |
| Source URL | https://www.letta.com/ |
| Owner | Letta |
| Retrieved | 2026-08-18 |
| Original filename | inline homepage wordmark SVG (`<a class="wordmark">`, `viewBox="0 0 1218 360"`, `aria-label="Letta"`) |
| Local filename | `assets/letta-mark.svg` (geometric mark only: first two paths, `viewBox="0 0 360 360"`). Full first-party wordmark preserved at `assets/source/letta-wordmark.svg`. |
| SHA-256 (mark) | `9ad7cbd40e290643c3c8736bfb1838c2f8d95124197832a947b5734f4e63cd82` |
| License / trademark | First-party SVG from Letta’s homepage. Letta is a trademark of Letta. Fill is `currentColor`; Slide 1 sets it to ink. Used for identification only. |

### AI Chat

No first-party product logo. Rendered as semantic text `AI Chat`.

### Oh My OpenAgent

| Field | Value |
| --- | --- |
| Source URL | https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/assets/omo-icon-light.svg |
| Canonical repository | https://github.com/code-yeongyu/oh-my-openagent |
| Owner | code-yeongyu / Oh My OpenAgent |
| Retrieved | 2026-08-18 |
| Local filename | `assets/omo-icon-light.svg` |
| SHA-256 | `0cb99c9fc750827f2c35ae99659de6d40e03ae7b1d79d3c29f1002017fe33b0a` |
| License / trademark | First-party SVG used by the official repository README. The repository is SUL-1.0 licensed; the mark is used here for identification only. |
| Historical note | The harness used during this part of the timeline was named Oh My OpenCode. The project is now named Oh My OpenAgent. |

## Gemini-generated supporting image

| Field | Value |
| --- | --- |
| Role | Slide 1 right-field supporting photograph |
| Local filename | `assets/filament-memory.png` (promoted after inspection) |
| Original provider file | `assets/source/filament-memory-provider.jpg` |
| SHA-256 (PNG) | `d7155e0c57afeb14a399054fae26c660ffd796e4dce3a2076098c4eac96762a2` |
| Size | 896 × 1200, 1,546,088 bytes |
| Provider | Google Antigravity CLI (`agy`) |
| Model (launch + pane) | `gemini-3.7-flash-high` / visible label `Gemini 3.7 Flash (High)` |
| Tool | Agy `GenerateImage` → Imagen (`default_api:generate_image`) |
| Conversation / session | `fd71c8e7-b58e-4d73-badb-62bf63faaf11` |
| Timestamp | 2026-08-18T10:35:10+07:00 |
| Exact prompt | `assets/filament-memory.prompt.txt` and `assets/filament-memory.receipt.md` |
| Lane | Herdr tab `direct-slide1-gemini` (`w2S:tF`, pane `w2S:pM`, agent `dd862e441ddeafeada`), closed after collection |
| Inspection | Abstract copper/ink filaments on bone paper; left third calm; no embedded text, letters, numbers, or product marks |

## Deck-authored diagrams (not third-party logos)

| Local filename | Role |
| --- | --- |
| `assets/filament.svg` | Left-edge copper thread (Context Filament) |
| `assets/grain.svg` | Paper/ink grain |
| `assets/notch.svg` | Agent Halo notch diagram |
