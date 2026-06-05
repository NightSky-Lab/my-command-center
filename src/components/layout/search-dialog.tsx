"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { SearchItem } from "@/lib/search";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SearchDialog({
  items,
  variant = "icon",
  className,
  placeholder = "Carian pantas…",
}: {
  items: SearchItem[];
  variant?: "icon" | "bar";
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8);
    return items
      .filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [query, items]);

  React.useEffect(() => setActive(0), [query]);

  const go = (item: SearchItem) => {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          aria-label="Carian"
          onClick={() => setOpen(true)}
          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Search className="size-[18px]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-10 w-full items-center gap-2.5 rounded-xl border border-border bg-muted/50 px-3.5 text-sm text-muted-foreground transition-colors hover:bg-muted",
            className,
          )}
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">{placeholder}</span>
          <kbd className="hidden items-center rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
            Ctrl K
          </kbd>
        </button>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="max-w-xl p-0"
        hideClose
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-5 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown")
                setActive((a) => Math.min(a + 1, results.length - 1));
              if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
              if (e.key === "Enter" && results[active]) go(results[active]);
            }}
            placeholder="Cari dokumen, program, evidens, prompt…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[60vh] overflow-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Tiada hasil untuk &ldquo;{query}&rdquo;
            </p>
          ) : (
            results.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActive(idx)}
                onClick={() => go(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  idx === active ? "bg-muted" : "hover:bg-muted/60",
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <Icon name={item.icon} className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.subtitle}
                  </span>
                </span>
                <Badge variant="secondary" className="shrink-0">
                  {item.type}
                </Badge>
              </button>
            ))
          )}
        </div>
      </Dialog>
    </>
  );
}
