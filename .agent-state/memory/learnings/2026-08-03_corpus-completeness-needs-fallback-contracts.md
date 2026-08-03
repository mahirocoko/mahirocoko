# Corpus completeness needs layered and fallback-aware contracts

**Tags:** `crawler`, `corpus`, `resume`, `fingerprint`, `generated-html`, `verification`

คำว่า “ครบ” ของ crawler มีอย่างน้อยสี่ชั้น:

1. **Index complete** — source snapshot และ unique IDs ตรงกัน
2. **Enrichment complete** — ทุก ID มี detail record ที่สำเร็จและผูกกับ source-entry fingerprint ปัจจุบัน
3. **Artifact complete** — expected files/images/pages ครบ ไม่มี stale, invalid หรือ temporary artifacts
4. **Presentation complete** — ข้อมูลที่มีถูกใช้จริงใน generated UI เช่น `heroImage` ต้องเป็น fallback เมื่อ `pages` ว่าง

Checklist ที่ใช้ซ้ำได้:

- bind resume records กับ hash ของ source entry ไม่ใช่ slug อย่างเดียว
- เขียน checkpoint/download ผ่าน temp + atomic rename
- ตรวจ signature ของ binary ก่อน reuse
- แยก primary data จาก truthful fallback และนับทั้งสองใน manifest
- ตรวจ generated HTML ด้วย DOM/browser; regex เหมาะกับ exact text lookup แต่ไม่เหมาะกับ semantic element counts
- single-item UI ไม่ควรสร้าง tab; multi-item UI ต้องมี semantic roles, roving tabindex และ keyboard contract
- `.gitignore` ไม่ลบ tracked history ต้องตรวจ `git ls-files` และ untrack โดยไม่ลบ local corpus

สำหรับ `crawl-getdesign-md` current contract คือ 340 catalog/enriched/details/pages, 340 thumbnails, 944 declared screenshots, 123 hero fallbacks และ 1,407 images รวม โดย output เป็น ignored local state
