# Commit-all still respects artifact boundaries

Tags: `git`, `rrr`, `artifact-promotion`, `generated-assets`, `qa-evidence`, `repo-hygiene`

## Durable lesson

เมื่อ Mahiro ขอ “commit ทั้งหมด” ให้ตีความว่า commit ทุก meaningful non-ignored artifact ที่อยู่ใน scope หลังตรวจ secret, size และ provenance แล้ว ไม่ใช่ force-add ทุกไฟล์ที่อยู่บนดิสก์

สำหรับ frontend lab หนึ่งชุด ไฟล์ที่ควรเข้าประวัติอาจรวม:

- source/runtime code และ package lock
- accepted generated source assets พร้อม provenance
- promoted runtime asset copies
- manifests, design brief และ final QA evidence
- retrospective, durable lesson และ derived pulse snapshots เมื่อผู้ใช้ขอ `/rrr` พร้อม commit

แต่ยังต้องกันสิ่งที่ reproducible หรือ session-local ออก:

- `node_modules/`
- `dist/`
- coverage output
- `.playwright-cli/` logs/snapshots
- credentials, `.env`, private keys และ token material

## Procedure

1. อ่าน repo guidance และ nested `.gitignore`
2. ใช้ `git ls-files --others --exclude-standard` เพื่อดู candidate จริง
3. ตรวจจำนวนไฟล์, total size, unusually large files และ secret-like names/content
4. อ่าน provenance/manifest/README เพื่อยืนยันว่า generated assets และ QA captures เป็น intended history
5. เขียน `/rrr` artifacts ก่อน commit แล้ว regenerate pulse
6. stage explicit top-level paths แต่เชื่อ `.gitignore`; ห้าม force-add ignored state โดยไม่มีคำสั่งเฉพาะ
7. ตรวจ staged diff/status อีกครั้งก่อน commit

## Why it matters

วิธีนี้รักษาทั้งเจตนาของผู้ใช้และความสะอาดของ repository: งานสำคัญไม่ตกหล่น แต่ dependency trees, build output และ browser-session caches ไม่กลายเป็น permanent history โดยอุบัติเหตุ

