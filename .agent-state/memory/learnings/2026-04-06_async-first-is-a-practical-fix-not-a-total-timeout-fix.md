# Learning Note

## Title
Async-first orchestration is a practical timeout mitigation, not a total timeout fix

## Date
2026-04-06

## Tags
- orchestration
- telemetry
- mcp
- timeout
- async-polling
- reliability

## Context
ระหว่างทำ telemetry ของ `apps/mcp-memory-layer` และพยายามลดปัญหา `mcp-memory-layer_orchestrate_workflow` ที่ยังเจอ `MCP error -32001` ผมต้องตอบให้ชัดว่าระบบตอนนี้ถือว่า “พอแล้ว” หรือยัง และควรหยุดได้ไหม

## Lesson
คำตอบที่ซื่อสัตย์คือ async polling กับ auto-async guard เป็น **practical mitigation** ที่ดีมาก แต่ไม่เท่ากับการปิดปัญหา timeout ทั้งหมดในทุก path ถ้ายังมี caller ที่บังคับ synchronous long-running execution อยู่ ระบบก็ยังมีโอกาสชน client/tool boundary timeout ได้เหมือนเดิม

ดังนั้นต้องแยกคำพูดให้ชัด:
1. ถ้า contract คือ “งานยาวต้อง async-first” -> ถือว่าแก้ได้ในทางปฏิบัติและหยุด phase นี้ได้
2. ถ้า contract คือ “ไม่ว่าทางไหนก็ต้องไม่เกิด -32001” -> ยังไม่จบ และต้องทำต่อที่ protocol/runtime boundary

อีกบทเรียนคือในฐานะ orchestrator เราไม่ควรใช้ agent แค่ช่วยคิด แต่ควรใช้ช่วยลงมือในงาน implementation ที่เป็น bounded slices ด้วย ไม่อย่างนั้นจะ underuse ความสามารถที่มีอยู่ แม้ภาพรวมจะยังดูเหมือนมี delegation อยู่ก็ตาม

## Evidence
- เพิ่ม `waitForCompletion: false` และ `get_orchestration_result`
- เพิ่ม auto-async guard สำหรับ sequential, multi-job, cursor job, หรือ large-timeout workflows เมื่อ caller ไม่ได้ระบุ `waitForCompletion`
- Opus สรุปว่าหยุดได้ถ้ารับ contract แบบ async-first แต่ยังไม่ควร claim ว่าปิด `-32001` หมดแล้ว

## Reuse
เวลาประเมินว่า bug timeout “ปิดได้หรือยัง” ให้ถาม 3 ข้อนี้ก่อน:
1. แก้ root cause จริง หรือแค่เปลี่ยน usage contract
2. มี explicit sync escape hatch อยู่ไหม
3. คำว่า done ในที่นี้หมายถึง practical mitigation หรือ absolute elimination
