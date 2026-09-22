# Grok 4.7 เทียบกับ Grok รุ่นก่อนและ frontier models

**วันที่ตรวจข้อมูล:** 22 กันยายน 2026  
**สถานะ:** Research / Model-routing decision support  
**ขอบเขต:** งาน coding agent, terminal, repository implementation, browser/visual QA และ long-horizon execution

## ข้อสรุป

Grok 4.7 เป็นการอัปเกรดจาก Grok 4.6 ที่เห็นผลชัดในงาน agentic coding โดยเฉพาะโจทย์ที่ต้องใช้ terminal หลายขั้น ตรวจงานตัวเอง และทำงานกับ repository นาน ๆ แต่หลักฐานปัจจุบันยังไม่พอจะเรียกว่าเป็น coding model ที่เก่งที่สุดโดยรวม

ถ้าเทียบกับโมเดลแถวหน้า Fable 5.1, GPT-6 Astra และ Opus 5 ยังนำในงานยากที่ต้องการ completion reliability สูง ส่วน Grok 4.7 เด่นที่ price/performance และเป็นทางเลือก long-horizon ที่น่าสนใจมากกว่า Grok รุ่นเก่าอย่างชัดเจน

เมื่อเทียบกับ Gemini 3.8 Flash ภาพจะออกมาเป็นการแบ่งบทบาทมากกว่าการจัดอันดับตัวเดียว

- **Gemini 3.8 Flash:** เร็วกว่า ถูกกว่า รับ context และสื่อได้หลากหลายกว่า เหมาะกับ implementation ที่ scope ชัด งาน browser/visual QA และ review รอบสอง
- **Grok 4.7:** ทำงาน agentic ยาว ๆ สำเร็จมากกว่า โดยเฉพาะ terminal และ repository work แต่ใช้เวลาและต้นทุนสูงกว่าหลายเท่า

## 1. Grok 4.7 เปลี่ยนอะไรจากรุ่นก่อน

xAI เปิดตัว Grok 4.7 เมื่อวันที่ 21 กันยายน 2026 และระบุว่าเป็น base model ที่ใหญ่ขึ้น ผ่าน reinforcement learning นานขึ้นบนโจทย์ที่ยากกว่าเดิม โดยเน้นงานที่ใช้เวลาหลายชั่วโมง การตรวจคำตอบตัวเอง และการจัดการ context ยาว

Grok 4.7 รองรับ reasoning effort ระดับ `low`, `medium`, `high` และ `xhigh` มี context สูงสุด 500k tokens และรับ text/image เป็น input ส่วน Fast tier เป็นโมเดลเดียวกันบน infrastructure ที่เร็วขึ้น ไม่ใช่โมเดลที่ฉลาดกว่า

วิวัฒนาการของแต่ละรุ่นมองได้แบบนี้

- **Grok 4:** เริ่มวางฐาน reasoning, native tool use และ web/X search
- **Grok 4.5:** เพิ่ม Cursor co-training และ RL สำหรับงาน agent หลายชั่วโมง
- **Grok 4.6:** เพิ่ม `xhigh`, self-testing, instruction following และ long-horizon behavior
- **Grok 4.7:** ขยาย base model และเน้น verification, harder multi-hour tasks และ harness-aware execution

## 2. ขนาดของการพัฒนาจาก Grok 4.6

| Benchmark | Grok 4.5 | Grok 4.6 | Grok 4.7 |
| --- | ---: | ---: | ---: |
| Terminal-Bench 4.0 | 12.42% | 20.30% | **37.58%** |
| CursorBench 4.0 | — | 40.4% | **46.3%** |
| DeepSWE v1.1 | — | 65.2% | **71.0–73%** |
| AA Coding Agent Index | — | 47 | **56** |
| AA Intelligence Index | — | 44.31 | **46.45** |

จุดที่เพิ่มขึ้นมากที่สุดคือ Terminal-Bench 4.0 จาก 20.30% เป็น 37.58% หรือเพิ่มราว 85% เมื่อคิดแบบ relative ส่วน CursorBench เพิ่ม 5.9 จุด และ Coding Agent Index เพิ่ม 9 จุด

แต่ broad intelligence เพิ่มจาก 44.31 เป็น 46.45 หรือประมาณ 4.8% เท่านั้น หลักฐานจึงชี้ว่าการพัฒนาหลักอยู่ที่ความสามารถในการลงมือทำงานหลายขั้น มากกว่าความฉลาดทั่วไปที่กระโดดขึ้นทุกด้าน

ตัวเลขเหล่านี้ต้องอ่านพร้อม harness และ effort level เพราะผลบางชุดวัด Grok Build + Grok 4.7 `xhigh` ขณะที่ Grok 4.6 ใช้ `high` หรือ harness คนละชุดกัน

## 3. เทียบกับ frontier coding models

| Model | CursorBench 4.0 | Terminal-Bench 4.0 | ภาพรวม |
| --- | ---: | ---: | --- |
| Fable 5.1 Max | **51.8%** | **57.88%** | completion reliability สูง แต่ราคาแพง |
| GPT-6 Astra Max | — | **58.18%** | เด่นในงาน agentic ที่ยากมาก |
| Opus 5 Max | 46.6% | 53.94% | CursorBench ใกล้ Grok แต่ terminal ดีกว่าชัดเจน |
| Grok 4.7 xhigh | 46.3% | 37.58% | value ดีและเหนือกว่า Grok รุ่นก่อนมาก |
| GPT-5.6 Sol Max | 41.7% | 37.3% | Terminal-Bench ใกล้ Grok และ DeepSWE ดีกว่าเล็กน้อย |

บน CursorBench ที่ xAI เผยแพร่ Grok 4.7 `xhigh` ได้ 46.3% ที่ต้นทุนเฉลี่ย $6.01 ต่อ task ขณะที่ Opus 5 Max ได้ 46.6% ที่ $11.95 และ Fable 5.1 Max ได้ 51.8% ที่ $17.28

Grok จึงยังไม่ใช่ผู้นำด้านคะแนน แต่มีสัดส่วนคะแนนต่อต้นทุนที่ดีมาก โดยเฉพาะเมื่อเทียบกับ Opus 5 และ Fable 5.1

## 4. Grok 4.7 เทียบกับ Gemini 3.8 Flash

### 4.1 Agent-system comparison

Artificial Analysis Coding Agent Index v1.5 ทดสอบ 303 งาน ชุดละสาม attempts และวัด pass@1 ผลนี้เปรียบเทียบระบบครบชุด ไม่ใช่ bare model

| AA Coding Agent Index | Gemini 3.8 High + Antigravity SDK | Grok 4.7 xhigh + Grok Build |
| --- | ---: | ---: |
| Composite index | 42 | **56** |
| DeepSWE v1.1 | 66% | **73%** |
| Terminal-Bench 4.0 | 15% | **33%** |
| SWE-Atlas-QnA | 45% | **63%** |
| Cost/task | **$2.47** | $8.82 |
| Agent wall time/task | **11.7 นาที** | 39.2 นาที |
| Turns/task | 188.5 | **162.6** |
| Tokens/task | **13.5M** | 14.3M |

Grok ทำคะแนนรวมสูงกว่าประมาณ 33% แต่ช้ากว่า 3.35 เท่าและแพงกว่า 3.57 เท่าต่อ task

ผลนี้สนับสนุนให้ใช้ Grok เป็น escalation lane สำหรับงาน long-horizon ส่วน Gemini เหมาะกว่าในงานประจำที่ scope ชัดและต้องการ throughput สูง

### 4.2 Model-level comparison

| AA metric | Gemini 3.8 High | Grok 4.7 High | Grok 4.7 xhigh |
| --- | ---: | ---: | ---: |
| Intelligence Index | 41 | **46** | **46** |
| Output speed | **343.5 tok/s** | 55.3 tok/s | 39.5 tok/s |
| Cost/index task | **$1.24** | $2.73 | $3.74 |
| Context | **1M** | 500k | 500k |

Gemini ถอด output เร็วกว่า Grok high ประมาณหกเท่าและมี context สูงกว่า ส่วน Grok high กับ xhigh ได้คะแนนที่ปัดแล้วเท่ากัน แม้ xhigh ใช้ token มากกว่า แพงกว่า และ decode ช้ากว่า

ตรงนี้ไม่ได้แปลว่า xhigh ไม่มีประโยชน์ เพราะ Intelligence Index ไม่ได้วัด long-horizon completion โดยตรง แต่เป็นเหตุผลว่าทำไมไม่ควรใช้ xhigh กับงานทั่วไป

### 4.3 Official coding evidence

| Benchmark | Gemini 3.8 Flash High | Grok 4.7 |
| --- | ---: | ---: |
| DeepSWE v1.1 | **73.7%** | 71.0% |
| Terminal-Bench 4.0 | 19.1% | **38.0%** |
| OSWorld 2.0 | **59.0%** | ไม่มีผลเทียบตรง |

DeepSWE ของ Gemini มาจาก mini-swe harness ขณะที่ Grok ใช้ harness และ effort คนละแบบ จึงไม่ควรอ่านเป็น model-only ranking แต่ทิศทางค่อนข้างสม่ำเสมอ: Gemini แข็งแรงกับ bounded coding และ Grok แข็งแรงกว่ากับ terminal-heavy autonomous work

### 4.4 Context, modality และราคา API

| | Gemini 3.8 Flash | Grok 4.7 |
| --- | --- | --- |
| Context | **1M input**, 64k output | 500k |
| Modal input | **Text, image, video, audio, PDF** | Text, image |
| Effort | low, medium, high | low, medium, high, xhigh |
| Knowledge cutoff | March 2026 | May 2026 |
| Input/output price | $0.75 / $3.75 ต่อ 1M tokens ช่วง promotional | $2 / $6 ต่อ 1M tokens |
| Cached input | $0.075 | $0.50 |

Gemini มีข้อได้เปรียบชัดในงาน multimodal, browser QA และ visual inspection ส่วน Grok มีหลักฐาน agentic terminal ที่แข็งแรงกว่า

## 5. Effort level ที่ควรใช้

### Gemini 3.8 Flash

| Effort | AA Intelligence Index | ข้อเสนอแนะ |
| --- | ---: | --- |
| High | 41 | implementation และ browser/visual QA |
| Medium | 40 | review รอบสอง งาน bounded ที่เน้นความเร็วและต้นทุน |
| Low | 33 | mechanical checks เท่านั้น |

Medium เสียเพียงหนึ่งคะแนนจาก High แต่ใช้ evaluation output น้อยกว่ามาก ส่วน Low ลดลงอีกเจ็ดคะแนน จึงไม่ควรเป็นเจ้าของ implementation ที่มีผลกระทบจริง

### Grok 4.7

- `high` เหมาะกับ long-horizon work ทั่วไป
- `xhigh` ใช้เมื่อเป็น migration, debugging หรือ autonomous task ที่ยากจริง และยอมรับเวลา/ต้นทุนเพิ่มได้
- Fast tier เป็น serving tier ไม่ใช่ reasoning tier

## 6. ข้อเสนอแนะสำหรับ Direct CLI

| งาน | Route ที่เหมาะ |
| --- | --- |
| Implementation ปกติที่ scope ชัด | Agy `gemini-3.8-flash-high` |
| งานเร็วหรือ review รอบสอง | Agy `gemini-3.8-flash-medium` |
| Browser และ visual QA | Agy `gemini-3.8-flash-high` |
| Long-horizon / terminal-heavy | Cursor `grok-4.7-high` |
| Migration หรือ debugging ที่ยากมาก | Cursor `grok-4.7-xhigh` |
| งานที่ต้องการ reliability สูงสุด | Fable 5.1, GPT-6 Astra หรือ Opus 5 ตาม harness ที่ใช้ |

การเปลี่ยนเส้นทาง Grok 4.6 เป็น 4.7 ถูกต้อง เพราะ 4.7 เหนือกว่า Grok รุ่นก่อนอย่างชัดเจน แต่ยังไม่มีเหตุผลพอให้เปลี่ยน default bounded writer จาก Agy/Gemini ไปเป็น Grok

## 7. ข้อจำกัดของหลักฐาน

1. หลาย benchmark วัด model + harness ไม่ใช่ตัวโมเดลล้วน
2. Effort level, retry policy, network access และ task timeout ต่างกัน
3. ตัวเลขจาก xAI และ Google เป็น vendor-reported แม้บางรายการอ้าง public leaderboard
4. ยังไม่มี Grok 4.7 public result ที่ตรวจได้บน SWE-bench Verified, LiveCodeBench หรือ Arena
5. ยังไม่มีชุดทดลอง Cursor Agent บน repository จริงที่ทำซ้ำหลายรอบ
6. Cursor-hosted Gemini, Agy และ Antigravity SDK ไม่ควรถูกถือว่าให้พฤติกรรมเหมือนกันโดยอัตโนมัติ
7. งาน visual ยังต้องผ่านการดูภาพจริงและ Mahiro review ไม่ว่า benchmark จะออกมาดีแค่ไหน

## แหล่งข้อมูล

### Official

- [xAI — Grok 4.7 announcement](https://x.ai/news/grok-4-7)
- [xAI — Grok 4.7 documentation](https://docs.x.ai/developers/grok-4-7)
- [xAI — API release notes](https://docs.x.ai/developers/release-notes)
- [Cursor — Grok 4.7](https://cursor.com/docs/models/grok-4-7)
- [Cursor — Gemini 3.8 Flash](https://cursor.com/docs/models/gemini-3-8-flash)
- [Google DeepMind — Gemini 3.8 Flash model card](https://deepmind.google/models/model-cards/gemini-3-8-flash/)
- [Google Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)

### Independent / reproducible

- [Artificial Analysis — Antigravity SDK vs Grok Build](https://artificialanalysis.ai/agents/coding-agents/comparisons/antigravity-sdk-vs-grok-build)
- [Artificial Analysis — Coding Agent methodology](https://artificialanalysis.ai/methodology/coding-agents-benchmarking)
- [Artificial Analysis — Grok 4.7 technical review](https://artificialanalysis.ai/articles/benchmarking-grok-4-7)
- [Artificial Analysis — Gemini 3.8 Flash](https://artificialanalysis.ai/models/gemini-3-8-flash)
- [Artificial Analysis — Grok 4.7](https://artificialanalysis.ai/models/grok-4-7)
- [Terminal-Bench leaderboard](https://www.tbench.ai/)
- [Terminal-Bench reproduction repository](https://github.com/harbor-framework/terminal-bench)

## งานที่ควรทดลองต่อ

ถ้าต้องการตัดสินจาก workflow ของ Mahiro จริง ควรทำ same-task bakeoff ระหว่าง Agy Gemini 3.8 High กับ Cursor Grok 4.7 High/Xhigh โดยใช้ prompt, repository state, allowed files, verification commands และ stopping condition ชุดเดียวกัน แล้วเก็บ completion rate, regressions, จำนวนครั้งที่ Main ต้องแก้, wall time และ token usage แยกกัน

อย่าใช้ Auto route ในการทดลอง เพราะจะพิสูจน์ไม่ได้ว่ารอบนั้นใช้โมเดลใด
