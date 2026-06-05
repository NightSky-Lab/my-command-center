# 🚀 Panduan Terbitan (Deployment) — Vercel + Supabase

Panduan langkah-demi-langkah untuk menerbitkan **MyPI Command Center** secara percuma.

---

## A. Sediakan Supabase (pangkalan data)

1. Daftar di **https://supabase.com** → **New Project**.
2. Pilih nama projek, kata laluan pangkalan data & rantau (pilih yang terdekat, cth *Singapore*).
3. Setelah projek siap, buka **SQL Editor**:
   - Tampal kandungan `supabase/schema.sql` → **Run**.
   - Tampal kandungan `supabase/seed.sql` → **Run**.
4. Buka **Project Settings → API** dan catat:
   - **Project URL**
   - **anon public** API key

---

## B. Naik ke GitHub

```bash
cd "website Aah chat gbt"
git init
git add .
git commit -m "MyPI Command Center"
git branch -M main
git remote add origin https://github.com/USERNAME/mypi-command-center.git
git push -u origin main
```

> `.gitignore` sudah disediakan — `.env.local` dan `node_modules` tidak akan dimuat naik.

---

## C. Terbitkan ke Vercel

1. Pergi ke **https://vercel.com** → **Add New… → Project**.
2. **Import** repositori GitHub tadi.
3. Vercel akan auto-kesan **Next.js** — biarkan tetapan lalai:
   - Build Command: `next build`
   - Output: (auto)
4. Buka bahagian **Environment Variables** dan tambah:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | *Project URL dari Supabase* |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *anon public key* |
   | `SUPABASE_SERVICE_ROLE_KEY` | *(pilihan, untuk operasi pelayan)* |

5. Klik **Deploy**. Selesai — laman anda akan tersedia di `https://nama-projek.vercel.app`.

---

## D. Selepas Terbitan

- Lawati `/admin` untuk mengurus kandungan. Lencana **"Supabase Disambung"** mengesahkan sambungan berjaya.
- Untuk domain tersuai: **Vercel → Project → Settings → Domains**.
- Setiap `git push` ke `main` akan auto-deploy semula.

---

## ⚠️ Nota Keselamatan

Konfigurasi RLS dalam `schema.sql` adalah **terbuka** (sesuai untuk kegunaan peribadi tanpa log masuk). **Sebelum** mendedahkan laman kepada umum:

1. Tambah **Supabase Authentication**.
2. Ubah polisi RLS supaya hanya pengguna `authenticated` boleh `insert/update/delete`:

```sql
-- Contoh: benarkan baca untuk semua, tulis untuk pengguna log masuk sahaja
drop policy if exists "public_write" on documents;
create policy "auth_write" on documents
  for all to authenticated using (true) with check (true);
```

Ulang untuk setiap jadual yang ingin dilindungi.

---

## 🧪 Semakan Pantas Sebelum Deploy

```bash
npm run typecheck   # tiada ralat TypeScript
npm run build       # build produksi berjaya
```
