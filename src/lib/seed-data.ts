// ===========================================================================
// MyPI Command Center — Seed data
// Mirrors the reference design 1:1. Used as the fallback content source when
// Supabase is not yet configured, and as the canonical values for seed.sql.
// ===========================================================================

import type {
  AiCategory,
  AiPrompt,
  Announcement,
  CalendarEvent,
  CurrentUser,
  DocumentItem,
  Evidence,
  MenuItem,
  MonitoringItem,
  PerformancePoint,
  Program,
  QuickLink,
  SiteSettings,
  Stat,
  Student,
  Task,
  AuditEntry,
} from "./types";

export const seedSettings: SiteSettings = {
  id: "default",
  org_name: "MyPI Command Center",
  org_subtitle: "Pusat Pengurusan Pendidikan Islam Digital",
  logo_text: "MyPI COMMAND CENTER",
  logo_emoji: "🕌",
  banner_eyebrow: "Selamat Datang ke",
  banner_title: "MyPI Command Center",
  banner_subtitle: "Pusat Pengurusan Pendidikan Islam Digital",
  banner_slogan: "Organisasi Cemerlang, Panitia Gemilang, Murid Terbilang",
  banner_image_url: null,
  calligraphy_text: "Ilmu Itu Cahaya, Amalan Itu Bukti",
  motto_title: "MOTTO",
  motto_text:
    "Bekerja Dengan Ikhlas, Berilmu Dengan Tekun, Berbakti Dengan Sepenuh Hati.",
  motto_image_url: null,
  footer_text:
    "© 2025 MyPI Command Center  |  Pusat Pengurusan Pendidikan Islam Digital  |  Hak Cipta Terpelihara",
  brand_color: "#013220",
  brand_dark: "#004225",
  brand_light: "#0a5c3a",
  brand_gold: "#c9a227",
  brand_gold_soft: "#e7c66b",
  default_theme: "light",
  current_year: 2025,
};

export const seedUser: CurrentUser = {
  id: "u-azhari",
  name: "Azhari",
  role: "Ketua Panitia",
  avatar_url: null,
};

export const seedMenu: MenuItem[] = [
  // ── MENU UTAMA ──────────────────────────────────────────────────────────
  { id: "m-dash", label: "Dashboard", href: "/", icon: "LayoutDashboard", group: "main", color: "text-brand", position: 1, is_active: true },
  // ── MODUL UTAMA ─────────────────────────────────────────────────────────
  { id: "x-jqaf", label: "JQAF", href: "/jqaf", icon: "BookMarked", group: "module", color: "text-emerald-500", position: 1, is_active: true },
  { id: "x-murid", label: "Data Murid", href: "/data-murid", icon: "GraduationCap", group: "module", color: "text-sky-500", position: 2, is_active: true },
  { id: "x-panitia", label: "Panitia Pendidikan Islam", href: "/panitia", icon: "Landmark", group: "module", color: "text-teal-500", position: 3, is_active: true },
  { id: "x-prog", label: "Program & Aktiviti", href: "/program", icon: "CalendarDays", group: "module", color: "text-violet-500", position: 4, is_active: true },
  { id: "x-kal", label: "Takwim & Kalendar", href: "/kalendar", icon: "Calendar", group: "module", color: "text-rose-500", position: 5, is_active: true },
  { id: "x-dok", label: "Dokumen & Fail", href: "/dokumen", icon: "FolderOpen", group: "module", color: "text-amber-500", position: 6, is_active: true },
  { id: "x-drive", label: "Google Drive & Link", href: "/link", icon: "Link2", group: "module", color: "text-cyan-500", position: 7, is_active: true },
  { id: "x-check", label: "Checklist Tugasan", href: "/checklist", icon: "ListChecks", group: "module", color: "text-orange-500", position: 8, is_active: true },
  { id: "x-pusat", label: "Pusat Dokumen", href: "/pusat-dokumen", icon: "Archive", group: "module", color: "text-indigo-500", position: 9, is_active: true },
  { id: "x-ai", label: "AI Assistant", href: "/ai-hub", icon: "Sparkles", group: "module", color: "text-fuchsia-500", position: 10, is_active: true },
  // ── SISTEM ──────────────────────────────────────────────────────────────
  { id: "y-lap", label: "Laporan & Analitik", href: "/analisis", icon: "BarChart3", group: "system", color: "text-emerald-500", position: 1, is_active: true },
  { id: "y-notif", label: "Notifikasi", href: "/notifikasi", icon: "Bell", group: "system", color: "text-sky-500", position: 2, is_active: true },
  { id: "y-audit", label: "Audit Trail", href: "/audit", icon: "History", group: "system", color: "text-violet-500", position: 3, is_active: true },
  { id: "y-panduan", label: "Panduan Ringkas", href: "/panduan", icon: "BookOpen", group: "system", color: "text-emerald-500", position: 4, is_active: true },
  { id: "y-tetapan", label: "Tetapan Sistem", href: "/admin", icon: "Settings", group: "system", color: "text-slate-500", position: 5, is_active: true },
  { id: "y-profil", label: "Profil Pengguna", href: "/profil", icon: "UserCircle", group: "system", color: "text-amber-500", position: 6, is_active: true },
];

export const seedAnnouncements: Announcement[] = [
  { id: "a1", day: "18", month: "MEI", title: "Mesyuarat Panitia Bil. 2/2025", subtitle: "20 Mei 2025 (Selasa)  |  2:30 petang", meta: "Bilik Panitia Pendidikan Islam", accent: "green", position: 1 },
  { id: "a2", day: "25", month: "MEI", title: "Program Ihya Ramadan", subtitle: "26 Mei 2025 (Isnin)", meta: "Dewan As-Syakirin", accent: "green", position: 2 },
  { id: "a3", day: "30", month: "MEI", title: "Tarikh Akhir Hantar Laporan", subtitle: "Laporan Program Mei 2025", meta: "30 Mei 2025 (Jumaat)", accent: "green", position: 3 },
];

export const seedStats: Stat[] = [
  { id: "st1", key: "fail", label: "JUMLAH FAIL", value: 246, suffix: "", sublabel: "Dokumen", icon: "FolderClosed", color: "emerald", position: 1 },
  { id: "st2", key: "program", label: "JUMLAH PROGRAM", value: 18, suffix: "", sublabel: "Program", icon: "CalendarDays", color: "blue", position: 2 },
  { id: "st3", key: "evidens", label: "JUMLAH EVIDENS", value: 1248, suffix: "", sublabel: "Gambar / Video", icon: "Camera", color: "violet", position: 3 },
  { id: "st4", key: "data", label: "JUMLAH DATA", value: 12, suffix: "", sublabel: "Analisis", icon: "TrendingUp", color: "teal", position: 4 },
  { id: "st5", key: "guru", label: "JUMLAH GURU", value: 7, suffix: "", sublabel: "Orang", icon: "Users", color: "amber", position: 5 },
  { id: "st6", key: "pemantauan", label: "PEMANTAUAN", value: 85, suffix: "%", sublabel: "Lengkap", icon: "ClipboardCheck", color: "green", position: 6 },
];

export const seedPrograms: Program[] = [
  { id: "p1", title: "Program Ihya Ramadan", date_label: "26 Mei 2025 (Isnin)", location: "Dewan As-Syakirin", start_day: "26", start_month: "MEI", thumbnail_url: null, accent: "green", position: 1, time: "8:00 pagi - 1:00 tengah hari", objective: "Menyemarakkan amalan ibadah di bulan Ramadan dalam kalangan murid.", target: "Semua murid Tahun 4-6", committee: "Panitia Pendidikan Islam", budget: "RM 1,500", report: "", status: "berjalan" },
  { id: "p2", title: "Kem Bestari Solat", date_label: "10 - 12 Jun 2025", location: "Surau Al-Ikhlas", start_day: "10", start_month: "JUN", thumbnail_url: null, accent: "gold", position: 2, time: "8:00 pagi - 5:00 petang", objective: "Memantapkan penguasaan solat fardhu murid secara amali.", target: "Murid Tahun 1-3", committee: "Ustaz Ahmad, Ustazah Siti", budget: "RM 2,200", report: "", status: "perancangan" },
  { id: "p3", title: "Mahrajan Al-Quran", date_label: "25 Jun 2025 (Rabu)", location: "Dewan As-Syakirin", start_day: "25", start_month: "JUN", thumbnail_url: null, accent: "rose", position: 3, time: "9:00 pagi - 12:00 tengah hari", objective: "Memartabatkan tilawah dan penghayatan Al-Quran.", target: "Semua murid", committee: "Panitia Pendidikan Islam", budget: "RM 1,800", report: "", status: "perancangan" },
  { id: "p4", title: "Sambutan Maulidur Rasul", date_label: "15 April 2025 (Selasa)", location: "Dataran Sekolah", start_day: "15", start_month: "APR", thumbnail_url: null, accent: "green", position: 4, time: "7:30 pagi - 10:00 pagi", objective: "Menghayati sirah dan akhlak Rasulullah SAW.", target: "Seluruh warga sekolah", committee: "Panitia Pendidikan Islam", budget: "RM 1,000", report: "Program berjalan lancar dengan kehadiran 420 murid.", status: "selesai" },
];

export const seedDocuments: DocumentItem[] = [
  { id: "d1", name: "Minit Mesyuarat Panitia Bil. 1.2025.pdf", type: "pdf", date_label: "18 Mei 2025", url: null, position: 1 },
  { id: "d2", name: "Pelan Operasi Panitia 2025.docx", type: "word", date_label: "17 Mei 2025", url: null, position: 2 },
  { id: "d3", name: "Analisis UASA 2024.xlsx", type: "excel", date_label: "16 Mei 2025", url: null, position: 3 },
  { id: "d4", name: "Kertas Kerja Ihya Ramadan 2025.pdf", type: "pdf", date_label: "15 Mei 2025", url: null, position: 4 },
  { id: "d5", name: "Takwim Panitia 2025.pdf", type: "pdf", date_label: "14 Mei 2025", url: null, position: 5 },
];

export const seedEvidence: Evidence[] = [
  { id: "e1", title: "Majlis Tilawah Al-Quran", image_url: null, gradient: "from-emerald-500 to-green-800", date_label: "Mei 2025", position: 1 },
  { id: "e2", title: "Ceramah Perdana", image_url: null, gradient: "from-teal-500 to-emerald-800", date_label: "Mei 2025", position: 2 },
  { id: "e3", title: "Solat Hajat Perdana", image_url: null, gradient: "from-green-600 to-teal-900", date_label: "Mei 2025", position: 3 },
  { id: "e4", title: "Kem Bestari Solat", image_url: null, gradient: "from-amber-500 to-orange-700", date_label: "Mei 2025", position: 4 },
  { id: "e5", title: "Perhimpunan Bulanan", image_url: null, gradient: "from-sky-500 to-indigo-800", date_label: "Mei 2025", position: 5 },
  { id: "e6", title: "Aktiviti Kumpulan", image_url: null, gradient: "from-cyan-500 to-blue-800", date_label: "Mei 2025", position: 6 },
];

export const seedPerformance: PerformancePoint[] = [
  { id: "pf1", label: "Tahun 2021", value: 65, position: 1 },
  { id: "pf2", label: "Tahun 2022", value: 72, position: 2 },
  { id: "pf3", label: "Tahun 2023", value: 78, position: 3 },
  { id: "pf4", label: "Tahun 2024", value: 85, position: 4 },
];

export const seedMonitoring: MonitoringItem[] = [
  { id: "m1", document: "Carta Organisasi", status: "lengkap", position: 1 },
  { id: "m2", document: "Minit Mesyuarat", status: "lengkap", position: 2 },
  { id: "m3", document: "Takwim Panitia", status: "lengkap", position: 3 },
  { id: "m4", document: "Pelan Strategik", status: "lengkap", position: 4 },
  { id: "m5", document: "OPPM", status: "lengkap", position: 5 },
  { id: "m6", document: "Analisis Data", status: "kemaskini", position: 6 },
  { id: "m7", document: "Evidens Program", status: "lengkap", position: 7 },
];

export const seedQuickLinks: QuickLink[] = [
  // Folder Google Drive
  { id: "q1", name: "Drive Utama Panitia", url: "https://drive.google.com", icon: "drive", color: "#1FA463", position: 1, category: "Google Drive" },
  { id: "q2", name: "Bahan Mengajar", url: "https://drive.google.com", icon: "book", color: "#8B5CF6", position: 2, category: "Google Drive" },
  { id: "q3", name: "Laporan & Analisis", url: "https://drive.google.com", icon: "analysis", color: "#0EA5E9", position: 3, category: "Google Drive" },
  { id: "q4", name: "Dokumen Rasmi", url: "https://drive.google.com", icon: "doc", color: "#EF4444", position: 4, category: "Google Drive" },
  { id: "q5", name: "Program & Aktiviti", url: "https://drive.google.com", icon: "program", color: "#F59E0B", position: 5, category: "Google Drive" },
  { id: "q6", name: "Pendidikan Islam", url: "https://drive.google.com", icon: "folder", color: "#14B8A6", position: 6, category: "Google Drive" },
  // Aplikasi & sistem
  { id: "q7", name: "SPLKPM", url: "https://splkpm.moe.gov.my", icon: "splkpm", color: "#0EA5E9", position: 7, category: "Aplikasi" },
  { id: "q8", name: "DELIMA", url: "https://delima.edu.my", icon: "delima", color: "#EF4444", position: 8, category: "Aplikasi" },
  { id: "q9", name: "Canva", url: "https://www.canva.com", icon: "canva", color: "#00C4CC", position: 9, category: "Aplikasi" },
  { id: "q10", name: "ChatGPT", url: "https://chat.openai.com", icon: "chatgpt", color: "#10A37F", position: 10, category: "Aplikasi" },
  { id: "q11", name: "Gemini", url: "https://gemini.google.com", icon: "gemini", color: "#4285F4", position: 11, category: "Aplikasi" },
];

export const seedAiCategories: AiCategory[] = [
  { id: "c1", name: "RPH & PdP", icon: "BookOpen", color: "violet", prompt_count: 23, position: 1 },
  { id: "c2", name: "Analisis Data", icon: "BarChart3", color: "blue", prompt_count: 18, position: 2 },
  { id: "c3", name: "Surat Rasmi", icon: "Mail", color: "emerald", prompt_count: 15, position: 3 },
  { id: "c4", name: "Kajian Tindakan", icon: "Search", color: "amber", prompt_count: 12, position: 4 },
  { id: "c5", name: "Laporan Program", icon: "FileBarChart", color: "teal", prompt_count: 20, position: 5 },
];

export const seedAiPrompts: AiPrompt[] = [
  { id: "pr1", category_id: "c1", title: "Jana RPH Pendidikan Islam (PdPc)", content: "Bina Rancangan Pengajaran Harian bagi mata pelajaran Pendidikan Islam Tahun [TAHUN], tajuk [TAJUK]. Sertakan objektif, standard pembelajaran, set induksi, aktiviti PdPc (EMK & KBAT), pentaksiran (PBD) dan refleksi.", tags: ["RPH", "PdPc", "PBD"], is_favorite: true },
  { id: "pr2", category_id: "c1", title: "Aktiviti Didik Hibur Tilawah", content: "Cadangkan 5 aktiviti didik hibur untuk PdPc Tilawah Al-Quran yang menarik dan sesuai dengan murid [TAHAP].", tags: ["PdPc", "Tilawah"], is_favorite: false },
  { id: "pr3", category_id: "c2", title: "Analisis Keputusan UASA", content: "Analisiskan data keputusan UASA berikut dan berikan dapatan, gred purata mata pelajaran (GPMP), serta cadangan intervensi: [DATA].", tags: ["UASA", "Analisis"], is_favorite: true },
  { id: "pr4", category_id: "c3", title: "Surat Jemputan Program", content: "Tuliskan surat rasmi jemputan kepada [PIHAK] untuk menghadiri program [NAMA PROGRAM] pada [TARIKH] di [TEMPAT].", tags: ["Surat", "Rasmi"], is_favorite: false },
  { id: "pr5", category_id: "c4", title: "Kerangka Kajian Tindakan", content: "Bina kerangka kajian tindakan bertajuk [TAJUK] mengikut model Kemmis & McTaggart lengkap dengan refleksi awal, perancangan, tindakan, pemerhatian dan refleksi.", tags: ["Kajian Tindakan"], is_favorite: false },
  { id: "pr6", category_id: "c5", title: "Laporan Pelaksanaan Program", content: "Sediakan laporan pelaksanaan program [NAMA] merangkumi objektif, pelaksanaan, kehadiran, kekuatan, penambahbaikan dan lampiran evidens.", tags: ["Laporan", "Program"], is_favorite: true },
];

export const seedCalendarEvents: CalendarEvent[] = [
  { id: "ce1", title: "Mesyuarat Panitia Bil. 2/2025", date: "2025-05-20", location: "Bilik Panitia", accent: "green" },
  { id: "ce2", title: "Program Ihya Ramadan", date: "2025-05-26", location: "Dewan As-Syakirin", accent: "gold" },
  { id: "ce3", title: "Tarikh Akhir Hantar Laporan", date: "2025-05-30", location: "Dalam Talian", accent: "rose" },
  { id: "ce4", title: "Kem Bestari Solat", date: "2025-06-10", location: "Surau Al-Ikhlas", accent: "blue" },
  { id: "ce5", title: "Mahrajan Al-Quran", date: "2025-06-25", location: "Dewan As-Syakirin", accent: "green" },
];

// ---------------------------------------------------------------------------
// Data Murid + JQAF (24 contoh murid merentas Tahun 1–6)
// ---------------------------------------------------------------------------
export const seedStudents: Student[] = [
  { id: "mu-01", name: "Muhammad Adam bin Ahmad", mykid: "180312-10-1234", year: 6, class_name: "6 Bestari", gender: "L", guardian: "Ahmad bin Ismail", phone: "012-3456789", address: "No. 12, Jalan Melur, Taman Indah", jqaf_status: "menguasai", notes: "Cemerlang tilawah", position: 1 },
  { id: "mu-02", name: "Nur Aisyah binti Razak", mykid: "180521-10-2345", year: 6, class_name: "6 Bestari", gender: "P", guardian: "Razak bin Hamid", phone: "013-2233445", address: "No. 5, Lorong Kenanga", jqaf_status: "menguasai", notes: "", position: 2 },
  { id: "mu-03", name: "Aiman Hakimi bin Yusof", mykid: "180704-10-3456", year: 6, class_name: "6 Amanah", gender: "L", guardian: "Yusof bin Ali", phone: "019-8765432", address: "No. 88, Jalan Seri", jqaf_status: "tidak_menguasai", notes: "Perlu bimbingan jawi", position: 3 },
  { id: "mu-04", name: "Siti Khadijah binti Omar", mykid: "180915-10-4567", year: 6, class_name: "6 Amanah", gender: "P", guardian: "Omar bin Salleh", phone: "017-5566778", address: "No. 23, Taman Damai", jqaf_status: "menguasai", notes: "", position: 4 },
  { id: "mu-05", name: "Danish Iqbal bin Kamal", mykid: "190102-10-5678", year: 5, class_name: "5 Bestari", gender: "L", guardian: "Kamal bin Hassan", phone: "012-1122334", address: "No. 7, Jalan Cempaka", jqaf_status: "menguasai", notes: "", position: 5 },
  { id: "mu-06", name: "Nur Hidayah binti Salim", mykid: "190218-10-6789", year: 5, class_name: "5 Bestari", gender: "P", guardian: "Salim bin Daud", phone: "011-2345678", address: "No. 30, Taman Sentosa", jqaf_status: "tidak_menguasai", notes: "Bacaan perlu dipertingkat", position: 6 },
  { id: "mu-07", name: "Haziq Danial bin Rahman", mykid: "190330-10-7890", year: 5, class_name: "5 Amanah", gender: "L", guardian: "Rahman bin Idris", phone: "014-9988776", address: "No. 14, Jalan Mawar", jqaf_status: "menguasai", notes: "", position: 7 },
  { id: "mu-08", name: "Alya Sofea binti Hisham", mykid: "190411-10-8901", year: 5, class_name: "5 Amanah", gender: "P", guardian: "Hisham bin Karim", phone: "016-7766554", address: "No. 9, Taman Permai", jqaf_status: "menguasai", notes: "", position: 8 },
  { id: "mu-09", name: "Iskandar Zulkarnain bin Aziz", mykid: "200107-10-9012", year: 4, class_name: "4 Bestari", gender: "L", guardian: "Aziz bin Latif", phone: "012-3344556", address: "No. 41, Jalan Teratai", jqaf_status: "tidak_menguasai", notes: "", position: 9 },
  { id: "mu-10", name: "Balqis Humaira binti Fauzi", mykid: "200229-10-0123", year: 4, class_name: "4 Bestari", gender: "P", guardian: "Fauzi bin Noor", phone: "013-4455667", address: "No. 18, Taman Harmoni", jqaf_status: "menguasai", notes: "", position: 10 },
  { id: "mu-11", name: "Luqman Hakim bin Zainal", mykid: "200315-10-1235", year: 4, class_name: "4 Amanah", gender: "L", guardian: "Zainal bin Musa", phone: "019-5544332", address: "No. 26, Jalan Dahlia", jqaf_status: "menguasai", notes: "", position: 11 },
  { id: "mu-12", name: "Sofia Nadhirah binti Anuar", mykid: "200428-10-2346", year: 4, class_name: "4 Amanah", gender: "P", guardian: "Anuar bin Halim", phone: "017-6655443", address: "No. 3, Taman Suria", jqaf_status: "menguasai", notes: "", position: 12 },
  { id: "mu-13", name: "Zikri Hadif bin Roslan", mykid: "210109-10-3457", year: 3, class_name: "3 Bestari", gender: "L", guardian: "Roslan bin Bakar", phone: "011-7788990", address: "No. 52, Jalan Kasturi", jqaf_status: "tidak_menguasai", notes: "Pemulihan iqra'", position: 13 },
  { id: "mu-14", name: "Qistina Sofea binti Nizam", mykid: "210220-10-4568", year: 3, class_name: "3 Bestari", gender: "P", guardian: "Nizam bin Sani", phone: "014-8899001", address: "No. 11, Taman Bahagia", jqaf_status: "menguasai", notes: "", position: 14 },
  { id: "mu-15", name: "Adam Mikael bin Faisal", mykid: "210331-10-5679", year: 3, class_name: "3 Amanah", gender: "L", guardian: "Faisal bin Othman", phone: "016-9900112", address: "No. 35, Jalan Cendana", jqaf_status: "menguasai", notes: "", position: 15 },
  { id: "mu-16", name: "Nur Damia binti Saiful", mykid: "210412-10-6780", year: 3, class_name: "3 Amanah", gender: "P", guardian: "Saiful bin Manan", phone: "012-1212343", address: "No. 8, Taman Melati", jqaf_status: "menguasai", notes: "", position: 16 },
  { id: "mu-17", name: "Harith Naufal bin Zaki", mykid: "220105-10-7891", year: 2, class_name: "2 Bestari", gender: "L", guardian: "Zaki bin Husin", phone: "013-2323454", address: "No. 47, Jalan Anggerik", jqaf_status: "tidak_menguasai", notes: "", position: 17 },
  { id: "mu-18", name: "Nur Iman binti Hafiz", mykid: "220216-10-8902", year: 2, class_name: "2 Bestari", gender: "P", guardian: "Hafiz bin Razali", phone: "019-3434565", address: "No. 19, Taman Ria", jqaf_status: "menguasai", notes: "", position: 18 },
  { id: "mu-19", name: "Irfan Hadi bin Suhaimi", mykid: "220327-10-9013", year: 2, class_name: "2 Amanah", gender: "L", guardian: "Suhaimi bin Jalil", phone: "017-4545676", address: "No. 6, Jalan Seroja", jqaf_status: "menguasai", notes: "", position: 19 },
  { id: "mu-20", name: "Aisyah Humaira binti Rosli", mykid: "220408-10-0124", year: 2, class_name: "2 Amanah", gender: "P", guardian: "Rosli bin Yaakob", phone: "011-5656787", address: "No. 28, Taman Jaya", jqaf_status: "menguasai", notes: "", position: 20 },
  { id: "mu-21", name: "Ziyad Ammar bin Helmi", mykid: "230111-10-1236", year: 1, class_name: "1 Bestari", gender: "L", guardian: "Helmi bin Sabri", phone: "014-6767898", address: "No. 54, Jalan Tanjung", jqaf_status: "tidak_menguasai", notes: "Baharu mengenal huruf", position: 21 },
  { id: "mu-22", name: "Nur Sabrina binti Azhar", mykid: "230222-10-2347", year: 1, class_name: "1 Bestari", gender: "P", guardian: "Azhar bin Mokhtar", phone: "016-7878909", address: "No. 13, Taman Mutiara", jqaf_status: "menguasai", notes: "", position: 22 },
  { id: "mu-23", name: "Rayyan Hakimi bin Johari", mykid: "230303-10-3458", year: 1, class_name: "1 Amanah", gender: "L", guardian: "Johari bin Wahab", phone: "012-8989010", address: "No. 39, Jalan Bunga Raya", jqaf_status: "menguasai", notes: "", position: 23 },
  { id: "mu-24", name: "Sofea Adriana binti Rizal", mykid: "230414-10-4569", year: 1, class_name: "1 Amanah", gender: "P", guardian: "Rizal bin Ghani", phone: "013-9090121", address: "No. 2, Taman Impian", jqaf_status: "tidak_menguasai", notes: "", position: 24 },
];

// ---------------------------------------------------------------------------
// Checklist Tugasan (Kanban)
// ---------------------------------------------------------------------------
export const seedTasks: Task[] = [
  { id: "tk-01", title: "Sediakan laporan program Ramadan", due_date: "22 Mei 2025", priority: "tinggi", notes: "Lengkap dengan evidens & kehadiran", status: "perlu", position: 1 },
  { id: "tk-02", title: "Kemas kini data JQAF Tahun 6", due_date: "25 Mei 2025", priority: "tinggi", notes: "", status: "perlu", position: 2 },
  { id: "tk-03", title: "Sediakan minit mesyuarat panitia", due_date: "27 Mei 2025", priority: "sederhana", notes: "", status: "perlu", position: 3 },
  { id: "tk-04", title: "Semak kehadiran murid mingguan", due_date: "30 Mei 2025", priority: "sederhana", notes: "", status: "perlu", position: 4 },
  { id: "tk-05", title: "Analisis prestasi JQAF", due_date: "18 Mei 2025", priority: "tinggi", notes: "Carta penguasaan ikut tahun", status: "sedang", position: 5 },
  { id: "tk-06", title: "Penyediaan modul PdP", due_date: "20 Mei 2025", priority: "sederhana", notes: "", status: "sedang", position: 6 },
  { id: "tk-07", title: "Urusan dokumentasi program", due_date: "21 Mei 2025", priority: "rendah", notes: "", status: "sedang", position: 7 },
  { id: "tk-08", title: "Mesyuarat panitia bil. 2/2025", due_date: "15 Mei 2025", priority: "sederhana", notes: "Selesai", status: "selesai", position: 8 },
  { id: "tk-09", title: "Laporan program bulan April", due_date: "14 Mei 2025", priority: "rendah", notes: "", status: "selesai", position: 9 },
  { id: "tk-10", title: "Kemas kini fail panitia", due_date: "12 Mei 2025", priority: "rendah", notes: "", status: "selesai", position: 10 },
];

// ---------------------------------------------------------------------------
// Audit Trail (rekod aktiviti)
// ---------------------------------------------------------------------------
export const seedAudit: AuditEntry[] = [
  { id: "au-01", action: "edit", module: "JQAF", detail: "Mengemaskini status JQAF — Tahun 6 Bestari", at: "2025-05-20T14:30:00", actor: "Azhari" },
  { id: "au-02", action: "tambah", module: "Data Murid", detail: "Menambah murid baharu: Muhammad Adam bin Ahmad", at: "2025-05-20T11:15:00", actor: "Azhari" },
  { id: "au-03", action: "upload", module: "Dokumen", detail: "Memuat naik fail: Laporan Program Ramadan 2025.pdf", at: "2025-05-20T10:05:00", actor: "Azhari" },
  { id: "au-04", action: "backup", module: "Sistem", detail: "Backup harian berjaya ke Google Drive", at: "2025-05-20T02:00:00", actor: "Sistem" },
  { id: "au-05", action: "edit", module: "Program", detail: "Mengemaskini butiran Program Ihya Ramadan", at: "2025-05-19T16:40:00", actor: "Azhari" },
  { id: "au-06", action: "tambah", module: "Checklist", detail: "Menambah tugasan: Sediakan minit mesyuarat panitia", at: "2025-05-19T09:20:00", actor: "Azhari" },
  { id: "au-07", action: "padam", module: "Dokumen", detail: "Memadam fail lama: Draf Takwim 2024.docx", at: "2025-05-18T15:10:00", actor: "Azhari" },
  { id: "au-08", action: "login", module: "Sistem", detail: "Log masuk ke MyPI Command Center", at: "2025-05-18T08:00:00", actor: "Azhari" },
];

/** Reference "today" used by the mini-calendar to mirror the design (20 Mei 2025). */
export const seedToday = { year: 2025, month: 4, day: 20 }; // month is 0-indexed (4 = Mei)
