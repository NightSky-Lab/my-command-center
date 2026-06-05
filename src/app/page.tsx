import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ListChecks,
  UserPlus,
  Upload,
  Sparkles,
  FileBarChart,
  DatabaseBackup,
  FileSpreadsheet,
  QrCode,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  Folder,
  ArrowUpRight,
  Megaphone,
  Activity,
  CircleDashed,
  Loader2,
} from "lucide-react";
import {
  getCurrentUser,
  getStudents,
  getTasks,
  getPrograms,
  getQuickLinks,
  getDocuments,
  getCalendarEvents,
  getAnnouncements,
} from "@/lib/data";
import { JqafAnalysis } from "@/components/dashboard/jqaf-analysis";
import { DashCalendar } from "@/components/dashboard/dash-calendar";
import { LiveClock } from "@/components/layout/live-clock";
import { QuickLinkGlyph } from "@/components/dashboard/quick-links";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TONES: Record<string, string> = {
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};

const DOC_STYLE: Record<string, { icon: React.ElementType; tone: string; label: string }> = {
  pdf: { icon: FileText, tone: "text-rose-500", label: "PDF" },
  word: { icon: FileText, tone: "text-sky-500", label: "Word" },
  excel: { icon: FileSpreadsheet, tone: "text-emerald-500", label: "Excel" },
  ppt: { icon: FileText, tone: "text-orange-500", label: "PPT" },
  image: { icon: ImageIcon, tone: "text-violet-500", label: "Imej" },
};

const QUICK_ACTIONS = [
  { label: "Tambah Murid", href: "/data-murid", icon: UserPlus, tone: "sky" },
  { label: "Upload Fail", href: "/dokumen", icon: Upload, tone: "emerald" },
  { label: "AI Assistant", href: "/ai-hub", icon: Sparkles, tone: "violet" },
  { label: "Jana Laporan", href: "/analisis", icon: FileBarChart, tone: "amber" },
  { label: "Backup Sekarang", href: "/admin", icon: DatabaseBackup, tone: "emerald" },
  { label: "Import Excel", href: "/data-murid", icon: FileSpreadsheet, tone: "sky" },
  { label: "QR Code", href: "/audit", icon: QrCode, tone: "violet" },
  { label: "Bantuan", href: "/panduan", icon: HelpCircle, tone: "amber" },
];

const TASK_GROUPS = [
  { status: "perlu", label: "Perlu Dibuat", icon: CircleDashed, tone: "text-rose-600 dark:text-rose-400" },
  { status: "sedang", label: "Sedang Dibuat", icon: Loader2, tone: "text-amber-600 dark:text-amber-400" },
  { status: "selesai", label: "Selesai", icon: CheckCircle2, tone: "text-emerald-600 dark:text-emerald-400" },
] as const;

function StatCard({
  label, value, suffix, sub, icon: Icon, tone,
}: {
  label: string; value: number; suffix?: string; sub?: string; icon: React.ElementType; tone: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid size-9 place-items-center rounded-lg", TONES[tone])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-1.5 text-2xl font-bold text-foreground">
        {value.toLocaleString("en-US")}
        {suffix}
      </p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Panel({
  title, icon: Icon, href, children,
}: {
  title: string; icon: React.ElementType; href?: string; children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <Icon className="size-5 text-brand" /> {title}
        </h2>
        {href && (
          <Link href={href} className="text-xs font-medium text-brand hover:underline">
            Lihat Semua
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default async function DashboardPage() {
  const [user, students, tasks, programs, quickLinks, documents, events, announcements] =
    await Promise.all([
      getCurrentUser(),
      getStudents(),
      getTasks(),
      getPrograms(),
      getQuickLinks(),
      getDocuments(),
      getCalendarEvents(),
      getAnnouncements(),
    ]);

  const total = students.length;
  const masters = students.filter((s) => s.jqaf_status === "menguasai").length;
  const fails = total - masters;
  const pct = total ? Math.round((masters / total) * 1000) / 10 : 0;
  const undone = tasks.filter((t) => t.status !== "selesai").length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Assalamualaikum, {user.name} <span className="align-middle">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground">Selamat datang ke MyPI Command Center</p>
        </div>
        <p className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-card sm:text-sm">
          <LiveClock />
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Jumlah Murid" value={total} sub="Orang" icon={Users} tone="sky" />
        <StatCard label="Murid Menguasai JQAF" value={masters} sub={`${pct}% penguasaan`} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Tidak Menguasai JQAF" value={fails} sub={`${(100 - pct).toFixed(1)}%`} icon={XCircle} tone="rose" />
        <StatCard label="Program Aktif" value={programs.length} sub="Program" icon={CalendarDays} tone="violet" />
        <StatCard label="Tugasan Belum Selesai" value={undone} sub="Tugasan" icon={ListChecks} tone="amber" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left / main */}
        <div className="col-span-12 space-y-5 xl:col-span-8">
          <JqafAnalysis students={students} />

          <div className="grid gap-5 md:grid-cols-2">
            {/* Program akan datang */}
            <Panel title="Program Akan Datang" icon={CalendarDays} href="/program">
              <ul className="space-y-3">
                {programs.slice(0, 4).map((p) => (
                  <li key={p.id} className="flex gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand/10 text-center leading-none text-brand">
                      <span>
                        <span className="block text-base font-bold">{p.start_day}</span>
                        <span className="block text-[9px] font-semibold uppercase">{p.start_month}</span>
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{p.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.date_label}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.location}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Checklist summary */}
            <Panel title="Checklist Tugasan" icon={ListChecks} href="/checklist">
              <div className="space-y-3">
                {TASK_GROUPS.map((g) => {
                  const items = tasks.filter((t) => t.status === g.status);
                  return (
                    <div key={g.status}>
                      <p className={cn("mb-1 flex items-center gap-1.5 text-xs font-semibold", g.tone)}>
                        <g.icon className="size-3.5" /> {g.label} ({items.length})
                      </p>
                      <ul className="space-y-1">
                        {items.slice(0, 2).map((t) => (
                          <li key={t.id} className="flex items-center gap-2 text-sm text-foreground/80">
                            <span className={cn("size-1.5 shrink-0 rounded-full", g.status === "selesai" ? "bg-emerald-500" : g.status === "sedang" ? "bg-amber-500" : "bg-rose-500")} />
                            <span className={cn("truncate", g.status === "selesai" && "line-through opacity-60")}>{t.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Fail terbaru */}
            <Panel title="Fail Terbaru" icon={Folder} href="/dokumen">
              <ul className="space-y-2.5">
                {documents.slice(0, 5).map((d) => {
                  const st = DOC_STYLE[d.type] ?? DOC_STYLE.pdf;
                  return (
                    <li key={d.id} className="flex items-center gap-3">
                      <st.icon className={cn("size-5 shrink-0", st.tone)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.date_label}</p>
                      </div>
                      <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {st.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            {/* Aktiviti terkini */}
            <Panel title="Aktiviti Terkini" icon={Activity} href="/audit">
              <ul className="space-y-3">
                {tasks.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex gap-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">
                        <span className="font-semibold">{user.name}</span>{" "}
                        {t.status === "selesai" ? "menyelesaikan" : "mengemaskini"} tugasan
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{t.title} • {t.due_date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>

        {/* Right rail */}
        <div className="col-span-12 space-y-5 xl:col-span-4">
          {/* Pintasan pantas */}
          <Panel title="Pintasan Pantas" icon={Sparkles}>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-2 text-center transition-colors hover:border-brand/40 hover:bg-brand/5"
                >
                  <span className={cn("grid size-9 place-items-center rounded-lg", TONES[a.tone])}>
                    <a.icon className="size-[18px]" />
                  </span>
                  <span className="text-[10px] font-medium leading-tight text-muted-foreground">{a.label}</span>
                </Link>
              ))}
            </div>
          </Panel>

          {/* Pautan Google Drive */}
          <Panel title="Pautan Google Drive" icon={Folder} href="/link">
            <ul className="space-y-1">
              {quickLinks.slice(0, 6).map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${l.color}1a` }}>
                      <QuickLinkGlyph icon={l.icon} color={l.color} className="size-5" />
                    </span>
                    <span className="flex-1 truncate text-sm font-medium text-foreground">{l.name}</span>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Kalendar */}
          <DashCalendar events={events} />

          {/* Notifikasi terkini */}
          <Panel title="Notifikasi Terkini" icon={Megaphone} href="/notifikasi">
            <ul className="space-y-3">
              {announcements.slice(0, 5).map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                    <Megaphone className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.day} {a.month}{a.meta ? ` • ${a.meta}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
