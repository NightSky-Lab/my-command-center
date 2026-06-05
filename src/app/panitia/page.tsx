import Link from "next/link";
import {
  Landmark,
  FileText,
  CalendarDays,
  FolderOpen,
  ClipboardList,
  BarChart3,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { getDocuments } from "@/lib/data";
import { DocumentBrowser } from "@/components/modules/document-browser";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panitia Pendidikan Islam" };

const SECTIONS = [
  { label: "Minit Mesyuarat", desc: "Rekod & minit mesyuarat panitia", icon: FileText, href: "/pusat-dokumen", tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { label: "Takwim Panitia", desc: "Jadual aktiviti & program tahunan", icon: CalendarDays, href: "/kalendar", tone: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" },
  { label: "Fail Panitia", desc: "Dokumen & fail rasmi panitia", icon: FolderOpen, href: "/pusat-dokumen", tone: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  { label: "Laporan Aktiviti", desc: "Laporan pelaksanaan program", icon: ClipboardList, href: "/program", tone: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
  { label: "Analisis Data", desc: "Analisis prestasi & pencapaian", icon: BarChart3, href: "/analisis", tone: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
  { label: "Surat Rasmi", desc: "Surat menyurat & makluman", icon: Mail, href: "/pusat-dokumen", tone: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" },
];

export default async function PanitiaPage() {
  const documents = await getDocuments();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Landmark className="size-6 text-brand" /> Panitia Pendidikan Islam
        </h1>
        <p className="text-sm text-muted-foreground">Pusat pengurusan panitia — minit, takwim, fail, laporan & surat rasmi</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${s.tone}`}>
              <s.icon className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 font-semibold text-foreground">
                {s.label}
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <DocumentBrowser
        documents={documents}
        title="Dokumen Panitia"
        description="Semua dokumen rasmi panitia Pendidikan Islam"
        iconName="FolderOpen"
      />
    </div>
  );
}
