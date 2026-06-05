import {
  getAiPrompts,
  getAnnouncements,
  getDocuments,
  getEvidence,
  getPrograms,
  getStudents,
  getTasks,
} from "./data";

export type SearchType =
  | "Dokumen"
  | "Program"
  | "Evidens"
  | "Pengumuman"
  | "AI Prompt"
  | "Murid"
  | "Tugasan";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: SearchType;
  icon: string;
}

/** Builds a global search index from all searchable content. */
export async function buildSearchItems(): Promise<SearchItem[]> {
  const [documents, programs, evidence, announcements, prompts, students, tasks] =
    await Promise.all([
      getDocuments(),
      getPrograms(),
      getEvidence(),
      getAnnouncements(),
      getAiPrompts(),
      getStudents(),
      getTasks(),
    ]);

  const items: SearchItem[] = [];

  for (const d of documents)
    items.push({
      id: `doc-${d.id}`,
      title: d.name,
      subtitle: `Dokumen • ${d.date_label}`,
      href: "/dokumen",
      type: "Dokumen",
      icon: "FileText",
    });

  for (const p of programs)
    items.push({
      id: `prog-${p.id}`,
      title: p.title,
      subtitle: `Program • ${p.date_label} • ${p.location}`,
      href: "/program",
      type: "Program",
      icon: "CalendarDays",
    });

  for (const e of evidence)
    items.push({
      id: `evi-${e.id}`,
      title: e.title,
      subtitle: `Evidens • ${e.date_label ?? ""}`.trim(),
      href: "/evidens",
      type: "Evidens",
      icon: "Image",
    });

  for (const a of announcements)
    items.push({
      id: `ann-${a.id}`,
      title: a.title,
      subtitle: `Pengumuman • ${a.subtitle ?? ""}`.trim(),
      href: "/kalendar",
      type: "Pengumuman",
      icon: "Megaphone",
    });

  for (const pr of prompts)
    items.push({
      id: `ai-${pr.id}`,
      title: pr.title,
      subtitle: `AI Prompt • ${pr.tags.join(", ")}`,
      href: "/ai-hub",
      type: "AI Prompt",
      icon: "Sparkles",
    });

  for (const m of students)
    items.push({
      id: `mu-${m.id}`,
      title: m.name,
      subtitle: `Murid • Tahun ${m.year} ${m.class_name} • ${
        m.jqaf_status === "menguasai" ? "Menguasai" : "Tidak Menguasai"
      } JQAF`,
      href: "/data-murid",
      type: "Murid",
      icon: "GraduationCap",
    });

  for (const t of tasks)
    items.push({
      id: `tk-${t.id}`,
      title: t.title,
      subtitle: `Tugasan • ${t.due_date} • ${
        t.status === "perlu" ? "Perlu Dibuat" : t.status === "sedang" ? "Sedang Dibuat" : "Selesai"
      }`,
      href: "/checklist",
      type: "Tugasan",
      icon: "ListChecks",
    });

  return items;
}
