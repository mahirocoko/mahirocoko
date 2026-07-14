# Research handoff: แพลตฟอร์มเติมเกมมือถือในประเทศไทย

**วันที่จัดทำ:** 14 กรกฎาคม 2026  
**ผู้รับเอกสาร:** Product, Business Development, Legal, Finance, Operations, UX, Engineering และ Security  
**สถานะ:** ส่งต่อเพื่อศึกษาต่อและทำ Go/No-go Decision  
**Research base:** [แนวทางสร้างเว็บเติมเกมในประเทศไทย](thailand-game-topup-platform.md)

> เอกสารนี้เป็นกรอบการศึกษาต่อ ไม่ใช่คำยืนยันว่าผู้ให้บริการรายใดมีสิทธิ์ขายเกมในประเทศไทย และไม่ใช่คำปรึกษากฎหมายหรือภาษี

### ผู้รับผิดชอบที่ต้องแต่งตั้งก่อนเริ่ม

| บทบาท | ชื่อ | หน้าที่ |
| --- | --- | --- |
| Executive sponsor | | อนุมัติงบ ความเสี่ยง และ Final Go/No-go |
| Research/decision DRI | | รวมหลักฐาน ติดตามงาน และเสนอผลตัดสินใจ |
| Product owner | | เลือกเกม SKU และขอบเขต MVP |
| Commercial owner | | ติดต่อ supplier/gateway และเจรจาสัญญา |
| Legal/Privacy owner | | กฎหมาย สัญญา ผู้บริโภค และ PDPA |
| Finance/Tax owner | | Unit economics, VAT, Accounting และเงินจม |
| Engineering/Security owner | | API spike, fault tests และ security review |
| Operations/Support owner | | Reconciliation, refund และ incident runbook |

**วันที่เป้าหมายสำหรับ Research Decision:**  
**รอบ Review:**  
**ผู้มีอำนาจตัดสิน Final Go/No-go:**

## 1. ภารกิจของทีมที่รับช่วง

หาคำตอบให้ได้ว่าเราสามารถขายเกมมือถือ 1–2 เกมในประเทศไทยอย่างถูกสิทธิ์ มีกำไร และควบคุมความเสี่ยงได้หรือไม่ โดยเริ่มจากเงินบาทและ Dynamic PromptPay ไม่มี wallet ของลูกค้า และไม่ทำ marketplace ในรอบแรก

ผลลัพธ์ปลายทางต้องเป็นหนึ่งในสี่แบบ

- **Go** — หลักฐานครบและพร้อมสร้าง Controlled MVP
- **Conditional Go** — เดินหน้าต่อได้เมื่อปิดเงื่อนไขที่ระบุ
- **Pilot Only** — ทดลองในวงจำกัดเพื่อเก็บหลักฐานเพิ่ม
- **No-go** — สิทธิ์ขาย Margin ความเสี่ยง หรือข้อกฎหมายไม่ผ่าน

### ขอบเขตของเอกสารส่งมอบ

งานของทีมวิจัยสิ้นสุดเมื่อมีหลักฐานพอให้ออกผลตัดสินใจหนึ่งในสี่แบบด้านบน ไม่จำเป็นต้องสร้าง production system ให้เสร็จก่อนปิดงานวิจัย

- Stage 0–4 คือขอบเขตหลักของ Research Handoff
- Stage 5–6 เป็น Roadmap หลังตัดสินใจ ใช้เฉพาะเมื่อผลเป็น `Go` หรือ `Conditional Go`
- `Pilot Only` ใช้เก็บหลักฐานเทคนิคหรือ operations เพิ่มได้ แต่ห้ามใช้ข้ามสิทธิ์ขาย กฎหมาย หรือการยอมรับ Merchant Category ของ payment gateway

## 2. ประเด็นสำคัญที่สุด

โจทย์ไม่ได้อยู่ที่การสร้างหน้าเว็บหรือเชื่อม PromptPay แต่อยู่ที่การหา **แหล่งสินค้าที่มีสิทธิ์ขาย ต้นทุนรวมผ่านเกณฑ์ และมีทางรับมือเมื่อรายการผิดพลาด**

ก่อนเริ่มพัฒนา storefront เต็มรูปแบบ ทีมต้องตอบให้ได้ว่า

1. จะขายเกมอะไรและ SKU ใด
2. ใครเป็นผู้จัดหาสินค้า
3. ผู้จัดหามีสิทธิ์ให้เราขายในประเทศไทยหรือไม่
4. ส่งมอบแบบเติมตรงเข้า UID หรือส่ง code
5. ต้นทุนจริงหลังรวมค่ารับเงิน ภาษี FX Refund Fraud และ Support เหลือเท่าไร
6. ใครรับผิดชอบเมื่อเติมผิด เติมซ้ำ หรือ supplier ตอบไม่ชัด
7. เงินที่ต้องฝากไว้ล่วงหน้าถอนได้หรือไม่ และเสียหายได้มากแค่ไหน
8. ร้านเป็น principal, agent หรือทำหน้าที่อีกแบบหนึ่ง
9. ต้องจดทะเบียนหรือขออนุญาตอะไรบ้าง
10. ระบบพิสูจน์ได้หรือไม่ว่า Payment และ Fulfillment ไม่เกิดซ้ำ

## 3. ขอบเขตที่ใช้เป็นสมมติฐาน

### อยู่ในขอบเขต

- ลูกค้าในประเทศไทย
- เงินบาท
- เกมมือถือ 1–2 เกม
- 5–10 SKU ต่อเกมสำหรับรอบเปรียบเทียบ
- เติมตรงเข้า UID/Server หรือส่ง code
- Dynamic PromptPay
- payment gateway หนึ่งราย
- supplier route หนึ่งรายต่อ SKU
- Guest checkout พร้อม secure order link
- Manual review
- Daily reconciliation

### ยังไม่อยู่ในขอบเขต

- Customer wallet หรือยอดเงินสะสมที่ใช้ซื้อครั้งต่อไป
- Marketplace ให้ร้านอื่นเข้ามาขาย
- Split settlement
- Stored card
- Subscription
- Multi-country
- Multi-currency
- ระบบ Affiliate ขนาดใหญ่
- Routing ไปหลาย supplier อัตโนมัติ
- การขอ password, OTP, recovery code หรือ session เกม
- การเติมผ่าน consumer account automation

### Taxonomy รูปแบบการส่งมอบ

ใช้คำต่อไปนี้ใน SKU Matrix, API Mapping และ Refund Policy

- `direct_uid` — เติมตรงด้วย UID อย่างเดียว
- `uid_server` — เติมตรงด้วย UID และ Server/Zone
- `redeemable_code` — Code, PIN, e-PIN หรือ Game Code ที่ลูกค้านำไป Redeem เอง
- `delivery_url` — ส่ง URL/Claim Link ให้ลูกค้า

หาก supplier ใช้ชื่ออื่น ให้ Map เข้ากับ Taxonomy นี้ก่อนเปรียบเทียบ อย่าแยก `pin`, `code` และ `e-PIN` เป็นคนละประเภทหากพฤติกรรมส่งมอบและ Refund เหมือนกัน

ถ้าต้องการเพิ่มรายการใดเข้าขอบเขต ต้องเปิด Legal, Tax, Fraud และ Architecture Review ใหม่

## 4. สิ่งที่เรารู้แล้ว

### 4.1 Payment กับการส่งมอบสินค้าเป็นคนละระบบ

Payment gateway มีหน้าที่รับเงิน ยืนยันสถานะ และโอนยอดให้ร้าน ส่วน supplier มีหน้าที่ตรวจ UID จัดหา code หรือเติม currency เข้าเกม

การรองรับ PromptPay ไม่ได้แปลว่ามีสินค้าเกมให้ขาย และการมี Game API ไม่ได้แปลว่าผู้ให้บริการมีสิทธิ์ขายทุกเกมในประเทศไทย

### 4.2 ผู้ให้บริการที่ควรติดต่อก่อน

#### กลุ่มไทยหรือมี operation ในไทย

1. WonDD
2. WeGame SuperAPI
3. WePay Enterprise
4. mPAY
5. Fiuu Thailand

#### กลุ่ม Regional H2H

1. MooGold
2. GamesDrop
3. IAK
4. Digiflazz
5. Prepay Nation

Razer Gold Distribution และ DT One ควรอยู่ในรายชื่อหลักเมื่อ catalog ตรงกับเกมที่เลือก

### 4.3 Payment gateway ตั้งต้น

Opn/Omise เหมาะกับรอบ MVP เพราะมีเอกสาร Dynamic PromptPay และ Webhook ค่อนข้างชัด แต่ต้องขอคำยืนยันเป็นลายลักษณ์อักษรว่ารับธุรกิจ Game Credit/Instant Digital Goods พร้อมขอ Fee, Settlement, Reserve, Refund และ Reconciliation Terms จริง

### 4.4 ขอบเขตกฎหมายที่ต้องตรวจ

- DBD และรูปแบบนิติบุคคล
- ตลาดแบบตรงและสิทธิ์ผู้บริโภค
- Payment Systems Act หากมี wallet หรือรับเงินแทนผู้อื่น
- VAT และการรับรู้รายได้แบบ gross/net
- ใบเสร็จและใบกำกับภาษี
- PDPA และการส่งข้อมูลออกนอกประเทศ
- Electronic Transaction Evidence
- ETDA Digital Platform Service หากเปลี่ยนเป็น marketplace
- สิทธิ์ใช้ชื่อ Logo ภาพ และทรัพย์สินทางปัญญาของเกม

## 5. มาตรฐานหลักฐาน

### 5.1 ลำดับความน่าเชื่อถือ

เรียงจากหลักฐานที่มีน้ำหนักมากไปน้อย

1. สัญญาที่ลงนามแล้วหรือหนังสือแต่งตั้งจาก publisher/distributor
2. คำตอบเป็นลายลักษณ์อักษรจากผู้มีอำนาจของคู่ค้า
3. Partner API Documentation หรือเอกสารใน Portal ที่ต้อง Login
4. ฐานข้อมูลหน่วยงานรัฐหรือประกาศจาก regulator
5. Terms, Product Page หรือ Price Sheet ทางการที่ยังมีผล
6. Marketing Claim ของผู้ให้บริการเอง
7. รีวิว บทความ Directory หรือข้อมูลจากผู้ขายต่อ

หลักฐานระดับล่างห้ามใช้ยืนยันข้ออ้างระดับสูง เช่น

- หน้า API ยืนยันได้แค่ว่ามี Integration Surface ไม่ได้ยืนยันสิทธิ์ขาย
- Cashback หน้าเว็บไม่ใช่ Wholesale Margin ตามสัญญา
- DBD ยืนยันตัวตนนิติบุคคล ไม่ได้ยืนยันสิทธิ์จาก publisher
- Consumer Catalog ไม่ได้ยืนยันว่าเปิดให้ขายต่อ

### 5.2 สถานะหลักฐาน

ใช้สถานะให้คงที่ทั้งโครงการ

- `confirmed` — มีเอกสารที่ตอบข้ออ้างตรง ๆ
- `likely` — มีหลักฐานหลายชิ้นสอดคล้องกัน แต่ยังขาดเอกสารหลัก
- `unconfirmed` — พบคำกล่าวอ้าง แต่ยังตรวจไม่ได้
- `contradicted` — พบหลักฐานขัดแย้ง
- `blocked` — เข้าถึงหลักฐานไม่ได้หรือรอคู่ค้า
- `expired` — เอกสารหมดอายุหรือเก่าเกินใช้ตัดสินใจ

### 5.3 กฎการบันทึก

- เขียนว่า “ยังไม่พบจากข้อมูลสาธารณะ” แทน “ไม่มี”
- แยกข้อเท็จจริงออกจากข้อเสนอของทีม
- เก็บวันที่เข้าถึง Version และ Effective Date
- เก็บ Clause หรือข้อความสั้นที่ใช้ยืนยันข้ออ้าง
- ระบุ Territory, Platform และ SKU ทุกครั้ง
- เก็บเอกสาร Confidential ในพื้นที่จำกัดสิทธิ์
- ห้ามนำ Secret, API Key, ข้อมูลลูกค้า หรือราคาที่ห้ามเผยแพร่ใส่เอกสารส่งต่อ

ใช้ Template จาก [Research Registers](templates/game-topup-research-registers.md)

## 6. Workstream A — Product และโมเดลธุรกิจ

### เป้าหมาย

เลือกสินค้าจริงที่จะใช้ทดสอบ ไม่เปรียบเทียบ supplier ด้วยคำว่า “รองรับเกมเยอะ” แบบกว้าง ๆ

### งานที่ต้องทำ

1. เลือกเกมมือถือ 2 เกมจากหลักฐานตลาดไทย
2. เลือก 5–10 SKU ต่อเกม
3. ระบุ Platform, Region, Server, UID Rule และ Denomination
4. ระบุว่าแต่ละ SKU เป็น `direct_uid`, `uid_server`, `redeemable_code` หรือ `delivery_url`
5. ตัดสินใจว่าเราตั้งใจเป็น principal หรือ agent
6. ยืนยัน PromptPay-only, no-wallet และ non-marketplace
7. ระบุ Flow ที่ห้ามใช้ เช่น ID/Password และ consumer-account automation

### ผลลัพธ์ที่ต้องส่ง

- Launch SKU Matrix
- MVP Scope Decision
- In-scope / Out-of-scope List
- Customer Data Requirement ต่อเกม

### Definition of Done

- มีเกมและ SKU ที่ระบุชื่อชัดเจน
- รู้ข้อมูลที่ต้องขอจากลูกค้าต่อ SKU
- ไม่มี Flow ที่ใช้ password หรือ OTP
- Product, Business, Legal และ Engineering รับรองขอบเขตร่วมกัน

## 7. Workstream B — ตรวจสอบผู้จัดหาสินค้า

### เป้าหมาย

หาผู้จัดหาสินค้าอย่างน้อยหนึ่งรายต่อ Launch SKU ที่มีสิทธิ์ขายในประเทศไทย มี margin สูงกว่าเกณฑ์ที่กำหนด และมี API/Operations ที่รับมือ Failure ได้

### งานที่ต้องทำ

1. ส่ง RFI ชุดเดียวกันให้ supplier อย่างน้อย 3 ราย
2. ใช้ SKU Basket ชุดเดียวกันทุกเจ้า
3. ตรวจ Contracting Entity และ Bank Account Name
4. ขอ Authorization Chain ต่อเกม
5. ขอ Rate Card และ Funding Terms
6. ขอ Sandbox/API Docs
7. ทดสอบ Player Validation, Order, Callback, Status Query และ Reconciliation
8. ตรวจ Wrong UID, Timeout, Duplicate, Refund และ Maintenance Flow
9. บันทึก Support Hour และ Escalation Contact
10. จำกัดเงินทดลองและตรวจถอนยอดคงเหลือ

### น้ำหนักประเมิน

| เกณฑ์ | น้ำหนัก | Gate |
| --- | ---: | --- |
| สิทธิ์ขายและที่มาสินค้า | 25% | ต้องผ่าน |
| Catalog ไทยและรูปแบบส่งมอบ | 15% | ต้องผ่านต่อ SKU |
| API Reliability/Idempotency | 15% | ต้องผ่านก่อน Pilot |
| Margin หลังรวมต้นทุน | 15% | ต้องผ่านเกณฑ์เจ้าของโครงการ |
| Refund/Failure Allocation | 10% | ต้องมีเป็นลายลักษณ์อักษร |
| ความเสี่ยงจากเงินฝากล่วงหน้า | 10% | ต้องมีวงเงินสูงสุด |
| Tax/Document Fit | 5% | นักบัญชีรับรอง |
| Support/SLA | 5% | ต้องมี Escalation |

คะแนนรวมสูงไม่สามารถชดเชยกรณีไม่มีสิทธิ์ขายได้

### ผลลัพธ์ที่ต้องส่ง

- Supplier RFI Response Pack
- Authorization Matrix
- Supplier Scorecard ต่อ SKU
- API/Sandbox Test Report
- Funding and Custody Assessment
- Recommended Supplier พร้อมเหตุผล

### Definition of Done

- Supplier อย่างน้อย 2 รายตอบ SKU Basket ชุดเดียวกัน
- Launch SKU ทุกตัวมี Authorization Chain ที่ตรวจสอบได้ ส่วน SKU ที่ไม่ผ่านต้องถูกตัดออกหรือบันทึกเป็น `blocked`/`rejected` พร้อมเหตุผล
- API แสดง Idempotency, Callback, Status Query และ Reconciliation
- รู้ Minimum Deposit, Withdrawal, Refund, SLA และ Tax Document
- ถ้าไม่มีรายใดผ่าน ต้องออก No-go หรือเปลี่ยน SKU

ใช้ [Supplier RFI Template](templates/game-topup-supplier-rfi.md)

## 8. Workstream C — Payment gateway

### งานที่ต้องทำ

ส่ง Merchant Profile จริงให้ Opn และ Gateway สำรองหนึ่งราย โดยระบุ

- Instant Digital Goods / Game Credit
- Average Order Value
- ยอดรายการต่อเดือนโดยประมาณ
- PromptPay-only MVP
- สินค้าส่งมอบทันทีและย้อนคืนยาก
- ไม่มี Customer Wallet

ขอคำตอบเรื่อง

- รับ Merchant Category นี้หรือไม่
- Dynamic QR Expiration
- Signed Webhook และ Replay Protection
- Duplicate/Out-of-order Event
- Settlement T+N
- Reserve/Holdback
- Refund PromptPay
- Late Payment
- Fee และ VAT on Fee
- Reconciliation File/API
- Incident Escalation

### Definition of Done

- Gateway ยืนยันรับธุรกิจเป็นลายลักษณ์อักษร
- ได้ Binding Quote หรือ Formal Fee Sheet
- ทดสอบ Sandbox Dynamic QR และ Webhook
- Browser Redirect, Slip และ QR Scan State ไม่สามารถเริ่ม Fulfillment
- ประเมิน Gateway สำรองแล้วอย่างน้อยหนึ่งราย

ใช้ [Payment Gateway RFI Template](templates/game-topup-gateway-rfi.md)

## 9. Workstream D — กฎหมาย ภาษี และ PDPA

### คำถามสำหรับทนาย

1. โมเดลนี้ทำให้บริษัทเป็น principal, disclosed agent หรือบทบาทอื่น
2. การขาย catalog ของบริษัทเองผ่าน Gateway อยู่ภายนอกใบอนุญาต Payment Service หรือไม่
3. Feature ใดทำให้เข้าข่าย e-money, รับเงินแทน, settlement หรือ marketplace
4. ต้องจดตลาดแบบตรงหรือได้รับยกเว้นแบบใด
5. สิทธิ์ยกเลิก 7 วันใช้กับ Game Credit ที่เติมทันทีหรือไม่
6. Checkout ต้องเปิดเผยและขอการยืนยันอะไรบ้างก่อนส่งมอบแบบย้อนคืนไม่ได้
7. ข้อความ “ไม่คืนเงินหลังส่งมอบสำเร็จ” ใช้ได้แค่ไหน
8. ต้องเก็บหลักฐานอะไรเพื่อยืนยันว่าลูกค้าเลือก UID/Server/SKU เอง
9. ร้านรับผิดอย่างไรหาก supplier ไม่มีสิทธิ์หรือ code ใช้ผิด region
10. หากเพิ่ม marketplace ภายหลัง ต้องมีใบอนุญาตหรือแจ้งหน่วยงานใด

### คำถามสำหรับนักบัญชี

1. รับรู้รายได้ gross หรือ net
2. บริษัทเป็น principal หรือ agent ในมุมบัญชี/VAT
3. ซื้อสินค้าจาก supplier ต่างประเทศมี VAT หรือภาษีบริการข้ามประเทศอย่างไร
4. เงินฝากล่วงหน้ากับ supplier บันทึกอย่างไร
5. เอกสารใดใช้รับรู้ต้นทุนได้
6. ออกใบเสร็จ ใบกำกับภาษีเต็มรูป และ e-Tax เมื่อไร
7. มี withholding tax ต่อค่าบริการใดหรือไม่
8. Refund, Reversal, Expired Code และ Correcting Entry บันทึกอย่างไร

### งานด้าน PDPA

- ทำ Data Inventory
- ระบุ Controller/Processor
- ตรวจ UID+Server ว่าเป็นข้อมูลส่วนบุคคลในบริบทนี้หรือไม่
- ระบุข้อมูลที่จำเป็นต่อสัญญา
- แยก Marketing Consent
- ทำ Retention Schedule
- ตรวจ Cross-border Transfer
- เตรียม Data-subject Request และ Breach Runbook

### Definition of Done

- มี Legal Memo ผูกกับ Flow ของ MVP จริง
- มี Accounting/Tax Memo
- Terms, Privacy, Refund และ Checkout Consent ผ่านการตรวจ
- ประเด็นที่ยังไม่จบถูกระบุเป็น Stop-ship พร้อมเจ้าของงาน

## 10. Workstream E — Unit economics และเงินจม

อย่าประเมินจาก Cashback หรือส่วนลด supplier อย่างเดียว ต้องคำนวณต่อ SKU

```text
ราคาที่ลูกค้าจ่าย
− ภาษีที่ต้องจัดสรร
− ต้นทุนจาก supplier
− FX และค่าฝากเงิน
− payment fee และ VAT ของ fee
− expected refund/reversal cost
− supplier failure loss
− fraud loss
− support cost
− promotion/cashback
= contribution margin
```

### Scenario ที่ต้องมี

- Order ฿20–฿50
- Order ฿100–฿300
- High-value order
- Wrong UID
- Supplier timeout/unknown
- Refund ก่อน Fulfillment
- Supplier Balance หมด
- FX ขยับ
- Supplier เปลี่ยนราคา
- Failure/Refund Rate 1%, 3% และ 5%

### Definition of Done

- เทียบ SKU ชุดเดียวกันอย่างน้อย 2 supplier
- Fee มาจาก Quote จริง
- นักบัญชีตรวจ Tax Treatment
- รวม Refund, Failure, FX, Support และเงินจม
- กำหนด Margin Floor
- กำหนดวงเงิน Pre-fund สูงสุด
- ตอบได้ว่า Micro-order ยังทำกำไรหรือไม่

ใช้ [Unit Economics Template](templates/game-topup-unit-economics.md)

## 11. Workstream F — Customer UX และ Operations

### Journey ที่ต้องออกแบบ

1. เติม UID สำเร็จ
2. ส่ง code สำเร็จ
3. UID/Server ไม่ถูกต้องก่อนจ่ายเงิน
4. Payment Pending/Expired
5. จ่ายหลัง QR หมดอายุ
6. จ่ายแล้วแต่ supplier ล่ม
7. Supplier Timeout และผลลัพธ์ไม่ชัด
8. ลูกค้ากรอก UID ผิด
9. Code ใช้ไม่ได้หรือผิด region
10. ลูกค้ากดส่งซ้ำ
11. Refund ก่อนส่งมอบ
12. Manual Review และ Support Escalation

### ข้อกำหนด UX

- แสดง Game, Region, Server, UID, SKU, ราคา และผลด้าน Refund ก่อนจ่ายเงิน
- ให้ลูกค้ายืนยันข้อมูลที่ย้อนคืนไม่ได้
- ห้ามแสดงว่าสำเร็จก่อน supplier ยืนยัน
- Order ที่จ่ายแล้วแต่ยังไม่เสร็จต้องมี durable order link
- ไม่ใช้ Internal State เช่น `UNKNOWN` เป็นข้อความให้ลูกค้าเห็น
- ไม่ขอ password, OTP หรือบัตรประชาชนโดยไม่จำเป็น
- แสดงเลขอ้างอิงและเวลา Support

### Operations ที่ต้องเตรียม

- Manual Review Queue
- Refund Authority Matrix
- Supplier/Game Kill Switch
- Daily Reconciliation Checklist
- Unknown Fulfillment Runbook
- Late Payment Runbook
- Supplier Balance Alert
- Incident Severity/Escalation
- Customer Support Templates
- End-of-day Financial Close

### Definition of Done

- ทุก Internal State มีการจัดการฝั่งลูกค้าและ Operations
- ทดสอบ Prototype กับผู้ใช้ไทยที่เป็นกลุ่มเป้าหมายอย่างน้อย 5 คน
- ทดสอบ Pending/Delayed/Error ไม่ใช่เฉพาะ Happy Path
- Operations ซ้อม Supplier Outage, Duplicate Webhook และ Balance หมด
- ไม่มี Flow ที่ใช้ password หรือ OTP เกม

## 12. Workstream G — Architecture และ Security

### Architecture baseline

ใช้ Modular Monolith + PostgreSQL + Durable Queue ก่อน ไม่ต้องเริ่มจาก Microservices

แยกชุดข้อมูลหลักสี่ชุด

1. Order
2. Payment Attempt
3. Fulfillment Attempt
4. Accounting Ledger

ใช้หลัก

```text
at-least-once delivery
+ authenticated events
+ idempotent handlers
+ durable inbox/outbox
+ reconciliation
```

### ADR ที่ต้องเขียน

- Modular Monolith
- PostgreSQL
- Queue/Transactional Outbox
- Payment Webhook Inbox
- Supplier Adapter
- Ledger
- Guest Secure-order Link
- Secrets/KMS
- Audit Log
- Reconciliation Import

### Fault test ที่บังคับ

- Duplicate Webhook
- Out-of-order Webhook
- Gateway Timeout แล้วมาสำเร็จภายหลัง
- Payment Amount ผิด
- Supplier Timeout หลังรับคำขอ
- Duplicate Fulfillment Submission
- Supplier Status API ล่ม
- Supplier Balance ไม่พอ
- Worker Crash หลังส่งคำขอ
- Callback มาก่อน Local Request จบ
- Reconciliation Mismatch
- Late Payment หลัง Order หมดอายุ

### Definition of Done

- Payment Event เดิมสร้าง Fulfillment ซ้ำไม่ได้
- Timeout ถูก Query Status ก่อน Retry
- Worker Crash ไม่ทำให้เติมซ้ำ
- Paid Order จบที่ Completed, Refunded หรือ Manual Review
- Three-way Reconciliation ตรวจพบข้อมูลที่จงใจทำให้ผิด
- ราคา SKU UID Rule Terms Version และ Supplier Mapping ถูก Snapshot
- ผ่าน Security Review และ Restore Drill

## 13. แผนทำงานเป็นระยะ

### Stage 0 — กำหนดโจทย์

**ผลลัพธ์:** เกม, SKU Basket, Business Model และ Decision Register  
**Gate:** ยังไม่ติดต่อเทียบราคาแบบกว้างจนกว่าจะมี SKU ชุดเดียวกัน

### Stage 1 — เก็บหลักฐานและติดต่อคู่ค้า

**ผลลัพธ์:** Evidence Register, Supplier RFI, Gateway RFI และ Legal Question Register  
**Gate:** ห้าม Pre-fund จาก Marketing Claim อย่างเดียว

### Stage 2 — ตรวจ Commercial และกฎหมาย

**ผลลัพธ์:** Authorization Matrix, Binding Rate, Unit Economics, Refund/SLA Matrix และ Legal/Tax Memo  
**Gate:** ทุก Launch SKU ต้องมี Route ที่ถูกสิทธิ์และทำกำไรได้

### Stage 3 — Sandbox spike

**ผลลัพธ์:** Payment/Supplier Integration Proof และ Fault-test Report  
**Gate:** Duplicate/Unknown Event ต้องไม่ทำให้เติมซ้ำ

### Stage 4 — Operational rehearsal

**ผลลัพธ์:** Support, Refund, Reconciliation, Incident และ Financial-close Runbook  
**Gate:** Operations ปิดวันจำลองและแก้ Exception ได้ครบ

### Stage 5 — Controlled MVP หลัง Research Decision

**ขอบเขต:** Thailand, THB, PromptPay, 1 Gateway, 1–2 Games, No Wallet, No Marketplace, Manual Review  
**Gate:** Legal, Finance, Security, Product และ Operations ลงนาม

### Stage 6 — Limited beta review หลัง Research Decision

วัดอย่างน้อย

- Payment Success Rate
- Fulfillment Success/Latency
- Unknown Result Rate
- Duplicate Prevention
- Wrong UID/Server Rate
- Refund Rate
- Support Contact ต่อ 100 Orders
- Reconciliation Exception
- Contribution Margin
- Supplier Balance Incident

อย่าเพิ่ม Card, Wallet, หลายประเทศ หรือหลาย Supplier จนกว่าหลักฐานจาก Beta จะรองรับ

## 14. สิ่งที่ทีมต้องส่งมอบ

1. Decision Register
2. Launch SKU Matrix
3. Evidence Register
4. Supplier RFI Response Pack
5. Supplier Authorization Matrix
6. Supplier Scorecard
7. Payment Gateway Assessment
8. Thai Legal Memo
9. Tax/Accounting Memo
10. PDPA Data Map และ Processor Register
11. Unit Economics ต่อ SKU
12. Customer Journey และ Usability Report
13. Operations/Reconciliation Runbooks
14. Architecture Decision Records
15. Sandbox/Fault-test Report
16. Risk Register
17. Controlled MVP Scope
18. Final Go/No-go Memo

## 15. Definition of Done สำหรับ Research Decision

งานวิจัยถือว่าจบได้เมื่อหลักฐานเพียงพอให้ออก `Go`, `Conditional Go`, `Pilot Only` หรือ `No-go` อย่างรับผิดชอบ

- เลือกเกมและ SKU Basket สำหรับเปรียบเทียบแล้ว
- Supplier ที่เป็นไปได้อย่างน้อย 3 รายได้รับ RFI ชุดเดียวกัน
- มีคำตอบเชิงพาณิชย์อย่างน้อย 2 ราย หรือมีหลักฐานพอว่าตลาดนี้ยังทำไม่ได้
- ประเด็น Authorization, Merchant Acceptance, Legal, Tax และ Unit Economics มีคำตอบหรือถูกบันทึกเป็น Stop-ship
- มี API/Sandbox Evidence เพียงพอประเมินความเสี่ยงด้าน Duplicate และ Unknown Outcome หรือบันทึกว่า Blocked
- ทุกข้ออ้างสำคัญมี Evidence Status และเจ้าของงาน
- Decision DRI สรุปเหตุผล ความไม่แน่นอน และเงื่อนไขของผลตัดสินใจ

## 16. Controlled MVP entry gate

ใช้ Gate นี้เฉพาะเมื่อ Research Decision เป็น `Go` หรือ `Conditional Go`

- Launch SKU ทุกตัวมีสิทธิ์ขายในไทยที่ตรวจสอบได้
- Supplier Contract ระบุราคา เงินฝาก Refund SLA API และความรับผิด
- Gateway ยืนยัน Merchant Category และ PromptPay Terms
- ทนายตอบเรื่องโมเดลธุรกิจ Payment License Consumer Refund และสัญญา
- นักบัญชีตอบเรื่อง principal/agent, VAT, gross/net revenue และเอกสารภาษี
- Unit Economics ผ่าน Margin Floor ทั้ง Base และ Downside Case
- Sandbox พิสูจน์ว่า Duplicate/Unknown Event ไม่ทำให้เติมซ้ำ
- Reconciliation และ Correcting Entry ใช้งานได้
- PDPA, Security, Backup, Incident, Refund และ Kill Switch พร้อม
- Stop-ship ทุกข้อถูกปิด

## 17. งานที่ควรทำทันที

1. เลือกเกมมือถือ 2 เกม
2. สร้าง SKU Basket ชุดเดียว
3. ส่ง RFI ให้ WonDD, WeGame, WePay, Fiuu, MooGold, GamesDrop, IAK และรายที่ Catalog ตรง
4. ส่ง Merchant Profile ให้ Opn และ Gateway สำรอง
5. Brief ทนายและนักบัญชีด้วย PromptPay-only, no-wallet flow
6. เริ่ม Unit Economics โดยใช้สถานะ `unconfirmed` จนกว่าจะได้ Quote
7. นัด Review แรกโดยดูเพียง Authorization, Margin และ Failure Allocation

ถ้ายังยืนยันสามข้อนี้ไม่ได้ ให้หยุดก่อนสร้าง Checkout เต็มรูปแบบ

## 18. เอกสารประกอบ

- [Research Base](thailand-game-topup-platform.md)
- [Supplier RFI](templates/game-topup-supplier-rfi.md)
- [Payment Gateway RFI](templates/game-topup-gateway-rfi.md)
- [Research Registers](templates/game-topup-research-registers.md)
- [Unit Economics](templates/game-topup-unit-economics.md)
