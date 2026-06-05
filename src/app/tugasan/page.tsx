import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { getPrograms } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tugasan Saya" };

type Priority = "tinggi" | "sederhana" | "rendah";
type TaskStatus = "belum" | "proses" | "selesai";

const PRIORITY: Record<Priority, { label: string; variant: "destructive" | "warning" | "secondary" }> = {
  tinggi: { label: "Keutamaan Tinggi", variant: "destructive" },
  sederhana: { label: "Sederhana", variant: "warning" },
  rendah: { label: "Rendah", variant: "secondary" },
};
const STATUS: Record<TaskStatus, { label: string; variant: "success" | "info" | "secondary" }> = {
  selesai: { label: "Selesai", variant: "success" },
  proses: { label: "Dalam Proses", variant: "info" },
  belum: { label: "Belum Mula", variant: "secondary" },
};

export default async function TugasanPage() {
  const programs = await getPrograms();

  const tasks = [
    {
      id: "t-report",
      title: "Hantar Laporan Program Mei 2025",
      due: "30 Mei 2025",
      priority: "tinggi" as Priority,
      status: "proses" as TaskStatus,
    },
    ...programs.map((p, i) => ({
      id: `t-${p.id}`,
      title: `Sediakan kertas kerja & evidens: ${p.title}`,
      due: p.date_label,
      priority: (i === 0 ? "tinggi" : "sederhana") as Priority,
      status: (i === 0 ? "proses" : "belum") as TaskStatus,
    })),
    {
      id: "t-minit",
      title: "Edar minit Mesyuarat Panitia Bil. 2/2025",
      due: "22 Mei 2025",
      priority: "sederhana" as Priority,
      status: "belum" as TaskStatus,
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tugasan Saya"
        description="Senarai tugasan & tindakan susulan yang perlu diselesaikan."
        icon="ClipboardList"
      />
      <div className="space-y-3">
        {tasks.map((t) => {
          const pr = PRIORITY[t.priority];
          const st = STATUS[t.status];
          return (
            <div
              key={t.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <CalendarClock className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{t.title}</p>
                <p className="text-xs text-muted-foreground">
                  Tarikh akhir: {t.due}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={pr.variant}>{pr.label}</Badge>
                <Badge variant={st.variant}>{st.label}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
