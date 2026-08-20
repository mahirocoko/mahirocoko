# Model routing ต้องมี evidence ledger ไม่ใช่แค่ความประทับใจ

**Date**: 2026-08-20  
**Tags**: `model-routing`, `orchestration`, `fable`, `verification`, `direct-cli`, `memory`

## Lesson

อย่าเปลี่ยน model default จาก preset ของ project อื่น, model reputation, one-off success หรือ provider failure หนึ่งครั้ง หน่วยที่ต้องออกแบบก่อนคือ lane contract ทั้งชุด:

```text
task class + role + prompt + permissions + tools + context + effort + validation owner
```

ก่อนนับ trial เป็นหลักฐาน ต้องมี exact task/model/effort/provider/prompt/tool/output receipt และแยกสาเหตุให้ได้ว่าเกิดจาก model, prompt, tools, provider, harness หรือ orchestration หากไม่มี raw provenance ให้บันทึกเป็น `not eligible` ต่อ promotion

Ledger ที่ลด cherry-picking ได้ควร:

- ประกาศ experiment ID และ arm ก่อนเริ่มงาน
- fix primary metric และ win condition ระดับ experiment
- assign eligible enrolled tasks แบบ round-robin เว้นแต่มีข้อจำกัดที่บันทึกก่อนเห็นผล
- แยก control เดียวออกจาก candidate arms
- ใช้ stop rule กับ fabricated evidence, protected-path violation, repeated material refutation และ cost ที่สูงขึ้นโดยไม่เพิ่มคุณภาพ

Permission wording ต้องตรงกับ enforcement จริงด้วย Scout/Verifier ที่ไม่มี Edit/Write แต่ยังมี Bash เป็นเพียง partial restriction + prose contract ไม่ใช่ hard read-only

## Applied state

- Mahiro Code routing policy: agent memory commit `d849228`
- Fable review fixes: `98bd8af`
- Final closure fixes: `7d2f561`
- Final Fable verdict: `READY`, ไม่มี findings ทุก severity
- Detailed local review artifact: `.agent-state/learn/alvinunreal/oh-my-opencode-slim/2026-08-20/1337_FABLE-ROUTING-MEMORY-RECHECK.md`
