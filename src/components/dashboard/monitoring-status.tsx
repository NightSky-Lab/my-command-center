import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { MonitoringItem, MonitoringStatus } from "@/lib/types";
import { SectionCard } from "./section-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS: Record<
  MonitoringStatus,
  {
    label: string;
    variant: "success" | "info" | "warning";
    Icon: typeof CheckCircle2;
  }
> = {
  lengkap: { label: "Lengkap", variant: "success", Icon: CheckCircle2 },
  semakan: { label: "Dalam Semakan", variant: "info", Icon: Clock },
  kemaskini: { label: "Perlu Kemaskini", variant: "warning", Icon: AlertTriangle },
};

export function MonitoringStatus({ items }: { items: MonitoringItem[] }) {
  return (
    <SectionCard
      title="Status Pemantauan"
      icon="ClipboardCheck"
      href="/pemantauan"
      bodyClassName="p-0"
    >
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
    </SectionCard>
  );
}
