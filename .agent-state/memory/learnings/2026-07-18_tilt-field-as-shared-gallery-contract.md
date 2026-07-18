# Tilt Field as a shared gallery contract

Tags: `frontend-design`, `reference-fidelity`, `shared-runtime`, `prompt-truth`, `responsive`, `accessibility`, `generated-assets`

## Durable lesson

เมื่อ Mahiro ยอมรับ section หนึ่งว่าเป็นทิศทางหลัก อย่าปล่อยให้มันเป็น special case ที่สวยกว่าหน้าอื่น ให้สกัดมันเป็น contract ที่ตอบได้ชัดเจนว่า:

1. visual grammar คืออะไร
2. media ownership อยู่ที่ไหน
3. interaction job ไหนเป็น shared และไหนเป็นของแต่ละ variant
4. card preview ลดรูปจาก detail runtime อย่างไร
5. touch/keyboard/reduced motion เหลืออะไร
6. prompt/spec อธิบาย runtime ปัจจุบันตรงหรือไม่

สำหรับ Nudge คำตอบคือ shared dark ambient field + accepted generated portrait archive + stable selectable/focusable targets + bounded fine-pointer depth + attached More/Replay/Copy Prompt controls. Tilt Field, Reading Queue, Soft Radar, Travel Scrub, Type Signal และ Surface Fold จึงควรใช้ component family เดียวกัน แต่ไม่ควรกลายเป็น effect เดียวกันหกครั้ง

## Process correction

- Reference fidelity: แยก anatomy ออกจาก trade dress
- Architecture: promote accepted visual direction into a shared runtime component early
- QA: compare compact/detail pairs at matched viewport, not as independent screenshots
- Content: update prompt and notes in the same change as runtime mechanics
- Accessibility: full-card links need unique names; mobile cues must remain visible when controls float
- Layout: use full-bleed outer shell + constrained inner rail for production headers
- Evidence: remove superseded screenshots and record exact viewport/state

## Adoption trigger

ใช้บทเรียนนี้เมื่อ:

- หนึ่ง prototype/section ได้รับ foreground approval แล้วถูกขอให้เป็นแกนของ collection
- gallery card และ detail เริ่ม drift เป็นคนละ implementation
- visual family ดูเหมือนหลาย demo ที่วางรวมกันแทนที่จะเป็น product เดียว
- prompt/spec หรือ docs ยังอธิบาย mechanism รุ่นเก่า

## Guardrail

Shared contract ไม่เท่ากับ visual duplication. แชร์ surface grammar, media source, focus/motion rules และ control anatomy; รักษา interaction job, geometry และ rhythm ของแต่ละ collection ให้ต่างกัน
