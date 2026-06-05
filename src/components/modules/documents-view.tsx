"use client";

import * as React from "react";
import { Download, ExternalLink, FileDown, Search } from "lucide-react";
import type { DocType, DocumentItem } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, exportToCsv } from "@/lib/utils";

const META: Record<DocType, { icon: string; label: string; color: string }> = {
  pdf: { icon: "FileText", label: "PDF", color: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
  word: { icon: "FileType", label: "Word", color: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400" },
  excel: { icon: "Sheet", label: "Excel", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" },
  ppt: { icon: "Presentation", label: "PowerPoint", color: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400" },
  image: { icon: "Image", label: "Imej", color: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400" },
};

const FILTERS: { key: DocType | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "pdf", label: "PDF" },
  { key: "word", label: "Word" },
  { key: "excel", label: "Excel" },
  { key: "ppt", label: "PowerPoint" },
  { key: "image", label: "Imej" },
];

export function DocumentsView({ documents }: { documents: DocumentItem[] }) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<DocType | "all">("all");

  const filtered = documents.filter(
    (d) =>
      (filter === "all" || d.type === filter) &&
      d.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari dokumen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() =>
            exportToCsv(
              "dokumen",
              filtered.map((d) => ({
                nama: d.name,
                jenis: d.type,
                tarikh: d.date_label,
              })),
            )
          }
        >
          <FileDown className="size-4" /> Eksport CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === f.key
                ? "border-brand bg-brand text-white"
                : "border-border bg-card text-muted-foreground hover:border-brand-gold/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((d) => {
          const m = META[d.type];
          return (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-lg",
                  m.color,
                )}
              >
                <Icon name={m.icon} className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {d.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.label} • {d.date_label}
                </p>
              </div>
              {d.url ? (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                  aria-label="Buka"
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : (
                <span className="text-muted-foreground/50">
                  <Download className="size-4" />
                </span>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            Tiada dokumen dijumpai.
          </p>
        )}
      </div>
    </div>
  );
}
