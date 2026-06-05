"use client";

import * as React from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import type { DocType, DocumentItem } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { SectionCard } from "./section-card";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const META: Record<
  DocType,
  { icon: string; label: string; color: string }
> = {
  pdf: { icon: "FileText", label: "PDF", color: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
  word: { icon: "FileType", label: "Word", color: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400" },
  excel: { icon: "Sheet", label: "Excel", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" },
  ppt: { icon: "Presentation", label: "PowerPoint", color: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400" },
  image: { icon: "Image", label: "Imej", color: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400" },
};

export function RecentDocuments({ documents }: { documents: DocumentItem[] }) {
  const [active, setActive] = React.useState<DocumentItem | null>(null);
  const meta = active ? META[active.type] : null;

  return (
    <>
      <SectionCard
        title="Dokumen Terkini"
        icon="FolderClosed"
        href="/dokumen"
        bodyClassName="divide-y divide-border"
      >
        {documents.map((d) => {
          const m = META[d.type];
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d)}
              className="flex w-full items-center gap-3 py-2.5 text-left transition-colors first:pt-0 last:pb-0 hover:opacity-80"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  m.color,
                )}
              >
                <Icon name={m.icon} className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {d.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {m.label}
                </span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {d.date_label}
              </span>
            </button>
          );
        })}
      </SectionCard>

      <Dialog open={!!active} onClose={() => setActive(null)}>
        {active && meta && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-lg",
                    meta.color,
                  )}
                >
                  <Icon name={meta.icon} className="size-6" />
                </span>
                <div className="min-w-0">
                  <DialogTitle className="truncate">{active.name}</DialogTitle>
                  <p className="text-xs text-muted-foreground">
                    {meta.label} • {active.date_label}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {active.url ? (
              <div className="space-y-3">
                {active.type === "pdf" && (
                  <iframe
                    src={active.url}
                    title={active.name}
                    className="h-72 w-full rounded-lg border border-border"
                  />
                )}
                <div className="flex gap-2">
                  <Button
                    variant="brand"
                    onClick={() => window.open(active.url!, "_blank")}
                  >
                    <ExternalLink className="size-4" /> Buka
                  </Button>
                  <a
                    href={active.url}
                    download
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    <Download className="size-4" /> Muat Turun
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-10 text-center">
                <FileText className="size-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Pratonton tidak tersedia
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Muat naik fail sebenar melalui Panel Admin → Dokumen untuk
                  mengaktifkan pratonton & muat turun.
                </p>
              </div>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}
