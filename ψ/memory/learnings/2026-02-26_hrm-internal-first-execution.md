# Learning: HRM internal-first execution beats generic roadmap

## Pattern
เมื่อผู้ใช้กำลังเริ่มโปรดักต์ใหม่ที่มีหลายทิศทาง (เช่น HRM + โปรเจกต์ต่อยอดเชิงพาณิชย์) วิธีที่ให้ผลดีที่สุดคือบังคับให้เกิดลำดับชัดเจนก่อน: project list -> priority wave -> MVP scope -> handoff ที่ executable

## Why it worked
- ลด cognitive load: จากไอเดียกว้างเหลือเป้าหมายเดียวที่ลงมือได้ทันที
- เร็วต่อการตัดสินใจ: internal-first ทำให้ requirement จริงชัดกว่า market assumption
- ลดการสะดุดข้าม session: handoff + plan ช่วยรักษาความต่อเนื่องของทีม

## Practical rule
1. หากโจทย์เริ่มกว้าง ให้ปิดด้วยลิสต์โปรเจกต์และจัดลำดับก่อนทุกครั้ง
2. เลือกหนึ่ง core project แล้วเขียน MVP plan ให้ลงมือได้ใน 6-8 สัปดาห์
3. บังคับให้มี artifact จริงเสมอ (markdown plan, handoff, next-session checklist)

## Application to this repo
- Core project ที่ล็อกแล้ว: HRM (internal-first -> SaaS-ready)
- Artifact สำคัญ: `ψ/active/hrm-mvp-plan.md` และ `ψ/inbox/handoff/2026-02-26_15-07_hrm-next-session.md`
- Next execution: bootstrap `ψ/incubate/haabiz/haabiz-hrm-fe` และทำ vertical slice แรก
