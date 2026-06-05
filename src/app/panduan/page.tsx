import Link from "next/link";
import {
  BookOpen,
  LogIn,
  LayoutDashboard,
  GraduationCap,
  ListChecks,
  CalendarDays,
  Link2,
  FolderOpen,
  Sparkles,
  History,
  Search,
  Save,
  ArrowUpRight,
} from "lucide-react";

export const metadata = { title: "Panduan Ringkas" };

const SECTIONS = [
  {
    icon: LogIn,
    tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    title: "Log Masuk",
    href: "/profil",
    steps: [
      "Masukkan kata laluan untuk masuk ke sistem. Kata laluan lalai ialah mypi2025.",
      "Tukar kata laluan di halaman Profil Pengguna → bahagian Keselamatan.",
      "Tekan ikon Log Keluar (↩) di bar atas untuk keluar.",
    ],
  },
  {
    icon: LayoutDashboard,
    tone: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    title: "Dashboard",
    href: "/",
    steps: [
      "Halaman utama memaparkan ringkasan: jumlah murid, penguasaan JQAF, program & tugasan.",
      "Semua angka dikira automatik daripada data anda.",
      "Guna 'Pintasan Pantas' untuk akses cepat ke fungsi penting.",
    ],
  },
  {
    icon: GraduationCap,
    tone: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    title: "Data Murid & JQAF",
    href: "/data-murid",
    steps: [
      "Tekan 'Tambah Murid' untuk masukkan rekod baharu (nama, kelas, status JQAF, dll).",
      "Guna ikon pensel untuk edit, tong sampah untuk padam.",
      "Tapis ikut Tahun / Kelas / Jantina / Status, atau cari di kotak carian.",
      "Import CSV untuk masukkan ramai murid sekaligus; Eksport ke Excel/CSV atau PDF.",
    ],
  },
  {
    icon: ListChecks,
    tone: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    title: "Checklist Tugasan",
    href: "/checklist",
    steps: [
      "Papan Kanban: Perlu Dibuat → Sedang Dibuat → Selesai.",
      "Seret (drag) kad antara lajur untuk tukar status.",
      "Tekan '+ Tambah' untuk tugasan baharu dengan tarikh & keutamaan.",
    ],
  },
  {
    icon: CalendarDays,
    tone: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    title: "Program & Aktiviti",
    href: "/program",
    steps: [
      "Tekan 'Tambah Program' dan isi butiran (objektif, AJK, bajet, laporan).",
      "Tetapkan status: Perancangan, Sedang Berjalan atau Selesai.",
      "Guna tab di atas untuk tapis program ikut status.",
    ],
  },
  {
    icon: Link2,
    tone: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
    title: "Google Drive & Pautan",
    href: "/link",
    steps: [
      "Tambah pautan ke folder Google Drive atau aplikasi.",
      "Pilih ikon dan warna tersendiri untuk setiap pautan.",
      "Klik kad untuk terus buka pautan dalam tab baharu.",
    ],
  },
  {
    icon: FolderOpen,
    tone: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    title: "Dokumen & Pusat Dokumen",
    href: "/pusat-dokumen",
    steps: [
      "Lihat semua dokumen dalam paparan grid atau senarai.",
      "Tapis ikut jenis (PDF, Word, Excel) atau cari nama fail.",
    ],
  },
  {
    icon: Sparkles,
    tone: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400",
    title: "AI Assistant",
    href: "/ai-hub",
    steps: [
      "Taip soalan biasa tentang data anda, contoh: 'Berapa murid Tahun 6 belum menguasai JQAF?'.",
      "Tekan cadangan soalan yang disediakan untuk mula pantas.",
      "Tab 'Pustaka Prompt' menyediakan prompt AI siap pakai (RPH, surat, laporan).",
    ],
  },
  {
    icon: History,
    tone: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    title: "Audit Trail & QR Code",
    href: "/audit",
    steps: [
      "Lihat garis masa semua aktiviti dalam sistem.",
      "Jana QR Code untuk murid, program, dokumen atau pautan, kemudian muat turun.",
    ],
  },
];

const TIPS = [
  { icon: Search, text: "Tekan Ctrl + K (atau ⌘ + K) di mana sahaja untuk Carian Global pantas." },
  { icon: Save, text: "Semua perubahan disimpan automatik dalam pelayar — tidak hilang walaupun tutup laman." },
  { icon: LayoutDashboard, text: "Tekan butang ☰ di bar atas untuk lipat sidebar dan luaskan ruang kerja." },
];

export default function PanduanPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-card">
        <div className="islamic-pattern absolute inset-0 opacity-20" />
        <div className="relative">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold">
            <BookOpen className="size-7" /> Panduan Ringkas
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-white/85">
            Tutorial pantas cara menggunakan MyPI Command Center. Klik mana-mana kad untuk terus
            membuka modul berkenaan dan mencubanya sendiri.
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="grid gap-3 sm:grid-cols-3">
        {TIPS.map((t, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
              <t.icon className="size-4" />
            </span>
            <p className="text-sm text-foreground">{t.text}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((s, idx) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${s.tone}`}>
                  <s.icon className="size-5" />
                </span>
                <h2 className="font-bold text-foreground">
                  <span className="mr-1 text-muted-foreground">{idx + 1}.</span> {s.title}
                </h2>
              </div>
              <Link
                href={s.href}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/5"
              >
                Buka <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <ol className="space-y-1.5">
              {s.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <p className="pb-2 text-center text-sm text-muted-foreground">
        Perlukan lebih kawalan? Pergi ke{" "}
        <Link href="/admin" className="font-medium text-brand hover:underline">
          Tetapan Sistem (Admin / CMS)
        </Link>{" "}
        untuk ubah menu, warna, logo dan kandungan tanpa kod.
      </p>
    </div>
  );
}
