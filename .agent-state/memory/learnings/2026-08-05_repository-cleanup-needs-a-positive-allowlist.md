# Repository cleanup needs a positive allowlist

**Date**: 2026-08-05  
**Tags**: repository-cleanup, allowlist, deletion-safety, generated-artifacts, context-contracts

## Context

การ clean repo ที่สะสม prototype, generated output, tool config, local evidence และ historical docs มานาน ถ้าถามแค่ว่า “ลบอะไรได้บ้าง” รายการจะยาวและขอบเขตเปลี่ยนง่าย รอบนี้ก็เป็นแบบนั้น: ลบเป็นหลายเฟส ตรวจหลายรอบ แล้ว Mahiro ยังต้องคัด surface เพิ่มเองอีกชุด

## Lesson

เริ่มจาก **positive allowlist** ก่อนเสมอ:

1. app หรือ product surface ไหนต้องอยู่ต่อ
2. docs ชุดไหนยังเป็น current contract
3. local config ไหนจำเป็นต่อ runtime ปัจจุบัน
4. evidence แบบไหนต้องเก็บเพราะสร้างใหม่ไม่ได้
5. output แบบไหน regenerate ได้และลบทิ้งได้

พอ lock รายการนี้แล้ว ค่อย derive deletion set จากทุกอย่างที่อยู่นอก allowlist จากนั้นตรวจ cross-reference, tracked/untracked ownership และ Git recovery path รอบเดียว

## Apply Next Time

- ถาม “สุดท้ายอยากให้ repo เหลืออะไร” ก่อนถามรายการลบทีละกลุ่ม
- ใช้ Git history เป็น recovery สำหรับ tracked source แต่แยก ignored evidence ที่ไม่มี backup ออกมาต่างหาก
- ระหว่าง scope ยังขยับ อย่ารีบเรียก verifier หลายรอบ
- ถ้า human แก้ worktree เพิ่มเอง ให้ re-read status/diff ก่อนสรุปหรือ commit ทุกครั้ง
- current config เป็นเพียง recommendation ให้เก็บ ไม่ใช่ข้อห้ามลบ เมื่อ owner ตัดสินใจแล้วให้เดินตาม intent ล่าสุด

