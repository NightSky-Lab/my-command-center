import { MapPin } from "lucide-react";
import type { Program } from "@/lib/types";
import { SectionCard } from "./section-card";
import { cn } from "@/lib/utils";

const ACCENT: Record<string, string> = {
  green: "from-emerald-500 to-green-800",
  gold: "from-amber-500 to-orange-700",
  rose: "from-rose-500 to-pink-800",
};

const BADGE: Record<string, string> = {
  green: "bg-brand text-brand-gold",
  gold: "bg-amber-500 text-white",
  rose: "bg-rose-600 text-white",
};

export function UpcomingPrograms({ programs }: { programs: Program[] }) {
  return (
    <SectionCard
      title="Program Akan Datang"
      icon="CalendarDays"
      href="/program"
      bodyClassName="space-y-3"
    >
      {programs.map((p) => (
        <div key={p.id} className="flex items-center gap-3">
          {/* thumbnail */}
          <div
            className={cn(
              "relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br text-white",
              ACCENT[p.accent] ?? ACCENT.green,
            )}
          >
            {p.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.thumbnail_url}
                alt={p.title}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-center text-[10px] font-bold uppercase leading-tight">
                {p.start_day}
                <br />
                {p.start_month}
              </span>
            )}
          </div>
          {/* date badge */}
          <div
            className={cn(
              "flex size-12 shrink-0 flex-col items-center justify-center rounded-lg leading-none",
              BADGE[p.accent] ?? BADGE.green,
            )}
          >
            <span className="text-base font-extrabold">{p.start_day}</span>
            <span className="text-[10px] font-semibold uppercase">
              {p.start_month}
            </span>
          </div>
          {/* text */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">
              {p.title}
            </p>
            <p className="text-xs text-muted-foreground">{p.date_label}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-brand">
              <MapPin className="size-3" />
              {p.location}
            </p>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}
