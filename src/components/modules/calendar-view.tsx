"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MapPin, Plus, Pencil, Trash2, CalendarDays, AlertCircle } from "lucide-react";
import type { CalendarEvent } from "@/lib/types";
import { cn, monthName } from "@/lib/utils";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { usePersistentRows } from "@/lib/use-persistent";
import { TABLES } from "@/lib/tables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DOW = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Ahd"];
const ACCENTS = [
  { key: "green", label: "Hijau", dot: "bg-emerald-500", soft: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
  { key: "gold", label: "Emas", dot: "bg-amber-500", soft: "border-l-amber-500 bg-amber-50 dark:bg-amber-500/10" },
  { key: "blue", label: "Biru", dot: "bg-sky-500", soft: "border-l-sky-500 bg-sky-50 dark:bg-sky-500/10" },
  { key: "rose", label: "Merah", dot: "bg-rose-500", soft: "border-l-rose-500 bg-rose-50 dark:bg-rose-500/10" },
] as const;
const dotOf = (a: string) => ACCENTS.find((x) => x.key === a)?.dot ?? "bg-emerald-500";
const softOf = (a: string) => ACCENTS.find((x) => x.key === a)?.soft ?? ACCENTS[0].soft;

const isoOf = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const prettyDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${monthName(m - 1)} ${y}`;
};
const blankEvent = (iso: string): CalendarEvent => ({ id: "", title: "", date: iso, location: "", accent: "green" });

export function CalendarView({ events: initialEvents }: { events: CalendarEvent[] }) {
  const supabase = getSupabaseBrowser();
  const [events, setEvents] = usePersistentRows<CalendarEvent>("mypi-calendar", initialEvents, !supabase);
  // Ikut tarikh SEBENAR hari ini (auto). Di-gate dengan mount untuk elak hydration mismatch.
  const [today, setToday] = React.useState<{ y: number; m: number; d: number } | null>(null);
  React.useEffect(() => {
    const n = new Date();
    setToday({ y: n.getFullYear(), m: n.getMonth(), d: n.getDate() });
  }, []);
  const todayIso = today ? isoOf(today.y, today.m, today.d) : "";
  const [view, setView] = React.useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [dayDate, setDayDate] = React.useState<string | null>(null); // dialog: hari dipilih
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CalendarEvent | null>(null);
  const [form, setForm] = React.useState<CalendarEvent>(blankEvent(todayIso));
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const byDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const firstDay = new Date(view.y, view.m, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: { day: number | null; iso?: string }[] = [];
  for (let i = 0; i < offset; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, iso: isoOf(view.y, view.m, d) });
  while (cells.length % 7 !== 0) cells.push({ day: null });

  const monthEvents = events
    .filter((e) => {
      const [y, m] = e.date.split("-").map(Number);
      return y === view.y && m === view.m + 1;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const move = (dir: number) =>
    setView((v) => {
      let m = v.m + dir, y = v.y;
      if (m < 0) (m = 11), y--;
      else if (m > 11) (m = 0), y++;
      return { y, m };
    });

  // ---- actions ----
  const openDay = (iso: string) => { setDayDate(iso); setFormOpen(false); setError(null); };
  const openNew = (iso: string) => { setForm(blankEvent(iso)); setEditing(null); setFormOpen(true); setError(null); };
  const openEdit = (e: CalendarEvent) => { setForm({ ...e }); setEditing(e); setDayDate(e.date); setFormOpen(true); setError(null); };
  const set = <K extends keyof CalendarEvent>(k: K, v: CalendarEvent[K]) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) { setError("Nama aktiviti wajib diisi."); return; }
    if (!form.date) { setError("Tarikh wajib diisi."); return; }
    setSaving(true);
    const isNew = !editing;
    const payload: CalendarEvent = { ...form, id: form.id || `ce-${Date.now().toString(36)}` };
    try {
      if (supabase) {
        const { error: e } = isNew
          ? await supabase.from(TABLES.calendarEvents).insert(payload)
          : await supabase.from(TABLES.calendarEvents).update(payload).eq("id", editing!.id);
        if (e) throw e;
      }
      setEvents((prev) => (isNew ? [...prev, payload] : prev.map((x) => (x.id === editing!.id ? payload : x))));
      setFormOpen(false);
      setDayDate(payload.date);
    } catch (e: any) {
      setError(e?.message ?? "Ralat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (e: CalendarEvent) => {
    if (!confirm(`Padam aktiviti ini?\n\n${e.title}`)) return;
    if (supabase) await supabase.from(TABLES.calendarEvents).delete().eq("id", e.id);
    setEvents((prev) => prev.filter((x) => x.id !== e.id));
  };

  const dayEventsFor = (iso: string | null) => (iso ? events.filter((e) => e.date === iso) : []);

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">💡 Tekan mana-mana tarikh untuk tambah / edit aktiviti.</p>
        <Button variant="brand" size="sm" onClick={() => openNew(todayIso)}>
          <Plus className="size-4" /> Tambah Aktiviti
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Calendar grid */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">{monthName(view.m)} {view.y}</h2>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(-1)} aria-label="Bulan sebelum" className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted">
                <ChevronLeft className="size-4" />
              </button>
              <button type="button" onClick={() => { const n = new Date(); setView({ y: n.getFullYear(), m: n.getMonth() }); }} className="rounded-md border border-border px-3 text-xs font-medium hover:bg-muted">
                Hari Ini
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Bulan seterusnya" className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-border pb-2 text-center text-xs font-semibold text-muted-foreground">
            {DOW.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 pt-1">
            {cells.map((c, i) => {
              const dayEvents = c.iso ? byDay.get(c.iso) ?? [] : [];
              const isCur = c.iso === todayIso;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!c.day}
                  onClick={() => c.iso && openDay(c.iso)}
                  className={cn(
                    "group min-h-[78px] rounded-lg border border-transparent p-1.5 text-left align-top transition-colors",
                    c.day && "cursor-pointer border-border/60 bg-muted/20 hover:border-brand hover:bg-brand/5",
                    isCur && "border-brand bg-brand/5",
                  )}
                >
                  {c.day && (
                    <>
                      <span className="flex items-center justify-between">
                        <span className={cn("inline-flex size-6 items-center justify-center rounded-full text-xs font-medium", isCur ? "bg-brand font-bold text-white" : "text-foreground")}>
                          {c.day}
                        </span>
                        <Plus className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 3).map((e) => (
                          <div key={e.id} title={e.title} className={cn("truncate rounded px-1 py-0.5 text-[10px] font-medium text-white", dotOf(e.accent))}>
                            {e.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="px-1 text-[10px] text-muted-foreground">+{dayEvents.length - 3} lagi</div>
                        )}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Month event list */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">Acara {monthName(view.m)}</h3>
          <div className="space-y-2">
            {monthEvents.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Tiada acara bulan ini.</p>
            )}
            {monthEvents.map((e) => (
              <div key={e.id} className={cn("group rounded-lg border-l-4 p-3", softOf(e.accent))}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{prettyDate(e.date)}</p>
                    {e.location && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-brand"><MapPin className="size-3" /> {e.location}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => openEdit(e)} aria-label="Edit" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-brand"><Pencil className="size-3.5" /></button>
                    <button onClick={() => remove(e)} aria-label="Padam" className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day / Form dialog */}
      <Dialog open={!!dayDate} onClose={() => { setDayDate(null); setFormOpen(false); }} className="max-w-md">
        {dayDate && !formOpen && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarDays className="size-5 text-brand" /> {prettyDate(dayDate)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {dayEventsFor(dayDate).length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">Tiada aktiviti pada tarikh ini.</p>
              )}
              {dayEventsFor(dayDate).map((e) => (
                <div key={e.id} className={cn("flex items-start justify-between gap-2 rounded-lg border-l-4 p-3", softOf(e.accent))}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{e.title}</p>
                    {e.location && <p className="text-xs text-muted-foreground">{e.location}</p>}
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <button onClick={() => openEdit(e)} aria-label="Edit" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-brand"><Pencil className="size-4" /></button>
                    <button onClick={() => remove(e)} aria-label="Padam" className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="brand" className="w-full" onClick={() => openNew(dayDate)}>
                <Plus className="size-4" /> Tambah Aktiviti
              </Button>
            </div>
          </>
        )}

        {formOpen && (
          <>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Aktiviti" : "Tambah Aktiviti"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Nama Aktiviti</Label>
                <Input id="title" value={form.title} placeholder="cth: Mesyuarat Panitia" onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Tarikh</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loc">Tempat / Masa</Label>
                <Input id="loc" value={form.location ?? ""} placeholder="cth: Bilik Panitia · 8:00 pagi" onChange={(e) => set("location", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Warna</Label>
                <div className="flex gap-2">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => set("accent", a.key as CalendarEvent["accent"])}
                      className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                        form.accent === a.key ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground hover:bg-muted")}
                    >
                      <span className={cn("size-3 rounded-full", a.dot)} /> {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-3 flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive"><AlertCircle className="size-3.5" /> {error}</p>
            )}
            <div className="mt-5 flex justify-between gap-2">
              {editing ? (
                <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => editing && remove(editing)}>
                  <Trash2 className="size-4" /> Padam
                </Button>
              ) : <span />}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
                <Button variant="brand" onClick={save} disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
}
