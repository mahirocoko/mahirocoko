# Project memory should use progressive disclosure

**Date**: 2026-08-09  
**Tags**: memory, memfs, context-doctor, progressive-disclosure, init, reflection

## Context

การใช้ `/init`, reflection หรือ history analyzer อาจสร้าง project memory ใต้ `system/` ได้ เมื่อเวลาผ่านไป project blocks เหล่านี้จะถูก compile เข้า prompt ทุก turn แม้ cwd และงานปัจจุบันไม่เกี่ยวข้องกัน

รอบนี้ Agent Halo, mahiro-skills, KumoWisp และ Soul Vibe กิน system memory รวม 13,131 จาก 25,852 tokens หรือประมาณครึ่งหนึ่ง

## Lesson

Project knowledge ควรแบ่งเป็นสองชั้น:

1. `system/projects-index.md` เก็บเพียงชื่อ path สัญญาณว่าเมื่อไรต้องโหลด และลิงก์ไปยัง owner
2. overview, conventions, architecture, gotchas และ recent state อยู่ใน external memory แล้วโหลดเมื่อ cwd หรือ task ตรงกับโปรเจกต์

อย่าลบรายละเอียดเพื่อแก้ prompt bloat ให้ย้ายทั้งไฟล์ออกจาก `system/` แล้วรักษา discovery path ไว้ การย้ายถือว่ายังไม่เสร็จจนกว่าจะตรวจว่าลิงก์เก่าถูกแก้ ไฟล์ปลายทางมีอยู่จริง และ token budget ลดลงตามที่ตั้งใจ

## Apply Next Time

- หลัง `/init` ให้ตรวจว่าไฟล์ใดถูกสร้างใต้ `system/`
- เก็บเฉพาะ persona, human preferences, safety boundaries และ compact project router ไว้ always-loaded
- วัดด้วย `letta memory tokens --format json --quiet` ก่อนและหลังแก้
- ใช้ Git history แยกว่าความจำมาจาก `/init`, reflection หรือ history analyzer ห้ามเดาจากชื่อใน `/palace`
- commit MemFS ก่อนคาดหวังให้ conversation อื่นเห็น revision ใหม่
- ใช้ `/recompile` กับ conversation ปัจจุบันเมื่อต้องการผลทันที ส่วน conversation อื่นให้ refresh ตอน resume/turn ถัดไป
