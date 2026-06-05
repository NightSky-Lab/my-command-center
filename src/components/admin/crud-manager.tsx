"use client";

import * as React from "react";
import { Pencil, Plus, Search, Trash2, FileDown, AlertCircle } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, exportToCsv } from "@/lib/utils";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "color" | "tags" | "boolean";
  options?: { value: string; label: string }[];
  placeholder?: string;
  half?: boolean;
  inList?: boolean;
  default?: unknown;
}

type Row = Record<string, any>;

export function CrudManager({
  table,
  title,
  fields,
  initialRows,
  idPrefix = "row",
}: {
  table: string;
  title: string;
  fields: FieldDef[];
  initialRows: Row[];
  idPrefix?: string;
}) {
  const [rows, setRows] = React.useState<Row[]>(initialRows);
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Row | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [form, setForm] = React.useState<Row>({});
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const supabase = getSupabaseBrowser();
  const listFields = fields.filter((f) => f.inList ?? true);

  const filtered = rows.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(query.toLowerCase()),
  );

  const openNew = () => {
    const blank: Row = {};
    for (const f of fields) blank[f.key] = f.default ?? (f.type === "boolean" ? false : "");
    setForm(blank);
    setEditing(blank);
    setIsNew(true);
    setError(null);
  };

  const openEdit = (row: Row) => {
    const copy: Row = { ...row };
    for (const f of fields)
      if (f.type === "tags" && Array.isArray(copy[f.key]))
        copy[f.key] = copy[f.key].join(", ");
    setForm(copy);
    setEditing(row);
    setIsNew(false);
    setError(null);
  };

  const serialize = (data: Row): Row => {
    const out: Row = { ...data };
    for (const f of fields) {
      if (f.type === "number") out[f.key] = Number(out[f.key]) || 0;
      if (f.type === "tags")
        out[f.key] =
          typeof out[f.key] === "string"
            ? out[f.key]
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : out[f.key] ?? [];
      if (f.type === "boolean") out[f.key] = Boolean(out[f.key]);
    }
    return out;
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload = serialize(form);

    if (isNew && !payload.id)
      payload.id = `${idPrefix}-${Date.now().toString(36)}`;
    if ("position" in payload && !payload.position)
      payload.position = rows.length + 1;

    try {
      if (supabase) {
        const { error: e } = isNew
          ? await supabase.from(table).insert(payload)
          : await supabase.from(table).update(payload).eq("id", editing!.id);
        if (e) throw e;
      }
      setRows((prev) =>
        isNew
          ? [...prev, payload]
          : prev.map((r) => (r.id === editing!.id ? payload : r)),
      );
      setEditing(null);
      if (!supabase)
        setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Ralat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Row) => {
    if (!confirm(`Padam item ini?\n\n${row[listFields[0]?.key] ?? row.id}`))
      return;
    try {
      if (supabase) await supabase.from(table).delete().eq("id", row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (e: any) {
      setError(e?.message ?? "Ralat memadam data.");
    }
  };

  const renderCell = (f: FieldDef, value: any) => {
    if (f.type === "boolean")
      return value ? (
        <Badge variant="success">Ya</Badge>
      ) : (
        <Badge variant="secondary">Tidak</Badge>
      );
    if (f.type === "color")
      return (
        <span className="flex items-center gap-2">
          <span
            className="inline-block size-4 rounded border border-border"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs">{value}</span>
        </span>
      );
    if (f.type === "tags")
      return (
        <span className="text-xs text-muted-foreground">
          {(Array.isArray(value) ? value : []).join(", ")}
        </span>
      );
    const str = String(value ?? "");
    return <span className="line-clamp-1">{str.length > 60 ? str.slice(0, 60) + "…" : str}</span>;
  };

  return (
    <div className="space-y-3">
      {!supabase && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            Supabase belum disambung — perubahan hanya disimpan sementara di
            pelayar ini. Isi <code>.env.local</code> &amp; jalankan{" "}
            <code>schema.sql</code> untuk menyimpan secara kekal.
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Cari dalam ${title.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => exportToCsv(table, rows)}
          disabled={rows.length === 0}
        >
          <FileDown className="size-4" /> Eksport
        </Button>
        <Button variant="brand" onClick={openNew}>
          <Plus className="size-4" /> Tambah
        </Button>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {listFields.map((f) => (
                <th
                  key={f.key}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {f.label}
                </th>
              ))}
              <th className="w-24 px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30">
                {listFields.map((f) => (
                  <td key={f.key} className="px-3 py-2 align-middle text-foreground">
                    {renderCell(f, row[f.key])}
                  </td>
                ))}
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      aria-label="Edit"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-brand"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(row)}
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
                <td
                  colSpan={listFields.length + 1}
                  className="px-3 py-8 text-center text-sm text-muted-foreground"
                >
                  Tiada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onClose={() => setEditing(null)} className="max-w-2xl">
        {editing && (
          <>
            <DialogHeader>
              <DialogTitle>
                {isNew ? "Tambah" : "Edit"} — {title}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div
                  key={f.key}
                  className={cn(
                    "space-y-1.5",
                    !f.half && f.type !== "boolean" && "sm:col-span-2",
                  )}
                >
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      id={f.key}
                      value={form[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                      rows={4}
                    />
                  ) : f.type === "select" ? (
                    <Select
                      id={f.key}
                      value={form[f.key] ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                    >
                      <option value="" disabled>
                        Pilih…
                      </option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  ) : f.type === "boolean" ? (
                    <label className="flex h-10 items-center gap-2">
                      <input
                        id={f.key}
                        type="checkbox"
                        checked={Boolean(form[f.key])}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, [f.key]: e.target.checked }))
                        }
                        className="size-4 accent-[var(--brand)]"
                      />
                      <span className="text-sm text-muted-foreground">
                        {f.placeholder ?? "Aktif"}
                      </span>
                    </label>
                  ) : f.type === "color" ? (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={form[f.key] || "#013220"}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, [f.key]: e.target.value }))
                        }
                        className="h-10 w-12 cursor-pointer rounded-md border border-input bg-background"
                      />
                      <Input
                        value={form[f.key] ?? ""}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, [f.key]: e.target.value }))
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      id={f.key}
                      type={f.type === "number" ? "number" : "text"}
                      value={form[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            {error && (
              <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
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
