import { getAnnouncements, getPrograms, getTasks, getDocuments } from "@/lib/data";
import { NotificationCenter, type Notif } from "@/components/modules/notification-center";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifikasi" };

export default async function NotifikasiPage() {
  const [announcements, programs, tasks, documents] = await Promise.all([
    getAnnouncements(),
    getPrograms(),
    getTasks(),
    getDocuments(),
  ]);

  const items: Notif[] = [];

  for (const p of programs.slice(0, 4))
    items.push({
      id: `n-prog-${p.id}`,
      category: "Program",
      title: "Program akan datang",
      detail: `${p.title} — ${p.date_label}`,
      time: `${p.start_day} ${p.start_month}`,
      icon: "CalendarDays",
      tone: "sky",
    });

  for (const t of tasks.filter((t) => t.status !== "selesai").slice(0, 5))
    items.push({
      id: `n-task-${t.id}`,
      category: "Tugasan",
      title: t.priority === "tinggi" ? "Tugasan keutamaan tinggi" : "Tugasan belum selesai",
      detail: t.title,
      time: t.due_date,
      icon: "ListChecks",
      tone: t.priority === "tinggi" ? "rose" : "amber",
    });

  for (const d of documents.slice(0, 4))
    items.push({
      id: `n-doc-${d.id}`,
      category: "Fail",
      title: "Fail baharu dimuat naik",
      detail: d.name,
      time: d.date_label,
      icon: "FileText",
      tone: "violet",
    });

  for (const a of announcements)
    items.push({
      id: `n-ann-${a.id}`,
      category: "Pengumuman",
      title: a.title,
      detail: a.subtitle ?? a.meta ?? "",
      time: `${a.day} ${a.month}`,
      icon: "Megaphone",
      tone: "emerald",
    });

  items.push({
    id: "n-backup",
    category: "Backup",
    title: "Backup harian berjaya",
    detail: "Data disandarkan ke Google Drive",
    time: "20 Mei 2025 • 2:00 AM",
    icon: "DatabaseBackup",
    tone: "emerald",
  });

  return <NotificationCenter items={items} />;
}
