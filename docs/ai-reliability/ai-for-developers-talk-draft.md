# My AI Dev System: Tools, Models, Workflow, and the Missing Layers I Built

> **Historical source notes — superseded for presentation order on 18 สิงหาคม 2026.** The active talk now focuses on Mahiro's concrete code workflow rather than tool chronology. Current slides and notes live in [`apps/frontend-labs/ai-dev-slides/groomed-grok-opus/index.html`](../../apps/frontend-labs/ai-dev-slides/groomed-grok-opus/index.html); use this file only as background material.

> จากการใช้ AI tools ไปจนถึงการสร้างระบบรอบมันเอง

สถานะ: Draft v2 สำหรับ session knowledge sharing ภายในทีม Developer  
ระยะเวลาที่แนะนำ: พูด 35–40 นาที + Q&A 10 นาที  
ข้อมูลเครื่องมือและโมเดลเป็น snapshot ณ วันที่ 14 สิงหาคม 2026

> Direction update — 15 สิงหาคม 2026 (historical): ไฟล์นี้เป็นคลังวัตถุดิบ terminology และ source notes ไม่ใช่ลำดับนำเสนอปัจจุบัน chronology และ evidence boundary ยังให้ยึด [`mahiro-ai-dev-history.md`](./mahiro-ai-dev-history.md) เป็นหลัก

> Evidence update — 15 สิงหาคม 2026: chronology, direct quotes, confirmed motivations, inferred boundaries และ public-safe history อยู่ที่ [`mahiro-ai-dev-history.md`](./mahiro-ai-dev-history.md) หากข้อความในไฟล์นี้ขัดกับ history ปัจจุบัน ให้ตรวจ evidence owner ก่อนนำไปพูด

---

## แกนของ Session

Session นี้ไม่ใช่การสอนว่า AI ตัวไหนเก่งที่สุด และไม่ใช่การแจก prompt สำเร็จรูป แต่เป็นการแชร์ว่า:

1. ผมค่อย ๆ เปลี่ยนเครื่องมือที่ใช้ตามปัญหาที่เจอยังไง
2. ตอนนี้เลือกโมเดลตามบทบาทแบบไหน
3. Workflow ที่ใช้กับงานจริงหน้าตาเป็นยังไง
4. ทำไม tools ที่มีอยู่ยังไม่พอ จนต้องใช้ Herdr สร้าง Agent Halo และเขียน skills ของตัวเอง
5. เคยทำอะไรพัง และเปลี่ยนความผิดพลาดเหล่านั้นเป็นกติกาถาวรยังไง

ถ้าผู้ฟังจำได้เพียงประโยคเดียว อยากให้เป็นประโยคนี้:

> ระบบ AI ที่ดีไม่ใช่ระบบที่ไม่เคยผิด แต่เป็นระบบที่ทำให้เราเห็นความผิดเร็ว จำกัดความเสียหาย และเปลี่ยนมันเป็นบทเรียนสำหรับครั้งต่อไป

---

## สิ่งที่ผู้ฟังควรได้กลับไป

- แยกออกว่า model, tool และ agent ไม่ใช่สิ่งเดียวกัน
- เลือกเครื่องมือจากลักษณะงานและปัญหาของตัวเอง ไม่ใช่จากกระแสอย่างเดียว
- เลือกโมเดลตามบทบาท แทนการหาโมเดลที่ “เก่งที่สุดทุกเรื่อง”
- เห็นตัวอย่าง workflow ที่เริ่มจาก repo จริงและจบด้วยหลักฐาน
- เห็นว่า Herdr, Agent Halo และ skills แก้ปัญหาคนละชั้นของระบบ
- รู้ว่าควรเก็บบทเรียนจากความผิดพลาดไว้ตรงไหน เพื่อไม่ให้ AI ทำผิดซ้ำ

---

# โครง Session

## Part 0 — Model, Tool และ Agent ต่างกันยังไง? — 3 นาที

ควรปูพื้นส่วนนี้ก่อนพูดชื่อผลิตภัณฑ์ เพราะ GPT, Claude, OpenCode และ Letta Code ไม่ได้อยู่ในชั้นเดียวกัน

### Model

เครื่องยนต์ที่คิดและสร้างคำตอบ เช่น GPT, Claude, Gemini และ Kimi

Model เพียงอย่างเดียวไม่ได้เปิด repository หรือรัน tests ได้เอง สิ่งเหล่านี้เกิดจากเครื่องมือที่นำ model ไปเชื่อมกับระบบภายนอก

### Tool หรือ Agent Harness

สภาพแวดล้อมที่นำ model มาต่อกับความสามารถอื่น เช่น:

- อ่านและแก้ไฟล์
- รัน terminal commands
- เปิด browser
- เก็บ memory
- เรียก subagents
- ควบคุม permissions

ตัวอย่างใน Session นี้คือ OpenCode และ Letta Code ส่วน Herdr เป็น execution/control layer ที่ช่วยจัดพื้นที่และมองเห็น agent CLI หลายตัว ไม่ใช่ model หรือ coding agent อีกตัวหนึ่ง

### Agent

Model ที่ได้รับเป้าหมาย คำสั่ง เครื่องมือ และสามารถตัดสินใจทำงานต่อเนื่องหลายขั้นได้

```text
อ่าน error
→ หาไฟล์ที่เกี่ยวข้อง
→ ตั้งสมมติฐาน
→ แก้โค้ด
→ รัน test
→ อ่านผลแล้วตัดสินใจขั้นต่อไป
```

### คำเปรียบเทียบสั้น ๆ

> Model คือเครื่องยนต์ ส่วน agent harness คือรถและระบบควบคุม เราเปลี่ยนเครื่องยนต์ในรถคันเดิมได้

---

## Part 1 — My AI Tool Journey — 10 นาที

เล่าส่วนนี้เป็น **วิวัฒนาการของความต้องการ** ไม่ใช่การแข่งขันว่าตัวใหม่ชนะตัวเก่า

### ช่วงที่ 1: ใช้ AI Chat เป็นผู้ช่วยคิด

เครื่องมือในช่วงนี้: AI Chat เช่น Claude, ChatGPT หรือบริการแชทอื่น

สิ่งที่ต้องการ:

- ช่วยอธิบาย logic
- ร่าง code
- ช่วยหาสาเหตุของ error
- แก้ปัญหาเฉพาะหน้า

ข้อจำกัดที่เริ่มรู้สึก:

- ต้องคอยนำ code และ context ไปให้ใหม่
- ความรู้จากงานก่อนหน้าไม่ได้ไหลต่อมางานถัดไปโดยอัตโนมัติ
- คนยังต้องเป็นผู้เชื่อม browser, editor, terminal และ repository เอง

คำที่ใช้บนเวทีควรเป็น `AI Chat` ก่อน แล้วค่อยยก Claude หรือ ChatGPT เป็นตัวอย่าง เพื่อไม่ให้ผู้ฟังสับสนกับ Claude Code ซึ่งเป็นเครื่องมืออีกชั้นหนึ่ง

### ช่วงที่ 2: เริ่มใช้ Coding Agent ผ่าน Claude Code

Claude Code เป็น coding agent ตัวแรกที่ Mahiro ใช้จริงจังก่อน OpenCode

สิ่งที่ดีขึ้น:

- อ่านและแก้ไฟล์ใน workspace ได้โดยตรง
- รัน commands และ tests ได้
- ลดการ copy code ข้ามไปมาระหว่าง chat กับ editor
- ทำงานข้ามหลายไฟล์และ tools ภายในโปรเจกต์ได้

ข้อเท็จจริงจากเอกสารทางการปัจจุบัน:

> Claude Code เรียกตัวเองว่า agentic coding tool ที่อ่าน codebase, แก้ไฟล์ รัน commands และเชื่อมกับ development tools

ดังนั้นห้ามเล่าว่า OpenCode เป็นครั้งแรกที่ AI เข้าไปทำงานใน repository เพราะ Claude Code ทำสิ่งนี้ได้ก่อนแล้วใน journey ของ Mahiro

ช่วงเดียวกัน Mahiro พยายามต่อ MCP เพื่อทำ memory layer ครอบ Claude Code ให้ค้นและใช้ข้อมูลข้าม session ได้ ประโยค “เราใช้ memory_search บ่อยเหมือนกัน แต่เราไม่เคยเก็บ data ลงไปเลยป่ะนะ” ชี้ให้เห็นข้อจำกัดสำคัญ: มีเครื่องมือค้น memory อย่างเดียวไม่พอ ถ้า workflow ไม่ได้เลือกและบันทึกสิ่งที่ควรนำกลับมาใช้

### ช่วงที่ 3: ต้องการ Model/Provider Flexibility และ Multi-Agent Layer

เครื่องมือในช่วงนี้:

- OpenCode เป็น host/runtime และ coding-agent foundation
- `oh-my-opencode` เป็น opinionated multi-model agent orchestration harness ที่ใช้ร่วมกันในตอนนั้น โดยติดตั้งผ่าน plugin mechanism ของ OpenCode

เหตุผลส่วนตัวที่ขยับจาก Claude Code มา OpenCode:

- ต้องการเลือก model และ provider ได้ยืดหยุ่นขึ้น
- ต้องการใช้ ChatGPT Plus/Pro subscription ผ่าน browser authentication
- สนใจ ecosystem ที่ประกอบ agent หลายบทบาทและควบคุม workflow ได้มากขึ้น
- ใช้ Oh My OpenCode เพื่อเพิ่ม agents เฉพาะทาง hooks, tools, model routing, continuation loops และ orchestration workflow บน OpenCode

ข้อเท็จจริงจากเอกสารทางการปัจจุบัน:

- OpenCode รองรับการเลือก `ChatGPT Plus/Pro` ใน `/connect` แล้วเปิด browser ให้ authenticate โดยตรง
- Repo `code-yeongyu/oh-my-opencode` ปัจจุบัน redirect ไป `oh-my-openagent`
- ชื่อ package และ compatibility surfaces บางส่วนยังใช้ `oh-my-opencode` ระหว่างช่วงเปลี่ยนชื่อ
- Overview ของโครงการนิยาม Oh My OpenAgent ว่า `a multi-model agent orchestration harness for OpenCode`
- ROADMAP ระบุว่า `Oh-my-opencode is a harness for agents` และเรียก OpenCode ว่า `the current host`
- OpenCode Ultimate edition ถูกติดตั้งผ่าน plugin mechanism ใน `opencode.json` และเพิ่ม agents, lifecycle hooks, MCPs, commands และ Team Mode

คำเรียกที่แม่นกว่า:

> OpenCode เป็น host/runtime และ coding-agent foundation ส่วน Oh My OpenCode เป็น opinionated orchestration harness ที่ติดตั้งบน host นั้น คำว่า plugin อธิบายรูปแบบการเชื่อมต่อ แต่ไม่ได้ลดบทบาทเชิงพฤติกรรมของมันให้เหลือเพียง add-on เล็ก ๆ

ความต้องการที่ตามมา:

- อยากให้ความรู้เรื่องโปรเจกต์และ preference ต่อเนื่องข้ามวัน
- อยากมีตัวหลักที่ถือภาพรวม แม้จะเปลี่ยน model หรือเรียก specialist มาช่วย
- ไม่อยากเริ่มสร้างความสัมพันธ์และอธิบายตัวเองใหม่ทุก session

### ช่วงที่ 4: ต้องการ Main Coding Companion ที่ทำงานด้วยกันระยะยาว

เครื่องมือปัจจุบัน: Letta Code

เหตุผลที่เข้ากับวิธีทำงานปัจจุบัน:

- Agent มี identity และ memory ต่อเนื่อง
- แยกหลาย conversation ได้ แต่ยังใช้ความรู้ร่วมกันภายใต้ agent เดิม
- เปลี่ยน model ได้โดยไม่ต้องเปลี่ยน main companion
- เรียก specialist agents หรือ direct CLI อื่นมาช่วย แล้วให้ main agent ถือภาพรวมต่อ
- บทเรียนจากการทำงานสามารถถูกเก็บเป็น memory, skills หรือ repo instructions ได้

ประโยคหลักของช่วงนี้:

> ผมไม่ได้ย้ายเพราะเครื่องมือตัวก่อนแย่ แต่โจทย์ของผมเปลี่ยนจาก “ช่วยทำ task นี้” มาเป็น “ช่วยทำงานร่วมกันระยะยาว”

### ช่วงที่ 5: เริ่มสร้างชั้นที่ยังขาดรอบเครื่องมือเหล่านี้

พอเริ่มใช้ main agent, specialist agents และ direct CLI หลายตัวพร้อมกัน ปัญหาไม่ได้อยู่ที่ model อย่างเดียวอีกต่อไป แต่กลายเป็นคำถามใหม่:

- Agent ตัวไหนกำลังทำงาน รอ หรือจบแล้ว
- งานไหนอยู่ pane หรือ workspace ใด
- จะกลับไปดู output และควบคุม lane ที่ถูกต้องยังไง
- ทำยังไงให้สถานะเหล่านี้มองเห็นได้โดยไม่ต้องเฝ้า terminal
- ทำยังไงให้ workflow ที่เรียนรู้แล้วถูกนำกลับมาใช้ซ้ำอย่างสม่ำเสมอ

สิ่งที่เข้ามาตอบโจทย์แต่ละชั้น:

| ชั้นที่ขาด | สิ่งที่ใช้หรือสร้าง | หน้าที่ในระบบปัจจุบัน |
| --- | --- | --- |
| Execution visibility และ pane orchestration | Herdr | จัด agents เป็น tabs/panes ที่มองเห็นได้ เปิด lane แบบ interactive อ่าน output กลับ และกลับไป focus งานที่ถูกต้อง |
| Ambient presence และ human awareness | Agent Halo | แปลง Letta lifecycle/tool/session events เป็นสถานะที่มองเห็นได้ เช่น working, waiting, done และ error โดยไม่ต้องอ่าน transcript |
| Procedural memory และ repeatability | Mahiro Skills | เก็บขั้นตอน scripts, assets, checks และ guardrails สำหรับงานที่ต้องทำซ้ำ ให้ model หรือ agent ตัวอื่นใช้ workflow เดิมได้ |
| Letta-specific runtime extension | Mahiro Mods | เพิ่ม commands, tools, state, events, permissions และ panels ให้ Letta Code โดยไม่ย้าย portable procedure ทั้งหมดเข้า mod |

ประโยคเปลี่ยนผ่าน:

> ช่วงแรกผมเลือกเครื่องมือที่ช่วยเขียนโค้ด แต่ช่วงหลังผมเริ่มสร้างระบบที่ช่วยให้มองเห็น ควบคุม และสอน AI ให้ทำงานแบบเดิมได้ดีขึ้นเรื่อย ๆ

### My Current AI Dev System

```text
Models
  ↓ ให้ความสามารถด้านการคิดและสร้างงาน
Letta Code
  ↓ เป็น main companion และถือบริบทระยะยาว
Mahiro Mods
  ↓ ขยาย commands, tools, state และ runtime behavior เฉพาะ Letta Code
Herdr
  ↓ เปิดและจัด execution lanes ให้มองเห็นและควบคุมได้
Agent Halo
  ↓ ทำให้ lifecycle และสถานะกลายเป็น ambient human-readable presence
Skills + Repo Instructions + Memory
  ↓ เก็บ portable workflow, project truth และ preference ไว้ใช้ข้ามงาน
```

นี่ไม่ใช่ architecture ที่ทุกคนต้องทำตาม แต่เป็นภาพว่าระบบส่วนตัวค่อย ๆ โตขึ้นจาก pain ที่เจอจริงยังไง

---

## เครื่องมือเหล่านี้อยู่ตรงไหนของภาพรวม

ไม่ควรนำเสนอเป็น feature battle เพราะความสามารถทับซ้อนกันมากและเปลี่ยนเร็ว ให้พูดถึง **จุดศูนย์กลางของผลิตภัณฑ์ตามคำอธิบายทางการ** แทน

| เครื่องมือ | จุดศูนย์กลางตามคำอธิบายทางการ |
| --- | --- |
| Claude Code | Agentic coding tool ที่อ่าน codebase, แก้ไฟล์ รัน commands และเชื่อมกับ development tools |
| OpenCode | Open-source AI coding agent สำหรับทำงานกับ code และ workspace |
| Oh My OpenCode / Oh My OpenAgent | Multi-model agent orchestration harness สำหรับ OpenCode ติดตั้งผ่าน plugin mechanism และเพิ่ม opinionated agents, hooks, tools, model routing และ multi-agent workflows; ชื่อเดิมยังอยู่ใน package/compatibility surfaces บางส่วน |
| OpenClaw | Personal AI assistant สำหรับผู้ใช้หนึ่งคน เชื่อม models, tools, devices และช่องทางสื่อสารผ่าน Gateway |
| Hermes Agent | General AI agent ที่เน้น learning loop, persistent memory, skills, automation, messaging และหลาย runtime environments |
| Letta Code | Stateful agent harness ที่เน้น persistent identity, memory, conversations และการเปลี่ยน models/tools ภายใน agent เดิม |

ข้อความที่ต้องพูดกำกับตาราง:

> นี่คือจุดเน้น ไม่ใช่ขอบเขตตายตัว ทุกตัวมีความสามารถทับซ้อนกัน สิ่งที่ผมเล่าคือเหตุผลที่ Letta Code เข้ากับวิธีทำงานของผม ไม่ใช่ประกาศว่ามันชนะทุกตัว

### Claims ที่ต้องหลีกเลี่ยง

- “Letta เป็นตัวเดียวที่มี memory” — ไม่จริง เพราะ Hermes และระบบอื่นก็มี persistent memory
- “OpenClaw หรือ Hermes เป็นแค่ของทดลอง” — ไม่ตรงกับสถานะและคำอธิบายปัจจุบันของโครงการ
- “Letta Code มาแทนทุกเครื่องมือ” — ไม่ตรงกับ workflow จริง เพราะยังเรียก model, CLI และ specialist อื่นมาช่วย
- “OpenCode เป็น stateless เสมอ” — กว้างเกินหลักฐานและไม่จำเป็นต่อเรื่องที่ต้องการเล่า
- “OpenCode เป็นครั้งแรกที่ AI ทำงานใน repo ให้ผม” — ไม่ตรงกับ journey เพราะ Mahiro ใช้ Claude Code ก่อน
- “Oh My OpenCode เป็นแค่ plugin” — รูปแบบการติดตั้งเป็น plugin แต่โครงการนิยามบทบาทของตัวเองเป็น multi-model agent orchestration harness; ควรแยก packaging ออกจาก functional role
- “เครื่องมือนี้ดีที่สุด” — ควรเปลี่ยนเป็น “เหมาะกับความต้องการของผมในตอนนี้”

---

## Part 2 — Models I Actually Use — 6 นาที

ไม่จัดอันดับโมเดลแบบสากล แต่แสดงว่าใน workflow ปัจจุบันแต่ละบทบาทใช้ model แบบไหน

ข้อความนำ:

> อย่าถามว่าโมเดลไหนเก่งที่สุด ให้ถามว่างานนี้ต้องการบทบาทแบบไหน และเราจะตรวจผลงานด้วยอะไร

### 1. Main / Coordinator

หน้าที่:

- ถือภาพรวมและบริบทระยะยาว
- ตัดสินใจเรื่อง architecture และ trade-offs
- ประสาน specialist agents
- ตรวจข้อสรุปและเตรียม final handoff

Current snapshot:

- GPT-5.6 Sol High

### 2. Fast Scoped Worker

หน้าที่:

- สำรวจข้อมูลด้วยคำถามที่ชัด
- implement งานที่ระบุไฟล์และ acceptance criteria แล้ว
- สร้างทางเลือกหรือให้มุมมองที่สอง

Current snapshot:

- Gemini 3.6 Flash High

### 3. Scout / Reviewer / Verifier

หน้าที่:

- สำรวจ codebase โดยไม่แก้ไฟล์
- ตรวจ diff ในมุมเฉพาะทาง
- พยายามหักล้างข้อสรุปของ agent ที่สร้างงาน
- ตรวจ Git state หรือทำงาน release/commit ที่มีขอบเขตชัด

Current examples:

- Luna สำหรับ scout หรืองานยาวที่ต้องสำรวจ
- Terra สำหรับ specialist review
- Claude Opus/Sonnet สำหรับ review หรือมุมมองอีกแบบเมื่อเหมาะกับโจทย์
- Codex Spark สำหรับ commit lane ที่แยกหน้าที่ชัด

ไม่จำเป็นต้องนำชื่อทั้งหมดขึ้นสไลด์ เลือกเฉพาะ 1–2 ตัวที่มีตัวอย่างจากงานจริง

### 4. Visual Direction / Creative Experiment

หน้าที่:

- ทดลอง visual direction
- ดู raw creative output ของแต่ละ model
- แยก taste ownership ออกจาก production implementation

ตัวอย่างจากประสบการณ์:

- Kimi หรือ Gemini เคยเหมาะกับ visual direction บางโจทย์
- Codex/ChatGPT ยังเหมาะกับ implementation, debugging และ mechanical correctness
- ผล A/B หนึ่งครั้งเป็นหลักฐานของโจทย์นั้น ไม่ใช่กฎสากลว่า model ใดชนะตลอดไป

### Caveat ที่ต้องแสดงบนสไลด์

> Current setup — August 2026  
> รายชื่อ model เป็น snapshot จากงานของผม ไม่ใช่ recommendation ถาวร

---

## Part 3 — My Current Workflow — 10 นาที

ควรใช้ task จริงหนึ่งงานเดินตั้งแต่ต้นจนจบ แทนการสอน workflow แบบทฤษฎีล้วน

### ภาพรวม

```text
รับโจทย์
→ ดูสถานะและของจริงใน repo
→ หาไฟล์ อาการ หรือ command ที่เป็นจุดเริ่มต้น
→ ตั้งสมมติฐานที่มีทางพิสูจน์ว่าผิด
→ เลือก main/specialist ที่เหมาะกับงาน
→ แก้ส่วนที่เล็กที่สุดซึ่งมีหลักฐานรองรับ
→ รันการตรวจที่ตรงกับข้อสรุป
→ ให้คนตัดสินเรื่อง product หรือ visual
→ เก็บบทเรียนที่ควรใช้ในครั้งต่อไป
```

### 1. เริ่มจากของจริงใน repository

ใช้ code, config, logs, tests และ behavior ปัจจุบันเป็นหลัก ไม่เริ่มจากความจำของ model

คำสั้นที่ใช้บนเวที:

> ดูของจริงใน repo ก่อนเดา

### 2. ตั้งสมมติฐานก่อนแก้

ตัวอย่าง:

> สมมติฐาน: หน้า profile redirect เพราะ auth guard ตีความสถานะ `loading` เป็น `unauthenticated`

จากนั้นถามต่อว่า:

> ถ้าสมมติฐานนี้ผิด เราจะเห็นหลักฐานอะไรได้เร็วที่สุด?

### 3. เลือก agent ตามขอบเขต

- Main agent ถือภาพรวมและตัดสินใจ
- Scout หา code path โดยไม่แก้ไฟล์
- Writer แก้เฉพาะส่วนที่ได้รับมอบหมาย
- Reviewer ตรวจเฉพาะ contract หรือ risk ที่ระบุ
- Verifier พยายามหาหลักฐานว่าข้อสรุปยังผิดอยู่

### 4. เลือกหลักฐานให้ตรงกับข้อสรุป

| สิ่งที่ต้องการพิสูจน์ | หลักฐานที่เหมาะกว่า |
| --- | --- |
| Function คืนค่าถูก | Unit test |
| หลาย module ทำงานร่วมกันได้ | Integration test |
| Type และ imports ถูก | Typecheck / build |
| User flow กดใช้งานได้ | Browser interaction test |
| UI ไม่ล้นหรือซ้อนกัน | Render หลาย viewport + geometry checks |
| หน้าตาตรง reference | Screenshot comparison + human visual review |
| Built runtime โหลด dependency ได้จริง | Runtime smoke test ผ่าน built artifact |

ตัวอย่างการรายงานที่พูดเกินหลักฐาน:

> Build ผ่าน ดังนั้น feature เสร็จแล้ว

ตัวอย่างที่ตรงกว่า:

> Typecheck และ build ผ่านแล้ว ส่วน browser interaction และ mobile visual ยังไม่ได้ตรวจ

### 5. Human ยังเป็นเจ้าของคำว่า “ผ่าน”

AI ช่วยสร้างและตรวจงานได้ แต่เกณฑ์ว่าอะไรดีพอยังต้องมาจากเจ้าของงาน

ตัวอย่างเรื่องที่ยังต้องใช้ human judgment:

- Product behavior ตรงกับสิ่งที่ผู้ใช้ต้องการหรือไม่
- Visual direction และรายละเอียด UI ดูถูกต้องหรือไม่
- Copy สื่อสารได้ตามเจตนาหรือไม่
- Trade-off ทางธุรกิจยอมรับได้หรือไม่

---

## Part 4 — Why I Built the Missing Layers — 12 นาที

ชื่อไทย:

> ทำไมใช้ AI อย่างเดียวไม่พอ จนต้องสร้างระบบรอบมันเอง

แกนของส่วนนี้ไม่ใช่ “ผมสร้างของเยอะ” แต่คือ:

> ทุกชิ้นเกิดจาก pain ที่เครื่องมือชั้นเดิมยังตอบไม่ครบ

### Pain 1: หลาย agents ทำงานได้ แต่คนควบคุมเริ่มมองไม่เห็น

เมื่อมีหลาย CLI agents, หลาย workspaces และหลายงานพร้อมกัน terminal แบบเดิมเริ่มตอบคำถามได้ยาก:

- Agent อยู่ตรงไหน
- กำลังทำงานหรือรอ input
- Prompt ถูกส่งจริงหรือยัง
- Output ล่าสุดคืออะไร
- จะกลับไป focus pane ที่ถูกต้องได้ยังไง

#### ทำไมใช้ Herdr

สำหรับ workflow นี้ Herdr ทำหน้าที่เป็น **execution workspace และ control layer**:

- หนึ่ง job อยู่ใน tab ที่ตั้งชื่อได้
- แต่ละ agent อยู่ใน pane ที่มองเห็นได้
- ใช้ interactive CLI จริง ไม่ซ่อนทุกอย่างไว้ใน headless process
- Main agent สามารถเปิด lane, ส่ง prompt, อ่าน output, รอ lifecycle และปิดงานได้อย่างมีขอบเขต
- คนยังเปิดดู pane และเห็นสิ่งที่ agent เห็นได้

Herdr ไม่ได้แก้เรื่อง intelligence หรือ memory โดยตรง แต่มันทำให้การทำงานของ agents หลายตัว **มองเห็นและควบคุมได้มากขึ้น**

### Pain 2: สถานะมีอยู่ในระบบ แต่คนต้องเฝ้า terminal จึงจะรับรู้

แม้ Herdr ช่วยจัด execution lanes ได้ แต่ยังมีคำถามด้าน human experience:

- ต้องเปิด control room ตลอดเวลาหรือไม่
- ถ้ากำลังทำงานอย่างอื่น จะรู้ได้ยังไงว่า agent ต้องการความสนใจ
- จะเห็นหลาย sessions แบบ ambient โดยไม่ถูกแย่ง focus ได้ยังไง
- Agent จะรู้สึกเป็น presence ที่อยู่ร่วมกับเรา มากกว่า process ที่ซ่อนใน terminal ได้หรือไม่

#### ทำไมสร้าง Agent Halo

Agent Halo เป็น local companion/presence layer ที่รับ Letta-native lifecycle, turn และ tool events แล้วแปลงเป็น surface แบบ notch บน macOS

สิ่งที่ต้องการไม่ใช่ dashboard อีกอัน แต่คือ:

- เห็น working, waiting, done และ error ได้ในพริบตา
- เห็น session และ workspace ที่เกี่ยวข้อง
- กลับไป focus งานที่ถูกต้องเมื่อจำเป็น
- ไม่ดึง transcript หรือเนื้อหางานส่วนตัวมาเป็นแกนของระบบ
- ไม่ขโมย focus ระหว่างที่คนกำลังทำงานอื่น
- เพิ่มความรู้สึกของ companion ผ่าน presence, motion และ mascot โดยยังรักษาความจริงของสถานะ

แนวคิดที่แชร์ได้:

> Agent ที่ฉลาดแต่คนมองไม่เห็นว่ามันกำลังทำอะไร ยังเป็นระบบที่ใช้งานร่วมกันยาก Intelligence อย่างเดียวไม่พอ ระบบต้อง legible ต่อมนุษย์ด้วย

### Pain 3: Memory จำบทเรียนได้ แต่ยังไม่ได้แปลว่าจะทำงานซ้ำได้ดี

Memory เหมาะกับข้อมูลว่า:

- ผมชอบหรือไม่ชอบอะไร
- โปรเจกต์นี้มีข้อจำกัดอะไร
- ครั้งก่อนเคยตัดสินใจอะไรไว้

แต่ workflow บางประเภทต้องการมากกว่าข้อความเตือน เช่น:

- ต้องทำขั้นตอนตามลำดับ
- ต้องใช้ script หรือ tool เฉพาะ
- ต้องมี input/output contract
- ต้องรัน checks หลายชนิด
- ต้องเก็บ assets, templates หรือ references ไว้ด้วย

#### ทำไมสร้าง Skills

Skill คือ **procedural memory** หรือ “ความจำเรื่องวิธีทำ” ไม่ใช่เพียง prompt ที่ยาวขึ้น

หนึ่ง skill อาจประกอบด้วย:

- คำอธิบายว่าใช้เมื่อไรและไม่ควรใช้เมื่อไร
- ขั้นตอนการทำงาน
- scripts ที่รันซ้ำได้
- templates หรือ prompt contracts
- reference material
- validation และ promotion gates
- ข้อห้ามจาก failure ที่เคยเกิดขึ้น

ตัวอย่างเหตุผลที่สร้าง skills จากงานจริง:

- `direct-cli` — ทำให้การเปิด Cursor, Agy, Codex หรือ Pi ผ่าน Herdr/tmux ใช้กติกาเดียวกันและมองเห็นได้
- `sprite-workflow` — งาน sprite ไม่ได้จบที่ prompt ต้องมี extraction, scale, baseline, alpha, manifest และ visual QA
- `kien-thai` — การเขียนภาษาไทยต้องมี frame และ audit ที่เฉพาะกว่าคำสั่งว่า “เขียนให้เป็นธรรมชาติ”
- `git-commit` — แยกการตรวจ Git state, staging และ commit ออกจาก agent ที่เพิ่งแก้โค้ด
- `preserving-visual-direction` — ป้องกันไม่ให้ production agent เปลี่ยน taste ของ visual owner ที่ได้รับการยอมรับแล้ว

หลักฐาน current runtime วันที่ 17 สิงหาคม 2026 รองรับ portability นี้โดยตรง: `mahiro-skills` มี adapters สำหรับ OpenCode, Claude Code, Cursor, Gemini CLI, Agy, Codex, Letta Code และ Pi ขณะที่ managed Agy receipt มี Mahiro Skills ติดตั้งอยู่ 24 skills ส่วน `@mahirocoko/letta-mods@0.8.9` ทำงานอยู่เฉพาะใน Letta Code ดังนั้น Letta Code เป็น main relationship แต่ skills ไม่ได้ถูกล็อกไว้กับ main agent ตัวเดียว

Letta Skill audit ของ agent นี้ตั้งแต่ 1 มิถุนายนถึง 17 สิงหาคม 2026 พบ 2,755 invocations ตัวที่ใช้บ่อยสุดคือ `git-commit` (401), `ccc` (349), `rrr` (272), `playwright-cli` (263), `direct-cli` (188), `recap` (117), `kien-thai` (103) และ `codex-asset-production` (82) ตัวเลขนี้สะท้อน ecosystem ที่ใช้งานจริง ไม่ได้หมายความว่าทุกตัวอยู่ใน `mahiro-skills` bundle ปัจจุบัน

บนสไลด์ไม่ควรใช้ raw top list นี้แทน portable workflow core เพราะจะปน runtime/global skills กับ Mahiro Skills ให้แยก Mahiro core family (`mahiro-style`, `mahiro-guidance-refine`, `mahiro-docs-rules-init`) ออกจาก workflow ที่หยิบใช้ประจำ (`recap`, `rrr`, `direct-cli`, `fable`) พร้อมอธิบายว่า `/mh-*` เป็นชื่อ alias ที่ Agy สร้างตอนติดตั้ง ไม่ใช่ชื่อ family

หลักตัดสินใจก่อนสร้าง skill:

```text
งานนี้เกิดซ้ำหรือยัง?
→ มีขั้นตอนหรือข้อห้ามที่ต้องทำเหมือนเดิมหรือไม่?
→ ความผิดพลาดมีต้นทุนสูงพอให้สร้าง guardrail หรือไม่?
→ ต้องพก scripts, assets หรือ references ไปด้วยหรือไม่?
```

ถ้าคำตอบส่วนใหญ่คือ “ไม่” ให้ใช้ prompt หรือ repo note ธรรมดาก่อน ไม่ต้องเปลี่ยนทุกเรื่องให้เป็น skill

### Pain 4: ระบบที่สร้างขึ้นยังทำพลาดได้

Herdr, Agent Halo, memory และ skills ไม่ได้ทำให้ AI ถูกเสมอ สิ่งที่ทำให้ระบบดีขึ้นจริงคือเอา failure กลับไปแก้ชั้นที่เป็นเจ้าของปัญหา

เรื่องต่อไปนี้เป็นตัวอย่างว่า workflow ปัจจุบันถูกสร้างจาก failure ยังไง

ทุกเรื่องใช้โครงเดียวกัน:

```text
เกิดอะไรขึ้น
→ ทำไมวิธีเดิมเอาไม่อยู่
→ เปลี่ยนเป็นกติกาหรือ workflow ใหม่อะไร
```

### Failure 1: Writer หลายตัวแก้คนละไฟล์ แต่งานยังหายได้

เกิดอะไรขึ้น:

- เปิด Agy writers หลายตัวใน checkout เดียว
- แต่ละตัวแก้คนละไฟล์และได้ diff ที่ใช้ได้
- Writer ตัวหลัง restore checkout ไปยัง snapshot ของตัวเอง
- Uncommitted changes จาก writers ก่อนหน้าถูกลบ แม้ไม่มี file ownership ชนกัน

สิ่งที่เรียนรู้:

> “แก้คนละไฟล์” ไม่ได้แปลว่า parallel writes จะปลอดภัย ถ้า agents ยังแชร์ checkout และ lifecycle เดียวกัน

กติกาที่เพิ่ม:

- Read-only agents เปิดขนานได้
- Writers ใน current checkout ต้องทำทีละตัว
- จบ writer หนึ่งตัวให้ตรวจ status และ diff ทันที
- ถ้าต้อง parallel write จริง ต้องแยก worktrees และกำหนด ownership ชัด

### Failure 2: Build ผ่าน แต่ของจริงยังไม่ผ่าน

เกิดอะไรขึ้น:

- Typecheck และ build ผ่าน
- Browser ไม่มี console error หรือ overflow
- แต่ visual direction หรือคุณภาพของทั้งหน้ายังไม่ผ่าน human review

สิ่งที่เรียนรู้:

- Build PASS ไม่ใช่ interaction PASS
- Interaction PASS ไม่ใช่ visual PASS
- Typography PASS ไม่ใช่ whole-product PASS
- Agent ที่สร้างงานไม่ควรเป็นคนประกาศเองว่างานสมบูรณ์

กติกาที่เพิ่ม:

> รายงานทุก PASS พร้อมขอบเขตของหลักฐาน ห้ามขยายข้อสรุปเกินสิ่งที่ตรวจจริง

### Failure 3: Context เยอะ แต่ข้อมูลขัดกัน

เกิดอะไรขึ้น:

- Code หรือ API เปลี่ยนแล้ว
- Docs, comments, generated prose หรือ memory บางส่วนยังเล่าโลกเก่า
- Agent รอบถัดไปเชื่อข้อมูลเก่าและกลับไปทำผิดอีก

สิ่งที่เรียนรู้:

> Context เยอะไม่สำคัญเท่า context สอดคล้องกัน

กติกาที่เพิ่ม:

- เมื่อ contract สำคัญเปลี่ยน ต้องอัปเดต textual owners ที่ยัง active
- เอกสารประวัติศาสตร์ต้องระบุว่าไม่ใช่ current source of truth
- ตรวจ context drift ไม่ใช่ตรวจเฉพาะ imports, types และ tests

### Optional Failure 4: เราไม่ได้กำลังวัด model ที่คิดว่าเราวัด

เกิดอะไรขึ้น:

- ต้องการทดสอบ native creative taste ของ model
- แต่ output ถูก main agent rewrite, polish หรือรวมกับผลจาก model อื่นก่อนให้คนดู
- ผลที่ได้จึงเป็นคุณภาพของ pipeline ไม่ใช่ raw capability ของ model ตัวนั้น

กติกาที่เพิ่ม:

- ถ้ากำลังทดสอบ native taste ต้องแสดง raw output ก่อน
- เก็บ exact prompt และ input เดิม
- Human เลือกหรือ reject ก่อนเริ่มแก้
- ผลจากการทดลองหนึ่งครั้งเป็น bounded evidence ไม่ใช่ universal ranking

ใช้ Failure 4 เฉพาะเมื่อมีเวลา 45 นาทีขึ้นไป หรือผู้ฟังสนใจงาน frontend/creative AI

---

## เปลี่ยน Failure ให้กลายเป็นสินทรัพย์ของทีม

```text
ความผิดพลาด
→ Rule ใน AGENTS.md
→ Checklist
→ Memory
→ Skill
→ Automated guardrail
```

ตัวอย่าง:

| ความผิดพลาดที่เกิดซ้ำ | สิ่งที่ควรสร้าง |
| --- | --- |
| ใช้ package manager ผิด | Repo instruction |
| ขยาย scope เกินโจทย์ | Non-goals + protected contracts |
| รายงาน PASS กว้างเกินหลักฐาน | Verification checklist |
| Workflow เฉพาะทำซ้ำหลายครั้ง | Reusable skill |
| Preference ส่วนตัวถูกลืมข้าม session | Persistent memory |
| คำสั่งเสี่ยงถูกรันโดยไม่ตั้งใจ | Permission หรือ automated guardrail |

คำถามที่ใช้ตัดสินว่าเก็บไว้ตรงไหน:

> ใครต้องรู้เรื่องนี้ และเรื่องนี้ควรมีอายุอยู่นานแค่ไหน?

- เฉพาะโปรเจกต์นี้ → เก็บใน repository
- เป็น preference ส่วนตัวข้ามโปรเจกต์ → เก็บใน agent memory
- เป็นขั้นตอนที่ทำซ้ำได้ → สร้าง skill หรือ script
- เป็นข้อห้ามด้านความปลอดภัย → สร้าง guardrail ที่บังคับใช้ได้

### ข้อสรุปของ Herdr, Agent Halo และ Skills

| สิ่งที่สร้างหรือเลือกใช้ | คำถามที่มันพยายามตอบ |
| --- | --- |
| Herdr | Agents กำลังทำงานอยู่ที่ไหน และเราจะมองเห็น/ควบคุม execution ยังไง |
| Agent Halo | คนจะรับรู้ lifecycle และสถานะหลาย sessions ได้อย่างเป็นธรรมชาติยังไง |
| Skills | วิธีทำงานที่เรียนรู้แล้วจะถูกนำกลับมาใช้ซ้ำโดย model หรือ agent ตัวอื่นยังไง |
| Memory | Preference และบทเรียนระยะยาวจะเดินทางข้าม conversations และ projects ยังไง |
| Repo instructions | ความจริงและกติกาเฉพาะโปรเจกต์จะอยู่ใกล้ code ที่สุดได้ยังไง |

ประโยคปิดส่วนนี้:

> ผมไม่ได้สร้างเครื่องมือเหล่านี้เพราะอยากมีระบบที่ซับซ้อนขึ้น แต่เพราะ pain เดิมเกิดซ้ำจนการแก้แบบครั้งต่อครั้งไม่พอแล้ว

# Demo ที่แนะนำ

ถ้ามี demo ให้ใช้ task เล็กที่เตรียมไว้ ไม่สร้าง application ทั้งตัวบนเวที

ตัวอย่าง: bug ที่หน้า profile redirect ระหว่าง session restore

```text
1. แสดงอาการจริง
2. ให้ main agent หา concrete anchor
3. ส่ง scout ไปหา code path
4. ตั้งสมมติฐานหนึ่งข้อ
5. ให้ writer แก้จุดเล็กที่สุด
6. รัน focused test
7. รัน browser smoke
8. รายงานว่าอะไรผ่านและอะไรยังไม่ได้ตรวจ
9. ถ้าพบบทเรียนใหม่ แสดงว่าจะเก็บไว้ตรงไหน
```

ควรมี video สำรอง หาก live model, network หรือ tool มีปัญหา

---

# สิ่งที่ควรตัดหรือย้ายไป Q&A

- รายละเอียด installation ของแต่ละ tool
- ตารางราคาและ token costs
- Benchmark ที่ไม่ได้ทดสอบกับงานจริงของตัวเอง
- รายชื่อ model ทุกตัวที่เคยลอง
- รายละเอียด config, JSON หรือ YAML
- สถาปัตยกรรมภายในของ OpenClaw, Hermes หรือ Letta ที่ไม่ได้จำเป็นต่อเรื่องเล่า
- Edge cases ของงาน visual และ image generation
- คำสั่ง Herdr และวิธีเปิด agents หลายตัวพร้อมกันแบบละเอียด

---

# Glossary สำหรับ Speaker Notes

ไม่จำเป็นต้องใส่ทุกคำลงสไลด์ ใช้ส่วนนี้เพื่อเตรียมคำอธิบายเวลามีคนถาม

## Stateful Agent

Agent ที่รักษาตัวตนและ state ข้าม session ได้ เช่น memory, model/tool configuration, message history และ conversations

ไม่ได้หมายความว่า agent จำทุกอย่างถูกต้องเสมอไป ข้อมูลเก่าหรือข้อมูลที่ขัดกันยังทำให้ตัดสินใจผิดได้

คำไทยที่ใช้ได้:

> Agent ที่มีความต่อเนื่อง ไม่ต้องเริ่มทำความรู้จักกันใหม่ทุกครั้ง

## Persistent Memory

ข้อมูลระยะยาวที่ยังอยู่แม้ conversation ปัจจุบันจบหรือ context window ถูกตัด

Memory เหมาะกับ preference, บทเรียน และข้อมูลที่ควรใช้ข้าม session แต่ต้องมีการอัปเดตเมื่อความจริงเปลี่ยน

## Context Window

ข้อมูลที่ model มองเห็นได้ใน turn ปัจจุบัน มีขนาดจำกัด เมื่อข้อมูลมากเกินไป เนื้อหาเก่าอาจถูกสรุปหรือนำออก

เปรียบเหมือนพื้นที่บนโต๊ะทำงาน ส่วน persistent memory เหมือนสมุดหรือคลังเอกสารที่หยิบกลับมาใช้ได้

## Agent Harness

ระบบที่นำ AI model มาประกอบกับเครื่องมือ ข้อมูล และกติกา จน model สามารถลงมือทำงานเป็น agent ได้จริง

พูดง่าย ๆ:

> Model เป็นสมอง ส่วน agent harness เป็นร่างกาย โต๊ะทำงาน เครื่องมือ และกฎความปลอดภัยรอบสมองนั้น

Agent harness อาจรับผิดชอบเรื่องต่อไปนี้:

- ส่ง prompt และ context ให้ model
- เปิด อ่าน และแก้ไฟล์
- รัน terminal commands
- เรียก browser หรือ external tools
- ควบคุม permissions และขออนุญาตก่อนทำสิ่งเสี่ยง
- เก็บ session, message history หรือ memory
- รันงานหลายขั้นต่อเนื่อง
- เรียก subagents
- ติดตาม lifecycle เช่น working, blocked และ done
- ส่งผลจาก tools กลับไปให้ model ตัดสินใจขั้นต่อไป

ตัวอย่างการทำงาน:

```text
ผู้ใช้สั่งงาน
→ Harness เตรียม context ให้ model
→ Model ตัดสินใจว่าจะอ่านไฟล์
→ Harness เปิดไฟล์และส่งผลกลับ
→ Model เสนอการแก้ไข
→ Harness แก้ไฟล์และรัน test
→ Model อ่านผลแล้วตัดสินใจขั้นต่อไป
```

แยกแต่ละชั้นในระบบนี้ได้ประมาณนี้:

| ชั้น | ตัวอย่าง | หน้าที่หลัก |
| --- | --- | --- |
| Model | GPT, Claude, Gemini, Kimi | คิด วิเคราะห์ และสร้างคำตอบ |
| Agent harness / agentic coding tool | Claude Code, OpenCode, Letta Code | เชื่อม model กับ files, tools, permissions และ workflow โดยแต่ละผลิตภัณฑ์มีจุดเน้นต่างกัน |
| Orchestration harness บน host | Oh My OpenCode / Oh My OpenAgent | ติดตั้งผ่าน plugin mechanism ของ OpenCode แล้วเพิ่ม agent roles, hooks, tools, routing, continuation และ opinionated multi-agent workflow |
| Execution/control layer | Herdr | จัดและควบคุม interactive agent CLI lanes ใน tabs/panes |
| Presence layer | Agent Halo | ทำให้ lifecycle และสถานะ agent มองเห็นและรับรู้ได้ง่าย |

ขอบเขตของผลิตภัณฑ์อาจทับซ้อนกัน เช่น Letta Code เป็นทั้ง CLI, agent harness และระบบ persistent memory จึงไม่ควรตีความตารางนี้เป็นหมวดหมู่ตายตัว

ภาษาที่แนะนำสำหรับพูดบนเวที:

> ระบบที่เอา model มาต่อกับไฟล์ เครื่องมือ ความจำ และกฎต่าง ๆ เพื่อให้มันลงมือทำงานได้จริง

หลังจากผู้ฟังเข้าใจคำอธิบายนี้แล้ว จึงค่อยบอกว่าระบบชั้นนี้มักถูกเรียกว่า **agent harness**

## Main Agent

Agent หลักที่ถือภาพรวม ความสัมพันธ์ และประวัติการตัดสินใจ ไม่จำเป็นต้องลงมือทำทุกอย่างเอง

## Specialist Agent

Agent ชั่วคราวที่รับงานแคบ เช่น scout, writer, reviewer หรือ verifier แล้วส่งผลกลับให้ main agent

## Repo Reality First

การยึด code, config, logs, tests และสถานะปัจจุบันใน repository ก่อนความจำหรือ pattern ทั่วไปของ model

คำไทยที่ใช้ได้:

> ดูของจริงใน repo ก่อนเดา

## Hypothesis

คำอธิบายชั่วคราวว่าสาเหตุของปัญหาน่าจะเป็นอะไร ยังไม่ถือเป็นข้อเท็จจริงจนกว่าจะมีหลักฐาน

## Falsifiable Hypothesis

สมมติฐานที่ระบุได้ว่าหลักฐานแบบไหนจะพิสูจน์ว่ามันผิด

คำไทยที่ใช้ได้:

> ข้อสงสัยที่มีทางพิสูจน์ว่าผิด

## Verification

การหาหลักฐานเพื่อยืนยันข้อกล่าวอ้างเฉพาะเรื่อง เช่น test ยืนยัน logic หรือ browser recording ยืนยัน user flow

หลักฐานทุกชิ้นมีขอบเขต จึงต้องบอกด้วยว่าตรวจอะไรและยังไม่ได้ตรวจอะไร

## Human Gate

จุดที่ต้องให้คนตัดสินก่อนถือว่างานผ่าน เช่น visual direction, product behavior, copy หรือ business trade-off

## Guardrail

กติกาหรือกลไกที่ช่วยลดพฤติกรรมเสี่ยง เช่น ห้ามแก้นอก scope, ห้าม push force หรือห้ามประกาศว่างานเสร็จก่อนตรวจหลักฐาน

## Orchestration

การจัดว่า agent ใดทำอะไร ทำเมื่อไร อยู่ที่ไหน และส่งผลกลับมาให้ใคร รวมถึงการควบคุมไม่ให้หลาย writers แก้ state เดียวกันโดยไม่มี ownership

Orchestration ไม่ได้ทำให้ model ฉลาดขึ้นโดยตรง แต่ช่วยให้หลาย agents ทำงานร่วมกันแบบที่คนยังตรวจสอบและหยุดได้

## Herdr

เครื่องมือจัด terminal workspaces, tabs, panes และ interactive agent lanes ที่ใช้ใน workflow นี้

เหตุผลหลักที่ใช้คือทำให้ execution ของ Cursor, Agy, Codex, Pi หรือ CLI agents อื่นยังมองเห็นได้ คนและ main agent สามารถกลับไปอ่าน output, focus pane และควบคุม lifecycle ของ lane ที่ถูกต้องได้

ใน Session นี้ควรอธิบาย Herdr ว่าเป็น **execution/control layer** ไม่ใช่ model และไม่ใช่ long-term memory system

## Agent Halo

Local macOS companion/presence project ที่ Mahiro สร้างขึ้นเพื่อแปลง Letta-native lifecycle, turn, tool และ session events เป็น ambient notch surface

เป้าหมายคือให้คนเห็นว่า agents กำลัง working, waiting, done หรือ error โดยไม่ต้องเฝ้า transcript หรือ terminal ตลอดเวลา พร้อมช่วยกลับไปหา session ที่ต้องการความสนใจ

Agent Halo จึงไม่ได้เพิ่ม intelligence ให้ model แต่เพิ่ม **legibility, awareness และความรู้สึกของการมี companion อยู่ร่วมกัน**

## Skill

ชุดคำสั่ง ขั้นตอน scripts, assets, references และ validation contracts สำหรับงานที่เกิดซ้ำ ช่วยให้ agent รอบถัดไปทำตามวิธีที่ผ่านการเรียนรู้แล้ว แทนการคิด workflow ใหม่ทุกครั้ง

Skill ต่างจาก memory ตรงที่ memory มักเก็บว่า “รู้อะไร” หรือ “เคยตัดสินใจอะไร” ส่วน skill เก็บว่า “งานชนิดนี้ควรทำอย่างไร” และอาจพกเครื่องมือที่ใช้ลงมือจริงไปด้วย

## Bounded Evidence

หลักฐานที่ใช้ได้เฉพาะขอบเขตที่ทดสอบ เช่น A/B test หนึ่งโจทย์บอกได้ว่า model ใดทำโจทย์นั้นดีกว่า แต่ยังสรุปไม่ได้ว่าเก่งกว่าทุกงาน

---

# เวลาแนะนำ

## แบบ 40 นาที

| ส่วน | เวลา |
| --- | ---: |
| Model vs Tool vs Agent | 3 นาที |
| Tool Journey | 10 นาที |
| Models by Role | 5 นาที |
| Current Workflow | 8 นาที |
| Missing Layers + Failures | 11 นาที |
| Closing | 3 นาที |

## แบบ 30 นาที

- ลด Models by Role เหลือ 4 นาที
- รวม Herdr, Agent Halo และ Skills ไว้ใน system map หนึ่งภาพ
- เล่า failure เพียงหนึ่งเรื่องเพื่ออธิบายว่าทำไมต้องสร้างกติกาถาวร
- ไม่ทำ live demo หรือใช้ video ความยาวไม่เกิน 2 นาที

---

# Open Questions ก่อนทำสไลด์จริง

1. ผู้ฟังใช้ AI Chat, Claude Code หรือ coding agents ตัวอื่นอยู่ระดับไหนแล้ว
2. มีเวลา 30, 40 หรือ 60 นาที
3. เปิดเผยชื่อโปรเจกต์และ screenshots จากงานจริงได้แค่ไหน
4. ต้องการ live demo หรือ prerecorded demo
5. อยากให้โทนเป็น personal journey, technical deep dive หรือ war story มากที่สุด
6. จะเปิด Agent Halo และ Herdr ของจริงบนเวทีได้หรือควรใช้ recording/screenshot
7. ควรใช้ชื่อเดิม `Oh My OpenCode` ซึ่งตรงกับช่วงเวลาที่ Mahiro ใช้ หรือแสดง `Oh My OpenCode (ปัจจุบัน Oh My OpenAgent)` บนสไลด์

คำแนะนำปัจจุบัน:

> ใช้ personal journey เป็นโครง ใช้ technical workflow เป็นเนื้อ และใช้ failures เป็นสิ่งที่ทำให้คนจำ Session นี้ได้

---

# Current Official References

ข้อมูลเปรียบเทียบผลิตภัณฑ์ต้องตรวจใหม่ก่อนวันนำเสนอ เพราะโครงการเปลี่ยนเร็ว

- Letta, Stateful agents  
  https://docs.letta.com/concepts/stateful-agents/
- Letta CLI overview  
  https://docs.letta.com/platform/cli/
- Claude Code overview  
  https://code.claude.com/docs/en/overview
- OpenCode  
  https://github.com/anomalyco/opencode
- OpenCode provider authentication  
  https://opencode.ai/docs/providers/
- Oh My OpenAgent — repo เดิม `oh-my-opencode`  
  https://github.com/code-yeongyu/oh-my-openagent
- OpenClaw  
  https://github.com/openclaw/openclaw
- Hermes Agent  
  https://github.com/NousResearch/hermes-agent
- Agent Halo  
  https://github.com/mahirocoko/agent-halo
