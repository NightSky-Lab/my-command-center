"use client";

import * as React from "react";
import {
  History,
  Plus,
  Pencil,
  Trash2,
  Upload,
  DatabaseBackup,
  LogIn,
  Search,
  FileDown,
  QrCode,
  Download,
} from "lucide-react";
import type { AuditEntry, AuditAction } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, exportToCsv } from "@/lib/utils";

const ACTION_META: Record<AuditAction, { label: string; icon: React.ElementType; tone: string }> = {
  tambah: { label: "Tambah", icon: Plus, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  edit: { label: "Edit", icon: Pencil, tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400" },
  padam: { label: "Padam", icon: Trash2, tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400" },
  upload: { label: "Upload", icon: Upload, tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400" },
  backup: { label: "Backup", icon: DatabaseBackup, tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  login: { label: "Log Masuk", icon: LogIn, tone: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300" },
};

function fmt(at: string) {
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return at;
  return d.toLocaleString("ms-MY", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  const [query, setQuery] = React.useState("");
  const [action, setAction] = React.useState("");
  const [qr, setQr] = React.useState("https://drive.google.com");

  const filtered = entries.filter((e) => {
    if (action && e.action !== action) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return e.detail.toLowerCase().includes(q) || e.module.toLowerCase().includes(q);
  });

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(qr || " ")}`;

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <History className="size-6 text-brand" /> Audit Trail
          </h1>
          <p className="text-sm text-muted-foreground">Rekod semua aktiviti pengguna dalam sistem</p>
        </div>
        <Button
          variant="outline"
          onClick={() => exportToCsv("audit-trail", filtered as unknown as Record<string, unknown>[])}
        >
          <FileDown className="size-4" /> Eksport
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari aktiviti / modul…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={action} onChange={(e) => setAction(e.target.value)} className="sm:w-44">
              <option value="">Semua Tindakan</option>
              {Object.entries(ACTION_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <ol className="relative space-y-5 before:absolute before:left-[18px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
              {filtered.map((e) => {
                const m = ACTION_META[e.action];
                return (
                  <li key={e.id} className="relative flex gap-4">
                    <span className={cn("z-10 grid size-9 shrink-0 place-items-center rounded-full", m.tone)}>
                      <m.icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{e.module}</Badge>
                        <span className="text-xs text-muted-foreground">{fmt(e.at)}</span>
                      </div>
                      <p className="mt-1 text-sm text-foreground">{e.detail}</p>
                      <p className="text-xs text-muted-foreground">oleh {e.actor}</p>
                    </div>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="py-6 text-center text-sm text-muted-foreground">Tiada rekod aktiviti.</li>
              )}
            </ol>
          </div>
        </div>

        {/* QR generator */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
              <QrCode className="size-5 text-brand" /> Penjana QR Code
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Jana QR untuk murid, program, dokumen atau pautan Google Drive.
            </p>
            <div className="mt-3 space-y-2">
              <Input value={qr} onChange={(e) => setQr(e.target.value)} placeholder="Tampal URL / teks…" />
              <div className="grid place-items-center rounded-xl border border-border bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrSrc} alt="QR Code" width={200} height={200} className="size-[200px]" />
              </div>
              <a
                href={qrSrc}
                download="qrcode.png"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-light"
              >
                <Download className="size-4" /> Muat Turun QR
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
