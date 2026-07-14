# Payment gateway RFI: แพลตฟอร์มเติมเกมมือถือในประเทศไทย

ใช้เอกสารนี้ขอคำยืนยันจาก payment gateway สำหรับธุรกิจ Instant Digital Goods/Game Credit อย่าใช้ราคาและเงื่อนไขจากหน้า Marketing แทนคำตอบเชิงสัญญา

## 1. Merchant profile ที่ส่งให้ Gateway

| รายการ | ข้อมูลโครงการ |
| --- | --- |
| นิติบุคคล | |
| เว็บไซต์/Domain | |
| ธุรกิจ | Mobile-game top-up / Digital game credit |
| ประเทศลูกค้า | Thailand |
| Currency | THB |
| Payment MVP | Dynamic PromptPay |
| Average order value | |
| Estimated monthly orders/GMV | |
| Fulfillment | Direct UID / Redeemable code |
| Delivery timing | Instant/near-instant after authenticated payment |
| Customer wallet | ไม่มีใน MVP |
| Marketplace/sub-merchant | ไม่มีใน MVP |
| Refund characteristic | สินค้าบางประเภทส่งมอบแล้วย้อนคืนไม่ได้ |

ขอให้ Gateway ยืนยันว่าได้รับ Merchant Profile ฉบับนี้ครบ ไม่ประเมินจากคำอธิบายธุรกิจทั่วไป

## 2. Merchant acceptance และ Underwriting

1. รับธุรกิจ Game Credit/Instant Digital Goods หรือไม่
2. ใช้ Merchant Category Code ใด
3. ต้องมี Publisher/Distributor Contract ก่อนอนุมัติหรือไม่
4. มีข้อจำกัดเกม ประเทศ อายุลูกค้า หรือยอดรายการหรือไม่
5. ต้องส่ง Website, Terms, Refund Policy และ Fulfillment Evidence แบบใด
6. ต้องมี Reserve, Rolling Reserve หรือ Holdback หรือไม่
7. มี Transaction/Monthly Limit ช่วงแรกหรือไม่
8. Gateway อาจระงับบัญชีจาก Trigger ใด และแจ้งล่วงหน้าหรือไม่

## 3. ราคาและ Settlement

| รายการ | คำตอบ |
| --- | --- |
| PromptPay variable fee | |
| PromptPay fixed fee | |
| VAT on fee | |
| Refund fee | |
| Failed/expired fee | |
| Payout/transfer fee | |
| Settlement T+N | |
| Reserve/holdback | |
| Minimum payout | |
| Volume tier | |
| Price validity | |

ถามเพิ่ม

1. Fee ถูกหักจากยอดไหนและออก Tax Invoice อย่างไร
2. Settlement นับวันทำการหรือวันปฏิทิน
3. วันหยุดและเหตุขัดข้องกระทบอย่างไร
4. Reversal/Refund กระทบ Settlement รอบใด
5. มี Negative Balance หรือ Debit ภายหลังหรือไม่

## 4. Dynamic PromptPay

1. QR สร้างต่อ Payment Attempt หรือไม่
2. กำหนด Amount จาก Server และแก้จากฝั่งลูกค้าไม่ได้หรือไม่
3. QR หมดอายุเมื่อไร
4. ลูกค้าจ่ายหลังหมดอายุได้หรือไม่
5. Status ใดแปลว่าได้รับเงินจริง
6. “QR scanned” หรือ Browser Return มีผลต่อสถานะเงินหรือไม่
7. รองรับ Full/Partial Refund หรือไม่
8. Refund ใช้ API หรือ Manual Process
9. Refund กลับช่องทางเดิมเสมอหรือไม่
10. มี Dispute/Chargeback Model แบบใดสำหรับ PromptPay

## 5. Webhook และ API Security

1. Webhook ใช้ Signature Algorithm ใด
2. ต้อง Verify Raw Body หรือ Canonical Payload
3. มี Timestamp และ Replay Window หรือไม่
4. Secret Rotation ทำอย่างไร
5. Event ID และ Payment ID เป็น Unique หรือไม่
6. Event อาจส่งซ้ำหรือผิดลำดับหรือไม่
7. Retry Schedule นานเท่าไร
8. Merchant Replay/Redelivery Event ได้หรือไม่
9. Webhook ต้องตอบภายในกี่วินาที
10. มี IP Allowlist/mTLS เป็นชั้นเสริมหรือไม่
11. API รองรับ Idempotency Key หรือ Merchant Reference หรือไม่
12. มี Payment Query API สำหรับ Recovery/Reconciliation หรือไม่

## 6. State model

กรุณาแนบ State Diagram และตอบว่าแต่ละสถานะย้อนกลับได้หรือไม่

| State | เงินเข้าจริง | Fulfill ได้ | Terminal | Query/Action |
| --- | --- | --- | --- | --- |
| created | | | | |
| pending/customer_action | | | | |
| processing | | | | |
| succeeded | | | | |
| failed | | | | |
| expired | | | | |
| refunded | | | | |

Browser Redirect, Slip Upload และ Frontend Polling ต้องไม่เป็นหลักฐานเริ่ม Fulfillment

## 7. Reconciliation

1. มี Transaction Export/API หรือไม่
2. มี Settlement Report แยก Gross, Fee, VAT, Refund และ Net หรือไม่
3. มี Bank-deposit Reference สำหรับ Match หรือไม่
4. Report ใช้ Timezone ใดและ Cutoff เมื่อไร
5. ปรับย้อนหลังได้หรือไม่
6. ดึงข้อมูลย้อนหลังได้นานเท่าไร
7. มี Event/Settlement ที่ไม่ผ่าน Webhook หรือไม่
8. รองรับ Automated Reconciliation อย่างไร
9. มี Test Report ใน Sandbox หรือไม่

## 8. Refund, Late Payment และ Exception

| เหตุการณ์ | Gateway behavior | Merchant action | Refund | SLA |
| --- | --- | --- | --- | --- |
| Payment สำเร็จหลัง Order หมดอายุ | | | | |
| Amount/Currency ไม่ตรง | | | | |
| Duplicate payment | | | | |
| Webhook หาย | | | | |
| Settlement ไม่ตรง | | | | |
| Refund API ล้มเหลว | | | | |
| Merchant account suspended | | | | |

## 9. SLA และ Incident

| รายการ | คำตอบ |
| --- | --- |
| API uptime | |
| Webhook delivery target | |
| Payment confirmation latency | |
| P1 response time | |
| Planned maintenance notice | |
| Incident notification | |
| Thai support hours | |
| Escalation channel | |
| Service credit | |

## 10. Security, PCI และ PDPA

1. Hosted Checkout/Component ช่วยลด PCI Scope อย่างไร
2. Gateway ผ่าน PCI DSS ระดับใด
3. ข้อมูลใดถูกส่งกลับให้ Merchant
4. เก็บข้อมูลในประเทศใด
5. ใช้ Subprocessor รายใด
6. Gateway เป็น Controller หรือ Processor ต่อข้อมูลใด
7. มี DPA และ Cross-border Transfer Terms หรือไม่
8. Retention และ Data-subject Request ทำอย่างไร
9. แจ้ง Data Breach ภายในกี่ชั่วโมง
10. มี Fraud Tool สำหรับ Instant Digital Goods หรือไม่ และใช้ข้อมูลใด

## 11. Sandbox acceptance tests

- [ ] Dynamic QR creation
- [ ] QR expiration
- [ ] Successful signed webhook
- [ ] Invalid signature rejected
- [ ] Duplicate event deduplicated
- [ ] Out-of-order event handled
- [ ] Late payment handled
- [ ] Payment query recovery
- [ ] Full/partial refund ตาม capability
- [ ] Reconciliation export
- [ ] Secret rotation

## 12. เอกสารที่ต้องได้รับ

- [ ] Written merchant-category acceptance
- [ ] Binding fee sheet
- [ ] Settlement/reserve terms
- [ ] PromptPay capability matrix
- [ ] API/Webhook documentation
- [ ] Refund policy
- [ ] Reconciliation specification
- [ ] SLA/incident process
- [ ] PCI/security evidence
- [ ] DPA/privacy terms

Gateway ถือว่าผ่านรอบวิจัยเมื่อยืนยัน Merchant Category เป็นลายลักษณ์อักษร ให้ราคาและ Settlement Terms จริง และ Sandbox พิสูจน์ว่าเฉพาะ authenticated server-side payment success เท่านั้นที่เริ่ม Fulfillment ได้
