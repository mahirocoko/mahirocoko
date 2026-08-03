# 9Router Free-only Runbook

เอกสารนี้อธิบาย 9Router instance ที่รันแยกไว้สำหรับใช้โมเดลฟรีและ free tier เท่านั้น เป้าหมายคือมี OpenAI-compatible endpoint สำหรับทดลองหรือเรียกใช้งานแบบ opt-in โดยไม่เปลี่ยน global config หรือเส้นทาง provider ที่ใช้อยู่เดิม

## ขอบเขต

instance นี้ต้องรักษาหลักต่อไปนี้ไว้:

- รับ connection จากเครื่องนี้เท่านั้นผ่าน `127.0.0.1`
- เก็บข้อมูลและ secret แยกใต้ `~/.9router-free/`
- ถ้าต้องใช้ API key ให้ใช้ key สำหรับ free tier ชุดนี้โดยเฉพาะ ไม่ reuse credential จากระบบหลัก
- ไม่เขียนค่า 9Router ลง `~/.zshrc` หรือ global config ของ client ใด
- ใช้เฉพาะ provider แบบ no-auth หรือ free tier และตรวจสิทธิ์จริงจาก response ไม่ตัดสินจากชื่อโมเดลหรือ catalog อย่างเดียว
- เปิด API-key enforcement แม้จะรับเฉพาะ localhost

นี่เป็น free-only lane ไม่ใช่ gateway กลาง และไม่ควรถูกนำไปแทนระบบปัจจุบันโดยปริยาย

## Current Reality — 2026-08-03

| รายการ | ค่าปัจจุบัน |
| --- | --- |
| Container | `9router-free` |
| Image | `decolua/9router:0.5.45` |
| Image digest ตอนติดตั้ง | `sha256:b9c46bce1b16a0ec86a36ed3421c1d60111db394e2c164d4c0a21dcc835c44aa` |
| Dashboard | `http://127.0.0.1:20129/dashboard` |
| API base URL | `http://127.0.0.1:20129/v1` |
| Port binding | `127.0.0.1:20129` → container `20128` |
| Persistent data | `~/.9router-free/data/` |
| Docker environment | `~/.9router-free/docker.env` |
| Client credentials | `~/.9router-free/client.env` |
| API key name | `free-local` |
| Restart policy | `no` — เปิดเมื่ออยากใช้เท่านั้น |
| Custom models ที่เพิ่มอยู่ | `0` |
| Active provider connections | `3` — OpenRouter, Ollama Cloud และ NVIDIA NIM |

ไฟล์ `docker.env` และ `client.env` ตั้ง permission เป็น `600` แล้ว ห้ามคัดลอกค่าข้างในไปไว้ใน repo, screenshot, issue หรือเอกสารอื่น

ตอนติดตั้งครั้งแรกตรวจแล้วว่า:

- `/api/health` ตอบ `{"ok":true}`
- authenticated `/v1/models` ตอบ HTTP 200
- API-key enforcement เปิดอยู่
- `oc/mimo-v2.5-free` ตอบ `OK` ผ่าน Chat Completions API จริง

หลังจากนั้นมีการเพิ่ม connection สำหรับ free tier 3 ตัว ปัจจุบันจึง **ไม่ใช่ zero-credential instance แล้ว** 9Router เก็บ key ของ connection เหล่านี้ไว้ใน SQLite ใต้ `~/.9router-free/data/` แม้ API ที่ใช้ตรวจสถานะจะซ่อนค่าจริงก็ตาม

จากชื่อ provider และสถานะ connection อย่างเดียว ยืนยันไม่ได้ว่า key ทั้งสามเป็น key แยกจากบัญชีที่ใช้อยู่เดิมหรือไม่ ถ้าจะรักษา free-only boundary ให้ตรวจเองว่า OpenRouter, Ollama Cloud และ NVIDIA NIM ใช้ dedicated free-tier key ไม่ใช่ credential จากระบบหลัก

## ตอนนี้มีอะไรอยู่แล้ว

### Provider connections

| Provider | สถานะที่ตรวจพบ | สิทธิ์ที่เห็นจาก runtime |
| --- | --- | --- |
| OpenCode Free | ไม่ต้องสร้าง connection | no-auth catalog 7 โมเดล เรียกจริงได้บางตัว |
| OpenRouter | active API-key connection | live catalog 337 รายการ วันที่ตรวจพบราคา prompt/completion เป็นศูนย์ 17 รายการ แต่ shared free pool มี rate limit |
| Ollama Cloud | active API-key connection | live catalog 18 รายการ ทดสอบแล้วเข้า free tier ได้ 7 รายการ อีก 11 รายการตอบ subscription-required `403` |
| NVIDIA NIM | active API-key connection | live catalog 102 รายการภายใต้ NVIDIA Developer access แต่แต่ละ model อาจ timeout หรือไม่เปิดให้ account นี้ |

Ollama Cloud ที่ตอบ HTTP 200 ใน availability probe:

- `ollama/nemotron-3-super`
- `ollama/nemotron-3-nano:30b`
- `ollama/gpt-oss:20b`
- `ollama/minimax-m3`
- `ollama/gemma4:31b`
- `ollama/nemotron-3-ultra`
- `ollama/gpt-oss:120b`

อีก 11 รายการตอบว่าต้องมี subscription: `deepseek-v4-pro`, `qwen3.5:397b`, `kimi-k2.7-code`, `deepseek-v4-flash:0731`, `mistral-large-3:675b`, `kimi-k2.6`, `minimax-m2.7`, `glm-5.1`, `deepseek-v4-flash`, `kimi-k3` และ `glm-5.2`

การตอบ HTTP 200 จาก prompt สั้นพิสูจน์แค่ว่า account เรียก endpoint ได้ ยังไม่ใช่หลักฐานว่าโมเดลเหมาะกับ agent task ตาราง tier ด้านล่างใช้ benchmark prompt ที่ยากขึ้นอีกชั้น

### Custom models

`GET /api/models/custom` คืนค่าเป็นรายการว่าง หมายความว่าปัจจุบันไม่มี custom model ที่เพิ่มไว้

การไม่มี custom model ที่เพิ่มไว้ไม่ได้แปลว่าเรียกโมเดลไม่ได้เสมอไป provider ที่รองรับ passthrough หรือ live catalog ยังรับ model ID ตรงๆ ได้ ตัวอย่างเช่น benchmark เรียก `ollama/gemma4:31b` และ `oc/laguna-s-2.1-free` สำเร็จ แต่ถ้าต้องการให้ model โผล่ใน catalog ของ client อย่างชัดเจน ค่อย Add เฉพาะ roster ที่เลือกแล้ว

## Recommended roster

คำแนะนำนี้มาจาก runtime จริงของ instance นี้เมื่อ 2026-08-03 ไม่ได้จัด tier จากชื่อโมเดลหรือ benchmark สาธารณะอย่างเดียว

### Tier S — ควรเริ่มใช้

| Model | เหมาะกับงาน | หลักฐานและข้อจำกัด |
| --- | --- | --- |
| `ollama/gemma4:31b` | default ทั่วไป, งานสั้น, structured output, coding, reasoning และคำอธิบายไทย | ตอบครบใน 6.3 วินาที ผ่าน code test 4/4 และตอบ critical path ถูก เป็นตัวที่สมดุลที่สุดในรอบนี้ ข้อความไทยถูกสาระ แต่อ่านทวนก่อนใช้เป็น copy จริง |
| `ollama/minimax-m3` | งานทั่วไปที่ซับซ้อนขึ้น, coding, วิเคราะห์หลายเงื่อนไข และ fallback จาก Gemma | ตอบครบใน 21.5 วินาที ผ่าน code test 4/4 และ reasoning ถูก ช้ากว่า Gemma แต่รักษา instruction ได้ดีใน prompt ผสม |

### Tier A — เก่งเฉพาะทางหรือมี operational caveat

| Model | เหมาะกับงาน | หลักฐานและข้อจำกัด |
| --- | --- | --- |
| `oc/laguna-s-2.1-free` | implementation, แก้ฟังก์ชัน, refactor ขนาดเล็กถึงกลาง, structured JSON | ตอบครบใน 17.8 วินาที ผ่าน code test 4/4 และคำตอบเวลา `11.0` ถูกเชิงตัวเลข แต่ภาษาไทยมีคำเพี้ยนและจังหวะแปลก ไม่ควรใช้เขียน copy ไทย |
| `oc/mimo-v2.5-free` | งานที่ต้องคิดหลายขั้น, code + explanation, ไทย/อังกฤษ เมื่อรอได้ | รอบ `max_tokens: 1200` ใช้ budget ไปกับ reasoning จนไม่มี final answer แต่ retry ที่ `5000` ตอบครบใน 56.2 วินาที ผ่าน code test 4/4 และ reasoning ถูก ตั้ง output budget สูงและ retry แค่หนึ่งครั้ง |
| `ollama/nemotron-3-super` | coding และ logic ที่ไม่ต้องการ prose ไทย | ตอบครบใน 15.4 วินาที ผ่าน code test 4/4 และ reasoning ถูก แต่คำอธิบายไทยขัดกันเองช่วงต้น จึงไม่เหมาะกับงานสื่อสาร |
| `ollama/gpt-oss:120b` | structured coding หรือ reasoning ที่ยอมรอได้ | ตอบครบใน 47.1 วินาที ผ่าน code test 4/4 และ reasoning ถูก แต่ภาษาไทยมีคำทับศัพท์เพี้ยนและยาวเกินโจทย์ |

### Tier B — ใช้เฉพาะเมื่อรู้ข้อเสีย

| Model | เหมาะกับงาน | หลักฐานและข้อจำกัด |
| --- | --- | --- |
| `nvidia/deepseek-ai/deepseek-v4-pro` | ร่างคำอธิบายไทยหรือ prose ที่จะมีคนตรวจต่อ | ภาษาไทยรอบทดสอบอ่านลื่นกว่าหลายตัว แต่ code ผ่านแค่ 3/4 และตอบ critical path ผิด (`9` แทน `11`) ห้ามใช้ตัดสิน logic หรือ correctness โดยไม่มี verification |
| `ollama/gpt-oss:20b` | prompt สั้นมากและงานทดลอง | ตอบ `OK` ได้ราว 1 วินาที แต่ prompt ผสมใช้ 5,000 completion tokens แล้วไม่คืน final content ไม่เหมาะกับ agent task |
| `openrouter/openrouter/free` | ทดลอง availability แบบไม่สนใจ model identity | router เลือก upstream แบบไม่แน่นอน รอบทดสอบได้ Ling แล้วใช้ budget หมดโดยไม่มี final content ห้ามใช้เป็น fallback ที่ต้องการผลซ้ำได้ |

### Tier C — ยังไม่ควรใส่ใน roster

- `oc/deepseek-v4-flash-free`, `oc/ling-3.0-flash-free` และ `oc/big-pickle` — HTTP 200 แต่ไม่มี final content แม้เพิ่ม budget เป็น 5,000 tokens ใน prompt ที่ทดสอบ
- `oc/north-mini-code-free` — รอบแรกใช้ 118.9 วินาทีโดยไม่มีคำตอบ รอบ retry timeout ที่ 240 วินาที
- `oc/nemotron-3-ultra-free` — คืน scratchpad/placeholder code ที่ compile ไม่ผ่าน
- `ollama/nemotron-3-ultra` — prompt สั้นตอบได้ แต่ benchmark prompt timeout ที่ 180 วินาที
- NVIDIA `z-ai/glm-5.2` และ `minimaxai/minimax-m3` — timeout ที่ 180 วินาที
- NVIDIA `moonshotai/kimi-k2.6` — endpoint ตอบ `404` สำหรับ account นี้
- OpenRouter `google/gemma-4-31b-it:free` — shared upstream ตอบ `429` ในรอบทดสอบ

รายการข้างบนเป็นหลักฐานด้าน **ความพร้อมใช้งานผ่านเส้นทางนี้** ไม่ใช่คำตัดสินว่า base model คุณภาพต่ำ โมเดลที่ timeout, rate-limit, หมด reasoning budget หรือโดน subscription gate ยังไม่ได้รับการวัดคุณภาพอย่างเป็นธรรม

## เลือกโมเดลตามงาน

### งานทั่วไปและงานเร็ว

1. `ollama/gemma4:31b`
2. `ollama/minimax-m3`
3. `oc/laguna-s-2.1-free` ถ้างานเป็น code ชัดเจน

### Coding

1. `oc/laguna-s-2.1-free` — implementation ที่ requirement ชัด
2. `ollama/gemma4:31b` — default ที่เร็วและอธิบายผลได้
3. `ollama/minimax-m3` — fallback สำหรับโจทย์ซับซ้อน
4. `oc/mimo-v2.5-free` — ใช้เมื่อสามตัวแรกพลาดหรือโจทย์ต้อง reasoning ยาว

### Reasoning และ structured output

1. `ollama/gemma4:31b`
2. `ollama/minimax-m3`
3. `oc/mimo-v2.5-free` พร้อม `max_tokens` ประมาณ 5,000
4. `ollama/nemotron-3-super` ถ้าไม่ต้องการภาษาไทย

### ภาษาไทย

1. `ollama/gemma4:31b` — draft เร็ว
2. `oc/mimo-v2.5-free` — draft ที่ต้องคิดหลายชั้น แต่ช้า
3. `ollama/minimax-m3` — fallback
4. NVIDIA DeepSeek V4 Pro — ใช้ร่าง prose ได้ แต่ต้องแยกจากงาน logic และตรวจข้อเท็จจริงใหม่

ข้อความไทยสำหรับเผยแพร่ควรผ่าน kien-thai/review อีกชั้น ไม่มีผล benchmark ตัวไหนพิสูจน์ว่าเป็น Thai-native writer

### Fallback ที่แนะนำ

อย่าไล่ทุกโมเดลจนหมด free quota ใช้ fallback สั้นๆ ตามงาน:

```text
General: Gemma 4 31B -> MiniMax M3 -> Mimo V2.5
Coding:  Laguna S 2.1 -> Gemma 4 31B -> MiniMax M3 -> Mimo V2.5
Thai:    Gemma 4 31B -> Mimo V2.5 -> MiniMax M3
```

ถ้า Mimo ไม่มี final content ให้ retry ครั้งเดียวด้วย output budget สูงขึ้น ถ้ายังไม่สำเร็จให้หยุดแทนการวน provider ต่อแบบไร้ขอบเขต

## ขอบเขตของ benchmark

benchmark รอบนี้ใช้ prompt ผสมหนึ่งชุด ประกอบด้วย:

- ฟังก์ชัน JavaScript ที่มี executable tests 4 เคส
- dependency scheduling ที่คำตอบถูกคือ 11 นาที
- คำอธิบายภาษาไทยเรื่อง local gateway กับ local model
- JSON schema และ instruction-following gate

ใช้ `temperature: 0` แบบหนึ่งรอบต่อ model รอบแรกจำกัด `max_tokens: 1200` แล้ว retry เฉพาะ OpenCode reasoning-heavy บางตัวด้วย `5000` ส่วน Ollama shortlist ใช้ `5000` ตั้งแต่ต้น ผลจึงเป็น provisional routing evidence ไม่ใช่ universal model ranking

raw result เก็บแบบ local ไว้ที่:

```text
.agent-state/benchmarks/9router-free/2026-08-03-1205.json
.agent-state/benchmarks/9router-free/2026-08-03-ollama-probe.json
.agent-state/benchmarks/9router-free/2026-08-03-ollama-benchmark.json
```

availability, free quota และ upstream routing เปลี่ยนได้ ควรรัน smoke test ใหม่ก่อนผูก client หรือ workflow สำคัญ

## เริ่มและหยุดใช้งาน

instance นี้ไม่มี automatic restart ถ้า Docker หรือเครื่อง restart จะยังไม่กลับมาทำงานเอง

```bash
docker start 9router-free
docker stop 9router-free
```

ดูสถานะ:

```bash
docker ps --filter 'name=^/9router-free$'
```

ดู log ล่าสุด:

```bash
docker logs --tail 100 9router-free
```

เช็ก health:

```bash
curl http://127.0.0.1:20129/api/health
```

ผลปกติคือ:

```json
{"ok":true}
```

## เข้า Dashboard

เปิด:

```text
http://127.0.0.1:20129/dashboard
```

อ่านรหัสเริ่มต้นจากไฟล์ local โดยไม่เขียนค่าลง shell history:

```bash
grep '^INITIAL_PASSWORD=' "$HOME/.9router-free/docker.env" | cut -d= -f2-
```

ถ้าจะเปลี่ยนรหัส ให้เปลี่ยนผ่านหน้า Settings ใน Dashboard ค่าที่บันทึกแล้วอยู่ใน SQLite ใต้ `~/.9router-free/data/` และจะอยู่ต่อแม้สร้าง container ใหม่

## เรียก API

`client.env` มีตัวแปรสองตัว:

- `NINEROUTER_BASE_URL`
- `NINEROUTER_API_KEY`

โหลดค่าใน subshell เพื่อไม่ให้ค้างอยู่ใน shell หลัก:

```bash
(
  source "$HOME/.9router-free/client.env"

  curl "$NINEROUTER_BASE_URL/chat/completions" \
    -H "Authorization: Bearer $NINEROUTER_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "ollama/gemma4:31b",
      "messages": [
        {"role": "user", "content": "ตอบสั้นๆ ว่าใช้งานได้"}
      ],
      "max_tokens": 256,
      "stream": false
    }'
)
```

ถ้าจะส่งค่าให้ client ที่รองรับ OpenAI-compatible API ให้กำหนดเฉพาะคำสั่งนั้น:

```bash
(
  source "$HOME/.9router-free/client.env"

  OPENAI_BASE_URL="$NINEROUTER_BASE_URL" \
  OPENAI_API_KEY="$NINEROUTER_API_KEY" \
  your-command
)
```

อย่าเพิ่ม `OPENAI_BASE_URL` หรือ `OPENAI_API_KEY` ชุดนี้ลง `~/.zshrc` เพราะจะทำให้ client อื่นเปลี่ยนเส้นทางตามไปด้วย

## OpenCode Free models

OpenCode Free ดึงรายชื่อโมเดลแบบ dynamic รายการเปลี่ยนได้โดยไม่ต้องออก 9Router เวอร์ชันใหม่ วันที่ติดตั้งพบ 7 โมเดล:

- `oc/big-pickle`
- `oc/deepseek-v4-flash-free`
- `oc/mimo-v2.5-free`
- `oc/ling-3.0-flash-free`
- `oc/nemotron-3-ultra-free`
- `oc/north-mini-code-free`
- `oc/laguna-s-2.1-free`

ถ้าต้องการดูรายการปัจจุบัน ให้เปิดหน้า OpenCode Free ใน Dashboard อย่ายึดรายการข้างบนเป็น contract ระยะยาว

### Free ไม่ได้แปลว่า local หรือ private

9Router รันอยู่ในเครื่องเรา แต่ prompt และไฟล์ที่ส่งเข้าโมเดลจะออกไปยัง OpenCode upstream ตามปกติ อย่าส่ง secret, source code ลูกค้า หรือข้อมูลส่วนตัวเพียงเพราะโมเดลใช้ได้ฟรี

free tier อาจเปลี่ยน model, rate limit หรือยุติบริการได้ตลอด ถ้างานสำคัญต้องพึ่งโมเดลใด ให้ตรวจ availability ใหม่ก่อนทุกครั้ง

### เรื่องที่ทำให้สับสนได้

`GET /v1/models` แสดง static catalog ขนาดใหญ่ของ 9Router ด้วย จึงอาจเห็น Claude, Gemini, OpenAI หรือ provider อื่นที่ connection ปัจจุบันไม่มีสิทธิ์เรียกจริง

การเห็นชื่อโมเดลใน catalog **ไม่ได้แปลว่าเรียกใช้งานได้** free-only boundary ของเราต้องยืนยันจากสองอย่าง:

1. connection ที่มี key ต้องเป็น dedicated free-tier key และไม่ reuse credential จากระบบหลัก
2. เรียกเฉพาะโมเดลที่ทดสอบสิทธิ์ free access แล้ว ไม่ใช่เลือกจากชื่อใน catalog

## ตรวจว่า instance ยังแยกจากระบบหลัก

เช็ก network binding:

```bash
docker inspect 9router-free \
  --format '{{(index (index .NetworkSettings.Ports "20128/tcp") 0).HostIp}}:{{(index (index .NetworkSettings.Ports "20128/tcp") 0).HostPort}}'
```

ค่าที่ต้องได้คือ:

```text
127.0.0.1:20129
```

เช็ก mount:

```bash
docker inspect 9router-free \
  --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'
```

ข้อมูลต้องชี้จาก `~/.9router-free/data` ไป `/app/data` เท่านั้น

เช็กว่า secret ยังมี permission ถูกต้อง:

```bash
stat -f '%Lp %N' \
  "$HOME/.9router-free/docker.env" \
  "$HOME/.9router-free/client.env"
```

ทั้งสองไฟล์ต้องขึ้นต้นด้วย `600`

## Backup

backup นี้รวมทั้งฐานข้อมูลและ secret ต้องเก็บเหมือน credential:

```bash
umask 077
tar -C "$HOME" \
  -czf "$HOME/9router-free-backup-$(date +%Y%m%d-%H%M%S).tgz" \
  .9router-free
```

หยุด container ก่อน backup ถ้าต้องการ snapshot ของ SQLite ที่นิ่งแน่นอน:

```bash
docker stop 9router-free
# รันคำสั่ง backup ด้านบน
docker start 9router-free
```

## อัปเดต image

อย่าใช้ `latest` โดยไม่ตรวจเวอร์ชันก่อน ให้กำหนด tag ใหม่ชัดเจน แล้ว reuse data และ env เดิม

```bash
NEW_VERSION='0.5.46' # เปลี่ยนเป็นเวอร์ชันที่ตรวจแล้ว

docker pull "decolua/9router:$NEW_VERSION"
docker stop 9router-free
docker rm 9router-free

docker run -d \
  --name 9router-free \
  --init \
  --env-file "$HOME/.9router-free/docker.env" \
  -p 127.0.0.1:20129:20128 \
  -v "$HOME/.9router-free/data:/app/data" \
  --label 'mahiro.purpose=free-only-ai-router' \
  "decolua/9router:$NEW_VERSION"
```

หลังอัปเดตให้เช็ก health, API-key enforcement และยิง smoke test กับ free model อย่างน้อยหนึ่งตัว อย่าลบ image เก่าจนกว่าจะยืนยันว่า data migration และ request path ยังทำงานปกติ

## ถอนการติดตั้ง

### ลบเฉพาะ runtime แต่เก็บข้อมูลไว้

```bash
docker stop 9router-free 2>/dev/null || true
docker rm 9router-free
```

ข้อมูลและ secret ยังอยู่ที่ `~/.9router-free/` สามารถสร้าง container ใหม่จาก run command ในหัวข้ออัปเดตได้

### ลบ image ที่ไม่ใช้แล้ว

```bash
docker image rm decolua/9router:0.5.45
```

Docker จะปฏิเสธถ้ายังมี container ใช้ image นี้อยู่

### ลบทุกอย่าง

ขั้นตอนนี้ย้อนกลับไม่ได้ ให้ backup ก่อนและตรวจ path ทุกครั้ง:

```bash
test -d "$HOME/.9router-free/data" && \
  test -f "$HOME/.9router-free/docker.env" && \
  printf 'Ready to remove: %s\n' "$HOME/.9router-free"
```

เมื่อยืนยันเองแล้วจึงค่อยลบ:

```bash
rm -rf -- "$HOME/.9router-free"
```

อย่ารวมคำสั่งตรวจและคำสั่งลบไว้ในบรรทัดเดียว เผื่อมี path หรือ state ผิดจากที่คาด

## Troubleshooting

### Port `20129` ถูกใช้อยู่

```bash
lsof -nP -iTCP:20129 -sTCP:LISTEN
```

ถ้าเป็น `9router-free` อยู่แล้ว ให้ใช้ container เดิมแทนการสร้างซ้ำ ถ้าเป็น process อื่น อย่าฆ่า process ทันที ให้เลือก host port ใหม่และแก้ base URL ใน `client.env` ให้ตรงกัน

### API ตอบ `401 API key required`

ตรวจว่า request ส่ง key จาก `client.env`:

```bash
(
  source "$HOME/.9router-free/client.env"
  curl "$NINEROUTER_BASE_URL/models" \
    -H "Authorization: Bearer $NINEROUTER_API_KEY"
)
```

### โมเดลอยู่ใน catalog แต่เรียกไม่ได้

ตรวจ prefix และสิทธิ์ของ provider ก่อน สำหรับ OpenCode Free ให้ใช้ `oc/` และอ้างอิง dynamic catalog ล่าสุด ส่วน OpenRouter, Ollama Cloud และ NVIDIA NIM ต้องอ้างอิง catalog ของ connection นั้น แล้วตรวจ free access จาก request จริง อย่าตัดสินจาก suffix `-free` อย่างเดียว

### Container เปิดแต่ health ไม่ผ่าน

```bash
docker logs --tail 200 9router-free
docker inspect 9router-free --format '{{json .State}}'
```

อย่าลบ `~/.9router-free/data` เพื่อแก้ปัญหาแบบลองผิดลองถูก เพราะในนั้นมีทั้ง database, API key และการตั้งค่าของ instance นี้
