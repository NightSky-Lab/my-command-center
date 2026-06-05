// ===========================================================================
// Data access layer (server side).
// Reads from Supabase when configured; otherwise falls back to seed data so the
// dashboard always renders the reference design out-of-the-box.
// ===========================================================================

import { getSupabaseServer } from "./supabase/server";
import { TABLES } from "./tables";
import {
  seedAiCategories,
  seedAiPrompts,
  seedAnnouncements,
  seedCalendarEvents,
  seedDocuments,
  seedEvidence,
  seedMenu,
  seedMonitoring,
  seedPerformance,
  seedPrograms,
  seedQuickLinks,
  seedSettings,
  seedStats,
  seedStudents,
  seedTasks,
  seedAudit,
  seedUser,
} from "./seed-data";
import type {
  AiCategory,
  AiPrompt,
  Announcement,
  CalendarEvent,
  CurrentUser,
  DashboardData,
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

// Revalidate cached reads frequently so CMS edits show up quickly.
export const revalidate = 0;

async function fetchOrdered<T>(
  table: string,
  fallback: T[],
  orderColumn = "position",
): Promise<T[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderColumn, { ascending: true });
    if (error || !data || data.length === 0) return fallback;
    return data as T[];
  } catch {
    return fallback;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseServer();
  if (!supabase) return seedSettings;
  try {
    const { data, error } = await supabase
      .from(TABLES.settings)
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return seedSettings;
    return { ...seedSettings, ...(data as Partial<SiteSettings>) } as SiteSettings;
  } catch {
    return seedSettings;
  }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = getSupabaseServer();
  if (!supabase) return seedUser;
  try {
    const { data, error } = await supabase
      .from(TABLES.users)
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return seedUser;
    return data as CurrentUser;
  } catch {
    return seedUser;
  }
}

export const getMenu = () => fetchOrdered<MenuItem>(TABLES.menu, seedMenu);
export const getAnnouncements = () =>
  fetchOrdered<Announcement>(TABLES.announcements, seedAnnouncements);
export const getStats = () => fetchOrdered<Stat>(TABLES.stats, seedStats);
export const getPrograms = () =>
  fetchOrdered<Program>(TABLES.programs, seedPrograms);
export const getDocuments = () =>
  fetchOrdered<DocumentItem>(TABLES.documents, seedDocuments);
export const getEvidence = () =>
  fetchOrdered<Evidence>(TABLES.evidence, seedEvidence);
export const getPerformance = () =>
  fetchOrdered<PerformancePoint>(TABLES.performance, seedPerformance);
export const getMonitoring = () =>
  fetchOrdered<MonitoringItem>(TABLES.monitoring, seedMonitoring);
export const getQuickLinks = () =>
  fetchOrdered<QuickLink>(TABLES.quickLinks, seedQuickLinks);
export const getAiCategories = () =>
  fetchOrdered<AiCategory>(TABLES.aiCategories, seedAiCategories);
export const getAiPrompts = () =>
  fetchOrdered<AiPrompt>(TABLES.aiPrompts, seedAiPrompts, "title");
export const getCalendarEvents = () =>
  fetchOrdered<CalendarEvent>(TABLES.calendarEvents, seedCalendarEvents, "date");
export const getStudents = () =>
  fetchOrdered<Student>(TABLES.students, seedStudents);
export const getTasks = () => fetchOrdered<Task>(TABLES.tasks, seedTasks);
export const getAudit = () => fetchOrdered<AuditEntry>(TABLES.audit, seedAudit, "at");

/** Aggregate everything the dashboard needs in a single parallel fetch. */
export async function getDashboardData(): Promise<DashboardData> {
  const [
    settings,
    user,
    menu,
    announcements,
    stats,
    programs,
    documents,
    evidence,
    performance,
    monitoring,
    quickLinks,
    aiCategories,
  ] = await Promise.all([
    getSettings(),
    getCurrentUser(),
    getMenu(),
    getAnnouncements(),
    getStats(),
    getPrograms(),
    getDocuments(),
    getEvidence(),
    getPerformance(),
    getMonitoring(),
    getQuickLinks(),
    getAiCategories(),
  ]);

  return {
    settings,
    user,
    menu,
    announcements,
    stats,
    programs,
    documents,
    evidence,
    performance,
    monitoring,
    quickLinks,
    aiCategories,
  };
}
