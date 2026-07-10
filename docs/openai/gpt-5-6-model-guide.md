# คู่มือเลือกใช้ GPT-5.6 Sol, Terra และ Luna

เอกสารนี้สรุปประกาศ GPT-5.6 ของ OpenAI วันที่ 9 กรกฎาคม 2026 แล้วแปลงข้อมูลจากหน้าเปิดตัวให้เป็นแนวทางเลือกโมเดลสำหรับ ChatGPT Work, Codex และ OpenAI API

แหล่งข้อมูลหลักคือ [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) ข้อมูลสิทธิ์ใช้งาน ราคา และชื่อผลิตภัณฑ์ในเอกสารนี้อาจเปลี่ยนตามการ rollout จึงควรเช็กหน้า OpenAI อีกครั้งก่อนนำไปกำหนดนโยบายระยะยาว

## มอง GPT-5.6 ให้ออกเป็นสองแกน

ชื่อที่ปรากฏในหน้าเปิดตัวแบ่งออกเป็นสองเรื่อง อย่าเอามาปนกัน

1. **Model tier** บอกระดับความสามารถ ราคา และความเร็ว ได้แก่ Sol, Terra และ Luna
2. **Reasoning effort** บอกว่าต้องการให้โมเดลใช้เวลาและ compute กับงานนั้นมากแค่ไหน เช่น medium, high, xhigh และ max

`ultra` ต่างออกไปอีกขั้น เพราะเป็นโหมดที่ประสานหลาย agents ให้ทำงานขนานกัน ไม่ใช่ model tier ตัวที่สี่

OpenAI อธิบายว่าเลข `5.6` หมายถึง generation ส่วน Sol, Terra และ Luna เป็น capability tiers แบบถาวร แต่ละ tier จึงอาจพัฒนาด้วย cadence ของตัวเองในอนาคต

## เปรียบเทียบแต่ละโมเดล

| โมเดล | ตำแหน่ง | ราคา API ต่อ 1M input tokens | ราคา API ต่อ 1M output tokens | เหมาะกับ |
| --- | --- | ---: | ---: | --- |
| GPT-5.6 Sol | Flagship คุณภาพสูงสุดของตระกูล | $5 | $30 | งานยาก งานที่ต้องตัดสินใจหลายขั้น และงานสุดท้ายที่ผิดพลาดแล้วมีต้นทุนสูง |
| GPT-5.6 Terra | สมดุลคุณภาพ ราคา และความเร็ว | $2.50 | $15 | งานประจำวัน Coding, research, knowledge work และ agent workflows ทั่วไป |
| GPT-5.6 Luna | เร็วและประหยัดที่สุด | $1 | $6 | งานปริมาณมาก งานที่รูปแบบชัด และงาน interactive ที่ต้องตอบเร็ว |

ราคา output สูงกว่า input หกเท่าเท่ากันทั้งสาม tier ถ้าระบบสร้างคำตอบยาว ต้นทุนส่วนใหญ่จึงมักอยู่ที่ output tokens การจำกัดรูปแบบและความยาวคำตอบให้ตรงงานช่วยประหยัดได้มากกว่าการย่อ prompt เพียงเล็กน้อย

### GPT-5.6 Sol

ใช้ Sol เมื่อคุณภาพของคำตอบสำคัญกว่าต้นทุนต่อ request เช่น

- แก้บั๊กซับซ้อนหรือทำ refactor ข้ามหลายระบบ
- ออกแบบ architecture และเปรียบเทียบ trade-offs
- วิจัยหลายแหล่งแล้วสร้างข้อสรุปพร้อมหลักฐาน
- ใช้ browser หรือ computer use ในงานหลายขั้น
- สร้าง presentation, document หรือ spreadsheet ที่พร้อมส่งต่อ
- ทำ frontend และ design ที่ต้องตรวจผลลัพธ์หลัง render
- ตรวจ secure code, threat model และงาน cybersecurity เชิงรับ

Sol เหมาะกับขั้นวิเคราะห์และขั้นตรวจงานสุดท้าย แต่ไม่จำเป็นสำหรับการจัดหมวดหมู่ข้อมูลหรือแก้ข้อความสั้น ๆ เพราะราคา input และ output สูงกว่า Luna ห้าเท่า

### GPT-5.6 Terra

Terra เป็นจุดเริ่มต้นที่เหมาะกับงานส่วนใหญ่ OpenAI วางตำแหน่งไว้เป็นโมเดลราคาต่ำกว่าที่มีประสิทธิภาพแข่งขันกับ GPT-5.5

ใช้ Terra กับงานลักษณะนี้

- เขียนโค้ด แก้ issue และ review code ทั่วไป
- วิเคราะห์เอกสารหรือข้อมูลธุรกิจ
- สร้าง content และ artifact ที่ยังมีคนตรวจขั้นสุดท้าย
- เรียก tools หลายครั้งใน agent workflow
- ถามตอบจากเอกสารหรือระบบ retrieval
- งาน production ที่ต้องรักษาสมดุลระหว่างคุณภาพกับค่าใช้จ่าย

แนวทางที่คุมต้นทุนง่ายคือเริ่มจาก Terra แล้วเลื่อนไป Sol เฉพาะ request ที่ไม่ผ่านเกณฑ์คุณภาพ หรือจัดเส้นทางตามความเสี่ยงของงานตั้งแต่ต้น

### GPT-5.6 Luna

Luna เหมาะกับงานที่โจทย์แคบ ตรวจผลได้ง่าย และต้องทำซ้ำจำนวนมาก

- Classification, extraction และ tagging
- สรุปข้อความจำนวนมาก
- Rewrite, translate และจัดรูปแบบ
- ตอบคำถามตรงไปตรงมา
- สร้าง boilerplate code หรือแก้ไขจุดเล็ก
- เป็น subagent สำหรับงานย่อยที่แยกจากกันได้
- งาน interactive ที่ latency กระทบประสบการณ์ของผู้ใช้

Luna ยังทำ knowledge work ได้ดี หน้าเปิดตัวระบุว่าประสิทธิภาพเข้าใกล้จุดสูงสุดของ GPT-5.5 ในบางงานด้วยต้นทุนต่ำกว่าครึ่ง แต่ถ้าเป็นงานปลายเปิดหรือความเสียหายจากคำตอบผิดสูง ควรให้ Terra หรือ Sol ตรวจซ้ำ

## เลือก reasoning effort อย่างไร

Model tier ตอบคำถามว่า “ใช้สมองระดับไหน” ส่วน effort ตอบว่า “ให้สมองนั้นใช้เวลากับโจทย์นี้เท่าไร”

| ระดับ | ใช้เมื่อ | ไม่ควรใช้เมื่อ |
| --- | --- | --- |
| medium | งานประจำวันและโจทย์ที่มีบริบทพอ | งานง่ายที่ตอบตรง ๆ ได้ หรือโจทย์ยากที่ต้องตรวจหลายรอบ |
| high | ต้องวิเคราะห์ trade-offs หรือใช้ tools หลายขั้น | latency สำคัญกว่าคุณภาพส่วนเพิ่ม |
| xhigh | งานซับซ้อนที่คุ้มกับเวลาคิดเพิ่ม | request ปริมาณสูงที่ไม่มี eval รองรับ |
| max | ต้องสำรวจทางเลือก ตรวจผล และแก้คำตอบหลายรอบ | งาน routine หรือผลลัพธ์ตรวจได้ด้วยกฎง่าย ๆ |
| ultra | งานแบ่งเป็นหลาย workstreams แล้วทำขนานกันได้ | งานสั้น งานเป็นเส้นตรง หรือทุกขั้นต้องรอผลจากขั้นก่อน |

OpenAI ระบุว่า `max` ให้เวลาคิดมากกว่า `xhigh` ส่วน `ultra` ใช้ agents สี่ตัวโดยปริยายแล้วรวมผลงานกลับมา การเพิ่ม agents แลกกับ token ที่สูงขึ้น แต่ลดเวลารอได้ถ้างานมีส่วนที่ทำขนานกันจริง

ตัวอย่างงานที่เหมาะกับ `ultra`

- สำรวจ codebase หลาย subsystems
- วิจัยตลาดหลายประเทศหรือหลายกลุ่มคู่แข่ง
- แบ่ง migration เป็น frontend, backend, tests และ documentation
- ตรวจ correctness, security, performance และ accessibility พร้อมกัน

ถ้าโจทย์แบ่งงานไม่ได้ เปิด `max` บน agent เดียวมักตรงกว่า เพราะ multi-agent เพิ่มต้นทุนการประสานงานโดยไม่ช่วยเรื่อง critical path

## สูตรเลือกโมเดลแบบเร็ว

เริ่มจากคำถามสามข้อ

1. **คำตอบผิดแล้วเสียหายมากไหม** ถ้ามาก ให้เริ่มที่ Sol หรือเพิ่มขั้น review ด้วย Sol
2. **งานนี้ทำซ้ำเยอะไหม** ถ้าเยอะ ให้เริ่มที่ Luna หรือ Terra แล้วใช้ eval วัดคุณภาพ
3. **โจทย์แบ่งทำขนานได้ไหม** ถ้าได้และงานใหญ่พอ ค่อยพิจารณา `ultra`

ค่าตั้งต้นที่ใช้ได้กับหลายระบบ

- **Luna** สำหรับงาน routine ที่มี schema หรือกฎตรวจชัด
- **Terra + medium/high** เป็น default สำหรับงานทั่วไป
- **Sol + high/max** สำหรับงานซับซ้อนหรือขั้น final review
- **Sol + ultra** สำหรับงานใหญ่ที่แยก workstreams ได้จริง

อย่าตัดสินจากชื่อ tier อย่างเดียว ควรสร้าง eval จากข้อมูลจริง แล้ววัด accuracy, latency, token usage และค่าใช้จ่ายต่อผลลัพธ์ที่ผ่านเกณฑ์

## วิธีเขียน prompt ให้เข้ากับแต่ละ tier

### Prompt สำหรับ Luna

ให้โจทย์แคบ ระบุ schema และหลีกเลี่ยงการขอให้สำรวจแบบปลายเปิด

```text
ดึงข้อมูลจากข้อความด้านล่าง

คืนค่าเป็น JSON ตาม schema นี้เท่านั้น:
{
  "company": "string | null",
  "invoice_date": "YYYY-MM-DD | null",
  "total": "number | null"
}

ห้ามเดาค่าที่ไม่มีในต้นฉบับ ให้ใช้ null
```

### Prompt สำหรับ Terra

บอกผลลัพธ์ที่ต้องการ บริบท ขอบเขต และเกณฑ์ตรวจรับให้ครบ

```text
แก้ issue นี้โดยรักษา public API เดิม

ขอบเขต:
- ตรวจ implementation และ tests ที่เกี่ยวข้อง
- แก้ root cause โดยไม่ refactor ส่วนที่ไม่เกี่ยว
- เพิ่ม regression test

ถือว่างานเสร็จเมื่อ:
- test ที่เพิ่มมาล้มกับโค้ดเดิม
- test ทั้งหมดผ่านหลังแก้
- สรุปไฟล์ที่เปลี่ยนและเหตุผลได้
```

### Prompt สำหรับ Sol หรือ max

กำหนดเป้าหมาย แหล่งข้อมูล เกณฑ์ตัดสิน และวิธีตรวจผล แต่ไม่ต้องบังคับ reasoning ทีละบรรทัด

```text
วิเคราะห์ root cause จาก source code, logs และ tests ที่ให้มา

เปรียบเทียบทางแก้อย่างน้อยสองแบบตามเกณฑ์ต่อไปนี้:
- ความเสี่ยงต่อ behavior เดิม
- ความซับซ้อนในการดูแล
- ประสิทธิภาพ

เลือกวิธีที่กระทบน้อยที่สุด แล้ว implement พร้อมรัน verification ที่เกี่ยวข้อง
ถ้าหลักฐานยังไม่พอ ให้ระบุสิ่งที่ยืนยันได้และสิ่งที่ยังเป็นสมมติฐาน
```

### Prompt สำหรับ ultra

แยก workstreams ให้ชัด พร้อมระบุวิธีรวมผลและกติกาแก้ข้อขัดแย้ง

```text
ตรวจระบบนี้แบบขนานเป็นสี่ workstreams:
1. architecture และ data flow
2. security และ permissions
3. performance และ resource usage
4. tests และ failure recovery

แต่ละ workstream ต้องแนบหลักฐานจากไฟล์หรือผลทดสอบ
จากนั้นรวมเป็นแผนเดียว จัดลำดับตามความเสี่ยงและ dependency
ถ้าข้อเสนอขัดกัน ให้เลือกแนวทางที่รักษา behavior เดิมและลด blast radius ก่อน
```

## จุดเด่นที่ OpenAI เน้นในหน้าเปิดตัว

GPT-5.6 ไม่ได้ปรับแค่การตอบข้อความ แต่เน้น workflow ที่โมเดลต้องลงมือทำงานต่อเนื่อง

- Coding agent และ terminal workflows ระยะยาว
- Browser, tool use และ computer use
- Design judgment รวมถึงการดูผลหลัง render แล้วปรับงานต่อ
- Presentation, document และ spreadsheet ที่แก้ไขต่อได้
- Knowledge work จากบริบทใน Slack, Notion, Microsoft 365 และ Google Drive
- Long-context reasoning
- Cybersecurity เชิงรับและ scientific research

ใน Responses API มี [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) สำหรับให้โมเดลเขียนโปรแกรมขนาดเล็กใน memory เพื่อประสาน tools กรอง intermediate data และส่งกลับเข้าโมเดลเฉพาะส่วนที่จำเป็น ทำให้ลด tokens, ลด model round trips และลดงาน orchestration ที่ developer ต้องเขียนเอง หน้าเปิดตัวยังระบุว่าแนวทางนี้รองรับ Zero Data Retention และกล่าวถึง multi-agent beta ที่ให้โมเดลเรียก subagents พร้อมกันแล้วสังเคราะห์ผลงานใน request เดียว

ควรแยกให้ชัดว่า `ultra` เป็น experience/effort mode ใน ChatGPT Work และ Codex ตามที่หน้าเปิดตัวอธิบาย ส่วนใน API หลักฐานในหน้านี้พูดถึง multi-agent beta สำหรับสร้าง workflow ลักษณะคล้ายกัน ไม่ได้ระบุว่า API มี parameter ชื่อ `ultra` โดยตรง

## สิทธิ์ใช้งานตามที่ประกาศ

ข้อมูล ณ วันที่ 9 กรกฎาคม 2026

- **Chat** — Plus, Pro, Business และ Enterprise ใช้ GPT-5.6 Sol ผ่าน medium effort ขึ้นไป ส่วน Pro และ Enterprise เลือก GPT-5.6 Sol Pro สำหรับงานซับซ้อนที่ต้องการคุณภาพสูงสุดได้
- **ChatGPT Work และ Codex** — Free และ Go ใช้ Terra ส่วน Plus, Pro, Business และ Enterprise เลือก Sol, Terra หรือ Luna พร้อมกำหนด effort ได้
- **max** — ผู้ที่เข้าถึง GPT-5.6 ใน ChatGPT Work และ Codex เปิดใช้ได้จาก settings
- **ultra** — ChatGPT Work เปิดให้ Pro และ Enterprise ส่วน Codex เปิดให้ Plus ขึ้นไป
- **API** — หน้าเปิดตัวระบุว่า developers เข้าถึงทั้ง Sol, Terra และ Luna ผ่าน OpenAI API

หน้าเปิดตัวไม่ได้ระบุ API model ID หรือ snapshot slug ที่ต้องส่งใน request อย่างชัดเจน และไม่ได้ระบุว่า GPT-5.6 Sol Pro เป็น API model แยกจาก Sol อย่าเดาชื่อจากคำว่า Sol, Terra, Luna หรือ Sol Pro ให้เช็ก [OpenAI model catalog](https://developers.openai.com/api/docs/models) ก่อนแก้ค่า production

## Prompt caching และต้นทุน

GPT-5.6 เพิ่ม explicit cache breakpoints และกำหนดอายุ cache ขั้นต่ำ 30 นาที

- Cache write คิดราคา 1.25 เท่าของ uncached input rate
- Cache read ลดราคา 90% จาก cached-input rate ตามที่ประกาศ

ถ้ามี system prompt, policy หรือชุดเอกสารยาวที่ใช้ซ้ำ การวาง cache breakpoint ให้ถูกตำแหน่งช่วยลดต้นทุนได้มาก แต่ต้องนับ cache write ครั้งแรกไว้ในแบบจำลองต้นทุนด้วย

## ข้อควรระวังเวลาอ่าน benchmark

ตัวเลขในหน้าเปิดตัวช่วยบอกทิศทาง แต่ไม่ใช่คำรับประกันสำหรับ workload ทุกแบบ

- บาง benchmark ใช้ tools, reasoning effort หรือเวลาไม่เท่ากัน
- คะแนนสูงกว่าไม่ได้แปลว่าต้นทุนต่อผลลัพธ์จริงต่ำกว่าเสมอ
- Long context ไม่ได้หมายความว่าควรใส่ข้อมูลทั้งหมดโดยไม่จัดโครงสร้าง
- งานความเสี่ยงสูงยังต้องตรวจแหล่งข้อมูล ทดสอบผล และมี human review ตามสมควร
- GPT-5.6 Sol ใช้ cyber safeguards ที่อนุรักษนิยมกว่าเดิม จึงอาจเพิ่ม friction แม้กับงานที่ไม่เป็นอันตราย หน้าเปิดตัวระบุว่า ChatGPT และ Codex มีตัวเลือกให้ retry ด้วยโมเดลความสามารถต่ำกว่าเมื่อเกิดกรณีนี้

การเลือกโมเดลที่แม่นที่สุดจึงเริ่มจาก workload ของระบบเอง วัดผลด้วยตัวอย่างจริง แล้วค่อยกำหนด routing ระหว่าง Luna, Terra และ Sol
