"use client";

import * as React from "react";
import { Check, Copy, Search, Star } from "lucide-react";
import type { AiCategory, AiPrompt, StatColor } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, copyToClipboard } from "@/lib/utils";

const COLORS: Record<StatColor, string> = {
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  teal: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  green: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
};

function PromptCard({
  prompt,
  category,
}: {
  prompt: AiPrompt;
  category?: AiCategory;
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    const ok = await copyToClipboard(prompt.content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">{prompt.title}</h3>
        {prompt.is_favorite && (
          <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
        )}
      </div>
      <p className="mb-3 line-clamp-4 flex-1 text-xs leading-relaxed text-muted-foreground">
        {prompt.content}
      </p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {category && (
          <Badge variant="secondary" className="gap-1">
            <Icon name={category.icon} className="size-3" />
            {category.name}
          </Badge>
        )}
        {prompt.tags.map((t) => (
          <Badge key={t} variant="outline" className="text-[10px]">
            #{t}
          </Badge>
        ))}
      </div>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
          copied
            ? "bg-emerald-600 text-white"
            : "bg-brand text-white hover:bg-brand-light",
        )}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Disalin!" : "Salin Prompt"}
      </button>
    </div>
  );
}

export function AiHubView({
  categories,
  prompts,
}: {
  categories: AiCategory[];
  prompts: AiPrompt[];
}) {
  const [active, setActive] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");
  const [favOnly, setFavOnly] = React.useState(false);

  const catById = React.useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );

  const filtered = prompts.filter((p) => {
    if (active !== "all" && p.category_id !== active) return false;
    if (favOnly && !p.is_favorite) return false;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari prompt…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <button
          type="button"
          onClick={() => setFavOnly((v) => !v)}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
            favOnly
              ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10"
              : "border-border bg-card text-muted-foreground hover:border-brand-gold/40",
          )}
        >
          <Star
            className={cn("size-4", favOnly && "fill-amber-400 text-amber-400")}
          />
          Kegemaran
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            active === "all"
              ? "border-brand bg-brand text-white"
              : "border-border bg-card text-muted-foreground hover:border-brand-gold/40",
          )}
        >
          Semua ({prompts.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              active === c.id
                ? "border-brand bg-brand text-white"
                : "border-border bg-card text-muted-foreground hover:border-brand-gold/40",
            )}
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded",
                active === c.id ? "bg-white/20 text-white" : COLORS[c.color],
              )}
            >
              <Icon name={c.icon} className="size-3" />
            </span>
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <PromptCard key={p.id} prompt={p} category={catById[p.category_id]} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            Tiada prompt dijumpai.
          </p>
        )}
      </div>
    </div>
  );
}
