"use client";

import * as React from "react";
import {
  CalendarDays,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Target,
  Users,
  Wallet,
  AlertCircle,
} from "lucide-react";
import type { Program, ProgramStatus } from "@/lib/types";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { usePersistentRows } from "@/lib/use-persistent";
import { TABLES } from "@/lib/tables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const STATUS: Record<ProgramStatus, { label: string; variant: "info" | "warning" | "success" }> = {
  perancangan: { label: "Perancangan", variant: "info" },
  berjalan: { label: "Sedang Berjalan", variant: "warning" },
  selesai: { label: "Selesai", variant: "success" },
};

const ACCENT: Record<string, string> = {
  green: "from-emerald-500 to-green-800",
  gold: "from-amber-500 to-orange-700",
  rose: "from-rose-500 to-pink-800",
};

const blank = (): Program => ({
  id: "", title: "", date_label: "", location: "", start_day: "", start_month: "",
  thumbnail_url: null, accent: "green", position: 0,
  time: "", objective: "", target: "", committee: "", budget: "", report: "", status: "perancangan",
});

export function ProgramsView({ initial }: { initial: Program[] }) {
  const supabase = getSupabaseBrowser();
  const [rows, setRows] = usePersistentRows<Program>("mypi-programs", initial, !supabase);
  const [filter, setFilter] = React.useState<string>("");
  const [editing, setEditing] = React.useState<Program | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [form, setForm] = React.useState<Program>(blank());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const filtered = filter ? rows.filter((p) => (p.status ?? "perancangan") === filter) : rows;
  const counts = {
    all: rows.length,
    perancangan: rows.filter((p) => (p.status ?? "perancangan") === "perancangan").length,
    berjalan: rows.filter((p) => p.status === "berjalan").length,
    selesai: rows.filter((p) => p.status === "selesai").length,
  };

  const openNew = () => { setForm(blank()); setEditing(blank()); setIsNew(true); setError(null); };
  const openEdit = (p: Program) => { setForm({ ...p }); setEditing(p); setIsNew(false); setError(null); };
  const set = <K extends keyof Program>(k: K, v: Program[K]) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) { setError("Nama program wajib diisi."); return; }
    setSaving(true);
    const payload: Program = {
      ...form,
      id: form.id || `p-${Date.now().toString(36)}`,
      position: form.position || rows.length + 1,
    };
    try {
      if (supabase) {
        const { error: e } = isNew
          ? await supabase.from(TABLES.programs).insert(payload)
          : await supabase.from(TABLES.programs).update(payload).eq("id", editing!.id);
        if (e) throw e;
      }
      setRows((prev) => (isNew ? [...prev, payload] : prev.map((r) => (r.id === editing!.id ? payload : r))));
      setEditing(null);
    } catch (e: any) {
      setError(e?.message ?? "Ralat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Program) => {
    if (!confirm(`Padam program ini?\n\n${p.title}`)) return;
    if (supabase) await supabase.from(TABLES.programs).delete().eq("id", p.id);
    setRows((prev) => prev.filter((r) => r.id !== p.id));
  };

  const TABS = [
    { value: "", label: `Semua (${counts.all})` },
    { value: "perancangan", label: `Perancangan (${counts.perancangan})` },
    { value: "berjalan", label: `Berjalan (${counts.berjalan})` },
    { value: "selesai", label: `Selesai (${counts.selesai})` },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <CalendarDays className="size-6 text-brand" /> Program & Aktiviti
          </h1>
          <p className="text-sm text-muted-foreground">Pengurusan program Unit Pendidikan Islam — perancangan hingga laporan</p>
        </div>
        <Button variant="brand" onClick={openNew}><Plus className="size-4" /> Tambah Program</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFilter(t.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === t.value ? "border-brand bg-brand text-white" : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const st = STATUS[p.status ?? "perancangan"];
          return (
            <div key={p.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className={cn("relative flex h-28 items-center justify-center bg-gradient-to-br", ACCENT[p.accent] ?? ACCENT.green)}>
                <CalendarDays className="size-10 text-white/70" />
                <div className="absolute left-3 top-3 flex size-12 flex-col items-center justify-center rounded-lg bg-white/95 leading-none text-brand shadow">
                  <span className="text-lg font-extrabold">{p.start_day}</span>
                  <span className="text-[9px] font-bold uppercase">{p.start_month}</span>
                </div>
                <div className="absolute right-3 top-3">
                  <Badge variant={st.variant}>{st.label}</Badge>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => openEdit(p)} aria-label="Edit" className="grid size-7 place-items-center rounded-md bg-white/90 text-slate-700 hover:text-brand"><Pencil className="size-3.5" /></button>
                  <button onClick={() => remove(p)} aria-label="Padam" className="grid size-7 place-items-center rounded-md bg-white/90 text-slate-700 hover:text-destructive"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
              <div className="space-y-1.5 p-4">
                <h3 className="font-bold text-foreground">{p.title}</h3>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" /> {p.date_label}{p.time ? ` • ${p.time}` : ""}</p>
                <p className="flex items-center gap-1.5 text-xs font-medium text-brand"><MapPin className="size-3.5" /> {p.location}</p>
                {p.objective && <p className="line-clamp-2 pt-1 text-xs text-muted-foreground">{p.objective}</p>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">Tiada program.</p>
        )}
      </div>

      <Dialog open={!!editing} onClose={() => setEditing(null)} className="max-w-2xl">
        {editing && (
          <>
            <DialogHeader><DialogTitle>{isNew ? "Tambah Program" : "Edit Program"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="title">Nama Program</Label>
                <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date_label">Tarikh</Label>
                <Input id="date_label" placeholder="cth: 26 Mei 2025 (Isnin)" value={form.date_label} onChange={(e) => set("date_label", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time"><Clock className="mr-1 inline size-3.5" /> Masa</Label>
                <Input id="time" placeholder="cth: 8:00 pagi - 1:00 tgh" value={form.time ?? ""} onChange={(e) => set("time", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="start_day">Hari (chip)</Label>
                <Input id="start_day" placeholder="26" value={form.start_day} onChange={(e) => set("start_day", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="start_month">Bulan (chip)</Label>
                <Input id="start_month" placeholder="MEI" value={form.start_month} onChange={(e) => set("start_month", e.target.value.toUpperCase())} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="location"><MapPin className="mr-1 inline size-3.5" /> Tempat</Label>
                <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select id="status" value={form.status ?? "perancangan"} onChange={(e) => set("status", e.target.value as ProgramStatus)}>
                  <option value="perancangan">Perancangan</option>
                  <option value="berjalan">Sedang Berjalan</option>
                  <option value="selesai">Selesai</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accent">Warna Tema</Label>
                <Select id="accent" value={form.accent} onChange={(e) => set("accent", e.target.value as Program["accent"])}>
                  <option value="green">Hijau</option>
                  <option value="gold">Emas</option>
                  <option value="rose">Merah Jambu</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="target"><Target className="mr-1 inline size-3.5" /> Sasaran</Label>
                <Input id="target" value={form.target ?? ""} onChange={(e) => set("target", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budget"><Wallet className="mr-1 inline size-3.5" /> Bajet</Label>
                <Input id="budget" placeholder="cth: RM 1,500" value={form.budget ?? ""} onChange={(e) => set("budget", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="committee"><Users className="mr-1 inline size-3.5" /> AJK</Label>
                <Input id="committee" value={form.committee ?? ""} onChange={(e) => set("committee", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="objective">Objektif</Label>
                <Textarea id="objective" rows={2} value={form.objective ?? ""} onChange={(e) => set("objective", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="report">Laporan</Label>
                <Textarea id="report" rows={2} value={form.report ?? ""} onChange={(e) => set("report", e.target.value)} />
              </div>
            </div>
            {error && (
              <p className="mt-3 flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="size-3.5" /> {error}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Batal</Button>
              <Button variant="brand" onClick={save} disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
