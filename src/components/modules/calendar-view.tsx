"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { CalendarEvent } from "@/lib/types";
import { cn, monthName } from "@/lib/utils";
import { seedToday } from "@/lib/seed-data";

const DOW = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Ahd"];
const ACCENT: Record<string, string> = {
  green: "bg-emerald-500",
  gold: "bg-amber-500",
  blue: "bg-sky-500",
  rose: "bg-rose-500",
};
const ACCENT_SOFT: Record<string, string> = {
  green: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  gold: "border-l-amber-500 bg-amber-50 dark:bg-amber-500/10",
  blue: "border-l-sky-500 bg-sky-50 dark:bg-sky-500/10",
  rose: "border-l-rose-500 bg-rose-50 dark:bg-rose-500/10",
};

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = React.useState({ y: seedToday.year, m: seedToday.month });

  const byDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const firstDay = new Date(view.y, view.m, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

  const cells: { day: number | null; iso?: string }[] = [];
  for (let i = 0; i < offset; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, iso });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null });

  const monthEvents = events
    .filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return y === view.y && m === view.m + 1;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const move = (dir: number) =>
    setView((v) => {
      let m = v.m + dir;
      let y = v.y;
      if (m < 0) (m = 11), y--;
      else if (m > 11) (m = 0), y++;
      return { y, m };
    });

  const isToday = (iso?: string) =>
    iso ===
    `${seedToday.year}-${String(seedToday.month + 1).padStart(2, "0")}-${String(seedToday.day).padStart(2, "0")}`;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {monthName(view.m)} {view.y}
          </h2>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Bulan sebelum"
              className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setView({ y: seedToday.year, m: seedToday.month })}
              className="rounded-md border border-border px-3 text-xs font-medium hover:bg-muted"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Bulan seterusnya"
              className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border pb-2 text-center text-xs font-semibold text-muted-foreground">
          {DOW.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 pt-1">
          {cells.map((c, i) => {
            const dayEvents = c.iso ? byDay.get(c.iso) ?? [] : [];
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[76px] rounded-lg border border-transparent p-1.5 text-left align-top",
                  c.day && "border-border/60 bg-muted/20",
                  isToday(c.iso) && "border-brand bg-brand/5",
                )}
              >
                {c.day && (
                  <>
                    <span
                      className={cn(
                        "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium",
                        isToday(c.iso)
                          ? "bg-brand font-bold text-white"
                          : "text-foreground",
                      )}
                    >
                      {c.day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.map((e) => (
                        <div
                          key={e.id}
                          title={e.title}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-[10px] font-medium text-white",
                            ACCENT[e.accent],
                          )}
                        >
                          {e.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">
          Acara {monthName(view.m)}
        </h3>
        <div className="space-y-2">
          {monthEvents.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Tiada acara bulan ini.
            </p>
          )}
          {monthEvents.map((e) => {
            const [y, m, d] = e.date.split("-").map(Number);
            return (
              <div
                key={e.id}
                className={cn(
                  "rounded-lg border-l-4 p-3",
                  ACCENT_SOFT[e.accent],
                )}
              >
                <p className="text-sm font-semibold text-foreground">
                  {e.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {d} {monthName(m - 1)} {y}
                </p>
                {e.location && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-brand">
                    <MapPin className="size-3" /> {e.location}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
