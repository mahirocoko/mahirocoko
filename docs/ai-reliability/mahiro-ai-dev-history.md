# เส้นทาง AI Development ของ Mahiro

สถานะ: Evidence-backed history draft  
ช่วงเวลาที่ครอบคลุม: มกราคม–สิงหาคม 2026  
อัปเดตล่าสุด: 17 สิงหาคม 2026

เอกสารนี้รวบรวมเส้นทางที่ Mahiro ค่อย ๆ เปลี่ยน AI จากเครื่องมือช่วยตอบคำถาม ให้กลายเป็นระบบทำงานที่มีตัวตนหลัก มีผู้ช่วยเฉพาะทาง มองเห็นและควบคุม execution ได้ และเรียนรู้จากความผิดพลาดข้าม session

ข้อมูลมาจาก conversation history, imported Claude history, repo artifacts และคำยืนยันของ Mahiro ในวันที่ 14–15 สิงหาคม 2026 ส่วนที่เป็นการตีความจะระบุไว้ชัดเจน ไม่ยก inference ให้กลายเป็นข้อเท็จจริงย้อนหลัง

---

## เรื่องนี้ไม่ได้เริ่มที่ Letta

ถ้ามองเฉพาะรายชื่อเครื่องมือ เส้นทางนี้อาจดูเหมือนการย้ายจาก AI Chat ไป Claude Code, OpenCode แล้วจบที่ Letta Code

แต่ history บอกอีกอย่าง

ก่อน Letta หลายเดือน Mahiro พยายามสร้าง learning loop ครอบ Claude Code อยู่แล้ว ทั้ง Soul Vibe, `/daily`, `/rrr --store`, wisdom, memory และ skills ความต้องการหลักจึงไม่ใช่การหา coding agent ที่เขียน code เก่งกว่าเดิมอย่างเดียว แต่คือการทำให้สิ่งที่เรียนรู้วันนี้ไม่หายไปพร้อม conversation

ประโยคที่สะท้อนจุดเริ่มนี้ได้ชัดที่สุดมาจากวันที่ 26 มกราคม:

> “แปลกมากที่หา skill ไม่เจอ แล้วก็รู้สึกว่าเราใช้ memory_search บ่อยเหมือนกัน แต่เราไม่เคยเก็บ data ลงไปเลยป่ะนะ”

ตรงนี้เป็นปัญหาเชิงระบบมากกว่าปัญหาเชิง model มี memory search อยู่ก็จริง แต่ถ้า workflow ไม่เคยเก็บสิ่งที่ควรเรียกกลับมาใช้ ความสามารถนั้นก็แทบไม่มีความหมาย

---

## Timeline

### ก่อนมกราคม 2026 — AI Chat

ช่วงแรก Mahiro ใช้ AI Chat แบบที่ developer หลายคนเริ่มต้นกัน เอา error ไปถาม ขอคำอธิบาย logic หรือให้ช่วยร่าง code แล้วค่อยย้ายคำตอบกลับมาทดลองใน editor และ terminal

**สิ่งที่ยืนยันได้**

- Mahiro ยืนยันย้อนหลังว่าเริ่มจาก AI Chat ก่อน coding agent
- Claude Code เป็น coding agent ตัวแรกที่ใช้จริงจัง

**สิ่งที่ history ยังไม่ตอบ**

- เริ่มใช้ AI Chat เมื่อไร
- ใช้ Claude หรือ ChatGPT มากกว่ากันในช่วงแรก
- เหตุการณ์ใดเป็นตัวผลักให้ขยับจาก chat ไป coding agent

---

### 25–30 มกราคม 2026 — Claude Code + Soul Vibe

Claude Code ทำให้ AI เข้าไปอ่าน codebase แก้ไฟล์ และรัน command ได้โดยตรง แต่ Mahiro ไม่ได้หยุดแค่ความสามารถนั้น เขาเริ่มสร้างระบบที่ช่วยให้ agent เรียนรู้และส่งต่อบริบทระหว่างงาน

สิ่งที่เกิดขึ้นในช่วงนี้:

- `/daily` สำหรับ orientation และสถานะประจำวัน
- `/rrr` และ `/rrr --store` สำหรับ retrospective
- การทดลองต่อ MCP เพื่อทำ memory layer ให้ Claude Code ค้นและใช้ข้อมูลข้าม session
- wisdom และ memory promotion
- skill inventory
- การย้ำให้บันทึก capability และบทเรียนที่ใช้ซ้ำ
- การแก้เรื่อง path, docs และ source-of-truth ให้กลายเป็นกติกาถาวร

หลักฐานจาก conversation:

> “บันทึก 3 สกิลนี้ด้วย จำไว้ว่าเวลาทำ อาจจะต้องใช้พวกนี้ด้วย”

> “เหมือนมี skill ก่อนหน้าที่ยังไม่ได้ update docs ไหมนะ”

> “ช่วยจำไว้หน่อย ว่าควร check path ตัวเองเสมอ”

**Turning point**

Mahiro ไม่ได้รอให้ product ใด product หนึ่งมอบ memory architecture สำเร็จรูป แต่พยายามสร้าง MCP memory layer ครอบ Claude Code เองก่อน สิ่งที่เจอคือการมี `memory_search` ยังไม่พอ ถ้า workflow ไม่เคยเลือกและบันทึกข้อมูลที่ควรนำกลับมาใช้

---

### 30 มกราคม 2026 — ย้ายระบบจาก Claude Code ไป OpenCode

Mahiro ขอวิเคราะห์และวางแผน migration จาก Claude Code ไป OpenCode โดยย้ำว่าไม่ได้จะทำโครงการ open source แต่ต้องการเปลี่ยนเครื่องมือที่ใช้ทำงานจริง

> “ฉันต้องการ migrate claude code ไปเป็น opencode อยากให้คุณช่วย วิเคราะห์ และ research หน่อย”

การย้ายครั้งนี้ไม่ใช่แค่เปลี่ยน executable แต่ต้องตามย้ายระบบรอบตัว agent:

- commands
- skills
- hooks
- custom tools
- project instructions
- canonical ownership ของ reusable procedures

เมื่อพบว่าแต่ละ harness มีตำแหน่งเก็บ skill ต่างกัน Mahiro เลือกให้ procedure มีบ้านกลางของตัวเอง:

> “ทุก skills ต้องอยู่ใน .agents/skills และทำการ symlinks เหมือนกันไม่ว่าจะเป็น claude หรือ opencode ก็ตาม”

Mahiro ยืนยันภายหลังว่าแรงผลักดันหลักมาจากหลายอย่างร่วมกัน:

1. ใช้ ChatGPT subscription ได้
2. เลือก model และ provider ได้ยืดหยุ่นขึ้น
3. ใช้ workflow ของ Oh My OpenCode

**บทเรียนจาก migration**

ตอน agent เดา config จาก pattern ที่คุ้นแล้วเพิ่มค่าไม่ตรง schema, OpenCode ใช้งานไม่ได้ Mahiro ทักกลับว่า:

> “ทำไมไม่อ่าน `https://opencode.ai/config.json`”

นี่กลายเป็นหลัก repo-reality-first ที่ใช้อยู่ต่อมา: อ่าน contract ปัจจุบันก่อนย้าย pattern จากเครื่องมืออื่น

---

### ต้นกุมภาพันธ์ 2026 — Oh My OpenCode เป็น Harness Layer

Mahiro ใช้ OpenCode ร่วมกับ Oh My OpenCode ซึ่งปัจจุบันเปลี่ยนชื่อโครงการเป็น Oh My OpenAgent

ในเชิง packaging มันติดตั้งผ่าน plugin mechanism ของ OpenCode แต่ในเชิงพฤติกรรม มันกำหนด workflow รอบ agent อย่างมาก ทั้ง:

- agent roles
- specialist prompts
- plan และ notepad ownership
- continuation loops
- todo discipline
- model routing
- multi-agent orchestration

Mahiro แก้ taxonomy นี้โดยตรงในเดือนสิงหาคม:

> “ไม่ใช่ว่าตัว oh-my-openagent ทำให้เป็น harness มากขึ้นหรอกหรอ เพราะมันมี workflow ที่เป็น harness เลยนะ”

คำอธิบายที่ตรงที่สุดคือ:

```text
OpenCode = host/runtime และ coding-agent foundation
Oh My OpenCode = orchestration harness ที่ทำให้ workflow มีแบบแผนและวินัยมากขึ้น
```

---

### กลางพฤษภาคม 2026 — Letta Code กลายเป็น Mahiro Code

หลังทำความเข้าใจ architecture ของ Letta ทั้ง agent, conversation, subagent, skill และ memory, Mahiro สรุปว่าไม่จำเป็นต้องสร้าง persistent agent แยกตามทุกบทบาท

> “งั้นเท่าที่ฟังมาก็เหมือนว่าไม่จำเป็นต้องสร้าง agent แยกเลยสิ”

จากนั้น agent เดิมถูก rename จาก Letta Code เป็น **Mahiro Code** โดยรักษา agent ID, history และ memory เดิมไว้

Architecture ที่เลือกคือ:

```text
หนึ่ง persistent main identity
+ หลาย conversations สำหรับแยกงาน
+ temporary specialists สำหรับบทบาทเฉพาะ
+ repo docs สำหรับ project truth
+ memory สำหรับ preference และบทเรียนข้ามโปรเจกต์
+ skills สำหรับ procedure ที่ใช้ซ้ำและพกข้าม harness ได้
+ mods สำหรับ tools, commands, state, events และ gates เฉพาะ Letta Code
```

Mahiro ยืนยันว่าคุณค่าหลักของ Letta ในเส้นทางนี้คือ **identity continuity** ไม่ใช่แค่มี memory database

Letta Code จึงเป็น main relationship แต่ไม่ได้เป็นเจ้าของ workflow ทั้งหมด Skills แยก procedure ออกจาก harness และพกไปใช้กับ Agy, OpenCode, Claude Code, Cursor, Codex, Pi และ agent อื่นที่รองรับได้ ส่วน Mods เป็น runtime extension เฉพาะ Letta Code ไม่ใช่ portable skill layer

Letta จึงไม่ได้เป็นจุดที่ความต้องการ learning เริ่มขึ้น แต่เป็น architecture ที่รวบสิ่งซึ่ง Soul Vibe และ workflow ก่อนหน้าพยายามสร้าง ให้มาอยู่ภายใต้ตัวตนหลักเดียว

**ข้อจำกัดของหลักฐาน**

ไม่มีคำพูดที่บอกว่า Mahiro เลิก OpenCode เพราะมันไม่ดีพอ หลักฐานรองรับเพียงว่า main relationship ย้ายมาอยู่ที่ Mahiro Code ขณะที่ CLI และ harness อื่นยังเป็น execution options ได้

---

### 2 มิถุนายน 2026 — Main Agent ไม่ควรตรวจการบ้านตัวเอง

Mahiro ทักเรื่อง test ownership ว่า:

> “main agent ไม่ควรเขียนพวกนี้เองป่ะ เพราะจะเขียนแต่ case ที่มันถูก”

นี่เป็นจุดสำคัญของ orchestration model ในเวลาต่อมา Main agent ยังเป็นเจ้าของ integration และ final judgment แต่ไม่ควรเป็นผู้สร้าง implementation, test assumptions และ verification narrative ทั้งหมดเพียงตัวเดียว

บทบาทจึงค่อย ๆ แยกเป็น:

- coordinator — ถือโจทย์ ภาพรวม และความรับผิดชอบสุดท้าย
- scout — สำรวจแบบ read-only
- writer — แก้ใน scope ที่ชัด
- reviewer — ตรวจความสอดคล้องและความเสี่ยง
- verifier — พยายามหาหลักฐานว่าข้อสรุปเดิมยังผิดอยู่

Verifier ที่ดีต้องตรวจจาก code, commands, tests หรือ runtime evidence ไม่ใช่แค่ถาม model อีกตัวว่าเห็นด้วยหรือไม่

---

### 17–18 มิถุนายน 2026 — Agent Halo และ Ambient Awareness

หลังศึกษา Notchcode, Mahiro ถามว่า:

> “ถ้าเราจะทำสำหรับ letta-code เราทำได้ไหม”

พร้อมกำหนดระดับงานทันที:

> “ทำให้ถูกทางไปเลยก็ได้มั้ง ไม่ต้องการทำ mvp ส่งๆ”

Agent Halo เริ่มจากความต้องการทำ agent presence ที่อยู่กับ hardware notch จริง แต่ pain ที่ชัดขึ้นระหว่างใช้งานไม่ได้มีแค่เรื่อง visual

Mahiro เปิดหลาย session แล้วพบว่า:

> “ตอนนี้ฉันเปิดอยู่ 3 session นะ”

> “ตอนนี้ยังเห็นแค่ session เดียวนะ”

ปัญหาที่ต้องแก้มีทั้ง:

- เห็น session ไม่ครบ
- ไม่รู้ว่าอยู่ folder หรือ workspace ไหน
- done/blocked state ไม่ตรง
- session หายเองหรือค้าง
- มองเห็น status แล้วแต่กลับไปยัง terminal/pane จริงไม่ได้
- ไม่อยากเฝ้า transcript แต่ยังต้องรักษา control

Mahiro ยืนยันว่าคุณค่าที่ลึกที่สุดของ Agent Halo คือ **ambient awareness + human control**

Notch จึงไม่ใช่แค่ visual treatment แต่เป็นพื้นที่ peripheral awareness ที่ไม่ขโมย focus เมื่อไม่มี activity ก็หุบกลับไปเท่ากล้อง พอมีงานจึงขยาย และเมื่อมีปัญหาคนต้องกดกลับไปยัง execution surface ได้

Mascot และ per-session identity ถูกเพิ่มในวันถัดมา:

> “อยากให้ช่วยดูเรื่อง ทำ mascot ให้มันดิ้นๆ แทนได้ไหม 555”

> “เราสามารถแยก mascot แต่ละ session ไม่ให้เหมือนกันด้วยได้ไหม”

หลักฐานยืนยันว่าต้องการ status ที่มี character และชีวิต แต่ยังไม่ควรสรุปแทน Mahiro ว่านี่คือ emotional companionship โดยตรง

---

### 24 กรกฎาคม 2026 — Herdr กลายเป็น Execution Truth

Herdr เกิดทีหลัง Agent Halo ไม่ใช่เหตุผลตั้งต้นที่ทำให้สร้าง Halo

ก่อน Herdr การจัด direct CLI lanes ต้องพึ่ง terminal/tmux conventions และการเดา process state หลายชั้น Herdr เข้ามาให้ identity และ lifecycle ที่เป็นโครงสร้างมากขึ้น:

- workspace, tab, pane และ agent IDs
- `idle / working / done / blocked`
- prompt/read/wait surfaces
- process readiness
- lane-level cleanup
- output ที่ main agent อ่านกลับได้
- focus กลับไปยัง lane จริง

ภาพความสัมพันธ์ของสองระบบจึงเป็น:

```text
Herdr = execution truth และ control room
Agent Halo = ambient awareness, human-readable presence และ jump-back surface
```

Halo ไม่ควรเดา execution truth เอง ส่วน Herdr ก็ไม่จำเป็นต้องแย่ง peripheral attention ตลอดเวลา ทั้งสองแก้ pain เดียวกันคนละระยะ

---

### กรกฎาคม 2026 — Persistent Companion ต้องรับผิดชอบต่อบทเรียนเดิม

Mahiro ไม่ได้ต้องการ agent ที่จำ biography ได้อย่างเดียว แต่ต้องการ continuity ที่เปลี่ยน behavior

เมื่อ agent อ้างว่า output ดีหรือเสร็จแล้วโดยไม่ได้ตรวจพอ Mahiro ทักว่า:

> “ถ้ามันทำออกมาไม่ดีก็ต้องบอกว่ามันทำออกมาไม่ดี … คุณต้องบอกความจริง หรือ recheck ให้ดีก่อนจะตอบแบบส่งๆ ไปว่าเสร็จแล้ว”

เมื่อ failure เดิมเกิดซ้ำ:

> “บอกสิ่งที่ทำผิดพลาดมาหน่อย และจะไม่ทำผิดซ้ำในครั้งต่อไปด้วย และต้องอัพเดทลง docs หรืออะไรก็ตามที่ทำให้ครั้งหน้ามันออกมาดีกว่านี้”

ตลอดเดือนมิถุนายน–สิงหาคม Mahiro เรียกใช้ RRR/retrospective 229 ครั้งใน 84 conversations จังหวะการทำงานที่เกิดขึ้นซ้ำคือ:

```text
work
→ verify
→ reflect
→ durable artifact
→ checkpoint
→ next task
```

Persistent companion ในความหมายที่มีหลักฐานชัดจึงเป็นเรื่อง **continuity + accountability** มากกว่าการมี agent หนึ่งตัวทำทุกอย่างเอง

---

### 30 กรกฎาคม 2026 — PASS ต้องไม่กว้างกว่าหลักฐาน

Frontend หลายส่วนผ่าน build และ browser checks แต่เมื่อ Mahiro ดูทั้งหน้าจริง ปัญหาด้าน spacing, balance, typography, asset quality และ visual direction ยังชัดเจน

> “ฉันใส่ใจกับเรื่อง spacing มากๆ เลยนะ และความ balance เอาจริงๆ ไม่รู้ที่คุณ test คุณ test ผ่านได้ไง”

บทเรียนไม่ใช่ว่า test ไม่มีประโยชน์ แต่คือ evidence หนึ่งแบบตอบได้เพียงคำถามบางประเภท:

```text
Build PASS ≠ runtime PASS
Runtime PASS ≠ interaction PASS
Interaction PASS ≠ visual PASS
Desktop screenshot PASS ≠ responsive PASS
```

งานหนึ่งอาจผ่านทุก automated check ที่เขียนไว้ แต่ยังไม่ผ่าน product question ที่คนเป็นเจ้าของต้องตัดสิน

---

### 2–4 สิงหาคม 2026 — Context มากไม่ได้แปลว่า Context ดี

Mahiro ยกตัวอย่าง code ทำงานแบบหนึ่ง แต่ comments และ Markdown ที่ถูกส่งเข้า context อธิบายอีกแบบหนึ่ง:

> “ตัวฟังก์ชั่นจริงทำงานแบบนึง ตัวคำอธิบายว่ามันทำงานยังไงบอกอีกแบบนึง ทั้งคู่ถูกส่งเข้าไปใน context windows คุณคิดว่า ai จะงงมั้ยครับ”

และสรุปชัดเจนว่า:

> “มันแก้ไม่ได้ด้วย ‘advance agentic workflow’ แบบมี agent 10 ตัวช่วยกันทำหรอกนะ ถ้า context ที่ให้ ai มันขัดกันเองในตัวแบบนี้ workflow ไรก็ไม่ช่วยหรอก”

สิ่งนี้กลายเป็น context-contract doctrine:

- code, comments, docs, generated prose, agent state และ memory ต้องไม่อ้างตัวเป็น current owner พร้อมกันทั้งที่ขัดกัน
- historical evidence ต้องถูก date/demote/link กลับหา current source
- active knowledge ไม่ควร append-only
- สิ่งที่หมดหน้าที่ควรถูกลบหรือย้ายออกจาก context ปัจจุบัน

Mahiro ไม่ได้ต้องการ memory ที่ใหญ่ที่สุด แต่ต้องการ memory ที่ยังจริงและไม่ทำให้ agent เข้าใจผิด

---

### 8 สิงหาคม 2026 — Safety ต้องบังคับใช้ได้

เหตุการณ์ indexing เผยให้เห็นว่า workflow เปิดทางให้ tooling อ่านไฟล์ที่อาจมี credential โดยไม่ตั้งใจ Mahiro ระบุเองว่าข้อสงสัยเรื่องต้นเหตุยังเป็น hypothesis ไม่ใช่ข้อสรุป แต่ผลกระทบเพียงพอให้เปลี่ยนระบบ

สิ่งที่เกิดขึ้นต่อมา:

- hard no-touch boundary สำหรับ project ที่ได้รับผลกระทบ
- filename-only credential preflight
- project-local deny settings
- skill hardening
- fail-closed indexing policy

บทเรียนคือเรื่องเสี่ยงบางอย่างไม่ควรฝากไว้กับ instruction ว่า “อย่าลืม” ต้องมี guardrail ที่หยุดการกระทำได้จริง

รายละเอียด project, credential และ security paths ถูกตัดออกจากเอกสารสาธารณะนี้โดยตั้งใจ

---

### 11 สิงหาคม 2026 — Parallel Writers และ Shared Mutable State

ในงานหนึ่ง Mahiro เปิด Agy writers สามตัวใน current checkout แต่ละตัวรับผิดชอบ code คนละส่วนและสร้าง diff ที่ใช้ได้

writer ตัวหลัง restore checkout กลับไปยัง snapshot ของตัวเอง ทำให้ uncommitted changes จาก writers ก่อนหน้าหาย แม้ file ownership ไม่ชนกัน

นี่ไม่ใช่ Git merge conflict ปกติ แต่เป็น shared mutable workspace failure

กฎที่เกิดขึ้นทันที:

- read-only agents เปิดขนานได้
- writers ใน current checkout ต้องทำทีละตัว
- จบแต่ละ writer ต้อง capture status และ diff ก่อนเปิดตัวถัดไป
- ถ้าต้องเขียนขนานจริงต้องแยก isolated worktrees และได้รับอนุญาตสำหรับงานนั้น

ประโยคแก่นคือ:

> แก้คนละไฟล์ไม่ได้แปลว่าเขียนขนานได้อย่างปลอดภัย ถ้ายังแชร์ mutable workspace ชุดเดียวกัน

เหตุการณ์นี้เหมาะเป็น opening ของ knowledge-share เพราะแสดงให้เห็นทันทีว่าเมื่อ agent มี agency มากขึ้น blast radius ก็เพิ่มขึ้นด้วย

---

### 14 สิงหาคม 2026 — Cleanup ที่ลบ Future Direction

หลังงาน creative production รอบหนึ่ง ระบบลบ ignored workspace ทั้งหมดโดยมองเป็น cache แต่ในนั้นมีสิ่งที่ยังมีคุณค่า:

- exact accepted prompts
- provider-native masters
- identity mappings
- normalization recipes
- provenance
- human direction decisions

Mahiro ทักว่า:

> “จริงๆ ไม่น่า cleanup `.softfolk-work` ทั้งหมดนะเพราะมีข้อมูลสำคัญสำหรับทำ direction ใหม่ของเรา”

เพราะ directory ถูก ignore, Git history ไม่สามารถกู้หลักฐานที่ไม่เคย track ได้

บทเรียนถาวร:

> Hidden production workspace เป็น mixed-value state ไม่ใช่ขยะก้อนเดียว ก่อนลบต้อง inventory และแยก accepted authority, provenance และ reusable recipes ออกจาก rejected หรือ transient artifacts

เหตุการณ์นี้ขยายความหมายของ learning loop จาก “จำข้อผิดพลาด” ไปเป็น “ระบบต้องรู้ว่าสิ่งใดมีคุณค่าต่อการตัดสินใจในอนาคต”

---

## Missing Layers ที่ค่อย ๆ ถูกสร้างขึ้น

### Identity — Mahiro Code

ตัวตนหลักที่รักษาความต่อเนื่องข้าม model, conversation และ project

หน้าที่หลัก:

- รู้จัก preference และวิธีตัดสินใจของ Mahiro
- ถือภาพรวมและ integration responsibility
- เรียก specialists โดยไม่แตกความสัมพันธ์เป็น persistent agents หลายตัว
- รับผิดชอบว่าบทเรียนเดิมเปลี่ยน behavior รอบถัดไปจริง

### Execution — Herdr

โครงสร้างสำหรับเปิด อ่าน รอ ควบคุม และปิด interactive agent lanes ด้วย identity และ lifecycle ที่ตรวจสอบได้

### Presence — Agent Halo

แปลง lifecycle ให้เป็น ambient awareness บน macOS notch โดยไม่บังคับให้คนเฝ้า transcript พร้อมทางกลับไปควบคุมงานจริง

### Knowledge — Memory และ Repo Instructions

Memory เก็บ preference และบทเรียนข้าม project ส่วน repo instructions เก็บ local truth ใกล้ code

### Procedure — Skills

Skill เปลี่ยนบทเรียนที่ต้องเตือนซ้ำให้กลายเป็น procedure ที่ Mahiro เป็นเจ้าของ พกข้าม harness ได้ และส่งให้ temporary specialists ใช้ได้

Skill ที่ดีต้อง:

- เกิดจาก pain หรือ evidence จริง
- มี owner และ canonical source ชัด
- เก็บ rationale ไม่ใช่แค่ checklist
- มี validation ตามความเสี่ยง
- current-only ไม่ขัดกับ active context
- พร้อมถูก demote หรือลบเมื่อไม่ช่วยแล้ว

### Enforcement — Hooks และ Guardrails

ใช้กับเรื่องที่ผลกระทบสูงเกินกว่าจะฝากไว้กับการจำ เช่น credential exposure, destructive operations หรือ safety boundaries

---

## Failure ควรมีบ้านอยู่ที่ไหน

สิ่งที่เกิดขึ้นซ้ำใน history สามารถสรุปเป็น decision model ได้ดังนี้:

| Failure หรือบทเรียน | บ้านที่เหมาะ |
| --- | --- |
| Correction เฉพาะครั้งและยังไม่รู้ว่าจะเกิดซ้ำหรือไม่ | Conversation / retrospective |
| Preference ที่ต้องใช้ข้าม project | Persistent memory |
| Contract หรือ convention เฉพาะ repository | AGENTS.md / repo docs |
| Procedure หลายขั้นที่ใช้ซ้ำหรือส่งให้ specialist | Skill |
| เรื่องเสี่ยงที่ห้ามพลาดเพราะความจำ | Hook / guardrail / deny policy |

นี่ไม่ใช่ taxonomy ที่ Mahiro เคยประกาศเป็นประโยคเดียว แต่เป็น pattern ที่เห็นจากการตัดสินใจซ้ำหลายเดือน และ Mahiro ยืนยันว่า takeaway ที่อยากให้ developer กลับไปทำคือ **สร้าง learning loop แบบนี้ในระบบของตัวเอง**

---

## Thesis

เรื่องราวทั้งหมดสรุปได้ว่า:

> Mahiro ยอมให้ experiment fail ได้ แต่ไม่ยอมให้ระบบเรียก failure ว่า success และไม่ยอมให้บทเรียนหายไปหลังจบ conversation

Model จะเปลี่ยนเร็วกว่าเอกสารนี้ เครื่องมือบางตัวอาจถูกแทนที่ และชื่อ package อาจไม่เหมือนเดิม แต่คำถามที่ยังอยู่คือ:

1. เรามองเห็นงานของ AI ชัดแค่ไหน
2. เราตรวจมันด้วยหลักฐานที่ตรงกับ claim หรือยัง
3. เมื่อพลาด เราจำได้แค่ใน chat หรือเปลี่ยนระบบจริง
4. ความรู้และ procedure ที่พิสูจน์แล้วเป็นของใคร—ของ provider, harness หรือของเรา

---

## Evidence Boundaries

### ยืนยันได้จาก history

- Claude Code มาก่อน OpenCode
- Soul Vibe, RRR, memory และ skills มีมาก่อน Letta
- migration ไป OpenCode ครอบ commands, skills, hooks และ tools
- Oh My OpenCode มีบทบาทเป็น orchestration harness ใน workflow จริง
- Mahiro เลือก one persistent main identity และ rename เป็น Mahiro Code
- Agent Halo เริ่มก่อน Herdr
- Herdr ทำหน้าที่เป็น execution truth/control room ในเวลาต่อมา
- recurring corrections ถูกเปลี่ยนเป็น memory, skills, docs และ guardrails
- parallel-writer incident, scoped-evidence failures และ creative-workspace cleanup เปลี่ยนกฎถาวร

### Mahiro ยืนยันเพิ่มเติมวันที่ 15 สิงหาคม 2026

- OpenCode เกิดจาก subscription, provider freedom และ OMO workflow ร่วมกัน
- ก่อน Letta ช่วง Claude Code เป็นความพยายามสร้าง MCP memory layer เอง
- Letta กลายเป็น main relationship เพราะ identity continuity
- Agent Halo มีคุณค่าหลักด้าน awareness + control
- สิ่งที่อยากให้ developer กลับไปทำคือ build learning loop

### ยืนยันได้จาก current repo และ runtime วันที่ 17 สิงหาคม 2026

- `mahiro-skills` รองรับ adapters สำหรับ OpenCode, Claude Code, Cursor, Gemini CLI, Agy, Codex, Letta Code และ Pi
- managed Agy receipt ระบุ Mahiro Skills ที่ติดตั้งอยู่ 24 skills ใต้ `~/.gemini/config/skills/`
- `direct-cli` เป็นตัวอย่าง procedure เดียวที่ใช้เปิด Cursor, Agy, Codex หรือ Pi ผ่าน Herdr/tmux
- `@mahirocoko/letta-mods@0.8.9` เปิดใช้งานจริงใน Letta Code และเป็นเจ้าของ commands, tools, permissions, events และ panels เฉพาะ runtime นี้
- เอกสาร `mods/docs/workflow-ecosystem.md` ระบุ boundary ว่า Skills เป็น portable procedure across agents ส่วน Mods เป็น deterministic Letta runtime controls
- Letta Skill audit ของ agent นี้ตั้งแต่ 1 มิถุนายนถึง 17 สิงหาคม 2026 พบ 2,755 invocations โดยตัวที่ใช้บ่อยสุดคือ `git-commit` (401), `ccc` (349), `rrr` (272), `playwright-cli` (263), `direct-cli` (188), `recap` (117), `kien-thai` (103) และ `codex-asset-production` (82)
- รายการ raw audit ข้างต้นครอบทุก Skill surface ใน ecosystem ไม่ใช่เฉพาะ portable Mahiro Skills สำหรับการอธิบาย workflow หลัก ให้แยก Mahiro core family (`mahiro-style`, `mahiro-guidance-refine`, `mahiro-docs-rules-init`) ออกจาก workflow ที่หยิบใช้ประจำ (`recap`, `rrr`, `direct-cli`, `fable`) ส่วน `/mh-*` เป็นชื่อ alias ที่ Agy สร้างตอนติดตั้ง ไม่ใช่ชื่อ family

### ยังไม่ควรสรุปแทน Mahiro

- ช่วง AI Chat เริ่มเมื่อไรและมี turning point ใด
- การ rename เป็น Mahiro Code มีความหมายเชิงอารมณ์มากน้อยแค่ไหน
- Mascot และ presence มีบทบาทเชิง companionship มากกว่าความชัดเจน/ความสนุกหรือไม่
- Privacy เป็นแรงผลักดันหลักหรือเป็น architectural default ที่สมเหตุผล

---

## Public-Safe Boundary

เว็บหรือ presentation ที่สร้างจากเอกสารนี้ไม่ควรเปิดเผย:

- ชื่อ client repository
- provider account หรือข้อมูลบัญชี
- credential, token, secret filename หรือ internal path ที่ระบุตัวระบบได้
- private API/URL
- ชื่อบุคคลที่ไม่ได้อนุญาต

ชื่อเครื่องมือสาธารณะ, open-source references, Agent Halo, Herdr, Soul Vibe และ Mahiro Code ใช้ได้เมื่ออธิบายตามหลักฐานและไม่ยก implementation inference ให้เป็น claim ของโครงการ
