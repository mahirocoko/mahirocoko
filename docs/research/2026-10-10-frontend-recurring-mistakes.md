# ข้อผิดพลาด frontend ที่ Mahiro ต้องย้ำซ้ำ

วันที่: 10 ตุลาคม 2026

สถานะ: บันทึกวิเคราะห์ก่อนออกแบบ skill ยังไม่ได้สร้าง ติดตั้ง หรือเปลี่ยน skill ที่ใช้อยู่

## ขอบเขตหลักฐาน

เอกสารนี้รวบรวมคำแก้ไขในข้อความปัจจุบัน บันทึกเรียนรู้ใน workspace, project memory และผลค้น transcript โดย recall agent จากงานที่ทำร่วมกัน โดยเฉพาะ Haabiz UI, mahirocoko-ui, Eizypay และ frontend labs

ไม่ใช่การอ่านทุกข้อความย้อนหลังครบทั้งหมด จึงไม่ระบุจำนวนครั้งที่พลาดหรืออ้างว่ารายการนี้ครอบคลุมทุกเหตุการณ์ ข้อความในช่อง **สิ่งที่ต้องย้ำ** เป็นข้อเสนอที่สังเคราะห์ขึ้น ไม่ใช่คำพูดเดิมแบบ verbatim

แยกสามระดับไว้ตลอด:

- **หลักฐาน** — เหตุการณ์หรือบทเรียนที่บันทึกไว้
- **วิเคราะห์** — คำอธิบายรูปแบบความผิดพลาด ไม่ใช่ข้อเท็จจริงเกี่ยวกับกลไกภายในโมเดล
- **ข้อเสนอ** — สิ่งที่ควรบังคับก่อนเขียนและก่อนส่งงาน

## สารบัญ

1. Design system: ใช้ของจริง ไม่ใช่แค่หน้าตาคล้าย
2. Gap / spacing: วัดความสัมพันธ์ ไม่ใช่ดู class
3. Shared components: แก้เจ้าของ ไม่สร้างสำเนา
4. Input family: paint เดียวกัน แต่ไม่บังคับ anatomy เดียวกัน
5. Control size: สูงเท่ากันยังไม่พอ ต้องตรงแนวด้วย
6. ข้อผิดพลาดที่เกี่ยวเนื่องอีก 20 หัวข้อ
7. ทำไมมี memory แล้วแต่ยังพลาด
8. สิ่งที่ skill ควรทำ และสิ่งที่ไม่ควรทำ
9. Checklist ที่ Mahiro ไม่ควรต้องทวนเอง
10. หลักฐานย้อนหลังและข้อจำกัด
11. Care ล่าสุด: source audit ที่ไม่รอคำทักจาก Mahiro
12. Care rendered follow-up: หลักฐานที่ยืนยัน และคำอ้าง QA ที่ต้องจำกัด
13. ทดลอง routing + pain probes ใน fresh Letta conversation

## 1. Design system: ใช้ของจริง ไม่ใช่แค่หน้าตาคล้าย

### พลาดอะไร

- ใช้สีหรือ class ที่ดูเหมือน design system แต่ไม่ได้เรียก primitive / recipe ที่เป็นเจ้าของจริง
- Import component แล้ว override จนเสีย material, state หรือ geometry ของระบบ
- คิดชื่อ variant/class ขึ้นเอง ทั้งที่ CSS ไม่มี rule รองรับ
- อ่าน source ของ primitive แต่ไม่อ่าน app/theme layer ที่เปลี่ยน computed paint
- เอา primitive, composition ของ route และ component ที่เขียนเลียนแบบ มาปนเป็นคำว่า “ใช้ design system”

### หลักฐาน

บทเรียน Haabiz UI แยกการตรวจ provenance ออกจาก browser QA ชัดเจน: class ที่ชื่อเหมือนระบบไม่ได้พิสูจน์ที่มา และการตรวจ imports ไม่ได้พิสูจน์ว่า paint/state ใช้งานจริง ส่วน Office Lunch ย้ำว่า Base UI ต้องเป็น behavioral primitive จริง ไม่ใช่การตั้งชื่อหรือใส่ attribute เลียนแบบ

### วิเคราะห์

จุดหลุดคือใช้ความคล้ายทางภาพเป็นตัวแทนของ ownership แล้วตรวจเพียงว่า component/class มีอยู่ แทนที่จะตามจาก consumer กลับไปถึง API, recipe, tokens และ CSS ที่ทำงานจริง

### สิ่งที่ต้องย้ำ

> ก่อนเขียน บอกให้ได้ว่าใช้ component ไหน จาก owner ไหน มี variant อะไร และ usage ที่ยอมรับแล้วอยู่ตรงไหน ห้ามสร้าง API หรือ class ที่เดาว่าน่าจะมี

### เกณฑ์ตรวจ

- แยกเป็น **canonical primitive / route-owned composition / duplicate ที่ bypass primitive**
- ตาม `consumer → import → public API → recipe → token/CSS rule` ให้ครบเฉพาะส่วนที่เปลี่ยน
- ตรวจ caller overrides และ app-level selectors ที่ทับ primitive
- ตรวจ rendered states ที่เกี่ยวข้อง ไม่ใช้ import หรือชื่อ class เป็นหลักฐานจบงาน

## 2. Gap / spacing: วัดความสัมพันธ์ ไม่ใช่ดู class

### พลาดอะไร

- เห็น `gap-*`, `space-y-*` หรือ `mb-*` แล้วสรุปว่าระยะถูก
- ใช้ระยะเดียวกับ item, heading, section และ nested children ทั้งที่คนละบทบาท
- ไม่รวม padding, line-height, label display และ wrapper เข้าไปในระยะจริง
- ใช้ `first:*` ภายใน wrapper แล้ว selector ไปจับคนละตำแหน่งกับที่ตั้งใจ
- ตรวจ element เดี่ยว แต่ไม่ตรวจความหนาแน่นของ sidebar/menu/ทั้งหน้า
- คัดลอก spacing จาก source ที่มี content น้อยกว่า แล้วปล่อยให้ local content ดูแน่นหรือหลวมผิดจังหวะ

### หลักฐาน

memory ระบุข้อทักท้วงเรื่อง spacing ซ้ำโดยตรง โดยเฉพาะ sidebar, menu และ nested navigation รวมถึงบทเรียนว่า parent ต้องเป็นเจ้าของระยะระหว่าง disclosure children ไม่ปล่อยให้ child แต่ละตัวเดา margin เอง

### วิเคราะห์

จุดหลุดคือมอง spacing เป็นค่าประจำ element แทนที่จะเป็นความสัมพันธ์ระหว่าง element และเชื่อ class มากกว่า geometry ที่ผู้ใช้เห็น

### สิ่งที่ต้องย้ำ

> แยก item gap, label-to-field gap, heading-to-content gap, section gap และ parent-to-child gap ตรวจทั้งกลุ่มที่ render จริง อย่าใช้หนึ่งค่าแก้ทุกอย่าง

### เกณฑ์ตรวจ

- ระบุเจ้าของแต่ละ gap ว่า parent layout หรือ component slot
- วัด `next.top - previous.bottom` เมื่อสงสัย ไม่วัดแค่ค่า CSS `gap`
- ตรวจ desktop/narrow, label สองบรรทัด, error/help text และข้อความยาว
- ตรวจ loading/skeleton ด้วย ไม่ให้ระยะหายหรือ runtime ถูกตัดเฉพาะบาง state
- เทียบ cadence และ viewport density กับ source/usage ที่เลือก ไม่ตั้ง universal spacing ใหม่
- ถ้า Mahiro บอกขยับ 1px ให้ลอง offset ตรง element ตามทิศนั้นก่อน ไม่เปลี่ยนโครงสร้างแทน

## 3. Shared components: แก้เจ้าของ ไม่สร้างสำเนา

### พลาดอะไร

- ทำ trigger, field shell, menu row หรือ dialog anatomy ซ้ำในแต่ละหน้า
- แก้เฉพาะหน้าที่กำลังดู แทนที่จะแก้ primitive/recipe ที่ sibling consumers ใช้ร่วมกัน
- ใช้ helper รวม class แทน semantic component ทั้งที่ต้องแชร์ behavior และ accessibility ด้วย
- แชร์ผิดชั้น: เอา asset/content ของแอปหนึ่งใส่ shared package
- อีกด้านหนึ่งคือ extract เร็วเกินไป สร้าง generic component ใหญ่ก่อนเห็น reuse จริง

### หลักฐาน

- mahirocoko-ui: เมื่อ Docs สร้าง generic behavior ซ้ำ Mahiro เปิดให้เพิ่ม owned package contract เช่น Tabs/Collapsible แทนการยึด package freeze
- Eizypay: shared dialog anatomy เป็น `DialogHeader / DialogBody / DialogFooter` แต่ tenant modal artwork ต้องอยู่ app-owned
- Nudge: หลังยอมรับ Tilt Field ให้เป็นแกน ต้องแชร์ runtime contract ระหว่าง gallery/detail ไม่ให้เป็น special case ที่หน้าอื่นเลียนแบบเอง

### วิเคราะห์

การเลือก local custom เป็นทางลัดช่วยให้หน้าแรกเสร็จเร็ว แต่ทำให้หน้าถัดไปมี owner คนละคน และการแก้ครั้งต่อไปไม่กระจายไปยังทุก consumer

### สิ่งที่ต้องย้ำ

> ถ้ามี shared primitive ใช้อยู่แล้ว ให้ใช้หรือแก้เจ้าของนั้น ถ้า pattern ซ้ำและได้รับการยอมรับแล้ว ให้แชร์ส่วนที่ซ้ำจริง แต่เก็บ content/layout เฉพาะ feature ไว้ local

### เกณฑ์ตรวจ

- ค้นหา primitive และ usage ใกล้เคียงก่อนเพิ่ม component
- ถ้า API ขาด ให้เลือก extend owner เดิมหรือ composition ที่ชัดเจน ไม่สร้างสำเนาเงียบ ๆ
- แชร์ paint/state/behavior ที่เป็น contract เดียวกัน ไม่บังคับ interaction job ทุกหน้าให้เหมือนกัน
- ไล่ actual consumers หลังแก้ shared owner ไม่จบแค่ specimen หรือ hero
- ตรวจ API ก่อน reuse: single-select Combobox ไม่ได้รองรับ multiple เพียงเพราะหน้าตาคล้ายกัน

## 4. Input family: paint เดียวกัน แต่ไม่บังคับ anatomy เดียวกัน

### พลาดอะไร

- Input, Select, DatePicker, Combobox และ like-input trigger ใช้ background/border/shadow คนละชุด
- แชร์ token แล้วคิดว่าหน้าตาเท่ากัน ทั้งที่ opacity, compositing, background-clip หรือ state layer ต่างกัน
- แก้ idle state แต่ hover/focus/error/disabled ยังหลุด
- เปลี่ยน compact trigger ให้กว้างเหมือน text input ทั้งที่ Mahiro ขอแก้เฉพาะ paint
- ตรวจ trigger แต่ไม่เปิด popup; menu/calendar surface และ selected state จึงยังผิด

### หลักฐาน

ข้อความปัจจุบันระบุ Input/Select/DatePicker/like-input โดยตรง ส่วน memory มีบทเรียน paint-only boundary: การทำให้ trigger “เหมือน Input” ไม่ได้อนุญาตให้เปลี่ยน accepted width/geometry และ shared variables อย่างเดียวไม่พิสูจน์ full-paint parity ใน Eizypay ยังมีข้อแก้ Combobox popup ให้ตรงกับ SelectContent โดยไม่เปลี่ยน selection semantics

### วิเคราะห์

จุดหลุดคือเทียบเพียงสีหรือ class บางตัว ไม่เทียบ shell recipe ทั้งชุด และเอา geometry ไปปนกับ paint

### สิ่งที่ต้องย้ำ

> ช่องที่อยู่ใน family เดียวกันต้องใช้ field paint owner เดียวกัน ตรวจทั้ง shell และ states ถ้าขอแก้สีหรือ border ให้คง width, content และ anatomy ที่ยอมรับแล้ว

### เกณฑ์ตรวจ

- ทำ parity matrix เฉพาะ controls ที่ใช้จริง: Input / Select / DatePicker / Combobox / like-input
- เทียบ background, compositing/clip, border width/color, radius, shadow และ focus/state layer
- ตรวจ Light/Dark เฉพาะ modes ที่ repo รองรับ ห้ามเพิ่ม mode เอง
- ตรวจ idle, hover, focus, disabled, invalid และ open/selected ตาม behavior ของ control
- แยก **field trigger recipe** จาก **popup/calendar recipe** ไม่เอาทั้ง popup ไปทาสีแบบช่องกรอก
- ใช้ screenshot ข้างกันและ computed styles ของ configuration/state เดียวกัน

## 5. Control size: สูงเท่ากันยังไม่พอ ต้องตรงแนวด้วย

### พลาดอะไร

- Button/Input/Select ในแถวเดียวกันใช้คนละ size โดยไม่มีเหตุผลทาง hierarchy
- ตั้ง height ให้ inner input แต่ shell มี padding เพิ่ม ทำให้ visible control สูงกว่าเพื่อน
- ค่า height เท่ากัน แต่ top/bottom ไม่ตรงเพราะ label, line-height หรือ container alignment
- default size กลายเป็นข้อบังคับจน compact icon control/toolbar ที่ตั้งใจเล็กถูกขยาย
- ใช้ arbitrary height แก้หน้าเดียวแทน size token/variant ของระบบ

### หลักฐาน

บันทึก Haabiz UI วันที่ 2–3 ตุลาคมระบุ control-height inconsistencies และ audit ที่เทียบ Button คนละ size/role แล้วสรุป parity ผิด ส่วน Office Lunch มีการยืนยัน catalog action ให้คง icon-only 40px ตาม sibling toolbar actions ไม่ใช่การใช้ขนาดใหญ่ทุกที่

### วิเคราะห์

จุดหลุดคือดู prop หรือค่า `height` แทน border-box ของ shell และมอง default control size เป็นกฎสากลแทน fallback ของแต่ละ context

### สิ่งที่ต้องย้ำ

> ใน form/action row ปกติใช้ control size token เดียวกัน วัด visible shell ทั้ง height และ y-alignment ถ้าจะต่างต้องมี role/anatomy ที่อธิบายได้ ไม่ใช่เลือกตามความรู้สึก

### เกณฑ์ตรวจ

- เทียบ `top / bottom / height` ของ sibling controls จริง ไม่ใช่แค่ inner input
- ตรวจ label box, label-to-field gap และ helper/error allocation แยกจาก field height
- ตรวจว่าความสูงไม่ได้เกิดจาก `height + shell padding + border` ที่นับผิดชั้น
- เทียบเหมือนกับเหมือน: role, size, variant, state และ viewport เดียวกัน
- รักษา compact exceptions ที่มี owner ชัดเจน และตรวจ hit target แยกจาก visual size
- เทียบ empty/populated state: action เดียวกันไม่ควรเปลี่ยน anatomy จนอ่านเป็น control คนละชนิดโดยไม่มีเหตุผล
- ไม่ตั้ง 40px/44px เป็นกฎทุกโปรเจกต์ ให้ current repo เป็นเจ้าของค่า

## 6. ข้อผิดพลาดที่เกี่ยวเนื่องอีก 20 หัวข้อ

### 6.1 Horizontal ownership และ element ชนกัน

- **พลาด:** ใส่ icon/metadata/chevron โดยไม่อ่านว่า primitive inject trailing affordance อยู่แล้ว
- **ต้องย้ำ:** leading icon → `min-w-0 flex-1` label → `shrink-0` metadata → trailing owner เดียว
- **ตรวจ:** เปิด overlay จริง ดู child gaps, long labels, clipping, scroll และ submenu placement ไม่ตรวจแค่ closed trigger

### 6.2 State selectors และ selected label

- **พลาด:** `group/peer` อยู่คนละ node กับ state attribute; icon จึงไม่หมุน หรือ selected value แสดง slug แทน label
- **ต้องย้ำ:** อ่าน runtime attributes และ value-to-label API จาก primitive จริง ห้ามเดาจากชื่อ props
- **ตรวจ:** open/closed และ before/after selection; Base UI Select ใช้ `items`/`itemToStringLabel` หรือ selected-label owner ที่ explicit

### 6.3 Theme/token mapping และ Light/Dark

- **พลาด:** semantic token ชื่อถูก แต่ luminance hierarchy กลับด้านใน Dark; chart palette มี mapping แยกกันในแต่ละหน้า
- **ต้องย้ำ:** ใช้ resolved values ตรวจ hierarchy และแชร์ canonical palette slots ทุก sibling consumer ไม่ใช้ border แบ่งทุก surface โดยอัตโนมัติจนทั้งระบบดูแตกเป็นกรอบ
- **ตรวจ:** track/selected, card/popup, idle/hover/selected; exported CSS ต้องมี tokens ครบ ไม่ปล่อย fallback เป็น `currentColor`

### 6.4 Typography: ใหญ่ หนา แน่น หรือ scope รั่ว

- **พลาด:** heading ทุกส่วนใหญ่ใกล้ hero, label/action หนาเกิน, tracking ติดกัน และ logo font รั่วเข้า product UI
- **ต้องย้ำ:** แยก semantic type roles ให้ชัด ห้ามใช้ negative tracking หรือ bold เป็นทางลัดสร้างความ premium
- **ตรวจ:** Thai glyph clearance, wrap และ computed family/size; ระวัง `text-body` ชน `text-*` color ผ่าน tailwind-merge

### 6.5 Content anatomy และข้อมูลซ้ำ

- **พลาด:** เพิ่ม summary/cards/labels เพื่ออธิบายสิ่งที่ control บอกอยู่แล้ว; Agent Mode ยังอ่านเหมือน Studio ที่แปะ chat
- **ต้องย้ำ:** รักษาความสามารถผ่าน contextual disclosure ไม่ใช่แสดงทุก control พร้อมกัน และไม่เพิ่มข้อมูลนอก source/human scope
- **ตรวจ:** มองทั้ง flow ว่าคนอ่านรู้หรือไม่ว่าต้องทำอะไรต่อ ไม่ใช้ข้อความที่สั้นลงเป็นหลักฐานว่า composition ดีแล้ว

### 6.6 Reference fidelity และขอบเขตการแก้

- **พลาด:** สลับ exact source กับ taste reference, ตัด route chrome ที่ capture ไม่ครอบคลุม หรือ redesign ทั้ง element จากคำขอ paint-only
- **ต้องย้ำ:** ระบุ reference role และ editable layer ก่อนเขียน คง accepted geometry/content ที่ไม่ถูกเปิดให้แก้
- **ตรวจ:** full route พร้อม ancestors/siblings; ถ้าคำขอ 1px ให้พิสูจน์ literal probe ก่อนทฤษฎีอื่น

### 6.7 State stability และ error boundaries

- **พลาด:** live updates ทำ input เสีย focus, validation ใช้หน่วยไม่ตรงกับ server หรือ preview error ทำ render พัง
- **ต้องย้ำ:** interaction ต้องอยู่ได้ระหว่างข้อมูลเปลี่ยน และ copy/counter/disablement/runtime validation ต้องใช้ contract เดียวกัน
- **ตรวจ:** พิมพ์ระหว่าง update, clear/reset, ข้อความไทยใกล้ byte limit และ failed preview โดยไม่ให้ mutation หลุด

### 6.8 Config propagation และ real consumers

- **พลาด:** setting เปลี่ยน hero/local preview ได้ แต่ primitive, export, registry หรือ consumer จริงไม่เปลี่ยน; กลับ default แล้ว style ค้าง
- **ต้องย้ำ:** map `draft → reset/history/persistence → runtime → consumer → export/generated output` ตามส่วนที่มีจริง
- **ตรวจ:** `A → B → A` บน mounted consumer เดิม และตรวจตัวเลือกที่ persist/export แล้วมีผลให้เห็นจริง ไม่แสดง option ที่ระบบทำไม่ได้หรือไม่มีอยู่จริง

### 6.9 Semantic interaction และ console health

- **พลาด:** control หน้าตาถูกแต่ keyboard/focus/ARIA ไม่ครบ, nested interactive HTML หรือมี hydration warning แล้วมองข้าม
- **ต้องย้ำ:** primitive ต้องรักษา behavior ไม่ใช่แชร์แค่ CSS และ console เป็นส่วนหนึ่งของ technical correctness
- **ตรวจ:** keyboard/focus, disabled/error recovery และ console หลัง load/interaction; warning ที่เกี่ยวข้องต้องอธิบายด้วยหลักฐาน ไม่อ้างว่าเก่าเอง

### 6.10 QA scope และคำว่า PASS

- **พลาด:** build/typecheck/source tests ผ่านแล้วเรียก UI ผ่าน; reviewer ตรวจผิด component หรือ screenshot ไม่อยู่ใน state ที่รายงาน
- **ต้องย้ำ:** แยก provenance, propagation, rendered correctness และ human visual acceptance ไม่มีข้อไหนแทนอีกข้อได้
- **ตรวจ:** fresh read-only Agy/Gemini lane สำหรับ rendered QA; Main ตรวจ raw evidence; ระบุว่า PASS เฉพาะอะไร และ Mahiro ยังเป็นผู้ตัดสินภาพรวม

### 6.11 i18n และภาษาไทย

- **พลาด:** เริ่มออกแบบ i18n ใหม่ทั้งที่เคยใช้ Lingui ร่วมกันแล้ว หรือเพิ่ม explicit-ID dictionary/projector ให้ labels ธรรมดาโดยไม่มีเหตุผล
- **ต้องย้ำ:** อ่าน implementation ใกล้ที่สุด ใช้ component-owned template macros และแปลที่ render boundary ตาม repo; API/CMS data ไม่แปลเอง และคง locale-routing owner ไม่สร้าง pages คู่ขนานตามความเคยชิน
- **ตรวจ:** default locale, URL/build/catalog policy จาก repo จริง และอ่าน Thai copy ว่าเป็นภาษาคน ไม่ใช่คำแปลตรงตัว ประเด็น Lingui ถูกย้ำอีกครั้งในวันที่ 9 ตุลาคมตาม memory

### 6.12 โครงสร้างและ convention ของโค้ด frontend

- **พลาด:** เดา package manager, casing, alias หรือ formatter; class ยาวอ่านยาก และสร้าง utils/abstraction ใหม่แทน owner ที่มีอยู่
- **ต้องย้ำ:** current repo มาก่อน personal fallback; เมื่อ repo เงียบใช้ kebab-case, explicit props interfaces, arrow components และใช้ `cn` ที่ repo มีแล้วจัดกลุ่ม class ให้อ่านออก
- **ตรวจ:** import paths บน case-sensitive resolution, public exports, package/lockfile และ formatter ของ touched files ไม่ใช้การ refactor เป็นข้ออ้างเปลี่ยนทั้ง repo

### 6.13 Icons และ assets: มีไฟล์ไม่ได้แปลว่าถูก

- **พลาด:** copy SVG มาไม่ครบ paths, เพิ่ม icon ซ้ำกับ primitive หรือยอมรับ asset จาก pipeline PASS โดยไม่ดู silhouette/alpha ที่ขนาดใช้งาน
- **ต้องย้ำ:** ใช้ complete owned icon export และ asset ที่ได้รับเลือกจริง อย่าแทน brand/reference ด้วยของที่ agent คิดขึ้นเอง
- **ตรวจ:** rendered icon ทั้งชุดที่ target size, refresh/reload ไม่ใช่แค่ client navigation, source/derivative role, alpha บนพื้นหลังจริง และ consistency ระหว่าง desktop/mobile; ข้อความเรื่อง visual assets ไม่ใช่สิทธิ์เริ่ม imagegen ในรอบวิเคราะห์นี้

### 6.14 Responsive: จัดงานใหม่ตามพื้นที่ ไม่ใช่แค่ไม่มี overflow

- **พลาด:** ย่อ desktop layout ตรง ๆ, วาง Properties card ยาวก่อน main content, ซ่อน controls ที่ยังจำเป็น หรือเพิ่ม summary มือถือจนข้อมูลซ้ำ
- **ต้องย้ำ:** breakpoint ต้องสัมพันธ์กับ anatomy ที่เปลี่ยน เช่น sidebar collapse; รักษางานที่ผู้ใช้ต้องทำ แล้วเลือก row/wrap/drawer จาก feature owner ไม่ใช่ใช้ sheet กับทุกอย่าง
- **ตรวจ:** mobile/tablet ตอน sidebar หาย, long labels/editor, hierarchy depth, primary navigation และ clear actions; ไม่มี overflow ยังไม่พิสูจน์ว่า hierarchy หรือ flow ใช้งานได้
- **หลักฐานเพิ่ม:** Haabiz Tasks วันที่ 12–15 มิถุนายนมีคำตัดสินต่างกันตาม surface: issue detail ใช้ compact editable controls row แต่ project detail ใช้ header-triggered drawer อย่ารวมเป็นกฎ “Properties มือถือต้องเป็น drawer”

### 6.15 Motion: ตรวจประสบการณ์ครบ และอย่าเปิด scope ใหม่เอง

- **พลาด:** animation ดูดีตอนเริ่ม แต่ content หายเมื่อ interrupt/scroll ย้อนกลับ, inline styles ค้าง หรือ reduced-motion/missing-image ไม่มี fallback; ได้คำว่า “ยังไม่ผ่าน” ในงาน motion แล้วไป redesign assets/composition
- **ต้องย้ำ:** แยก animation owner ตาม job และรักษา editable layer ที่ตกลงไว้ ไม่ใช้ feedback ต่อ motion เป็นสิทธิ์เปลี่ยนทั้งหน้า
- **ตรวจ:** initial/mid/settled, fast/back scroll, viewport-bottom reachability, mobile, reduced-motion และ cleanup; critical content ต้องยังเห็นหรือ fail safely
- **หลักฐานเพิ่ม:** DOVEL และ learning วันที่ 15 กรกฎาคมระบุ scope misunderstanding พร้อม motion QA states ส่วน Whisperfield เคยเลียนแบบ screenshot ด้วย static cards จนขาด resize-aware/runtime behavior ของ source

### 6.16 Debug ผิดชั้น: ปรับ token ไปเรื่อย ๆ แทนตรวจ binding/runtime

- **พลาด:** token เปลี่ยนแล้วภาพไม่เปลี่ยน จึงจูนค่าสีต่อ ทั้งที่ component ไม่ bind token; หรือถือว่า browser/tool paint sampling เป็น product bug ทั้งที่ compositor clock ค้าง
- **ต้องย้ำ:** ตั้ง hypothesis เดียวและ cheap counterexample ก่อนแก้ ตรวจ consumer binding, selector/state และ host/runtime ไม่เปลี่ยนระบบเพื่อชดเชยเครื่องมือตรวจที่ผิด
- **ตรวจ:** declaration เทียบ computed value, ring color binding ไม่ใช่เพียง ring width, exact node/state และ animation clock เมื่อ paint ดู stale
- **หลักฐานเพิ่ม:** learning วันที่ 2 มีนาคมเรื่อง ring binding และ Haabiz UI วันที่ 2 ตุลาคมเรื่อง SegmentedControl false positive เป็นคนละเหตุการณ์ที่ชี้ว่าการอ่านค่าบางจุดไม่พอ

### 6.17 UI data ต้องใช้ domain owner เดียวกัน

- **พลาด:** Avatar/initials ของคนเดียวกันต่างกันระหว่าง Tasks กับ People หรือหยิบข้อมูลใกล้มือ เช่น email-derived initials มาแทน display-name/profile contract
- **ต้องย้ำ:** consistency ไม่ได้มีแค่ CSS ข้อมูลที่ control แสดงต้องมาจาก canonical mapping เดียวกันด้วย ไม่สร้าง fallback owner ขนานในแต่ละ route
- **ตรวจ:** คน/entity เดียวกันข้าม sibling surfaces, empty/missing-profile fallback และ task mappers/callsites หลังแก้ profile owner
- **หลักฐานเพิ่ม:** Haabiz Tasks วันที่ 12 มิถุนายนบันทึกกรณี Tasks แสดง CO แต่ People แสดง MA จน avatar seed ต่างกัน หลักฐานนี้ยืนยันเหตุการณ์หนึ่ง ไม่ได้ยืนยันจำนวนครั้งที่พลาดซ้ำ

### 6.18 Interaction ต้องมีความหมาย ไม่ใช่ผ่านเฉพาะกลไก

- **พลาด:** comparison divider ลากได้และ ARIA เปลี่ยน แต่สองฝั่งแทบเป็นภาพเดียวกัน; demo/configuration แสดง controls ครบแต่ผู้ใช้มองไม่เห็นผลของตัวเลือก
- **ต้องย้ำ:** ระบุ observable outcome ของ interaction ก่อนเขียน กลไกต้องทำให้ความต่างหรือผลของ action อ่านออกจริง
- **ตรวจ:** หลายตำแหน่งของ divider/หลายค่าของ control กับ content/state ที่เปิดเผยผลชัดเจน ไม่ใช้ pointer/keyboard PASS แทน semantic outcome
- **หลักฐานเพิ่ม:** memory บันทึก Vessel comparison ที่ mechanics ผ่านแต่ perceptual delta ไม่ผ่าน และ Haabiz Create ที่บาง setting ยังเห็นผลเฉพาะ hero เป็น supporting cases คนละ surface ไม่ใช่ข้ออ้างว่า interaction ทุกประเภทเคยผิด

### 6.19 Lifecycle: มี action แรกแล้วต้องมีทางจัดการต่อ

- **พลาด:** มี Move to trash แต่ไม่มีทางเข้า Trash เพื่อดู/จัดการต่อ หรือสร้าง user-owned entity แล้ว lifecycle ขาดโดยไม่ได้ตกลงให้ immutable
- **ต้องย้ำ:** map Create/Read/Update/Delete-or-Archive/recovery ตามงานที่ผู้ใช้เป็นเจ้าของ อย่าใช้คำว่า MVP กลบ primary action ที่หาย
- **ตรวจ:** entry point หลัง mutation, empty/error/confirmation และ recovery/permanent deletion เฉพาะที่ contract กำหนด ไม่เพิ่ม hard delete ให้ audit records หรือ immutable catalog เอง
- **หลักฐานตรง:** Imagegen Studio วันที่ 14 กันยายน Mahiro ขอทั้ง Move to trash และทางเข้า Trash เพื่อลบจริง เป็น requirement ไม่ใช่หลักฐานว่าภายหลังยังทำไม่ครบ

### 6.20 Template/preset choices: ต้องมองออกว่ากำลังเลือกอะไร

- **พลาด:** template/style/gallery เหลือ text-only choices ไม่มีตัวอย่าง หรือ agent ย่อ taxonomy ของ source เหลือหมวดที่ตัวเองคิดขึ้น
- **ต้องย้ำ:** taxonomy, previews, metadata และ provenance ต้องตาม corpus owner; ตัวเลือกต้องช่วยตัดสินใจ ไม่ใช่แค่ส่ง value ไป API ได้
- **ตรวจ:** ผู้ใช้แยกความต่างของตัวเลือกได้ไหม มีหมวดและตัวอย่างตาม source จริงหรือไม่ และ preview อธิบายสิ่งที่จะเกิด ไม่สัญญาความสามารถที่ไม่มี
- **หลักฐานตรง:** Imagegen Studio วันที่ 15 กันยายน Mahiro ถามว่า user จะรู้ได้อย่างไรว่าเลือก template อะไรเมื่อมีแต่ตัวหนังสือ quote ไม่ระบุจำนวนหมวด จึงไม่เติมจำนวนหรือโครง source เอง

**หมายเหตุรอบค้นเพิ่ม:** หัวข้อ 6.14–6.20 มาจากการค้นนอกห้าเรื่องหลัก โดยแยก human decisions ที่เก็บใน project memory ออกจาก raw quotes ในท้ายเอกสาร ไม่ถือว่าการมีหนึ่ง learning note พิสูจน์ความถี่ของข้อผิดพลาดนั้น

## 7. ทำไมมี memory แล้วแต่ยังพลาด

ข้อวิเคราะห์จาก pattern ที่พบ ไม่ใช่การวินิจฉัยกลไกภายในโมเดล

1. **รู้กฎแต่ใช้ช้า:** อ่านบทเรียนตอน closeout แทนก่อนเลือก component/owner
2. **แก้จาก symptom:** patch element ที่เห็น ไม่ตาม owner ของ shell/recipe และ sibling consumers
3. **ใช้ proxy ผิด:** imports, tokens, class names และ test counts ถูกใช้แทน rendered outcome
4. **มองแยกชิ้น:** ตรวจ height หรือ border เดี่ยว ๆ ไม่ตรวจ row, field family และทั้งหน้า
5. **scope ไหล:** จาก paint กลายเป็น geometry จาก correction กลายเป็น redesign หรือ abstraction
6. **delegation ทำคำแก้ไขหาย:** ส่ง brief ใหม่ที่ตีความเอง แทน human decision และ accepted usage ตรง ๆ
7. **report เกินหลักฐาน:** narrow QA กลายเป็นคำว่าเสร็จทั้งระบบ ทั้งที่ consumer/state/mode ยังไม่ครบ

ดังนั้น ปัญหาไม่ได้แปลว่าคุณยังย้ำไม่ละเอียดพอ หลายเรื่องถูกบันทึกแล้ว สิ่งที่ขาดคือการนำกฎไปใช้ตอนตัดสินใจและการตรวจผลที่ตรงกับคำขอ

## 8. สิ่งที่ skill ควรทำ และสิ่งที่ไม่ควรทำ

### ข้อเสนอ: focused skill ด้าน frontend consistency

ควรมีเจ้าของงานแคบ ๆ: **component ownership, shared recipes, field-family parity, spacing relationships และ control geometry** ไม่เป็นผู้กำหนด visual taste ของทั้งเว็บ

- **ก่อนเขียน:** กู้ human decisions, เลือก canonical owner, inspect accepted usage และบอก scope ที่ไม่แก้
- **ระหว่างเขียน:** ใช้ primitive/recipe จริง แก้ shared owner เมื่อเป็น shared defect และคง local composition ที่มีเหตุผล
- **ก่อนส่ง:** เทียบ sibling controls, states และ consumers ที่ได้รับผล ตรวจหลักฐานจริง แล้วรายงานขอบเขต
- **เมื่อ owner ไม่ชัด:** หยุดที่ความขัดแย้งที่ระบุได้ ไม่สร้าง implementation ที่สามขึ้นมา

### ไม่ควรทำ

- รวม typography/color/motion/accessibility/brand/reference fidelity ทั้งหมดเป็น omnibus `frontend-design`
- เขียนกฎซ้ำกับ focused skills ที่มีแล้ว เช่น better-layout, better-ui และ better-accessibility
- บังคับทุก element เป็น shared component หรือทุก control สูงเท่ากันทุก context
- hard-code ค่า spacing/control height และ APIs ข้าม repo
- สร้าง scanner/test suite/หลาย reviewer ก่อนพิสูจน์ว่า pre-write gate ช่วยลดข้อผิดพลาดจริง
- กู้ skill/pilot ที่เคยถูกปฏิเสธเพียงเพราะครั้งนี้พูดคำว่า frontend อีกครั้ง

รายละเอียดเหตุการณ์ควรอยู่ reference แยก ส่วนคำสั่งหลักควรสั้นพอที่จะถูกใช้ก่อนลงมือ ไม่ใช่กลายเป็นรายงานยาวที่อ่านแล้วก็ยังเขียนตามความเคยชิน

## 9. Checklist ที่ Mahiro ไม่ควรต้องทวนเอง

Agent ควรตอบเองได้ก่อนเขียนหรือก่อนส่ง โดยไม่ต้อง dump checklist ทุกข้อให้ผู้ใช้

1. ใช้ component/recipe ใด ใครเป็น owner และ accepted usage อยู่ไหน?
2. มี duplicate อยู่แล้วหรือกำลังสร้างใหม่หรือไม่?
3. กำลังแก้ paint, geometry, behavior หรือ content? ส่วนไหนต้องคงเดิม?
4. sibling Input/Select/DatePicker/like-input ใช้ field shell และ states ตรงกันไหม?
5. control shells สูงเท่าไร top/bottom ตรงกันไหม และ exception มีเหตุผลอะไร?
6. label/item/section/nested gaps มี owner คนเดียวและอ่านเป็นกลุ่มได้ไหม?
7. trailing icons/metadata ชนหรือซ้ำกับ primitive ที่ inject มาไหม?
8. เปิด/เลือก/clear/reset/error แล้ว label, focus และ paint ยังถูกไหม?
9. shared fix กระจายถึง consumers จริงและ generated/export owners ที่เกี่ยวข้องไหม?
10. หลักฐานพิสูจน์อะไร ยังขาดอะไร และอะไรต้องให้ Mahiro ตัดสิน?

**ประโยคย้ำแบบสั้น หากต้องใช้ระหว่างที่ยังไม่มี skill:**

> ใช้ owner และ shared components ของ repo ก่อน อย่าสร้างสำเนา ตรวจ field-family paint, visible control height/y-alignment และ spacing ของทั้งกลุ่มจาก render จริง คงสิ่งที่ยอมรับแล้ว และอย่าเรียก technical PASS ว่า visual acceptance

## 10. หลักฐานย้อนหลังและข้อจำกัด

### คำทักตรงจาก transcript ที่ recall agent ค้นกลับมา

ส่วนนี้ได้รับหลัง draft แรกเสร็จ เป็นผลค้นแบบ read-only จาก recall agent ใน `local-conv-670` โดย agent รายงานว่าเทียบกับข้อความมนุษย์แล้ว Main ไม่ได้อ่าน raw transcript เต็มทุก conversation ซ้ำอีกครั้ง จึงคง conversation/message ID และข้อจำกัดไว้ ไม่ใช้เป็นหลักฐานว่างานทั้งโครงการยังมีบั๊กอยู่

#### Design system และ shared owners

- **22 ก.ค. 2026 · Peel · `local-conv-190` · `ui-msg-103203`**
  > ฝาก rewrite ทั้งหมดจุดไหนที่ใช้ shadcn ได้ใช้ให้หมด และทำ design system ให้ตรง ทำให้เหมือน jam นะตอนนี้ยังไม่ตรง

  ย้ำเรื่อง coverage ของทุก consumer ไม่ใช่ import บางจุดแล้วถือว่าทั้ง app เปลี่ยนแล้ว

- **17 ก.ย. 2026 · `local-conv-498` · `ui-msg-246327`**
  > โอเค ปัญหาตอนนี้ที่ฉันดูคร่าวๆ แล้ว หลักๆ เลยคือ ai ชอบหลุด design system เอามากๆ เลยแหะ 2 คุณไม่ได้ตรวจพวกนี้ให้ดีเลยแหะ

  ย้ำว่าการตรวจ adherence เป็นหน้าที่ agent ไม่ควรให้ Mahiro เป็นคนพบความผิดพลาดรอบแรก

- **29 ก.ย. 2026 · `local-conv-574` · `ui-msg-268613`**
  > ฝาก ลบ folder tests ด้วยแล้วก็ เหมือนคุณจะพยายาม inline และ custom ลงไปเยอะมากเลยนะ ทั้งๆ ที่เรามี variant และ design system วางไว้ครบแล้วอะ

  หลักฐานตรงของการ custom ทับ owner ที่มีพร้อมอยู่แล้ว ข้อความเรื่องลบ tests เป็นคำขอในเหตุการณ์นั้น ไม่ใช่กฎ frontend ทั่วไป

- **6 ต.ค. 2026 · Office Lunch · `local-conv-619` · `ui-msg-285988`**
  > ระวังเรื่องการเขียน custom หรืออะไรที่ซ้ำๆ กันแล้วไม่ทำเป็น shared ด้วยนะ

  ย้ำ shared ownership เมื่อเกิด repetition จริง ไม่ได้อนุญาตให้ abstract ทุกหน้าล่วงหน้า

#### Input-like paint และ behavior

- **27 พ.ค. 2026 · `local-conv-59` · `ui-msg-11021` / `ui-msg-11023`**
  > ปรับ datepicker ให้เป็น input หน่อยสิ ตัว trigger อะ

  หลักฐานตรงว่าบทบาทของ trigger ต้องอยู่ใน field family ไม่ใช่เพียงเลือก Button ที่ใช้ง่าย

- **27 พ.ค. 2026 · `local-conv-59` · `ui-msg-11038`**
  > ตัว datepicker เวลาเปิดมาจะต้องแสดง calendar ตาม default value ไม่ใช่ now สิ

  paint parity ต้องไม่กลบ value/open-state contract

#### Gap, spacing และ control anatomy ข้าม state

- **22 ก.ย. 2026 · `local-conv-524` · `ui-msg-252907`**
  > อันนี้ก็ gap และโดนตัดของ runtime

  ย้ำว่าต้องตรวจทั้ง spacing และ clipping ของ real consumer

- **23 ก.ย. 2026 · `local-conv-533` · `ui-msg-254371`**
  > ตรง section นี้ skeleton เราขาด gap ป่ะ

  ย้ำ loading-state rhythm ไม่ใช่ตรวจเฉพาะ loaded state

- **6 ต.ค. 2026 · Office Lunch · `local-conv-619` · `ui-msg-285988`**
  > ui dialog ของ 2 ตัวนี้ที่เจอคือ spacing และ gap หรืออื่นๆ ยังไม่ผ่านนะ โดยรวมฝากแก้ด้วย

  > จะเห็นว่า empty กับไม่ empty ต่างกันเกินไป หมายถึงเรื่องปุ่มอะนะ empty มันดูเหมือน segment แทนที่จะเป็นปุ่ม

  สองประเด็นในข้อความเดียวกัน: dialog composition ยังไม่ผ่าน และ action anatomy เปลี่ยนข้าม empty/populated state ไม่ควรนับเป็นสองครั้งที่ Mahiro ทัก

- **7 ต.ค. 2026 · Renseigames · `local-conv-643` · `ui-msg-2820`**
  > use better-ui ปรับตรงนี้หน่อย ฉันว่า gap น่าจะลดได้อีกนะ และหาที่ไว้ปุ่มตาใหม่หน่อย

  ยืนยันว่า “เพิ่ม gap” ไม่ใช่คำตอบสากล บาง surface ต้องลดระยะและจัด trailing affordance ใหม่

#### Skill ต้องเรียนวิธีตัดสินใจ ไม่คัดลอกข้อกำหนดของหน้าเดียว

- **3 ต.ค. 2026 · Haabiz UI · `local-conv-596` · `ui-msg-279387`**
  > `ใช้รูป Avatar ชุดเดิม, DatePicker ของเรา และ Search ชิดขวา` ไม่ได้เขียนแบบนี้จริงๆ ใช่ไหม มันเฉพาะไปไหมนะ

  อย่าเอา feature-specific placement/assets ไปทำเป็นกฎของทุกโปรเจกต์ ข้อความที่ถูก copy เข้า fork conversations ต้อง deduplicate ไม่ถือว่าเป็นคำเตือนใหม่

#### คำทักนอกห้าเรื่องหลักที่มีในผลค้นชุดแรก แต่ยังไม่ได้ใส่ใน draft แรก

- **19 ก.ค. 2026 · Whisperfield · `local-conv-170` · `ui-msg-92999`**
  > heading spacing ยังลบเยอะไปอยู่

  หลักฐานตรงของ negative tracking ใน headline ไม่ใช่ layout gap ของ container

- **15 ก.ย. 2026 · `local-conv-498` · `ui-msg-241441`**
  > ประเด็นคือ design system ของเรามา ai slop และมันไม่เป็นอันหนึ่งอันเดียวกัน … และปัญหาคือเราชอบใช้ border เกินไปด้วย

  excerpt นี้มีการตัดช่วงกลางตามผล recall ไม่ใช่ข้อความเต็ม ย้ำ composition/coherence และ border overuse ไม่ใช่แค่เลือกสี border ผิด

- **14 ก.ย. 2026 · `local-conv-498` · `ui-msg-241004`**
  > recheck option หน่อยอะไรที่เราทำไม่ได้หรือไม่มีอยู่จริงไม่ควรใส่มา

  option ที่ดูครบแต่ไม่มี capability จริงเป็นปัญหาของ product truth ไม่ใช่แค่ styling

**ข้อจำกัดเฉพาะ:** ผลค้นมีหลักฐานตรงแน่นเรื่อง design system, custom/shared, gap และ DatePicker trigger แต่ full Input–Select–DatePicker paint matrix และ technical height/y-alignment ในหัวข้อ 4–5 ยังอาศัย memory/บันทึกสรุป ไม่ได้ค้นพบ original quote ครบทุกเกณฑ์ ตัวอย่าง control-size เก่าบางข้อความมี imported timestamp จึงไม่นำวันที่ synthetic มาใช้สร้าง chronology

### รอบค้นเพิ่มนอกห้าเรื่องหลัก — original human messages

รอบนี้ recall agent ค้นได้ 12 ประเด็นจาก 11 human messages ที่ไม่ซ้ำกัน วันที่ตาม message metadata/user timestamp และไม่นับ fork copies ซ้ำ Main ใช้ผลค้นที่ส่งกลับมา ไม่ได้ re-read transcript เต็มทุก conversation เอง ทุกคำพูดด้านล่างเป็น excerpt ไม่ใช่ข้อความเต็มของ message

1. **ข้อมูลซ้ำ/ขนาด/whole-page composition · 6 ต.ค. 2026 · Office Lunch · `local-conv-619` · `ui-msg-283408`**
   > หน้านี้ ui ยังไม่ผ่านนะ 1 ซ้ำซ้อน 2 ใหญ่ไป อย่างที่บอก ข้อความเยอะไป ปรับรูปแบบให้ดูง่ายกว่านี้ได้ไหม

   รองรับหัวข้อ 6.5: แค่ย่อ copy ไม่พอเมื่อรูปแบบการนำเสนอยังผิด

2. **Focus และ state completeness · 5 ต.ค. 2026 · Office Lunch · `local-conv-619` · `ui-msg-283107`**
   > จริงๆ เก็บรายละเอียดก่อน focus inputยังไม่ได้แก้ และ checkbox ยัง native ไปไล่ดู style board ui มาให้ครบ

   ในข้อความเดียวกันยังทักภาพรวมหน้า detail ข้อความนี้ยืนยัน human-reported defect ไม่ใช่ DOM/computed diagnosis และไม่ได้สร้างกฎห้าม native controls ทุก repo

3. **Test activity ไม่พิสูจน์หน้าจริง · 14 ก.ย. 2026 · Imagegen Studio · `local-conv-498` · `ui-msg-240412`**
   > run test นานยัง แล้วก็ เหมือนยังไม่ผ่านนะ … ui เละ หมดเลย

   excerpt ตัดช่วงกลาง ยืนยัน human rejection ระหว่างการตรวจงาน แต่ยังไม่พิสูจน์ว่า assistant เคยประกาศ PASS ก่อนหน้า เพราะรอบนี้ไม่ได้ตรวจ leading context ครบ

4. **Agent Mode ต้องเปลี่ยน default anatomy · 21 ก.ย. 2026 · Imagegen Studio · `local-conv-498` · `ui-msg-250262`**
   > ฉันเห็นปุ่มเยอะแยะมากมายเลย แล้วไม่ใช่ว่าเป็น agent mode แล้วจะมีช่อง chat ช่องเดียวหรอ

   รองรับหัวข้อ 6.5: นำเสนอเป็น conversation ไม่ใช่ Studio toolbar บวก chat; ไม่ได้อนุญาตให้ลบ manual capability ทั้งหมด

5. **Template ต้องมีตัวอย่างช่วยเลือก · 15 ก.ย. 2026 · Imagegen Studio · `local-conv-498` · `ui-msg-242231`**
   > user จะรู้ได้ไงว่ามันคือ template อะไรที่เลือก ไม่มีตัวอย่างอะไรบอก มีแต่ตัวหนังสือ

   รองรับหัวข้อ 6.20 ข้อความเดียวกันเสนอให้มีหมวดและตัวเลือกภายใน แต่ไม่ได้ระบุ exact taxonomy/count

6. **Trash lifecycle · 14 ก.ย. 2026 · Imagegen Studio · `local-conv-498` · `ui-msg-241126`**
   > มี move to trash แล้วอย่าลืมให้กดเข้าไปดู trash แล้วเลือกลบจริงๆ ด้วยนะ

   รองรับหัวข้อ 6.19 ยืนยัน requirement ไม่ยืนยัน implementation/acceptance หลังจากนั้น

7. **Taste/DNA reference ไม่ใช่ exact clone · 14 ก.ย. 2026 · Imagegen Studio · `local-conv-498` · `ui-msg-241126`**
   > อยากให้ดู DNA ของตัวนี้เฉยๆนะ เรื่อง font icon rounder spacing หรืออื่นๆ ต่างๆ อะ แต่ปรับให้เรา dark ของเรา

   เป็นข้อความเดียวกับข้อ 6 คนละ requirement ไม่ใช่สองเหตุการณ์ เคสนี้มี dark boundary และเป็น visual-language evidence

8. **Exact source fidelity ต่างจาก DNA reference · 19 ก.ค. 2026 · Whisperfield · `local-conv-170` · `ui-msg-93180`**
   > ทั้งๆ ที่ให้ source ไปก็ยังออกมาไม่ตรง 5555 งงเลย

   > โจทย์มันยากไปหรอ กำลังสงสัย แค่ทำให้เหมือนของเขาแค่เปลี่ยน assets เองนะ

   ข้อความชี้ navbar ตอน scroll, glass, section/badge placement, auto-play และ logo การให้ source ไม่ได้แปลว่าความถูกต้องจำกัดอยู่ที่ static silhouette

9. **Mobile ต้องทบทวนรายละเอียด · 20 ก.ย. 2026 · Imagegen Studio · `local-conv-498` · `ui-msg-247455`**
   > ตอน responsive บน mobile อาจจะต้องปรับในส่วนของดีเทลด้วยนะลองปรึกษา astra ดู

   รองรับหัวข้อ 6.14 ส่วนที่ขอ Astra เป็น task-specific routing ณ เวลานั้น ไม่ใช่ current global permission

10. **Reload state ของ icon · 23 ก.ย. 2026 · project identity ยังไม่ยืนยัน · `local-conv-533` · `ui-msg-254365`**
    > อันนี้นิดนึง ตอน reload icon หายแหะ

    รองรับหัวข้อ 6.13 แต่ไม่ระบุ root cause ว่า hydration/font/SVG จึงไม่เดาสาเหตุจาก quote เดียว

11. **Locale-routing/macro owner · 9 ต.ค. 2026 · Flylofi · `local-conv-647` · `ui-msg-290524`**
    > ไปดู ที่ฉัน handle lang หรือ locale มา ฉันจะไม่ได้แยก page แบบนั้นนะ ใช้ [lang] ที่เดียวไปเลย

    > useLingui ของฉันใช้ macro ไหมนะ

    รองรับหัวข้อ 6.11: กู้ nearest implementation ก่อนเขียน `[lang]` เป็น Next.js owner ของงานนี้ ไม่ใช่ universal routing rule

12. **Lingui เป็น recurring convention · 9 ต.ค. 2026 · Flylofi · `local-conv-647` · `ui-msg-290553`**
    > จริงๆ ถ้าที่เราเคยทำงานร่วมกันมา ฉันเหมือนจะบอกเรื่องการใช้ lingui ไปหลายรอบแล้วป่ะ และหลายๆ โปรเจคเราก็ใช้ lingui

    นี่เป็นคำยืนยันความซ้ำจาก Mahiro แต่ไม่ทำให้ทราบจำนวนครั้งรวมจาก archive

**ช่องว่างที่ยังเหลือหลังรอบนี้:** ยังไม่มี quote ใหม่ที่ยืนยัน typography/contrast แยกจากหลักฐานเดิม, ARIA/keyboard/semantic nesting ยังเป็น learned rules มากกว่า original human quotes ที่ค้นได้ และไม่มีการนับความถี่ทั้ง archive คำว่า test activity กับ human rejection ไม่ถูกยกระดับเป็น proven false-PASS claim โดยไม่มี surrounding context

### บันทึกใน workspace ที่อ่านโดยตรง

- **24 ก.พ. 2026 — design-system geometry:** `.agent-state/memory/learnings/2026-02-24_design-system-token-alignment-with-locked-grid.md` — lock geometry และใช้ rendered examples ไม่ใช่รายการ token อย่างเดียว ค่า grid ในเหตุการณ์นั้นไม่ใช่ค่า default สำหรับ UI ใหม่
- **27 ก.พ. 2026 — token/primitive-first:** `.agent-state/memory/learnings/2026-02-27_token-first-skill-playbooks-reduce-rework.md` — primitive sizes/states ต้องตรวจก่อน route polish
- **28 ก.พ. 2026 — token ownership:** `.agent-state/memory/learnings/2026-02-28_semantic-first-brand-tokens-over-alias-layers.md` — ไม่เพิ่ม alias/variant ซ้ำโดยไม่มีความต้องการจริง การผูก brand กับ primary เป็นเงื่อนไขของระบบนั้น ไม่ใช่กฎทุก repo
- **2 มี.ค. 2026 — token/doc drift:** `.agent-state/memory/learnings/2026-03-02_token-doc-lockstep-prevents-design-system-drift.md` — source และเอกสารต้องตรงกัน ข้อความเรื่อง commit เป็นประวัติ ไม่ใช่สิทธิ์ commit รอบนี้
- **2 มี.ค. 2026 — focus ring binding:** `.agent-state/memory/learnings/2026-03-02_token-bound-focus-ring-pattern-prevents-false-ring-updates.md` — token เปลี่ยนไม่ใช่หลักฐานว่า consumer รับค่าจริง pattern/class ใน note เป็นตัวอย่างของระบบนั้น ไม่ใช่ recipe ให้ copy ทุก repo
- **6 มี.ค. 2026 — doctrine ก่อนเขียน:** `.agent-state/memory/learnings/2026-03-06_frontend-doctrine-natural-first.md` — สอนการตัดสินใจและ ownership มากกว่า pseudo-checker ชื่อ skill เก่าในบันทึกไม่ยืนยัน availability ปัจจุบัน
- **10 มี.ค. 2026 — local/shared boundary และ Lingui:** `.agent-state/memory/retrospectives/2026-03/10/19.49_console-employees-alignment-and-scope-discipline.md` — เคย refactor เกิน scope แล้วแก้กลับ; employee screen ที่ยังเล็กควรอยู่ route-local และ UI copy ใช้ Lingui โดยไม่แปล plain mock data บทเรียนนี้ช่วยกันการตีความ “ใช้ shared” เป็น “extract ทุกอย่าง”
- **12 มี.ค. 2026 — creative guidance ทับ fidelity:** `.agent-state/memory/learnings/2026-03-12_reference-first-ui-adaptation-requires-disabling-crea.md` — reference-led rewrite เคยถูก creative-first guidance พาไปผิดภาพ แม้ technical coherence ผ่าน การ disable config ในอดีตไม่ใช่คำสั่งเปลี่ยน config ปัจจุบัน
- **17 มี.ค. 2026 — reference กับ brand truth:** `.agent-state/memory/learnings/2026-03-17_reference-websites-are-mood-sources-not-brand-truth.md` — reference Stripe เคยพา vocabulary/CTA posture รั่วเข้า Blue Ledger ต้องระบุบทบาท source ก่อน synthesis ไม่ได้แปลว่าทุก reference ต้องเป็น mood-only
- **26 เม.ย. 2026 — structural validity ไม่ใช่ visual quality:** `.agent-state/memory/learnings/2026-04-26_visual-delta-over-layout-pass.md` — No layout problems ยังไม่ผ่าน reference composition; ตรวจ media ratio/fit และภาพจริง
- **15 ก.ค. 2026 — scope ของ QA:** `.agent-state/memory/learnings/2026-07-15_whole-product-review-and-typography-token-ownership.md` — targeted PASS ไม่เท่ากับ whole-product PASS และ logo font ต้องมี owner แยก
- **15 ก.ค. 2026 — motion scope/cleanup:** `.agent-state/memory/learnings/2026-07-15_motion-feedback-scope-and-animation-ownership.md` — feedback ใน motion lane ไม่เปิดสิทธิ์ redesign composition/assets เอง; ต้องตรวจ interrupted/settled/fallback states
- **18 ก.ค. 2026 — shared runtime:** `.agent-state/memory/learnings/2026-07-18_tilt-field-as-shared-gallery-contract.md` — promote accepted family เป็น shared contract โดยคง interaction job ของแต่ละ variant
- **11 ส.ค. 2026 — visual ownership ไม่ใช่ acceptance:** `.agent-state/memory/learnings/2026-08-11_visual-ownership-is-not-visual-proof.md` — image-channel grounding, designated owner, technical correctness และ Mahiro acceptance เป็นคนละหลักฐาน; model labels ใน note เป็นประวัติ ไม่ใช่ current routing

### Project memory ที่ใช้ประกอบ

ชื่อด้านล่างเป็น logical keys ใน MemFS ไม่ใช่ชื่อไฟล์ใน workspace นี้

- `haabiz-ui/overview.md` และ `haabiz-ui/recent-alignment-2026-10.md` — pre-write owner gate, control-size audit, exact component/state comparison และ capture false positives วันที่ 2–3 ตุลาคม
- `haabiz-ui/recent-create-2026-09.md` — shared item paint, field/runtime propagation, Light/Dark hierarchy และ acceptance boundaries
- `mahirocoko-ui/conventions.md` — shared package/component ownership, domain-first structure, recipes, icons และ authored theme values
- `eizypay/recent-web-ui-runtime.md` — shared dialogs, Combobox/Select popup parity, DatePickerRange, size-aware Button gaps และ app-owned assets
- `office-lunch/overview.md` — Base UI behavior ไม่ใช่ imitation, whole-composition rejection และ toolbar-size exception
- `haabiz/recent-task-responsive-filters.md` — mobile detail/filter/list/board anatomy, actual sidebar breakpoint, hierarchy และ avatar-data owner วันที่ 12–15 มิถุนายน
- `mahirocoko/recent-whisperfield.md` — typography tracking, resize-aware reference mechanisms และ mobile/reduced-motion contracts
- `mahirocoko/recent-dovel-commerce-lab.md` — logo-only font, whole-page motion/consumer coverage และ content visibility fallback
- `mahirocoko/recent-cove-one-2026-07.md` — human rejection ของ timid polish และ composition ที่ถูกทิศเดิมลากกลับ ไม่ใช่แค่สีหรือ system font
- `system/human/prefs/coding.md` — บทเรียนรวมเรื่อง spacing, field paint, control alignment, collisions, runtime states และ QA scope
- `system/human/prefs/workflow.md` — current writer/QA ownership และ human acceptance

Project memory เป็นบันทึกสรุปประสบการณ์ ไม่ใช่ raw transcript ทุกเหตุการณ์ รอบค้นประวัติไม่ได้ re-audit implementation ปัจจุบันของแต่ละ repo และไม่ได้ยืนยันว่าบั๊กเก่ายังมีอยู่ ส่วน Care มี source/rendered audit แยกในหัวข้อ 11–12

## 11. Care ล่าสุด: source audit ที่ไม่รอคำทักจาก Mahiro

### ขอบเขตและสถานะ

ตรวจวันที่ 10 ตุลาคม 2026 จาก working tree จริงของ Care: HEAD `ea1081f` บวก uncommitted horizontal-navigation/source-led presentation changes ไม่ใช่ native SwiftUI เก่าหรือภาพ rail/sidebar ที่ถูกแทนแล้ว

อ่าน root/web AGENTS, Product Brief, web implementation contract, Care shell, วันนี้/ทั้งหมด/หมวด/ย้อนหลัง, editor/receipts/data panel, canonical Input/Select/Textarea และ app CSS ตรวจ CSS ใน artifact `root-u5wtg_x1.css` เฉพาะกฎที่ต้องใช้ disconfirm hypothesis ไม่ได้รัน full test suite หรือแก้ไฟล์ Care

**สถานะตอนจบ source-only checkpoint ก่อน 20:14:** ไม่พบ listener ที่ 4173 และ pane `w9C:p5` ที่ docs บอกว่าเป็น preview ไม่มีใน live Herdr แล้ว จึงยังไม่ได้เปิด browser, สร้าง QA lane, เริ่ม server หรือใช้ข้อมูลจริงของ Mahiro ไม่มี pixel/console/physical-iPhone verdict ใน checkpoint นี้ หลัง Mahiro อนุญาตให้เปิด Space/Tab มี rendered follow-up ในหัวข้อ 12 ซึ่ง supersede เฉพาะ blocker เรื่อง server ไม่ใช่การยอมรับตัวผลิตภัณฑ์

การที่ docs/primitive ผ่านรอบก่อน ไม่ได้แปลว่าผลด้านล่างเป็นบั๊กใหม่ทุกข้อ และการมี uncommitted files ไม่ได้อนุญาตให้แก้หรือ rollback งานนั้น

### C1 — Data cards นับ spacing ซ้ำสองระบบ

- **ข้อเท็จจริงจาก source/compiled CSS:** `.care-row` เป็น flex column ที่มี `gap: .75rem` แต่ DataPanel สอง section ใช้ `care-row space-y-3` พร้อมกัน Tailwind ของ artifact นี้สร้าง `space-y-3` เป็น child margins ด้วย
- **ผลที่อนุมานได้:** ระหว่าง flex items จึงมีทั้ง gap และ margin บวกกัน ไม่ใช่เลือกอย่างใดอย่างหนึ่ง ที่ root scale ปกติ 16px กลายเป็นประมาณ 24px แทน 12px ขณะที่ receipt/timeline rows ใช้ gap อย่างเดียว
- **ยังไม่ยืนยัน:** ไม่ได้วัด screen จริงหรือถามว่าจังหวะที่เพิ่มขึ้นนี้ตั้งใจหรือไม่ จึงไม่เรียกทั้งหน้า visually rejected
- **สิ่งที่ควรป้องกัน:** ระบุ spacing owner ของ container และห้ามใส่ utility ที่สร้างระยะซ้ำโดยไม่ตั้งใจ ตัว class แต่ละตัวดูถูกได้ แต่ผลรวมผิด
- **Owner:** `web/src/features/data-panel.tsx`, `web/src/styles/care.css`; compiled `.space-y-3` ใน `web/build/client/assets/root-u5wtg_x1.css`

### C2 — Recurrence row มี label-to-field gap คนละชุด

- **ข้อเท็จจริง:** ช่อง “ทำซ้ำ” เป็น label paragraph ใน `space-y-2` แต่ช่อง “ทุก ๆ” เป็น BoardUI Input ที่ TextField ใช้ flex `gap-1` ทั้งสองอยู่ grid row เดียวกัน
- **ผลที่ต้องตรวจ:** เมื่อ label เป็นหนึ่งบรรทัดเท่ากัน baseline gap คือ 8px เทียบ 4px แม้ trigger/shell จะตั้งเป้า 44px เหมือนกัน ช่องก็เริ่มคนละ y ได้
- **สถานะ:** source-confirmed spacing mismatch; ความต่างของ top/bottom จริงยังต้อง DOM measurement เพราะ font/line-box/state มีผล
- **สิ่งที่ควรป้องกัน:** ตรวจทั้ง label box, label gap และ shell alignment ของ sibling controls ไม่ใช่ดู `min-h-11` แล้วเรียกว่าตรงกัน
- **Owner:** `web/src/features/item-editor.tsx`, `web/src/components/base/input/input.tsx`, `web/src/components/base/input/label.tsx`

### C3 — Field recipe ไม่เป็นหนึ่งชุด แม้ primitive provenance ถูก

- **ข้อเท็จจริง:** Input ใช้ shell ไม่มี visible 1px border/shadow และ focus เป็น inset ring; Select ใช้ 1px border + shadow-xs และ focus-visible ring + offset; native date ใช้ 1px border + shadow-xs แต่ focus เป็น outline ไม่ใช่ recipe เดียวกับทั้งสอง
- **cheap counterexample ที่แก้ข้อสรุปแรก:** Input เรียก tertiary-default ส่วน Select/date เรียก primary-default แต่ใน Dark theme ปัจจุบันทั้งสอง resolve เป็น neutral-800 เหมือนกัน **ชื่อ token ต่างจึงไม่พิสูจน์ background mismatch**
- **สถานะ:** recipe/state divergence ยืนยันได้จาก source แต่ Input/Select เป็น canonical BoardUI source ที่ไม่ถูก fork ไม่ควรเรียก upstream ว่าผิดหรือแก้ primitive เพื่อบังคับ parity เอง การเลือก field family ที่เหมาะกับ Care เป็น integration/visual decision ที่ต้องตรวจและให้ human ตัดสิน
- **สิ่งที่ควรป้องกัน:** แยก source ownership จาก parity ของ composed form การใช้ของจริงยังไม่รับประกันว่าคุม paint/state ของทั้ง family ได้
- **Owner:** `web/src/components/base/input/input.tsx`, `web/src/components/base/select/select.tsx`, `web/src/styles/care.css`, `web/src/styles/theme.css`

### C4 — Native date exception แชร์ default paint บางส่วน แต่ขาด state owner

- **ข้อเท็จจริง:** `.care-date` มี default + focus-visible เท่านั้น ไม่มี app-owned hover, disabled หรือ invalid paint ในขณะที่ Input/Select มี recipe ตาม state; date รับ HTML `disabled` แต่ไม่ได้รับ disabled surface recipe ร่วม
- **สถานะ:** source-confirmed coverage gap ของ app recipe ไม่ได้พิสูจน์ว่า browser native disabled ไม่มี visual treatment เลย
- **สิ่งที่ควรป้องกัน:** native exception ต้องระบุ owner ของทุก relevant state ไม่ใช่ copy default tokens แล้วบอกว่าสไตล์เดียวกันทั้ง family
- **Owner:** `web/src/styles/care.css`, `web/src/features/item-editor.tsx`

### C5 — Empty-state composition แสดงส่วนที่ไม่มีข้อมูลหลายชุด

- **ข้อเท็จจริง:** All Items map หกกลุ่มทุกครั้ง และ ItemList ให้ empty block ในทุกกลุ่ม แม้มีศูนย์รายการก็ได้หกหัวข้อ/หก empty blocks; Today เมื่อไม่มีข้อมูลแสดง onboarding แล้วตามด้วย due-today และ completed-today empty sections อีก
- **สถานะ:** anatomy ที่ซ้ำยืนยันจาก source ได้ แต่ระดับความรก/ขนาดที่ Mahiroเห็นยังเป็น visual/product verdict ไม่ใช่ข้อผิดพลาดเชิง syntax
- **สิ่งที่ควรป้องกัน:** ออกแบบ base-empty / populated-but-section-empty แยกกัน ตรวจทั้งหน้าจาก user job ไม่เรียกการมี empty component ครบว่า empty UX ดีแล้ว
- **Owner:** `web/src/routes/_care.items.tsx`, `web/src/routes/_care._index.tsx`, `web/src/features/item-list.tsx`

### C6 — Reload/update guard ไม่ครอบคลุม completion-note draft

- **ข้อเท็จจริง:** ปุ่ม “โหลดเวอร์ชันใหม่” disable เมื่อ `busy || !!editor` แต่ note editing อยู่ใน local state ของ CompletionReceipt ไม่เข้า guard นี้ การกด update เรียก `updateServiceWorker(true)`
- **failure sequence จาก source:** เปิดแก้ note → พิมพ์แต่ยังไม่ submit → update พร้อม → ปุ่มยัง enabled → reload อาจทิ้ง draft ที่มีเฉพาะใน React state ไม่มี persisted data ที่ถูกลบในข้อค้นพบนี้
- **สถานะ:** concrete source-level data-loss risk ยังไม่ได้ replay สอง-build update transaction จึงไม่อ้างว่า reproduce ผ่าน browser แล้ว
- **สิ่งที่ควรป้องกัน:** คำว่า “ไม่ reload ระหว่างแก้ไข” ต้อง map ทุก draft owner ไม่ใช่กันเฉพาะ main item editor; ตั้ง explicit preserve/discard contract สำหรับ route navigation ด้วย
- **Owner:** `web/src/features/care-shell.tsx`, `web/src/features/completion-receipt.tsx`

### C7 — Timeline แยก base-empty กับ no-result ไม่ได้

- **ข้อเท็จจริง:** Timeline ส่งเฉพาะ filtered events เข้า TimelineList; เมื่อว่างใช้ข้อความเดียว “ยังไม่มีประวัติที่ตรงกับที่เลือก” จึงไม่มีข้อมูลให้ consumer แยกว่าไม่เคยมีประวัติกับค้นแล้วไม่พบ
- **สถานะ:** information/state gap ยืนยันจาก API/source; native Timeline เคยมีสอง states ใน accepted memory แต่ต้องตรวจ current web acceptance contract ก่อนบังคับให้ anatomy เหมือน native ทุกจุด
- **สิ่งที่ควรป้องกัน:** empty component ต้องได้ context พอสำหรับข้อความและ recovery ที่ตรงกับสถานะ ไม่ใช้ one-empty-message กับทุกสาเหตุ
- **Owner:** `web/src/routes/_care.timeline.tsx`, `web/src/features/timeline-list.tsx`

### C8 — คำอ้างใน docs กว้างกว่า consumer coverage ที่เห็น

- **ข้อเท็จจริง:** current presentation note บอกว่า editor/Timeline/backup fields มี explicit names ทั้งหมด แต่ Timeline search Input ยังไม่มี `name`; Select ในหน้าเดียวกันมีชื่อแล้ว
- **สถานะ:** source/doc drift ที่ระบุได้ ไม่สรุปว่ามี console warning จริงจากช่องนี้ และไม่ถือว่า name เป็น accessibility label เพราะ Input มี label อยู่แล้ว
- **สิ่งที่ควรป้องกัน:** audit actual consumers ทุกตัวในขอบเขตคำว่า “all” พร้อมแยก named-field, accessible-name และ console evidence เป็นคนละข้อ
- **Owner:** `web/docs/implementation.md`, `web/src/routes/_care.timeline.tsx`

### สิ่งที่รอบ Care เพิ่มให้วิธีค้นบทเรียน

คำทักย้อนหลังบอกได้ว่ามีอะไรเคยพลาด แต่ไม่ครอบคลุมสิ่งที่ Mahiro ยังไม่ได้พูด รอบนี้เจอทั้ง **ระยะที่บวกกันสองชั้น, label gap ที่ทำ shell หลุดแนว, state coverage ของ native exception, empty anatomy, draft-owner coverage และเอกสารที่อ้างเกิน consumer** จาก implementation จริง

การทำ skill จึงต้องมีทั้ง historical corrections และ proactive source/consumer checks ไม่ให้รายการคำเตือนเดิมกลายเป็นขอบเขตสูงสุดของสิ่งที่ agent ตรวจ อย่างไรก็ตาม source audit ไม่แทน independent rendered QA หรือ Mahiro acceptance และไม่ใช่ permission ให้แก้ Care ในรอบนี้

## 12. Care rendered follow-up: หลักฐานที่ยืนยัน และคำอ้าง QA ที่ต้องจำกัด

### Execution และ independence

Mahiro อนุญาตให้เปิด Space/Tab และตรวจต่อเวลา 20:14 วันที่ 10 ตุลาคม เปิด Herdr Space Care `w9E` โดยคง focus เดิม; `w9E:t1/p1` เป็น Care Preview รัน `pnpm preview` ใน foreground ที่ 4173 ไม่สร้าง duplicate server

Fresh Agy/Gemini 3.8 Flash High session `e67bf704-d802-4397-ac54-ad72ad3c523b` ทำ browser QA ผ่าน isolated Chrome DevTools MCP ใน `w9E:t2/p2` รับ task ด้วย receipt-bound callback `care-ui-audit-20261010` และส่งรายงานกลับเวลา 20:26 ไม่ใช้ Main เป็น capture owner ไม่ใช้ browser/profile ของ Mahiro และสร้างเฉพาะ synthetic records ผ่าน UI

Main อ่านรายงาน เปิดดูภาพจริงครบ 8 ภาพ ตรวจ PNG headers และทวน source/compiled-CSS counterexamples ไม่ถือว่า report_ready หรือ agent DONE เป็น quality proof

### หลักฐานเพิ่มเติมจาก QA

- **C1 — double spacing:** QA วัด heading bottom 214px / paragraph top 238px ได้ **24px** ใน Data card เทียบ sibling section ปกติ **12px** สอดคล้องกับ flex gap + child margin ที่ Main ตรวจใน compiled CSS
- **C2 — label rhythm:** QA รายงาน Title/Interval gap **4px** และ Area/Date/Recurrence gap **8px** ภาพ editor รองรับการตรวจ title/select/date rhythm แต่ยังไม่ยืนยัน paired recurrence/interval alignment ตามข้อจำกัดด้านล่าง
- **C3 — rejected background hypothesis:** computed background ที่รายงานเหมือนกันคือ `oklch(0.269 0 none)` / neutral-800 ประกอบกับ Dark token definitions ที่ Main อ่าน ไม่เรียกชื่อ token ต่างกันว่า paint bug
- **C5 — empty anatomy:** Main เห็น Today onboarding + empty sections และ All Items หกกลุ่มว่างในภาพจริง ไม่ได้มีเพียง hypothetical JSX สิ่งที่ซ้ำมีจริง แต่การตัด/ซ่อนกลุ่มเป็น product decision ไม่ใช่ automatic fix authorization
- **C6 — note draft:** QA รายงาน runtime sequence ว่าเปิด note editor พิมพ์ draft แล้วกด dock ไป Timeline จะออกทันทีและทิ้ง draft โดยไม่มี prompt สอดคล้อง local-only state และการ unmount ที่ Main อ่าน แต่ไม่มี retained before/after state dump แยก จึงระบุว่าเป็น QA-reported reproduction ไม่ใช่ Main-run replay และ **ไม่ได้พิสูจน์ SW two-deployment update transaction**
- **C7 — Timeline:** ภาพ no-result แสดงข้อความ generic เดิมตาม source; QA รายงานว่า base-empty ใช้ข้อความเดียวกัน ต้องแยกข้อเท็จจริงนี้จากคำแนะนำว่าจะใช้ copy/CTA อะไรแทน
- **Technical positives:** QA รายงาน nested Escape/focus return ถูก, console errors/warnings/issues เป็นศูนย์ใน exercised load/interactions และ viewport 320 ไม่มี horizontal overflow Desktop 1440 เป็น horizontal tabs ไม่มี sidebar สิ่งเหล่านี้ไม่ใช่ whole-product หรือ physical-iPhone acceptance

### Main ไม่รับคำอ้าง QA เกินหลักฐาน

1. **ภาพ editor ไม่ตรง state ที่คำบรรยายอ้างครบ:** `04-editor-modal-390.png` เห็น “ครั้งเดียว” และไม่มีช่อง “ทุก ๆ” จึงใช้ภาพนี้พิสูจน์ interval row หรือคู่ shell top/bottom ไม่ได้ ไม่แปลง reported 4px/8px เป็น exact paired-y PASS
2. **ไม่มี `<label for>` ไม่เท่ากับไม่มี accessible name:** Select มี explicit `aria-label` อยู่แล้ว paragraph label อาจขาด clickable label association แต่ไม่ควรถูกประกาศเป็น unnamed-control defect เพียงเพราะใช้ `<p>`
3. **Name ไม่ใช่ label:** Timeline search/note textarea ที่ไม่มี form `name` ยังมี React Aria label bindings และรอบนี้ไม่มี reported console issue จึงคง C8 เป็น doc/consumer coverage drift ไม่ใช่ screen-reader failure
4. **Screen reader ยังไม่ถูกทดสอบ:** รายงานอ้างว่า screen readers associate ถูก แต่หลักฐานที่มีคือ DOM/accessibility bindings และ keyboard ไม่ได้ทดสอบ VoiceOver จริง ไม่ยกระดับเป็น screen-reader PASS
5. **Full-page capture กับ fixed dock:** ภาพ Items/Data ที่สูงกว่า viewport มี dock ทับ content ที่ตำแหน่ง viewport เดิม นี่อาจเป็น capture artifact ของ fixed positioning ไม่ใช่หลักฐานว่า runtime content เลื่อนอ่านไม่ได้ ห้ามเรียกว่า clipping bug จนกว่าจะตรวจ reachability จริง
6. **Coverage ไม่ครบทุกหน้า/state:** ไม่มีภาพ Areas/area detail, 1024, opened listbox, date disabled/invalid, note editing/before-after draft และ enlarged text ในชุด 8 ภาพ การเปิดดูภาพครบไม่ได้เติมช่องว่างเหล่านี้ให้เอง

### Retained report และ cleanup

Artifact owner ใน Care เป็น ignored `.agent-state/qa-runtime/frontend-audit-20261010/` มี `report.md`, callback summary และ 8 raw PNGs สำหรับประกอบการวิเคราะห์ครั้งนี้ ไม่ใช่ runtime assets หรือการเพิ่มรูปที่ Source Control root

ตรวจ headers จริง: Today/Editor/Populated/Timeline เป็น 1170×2532; Items 1170×3252; Data 1170×3222; Desktop 2880×1800; Narrow 640×1136 dimensions ตรงรายงาน แต่ dimensions อย่างเดียวไม่ยืนยัน state/coverage

SHA-256 ของ source/doc/package ที่เก็บก่อน QA จำนวน 54 ไฟล์ไม่เปลี่ยนหลังรับผลและ cleanup Main ตรวจ exact receipt/session ก่อน interrupt และปิดแท็บ QA `w9E:t2` พร้อมตรวจ process tree ที่เป็นลูกของ lane จำนวน 11 processes ไม่เหลือ alive ห้ามเชื่อแค่ about:blank ว่า browser/MCP/GPU ถูกปิดหมด

Care Preview ยังคงรันและตอบ HTTP 200 ใน Space Care `w9E:t1` ไม่แตะ native app, product source, installed configs, user data หรือ Git commits ขอบเขตจบที่ **audit/report** ไม่ใช่แก้บั๊กหรือ human visual acceptance

### บทเรียนเพิ่มสำหรับ skill

**“ใช้ design system ถูก” และ “QA ทำงานแล้ว” ยังไม่พอทั้งคู่:** primitive ownership ถูกแต่ composition นับระยะซ้ำได้; control height เท่ากันแต่ label gap ต่างได้; tester รายงานครบแต่ภาพอยู่คนละ state ได้ Skill ต้องบังคับตรวจ observable outcome และขอบเขตหลักฐาน ไม่เพิ่ม checklist จน technical proxies กลายเป็นคำว่าถูกทั้งระบบ

## 13. ทดลอง routing + pain probes ใน fresh Letta conversation

### สิ่งที่ปรับจริง

Mahiro อนุญาตให้รวม pain checklist, update installed skills ทั้งหมด และเปิด `letta --new` ทดลองกับ Care โดยรอบแรกเป็น read-only source review ไม่ใช่แก้ผลิตภัณฑ์

Canonical `mahiro-style` ใน `mahiro-skills` ปรับทางเข้าให้ recover goal/repo, ถามเฉพาะ material ambiguity, เลือก guidance เอง และคงหมวดย่อยเป็น optional shortcuts ไม่สร้าง skill ใหม่ ไม่เปลี่ยน membership/version หรือ release

Pain probes อยู่ตามเจ้าของเดิม:

- `patterns/shared-ui-boundaries.md`: primitive consumption, spacing ownership, label/shell geometry, field-family states, trailing collisions, icon/state และ reference anatomy
- `foundations/review-checklist.md`: whole-empty-page, meaningful control outcomes, limits/units, locale continuity, actual screenshot state และ scope ของ evidence claims
- `patterns/stores-state.md`: ทุก unsaved draft owner, lifetime, reload/navigation/restore และ smallest-owner posture ไม่บังคับ global store/dialog ใหม่

แต่ละ probe อธิบาย **พลาดอะไร → ทำไมหลุด → เช็กก่อนเขียน → cheap disconfirming check** และโหลดเฉพาะส่วนที่เกี่ยวข้อง ไม่แปลงตัวเลข Care เป็นกฎกลาง

### Validation / installed update

ใช้ installed Prettier format Markdown ที่แตะและเฉพาะ test ranges ตรวจ focused guards 33 tests ผ่าน, `tsc --noEmit` ผ่าน, `git diff --check` ผ่าน Formatter ทำให้ table padding เปลี่ยนและเปิดโปง assertion เดิมที่ยึด whitespace; ปรับ guard ให้ตรวจชื่อ evidence gate ผ่าน regex โดยไม่ลด semantic requirement แล้วรัน checks ใหม่

รัน receipt-scoped guided update สำหรับ global installs ของทั้ง 7 adapters: OpenCode, Claude Code, Cursor, Agy, Codex, Letta Code และ Pi Letta มี 25 recorded items; adapter อื่นมี 24 ไม่มี skipped/warnings และ doctor checks ไม่มี failures ตรวจ installed Letta hub/สาม pain owners ตรง canonical source หลัง format นี่คือ update ของ Mahiro package ตาม receipts ไม่ใช่การอัปเดต external skills หรือทุก local project root

### Live pilot / routing evidence

Herdr Space Care ใช้แท็บ `w9E:t3/p3` รัน `letta --new --agent <current-agent>` ได้ `local-conv-671` จริง visible model/effort เป็น GPT-6.1 Sol Medium ไม่สร้าง agent ใหม่ ไม่เปลี่ยน default model

Task prompt ระบุชื่อ skill และขอ review design-system/composition/state แต่ **ไม่ระบุหมวดย่อยหรือบั๊กเดิม** Transcript แสดง actual `Skill("mahiro-style")` invocation แล้ว lane เลือก review เป็นแกน + shared-UI/state owners เอง ประกาศ scope สั้น ๆ ไม่ส่ง lens menu หรือถาม scope ซ้ำ มี bounded source recovery หลัง output truncated ไม่ใช้ generated dump แทน source

รายงาน source-supported concerns ห้ากลุ่ม:

1. Inline note draft ไม่อยู่ใน shell update/navigation protection; generation guard ป้องกัน stale committed write ไม่ใช่ unsaved retention
2. Conditional recurrence มี label/shell spacing owners ต่างกัน และ Data cards มี gap + sibling margin สองกลไก ไม่อ้างค่าที่ไม่ได้วัด
3. Native date มี state recipe coverage ต่าง แต่หักล้าง default background mismatch จาก Dark tokens และไม่บังคับ upstream primitives ให้เหมือนกัน
4. First-use/empty subsection composition มี placeholders ซ้ำจริง แต่ไม่เรียกการซ่อนกลุ่มหรือเก้า Areas ว่า automatic fix
5. Interval UI ไม่เปิดเผย constraint 1–10000 ของ persistence owner: source ไม่มี min/max และ Save readiness ไม่ครอบคลุมช่วง ขณะที่ transaction validation ป้องกัน invalid persistence อยู่แล้ว Main อ่าน form, validator และ validate-before-write owner ยืนยันข้อเท็จจริงนี้ ไม่อ้างว่าได้ทดลอง Save หรือทำข้อมูลเสีย

Lane เก็บ positive counterexamples เช่น real primitive/variant consumption, focus recipe, single complete select chevron, URL filter state และ fail-closed persistence ไม่ใช้ checklist เพื่อหา bug ให้ครบทุกข้อ

### ขอบเขตและข้อจำกัดที่ห้ามกลบ

- **เป็น known-case recovery ไม่ใช่ blind comparison:** ใช้ main agent เดิมใน conversation ใหม่ จึงแชร์ MemFS และ prompt สั่งให้เรียก skill โดยตรง พิสูจน์ routing หลังเรียก ไม่ใช่ spontaneous skill discovery
- Lane เปิด current implementation owner และพบ embedded historical no-sidebar QA summary โดยไม่ได้ตั้งใจ มี disclosure ใน report ไม่ถือว่า isolated จากประวัติอย่างสมบูรณ์ และไม่ได้ใช้ค่าจาก summary นั้นเป็น runtime proof
- **Source-only:** ไม่เปิด browser, ไม่วัด pixels/console, ไม่ทดสอบ VoiceOver/Safari/PWA, ไม่รัน product tests/build ไม่ใช่ general skill effectiveness หรือ proof ว่าผู้เขียนจะไม่พลาดในงานถัดไป
- ทดลองเฉพาะ clear goal ที่มี target/scope แล้ว ยังไม่ได้ทดสอบการถามเมื่อคำขอคลุมเครือ
- Callback mode ถูกปฏิเสธก่อน dispatch เพราะ Herdr ไม่มี authoritative Letta agent session ใช้ documented watcher fallback ในแท็บเดิม ไม่แก้ integration เพื่อให้ผ่าน
- Watcher ได้ actual `done` และเก็บ result แล้ว แต่ main notification wrapper ใช้ zsh read-only variable `status` จึง exit 1 หลัง wait ไม่ rerun pilot เพื่อแก้สถานะข้อความ

### Main audit / current stopping point

Main collect exact watcher job `care-style-pilot-20261010`, ตรวจ actual invocation จาก terminal output, ตรวจ SHA-256 ของ guidance ทั้งสี่ตามที่ report อ้างตรง installed files และทวน source counterexamples ไม่ถือ lifecycle done เป็น acceptance

Hash ของ Care source/doc/package baseline 54 ไฟล์ยังเหมือนเดิม ปิด exact pilot tab และตรวจ process ownership ไม่แตะ Care Preview หรือ unrelated sessions รายงานอยู่ใน ignored Care `.agent-state/qa-runtime/mahiro-style-pilot-20261010/report.md` ส่วน task T91 ใน mahiro-skills เป็น execution owner และรอ Mahiro review ไม่ commit/release หรือแก้ Care ในรอบนี้

**สรุปที่หลักฐานรองรับ:** ทางเข้าใหม่พาคำขอที่ชัดไปยัง pain probes และ source findings ที่มี owner/counterexamples ได้จริง โดยไม่ต้องจำ subcommand การพิสูจน์ ambiguous-goal clarification, pre-write prevention และผลในโปรเจกต์ใหม่ยังไม่เกิดขึ้น
