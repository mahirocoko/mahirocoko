# Learning Note

## Title
Orchestration telemetry needs per-job status before richer dashboards

## Date
2026-04-05

## Tags
- orchestration
- telemetry
- observability
- mcp-memory-layer
- reliability
- analytics

## Context
ระหว่างแก้ `Request timed out` ของ `orchestrate_workflow` และขยาย telemetry ใน `apps/mcp-memory-layer` ผมต้องตัดสินใจว่าจะทำ dashboard/usage summary ให้ละเอียดขึ้นก่อน หรือทำให้ trace data ต่อ job สมบูรณ์ก่อน โดยเฉพาะเรื่อง model telemetry

## Lesson
ถ้าจุดประสงค์คือเอา telemetry ไปวิเคราะห์และปรับปรุง orchestration/orchestrator จริง การเก็บแค่ `requestedModel` กับ `reportedModel` ยังไม่พอ ต้องมี per-job `status` ด้วย มิฉะนั้นเราจะตอบได้แค่ว่า model ไหนถูกใช้กี่ครั้ง แต่ตอบไม่ได้ว่า model ไหนล้มเหลวบ่อยกว่า, fail mode ไหนมากับ source ไหน, หรือ reliability ของ worker/model pair จริงๆ เป็นอย่างไร

ลำดับที่คุ้มค่ากว่าคือ:
1. ทำ data shape ให้ครบและสม่ำเสมอสำหรับ trace ใหม่
2. ทำ fallback ให้ legacy traces ไม่ทำให้ aggregate เพี้ยน
3. ค่อยสร้าง usage summary หรือ dashboard ที่ derive metrics จากข้อมูลพวกนั้น

อีกข้อสำคัญคือ date filters ต้องมี semantics ชัด เช่น date-only ควรตีความเป็น whole-day bounds ไม่ใช่ปล่อยให้ parser ของ platform ตัดสินเอง เพราะสุดท้ายมันกระทบความน่าเชื่อถือของการวิเคราะห์ย้อนหลังโดยตรง

## Evidence
- เพิ่ม `status` ใน `OrchestrationJobModelTelemetry`
- usage summary ใหม่รวม `byJobStatus`, `workflowOutcome`, `jobOutcome`, `byRequestedModelOutcome`
- แก้ fallback สำหรับ legacy `jobModels` ที่ยังไม่มี `status`
- เพิ่ม `--from-date` และ `--to-date` พร้อม whole-day behavior สำหรับ date-only

## Reuse
ถ้าต้องเพิ่ม telemetry ในระบบ worker orchestration อื่นอีก ให้เริ่มจากถาม 3 ข้อนี้ก่อน:
1. Event ระดับ job มี `status` ครบไหม
2. Event เก่า/legacy จะถูก aggregate อย่างไรโดยไม่เพี้ยน
3. ตัวกรองเวลาและขอบเขตของข้อมูลตีความตรงกับที่ผู้ใช้คาดไหม
