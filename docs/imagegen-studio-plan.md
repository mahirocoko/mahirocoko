# Local Imagegen Studio

> สถานะ: Planning note — พักไว้ก่อน ยังไม่เริ่ม implementation  
> อัปเดตล่าสุด: 12 กันยายน 2026

## แนวคิด

ทำ platform ส่วนตัวสำหรับจัดการงาน imagegen ตั้งแต่รับโจทย์ เขียน prompt ส่งงานให้ executor เก็บ raw output ตรวจไฟล์ ไปจนถึงเลือกภาพที่ผ่านแล้วไปใช้ต่อ

ตัวระบบควรเป็น local-first และ provider-independent โดยเริ่มจาก Codex CLI ที่ใช้อยู่จริงก่อน แต่ไม่ผูก data model หรือ workflow ไว้กับ Codex จนเปลี่ยน provider ภายหลังไม่ได้

## เป้าหมาย

- รวมงาน imagegen ที่ตอนนี้กระจายอยู่ตาม prompt, terminal session และโฟลเดอร์ output ให้กลายเป็น workflow เดียว
- เก็บ prompt, reference, executor, version, receipt, hash และผล QA ไว้กับ candidate แต่ละภาพ
- ทำ workflow template สำหรับงานที่ใช้บ่อย เช่น Header + Hero, product render, character/mascot และ transparent asset
- ให้คนเป็นผู้ตัดสิน visual direction และภาพสุดท้ายเสมอ
- ส่งออกเฉพาะ candidate ที่ผ่านการเลือกแล้ว พร้อม provenance ที่ย้อนกลับไปหา source ได้

## สิ่งที่ยังไม่ทำ

- ไม่เปิดเป็น public SaaS หรือระบบหลายผู้ใช้
- ไม่ดึง ChatGPT OAuth token ออกจาก Codex และไม่เรียก private endpoint เอง
- ไม่สร้าง social publishing, billing, team workspace หรือ cloud orchestration
- ไม่ถือว่าภาพที่ generate สำเร็จคือ production-ready โดยอัตโนมัติ
- ไม่ให้ raster mockup กลายเป็น source of truth ของ responsive UI, accessibility หรือ interaction

## Current reality

### Official Codex

- เครื่องปัจจุบันใช้ Codex CLI 0.154.0
- Hosted imagegen เป็น tool ภายใน Codex session ไม่มี stable `codex image` command
- Client source ของ 0.154.0 ยังระบุ image model เป็น `gpt-image-2`
- Tool รับ prompt และ reference selection ส่วน background, quality และ size ถูกส่งเป็น `auto`
- Runtime receipt เปิดเผย session, extension kind, call ID, saved path และ transparency result แต่ไม่เปิดเผย backend image-model ID
- Live proof ล่าสุดเรียก hosted imagegen หนึ่งครั้งสำเร็จ และได้ PNG แบบ RGB ไม่มี alpha

### Private `codex-imagegen`

- มี launcher แยกจาก official `codex` สำหรับส่ง structured `background: transparent`
- เป็น private pinned build จาก Codex 0.152.0 ไม่ควรแทนที่หรือ shadow official CLI
- Structured transparency เป็นเพียง request intent ทุก output ยังต้องตรวจ mode และ alpha จริง

### GPT-Image2-Skill ที่ศึกษาไว้

- จุดแข็งที่สุดคือ prompt gallery และ progressive-disclosure reference routing
- เหมาะสำหรับหยิบตัวอย่างใกล้เคียง 1–3 ชิ้น แล้วสกัด composition, material, lighting และ invariants มาเขียน prompt ใหม่
- CLI ของ repo ใช้ OpenAI API key แยกจาก Codex subscription และยังไม่ใช่ execution route ที่เลือกใช้
- แนวคิดจาก skill นำมาใช้ใน Prompt Compiler ได้ โดยไม่ต้องผูก platform กับ CLI ของ repo นั้น

## Product flow

```text
Create Job
  → Define Target + References
  → Compile Prompt
  → Queue
  → Execute
  → Collect Receipt + Raw Asset
  → Automatic QA
  → Human Review
  → Export / Promote
```

### 1. Create Job

Job ระบุข้อมูลอย่างน้อยดังนี้:

- ชื่องานและ project owner
- asset role เช่น `hero`, `product-render`, `character`, `background`, `overlay`
- target surface และ ratio
- creative brief
- references พร้อมบทบาทของแต่ละภาพ
- output contract เช่น opaque RGB หรือ genuine RGBA transparency
- จำนวน candidate และ retry budget

### 2. Compile Prompt

Prompt Compiler แปลง brief ให้เป็น prompt ที่พร้อมส่ง โดยใช้ลำดับประมาณนี้:

```text
artifact job + canvas + composition
→ subject/content inventory
→ region หรือ component roles
→ exact visible copy เท่าที่จำเป็น
→ material + lighting + palette
→ invariants
→ targeted avoid-list
```

สำหรับงานเว็บต้องเพิ่ม crop safety, overlay-safe area, breakpoint intent และข้อห้ามเรื่อง text/logo/watermark ปลอมด้วย

### 3. Queue และ Execute

- ใช้หนึ่ง active Codex imagegen worker ต่อครั้งเป็นค่าเริ่มต้น
- หนึ่ง dispatch ต้องมี job ID, executor, exact prompt hash และ expected output owner
- หาก request timeout หรือ pane เงียบ ต้องกู้ session เดิมก่อน ห้ามยิงงานซ้ำทันที
- Retry เกิดได้เมื่อมี terminal failure หรือ visual defect ที่ระบุได้เท่านั้น

### 4. Collect Receipt

ทุก candidate ต้องผูกกับ receipt ของตัวเอง:

- executor และ version
- session ID
- turn/call/extension ID เท่าที่ runtime เปิดเผย
- provider-returned saved path
- prompt และ reference hashes
- output SHA-256
- generation timestamp

ห้ามหา output จากไฟล์ที่ใหม่ที่สุดในโฟลเดอร์กลาง เพราะหลายงานอาจเสร็จใกล้กันและหยิบภาพผิด lane ได้

### 5. Automatic QA

ตรวจอย่างน้อย:

- ไฟล์เปิดได้และ format ตรง contract
- dimensions และ aspect ratio
- RGB/RGBA mode
- alpha extrema, transparent/partial/opaque pixel counts เมื่อต้องการ transparency
- ขอบภาพและ corner pixels
- hash และ duplicate detection
- text accuracy เมื่อภาพมีข้อความ
- provenance metadata ที่ตรวจได้ โดยไม่กล่าวเกินหลักฐาน

QA ทางเทคนิคไม่แทน visual review ภาพที่ผ่าน script อาจยังมี silhouette, composition, edge หรือ typography ที่ใช้จริงไม่ได้

### 6. Human Review

Review board ควรแสดง raw candidate โดยไม่แก้ไข พร้อมข้อมูลที่พอใช้ตัดสิน:

- prompt และ references
- executor/receipt
- QA findings
- Accept / Reject / Regenerate / Adapt
- เหตุผลสั้นๆ ของการตัดสิน

สถานะ `accepted` หมายถึงผ่าน visual gate สำหรับ job นั้น ยังไม่แปลว่าถูก promote เข้า product แล้ว

### 7. Export / Promote

- ส่งออก raw master พร้อม manifest
- แยก derivative เช่น resize, crop, dicut หรือ compression ออกจาก source
- เก็บ source → transform → output lineage
- การเขียนเข้า product repo เป็นอีก action หนึ่ง ต้องมี scope และ approval ของ repo นั้น

## Executor adapters

| Adapter | ใช้เมื่อ | ข้อจำกัด |
| --- | --- | --- |
| Official Codex | งาน imagegen ทั่วไปผ่าน subscription | เลือก image model, size, quality และ background โดยตรงไม่ได้ |
| Private `codex-imagegen` | ต้องขอ structured transparency | pinned build และผลจริงอาจยังไม่มี alpha |
| OpenAI Images API | ต้องการ model/control ที่ explicit รวมถึง GPT Image 2.5 | ใช้ API key และ billing แยก ต้องเปิดเป็น optional route |
| Future providers | ต้องการเปรียบเทียบคุณภาพหรือ capability เพิ่ม | ยังไม่อยู่ใน MVP |

Adapter ทุกตัวควรคืน normalized receipt แบบเดียวกัน แต่ต้องเก็บ raw provider response ที่ปลอดภัยไว้ด้วย เพื่อไม่ทำข้อมูลเฉพาะ provider หาย

## Workflow templates ชุดแรก

### Apple-inspired Header + Hero

- product-led composition
- focal point เดียว
- typography scale ที่สงบ ไม่ oversized ซ้ำทุก section
- negative space ชัด
- material เช่น glass หรือ aluminum ใช้เท่าที่ช่วย product story
- original branding และ assets ห้ามลอก Apple page หรือ mark โดยตรง
- generate หนึ่ง section ก่อน ไม่ทำ full-page raster ยาวใน call เดียว

### Product render

- ระบุ product geometry, camera, material, lighting และ safe crop
- แยก source art ออกจาก UI text และ semantic controls
- เตรียม opaque กับ transparent variant เมื่อมี use case จริง

### Character / Mascot

- แยก Explore กับ Adapt
- พอเลือก identity แล้ว ทุก variant ต้องอ้าง raw authority ตัวเดิม
- ห้าม output chaining ถ้าต้องรักษาตัวละคร

### Transparent web asset

- ใช้ native structured transparency ก่อนเมื่อ route รองรับ
- ตรวจ alpha หลังทุก call
- ถ้า native alpha ยังเสีย ค่อยเข้ากระบวนการ dicut โดยเก็บ raw ไว้

## Architecture เบื้องต้น

```text
Local Web UI
  ├─ Project / Job / Candidate views
  ├─ Prompt templates
  └─ Review board

Local Orchestrator
  ├─ Queue + lifecycle
  ├─ Executor adapters
  ├─ Receipt collector
  ├─ Artifact QA
  └─ Export/promote actions

Local Storage
  ├─ Metadata database
  ├─ Immutable raw assets
  ├─ Derived assets
  └─ Reports/manifests
```

ตัว UI stack, database และ service boundary ยังไม่เลือก ควรตัดสินหลังทำ executor spike ที่เล็กที่สุดก่อน

## Contracts ที่ต้องรักษา

- Local-only เป็นค่าเริ่มต้น
- ห้ามเก็บหรือแสดง credentials ใน prompt, logs, receipts หรือ process arguments
- Official Codex กับ private `codex-imagegen` ต้องเป็น executable คนละตัว
- หนึ่ง candidate ต้องมี output ownership ที่ระบุชัด
- เก็บ raw ก่อน transform ทุกครั้ง
- ไม่มี automatic promotion เข้า product
- ไม่มี visual auto-approval
- ไม่ claim model identity ถ้า provider ไม่เปิดเผย
- เปลี่ยน Codex version แล้วต้อง rerun capability probe ก่อนใช้ adapter

## คำถามที่ต้องตัดสินครั้งหน้า

1. Platform จะอยู่ใน repo ใหม่ หรือเริ่มเป็น lab ใน personal workspace
2. MVP จะควบคุม Codex ผ่าน Herdr interactive pane หรือทำ app-server adapter spike
3. Metadata จะเริ่มจาก SQLite หรือไฟล์ JSON + manifest
4. ต้องมี project-level asset library ตั้งแต่แรกหรือเริ่มจาก Job/Candidate ก่อน
5. จะเปิด OpenAI Images API เป็น optional adapter ใน MVP หรือเลื่อนไป phase ถัดไป
6. Apple-inspired Header + Hero จะเป็น workflow proof แรกหรือไม่

## จุดเริ่มต่อครั้งหน้า

1. เลือก repository boundary และชื่อชั่วคราว
2. เขียน normalized Job, Candidate, Receipt และ Artifact contracts
3. ทำ executor spike หนึ่งงาน: ส่ง prompt ครั้งเดียว แล้วคืน exact session/call/path/hash โดยไม่ค้นหาไฟล์ล่าสุด
4. ตรวจ version/capability ก่อน dispatch
5. ทำหน้า Create Job และ Candidate Review แบบเรียบง่าย
6. ใช้ Apple-inspired Header + Hero หนึ่ง section เป็น proof แรก แล้วหยุดรอ visual gate

## Resume note

เปิดเอกสารนี้แล้วเริ่มจากคำถามหกข้อในหัวข้อ “คำถามที่ต้องตัดสินครั้งหน้า” ก่อนลงมือเขียน platform ห้ามเริ่มจากหน้า UI หรือ provider abstraction จนกว่า executor spike และ normalized receipt จะพิสูจน์ได้
