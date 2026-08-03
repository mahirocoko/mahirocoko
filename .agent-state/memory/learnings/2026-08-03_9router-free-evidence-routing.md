# 9Router free-model routing must separate access, reliability, and quality

**Tags:** `9router`, `free-tier`, `model-routing`, `benchmark`, `credentials`, `docker`

เมื่อจัด free-model roster อย่าเริ่มจากชื่อโมเดลหรือ catalog ให้ตรวจตามลำดับนี้:

1. **Connection truth** — provider connection มีอยู่จริงไหม, auth type อะไร, active หรือไม่ และเป็น dedicated free-tier credential หรือเปล่า
2. **Entitlement truth** — model ตอบ request จริงหรือเจอ subscription `403`, account `404` หรือ shared-pool `429`
3. **Completion truth** — HTTP 200 มี visible final content หรือใช้ budget หมดกับ reasoning
4. **Task truth** — output ผ่าน executable/semantic checks ของงานเป้าหมายไหม
5. **Operational truth** — latency, timeout, retry budget และ route determinism เหมาะกับ workflow หรือไม่

อย่ารวม failure ทุกชนิดเป็น “โมเดลไม่เก่ง” และอย่าเรียก free-only instance ว่า zero-credential หลังเพิ่ม free-tier API keys แล้ว Current docs ต้องแยก install snapshot ออกจาก live state และบอกวิธีตรวจ API ใหม่เสมอ

สำหรับ 9Router instance ปัจจุบัน provisional routing ที่มีหลักฐานดีที่สุดคือ:

```text
General: Gemma 4 31B -> MiniMax M3 -> Mimo V2.5
Coding:  Laguna S 2.1 -> Gemma 4 31B -> MiniMax M3 -> Mimo V2.5
Thai:    Gemma 4 31B -> Mimo V2.5 -> MiniMax M3
```

ผลนี้ผูกกับ route, account rights และวันที่ทดสอบ ไม่ใช่ universal model ranking
