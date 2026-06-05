"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import type { CalendarEvent, CurrentUser, MenuItem, SiteSettings } from "@/lib/types";
import type { SearchItem } from "@/lib/search";
import { MosqueEmblem } from "@/components/brand/emblems";
import { Avatar } from "@/components/ui/avatar";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";
import { NotificationBell, type NotificationItem } from "./notification-bell";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

export function TopNav({
  settings,
  user,
  topMenu,
  sideMenu,
  events,
  searchItems,
  notifications,
}: {
  settings: SiteSettings;
  user: CurrentUser;
  topMenu: MenuItem[];
  sideMenu: MenuItem[];
  events: CalendarEvent[];
  searchItems: SearchItem[];
  notifications: NotificationItem[];
}) {
  const pathname = usePathname();
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full">
      {/* Logo block (aligned with sidebar) */}
      <Link
        href="/"
        className="flex h-full shrink-0 items-center gap-3 px-4 lg:w-[280px]"
        style={{
          background:
            "linear-gradient(180deg, var(--brand) 0%, var(--brand-dark) 100%)",
          borderBottom: "3px solid var(--brand-gold)",
        }}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-brand-gold/40 bg-white/5">
          <MosqueEmblem className="size-8" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-extrabold uppercase leading-tight tracking-wide text-white">
            <span className="text-brand-gold">MyPI</span>{" "}
            <span className="hidden sm:inline">Command Center</span>
          </span>
          <span className="hidden truncate text-[10px] text-emerald-100/70 sm:block">
            {settings.org_subtitle}
          </span>
        </span>
      </Link>

      {/* Right area (white) */}
      <div className="flex h-full flex-1 items-center gap-2 border-b border-border bg-card px-3 sm:px-5">
        {/* Desktop horizontal nav */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {topMenu.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "relative whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors",
                  active
                    ? "text-brand"
                    : "text-muted-foreground hover:text-brand",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[14px] h-0.5 rounded-full bg-brand-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <SearchDialog items={searchItems} variant="icon" />
          <ThemeToggle />
          <NotificationBell notifications={notifications} />
          <Link
            href="/admin"
            aria-label="Panel Admin"
            title="Panel Admin (CMS)"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="size-[18px]" />
          </Link>

          <Link
            href="/admin"
            className="ml-1 flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-muted sm:pr-3"
          >
            <Avatar src={user.avatar_url} fallback={initials} alt={user.name} />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold text-foreground">
                {user.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {user.role}
              </span>
            </span>
          </Link>

          <MobileMenu
            settings={settings}
            topMenu={topMenu}
            sideMenu={sideMenu}
            events={events}
          />
        </div>
      </div>
    </header>
  );
}
