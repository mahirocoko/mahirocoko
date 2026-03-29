---
title: สรุปภาษาไทย - Vercel accuses Cloudflare of stealing
source_note: .agent-state/memory/learnings/2026-03-19_vercel-accuses-cloudflare-of-stealing.md
video_url: https://www.youtube.com/watch?v=mVKxygo5Sdo
created: 2026-03-19
language: th
---

# สรุปภาษาไทย (แบ่งตามช่วงเวลา)

## [00:00-04:59]
- Theo เปิดคลิปด้วยดราม่ารอบใหม่ระหว่าง Vercel กับ Cloudflare ซึ่งรอบนี้ไม่ได้ทะเลาะกันเรื่อง performance หรือ marketing แต่เป็นเรื่อง `Just Bash`
- `Just Bash` คือ virtual Bash environment ที่เขียนด้วย TypeScript มี in-memory filesystem และถูกออกแบบมาเพื่อให้ AI agents ใช้คำสั่งลักษณะ Bash ได้อย่างปลอดภัย
- จุดเริ่มต้นของเรื่องคือ Cloudflare เอาโปรเจกต์นี้ไป fork เป็น `cloudflare/shell`
- ประเด็นตั้งต้นไม่ใช่ว่า fork ผิด license เพราะโค้ดอยู่ใต้ Apache 2.0 แต่เป็นคำถามว่า “ควร fork ตอนนี้ไหม” และ “ควรคุยกับ upstream ก่อนหรือเปล่า”

## [05:00-09:59]
- Theo อธิบายมุมกังวลของฝั่ง Vercel ว่า Cloudflare เอา disclaimer ว่าโปรเจกต์ยังเป็น beta ออก และตัดบางชั้นของ defense-in-depth ออกไป
- ในมุมของ Vercel ปัญหานี้สำคัญมาก เพราะ fake shell ที่รันบน Node ถ้าหลุด sandbox อาจกลายเป็น host breakout แล้วเข้าถึงสิ่งที่ไม่ควรเข้าถึงได้
- Theo มองว่าจุดนี้ทำให้เรื่องไม่ใช่แค่ “copy โค้ด” แต่กลายเป็นเรื่องความปลอดภัยและความรับผิดชอบต่อคนใช้

## [10:00-17:59]
- ช่วงนี้เป็น technical deep dive ที่สำคัญที่สุดของคลิป
- Theo เปรียบเทียบสถาปัตยกรรมของ Vercel กับ Cloudflare ว่าต่างกันตั้งแต่ชั้น runtime: Vercel ใกล้กับโลก Docker/Linux/Node มากกว่า ส่วน Cloudflare ใช้ `workerd` และ V8 isolates
- เพราะฉะนั้น security assumptions ของทั้งสองฝั่งจึงไม่เหมือนกัน: สิ่งที่จำเป็นมากบน Node อาจไม่ได้จำเป็นในรูปเดียวกันบน Workers
- มุมนี้ทำให้ข้อถกเถียงไม่ใช่เรื่องใครโกหก แต่เป็นเรื่องที่ทั้งสองฝั่งกำลังคิดจาก threat model คนละแบบ

## [18:00-24:59]
- Theo อธิบายว่าทำไม Cloudflare ถึงอยากได้ของแบบ `Just Bash`: เพราะบน Workers รัน Bash จริงไม่ได้ แต่ agent workflows ยังได้ประโยชน์จาก interface แบบ Bash มาก
- เขาปกป้อง Sunil Pai พอสมควร โดยตีความว่าเหตุการณ์นี้ดูเหมือน experiment ที่ปล่อยเร็วเกินไป มากกว่าจะเป็นความตั้งใจจะ “ขโมย” แบบร้ายๆ
- อย่างไรก็ตาม Theo ชี้ว่าปัญหาเชิง perception ยังจริงอยู่: ถ้าตั้งชื่อเป็น `cloudflare/shell` และตัดคำเตือนออก คนใช้ก็อาจเข้าใจผิดว่ามันพร้อมใช้งานและปลอดภัยพอๆ กับต้นฉบับ

## [25:00-31:11]
- Sunil ออกมาขอโทษและบอกว่าตั้งใจจะคุยกับ Malte หลังจากทดลองเสร็จ แต่ publish ไปเร็วเกินไป
- ต่อมาฝั่ง Malte ก็ขอโทษกลับสำหรับความเจ็บปวดที่ทำให้เกิดขึ้นจากการโพสต์สาธารณะ
- Theo ปิดคลิปด้วยบทเรียนเชิงวัฒนธรรม: ecosystem ตอนนี้ขาด good faith ง่ายเกินไป และคนชอบ “โพสต์ก่อน ทักทีหลัง”
- บทสรุปสั้นที่สุดของคลิปคือ: ส่ง DM ก่อนโพสต์ดราม่า ถามเจตนากันก่อน และอย่าให้ conflict ทางเทคนิคกลายเป็นสงคราม public branding ง่ายเกินไป

## Key Takeaways (10 ข้อ)
1. ประเด็นหลักไม่ใช่เรื่อง license แต่เป็นเรื่อง etiquette, timing, และความรับผิดชอบตอน fork โปรเจกต์ open source ที่ยังไม่นิ่ง
2. `Just Bash` สำคัญเพราะมันทำให้ AI agents ใช้ workflow แบบ Bash ได้โดยไม่ต้องแตะ shell จริง
3. ในโลก Node/Vercel ความปลอดภัยของ fake shell เป็นเรื่องหนัก เพราะการ breakout อาจลงไปถึง host หรือ secrets ได้
4. ในโลก Cloudflare Workers threat model ต่างออกไป เพราะ runtime ถูกล้อมด้วย isolates ตั้งแต่ชั้นล่างกว่า
5. ดังนั้นข้อถกเถียงนี้คือการชนกันของ runtime assumptions มากพอๆ กับการชนกันของบริษัท
6. การ fork โปรเจกต์ที่ยังเปลี่ยนเร็ว มีความเสี่ยงทั้งเรื่องตาม upstream ไม่ทันและสื่อสารสถานะโปรเจกต์ผิด
7. การเอา beta disclaimers หรือ safety messaging ออก มีผลต่อ perception ของผู้ใช้มากกว่าที่ดูเผินๆ
8. Theo มองว่า Sunil น่าจะกำลังทดลองมากกว่ามีเจตนาร้าย แต่การปล่อยเร็วเกินไปทำให้เรื่องบานปลาย
9. การตั้งชื่อ fork และการทำ packaging/public release มีผลทาง product positioning ไม่ใช่แค่ทางเทคนิค
10. บทเรียนที่ใหญ่ที่สุดคือวัฒนธรรมการสื่อสารในวงการ dev: ควรคุยกันตรงๆ ก่อนสร้าง public drama

---
สรุปจากไฟล์ retained note, Gemini transcript summary, และบริบทในคลิป โดยเรียบเรียงเป็นภาษาไทยให้ใช้อ่านทบทวนเร็ว
