import type { Metadata } from "next";
import { Database } from "lucide-react";
import {
  getAiCategories,
  getAiPrompts,
  getAnnouncements,
  getCalendarEvents,
  getDocuments,
  getEvidence,
  getMenu,
  getMonitoring,
  getPerformance,
  getPrograms,
  getQuickLinks,
  getSettings,
  getStats,
} from "@/lib/data";
import { isSupabaseConfiguredServer } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel Admin (CMS)" };

export default async function AdminPage() {
  const [
    settings,
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
    aiPrompts,
    calendarEvents,
  ] = await Promise.all([
    getSettings(),
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
    getAiPrompts(),
    getCalendarEvents(),
  ]);

  const connected = isSupabaseConfiguredServer();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Panel Admin — CMS"
        description="Urus semua kandungan, menu, warna & data tanpa menyentuh kod sumber."
        icon="Settings"
        actions={
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
              connected
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
            )}
          >
            <Database className="size-3.5" />
            {connected ? "Supabase Disambung" : "Mod Demo (Tiada Supabase)"}
          </span>
        }
      />
      <AdminPanel
        data={{
          settings,
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
          aiPrompts,
          calendarEvents,
        }}
      />
    </div>
  );
}
