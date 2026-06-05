"use client";

import * as React from "react";
import { Lock, Eye, EyeOff, LogIn, Info } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { MosqueEmblem, MosqueSilhouette } from "@/components/brand/emblems";
import { checkPassword, login, DEFAULT_PASSWORD } from "@/lib/auth";

export function LoginOverlay({
  settings,
  onSuccess,
}: {
  settings: SiteSettings;
  onSuccess: () => void;
}) {
  const [pw, setPw] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(pw)) {
      login();
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-brand via-brand-dark to-[#021a12] p-4">
      {/* decorative pattern */}
      <div className="islamic-pattern absolute inset-0 opacity-30" />
      <MosqueSilhouette className="absolute inset-x-0 bottom-0 h-40 w-full text-black/20" />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-card/95 p-7 shadow-card-hover backdrop-blur">
        <div className="mb-5 flex flex-col items-center text-center">
          <span className="mb-3 grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark shadow">
            <MosqueEmblem className="size-9 text-white" />
          </span>
          <h1 className="text-lg font-extrabold uppercase tracking-wide text-foreground">
            <span className="text-brand">MyPI</span> Command Center
          </h1>
          <p className="text-xs text-muted-foreground">{settings.org_subtitle}</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Kata Laluan</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError(false);
              }}
              placeholder="Masukkan kata laluan…"
              className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Sembunyi" : "Papar"}
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Kata laluan salah. Sila cuba lagi.
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
          >
            <LogIn className="size-4" /> Log Masuk
          </button>
        </form>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <span>
            Kata laluan lalai: <code className="font-bold">{DEFAULT_PASSWORD}</code>. Anda boleh
            tukarkannya di halaman <b>Profil Pengguna</b> selepas log masuk.
          </span>
        </div>
      </div>
    </div>
  );
}
