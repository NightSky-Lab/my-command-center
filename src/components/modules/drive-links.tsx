"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, ExternalLink, Link2, AlertCircle } from "lucide-react";
import type { QuickLink } from "@/lib/types";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { usePersistentRows } from "@/lib/use-persistent";
import { TABLES } from "@/lib/tables";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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

const ICON_OPTIONS = Object.keys(ICON_MAP);
const COLOR_SWATCHES = ["#1FA463", "#0EA5E9", "#8B5CF6", "#EF4444", "#F59E0B", "#14B8A6", "#EC4899", "#6366F1"];

const blank = (): QuickLink => ({
  id: "", name: "", url: "https://", icon: "drive", color: "#1FA463", position: 0, category: "Google Drive",
});

export function DriveLinks({ initial }: { initial: QuickLink[] }) {
  const supabase = getSupabaseBrowser();
  const [rows, setRows] = usePersistentRows<QuickLink>("mypi-links", initial, !supabase);
  const [editing, setEditing] = React.useState<QuickLink | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [form, setForm] = React.useState<QuickLink>(blank());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const categories = Array.from(new Set(rows.map((r) => r.category || "Lain-lain")));

  const openNew = () => { setForm(blank()); setEditing(blank()); setIsNew(true); setError(null); };
  const openEdit = (l: QuickLink) => { setForm({ ...l }); setEditing(l); setIsNew(false); setError(null); };
  const set = <K extends keyof QuickLink>(k: K, v: QuickLink[K]) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) { setError("Nama pautan wajib diisi."); return; }
    setSaving(true);
    const payload: QuickLink = { ...form, id: form.id || `q-${Date.now().toString(36)}`, position: form.position || rows.length + 1 };
    try {
      if (supabase) {
        const { error: e } = isNew
          ? await supabase.from(TABLES.quickLinks).insert(payload)
          : await supabase.from(TABLES.quickLinks).update(payload).eq("id", editing!.id);
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

  const remove = async (l: QuickLink) => {
    if (!confirm(`Buang pautan ini?\n\n${l.name}`)) return;
    if (supabase) await supabase.from(TABLES.quickLinks).delete().eq("id", l.id);
    setRows((prev) => prev.filter((r) => r.id !== l.id));
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Link2 className="size-6 text-brand" /> Google Drive & Pautan
          </h1>
          <p className="text-sm text-muted-foreground">Sistem pautan pintar — klik untuk terus buka Google Drive & aplikasi</p>
        </div>
        <Button variant="brand" onClick={openNew}><Plus className="size-4" /> Tambah Pautan</Button>
      </div>

      {categories.map((cat) => (
        <section key={cat} className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{cat}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {rows.filter((l) => (l.category || "Lain-lain") === cat).map((l) => (
              <div key={l.id} className="group relative flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => openEdit(l)} aria-label="Edit" className="grid size-7 place-items-center rounded-md bg-muted text-muted-foreground hover:text-brand"><Pencil className="size-3.5" /></button>
                  <button onClick={() => remove(l)} aria-label="Buang" className="grid size-7 place-items-center rounded-md bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                </div>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3">
                  <span className="grid size-16 place-items-center rounded-2xl transition-transform group-hover:scale-105" style={{ backgroundColor: `${l.color}1A`, color: l.color }}>
                    <Icon name={ICON_MAP[l.icon] ?? "Link2"} className="size-8" />
                  </span>
                  <span className="font-semibold text-foreground">{l.name}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><ExternalLink className="size-3" /> Buka</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Dialog open={!!editing} onClose={() => setEditing(null)} className="max-w-lg">
        {editing && (
          <>
            <DialogHeader><DialogTitle>{isNew ? "Tambah Pautan" : "Edit Pautan"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Pautan</Label>
                <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="url">URL</Label>
                <Input id="url" value={form.url} onChange={(e) => set("url", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Kategori</Label>
                <Input id="category" value={form.category ?? ""} placeholder="cth: Google Drive" onChange={(e) => set("category", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Ikon</Label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => set("icon", key)}
                      className={cn(
                        "grid size-10 place-items-center rounded-lg border transition-colors",
                        form.icon === key ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <Icon name={ICON_MAP[key]} className="size-5" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Warna</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("color", c)}
                      aria-label={c}
                      className={cn("size-8 rounded-full ring-2 ring-offset-2 ring-offset-card transition", form.color === c ? "ring-brand" : "ring-transparent")}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-input bg-background" />
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-3 flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive"><AlertCircle className="size-3.5" /> {error}</p>
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
