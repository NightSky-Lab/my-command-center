"use client";

import * as React from "react";

/**
 * Rows state that automatically persists to the browser's localStorage when
 * Supabase is NOT configured (demo / local mode). This means a single user can
 * use the whole system — adding, editing and deleting records — and their data
 * survives page refreshes and browser restarts, with zero database setup.
 *
 * When Supabase IS configured (`persist = false`), data is sourced from the
 * server and this hook behaves like plain useState (no local caching, so edits
 * always reflect the live database).
 *
 * @param key      Unique localStorage key, e.g. "mypi-students".
 * @param initial  Seed/server rows used on first load.
 * @param persist  Whether to read/write localStorage (true in demo mode).
 */
export function usePersistentRows<T>(
  key: string,
  initial: T[],
  persist: boolean,
): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
  const [rows, setRows] = React.useState<T[]>(initial);
  const hydrated = React.useRef(false);

  // Hydrate once from localStorage (client only).
  React.useEffect(() => {
    if (!persist) {
      hydrated.current = true;
      return;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRows(parsed as T[]);
      }
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true;
  }, [key, persist]);

  // Persist whenever rows change (after hydration, to avoid clobbering with seed).
  React.useEffect(() => {
    if (!persist || !hydrated.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(rows));
    } catch {
      /* storage full / unavailable — ignore */
    }
  }, [rows, key, persist]);

  return [rows, setRows];
}
