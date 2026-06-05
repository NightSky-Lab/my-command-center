-- ===========================================================================
-- MyPI Command Center — Supabase schema
-- Jalankan fail ini dalam Supabase → SQL Editor (sekali sahaja).
-- Kemudian jalankan seed.sql untuk mengisi data contoh.
-- ===========================================================================

-- Bersihkan (jika perlu pasang semula) -------------------------------------
drop table if exists audit_log cascade;
drop table if exists tasks cascade;
drop table if exists students cascade;
drop table if exists ai_prompts cascade;
drop table if exists ai_categories cascade;
drop table if exists calendar_events cascade;
drop table if exists quick_links cascade;
drop table if exists monitoring cascade;
drop table if exists performance cascade;
drop table if exists evidence cascade;
drop table if exists documents cascade;
drop table if exists programs cascade;
drop table if exists stats cascade;
drop table if exists announcements cascade;
drop table if exists menu_items cascade;
drop table if exists app_users cascade;
drop table if exists site_settings cascade;

-- 1. Tetapan laman (CMS: logo, banner, warna, motto) -----------------------
create table site_settings (
  id               text primary key default 'default',
  org_name         text not null default 'MyPI Command Center',
  org_subtitle     text not null default 'Pusat Pengurusan Pendidikan Islam Digital',
  logo_text        text not null default 'MyPI COMMAND CENTER',
  logo_emoji       text default '🕌',
  banner_eyebrow   text default 'Selamat Datang ke',
  banner_title     text default 'MyPI Command Center',
  banner_subtitle  text default 'Pusat Pengurusan Pendidikan Islam Digital',
  banner_slogan    text default 'Organisasi Cemerlang, Panitia Gemilang, Murid Terbilang',
  banner_image_url text,
  calligraphy_text text default 'Ilmu Itu Cahaya, Amalan Itu Bukti',
  motto_title      text default 'MOTTO',
  motto_text       text,
  motto_image_url  text,
  footer_text      text,
  brand_color      text default '#013220',
  brand_dark       text default '#004225',
  brand_light      text default '#0a5c3a',
  brand_gold       text default '#c9a227',
  brand_gold_soft  text default '#e7c66b',
  default_theme    text default 'light',
  current_year     int  default 2025,
  updated_at       timestamptz default now()
);

-- 2. Pengguna (paparan profil; auth boleh ditambah kemudian) ----------------
create table app_users (
  id         text primary key,
  name       text not null,
  role       text not null,
  avatar_url text
);

-- 3. Menu (navigasi atas + sidebar) ----------------------------------------
create table menu_items (
  id        text primary key,
  label     text not null,
  href      text not null,
  icon      text,
  "group"   text not null default 'sidebar',
  color     text,
  position  int  default 0,
  is_active boolean default true
);

-- 4. Pengumuman ------------------------------------------------------------
create table announcements (
  id       text primary key,
  day      text,
  month    text,
  title    text not null,
  subtitle text,
  meta     text,
  accent   text default 'green',
  position int default 0
);

-- 5. Statistik dashboard ---------------------------------------------------
create table stats (
  id       text primary key,
  key      text,
  label    text not null,
  value    int default 0,
  suffix   text default '',
  sublabel text,
  icon     text,
  color    text default 'emerald',
  position int default 0
);

-- 6. Program ---------------------------------------------------------------
create table programs (
  id            text primary key,
  title         text not null,
  date_label    text,
  location      text,
  start_day     text,
  start_month   text,
  thumbnail_url text,
  accent        text default 'green',
  position      int default 0,
  time          text,
  objective     text,
  target        text,
  committee     text,
  budget        text,
  report        text,
  status        text default 'perancangan'  -- perancangan/berjalan/selesai
);

-- 7. Dokumen ---------------------------------------------------------------
create table documents (
  id         text primary key,
  name       text not null,
  type       text default 'pdf',
  date_label text,
  url        text,
  position   int default 0
);

-- 8. Evidens ---------------------------------------------------------------
create table evidence (
  id         text primary key,
  title      text not null,
  image_url  text,
  gradient   text default 'from-emerald-500 to-green-800',
  date_label text,
  position   int default 0
);

-- 9. Prestasi (carta) ------------------------------------------------------
create table performance (
  id       text primary key,
  label    text not null,
  value    int default 0,
  position int default 0
);

-- 10. Status pemantauan ----------------------------------------------------
create table monitoring (
  id       text primary key,
  document text not null,
  status   text default 'lengkap',
  position int default 0
);

-- 11. Pautan pantas --------------------------------------------------------
create table quick_links (
  id       text primary key,
  name     text not null,
  url      text not null,
  icon     text,
  color    text default '#013220',
  position int default 0,
  category text default 'Google Drive'
);

-- 12. Kategori AI ----------------------------------------------------------
create table ai_categories (
  id           text primary key,
  name         text not null,
  icon         text,
  color        text default 'violet',
  prompt_count int default 0,
  position     int default 0
);

-- 13. Prompt AI ------------------------------------------------------------
create table ai_prompts (
  id          text primary key,
  category_id text references ai_categories(id) on delete set null,
  title       text not null,
  content     text,
  tags        text[] default '{}',
  is_favorite boolean default false,
  created_at  timestamptz default now()
);

-- 14. Acara kalendar -------------------------------------------------------
create table calendar_events (
  id       text primary key,
  title    text not null,
  date     date not null,
  location text,
  accent   text default 'green'
);

-- 15. Data Murid + JQAF ----------------------------------------------------
create table students (
  id          text primary key,
  name        text not null,
  mykid       text,
  year        int  default 1,
  class_name  text,
  gender      text default 'L',           -- 'L' (Lelaki) / 'P' (Perempuan)
  guardian    text,
  phone       text,
  address     text,
  jqaf_status text default 'menguasai',   -- 'menguasai' / 'tidak_menguasai'
  notes       text,
  position    int  default 0
);

-- 16. Checklist Tugasan (Kanban) -------------------------------------------
create table tasks (
  id        text primary key,
  title     text not null,
  due_date  text,
  priority  text default 'sederhana',     -- 'tinggi' / 'sederhana' / 'rendah'
  notes     text,
  status    text default 'perlu',         -- 'perlu' / 'sedang' / 'selesai'
  position  int  default 0
);

-- 17. Audit Trail ----------------------------------------------------------
create table audit_log (
  id     text primary key,
  action text default 'edit',            -- tambah/edit/padam/upload/backup/login
  module text not null,
  detail text,
  at     timestamptz default now(),
  actor  text default 'Azhari'
);

-- ===========================================================================
-- Row Level Security
-- Untuk kegunaan PERIBADI (tanpa log masuk), polisi terbuka dibenarkan supaya
-- panel admin boleh menulis menggunakan kunci anon.
--  PENTING: Sebelum laman ini didedahkan kepada umum, tambah Authentication
--  dan ketatkan polisi ini (cth: hanya 'authenticated' yang boleh insert/update).
-- ===========================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','app_users','menu_items','announcements','stats',
    'programs','documents','evidence','performance','monitoring',
    'quick_links','ai_categories','ai_prompts','calendar_events',
    'students','tasks','audit_log'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "public_read" on %I;', t);
    execute format('drop policy if exists "public_write" on %I;', t);
    execute format(
      'create policy "public_read" on %I for select to anon, authenticated using (true);', t);
    execute format(
      'create policy "public_write" on %I for all to anon, authenticated using (true) with check (true);', t);
  end loop;
end $$;
