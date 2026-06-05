"use client";

import * as React from "react";
import {
  Search,
  LayoutGrid,
  List,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Download,
  Eye,
  Upload,
} from "lucide-react";
import type { DocumentItem, DocType } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOC_STYLE: Record<DocType, { icon: React.ElementType; tone: string; bg: string; label: string }> = {
  pdf: { icon: FileText, tone: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", label: "PDF" },
  word: { icon: FileText, tone: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10", label: "Word" },
  excel: { icon: FileSpreadsheet, tone: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Excel" },
  ppt: { icon: FileText, tone: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", label: "PPT" },
  image: { icon: ImageIcon, tone: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10", label: "Imej" },
};

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "pdf", label: "PDF" },
  { value: "word", label: "Word" },
  { value: "excel", label: "Excel" },
  { value: "ppt", label: "PPT" },
  { value: "image", label: "Imej" },
];

export function DocumentBrowser({
  documents,
  title,
  description,
  iconName = "Archive",
}: {
  documents: DocumentItem[];
  title: string;
  description: string;
  iconName?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const filtered = documents.filter((d) => {
    if (type && d.type !== type) return false;
    return d.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Icon name={iconName} className="size-6 text-brand" /> {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="brand">
          <Upload className="size-4" /> Muat Naik
        </Button>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari dokumen…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setType(f.value)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                type === f.value ? "bg-brand text-white" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 border-l border-border pl-2">
          <button type="button" onClick={() => setView("grid")} aria-label="Grid" className={cn("rounded-md p-2", view === "grid" ? "bg-muted text-brand" : "text-muted-foreground")}>
            <LayoutGrid className="size-4" />
          </button>
          <button type="button" onClick={() => setView("list")} aria-label="List" className={cn("rounded-md p-2", view === "list" ? "bg-muted text-brand" : "text-muted-foreground")}>
            <List className="size-4" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((d) => {
            const st = DOC_STYLE[d.type] ?? DOC_STYLE.pdf;
            return (
              <div key={d.id} className="group flex flex-col rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className={cn("mb-3 grid h-24 place-items-center rounded-lg", st.bg)}>
                  <st.icon className={cn("size-10", st.tone)} />
                </div>
                <p className="line-clamp-2 text-sm font-medium text-foreground">{d.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{d.date_label}</p>
                <div className="mt-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-muted py-1.5 text-xs text-muted-foreground hover:text-brand"><Eye className="size-3.5" /> Lihat</button>
                  <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-muted py-1.5 text-xs text-muted-foreground hover:text-brand"><Download className="size-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          {filtered.map((d) => {
            const st = DOC_STYLE[d.type] ?? DOC_STYLE.pdf;
            return (
              <div key={d.id} className="flex items-center gap-3 border-b border-border/60 px-4 py-3 transition-colors last:border-0 hover:bg-muted/40">
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", st.bg)}>
                  <st.icon className={cn("size-5", st.tone)} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.date_label}</p>
                </div>
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{st.label}</span>
                <button className="rounded-md p-1.5 text-muted-foreground hover:text-brand"><Download className="size-4" /></button>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">Tiada dokumen ditemui.</p>
      )}
    </div>
  );
}
