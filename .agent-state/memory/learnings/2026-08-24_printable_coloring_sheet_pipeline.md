# Lesson: Printable coloring sheets need intent and alpha gates

**Date**: 2026-08-24
**Tags**: imagegen, coloring-page, a4, print, cut-sheet, alpha, visual-qa, codex

คำขอว่า “ทำรูปสัตว์ลง A4” ยังไม่พอสำหรับเริ่ม generation หลาย call เพราะมีอย่างน้อยสี่รูปแบบที่ต่างกันมาก

1. สัตว์หนึ่งตัวเต็มหนึ่งหน้า
2. หลายฉากย่อเป็น contact sheet
3. หลายสัตว์แยกช่องสำหรับตัด
4. หลายสัตว์ลอยโดยไม่มีกรอบเพื่อให้ตัดตาม silhouette

ก่อนเริ่มให้ล็อก theme, จำนวนสัตว์, grid, cut-guide, ความซับซ้อนตามอายุ และ whether each animal should be isolated. เมื่อมีหลายตัว ให้ generate แยกหนึ่งสัตว์ต่อหนึ่ง hosted call แล้วประกอบ grid แบบ deterministic ภายหลัง วิธีนี้ลด duplicate, collision, anatomy crop และช่องที่ขนาดไม่เท่ากันได้มากกว่าการขอ provider วาด grid ทั้งหน้าโดยตรง

PNG จาก image provider อาจไม่ได้เป็นเส้นดำ opaque บนพื้นขาว แม้ preview จะดูเหมือน line art บางไฟล์ใช้ black RGB กับ alpha หลายระดับ เมื่อ flatten ตามปกติจึงเกิด gray fill และถ้า threshold ก่อน flatten เส้นทั้งตัวอาจหาย ลำดับที่ปลอดภัยคือ

1. Preserve immutable provider raw
2. Flatten alpha onto an explicit white background
3. Trim transparent/white padding
4. Resize into the target cell
5. Convert to grayscale and apply the chosen threshold onlyเมื่อ visual evidence แสดงว่าต้องลบ gray fill
6. Add cut guide after threshold so guide can remain light gray
7. Compose the exact A4 pixel canvas and set 300 DPI metadata
8. Verify PDF page size independently

การ QA ต้องเปิดทั้ง full A4 และแต่ละ row/cell ที่ readable scale เพราะภาพรวมอาจทำให้ gray fill, เส้นหาย, นิ้ว/หางผิด หรือ crop เล็ก ๆ มองไม่เห็น Command exit code, file count, DPI และ PDF geometry เป็น mechanical evidence เท่านั้น ไม่แทน visual acceptance ของ Mahiro

ถ้า hosted call ตัวเดียวถูก output-safety ปฏิเสธ ให้รักษา source ที่สำเร็จแล้วและใช้ bounded replacement animal ที่ยังตรงกับ theme แทนการ restart ทั้ง batch บันทึก substitution ใน manifest และรอ human acceptance ก่อนเรียกชุดนั้นว่า accepted
