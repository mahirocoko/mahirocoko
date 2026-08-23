# Lesson: Custom subagent routing has two owners

**Date**: 2026-08-23
**Tags**: letta-code, subagent, git-commit, model-routing, luna-low, configuration

การเปลี่ยน model ของ custom subagent มีอย่างน้อยสองเจ้าของที่ต้องตรงกัน

1. Global agent definition กำหนด model ใน frontmatter
2. Main-agent routing policy กำหนด model ที่ส่งผ่าน `Agent({ model: ... })`

ใน local backend ค่า `model:` ที่ Main ส่งแบบ explicit มี priority เหนือ frontmatter และการเรียกที่ไม่ส่ง model อาจ inherit parent ก่อนอ่าน recommended model ของ custom agent เพราะฉะนั้นแก้เพียง `~/.letta/agents/git-commit.md` ยังไม่พอ ถ้า durable workflow memory ยังสั่ง Spark อยู่ Main ก็อาจ override Luna Low กลับไปได้

Contract ปัจจุบันคือ `git-commit` ใช้ `gpt-5.6-luna-plus-pro-low` โดยตรง ไม่ใช่ Spark-first fallback การเปลี่ยนนี้แตะเฉพาะ model routing ส่วน safety contract เดิมยังเหมือนเดิม: commit ได้เมื่อ Mahiro สั่งชัดเจนเท่านั้น, ห้าม push/amend เอง, stage เฉพาะไฟล์ที่เกี่ยวข้อง, ตรวจ secrets และอ่าน Git state ก่อนกับหลัง commit

หลังแก้ definition ให้ตรวจสองระดับแยกกัน

- Persisted state: อ่าน frontmatter กลับและตรวจ durable memory ว่าตรงกัน
- Effective process state: custom-agent registry อาจ cache ต่อ process ถ้า `/reload` แล้วยังเห็น model เก่า ให้เปิด Letta Code process ใหม่ก่อนสรุปว่า config ไม่ทำงาน

ถ้า requirement เปลี่ยนจาก fallback เป็น replacement ให้ลบ route เก่าออกจากทุก owner อย่าเก็บ fallback ไว้เงียบ ๆ เพราะนั่นจะเปลี่ยนพฤติกรรมโดยที่ human ไม่ได้ขอ
