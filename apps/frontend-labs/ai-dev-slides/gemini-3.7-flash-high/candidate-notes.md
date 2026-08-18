# Mahiro AI Slide Candidate Notes (Gemini)

## 1. Visual Concept & Design Rationale

**Theme:** *Precision Studio Graphite (สตูดิโอวิศวกรรม AI)*  
**Visual Direction:** An architectural, precision-engineered developer presentation deck designed specifically for high-signal engineering knowledge sharing.

### Core Principles
- **Atmosphere & Palette:** Deep obsidian and slate foundation (`#080A0F`, `#0D1117`, `#161B22`) paired with purposeful accent tokens:
  - **Warm Amber / Gold (`#F59E0B`, `#FBBF24`):** Represents agent cognition, active execution, and current setups.
  - **Electric Cyan (`#38BDF8`, `#7DD3FC`):** Represents bridges, protocols (MCP), and portable skills.
  - **Jade Emerald (`#10B981`, `#34D399`):** Represents verification, test pass states, and positive loops.
  - **Cool Slate & High-Contrast Off-White (`#F1F5F9`, `#CBD5E1`):** Ensures maximum legibility across all Thai text markings and code symbols without eye fatigue.
- **Typography & Thai Text Tuning:** Native font stack (`system-ui`, `-apple-system`, `Roboto`, `"Noto Sans Thai"`, `Thonburi`) paired with crisp monospace (`ui-monospace`, `"JetBrains Mono"`, `"SF Mono"`). Thai text is given generous line heights (`1.55`–`1.65`) and safe bounding boxes to eliminate tone mark clipping (วรรณยุกต์และสระลอย).
- **Stage & Composition:** Built around an authoritative 16:9 stage coordinate space (1440×810) that dynamically scales via CSS variable `--stage-scale` to fit desktop viewports (such as 1440×900) without inner slide scrollbars, content clipping, or awkward letterboxing.
- **Anti-Cliché Discipline:** Zero generic dashboard clutter, zero purple-on-dark glow, no repetitive bento box repetition, and no gradient keyword spam. Each of the 12 slides features a bespoke layout tailored directly to its specific informational structure.

---

## 2. File Inventory

| File | Purpose | Size / Status |
| :--- | :--- | :--- |
| [`index.html`](file:///private/tmp/mahiro-ai-slide-candidates-20260817/gemini/index.html) | Complete HTML markup for all 12 slides, header toolbar, footer progress bar, speaker notes drawer, and overview modal. | ~57 KB · Standalone, 0 CDNs |
| [`styles.css`](file:///private/tmp/mahiro-ai-slide-candidates-20260817/gemini/styles.css) | Custom CSS design system, responsive 16:9 stage scaling, slide-specific grid/matrix layouts, and reduced-motion rules. | ~46 KB · Zero dependencies |
| [`script.js`](file:///private/tmp/mahiro-ai-slide-candidates-20260817/gemini/script.js) | Vanilla JS slide engine handling keyboard navigation, hash routing (`#1`–`#12`), slide drawer, overview grid, and touch gestures. | ~20 KB · Zero dependencies |
| [`candidate-notes.md`](file:///private/tmp/mahiro-ai-slide-candidates-20260817/gemini/candidate-notes.md) | Visual concept, controls documentation, file inventory, and verification report. | Documentation |

---

## 3. Controls & Interaction Guide

### Keyboard Navigation
- **Next Slide:** <kbd>→</kbd> (Arrow Right), <kbd>Space</kbd>, <kbd>PageDown</kbd>, <kbd>L</kbd>, or <kbd>J</kbd>
- **Previous Slide:** <kbd>←</kbd> (Arrow Left), <kbd>PageUp</kbd>, <kbd>H</kbd>, or <kbd>K</kbd>
- **First / Last Slide:** <kbd>Home</kbd> (Slide 1), <kbd>End</kbd> (Slide 12)
- **Speaker Notes Drawer:** <kbd>N</kbd> (Toggles off-screen notes drawer with full speaker script)
- **Slide Overview Grid:** <kbd>O</kbd> (Toggles 12-slide thumbnail modal picker)
- **Fullscreen Mode:** <kbd>F</kbd> (Toggles native browser fullscreen)
- **Close Modal / Drawer:** <kbd>Esc</kbd>

### Mouse & Touch
- **On-Screen Navigation:** Prev / Next buttons in footer.
- **Direct Jump:** Click any progress dot in the footer timeline or any slide in the Grid (<kbd>O</kbd>).
- **Touch / Mobile:** Swipe Left for next slide, Swipe Right for previous slide.
- **URL Synchronization:** URL hash automatically stays in sync with current slide (`#1` to `#12`), supporting browser Back/Forward navigation and direct bookmarking.

---

## 4. Slide-by-Slide Layout Overview

1. **Slide 1 — ผมใช้ AI ทำงานยังไง:** Hero title stage with metadata badges (`Knowledge sharing`, `30–35 นาที + Q&A`), title/subtitle, sequential evolution track ribbon (`AI Chat → Claude Code → OpenCode → Letta Code`), and summary description card.
2. **Slide 2 — เครื่องมือที่ผมใช้ตามลำดับ:** 2-column split with a 6-milestone evolutionary timeline on the left and a structured "Core Taxonomy Equation Box" on the right defining Model vs Tool vs Agent.
3. **Slide 3 — จากก๊อปคำตอบเอง สู่ให้ agent ลงมือใน repo:** Side-by-side comparative architecture contrasting the friction-heavy manual copy-paste chat loop with the autonomous repo execution loop.
4. **Slide 4 — ก่อน Letta ผมลองสร้าง memory layer เอง:** Architectural schematic diagram illustrating `Claude Code ↕ MCP ↕ Memory layer ข้าม session`, paired with 3 key architectural driver cards.
5. **Slide 5 — ทำไมผมย้ายไป OpenCode:** 4-Quadrant modular feature grid highlighting Subscription leverage, Multi-model autonomy, Oh My OpenCode orchestration, and Portable skills.
6. **Slide 6 — Letta Code เป็นตัวหลัก แต่ workflow ไม่ได้ผูกกับตัวเดียว:** Twin-pillar layout distinguishing Letta Code (Stateful Main Agent) from Portable Skills (Universal Procedures), complete with an architectural distinction callout bar regarding Skills vs Mods.
7. **Slide 7 — ผมแบ่งงานให้ agent ยังไง:** High-contrast role matrix table with colored badges and traits across 5 roles: Main/Coordinator, Scout, Writer, Reviewer/Verifier, and Visual Direction.
8. **Slide 8 — หนึ่งงานจริง ผมเริ่มและจบยังไง:** 7-step connected execution pipeline chain (Ground Reality → Scope → Procedure → Roster → Iterate → Human Gate → Memory) with continuous learning feedback loop.
9. **Slide 9 — เปิดหลาย agent พร้อมกัน ผมดูและคุมยังไง:** Dual control interface showcase detailing Herdr (Terminal Control Room) and Agent Halo (Ambient Notch status monitor with simulated status chips).
10. **Slide 10 — Ecosystem ที่ผมใช้จริง:** Comprehensive 6-tier architecture breakdown table connecting Letta Code, Skills, Mods, AGENTS.md, Herdr, and Agent Halo.
11. **Slide 11 — Mahiro Skills ที่ผมพกไปใช้ข้าม agent:** Detailed Mahiro core behavior table (`mahiro-style`, `mahiro-guidance-refine`, `mahiro-docs-rules-init`) + daily workflow chips (`recap`, `rrr`, `direct-cli`, `fable`) and Agy adapter context.
12. **Slide 12 — Q&A:** Conversational hero prompt card with 3 discussion topic pillars for team exchange.

---

## 5. Quality & Compliance Checks Performed

| Check | Result | Verification Detail |
| :--- | :---: | :--- |
| **Exact 12 Slides in Order** | ✅ PASSED | All 12 slides are present in identical order as specified in `source/slide-outline.md`. |
| **Speaker Notes Fidelity** | ✅ PASSED | Exact speaker notes from outline accessible via `N` toggle; hidden from projected slide. |
| **Personal Perspective Preserved** | ✅ PASSED | Mahiro personal narrative framing ("ผมใช้ AI ทำงานยังไง", personal workflow sharing). |
| **"Letta Code" Naming Strictness** | ✅ PASSED | Checked for zero occurrences of "Mahiro Code" on slides. |
| **No "Soul Vibe" on Slides** | ✅ PASSED | Zero occurrences of "Soul Vibe" on slides. |
| **No Direct-Message Quotes** | ✅ PASSED | Zero raw conversation quote blocks rendered on slides. |
| **Slide 4 MCP Memory Framing** | ✅ PASSED | Accurately depicts the pre-Letta MCP memory layer exploration. |
| **Slide 6 Agent / Skill / Mod Clarity** | ✅ PASSED | Explicitly distinguishes main agent, portable skills, and Letta mods. |
| **Zero Network Dependencies** | ✅ PASSED | 100% self-contained HTML/CSS/JS with zero CDNs, web fonts, or analytics. |
| **16:9 Stage Scaling (1440×900)** | ✅ PASSED | Dynamic viewport calculation guarantees zero clipping or inner slide scrolling. |
| **Keyboard & A11y Standards** | ✅ PASSED | Full keyboard navigation, visible focus indicators, ARIA roles, and `prefers-reduced-motion`. |
| **Source Files Preserved** | ✅ PASSED | `source/slide-outline.md`, `source/history.md`, and `source/talk-notes.md` untouched. |
