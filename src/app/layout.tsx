import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSettings } from "@/lib/data";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeVars } from "@/components/providers/theme-vars";
import { AppShell } from "@/components/layout/app-shell";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: {
      default: `${s.org_name} — ${s.org_subtitle}`,
      template: `%s | ${s.org_name}`,
    },
    description: s.banner_slogan,
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
      shortcut: "/icon.svg",
    },
    appleWebApp: {
      capable: true,
      title: "MyPI",
      statusBarStyle: "black-translucent",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#013220",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <html lang="ms" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeVars settings={settings} />
        <ThemeProvider
          attribute="class"
          defaultTheme={settings.default_theme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppShell settings={settings}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
