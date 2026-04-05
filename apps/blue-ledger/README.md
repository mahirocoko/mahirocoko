# Blue Ledger

แอปบันทึกรายจ่ายแบบ full-stack เล็ก ๆ ในแพ็กเกจเดียว: **React Router (framework mode) + Vite** + **React + TypeScript** ฝั่ง UI, **Tailwind CSS**, ปุ่มและคอมโพเนนต์ชั้น UI แบบ shadcn ที่ห่อด้วย **Base UI**, **Hono** ฝั่ง API

## ความสามารถ

- เพิ่มรายจ่าย: ชื่อรายการ, จำนวนเงิน, หมวด, วันที่, โน้ต (ไม่บังคับ)
- รายการเรียงจากวันที่ล่าสุด
- สรุป: ยอดรวม, จำนวนรายการ, รายการในช่วง 30 วันล่าสุด, หมวดที่ใช้เงินมาก
- ข้อมูลเก็บในหน่วยความจำของเซิร์ฟเวอร์ (รีสตาร์ทแล้วหาย)
- สำเนาภาษาไทยเป็นหลัก

## คำสั่ง

```bash
pnpm install
```

พัฒนา (Hono ที่พอร์ต `8787` + React Router dev server พร้อม proxy `/api`):

```bash
pnpm run dev
```

แยกรันถ้าต้องการ:

```bash
pnpm run dev:api
pnpm run dev:web
```

Build + typecheck (โปรเจกต์อ้างอิงทั้งหมด):

```bash
pnpm run build
```

ตรวจชนิดอย่างเดียว:

```bash
pnpm run typecheck
```

สร้างไฟล์ type ของ route (ถ้า IDE หรือ `tsc` ต้องการ `.react-router/types` หลัง clone ใหม่):

```bash
pnpm run typegen
```

Production — ให้บริการ API และไฟล์ใน `build/client/` ที่พอร์ตเดียวกัน (ค่าเริ่มต้น `8787`):

```bash
pnpm run start
```

Lint:

```bash
pnpm run lint
```

## โครงสร้างหลัก (React Router framework)

- `react-router.config.ts` — คอนฟิกแอป framework (`ssr: false`, `appDirectory: src`)
- `src/routes.ts` — ประกาศเส้นทาง (ชี้ไปที่โมดูลใต้ `src/routes/`)
- `vite.config.ts` — ปลั๊กอิน `@react-router/dev/vite` + Tailwind พร้อม proxy `/api`
- `src/entry.client.tsx` — จุดเข้าไคลเอนต์ (`HydratedRouter` จาก `react-router/dom`)
- `src/root.tsx` — โมดูล root ของ framework (นำเข้า `index.css` + shell หลัก)
- `src/routes/` — โมดูลเส้นทาง (`home-page`, `$.tsx` สำหรับ splat ไป `/`, `root-layout`)
- `src/components/` — ฟอร์ม รายการ สรุป + `components/ui/*` (Base UI)
- `src/lib/expense-categories.ts` — หมวดแนะนำเริ่มต้น
- `src/server/` — Hono + in-memory store
- `src/shared/expense.ts` — ชนิดข้อมูลที่ใช้ร่วมกับ API

## หมายเหตุ

- `pnpm run preview` ของ Vite เป็นเฉพาะไคลเอนต์ค้าง ไม่มี API — ใช้ `pnpm run start` หลัง `pnpm run build` หากต้องการทดสอบครบสแต็ก
- โฟลเดอร์ `src/features/` ถูกตั้งใจไม่ให้เข้า typecheck/lint (ของเก่าหรือทดลอง) — ลบได้ถ้าไม่ใช้แล้ว
- โหมด `ssr: false` — เราเตอร์และเพจรันบนไคลเอนต์; Hono ยังคงให้ API และใน production ให้บริการสแตติกจาก `build/client/`
