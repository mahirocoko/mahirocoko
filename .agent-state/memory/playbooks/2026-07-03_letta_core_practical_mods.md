# Letta Code Core Practical Mods Playbook

ชุดนี้ไม่ได้มีไว้ให้เปิดเล่นทุกตัวทุกครั้ง แต่ให้เป็น “ระบบกันหลุด” รอบตัว agent:

- `user-timestamps` ทำให้ทุก turn มีเวลา
- `memfs-search` ทำให้ agent ค้น memory ตัวเองได้แม่นขึ้น
- `threadkeeper` เก็บ constraint ชั่วคราวของ conversation
- `control-room` เป็น cockpit ของงานยาว
- `plan-mode` เป็นเบรกมือก่อนลงมือแก้งานเสี่ยง

## Mental model

```txt
เวลาปัจจุบัน        → user-timestamps
ความจำถาวร         → MemFS + memfs-search
ข้อจำกัดชั่วคราว   → threadkeeper
เป้าหมายงานยาว     → control-room
แผนก่อนลงมือ       → plan-mode
```

อย่าใช้ผิดชั้น:

- preference ถาวรของ Mahiro → memory
- fact/project convention ถาวร → memory/docs
- live boundary/open loop → threadkeeper
- goal/current next step ของงานนี้ → control-room
- ก่อนแก้ไฟล์ในงานเสี่ยง → plan-mode

---

## 1. `user-timestamps`

### ใช้เพื่ออะไร

ให้ agent รู้เวลาท้องถิ่นของทุก user turn โดยไม่ต้องเดาจาก context เก่า

ตัวนี้ทำงานอัตโนมัติ ไม่ต้องเรียกเอง

### Agent ควรใช้ยังไง

เมื่อมีคำประมาณนี้:

- “วันนี้”
- “เมื่อกี้”
- “พรุ่งนี้”
- “อีก 2 ชั่วโมง”
- “คราวที่แล้ว”
- “ตอนนี้”

agent ควรอ้างอิง timestamp ล่าสุดใน turn นั้น ไม่ใช่เดาจาก memory เก่า

### ข้อควรระวัง

timestamp คือเวลาของเครื่องที่รัน Letta Code ไม่ใช่หลักฐานภายนอก  
ถ้างานต้องใช้เวลาจาก API/server/log จริง ต้องเช็กแหล่งนั้นเพิ่ม

---

## 2. `memfs-search`

### ใช้เพื่ออะไร

ให้ agent ค้นความจำใน MemFS ก่อนตอบหรือก่อนเขียน memory ใหม่

### เมื่อไหร่ควรใช้

ใช้เมื่อ user ถามแนวนี้:

```text
จำได้ไหมว่า...
เราเคยตัดสินใจอะไรไว้...
หา memory เรื่อง...
สรุป context เก่าของ...
ก่อนหน้านี้เราทำอะไรไป...
```

หรือเวลา agent กำลังจะเขียน memory ใหม่ แล้วไม่แน่ใจว่ามีไฟล์เดิมอยู่แล้วหรือเปล่า

### Agent behavior

ก่อนตอบเรื่องที่ควรมี memory เดิม:

1. search memory ก่อน
2. อ้างจากผลที่เจอ
3. ถ้าไม่เจอ ให้พูดว่าไม่เจอ ไม่ invent
4. ถ้าเจอ fact ใหม่ที่ durable ค่อย update memory

### ตัวอย่าง

```text
User: จำได้ไหมว่า Muteluna icons ล่าสุดใช้ชุดไหน
Agent: ใช้ memfs-search หา "Muteluna icons SVGAI optimized"
```

### Anti-pattern

อย่าใช้ `memfs-search` แทนการ update memory  
ถ้าเกิด lesson ใหม่ที่สำคัญ ต้องเขียน memory จริง ไม่ใช่หวังว่าจะค้นเจอจาก transcript ทีหลัง

---

## 3. `threadkeeper`

### ใช้เพื่ออะไร

เก็บ “live operational anchors” ของ conversation นี้ เช่น boundary, open loop, current mode, drift guard

มันคือ sticky note ชั่วคราว ไม่ใช่ memory ถาวร

### ใช้เมื่อไหร่

ใช้เมื่อมี constraint ที่ควรอยู่กับเราใน session นี้ เช่น:

```text
รอบนี้อย่า restart dev server
อย่าแตะไฟล์ X
รอ user confirm ก่อนลง muscle-memory
Codex lane รอบนี้ทำ dicut เท่านั้น
asset ชุดนี้ยังเป็น candidate ห้าม promote runtime
```

### คำสั่งหลัก

ดูรายการ:

```text
/threadkeeper
```

เพิ่ม anchor:

```text
/threadkeeper add "ห้าม restart dev server เพราะ user บอกว่ารันอยู่แล้ว" --kind boundary --ttl 2d
```

เพิ่ม open loop:

```text
/threadkeeper add "รอ user เลือกว่าจะลอง muscle-memory แบบ agent-scoped หรือไม่" --kind open_loop --status waiting_on_user --ttl 7d
```

เพิ่ม drift guard:

```text
/threadkeeper add "Muteluna card/share plates เป็น reference/CSS-first ห้าม dicut เป็น primary runtime asset" --kind drift_guard --priority high --ttl 14d
```

ปิด anchor:

```text
/threadkeeper done <id> resolved
```

ลบ anchor:

```text
/threadkeeper drop <id>
```

ล้าง expired:

```text
/threadkeeper clear-expired
```

### Kind ที่ใช้บ่อย

| kind | ใช้กับ |
|---|---|
| `boundary` | ข้อห้าม/ขอบเขตชั่วคราว |
| `open_loop` | เรื่องค้างที่รอ follow-up |
| `drift_guard` | กัน agent ตีความผิดซ้ำ |
| `mode` | posture ของ conversation นี้ |
| `commitment` | สิ่งที่รับปากว่าจะทำ |
| `due_state` | deadline หรือ pending state |

### Rule ของเรา

- target ไม่เกิน 5 active anchors
- ทุก anchor ควรมี TTL หรือ close condition
- อย่าใส่ secrets/token
- ถ้าเป็น preference ถาวร ให้เขียน memory ไม่ใช่ threadkeeper
- ถ้าเป็น TODO งานยาว ให้ใส่ plan/docs ไม่ใช่ threadkeeper

---

## 4. `control-room`

### ใช้เพื่ออะไร

เป็น cockpit สำหรับงานยาว: goal, mode, next step, verification, approval state

Control Room แทน built-in goal loop เดิมได้ดีกว่า เพราะแยกชัดว่าอะไรเป็น:

- human intent
- agent progress claim
- harness-observed reality

### คำสั่งหลัก

ดู cockpit:

```text
/cr
```

ดูละเอียด:

```text
/cr detail
```

ตั้ง goal:

```text
/cr goal ปรับ Traymori popup ให้ Mori มองเห็นเสมอและไม่มี scroll
```

ตั้ง next step:

```text
/cr next ตรวจ current popup layout แล้ว patch stage/drawer shell
```

ตั้ง mode:

```text
/cr mode explore
/cr mode plan
/cr mode edit
/cr mode verify
/cr mode stuck
/cr mode handoff
```

ให้ agent update progress ได้เอง:

```text
/cr unlock
```

ให้ถามก่อน agent update progress:

```text
/cr safe
```

ล็อกไม่ให้ agent update progress:

```text
/cr lock
```

ปิด reminder:

```text
/cr off
```

เปิด reminder:

```text
/cr on
```

ยืนยันว่า verified โดย human:

```text
/cr verified screenshot native 360x500 ผ่านแล้ว
```

บอกว่ายังต้อง verify:

```text
/cr needs ตรวจ build และ native app อีกครั้ง
```

reset:

```text
/cr reset
```

### Agent behavior

เมื่องานยาว agent ควร:

1. เช็ก `/cr` หรือ `control_room_status`
2. ถ้ามี goal ให้ยึด goal นั้น ไม่เปลี่ยนเอง
3. update mode/next/checkpoint ระหว่างทำ
4. เวลา verify เสร็จ agent claim ได้แค่ `claimed`
5. คำว่า `verified` เป็นของ Mahiro เท่านั้น

### Golden flow

เริ่มงาน:

```text
/cr goal ปรับ Agent Halo ให้ session rows survive reconnect/snapshot/restart
/cr next อ่าน docs/event-protocol แล้ว map current registry behavior
/cr safe
```

ระหว่างทำ:

```text
Agent updates:
mode=explore
next=ตรวจ bridge snapshot path
checkpoint=อ่าน docs แล้ว พบ rows ควรมาจาก per-conversation latest events
```

ตอนแก้:

```text
Agent updates:
mode=edit
next=patch registry merge logic
```

ตอนตรวจ:

```text
Agent updates:
mode=verify
verificationState=checking
```

หลัง agent ตรวจเอง:

```text
Agent updates:
verificationState=claimed
evidence=pnpm check passed, browser smoke at ...
```

หลัง Mahiro ดูแล้วโอเค:

```text
/cr verified ดู native behavior แล้วผ่าน
```

### Anti-pattern

- อย่าให้ agent ตั้ง human goal เองแบบเงียบ ๆ
- อย่าใช้ `claimed` แทน `verified`
- อย่าปล่อย next step ว่างในงานยาว
- ถ้า Control Room เตือน แต่ไม่มีอะไรต้อง update ให้ continue ได้ ไม่ต้องฝืน update ทุกครั้ง

---

## 5. `plan-mode`

### ใช้เพื่ออะไร

เป็น safety gate ก่อน implement งานที่เสี่ยงหรือยังไม่ชัด

ใช้เมื่ออยากให้ agent สำรวจก่อน เขียน plan ก่อน แล้วรอ approve ก่อนแก้ไฟล์จริง

### เรียกใช้

```text
/plan
```

หรือพูดธรรมชาติ:

```text
วางแผนก่อน ยังไม่ต้องแก้
สำรวจ repo ก่อนแล้วเสนอ plan
ขอ plan ให้ approve ก่อนลงมือ
```

### เมื่อเข้า plan-mode แล้ว agent ต้องทำอะไร

1. อ่านไฟล์/docs ได้
2. ใช้ read-only tools ได้
3. เขียน plan file ใต้ `~/.letta/plans/`
4. ห้ามแก้ไฟล์ repo จริง
5. ห้าม install package / commit / run destructive commands
6. ต้อง present plan ให้ user approve
7. approve แล้วค่อยออก plan-mode

### ใช้กับงานแบบไหน

ควรใช้กับ:

- migration
- refactor ใหญ่
- repo ที่ dirty เยอะ
- งาน asset pipeline ที่มี source/candidate/runtime
- งานที่ต้อง preserve user edits มาก ๆ
- งานที่ถ้าพลาดจะ rollback ยาก

ไม่ควรใช้กับ:

- typo
- small UI tweak
- command/check ง่าย ๆ
- งานที่ Mahiro บอกชัดว่า “ทำเลย”

### Pattern ที่ดี

```text
User: /plan

Agent:
- สำรวจ AGENTS.md/docs/git status แบบ read-only
- เขียน ~/.letta/plans/plan-xxxx.md
- paste full plan ให้ user
- ถาม approve
```

ถ้า user approve:

```text
User: approve / ทำเลย / ok

Agent:
- exit_plan_mode
- เริ่ม edit ตาม plan
```

---

## 6. ใช้ร่วมกันยังไง

### Case A: งานเล็ก

ตัวอย่าง:

```text
แก้ copy ปุ่มนี้ให้หน่อย
```

ใช้ normal workflow  
ไม่ต้อง `/plan` ไม่ต้อง `/cr goal`

แต่ถ้ามี constraint ชั่วคราว เช่น “อย่าแตะไฟล์อื่น” อาจใส่ Threadkeeper

### Case B: งานยาว แต่ direction ชัด

ใช้ Control Room:

```text
/cr goal ปรับ Muteluna Home/Daily Result ให้ตรง production UI direction
/cr next ตรวจ scaffold ปัจจุบันแล้ว patch tokens/components
/cr safe
```

agent ทำงานตาม goal และ update progress

### Case C: งานเสี่ยง ยังไม่ควรแก้ทันที

ใช้ Plan Mode ก่อน:

```text
/plan
```

หลัง approve แล้วค่อย edit  
Control Room ใช้คู่กันได้ โดยให้ goal อยู่ใน `/cr` และ plan เป็น execution plan

### Case D: มี live constraint

ใช้ Threadkeeper:

```text
/threadkeeper add "รอบนี้ห้าม restart dev server ใช้ server ที่ user เปิดไว้แล้ว" --kind boundary --ttl 1d
```

หลังจบ:

```text
/threadkeeper done <id> session ended
```

### Case E: ถามเรื่องความจำเก่า

ใช้ memfs-search:

```text
User: จำได้ไหมว่า Otobun UI direction ล่าสุดคืออะไร
Agent: search memory ก่อน แล้วค่อยตอบ
```

---

## 7. Default operating policy

### Agent ควรทำเอง

- ใช้ `memfs-search` เมื่อถามเรื่อง memory เก่า
- ใช้ `control_room_status` ถ้า Control Room เตือนหรือ state ไม่ชัด
- update Control Room ในงานยาว
- ใช้ Threadkeeper เมื่อมี live boundary/open loop ที่ชัด
- เคารพ timestamp ล่าสุดในทุก turn

### Agent ไม่ควรทำเองเกินไป

- ไม่เข้า `/plan` เองกับงานเล็ก
- ไม่เพิ่ม Threadkeeper anchor ทุกเรื่อง
- ไม่เปลี่ยน Control Room goal เอง
- ไม่ claim verified แทน human
- ไม่ใช้ mods เป็นข้ออ้างให้ flow หนักขึ้น

---

## 8. Recovery / troubleshooting

ดู installed mods:

```bash
letta mods list
```

ปิดชั่วคราว:

```bash
letta mods disable npm:@letta-ai/control-room
```

เปิดกลับ:

```bash
letta mods enable npm:@letta-ai/control-room
```

ลบ:

```bash
letta mods remove npm:@letta-ai/control-room
```

ถ้า mod ทำให้ startup พัง:

```bash
letta --no-mods
# หรือ
LETTA_DISABLE_MODS=1 letta
```

แล้วค่อย disable/remove ตัวที่มีปัญหา

---

## 9. Recommended daily usage

ถ้าจะใช้แบบไม่รก:

```text
งานเล็ก       → ไม่ต้องเปิดอะไรเพิ่ม
งานยาว       → /cr goal + /cr next
งานเสี่ยง     → /plan
constraint สด → /threadkeeper add ...
ถามความจำเก่า → ให้ agent ใช้ memfs-search
```

ชุดนี้ควรทำให้ agent “จำบริบทสดได้ดีขึ้น วางแผนก่อนแก้เมื่อควร และรายงาน verification ซื่อสัตย์ขึ้น” ไม่ใช่ทำให้ทุกงานกลายเป็นพิธีกรรมยาว ๆ
