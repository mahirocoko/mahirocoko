# Inline SVG Is The Stable Path For Figma HTML Capture

เมื่อ prototype HTML ถูกใช้เป็นสะพานไปยัง Figma ผ่าน HTML-to-design capture ความเสถียรของ artifact สำคัญกว่าความสะดวกใน browser อย่างเดียว บทเรียนรอบนี้ชัดมากว่า icon ที่ต้องการให้ Figma เห็นและแปลงได้สม่ำเสมอควรอยู่ใน DOM เป็น inline SVG จริง พร้อม path ตรงๆ ไม่ใช่ CSS mask, background image, หรือ `<use>` sprite reference

อาการ `pending` ใน capture ไม่ได้แปลว่าปัญหาอยู่ที่ converter เสมอไป รอบนี้มีทั้งปัญหา representation ของ icon และปัญหา local URL path ที่ไม่ตรงกับ server root การเช็ก path ของ server ควรเป็นหนึ่งในขั้นตอนแรกสุดของการ debug ไม่ใช่ไปโฟกัสที่ rendering layer อย่างเดียว

สรุปเป็น pattern ได้ว่า ถ้าจะใช้ HTML prototype เป็น source ของ Figma capture:
- ใช้ inline SVG ตรงๆ สำหรับ icon ที่มองเห็น
- ทำ DOM ให้ตรงไปตรงมาที่สุด
- เช็ก server root กับ target URL ให้ตรงก่อนเปิด hash capture URL
- พอได้ candidate หลักแล้ว ให้รีบ converge และ sync เวอร์ชันเดียวที่เชื่อถือได้กลับเข้า Figma
