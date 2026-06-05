import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/types";
import {
  getAnnouncements,
  getCalendarEvents,
  getCurrentUser,
  getMenu,
} from "@/lib/data";
import { buildSearchItems } from "@/lib/search";
import { AppFrame } from "./app-frame";
import { Footer } from "./footer";
import type { NotificationItem } from "./notification-bell";

export async function AppShell({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  const [user, menu, events, announcements, searchItems] = await Promise.all([
    getCurrentUser(),
    getMenu(),
    getCalendarEvents(),
    getAnnouncements(),
    buildSearchItems(),
  ]);

  const notifications: NotificationItem[] = announcements
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      title: a.title,
      time: `${a.day} ${a.month}${a.meta ? ` • ${a.meta}` : ""}`,
      icon: "Megaphone",
      accent: a.accent === "gold" ? "gold" : a.accent === "blue" ? "blue" : "green",
    }));

  return (
    <AppFrame
      settings={settings}
      user={user}
      menu={menu}
      events={events}
      searchItems={searchItems}
      notifications={notifications}
    >
      {children}
      <Footer settings={settings} />
    </AppFrame>
  );
}
