"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { CalendarEvent, MenuItem, SiteSettings } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { SidebarContent } from "./sidebar";
import { cn } from "@/lib/utils";

export function MobileMenu({
  settings,
  topMenu,
  sideMenu,
  events,
}: {
  settings: SiteSettings;
  topMenu: MenuItem[];
  sideMenu: MenuItem[];
  events: CalendarEvent[];
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute left-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col"
            style={{
              background:
                "linear-gradient(180deg, var(--brand) 0%, var(--brand-dark) 100%)",
            }}
          >
            <div className="flex items-center justify-between border-b border-brand-gold/20 px-4 py-3">
              <span className="font-bold text-brand-gold">
                {settings.logo_text}
              </span>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-emerald-50/80 hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Top-nav modules */}
            <div className="border-b border-brand-gold/15 px-3 py-3">
              <div className="grid grid-cols-2 gap-1">
                {topMenu.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                        active
                          ? "bg-white/15 text-white"
                          : "text-emerald-50/80 hover:bg-white/10",
                      )}
                    >
                      <Icon name={item.icon} className="size-4 text-brand-gold" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <SidebarContent
                settings={settings}
                menu={sideMenu}
                events={events}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
