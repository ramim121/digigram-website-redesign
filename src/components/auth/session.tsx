"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Front-end session shell.
 *
 * There is no auth backend yet, so this stores a demo session in
 * `localStorage` and exposes exactly the surface a real one would: a user, a
 * sign-in/out pair, and the "return to intent" URL captured when a logged-out
 * visitor taps *Invest now*.
 *
 * When the phone+OTP API lands, replace the two `localStorage` calls with the
 * real token exchange. No component above this file changes.
 *
 * The site never stores or displays a password, and no page is gated behind
 * login — only the invest action is.
 */

const STORAGE_KEY = "digigram.session.v1";
const INTENT_KEY = "digigram.intent.v1";

export type SessionUser = {
  phone: string;
  name: string;
  district?: string;
  intent?: "investor" | "farmer";
};

type SessionValue = {
  user: SessionUser | null;
  ready: boolean;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  setIntent: (url: string) => void;
  takeIntent: () => string | null;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      // Corrupt storage must never trap the visitor on a broken screen.
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const signIn = useCallback((next: SessionUser) => {
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode — session stays in memory for this tab */
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setIntent = useCallback((url: string) => {
    try {
      window.sessionStorage.setItem(INTENT_KEY, url);
    } catch {
      /* ignore */
    }
  }, []);

  const takeIntent = useCallback(() => {
    try {
      const url = window.sessionStorage.getItem(INTENT_KEY);
      if (url) window.sessionStorage.removeItem(INTENT_KEY);
      return url;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signOut, setIntent, takeIntent }),
    [user, ready, signIn, signOut, setIntent, takeIntent],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
