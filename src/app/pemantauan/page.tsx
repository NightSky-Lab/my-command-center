import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { getMonitoring } from "@/lib/data";
import type { MonitoringStatus } from "@/lib/types";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pemantauan" };

const STATUS: Record<
  MonitoringStatus,
  { label: string; variant: "success" | "info" | "warning"; Icon: typeof CheckCircle2 }
> = {
  lengkap: { label: "Lengkap", variant: "success", Icon: CheckCircle2 },
  semakan: { label: "Dalam Semakan", variant: "info", Icon: Clock },
  kemaskini: { label: "Perlu Kemaskini", variant: "warning", Icon: AlertTriangle },
};

export default async function PemantauanPage() {
  const items = await getMonitoring();
  const total = items.length;
  const done = items.filter((i) => i.status === "lengkap").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title="Status Pemantauan Fail Meja"
        description="Pemantauan kelengkapan dokumen & evidens panitia."
        icon="ClipboardCheck"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card sm:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Tahap Kelengkapan Keseluruhan
            </span>
            <span className="text-2xl font-extrabold text-brand">
              {percent}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-brand transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {done} daripada {total} item telah lengkap.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Perlu Tindakan
          </p>
          <p className="mt-1 text-3xl font-extrabold text-amber-600">
            {items.filter((i) => i.status !== "lengkap").length}
          </p>
          <p className="text-xs text-muted-foreground">Item belum lengkap</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Dokumen</TableHead>
              <TableHead className="pr-5 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => {
              const s = STATUS[m.status];
              return (
                <TableRow key={m.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {m.document}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Badge variant={s.variant} className="ml-auto">
                      <s.Icon className="size-3" />
                      {s.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
