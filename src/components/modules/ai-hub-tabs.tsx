"use client";

import * as React from "react";
import { MessageSquare, LibraryBig } from "lucide-react";
import type { AiCategory, AiPrompt } from "@/lib/types";
import type { AiData } from "@/lib/ai-query";
import { AiAssistant } from "./ai-assistant";
import { AiHubView } from "./ai-hub-view";
import { cn } from "@/lib/utils";

export function AiHubTabs({
  data,
  categories,
  prompts,
}: {
  data: AiData;
  categories: AiCategory[];
  prompts: AiPrompt[];
}) {
  const [tab, setTab] = React.useState<"chat" | "pustaka">("chat");

  const TABS = [
    { id: "chat", label: "Pembantu AI", icon: MessageSquare },
    { id: "pustaka", label: "Pustaka Prompt", icon: LibraryBig },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "chat" ? <AiAssistant data={data} /> : <AiHubView categories={categories} prompts={prompts} />}
    </div>
  );
}
