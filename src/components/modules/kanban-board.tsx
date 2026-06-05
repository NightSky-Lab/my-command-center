"use client";

import * as React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  GripVertical,
  ListChecks,
  CircleDashed,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Task, TaskStatus, TaskPriority } from "@/lib/types";
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

const COLUMNS: { status: TaskStatus; title: string; icon: React.ElementType; tone: string; ring: string }[] = [
  { status: "perlu", title: "Perlu Dibuat", icon: CircleDashed, tone: "text-rose-600 dark:text-rose-400", ring: "border-t-rose-400" },
  { status: "sedang", title: "Sedang Dibuat", icon: Loader2, tone: "text-amber-600 dark:text-amber-400", ring: "border-t-amber-400" },
  { status: "selesai", title: "Selesai", icon: CheckCircle2, tone: "text-emerald-600 dark:text-emerald-400", ring: "border-t-emerald-400" },
];

const PRIORITY: Record<TaskPriority, { label: string; variant: "destructive" | "warning" | "secondary" }> = {
  tinggi: { label: "Tinggi", variant: "destructive" },
  sederhana: { label: "Sederhana", variant: "warning" },
  rendah: { label: "Rendah", variant: "secondary" },
};

const blankTask = (): Task => ({
  id: "",
  title: "",
  due_date: "",
  priority: "sederhana",
  notes: "",
  status: "perlu",
  position: 0,
});

export function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const supabase = getSupabaseBrowser();
  const [tasks, setTasks] = usePersistentRows<Task>("mypi-tasks", initialTasks, !supabase);
  const [editing, setEditing] = React.useState<Task | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [form, setForm] = React.useState<Task>(blankTask());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overCol, setOverCol] = React.useState<TaskStatus | null>(null);

  const stats = {
    total: tasks.length,
    perlu: tasks.filter((t) => t.status === "perlu").length,
    sedang: tasks.filter((t) => t.status === "sedang").length,
    selesai: tasks.filter((t) => t.status === "selesai").length,
  };

  const persist = async (t: Task, mode: "insert" | "update") => {
    if (!supabase) return;
    try {
      if (mode === "insert") await supabase.from(TABLES.tasks).insert(t);
      else await supabase.from(TABLES.tasks).update(t).eq("id", t.id);
    } catch {
      /* demo mode tolerates failure */
    }
  };

  const openNew = (status: TaskStatus = "perlu") => {
    setForm({ ...blankTask(), status });
    setEditing(blankTask());
    setIsNew(true);
    setError(null);
  };
  const openEdit = (t: Task) => {
    setForm({ ...t });
    setEditing(t);
    setIsNew(false);
    setError(null);
  };

  const save = async () => {
    if (!form.title.trim()) {
      setError("Tajuk tugasan wajib diisi.");
      return;
    }
    setSaving(true);
    const payload: Task = {
      ...form,
      id: form.id || `tk-${Date.now().toString(36)}`,
      position: form.position || tasks.length + 1,
    };
    await persist(payload, isNew ? "insert" : "update");
    setTasks((prev) => (isNew ? [...prev, payload] : prev.map((t) => (t.id === editing!.id ? payload : t))));
    setSaving(false);
    setEditing(null);
  };

  const remove = async (t: Task) => {
    if (!confirm(`Padam tugasan ini?\n\n${t.title}`)) return;
    if (supabase) await supabase.from(TABLES.tasks).delete().eq("id", t.id);
    setTasks((prev) => prev.filter((x) => x.id !== t.id));
  };

  const moveTo = async (id: string, status: TaskStatus) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, status } : t));
      const moved = next.find((t) => t.id === id);
      if (moved) void persist(moved, "update");
      return next;
    });
  };

  const set = <K extends keyof Task>(k: K, v: Task[K]) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <ListChecks className="size-6 text-brand" />
            Checklist Tugasan
          </h1>
          <p className="text-sm text-muted-foreground">
            Papan Kanban — seret &amp; lepas kad antara lajur untuk mengemas kini status
          </p>
        </div>
        <Button variant="brand" onClick={() => openNew()}>
          <Plus className="size-4" /> Tambah Tugasan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Jumlah Tugasan", value: stats.total, tone: "text-foreground" },
          { label: "Perlu Dibuat", value: stats.perlu, tone: "text-rose-600 dark:text-rose-400" },
          { label: "Sedang Dibuat", value: stats.sedang, tone: "text-amber-600 dark:text-amber-400" },
          { label: "Selesai", value: stats.selesai, tone: "text-emerald-600 dark:text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <p className={cn("text-2xl font-bold", s.tone)}>{s.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.status);
          const Icon = col.icon;
          return (
            <div
              key={col.status}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.status);
              }}
              onDragLeave={() => setOverCol((c) => (c === col.status ? null : c))}
              onDrop={() => {
                if (dragId) moveTo(dragId, col.status);
                setDragId(null);
                setOverCol(null);
              }}
              className={cn(
                "flex flex-col rounded-xl border border-t-2 border-border bg-muted/30 p-3 transition-colors",
                col.ring,
                overCol === col.status && "bg-brand/5 ring-2 ring-brand/30",
              )}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className={cn("flex items-center gap-2 text-sm font-semibold", col.tone)}>
                  <Icon className="size-4" /> {col.title}
                </span>
                <Badge variant="secondary">{items.length}</Badge>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {items.map((t) => {
                  const p = PRIORITY[t.priority];
                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => setDragId(null)}
                      className={cn(
                        "group cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-card active:cursor-grabbing",
                        dragId === t.id && "opacity-50",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-foreground">{t.title}</p>
                          {t.notes && (
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.notes}</p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant={p.variant}>{p.label}</Badge>
                            {t.due_date && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Calendar className="size-3" /> {t.due_date}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => openEdit(t)}
                            aria-label="Edit"
                            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-brand"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(t)}
                            aria-label="Padam"
                            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => openNew(col.status)}
                  className="mt-1 flex items-center justify-center gap-1 rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <Plus className="size-3.5" /> Tambah
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} className="max-w-lg">
        {editing && (
          <>
            <DialogHeader>
              <DialogTitle>{isNew ? "Tambah Tugasan" : "Edit Tugasan"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Tajuk</Label>
                <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="due">Tarikh</Label>
                  <Input
                    id="due"
                    value={form.due_date}
                    placeholder="cth: 25 Mei 2025"
                    onChange={(e) => set("due_date", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priority">Keutamaan</Label>
                  <Select
                    id="priority"
                    value={form.priority}
                    onChange={(e) => set("priority", e.target.value as TaskPriority)}
                  >
                    <option value="tinggi">Tinggi</option>
                    <option value="sederhana">Sederhana</option>
                    <option value="rendah">Rendah</option>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select id="status" value={form.status} onChange={(e) => set("status", e.target.value as TaskStatus)}>
                  <option value="perlu">Perlu Dibuat</option>
                  <option value="sedang">Sedang Dibuat</option>
                  <option value="selesai">Selesai</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
            </div>
            {error && (
              <p className="mt-3 flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="size-3.5" /> {error}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Batal
              </Button>
              <Button variant="brand" onClick={save} disabled={saving}>
                {saving ? "Menyimpan…" : "Simpan"}
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
