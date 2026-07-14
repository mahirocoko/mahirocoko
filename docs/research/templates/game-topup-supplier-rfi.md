# Supplier RFI: แพลตฟอร์มเติมเกมมือถือในประเทศไทย

เอกสารนี้ใช้ส่งคำถามชุดเดียวกันให้ผู้จัดหาสินค้าหลายราย เพื่อให้เปรียบเทียบสิทธิ์ขาย Catalog ราคา API ความเสี่ยงจากเงินฝาก และ SLA ในระดับเดียวกัน

## 1. ข้อมูลผู้ติดต่อ

| รายการ | คำตอบ |
| --- | --- |
| ชื่อผู้ให้บริการ | |
| ชื่อนิติบุคคลที่ทำสัญญา | |
| ประเทศ/เขตอำนาจศาล | |
| เลขทะเบียนบริษัท | |
| เลขประจำตัวผู้เสียภาษี | |
| ที่อยู่ตามทะเบียน | |
| เว็บไซต์ | |
| ผู้ติดต่อฝ่ายขาย | |
| ผู้ติดต่อเทคนิค | |
| ผู้ติดต่อด้าน incident/SLA | |
| วันที่ตอบ | |
| อายุของ Quote | |

## 2. ข้อความติดต่อฉบับย่อ

### ภาษาไทย

> บริษัทกำลังศึกษาการเปิดแพลตฟอร์มเติมเกมมือถือสำหรับลูกค้าในประเทศไทย โดยรอบแรกจะรองรับเงินบาท Dynamic PromptPay และเกมจำนวนจำกัด ไม่มี customer wallet และไม่มี marketplace  
>  
> ต้องการประเมินบริการของท่านในฐานะผู้จัดหาสินค้าหรือ Partner API จึงขอข้อมูลเรื่องนิติบุคคล สิทธิ์ขายในประเทศไทย Catalog ราคา เงินฝาก API SLA Refund ภาษี และการคุ้มครองข้อมูลตามรายการด้านล่าง ข้อมูลเชิงพาณิชย์ที่เป็นความลับสามารถส่งภายใต้ NDA ได้

### English

> We are evaluating a controlled mobile-game top-up platform for customers in Thailand. The initial scope is THB, dynamic PromptPay, a limited game catalog, no customer wallet, and no marketplace sellers.  
>  
> We would like to assess your service as an authorized inventory supplier or partner API. Please provide the entity, authorization, Thailand catalog, commercial, funding, API, SLA, refund, tax, and data-protection information requested below. We can review confidential commercial material under an NDA.

## 3. นิติบุคคลและสิทธิ์ขาย

1. นิติบุคคลใดเป็นคู่สัญญาและรับเงินจากเรา
2. กรุณาแนบ Company Registration, Tax/VAT Certificate และ Bank-account Confirmation
3. ใครเป็นผู้ถือหุ้นหรือผู้รับผลประโยชน์ที่แท้จริงตามขั้นตอน KYB ของท่าน
4. ท่านเป็น publisher, master distributor, sub-distributor, marketplace หรือ aggregator
5. กรุณาระบุ upstream provider ต่อเกมและต่อ SKU
6. มีหนังสืออนุญาตให้ขายในประเทศไทยหรือไม่
7. หนังสืออนุญาตครอบคลุม
   - Website resale
   - App resale
   - White-label
   - Sub-reseller
   - Direct UID top-up
   - Code/e-PIN
8. มีข้อจำกัดเรื่องประเทศ Region Platform หรือราคาขายขั้นต่ำหรือไม่
9. อนุญาตให้ใช้ชื่อ Logo Artwork และภาพเกมในหน้าร้านอย่างไร
10. ยืนยันได้หรือไม่ว่า Fulfillment ไม่ใช้ Consumer Account, Customer Password, OTP, Session Cookie, Emulator Bot หรือ Gift Abuse
11. หาก upstream authorization สิ้นสุด จะมีระยะเวลาแจ้งล่วงหน้าและจัดการยอดคงเหลืออย่างไร

## 4. Catalog และ SKU

กรุณาส่ง Machine-readable Catalog เช่น CSV หรือ JSON โดยมีข้อมูลอย่างน้อย

| Field | ตัวอย่าง/คำอธิบาย |
| --- | --- |
| `provider_sku` | รหัสสินค้าของ supplier |
| `publisher` | เจ้าของเกม |
| `game` | ชื่อเกม |
| `platform` | iOS/Android/PC/Console |
| `territory` | ประเทศที่ขายได้ |
| `region` | Region ของ Account/Server |
| `server_required` | ต้องระบุ server หรือไม่ |
| `delivery_type` | `direct_uid`, `uid_server`, `redeemable_code`, `delivery_url` |
| `required_fields` | UID, Open ID, Zone ID ฯลฯ |
| `face_value` | มูลค่าหรือจำนวน currency |
| `currency` | THB/USD/IDR ฯลฯ |
| `net_cost` | ราคาที่ supplier เรียกเก็บ |
| `stock_type` | Real-time/Inventory/Allocation |
| `refund_class` | Refund ได้ในกรณีใด |
| `active_from` / `active_until` | อายุสินค้า |
| `maintenance_status` | สถานะขายได้ |

คำถามเพิ่ม

1. Catalog เปลี่ยนบ่อยแค่ไหน
2. มี Price-change Notice ล่วงหน้าหรือไม่
3. SKU ถูกปิดอัตโนมัติเมื่อ Stock หรือ Supplier Balance ไม่พอหรือไม่
4. มี Player Validation ก่อนสั่งซื้อหรือไม่
5. Validation คืน Nickname/Server ให้ลูกค้ายืนยันได้หรือไม่
6. รองรับ Thai Player ID ของเกมที่ระบุหรือไม่
7. มี Test SKU ที่ไม่ส่งมอบจริงหรือไม่

## 5. ราคา เงินฝาก และ Settlement

1. สกุลเงินที่ใช้ฝากและซื้อสินค้า
2. ฝากผ่าน Bank Transfer, Card, Crypto หรือช่องทางใด
3. Minimum Initial Deposit
4. Minimum Monthly Volume
5. Volume Tier และ Rate Card
6. FX Source, Spread และเวลาล็อกอัตรา
7. มีค่าฝาก ถอน API รายเดือน หรือค่า Account อื่นหรือไม่
8. ยอดเงินถอนได้หรือไม่ ใช้เวลากี่วัน และมีค่าธรรมเนียมเท่าไร
9. เงินฝากแยกจากเงินดำเนินงานของบริษัทหรือไม่
10. หากบริษัทหยุดกิจการ ยอดคงเหลือมีสถานะทางกฎหมายอย่างไร
11. มี Credit Line/Postpaid สำหรับลูกค้าที่ผ่านเกณฑ์หรือไม่
12. Failed Order คืน Balance ภายในกี่นาที/ชั่วโมง
13. ออก Invoice/Tax Invoice แบบใด
14. มี VAT, Withholding Tax หรือ Cross-border Tax อย่างไร
15. Price Quote มีอายุกี่วัน

## 6. API และ Security

กรุณาแนบ

- OpenAPI/Postman Collection
- Sandbox Credential Process
- API Versioning Policy
- Deprecation Notice Policy
- Status/Error Code Reference
- Callback/Webhook Specification
- Reconciliation File/API

คำถาม

1. Authentication ใช้ API Key, OAuth, HMAC หรือ mTLS
2. รองรับ IP Allowlist หรือไม่
3. มี Timestamp/Nonce และ Replay Protection หรือไม่
4. รองรับ Idempotency Key หรือ Merchant Transaction ID อย่างไร
5. Duplicate Request ตอบอย่างไร
6. Timeout หลังรับคำขอ ต้อง Query Status ด้วย Reference ใด
7. Callback มี Signature และ Retry Policy หรือไม่
8. Event อาจมาซ้ำหรือผิดลำดับหรือไม่
9. Rate Limit ต่อ Endpoint เท่าไร
10. Status Query และ Reconciliation เก็บย้อนหลังได้นานเท่าไร
11. Secret Rotation ทำอย่างไร
12. มี Audit Log ให้ Merchant ดาวน์โหลดหรือไม่
13. API Uptime และ Maintenance Window เป็นอย่างไร
14. มี Incident Notification ภายในกี่ชั่วโมง
15. ผ่าน Security Audit, Penetration Test หรือมาตรฐานใด

## 7. Fulfillment และสถานะรายการ

กรุณาอธิบาย State Model ของท่าน เช่น

```text
accepted
processing
succeeded
failed
unknown
reversed
```

คำถามสำคัญ

1. `accepted` หมายถึง upstream รับคำขอแล้วหรือยัง
2. หาก HTTP Timeout หลังส่งคำขอ เราต้อง Retry หรือ Query Status
3. Status ใดเป็น Terminal
4. Status ใด Retry ได้
5. Supplier ป้องกัน Duplicate Fulfillment อย่างไร
6. มี Provider Reference หลังรับคำขอหรือไม่
7. หาก Callback หาย เราดึงสถานะย้อนหลังได้หรือไม่
8. Fulfillment SLA แยกตาม UID/Code หรือไม่
9. มี Kill Switch หรือ Maintenance Feed ต่อเกมหรือไม่
10. Code Inventory มี Expiration และ Region Lock อย่างไร

## 8. Refund และ Failure Matrix

กรุณาระบุผู้รับผิดชอบและเวลาจัดการ

| เหตุการณ์ | Refund/Reversal | ผู้รับผิดชอบ | SLA | หลักฐานที่ต้องใช้ |
| --- | --- | --- | --- | --- |
| UID ไม่มีอยู่จริง | | | | |
| Server/Region ผิด | | | | |
| ลูกค้ากรอก UID ผิด | | | | |
| Supplier ส่งซ้ำ | | | | |
| Timeout และผลลัพธ์ไม่ชัด | | | | |
| Paid แต่ Fulfillment ล้มเหลว | | | | |
| Code ใช้ไม่ได้ | | | | |
| Code ถูกใช้แล้ว | | | | |
| Game ปิด SKU ระหว่างรายการ | | | | |
| Maintenance เกิน SLA | | | | |
| Security Incident | | | | |

## 9. SLA และ Support

| รายการ | คำตอบ |
| --- | --- |
| API uptime | |
| p95/p99 latency | |
| UID fulfillment target | |
| Code delivery target | |
| Pending timeout | |
| Failed-order reversal | |
| Planned maintenance notice | |
| P1 incident response | |
| Support hours | |
| Thai support | |
| Escalation channel | |
| Service credit | |

## 10. PDPA และ Data Processing

1. Supplier เป็น Controller หรือ Processor ต่อข้อมูล UID/Order
2. เก็บข้อมูลในประเทศใด
3. ใช้ Subprocessor รายใด
4. Retention แต่ละประเภทนานเท่าไร
5. รองรับ Data-subject Request อย่างไร
6. แจ้ง Data Breach ภายในกี่ชั่วโมง
7. ใช้ข้อมูลเพื่อ Marketing, Profiling หรือ Cross-client Fraud Model หรือไม่
8. สามารถทำ Data-processing Agreement ได้หรือไม่
9. มี Cross-border Transfer Safeguard ใด
10. Log หรือ Support Staff มองเห็น UID/Nickname เต็มหรือไม่

## 11. Pilot proposal

ขอให้ supplier เสนอ Pilot แบบจำกัดความเสี่ยง

- Sandbox ก่อนใช้เงินจริง
- Production Balance วงเงินต่ำ
- UID-only SKU ที่ไม่ใช้ credential
- Game/SKU จำนวนจำกัด
- Daily Reconciliation
- Named Support Contact
- Exit/Withdrawal Plan
- ระยะ Pilot
- เกณฑ์ Success/Failure

## 12. เอกสารที่ต้องได้รับก่อนอนุมัติ

- [ ] Company Registration
- [ ] Tax/VAT Certificate
- [ ] Bank-account Confirmation
- [ ] Publisher/Distributor Authorization Matrix
- [ ] Thailand SKU Catalog
- [ ] Contract/Terms
- [ ] Rate Card
- [ ] Funding/Withdrawal Terms
- [ ] API Documentation
- [ ] Sandbox Access
- [ ] SLA
- [ ] Refund/Failure Matrix
- [ ] Reconciliation Format
- [ ] Security Evidence
- [ ] DPA/Privacy Terms

ห้ามอนุมัติ supplier จากคะแนนหรือราคาอย่างเดียว หาก Authorization Matrix ยังไม่ผ่าน
