import type { QuickLink } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { SectionCard } from "./section-card";

// Map the stored icon key to a recognisable Lucide glyph.
const ICON_MAP: Record<string, string> = {
  drive: "HardDrive",
  folder: "FolderOpen",
  book: "BookOpen",
  analysis: "BarChart3",
  doc: "FileText",
  program: "CalendarDays",
  splkpm: "GraduationCap",
  delima: "School",
  canva: "Palette",
  chatgpt: "Bot",
  gemini: "Sparkles",
  link: "Link2",
};

/** Standalone glyph for a quick link, reused on the dashboard Drive panel. */
export function QuickLinkGlyph({
  icon,
  color,
  className,
}: {
  icon: string;
  color: string;
  className?: string;
}) {
  return <Icon name={ICON_MAP[icon] ?? "Link2"} className={className} style={{ color }} />;
}

export function QuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <SectionCard title="Pintasan Pantas" icon="Grid3x3" href="/link">
      <div className="grid grid-cols-3 gap-3">
        {links.map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center transition-all hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-card"
          >
            <span
              className="flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
              style={{ backgroundColor: `${l.color}1A`, color: l.color }}
            >
              <Icon name={ICON_MAP[l.icon] ?? "Link2"} className="size-6" />
            </span>
            <span className="text-xs font-semibold text-foreground">
              {l.name}
            </span>
          </a>
        ))}
      </div>
    </SectionCard>
  );
}
