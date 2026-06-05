"use client";

import * as React from "react";
import { AlertCircle, Check, RotateCcw, Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { TABLES } from "@/lib/tables";
import { seedSettings } from "@/lib/seed-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { hexToRgbChannels } from "@/lib/utils";

const COLOR_FIELDS: { key: keyof SiteSettings; label: string }[] = [
  { key: "brand_color", label: "Hijau Utama" },
  { key: "brand_dark", label: "Hijau Gelap" },
  { key: "brand_light", label: "Hijau Cerah" },
  { key: "brand_gold", label: "Emas" },
  { key: "brand_gold_soft", label: "Emas Lembut" },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function BrandingForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = React.useState<SiteSettings>(settings);
  const [saving, setSaving] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const supabase = getSupabaseBrowser();

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  // Live preview of theme colours (hex + rgb channels).
  React.useEffect(() => {
    const r = document.documentElement;
    const pairs: [string, string][] = [
      ["--brand", form.brand_color],
      ["--brand-dark", form.brand_dark],
      ["--brand-light", form.brand_light],
      ["--brand-gold", form.brand_gold],
      ["--brand-gold-soft", form.brand_gold_soft],
    ];
    for (const [name, hex] of pairs) {
      r.style.setProperty(name, hex);
      r.style.setProperty(`${name}-rgb`, hexToRgbChannels(hex));
    }
  }, [form]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (supabase) {
        const { error: e } = await supabase
          .from(TABLES.settings)
          .upsert({ ...form, id: form.id || "default" });
        if (e) throw e;
      }
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (e: any) {
      setError(e?.message ?? "Ralat menyimpan tetapan.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => setForm({ ...seedSettings, id: form.id });

  return (
    <div className="space-y-6">
      {!supabase && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            Pratonton warna berfungsi serta-merta. Sambung Supabase untuk
            menyimpan tetapan secara kekal.
          </span>
        </div>
      )}

      <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          Identiti Organisasi
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Organisasi">
            <Input value={form.org_name} onChange={(e) => set("org_name", e.target.value)} />
          </Field>
          <Field label="Sub-tajuk">
            <Input value={form.org_subtitle} onChange={(e) => set("org_subtitle", e.target.value)} />
          </Field>
          <Field label="Teks Logo">
            <Input value={form.logo_text} onChange={(e) => set("logo_text", e.target.value)} />
          </Field>
          <Field label="Kaligrafi Sidebar">
            <Input value={form.calligraphy_text} onChange={(e) => set("calligraphy_text", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          Banner Hero
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow (atas)">
            <Input value={form.banner_eyebrow} onChange={(e) => set("banner_eyebrow", e.target.value)} />
          </Field>
          <Field label="Tajuk Banner">
            <Input value={form.banner_title} onChange={(e) => set("banner_title", e.target.value)} />
          </Field>
          <Field label="Sub-tajuk Banner">
            <Input value={form.banner_subtitle} onChange={(e) => set("banner_subtitle", e.target.value)} />
          </Field>
          <Field label="URL Imej Banner (pilihan)">
            <Input
              value={form.banner_image_url ?? ""}
              placeholder="https://…"
              onChange={(e) => set("banner_image_url", e.target.value || null)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Slogan">
              <Input value={form.banner_slogan} onChange={(e) => set("banner_slogan", e.target.value)} />
            </Field>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          Motto &amp; Footer
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tajuk Motto">
            <Input value={form.motto_title} onChange={(e) => set("motto_title", e.target.value)} />
          </Field>
          <Field label="Tahun Semasa">
            <Input
              type="number"
              value={form.current_year}
              onChange={(e) => set("current_year", Number(e.target.value))}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Teks Motto">
              <Textarea value={form.motto_text} onChange={(e) => set("motto_text", e.target.value)} rows={2} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Teks Footer">
              <Input value={form.footer_text} onChange={(e) => set("footer_text", e.target.value)} />
            </Field>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          Warna Tema &amp; Mod
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLOR_FIELDS.map((c) => (
            <Field key={c.key} label={c.label}>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(form[c.key] as string) || "#013220"}
                  onChange={(e) => set(c.key, e.target.value as never)}
                  className="h-10 w-12 cursor-pointer rounded-md border border-input bg-background"
                />
                <Input
                  value={form[c.key] as string}
                  onChange={(e) => set(c.key, e.target.value as never)}
                />
              </div>
            </Field>
          ))}
          <Field label="Mod Lalai">
            <Select
              value={form.default_theme}
              onChange={(e) => set("default_theme", e.target.value as SiteSettings["default_theme"])}
            >
              <option value="light">Cerah (Light)</option>
              <option value="dark">Gelap (Dark)</option>
              <option value="system">Ikut Sistem</option>
            </Select>
          </Field>
        </div>
      </section>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button variant="brand" onClick={save} disabled={saving}>
          {done ? <Check className="size-4" /> : <Save className="size-4" />}
          {saving ? "Menyimpan…" : done ? "Tersimpan!" : "Simpan Tetapan"}
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="size-4" /> Set Semula
        </Button>
      </div>
    </div>
  );
}
