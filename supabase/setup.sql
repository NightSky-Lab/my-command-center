-- ============================================================
-- MyPI Command Center — SETUP LENGKAP (schema + data contoh)
-- Tampal SEMUA ini ke Supabase SQL Editor, klik RUN sekali sahaja.
-- ============================================================

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


-- ===========================================================================
-- MyPI Command Center — Seed data (padanan reka bentuk rujukan)
-- Jalankan SELEPAS schema.sql.
-- ===========================================================================

-- Tetapan laman -------------------------------------------------------------
insert into site_settings (id, org_name, org_subtitle, logo_text, logo_emoji,
  banner_eyebrow, banner_title, banner_subtitle, banner_slogan, banner_image_url,
  calligraphy_text, motto_title, motto_text, motto_image_url, footer_text,
  brand_color, brand_dark, brand_light, brand_gold, brand_gold_soft,
  default_theme, current_year)
values ('default', 'MyPI Command Center', 'Pusat Pengurusan Pendidikan Islam Digital',
  'MyPI COMMAND CENTER', '🕌',
  'Selamat Datang ke', 'MyPI Command Center', 'Pusat Pengurusan Pendidikan Islam Digital',
  'Organisasi Cemerlang, Panitia Gemilang, Murid Terbilang', null,
  'Ilmu Itu Cahaya, Amalan Itu Bukti', 'MOTTO',
  'Bekerja Dengan Ikhlas, Berilmu Dengan Tekun, Berbakti Dengan Sepenuh Hati.', null,
  '© 2025 MyPI Command Center  |  Pusat Pengurusan Pendidikan Islam Digital  |  Hak Cipta Terpelihara',
  '#013220', '#004225', '#0a5c3a', '#c9a227', '#e7c66b', 'light', 2025);

-- Pengguna ------------------------------------------------------------------
insert into app_users (id, name, role, avatar_url) values
  ('u-azhari', 'Azhari', 'Ketua Panitia', null);

-- Menu ----------------------------------------------------------------------
insert into menu_items (id, label, href, icon, "group", color, position, is_active) values
  -- MENU UTAMA
  ('m-dash','Dashboard','/','LayoutDashboard','main','text-brand',1,true),
  -- MODUL UTAMA
  ('x-jqaf','JQAF','/jqaf','BookMarked','module','text-emerald-500',1,true),
  ('x-murid','Data Murid','/data-murid','GraduationCap','module','text-sky-500',2,true),
  ('x-panitia','Panitia Pendidikan Islam','/panitia','Landmark','module','text-teal-500',3,true),
  ('x-prog','Program & Aktiviti','/program','CalendarDays','module','text-violet-500',4,true),
  ('x-kal','Takwim & Kalendar','/kalendar','Calendar','module','text-rose-500',5,true),
  ('x-dok','Dokumen & Fail','/dokumen','FolderOpen','module','text-amber-500',6,true),
  ('x-drive','Google Drive & Link','/link','Link2','module','text-cyan-500',7,true),
  ('x-check','Checklist Tugasan','/checklist','ListChecks','module','text-orange-500',8,true),
  ('x-pusat','Pusat Dokumen','/pusat-dokumen','Archive','module','text-indigo-500',9,true),
  ('x-ai','AI Assistant','/ai-hub','Sparkles','module','text-fuchsia-500',10,true),
  -- SISTEM
  ('y-lap','Laporan & Analitik','/analisis','BarChart3','system','text-emerald-500',1,true),
  ('y-notif','Notifikasi','/notifikasi','Bell','system','text-sky-500',2,true),
  ('y-audit','Audit Trail','/audit','History','system','text-violet-500',3,true),
  ('y-panduan','Panduan Ringkas','/panduan','BookOpen','system','text-emerald-500',4,true),
  ('y-tetapan','Tetapan Sistem','/admin','Settings','system','text-slate-500',5,true),
  ('y-profil','Profil Pengguna','/profil','UserCircle','system','text-amber-500',6,true);

-- Pengumuman ----------------------------------------------------------------
insert into announcements (id, day, month, title, subtitle, meta, accent, position) values
  ('a1','18','MEI','Mesyuarat Panitia Bil. 2/2025','20 Mei 2025 (Selasa)  |  2:30 petang','Bilik Panitia Pendidikan Islam','green',1),
  ('a2','25','MEI','Program Ihya Ramadan','26 Mei 2025 (Isnin)','Dewan As-Syakirin','green',2),
  ('a3','30','MEI','Tarikh Akhir Hantar Laporan','Laporan Program Mei 2025','30 Mei 2025 (Jumaat)','green',3);

-- Statistik -----------------------------------------------------------------
insert into stats (id, key, label, value, suffix, sublabel, icon, color, position) values
  ('st1','fail','JUMLAH FAIL',246,'','Dokumen','FolderClosed','emerald',1),
  ('st2','program','JUMLAH PROGRAM',18,'','Program','CalendarDays','blue',2),
  ('st3','evidens','JUMLAH EVIDENS',1248,'','Gambar / Video','Camera','violet',3),
  ('st4','data','JUMLAH DATA',12,'','Analisis','TrendingUp','teal',4),
  ('st5','guru','JUMLAH GURU',7,'','Orang','Users','amber',5),
  ('st6','pemantauan','PEMANTAUAN',85,'%','Lengkap','ClipboardCheck','green',6);

-- Program -------------------------------------------------------------------
insert into programs (id, title, date_label, location, start_day, start_month, thumbnail_url, accent, position, time, objective, target, committee, budget, report, status) values
  ('p1','Program Ihya Ramadan','26 Mei 2025 (Isnin)','Dewan As-Syakirin','26','MEI',null,'green',1,'8:00 pagi - 1:00 tengah hari','Menyemarakkan amalan ibadah di bulan Ramadan dalam kalangan murid.','Semua murid Tahun 4-6','Panitia Pendidikan Islam','RM 1,500','','berjalan'),
  ('p2','Kem Bestari Solat','10 - 12 Jun 2025','Surau Al-Ikhlas','10','JUN',null,'gold',2,'8:00 pagi - 5:00 petang','Memantapkan penguasaan solat fardhu murid secara amali.','Murid Tahun 1-3','Ustaz Ahmad, Ustazah Siti','RM 2,200','','perancangan'),
  ('p3','Mahrajan Al-Quran','25 Jun 2025 (Rabu)','Dewan As-Syakirin','25','JUN',null,'rose',3,'9:00 pagi - 12:00 tengah hari','Memartabatkan tilawah dan penghayatan Al-Quran.','Semua murid','Panitia Pendidikan Islam','RM 1,800','','perancangan'),
  ('p4','Sambutan Maulidur Rasul','15 April 2025 (Selasa)','Dataran Sekolah','15','APR',null,'green',4,'7:30 pagi - 10:00 pagi','Menghayati sirah dan akhlak Rasulullah SAW.','Seluruh warga sekolah','Panitia Pendidikan Islam','RM 1,000','Program berjalan lancar dengan kehadiran 420 murid.','selesai');

-- Dokumen -------------------------------------------------------------------
insert into documents (id, name, type, date_label, url, position) values
  ('d1','Minit Mesyuarat Panitia Bil. 1.2025.pdf','pdf','18 Mei 2025',null,1),
  ('d2','Pelan Operasi Panitia 2025.docx','word','17 Mei 2025',null,2),
  ('d3','Analisis UASA 2024.xlsx','excel','16 Mei 2025',null,3),
  ('d4','Kertas Kerja Ihya Ramadan 2025.pdf','pdf','15 Mei 2025',null,4),
  ('d5','Takwim Panitia 2025.pdf','pdf','14 Mei 2025',null,5);

-- Evidens -------------------------------------------------------------------
insert into evidence (id, title, image_url, gradient, date_label, position) values
  ('e1','Majlis Tilawah Al-Quran',null,'from-emerald-500 to-green-800','Mei 2025',1),
  ('e2','Ceramah Perdana',null,'from-teal-500 to-emerald-800','Mei 2025',2),
  ('e3','Solat Hajat Perdana',null,'from-green-600 to-teal-900','Mei 2025',3),
  ('e4','Kem Bestari Solat',null,'from-amber-500 to-orange-700','Mei 2025',4),
  ('e5','Perhimpunan Bulanan',null,'from-sky-500 to-indigo-800','Mei 2025',5),
  ('e6','Aktiviti Kumpulan',null,'from-cyan-500 to-blue-800','Mei 2025',6);

-- Prestasi ------------------------------------------------------------------
insert into performance (id, label, value, position) values
  ('pf1','Tahun 2021',65,1),
  ('pf2','Tahun 2022',72,2),
  ('pf3','Tahun 2023',78,3),
  ('pf4','Tahun 2024',85,4);

-- Pemantauan ----------------------------------------------------------------
insert into monitoring (id, document, status, position) values
  ('m1','Carta Organisasi','lengkap',1),
  ('m2','Minit Mesyuarat','lengkap',2),
  ('m3','Takwim Panitia','lengkap',3),
  ('m4','Pelan Strategik','lengkap',4),
  ('m5','OPPM','lengkap',5),
  ('m6','Analisis Data','kemaskini',6),
  ('m7','Evidens Program','lengkap',7);

-- Pautan pantas -------------------------------------------------------------
insert into quick_links (id, name, url, icon, color, position, category) values
  ('q1','Drive Utama Panitia','https://drive.google.com','drive','#1FA463',1,'Google Drive'),
  ('q2','Bahan Mengajar','https://drive.google.com','book','#8B5CF6',2,'Google Drive'),
  ('q3','Laporan & Analisis','https://drive.google.com','analysis','#0EA5E9',3,'Google Drive'),
  ('q4','Dokumen Rasmi','https://drive.google.com','doc','#EF4444',4,'Google Drive'),
  ('q5','Program & Aktiviti','https://drive.google.com','program','#F59E0B',5,'Google Drive'),
  ('q6','Pendidikan Islam','https://drive.google.com','folder','#14B8A6',6,'Google Drive'),
  ('q7','SPLKPM','https://splkpm.moe.gov.my','splkpm','#0EA5E9',7,'Aplikasi'),
  ('q8','DELIMA','https://delima.edu.my','delima','#EF4444',8,'Aplikasi'),
  ('q9','Canva','https://www.canva.com','canva','#00C4CC',9,'Aplikasi'),
  ('q10','ChatGPT','https://chat.openai.com','chatgpt','#10A37F',10,'Aplikasi'),
  ('q11','Gemini','https://gemini.google.com','gemini','#4285F4',11,'Aplikasi');

-- Kategori AI ---------------------------------------------------------------
insert into ai_categories (id, name, icon, color, prompt_count, position) values
  ('c1','RPH & PdP','BookOpen','violet',23,1),
  ('c2','Analisis Data','BarChart3','blue',18,2),
  ('c3','Surat Rasmi','Mail','emerald',15,3),
  ('c4','Kajian Tindakan','Search','amber',12,4),
  ('c5','Laporan Program','FileBarChart','teal',20,5);

-- Prompt AI -----------------------------------------------------------------
insert into ai_prompts (id, category_id, title, content, tags, is_favorite) values
  ('pr1','c1','Jana RPH Pendidikan Islam (PdPc)','Bina Rancangan Pengajaran Harian bagi mata pelajaran Pendidikan Islam Tahun [TAHUN], tajuk [TAJUK]. Sertakan objektif, standard pembelajaran, set induksi, aktiviti PdPc (EMK & KBAT), pentaksiran (PBD) dan refleksi.', array['RPH','PdPc','PBD'], true),
  ('pr2','c1','Aktiviti Didik Hibur Tilawah','Cadangkan 5 aktiviti didik hibur untuk PdPc Tilawah Al-Quran yang menarik dan sesuai dengan murid [TAHAP].', array['PdPc','Tilawah'], false),
  ('pr3','c2','Analisis Keputusan UASA','Analisiskan data keputusan UASA berikut dan berikan dapatan, gred purata mata pelajaran (GPMP), serta cadangan intervensi: [DATA].', array['UASA','Analisis'], true),
  ('pr4','c3','Surat Jemputan Program','Tuliskan surat rasmi jemputan kepada [PIHAK] untuk menghadiri program [NAMA PROGRAM] pada [TARIKH] di [TEMPAT].', array['Surat','Rasmi'], false),
  ('pr5','c4','Kerangka Kajian Tindakan','Bina kerangka kajian tindakan bertajuk [TAJUK] mengikut model Kemmis & McTaggart lengkap dengan refleksi awal, perancangan, tindakan, pemerhatian dan refleksi.', array['Kajian Tindakan'], false),
  ('pr6','c5','Laporan Pelaksanaan Program','Sediakan laporan pelaksanaan program [NAMA] merangkumi objektif, pelaksanaan, kehadiran, kekuatan, penambahbaikan dan lampiran evidens.', array['Laporan','Program'], true);

-- Acara kalendar ------------------------------------------------------------
insert into calendar_events (id, title, date, location, accent) values
  ('ce1','Mesyuarat Panitia Bil. 2/2025','2025-05-20','Bilik Panitia','green'),
  ('ce2','Program Ihya Ramadan','2025-05-26','Dewan As-Syakirin','gold'),
  ('ce3','Tarikh Akhir Hantar Laporan','2025-05-30','Dalam Talian','rose'),
  ('ce4','Kem Bestari Solat','2025-06-10','Surau Al-Ikhlas','blue'),
  ('ce5','Mahrajan Al-Quran','2025-06-25','Dewan As-Syakirin','green');

-- Data Murid + JQAF ---------------------------------------------------------
insert into students (id, name, mykid, year, class_name, gender, guardian, phone, address, jqaf_status, notes, position) values
  ('mu-01','Muhammad Adam bin Ahmad','180312-10-1234',6,'6 Bestari','L','Ahmad bin Ismail','012-3456789','No. 12, Jalan Melur, Taman Indah','menguasai','Cemerlang tilawah',1),
  ('mu-02','Nur Aisyah binti Razak','180521-10-2345',6,'6 Bestari','P','Razak bin Hamid','013-2233445','No. 5, Lorong Kenanga','menguasai','',2),
  ('mu-03','Aiman Hakimi bin Yusof','180704-10-3456',6,'6 Amanah','L','Yusof bin Ali','019-8765432','No. 88, Jalan Seri','tidak_menguasai','Perlu bimbingan jawi',3),
  ('mu-04','Siti Khadijah binti Omar','180915-10-4567',6,'6 Amanah','P','Omar bin Salleh','017-5566778','No. 23, Taman Damai','menguasai','',4),
  ('mu-05','Danish Iqbal bin Kamal','190102-10-5678',5,'5 Bestari','L','Kamal bin Hassan','012-1122334','No. 7, Jalan Cempaka','menguasai','',5),
  ('mu-06','Nur Hidayah binti Salim','190218-10-6789',5,'5 Bestari','P','Salim bin Daud','011-2345678','No. 30, Taman Sentosa','tidak_menguasai','Bacaan perlu dipertingkat',6),
  ('mu-07','Haziq Danial bin Rahman','190330-10-7890',5,'5 Amanah','L','Rahman bin Idris','014-9988776','No. 14, Jalan Mawar','menguasai','',7),
  ('mu-08','Alya Sofea binti Hisham','190411-10-8901',5,'5 Amanah','P','Hisham bin Karim','016-7766554','No. 9, Taman Permai','menguasai','',8),
  ('mu-09','Iskandar Zulkarnain bin Aziz','200107-10-9012',4,'4 Bestari','L','Aziz bin Latif','012-3344556','No. 41, Jalan Teratai','tidak_menguasai','',9),
  ('mu-10','Balqis Humaira binti Fauzi','200229-10-0123',4,'4 Bestari','P','Fauzi bin Noor','013-4455667','No. 18, Taman Harmoni','menguasai','',10),
  ('mu-11','Luqman Hakim bin Zainal','200315-10-1235',4,'4 Amanah','L','Zainal bin Musa','019-5544332','No. 26, Jalan Dahlia','menguasai','',11),
  ('mu-12','Sofia Nadhirah binti Anuar','200428-10-2346',4,'4 Amanah','P','Anuar bin Halim','017-6655443','No. 3, Taman Suria','menguasai','',12),
  ('mu-13','Zikri Hadif bin Roslan','210109-10-3457',3,'3 Bestari','L','Roslan bin Bakar','011-7788990','No. 52, Jalan Kasturi','tidak_menguasai','Pemulihan iqra''',13),
  ('mu-14','Qistina Sofea binti Nizam','210220-10-4568',3,'3 Bestari','P','Nizam bin Sani','014-8899001','No. 11, Taman Bahagia','menguasai','',14),
  ('mu-15','Adam Mikael bin Faisal','210331-10-5679',3,'3 Amanah','L','Faisal bin Othman','016-9900112','No. 35, Jalan Cendana','menguasai','',15),
  ('mu-16','Nur Damia binti Saiful','210412-10-6780',3,'3 Amanah','P','Saiful bin Manan','012-1212343','No. 8, Taman Melati','menguasai','',16),
  ('mu-17','Harith Naufal bin Zaki','220105-10-7891',2,'2 Bestari','L','Zaki bin Husin','013-2323454','No. 47, Jalan Anggerik','tidak_menguasai','',17),
  ('mu-18','Nur Iman binti Hafiz','220216-10-8902',2,'2 Bestari','P','Hafiz bin Razali','019-3434565','No. 19, Taman Ria','menguasai','',18),
  ('mu-19','Irfan Hadi bin Suhaimi','220327-10-9013',2,'2 Amanah','L','Suhaimi bin Jalil','017-4545676','No. 6, Jalan Seroja','menguasai','',19),
  ('mu-20','Aisyah Humaira binti Rosli','220408-10-0124',2,'2 Amanah','P','Rosli bin Yaakob','011-5656787','No. 28, Taman Jaya','menguasai','',20),
  ('mu-21','Ziyad Ammar bin Helmi','230111-10-1236',1,'1 Bestari','L','Helmi bin Sabri','014-6767898','No. 54, Jalan Tanjung','tidak_menguasai','Baharu mengenal huruf',21),
  ('mu-22','Nur Sabrina binti Azhar','230222-10-2347',1,'1 Bestari','P','Azhar bin Mokhtar','016-7878909','No. 13, Taman Mutiara','menguasai','',22),
  ('mu-23','Rayyan Hakimi bin Johari','230303-10-3458',1,'1 Amanah','L','Johari bin Wahab','012-8989010','No. 39, Jalan Bunga Raya','menguasai','',23),
  ('mu-24','Sofea Adriana binti Rizal','230414-10-4569',1,'1 Amanah','P','Rizal bin Ghani','013-9090121','No. 2, Taman Impian','tidak_menguasai','',24);

-- Checklist Tugasan ---------------------------------------------------------
insert into tasks (id, title, due_date, priority, notes, status, position) values
  ('tk-01','Sediakan laporan program Ramadan','22 Mei 2025','tinggi','Lengkap dengan evidens & kehadiran','perlu',1),
  ('tk-02','Kemas kini data JQAF Tahun 6','25 Mei 2025','tinggi','','perlu',2),
  ('tk-03','Sediakan minit mesyuarat panitia','27 Mei 2025','sederhana','','perlu',3),
  ('tk-04','Semak kehadiran murid mingguan','30 Mei 2025','sederhana','','perlu',4),
  ('tk-05','Analisis prestasi JQAF','18 Mei 2025','tinggi','Carta penguasaan ikut tahun','sedang',5),
  ('tk-06','Penyediaan modul PdP','20 Mei 2025','sederhana','','sedang',6),
  ('tk-07','Urusan dokumentasi program','21 Mei 2025','rendah','','sedang',7),
  ('tk-08','Mesyuarat panitia bil. 2/2025','15 Mei 2025','sederhana','Selesai','selesai',8),
  ('tk-09','Laporan program bulan April','14 Mei 2025','rendah','','selesai',9),
  ('tk-10','Kemas kini fail panitia','12 Mei 2025','rendah','','selesai',10);

-- Audit Trail ---------------------------------------------------------------
insert into audit_log (id, action, module, detail, at, actor) values
  ('au-01','edit','JQAF','Mengemaskini status JQAF — Tahun 6 Bestari','2025-05-20T14:30:00','Azhari'),
  ('au-02','tambah','Data Murid','Menambah murid baharu: Muhammad Adam bin Ahmad','2025-05-20T11:15:00','Azhari'),
  ('au-03','upload','Dokumen','Memuat naik fail: Laporan Program Ramadan 2025.pdf','2025-05-20T10:05:00','Azhari'),
  ('au-04','backup','Sistem','Backup harian berjaya ke Google Drive','2025-05-20T02:00:00','Sistem'),
  ('au-05','edit','Program','Mengemaskini butiran Program Ihya Ramadan','2025-05-19T16:40:00','Azhari'),
  ('au-06','tambah','Checklist','Menambah tugasan: Sediakan minit mesyuarat panitia','2025-05-19T09:20:00','Azhari'),
  ('au-07','padam','Dokumen','Memadam fail lama: Draf Takwim 2024.docx','2025-05-18T15:10:00','Azhari'),
  ('au-08','login','Sistem','Log masuk ke MyPI Command Center','2025-05-18T08:00:00','Azhari');
