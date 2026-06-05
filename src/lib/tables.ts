// Central registry of Supabase table names, shared by the data layer and CMS.
export const TABLES = {
  settings: "site_settings",
  users: "app_users",
  menu: "menu_items",
  announcements: "announcements",
  stats: "stats",
  programs: "programs",
  documents: "documents",
  evidence: "evidence",
  performance: "performance",
  monitoring: "monitoring",
  quickLinks: "quick_links",
  aiCategories: "ai_categories",
  aiPrompts: "ai_prompts",
  calendarEvents: "calendar_events",
  students: "students",
  tasks: "tasks",
  audit: "audit_log",
} as const;

export type TableKey = keyof typeof TABLES;
