"use client";

import * as React from "react";
import type {
  AiCategory,
  AiPrompt,
  Announcement,
  CalendarEvent,
  DocumentItem,
  Evidence,
  MenuItem,
  MonitoringItem,
  PerformancePoint,
  Program,
  QuickLink,
  SiteSettings,
  Stat,
} from "@/lib/types";
import { TABLES } from "@/lib/tables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrudManager, type FieldDef } from "./crud-manager";
import { BrandingForm } from "./branding-form";

const COLOR_OPTIONS = [
  { value: "emerald", label: "Emerald" },
  { value: "blue", label: "Biru" },
  { value: "violet", label: "Violet" },
  { value: "teal", label: "Teal" },
  { value: "amber", label: "Amber" },
  { value: "green", label: "Hijau" },
];

export interface AdminData {
  settings: SiteSettings;
  menu: MenuItem[];
  announcements: Announcement[];
  stats: Stat[];
  programs: Program[];
  documents: DocumentItem[];
  evidence: Evidence[];
  performance: PerformancePoint[];
  monitoring: MonitoringItem[];
  quickLinks: QuickLink[];
  aiCategories: AiCategory[];
  aiPrompts: AiPrompt[];
  calendarEvents: CalendarEvent[];
}

export function AdminPanel({ data }: { data: AdminData }) {
  const menuFields: FieldDef[] = [
    { key: "label", label: "Label", type: "text" },
    { key: "href", label: "Pautan", type: "text", half: true },
    { key: "icon", label: "Ikon (Lucide)", type: "text", half: true },
    {
      key: "group",
      label: "Kumpulan",
      type: "select",
      half: true,
      options: [
        { value: "top", label: "Navigasi Atas" },
        { value: "sidebar", label: "Sidebar" },
      ],
      inList: false,
    },
    { key: "color", label: "Kelas Warna Ikon", type: "text", half: true, inList: false },
    { key: "position", label: "Susunan", type: "number", half: true },
    { key: "is_active", label: "Aktif", type: "boolean", inList: false, default: true },
  ];

  const announcementFields: FieldDef[] = [
    { key: "day", label: "Hari", type: "text", half: true },
    { key: "month", label: "Bulan", type: "text", half: true },
    { key: "title", label: "Tajuk", type: "text" },
    { key: "subtitle", label: "Sub-tajuk", type: "text", inList: false },
    { key: "meta", label: "Lokasi / Masa", type: "text", inList: false },
    {
      key: "accent",
      label: "Warna",
      type: "select",
      half: true,
      options: [
        { value: "green", label: "Hijau" },
        { value: "gold", label: "Emas" },
        { value: "blue", label: "Biru" },
      ],
      inList: false,
    },
    { key: "position", label: "Susunan", type: "number", half: true, inList: false },
  ];

  const statFields: FieldDef[] = [
    { key: "label", label: "Label", type: "text" },
    { key: "value", label: "Nilai", type: "number", half: true },
    { key: "suffix", label: "Akhiran (cth %)", type: "text", half: true },
    { key: "sublabel", label: "Sub-label", type: "text", half: true },
    { key: "icon", label: "Ikon (Lucide)", type: "text", half: true, inList: false },
    { key: "color", label: "Warna", type: "select", options: COLOR_OPTIONS, half: true, inList: false },
    { key: "key", label: "Kunci", type: "text", half: true, inList: false },
    { key: "position", label: "Susunan", type: "number", half: true, inList: false },
  ];

  const programFields: FieldDef[] = [
    { key: "title", label: "Nama Program", type: "text" },
    { key: "date_label", label: "Tarikh (teks)", type: "text", half: true },
    { key: "location", label: "Lokasi", type: "text", half: true },
    { key: "start_day", label: "Hari Mula", type: "text", half: true },
    { key: "start_month", label: "Bulan Mula", type: "text", half: true },
    { key: "thumbnail_url", label: "URL Gambar", type: "text", inList: false },
    {
      key: "accent",
      label: "Warna",
      type: "select",
      half: true,
      options: [
        { value: "green", label: "Hijau" },
        { value: "gold", label: "Emas" },
        { value: "rose", label: "Merah Jambu" },
      ],
      inList: false,
    },
    { key: "position", label: "Susunan", type: "number", half: true, inList: false },
  ];

  const documentFields: FieldDef[] = [
    { key: "name", label: "Nama Fail", type: "text" },
    {
      key: "type",
      label: "Jenis",
      type: "select",
      half: true,
      options: [
        { value: "pdf", label: "PDF" },
        { value: "word", label: "Word" },
        { value: "excel", label: "Excel" },
        { value: "ppt", label: "PowerPoint" },
        { value: "image", label: "Imej" },
      ],
    },
    { key: "date_label", label: "Tarikh", type: "text", half: true },
    { key: "url", label: "URL Fail", type: "text", inList: false },
    { key: "position", label: "Susunan", type: "number", half: true, inList: false },
  ];

  const evidenceFields: FieldDef[] = [
    { key: "title", label: "Tajuk", type: "text" },
    { key: "image_url", label: "URL Gambar", type: "text", inList: false },
    { key: "gradient", label: "Gradient (Tailwind)", type: "text", inList: false },
    { key: "date_label", label: "Tarikh", type: "text", half: true },
    { key: "position", label: "Susunan", type: "number", half: true, inList: false },
  ];

  const performanceFields: FieldDef[] = [
    { key: "label", label: "Label (cth Tahun 2024)", type: "text" },
    { key: "value", label: "Nilai (%)", type: "number", half: true },
    { key: "position", label: "Susunan", type: "number", half: true },
  ];

  const monitoringFields: FieldDef[] = [
    { key: "document", label: "Dokumen", type: "text" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "lengkap", label: "Lengkap" },
        { value: "semakan", label: "Dalam Semakan" },
        { value: "kemaskini", label: "Perlu Kemaskini" },
      ],
    },
    { key: "position", label: "Susunan", type: "number", half: true, inList: false },
  ];

  const quickLinkFields: FieldDef[] = [
    { key: "name", label: "Nama", type: "text" },
    { key: "url", label: "URL", type: "text" },
    {
      key: "icon",
      label: "Ikon",
      type: "select",
      half: true,
      options: [
        { value: "drive", label: "Google Drive" },
        { value: "splkpm", label: "SPLKPM" },
        { value: "delima", label: "DELIMA" },
        { value: "canva", label: "Canva" },
        { value: "chatgpt", label: "ChatGPT" },
        { value: "gemini", label: "Gemini" },
      ],
      inList: false,
    },
    { key: "color", label: "Warna", type: "color", half: true, inList: false },
    { key: "position", label: "Susunan", type: "number", half: true, inList: false },
  ];

  const aiCategoryFields: FieldDef[] = [
    { key: "name", label: "Nama Kategori", type: "text" },
    { key: "icon", label: "Ikon (Lucide)", type: "text", half: true, inList: false },
    { key: "color", label: "Warna", type: "select", options: COLOR_OPTIONS, half: true, inList: false },
    { key: "prompt_count", label: "Bilangan Prompt", type: "number", half: true },
    { key: "position", label: "Susunan", type: "number", half: true, inList: false },
  ];

  const aiPromptFields: FieldDef[] = [
    { key: "title", label: "Tajuk", type: "text" },
    { key: "content", label: "Kandungan Prompt", type: "textarea", inList: false },
    {
      key: "category_id",
      label: "Kategori",
      type: "select",
      half: true,
      options: data.aiCategories.map((c) => ({ value: c.id, label: c.name })),
    },
    { key: "tags", label: "Tag (dipisah koma)", type: "tags", half: true, inList: false },
    { key: "is_favorite", label: "Kegemaran", type: "boolean", default: false },
  ];

  const calendarFields: FieldDef[] = [
    { key: "title", label: "Tajuk Acara", type: "text" },
    { key: "date", label: "Tarikh (YYYY-MM-DD)", type: "text", half: true },
    { key: "location", label: "Lokasi", type: "text", half: true, inList: false },
    {
      key: "accent",
      label: "Warna",
      type: "select",
      half: true,
      options: [
        { value: "green", label: "Hijau" },
        { value: "gold", label: "Emas" },
        { value: "blue", label: "Biru" },
        { value: "rose", label: "Merah Jambu" },
      ],
      inList: false,
    },
  ];

  return (
    <Tabs defaultValue="tetapan">
      <TabsList className="max-w-full overflow-x-auto">
        <TabsTrigger value="tetapan">Tetapan &amp; Tema</TabsTrigger>
        <TabsTrigger value="menu">Menu</TabsTrigger>
        <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
        <TabsTrigger value="statistik">Statistik</TabsTrigger>
        <TabsTrigger value="program">Program</TabsTrigger>
        <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
        <TabsTrigger value="evidens">Evidens</TabsTrigger>
        <TabsTrigger value="prestasi">Prestasi</TabsTrigger>
        <TabsTrigger value="pemantauan">Pemantauan</TabsTrigger>
        <TabsTrigger value="pautan">Pautan</TabsTrigger>
        <TabsTrigger value="ai-kategori">AI Kategori</TabsTrigger>
        <TabsTrigger value="ai-prompt">AI Prompt</TabsTrigger>
        <TabsTrigger value="kalendar">Kalendar</TabsTrigger>
      </TabsList>

      <TabsContent value="tetapan">
        <BrandingForm settings={data.settings} />
      </TabsContent>
      <TabsContent value="menu">
        <CrudManager table={TABLES.menu} title="Menu" fields={menuFields} initialRows={data.menu} idPrefix="m" />
      </TabsContent>
      <TabsContent value="pengumuman">
        <CrudManager table={TABLES.announcements} title="Pengumuman" fields={announcementFields} initialRows={data.announcements} idPrefix="a" />
      </TabsContent>
      <TabsContent value="statistik">
        <CrudManager table={TABLES.stats} title="Statistik" fields={statFields} initialRows={data.stats} idPrefix="st" />
      </TabsContent>
      <TabsContent value="program">
        <CrudManager table={TABLES.programs} title="Program" fields={programFields} initialRows={data.programs} idPrefix="p" />
      </TabsContent>
      <TabsContent value="dokumen">
        <CrudManager table={TABLES.documents} title="Dokumen" fields={documentFields} initialRows={data.documents} idPrefix="d" />
      </TabsContent>
      <TabsContent value="evidens">
        <CrudManager table={TABLES.evidence} title="Evidens" fields={evidenceFields} initialRows={data.evidence} idPrefix="e" />
      </TabsContent>
      <TabsContent value="prestasi">
        <CrudManager table={TABLES.performance} title="Prestasi" fields={performanceFields} initialRows={data.performance} idPrefix="pf" />
      </TabsContent>
      <TabsContent value="pemantauan">
        <CrudManager table={TABLES.monitoring} title="Pemantauan" fields={monitoringFields} initialRows={data.monitoring} idPrefix="mo" />
      </TabsContent>
      <TabsContent value="pautan">
        <CrudManager table={TABLES.quickLinks} title="Pautan" fields={quickLinkFields} initialRows={data.quickLinks} idPrefix="q" />
      </TabsContent>
      <TabsContent value="ai-kategori">
        <CrudManager table={TABLES.aiCategories} title="Kategori AI" fields={aiCategoryFields} initialRows={data.aiCategories} idPrefix="c" />
      </TabsContent>
      <TabsContent value="ai-prompt">
        <CrudManager table={TABLES.aiPrompts} title="Prompt AI" fields={aiPromptFields} initialRows={data.aiPrompts} idPrefix="pr" />
      </TabsContent>
      <TabsContent value="kalendar">
        <CrudManager table={TABLES.calendarEvents} title="Acara Kalendar" fields={calendarFields} initialRows={data.calendarEvents} idPrefix="ce" />
      </TabsContent>
    </Tabs>
  );
}
