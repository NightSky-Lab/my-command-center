"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Send, ArrowUpRight, Bot, User } from "lucide-react";
import { answerQuery, type AiData, type AiResultItem } from "@/lib/ai-query";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  items?: AiResultItem[];
}

const SUGGESTIONS = [
  "Cari murid Tahun 6 yang belum menguasai JQAF",
  "Berapa jumlah murid yang belum menguasai JQAF?",
  "Peratus penguasaan JQAF",
  "Program akan datang",
  "Tugasan belum selesai",
];

export function AiAssistant({ data }: { data: AiData }) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      text:
        "Assalamualaikum 👋 Saya Pembantu AI MyPI. Tanya saya tentang data anda — murid, JQAF, program, tugasan atau dokumen. Contohnya: \"Berapa murid Tahun 6 belum menguasai JQAF?\"",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    // small delay for a natural chat feel
    setTimeout(() => {
      const res = answerQuery(q, data);
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", text: res.answer, items: res.items },
      ]);
      setThinking(false);
    }, 350);
  };

  return (
    <div className="flex h-[calc(100vh-160px)] min-h-[460px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-white">
        <span className="grid size-9 place-items-center rounded-lg bg-white/20">
          <Sparkles className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold">AI Assistant MyPI</p>
          <p className="text-[11px] text-white/80">Carian & analisis data secara automatik</p>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full ${
                m.role === "user" ? "bg-brand text-white" : "bg-violet-100 text-violet-600 dark:bg-violet-500/15"
              }`}
            >
              {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
            </span>
            <div className={`max-w-[80%] space-y-2 ${m.role === "user" ? "items-end text-right" : ""}`}>
              <div
                className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "rounded-tr-sm bg-brand text-white"
                    : "rounded-tl-sm bg-muted text-foreground"
                }`}
              >
                {m.text}
              </div>
              {m.items && m.items.length > 0 && (
                <div className="space-y-1.5">
                  {m.items.map((it, i) => (
                    <Link
                      key={i}
                      href={it.href ?? "#"}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-brand/40 hover:bg-brand/5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">{it.title}</p>
                        {it.subtitle && <p className="truncate text-xs text-muted-foreground">{it.subtitle}</p>}
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/15">
              <Bot className="size-4" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* suggestions */}
      <div className="flex flex-wrap gap-2 border-t border-border px-4 pt-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
          >
            {s}
          </button>
        ))}
      </div>

      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya tentang murid, JQAF, program, tugasan…"
          className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          className="grid size-10 place-items-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="Hantar"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
