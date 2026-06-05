"use client";

import * as React from "react";
import type { Stat } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { cn, formatNumber } from "@/lib/utils";

const COLORS: Record<string, string> = {
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  teal: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  green: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
};

function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatCard({ stat }: { stat: Stat }) {
  const value = useCountUp(stat.value);
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-card-hover">
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105",
          COLORS[stat.color] ?? COLORS.emerald,
        )}
      >
        <Icon name={stat.icon} className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {stat.label}
        </p>
        <p className="text-2xl font-extrabold leading-tight text-foreground">
          {formatNumber(value)}
          {stat.suffix}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {stat.sublabel}
        </p>
      </div>
    </div>
  );
}

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <StatCard key={s.id} stat={s} />
      ))}
    </div>
  );
}
