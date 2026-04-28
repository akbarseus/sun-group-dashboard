# SUN Group — Integrated Clean Energy Dashboard

Platform monitoring terintegrasi untuk Solar PV, EV Fleet, dan BESS.

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat
- Node.js versi 18 ke atas → https://nodejs.org
- npm (sudah termasuk dalam Node.js)

### Langkah-langkah

```bash
# 1. Masuk ke folder project
cd sun-group-app

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser dan akses: **http://localhost:5173**

---

## 🏗️ Build untuk Production

```bash
npm run build
```

Hasil build tersimpan di folder `dist/` — siap untuk di-hosting.

---

## ☁️ Opsi Hosting (Gratis)

### A. Vercel (Paling mudah, direkomendasikan)
1. Daftar di https://vercel.com
2. Install Vercel CLI: `npm install -g vercel`
3. Jalankan di folder project: `vercel`
4. Ikuti instruksi di terminal → URL live otomatis tersedia

### B. Netlify (Drag & drop)
1. Jalankan `npm run build`
2. Buka https://app.netlify.com
3. Drag & drop folder `dist/` ke halaman Netlify
4. URL live langsung aktif

### C. GitHub Pages
1. Push project ke GitHub repository
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Tambahkan ke package.json scripts:
   ```
   "deploy": "gh-pages -d dist"
   ```
4. Tambahkan ke vite.config.js:
   ```
   base: '/nama-repo/'
   ```
5. Jalankan: `npm run build && npm run deploy`

---

## 📁 Struktur Project

```
sun-group-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx        ← Entry point React
│   └── App.jsx         ← Seluruh aplikasi (Login + Dashboard)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Teknologi

| Stack       | Versi     |
|-------------|-----------|
| React       | 18.x      |
| Vite        | 5.x       |
| Recharts    | 2.x       |
| Lucide React| 0.383.0   |

---

## 🔑 Login Demo

Gunakan **email dan password apapun** untuk masuk ke dashboard demo.

---

## 📌 Roadmap (Next Steps)

- [ ] Integrasi API backend SUN Energy (Solar PV live data)
- [ ] Integrasi API SUN Mobility (EV Fleet)
- [ ] Date range filter (7 hari / 30 hari / custom)
- [ ] Export PDF laporan ESG
- [ ] Multi-site support
- [ ] Alert system real-time
- [ ] Role-based access (PIC Operasional vs Management)

---

© 2026 SUN Group. All rights reserved.
