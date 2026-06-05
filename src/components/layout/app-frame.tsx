"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, ShieldCheck, PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import type { CalendarEvent, CurrentUser, MenuItem, SiteSettings } from "@/lib/types";
import type { SearchItem } from "@/lib/search";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { MosqueEmblem, MosqueSilhouette } from "@/components/brand/emblems";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";
import { NotificationBell, type NotificationItem } from "./notification-bell";
import { LoginOverlay } from "@/components/auth/login-overlay";
import { isAuthed, logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

const SECTIONS: { group: MenuItem["group"]; label: string }[] = [
  { group: "main", label: "Menu Utama" },
  { group: "module", label: "Modul Utama" },
  { group: "system", label: "Sistem" },
];

function NavLinks({
  menu,
  collapsed,
  onNavigate,
}: {
  menu: MenuItem[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-4 px-3 py-3">
      {SECTIONS.map((sec) => {
        const items = menu
          .filter((m) => m.group === sec.group && m.is_active)
          .sort((a, b) => a.position - b.position);
        if (items.length === 0) return null;
        return (
          <div key={sec.group} className="space-y-0.5">
            {!collapsed && (
              <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground/70">
                {sec.label}
              </p>
            )}
            {items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-brand/10 text-brand"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
                  )}
                  <Icon
                    name={item.icon}
                    className={cn("size-[18px] shrink-0", active ? "text-brand" : item.color)}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

function QuoteCard({ text }: { text: string }) {
  return (
    <div className="relative m-3 overflow-hidden rounded-xl bg-gradient-to-br from-brand to-brand-dark p-4 text-white shadow-card">
      <MosqueSilhouette className="absolute inset-x-0 bottom-0 h-14 w-full text-white/10" />
      <div className="relative space-y-1.5">
        <p className="text-center text-lg font-bold text-brand-gold-soft" dir="rtl" style={{ fontFamily: "var(--font-serif)" }}>
          إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </p>
        <p className="text-center text-xs italic leading-snug text-white/90">&ldquo;{text}&rdquo;</p>
        <p className="text-center text-[10px] text-white/60">(Surah Al-Insyirah: 6)</p>
      </div>
    </div>
  );
}

function Brand({ settings, collapsed }: { settings: SiteSettings; collapsed: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex h-[68px] shrink-0 items-center gap-3 border-b border-border px-4",
        collapsed && "justify-center px-0",
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-sm">
        <MosqueEmblem className="size-6 text-white" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-extrabold uppercase leading-tight tracking-wide text-foreground">
            <span className="text-brand">MyPI</span> Command Center
          </span>
          <span className="block truncate text-[10px] text-muted-foreground">
            {settings.org_subtitle}
          </span>
        </span>
      )}
    </Link>
  );
}

export function AppFrame({
  settings,
  user,
  menu,
  searchItems,
  notifications,
  children,
}: {
  settings: SiteSettings;
  user: CurrentUser;
  menu: MenuItem[];
  events: CalendarEvent[];
  searchItems: SearchItem[];
  notifications: NotificationItem[];
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setMobileOpen(false), [pathname]);
  React.useEffect(() => {
    setMounted(true);
    setAuthed(isAuthed());
  }, []);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      {/* ─── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-[260px]",
        )}
      >
        <Brand settings={settings} collapsed={collapsed} />
        <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
          <NavLinks menu={menu} collapsed={collapsed} />
          {!collapsed && <QuoteCard text={settings.calligraphy_text} />}
        </div>
      </aside>

      {/* ─── Mobile drawer ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[260px] flex-col border-r border-border bg-card animate-slide-in">
            <div className="flex items-center justify-between border-b border-border pr-2">
              <Brand settings={settings} collapsed={false} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                aria-label="Tutup menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
              <NavLinks menu={menu} collapsed={false} onNavigate={() => setMobileOpen(false)} />
              <QuoteCard text={settings.calligraphy_text} />
            </div>
          </aside>
        </div>
      )}

      {/* ─── Main column ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 flex h-[68px] items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur sm:px-5">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) setMobileOpen(true);
              else setCollapsed((c) => !c);
            }}
            aria-label="Togol menu"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Menu className="size-5 lg:hidden" />
            <span className="hidden lg:block">
              {collapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
            </span>
          </button>

          <div className="hidden max-w-md flex-1 sm:block">
            <SearchDialog items={searchItems} variant="bar" placeholder="Cari apa sahaja di sini…" />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <SearchDialog items={searchItems} variant="icon" />
            <Link
              href="/ai-hub"
              className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 md:inline-flex"
            >
              <Sparkles className="size-3.5" /> AI Assistant
            </Link>
            <NotificationBell notifications={notifications} />
            <span
              title="Backup terkini"
              className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 lg:inline-flex"
            >
              <ShieldCheck className="size-3.5" /> Terkini
            </span>
            <ThemeToggle />
            <Link
              href="/profil"
              className="ml-0.5 flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-muted sm:pr-2"
            >
              <Avatar src={user.avatar_url} fallback={initials} alt={user.name} />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-semibold text-foreground">{user.name}</span>
                <span className="block text-xs text-muted-foreground">{user.role}</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (confirm("Log keluar dari sistem?")) {
                  logout();
                  setAuthed(false);
                }
              }}
              title="Log keluar"
              aria-label="Log keluar"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-[18px]" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6">{children}</main>
      </div>

      {mounted && !authed && (
        <LoginOverlay settings={settings} onSuccess={() => setAuthed(true)} />
      )}
    </div>
  );
}
