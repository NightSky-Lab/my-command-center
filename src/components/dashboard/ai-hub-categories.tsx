import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { AiCategory, StatColor } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { SectionCard } from "./section-card";
import { cn } from "@/lib/utils";

const COLORS: Record<StatColor, string> = {
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  teal: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  green: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
};

export function AiHubCategories({ categories }: { categories: AiCategory[] }) {
  return (
    <SectionCard
      title="AI Hub – Prompt Kategori"
      icon="Sparkles"
      href="/ai-hub"
      bodyClassName="space-y-2"
    >
      {categories.map((c) => (
        <Link
          key={c.id}
          href="/ai-hub"
          className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-muted/50"
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              COLORS[c.color] ?? COLORS.violet,
            )}
          >
            <Icon name={c.icon} className="size-[18px]" />
          </span>
          <span className="flex-1 text-sm font-medium text-foreground">
            {c.name}
          </span>
          <span className="text-xs font-semibold text-brand">
            {c.prompt_count} Prompt
          </span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </SectionCard>
  );
}
