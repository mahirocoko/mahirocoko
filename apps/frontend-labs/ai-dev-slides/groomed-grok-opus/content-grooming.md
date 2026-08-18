# Content Grooming — Groomed Candidate

> **Historical evidence — superseded 18 August 2026.** This document records the former 12-slide tool-history copy map. It is not authoritative for the active 9-slide code-workflow deck; use `index.html` and `grooming-notes.md` for current projected copy and slide jobs.

Content owner: Claude Opus 4.6  
Visual owner: Cursor Grok 4.6 High (Context Filament)  
Source of truth: `approved-feedback.md` 18 สิงหาคม 2026  
Fact-checked against: `slide-outline.md`, `history.md`, `talk-notes.md`

---

## 1. Narrative Diagnosis

ทั้ง Grok และ Opus candidate ยึดลำดับ 12 สไลด์ถูกต้อง ข้อเท็จจริงหลักไม่ผิด แต่มีปัญหาเชิง content ร่วมกัน 5 จุด:

1. **`ผม` ยังปนอยู่ทั่ว projected copy** — ทั้งสองตัดแค่ชื่อ slide จริง ๆ ยังเหลือ `ผม` ในหัวข้อย่อย bullet และ label อีกมาก (Grok: S4 "ผมลองสร้าง", S5 "ผมย้ายไป", S7 "ผมแบ่งงาน", S8 "ผมเริ่มและจบ", S9 "ผมดูและคุม", S10 "ผมใช้จริง", S11 "ผมพกไปใช้"; Opus เหมือนกัน)
2. **Slide 6 ยังแบ่งน้ำหนักให้ Skills/Mods เท่า Letta** — Approved feedback ระบุชัดว่า Slide 6 ต้องทำให้ Letta Code เป็นเหตุผลหลัก; portable Skills ย้ายไป 10–11; Mods เป็น note หรือ ecosystem
3. **ไม่มี bridge จาก OpenCode ไป Letta** — ผู้ฟังไม่เห็นว่าหลัง OpenCode สิ่งที่ต้องการคือ main agent หนึ่งตัวที่รู้จักวิธีทำงาน ไม่ใช่แค่เปลี่ยน tool อีกที
4. **Projected copy ยังหนาเกิน** — Slides 2, 5, 6, 8, 10 มี bullet ยาวเกือบเป็นย่อหน้า ขัดกับ approved direction "communicate through composition, imagery, diagrams, and short labels"
5. **Slide 1 ยังไม่มีตำแหน่งสำหรับ logo/asset** — ทั้งสองใช้ text-only journey flow โดยไม่ระบุว่า product ใดใช้ logo จริงและตัวใดควรเป็น text

---

## 2. Projected-Copy Map — 12 Slides

> กฎ: ข้อความด้านล่างคือ **ทุกคำที่ควรเห็นบนจอ** copy ที่ไม่อยู่ในนี้ต้องไม่ขึ้นสไลด์  
> `ผม` ถูกตัดจาก projected copy ทั้งหมด; first-person อยู่ใน speaker notes เท่านั้น  
> ภาษาไทยสั้น ปนศัพท์ developer ที่คุ้นเป็นภาษาอังกฤษ

### Slide 1 — Title

**Title:** ใช้ AI ทำงานยังไง  
**Subtitle:** จาก AI Chat สู่ Letta Code

**Journey flow (asset area):**

```
AI Chat → Claude Code → OpenCode → Letta Code
```

**Tagline:** เส้นทางที่ลองใช้ ปรับแต่ง และสร้างเครื่องมือเสริมรอบ AI จนกลายเป็น setup ปัจจุบัน

**Presenter mark:** Mahiro · setup ที่ใช้จริง

---

### Slide 2 — Roadmap + Glossary

**Title:** เครื่องมือที่ใช้ตามลำดับ

**Roadmap (numbered list):**

1. **AI Chat** — ช่วยคิด ร่าง code
2. **Claude Code** — coding agent ลงมือแก้ code ใน repo
3. **MCP memory** — ทดลอง memory layer ข้าม session
4. **OpenCode** — เลือก model/provider อิสระ จัด workflow หลาย agent
5. **Letta Code** — main agent ทำงานร่วมกันระยะยาว
6. **Herdr + Agent Halo** — คุมและมองเห็นสถานะหลาย agent

**Glossary (definition list):**

| Term  | คำอธิบาย |
|-------|----------|
| Model | สมองที่คิดและประมวลผล |
| Tool  | สิ่งที่ทำให้ model ลงมือได้ |
| Agent | Model + Tools + Goal ทำงานต่อเนื่องได้เอง |

---

### Slide 3 — AI Chat vs Coding Agent

**Title:** จากก๊อปคำตอบเอง สู่ให้ agent ลงมือใน repo

**Left pane — AI Chat:**

```
เจอ error → ก๊อปไปถาม → ก๊อปคำตอบกลับมา → รันเองใน terminal
```

**Right pane — Claude Code:**

```
อ่าน codebase → แก้ไฟล์ → รัน command และ test → อ่านผลแล้วทำต่อ
```

---

### Slide 4 — MCP Memory Attempt

**Eyebrow:** ก่อน Letta  
**Title:** ลองสร้าง memory layer เอง

**Diagram:**

```
Claude Code
    ↕ MCP
Memory layer ข้าม session
```

**Bullets (3 สั้น):**

- ให้ agent ดึง context งานก่อนหน้ากลับมาใช้ได้
- ไม่ต้องเริ่มจากศูนย์ทุก session
- แยก memory ออกจาก coding tool — ไม่ผูกกับเครื่องมือเดียว

---

### Slide 5 — ย้ายไป OpenCode

**Title:** ทำไมย้ายไป OpenCode

**Bullets (4 items, short):**

1. ใช้ ChatGPT subscription เดิมได้
2. เลือก model/provider อิสระขึ้น
3. Oh My OpenCode จัด workflow และแบ่งบทบาท agent
4. ย้าย skills และ custom commands ตามไปใช้ต่อได้

**Bridge line (projected, ปิดสไลด์):**

> แต่สิ่งที่ยังขาดคือ main agent หนึ่งตัวที่จำวิธีทำงานข้าม session ได้

---

### Slide 6 — Letta Code เป็นตัวหลัก

**Title:** ทำไม Letta Code ถึงเป็นตัวหลัก

> **Approved directive:** Slide 6 ต้องเน้น Letta Code เป็นเหตุผลหลัก; portable Skills ย้ายไป 10–11; Mods อยู่ใน note

**Primary block — Letta Code:**

- Identity ต่อเนื่อง — agent ตัวเดิมไม่ต้องเริ่มทำความรู้จักใหม่
- Persistent memory — จำ context, preference และวิธีทำงานข้าม session
- เปลี่ยน model ได้ — ไม่ต้องเปลี่ยน main agent

**Secondary mention (supporting, ขนาดเล็กกว่า):**

Skills พก workflow ไปใช้กับ agent อื่นได้ → รายละเอียดใน Slides 10–11

---

### Slide 7 — แบ่งงานให้ agent

**Title:** แบ่งงานให้ agent ยังไง

**Table (5 rows, 3 columns — short):**

| บทบาท | หน้าที่ | เลือก model แบบไหน |
|-------|---------|-------------------|
| Main / Coordinator | วางแผน ถือ context ภาพรวม | คิดรอบคอบ context ยาว |
| Scout | อ่าน codebase สรุปจุดสำคัญ | อ่านเร็ว จับ pattern ได้ |
| Writer | แก้ code ใน scope ที่ชัด | แม่นยำ ตาม instruction |
| Reviewer / Verifier | ตรวจ code, command, ผล test | ช่างสงสัย หา edge cases |
| Visual Direction | ทดลองทิศทางด้านภาพ | creative taste เข้ากับงาน |

---

### Slide 8 — หนึ่งงานจริง

**Title:** หนึ่งงานจริง เริ่มและจบยังไง

**Flow (ordered list, short labels):**

1. ดูของจริงใน repo
2. กำหนดเป้าหมายและ scope
3. เลือก skill/workflow ที่เกี่ยวข้อง
4. เลือก agent และ model ตามบทบาท
5. แก้ทีละส่วน verify ผลจริง
6. review ผลลัพธ์สุดท้าย ตัดสินใจเอง
7. บันทึก context หรือปรับ skill ไว้ใช้ครั้งถัดไป

---

### Slide 9 — Herdr + Agent Halo

**Title:** เปิดหลาย agent พร้อมกัน ดูและคุมยังไง

**Left — Herdr:**

**Label:** control room สำหรับ agents

- จัด workspace, tab, terminal pane
- ส่ง prompt อ่าน output หยุดงาน
- สลับไปยัง pane ที่ต้องการทันที

**Right — Agent Halo:**

**Label:** สถานะบน Notch

- working · waiting · done · error
- เหลือบดูโดยไม่ต้องเฝ้า terminal
- คลิกกลับไปยัง session ได้ทันที

---

### Slide 10 — Ecosystem

**Title:** Ecosystem ที่ใช้จริง

> **Content hierarchy:** Core (Letta Code + Memory) อยู่กลาง; Orbit (Skills, Repo docs, Herdr, Agent Halo) ล้อมรอบ; Mods แสดงเป็น annotation ของ core

**Core:**

- **Letta Code + Memory** — main agent, context และ preference ระยะยาว
- **Mods** — tools, commands, state, events เฉพาะ Letta Code

**Orbit:**

- **Skills** — procedure ที่ใช้ซ้ำและพกข้าม agent
- **Repo docs / AGENTS.md** — กติกาและ context ของแต่ละโปรเจกต์
- **Herdr** — execution lanes และ panes ที่กำลังรันงาน
- **Agent Halo** — ภาพรวมสถานะที่เหลือบดูเร็ว ๆ

---

### Slide 11 — Mahiro Skills

**Title:** Mahiro Skills — พกไปใช้ข้าม agent

> **Approved directive:** `mahiro-style`, `mahiro-guidance-refine`, `mahiro-docs-rules-init` เป็น primary content; `recap`/`rrr`/`direct-cli`/`fable` เป็น secondary

**Primary — Mahiro core behavior (table, dominant):**

| Skill | ใช้ทำอะไร |
|-------|----------|
| `mahiro-style` | doctrine สำหรับ code, review และ implementation |
| `mahiro-guidance-refine` | เปลี่ยน feedback เป็น docs และ rules ที่ใช้ต่อได้ |
| `mahiro-docs-rules-init` | ตั้งต้น AGENTS.md และ project docs |

**Secondary — Workflow ที่หยิบใช้ประจำ (chip/tag, ขนาดเล็กกว่า):**

`recap` · `rrr` · `direct-cli` · `fable`

**Install note (small text):**

Agy ติดตั้งเป็น `/mh-*`; agent อื่นใช้ adapter ของตัวเอง

---

### Slide 12 — Q&A

**Label:** Q&A  
**Title:** ตอนนี้ทุกคนใช้ AI ช่วยทำงานกันแบบไหน?

---

## 3. Speaker-Note Cues

> Speaker notes เป็นที่เดียวที่ `ผม` ใช้ได้ ด้านล่างเป็น cue สั้น ไม่ใช่ script คำต่อคำ

| Slide | Cue |
|-------|-----|
| 1 | Session นี้แชร์ setup และวิธีทำงานจริงของผม ไม่ใช่จัดอันดับ model |
| 2 | ใช้เป็น roadmap ของ session; ปูพื้นความต่างระหว่าง model, tool, agent เพราะจะถูกพูดถึงตลอด |
| 3 | Claude Code เป็น coding agent ตัวแรกที่ผมใช้จริงจัง ไม่ต้องก๊อป code ข้ามไปมาเอง |
| 4 | ช่วง 26 ม.ค. 2026 ผมพยายามสร้าง memory layer ครอบ Claude Code ผ่าน MCP; เป้าหมายคือเปลี่ยน coding tool ได้โดย context ไม่หาย; พบว่ามี `memory_search` อย่างเดียวไม่พอ ถ้า workflow ไม่เคยเก็บข้อมูลลง |
| 5 | OpenCode เป็น runtime หลัก; Oh My OpenCode เป็น orchestration harness; ช่วงนี้ผมเริ่มเลือก model ตามงาน; **bridge →** แต่ยังไม่มีตัวหลักที่จำวิธีทำงานข้าม session |
| 6 | สิ่งที่ผมชอบใน Letta Code คือ identity continuity ไม่ใช่แค่มี memory database; ผมไม่ได้ย้ายไปเพราะ tool ตัวก่อนแย่ แต่โจทย์เปลี่ยนจาก "ช่วยทำ task" เป็น "ทำงานร่วมกันระยะยาว"; Mods (`@mahirocoko/letta-mods@0.8.9`) ขยาย runtime เฉพาะ Letta Code ไม่ได้พกไปใช้กับ Agy |
| 7 | เลือก model ตามบทบาท ไม่ใช่หาตัวเก่งที่สุดทุกเรื่อง; model เปลี่ยนรุ่นเร็ว จึงไม่ใส่ชื่อรุ่นบนสไลด์ |
| 8 | นี่คือ flow ทั่วไป ไม่ใช่ checklist แข็งตัว; งานเล็ก main agent ทำจบเอง งานใหญ่กระจายให้ specialist; เราเป็นคนคุมและตัดสินใจขั้นสุดท้ายเสมอ |
| 9 | Herdr เป็นที่สั่งและคุมงานจริง; Agent Halo แสดงสถานะบน Notch; ทั้งคู่ช่วยตามงานหลาย session โดยไม่ต้องเฝ้า terminal |
| 10 | เส้นแบ่งสำคัญ: skills พก workflow ข้าม agent ได้ / mods เป็น Letta-specific; ณ 17 ส.ค. 2026 Agy ติดตั้ง Mahiro Skills 24 skills |
| 11 | Skill family คือ `mahiro-*` ไม่ใช่ `/mh-*`; `mahiro-guidance-refine` ถูกใช้ 59 ครั้ง, `mahiro-style` 21, `mahiro-docs-rules-init` 10; `/mh-*` เป็นแค่ alias ที่ Agy สร้างตอนติดตั้ง |
| 12 | ชวนคุยแลกเปลี่ยน: ในทีมใช้ AI Chat, coding agent หรือเครื่องมืออะไรกันอยู่ มี pain point ตรงไหนที่อยากลองปรับ |

---

## 4. Transition Bridge: OpenCode → Letta Code

### ตำแหน่ง

ปิด Slide 5 ด้วย projected bridge line หนึ่งบรรทัด แล้วเปิด Slide 6 ด้วยคำตอบ

### Projected copy

**Slide 5 closing line:**

> แต่สิ่งที่ยังขาดคือ main agent หนึ่งตัวที่จำวิธีทำงานข้าม session ได้

**Slide 6 title (เปลี่ยนจากเดิม):**

> ทำไม Letta Code ถึงเป็นตัวหลัก

### Speaker-note bridge

Slide 5 note ปิดด้วย: "OpenCode ให้ freedom ในการเลือก model และ provider แต่ทุกครั้งที่เปิด session ใหม่ ผมยังต้องอธิบายตัวเองและวิธีทำงานซ้ำ สิ่งที่ต้องการจริง ๆ คือ main agent ที่จำได้"

Slide 6 note เปิดด้วย: "Letta Code ตอบโจทย์ตรงนี้ด้วย identity continuity — agent ตัวเดิม ไม่ต้องเริ่มทำความรู้จักใหม่"

### เหตุผล

History.md ยืนยันว่า Mahiro ไม่ได้เลิก OpenCode เพราะมันไม่ดี แต่ main relationship ย้ายมาที่ Letta เพราะ identity continuity ข้อมูลนี้ต้องปรากฏให้ผู้ฟังเข้าใจแรงจูงใจก่อนเห็น Slide 6

---

## 5. Slide 1 — Asset Roles

### Journey flow

Slide 1 แสดง path `AI Chat → Claude Code → OpenCode → Letta Code`

### Logo provenance assessment

| Product | แหล่ง logo | คำแนะนำ |
|---------|-----------|---------|
| **Letta** | First-party official logo จาก Letta ใช้ใน docs และ GitHub | ✅ ใช้ official logo ได้ |
| **Claude Code** | Anthropic มี official Claude mark ที่เผยแพร่สาธารณะ | ✅ ใช้ official mark ได้ |
| **OpenCode** | Open-source project มี logo ใน GitHub repo | ✅ ใช้ได้ถ้า license อนุญาต — ตรวจ repo license ก่อนใช้ |
| **AI Chat** | ไม่มี logo เฉพาะ เป็นคำอธิบายทั่วไป ไม่ใช่ product เดียว | ❌ ใช้ semantic text `AI Chat` |
| **Herdr** | โปรเจกต์ของ Mahiro ไม่ใช่ third-party product logo | ⚠️ ไม่อยู่ใน Slide 1 journey flow — ไม่ต้องมี logo ที่นี่ |
| **Agent Halo** | โปรเจกต์ของ Mahiro | ⚠️ เช่นเดียวกัน — ไม่ต้องมี logo ที่นี่ |

### Hero image / abstract supporting image

Approved feedback อนุญาตให้มี Gemini-generated abstract supporting image หนึ่งภาพ **ห้ามมี embedded text และ fake product logos**

**Content role:** ภาพนี้ควรสื่อถึง journey/evolution หรือ layered system — ไม่ใช่ decoration

**ยังไม่ขอ generate ตอนนี้** — ให้ Grok ออกแบบ composition ของ Slide 1 ก่อน แล้วตัดสินใจว่าต้องการ abstract image ที่ตำแหน่งใดและขนาดเท่าไร ถ้าต้องการจะร้องขอผ่าน `asset-request.md`

---

## 6. Factual-Risk Notes for Grok

> Grok เป็น visual owner — ข้อมูลด้านล่างช่วยป้องกัน factual drift ตอน implement

### ⚠️ `ผม` ที่ยังค้างอยู่

Grok candidate ใช้ `ผม` ใน projected titles และ copy ของ Slides 1, 2, 4, 5, 7, 8, 9, 10, 11 ทั้งหมดต้องถูกลบ ไม่ใช่แค่เปลี่ยนเป็น passive — ตัดคำออกแล้วปรับประโยคให้สั้นและเป็นธรรมชาติ

**ตัวอย่างจาก Grok ที่ต้องแก้:**

| ตำแหน่ง | เดิม (Grok) | Groomed |
|---------|-------------|---------|
| S1 eyebrow | `ผมใช้ AI ทำงานยังไง` | `ใช้ AI ทำงานยังไง` |
| S4 title | `ผมลองสร้าง memory layer เอง` | `ลองสร้าง memory layer เอง` |
| S5 title | `ทำไมผมย้ายไป OpenCode` | `ทำไมย้ายไป OpenCode` |
| S7 title | `ผมแบ่งงานให้ agent ยังไง` | `แบ่งงานให้ agent ยังไง` |
| S8 title | `หนึ่งงานจริง ผมเริ่มและจบยังไง` | `หนึ่งงานจริง เริ่มและจบยังไง` |
| S9 title | `เปิดหลาย agent พร้อมกัน ผมดูและคุมยังไง` | `เปิดหลาย agent พร้อมกัน ดูและคุมยังไง` |
| S10 title | `Ecosystem ที่ผมใช้จริง` | `Ecosystem ที่ใช้จริง` |
| S11 title | `Mahiro Skills ที่ผมพกไปใช้ข้าม agent` | `Mahiro Skills — พกไปใช้ข้าม agent` |
| S6 h2 | `main agent ที่รู้จักผม` | `main agent ที่รู้จักวิธีทำงาน` |
| S11 table | `ในแบบของผม` | ตัดออก → `doctrine สำหรับ code, review และ implementation` |
| S2 title | `เครื่องมือที่ผมใช้ตามลำดับ` | `เครื่องมือที่ใช้ตามลำดับ` |

### ⚠️ Slide 6 structure ต้องเปลี่ยน

Grok candidate มี 3 strata เท่ากัน (Letta / Skills / Mods) ทำให้ Letta ไม่โดดเด่นเป็นเหตุผลหลัก

**ต้องเปลี่ยนเป็น:** Letta Code block เป็น dominant primary; Skills เป็น supporting mention ขนาดเล็กพร้อม pointer ไป Slides 10–11; Mods ย้ายเข้า speaker note หรือ Slide 10 ecosystem

### ⚠️ Bridge line ขาด

ทั้ง Grok และ Opus candidate ไม่มี projected bridge ระหว่าง Slide 5 กับ 6 ต้องเพิ่ม closing line ของ Slide 5: "แต่สิ่งที่ยังขาดคือ main agent หนึ่งตัวที่จำวิธีทำงานข้าม session ได้"

### ⚠️ ข้อเท็จจริงที่ต้องไม่เปลี่ยน

| Fact | ค่าที่ถูกต้อง | แหล่งยืนยัน |
|------|-------------|------------|
| MCP memory attempt date | 26 มกราคม 2026 | history.md L21–25 |
| OpenCode migration date | 30 มกราคม 2026 | history.md L76 |
| Letta main relationship | กลางพฤษภาคม 2026 | history.md L138 |
| Letta rename | Letta Code → Mahiro Code (rename ไม่ขึ้นสไลด์; สไลด์ใช้ "Letta Code" เท่านั้น) | history.md L144 |
| Oh My OpenCode | ปัจจุบัน redirect ไป Oh My OpenAgent | history.md L113, talk-notes.md L145-146 |
| Agy managed skills | 24 skills ณ 17 ส.ค. 2026 | history.md L489 |
| Skill family name | `mahiro-*` ไม่ใช่ `/mh-*` | history.md L494 |
| `mahiro-guidance-refine` invocations | 59 ครั้ง | history.md L494 |
| `mahiro-style` invocations | 21 ครั้ง | history.md L494 |
| `mahiro-docs-rules-init` invocations | 10 ครั้ง | history.md L494 |
| Total skill invocations | 2,755 (ทั้ง ecosystem ไม่ใช่เฉพาะ Mahiro Skills) | history.md L493 |
| Mods package | `@mahirocoko/letta-mods@0.8.9` | history.md L491 |
| Letta Code เรียกตัวเองว่า | stateful agent harness | talk-notes.md L232 |

### ⚠️ Claims ห้ามพูด

- ❌ "Letta เป็นตัวเดียวที่มี memory"
- ❌ "OpenCode เป็น stateless เสมอ"
- ❌ "เครื่องมือก่อนหน้าแย่"
- ❌ "Oh My OpenCode เป็นแค่ plugin" (มันเป็น orchestration harness; packaging เป็น plugin)
- ❌ ใช้ "Mahiro Code" บนสไลด์ (ใช้ "Letta Code" เท่านั้น)

### ⚠️ Invocation count ไม่ขึ้นสไลด์

ตัวเลข 59/21/10 เป็น speaker-note material เท่านั้น ไม่ขึ้น projected copy เพราะ raw audit ครอบทุก Skill surface ไม่ใช่เฉพาะ portable Mahiro Skills

---

## Fact-Check Summary

ตรวจทุก product/date/capability claim ใน projected-copy map ข้างต้นแล้วกับ `history.md` และ `talk-notes.md`:

- ✅ ลำดับ chronology ถูกต้อง: AI Chat → Claude Code → MCP memory (26 ม.ค.) → OpenCode (30 ม.ค.) → Letta (กลางพ.ค.)
- ✅ ไม่มี "Mahiro Code" ใน projected copy
- ✅ ไม่มี "Soul Vibe" ใน projected copy
- ✅ ไม่มี DM quotes ใน projected copy
- ✅ Slide 4 อยู่ก่อน Slide 5 (MCP before OpenCode) ตรงตาม approved direction
- ✅ Slide 6 ทำให้ Letta เป็นเหตุผลหลัก; Skills เป็น supporting mention
- ✅ Slide 11 primary = `mahiro-*` core family; secondary = `recap`/`rrr`/`direct-cli`/`fable`
- ✅ `ผม` ไม่ปรากฏใน projected copy ทั้ง 12 slides
- ✅ ไม่มี claim ที่อยู่ในรายการห้าม

---

## ไม่มี `asset-request.md` ในรอบนี้

ยังไม่ต้องการ generated image เพราะ Grok ยังไม่ได้ออกแบบ Slide 1 composition ของ groomed candidate ถ้า Grok หรือ Mahiro ร้องขอ abstract hero image ภายหลัง จะสร้าง `asset-request.md` พร้อม exact prompt, aspect ratio, provenance requirements และ no-text/no-fake-logo constraint ตามที่ approved feedback กำหนด
