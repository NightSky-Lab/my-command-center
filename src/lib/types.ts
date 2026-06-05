// ===========================================================================
// MyPI Command Center — Domain types
// These mirror the Supabase tables in /supabase/schema.sql.
// ===========================================================================

export type IconName = string;

/**
 * Sidebar sections (match GAMBAR reference):
 *  - "main"   → MENU UTAMA
 *  - "module" → MODUL UTAMA
 *  - "system" → SISTEM
 * Legacy values ("top" / "sidebar") kept for backward compatibility.
 */
export type MenuGroup = "main" | "module" | "system" | "top" | "sidebar";

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  group: MenuGroup;
  /** Tailwind text colour class used for the sidebar icon, e.g. "text-emerald-400". */
  color?: string | null;
  position: number;
  is_active: boolean;
}

export interface SiteSettings {
  id: string;
  org_name: string;
  org_subtitle: string;
  logo_text: string;
  logo_emoji: string;
  // Hero banner
  banner_eyebrow: string;
  banner_title: string;
  banner_subtitle: string;
  banner_slogan: string;
  banner_image_url: string | null;
  // Sidebar
  calligraphy_text: string;
  motto_title: string;
  motto_text: string;
  motto_image_url: string | null;
  // Footer
  footer_text: string;
  // Theme (overridable via CMS — applied as CSS variables at runtime)
  brand_color: string; // #013220
  brand_dark: string; // #004225
  brand_light: string; // #0a5c3a
  brand_gold: string; // #c9a227
  brand_gold_soft: string; // #e7c66b
  default_theme: "light" | "dark" | "system";
  current_year: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
}

export interface Announcement {
  id: string;
  day: string; // "18"
  month: string; // "MEI"
  title: string;
  subtitle: string | null;
  meta: string | null; // location / time line
  accent: "green" | "gold" | "blue";
  position: number;
}

export type StatColor =
  | "emerald"
  | "blue"
  | "violet"
  | "teal"
  | "amber"
  | "green";

export interface Stat {
  id: string;
  key: string;
  label: string;
  value: number;
  suffix: string; // "" or "%"
  sublabel: string;
  icon: IconName;
  color: StatColor;
  position: number;
}

export type ProgramStatus = "perancangan" | "berjalan" | "selesai";

export interface Program {
  id: string;
  title: string;
  date_label: string;
  location: string;
  start_day: string; // "26"
  start_month: string; // "MEI"
  thumbnail_url: string | null;
  accent: "green" | "gold" | "rose";
  position: number;
  // Butiran penuh (modul Program Unit Pendidikan Islam)
  time?: string; // Masa
  objective?: string; // Objektif
  target?: string; // Sasaran
  committee?: string; // AJK
  budget?: string; // Bajet
  report?: string; // Laporan
  status?: ProgramStatus;
}

export type DocType = "pdf" | "word" | "excel" | "ppt" | "image";

export interface DocumentItem {
  id: string;
  name: string;
  type: DocType;
  date_label: string;
  url: string | null;
  position: number;
}

export interface Evidence {
  id: string;
  title: string;
  image_url: string | null;
  /** Gradient fallback (from/to tailwind classes) when no image is set. */
  gradient: string;
  date_label: string | null;
  position: number;
}

export interface PerformancePoint {
  id: string;
  label: string; // "Tahun 2021"
  value: number; // 65
  position: number;
}

export type MonitoringStatus = "lengkap" | "semakan" | "kemaskini";

export interface MonitoringItem {
  id: string;
  document: string;
  status: MonitoringStatus;
  position: number;
}

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: IconName; // brand glyph key
  color: string; // hex used for the tile glyph
  position: number;
  category?: string; // cth: Drive Utama, Panitia, Program
}

export interface AiCategory {
  id: string;
  name: string;
  icon: IconName;
  color: StatColor;
  prompt_count: number;
  position: number;
}

export interface AiPrompt {
  id: string;
  category_id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  created_at?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  location: string | null;
  accent: "green" | "gold" | "blue" | "rose";
}

// ---------------------------------------------------------------------------
// Module: Data Murid + JQAF
// ---------------------------------------------------------------------------
export type JqafStatus = "menguasai" | "tidak_menguasai";
export type Gender = "L" | "P";

export interface Student {
  id: string;
  name: string;
  /** No. KP / MyKid */
  mykid: string;
  /** Tahun 1–6 */
  year: number;
  /** Kelas, cth "6 Bestari" */
  class_name: string;
  gender: Gender;
  /** Nama penjaga */
  guardian: string;
  phone: string;
  address: string;
  jqaf_status: JqafStatus;
  notes: string;
  position: number;
}

// ---------------------------------------------------------------------------
// Module: Checklist Tugasan (Kanban)
// ---------------------------------------------------------------------------
export type TaskStatus = "perlu" | "sedang" | "selesai";
export type TaskPriority = "tinggi" | "sederhana" | "rendah";

export interface Task {
  id: string;
  title: string;
  /** Tarikh tamat tempoh — label bebas atau ISO */
  due_date: string;
  priority: TaskPriority;
  notes: string;
  status: TaskStatus;
  position: number;
}

// ---------------------------------------------------------------------------
// Module: Audit Trail
// ---------------------------------------------------------------------------
export type AuditAction = "tambah" | "edit" | "padam" | "upload" | "backup" | "login";

export interface AuditEntry {
  id: string;
  action: AuditAction;
  module: string;
  detail: string;
  /** ISO datetime */
  at: string;
  actor: string;
}

/** Everything the dashboard needs in one payload. */
export interface DashboardData {
  settings: SiteSettings;
  user: CurrentUser;
  menu: MenuItem[];
  announcements: Announcement[];
  stats: Stat[];
  programs: Program[];
  documents: DocumentItem[];
  evidence: Evidence[];
  performance: PerformancePoint[];
  monitoring: MonitoringItem[];
  quickLinks: QuickLink[];
  aiCategories: AiCategory[];
}
