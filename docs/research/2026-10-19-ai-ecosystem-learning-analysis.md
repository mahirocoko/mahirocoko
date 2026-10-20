# Ecosystem งาน AI ของเรา: จากการเก็บประสบการณ์ไปสู่ความชำนาญ

วันที่: 19 ตุลาคม 2026 เวลาเริ่มสำรวจประมาณ 23:05 น. Asia/Bangkok

สถานะ: บทวิเคราะห์จาก source, configuration ที่เลือกอ่าน, task ปัจจุบัน และหลักฐานการทดลองเดิม ยังไม่ได้เปลี่ยน workflow, memory, skills, role prompts, runtime หรือ permission

## 1. โจทย์ที่ต้องตอบ

Mahiro ยังใช้ Letta Code อยู่ ไม่ได้ย้ายไป Pi 100% แต่ตั้งใจย้ายในระยะใกล้ เป้าหมายจึงไม่ใช่ทำให้ runtime ใหม่มี features ครบเท่านั้น ต้องรักษาความเข้าใจที่สะสมร่วมกัน และทำให้ประสบการณ์ช่วยงานครั้งต่อไปได้จริงด้วย

คำตอบก่อนหน้านี้บันทึกไว้ตามเดิมใน `../experience-to-proficiency-note.md` ส่วนข้อเสนอ Gentle อยู่ที่ `../gentle-workflow-adoption-note.md` ทั้งสองยังไม่ใช่การอนุมัติให้แก้ระบบ

ข้อวิเคราะห์หลัก: **เรามีเครื่องมือเก็บประสบการณ์และปรับคำแนะนำอยู่มากแล้ว แต่ยังต้องพิสูจน์การนำไปใช้และผลที่เกิดขึ้นกับงานถัดไป** การมีไฟล์มากขึ้น การบันทึกสำเร็จ และการเรียก skill ถูกตัว เป็นคนละข้ออ้างกับการทำงานเก่งขึ้น

### ขอบเขตคำว่า ecosystem ทั้งหมด

หมายถึงระบบทำงาน AI ของ Mahiro: Main/identity, Letta Code, mahiro-pi, memory/recall/reflection, Mahiro Skills, Mods/guards, tasks/goals/evidence, subagents/executors, Herdr/Halo และเครื่องมือ reference/browser QA รวมถึง research/labs ที่ป้อนบทเรียนกลับมา

ไม่ได้ audit ทุกแอปที่ Mahiroสร้าง ทุก provider ทุก transcript ทุก installed package หรือทุก process บนเครื่อง ไม่มีการแตะ OneDee ไม่มีการอ่าน credentials, dotenv, live browser/account state หรือ private Pi memory corpus

## 2. Current Reality: แต่ละชั้นทำหน้าที่อะไร

| ชั้น                                | เจ้าของปัจจุบัน                                    | สิ่งที่มีอยู่                                                                         | ยังไม่ควรตีความว่า                                          |
| ----------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| ผู้ร่วมงานและทิศทาง                 | Mahiro + Main                                      | ความตั้งใจ คำแก้ ขอบเขต และการยอมรับงาน                                               | ต้องพิสูจน์ด้วย benchmark ก่อนเชื่อฟังคำสั่ง                |
| Runtime ปัจจุบัน                    | Letta Code                                         | บทสนทนา MemFS/recall, skills, subagents, reflection และ Mods                          | การมี reflection แปลว่าพฤติกรรมดีขึ้นอัตโนมัติ              |
| Runtime ที่กำลังพัฒนา/ย้ายไป        | mahiro-pi                                          | Native continuity, managed memory และ adapter/integration ที่มีการตรวจหลายระดับ       | ผ่าน source/fixture แล้วเท่ากับใช้เป็น Main ได้ครบทุกงาน    |
| ความรู้และความต่อเนื่อง             | Letta MemFS / Pi managed memory แยกกัน             | Identity, preferences, project knowledge และ discovery paths                          | สอง runtime หรือหลายเครื่อง sync ความรู้ปัจจุบันกันอยู่     |
| ประวัติที่ค้นกลับมาได้              | Recall/transcripts และ Pi C1 ตามขอบเขตของมัน       | หลักฐานว่าเคยพูดหรือทำอะไร                                                            | ข้อความเก่าคือคำสั่งปัจจุบัน หรือเป็นความรู้ที่ยืนยันแล้ว   |
| วิธีทำงานที่พกข้าม runtime          | mahiro-skills                                      | working-tasks, rrr, forward, guidance refinement, diagnosis และ focused domain skills | มีไฟล์ติดตั้งแล้วแปลว่า agent โหลดและใช้ถูกในงานนั้น        |
| Enforcement และ runtime integration | Mods / native Pi extensions / guard adapter        | Tool boundaries, permission/secret guards และ state/tool surfaces                     | Role prompt หรือ metadata เป็น sandbox                      |
| สถานะงาน                            | tsk                                                | Outcome, scope, checks, evidence, next และ human acceptance                           | สถานะ started พิสูจน์ว่ามี process ทำงานอยู่                |
| ภารกิจและ coordination เพิ่มเติม    | Goal, UX Workflow, Execution Run, Code Evidence    | เกณฑ์เฉพาะงาน ข้ออ้าง/หลักฐาน และการประสาน lane                                       | ทุกงานต้องเปิดครบ หรือบันทึกหลักฐานแล้วเท่ากับพิสูจน์ผลจริง |
| ผู้ลงมือเฉพาะงาน                    | Letta/Pi subagents, direct CLI executors           | ค้น เขียน ตรวจ และทำงานที่ Main มอบหมาย                                               | เพิ่มจำนวนคนแล้วคุณภาพหรือความเร็วจะเพิ่มตาม                |
| พื้นที่ทำงานและการมองเห็น           | Herdr CLI/direct-cli; Mahiro Herdr เป็น projection | Space/tab/pane, session identity, execution receipts และการแสดง context/usage         | Pane จบหรือ presence เงียบแล้วงานได้รับการยอมรับ            |
| Presence/usage/resource signals     | Agent Halo                                         | เห็นกิจกรรม การใช้ทรัพยากร และข้อมูล usage ตาม integration                            | กิจกรรมเยอะหรือใช้ token น้อยลงคือทำงานเก่งขึ้น             |
| Reference และ rendered evidence     | HiroHiro + browser QA owner                        | เก็บต้นทางและตรวจผลที่ render ภายใต้ขอบเขตต่างกัน                                     | Capture เก่าหรือ reference คือ fresh QA ของ build ปัจจุบัน  |
| ประวัติและการสังเคราะห์บทเรียน      | rrr / reflection / guidance-refine / doctors       | เก็บเหตุการณ์ วินิจฉัย และเสนอแก้เจ้าของคำแนะนำ                                       | ทุกเหตุการณ์ควรแปลงเป็นกฎถาวร                               |

ความซ้อนกันบางส่วนมีเหตุผล เช่น task บอกว่าเรากำลังทำอะไร แต่ memory บอกว่าเรารู้อะไร ไม่ควรรวมทุกชั้นเข้าฐานข้อมูลหรือ dashboard ใหม่เพียงเพราะมีข้อมูลเหมือนกันบางช่อง

## 3. สิ่งที่ตรวจได้ในรอบนี้

### 3.1 Letta และ Pi ยังเป็นสองระบบที่ต้องแยกข้ออ้าง

- Runtime context ของบทสนทนานี้รายงาน Letta Code 0.34.17 ส่วน upstream checkout ที่อ่านเป็น source package 0.34.16 ที่ commit `7be3c81f9cfce481994fe4484d59a5bf17cdb48a` ไม่ถือว่าเป็น binary เดียวกัน
- การอ่าน model ปัจจุบันได้ GPT-6.1 Sol, Medium, context 272000 ผ่าน ChatGPT OAuth ไม่มีการเปลี่ยนค่า
- Project-local settings ตั้ง reflection แบบ step-count 25 สำหรับ Main นี้ การอ่าน source พบทางเดินประเมิน trigger หลัง turn แต่ไม่ได้ audit ว่าทุก trigger ได้ launch/merge สำเร็จใน runtime ปัจจุบัน
- T190 ยังเป็น started ข้อความที่อ่านล่าสุดระบุ ongoing native Goal source/QA และความล้มเหลวที่ยังต้องหาสาเหตุ ไม่ใช่หลักฐานว่า migration ทั้งชุดหรือ daily acceptance เสร็จ
- Mods และ Pi มี uncommitted source changes จากงานอื่นระหว่างอ่าน บทวิเคราะห์นี้ไม่เข้าไปแก้ รัน checks ซ้ำ หยุด workers หรือเปลี่ยนขอบเขตงานนั้น

### 3.2 ขั้นตอน portable ไม่ได้หายระหว่าง Letta กับ Pi ในตัวอย่างที่ตรวจ

ตรวจ canonical เทียบ installed SKILL.md ของ working-tasks, rrr, mahiro-guidance-refine, skill-doctor และ direct-cli ทั้งฝั่ง Letta/Pi รวม 10 คู่ พบว่า body ตรง canonical ทั้งหมด

Hash ทั้งไฟล์ไม่ตรงเพราะ adapter เพิ่ม `Mahiro Skill |` ใน description จึงไม่เรียกความต่างนี้ว่า drift หรือใช้เป็นเหตุผลติดตั้งใหม่ การตรวจนี้ครอบคลุมห้า entry files ไม่ใช่ refs/scripts ทุกไฟล์และไม่ใช่ proof of invocation

context-doctor พบใน installed Letta package ไม่ใช่ canonical Mahiro skill ที่หายไป ไม่ควรเพิ่มเข้า mahiro-skills เพียงเพราะไม่พบใน source ของเรา

### 3.3 Context มีปริมาณที่ควรวัด แต่ยังไม่พิสูจน์ว่าเป็นสาเหตุของความผิดพลาด

วัดไฟล์ always-loaded ที่เลือกห้าไฟล์ของ Letta: persona, workflow, coding preferences, communication และ projects index รวม 121,187 bytes หรือประมาณ 118.3 KiB ณ เวลาตรวจ ไม่ใช่ token count และไม่รวมทุกส่วนของ prompt

ตัวเลขนี้เป็นสัญญาณให้ตรวจการกระจาย ownership/การเรียกคืน ไม่ใช่หลักฐานว่าต้องลบ memory หรือสรุปว่า context ยาวเป็นสาเหตุหลัก การลดขนาดโดยไม่รักษาคำแก้สำคัญอาจทำให้แย่ลงได้

### 3.4 เราเคยทดลองการใช้ guidance แล้ว ไม่ได้เริ่มจากศูนย์

งาน frontend recurring-mistakes วันที่ 10 ตุลาคมมี fresh Letta pilot ที่เรียก mahiro-style จริง เลือก pain owners และรายงาน source-supported findings โดยรักษา product source ไว้

หลักฐานนั้นรองรับ routing/invocation และการตรวจ source ในขอบเขตที่ระบุ แต่ยังไม่พิสูจน์ pre-write prevention, clarification เมื่อโจทย์กำกวม หรือการลดข้อผิดพลาดในโปรเจกต์ถัดไป อย่าแทนที่งานเดิมด้วย lab ใหม่ที่วัดซ้ำสิ่งที่รู้แล้ว

### 3.5 Research notes ยังไม่ได้เป็นความรู้ที่ถูกใช้ข้าม runtime โดยอัตโนมัติ

Learning hubs ของ Gentle และ Harness² อยู่ใน `.agent-state/learn/` ซึ่ง git-ignore ใน workspace นี้ จึงเป็น local evidence ไม่ใช่ committed portable package หรือหลักฐานว่า Pi ได้รับรู้แล้ว

การบันทึก note ใน docs ช่วยให้มนุษย์อ่านต่อได้ แต่ไฟล์ uncommitted ก็ยังไม่ได้มี committed recovery บน Git และการมีไฟล์ไม่รับประกันการ discover ตอนเริ่มงานใหม่

### 3.6 Pi มีหลักฐานว่าใช้กฎที่เรียนรู้ได้จริงแล้วในกรณีควบคุม

ไม่ควรเล่า ecosystem นี้ราวกับมีแต่การเก็บข้อความ เอกสาร native proof วันที่ 19 ตุลาคมระบุ baseline 45.2 แล้ว Main/managed writer เก็บกฎคำนวณแบบ symbolic ใน deferred project memory ก่อน fresh session ที่ไม่มีแชตเดิมอ่านกฎและตอบ 51 โดยไม่มีเลขคำตอบ 51 เก็บไว้ใน Markdown

Main รอบนี้ตรวจข้อความใน `docs/agent-memory.md` ส่วน Controlled native proof และ `docs/integrations.md` ส่วน default-provider transaction ไม่ได้เปิด raw private receipts หรือรันซ้ำ หลักฐานเดิมรายงาน real provider และ independent inspection แต่ baseline อยู่ก่อน harness resource repairs จึงไม่ใช่ A/B ที่คุม configuration ครบ และไม่ใช่ held-out transfer หลายงาน

Default-root cutover ยังมีรายงาน automatic writer transaction จริงอีกกรณีที่ fresh session กู้ข้อมูลใหม่ได้ แต่ Main ใน transaction นั้นมีเพียง read tool ไม่ได้พิสูจน์ live self-edit ทุกเส้นทางหรือ busy/cancel/error coverage ทั้งหมด

| ระบบความรู้             | Owner / authority                                                  | หลักฐานที่มี                                                                     | ขอบเขตที่ยังเปิด                                                              |
| ----------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Letta maintained memory | Agent MemFS + reflection/Main                                      | มี current projection/config และคำแก้ที่ใช้ในบทสนทนา                             | รอบนี้ไม่ได้ replay effect ข้ามงานหรือพิสูจน์ reflection ทุก run              |
| Pi managed memory       | Native Markdown/Git + locked synthesized writer + exact-root guard | เอกสารรายงาน fixture, real-provider writer, fresh-session use และ cutover        | Daily usefulness, failure coverage และ human acceptance ไม่ได้ครบจากกรณีเดียว |
| Pi C1                   | Retrieval/archive + literal quote reflector และสิทธิ์แยก           | เอกสารมี isolated canary/recall proof; cutover ระบุยังไม่มี accepted quote facts | ไม่ใช้แทน Core หรือถือ retrieved user-role ว่าเป็น authenticated instruction  |
| Imported Letta history  | Screened historical records แยกจาก maintained root                 | มี migration/provenance records ตามขอบเขตที่รายงาน                               | ไม่ใช่ live sync และไม่ถือว่า history ทั้งหมดกลายเป็น current knowledge       |

ดังนั้นประเด็นที่ต้องต่อไม่ใช่ “ทำให้จำและใช้ความรู้ได้เป็นครั้งแรก” แต่คือ **ทำให้การใช้ความรู้นั้นเชื่อถือได้ในงานประจำ ตรวจการผิดซ้ำ และยืนยันประสิทธิผลอย่างต่อเนื่อง**

## 4. วงจรเรียนรู้: มีอะไรแล้ว และตรงไหนยังต่อไม่ครบ

```text
งานจริง / คำแก้ของ Mahiro / ผลตรวจ
  → เก็บเหตุการณ์และหลักฐาน
  → แยกข้อกำหนด ข้อผิดพลาด และสมมติฐานสาเหตุ
  → เลือกเจ้าของคำแนะนำที่ถูกต้อง
  → ปรับเมื่อมีอำนาจ/approval ตามขอบเขต
  → เรียกคำแนะนำนั้นมาใช้ก่อนตัดสินใจในงานถัดไป
  → ตรวจว่าพฤติกรรมและผลลัพธ์เปลี่ยนจริงไหม
  → รักษา ปรับ ลดขอบเขต หรือเลิกใช้ข้อสรุปเดิม
```

| ขั้น             | ของเดิมที่รองรับ                                                         | ข้อจำกัดของหลักฐาน                                                            |
| ---------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| เก็บ             | Transcript/recall, task evidence, RRR, reflection, capture/receipts      | มีข้อมูลไม่ได้หมายถึงจับเหตุการณ์ครบหรือเลือกสาระถูก                          |
| วินิจฉัย         | Skill Doctor, Context Doctor, context-contract audit และ Main audit      | Diagnosis ไม่ได้เท่ากับพิสูจน์สาเหตุ                                          |
| คัดและวางเจ้าของ | guidance-refine มี taxonomy, promotion, approval และ Merge/Replace/No-op | ไม่ควรสร้าง owner ใหม่เมื่อของเดิมพอ                                          |
| ส่งมอบคำแนะนำ    | Skills adapters, repo docs, memory projection และ role prompts           | Installed/projected ไม่เท่ากับ applied ก่อนเขียน                              |
| ใช้ในงานจริง     | มี pre-write rules และ pilot บางส่วน                                     | ยังไม่มีหลักฐานจากรอบนี้ว่าตรวจการนำบทเรียนทุกข้อไปใช้ได้ครบ                  |
| วัดผลภายหลัง     | Task checks, QA, human acceptance และ experiments เฉพาะเรื่อง            | ใน procedure ที่อ่านยังไม่พบวงจรติดตามประสิทธิผลหลังปรับ guidance ที่นิยามครบ |
| ทบทวน/เลิกใช้    | มีหลัก Merge/Replace/No-op และรักษาประวัติ                               | ยังต้องผูกกับผลของงานถัดไป ไม่ใช่ดูจากอายุหรือจำนวนการเรียก                   |

ช่องว่างหลักจึงไม่ใช่ไม่มี reflection และไม่ใช่ต้องเพิ่ม agent อีกตัว แต่เป็น **ไม่มีหลักฐานต่อเนื่องพอว่า guidance ที่เปลี่ยน ได้ถูกใช้และช่วยผลลัพธ์ในงานถัดไป** ข้อสรุปนี้จำกัดเฉพาะ owners/การทดลองที่อ่าน ไม่ใช่การพิสูจน์ว่า ecosystem ไม่มีความสามารถนั้นที่อื่น

## 5. ต้องแยกข้อกำหนดของ Mahiro ออกจากสมมติฐานเรื่องประสิทธิผล

คำตอบที่บันทึกไว้พูดว่า “บทเรียนยังเป็นสมมติฐานจนมีหลักฐานว่าใช้แล้วช่วย” ต้องอ่านอย่างมีขอบเขต

- **คำสั่ง ข้อห้าม design ที่เลือกแล้ว และ protected boundaries:** เป็น authority ทันทีตามขอบเขต ไม่ต้องรอ A/B test ก่อนทำตาม ห้ามทดลองฝ่าฝืนเพื่อสร้าง baseline
- **ข้อเท็จจริงที่ยืนยัน:** บันทึกพร้อมเจ้าของ/วันที่/ขอบเขต เมื่อ source เปลี่ยนต้องแก้ให้ทัน
- **สมมติฐานสาเหตุ:** เช่น reviewer มากไปทำให้งานช้า หรือ guidance แบบหนึ่งลดความผิดพลาด ต้องตรวจและยอมรับว่าอาจผิด
- **วิธีทำงานที่อนุมัติแล้ว:** ใช้ตามขอบเขต พร้อมแยกว่าผลเชิงคุณภาพ/ประสิทธิภาพพิสูจน์ถึงระดับไหน

สิ่งที่ควรถูกทดลองคือประสิทธิผลของวิธี ไม่ใช่สิทธิ์ของ Mahiro ในการกำหนดงาน

## 6. ความเสี่ยงของการ “ยิ่งทำ ยิ่งมี memory แต่ไม่ชำนาญ”

### A. เก็บบทเรียนตอนปิดงาน แต่ไม่ใช้ก่อนตัดสินใจ

มีบันทึกว่าพลาดเรื่อง owner, paint หรือ spacing แล้ว แต่ตอนเริ่มงานใหม่ไม่ได้กู้ accepted usage และข้อจำกัดที่เกี่ยวข้อง ความผิดซ้ำจึงยังเกิดได้แม้ memory ถูกต้อง

ข้อเสนอ: ก่อนเขียนใช้เฉพาะข้อกำหนด/บทเรียนที่เกี่ยวกับการตัดสินใจนั้น และบอก owner/ผลที่ต้องรักษา ไม่ต้องท่อง preference ทั้งหมด

### B. ถ่ายทอดโจทย์หลายทอดจนคำแก้หาย

Main เขียนสรุปใหม่ให้ worker; reviewer ตรวจจากสรุปของ writer; สุดท้ายทุกคนเห็นตรงกันแต่ไม่ตรงคำขอ

ข้อเสนอ: task เป็น brief ต้นฉบับเดียว ส่ง reference พร้อม literal human constraints, write scope และ observable outcome โดยใช้ working-tasks ที่มีแล้ว

### C. ใช้หลักฐานผิดชั้น

Memory commit, skill invocation, green tests, completed pane, usage และ human acceptance พิสูจน์คนละเรื่อง ถ้าเอามาแทนกัน การเรียนรู้จะให้เครดิตกับวิธีที่ยังไม่ได้ผลจริง

ข้อเสนอ: รายงานเฉพาะข้ออ้างที่หลักฐานรองรับ และผูกการตรวจเข้ากับโค้ด/คำแนะนำ/เหตุการณ์ที่ตรวจ ไม่บังคับกรอก metrics ทุกชนิดทุกงาน

### D. เก็บข้อห้ามเพิ่มแทนการซ่อมวิธีทำงาน

เมื่อพบข้อผิดพลาด ให้แยกว่า instruction ไม่มี, instruction ผิด, มีแต่ไม่ได้เรียก, เรียกแต่ใช้ผิด หรือ verifier ตรวจผิด หากเป็นการนำไปใช้ล้มเหลว การเพิ่มประโยคห้ามซ้ำไม่จำเป็นต้องช่วย

ข้อเสนอ: ใช้ diagnosis/refinement owners เดิม และอนุญาตให้จบด้วย no instruction change

### E. สอง runtime เริ่มรู้จัก Mahiro คนละเวอร์ชัน

คำแก้ที่เกิดใน Letta ไม่ได้แปลว่า Pi ได้รับแล้ว แม้ skills body จะตรงกันก็ตาม เพราะ skills กับ maintained knowledge เป็นคนละ owner

ข้อเสนอ: เมื่อใกล้สลับ Main จริง ให้ทำ bounded knowledge handoff ของคำตัดสินใจปัจจุบันพร้อม provenance/conflict review ไม่ทำ bidirectional sync ทั้ง corpus หรือคัดข้อมูล auth/transcripts โดยอัตโนมัติ

## 7. สิ่งที่ควรเอาจาก Gentle และ Harness²

| แหล่ง    | เอาวิธีคิด                                                                                                       | ไม่เอาโดยอัตโนมัติ                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Gentle   | งานเล็ก inline, delegate ด้วยเหตุผล, exact spec, behavioral ownership, finding มีหลักฐาน, correction จำกัดขอบเขต | Installer, Engram แข่งกับ memory เดิม, native RDD engine ทั้งก้อน, auto-commit exception                                 |
| Harness² | เสนอการเปลี่ยนแบบเฉพาะเรื่อง เทียบพฤติกรรมจริง และเก็บบทเรียนพร้อมบริบท/หลักฐาน                                  | Finals-only selector, broad script/plugin editing, disabled sandbox หรือการรันโจทย์ production ซ้ำหลายแขนโดยไม่มีอนุมัติ |

Harness² ไม่ควรกลายเป็นข้ออ้างให้เราเขียน skills เองไม่หยุด การเลือก harness มาใช้เป็นเพียง adoption signal ไม่ใช่ proof of improvement และเราไม่ควรตัดตัวเลือก “ของเดิมดีกว่า” ทิ้ง

## 8. Preferred Direction: ใช้ของเดิมให้ต่อกันก่อน

### ลำดับ 1 — ป้องกันความเข้าใจขาดตอนระหว่าง Main สอง runtime

รักษาเจ้าของข้อมูลให้ชัด: task เป็นงานปัจจุบัน, skills เป็น procedure, memory เป็นความเข้าใจที่บำรุงรักษา, recall เป็นประวัติ และ capture/test/report เป็นหลักฐาน

ยังไม่จำเป็นต้อง sync ทุกอย่าง ขณะ Letta ยังเป็น Main ให้การย้ายไป Pi มีขอบเขตและการตรวจ conflict ที่ชัด ไม่ตีความความครบของ source features เป็นการย้ายความสัมพันธ์เสร็จ

### ลำดับ 2 — ปรับการเลือกวิธีทำงานและการส่งต่อ

ใช้สามจุดใน Gentle note: Main guidance, working-tasks และ local writer/verifier prompts แต่เมื่อได้รับอนุมัติแล้วให้ merge ที่ owner เดิม รักษา model/tool/permission และ independent QA เดิม ไม่สร้าง policy ซ้อนใน bootstrap

### ลำดับ 3 — ทดลองผลหลังใช้ guidance เพียงหนึ่งเรื่อง

เลือก pain ที่มีหลักฐานเก่าและเป็นงานเกิดซ้ำ เช่นการกู้ owner/accepted usage ก่อนแก้ UI ไม่ทำ all-domain lab หรือ test framework ใหม่

บันทึกเท่าที่ใช้ตัดสินใจได้ใน task/evidence เดิม:

```text
จะเปลี่ยนอะไร: หนึ่งขั้นตอนที่คาดว่าช่วย
ขอบเขต: งาน/เงื่อนไขที่ใช้ และกรณีใกล้เคียงที่ไม่ใช้
Baseline: ผลเก่าหรือวิธีที่ยอมรับแล้ว โดยไม่ละเมิดคำสั่งเพื่อทำ control
Applied: เห็นการตัดสินใจที่ใช้ขั้นตอนใหม่จริงหรือยัง
Outcome: ผลตรวจและคำยอมรับของ Mahiro
Cost: เวลา/token/รอบแก้เท่าที่วัดได้จริง
Decision: ใช้ต่อ ปรับ ลดขอบเขต หรือกลับของเดิม
```

ดูงานเทียบเคียงไม่กี่งานก่อน เพื่อหาสัญญาณ ไม่อ้างนัยสำคัญทางสถิติจาก n เล็ก พยายามคง model/effort, scope และ acceptance bar และแยก new requirements ออกจากความผิดเดิมที่ต้องแก้

### ลำดับ 4 — ค่อยใช้ runtime ช่วยสิ่งที่ manual loop พิสูจน์ว่าคุ้ม

ถ้าพบว่าข้อมูลบางอย่างเก็บซ้ำจนเป็นภาระ ค่อยพิจารณา Mods/Pi extension ช่วยเก็บ metadata ที่มี owner อยู่แล้ว ไม่สร้าง evaluator/collector/dashboard ใหม่ก่อนรู้ว่าจะตัดสินใจอะไรจากข้อมูล

งาน native Goal/Code Map/guard ที่อนุมัติอยู่ภายใต้ T190 เดินตาม owner เดิมต่อได้ บทวิเคราะห์นี้ไม่ได้เพิ่ม acceptance gate หรือสั่งหยุดงานนั้น

## 9. วัดว่าเก่งขึ้นอย่างไร

| สิ่งที่อยากรู้         | หลักฐานที่ใช้ได้                                             | สิ่งที่ใช้แทนไม่ได้                            |
| ---------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| จำ requirement ได้ตรง  | ใช้ข้อกำหนดปัจจุบันตอนตัดสินใจ และผลตรงโจทย์                 | มีข้อความนั้นอยู่ใน memory                     |
| เริ่มจากจุดถูกเร็วขึ้น | พบ canonical owner ก่อนแก้ ลดการย้อนรื้อที่เกิดจาก owner ผิด | จำนวน searches ต่ำอย่างเดียว                   |
| ผิดซ้ำน้อยลง           | Defect ประเภทเดิมลดในงานเทียบเคียง โดย acceptance bar ไม่ลด  | จำนวน tests/skills เพิ่ม                       |
| ใช้ subagents คุ้มขึ้น | ผลครบและเวลา/ต้นทุนสมเหตุผล เทียบงานที่ใกล้เคียง             | จำนวน agents หรือ parallelism                  |
| คำแก้จาก Mahiro ลดลง   | Correction ที่เกิดจาก agent พลาด requirement เดิมลดลง        | นับทุกข้อความที่ Mahiroเปลี่ยนโจทย์เป็นความผิด |
| บทเรียนถ่ายโอนได้      | เกิดผลในงานใหม่ที่อยู่ในขอบเขตเดียวกัน                       | ผ่านโจทย์เดิมซ้ำเพียงครั้งเดียว                |

เลือกตัววัดตามงาน ความเร็วไม่ควรชนะคุณภาพหรือ permission และ “คุณพอใจขึ้นไหม” ยังเป็น human-owned outcome ไม่ควรให้ model ให้คะแนนแทน

## 10. สิ่งที่ยังไม่ควรทำ

- ไม่แก้ Letta Code core เพื่อสร้าง learning engine ใหม่จากบทวิเคราะห์นี้
- ไม่เพิ่ม Engram หรือ memory store ที่แข่งกับ maintained owner เดิม
- ไม่เขียน workflow เดียวซ้ำใน memory, bootstrap, skills และทุก role prompt
- ไม่ทำให้ทุกงานต้องใช้ Goal/Execution Run/Fable/หลาย reviewers
- ไม่เพิ่มข้อห้ามจากทุก incident หรือ promote raw transcripts เป็นคำสั่ง
- ไม่ซ่อนการทดลองกฎ/permission/model/provider เปลี่ยนไปจากสิ่งที่ Mahiroอนุมัติ
- ไม่เปิด sync/release/install/commit หรือ paid experiment เอง
- ไม่ตีความ approved technical migration ว่า Mahiroเลิกใช้ Letta แล้ว

## 11. Evidence matrix และขอบเขตความมั่นใจ

| ข้ออ้าง                                                        | หลักฐานรอบนี้                                                      | สถานะ                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| มี capture/diagnosis/promotion owners แล้ว                     | Canonical skills และ runtime reflection source                     | Source-supported                                                  |
| ขั้นตอนหลักพกข้าม Letta/Pi ในตัวอย่าง                          | Body equality ของ 5 skills ใน 2 installed roots                    | Direct file check; ไม่ใช่ invocation/effect proof                 |
| มี reflection cadence configured                               | Project-local step-count25 + source trigger path                   | Configuration-supported; ไม่ใช่ทุก run สำเร็จ                     |
| Memory writes ทำให้ทำงานดีขึ้น                                 | ไม่มี comparative outcome ใหม่ในรอบนี้                             | Not established                                                   |
| Pi ใช้ retained policy โดยไม่ท่องเลขคำตอบได้                   | เอกสาร controlled native proof มี real-provider/fresh-session case | Bounded prior evidence; ไม่ใช่ controlled A/B หรือ broad transfer |
| บาง pre-write lesson ถูกนำไปใช้ในงานใหม่                       | มี pilot เดิมด้าน routing/source review เท่านั้น                   | Partial; prevention/transfer ยังไม่พิสูจน์                        |
| Source/metadata ของ Pi/Mods เป็น installed/live state เดียวกัน | Source dirty และ task มีงานต่อเนื่อง                               | ไม่อ้าง parity                                                    |
| Letta/Pi sync current knowledge กันอยู่                        | ไม่พบ live-sync proof และ current owner แยกกัน                     | ไม่สมมติว่ามี                                                     |
| Halo/Herdr usage เป็น proficiency metric                       | เอกสารที่อ่านอธิบาย activity/projection                            | ไม่ใช้แทน outcome                                                 |

ไม่ได้ทำ cleanup จึงไม่มีการลบ/รวมเอกสารหรือลด context volume การวัดไฟล์มีไว้ประกอบสมมติฐานเท่านั้น ไม่ใช่คำอนุญาตเปลี่ยน memory

## 12. Source register และ snapshot

แหล่งอ้างอิงต่อไปนี้เป็นเจ้าของปัจจุบันหรือ supporting evidence ตามขอบเขตที่ระบุ ไม่ใช่ runtime certification

| แหล่ง                                                                               | บทบาท / ตำแหน่งสำคัญ                                                                             |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `~/ghq/github.com/mahirocoko/mahiro-skills/AGENTS.md`                               | Canonical versus installed ownership; lines 3–9, 54–60                                           |
| `~/ghq/github.com/mahirocoko/mahiro-skills/skills/working-tasks/SKILL.md`           | Task/memory/Goal separation และ execute/handoff; lines 13–24, 56–109                             |
| `~/ghq/github.com/mahirocoko/mahiro-skills/skills/rrr/SKILL.md`                     | Non-canonical history/learning gates และ pulse; lines 41–84, 150–186                             |
| `~/ghq/github.com/mahirocoko/mahiro-skills/skills/mahiro-guidance-refine/SKILL.md`  | Taxonomy/promotion/approval; lines 28–77, 132–160                                                |
| `~/ghq/github.com/mahirocoko/mahiro-skills/skills/skill-doctor/SKILL.md`            | Transcript diagnosis versus causal inference/install health; lines 10–15, 49–65                  |
| `~/ghq/github.com/mahirocoko/mahiro-skills/skills/direct-cli/SKILL.md`              | Executor/receipt/lifecycle owner; current installed body matches canonical sample                |
| `~/ghq/github.com/mahirocoko/mahiro-skills/skills/herdr-cli/SKILL.md`               | Visible Space/tab/pane/worktree coordination; lines 14–89                                        |
| `~/ghq/github.com/mahirocoko/mahiro-pi/docs/agent-memory.md`                        | Native maintained-memory boundary; source changes inspected, not live corpus                     |
| `~/ghq/github.com/mahirocoko/mahiro-pi/docs/agents.md`                              | Package system roles versus local personal roster                                                |
| `~/ghq/github.com/mahirocoko/mahiro-pi/docs/integrations.md`                        | Activation/evidence boundaries; evolving source, not completed daily adoption                    |
| `~/ghq/github.com/mahirocoko/mahiro-pi/lib/agent-memory/runtime.ts`                 | Locked writer descriptor/dispatch/integration; lines 492–516, 554–679                            |
| `~/ghq/github.com/mahirocoko/mods/README.md`                                        | Code Evidence, UX Workflow, Execution Run metadata limits; sections starting lines 167, 198, 266 |
| `~/ghq/github.com/mahirocoko/mods/adapters/pi/index.ts`                             | Separate managed-memory permission, child binding และ exact-root authority; lines 248–360        |
| `~/ghq/github.com/mahirocoko/agent-halo/README.md`                                  | Presence/usage/resource surface; lines 19–29                                                     |
| `~/ghq/github.com/mahirocoko/mahiro-herdr/AGENTS.md`                                | Read-only adapter/display ownership; lines 3–8, 19–25                                            |
| `~/ghq/github.com/mahirocoko/hirohiro/AGENTS.md`                                    | Capture/reference/Taste boundary; lines 24–38                                                    |
| `~/ghq/github.com/letta-ai/letta-code/src/agent/subagents/builtin/reflection-v2.md` | Upstream reflection instructions, supporting source not exact current loaded-prompt attestation  |
| `~/ghq/github.com/letta-ai/letta-code/src/cli/helpers/post-turn-reflection.ts`      | Post-turn configured trigger, not proficiency evaluator                                          |
| `~/Git/me/mahirocoko/.letta/settings.local.json`                                    | Selected safe reflection fields only; no environment/secret output                               |
| `~/Git/me/mahirocoko/docs/research/2026-10-10-frontend-recurring-mistakes.md`       | Prior recurring failures and bounded real routing/source pilot; sections 7 and 13                |

Source HEADs ขณะอ่าน: mahiro-skills `2b4dab1`, Mods `55fa5a1`, mahiro-pi `fa74890`, Agent Halo `3939e20`, Mahiro Herdr `10f943c`, HiroHiro `c795df8` ทั้งนี้ Pi/Mods working trees มีงานอื่นที่ยังไม่ commit จึงใช้ HEAD เพียงอย่างเดียวอ้าง snapshot ทั้งหมดไม่ได้

Main อ่าน T190 ผ่าน `tsk list T190 --json` แบบ read-only ไม่เปลี่ยน task; recorded active lane ไม่ได้ถูกตรวจเป็น process ownership ในรอบนี้ ไม่อ่าน raw conversation corpus เพื่อให้คะแนน และไม่เปิด Skill Doctor scoring ใหม่โดยปริยาย

การสำรวจใช้สาม read-only repo-scout lanes แยก portable procedures, Pi/Mods memory boundaries และ orchestration/evidence surfaces แล้ว Main ตรวจ source/config/เอกสารที่มีผลต่อข้อสรุป ไม่มี lane เขียน source หรือเปิด nested reviewer งานนี้ไม่มี package/runtime test ใหม่เพราะเป็นการวิเคราะห์ ไม่ใช่การเปลี่ยน implementation

## 13. ข้อสรุปสำหรับตัดสินใจ

**ไม่ควรสร้าง ecosystem ใหม่เพื่อเรียนรู้จาก ecosystem เดิม** ควรเริ่มจากวงจรเล็กที่ทำให้เห็นว่า guidance ที่อนุมัติถูกใช้ก่อนตัดสินใจ และช่วยผลของงานถัดไปจริงหรือไม่

มีวิธีเก็บและคัดบทเรียนอยู่แล้ว สิ่งที่ต้องต่อให้ชัดคือ **การเรียกใช้ตรงจังหวะ การตรวจผลภายหลัง และการแก้บทเรียนที่ใช้ไม่ได้** โดยให้คำสั่งและการยอมรับของ Mahiroเป็น authority เหมือนเดิม

Disposition: บันทึก note และ analysis เท่านั้น ข้อเสนอการปรับทุกส่วนยังไม่ถูก apply; existing task/runtime owners ไม่ถูกเปลี่ยน
