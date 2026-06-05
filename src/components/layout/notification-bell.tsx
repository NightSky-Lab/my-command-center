"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  icon: string;
  accent?: "green" | "gold" | "rose" | "blue";
}

const ACCENT: Record<string, string> = {
  green: "bg-emerald-100 text-emerald-700",
  gold: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
  blue: "bg-sky-100 text-sky-700",
};

export function NotificationBell({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifikasi"
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell className="size-[18px]" />
        {notifications.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-card">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-card-hover animate-fade-in">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">Notifikasi</span>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700">
              {notifications.length} baharu
            </span>
          </div>
          <div className="max-h-80 overflow-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 border-b border-border/60 px-4 py-3 transition-colors last:border-0 hover:bg-muted/50"
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    ACCENT[n.accent ?? "green"],
                  )}
                >
                  <Icon name={n.icon} className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/kalendar"
            className="block bg-muted/40 px-4 py-2.5 text-center text-xs font-medium text-brand transition-colors hover:bg-muted"
          >
            Lihat semua notifikasi
          </a>
        </div>
      )}
    </div>
  );
}
