# Lesson: Terminal path opening is a layered contract

**Date**: 2026-08-21
**Tags**: letta-code, herdr, ghostty, vscode, launchservices, osc8, local-mod, file-links

เวลา path จาก coding agent กดเปิดผิดหรือเปิดไม่ได้ อย่าเริ่มจากเปลี่ยน default app หรือแก้ renderer ทันที ให้แยก ownership ตามลำดับ: ข้อความต้นทางสร้าง path แบบไหน, TUI ปล่อย OSC-8 หรือไม่, multiplexer รักษา metadata ไว้หรือเปล่า, terminal ใช้ link detector ตัวใด และ macOS เลือก app จาก UTI อะไร

หลักฐานจาก Letta Code 0.30.28 ใน Herdr/Ghostty:

- `Read(...)` tool card ถือ path ครบและเปิดได้ แต่ไม่ได้พิสูจน์ว่า assistant Markdown ใช้กลไกเดียวกัน
- `InlineMarkdownRenderer` แสดง Markdown link เป็น `label (target)` และไม่มี OSC-8 สำหรับ link นั้น
- path เต็มที่ชี้ไฟล์จริงเปิดได้ ส่วน `:line` และ `:line:column` ทำให้ terminal/system opener มองเป็นชื่อไฟล์ที่ไม่มีอยู่
- specific UTI มี priority เหนือ generic role จึงต้องตรวจ JSON, Markdown, JavaScript, Python และชนิดอื่นแยกจาก `public.source-code`

เมื่อ scope เป็น local-only และไม่รับ runtime patch ให้ใช้ contract ที่ซื่อสัตย์และทน update:

1. แสดงไฟล์หนึ่งครั้งเป็น path ที่ resolve ได้ครบ
2. ใช้ `~/...` สำหรับไฟล์ใต้ `/Users/mahiro`
3. ไม่ใช้ relative path ที่อาศัย inner pane cwd
4. ไม่เติม line suffix ใน path ให้เขียน `line N` แยก
5. อย่าอ้างว่า click จะ focus line ถ้ายังไม่ได้ใช้ editor-aware handler หรือ hidden OSC-8 target

ถ้า Mahiro ย้ำว่า “ห้ามแก้ upstream” ให้ถอน upstream worktree/diff ก่อน แล้วหา local mod, OS association หรือ terminal-layer solution ใหม่ตั้งแต่ต้น

RRR ของ cross-repo debugging ต้องอยู่กับเจ้าของบทเรียน ไม่ใช่ repo ที่ใช้ตรวจ source ชั่วคราว เคสนี้ artifact owner คือ `mahirocoko` เพราะเป็น workflow และ machine integration ส่วนตัว ส่วน `letta-code` เป็น upstream evidence source เท่านั้น จึงต้องไม่มี session commit รอ push อยู่ที่นั่น
