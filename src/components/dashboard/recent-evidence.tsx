"use client";

import * as React from "react";
import { ZoomIn } from "lucide-react";
import type { Evidence } from "@/lib/types";
import { SectionCard } from "./section-card";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function Tile({
  item,
  onClick,
}: {
  item: Evidence;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[4/3] overflow-hidden rounded-lg"
    >
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <div
          className={cn(
            "size-full bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
            item.gradient,
          )}
        />
      )}
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/35" />
      <ZoomIn className="absolute right-2 top-2 size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-2 transition-transform duration-300 group-hover:translate-y-0">
        <p className="truncate text-[11px] font-semibold text-white">
          {item.title}
        </p>
      </div>
    </button>
  );
}

export function RecentEvidence({ evidence }: { evidence: Evidence[] }) {
  const [active, setActive] = React.useState<Evidence | null>(null);

  return (
    <>
      <SectionCard
        title="Evidens Terkini"
        icon="Camera"
        href="/evidens"
        bodyClassName="grid grid-cols-3 gap-2.5"
      >
        {evidence.map((e) => (
          <Tile key={e.id} item={e} onClick={() => setActive(e)} />
        ))}
      </SectionCard>

      <Dialog open={!!active} onClose={() => setActive(null)} className="max-w-2xl">
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
