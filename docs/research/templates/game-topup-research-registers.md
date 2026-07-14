# Research register templates

Template ชุดนี้ใช้ติดตามการตัดสินใจ หลักฐาน คู่ค้า SKU และความเสี่ยง ไม่ควรเก็บ API Key ข้อมูลลูกค้า หรือเอกสาร Confidential ที่ยังไม่ได้ Redact ในไฟล์นี้

## 1. Decision register

| ID | การตัดสินใจ | ตัวเลือก | ข้อเสนอปัจจุบัน | หลักฐานที่ต้องมี | เจ้าของ | กำหนด | สถานะ | วันที่ตัดสินใจ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D-001 | โมเดลธุรกิจ | Principal / Agent / Marketplace | | | | | open | |
| D-002 | เกมเปิดตัว | | | | | | open | |
| D-003 | Supplier | | | | | | open | |
| D-004 | Payment gateway | | Opn + backup | | | | open | |
| D-005 | Customer wallet | มี / ไม่มี | ไม่มีใน MVP | Legal + Product approval | | | proposed | |

## 2. Evidence register

| Claim ID | ข้ออ้าง | กระทบการตัดสินใจ | Provider/Game/SKU | ประเภทหลักฐาน | Source/URL | Version/วันที่มีผล | วันที่ตรวจ | ข้อความหรือ Clause | Territory/ข้อจำกัด | Confidence | เจ้าของ | งานถัดไป | Recheck date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-001 | | | | contract / written / API doc / regulator / product page / marketing | | | | | | unconfirmed | | | |

Confidence ใช้เฉพาะ

- `confirmed`
- `likely`
- `unconfirmed`
- `contradicted`
- `blocked`
- `expired`

## 3. Launch SKU matrix

| SKU ID | Game | Publisher | Platform | Territory | Region | Server | Delivery type | Required fields | Face value | Customer price | Supplier candidates | Authorization status | Refund class | MVP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| SKU-001 | | | | TH | | | direct_uid / uid_server / redeemable_code / delivery_url | | | | | unconfirmed | | yes |

## 4. Supplier authorization matrix

| Supplier | Contracting entity | Upstream | Game/SKU | Thailand | Website resale | App resale | White-label | Sub-reseller | Brand usage | เอกสาร | วันที่หมดอายุ | สถานะ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | unconfirmed |

## 5. Vendor contact log

| วันที่ | Supplier/Gateway | ผู้ติดต่อ | Channel | เรื่อง | เอกสารที่ส่ง | คำตอบสำคัญ | Confidential | งานถัดไป | เจ้าของ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | Email/Call/Portal | | | | yes/no | | |

## 6. Supplier scorecard

ให้คะแนนต่อ Supplier **และต่อ SKU** ไม่ใช้คะแนนรวมหนึ่งชุดครอบทุกสินค้า

| เกณฑ์ | น้ำหนัก | คะแนน 0–5 | Weighted | หลักฐาน | Gate |
| --- | ---: | ---: | ---: | --- | --- |
| Authorization | 25 | | | | ต้องผ่าน |
| Thai catalog/delivery fit | 15 | | | | ต้องผ่าน |
| API reliability | 15 | | | | ก่อน Pilot |
| Landed margin | 15 | | | | Margin floor |
| Refund/failure allocation | 10 | | | | Written terms |
| Pre-funding exposure | 10 | | | | Exposure cap |
| Tax/document fit | 5 | | | | Accountant |
| Support/SLA | 5 | | | | Escalation |
| **รวม** | **100** | | | | |

Authorization ไม่ผ่านให้ผลเป็น `reject` แม้คะแนนรวมสูง

## 7. Payment gateway comparison

| Gateway | Game-credit accepted | PromptPay | Dynamic QR | Signed webhook | Refund | Fee | VAT on fee | Settlement | Reserve | Reconciliation | Incident SLA | สถานะ |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| Opn | unconfirmed in writing | yes | yes | | | | | | | | | evaluating |

## 8. Legal and tax question register

| ID | คำถาม | ผู้ตอบที่ต้องการ | เอกสาร/Flow ที่ส่งให้ | คำตอบ | ผลต่อ Product/System | Stop-ship | เจ้าของ | สถานะ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L-001 | Principal หรือ Agent | Thai counsel + accountant | MVP flow + contracts | | | yes | | open |
| L-002 | 7-day cancellation กับ Game Credit | Thai counsel | Checkout/refund flow | | | yes | | open |
| L-003 | Gross/net revenue และ VAT | Accountant | Contracts + money flow | | | yes | | open |

## 9. Risk register

| Risk ID | ความเสี่ยง | Trigger | Probability | Impact | Exposure | Prevention | Detection | Response | Owner | สถานะ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Supplier ไม่มีสิทธิ์ขาย | เอกสารไม่ครบ/หมดอายุ | | critical | | Authorization gate | Recheck | Suspend SKU | | open |
| R-002 | เติมซ้ำ | Duplicate/Timeout retry | | critical | | Idempotency | Reconciliation | Manual review/refund | | open |
| R-003 | สูญเสียเงินฝาก | Supplier insolvent | | high | | Exposure cap | Balance monitoring | Stop funding/legal | | open |

## 10. Failure and ownership matrix

| เหตุการณ์ | Customer state | Internal state | Supplier action | Gateway action | Refund owner | Support message | SLA | Runbook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UID ไม่ถูกต้องก่อนจ่าย | | | | | | | | |
| Paid + supplier unavailable | | | | | | | | |
| Timeout + unknown | | | | | | | | |
| Duplicate fulfillment | | | | | | | | |
| Late payment | | | | | | | | |

## 11. Test evidence register

| Test ID | Environment | Provider | Scenario | Input class | Expected | Actual | Evidence path | Result | Owner | Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-001 | sandbox | | duplicate webhook | synthetic | one fulfillment | | | pending | | |

## 12. Final go/no-go record

| ด้าน | เจ้าของ | ผล | เงื่อนไข/หลักฐาน |
| --- | --- | --- | --- |
| Product | | go / conditional / no-go | |
| Commercial | | | |
| Legal | | | |
| Tax/Finance | | | |
| Security/PDPA | | | |
| Engineering | | | |
| Operations/Support | | | |

**Final decision:** `GO / CONDITIONAL GO / PILOT ONLY / NO-GO`  
**Decision owner:**  
**Date:**  
**Conditions:**  
**Next review:**
