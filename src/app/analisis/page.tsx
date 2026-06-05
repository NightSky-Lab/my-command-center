import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { getPerformance, getStats } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { StatCards } from "@/components/dashboard/stat-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analisis Data" };

export default async function AnalisisPage() {
  const [performance, stats] = await Promise.all([
    getPerformance(),
    getStats(),
  ]);

  const values = performance.map((p) => p.value);
  const latest = values[values.length - 1] ?? 0;
  const first = values[0] ?? 0;
  const avg = values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;
  const delta = latest - first;

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title="Analisis Data & Prestasi"
        description="Pencapaian akademik & ringkasan statistik panitia."
        icon="LineChart"
      />

      <StatCards stats={stats} />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceChart data={performance} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { label: "Pencapaian Terkini", value: `${latest}%`, sub: performance[performance.length - 1]?.label },
            { label: "Purata 4 Tahun", value: `${avg}%`, sub: "Min keseluruhan" },
            { label: "Peningkatan", value: `+${delta}%`, sub: "Berbanding tahun asas" },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {c.label}
              </p>
              <p className="mt-1 flex items-center gap-2 text-3xl font-extrabold text-foreground">
                {c.value}
                <TrendingUp className="size-5 text-emerald-500" />
              </p>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
