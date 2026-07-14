# Unit economics template: Mobile-game top-up

ใช้ Template นี้คำนวณกำไรต่อ SKU จาก Quote และสัญญาจริง ห้ามใช้ Cashback หน้าเว็บหรือราคาผู้บริโภคแทน Wholesale Cost

## 1. หลักการ

เก็บจำนวนเงินเป็นหน่วยสตางค์ด้วยจำนวนเต็ม ระบบจริงห้ามใช้ floating-point กับยอดเงิน

```text
ราคาที่ลูกค้าจ่าย
− ภาษีที่ต้องจัดสรร
− ต้นทุนสินค้า
− FX และค่าฝากเงิน
− payment fee และ VAT ของ fee
− expected refund/reversal cost
− expected supplier failure loss
− expected fraud loss
− support cost ต่อรายการ
− promotion/cashback
= contribution margin
```

กำไรขั้นต้นจากส่วนลด supplier ยังไม่ใช่ contribution margin

### นิยามเพื่อป้องกันการหักต้นทุนซ้ำ

- `FX rate` ใช้ **all-in executable rate** ที่ซื้อได้จริง ณ เวลาฝากเงินหรือชำระ supplier โดยรวม spread ไว้แล้ว หาก Supplier Quote เป็นเงินบาท ให้ใช้อัตรา `1` และไม่หัก FX เพิ่ม
- `average refund loss` ให้รวมเฉพาะต้นทุนที่สูญเสียเพิ่มจาก Refund หาก Gateway Fee, Supplier Loss หรือ Support ถูกบันทึกแยกในสูตรแล้ว ห้ามนำมารวมซ้ำ
- `gateway reserve` และ `settlement delay` กระทบ working capital ไม่ใช่ contribution margin โดยตรง Contribution จะหักเฉพาะ financing cost หรือ expected loss ที่เกิดจากเงินส่วนนี้
- `pending supplier orders` จะนับใน supplier-loss exposure เฉพาะยอดที่ยังไม่ถูกหักหรือรวมอยู่ใน available supplier balance แล้ว

## 2. Input assumptions

| Input | ค่า | หน่วย | แหล่งหลักฐาน | Confidence | วันที่ |
| --- | ---: | --- | --- | --- | --- |
| Customer price | | THB | Approved price | confirmed | |
| Supplier net cost | | THB | Binding quote | | |
| Supplier currency | | | Contract | | |
| All-in executable FX rate | | source currency/THB | Bank/provider | | |
| Deposit fee | | %/THB | Funding terms | | |
| Gateway fee | | %/THB | Formal quote | | |
| VAT on gateway fee | | % | Accountant | | |
| Output VAT allocation | | THB | Accountant | | |
| Refund rate | | % | Pilot/benchmark | | |
| Avg refund cost | | THB | Gateway/supplier | | |
| Supplier failure rate | | % | SLA/pilot | | |
| Failure loss | | THB | Contract | | |
| Fraud rate | | % | Pilot | | |
| Fraud loss | | THB | Actual | | |
| Support contacts/order | | | Pilot | | |
| Support cost/contact | | THB | Operations | | |
| Promotion | | THB | Campaign | | |

ค่าที่ยังไม่ได้รับจากคู่ค้าให้ใส่ `unconfirmed` ห้ามใช้ศูนย์แทน

## 3. SKU calculation

| Field | Formula | ค่า |
| --- | --- | ---: |
| Customer gross | input | |
| Output VAT/tax allocation | accountant input | |
| Net revenue before variable costs | gross − tax allocation | |
| Supplier cost in source currency | quote | |
| Supplier cost in THB | source cost × all-in executable FX rate | |
| Deposit/funding fee | funding formula | |
| Gateway variable fee | gross × rate | |
| Gateway fixed fee | quote | |
| VAT on gateway fee | gateway fee × VAT rate | |
| Expected refund cost | refund probability × avg refund loss | |
| Expected supplier failure loss | failure probability × failure loss | |
| Expected fraud loss | fraud probability × fraud loss | |
| Expected support cost | contacts/order × cost/contact | |
| Promotion/cashback | campaign input | |
| **Contribution margin** | net revenue − all variable costs | |
| **Contribution margin %** | contribution / gross | |

## 4. Supplier comparison per SKU

| SKU | Supplier | Delivery | Net cost | FX/funding | Gateway | Tax | Expected loss | Support | Contribution | Margin % | Authorization | Status |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| | | UID/code | | | | | | | | | unconfirmed | |

## 5. Order-size scenarios

ต้องคำนวณอย่างน้อย

| Scenario | Order value | เหตุผล |
| --- | ---: | --- |
| Micro | ฿20–฿50 | Fixed fee และ support cost อาจกิน Margin ทั้งหมด |
| Typical | ฿100–฿300 | ใช้เป็นฐานประมาณการ |
| High value | กำหนดตาม catalog | Fraud และ Refund Exposure สูง |

## 6. Downside scenarios

| Scenario | เปลี่ยนอะไร | Contribution | Margin | ผ่านเกณฑ์ |
| --- | --- | ---: | ---: | --- |
| Base | Quote ปัจจุบัน | | | |
| Refund 1% | เพิ่ม expected refund | | | |
| Refund 3% | | | | |
| Refund 5% | | | | |
| FX +3% | ต้นทุนต่างประเทศเพิ่ม | | | |
| Supplier price +5% | Catalog refresh ช้า | | | |
| Support ×2 | Incident period | | | |
| Cost of capital from gateway reserve | หักเฉพาะต้นทุนเงินทุน ไม่หักยอด reserve ทั้งก้อน | | | |
| Supplier failure | สูญเสียยอดตาม contract | | | |

## 7. Working-capital model

| รายการ | สูตร | ค่า |
| --- | --- | ---: |
| Orders/day | forecast | |
| Supplier spend/day | orders × avg supplier cost | |
| Supplier balance days | policy | |
| Required supplier float | spend/day × balance days | |
| Gateway settlement days | contract | |
| Settlement float | gross/day × settlement days | |
| Refund reserve | refund exposure | |
| Operational buffer | policy | |
| **Total working capital** | sum | |
| **Maximum supplier-loss exposure** | available unsecured balance + submitted/unknown orders ที่ยังไม่ถูกหักซ้ำ | |

กำหนดวงเงินต่อ supplier และห้ามเติมเงินเกินวงเงินโดยไม่มี Approval

## 8. Break-even

```text
monthly fixed cost
÷ weighted average contribution per order
= break-even orders per month
```

| รายการ | ค่า |
| --- | ---: |
| Engineering/hosting fixed cost | |
| Operations/support fixed cost | |
| Legal/accounting/compliance amortized | |
| Monitoring/security tools | |
| Other fixed cost | |
| Total fixed cost | |
| Weighted contribution/order | |
| Break-even orders/month | |

## 9. Decision gate

กำหนดก่อนดูผลว่า

- Minimum contribution/order เท่าไร
- Minimum margin % เท่าไร
- Maximum refund/failure rate เท่าไร
- Maximum supplier float เท่าไร
- Maximum days of trapped capital เท่าไร
- SKU ใดห้ามขายเมื่อ margin ต่ำกว่าเกณฑ์

### Approval

| Role | ชื่อ | ผล | วันที่ | หมายเหตุ |
| --- | --- | --- | --- | --- |
| Product | | | | |
| Finance | | | | |
| Commercial | | | | |
| Operations | | | | |

Unit economics ถือว่าผ่านเมื่อทุกค่าหลักมาจากเอกสารหรือ Pilot จริง นักบัญชีตรวจ Tax Treatment แล้ว และ Base/Downside Case ยังอยู่เหนือเกณฑ์ที่อนุมัติ
