import type { SiteSettings } from "@/lib/types";
import { hexToRgbChannels } from "@/lib/utils";

/**
 * Injects the brand colours (managed from the CMS) as CSS variables so the
 * whole UI re-themes without touching source code. Emits both hex vars (for
 * inline styles / SVG) and "r g b" channel vars (for Tailwind opacity).
 */
export function ThemeVars({ settings }: { settings: SiteSettings }) {
  const css = `:root{
--brand:${settings.brand_color};
--brand-dark:${settings.brand_dark};
--brand-light:${settings.brand_light};
--brand-gold:${settings.brand_gold};
--brand-gold-soft:${settings.brand_gold_soft};
--brand-rgb:${hexToRgbChannels(settings.brand_color)};
--brand-dark-rgb:${hexToRgbChannels(settings.brand_dark)};
--brand-light-rgb:${hexToRgbChannels(settings.brand_light)};
--brand-gold-rgb:${hexToRgbChannels(settings.brand_gold)};
--brand-gold-soft-rgb:${hexToRgbChannels(settings.brand_gold_soft)};
}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
