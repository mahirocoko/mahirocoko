# Thai Whisper Studio

Mini app สำหรับลองพูดภาษาไทยลงไมค์แล้วส่งเข้า `whisper.cpp` เพื่อถอดออกมาเป็นข้อความ

## สิ่งที่มี

- อัดเสียงจากไมค์ในเบราว์เซอร์
- แปลงเสียงเป็นไฟล์ `wav` ฝั่ง client
- ส่งไปที่ `whisper-server`
- แสดงข้อความถอดเสียงพร้อมเวลาที่ใช้

## เริ่มใช้งาน

จาก `apps/thai-whisper-studio`

```bash
pnpm install
pnpm whisper:setup
```

เปิด `whisper-server` ไว้อีก terminal หนึ่ง:

```bash
pnpm whisper:server
```

แล้วค่อยเปิด mini app:

```bash
pnpm dev
```

จากนั้นเข้าเบราว์เซอร์ที่ URL ของ Vite แล้วกดเริ่มอัดเสียง

## หมายเหตุ

- ตอนนี้ app ตั้งค่าให้ใช้โมเดล `small` แบบหลายภาษา (`ggml-small.bin`) เป็นค่าเริ่มต้นเพื่อให้ภาษาไทยแม่นขึ้นกว่า `base`
- ถ้าอยากลองให้เบาลง ค่อยเปลี่ยนกลับเป็น `base` ได้ใน `package.json`
- dev server จะ proxy `/api/whisper/*` ไปที่ `http://127.0.0.1:8080`
- ถ้าจะเช็กคุณภาพโค้ด ใช้ `pnpm lint` และ `pnpm build`
