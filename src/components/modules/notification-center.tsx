"use client";

import * as React from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface Notif {
  id: string;
  category: string;
  title: string;
  detail: string;
  time: string;
  icon: string;
  tone: "emerald" | "sky" | "amber" | "rose" | "violet";
}

const TONES: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
};

export function NotificationCenter({ items }: { items: Notif[] }) {
  const categories = ["Semua", ...Array.from(new Set(items.map((i) => i.category)))];
  const [cat, setCat] = React.useState("Semua");
  const [read, setRead] = React.useState<Set<string>>(new Set());

  const filtered = cat === "Semua" ? items : items.filter((i) => i.category === cat);
  const unread = items.length - read.size;

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Bell className="size-6 text-brand" /> Notifikasi
            {unread > 0 && (
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">{unread}</span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">Pusat notifikasi masa nyata sistem</p>
        </div>
        <button
          type="button"
          onClick={() => setRead(new Set(items.map((i) => i.id)))}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <CheckCheck className="size-4" /> Tanda semua dibaca
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              cat === c ? "border-brand bg-brand text-white" : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        {filtered.map((n) => {
          const isRead = read.has(n.id);
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setRead((s) => new Set(s).add(n.id))}
              className={cn(
                "flex w-full items-start gap-3 border-b border-border/60 px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-muted/40",
                !isRead && "bg-brand/[0.03]",
              )}
            >
              <span className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg", TONES[n.tone])}>
                <Icon name={n.icon} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                  {!isRead && <span className="size-2 shrink-0 rounded-full bg-rose-500" />}
                </div>
                <p className="truncate text-sm text-muted-foreground">{n.detail}</p>
                <p className="text-xs text-muted-foreground/70">{n.time}</p>
              </div>
              <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {n.category}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Tiada notifikasi.</p>
        )}
      </div>
    </div>
  );
}
