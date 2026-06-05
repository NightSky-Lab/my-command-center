"use client";

import * as React from "react";
import { ZoomIn } from "lucide-react";
import type { Evidence } from "@/lib/types";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function EvidenceGallery({ evidence }: { evidence: Evidence[] }) {
  const [active, setActive] = React.useState<Evidence | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {evidence.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setActive(e)}
            className="group relative aspect-square overflow-hidden rounded-xl shadow-card"
          >
            {e.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={e.image_url}
                alt={e.title}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div
                className={cn(
                  "size-full bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                  e.gradient,
                )}
              />
            )}
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
            <ZoomIn className="absolute right-2 top-2 size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5">
              <p className="truncate text-xs font-semibold text-white">
                {e.title}
              </p>
              {e.date_label && (
                <p className="truncate text-[10px] text-white/70">
                  {e.date_label}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <Dialog
        open={!!active}
        onClose={() => setActive(null)}
        className="max-w-2xl"
      >
        {active && (
          <div className="space-y-3">
            {active.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.image_url}
                alt={active.title}
                className="max-h-[60vh] w-full rounded-lg object-contain"
              />
            ) : (
              <div
                className={cn(
                  "flex aspect-video w-full items-center justify-center rounded-lg bg-gradient-to-br text-white",
                  active.gradient,
                )}
              >
                <span className="text-lg font-semibold">{active.title}</span>
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-foreground">
                {active.title}
              </p>
              {active.date_label && (
                <p className="text-sm text-muted-foreground">
                  {active.date_label}
                </p>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
