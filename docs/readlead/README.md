# ReadLead

เอกสารตั้งต้นสำหรับศึกษาขอบเขตและเสนอพัฒนา ReadLead — SaaS สำหรับอ่านและแปลเนื้อหาแบบต่อเนื่องด้วย AI

## เอกสารในหมวดนี้

1. [Client proposal](client-proposal.md) — ขอบเขต MVP, research แบบไม่มีค่าใช้จ่าย, ราคา/ระยะเวลาโดยประมาณ, milestone, acceptance criteria, exclusions และข้อมูลที่ต้องยืนยันก่อนตีราคา
2. [Technical scope and client questions](technical-scope-and-client-questions.md) — architecture, content-only extraction, model/API key strategy, Quick Fix, credit economics และคำถามเชิงเทคนิค
3. [Client discovery questions and risks](client-discovery-questions-and-risks.md) — ชุดคำถามสั้นสำหรับคุยกับลูกค้า, คำอธิบายขอบเขต frontend/backend และจุดเสี่ยงที่ควรล็อกก่อนเริ่ม
4. [Bounded research scraper](scripts/README.md) — Python research probe สำหรับ 2 เว็บไซต์ × 5 เรื่อง × 5 ตอน โดยมี dry-run, robots check, request budget และ rate limit แบบ sequential

## สถานะ

เป็นเอกสาร discovery ก่อนเริ่มพัฒนา ยังไม่มี application หรือ implementation scope ที่ยืนยันแล้ว ใช้ sample URL/เนื้อหาที่ลูกค้าอนุญาตเพื่อ benchmark คุณภาพคำแปล ต้นทุน และขอบเขต URL import ก่อนเปิดงาน MVP
