# ReadLead — Technical Scope, Architecture และคำถามสำหรับคุยกับลูกค้า

> เอกสารตั้งต้นจาก brief วันที่ 25 กรกฎาคม 2026 และภาพตัวอย่างหน้า Reader  
> ใช้เพื่อคุย scope ก่อนล็อก technology, model, ราคา และแผนส่งมอบ

## ภาพรวม

**ReadLead** คือ SaaS สำหรับอ่านและแปลนิยาย/บทความเป็นภาษาไทยด้วย AI โดยจุดต่างไม่ใช่แค่ “แปลข้อความ” แต่คือการอ่านต่อเนื่องแบบสบายตา รักษาชื่อตัวละครและศัพท์เฉพาะให้คงเดิม แก้เฉพาะจุดได้เร็ว และคิดเครดิตอย่างโปร่งใส

### หลักการที่ต้องล็อก

เมื่อผู้ใช้ใส่ URL ระบบต้องนำเข้าเฉพาะ **ชื่อตอนและเนื้อหาจริง** เพื่อแปล ไม่เอา navigation, ลิงก์แนะนำ, โฆษณา, sidebar, comment, footer, share button, metadata หรือ HTML ส่วนเกินเข้า translation prompt

```text
URL
→ ตรวจ URL และดึงหน้าเว็บฝั่ง server
→ คัด main content
→ แยก title + paragraph segments
→ ให้ผู้ใช้ preview / ตัดส่วนที่ไม่เอา
→ ส่งข้อความล้วนที่มีโครงสร้างเข้า translation job
→ แสดงผลใน Reader
```

`nextSourceUrl` สำหรับปุ่ม “แปลตอนถัดไป” เก็บเป็น metadata แยกต่างหากได้ แต่ต้องไม่ถูกส่งเข้าโมเดลในฐานะเนื้อหา

> ข้อจำกัดที่ต้องบอกลูกค้าตรง ๆ: URL import รองรับได้เป็นรายเว็บไซต์หรือรายรูปแบบหน้าเว็บ ไม่ควรรับปากว่า “ดึงได้ทุกเว็บ” และระบบจะไม่ bypass login, paywall หรือ DRM

---

## ขอบเขตผลิตภัณฑ์ที่เสนอ

### 1) Reader

- อ่านแบบ vertical scroll, theme สบายตา, dark mode, ปรับขนาดฟอนต์และ typography ได้
- รับ URL หรือ paste text
- Reader แสดง title และเนื้อหาที่แปลแล้วโดยไม่ปนลิงก์/องค์ประกอบเว็บต้นทาง
- ปุ่มแปลตอนถัดไปอยู่ท้ายเนื้อหา
- รองรับ mobile ตั้งแต่ต้น ไม่ใช่ย่อ desktop ทีหลัง

### 2) Context-aware translation

- แยกตอนเป็น paragraph/segment ที่มี ID ถาวร
- ใช้ genre prompt เพื่อกำหนดน้ำเสียง เช่น จีนกำลังภายใน, แฟนตาซี, โรแมนติก, historical
- มี glossary ของชื่อตัวละคร สถานที่ กลุ่ม/พลัง และศัพท์เฉพาะ
- เก็บ chapter summary ขนาดสั้น แล้วส่งเฉพาะ summary/ศัพท์ที่เกี่ยวข้องกับ chunk ปัจจุบัน
- บังคับ structured response: โมเดลต้องคืนคำแปลตาม `segmentId` ไม่ใช่ตอบเป็น prose ยาวก้อนเดียว

### 3) Highlight & Quick Fix

ผู้ใช้ highlight คำหรือย่อหน้าที่อยากแก้ แล้วเปิด dialog เพื่อพิมพ์คำสั่ง เช่น “ใช้โทนสุภาพขึ้น” หรือ “ชื่อนี้ให้แปลแบบนี้”

ระบบต้องส่งให้โมเดลแค่:

- ต้นฉบับของ segment ที่เลือก
- คำแปลเดิม
- ย่อหน้าก่อน/หลังในขนาดจำกัด
- glossary ที่เกี่ยวข้อง
- คำสั่งแก้ของผู้ใช้

ผลลัพธ์ต้อง replace ได้เฉพาะ segment นั้น มี diff/revision และเสนอเพิ่ม glossary อย่างชัดเจน ไม่ควรแก้ทั้งบทหรือเขียนทับศัพท์ในคลังเงียบ ๆ

---

## Architecture ที่เหมาะกับ v1

```text
Browser / Reader UI
        │
        ▼
Web app (React Router + TypeScript)
        │
        ▼
API (Hono on Node)
 ├─ Auth / User / Credit ledger
 ├─ URL extraction gateway
 ├─ Translation orchestration
 └─ Stripe webhook
        │
        ├─────────────► Postgres
        │                 users, books, chapters, segments,
        │                 glossary, jobs, credit ledger, revisions
        │
        ├─────────────► Job worker
        │                 extraction, chunk translation, retry, settlement
        │
        └─────────────► LLM provider adapter
                          primary / fallback / usage metering
```

### Stack ที่เสนอ

| ส่วน | ข้อเสนอ | เหตุผล |
| --- | --- | --- |
| Monorepo | pnpm workspace | แยก web, API, worker และ shared domain types ได้ชัด |
| Web | React Router + TypeScript | ทำ Reader state, route และ responsive UI ได้ตรงไปตรงมา |
| API | Hono บน Node | เหมาะกับ auth, webhook, provider gateway และงาน server-side |
| Database | Postgres | เหมาะกับ ledger, glossary, revision และ transaction เครดิต |
| Background jobs | pg-boss หรือ queue ที่ผูกกับ Postgres | แปลตอนยาว/retry ได้โดยไม่ค้าง request หน้าเว็บ |
| Payment | Stripe Checkout + webhook | เครดิตต้องเชื่อจาก webhook ไม่ใช่ callback ฝั่ง browser |
| Storage | เพิ่ม object storage เมื่อมี export/file upload | v1 ที่เป็น text ล้วนยังไม่จำเป็นต้องแบก storage ใหญ่ |

> ไม่แนะนำให้ทำทุกอย่างบน browser หรือ edge function: key ต้องอยู่ฝั่ง server และ translation ตอนยาวควรเป็น background job ที่ retry/ยกเลิก/คิดเครดิตได้

---

## Model และ API key: Platform-managed only

ReadLead ถือ provider API key ฝั่ง server ผู้ใช้ซื้อเครดิตและไม่ต้องตั้งค่า API key ของตัวเอง ระบบจะเริ่มด้วย provider เดียวและเลือก model tier ภายในแพลตฟอร์ม

**แนวทางที่เสนอ**

- ช่วง research ใช้ Gemini 2.5 Flash-Lite free tier เพื่อ benchmark เท่านั้น
- production ใช้ Gemini API paid tier ผ่าน key ของ ReadLead
- `Standard` ใช้ Gemini 2.5 Flash-Lite เป็น baseline ที่ต้นทุนต่ำ
- `Quality` ใช้ Gemini 2.5 Flash เมื่อ benchmark ระบุว่าตอนนั้นต้องการภาษา/บริบทที่ดีกว่า
- หน้า Reader แสดง Standard/Quality ไม่แสดงชื่อ model หรือ provider ให้ผู้ใช้เลือกเอง

**ข้อดีของการตัด BYOK ออก**

- UX สั้น คุมคุณภาพ prompt/model ได้ และ support path เดียว
- ไม่ต้องสร้าง key vault, provider validation หรือ quota/error flow หลายชุด
- usage ledger และ credit reserve อยู่ภายใต้ระบบเดียว

**สิ่งที่ต้องรับผิดชอบ**

- เราต้องสำรองค่า model ก่อนเก็บเงินจากลูกค้า
- ต้องมี credit reserve, refund และ monitoring ที่ดี
- provider key อยู่ฝั่ง server เท่านั้น และต้องมี rate limit/abuse guard

โมเดลไม่ควรล็อกด้วยชื่อใน proposal ตอนนี้ ให้คัดจาก benchmark กับตัวอย่างนิยายจริง 20–30 ตอน โดยดู:

- ภาษาไทยอ่านลื่นตาม genre
- ชื่อตัวละคร/สถานที่ไม่แกว่ง
- dialogue และสรรพนามคง tone
- JSON/segment output เสถียร
- ต้นทุนต่อ 1,000 อักษร/ตอนอยู่ใน margin ที่ตั้งไว้

---

## Credit และต้นทุนที่ต้องคิดตั้งแต่แรก

### ต้นทุนผันแปร

- input และ output tokens ของโมเดล
- context ที่ส่งซ้ำ: glossary, chapter summary, ย่อหน้ารอบข้าง
- retry เมื่อ provider timeout หรือ structured output ไม่ผ่าน
- Highlight & Quick Fix และ re-translation
- URL extraction, bandwidth และบางเว็บที่อาจต้องใช้ browser renderer

### ต้นทุนคงที่/operational

- API/worker runtime, Postgres, backup, monitoring, error tracking
- Google OAuth, email และ customer support
- Stripe fee, refund, chargeback, ภาษี/VAT
- abuse prevention, rate limit และ bot protection
- copyright/takedown policy, retention และการลบ source text ตามคำขอ
- provider price change

### วิธีคิดเครดิตที่ควรใช้

ไม่ควรคิดจากจำนวนคำต้นฉบับอย่างเดียว

```text
estimated cost
= source tokens
+ expected output tokens
+ relevant glossary/context
+ retry safety buffer
```

ก่อนเริ่ม job ให้ **reserve เครดิตสูงสุด** แล้วหลังจบงานค่อยตัดตาม usage จริงและคืนส่วนต่าง หากงานล้มเหลวต้องไม่ตัดเครดิตซ้ำ

ทุกการหัก/คืนเครดิตต้องอยู่ใน immutable ledger พร้อม idempotency key เพื่อกัน double charge จาก retry หรือ webhook ซ้ำ

---

## Data model ขั้นต่ำ

```text
User
Book
Chapter
  └─ Segment
      ├─ sourceText
      ├─ translatedText
      ├─ status
      └─ revision
GlossaryEntry
TranslationJob
CreditLedgerEntry
QuickFixRevision
```

การเก็บ segment เป็นฐานของทั้ง Reader, context translation, Quick Fix, diff, export และการคิดต้นทุนที่ตรวจสอบได้

---

## Roadmap ที่ทำได้จริง

### Phase 0 — Proof / benchmark

- รับ paste text ก่อน
- ทดสอบ model, prompt, genre และ glossary กับ sample จริง
- ทำ cost calculator ต่อ chapter
- ตกลง acceptance เช่น “ไม่มี navigation/link ใน output” และ “ชื่อตัวละครไม่แกว่ง”

### Phase 1 — MVP

- Reader + theme + mobile
- URL import แบบ preview และรองรับเว็บไซต์ตามที่ตกลง
- translate by segment + glossary
- Highlight & Quick Fix
- login, managed credits, Stripe webhook, usage history

### Phase 2

- URL adapters เพิ่มตามเว็บที่ลูกค้าใช้จริง
- export, shared library, admin/support tools

---

# คำถามสำหรับถามลูกค้า

## คำถามที่ต้องได้คำตอบก่อนตีราคา/เริ่มพัฒนา

1. **กลุ่มผู้ใช้หลักคือใคร?** ผู้อ่านทั่วไป, คนแปล, คนเขียน, หรือทีม content มี role ต่างกันไหม
2. **แปลจากภาษาอะไรไปภาษาอะไรบ้าง?** v1 แปลเป็นไทยอย่างเดียวหรือมีภาษาอื่นด้วย
3. **URL ที่ต้องรองรับจริงมีเว็บไหนบ้าง?** ขอ sample URL อย่างน้อย 5–10 หน้า จากแต่ละเว็บ
4. **ลูกค้ามีสิทธิ์ใช้/แปลเนื้อหาจาก URL เหล่านั้นอย่างไร?** เนื้อหาเป็นของลูกค้า, public domain, หรือผู้ใช้เป็นคนรับผิดชอบสิทธิ์เอง
5. **ต้องการนำเข้าอะไรบ้าง?** title, body, รูปภาพ, เชิงอรรถ, บทสนทนา, author note, comment หรือเอา title + body เท่านั้น
6. **กรณีระบบดึงเนื้อหาผิด ต้องการให้ผู้ใช้แก้ขอบเขตก่อนแปลได้แค่ไหน?** ตัดย่อหน้า, reorder, edit ต้นฉบับ หรือ paste text ใหม่
7. **คำว่า “แปลตอนถัดไป” ต้องรองรับแบบไหน?** ใช้ URL ถัดไปอัตโนมัติ, ให้ผู้ใช้ paste URL เอง, หรือรองรับเฉพาะเว็บที่มี next chapter ชัดเจน
8. **คุณภาพคำแปลวัดจากอะไร?** ตัวอย่างชื่อตัวละคร, tone, สรรพนาม, คำจีน/ญี่ปุ่น, dialogue และคำต้องห้ามมีอะไรบ้าง
9. **glossary ใครเป็นเจ้าของ?** ต่อ user, ต่อ book, shared ทั้งระบบ หรือมี admin อนุมัติศัพท์กลาง
10. **Quick Fix ต้องแก้ได้ระดับไหน?** คำ, ประโยค, ย่อหน้า, หลายย่อหน้าพร้อมกัน และต้องมีประวัติ/undo ไหม
11. **เครดิตคิดอย่างไร?** ตามตอน, จำนวนอักษร, Standard/Quality, หรือ usage จริงแบบ token-based แต่แสดงเป็นเครดิต
12. **นิติบุคคล/ประเทศรับเงินอยู่ที่ไหน และต้องรับสกุลเงิน/PromptPay จริงไหม?** ต้องเช็กก่อน commit ว่า Stripe account รองรับ payment method ที่ต้องการ

## คำถามด้าน scope และการเปิดตัว

13. ต้องมี Google OAuth, email/password หรือทั้งคู่ตั้งแต่ v1
14. ต้องมี admin dashboard สำหรับดู user, job failure, credit adjustment และ support หรือไม่
15. ผู้ใช้ลบหนังสือ/ข้อมูลได้ไหม และระบบเก็บ source text นานเท่าไร
16. ต้องมี export เป็น TXT/EPUB/PDF หรือไม่
17. ต้องมี free trial, เครดิตเริ่มต้น, subscription หรือ pay-as-you-go อย่างเดียว
18. มีเป้าหมาย traffic, จำนวนบทต่อวัน และความยาวเฉลี่ยต่อบทไหม
19. ต้องรองรับ mobile browser, PWA, desktop app หรือแค่เว็บ responsive
20. มี brand guide, logo, reference UI และ sample content ที่อนุญาตให้ใช้ทำ QA หรือยัง

---

## ข้อสรุปสำหรับคุยกับลูกค้า

ReadLead ทำได้จริง ถ้าตกลงให้ชัดว่า v1 รองรับ source แบบไหนและใช้ model/billing แบบใด จุดที่ไม่ควรรับปากเกินจริงคือ “ดึงได้ทุกเว็บ” และ “แปลเนียนทุกแนวโดยไม่ต้องมี benchmark”

ทางที่ปลอดภัยและขายงานได้คือ: **Platform-managed Gemini API + URL preview + รองรับเว็บไซต์ที่ตกลง + contextual glossary + Quick Fix ระดับ segment** แล้วขยายเฉพาะเว็บไซต์และ model tier ที่ benchmark ผ่าน
