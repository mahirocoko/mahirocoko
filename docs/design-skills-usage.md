# คู่มือใช้งาน Design Skills

เอกสารนี้สรุปวิธีใช้ skill กลุ่มออกแบบแบบใช้งานจริง โดยเน้นให้ skill พก reference และ resource ของตัวเอง ไม่ผูกกับ path เฉพาะของ repo ใด repo หนึ่ง

หลักคิดร่วมกัน:

```txt
script = scaffolding
docs = judgment
agent = synthesis
```

## บทบาทของแต่ละ skill

### `frontend-design`

ใช้เมื่อเริ่มจาก brief, prompt stack, handoff, หรือ reference แล้วต้องสรุปทิศทาง frontend ให้ชัดก่อนลงมือทำ

เหมาะกับ:

- วาง page job และ information architecture
- เลือก section สำคัญและลำดับการเล่าเรื่อง
- แยก reference anatomy ออกจาก aesthetic leakage
- สร้าง design brief ก่อนส่งต่อให้ implementation หรือ asset workflow

### `uncodixify`

ใช้เป็น taste filter หลังมี brief แล้ว เพื่อกัน UI หลุดเป็นงาน AI สำเร็จรูปหรือ pattern ที่ใส่มาเพราะง่าย ไม่ใช่เพราะตอบโจทย์

ใช้เมื่อเริ่มเห็น:

- card, pill, glow, glass, gradient, metric grid มากเกินเหตุ
- layout ดูเหมือน template มากกว่างาน product จริง
- reference มีบางส่วนควรเก็บ แต่บางส่วนควรถูกตัดหรือ normalize
- visual flourish ไม่ช่วย hierarchy, grouping, affordance, accessibility, หรือ brand clarity

### `asset-designer`

ใช้เมื่อโจทย์ต้องคิดเป็นชุด asset ไม่ใช่ภาพเดี่ยว

เหมาะกับ:

- asset manifest
- transparent cutout
- layer split เช่น subject, shadow, background
- crop variants สำหรับ responsive UI
- QA ว่าภาพใช้ได้บนพื้นหลังจริงและ container จริง

### `web-asset-prompts`

ใช้เมื่อรู้แล้วว่าต้องการภาพแบบไหน และต้องเขียน prompt รายภาพให้พร้อมใช้กับงานเว็บ

ควรระบุให้ครบ:

- บทบาทของภาพ เช่น hero image, overlay-safe background, product cutout
- ratio และ canvas
- format ที่ต้องการ
- crop safety และ padding
- ข้อห้าม เช่น ไม่มี text, logo, watermark, label ปลอม, ขอบถูกตัด

## Workflow ที่แนะนำ

ค่าเริ่มต้นสำหรับงานออกแบบหน้าเว็บ:

```txt
frontend-design brief
  -> uncodixify
  -> asset-designer เมื่อเริ่มเห็นว่าต้องมี asset pack หรือ media plan
  -> web-asset-prompts สำหรับ prompt รายภาพ
```

เหตุผลคือควรเริ่มจากเจตนาและโครงหน้าก่อน แล้วค่อยคุมรสนิยม จากนั้นจึงวางแผน asset และเขียน prompt รายชิ้น

## ตัวอย่างการเลือกใช้

### หน้า landing page ใหม่

ใช้:

```txt
frontend-design -> uncodixify
```

ผลลัพธ์ที่ควรได้:

- หน้าเว็บต้องทำหน้าที่อะไร
- section ไหนสำคัญ
- visual system ควรไปทางไหน
- อะไรคือ AI-default ที่ต้องตัดออก

### หน้า landing page ที่ต้องมีภาพประกอบ

ใช้:

```txt
frontend-design -> uncodixify -> asset-designer -> web-asset-prompts
```

ผลลัพธ์ที่ควรได้:

- brief ของหน้า
- guardrails ด้านรสนิยม
- manifest รายการ asset
- prompt รายภาพสำหรับ asset สำคัญ

### งานตัดภาพสินค้า หรือ ingredient สำหรับเว็บ

ใช้:

```txt
asset-designer -> web-asset-prompts
```

ผลลัพธ์ที่ควรได้:

- แผน cutout และ layer split
- ไฟล์ที่ควรส่งมอบ เช่น subject, shadow, preview
- prompt สำหรับสร้างมุมภาพใหม่หรือ source ภาพที่ตัดง่าย

### มี reference สวย แต่กลัวลอก aesthetic มาเยอะเกินไป

ใช้:

```txt
frontend-design brief -> uncodixify
```

ให้เก็บเฉพาะ anatomy เช่น section job, typography role, media role, motion purpose และ responsive constraints ส่วน liquid glass, pill nav, cinematic dark SaaS, hover scale, glow หรือ gradient ที่ไม่จำเป็น ให้ถือเป็นความเสี่ยงก่อนเสมอ

## Anti-patterns

หลีกเลี่ยงสิ่งเหล่านี้:

1. ข้าม brief แล้วไปเขียน prompt ภาพทันที
   - มักทำให้ภาพสวยแต่ไม่สอดคล้องกับหน้าเว็บจริง

2. ใช้ `uncodixify` เพื่อลบ intent ของ brief
   - หน้าที่ของมันคือกัน UI หลุด ไม่ใช่ลบความตั้งใจของ brand หรือ product

3. ให้ `asset-designer` เป็น prompt writer หลักของภาพเดี่ยว
   - `asset-designer` ควรวางแผน asset และ QA ส่วน `web-asset-prompts` ควรเขียน prompt รายภาพ

4. ผูก workflow กับ path เฉพาะของ repo
   - ถ้าจะให้ skill portable ต้องยึดบทบาท, resource, และ reference ที่อยู่กับ skill หรือ input ที่ผู้ใช้ส่งมา

5. ทำภาพสวยแต่ใช้จริงไม่ได้
   - สำหรับเว็บ ภาพต้อง crop-safe, overlay-safe, ไม่มี watermark ปลอม, ไม่มี text ปลอม, และไม่ถูกตัดขอบ

## Checklist ก่อนส่งงาน

- มี brief หรือ design intent ชัดเจนแล้วหรือยัง
- UI ผ่าน `uncodixify` เพื่อกรอง AI-default แล้วหรือยัง
- ถ้ามี media หลายชิ้น มี asset manifest แล้วหรือยัง
- prompt รายภาพระบุ role, ratio, format, crop safety, และข้อห้ามครบหรือยัง
- reference ที่ใช้ถูกแยกเป็น anatomy, asset requirement, หรือ style leakage แล้วหรือยัง

## สรุป

- เริ่มจาก `frontend-design` เพื่อสร้าง brief ที่ชัด
- ใช้ `uncodixify` เพื่อคุมรสนิยมและตัด AI-default
- ใช้ `asset-designer` เมื่อโจทย์เป็นชุด asset หรือมีงาน cutout/layer/manifest
- ใช้ `web-asset-prompts` เมื่อจะเขียน prompt รายภาพให้ production-ready
