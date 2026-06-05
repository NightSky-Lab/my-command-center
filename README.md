# 🕌 MyPI Command Center

**Pusat Pengurusan Pendidikan Islam Digital** — sebuah dashboard CMS penuh untuk guru / Ketua Panitia menguruskan dokumen, program, evidens, analisis, prompt AI dan banyak lagi, **tanpa perlu menyentuh kod sumber**.

Dibina dengan **Next.js 15 · React · TypeScript · Tailwind CSS · komponen ala-shadcn · Supabase · Recharts · Lucide Icons**.

---

## 🚀 Pasang Salinan Anda Sendiri (Satu Klik)

Mahu sistem ini untuk diri/sekolah anda sendiri? Klik butang di bawah — salinan akan disalin ke akaun anda + terbit ke pelayan anda sendiri. **Data 100% milik anda.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNightSky-Lab%2Fmy-command-center&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Kunci%20Supabase%20(Project%20URL%20%26%20anon%20public%20key)&project-name=my-command-center&repository-name=my-command-center)

📖 **Panduan penuh langkah demi langkah:** lihat **[`PASANG-SENDIRI.md`](./PASANG-SENDIRI.md)** (Bahasa Melayu, ~10 minit, percuma).

---

## ✨ Ciri Utama

- **Dashboard padan rujukan** — hero banner, panel pengumuman, 6 kad statistik (dengan animasi *count-up*), program akan datang, dokumen terkini, galeri evidens, carta prestasi (Recharts), status pemantauan, pintasan pantas & AI Hub.
- **CMS Penuh (tanpa coding)** — panel admin di `/admin` membolehkan **Tambah / Edit / Padam / Eksport** untuk: menu, pengumuman, statistik, program, dokumen, evidens, prestasi, pemantauan, pautan, kategori & prompt AI, dan acara kalendar.
- **Dashboard Customizer** — tukar **nama organisasi, slogan, banner, motto, dan 5 warna tema** terus dari panel admin dengan **pratonton langsung**.
- **Dark / Light / Auto** — togol tema pada bar atas (next-themes).
- **Carian Global** — tekan `Ctrl/⌘ + K` untuk cari dokumen, program, evidens, pengumuman & prompt.
- **Kalendar penuh**, **galeri evidens dengan modal**, **AI Hub** (salin prompt, tapis kategori, kegemaran).
- **Responsif** — desktop, tablet & mobile (sidebar bertukar menjadi laci/drawer).
- **Supabase** sebagai sumber data + **fallback data contoh** supaya laman tetap memaparkan reka bentuk walaupun sebelum pangkalan data disambung.

---

## 🧱 Susun Atur Folder

```
website Aah chat gbt/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # Root layout (theme + app shell)
│  │  ├─ page.tsx              # Dashboard utama
│  │  ├─ admin/page.tsx        # Panel Admin (CMS)
│  │  ├─ dokumen/ program/ analisis/ evidens/
│  │  ├─ rujukan/ ai-hub/ link/ kalendar/ pemantauan/
│  │  ├─ tugasan/ rph/         # Modul sokongan
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ ui/                   # Primitif ala-shadcn (button, card, dialog…)
│  │  ├─ layout/               # top-nav, sidebar, mini-calendar, search…
│  │  ├─ dashboard/            # Bahagian-bahagian dashboard
│  │  ├─ modules/              # Paparan modul (dokumen, evidens, ai-hub, kalendar)
│  │  ├─ admin/                # CrudManager, BrandingForm, AdminPanel
│  │  ├─ brand/               # Emblem SVG (kubah masjid, tanglung, gerbang)
│  │  └─ providers/           # ThemeProvider, ThemeVars
│  └─ lib/
│     ├─ types.ts             # Jenis domain
│     ├─ seed-data.ts         # Data contoh (padanan rujukan)
│     ├─ data.ts              # Lapisan data (Supabase + fallback)
│     ├─ search.ts            # Indeks carian global
│     ├─ tables.ts            # Nama jadual Supabase
│     ├─ utils.ts
│     └─ supabase/            # Klien pelayar & pelayan
├─ supabase/
│  ├─ schema.sql              # DDL + RLS
│  └─ seed.sql                # Data contoh
├─ .env.local.example
├─ DEPLOYMENT.md
└─ package.json
```

---

## 🚀 Mula Pantas

> Prasyarat: **Node.js 18.18+** (disyorkan 20+).

### Windows (PowerShell) — langkah mudah
Jika `node` tidak dikenali, Node biasanya dipasang di `C:\Program Files\nodejs`. Tambah ke PATH untuk sesi ini, kemudian jalankan:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
cd "C:\…\website Aah chat gbt\info"
npm install      # kali pertama sahaja
npm run dev
# Buka http://localhost:3000
```

### Umum (mac/Linux)
```bash
npm install        # kali pertama sahaja
npm run dev        # buka http://localhost:3000
```

> **Mod demo (tanpa Supabase):** laman terus berjalan menggunakan data contoh. **Semua perubahan anda (tambah/edit/padam murid, tugasan, program, pautan) disimpan secara automatik dalam pelayar (localStorage)** dan kekal walaupun selepas tutup/buka semula. Untuk simpanan kekal merentas peranti, sambung Supabase (di bawah).
>
> **Tema:** laman dibuka dalam **mod cerah** (padan reka bentuk rujukan). Tekan ikon ☀️/🌙 di bar atas untuk tukar mod gelap.

---

## 🗄️ Sediakan Supabase

1. Cipta projek percuma di **[supabase.com](https://supabase.com)**.
2. Buka **SQL Editor** → tampal & jalankan `supabase/schema.sql`.
3. Jalankan pula `supabase/seed.sql` untuk mengisi data contoh.
4. Pergi ke **Project Settings → API**, salin:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Tampal ke dalam `.env.local`, kemudian `npm run dev` semula.

Panel admin (`/admin`) akan menunjukkan lencana **"Supabase Disambung"** apabila berjaya.

---

## 🛠️ Menggunakan CMS

Pergi ke **`/admin`** (atau klik ikon ⚙️ / avatar di bar atas).

| Tab | Apa yang boleh diubah |
|-----|------------------------|
| **Tetapan & Tema** | Nama organisasi, logo teks, banner, motto, footer, **5 warna tema**, mod lalai |
| **Menu** | Item navigasi atas & sidebar (label, pautan, ikon, susunan) |
| **Pengumuman / Statistik / Program / Dokumen / Evidens / Prestasi / Pemantauan / Pautan / AI Kategori / AI Prompt / Kalendar** | CRUD penuh + Eksport CSV |

Setiap perubahan ditulis terus ke Supabase (jika disambung) dan dipaparkan semula pada dashboard.

> **Ikon** menggunakan nama [Lucide](https://lucide.dev/icons) dalam format PascalCase (cth `FileText`, `CalendarDays`).

---

## 🎨 Nota Reka Bentuk

- Warna jenama disuntik sebagai pemboleh ubah CSS (`--brand`, `--brand-gold`, …) supaya boleh diubah dari CMS tanpa membina semula.
- Gambar bangunan/tanglung/gerbang ialah **SVG asli** (bukan imej berhak cipta) — anda boleh ganti dengan imej sendiri melalui medan *URL Imej Banner* atau *URL Gambar* pada setiap rekod.

---

## 🧩 Modul yang tersedia

**Dashboard** (padan reka bentuk rujukan) · **JQAF** (statistik + carta donut/bar) · **Data Murid** (CRUD penuh, tapis, Import CSV, Eksport Excel/CSV & PDF) · **Panitia Pendidikan Islam** · **Program & Aktiviti** (CRUD penuh: status, AJK, bajet, laporan) · **Takwim & Kalendar** · **Dokumen & Fail** + **Pusat Dokumen** (grid/list, tapis, carian) · **Google Drive & Link** (CRUD + pemilih ikon/warna) · **Checklist Tugasan** (papan Kanban + drag & drop) · **AI Assistant** (chat yang menjawab soalan tentang data anda — tanpa API luar) · **Laporan & Analitik** · **Notifikasi** · **Audit Trail** (garis masa + penjana QR Code) · **Profil Pengguna** · **Panel Admin / CMS** (`/admin`).

> Semua modul mempunyai **carian global** (Ctrl/⌘ + K), **mod cerah/gelap**, dan **reka bentuk responsif** (desktop/tablet/telefon).

## 📌 Skop & Had

Beberapa ciri lanjutan masih boleh ditambah pada masa hadapan: **log masuk/Authentication + RBAC**, **muat naik fail sebenar** ke Supabase Storage (butang muat naik sedia ada, perlu disambung), **AI Assistant berasaskan LLM sebenar** (kini menggunakan enjin tempatan untuk soalan data), dan **auto-backup ke Google Drive**. Senibina sedia ada (lapisan data, RLS, jadual Supabase, hook localStorage) memudahkan penambahan tersebut.

Lihat **`DEPLOYMENT.md`** untuk panduan terbitan ke Vercel.
