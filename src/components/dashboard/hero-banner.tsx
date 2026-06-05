import type { SiteSettings } from "@/lib/types";
import { Lantern, MosqueSilhouette } from "@/components/brand/emblems";

export function HeroBanner({ settings }: { settings: SiteSettings }) {
  const [firstWord, ...rest] = settings.banner_title.split(" ");

  return (
    <div
      className="islamic-pattern relative flex min-h-[230px] items-center overflow-hidden rounded-xl border border-brand-gold/20 shadow-card"
      style={{
        backgroundImage:
          "linear-gradient(120deg, var(--brand) 0%, var(--brand-dark) 55%, var(--brand-light) 120%)",
      }}
    >
      {/* Lanterns */}
      <div className="pointer-events-none absolute left-6 top-0 hidden gap-3 sm:flex">
        <Lantern className="h-24 w-9 -translate-y-2 opacity-90" />
        <Lantern className="h-20 w-8 translate-y-1 opacity-70" />
      </div>

      {/* Background image override */}
      {settings.banner_image_url && (
        <div
          className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `linear-gradient(90deg, var(--brand-dark), transparent), url(${settings.banner_image_url})`,
          }}
        />
      )}

      {/* Decorative skyline */}
      {!settings.banner_image_url && (
        <MosqueSilhouette className="pointer-events-none absolute bottom-0 right-0 hidden h-40 w-[42%] text-brand-gold/20 md:block" />
      )}

      {/* Copy */}
      <div className="relative z-10 max-w-2xl px-7 py-8 sm:px-12 sm:pl-28">
        <p
          className="mb-1 text-lg italic text-brand-gold-soft"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {settings.banner_eyebrow}
        </p>
        <h1 className="text-3xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-[2.6rem]">
          <span className="text-brand-gold">{firstWord}</span> {rest.join(" ")}
        </h1>
        <p className="mt-2 text-sm font-medium text-emerald-50/90 sm:text-base">
          {settings.banner_subtitle}
        </p>
        <p
          className="mt-4 inline-block rounded-full border border-brand-gold/40 bg-black/15 px-4 py-1.5 text-sm italic text-brand-gold-soft"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          &ldquo;{settings.banner_slogan}&rdquo;
        </p>
      </div>
    </div>
  );
}
