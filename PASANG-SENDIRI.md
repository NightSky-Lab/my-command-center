<!-- ========================================================================
  PANDUAN PELANGGAN — Pasang MyPI Command Center Sendiri
  (Edarkan fail/pautan ini kepada pelanggan anda.)
======================================================================== -->

# 🕌 Pasang MyPI Command Center Anda Sendiri

Panduan mudah (~10 minit) untuk memiliki sistem pengurusan Pendidikan Islam **anda sendiri** — **percuma**, di pelayan anda sendiri. Tiada coding diperlukan.

> Anda akan memiliki: pangkalan data sendiri (Supabase), laman web sendiri (link Vercel), dan **semua data milik anda sepenuhnya**.

---

## ✅ Apa yang anda perlukan (semua percuma)
- 1 akaun **Supabase** (pangkalan data) — daftar guna Google
- 1 akaun **Vercel** (hosting/link) — daftar guna Google
- 1 akaun **GitHub** (Vercel perlukan ini) — daftar guna email

---

## 🟢 BAHAGIAN 1 — Sediakan Pangkalan Data (Supabase)

1. Pergi ke **https://supabase.com** → **Start your project** → daftar (Google).
2. Klik **New Project**:
   - **Name:** `mypi`
   - **Database Password:** klik *Generate*, kemudian **simpan**.
   - **Region:** **Southeast Asia (Singapore)**
   - Klik **Create new project** → tunggu ~2 minit.
3. Di menu kiri, klik **SQL Editor** → **+ New query**.
4. Buka fail ini dalam tab baharu, klik butang **Raw**, pilih semua (Ctrl+A), salin (Ctrl+C):
   👉 **https://raw.githubusercontent.com/NightSky-Lab/my-command-center/main/supabase/schema.sql**
   Tampal (Ctrl+V) ke dalam SQL Editor Supabase → klik **Run** ▶️ (tunggu "Success").
5. Klik **+ New query** lagi. Buka fail kedua, salin & tampal cara sama:
   👉 **https://raw.githubusercontent.com/NightSky-Lab/my-command-center/main/supabase/seed.sql**
   → klik **Run** ▶️.
6. Di menu kiri klik **⚙️ Project Settings → API**. **Salin & simpan 2 perkara ini** (kita guna sekejap lagi):
   - **Project URL** (cth `https://abcd1234.supabase.co`)
   - **anon public** key (kunci panjang bermula `eyJ...`)

---

## 🟣 BAHAGIAN 2 — Terbitkan Laman Anda (Vercel)

1. Klik butang ini:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNightSky-Lab%2Fmy-command-center&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Kunci%20Supabase%20(Project%20URL%20%26%20anon%20public%20key)&project-name=my-command-center&repository-name=my-command-center)

2. **Log masuk Vercel** (guna GitHub). Jika diminta, benarkan Vercel & buat akaun GitHub.
3. Vercel akan minta **Environment Variables** — isi dengan 2 perkara dari Bahagian 1 (Langkah 6):
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | *Project URL anda* |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *anon public key anda* |
4. Klik **Deploy** → tunggu ~2 minit.
5. 🎉 Siap! Anda akan dapat link seperti **`https://my-command-center-xxxx.vercel.app`**.

---

## 🔐 Langkah Akhir (PENTING)
1. Buka link anda → skrin **Log Masuk** muncul.
2. Kata laluan lalai: **`mypi2025`**.
3. **Segera tukar kata laluan** di **Profil Pengguna → Keselamatan**.
4. Mula guna! Tambah murid, program, tugasan — semua data masuk pangkalan data **anda sendiri**.

---

## ❓ Bantuan
- **Lupa langkah?** Ulang dari Bahagian 1.
- **Skrin putih / error selepas deploy?** Biasanya kunci Supabase salah tampal. Di Vercel: **Project → Settings → Environment Variables** → semak semula → **Redeploy**.
- **Data tak simpan?** Pastikan kedua-dua fail SQL (Bahagian 1) telah di-*Run* dengan jayanya.
