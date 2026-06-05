"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "@/lib/types";
import { monthName } from "@/lib/utils";
import { seedToday } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

const DOW = ["ISN", "SEL", "RAB", "KHA", "JUM", "SAB", "AHAD"];

export function MiniCalendar({
  events = [],
  year,
}: {
  events?: CalendarEvent[];
  year: number;
}) {
  const [view, setView] = React.useState({ y: year, m: seedToday.month });

  React.useEffect(() => {
    setView((v) => ({ ...v, y: year }));
  }, [year]);

  const eventDays = React.useMemo(() => {
    const set = new Set<string>();
    for (const e of events) set.add(e.date);
    return set;
  }, [events]);

  const firstDay = new Date(view.y, view.m, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const daysInPrev = new Date(view.y, view.m, 0).getDate();

  const cells: { day: number; current: boolean; iso?: string }[] = [];
  for (let i = mondayOffset - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, current: true, iso });
  }
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - daysInMonth - mondayOffset + 1, current: false });

  const move = (dir: number) => {
    setView((v) => {
      let m = v.m + dir;
      let y = v.y;
      if (m < 0) {
        m = 11;
        y--;
      } else if (m > 11) {
        m = 0;
        y++;
      }
      return { y, m };
    });
  };

  const isToday = (c: { day: number; current: boolean }) =>
    c.current &&
    view.y === seedToday.year &&
    view.m === seedToday.month &&
    c.day === seedToday.day;

  return (
    <div className="select-none">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Bulan sebelum"
          className="flex size-6 items-center justify-center rounded-md text-brand-gold/80 transition-colors hover:bg-white/10 hover:text-brand-gold"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
          {monthName(view.m)} {view.y}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Bulan seterusnya"
          className="flex size-6 items-center justify-center rounded-md text-brand-gold/80 transition-colors hover:bg-white/10 hover:text-brand-gold"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-medium text-emerald-200/70">
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
                  "relative flex size-6 items-center justify-center rounded-full transition-colors",
                  !c.current && "text-emerald-100/25",
                  c.current && !today && "text-emerald-50/90 hover:bg-white/10",
                  today &&
                    "bg-emerald-400 font-bold text-brand-dark shadow-[0_0_0_3px_rgba(52,211,153,0.25)]",
                )}
              >
                {c.day}
                {hasEvent && !today && (
                  <span className="absolute -bottom-0.5 size-1 rounded-full bg-brand-gold" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
