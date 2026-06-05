import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with thousands separators (e.g. 1248 -> "1,248"). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Open an external link safely in a new tab. */
export function openExternal(url: string) {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

const MONTHS_MS = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];

const MONTHS_SHORT_MS = [
  "JAN", "FEB", "MAC", "APR", "MEI", "JUN",
  "JUL", "OGO", "SEP", "OKT", "NOV", "DIS",
];

export const monthName = (index: number) => MONTHS_MS[index] ?? "";
export const monthShort = (index: number) => MONTHS_SHORT_MS[index] ?? "";

/** Slugify a string for ids/keys. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Export an array of plain objects to a downloadable CSV file. */
export function exportToCsv(
  filename: string,
  rows: Record<string, unknown>[],
): void {
  if (typeof window === "undefined" || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Parse CSV text into an array of objects keyed by the header row.
 * Handles quoted fields, escaped quotes ("") and CRLF/LF line endings.
 */
export function parseCsv(text: string): Record<string, string>[] {
  const clean = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQ = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (inQ) {
      if (c === '"') {
        if (clean[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') {
      inQ = true;
    } else if (c === ",") {
      cur.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && clean[i + 1] === "\n") i++;
      cur.push(field);
      field = "";
      if (cur.some((x) => x !== "")) rows.push(cur);
      cur = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || cur.length) {
    cur.push(field);
    if (cur.some((x) => x !== "")) rows.push(cur);
  }
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const o: Record<string, string> = {};
    headers.forEach((h, idx) => (o[h] = (r[idx] ?? "").trim()));
    return o;
  });
}

/**
 * Print a simple table to PDF by opening a styled window and invoking the
 * browser's print dialog (user chooses "Save as PDF"). No external deps.
 */
export function exportTableToPdf(
  title: string,
  columns: { key: string; label: string }[],
  rows: Record<string, unknown>[],
): void {
  if (typeof window === "undefined") return;
  const esc = (v: unknown) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const head = columns.map((c) => `<th>${esc(c.label)}</th>`).join("");
  const body = rows
    .map(
      (r) =>
        `<tr>${columns.map((c) => `<td>${esc(r[c.key])}</td>`).join("")}</tr>`,
    )
    .join("");
  const date = new Date().toLocaleString("ms-MY");
  const html = `<!doctype html><html lang="ms"><head><meta charset="utf-8" />
  <title>${esc(title)}</title>
  <style>
    *{font-family:Inter,Arial,sans-serif;box-sizing:border-box}
    body{margin:32px;color:#0f172a}
    h1{font-size:18px;margin:0 0 2px}
    .sub{color:#64748b;font-size:12px;margin:0 0 18px}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th,td{border:1px solid #cbd5e1;padding:6px 8px;text-align:left}
    th{background:#0f766e;color:#fff;text-transform:uppercase;font-size:10px;letter-spacing:.03em}
    tr:nth-child(even) td{background:#f8fafc}
    .foot{margin-top:18px;color:#94a3b8;font-size:10px}
    @media print{.noprint{display:none}}
  </style></head>
  <body>
    <h1>${esc(title)}</h1>
    <p class="sub">MyPI Command Center • Dijana pada ${esc(date)} • ${rows.length} rekod</p>
    <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
    <p class="foot">© MyPI Command Center — Pusat Pengurusan Pendidikan Islam Digital</p>
    <script>window.onload=function(){window.print();}</script>
  </body></html>`;
  const w = window.open("", "_blank", "width=900,height=650");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/** Convert a hex colour (#rgb or #rrggbb) to "r g b" channels for CSS. */
export function hexToRgbChannels(hex: string): string {
  let h = (hex || "").replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(n)) return "0 0 0";
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Copy text to the clipboard, returning success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
