import type { Announcement } from "@/lib/types";
import { SectionCard } from "./section-card";
import { cn } from "@/lib/utils";

const ACCENT: Record<string, string> = {
  green: "bg-brand text-brand-gold",
  gold: "bg-brand-gold text-brand-dark",
  blue: "bg-sky-600 text-white",
};

export function Announcements({ items }: { items: Announcement[] }) {
  return (
    <SectionCard
      title="Pengumuman"
      icon="Megaphone"
      href="/kalendar"
      className="h-full"
      bodyClassName="space-y-3"
    >
      {items.map((a) => (
        <div
          key={a.id}
          className="flex gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:border-brand-gold/40 hover:bg-muted/60"
        >
          <div
            className={cn(
              "flex size-12 shrink-0 flex-col items-center justify-center rounded-lg leading-none",
              ACCENT[a.accent] ?? ACCENT.green,
            )}
          >
            <span className="text-lg font-extrabold">{a.day}</span>
            <span className="text-[10px] font-semibold uppercase">
              {a.month}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-snug text-foreground">
              {a.title}
            </p>
            {a.subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {a.subtitle}
              </p>
            )}
            {a.meta && (
              <p className="mt-0.5 text-xs font-medium text-brand">{a.meta}</p>
            )}
          </div>
        </div>
      ))}
    </SectionCard>
  );
}
