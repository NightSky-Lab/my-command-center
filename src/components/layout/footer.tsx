import type { SiteSettings } from "@/lib/types";
import { IslamicArch } from "@/components/brand/emblems";

export function Footer({ settings }: { settings: SiteSettings }) {
  // Pastikan tahun hak cipta ikut tahun semasa secara automatik.
  const year = new Date().getFullYear();
  const footerText = (settings.footer_text ?? "").replace(/©\s*\d{4}/, `© ${year}`);
  return (
    <footer
      className="relative mt-6 overflow-hidden px-6 py-4 text-center"
      style={{
        background:
          "linear-gradient(90deg, var(--brand-dark) 0%, var(--brand) 100%)",
      }}
    >
      <IslamicArch className="pointer-events-none absolute bottom-0 right-4 h-14 w-auto opacity-70" />
      <p className="relative text-xs text-emerald-50/80">
        {footerText}
      </p>
    </footer>
  );
}
