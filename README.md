# SONGKHLA AdminFlow
> **ระบบต้นแบบสนับสนุนการจัดการข้อมูลและการประสานงานภาครัฐ**  
> *Prototype Digital Innovation for Public-Sector Information Management and Coordination*

[![Vercel Deployment Ready](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?logo=vercel)](https://vercel.com)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 📌 สถานะโครงการ (Project Status & Disclaimer)
**DEMO • ข้อมูลสมมติ • ยังไม่ใช่ระบบราชการจริง**  
โครงงานนี้เป็นผลงานนวัตกรรมต้นแบบแนวคิด (Student Innovation Prototype) ที่จัดทำขึ้นเพื่อการศึกษาและการนำเสนอผลงานทางวิชาการ มิใช่ระบบงานราชการจริงของศาลากลางจังหวัดสงขลา และไม่มีการเชื่อมต่อกับฐานข้อมูลลับหรือระบบสารบรรณอิเล็กทรอนิกส์จริง ข้อมูลทั้งหมดเป็นข้อมูลจำลอง (Fictional Demo Data)

---

## 🚀 วิธีการนำขึ้น GitHub และรันบน Vercel (Step-by-Step)

### 1. วิธีการนำโค้ดขึ้น GitHub (Push to GitHub)

1. เปิด [GitHub.com](https://github.com) และกด **New Repository**
2. ตั้งชื่อ Repository เช่น `songkhla-adminflow` (เลือก Public หรือ Private ตามต้องการ)
3. รันคำสั่งต่อไปนี้ใน Terminal เพื่อเชื่อมโยงและ Push โค้ด:

```bash
# 1. เชื่อมต่อกับ Repository ของคุณบน GitHub (แทนที่ <YOUR_USERNAME> ด้วย username ของคุณ)
git remote add origin https://github.com/<YOUR_USERNAME>/songkhla-adminflow.git

# 2. ทำการ Push ขึ้น branch main
git push -u origin main
```

*(หากมีการแก้ไขไฟล์เพิ่มเติมในภายหลัง: `git add .` -> `git commit -m "update"` -> `git push`)*

---

### 2. วิธีการรันและ Deploy บน Vercel (Deploy to Vercel)

โปรเจกต์นี้ได้รับการตั้งค่าไฟล์ `vercel.json` สำหรับ Vite SPA ไว้เรียบร้อยแล้ว:

#### วิธีที่ 1: ผ่าน Vercel Dashboard (แนะนำที่สุด - ง่ายและอัปเดตอัตโนมัติ)
1. เข้าไปที่ [vercel.com](https://vercel.com) แล้วเข้าสู่ระบบด้วยบัญชี GitHub ของคุณ
2. คลิกปุ่ม **"Add New..."** ➔ เลือก **"Project"**
3. ค้นหาและกด **"Import"** Repository `songkhla-adminflow` ที่เพิ่ง Push ขึ้นไป
4. Vercel จะตรวจจับการตั้งค่าอัตโนมัติ:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. กดปุ่ม **"Deploy"** 
6. รอประมาณ 30-45 วินาที ระบบจะสร้างลิงก์เว็บไซต์พร้อมใช้งาน เช่น `https://songkhla-adminflow.vercel.app` 🎉

#### วิธีที่ 2: ผ่าน Vercel CLI (สำหรับสาย Command Line)
```bash
# ติดตั้ง Vercel CLI และ Deploy ทันที
npx vercel

# เมื่อต้องการ Deploy ขึ้น Production
npx vercel --prod
```

---

## 💻 การรันบนเครื่อง Local (Local Development)

```bash
# ติดตั้ง dependencies
npm install

# รันโหมด Development (เปิดที่ http://localhost:3000)
npm run dev

# ทดสอบ Build เป็น Production Files
npm run build

# ทดสอบรันไฟล์ Build (Preview)
npm run preview
```

---

## 🛠️ โครงสร้างไฟล์สำคัญสำหรับ Vercel
- `vercel.json`: กำหนด routing rewrite เพื่อรองรับ Single Page Application (SPA) บน Vercel
- `vite.config.ts`: ปรับแต่ง alias และ bundler ให้พร้อมสำหรับ production build
- `.gitignore`: ยกเว้น `.vercel/`, `node_modules/`, `dist/` จาก git repository
- `package.json`: มี scripts `build`, `dev`, `preview` ครบถ้วน
