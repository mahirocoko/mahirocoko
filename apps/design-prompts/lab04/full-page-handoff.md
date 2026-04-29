# Mobile App Flow Design Handoff

Use this file as a page-specific handoff layered on top of the existing `frontend-design compose` baseline.

Do not override the upstream output contract from the composed prompt stack. This file defines mobile flow structure, Thai-localized content, and Wise-inspired visual direction for this lab.

Compact standalone brief: see `prompt.txt` in this folder.

## Handoff Scope

- Build a mobile-first app flow for Thai personal income and expense tracking.
- Keep it practical for household budgeting, not a bank, exchange, trading, or enterprise finance app.
- Output should be mobile-first, responsive, semantic, accessible, and readable in Thai.
- Prefer plain HTML + embedded CSS for the standalone reference.
- Avoid fake security seals, decorative chart filler, glassmorphism, dark SaaS styling, oversized dashboard hero blocks, and generic KPI-card-first layouts.
- The phone layout is the primary experience. Desktop is an expansion of the mobile reading order, not the source layout squeezed down.
- Do not place every feature on the home screen. Use focused screens, dialogs, bottom sheets, or modal-like surfaces for secondary tasks.

## Core Product Framing

Suggested product name: `สมุดเงิน`

Suggested page title: `คอนโซลรายรับรายจ่าย`

Audience:

- Thai users tracking monthly household spending
- people managing salary, side income, bills, debt installments, savings, and family support
- users who want clarity without financial jargon

Product promise:

- show what came in, what went out, and what remains this month
- make quick entry obvious
- support Thai category names, Baht amounts, and Buddhist Era dates
- state clearly when data is sample/local and not connected to a bank

## Wise-Inspired Visual System

Use the user's Wise-inspired design system as the primary reference.

### Palette

- canvas: warm off-white `#f7f5ef` or white
- text: near black `#0e0f0c`
- accent / primary CTA: Wise Green `#9fe870`
- CTA text: dark green `#163300`
- mint surface: `#e2f6d5`
- secondary text: warm dark `#454745` and gray `#868685`
- danger/expense: restrained red `#d03238`
- positive/income: `#054d28`
- borders/rings: `rgba(14,15,12,0.12)`

Do not use the lime green as a large page background. Keep it for CTAs, small accents, and selected summary strips.

### Typography

- Use `Wise Sans` when available, falling back to Inter/system sans.
- Display headings may use weight 900, but Thai readability and normal product hierarchy win over pure billboard density.
- Body/UI text should be semibold enough to feel confident, but Thai paragraphs need generous line-height.
- Enable `font-feature-settings: "calt" 1` on text.
- Avoid all-caps styling and tight tracking for Thai.
- Favor comfortable mobile reading: clear 16px-ish body text, fewer simultaneous panels, and enough vertical rhythm that values and labels do not compete.

### Components and Flow Surfaces

- Buttons: Wise Green primary, dark green text, normal 8–12px radius, color/border hover states only.
- Cards/containers: 8–12px radius, thin border, minimal shadow.
- Ledger: mobile list rows first; only use a full table on wider screens. Always right-align numbers and keep Thai labels readable.
- Forms: real labels, clear focus state, no floating labels.
- Badges: use text labels such as `รายรับ`, `รายจ่าย`, `กำลังจะถึง`, not color alone.
- Dialogs/bottom sheets: use for quick entry, filters, export/privacy actions, and other contextual tasks that should not live permanently on home.

## Information Architecture

Build the app as a mobile-first flow with these focused surfaces:

1. **Home overview**
   - product name `สมุดเงิน`
   - current month `เมษายน 2569`
   - status copy: `ข้อมูลตัวอย่าง — ไม่เชื่อมต่อบัญชีธนาคาร`
   - primary action `บันทึกรายการ`
   - remaining balance as the main focal point
   - income, expenses, and savings goal progress as compact supporting items
   - only a few recent rows and the next important reminder
   - use Baht amounts such as `฿18,450.00`

2. **Quick entry dialog / bottom sheet**
   - type selector: income / expense
   - amount, category, note, date
   - Thai categories: food, travel, utilities, phone/internet, family, debt, savings

3. **Ledger screen**
   - mobile list by default; table layout only from wider breakpoints
   - date, type, category, note, amount
   - include Thai Buddhist Era dates such as `29 เม.ย. 2569`
   - row text must distinguish income/expense with words plus signs
   - treat the ledger as the primary working surface of the console

4. **Summary screen**
   - practical rows, not decorative charts only
   - include percentage plus amount: `อาหาร/เครื่องดื่ม ฿4,250 · 32%`
   - include savings progress and monthly category insight

5. **Reminder/settings surfaces**
   - upcoming bills
   - debt installment reminder
   - savings target
   - backup/export/privacy actions

## Accessibility and Thai Localization

- Use `lang="th"`.
- Use semantic headings and landmarks.
- Include a skip link.
- Use visible focus outlines.
- Keep touch targets comfortable.
- Use Arabic numerals by default for legibility.
- Pair color with icons/text/symbols.
- Provide chart/table text equivalents.
- Keep Thai copy short and plain.
- Avoid aggressive truncation; Thai text needs room.

## Uncodixify Guardrails

- No glass panels, glow, dark fintech cosplay, generic startup copy, or decorative metric dashboards.
- No fake charts that exist only to fill space.
- No repeated nested panels with arbitrary labels.
- No security claims beyond `ข้อมูลตัวอย่าง` / local data / export actions.
- Use Wise's green and confident typography as brand cues, but normalize large radii, pill overload, transform hover, poster-scale headings, and metric-card-first dashboard composition.
