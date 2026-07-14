# Thailand mobile-game top-up research packet

เอกสารชุดนี้ใช้ศึกษาความเป็นไปได้ของแพลตฟอร์มเติมเกมมือถือในประเทศไทย ตั้งแต่สิทธิ์ขาย แหล่งสินค้า payment gateway กฎหมาย เศรษฐศาสตร์ต่อรายการ ไปจนถึง architecture และการเปิด MVP แบบควบคุมความเสี่ยง

## เริ่มอ่านจากตรงไหน

1. [Research Handoff](thailand-mobile-game-topup-platform-handoff.md)  
   เอกสารส่งมอบสำหรับทีมที่จะศึกษาต่อ มีภารกิจ ขอบเขต งานแต่ละสาย หลักฐานที่ต้องหา Definition of Done และเงื่อนไข go/no-go

2. [Research Base](thailand-game-topup-platform.md)  
   ข้อมูลตั้งต้นฉบับเต็ม ครอบคลุมผู้จัดหาสินค้าในไทยและต่างประเทศ payment gateway กฎหมาย architecture state machine security และแหล่งอ้างอิง

3. [Supplier RFI Template](templates/game-topup-supplier-rfi.md)  
   แบบคำถามมาตรฐานสำหรับส่งหา WonDD, WeGame, WePay, Fiuu, MooGold, GamesDrop, IAK, Razer Gold, DT One และผู้จัดหาสินค้ารายอื่น

4. [Payment Gateway RFI Template](templates/game-topup-gateway-rfi.md)  
   แบบคำถามสำหรับยืนยัน Merchant Category, Fee, Settlement, Reserve, Refund, Webhook, Reconciliation และ Incident SLA

5. [Research Registers](templates/game-topup-research-registers.md)  
   Template สำหรับ Decision Register, Evidence Register, Launch SKU Matrix, Vendor Contact Log, Risk Register และ Go/No-go Record

6. [Unit Economics Template](templates/game-topup-unit-economics.md)  
   สูตรและตารางเก็บต้นทุนจริงต่อ SKU รวมค่าของ ค่ารับเงิน ภาษี FX เงินจม Refund Fraud และ Support

## ข้อสรุปตั้งต้น

การสร้างเว็บเติมเกมในไทยทำได้ แต่ต้องแก้โจทย์สองส่วนแยกกัน

- **รับเงิน** — ใช้ payment gateway ที่รองรับ Dynamic PromptPay และมี signed webhook
- **ส่งมอบสินค้า** — ต้องมีสิทธิ์ขายและ API/Code จาก publisher หรือ distributor ที่ตรวจสอบได้

ส่วนที่เสี่ยงที่สุดไม่ใช่การทำหน้า checkout แต่เป็น

1. สิทธิ์ขายเกมและ territory
2. ที่มาของสินค้าแต่ละ SKU
3. Margin หลังหักค่ารับเงิน ภาษี FX Refund และต้นทุน support
4. ความรับผิดเมื่อเติมผิด เติมซ้ำ หรือ supplier ไม่ตอบ
5. เงินที่ต้องฝากล่วงหน้ากับ supplier

ถ้ายังยืนยันห้าข้อนี้ไม่ได้ ยังไม่ควรลงทุนทำ storefront เต็มรูปแบบ

## ขอบเขต MVP ที่ใช้เป็นสมมติฐาน

- ประเทศไทยเท่านั้น
- เงินบาท
- เกมมือถือ 1–2 เกม
- Dynamic PromptPay
- payment gateway หนึ่งราย
- supplier route หนึ่งรายต่อ SKU
- เติมตรงเข้า UID หรือส่ง code ที่มีสิทธิ์ขาย
- ไม่มี wallet ของลูกค้า
- ไม่มี marketplace
- ไม่มี stored card
- ไม่ขอ password หรือ OTP ของเกม
- มี manual review และ daily reconciliation

สมมติฐานนี้เปลี่ยนได้ แต่ต้องบันทึกเหตุผลและตรวจผลกระทบด้านกฎหมาย ภาษี ระบบ และ operations ใหม่

## สถานะหลักฐาน

ข้อมูลสาธารณะในชุดเอกสารนี้ตรวจถึงวันที่ 14 กรกฎาคม 2026 แต่ยังไม่ถือว่าผู้ให้บริการรายใดผ่านการอนุมัติสำหรับ production

คำว่า “พบ API ทางการ” หมายถึงพบ Partner/Purchasing API จากผู้ให้บริการเท่านั้น ไม่ได้แปลว่า

- มีสิทธิ์ขายทุกเกมในไทย
- เปิดรับนิติบุคคลไทย
- Margin ใช้งานได้จริง
- SLA และ Refund ผ่าน
- เงินที่ฝากไว้ได้รับความคุ้มครอง
- ผ่าน Legal, Tax, Security และ PDPA Review แล้ว

## งานถัดไป

ทีมที่รับช่วงควรเริ่มจากการเลือกเกม 2 เกมและ SKU ชุดเดียวกัน แล้วส่ง RFI ชุดเดียวให้ supplier หลายรายเพื่อเทียบข้อมูลที่ระดับเดียวกัน อย่าเริ่มจากการทำ UI หรือเลือกระบบหลังบ้านก่อนรู้ว่าเรามีสิทธิ์ขายสินค้าอะไร ต้นทุนเท่าไร และส่งมอบผ่านช่องทางใด
