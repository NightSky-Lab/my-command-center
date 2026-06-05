"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CalendarEvent, MenuItem, SiteSettings } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { Select } from "@/components/ui/select";
import { MiniCalendar } from "./mini-calendar";
import { MosqueSilhouette } from "@/components/brand/emblems";
import { cn } from "@/lib/utils";

const YEARS = [2024, 2025, 2026];

function SidebarContent({
  settings,
  menu,
  events,
  onNavigate,
}: {
  settings: SiteSettings;
  menu: MenuItem[];
  events: CalendarEvent[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [year, setYear] = React.useState(settings.current_year);

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto scrollbar-thin p-4">
      {/* Calligraphy */}
      <div className="flex items-center gap-3 rounded-xl border border-brand-gold/20 bg-white/5 p-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10">
          <span
            className="text-2xl font-bold text-brand-gold"
            style={{ fontFamily: "var(--font-serif)" }}
            dir="rtl"
          >
            اقرأ
          </span>
        </div>
        <p className="text-sm italic leading-snug text-emerald-50/90">
          &ldquo;{settings.calligraphy_text}&rdquo;
        </p>
      </div>

      {/* Menu */}
      <nav className="space-y-1">
        <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-gold/90">
          Pintasan
        </p>
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white shadow-[inset_3px_0_0_0_var(--brand-gold)]"
                  : "text-emerald-50/85 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon
                name={item.icon}
                className={cn("size-[18px]", item.color ?? "text-emerald-300")}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Year + calendar */}
      <div className="space-y-3">
        <p className="px-2 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-gold/90">
          Tahun Semasa
        </p>
        <Select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border-brand-gold/30 bg-white/5 text-emerald-50 focus-visible:ring-brand-gold/40"
        >
          {YEARS.map((y) => (
            <option key={y} value={y} className="text-foreground">
              {y}
            </option>
          ))}
        </Select>

        <div className="rounded-xl border border-brand-gold/15 bg-black/15 p-3">
          <MiniCalendar events={events} year={year} />
        </div>
      </div>

      {/* Motto */}
      <div className="relative mt-auto overflow-hidden rounded-xl border border-brand-gold/20 bg-brand-dark/60 p-4">
        <MosqueSilhouette className="absolute inset-x-0 bottom-0 h-16 w-full text-brand-gold/15" />
        <div className="relative">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
            {settings.motto_title}
          </p>
          <p className="text-sm italic leading-snug text-emerald-50/90">
            &ldquo;{settings.motto_text}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

/** Desktop sidebar (hidden on small screens). */
export function Sidebar({
  settings,
  menu,
  events,
}: {
  settings: SiteSettings;
  menu: MenuItem[];
  events: CalendarEvent[];
}) {
  return (
    <aside
      className="sticky top-0 hidden h-[calc(100vh-72px)] w-[280px] shrink-0 border-r border-brand-gold/15 lg:block"
      style={{
        background:
          "linear-gradient(180deg, var(--brand) 0%, var(--brand-dark) 100%)",
      }}
    >
      <SidebarContent settings={settings} menu={menu} events={events} />
    </aside>
  );
}

export { SidebarContent };
