// ===========================================================================
// Local AI query engine — answers natural-language (Bahasa Melayu) questions
// about the user's own data WITHOUT any external API or cost.
// Handles the exact examples from the spec, e.g.:
//   "Cari murid Tahun 6 yang belum menguasai JQAF"
//   "Berapa jumlah murid yang belum menguasai bacaan Al-Quran?"
//   "Paparkan program bulan ini"
// ===========================================================================

import type { Student, Program, Task, DocumentItem } from "./types";

export interface AiData {
  students: Student[];
  programs: Program[];
  tasks: Task[];
  documents: DocumentItem[];
}

export interface AiResultItem {
  title: string;
  subtitle?: string;
  href?: string;
}

export interface AiResult {
  answer: string;
  items?: AiResultItem[];
}

const WORD_NUM: Record<string, number> = {
  satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6,
};

function detectYear(q: string): number | null {
  const m = q.match(/tahun\s*(\d)/);
  if (m) return Number(m[1]);
  for (const [w, n] of Object.entries(WORD_NUM)) {
    if (q.includes(`tahun ${w}`)) return n;
  }
  return null;
}

function has(q: string, ...words: string[]) {
  return words.some((w) => q.includes(w));
}

export function answerQuery(rawQuery: string, data: AiData): AiResult {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return { answer: "Sila taip soalan anda." };

  const isCount = has(q, "berapa", "jumlah", "bilangan", "bil ");
  const wantFail = has(q, "belum", "tidak menguasai", "tak kuasai", "tidak kuasai", "lemah");
  const wantMaster = has(q, "menguasai", "kuasai", "cemerlang") && !wantFail;

  // ---- STUDENTS ----------------------------------------------------------
  if (
    has(q, "murid", "pelajar", "jqaf", "bacaan", "al-quran", "alquran", "quran") ||
    detectYear(q) !== null ||
    wantFail ||
    (wantMaster && !has(q, "program", "tugasan"))
  ) {
    let list = data.students;
    const year = detectYear(q);
    if (year) list = list.filter((s) => s.year === year);
    if (has(q, "lelaki", "lpki", "lk")) list = list.filter((s) => s.gender === "L");
    if (has(q, "perempuan", "pmpn")) list = list.filter((s) => s.gender === "P");

    const classMatch = q.match(/kelas\s+([a-z0-9\s]+)/);
    if (classMatch) {
      const c = classMatch[1].trim();
      list = list.filter((s) => s.class_name.toLowerCase().includes(c));
    }

    if (wantFail) list = list.filter((s) => s.jqaf_status === "tidak_menguasai");
    else if (wantMaster) list = list.filter((s) => s.jqaf_status === "menguasai");

    const statusLabel = wantFail ? "belum menguasai" : wantMaster ? "menguasai" : "";
    const yearLabel = year ? `Tahun ${year} ` : "";

    if (isCount || (has(q, "peratus") && !list.length)) {
      return {
        answer: `Terdapat ${list.length} murid ${yearLabel}${statusLabel ? `yang ${statusLabel} ` : ""}JQAF${
          statusLabel ? "" : " sepadan carian"
        }.`,
        items: list.slice(0, 8).map((s) => ({
          title: s.name,
          subtitle: `Tahun ${s.year} ${s.class_name} • ${s.jqaf_status === "menguasai" ? "Menguasai" : "Tidak Menguasai"}`,
          href: "/data-murid",
        })),
      };
    }

    if (has(q, "peratus")) {
      const total = data.students.length;
      const masters = data.students.filter((s) => s.jqaf_status === "menguasai").length;
      const pct = total ? Math.round((masters / total) * 1000) / 10 : 0;
      return { answer: `Peratus penguasaan JQAF ialah ${pct}% (${masters} daripada ${total} murid menguasai).` };
    }

    return {
      answer: list.length
        ? `Ditemui ${list.length} murid ${yearLabel}${statusLabel ? `yang ${statusLabel} ` : ""}JQAF:`
        : `Tiada murid ${yearLabel}${statusLabel ? `yang ${statusLabel} ` : ""}ditemui.`,
      items: list.slice(0, 12).map((s) => ({
        title: s.name,
        subtitle: `Tahun ${s.year} ${s.class_name} • ${s.gender === "L" ? "Lelaki" : "Perempuan"} • ${
          s.jqaf_status === "menguasai" ? "Menguasai" : "Tidak Menguasai"
        }`,
        href: "/data-murid",
      })),
    };
  }

  // ---- PROGRAMS ----------------------------------------------------------
  if (has(q, "program", "aktiviti", "majlis", "kem", "sambutan")) {
    let list = data.programs;
    if (has(q, "selesai", "tamat")) list = list.filter((p) => p.status === "selesai");
    else if (has(q, "berjalan", "sedang")) list = list.filter((p) => p.status === "berjalan");
    else if (has(q, "rancang", "perancangan", "akan datang", "akan dtg")) list = list.filter((p) => p.status !== "selesai");

    if (isCount) return { answer: `Terdapat ${list.length} program.`, items: list.slice(0, 8).map((p) => ({ title: p.title, subtitle: `${p.date_label} • ${p.location}`, href: "/program" })) };
    return {
      answer: list.length ? `Ditemui ${list.length} program:` : "Tiada program ditemui.",
      items: list.map((p) => ({ title: p.title, subtitle: `${p.date_label} • ${p.location}`, href: "/program" })),
    };
  }

  // ---- TASKS -------------------------------------------------------------
  if (has(q, "tugasan", "kerja", "checklist", "to-do", "todo")) {
    let list = data.tasks;
    if (has(q, "selesai", "siap")) list = list.filter((t) => t.status === "selesai");
    else if (has(q, "belum", "tertunggak", "lewat")) list = list.filter((t) => t.status !== "selesai");
    if (isCount) return { answer: `Terdapat ${list.length} tugasan.` };
    return {
      answer: list.length ? `Ditemui ${list.length} tugasan:` : "Tiada tugasan ditemui.",
      items: list.map((t) => ({ title: t.title, subtitle: `${t.due_date} • ${t.status === "selesai" ? "Selesai" : t.status === "sedang" ? "Sedang Dibuat" : "Perlu Dibuat"}`, href: "/checklist" })),
    };
  }

  // ---- DOCUMENTS ---------------------------------------------------------
  if (has(q, "dokumen", "fail", "laporan", "minit", "surat", "pdf")) {
    const term = q.replace(/cari|dokumen|fail|laporan/g, "").trim();
    const list = term
      ? data.documents.filter((d) => d.name.toLowerCase().includes(term))
      : data.documents;
    return {
      answer: list.length ? `Ditemui ${list.length} dokumen:` : "Tiada dokumen ditemui.",
      items: list.slice(0, 12).map((d) => ({ title: d.name, subtitle: d.date_label, href: "/pusat-dokumen" })),
    };
  }

  // ---- GLOBAL FALLBACK SEARCH -------------------------------------------
  const items: AiResultItem[] = [];
  data.students.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 5).forEach((s) =>
    items.push({ title: s.name, subtitle: `Murid • Tahun ${s.year} ${s.class_name}`, href: "/data-murid" }),
  );
  data.programs.filter((p) => p.title.toLowerCase().includes(q)).slice(0, 5).forEach((p) =>
    items.push({ title: p.title, subtitle: `Program • ${p.date_label}`, href: "/program" }),
  );
  data.documents.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 5).forEach((d) =>
    items.push({ title: d.name, subtitle: `Dokumen • ${d.date_label}`, href: "/pusat-dokumen" }),
  );

  if (items.length) return { answer: `Ditemui ${items.length} hasil untuk "${rawQuery}":`, items };
  return {
    answer:
      `Maaf, saya belum faham sepenuhnya soalan itu. Cuba tanya seperti: ` +
      `"Berapa murid Tahun 6 belum menguasai JQAF", "Program akan datang", atau "Tugasan belum selesai".`,
  };
}
