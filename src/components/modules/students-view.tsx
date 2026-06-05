"use client";

import * as React from "react";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  FileDown,
  FileText,
  Users,
  CheckCircle2,
  XCircle,
  Percent,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Student, JqafStatus, Gender } from "@/lib/types";
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
import { cn, exportToCsv, exportTableToPdf, parseCsv } from "@/lib/utils";
import { Upload } from "lucide-react";

const MASTER = "#10b981";
const FAIL = "#f43f5e";
const YEARS = [1, 2, 3, 4, 5, 6];

const blankStudent = (): Student => ({
  id: "",
  name: "",
  mykid: "",
  year: 1,
  class_name: "",
  gender: "L",
  guardian: "",
  phone: "",
  address: "",
  jqaf_status: "menguasai",
  notes: "",
  position: 0,
});

function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  icon: React.ElementType;
  tone: "emerald" | "rose" | "sky" | "amber";
}) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
      <div className={cn("grid size-12 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight text-foreground">
          {value}
          {suffix}
        </p>
        <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function StudentsView({
  initialStudents,
  focus = "murid",
}: {
  initialStudents: Student[];
  focus?: "murid" | "jqaf";
}) {
  const supabase = getSupabaseBrowser();
  const [rows, setRows] = usePersistentRows<Student>(
    "mypi-students",
    initialStudents,
    !supabase,
  );
  const [query, setQuery] = React.useState("");
  const [fYear, setFYear] = React.useState("");
  const [fClass, setFClass] = React.useState("");
  const [fGender, setFGender] = React.useState("");
  const [fStatus, setFStatus] = React.useState("");
  const [editing, setEditing] = React.useState<Student | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [form, setForm] = React.useState<Student>(blankStudent());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const classes = React.useMemo(
    () => Array.from(new Set(rows.map((r) => r.class_name))).sort(),
    [rows],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (fYear && String(r.year) !== fYear) return false;
      if (fClass && r.class_name !== fClass) return false;
      if (fGender && r.gender !== fGender) return false;
      if (fStatus && r.jqaf_status !== fStatus) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.mykid.toLowerCase().includes(q) ||
        r.class_name.toLowerCase().includes(q) ||
        r.guardian.toLowerCase().includes(q)
      );
    });
  }, [rows, query, fYear, fClass, fGender, fStatus]);

  // ---- Derived statistics (auto) ----
  const total = rows.length;
  const masters = rows.filter((r) => r.jqaf_status === "menguasai").length;
  const fails = total - masters;
  const pct = total ? Math.round((masters / total) * 1000) / 10 : 0;

  const pieData = [
    { name: "Menguasai", value: masters, color: MASTER },
    { name: "Tidak Menguasai", value: fails, color: FAIL },
  ];

  const barData = YEARS.map((y) => {
    const inYear = rows.filter((r) => r.year === y);
    return {
      name: `Tahun ${y}`,
      Menguasai: inYear.filter((r) => r.jqaf_status === "menguasai").length,
      "Tidak Menguasai": inYear.filter((r) => r.jqaf_status === "tidak_menguasai").length,
    };
  });

  // ---- CRUD ----
  const openNew = () => {
    setForm(blankStudent());
    setEditing(blankStudent());
    setIsNew(true);
    setError(null);
  };
  const openEdit = (row: Student) => {
    setForm({ ...row });
    setEditing(row);
    setIsNew(false);
    setError(null);
  };

  const save = async () => {
    if (!form.name.trim()) {
      setError("Nama murid wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload: Student = {
      ...form,
      year: Number(form.year) || 1,
      position: form.position || rows.length + 1,
      id: form.id || `mu-${Date.now().toString(36)}`,
    };
    try {
      if (supabase) {
        const { error: e } = isNew
          ? await supabase.from(TABLES.students).insert(payload)
          : await supabase.from(TABLES.students).update(payload).eq("id", editing!.id);
        if (e) throw e;
      }
      setRows((prev) =>
        isNew ? [...prev, payload] : prev.map((r) => (r.id === editing!.id ? payload : r)),
      );
      setEditing(null);
    } catch (e: any) {
      setError(e?.message ?? "Ralat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Student) => {
    if (!confirm(`Padam murid ini?\n\n${row.name}`)) return;
    try {
      if (supabase) await supabase.from(TABLES.students).delete().eq("id", row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (e: any) {
      setError(e?.message ?? "Ralat memadam data.");
    }
  };

  const toCsvRows = (list: Student[]) =>
    list.map((r) => ({
      Nama: r.name,
      MyKid: r.mykid,
      Tahun: r.year,
      Kelas: r.class_name,
      Jantina: r.gender === "L" ? "Lelaki" : "Perempuan",
      Penjaga: r.guardian,
      Telefon: r.phone,
      Alamat: r.address,
      Status_JQAF: r.jqaf_status === "menguasai" ? "Menguasai" : "Tidak Menguasai",
      Catatan: r.notes,
    }));

  const pdfColumns = [
    { key: "Nama", label: "Nama" },
    { key: "MyKid", label: "MyKid" },
    { key: "Tahun", label: "Tahun" },
    { key: "Kelas", label: "Kelas" },
    { key: "Jantina", label: "Jantina" },
    { key: "Penjaga", label: "Penjaga" },
    { key: "Telefon", label: "Telefon" },
    { key: "Status_JQAF", label: "Status JQAF" },
  ];

  const set = <K extends keyof Student>(k: K, v: Student[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  // ---- CSV import ----
  const fileRef = React.useRef<HTMLInputElement>(null);
  const pick = (o: Record<string, string>, ...keys: string[]) => {
    for (const k of keys) {
      const hit = Object.keys(o).find((h) => h.toLowerCase() === k.toLowerCase());
      if (hit && o[hit]) return o[hit];
    }
    return "";
  };
  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const records = parseCsv(text);
      const imported: Student[] = records
        .map((o, i): Student => {
          const g = pick(o, "Jantina", "Gender").toLowerCase();
          const st = pick(o, "Status_JQAF", "Status", "JQAF").toLowerCase();
          return {
            id: `mu-imp-${Date.now().toString(36)}-${i}`,
            name: pick(o, "Nama", "Name", "Nama Penuh"),
            mykid: pick(o, "MyKid", "No KP", "No. KP", "KP"),
            year: Number(pick(o, "Tahun", "Year").replace(/\D/g, "")) || 1,
            class_name: pick(o, "Kelas", "Class"),
            gender: g.startsWith("p") ? "P" : "L",
            guardian: pick(o, "Penjaga", "Nama Penjaga", "Guardian"),
            phone: pick(o, "Telefon", "Phone", "No Telefon"),
            address: pick(o, "Alamat", "Address"),
            jqaf_status: st.includes("tidak") || st.includes("belum") ? "tidak_menguasai" : "menguasai",
            notes: pick(o, "Catatan", "Notes"),
            position: 0,
          };
        })
        .filter((s) => s.name);

      if (imported.length === 0) {
        setError("Tiada data sah ditemui dalam fail CSV. Pastikan ada lajur 'Nama'.");
      } else {
        if (supabase) {
          await supabase.from(TABLES.students).insert(imported);
        }
        setRows((prev) => [...prev, ...imported]);
        alert(`Berjaya import ${imported.length} murid.`);
      }
    } catch {
      setError("Gagal membaca fail. Pastikan format CSV betul.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <GraduationCap className="size-6 text-brand" />
            {focus === "jqaf" ? "Analisis JQAF" : "Data Murid"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {focus === "jqaf"
              ? "Pemantauan penguasaan JQAF mengikut tahun, kelas & jantina"
              : "Pengurusan rekod murid Pendidikan Islam — tambah, edit, tapis & eksport"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onImport} className="hidden" />
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" /> Import CSV
          </Button>
          <Button variant="outline" onClick={() => exportToCsv("data-murid", toCsvRows(filtered))}>
            <FileDown className="size-4" /> Excel/CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => exportTableToPdf("Data Murid — JQAF", pdfColumns, toCsvRows(filtered))}
          >
            <FileText className="size-4" /> PDF
          </Button>
          <Button variant="brand" onClick={openNew}>
            <Plus className="size-4" /> Tambah Murid
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Jumlah Murid" value={total} icon={Users} tone="sky" />
        <StatCard label="Menguasai JQAF" value={masters} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Tidak Menguasai" value={fails} icon={XCircle} tone="rose" />
        <StatCard label="Peratus Penguasaan" value={pct} suffix="%" icon={Percent} tone="amber" />
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-2 text-sm font-semibold text-foreground">Penguasaan JQAF</h3>
          <div className="relative h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={24} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
              <span className="text-2xl font-bold text-foreground">{pct}%</span>
              <span className="text-[11px] text-muted-foreground">Menguasai</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-3">
          <h3 className="mb-2 text-sm font-semibold text-foreground">Penguasaan Mengikut Tahun</h3>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                <Legend iconType="circle" />
                <Bar dataKey="Menguasai" stackId="a" fill={MASTER} radius={[0, 0, 0, 0]} maxBarSize={44} />
                <Bar dataKey="Tidak Menguasai" stackId="a" fill={FAIL} radius={[4, 4, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-card sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama, MyKid, kelas, penjaga…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={fYear} onChange={(e) => setFYear(e.target.value)} className="sm:w-32">
          <option value="">Semua Tahun</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              Tahun {y}
            </option>
          ))}
        </Select>
        <Select value={fClass} onChange={(e) => setFClass(e.target.value)} className="sm:w-36">
          <option value="">Semua Kelas</option>
          {classes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={fGender} onChange={(e) => setFGender(e.target.value)} className="sm:w-36">
          <option value="">Semua Jantina</option>
          <option value="L">Lelaki</option>
          <option value="P">Perempuan</option>
        </Select>
        <Select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="sm:w-44">
          <option value="">Semua Status</option>
          <option value="menguasai">Menguasai</option>
          <option value="tidak_menguasai">Tidak Menguasai</option>
        </Select>
      </div>

      {!supabase && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            Mod demo — perubahan disimpan sementara di pelayar. Sambung Supabase untuk simpanan kekal.
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2.5">Nama</th>
              <th className="px-3 py-2.5">MyKid</th>
              <th className="px-3 py-2.5">Tahun / Kelas</th>
              <th className="px-3 py-2.5">Jantina</th>
              <th className="px-3 py-2.5">Penjaga</th>
              <th className="px-3 py-2.5">Status JQAF</th>
              <th className="w-20 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-3 py-2.5 font-medium text-foreground">{r.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.mykid}</td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  Tahun {r.year} · {r.class_name}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {r.gender === "L" ? "Lelaki" : "Perempuan"}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.guardian || "—"}</td>
                <td className="px-3 py-2.5">
                  {r.jqaf_status === "menguasai" ? (
                    <Badge variant="success">Menguasai</Badge>
                  ) : (
                    <Badge variant="destructive">Tidak Menguasai</Badge>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(r)}
                      aria-label="Edit"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-brand"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(r)}
                      aria-label="Padam"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Tiada murid yang sepadan dengan penapis.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Memaparkan {filtered.length} daripada {total} murid.
      </p>

      {/* Add / Edit dialog */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} className="max-w-2xl">
        {editing && (
          <>
            <DialogHeader>
              <DialogTitle>{isNew ? "Tambah Murid" : "Edit Murid"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">Nama Penuh</Label>
                <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mykid">No. KP / MyKid</Label>
                <Input id="mykid" value={form.mykid} onChange={(e) => set("mykid", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="year">Tahun</Label>
                <Select id="year" value={String(form.year)} onChange={(e) => set("year", Number(e.target.value))}>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      Tahun {y}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="class_name">Kelas</Label>
                <Input
                  id="class_name"
                  value={form.class_name}
                  placeholder="cth: 6 Bestari"
                  onChange={(e) => set("class_name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender">Jantina</Label>
                <Select id="gender" value={form.gender} onChange={(e) => set("gender", e.target.value as Gender)}>
                  <option value="L">Lelaki</option>
                  <option value="P">Perempuan</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guardian">Nama Penjaga</Label>
                <Input id="guardian" value={form.guardian} onChange={(e) => set("guardian", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">No. Telefon</Label>
                <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status JQAF</Label>
                <Select
                  id="status"
                  value={form.jqaf_status}
                  onChange={(e) => set("jqaf_status", e.target.value as JqafStatus)}
                >
                  <option value="menguasai">Menguasai</option>
                  <option value="tidak_menguasai">Tidak Menguasai</option>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
            </div>
            {error && (
              <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
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
