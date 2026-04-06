# Learning Note

## Title
Docs should state the orchestration usage contract, not just the feature list

## Date
2026-04-06

## Tags
- docs
- orchestration
- mcp
- telemetry
- async-first
- reliability

## Context
หลังทำ telemetry และ auto-async guard ให้ `apps/mcp-memory-layer` แล้ว ยังมีคำถามสำคัญจากผู้ใช้ว่า “ตอนนี้พอหรือยัง” และ “`MCP error -32001` ยังถือว่าแก้ไม่หมดใช่ไหม” จุดนี้บอกชัดว่า feature implementation อย่างเดียวไม่พอ ถ้า docs ยังไม่อธิบาย usage contract และ known limitations ให้ตรงกับของจริง

## Lesson
สำหรับระบบ orchestration เอกสารที่ดีต้องอธิบายอย่างน้อย 3 อย่างพร้อมกัน:
1. **What it does** — เช่นมี async polling, traces, usage summaries
2. **How to use it safely** — เช่นงานยาวควรใช้ `waitForCompletion: false` หรือปล่อยให้ auto-async fallback ทำงาน
3. **What it does not guarantee** — เช่นถ้า caller บังคับ `waitForCompletion: true` กับงานยาว ยังอาจชน client timeout ได้

ถ้า docs บอกแค่ feature list คนใช้จะตีความว่า bug ถูกแก้หมดแล้ว ทั้งที่ความจริงเราอาจทำได้เพียง practical mitigation เท่านั้น โดยเฉพาะกับปัญหาที่มี boundary อยู่นอก process ของเราเองอย่าง MCP/client timeout

## Evidence
- อัปเดต `apps/mcp-memory-layer/WORKFLOW.md` เพื่อเพิ่ม async-first MCP guidance, `autoAsync` behavior, polling flow, และ telemetry checks
- `README.md` ก่อนหน้านี้ถูกอัปเดตฝั่ง feature/telemetry แล้ว แต่ `WORKFLOW.md` ยังต้องตามให้ตรงกับ behavior จริง
- Opus ประเมินว่าจุด stopping point ตอนนี้โอเค ถ้ารับ contract แบบ async-first ไม่ใช่ expectation ว่า sync long-running call จะไม่มี timeout อีกเลย

## Reuse
เมื่อแก้ระบบ orchestration หรือ async tooling รอบหน้า ให้เช็กเอกสารด้วยคำถามนี้เสมอ:
- บอกหรือยังว่า default/recommended usage คืออะไร
- บอกหรือยังว่า fallback behavior จะเกิดเมื่อไร
- บอกหรือยังว่า known limitation ไหนยังไม่ถูกลบจริง แค่ถูกลดความเสี่ยง
