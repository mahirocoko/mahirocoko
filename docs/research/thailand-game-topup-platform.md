# แนวทางสร้างเว็บเติมเกมในประเทศไทย

**วันที่ตรวจข้อมูล:** 13 กรกฎาคม 2026  
**สถานะ:** Research / Decision Support  
**ขอบเขต:** เว็บขาย Game Credit, Direct Top-up และ Game Code ให้ลูกค้าในประเทศไทย

> เอกสารนี้เป็นข้อมูลประกอบการวางธุรกิจและระบบ ไม่ใช่คำปรึกษากฎหมายหรือภาษี ก่อนเปิดจริงควรให้ทนาย นักบัญชี Payment Gateway และเจ้าของเกมตรวจรูปแบบธุรกิจอีกครั้ง

## Executive summary

เว็บเติมเกมสร้างได้และมี Third party ให้ใช้ แต่โจทย์แบ่งเป็นสองส่วนที่ต้องแก้แยกกัน

1. **Payment** — รับเงินผ่าน PromptPay, Card หรือ Wallet
2. **Fulfillment** — มีสิทธิ์ขายและมี API/Code ที่เติมเกมให้ลูกค้าได้จริง

Payment Gateway หาได้ไม่ยาก ผู้ให้บริการในไทยมีทั้ง Opn, ChillPay, Xendit, 2C2P และ Fiuu แต่ Gateway ไม่ได้เป็นคนเติมเกมให้ หลังรับเงินสำเร็จ ระบบยังต้องเรียก Publisher/Distributor API หรือส่ง Code จาก Stock ของร้านเอง

ส่วนที่ยากกว่าคือ Supply หากจะขายเกมของบริษัทอื่น ต้องมีสัญญาจาก Publisher, Master Distributor หรือผู้กระจายสินค้าที่อนุญาตให้ขายต่อบนเว็บไซต์ การซื้อจากหน้าร้านผู้บริโภคแล้วนำมาขายต่อ หรือเรียก Internal API ของเว็บไซต์เติมเกม ไม่ใช่หลักฐานว่าได้รับสิทธิ์

แนวทาง MVP ที่เสี่ยงน้อยที่สุดคือ

- เริ่มจาก 1–2 เกม
- ใช้ PromptPay ผ่าน Gateway ที่ได้รับอนุญาต
- ไม่มี Wallet หรือยอดเงินคงเหลือ
- ใช้ Supplier ที่มีสัญญาและ API ชัดเจน
- แยก Payment กับ Fulfillment ออกจากกัน
- มี Webhook Inbox, Idempotency และ Reconciliation ตั้งแต่วันแรก

## 1. เลือกโมเดลธุรกิจก่อน

### 1.1 ขายสินค้าของเกมเราเอง

กรณีนี้เราเป็น Publisher หรือได้รับสิทธิ์ขาย Item/Currency ของเกมโดยตรง บริการที่เหมาะคือ

- [Coda Webstore](https://www.coda.co/product/coda-webstore/) — Managed D2C Web Store สำหรับ Publisher
- [Codapay](https://www.coda.co/product/codapay/) — Payment API สำหรับ Digital Content
- [Xsolla Web Shop](https://xsolla.com/mobile-web-shop) — Web Shop สำหรับขาย Currency, Item, Bundle และ Subscription ของเกม
- [Xsolla Pay Station](https://xsolla.com/payments) — Payment และ Merchant-of-Record ในหลายประเทศ

บริการกลุ่มนี้ช่วยเรื่อง Checkout, Payment, Fraud, Tax และ Storefront ได้มาก แต่ไม่ได้ให้สิทธิ์นำเกมของ Publisher รายอื่นมาขาย

### 1.2 ร้านเติมหลายเกม

ร้านต้องมี Supply Chain สำหรับแต่ละเกม อาจเป็น

- Publisher/Dealer API โดยตรง
- Master Distributor
- Wholesale e-PIN/Game Code API
- Distributor ที่เติมตรงเข้า UID/Server

สิ่งที่ต้องได้เป็นลายลักษณ์อักษรคือ Game, Territory, Platform, SKU, Price Rule, Brand Usage, Refund และสิทธิ์ขายต่อผ่านเว็บไซต์ของเรา

### 1.3 Marketplace ให้ร้านอื่นเข้ามาขาย

โมเดลนี้ซับซ้อนที่สุด เพราะระบบอาจรับเงินแทนร้านอื่น แบ่ง Settlement หรือเก็บเงินไว้ระหว่าง Buyer/Seller จึงต้องตรวจเพิ่มทั้ง

- ใบอนุญาตบริการชำระเงิน
- ETDA Digital Platform Service
- Seller KYB/KYC
- Escrow และ Settlement
- Marketplace Fraud
- ภาษีและบทบาท Seller of Record

ไม่ควรเริ่มจากโมเดลนี้ใน v0

## 2. Third party ฝั่ง Supply/Fulfillment

### กลุ่มที่มีหลักฐาน B2B/API ชัดเจน

| Provider | เหมาะกับ | สิ่งที่มีหลักฐาน | ข้อควรระวัง |
| --- | --- | --- | --- |
| [Razer Gold Distribution Hub](https://partners.gold.razer.com/en/distribution-partners/) | e-PIN/Game Code | มี Self-service Distribution Hub และ Real-time API สำหรับ Partner | ต้องสมัครบริษัทและผ่าน Commercial Review; Catalog/ประเทศ/ส่วนลดขึ้นกับสัญญา |
| [DT One](https://www.dtone.com/who-we-serve/retail-networks) | Digital Value, Voucher, Gift Card | Wholesale Network และ API สำหรับ Retail Network | ต้องขอ Catalog ไทยล่าสุด ไม่ควรเดาว่ามีทุกเกมหรือ Direct UID Top-up |
| [Reloadly Gift Cards](https://www.reloadly.com/products/gift-card-api) | Game/Gift Card Code | Self-service API, Test Key และ Catalog API | เหมาะกับ Code มากกว่าเติมตรงเข้า UID; Region และ Resale Right ต่างกันแต่ละ Brand |
| [Fiuu Reloads](https://fiuu.com/reloads/) / [POSA](https://fiuu.com/gift-card/) | Retail Voucher/POSA | มี Gaming/Entertainment Reload และ POSA ในไทย | ต้องยืนยันว่าเปิด Online Product-order API ไม่ใช่แค่ POS/Payment Gateway |
| [WonDD Game Online API](https://www.wondd.com/apigameonline.php) | Direct Top-up ในไทย | ประกาศ API สำหรับ RoV, Free Fire, Undawn, CODM, Delta Force, PUBG Mobile และเกมอื่นบางรายการ | ต้องตรวจ Company, Upstream Authorization, API Security, SLA, Refund และสิทธิ์ขายต่อก่อนเติมเงินเข้าระบบ |

### กลุ่มที่ต้องคุย Commercial Team

| Provider | Reality |
| --- | --- |
| [UniPin](https://www.unipin.com/) | มี Reseller Program แต่ไม่พบ Public Reseller API Specification ต้องขอเอกสารจากฝ่ายขาย |
| [Coda Distribution](https://www.coda.co/product/distribution/) | เหมาะกับ Publisher ที่ต้องการกระจาย Content ผ่าน Partner Network ไม่ใช่ Public Catalog สำหรับร้านทั่วไป |
| Xsolla | เหมาะกับ Publisher/Rightsholder ไม่ใช่ Wholesale Feed สำหรับนำเกมอะไรก็ได้มาขาย |
| Termgame / PlayMall | เป็น First-party หรือ Consumer Channel ไม่พบ Public Dealer API สำหรับบุคคลทั่วไป |

### Local dealer/reseller platform ในไทย

แพลตฟอร์มกลุ่มนี้เหมาะกับร้านรับเติมเงิน ร้านอินเทอร์เน็ต หรือสมาชิกตัวแทนที่เติมเงินเข้าบัญชีกลางก่อน แล้วซื้อสินค้าในราคาหลังหัก Cashback บางรายอาจมี Private API แต่การมี App, Backoffice หรือ API ภายในไม่ได้แปลว่าเปิด B2B API ให้ร้านภายนอกโดยอัตโนมัติ

| Platform | สิ่งที่ตรวจพบ | ใช้กับเว็บเราได้แค่ไหน |
| --- | --- | --- |
| [wePAY Thailand](https://www.wepay.in.th/) | ดำเนินการโดยห้างหุ้นส่วนจำกัด เว็บเพย์ เลขทะเบียน `0123555001425`; เปิดมาตั้งแต่ปี 2012; มี Mobile/Game Top-up, Game Card, UID Top-up, สมาชิกประเภทร้านค้า และระบบ Pre-funded Balance | น่าเชื่อถือในฐานะ Dealer/Agent Platform แต่ยังไม่พบ Public Partner API, Sandbox, Webhook, SLA หรือ Contract สำหรับ Downstream Website Resale จึงควรเป็น Commercial Lead ไม่ใช่ API Supplier ที่ผ่านการรับรองแล้ว |
| [WonDD](https://www.wondd.com/) | มีหน้า Game Online API และ Mobile API สำหรับระบบ White-label/ตัวแทน | ใกล้เคียง Local API Supplier ที่สุด แต่ต้องตรวจ Publisher Authorization และ Technical Contract ก่อน |
| [WeGame Super API](https://wegame.one/wegame-superapi/) | โฆษณาระบบ Dealer, White-label Shop และ Super API | จัดเป็น Watchlist เพราะยังไม่พบ Legal Entity, Public API Spec และ Upstream Authorization ที่ตรวจสอบได้ครบ |
| [mPAY STATION](https://www.mpay.th/th/station.php) | บริษัท Advanced mPAY ในกลุ่ม AIS; มีจุดบริการจำนวนมาก, Pre-funded Wallet, Mobile Top-up, Bill Payment และ Game Product บางรายการ | เป็น Dealer/Payment Network ที่มีตัวตนแข็งแรง แต่ Public Single API ที่พบเป็น Payment Gateway/White-label Wallet ไม่ใช่หลักฐานว่าเปิด Game Inventory API ให้เว็บภายนอก |
| [allPAY Thailand](https://allpaythai.com/) | Dealer App สำหรับเติมเงิน AIS, dtac, True และ my; App ยังอัปเดตในปี 2026 | ใช้ทดลองธุรกิจเติมเงินมือถือได้ แต่ไม่พบ Game Catalog, Public API, White-label หรือหลักฐาน Carrier Authorization ที่ตรวจสอบได้ |
| [TermsabuyPlus](https://termsabuyplus.com/) | ระบบตู้/ตัวแทนเติมเงินมือถือ ชำระบิลและฝากเงิน; เปิดรับ Management Agent | เหมาะกับ Physical Kiosk/Agent Network ไม่พบ Online Reseller API หรือ Game Inventory |
| [Boonterm](https://www.boonterm.com/) | เครือข่ายตู้/จุดรับชำระและเติมเงินขนาดใหญ่ | เป็น Closed Retail/Payment Network ไม่พบ Open Game-supply API สำหรับเว็บภายนอก |
| Easycard / MT Topup | มีหน้าร้านเติมเกมและสินค้า Digital | เป็น Consumer Retailer ไม่พบ Public Wholesale API; MT Topup มีสินค้าแบบใช้ ID/Password ซึ่งไม่ควรนำมาเป็นแนวทางระบบเรา |
| [MeeTang](https://meetang.work/%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A-api-topup) | มี Merchant Software, Slip Routing, Credit, Stock และ Transaction Log | เป็น Backoffice/SaaS ไม่ใช่หลักฐานว่าเป็น Payment Gateway หรือผู้จัดหา Game Inventory |

#### WePay ควรถูกจัดอยู่ตรงไหน

WePay มีสัญญาณบวกหลายอย่าง

- บริษัทและที่อยู่ตรงกับข้อมูล DBD
- มี App บน iOS/Android และ Product Update ต่อเนื่องในปี 2026
- วัตถุประสงค์นิติบุคคลครอบคลุมการเป็นตัวแทนจำหน่ายบริการโทรศัพท์และ Digital Entertainment
- มี Member/ร้านค้า, Cashback และ Pre-funded Balance จริง
- มีรายการ Mobile Top-up, Game Card และ Direct UID Top-up

แต่ข้อมูลสาธารณะยังไม่พอสำหรับนำไปเป็นแกนของ Automated Website

- ไม่พบ Public B2B API Documentation
- ไม่พบ Sandbox, Authentication, Idempotency, Signed Callback หรือ Status-query Contract
- ไม่พบ SLA และ Reconciliation File Format
- สิทธิ์จาก Publisher/Distributor รายเกมยังเป็น Historical/Self-published Claim
- ไม่พบชื่อบริษัทตรงกันในรายชื่อผู้ให้บริการระบบการชำระเงินของ BOT จึงต้องขอคำอธิบายว่ายอด Pre-funded Balance อยู่ภายใต้ใบอนุญาต, ข้อยกเว้น หรือ Principal รายใด
- Cashback สาธารณะไม่ใช่ Contractual Wholesale Margin

สรุปคือ **ใช้ WePay เปิดร้านแบบตัวแทนหรือทดลอง Unit Economics ได้ แต่ถ้าจะเชื่อมเว็บอัตโนมัติ ต้องขอ Partner API และเอกสารสิทธิ์ก่อน**

เอกสารที่ควรขอจาก WePay:

1. Partner/Dealer Agreement และ Rate Card
2. Current Publisher/Distributor Authorization Matrix
3. Partner API Docs, Sandbox และ IP Whitelist Policy
4. Idempotency, Duplicate Order และ Status-query Behavior
5. Webhook/Callback Signature และ Retry Policy
6. Float Withdrawal, Failed-order Reversal และ Insolvency Treatment
7. VAT Invoice และ Withholding-tax Treatment
8. PDPA Data-processing Agreement และ Security/SLA Evidence

แหล่งข้อมูล:

- [WePay — About](https://www.wepay.in.th/?cmd=about_us)
- [WePay — Services/Cashback](https://www.wepay.in.th/?cmd=services)
- [WePay — FAQ และ Pre-funding](https://www.wepay.in.th/?cmd=faq)
- [WePay — Merchant Application](https://static.wepay.in.th/agent_register_form.pdf)
- [DBD Profile: WEB PAY LIMITED PARTNERSHIP](https://datawarehouse.dbd.go.th/company/profile/30123555001425)
- [BOT Payment Business Provider Register](https://www.bot.or.th/th/our-roles/payment-systems/payment-act-oversight/business-provider.html)

### Regional API supplier ที่ใกล้เคียง WePay แต่ต่อระบบได้จริงกว่า

ผู้ให้บริการกลุ่มนี้ไม่ได้เป็นบริษัทไทยทั้งหมด แต่มีหลักฐาน Public Partner/H2H API ชัดกว่า Local Dealer Panel ต้องตรวจอีกชั้นว่าเปิดรับบริษัทไทย, รองรับ Thai/SEA SKU และอนุญาตให้ขายต่อในประเทศไทยหรือไม่

| Provider | API/โมเดล | จุดเด่น | ข้อควรตรวจ |
| --- | --- | --- | --- |
| [MooGold](https://moogold.com/) | [Official Purchasing API](https://doc.moogold.com/) สำหรับ Direct UID Top-up และ e-PIN | Product List/Detail, Order, Callback, Status, Wallet และ Player/Server Field ชัด; มีเกม SEA และหน้าเว็บรองรับ THB | บริษัทมาเลเซีย, ใช้ USD Wallet และเอกสารพูดถึง USDT Funding; ต้องขอ Thai SKU, Fiat Funding, Authorization, Tax และ SLA |
| [GamesDrop Partner API](https://gamesdrop.io/en/partner-api) | Partner API/Dashboard สำหรับนำไปต่อ Website/App/POS | แยก UID Delivery กับ Activation Key, มี Player Validation, Test Offer และ Order Status | บริษัทคาซัคสถาน; ต้องขอ Merchant Agreement, Thai Catalog, Publisher Provenance, Funding/Refund และตรวจความสอดคล้องกับ Consumer Terms |
| [IAK Developer](https://developer.iak.id/) | [REST API](https://api.iak.id/) + White-label Website/App | มี H2H API, Sandbox, Game Inquiry/Top-up และ Catalog เกม SEA จำนวนมาก | อินโดนีเซีย/IDR-centric; ต้องยืนยัน Foreign KYB, Thai Player Support, Cross-border Resale และภาษี |
| [Digiflazz](https://digiflazz.com/) | [H2H Marketplace API](https://developer.digiflazz.com/) | ออกแบบมาสำหรับ Server, Website, App และ Switching Company; มีหลาย Supplier ใน Deposit เดียว | Marketplace ทำให้ Provenance/SLA ต่างกันราย Seller; ต้องตรวจ Thai Region, UID/Code Type และ Refund Consistency |
| [Prepay Nation](https://prepaynation.com/products/#gaming) | Enterprise Digital Prepaid Distribution API | เครือข่ายใหญ่และมี Gaming/Gift Card Product | API/Catalog เป็น Private Sales Process; ต้องขอ Thailand SKU Export, Funding และ UID/PIN Contract ก่อนประเมิน |
| [VIPayment](https://vip-reseller.co.id/) | Reseller/H2H Panel + Account-gated API | Deposit ขั้นต่ำไม่สูงและมี Game/Voucher/Mobile/E-money | Documentation และ Catalog ต้อง Login; Indonesia-centric และยังต้องตรวจนิติบุคคล/สิทธิ์ขายข้ามประเทศ |

#### สิ่งที่ดูเหมือนมี API แต่ยังไม่ควรใช้

| Platform | เหตุผล |
| --- | --- |
| GamesFlows | โฆษณา Game API แต่ Domain ใหม่, ไม่พบนิติบุคคล, API Docs, SLA, Refund Policy หรือ Upstream Provider ที่ตรวจสอบได้ |
| Smile.One | Public API ที่พบเป็นทิศทางให้ Publisher เปิด Endpoint ให้ Smile.One ไม่ใช่ Reseller Inventory API สำหรับร้านเรา |
| SEAGM | พบ Consumer/Internal API และ Third-party Wrapper แต่ไม่พบ Official H2H Reseller Agreement |
| OffGamers | มีหน้า Reseller แต่ไม่พบ Public API Spec และ Commercial Contract ที่ยืนยันสถานะปัจจุบัน |
| VocaBisnis | เป็น Agent/Reseller App จริง แต่ไม่พบ H2H API หรือสิทธิ์ต่อเข้ากับเว็บไซต์ภายนอก |

### Outreach shortlist หลังค้นเพิ่ม

แบ่งการติดต่อเป็นสอง Lane

**Lane A — บริษัทไทย/มี Thai Operation**

1. **WonDD** — Local API Lead อันดับแรก
2. **WeGame SuperAPI** — ขอ Legal/API/Upstream Documents ก่อน Pre-fund
3. **WePay Enterprise** — ถามว่ามี Private Partner API หรือไม่ ถ้าไม่มีให้ใช้แค่ Agent/Unit-economics Trial
4. **mPAY** — ถามเฉพาะว่ามี Airtime/Game Inventory API สำหรับ Online Sub-agent หรือไม่ อย่าสับสนกับ Payment/Wallet API
5. **Fiuu Thailand** — ขอ POSA/Reload API และ Thailand Product Matrix

**Lane B — Regional H2H API**

1. **MooGold** — API ชัดที่สุดสำหรับ Game UID + Code
2. **GamesDrop** — Downstream Website Integration ชัด แต่ต้องตรวจ Contract/Provenance
3. **IAK** — White-label และ API พร้อมกว่า แต่ต้องผ่าน Foreign/Thailand Fit
4. **Digiflazz** — เหมาะกับการทดลอง H2H Marketplace หลังแยก Supplier Risk
5. **Prepay Nation** — เหมาะกับ Enterprise Inquiry มากกว่า MVP ที่ต้องการเริ่มเร็ว

ห้ามนำคำว่า “Verified API” ไปตีความว่า Publisher Authorization ผ่านแล้ว Verification ในที่นี้หมายถึงพบ Official Partner/Purchasing API เท่านั้น สิทธิ์ขายเกม, Territory, Tax, Funding และ SLA ยังต้องยืนยันในสัญญา

### สิ่งที่ไม่ควรทำ

- Reverse-engineer Internal API ของ Codashop, Termgame, PlayMall หรือร้านอื่น
- ใช้ Consumer Account สั่งซื้ออัตโนมัติแล้วขายต่อ
- เติมด้วย Username/Password/OTP ของลูกค้า
- ซื้อ Code ข้าม Region โดยไม่มีสิทธิ์ขายในประเทศไทย
- ใช้ Marketplace ราคาถูกเป็น Supplier โดยไม่มีสัญญา, SLA และที่มาสินค้า
- อ้างว่าเป็น Official Partner หากยังไม่มีหนังสืออนุญาต

## 3. Payment Gateway ในไทย

### 3.1 Shortlist

| Provider | จุดเด่น | ราคา/ข้อสังเกตจากข้อมูลสาธารณะ |
| --- | --- | --- |
| [Opn/Omise](https://www.omise.co/en/pricing/thailand) | Documentation ชัด รองรับ Dynamic PromptPay, Card, TrueMoney และ Webhook | PromptPay 1.65%, Card 3.65%, TrueMoney 2.65% ก่อน VAT; Digital Content อาจได้ Rate/เงื่อนไขต่างออกไป |
| [ChillPay](https://www.chillpay.co/en/payment-channel/) | ช่องทางไทยเยอะ มี PromptPay, Card, Wallet, Banking และ Counter | Headline 3.25% และ T+1 แต่ต้องขอ Fee Sheet แยกแต่ละช่องทางและ Webhook Specification |
| [Xendit Thailand](https://www.xendit.co/en-th/pricing/) | API และช่องทางไทย/SEA ครบ | มี Fixed Fee ต่อ Transaction จึงอาจไม่เหมาะกับยอดเติม ฿20–฿100 หากยังไม่ได้ Volume Pricing |
| [2C2P Thailand](https://2c2p.com/countries/thailand/) | Enterprise/Regional Acquiring, Card, QR, Wallet, Banking | ราคา, Settlement และ Reserve เป็น Contract-specific |
| [Fiuu](https://fiuu.com/payment-channels/) | เครือข่าย SEA และ Enterprise Integration | ต้องยืนยัน PromptPay/TrueMoney ใน Contract ไทย ไม่ควรสรุปจากคำว่า QR/E-wallet อย่างเดียว |
| [Xsolla](https://xsolla.com/pricing) | Game-specific Commerce, Fraud, Tax และ Merchant-of-Record | Headline 5%; เหมาะกับ Publisher/Global Commerce มากกว่า Local Reseller ขนาดเล็ก |

ราคาในตารางเป็นเพียงข้อมูลสาธารณะ ไม่ใช่ Binding Quote ต้องขอราคาใหม่โดยแจ้งว่าเป็น Instant Digital Goods/Game Credit เพราะธุรกิจประเภทนี้มี Fraud และ Refund Profile ต่างจากร้านค้าทั่วไป

### 3.2 คำแนะนำสำหรับ MVP

เริ่มจาก Opn/Omise และ PromptPay อย่างเดียวก่อน เหตุผลคือ

- มี Dynamic QR ต่อ Order
- Documentation และ Webhook ชัด
- ไม่มี Fixed Fee สูงเมื่อเทียบกับยอดเติมขนาดเล็ก
- ลด Scope ของ Card Fraud และ PCI ในรอบแรก

ก่อนเซ็นสัญญา ต้องขอคำตอบเรื่อง

- Game/Digital Goods อยู่ใน Merchant Category ใด
- PromptPay QR หมดอายุกี่นาที
- Webhook มี Signature, Retry และ Replay หรือไม่
- Refund PromptPay ทำได้ผ่าน API หรือ Manual Process
- Settlement T+N, Reserve และ Holdback
- Reconciliation Report/API
- SLA และ Incident Escalation

## 4. กฎหมายและ Compliance ในประเทศไทย

### 4.1 จดทะเบียนธุรกิจ

บุคคลธรรมดาและห้างหุ้นส่วนสามัญที่ขายสินค้า/บริการผ่านอินเทอร์เน็ต อาจต้องจดทะเบียนพาณิชย์ภายใน 30 วันหลังเริ่มประกอบกิจการ ส่วนบริษัทจำกัดต้องจดนิติบุคคลและมีวัตถุประสงค์ธุรกิจที่ครอบคลุม

- [คู่มือกรมพัฒนาธุรกิจการค้า](https://www.dbd.go.th/manual/1061)
- [ระบบ DBD Registered](https://dbdregistered.dbd.go.th/) เป็น Trust Mark แบบสมัครใจ ไม่ใช่ใบอนุญาตขาย Game Credit

### 4.2 ตลาดแบบตรงและสิทธิ์ผู้บริโภค

การขายออนไลน์อาจเข้าข่ายตลาดแบบตรง แต่กฎกระทรวงปี 2561 มีข้อยกเว้นบางกรณี เช่น บุคคลธรรมดาที่มีรายได้ E-commerce ไม่เกิน 1.8 ล้านบาทต่อปี, SME ที่ขึ้นทะเบียนตามกฎหมายส่งเสริม SME, วิสาหกิจชุมชน และสหกรณ์

- [สรุปกฎหมาย E-commerce ของ สคบ.](https://www.ocpb.go.th/news_view.php?nid=13434)
- [กฎกระทรวงข้อยกเว้น E-commerce](https://www.ocpb.go.th/download/ECommerce/11.pdf)
- [สิทธิ์ผู้บริโภคในการซื้อออนไลน์](https://www.ocpb.go.th/news_view.php?nid=13429)

จุดที่ยังต้องขอคำตอบเป็นลายลักษณ์อักษรคือ Game Credit ที่ถูกเติมและใช้ทันที เข้าข้อยกเว้นสิทธิ์ยกเลิกภายใน 7 วันหรือไม่ อย่าใช้ข้อความ “เติมแล้วไม่คืนเงินทุกกรณี” เป็นเกราะหลัก

### 4.3 ขอบเขตใบอนุญาต Payment

ถ้าร้านขายสินค้าของตัวเองและใช้ Gateway ที่อยู่ภายใต้การกำกับของธนาคารแห่งประเทศไทย โดยทั่วไปยังเป็น Merchant ไม่ใช่ Payment Provider

แต่ต้องวิเคราะห์ใบอนุญาตเพิ่มเมื่อร้าน

- เก็บยอดเงินลูกค้าไว้ใช้ครั้งต่อไป
- ออก Wallet หรือ Credit ที่โอนให้คนอื่นได้
- รับเงินแทน Publisher/ร้านอื่น
- แบ่ง Settlement ให้ Seller หลายราย
- ทำ Marketplace Escrow

- [Payment Systems Act](https://www.bot.or.th/content/dam/bot/documents/en/laws-and-rules/laws-and-regulations/legal-department/4-payment-act/4.1%20LAW04_PaymentSystemAct.pdf)
- [BOT Payment Oversight](https://www.bot.or.th/en/our-roles/payment-systems/payment-act-oversight.html)

### 4.4 VAT และเอกสารภาษี

เมื่อรายได้ที่อยู่ในบังคับ VAT เกิน 1.8 ล้านบาทต่อปี ต้องจด VAT ภายใน 30 วัน ต้องออกใบกำกับภาษีและยื่นแบบตามกฎหมาย

- [เกณฑ์ VAT 1.8 ล้านบาท](https://www.rd.go.th/7061.html)
- [หน้าที่ผู้ประกอบการ VAT](https://www.rd.go.th/7051.html)
- [e-Tax Invoice & e-Receipt](https://etax.rd.go.th/etax_staticpage/app/)

ควรให้นักบัญชีกำหนดด้วยว่า Revenue ของร้านคือยอดขายเต็มหรือ Commission เพราะขึ้นกับว่าเราเป็น Principal หรือ Disclosed Agent

### 4.5 PDPA

UID เกม, Server, Email, เบอร์โทร, IP, Device และประวัติคำสั่งซื้อ อาจเชื่อมกลับไปหาบุคคลได้ จึงต้องมี

- Privacy Notice
- Lawful Basis แยกตามวัตถุประสงค์
- Data Retention และระบบลบข้อมูล
- Data Subject Request
- Processor Agreement กับ Gateway, Cloud, CRM และ Supplier
- Marketing Consent แยกจาก Checkout
- Incident/Breach Runbook

- [PDPC](https://www.pdpc.or.th/en/home/)
- [ประกาศมาตรการรักษาความมั่นคงปลอดภัย](https://www.pdpc.or.th/2971/)
- [ประกาศการแจ้งเหตุละเมิดข้อมูล](https://www.pdpc.or.th/2405/)

อย่าเก็บรหัสผ่านเกม, OTP หรือเลขบัตรประชาชนสำหรับการเติมเกมตามปกติ

### 4.6 Electronic Transaction และ Platform

ต้องเก็บหลักฐานว่า Customer ยอมรับ Terms Version ใด เมื่อไร ซื้อ SKU/ราคาอะไร และ Fulfillment สำเร็จอย่างไร

- [Electronic Transactions Act](https://www.etda.or.th/th/Useful-Resource/%E0%B8%81%E0%B8%8F%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2-HTML/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%8D%E0%B8%8D%E0%B8%95%E0%B8%A7%E0%B8%B2%E0%B8%94%E0%B8%A7%E0%B8%A2%E0%B8%98%E0%B8%A3%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%AD%E0%B9%80%E0%B8%A5%E0%B8%81%E0%B8%97%E0%B8%A3%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%AA/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%8D%E0%B8%8D%E0%B8%95%E0%B8%A7%E0%B8%B2%E0%B8%94%E0%B8%A7%E0%B8%A2%E0%B8%98%E0%B8%A3%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%AD%E0%B9%80%E0%B8%A5%E0%B8%81%E0%B8%97%E0%B8%A3%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%AA-%E0%B8%9E-%E0%B8%A8-2544.aspx)
- [ETDA Digital Platform Service](https://www.etda.or.th/th/regulator/Digitalplatform/law.aspx) — ต้องตรวจเพิ่มเมื่อทำ Marketplace/Intermediary

## 5. Architecture ที่แนะนำ

### 5.1 Sources of truth

ระบบควรแยกข้อมูลสี่ชุดออกจากกัน

1. **Commercial Order** — ลูกค้าตกลงซื้ออะไร ในราคาเท่าไร
2. **Payment Attempt** — Gateway แจ้งว่ารับเงินสำเร็จหรือไม่
3. **Fulfillment** — Supplier แจ้งว่าเติมหรือส่ง Code สำเร็จหรือไม่
4. **Accounting Ledger** — รายการเงิน, Fee, Refund, Settlement และต้นทุนสินค้า

External System ไม่สามารถรับประกัน Exactly-once ได้ เป้าหมายที่ทำได้จริงคือ

```text
At-least-once delivery
+ authenticated event
+ idempotent handler
+ durable inbox/outbox
+ reconciliation
```

### 5.2 High-level flow

```text
Customer
  → Select Game / Region / Server / SKU
  → Validate UID
  → Create immutable Order snapshot
  → Create Payment Attempt + Dynamic PromptPay QR
  → Gateway signed webhook
  → Mark Payment as paid
  → Transactional Outbox
  → Fulfillment Worker
  → Publisher/Distributor API
  → Complete or Manual Review
  → Reconciliation
```

Browser Redirect, QR Scan State และ Slip Upload เป็นเพียง UX Signal ห้ามใช้เป็นหลักฐานเริ่ม Fulfillment

### 5.3 State machines

#### Order

```text
CREATED
→ AWAITING_PAYMENT
→ PAID
→ COMPLETED

AWAITING_PAYMENT → EXPIRED | CANCELLED
PAID → REVIEW_REQUIRED
```

#### Payment

```text
CREATED
→ QR_ACTIVE
→ PROCESSING
→ SUCCEEDED

QR_ACTIVE → EXPIRED | CANCELLED | FAILED
```

#### Fulfillment

```text
NOT_STARTED
→ QUEUED
→ SUBMITTED
→ SUCCEEDED

QUEUED/SUBMITTED → RETRYABLE_FAILURE
QUEUED/SUBMITTED → UNKNOWN
QUEUED/SUBMITTED → PERMANENT_FAILURE
```

`UNKNOWN` สำคัญมาก เพราะ Supplier Timeout หลังรับคำขอแล้ว ไม่ได้แปลว่าเติมไม่สำเร็จ ต้อง Query Status ก่อน Retry ไม่อย่างนั้นอาจเติมซ้ำ

### 5.4 Data model ขั้นต่ำ

- `games`, `servers`, `catalog_skus`, `offer_versions`
- `publisher_sku_mappings`
- `validation_requests`, `validation_results`
- `orders`, `order_lines`
- `payment_attempts`
- `webhook_inbox`
- `outbox_events`
- `fulfillment_jobs`, `fulfillment_attempts`
- `inventory_batches`, `inventory_items`
- `refunds`
- `ledger_accounts`, `journal_entries`, `journal_lines`
- `settlements`, `reconciliation_exceptions`
- `support_cases`, `admin_audit_events`

ใช้ Integer Satang แทน Floating-point และ Snapshot ชื่อสินค้า, SKU, ราคา, VAT, Discount, UID Rule, Terms Version และ Supplier Mapping ลงใน Order ทุกครั้ง

### 5.5 Dynamic PromptPay และ Webhook

- สร้าง QR ต่อ Payment Attempt
- กำหนด Amount และ Expiration จาก Server
- อ่าน Raw Request Body ก่อน Verify Signature
- บันทึก Provider Event ID แบบ Unique
- ตอบ `2xx` ให้เร็ว แล้ว Process ผ่าน Queue
- รองรับ Duplicate และ Out-of-order Events
- เมื่อยอดเงินผิด Currency/Amount ให้เข้า Reconciliation Exception
- Query Provider API ซ้ำสำหรับ Order มูลค่าสูงหรือเหตุการณ์ผิดปกติ

ห้ามใช้ Static QR ส่วนตัว, OCR Slip หรือ Screenshot Matching เป็น Core Payment Confirmation

### 5.6 Fulfillment Adapter

Supplier Adapter ควรมี Contract อย่างน้อย

```text
validate_player(game, uid, server, region)
quote_or_check_product(product)
submit_topup(idempotency_key, player, product)
get_status(provider_reference)
cancel_if_supported(provider_reference)
```

Supplier Error ต้องแยกเป็น

- Invalid Player/SKU — ไม่ Retry
- Insufficient Supplier Balance — ปิด SKU และแจ้ง Operations
- Rate Limit/Temporary Failure — Retry แบบ Backoff
- Timeout/Unknown — Query Status ก่อน Retry
- Permanent Failure — Manual Review หรือ Refund

### 5.7 Reconciliation

ตรวจอย่างน้อยสามทาง

1. Order เทียบ Gateway Transaction
2. Gateway Transaction เทียบ Settlement/Bank Deposit
3. Paid Order เทียบ Supplier Fulfillment/Code Delivery

ทำ Incremental Reconciliation ระหว่างวันและ Full Close ทุกวัน ห้ามแก้ยอดย้อนหลังด้วยการ Update Record เดิม ให้บันทึก Correcting Entry แทน

## 6. Security และ Fraud

- Hosted Card Field/Checkout เพื่อลด PCI Scope
- Signed Webhook + Replay Window
- Unique Provider Event/Payment ID
- Rate Limit แยก Customer, UID Validation, Payment และ Supplier API
- Device/IP/UID Velocity Check โดยไม่ใช้ IP อย่างเดียว
- Admin SSO/MFA/RBAC
- Maker-checker สำหรับ Refund ใหญ่และ Bulk Code Export
- Encrypt Code Inventory ด้วย KMS
- ไม่ใส่ UID/Email/Phone เป็น Log Label
- แยก Production/Test Credential
- Egress Allowlist สำหรับ Fulfillment Worker
- Audit Log แบบ Append-only
- Backup และ Restore Test
- Supplier/Game Kill Switch

อ้างอิงเพิ่มเติม:

- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [PCI DSS](https://www.pcisecuritystandards.org/standards/pci-dss/)

## 7. MVP → Production plan

### Phase 0 — Commercial gate

- เลือก 1 Gateway
- ได้หนังสืออนุญาตหรือ Supply Contract สำหรับ 1–2 เกม
- ตกลง Seller of Record, Refund และ Fraud Allocation
- ตรวจ DBD, OCPB, VAT และ PDPA
- เขียน Terms, Privacy Notice, Refund Policy และ SLA

**Gate:** ห้ามเปิด SKU ที่ไม่มีสิทธิ์ขายและ Fulfillment Route ที่ทดสอบแล้ว

### Phase 1 — Controlled MVP

- THB + PromptPay เท่านั้น
- 1 Gateway
- 1–2 เกม
- 1 Supplier Route ต่อ SKU
- Modular Monolith + PostgreSQL
- Webhook Inbox + Transactional Outbox
- Guest Checkout พร้อม Secure Order Link
- Manual Review สำหรับ Order ผิดปกติ
- Daily Manual Reconciliation
- ไม่มี Wallet, Marketplace, Stored Card หรือ Complex Promotion

**Gate:** Fault Test ต้องไม่เกิด Duplicate Fulfillment และทุก Payment ต้องตามเส้นทางจนจบได้

### Phase 2 — Limited beta

- Automated Payment/Settlement/Supplier Reconciliation
- Fraud Scoring และ Review Queue
- Admin MFA/RBAC/Audit
- Support และ Refund SLA
- Monitoring, Alert และ Synthetic Checkout
- Security Review/Penetration Test

### Phase 3 — Production

- Supplier Circuit Breaker
- Auto-disable SKU เมื่อ Supplier Balance/Health ต่ำ
- KMS-backed Code Inventory
- Retention/Data-subject Automation
- Incident Exercise
- Restore Drill
- Finance/Legal/Privacy/Operations Sign-off

### Phase 4 — Scale

- เพิ่ม Gateway สำรอง
- เพิ่ม Card/Wallet
- เพิ่ม Supplier ผ่าน Adapter Contract เดิม
- Routing ตาม Cost, Health และ Stock
- แยก Service เมื่อมีหลักฐานด้าน Scale/Ownership จริง

## 8. Stop-ship checklist

ห้ามเปิดใช้งานจริงหากยังมีข้อใดข้อหนึ่ง

- [ ] ไม่มีหนังสืออนุญาตจาก Publisher/Distributor
- [ ] ใช้ Static PromptPay QR หรือ Slip เป็นหลักฐานเติมเกม
- [ ] Fulfillment เริ่มจาก Browser Redirect
- [ ] Webhook ไม่มี Signature Verification
- [ ] Duplicate Webhook สามารถเติมซ้ำได้
- [ ] Supplier Timeout ถูก Retry ทันทีโดยไม่ Query Status
- [ ] ไม่มี Daily Reconciliation
- [ ] Code เก็บเป็น Plaintext หรือหลุดเข้า Log
- [ ] ราคา/SKU ใน Order เปลี่ยนตาม Catalog ปัจจุบันได้
- [ ] ไม่มี Late/Duplicate Payment Policy
- [ ] ไม่มี Refund Route ก่อน Irreversible Delivery
- [ ] เก็บ Password/OTP เกมหรือเลขบัตรประชาชนโดยไม่จำเป็น
- [ ] VAT/Seller-of-Record ยังไม่ชัด
- [ ] ไม่มี Supplier/Game Kill Switch
- [ ] ไม่มี Backup Restore และ Incident Runbook

## 9. Supplier due-diligence checklist

ก่อนเติมเงินหรือ Pre-fund ให้ Supplier ขอเอกสารเหล่านี้

1. Contracting Entity และ Company Registration
2. Catalog ไทยล่าสุด พร้อม Region/Denomination
3. หนังสือ Publisher/Master Distributor Authorization
4. สิทธิ์ขายต่อผ่าน Website/App และประเทศที่อนุญาต
5. API Docs: Authentication, Idempotency, Status Query, Callback, Reconciliation
6. Refund Policy สำหรับ Wrong UID, Region, Delay, Duplicate และ Partial Fulfillment
7. Prepayment, Reserve, Minimum Volume, FX และ Margin
8. Tax Invoice/VAT Treatment
9. SLA, Support Escalation และ Maintenance Window
10. คำยืนยันว่าไม่ Fulfill ผ่าน Consumer Account หรือ Account-login Method

## 10. Recommendation

### ถ้าเป็นเกมของเราเอง

Shortlist Coda Webstore/Codapay กับ Xsolla แล้วเทียบ

- Thailand Payment Coverage
- Merchant of Record
- Tax/Compliance Ownership
- Fraud Liability
- Integration Time
- Total Landed Cost

### ถ้าเป็นร้านเติมหลายเกมในไทย

แนวทางเริ่มต้นที่แนะนำคือ

1. Supplier: Direct Publisher หรือ Razer Gold Distribution / DT One
2. Local UID Top-up: พิจารณา WonDD ก่อน ตามด้วย WeGame หลังผ่าน Due Diligence
3. Regional UID/Code API: เปรียบเทียบ MooGold, GamesDrop และ IAK ด้วย SKU ชุดเดียวกัน
4. Code Catalog: Reloadly เป็นตัวทดลอง API ได้ แต่ต้องตรวจ Region/Resale Right ราย SKU
5. Payment: Opn PromptPay
6. Product Scope: 1–2 เกม ไม่มี Wallet
7. Backend: Modular Monolith + PostgreSQL + Durable Queue
8. Operations: Manual Review + Daily Reconciliation

ถ้ายังหา Supplier ที่มีสิทธิ์และ Margin ชัดเจนไม่ได้ ไม่ควรเริ่มเขียนระบบ Checkout เต็มรูปแบบ เพราะสิ่งที่กำหนด Product และกำไรจริงคือ Catalog, Cost, SLA และ Refund ของ Supply Chain

## 11. คำถามที่ต้องตอบก่อนออกแบบระบบจริง

1. ขายเกมของเราเอง หรือขายเกมของบริษัทอื่น
2. Fulfillment เป็น Direct UID Top-up หรือส่ง Code
3. มี Publisher/Distributor รายใดคุยไว้แล้ว
4. Average Order Value และยอด Order ต่อเดือนประมาณเท่าไร
5. ต้องรองรับ PromptPay อย่างเดียวหรือ Card/Wallet ตั้งแต่แรก
6. ร้านเป็น Principal, Agent หรือ Marketplace
7. ต้องมี Customer Wallet/Loyalty Balance หรือไม่
8. เปิดเฉพาะประเทศไทยหรือเตรียม SEA ตั้งแต่แรก
9. ต้องออกใบกำกับภาษีเต็มรูปหรือ e-Tax หรือไม่
10. ใครรับผิดชอบ Wrong UID, Chargeback และ Supplier Failure

ตอบสิบข้อนี้ได้เมื่อไร จึงค่อยเลือก Supplier, Gateway และ Architecture โดยไม่เดาส่วนสำคัญของธุรกิจ

## 12. แหล่งข้อมูลหลัก

### รัฐและกฎหมายไทย

- [กรมพัฒนาธุรกิจการค้า — ผู้มีหน้าที่จดทะเบียนพาณิชย์](https://www.dbd.go.th/manual/1061)
- [สคบ. — E-commerce และตลาดแบบตรง](https://www.ocpb.go.th/news_view.php?nid=13434)
- [ธนาคารแห่งประเทศไทย — Payment Systems Oversight](https://www.bot.or.th/en/our-roles/payment-systems/payment-act-oversight.html)
- [กรมสรรพากร — VAT](https://www.rd.go.th/7061.html)
- [PDPC](https://www.pdpc.or.th/en/home/)
- [ETDA Digital Platform Service](https://www.etda.or.th/th/regulator/Digitalplatform/law.aspx)

### Payment

- [Opn Thailand Pricing](https://www.omise.co/en/pricing/thailand)
- [Opn PromptPay](https://docs.omise.co/promptpay)
- [2C2P Thailand](https://2c2p.com/countries/thailand/)
- [ChillPay Channels](https://www.chillpay.co/en/payment-channel/)
- [Xendit Thailand Pricing](https://www.xendit.co/en-th/pricing/)
- [Fiuu Payment Channels](https://fiuu.com/payment-channels/)
- [Xsolla Pricing](https://xsolla.com/pricing)

### Supply/Fulfillment

- [Razer Gold Distribution Partners](https://partners.gold.razer.com/en/distribution-partners/)
- [DT One Retail Networks](https://www.dtone.com/who-we-serve/retail-networks)
- [Reloadly Gift Card API](https://www.reloadly.com/products/gift-card-api)
- [Coda Distribution](https://www.coda.co/product/distribution/)
- [Xsolla Web Shop](https://developers.xsolla.com/solutions/web-shop/)
- [WonDD Game Online API](https://www.wondd.com/apigameonline.php)
- [WePay Thailand](https://www.wepay.in.th/)
- [WePay DBD Profile](https://datawarehouse.dbd.go.th/company/profile/30123555001425)
- [mPAY STATION](https://www.mpay.th/th/station.php)
- [MooGold API](https://doc.moogold.com/)
- [GamesDrop Partner API](https://gamesdrop.io/en/docs/partner-api)
- [IAK API](https://api.iak.id/)
- [Digiflazz Developer](https://developer.digiflazz.com/)
