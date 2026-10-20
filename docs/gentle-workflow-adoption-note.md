**ปรับ 3 จุดหลักครับ ไม่ต้องแก้ runtime ของ mahiro-pi** ผมตรวจของเดิมแล้ว หลายข้อมีอยู่แล้ว จึงควร **รวม/แก้ของเดิม ไม่เพิ่มกฎซ้ำ**

### 1. คำแนะนำของ Main — เลือกวิธีทำงาน
เจ้าของคือ managed memory ของ Pi ที่ `~/.pi/agent/memory` โดยแก้ผ่าน memory tools ไม่ยัดเพิ่มใน bootstrap

ปรับให้ตัดสินใจง่าย:
- งานชัดและเล็ก → ทำเอง
- ต้องค้นเพื่อคลายความไม่แน่ใจ → explorer
- มีงานอิสระที่คุ้มแบ่ง → writer
- รักษา independent QA ตามเกณฑ์เดิม ไม่เรียกเพิ่มเพียงเพราะแก้หลายไฟล์

### 2. `working-tasks` — โจทย์และการส่งต่องาน
Canonical อยู่ที่ `~/ghq/github.com/mahirocoko/mahiro-skills/skills/working-tasks/SKILL.md`

เพิ่มความชัดในขั้นตอนเดิม:
- เก็บ requirement และคำแก้สำคัญของคุณตรงต้นฉบับ
- Worker อ่าน task เต็ม ไม่รับเพียงบทสรุปของ Main
- หลักฐานระบุว่าใช้กับ revision/โค้ดชุดไหน
- เปลี่ยน requirement → เปิดเฉพาะงานที่กระทบ ไม่ล้างผลเดิมทั้งหมด

**ไม่สร้างเอกสาร ODD หรือ task ledger อีกชุด**

### 3. Prompt ของ subagents — สัญญารับส่งงาน
ของ Pi อยู่ที่:
- `~/.pi/agent/agents/implementer.md`
- `~/.pi/agent/agents/verifier.md`

ปรับสองฝั่งให้เข้าคู่กัน:
- **Writer:** รับ spec reference, ขอบเขตเขียน, สิ่งที่ห้ามเปลี่ยน และ checks; รายงานตาม requirement
- **Verifier:** finding ต้องมีตำแหน่ง หลักฐาน ผลกระทบ และแยกว่าเกิดจาก diff นี้หรือมีอยู่ก่อนแล้ว แยกข้อเสนอด้านสไตล์ออกจากบั๊ก
- **Main:** ตรวจ finding ก่อนสั่งแก้ และจำกัด correction ไม่เปิด sweep ใหม่วนไม่จบ

Personal roles เหล่านี้เป็น local configuration **ไม่ย้ายกลับเข้าแพ็กเกจ mahiro-pi**

---

**ตัวอย่าง:** แก้บั๊กเล็ก Main ทำเองได้; งานหลายส่วนส่ง worker พร้อม task ต้นฉบับ ส่วนการแก้คำผิดไม่ต้องสร้าง spec IDs หรือเพิ่ม reviewer

รอบแรก **ยังไม่แตะ Engram, RDD engine, model/tools/permissions, auto-commit หรือ Fable** และยังไม่ได้แก้ไฟล์ใดครับ

**ให้ผมปรับ 3 จุดนี้แบบ merge ของเดิม โดยคง QA และ human acceptance เดิมไว้เลยไหมครับ?**
