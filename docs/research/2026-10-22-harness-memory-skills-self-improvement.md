# จากความจำสู่ความชำนาญ: Harness, Skill และวงจรพัฒนาที่ตรวจผลได้

วันที่ศึกษา: 22 ตุลาคม 2026 · Asia/Bangkok

หัวข้อ: **Research harness, memory และ skill self-improvement**

สถานะ: รายงานวิจัยและข้อเสนอสำหรับตัดสินใจ **ไม่ใช่การอนุมัติ implementation หรือเปิด automatic learning**

หมายเหตุสำหรับฉบับเผยแพร่: ตัดพาธบนเครื่อง หลักฐาน runtime ส่วนตัว บันทึกสถานะงานภายใน และลิงก์ไปยังเอกสารที่ไม่ได้เผยแพร่ออกแล้ว ข้อสังเกตจากงานภายในที่ยังเก็บไว้เป็นเพียงบริบททางประวัติศาสตร์ ไม่ใช่หลักฐานที่ผู้อ่านตรวจซ้ำได้จากรายงานนี้ ส่วนข้ออ้างจากงานวิจัยสาธารณะยังแยกจากข้อเสนอและสิ่งที่ยังไม่พิสูจน์

> เป้าหมายไม่ใช่ให้ agent มีบันทึกมากขึ้น แต่ให้ประสบการณ์เปลี่ยนการตัดสินใจและผลลัพธ์ในงานถัดไป โดยพิสูจน์ได้ว่าอะไรช่วย อะไรไม่ช่วย และเมื่อไรควรกลับไปใช้ของเดิม

## แผนที่การอ่าน

- ต้องการข้อเสนอสำหรับเรา: อ่าน **1, 3, 12–17**
- ต้องการกลไกต้นทาง: อ่าน **4–9**
- สนใจ agent สร้าง skill และใช้ได้คล่อง: อ่าน **9–11**
- สนใจ taste และ visual work: อ่าน **13, 14**
- ต้องการตรวจหลักฐาน ขอบเขตและสิ่งที่ยังไม่รู้: อ่าน **2, 18–20**

เนื้อหาสถานะและข้อเสนอเป็นบริบท ณ วันที่ศึกษา ไม่ใช่สถานะงานหรือการอนุมัติปัจจุบัน

---

## 1. ข้อค้นพบที่ใช้ตัดสินใจได้

### 1.1 ควร port ความสามารถของ Letta แต่ไม่ควรตีความว่าความชำนาญจะตามมาครบเอง

Letta Code มี memory filesystem, selective projection, recall, skill loading, background reflection, child-process subagents และกลไกรวมผลจาก memory worktree จริง ไม่ใช่เพียงคำโฆษณาว่า agent มีความจำ

Reflection ของ Letta ยังมีหน้าที่ค้นหาความผิดพลาดและ workflow ที่ควรเปลี่ยนเป็น skill โดยตรง แต่การเก็บและเผยแพร่คำแนะนำสำเร็จไม่ได้พิสูจน์ว่าครั้งถัดไป agent จะค้นเจอ ใช้ถูก และทำงานดีขึ้น [L-REFLECTION] [L-MEMORY] [L-SKILL]

**ข้อเสนอ:** รักษาความต่อเนื่องและความสามารถของ ecosystem ที่ชอบไว้ แต่เพิ่มการตรวจการนำไปใช้และผลข้ามงาน แทนการคาดหวังจาก reflection อย่างเดียว

### 1.2 Harness² เป็นแนวคิดที่เหมาะจะศึกษา แต่ไม่ควรยก release ทั้งก้อนมาเป็น production learning engine

แก่นที่น่าใช้คือ **เสนอการเปลี่ยน → ทดลอง execution → ดูความต่างของพฤติกรรม → ค่อยประกอบและเก็บบทเรียน** ไม่ใช่ให้ agent นั่งคิดย้อนหลังแล้วประกาศว่าตัวเองพัฒนาขึ้น

แต่ source ที่ตรวจมีข้อจำกัดสำคัญ:

- รอบเลือกผลสุดท้ายไม่รวม baseline outputs และไม่มีตัวเลือก abstain ในโครงสร้างของ selector
- ที่ `k=1` ผล final เดียวอาจถูกเลือกโดยไม่เปิด selector session
- การรับ experience เข้าคลังตรวจเพียงว่ามีข้อมูลครบตามโครงสร้าง ไม่ได้พิสูจน์ causality หรือ transfer
- execution ใช้เงื่อนไขที่ไม่เหมาะจะนำมาใช้กับเครื่องทำงานจริงโดยตรง เช่น unrestricted network และบาง executor ปิด sandbox/approval protections

ดังนั้น **adoption ไม่เท่ากับ improvement** และ **reflection ไม่เท่ากับ non-regression gate** [H2-SELECTION] [H2-EXPERIMENTS]

### 1.3 Skills ช่วยได้จริงในงานที่ศึกษา แต่ agent เขียน skill เองไม่ได้แปลว่าจะช่วย

SkillsBench v4 รายงานผลของ curated skills ใน 87 งาน 8 domains และ 18 model–harness configurations: pass rate เฉลี่ยเพิ่มจาก **33.9% เป็น 50.5% หรือ +16.6 percentage points**

แต่การทดลอง self-generated skills แยกอีกชุดบน 3 configurations กลับต่ำกว่า no-skills baseline ทั้งสามชุด ข้อค้นพบนี้ไม่ได้แปลว่าโมเดลไม่มีทางสร้าง skill ที่ดี แต่ชี้ว่า **authoring, discovery, invocation และ execution เป็นคนละปัญหา** ต้องวัดแยกกัน [SKILLSBENCH]

### 1.4 Taste ต้องมี reference และการตัดสินจากของจริง ไม่ใช่เพิ่มไฟล์ “good taste”

Skill ช่วยจัดวิธีคิด ช่วยเตรียม reference ช่วยไม่ข้ามขั้นตอน และช่วยให้รู้ว่าเมื่อไรต้องใช้ specialist ได้ แต่ไม่ทำให้โมเดลที่มองหรือประเมิน visual ไม่ได้ กลายเป็นผู้ตัดสินรสนิยมที่ไว้ใจได้ทันที

สำหรับงานใหม่ ให้เทียบผลที่ render จริงกับ brief และ raw references สำหรับงานที่มี accepted direction แล้ว ให้รักษาทิศทางนั้น ไม่ใช้ self-improvement เป็นข้ออ้าง redesign งาน [FRONTEND-SKILL] [LOCAL-VISUAL]

### 1.5 ปัญหา freeze กับปัญหาผิดซ้ำต้องแยกวงแก้

Synchronous memory operations และ worker ที่แชร์ process กับ UI อาจทำให้ UI ค้างได้ จึงควรตรวจ execution/storage boundary ก่อนเพิ่ม reflection workload หลักฐาน runtime ภายในที่เป็นที่มาของข้อกังวลนี้ไม่ได้เผยแพร่ในฉบับนี้

แต่แก้ freeze แล้วก็ยังต้องพิสูจน์ผลด้านความจำและพฤติกรรมอีกชั้นหนึ่ง ในทางกลับกัน ต่อให้ skill ดี ก็ไม่ช่วย event loop ที่ถูก block ด้วย synchronous I/O

### 1.6 คำแนะนำหลัก

**ใช้ Letta เป็นฐานความสามารถ เลือกแนวคิดจาก Harness²/ACE/GEPA/skill evaluation มาต่อวงจรเล็ก ๆ และเริ่มจากหนึ่งความผิดพลาดที่เกิดซ้ำจริง** ไม่สร้าง ecosystem ใหม่เพื่อดูแล ecosystem เดิมทั้งก้อน

---

## 2. ขอบเขต วิธีศึกษา และน้ำหนักของหลักฐาน

### 2.1 คำว่า “ทั้งหมด” ในรายงานนี้

ครอบคลุมโจทย์ที่คุยกัน:

1. Letta Code และระบบ memory/reflection/skills ที่ต้องการ port
2. memory writer กับ quote reflector ใน mahiro-pi
3. Google Research Harness²
4. loop engineering และวิธี feedback/evaluation ที่เกี่ยวข้อง
5. การสร้าง เลือกใช้ และปรับปรุง skills
6. การเสริมความสามารถด้าน taste
7. วิธีทดลองที่แยก improvement จริงออกจากการเขียนบทเรียนเพิ่ม

ไม่ได้หมายถึงสำรวจทุก paper ทุก agent framework หรือ audit ทุกโปรเจกต์บนเครื่อง

### 2.2 วิธีทำงาน

- เริ่มจากบันทึกวิจัย Harness² และ ecosystem เดิม โดยรักษาวันที่และขอบเขตเดิม บันทึกประกอบที่ไม่ได้เผยแพร่ไม่ใช่หลักฐานให้ผู้อ่านตรวจซ้ำ
- ใช้ 3 read-only research lanes แยก Harness², Letta/Pi และงานวิจัยเปรียบเทียบ
- Main อ่าน primary sources เพิ่ม ตรวจข้ออ้างสำคัญ และสังเคราะห์เป็นรายงานนี้
- อ่าน paper ของ Harness², SkillsBench v4 และ ACE ในส่วนที่เกี่ยวข้อง รวมถึง official repository/docs ของงานอื่น
- ต้นฉบับบันทึกว่ามีการตรวจข้ออ้างและภาษาแยกกัน แต่หลักฐานการตรวจภายในไม่ได้เผยแพร่ในฉบับนี้ จึงไม่ควรใช้เป็นผลตรวจอิสระที่ผู้อ่านยืนยันได้ และไม่ใช่ human acceptance หรือ benchmark reproduction

### 2.3 หลักฐานแต่ละชนิดไม่ใช้แทนกัน

| ป้าย | หมายถึง | ไม่ได้หมายถึง |
| --- | --- | --- |
| **Source-supported** | เห็นกลไกใน source/docs/test definitions ที่ระบุ | รันจริงแล้วผ่านหรือเปิดใช้ในโปรไฟล์นี้ |
| **Publisher-reported** | ผู้วิจัยรายงานผลทดลองใน paper | เราทดลองซ้ำหรือได้ผลเดียวกันกับงานของ Mahiro |
| **Analysis** | ข้อวิเคราะห์จากหลักฐานที่เชื่อมกัน | ข้อเท็จจริงที่ต้นทางรับรองทั้งหมด |
| **Proposal** | สิ่งที่เสนอให้ทดลองหรือออกแบบต่อ | อนุมัติให้แก้ code/profile/skills หรือรัน benchmark |
| **Not established** | หลักฐานรอบนี้ยังไม่พอ | พิสูจน์แล้วว่าไม่มีหรือเป็นไปไม่ได้ |

### 2.4 สิ่งที่ไม่ได้ทำ

ไม่มีการแก้ harness, policy, model/auth, personal roles, active skills หรือ private managed-memory corpus ไม่ติดตั้ง dependencies ไม่รัน framework demo/model benchmark ไม่เปิด browser/account session และไม่ commit/push

มีการใช้ research subagents ตามปกติ แต่ไม่มีการเรียกโมเดลผ่าน framework ที่กำลังศึกษาเพื่อทดลอง benchmark ใหม่ ตัวเลขใน paper ทั้งหมดจึงต้องอ่านเป็นผลที่ผู้วิจัยรายงาน

---

## 3. Current reality ของเรา ณ รอบวิจัยนี้

### 3.1 มีบันทึกแล้วไม่ได้แปลว่าจะใช้ได้ทัน

การมี research notes และความรู้ที่เก็บไว้ไม่ได้ทำให้ agent หยิบมาใช้เองเสมอไป ต้องแยก **ข้อมูลมีอยู่** ออกจาก **ค้นเจอและนำไปใช้ก่อนตัดสินใจ** บริบทสนทนาและรายการงานภายในที่ใช้ตั้งสมมติฐานนี้ไม่ได้เผยแพร่ในฉบับนี้

### 3.2 Source support ไม่ใช่สถานะเปิดใช้งาน

คำว่า **“โค้ดรองรับ automatic writer”**, **“เคยมีความจำใหม่ถูกบันทึก”** และ **“automatic writer เปิดอยู่ตอนนี้”** เป็นคนละข้ออ้าง รายงานนี้ไม่รับรองสถานะ live หรือการอนุมัติงานปัจจุบัน และไม่อนุญาตให้เปิด automatic admission

### 3.3 Source snapshots

| Repository | Pin ที่อ่าน | สถานะตอนเริ่ม |
| --- | --- | --- |
| `google-research/harness2` | `1cfe254e8d25b15f37048c3730134686abe60335` | clean |
| `letta-ai/letta-code` | `c25f091d0fce1f032e5cdf67ce131d5b474e6576` | clean |
| `mahirocoko/mahiro-pi` | `688f8854664064beb67f59f2c36bda5ad2395b7b` | source snapshot; ไม่ใช่หลักฐาน runtime |

รายการนี้เป็น source snapshots ไม่ใช่การยืนยัน binary/profile ที่กำลังใช้งานอยู่

### 3.4 ต้องรักษา authority เดิมระหว่างทดลอง

คำสั่งของ Mahiro, accepted design และ safety boundaries มีผลตาม scope ทันที ไม่ต้องรอพิสูจน์ด้วย A/B test ก่อนทำตาม

สิ่งที่ทดลองคือ **วิธีที่ทำให้ทำตามได้ดีขึ้น** ไม่ใช่ทดลองว่าควรละเมิดคำสั่งหรือไม่ ไม่ทำ baseline ด้วยการปิด guard หรือจงใจฝ่าฝืนข้อห้าม

---

## 4. แยกคำให้ตรง: memory, skill, reflection, harness และ learning

| สิ่ง | หน้าที่ | ตัวอย่าง |
| --- | --- | --- |
| Working context | สิ่งที่อยู่ในบทสนทนา/การรันปัจจุบัน | tool results, brief, code ที่เพิ่งอ่าน |
| Maintained memory | ความเข้าใจที่บำรุงรักษาข้ามงาน | preference, project facts, decisions |
| Historical recall | รื้อหลักฐานว่าเคยเกิดหรือพูดอะไร | transcript quotes พร้อมแหล่งอ้างอิง |
| Skill | procedural package ที่เรียกใช้เมื่อเหมาะ | instructions, scripts, references, assets |
| Reflection | วิเคราะห์ประสบการณ์แล้วเสนอ/แก้ความรู้หรือวิธี | memory curation, candidate skill |
| Harness | ระบบรอบโมเดลที่กำหนด context/tools/execution | prompts, tools, memory, orchestration, guards |
| Evaluation | ตรวจพฤติกรรมหรือผลลัพธ์ตามเกณฑ์ | regression test, paired task, human comparison |
| Weight learning | เปลี่ยน parameters ของโมเดล | SFT/RL ไม่ใช่แค่เพิ่ม Markdown |

ความสามารถที่ผู้ใช้ต้องการอยู่ที่ปลายทางของห่วงโซ่นี้:

```text
รับรู้เหตุการณ์ → เข้าใจถูก → วางความรู้ถูกเจ้าของ → เก็บสำเร็จ
→ ค้นเจอก่อนตัดสินใจ → เลือกวิธีถูก → ทำตามได้ → ตรวจผลตรงเรื่อง
→ ใช้กับงานใหม่ได้ → ผิดประเภทเดิมน้อยลง
```

การตรวจเพียงจุดใดจุดหนึ่งไม่รับรองทั้งห่วงโซ่ โดยเฉพาะคำว่า **“self-improving”** ต้องระบุว่าปรับอะไร ใช้ feedback แบบไหน และวัดผลระดับใด

---

## 5. Letta Code: สิ่งที่มีจริงและสิ่งที่ port แล้วไม่ได้มาด้วยเอง

### 5.1 Memory ไม่ใช่การโหลดทุกไฟล์เข้าหัว

Source ที่อ่านรองรับสอง layout:

- V1: core memory ใต้ `system/`
- V2: มี `MEMORY.md`, root Markdown เป็น core และใช้ indexes ช่วยเปิดเผย deferred detail
- V2 แยก `skills/` ออกจาก ordinary memory projection

Local prompt compiler อ่าน committed Git state ผ่าน `git ls-tree`/`git show` แล้วประกอบ projection ไม่ใช่อ่าน working-tree ทุกไฟล์มาใส่ prompt ทั้งหมด [L-FORMAT] [L-MEMORY]

**สิ่งที่ได้:** publication boundary ชัด, คงความรู้ข้าม session, เปิดรายละเอียดตามความจำเป็น

**สิ่งที่ยังต้องทำให้ดี:** index ต้องพาไปถูก, ต้องค้น detail เมื่อต้องใช้, ต้องแยกข้อมูลเก่าจาก current authority และต้องใช้ก่อนการตัดสินใจที่สำคัญ

### 5.2 Recall เป็นอีกเส้นทาง ไม่ใช่ maintained truth

Letta มี backend routing สำหรับ message search ส่วน local backend ใช้ transcript-backed full-text search ขณะที่บาง API-oriented prompt อธิบาย hybrid/vector/full-text capabilities

จึงไม่ควรพูดว่า recall ของทุก backend เป็น vector search แบบเดียวกัน Local path กับ API path ต้องตรวจแยก [L-SEARCH]

Recall ช่วยกู้คำตัดสินและเหตุผลเดิม แต่ quote ที่ค้นพบไม่ได้กลายเป็นคำสั่งปัจจุบันหรือ preference ถาวรโดยอัตโนมัติ

### 5.3 Reflection มี trigger, admission และ completion หลายชั้น

Source แยก trigger เช่น `off`, `step-count`, `compaction-event`; มี step threshold เริ่มต้น 25 และ merge policy ที่เลือกได้

หลัง turn ระบบประเมินว่าถึงเกณฑ์ไหม จากนั้น launcher ยังต้องตรวจ MemFS, การเปิด automatic reflection, retry deferral, model/provider availability, duplicate launch, dirty parent memory และ transcript delta ก่อนเริ่มงาน [L-TRIGGER] [L-LAUNCHER]

```text
ถึงจังหวะประเมิน ≠ launch แล้ว
launch แล้ว ≠ worker สำเร็จ
worker สำเร็จ ≠ merge แล้ว
merge แล้ว ≠ lesson ถูกต้อง
lesson ถูกต้อง ≠ งานถัดไปใช้แล้วดีขึ้น
```

### 5.4 Reflection ของ Letta ดูแล skills ได้จริง

`reflection-v2.md` ระบุให้พิจารณาความผิดพลาด คำแก้ preferences ข้อเท็จจริง contradictions และ reusable procedures มี creating/maintaining-memory skills ให้ใช้

แนวทางที่มีอยู่แล้วน่าสนใจ:

- อ่าน owner เดิมก่อนแก้
- ชอบปรับของเดิมมากกว่าสร้างซ้ำ
- ไม่เก็บ transient task state เป็นความรู้ถาวร
- จำกัดไม่เกินหนึ่ง skill change ต่อ run
- ไม่แน่ใจว่าควรเป็น skill ก็ไม่ต้องสร้าง
- no-op เป็นผลลัพธ์ที่ถูกต้องได้

นี่คือ **desired curation behavior ใน prompt** ไม่ใช่ตัวพิสูจน์ว่า skill ใหม่มีประสิทธิผลหรือเลือก scope ถูกเสมอ [L-REFLECTION]

### 5.5 Process/worktree isolation มีประโยชน์ แต่ไม่ใช่ sandbox สมบูรณ์

Letta รัน subagent ใน child process มีการส่ง abort ไปยัง process tree และรอการยุติก่อนถือว่าจบ cancellation

Reflection ใช้ private Git worktree จาก base HEAD ที่ระบุ แล้วให้ integration path จัดการรวมผล ภายใต้ scope และ locks ของมัน อย่างไรก็ตาม primary edits ไม่ได้อยู่ใต้ lock เดียวกันทุกเส้นทาง และ sandbox availability ยังขึ้นกับ host/backend/configuration [L-PROCESS] [L-WORKTREE]

**บทเรียนสำหรับ port:** แยก model execution, storage I/O, publication และ UI responsiveness ให้ชัด ไม่เรียกทุกอย่างว่า “background” แล้วถือว่าไม่ block

Local prompt compilation ของ Letta เองยังมี synchronous Git calls อยู่ด้วย จึงห้ามสรุปว่าแค่มี child process ก็ไม่มี parent-side blocking แล้ว

### 5.6 Skill loading มีลำดับ lookup และการ inject จริง

Source มีการค้นจาก project, agent/memory scopes, global และ bundled sources จากนั้น render เนื้อหาและ inject ให้ harness

แต่ลำดับต่อไปนี้ยังเป็นคนละหลักฐาน:

**ติดตั้ง → discover → เลือก → โหลด → ใช้ถูกจังหวะ → ทำตามถูก → ผลดีขึ้น** [L-SKILL]

### 5.7 Letta มี feedback surfaces แต่ยังไม่ใช่ future-task efficacy guarantee

Source มี Reflection Arena สำหรับเปรียบเทียบ candidate reflections และเลือก/tie ซึ่งมีคุณค่ากว่ารับ self-report อย่างเดียว แต่การเลือก reflection ไม่เท่ากับทดสอบผลของงานใหม่หลังใช้มัน

บาง path มี telemetry/upload behavior จึงไม่ควรนำมา port โดยถือว่า privacy/egress approval เดิมครอบคลุมแล้ว [L-ARENA]

### 5.8 ข้อสรุปเรื่อง Letta

**ควรศึกษาความสามารถและ transactional semantics ของมันจริงจัง ไม่ควรคัดลอกคำว่า self-improvement มาเป็น acceptance criterion** การ port ทำให้เรามีเครื่องมือเรียนรู้ที่ดีขึ้นได้ แต่การใช้เครื่องมือนั้นจนทำงานเก่งขึ้นยังต้องมี evaluation อีกชั้น

---

## 6. mahiro-pi: writer กับ reflector ซ้ำกันหรือไม่ และทำไม freeze สำคัญ

### 6.1 ไม่ใช่ worker สองตัวทำสิ่งเดียวกัน

| ตัว | Output/authority | สิ่งที่ไม่ควรอ้าง |
| --- | --- | --- |
| `managed-memory-writer` | synthesized maintained knowledge ใน private store ผ่าน read/edit/commit และ parent integration | มี commit แล้วจึงเรียนถูกและใช้เป็น |
| `memory-reflector` ใน continuity | เลือก literal historical quotes เป็น low-authority notes ไม่มีเครื่องมือเขียน Core | quote คือ current instruction หรือความรู้ที่กลั่นแล้ว |

การแยกสองส่วนมีเหตุผลด้าน authority แต่การมีเหตุผลไม่ได้พิสูจน์ว่าต้นทุนและคุณค่าของทุกชั้นเหมาะที่สุดแล้ว [P-MEMORY] [P-ROLES]

### 6.2 สิ่งที่ควรรักษาจาก Pi เดิม

- maintained knowledge มี owner เดียว
- exact-root authority และ identity-bound private views
- publication หลัง worker completion ที่เข้าเงื่อนไข
- conflict/revision handling
- แยก archive evidence ออกจาก current memory
- ไม่สืบทอด primary private corpus ทั้งก้อนให้ worker โดยปริยาย
- การอ่าน/คัดข้อมูลไม่ใช่ permission ให้แก้ระบบอื่น

Port ไม่ควรทำให้ขอบเขตเหล่านี้อ่อนลงเพียงเพื่อให้ interface คล้าย Letta

### 6.3 Freeze เป็นปัญหาสถาปัตยกรรม execution/storage ไม่ใช่ความฉลาดของ writer

Source ของ store ที่อ่านมี synchronous metadata traversal/Git calls และการ validate/save view bodies ในเส้นทางสำคัญ [P-STORE] ถ้าเส้นทางเหล่านี้รันบน UI event loop ก็มีความเสี่ยงที่จะ block UI

ฉบับนี้ละตัวเลข benchmark, profile และรายละเอียดเหตุการณ์ runtime ภายในออกแล้ว **Static inspection ไม่ได้พิสูจน์ latency จริง** ต้องวัด projection, read/query, edit และ integrate บน workload ที่เป็นตัวแทน พร้อมตรวจว่าการ rewrite/check ทั้ง view เป็นต้นทุนหลักหรือไม่

### 6.4 การคัดลอก Letta memory tool ตรง ๆ อาจคงปัญหาเดิม

Letta มี synchronous paths เช่นกัน ถ้านำ tool มาไว้ใน Pi worker ที่แชร์ event loop กับ UI ก็ยัง block ได้

สิ่งที่ต้องออกแบบคือ:

1. งานหนักอยู่นอก UI thread หรือเป็น async/chunked ที่มี bounds จริง
2. ไม่ rewrite/reread ทั้ง corpus ในทุก single-file operation โดยไม่จำเป็น
3. projection/read path ของ Main ไม่กลายเป็นจุด freeze ใหม่
4. cancel, timeout, stale completion และ crash recovery มี semantics ชัด
5. ตรวจ authority ตอน publish ไม่ใช่ตรวจเฉพาะตอนเริ่ม worker

Timer ที่อยู่ใน event loop เดียวกับ synchronous operation ไม่ใช่หลักประกัน responsiveness

### 6.5 Worktree ไม่ใช่ drop-in replacement

Pi store ปัจจุบันตั้งใจให้ `.git` เป็น directory และปฏิเสธ linked repository/worktree ขณะที่ Letta ใช้ shared Git metadata ของ worktree

ถ้าจะ port กลไกนี้ต้อง review trust model โดยตรง ไม่แก้ข้อปฏิเสธให้ผ่านแบบ incidental compatibility fix [P-STORE] [L-WORKTREE]

---

## 7. Harness²: กลไก สิ่งที่น่าใช้ และข้อจำกัดที่ต้องไม่กลบ

### 7.1 สองระดับของ recursion

**Task-level:** ปรับ execution harness ของงานปัจจุบัน ด้วย Propose–Probe–Compose

**Harnessing-level:** เก็บ adopted harness และ evidence-supported lessons เข้า improvement harness เพื่อช่วยการปรับงานในอนาคต โดย fixed model weights [H2-PAPER]

```text
baseline executions
    ↓
เสนอ invariant/general edit และ domain-specific edit
    ↓
probe: รันงานเดียวกันด้วย harness ที่เปลี่ยน
    ↓
compose: ดู trajectory/artifact contrasts แล้วประกอบ harness
    ↓
รันผลประกอบ → เลือก final → reflect/retain ตามเงื่อนไข
```

จุดแข็งคือ editor ได้เห็น execution จริง ไม่ต้องทำนายล้วน ๆ ว่าคำแนะนำใหม่จะช่วยอะไร

### 7.2 Parallel กับ sequential ไม่ใช่แค่เปลี่ยน concurrency

- **Parallel:** สำรวจหลาย candidate จากหลักฐานฐานเดียวกัน เน้นความกว้าง
- **Sequential:** นำ composed harness/history ไปเป็นฐานของรอบถัดไป เน้นความลึก

Sequential source นำ composed tree ไปต่อโดยไม่มี objective-improvement gate ดังนั้นไม่ใช่ monotonic improvement

### 7.3 ต้องแยก “keep baseline” สามความหมาย

1. **ไม่แก้ tree:** proposer/composer อาจเลือกคงของเดิม
2. **fallback เพราะโครงสร้างใช้ไม่ได้:** validation failure อาจกลับไป tree ที่รับมา
3. **เลือก baseline output เพราะ candidate แย่กว่า:** release selector ไม่เปิดตัวเลือกนี้โดยทั่วไป

`selection_pool` ระบุชัดว่า reference executions ไม่อยู่ใน pool และไม่มี abstention; ที่ `k=1` eligible final เดียวอาจถูกส่งต่อโดย `trivial_selection` [H2-SELECTION]

จึงพูดได้ว่า source มี structural fallback แต่พูดไม่ได้ว่ามี general non-regression guarantee

### 7.4 Cross-task memory ไม่ใช่เปลี่ยน Main persona ไปเรื่อย ๆ

Library เก็บ full adopted tree พร้อม cue/lesson/evidence และมี scope ตาม benchmark/mode/domain ใน schedule ที่อ่าน

งานใหม่ยังเริ่มด้วย baseline harness ส่วน experience ถูกส่งให้ improver ช่วยปรับ ไม่ใช่เอา harness ของงานก่อนมาแทน global executor ทุกครั้ง

การหยิบบทเรียนมาใช้ยังผ่านการตีความของโมเดล ไม่ใช่ mandatory recurrence blocker [H2-SOURCE]

### 7.5 Reflection prompt ดี แต่ executable gate แคบกว่า

Prompt ของ experience reflector เตือนว่า adoption ไม่ได้บอกว่า edit ไหนช่วย ให้แยก helped/hurt/no effect/confounded และอนุญาต `NO_ENTRY`

แต่ gate ใน code ตรวจการมี cue/lesson/evidence และ structural conditions ไม่ได้ตรวจว่าเหตุผลเชิงสาเหตุจริง หลักฐานอ้างถึงของจริงครบ หรือช่วย held-out task

การเก็บ full adopted tree ยังอาจพา irrelevant edits ไปด้วย แม้บทเรียนเพียงข้อเดียวมีเหตุผลดี

### 7.6 Skill surface ไม่ใช่ skill efficacy

Harness² เปิดให้แก้ prompts, guardrails, memory, tool guidance, subagents, skills, scripts และ plugins ตาม substrate

มีการตรวจ frontmatter/path/script references และเติม trigger line บางกรณี แต่ **ชื่อ skill อยู่ใน always-on text ไม่เท่ากับถูกเรียกใช้ถูกงาน** และ script compile ผ่านไม่เท่ากับทำงานถูก [H2-SOURCE]

### 7.7 ผลที่ paper รายงาน

Paper v1 รายงานการปรับหนึ่ง step ในสาม professional benchmarks และสี่ model–harness configurations มี gain สูงสุด:

- WorkBuddy-Bench: **11.5 points**
- JobBench: **4.5 points**
- LAB Partial pass rate: **11.8 percentage points**

เป็นผลที่ผู้วิจัยรายงาน ไม่ใช่ค่าเฉลี่ย gain ของทุกงาน และไม่ใช่หลักฐานตรงเรื่อง taste ของ Mahiro [H2-PAPER]

Appendix F ของ paper เองระบุว่าความต่างของ executions และ shared model biases ยังส่งผลต่อ judgment และไม่รับประกัน correctness หรือ transfer ไปงานอื่น

### 7.8 ต้นทุน: `k` ไม่ใช่จำนวน API calls สูงสุด

สำหรับหนึ่ง mode source schedule มี `4k` rollout entries และ `3k` improvement stages; selection/reflection/retries และหลาย model turns ภายใน session ยังเพิ่มได้

ถ้ารันทั้ง parallel และ sequential มี **7k unique task rollouts** เพราะ share baseline executions ไม่ใช่ 8k

ตัวเลขนี้เป็น schedule identity ของ source ที่ศึกษา ไม่ใช่ dollar cap หรือ universal formula ของทุก adapter [H2-SOURCE]

### 7.9 Evaluation และ contamination

Scoring อยู่ใน judge command แยกจาก refinement; report บางค่าใช้เฉพาะ graded rows จึงต้องดู failures/ungraded/missing coverage และ baseline denominator ประกอบ

ต้นทางเปิดเผยว่า executor มี network access และเคยมี validation rollout ดาวน์โหลด rubric ของ JobBench โดยไม่ได้สั่ง ซึ่งทำให้เห็นว่า filename tripwires ไม่ใช่ egress isolation [H2-EXPERIMENTS]

**ไม่ควร port permission-bypass behavior หรือปล่อยให้ self-improvement แก้ guards/hooks/permissions ของเครื่องทำงานจริงได้เอง**

### 7.10 สิ่งที่ควรยืม

- behavioral contrast ก่อนเก็บบทเรียน
- แยก task refinement จาก cross-task learning
- บันทึก rejected/confounded edits ไม่จำเป็นต้องบังคับมีบทเรียนบวกทุกครั้ง
- bounded budget และ provenance

### สิ่งที่ควรเพิ่มถ้าจะทำแบบของเรา

- baseline output อยู่ในตัวเลือกเสมอ และ reject-all ได้
- independent acceptance ไม่ใช้ adoption เป็นความสำเร็จ
- held-out transfer/regression ก่อนขยาย scope
- จำกัด editable surface ไม่ให้รวม safety/auth/permission
- ใช้ owner/evidence เดิม ไม่ตั้ง competing memory store

ทั้งหมดเป็นข้อเสนอ ไม่ใช่ความสามารถที่อ้างว่าต้นทางมีครบแล้ว

---

## 8. “Loop engineering” คืออะไร และไม่ควรตีความเกิน

คำนี้ในบทสนทนายังไม่ได้ระบุ project เดียวแน่นอน จึงศึกษากลุ่มวิธีที่เกี่ยวข้องแทนการเดาว่าหมายถึง package ใด

### 8.1 Retry loop กับ learning loop คนละอย่าง

```text
Retry:     ทำ → ตรวจ → แก้ → ทำซ้ำ เพื่อให้งานนี้จบ
Learning:  เก็บหลักฐาน → เปลี่ยนวิธี → ใช้ในงานใหม่ → วัดว่าดีขึ้นจริง
```

Retry มีประโยชน์ แต่ถ้าทุกรอบตีโจทย์ผิดและ verifier ก็ใช้เกณฑ์ผิด วนต่ออาจเพียงทำให้ผิดอย่างมั่นใจขึ้น

### 8.2 Ralph: การคุมวงรันและ feedback ไม่ใช่ความจำที่เชื่อถือได้โดยตัวมันเอง

Ralph ที่ Geoffrey Huntley อธิบายเน้นให้ agent ทำงานเป็นวง มี feedback และปรับ prompt/ข้อจำกัดจากสิ่งที่เห็น เป็นวิธีคิดเรื่อง execution loop ที่ควรอ่าน

แต่การรันต่อจนผ่านไม่เท่ากับมี transfer, ไม่ได้ทำให้ completion signal ถูกต้องเอง และไม่รับรองว่าต้นทุนหรือ side effects อยู่ในขอบเขต [RALPH]

**สิ่งที่ใช้ได้:** งานที่แยกผลสำเร็จตรวจได้ มี sandbox/budget/stop conditions

**สิ่งที่ต้องไม่ทำ:** ให้ agent เป็นทั้งผู้เปลี่ยน acceptance bar และผู้ประกาศผ่าน

### 8.3 Long-running harnesses: ทำให้กลับมาทำต่อได้ถูก

Anthropic อธิบายการใช้ initializer, progress artifacts, incremental work และ testing ช่วยข้าม context windows สิ่งนี้แก้ continuity และการไม่ประกาศงานเสร็จก่อนเวลาได้ส่วนหนึ่ง แต่ไม่ใช่ automatic cross-task skill improvement ทั้งระบบ [AN-HARNESS]

### 8.4 Harness engineering: เอาสิ่งที่ตรวจได้ไปอยู่ในเครื่องมือและข้อจำกัด

OpenAI อธิบาย agent-first development ที่ใช้ repository knowledge, architecture constraints, feedback loops และงานจัดการ entropy

บทเรียนที่เกี่ยวกับเราคือ บางความผิดซ้ำควรแก้ด้วย **mechanical check หรือ environment design** ไม่ใช่ prompt เพิ่มทุกครั้ง เช่น schema validation, forbidden dependency direction, authoritative source lookup หรือ deterministic test [OA-HARNESS]

แต่หลักการทั่วไปเหล่านี้ไม่ได้ระบุ implementation ที่เหมาะกับทุก repo และไม่ควรกลายเป็นข้ออ้างให้สร้าง gate หนักกับงานเล็กทุกชนิด

### 8.5 Evals ต้องแยก trajectory กับ outcome

แนวทาง agent evals ของ Anthropic เน้น task/trial/grader และผลลัพธ์จริงที่เกิดใน environment การอ่านข้อความสุดท้ายว่า “ทำเสร็จแล้ว” จึงไม่พอ

สำหรับงานของเรา ต้องดูทั้ง **ใช้วิธีที่ควรใช้หรือไม่** และ **ผลออกมาตรงโจทย์หรือไม่** พร้อมควบคุมความแปรปรวนและ grader limitations [AN-EVAL]

อีกความต่างที่สำคัญคือ **pass@k** ถามว่ามีอย่างน้อยหนึ่ง attempt สำเร็จไหม ส่วน **pass^k** ถามว่าสำเร็จสม่ำเสมอครบหลาย attempts หรือไม่ การเพิ่ม retries อาจช่วยอย่างแรกโดยไม่ได้ทำให้อย่างหลังดีขึ้น และในการใช้งานจริงระบบยังต้องรู้ด้วยว่า attempt ไหนถูก ไม่ใช่มี oracle มาเลือกย้อนหลังให้เสมอ

---

## 9. เปรียบเทียบแนวทางที่เกี่ยวข้อง

| แนวทาง | เปลี่ยนอะไร | Feedback/หลักฐานสำคัญ | จุดที่เหมาะกับเรา | ข้อจำกัดที่ต้องจำ |
| --- | --- | --- | --- | --- |
| Letta reflection | maintained context และ procedural skills | transcript/corrections, runtime integration | ความต่อเนื่องและ curation | merge สำเร็จไม่เท่ากับใช้แล้วดีขึ้น |
| Reflexion | verbal reflection/episodic context ข้าม attempts | task feedback/evaluator | แก้กลยุทธ์จาก failure ที่ตรวจได้ | feedback ผิดก็ reflect ผิด; ไม่ใช่แก้ weights |
| Voyager | curriculum, executable skill library และ retrieval | environment feedback, execution, self-verification | skill ต้องใช้ซ้ำและประกอบได้ | Minecraft ที่มี environment feedback ไม่ใช่หลักฐาน UI taste |
| ACE | evolving playbook ผ่าน Generator/Reflector/Curator | natural execution feedback, incremental curation | แก้ความรู้เฉพาะจุด ลด rewrite/collapse | feedback pollution และ context growth ยังต้องจัดการ |
| GEPA | candidate prompts/text artifacts ผ่าน reflective optimization | evaluator scores และ textual execution feedback | ทดลอง candidate แบบมี validation | ขึ้นกับ evaluator/search budget ไม่ใช่ free autonomous learning |
| Harness² | prompts/tools/memory/skills/orchestration รอบ fixed model | contrastive executions และ judgment | ทดสอบ harness edits ก่อน retain | release selector ไม่รับรอง baseline non-regression |
| SkillRL | skill bank พร้อมการฝึก policy | RL/validation feedback และ training | แนวคิด hierarchical skills/failure analysis | เป็น training system ไม่ใช่ drop-in Markdown feature |
| Agent Skills / skill-creator | portable procedure และ author/evaluate workflow | test prompts, user review, trigger tests | โครงสร้าง skill และการปรับแบบวัดผล | spec ไม่รับรอง invocation/efficacy/permission |
| SkillsBench | ไม่ใช่ learner แต่เป็น benchmark ของ skill efficacy | paired conditions และ verifiers | แยก curated/self-generated/discovery | ผลของ benchmark ไม่รับรอง personal taste |

แหล่ง: [REFLEXION] [VOYAGER] [ACE] [ACE-CODE] [GEPA] [SKILLRL] [SKILLSPEC] [SKILL-CREATOR] [SKILLSBENCH]

### 9.1 Reflexion: สะท้อนบทเรียนโดยไม่ต้อง train weights

ประโยชน์คือเปลี่ยน feedback ให้เป็นคำแนะนำที่ใช้ใน attempt ถัดไปได้ แต่การมี evaluator ไม่ได้แปลว่ามันถูกทุกครั้ง และความสำเร็จใน task family หนึ่งไม่รับรองอีก domain [REFLEXION]

### 9.2 Voyager: “สร้าง skill” ต้องมีวง execution และคลังที่นำกลับมาใช้

Voyager แยก curriculum, skill library และ iterative prompting ที่มี execution/environment feedback ความสามารถที่น่าเอามาคิดคือ **skill ที่บันทึกต้องค้นเจอและประกอบใช้ได้** ไม่ใช่สร้าง Markdown เพิ่มอย่างเดียว [VOYAGER]

### 9.3 ACE: ไม่ rewrite ความรู้ทั้งก้อนทุกครั้ง

ACE มอง context เป็น evolving playbook ใช้ localized deltas, curation, deduplication และข้อมูล helpful/harmful ช่วยลดปัญหาการสรุปจน domain detail หาย

สิ่งที่ควรยืมคือ subject-level revision และการรักษาเหตุผล/หลักฐาน ไม่ใช่สะสมทุก trajectory ตลอดไป ทั้งนี้ counters และ deterministic merge ไม่ได้ทำให้ feedback ที่ไม่ถูกต้องกลายเป็นจริง [ACE] [ACE-CODE]

Paper เองมีผลวิเคราะห์ด้าน finance ว่าเมื่อไม่มี reliable feedback เช่น ground truth หรือ execution outcomes การปรับ context อาจทำให้ผลแย่ลงและสะสม misleading signals ได้ นี่เป็นเหตุผลเชิงหลักฐานที่ไม่ควรถือว่าการ curate เพิ่มทุกครั้งทำให้ดีขึ้นเสมอ ไม่ใช่ข้อสรุปว่า ACE ใช้ไม่ได้ทุกงาน

### 9.4 GEPA: เหมาะกับการ optimize เมื่อมี feedback ที่ใช้ตัดสินได้

GEPA ใช้ reflection จาก execution feedback เพื่อเสนอ candidate และค้นหาวิธีที่ดีขึ้น จึงใกล้กับสิ่งที่ต้องการสำหรับการปรับ skill/prompt แบบมีหลักฐานมากกว่าการแก้ prose ตามความรู้สึก

แต่ต้องมี evaluator ที่เหมาะกับ outcome และแยก development/validation/final holdout ไม่ใช่ให้ candidate อ่านเฉลยหรือใช้ evaluation set เดิมจนจำโจทย์ [GEPA]

### 9.5 SkillRL: ชื่อคล้ายกัน แต่ขอบเขตต่างกันมาก

SkillRL อธิบาย skill bank ที่ co-evolve กับ policy ระหว่าง RL มี SFT/RL pipeline และ model checkpoints ดังนั้นนำมาอ้างว่าแค่เปิด skill writer ใน harness ปัจจุบันแล้วจะได้ผลแบบเดียวกันไม่ได้

สำหรับเราตอนนี้เหมาะเป็นงานอ่านเรื่อง representation/retrieval/failure-driven evolution มากกว่าเปิด training project ใหม่ [SKILLRL]

---

## 10. SkillsBench: หลักฐานตรงที่สุดสำหรับคำถาม “เขียน skill เองแล้วจะเก่งขึ้นไหม”

### 10.1 Curated skills ช่วยใน main experiment

Paper **v4** ระบุ 87 tasks / 8 domains / 18 model–harness configurations แบบ matched no-skills และ curated-skills:

| เงื่อนไข | Average pass rate |
| --- | ---: |
| No skills | 33.9% |
| Curated skills | 50.5% |
| ต่างกัน | +16.6 percentage points |

Paper ยังรายงานว่า focused skills ที่มีไม่เกินสาม modules ทำได้ดีกว่า larger/exhaustive bundles ในการวิเคราะห์ของมัน ไม่ใช่กฎตายตัวว่าทุก skill บนโลกต้องมีไม่เกินสาม modules [SKILLSBENCH]

### 10.2 Self-generated เป็นอีก diagnostic ไม่ใช่เงื่อนไขเดียวกันครบทั้ง 18 configurations

Appendix D.6, Table 6 รายงาน 3 dedicated-harness configurations:

| Harness/model | No skills | Self-generated | Δ จาก baseline | Curated | Δ จาก baseline |
| --- | ---: | ---: | ---: | ---: | ---: |
| Claude Code / Opus 4.7 | 43.0% | 34.9% | −8.1 pp | 61.2% | +18.2 pp |
| Codex / GPT-5.5 | 46.8% | 35.5% | −11.3 pp | 66.5% | +19.7 pp |
| Gemini CLI / Gemini 3.1 Pro | 36.0% | 24.5% | −11.5 pp | 60.8% | +24.8 pp |

ตัวเลขใน table ใช้ task denominator 87 เป็นผลที่ผู้วิจัยรายงาน **ไม่ได้ทดลองซ้ำในงานนี้** และไม่ได้ใช้ตัวเลขเก่า +16.2 pp จาก paper รุ่นก่อนมาผสมกับ v4

### 10.3 ทำไมยังสรุปว่า “โมเดลสร้าง skill ไม่เป็น” ไม่ได้

Protocol ใช้ creator ที่ได้รับ task package โดยเอา curated skills ออก พร้อม official skill-creator แล้วให้ solver ใช้ generated packs

มีความต่างที่มีผลต่อ causal attribution:

- Claude Code creator/solver ใช้ sandbox เดียวกันต่อเนื่อง มี filesystem state ที่ส่งต่อได้ และ creator/solver interference เป็นข้อจำกัดที่ paper ยอมรับ
- Claude Code self-generated condition ใช้ effort `max` เทียบ baseline `high`
- Codex/Gemini สร้าง packs ล่วงหน้าต่อ task/configuration แล้วนำกลับมาใช้ข้าม scored trials
- กรอบ 87 tasks × 3 trials มี 261 slots แต่ scored coverage ที่รายงานเป็น 258, 258 และ 253 slots ตามลำดับ มี missing/unscored coverage

ดังนั้น deficit รวมทั้งคุณภาพเนื้อหา discovery protocol และ creator/solver interaction ไม่ใช่การ isolate skill-content quality อย่างเดียว

### 10.4 Trajectory audit ช่วยชี้ failure modes แต่ไม่ใช่ prevalence ของทั้ง benchmark

Appendix D.6.1 ตรวจ 12 solver trajectories จาก 10 task/configuration pairs ที่เลือกจากกรณี condition gap สูง ไม่ใช่ random representative sample

สิ่งที่พบ:

1. หลาย generated packs ไม่ถูก discover/read/use เลย
2. งาน authoring เบียดงาน solving จนไม่ได้ final artifact
3. skill ที่ถูกใช้สามารถทำให้ assumption ที่ผิดหรือยังไม่ยืนยันกลายเป็นขั้นตอนที่ทำตามอย่างมั่นใจ
4. บาง apparent win เป็น instance-specific answer leakage มากกว่าความรู้ที่ใช้ซ้ำได้

กรณี `3d-scan-calc` มี caveat ว่า verifier ถูกแก้ภายหลังให้รับ millimetre interpretation จึงไม่ควรใช้เป็นตัวอย่างเด็ดขาดว่าความหมายเดิมผิดแน่นอน ส่วน `fix-visual-stability` เป็นตัวอย่างที่ paper อธิบายว่าคล้าย answer key ของ instance ไม่ใช่หลักฐาน taste transfer

### 10.5 สิ่งที่หลักฐานรองรับ

**ควรลงทุนกับ curated/verified skills และการนำไปใช้ที่ตรวจได้ ไม่ใช่ถือว่าการสร้าง skill อัตโนมัติเป็นความก้าวหน้าในตัวมันเอง**

การทดสอบต้องแยก:

```text
author → validate content → register/discover → invoke
→ execute correctly → transfer → regression
```

---

## 11. ออกแบบวงจรสร้างและเลือกใช้ skill อย่างไรโดยไม่ทำให้รกขึ้น

ส่วนนี้เป็น **ข้อเสนอ** ไม่ใช่สิ่งที่ถูกติดตั้งหรือเปิดใช้แล้ว

### 11.1 เริ่มจาก capability-gap diagnosis

ก่อนสร้าง skill ต้องตอบว่า:

- ไม่มีความรู้ หรือมีแต่ไม่ถูกค้น?
- ไม่มี procedure หรือมีแต่ไม่ถูกโหลด?
- โหลดแล้วใช้ผิด หรือโมเดลทำตามไม่ไหว?
- tool/runtime ไม่รองรับ หรือ evaluator ตรวจผิดเรื่อง?
- มีคำแนะนำซ้อน/ขัดกันหรือไม่?

ถ้าแก้ด้วย owner/index/trigger/check ที่มีแล้วได้ ให้แก้ตรงนั้น ไม่สร้าง skill ใหม่เป็นคำตอบเริ่มต้น

### 11.2 Lifecycle ที่เสนอ

| ขั้น | ผลที่ควรมี | เกณฑ์หยุด/ไม่ promote |
| --- | --- | --- |
| Observe | failure/limitation ที่อ้างหลักฐานได้ | เป็นคำเดาหรือ one-off ที่ไม่ควร generalize |
| Diagnose | hypothesis ว่าขาดอะไร | หลักฐานชี้ว่าเป็น runtime/tool bug แทน |
| Reuse | ตรวจ skill/owner เดิม | มีของเดิมที่เหมาะอยู่แล้ว |
| Candidate | เปลี่ยน procedure เล็กและ rollback ได้ | ต้องขยาย permission/เปลี่ยน safety เพื่อให้ผ่าน |
| Trigger test | should-use และ near-miss should-not-use | recall ดีขึ้นแต่ false activation สูง |
| Outcome test | paired output/trajectory ที่ตรวจตรง outcome | โหลด skill แล้วไม่เปลี่ยน decisive behavior |
| Transfer/regression | งานใหม่และกรณีใกล้เคียงที่ไม่ควรใช้ | ช่วยเฉพาะโจทย์เดิมหรือทำงานอื่นแย่ลง |
| Review/promotion | อำนาจและหลักฐานตรง scope | ยังไม่ผ่าน approval ที่ owner ต้องการ |
| Monitor/revise | ใช้ต่อ ปรับ ลดขอบเขต หรือ retire | ไม่มีประโยชน์ต่อเนื่อง/ขัด current owner |

Candidate อยู่ใน research/evidence location ก่อน ไม่เขียนทับ active skill หรือแก้ production behavior เงียบ ๆ

### 11.3 มาตรฐาน packaging ไม่ใช่มาตรฐานประสิทธิผล

Agent Skills specification แยก metadata, instructions และ resources เพื่อ progressive disclosure `name`/`description` ช่วยให้โมเดลเลือก ส่วน body/scripts/references มีไว้เมื่อใช้จริง

แต่ format validation ไม่รับรองว่า description ถูก scope, tool ใช้ได้ใน runtime นี้ หรือ procedure ช่วย outcome จริง และ `allowed-tools` ใน spec เป็น experimental ไม่ใช่ permission grant ข้าม harness [SKILLSPEC]

### 11.4 Official skill-creator มีหลายส่วนที่ตรงโจทย์

เอกสารปัจจุบันมี draft → test → human review → improve, with-skill/baseline comparisons, qualitative review และ description-trigger optimization รวมทั้ง should-trigger/should-not-trigger cases [SKILL-CREATOR]

จุดที่น่าใช้:

- แยก trigger accuracy ออกจาก output quality
- เปรียบเทียบของใหม่กับ old skill/no skill ตามบริบท
- ตรวจ transcript ว่าคำแนะนำทำให้ทำงานเสียเวลาหรือไม่
- ใช้ script สำหรับงาน deterministic ที่เกิดซ้ำ
- ไม่บังคับ mechanical score กับเรื่อง subjective ทั้งหมด

จุดที่ไม่ควรยกมาใช้ตรง ๆ:

- กลยุทธ์ description แบบ pushy อาจเพิ่ม false positives
- การเอาชุดที่เรียกว่า test มาใช้เลือก candidate ซ้ำ ๆ ทำให้ชุดนั้นทำหน้าที่เป็น **validation set** ในทางปฏิบัติ ต้องกัน final holdout เพิ่มถ้าจะอ้าง generalization
- empty feedback ไม่ควรถูกตีความเป็น human acceptance อัตโนมัติใน workflow ของเรา
- คำสั่งรัน CLI/subagents/viewer เป็น environment-specific ไม่ใช่ portable permission

### 11.5 ความคล่องไม่ได้แปลว่าใช้ skill ทุกครั้ง

Agent ที่คล่องควรเลือกได้ว่า **ไม่ต้องใช้ skill**, ใช้หนึ่ง skill, ใช้บาง reference/script หรือส่งให้ specialist เมื่อจำเป็น

ตัววัดจึงไม่ใช่ skill invocation count สูง แต่เป็น **เลือกตรง ใช้ทัน และช่วยงานโดยต้นทุนสมเหตุผล**

---

## 12. วินิจฉัยความผิดซ้ำ: ซ่อมที่สาเหตุ ไม่ใช่เพิ่มข้อห้าม

| Failure class | ตัวอย่าง | หลักฐานแยกสาเหตุ | Intervention ที่เหมาะกว่า |
| --- | --- | --- | --- |
| Capture | คำแก้สำคัญไม่เข้า eligible evidence | ตรวจ event/episode coverage | แก้ observation boundary |
| Interpretation | สรุปคำสั่งเฉพาะงานเป็น preference ถาวร | เทียบคำขอกับ knowledge delta | แก้ curation/authority reasoning |
| Publication | worker บอก save แต่ไม่ merge | committed revision/completion receipt | แก้ transaction/retry/reporting |
| Discovery | มีความรู้แต่ค้นไม่ถึง | expected source ไม่อยู่ใน evidence ที่ใช้ | แก้ index/query/routing |
| Timing | อ่านหลังทำผิดไปแล้ว | action trace เทียบจังหวะโหลด | เปลี่ยน pre-decision hook/procedure |
| Application | โหลดแล้วใช้กับงานผิดประเภท | applies/near-miss trace | แก้ scope/examples/selection |
| Capability | มีหลักเกณฑ์แต่ตัดสิน visual ไม่ไหว | render/perception probe | reference/tool/specialist ไม่ใช่ prose เพิ่ม |
| Execution | worker ทำให้ UI ค้าง | latency/profile/process evidence | แก้ execution/storage architecture |
| Verification | green tests แต่ไม่ตรงโจทย์ | grader coverage เทียบ real outcome | แก้ evaluator/acceptance |
| Overgeneralization | skill ช่วยงานเดียวแต่รบกวนงานอื่น | transfer/regression cases | ลด scope/revert/retire |

### ตัวอย่าง fixture สำหรับแยกสาเหตุ

ถ้า agent ตอบจากรายชื่อโปรเจกต์เก่า ทั้งที่มี recent notes อยู่ ยังไม่พอจะฟันธงว่า root cause เป็น search algorithm, memory corruption หรือ reflection ไม่รัน ตัวอย่างนี้เป็นแนวทางทดสอบ ไม่ใช่การเผยแพร่ transcript หรือหลักฐานเหตุการณ์ภายใน

การแก้ที่เล็กกว่าเพิ่ม writer อีกตัวคือทำ fixture ที่มี project router เก่าและ recent detail แล้วตรวจว่า agent เปิด source ที่เกี่ยวข้องก่อนตอบ แยก expected facts, citations และ freshness ออกจากความยาวของคำตอบ

### “ไม่พลาดซ้ำ” ควรให้คำมั่นระดับไหน

- ข้อที่ตรวจด้วยเครื่องได้: เพิ่ม deterministic regression/enforcement ใน scope ที่ถูกต้องได้
- ข้อที่ต้องตัดสิน: ลดความเสี่ยงด้วย evidence/routing/checks แต่ยังมี stochastic failure
- ข้อที่เป็น human taste: ให้ human direction/acceptance เป็นเจ้าของ ไม่ประกาศ guarantee จาก model judge

เป้าหมายที่ตรวจได้คือ **repeat-failure rate ลดในโอกาสที่เกี่ยวข้อง โดยไม่ลด acceptance bar และไม่เพิ่ม regression เกินขอบเขตที่ตกลง**

---

## 13. Taste: ทำให้ขาดน้อยลงได้อย่างไร และอะไรยังไม่ใช่หลักฐาน

### 13.1 แยก taste อย่างน้อยสี่เรื่อง

1. **Direction:** อะไรเหมาะกับ product/audience/brief นี้
2. **Craft:** typography, spacing, hierarchy, assets, composition และ interaction ลงตัวไหม
3. **Fidelity:** รักษา accepted direction/reference ได้ไหม
4. **Judgment:** รู้ไหมว่ายังไม่ดี และควรแก้หรือขอความช่วยเหลือตรงไหน

สี่เรื่องนี้ไม่ได้ใช้ evaluator เดียวกัน การเทียบ pixels ตรวจ fidelity ได้ แต่ไม่ตอบว่าแนวทางใหม่มีเอกลักษณ์หรือเหมาะกับตลาดไหม

### 13.2 สิ่งที่ skill ช่วยได้

- เตือนให้ทำงานจาก subject matter และ brief จริง
- พาไปดู raw references ที่ใช้กับงานนี้
- จัดลำดับจาก direction → candidate → render → critique
- เรียก specialist เมื่อมี capability gap
- ใช้ scripts/checks ช่วยเรื่องที่ตรวจได้ เช่น overflow/assets/viewport readiness
- รักษา accepted artifact โดยไม่ให้ production hardening เปลี่ยน visual โดยไม่ตั้งใจ

Official frontend-design skill ปัจจุบันเน้น intentional choices, subject grounding, restraint และ critique แต่ก็ย้ำว่า brief ที่ระบุทิศทางมีสิทธิ์เหนือ anti-template defaults [FRONTEND-SKILL]

การมี skill นี้ไม่ได้แปลว่าเกิดรสนิยมส่วนตัวของ Mahiro แล้ว และไม่ได้อนุญาตให้ใช้แทน local visual owner

### 13.3 สิ่งที่ควรเก็บเป็นตัวช่วย taste

สำหรับงาน exploratory ที่ยังไม่ล็อกทิศทาง อาจใช้:

- ตัวอย่างที่ Mahiro เลือกและไม่เลือก โดยเก็บ raw artifacts และเหตุผลที่ระบุจริง
- บริบทว่าใช้กับ product/audience/task แบบไหน
- ตัวอย่างใกล้เคียงที่ **ไม่ควรใช้ข้อสรุปเดียวกัน**
- reference provenance และสถานะว่า inspiration, exact-match target หรือ accepted direction

ไม่สรุปเป็นกฎสากลอย่าง “Mahiro ชอบแมว/สีนี้/เลย์เอาต์นี้เสมอ” จากการเลือกหนึ่งครั้ง

### 13.4 งานที่ accepted แล้วต้องคนละ path

Local `preserving-visual-direction` วางหลักให้ส่ง raw reference ตรงถึง visual owner มี Mahiro-owned visual gate และ visual lock แยกจาก technical verdict

จึงไม่ควรแปลง accepted pixels เป็น Main-authored taste doctrine แล้วให้ production model เดาว่าควรทำอย่างไร และไม่ควรเอา generic frontend-design มาทับทิศทางที่เลือกแล้ว [LOCAL-VISUAL]

### 13.5 ตัวอย่าง routing ที่เสนอ ไม่ใช่ active skill ใหม่

```text
มี accepted design/code/raster แล้ว?
  ใช่ → ส่ง raw authority โดยตรง → lock → production hardening → fidelity checks
  ไม่ใช่ → brief/reference exploration → visual-owner candidate → Mahiro เลือก

โมเดลรับภาพ/อ่านภาพได้ถูกจริงหรือไม่?
  ไม่แน่ใจ → read-only perception preflight ก่อน writes
  ไม่ได้ → หยุดหรือเปลี่ยนตัวช่วย ไม่ชดเชยด้วยการเดา
```

### 13.6 ขอบเขตคำว่า “เก่ง taste ขึ้น”

จะอ้างได้เมื่อเห็นผลกับ **brief ใหม่ที่กันไว้** และคุณตัดสินว่า fit/craft ดีขึ้นโดยไม่ทราบ variant ล่วงหน้า ไม่ใช่แค่โมเดลชมงานตัวเองมากขึ้น หรือผ่าน visual-stability verifier ของ instance เดิม

ยังไม่มีการทดลอง taste แบบนี้ในรายงานรอบนี้

---

## 14. แผนทดลอง: จากคำว่าเรียนรู้แล้วไปสู่หลักฐานว่าทำงานดีขึ้น

ส่วนนี้เป็น research design สำหรับขออนุมัติภายหลัง **ยังไม่ได้รัน**

### 14.1 เลือกหนึ่ง pain ก่อน

ตัวเลือกที่ตรงประสบการณ์รอบนี้ที่สุด:

- กู้ current/recent knowledge ก่อนตอบเรื่องงาน
- ค้น canonical owner ก่อนแก้ code/UI
- เลือก skill ให้ถูกระหว่าง new visual direction กับ preservation

ไม่เริ่มด้วย all-domain benchmark หรือเปิด autonomous self-rewrite ทั้งระบบ

### 14.2 Experimental arms

| Arm | เปลี่ยนอะไร | คำถาม |
| --- | --- | --- |
| A | approved baseline เดิมที่ปลอดภัย | ตอนนี้ทำได้แค่ไหน |
| B | baseline + discovery/trigger repair | ปัญหาอยู่ที่ความรู้มีแต่ใช้ไม่ถึงหรือไม่ |
| C | B + curated candidate skill หนึ่งเรื่อง | procedure เพิ่มช่วย outcome จริงไหม |
| D | C + bounded propose/probe/refine | loop เพิ่มคุณค่าเกินต้นทุนและ C หรือไม่ |

เริ่ม A/B ก่อนก็ได้ ถ้า B แก้ปัญหาแล้ว ไม่จำเป็นต้องสร้าง C/D

คง model/effort/tools/task inputs เท่าที่เหมาะสม ถ้าทดลอง specialist routing หรือโมเดลใหม่ ให้แยก arm ไม่รวมกับ skill edit แล้วอ้างว่าผลดีขึ้นเพราะ skill อย่างเดียว

### 14.3 แยกข้อมูลสำหรับปรับกับข้อมูลสำหรับตัดสิน

- **Development:** ใช้หาสาเหตุและออกแบบ candidate
- **Validation:** ใช้เลือก/ปรับ candidate ได้ แต่ต้องยอมรับว่าเห็นระหว่างพัฒนาแล้ว
- **Final holdout:** ไม่ให้ proposer/creator เห็นจน freeze candidate
- **Near-miss/regression:** เคสที่มีคำคล้ายแต่ไม่ควรใช้ skill หรือมี accepted direction ที่ห้าม redesign

กัน task family/project variants เท่าที่ทำได้ ไม่ถือว่าเปลี่ยนชื่อไฟล์แล้วเป็น novel task

ใช้ synthetic fixtures หรือข้อมูลที่ได้รับอนุญาตและลดข้อมูลส่วนตัวแล้ว ไม่ dump private corpus ให้ evaluator/provider ใหม่

### 14.4 วัดคนละชั้น

| Metric | นิยามใช้งาน | ข้อควรระวัง |
| --- | --- | --- |
| Knowledge discovery | พบ owner/fact ปัจจุบันที่ควรพบหรือไม่ | ไม่ใช่นับ search calls อย่างเดียว |
| Trigger precision | ถูกงานกี่ครั้งในครั้งที่เลือกใช้ skill | ต้องมี near-miss negatives |
| Trigger recall | งานที่ควรใช้ได้รับ skill กี่ครั้ง | recall สูงด้วยการใช้ทุกงานไม่ถือว่าดี |
| Pre-decision application | มี evidence ว่าใช้ก่อน decisive action | อ่านไฟล์เฉย ๆ ไม่พอ |
| First-attempt success | outcome ถูกตั้งแต่ attempt แรก | แยกจาก eventual success หลัง retries |
| Task success | outcome ผ่านเกณฑ์ที่ freeze ไว้ | รวม failure/ungraded coverage ให้เห็น |
| Repeat-failure rate | ความผิดประเภทเดิม / eligible opportunities | ไม่เอา new requirements มานับเป็นผิดซ้ำ |
| Transfer | ช่วย held-out task family ในขอบเขต | ไม่ทดสอบแค่โจทย์เดิมซ้ำ |
| Regression | งานที่ baseline ทำได้กลับเสียหรือไม่ | ตรวจงานที่ไม่ควร trigger ด้วย |
| Human correction burden | คำแก้จากความผิดเดิมและรอบรื้อ | ไม่เหมาคำคุยทุกข้อความเป็น defect |
| Cost/latency | รวม author/probe/selector/reflection/retry และ failures | missing cost ไม่ใช่ศูนย์ |
| UI responsiveness | main event-loop delay/cancel behavior | แยกจาก model response latency |

### 14.5 Repeated trials และ statistics

Pilot อาจเริ่มจากงานไม่กี่ family และหลาย trials เพื่อดูความแปรปรวน ไม่ใช่พิสูจน์ generality จาก n เล็ก

หน่วยวิเคราะห์ควรคำนึงว่า trials ของ task เดียวกันเกี่ยวข้องกัน ไม่เอาทุก rollout มานับเป็น independent user tasks ใช้ paired comparisons และรายงานความไม่แน่นอน/coverage ตามข้อมูลจริง หากข้อมูลน้อยให้รายงาน descriptive findings ก่อน ไม่สร้างตัวเลขนัยสำคัญที่เกินหลักฐาน

### 14.6 Promotion rule ต้องกำหนดก่อนเห็นผล

ตัวอย่างเงื่อนไขที่ต้องตกลง:

- ไม่ทำให้ protected requirements เสียแม้ outcome เฉลี่ยดีขึ้น
- มีผลดีกว่า baseline ตาม metric หลักที่เลือกไว้
- ไม่มี material regression ใน near-miss/accepted-direction cases
- หลักฐานว่า skill ถูกส่งถึงและใช้จริง
- ต้นทุนและ latency อยู่ใน budget ที่ยอมรับ
- reject-all และ rollback ทำได้
- ผ่าน human review ตาม owner ของการเปลี่ยน

ยังไม่กำหนดตัวเลข threshold ตายตัวในรายงานนี้ เพราะต้องเลือก task/risk/budget ก่อน ไม่ควรสร้างเกณฑ์เชิงสถิติย้อนหลังเพื่อรับ candidate ที่ชอบ

### 14.7 Taste evaluation ต้องให้มนุษย์ตัดสินสิ่งที่เป็น taste

- จับคู่ brief/input/viewport/state ให้เทียบกันได้
- สุ่ม label/ลำดับ variant ป้องกันความคาดหวังจากชื่อระบบ
- ให้เลือก A/B/tie/ไม่มีอันไหนใช้ได้ และแยกเหตุผลด้าน fit, craft, fidelity
- ตรวจ readability, assets, interactions, accessibility และ runtime ตาม scope แยกต่างหาก
- model judge ช่วย triage ได้ แต่ไม่อ้างว่าเป็น Mahiro acceptance
- ใช้ deterministic screenshot comparison สำหรับ preservation ไม่ใช้เป็น universal beauty score

---

## 15. Architecture ที่เสนอ: เพิ่มวงจรเล็ก ไม่สร้างเจ้าของข้อมูลแข่งกัน

```text
งานจริง + feedback + task/evidence เดิม
       ↓
จำแนกปัญหาและ owner
       ↓
เลือก: ไม่แก้ / retrieval repair / skill delta / tool/check / specialist
       ↓
candidate ที่แยกจาก active configuration
       ↓
paired probe + independent outcome/transfer/regression checks
       ↓
review: reject / revise / promote ตาม authority
       ↓
publish ผ่านเจ้าของเดิม + rollback reference
       ↓
ติดตาม eligible future use และ recurrence
```

### 15.1 แต่ละข้อมูลอยู่ที่ไหน

| ข้อมูล | เจ้าของที่ควรใช้ |
| --- | --- |
| งานปัจจุบัน/scope/next/blocker | tsk |
| ความเข้าใจผู้ใช้และโปรเจกต์ | maintained memory |
| ประวัติเพื่อพิสูจน์ว่าเคยพูดอะไร | recall/archive |
| วิธีทำงานซ้ำ | canonical skill/repo contract |
| candidate และผลทดลอง | existing ignored evidence/research path |
| visual authority | raw accepted reference + human gate/visual lock |
| enforced tool boundaries | guard/runtime owner ไม่ใช่ skill prose |

ไม่จำเป็นต้องสร้าง vector database, global score service, dashboard หรือ agent registry ใหม่ก่อนรู้ว่าข้อมูลเดิมไม่พอ

### 15.2 Minimal improvement record

อาจบันทึกข้อมูลเท่าที่ต้องใช้ใน task/evidence เดิม ไม่จำเป็นต้องเปิด store ใหม่:

```yaml
status: candidate  # ไม่ใช่ active policy
problem: relevant knowledge exists but was not used before answering
scope: recent-project orientation
owner: existing retrieval/procedure owner
change: one bounded discovery step
hypothesis: the step retrieves the current detail before the answer
applies: questions about recent project work
not_applies: requests requiring live runtime acceptance
baseline: approved configuration and exact task inputs
observed_application: pending
outcome: pending
transfer: pending
regression: pending
cost: not_measured
promotion: requires scoped review
rollback: exact previous version/reference
```

Schema นี้เป็นตัวอย่างวิธีคิด ไม่ใช่ format ที่ถูกติดตั้งหรือบังคับทุกงาน

### 15.3 สิ่งที่ไม่ควรให้ learning loop แก้เอง

- auth/provider/model billing configuration
- permissions, safety guards, sandbox/egress policy
- protected role identities/tool boundaries
- human acceptance criteria ให้ต่ำลงเพื่อผ่าน
- accepted visual direction
- source release/commit/push permissions

Harness² เปิด editable surface กว้างสำหรับงานวิจัย แต่ production autonomy ควรเป็น allowlist ตามภารกิจ ไม่ใช่สิทธิ์แก้ระบบที่คุมตัวเอง

---

## 16. ลำดับที่แนะนำสำหรับ Letta → Pi

| ระยะ | เป้าหมาย | หลักฐานก่อนขยับ | ไม่ทำโดยปริยาย |
| --- | --- | --- | --- |
| 0 — Scope | ตัดสินว่า port ชิ้นใดและคง authority ใด | human-approved scope/migration plan | ไม่ตีความ research เป็น approval |
| 1 — Responsiveness | memory work ไม่ทำให้ Pi UI ค้าง | representative latency/cancel/crash/publication tests | ไม่เปิด automatic admission กลับเอง |
| 2 — Continuity | ความรู้เดิมยังอยู่ อ่านและเผยแพร่ถูก | bounded migration, conflict review, fresh-session use | ไม่ claim daily usefulness จาก fixture เดียว |
| 3 — Application | กู้และใช้ current guidance ก่อนทำ | A/B discovery pilot พร้อม near-miss | ไม่เพิ่ม writer เพื่อซ่อม retrieval ทันที |
| 4 — Skill improvement | หนึ่ง candidate ช่วยงานซ้ำจริง | outcome + transfer + regression + cost | ไม่ auto-install skills ทุก incident |
| 5 — Bounded automation | ทำขั้นตอนที่ manual pilot พิสูจน์ว่าคุ้ม | monitored budget, failure recovery, explicit enable | ไม่ recursive self-rewrite ทั้งระบบ |

### เงื่อนไขสำคัญของ port

- process/thread boundary ต้องครอบคลุมงาน storage ไม่ใช่แค่ model call
- asynchronous API อย่างเดียวไม่พอถ้างาน synchronous อยู่ก่อนหรือหลัง `await`
- publication เป็น atomic/guarded boundary และตรวจสิทธิ์ปัจจุบันอีกครั้ง
- cancel/crash ต้องไม่ทิ้งงานเขียนที่กลับมา publish จาก stale generation
- bounded IPC/output/concurrency และการใช้ RAM ต้องตรวจจาก workload จริง
- รักษาไฟล์ ความหมาย provenance และ privacy ไม่ถือว่า migration แปลว่าอนุญาต upload/sync
- automatic policy เปิดได้ตาม human decision ที่ชัด ไม่ใช่เพราะ installer default หรือ source โหลดได้

รายงานนี้ไม่เปลี่ยนเจ้าของงานเดิม และไม่ได้เริ่ม implementation

---

## 17. Overengineering: อะไรคุ้ม อะไรควรรอ

### คุ้มที่จะมีเป็นแกน

- memory owner เดียวพร้อม publication/conflict semantics
- worker isolation ที่แก้ freeze จริง
- การแยก current knowledge กับ historical evidence
- การแก้ subject เดิมแทนสะสม incident rules
- baseline/rollback และ independent acceptance
- skill delivery/application checks สำหรับ pain ที่เลือก

### มีได้ แต่ต้องพิสูจน์ incremental value

- quote reflector เสริม maintained writer
- adaptive candidate authoring
- multi-candidate harness search
- automatic trigger optimization
- learned skill retrieval แทน simple metadata/index
- reflection cadence ที่ถี่ขึ้น

### ควรรอก่อน

- หลาย memory stores ที่อ้างเป็น truth พร้อมกัน
- all-domain self-improvement engine ก่อนมี pilot
- skill ใหม่จากทุกคำแก้
- evaluator ที่แก้ rubric ของตัวเองเพื่อผ่าน
- autonomous modification ของ hooks/guards/plugins ทั้งหมด
- dashboard/metrics infrastructure ที่ไม่มี decision ใช้ข้อมูล
- RL training project เพื่อแก้ pain ที่ retrieval repair อาจแก้ได้

เกณฑ์ตัดสินไม่ใช่จำนวนบรรทัด code หรือจำนวน agent อย่างเดียว แต่คือ **ความซับซ้อนเพิ่มแล้วลด failure/ภาระมนุษย์ได้เท่าไร โดยยังรักษา authority และต้นทุน**

---

## 18. ข้อสรุปตามน้ำหนักหลักฐาน และคำถามที่ยังเปิด

### สิ่งที่ยืนยันจาก source ได้

1. Letta มี autonomous memory/skill curation และ isolation/integration mechanisms จริง
2. Pi maintained writer กับ quote reflector มีหน้าที่และ authority ต่างกัน
3. Harness² ใช้ execution contrasts และ persistent improvement library แต่ไม่มี universal non-regression/transfer guarantee
4. Agent Skills มีรูปแบบ portable/progressive disclosure แต่ไม่ได้รับรอง efficacy
5. SkillRL มี training/policy adaptation จึงไม่ควรถูกอธิบายเป็นแค่ prompt/Markdown loop

### สิ่งที่มี empirical support จากผู้วิจัย แต่เรายังไม่ reproduce

1. Harness² ช่วย benchmark outcomes ใน configurations ที่ paper รายงาน
2. SkillsBench curated skills ช่วยเฉลี่ยใน main matched experiment
3. Self-generated diagnostic ใน SkillsBench v4 ต่ำกว่า baseline ใน 3 configurations ภายใต้ protocol และ coverage caveats ที่ระบุ
4. งานอย่าง ACE/GEPA/Reflexion/Voyager มีผลของผู้วิจัยใน domain/protocol ของตน ไม่ใช่ผลของ ecosystem เรา

### สิ่งที่ยังไม่ established

- workflow ใดจะลดความผิดซ้ำของ Main ได้ดีที่สุดในงานประจำ
- automatic reflection cadence เท่าไรคุ้มกับเครื่องและงานของเรา
- specialist/skill/reference แบบใดช่วย taste ของ Mahiro ได้จริง
- port ชิ้นใดคุ้มกว่าการรักษา Pi semantics แล้วแก้ execution/storage path
- installed runtime ตรงกับ source snapshots นี้ทุกชิ้นหรือไม่
- future-task transfer และ human acceptance หลัง port

### งานทดลองแรกที่แนะนำ

**เริ่มจาก recent-knowledge discovery/application** ด้วย bounded synthetic fixtures โดยยังไม่ต้องตัดสิน taste หรือเพิ่ม framework ใหม่ เหตุการณ์ภายในที่ใช้ตั้งโจทย์ไม่ได้เป็นหลักฐานสาธารณะในฉบับนี้

เมื่อวงนี้พิสูจน์ว่าความรู้ที่มีถูกใช้ทันเวลาแล้ว ค่อยแยก pilot เรื่อง skill routing และ taste augmentation ไม่เอาทั้งสามเรื่องเปลี่ยนพร้อมกันจนไม่รู้ว่าอะไรช่วย

---

## 19. Source register

### 19.1 Primary sources และขอบเขตที่ใช้

| ID | แหล่ง | ส่วนที่ใช้ / ขอบเขต |
| --- | --- | --- |
| H2-PAPER | [Harness² paper v1][H2-PAPER] | Methods, experiments, limitations/future directions; publisher results ไม่ reproduce |
| H2-SOURCE | [Harness² pinned source][H2-SOURCE] | schedule/recursion/tree/library/selection/tests ผ่าน read-only reader และ Main spot-check |
| H2-SELECTION | [Selection pool][H2-SELECTION] | baseline exclusion, trivial selection และ fallback distinctions |
| H2-EXPERIMENTS | [Experiment guide][H2-EXPERIMENTS] | separate scoring, network/sandbox และ rubric-download disclosure |
| L-FORMAT | [Letta memory formats][L-FORMAT] | v1/v2 core/deferred/skills separation |
| L-MEMORY | [Local prompt compilation][L-MEMORY] | committed-state projection และ synchronous calls |
| L-SEARCH | [Message search routing][L-SEARCH] | local/API capability boundary |
| L-TRIGGER | [Post-turn reflection][L-TRIGGER] | trigger evaluation ไม่ใช่ efficacy gate |
| L-LAUNCHER | [Reflection launcher][L-LAUNCHER] | admission/completion/integration conditions |
| L-REFLECTION | [Reflection v2 prompt][L-REFLECTION] | curation/skill remit และ no-op/commit instructions |
| L-PROCESS | [Subagent process][L-PROCESS] | child process และ cancellation |
| L-WORKTREE | [Memory worktrees][L-WORKTREE] | private proposals/integration/failure handling |
| L-SKILL | [Skill implementation][L-SKILL] | lookup, rendering, injection ไม่ใช่ skill efficacy |
| L-ARENA | [Reflection Arena][L-ARENA] | comparative feedback และ privacy-sensitive upload surfaces |
| P-MEMORY | [Pi memory contract][P-MEMORY] | knowledge/recall/reflection authority boundaries |
| P-ROLES | [Pi agent roles][P-ROLES] | managed writer เทียบ quote reflector |
| P-STORE | [Pi store][P-STORE] | synchronous operations และ standalone Git trust model |
| REFLEXION | [Official repository][REFLEXION] | mechanism/usage overview ไม่ใช่ code audit ทั้ง repo |
| VOYAGER | [Official repository][VOYAGER] | curriculum/library/feedback mechanisms |
| ACE | [ACE paper v3][ACE] | evolving context, incremental curation และข้อจำกัด feedback |
| ACE-CODE | [Paper-linked official repository][ACE-CODE] | README corroboration; ไม่ได้ full implementation audit |
| GEPA | [Official repository][GEPA] | reflective optimization/evaluator interface overview |
| SKILLRL | [Official repository][SKILLRL] | skill-bank evolution, SFT/RL distinction |
| SKILLSBENCH | [Paper v4][SKILLSBENCH] | abstract/main evaluation, Appendix D.6/Table 6/D.6.1 และ causal caveats |
| SKILLSPEC | [Agent Skills specification][SKILLSPEC] | package/metadata/progressive disclosure ไม่ใช่ permission policy |
| SKILL-CREATOR | [Official skill-creator][SKILL-CREATOR] | author/eval/trigger loop; เป็น source ที่ศึกษา ไม่ใช่ skill ที่ติดตั้ง |
| FRONTEND-SKILL | [Official frontend-design][FRONTEND-SKILL] | taste scaffolding และ brief precedence ไม่ใช่ effectiveness benchmark |
| RALPH | [Ralph article][RALPH] | representative loop engineering ไม่ถือว่าชื่อที่ผู้ใช้หมายถึงแน่นอน |
| OA-HARNESS | [OpenAI harness engineering][OA-HARNESS] | repository/environment/feedback engineering |
| AN-HARNESS | [Anthropic long-running harnesses][AN-HARNESS] | continuity, incremental execution/testing |
| AN-EVAL | [Anthropic agent evals][AN-EVAL] | task/trial/grader/outcome และ evaluation limitations |
| LOCAL-VISUAL | [Local visual-direction skill][LOCAL-VISUAL] | current local authority; ไม่ใช่ empirical taste improvement result |

### 19.2 Versions ของ public repository snapshots เพิ่มเติม

ตรวจเทียบ raw snapshots แล้ว ตรงกับไฟล์ใน commit ต่อไปนี้ขณะเก็บ:

| Repository | Commit |
| --- | --- |
| `anthropics/skills` | `dbd4588f9e1033efb41dad4bef2f7947c8993d44` สำหรับ skill-creator และ frontend-design |
| `benchflow-ai/skillsbench` | `f860ecf02ef53412a030f8661c83d644b739ff01` สำหรับ README; paper ใช้ v4 แยกกัน |
| `gepa-ai/gepa` | `8f287de942f41a6d1e0e7e5b2d576247c4bedee9` |
| `MineDojo/Voyager` | `55e45a880755d0c8c66ca7fb5fe7962ac8974f89` |
| `noahshinn/reflexion` | `218cf0ef1df84b05ce379dd4a8e47f17766733a0` |
| `aiming-lab/SkillRL` | `4d984d455b9b02f0bad283cbe9ab3d66a7e5b89d` |

ACE official README และเว็บบทความอื่นเป็นแหล่งที่เปลี่ยนได้ ไม่อ้างว่าเป็น immutable release ส่วน fetched snapshots และ source manifest ภายในไม่ได้เผยแพร่ในฉบับนี้

### 19.3 ข้อจำกัดการเข้าถึงและ provenance ที่แก้แล้ว

- Google Search HTTP ที่ลองช่วงต้นไม่ได้ส่งเนื้อหาผลค้นที่ใช้ได้ จึงไม่ใช้เป็นหลักฐาน
- GitHub search API ติด rate limit ระหว่างรอบวิจัย จึงใช้ known first-party URLs, paper links และ source clones ที่มีอยู่
- URL ที่เดา `stanfordnlp/ACE` คืน 404 ภายหลังพบ official repository จาก paper คือ `ace-agent/ace` และอ่านได้สำเร็จ ข้อผิดพลาดแรกไม่ได้แปลว่าไม่มี implementation
- ไม่ใช้ source count หรือจำนวน reader เป็นคะแนนความจริง

---

## 20. ขอบเขตฉบับเผยแพร่และการส่งต่อ

ฉบับนี้คงข้อวิเคราะห์ แผนทดลอง และแหล่งสาธารณะที่ระบุไว้ใน source register แต่ไม่รวมบันทึกวิจัยภายใน source manifests, fetched snapshots, runtime receipts หรือ review logs และไม่ใส่ลิงก์ไปยังหลักฐานที่ไม่ได้เผยแพร่ ผู้อ่านจึงตรวจต้นทางสาธารณะได้ แต่ตรวจซ้ำข้อสังเกตภายในหรือผล review เดิมจากรายงานนี้ไม่ได้

บันทึกวิจัยไม่ใช่การ sync เข้า runtime memory โดยอัตโนมัติ และการเผยแพร่เอกสารไม่ใช่การอนุมัติ implementation, migration หรือ activation

**จุดตัดสินใจถัดไป:** เลือก scope ของ memory port และ pain แรกสำหรับ efficacy pilot แยกกัน ก่อนอนุมัติการแก้ระบบหรือเปิด automatic admission

[H2-PAPER]: https://arxiv.org/html/2610.14224v1
[H2-SOURCE]: https://github.com/google-research/harness2/tree/1cfe254e8d25b15f37048c3730134686abe60335
[H2-SELECTION]: https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/harness2/core/selection.py#L93-L111
[H2-EXPERIMENTS]: https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/docs/EXPERIMENTS.md#L97-L114
[L-FORMAT]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/agent/memory-format.ts
[L-MEMORY]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/backend/local/system-prompt-compilation.ts
[L-SEARCH]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/backend/message-search.ts
[L-TRIGGER]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/cli/helpers/post-turn-reflection.ts
[L-LAUNCHER]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/cli/helpers/reflection-launcher.ts
[L-REFLECTION]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/agent/subagents/builtin/reflection-v2.md
[L-PROCESS]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/agent/subagents/subagent-process.ts
[L-WORKTREE]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/agent/memory-worktree.ts
[L-SKILL]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/tools/impl/skill.ts
[L-ARENA]: https://github.com/letta-ai/letta-code/blob/c25f091d0fce1f032e5cdf67ce131d5b474e6576/src/cli/helpers/reflection-arena.ts
[P-MEMORY]: https://github.com/mahirocoko/mahiro-pi/blob/688f8854664064beb67f59f2c36bda5ad2395b7b/docs/agent-memory.md
[P-ROLES]: https://github.com/mahirocoko/mahiro-pi/blob/688f8854664064beb67f59f2c36bda5ad2395b7b/docs/agents.md
[P-STORE]: https://github.com/mahirocoko/mahiro-pi/blob/688f8854664064beb67f59f2c36bda5ad2395b7b/lib/agent-memory/store.ts
[REFLEXION]: https://github.com/noahshinn/reflexion/blob/218cf0ef1df84b05ce379dd4a8e47f17766733a0/README.md
[VOYAGER]: https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/README.md
[ACE]: https://arxiv.org/html/2510.04618v3
[ACE-CODE]: https://github.com/ace-agent/ace
[GEPA]: https://github.com/gepa-ai/gepa/blob/8f287de942f41a6d1e0e7e5b2d576247c4bedee9/README.md
[SKILLRL]: https://github.com/aiming-lab/SkillRL/blob/4d984d455b9b02f0bad283cbe9ab3d66a7e5b89d/README.md
[SKILLSBENCH]: https://arxiv.org/html/2602.12670v4
[SKILLSPEC]: https://agentskills.io/specification
[SKILL-CREATOR]: https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/skill-creator/SKILL.md
[FRONTEND-SKILL]: https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/SKILL.md
[RALPH]: https://ghuntley.com/ralph/
[OA-HARNESS]: https://openai.com/index/harness-engineering/
[AN-HARNESS]: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
[AN-EVAL]: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
[LOCAL-VISUAL]: ../../.agents/skills/preserving-visual-direction/SKILL.md
