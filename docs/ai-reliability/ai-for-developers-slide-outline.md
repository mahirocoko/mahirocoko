# ผมใช้ AI ทำงานยังไง

> **Superseded slide outline — 18 สิงหาคม 2026.** Mahiro replaced the tool-history narrative with a 9-slide code-workflow deck. Current slide order, projected copy, and speaker notes live in [`apps/frontend-labs/ai-dev-slides/groomed-grok-opus/index.html`](../../apps/frontend-labs/ai-dev-slides/groomed-grok-opus/index.html); current narrative contracts live in [`grooming-notes.md`](../../apps/frontend-labs/ai-dev-slides/groomed-grok-opus/grooming-notes.md). This v4 outline remains historical evidence only.

สถานะ: Slide outline v4  
รูปแบบ: Knowledge sharing ภายในทีม Developer  
เวลาเป้าหมาย: 30–35 นาที + Q&A  
อัปเดตล่าสุด: 17 สิงหาคม 2026

ไฟล์นี้เคยเป็นเจ้าของลำดับสไลด์แบบ tool history แต่ไม่ใช่ current owner แล้ว ข้อเท็จจริงและวันที่ทางประวัติศาสตร์ยังให้ยึด [`mahiro-ai-dev-history.md`](./mahiro-ai-dev-history.md)

---

## Slide 1 — ผมใช้ AI ทำงานยังไง

### ขึ้นบนสไลด์

**จาก AI Chat สู่ Letta Code**

```text
AI Chat → Claude Code → OpenCode → Letta Code
```

เส้นทางที่ลองใช้ ปรับแต่ง และสร้างเครื่องมือเสริมรอบ AI จนกลายเป็น setup ปัจจุบัน

### Speaker note

Session นี้แชร์ setup และวิธีทำงานจริงของผม ไม่ใช่การจัดอันดับ model หรือบอกว่าทุกคนต้องเซ็ตเหมือนกัน

---

## Slide 2 — เครื่องมือที่ผมใช้ตามลำดับ

### ขึ้นบนสไลด์

1. **AI Chat** — ช่วยคิด อธิบาย logic และร่าง code
2. **Claude Code** — เริ่มให้ coding agent ลงมือแก้ code ใน repo
3. **MCP memory** — ทดลองทำ memory layer ให้จำข้อมูลข้าม session
4. **OpenCode** — เลือก model และ provider ได้อิสระ จัด workflow หลาย agent
5. **Letta Code** — main agent ที่คุยและทำงานร่วมกันระยะยาว
6. **Herdr + Agent Halo** — คุมและมองเห็นสถานะของหลาย agent พร้อมกัน

```text
Model = สมองที่คิดและประมวลผล
Tool  = สิ่งที่ทำให้ model ลงมือได้ (อ่าน/แก้ไฟล์ รัน command ฯลฯ)
Agent = Model + Tools + Goal ทำงานต่อเนื่องหลายขั้นตอนได้เอง
```

### Speaker note

ใช้สไลด์นี้เป็น roadmap ของ session และปูพื้นความต่างระหว่าง model, tool กับ agent สั้น ๆ เพราะคำพวกนี้จะถูกพูดถึงตลอด

---

## Slide 3 — จากก๊อปคำตอบเอง สู่ให้ agent ลงมือใน repo

### ขึ้นบนสไลด์

**AI Chat**

```text
เจอ error → ก๊อปไปถาม → ก๊อปคำตอบกลับมา → รันเองใน terminal
```

**Claude Code**

```text
อ่าน codebase → แก้ไฟล์ → รัน command และ test → อ่านผลแล้วทำต่อได้
```

### Speaker note

Claude Code เป็น coding agent ตัวแรกที่ผมใช้จริงจัง ความต่างที่ชัดมากคือไม่ต้องคอยก๊อป code ข้ามไปมาระหว่าง chat, editor และ terminal เองทุกขั้นตอน

---

## Slide 4 — ก่อน Letta ผมลองสร้าง memory layer เอง

### ขึ้นบนสไลด์

```text
Claude Code
    ↕ MCP
Memory layer ข้าม session
```

- อยากให้ agent ค้นและดึง context จากงานก่อนหน้ากลับมาใช้ได้
- ไม่อยากเริ่มใหม่จากศูนย์ทุกครั้งที่เปิด session
- ลองแยก memory ออกจาก coding tool เพื่อไม่ให้ข้อมูลผูกติดกับเครื่องมือเดียว

### Speaker note

ช่วงนี้ผมพยายามสร้าง memory layer ครอบ Claude Code ผ่าน MCP (Model Context Protocol) เป้าหมายคือเปลี่ยน coding tool ได้โดย context เดิมไม่หายตามไปด้วย

---

## Slide 5 — ทำไมผมย้ายไป OpenCode

### ขึ้นบนสไลด์

- ใช้ ChatGPT subscription ที่มีอยู่เดิมได้
- เลือก model และ provider ได้อิสระขึ้น
- มี Oh My OpenCode ช่วยจัด workflow และแบ่งบทบาท agent
- ย้าย skills และ custom commands เดิมตามไปใช้ต่อได้

### Speaker note

OpenCode ทำหน้าที่เป็น runtime หลัก ส่วน Oh My OpenCode ช่วยจัด workflow และแบ่งบทบาท agent ช่วงนี้ทำให้ผมเริ่มเลือก model ตามงาน แทนการใช้ตัวเดียวทำทุกอย่าง

---

## Slide 6 — Letta Code เป็นตัวหลัก แต่ workflow ไม่ได้ผูกกับตัวเดียว

### ขึ้นบนสไลด์

**Letta Code — main agent ที่รู้จักผม**

- รู้จัก workflow, preference และวิธีทำงานของผม
- มี persistent memory จำ context ข้าม session

**Skills — workflow ที่พกไปใช้กับ agent อื่นได้**

- ใช้ procedure เดิมกับ Agy, OpenCode, Claude Code และ CLI อื่น
- เปลี่ยน model หรือ tool ได้ โดยไม่ต้องเริ่มวิธีทำงานใหม่ทั้งหมด

### Speaker note

สิ่งที่ผมชอบใน Letta Code คือความต่อเนื่องของ main agent แต่ผมไม่ได้ย้ายทุก workflow เข้าไปผูกกับ Letta Code เพราะ skills เป็น procedure ที่ติดตั้งและใช้กับ agent อื่นได้ ส่วน mods ใช้ขยาย runtime ของ Letta Code โดยเฉพาะ

---

## Slide 7 — ผมแบ่งงานให้ agent ยังไง

### ขึ้นบนสไลด์

| บทบาท | หน้าที่ | เลือก model แบบไหน |
| --- | --- | --- |
| **Main / Coordinator** | คุย วางแผน ถือ context ภาพรวม | คิดรอบคอบ รองรับ context ยาว |
| **Scout** | อ่าน codebase กว้าง ๆ สรุปจุดสำคัญ | อ่านเร็ว สรุปชัด จับ pattern ได้ |
| **Writer** | ลงมือแก้ code ใน scope ที่ชัดเจน | แม่นยำ ทำตาม instruction เคร่งครัด |
| **Reviewer / Verifier** | ตรวจ code, command และผล test | ช่างสงสัย หาจุดขัดแย้งและ edge cases เก่ง |
| **Visual Direction** | สำรวจและทดลองทิศทางด้านภาพ | รสนิยมและ creative taste เข้ากับงาน |

### Speaker note

ผมเลือก model ตามบทบาทของงานมากกว่าหาตัวที่เก่งที่สุดทุกเรื่อง และเพราะ model เปลี่ยนรุ่นเร็วมาก จึงไม่ใส่ชื่อรุ่นเฉพาะเจาะจงไว้บนสไลด์

---

## Slide 8 — หนึ่งงานจริง ผมเริ่มและจบยังไง

### ขึ้นบนสไลด์

```text
ดูของจริงใน repo (code, config, logs)
→ กำหนดเป้าหมายและ scope ให้ชัด
→ เลือก skill หรือ workflow ที่เกี่ยวข้อง
→ เลือก agent และ model ที่เหมาะกับบทบาท
→ ลงมือแก้ทีละส่วน พร้อม verify ผลจริง
→ review ผลลัพธ์สุดท้ายและตัดสินใจเอง
→ บันทึก context หรือปรับ skill ไว้ใช้ครั้งถัดไป
```

### Speaker note

นี่คือ workflow ทั่วไปในการทำงานจริง ไม่ใช่ checklist แข็งตัว งานเล็ก main agent อาจทำจบเอง แต่งานใหญ่ค่อยกระจายให้ scout, writer หรือ reviewer ช่วยกัน โดยเราเป็นคนคุมและตัดสินใจขั้นสุดท้ายเสมอ

---

## Slide 9 — เปิดหลาย agent พร้อมกัน ผมดูและคุมยังไง

### ขึ้นบนสไลด์

**Herdr — control room สำหรับ agents**

- จัด workspace, tab และ terminal pane
- ส่ง prompt อ่าน output และหยุดงาน
- สลับกลับไปยัง pane ที่ต้องการได้ทันที

**Agent Halo — สถานะบน Notch**

- แสดงสถานะ working, waiting, done, error
- เหลือบดูได้โดยไม่ต้องเฝ้า terminal
- คลิกกลับไปยัง session นั้นได้ทันที

### Speaker note

Herdr เป็นที่สั่งและคุมงานจริง ส่วน Agent Halo แสดงสถานะของทุก session บน Notch ทั้งคู่ช่วยให้ผมตามงานหลาย session ได้โดยไม่ต้องเฝ้า terminal ตลอดเวลา

---

## Slide 10 — Ecosystem ที่ผมใช้จริง

### ขึ้นบนสไลด์

| ส่วนประกอบ | หน้าที่ใน workflow |
| --- | --- |
| Letta Code + Memory | main agent, context และ preference ระยะยาว |
| Skills | procedure ที่ใช้ซ้ำและพกข้าม agent |
| Mods | tools, commands, state และ events เฉพาะ Letta Code |
| Repo docs / AGENTS.md | กติกาและ context ของแต่ละโปรเจกต์ |
| Herdr | execution lanes และ panes ที่กำลังรันงาน |
| Agent Halo | ภาพรวมสถานะที่อยากเหลือบดูเร็ว ๆ |

### Speaker note

เส้นแบ่งสำคัญคือ skills พก workflow ไปใช้ข้าม agent ได้ ส่วน mods เป็น Letta-specific runtime extension ไม่ได้พกไปใช้กับ Agy โดยตรง ณ วันที่ 17 สิงหาคม 2026 Agy ติดตั้ง Mahiro Skills แบบ managed อยู่ 24 skills

---

## Slide 11 — Mahiro Skills ที่ผมพกไปใช้ข้าม agent

### ขึ้นบนสไลด์

**Mahiro core behavior**

| Skill | ใช้ทำอะไร |
| --- | --- |
| `mahiro-style` | code, review และ implementation ในแบบของผม |
| `mahiro-guidance-refine` | เปลี่ยน feedback ให้เป็น docs และ rules ที่ใช้ต่อได้ |
| `mahiro-docs-rules-init` | ตั้งต้น AGENTS.md และ project docs |

**Workflow ที่หยิบใช้ประจำ**

`recap` · `rrr` · `direct-cli` · `fable`

Agy ติดตั้งทั้งหมดเป็น `/mh-*` ส่วน agent อื่นใช้ adapter ของตัวเอง

### Speaker note

Skill family ที่คุณหมายถึงคือ `mahiro-*` ไม่ใช่ prefix `/mh-*`: `mahiro-guidance-refine` ถูกใช้ 59 ครั้ง, `mahiro-style` 21 และ `mahiro-docs-rules-init` 10 ส่วน `/mh-*` เป็นเพียงชื่อ alias ที่ Agy สร้างตอนติดตั้ง ปัจจุบัน Agy มี Mahiro Skills แบบ managed 24 skills

---

## Slide 12 — Q&A

### ขึ้นบนสไลด์

**ตอนนี้ทุกคนใช้ AI ช่วยทำงานกันแบบไหน?**

### Speaker note

ชวนคุยแลกเปลี่ยน: ตอนนี้ในทีมใช้ AI Chat, coding agent หรือเครื่องมือตัวไหนกันอยู่บ้าง มี pain point หรือ workflow ตรงไหนที่อยากลองปรับ

---

## เวลาโดยประมาณ

| ช่วง | สไลด์ | เวลา |
| --- | --- | --- |
| เปิดเรื่องและ journey | 1–2 | 5 นาที |
| เครื่องมือแต่ละช่วง | 3–6 | 10 นาที |
| วิธีใช้ปัจจุบัน | 7–9 | 10 นาที |
| Ecosystem และ skills ที่ใช้จริง | 10–11 | 7 นาที |
| Q&A | 12 | 3 นาที + Q&A |

## ยังไม่ทำใน outline รอบนี้

- ยังไม่เลือก theme, font หรือ visual direction
- ยังไม่เลือก screenshot และ demo จริง
- ยังไม่เขียน speaker script แบบคำต่อคำ
- ยังไม่เลือกว่าจะผลิต deck ด้วย Marp, Keynote, PowerPoint หรือ Google Slides
