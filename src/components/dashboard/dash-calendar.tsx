"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import type { CalendarEvent } from "@/lib/types";
import { monthName } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DOW = ["ISN", "SEL", "RAB", "KHA", "JUM", "SAB", "AHD"];

export function DashCalendar({ events = [] }: { events?: CalendarEvent[] }) {
  // Ikut tarikh sebenar (auto). Gate dengan mount untuk elak hydration mismatch.
  const [today, setToday] = React.useState<{ y: number; m: number; d: number } | null>(null);
  React.useEffect(() => {
    const n = new Date();
    setToday({ y: n.getFullYear(), m: n.getMonth(), d: n.getDate() });
  }, []);
  const [view, setView] = React.useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });

  const eventDays = React.useMemo(() => new Set(events.map((e) => e.date)), [events]);

  const firstDay = new Date(view.y, view.m, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const daysInPrev = new Date(view.y, view.m, 0).getDate();

  const cells: { day: number; current: boolean; iso?: string }[] = [];
  for (let i = mondayOffset - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, current: true, iso });
  }
  while (cells.length % 7 !== 0) cells.push({ day: cells.length, current: false });

  const move = (dir: number) =>
    setView((v) => {
      let m = v.m + dir;
      let y = v.y;
      if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
      return { y, m };
    });

  const isToday = (c: { day: number; current: boolean }) =>
    !!today && c.current && view.y === today.y && view.m === today.m && c.day === today.d;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <CalendarDays className="size-5 text-brand" /> Kalendar
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={() => move(-1)} aria-label="Sebelum" className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted">
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-[88px] text-center text-xs font-semibold text-foreground">
            {monthName(view.m)} {view.y}
          </span>
          <button onClick={() => move(1)} aria-label="Seterusnya" className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-semibold text-muted-foreground">
        {DOW.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-xs">
        {cells.map((c, i) => {
          const today = isToday(c);
          const hasEvent = c.iso && eventDays.has(c.iso);
          return (
            <div key={i} className="flex justify-center">
              <span
                className={cn(
                  "relative flex size-7 items-center justify-center rounded-full transition-colors",
                  !c.current && "text-muted-foreground/30",
                  c.current && !today && "text-foreground hover:bg-muted",
                  today && "bg-brand font-bold text-white",
                )}
              >
                {c.day}
                {hasEvent && !today && (
                  <span className="absolute bottom-0.5 size-1 rounded-full bg-brand-gold" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
