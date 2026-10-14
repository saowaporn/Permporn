# PERMPORN ACCESSORIES

เว็บไซต์ภาษาไทย–อังกฤษ โทนดำ ทอง ขาว จำนวน 11 หน้า ใช้ข้อมูลจาก `content/source-documents/01.md`–`10.md` พร้อมภาพประกอบ AI 5 ภาพ

หน้าเว็บเปิด `index.html` หรือใช้ VS Code Live Server ได้ ระบบส่งฟอร์มอีเมลใช้ Node.js บน Vercel และบัญชีอีเมล Google

```text
npm install
npm run build
npm test
python scripts/check-site.py
```

แก้ข้อความสองภาษาใน `content/site-content.cjs` และโครงหน้าใน `scripts/build-site.cjs` จากนั้นสร้าง HTML ใหม่ด้วยคำสั่งด้านบน ปรับดีไซน์ใน `assets/styles.css` และพฤติกรรมใน `assets/site.js`

นำขึ้น Vercel จากโปรเจกต์หลักโดยใช้ `vercel.json` ไฟล์หน้าเว็บอยู่ใน `dist/` และระบบรับฟอร์มอยู่ใน `api/inquiry.js` ตั้งค่า Google ใน Environment Variables ตาม [คู่มือเปิดระบบอีเมล](content/vercel-email-setup.md) ก่อนเปิดรับคำขอจริง เอกสารต้นทางและข้อมูลตรวจทานภายในไม่รวมใน `dist/`

ฟอร์มส่งรายละเอียดทั้งหมดถึง `contact@permporn-accessories.com` ผ่าน Google SMTP พร้อมปุ่มเปิดแอปอีเมลที่กรอกข้อความให้โดยอัตโนมัติ ไม่มีขั้นตอนคัดลอก/วางข้อความ ปุ่มติดต่อลอยเลือก LINE, WhatsApp, Facebook และ Email ได้ หน้าติดต่อมีแผนที่ตามลิงก์ที่เจ้าของให้มาและการเข้าพบยังต้องนัดหมายล่วงหน้า

รายละเอียดแหล่งข้อมูลและรายการรอยืนยัน: [Website handoff](content/website-handoff.md)

รายละเอียดภาพและ prompts: [Image generation](content/image-generation.md)
