// ===========================================================================
// Local single-user authentication (zero-setup).
// A lightweight passcode gate stored in the browser — ideal for a personal,
// single-user system without any backend configuration. The password can be
// changed from the Profil page. For multi-device / real auth, Supabase Auth
// can be layered on later without changing the UI.
// ===========================================================================

const PASS_KEY = "mypi-password";
const SESSION_KEY = "mypi-authed";

/** Default passcode on first run (boleh tukar di halaman Profil). */
export const DEFAULT_PASSWORD = "mypi2025";

export function getPassword(): string {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  try {
    return window.localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export function setPassword(next: string): void {
  try {
    window.localStorage.setItem(PASS_KEY, next);
  } catch {
    /* ignore */
  }
}

export function checkPassword(input: string): boolean {
  return input === getPassword();
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function login(): void {
  try {
    window.localStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function logout(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
