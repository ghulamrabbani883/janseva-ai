"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ACCOUNTS_KEY = "janseva-demo-accounts";
const SESSION_KEY = "janseva-demo-session";

export interface DemoUser {
  name: string;
  email: string;
  role: string;
}

interface DemoAccount extends DemoUser {
  passwordHash: string;
}

interface DemoAuthContextValue {
  user: DemoUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const demoAccount: DemoAccount = {
  name: "अभिषेक शर्मा",
  email: "officer@janseva.demo",
  role: "वरिष्ठ अधिकारी",
  passwordHash: "ff96673205dc722320598ebf8f88325b2ac56922d5a2164b5765868274bc0d73",
};

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

function getAccounts(): DemoAccount[] {
  const stored = window.localStorage.getItem(ACCOUNTS_KEY);
  if (!stored) {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([demoAccount]));
    return [demoAccount];
  }

  const accounts: unknown = JSON.parse(stored);
  if (!Array.isArray(accounts)) {
    throw new Error("डेमो खातों का डेटा पढ़ा नहीं जा सका।");
  }

  return accounts as DemoAccount[];
}

async function digestPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      getAccounts();
      const storedSession = window.localStorage.getItem(SESSION_KEY);
      if (storedSession) {
        const session: unknown = JSON.parse(storedSession);
        if (
          typeof session === "object" &&
          session !== null &&
          "email" in session &&
          "name" in session &&
          "role" in session
        ) {
          // Restore browser-local session once the provider has hydrated.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(session as DemoUser);
        }
      }
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const accounts = getAccounts();
      const passwordHash = await digestPassword(password);
      const account = accounts.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.passwordHash === passwordHash,
      );
      if (!account) {
        throw new Error("ईमेल या पासवर्ड सही नहीं है।");
      }

      const nextUser = { name: account.name, email: account.email, role: account.role };
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    } catch (error) {
      if (error instanceof Error && error.message === "ईमेल या पासवर्ड सही नहीं है।") {
        throw error;
      }
      throw new Error("डेमो लॉगिन पूरा नहीं हो सका। इस ब्राउज़र में लोकल स्टोरेज सक्षम करें।");
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const accounts = getAccounts();
      const normalizedEmail = email.trim().toLowerCase();
      if (accounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
        throw new Error("इस ईमेल से डेमो खाता पहले से मौजूद है।");
      }

      const account: DemoAccount = {
        name: name.trim(),
        email: normalizedEmail,
        role: "डेमो अधिकारी",
        passwordHash: await digestPassword(password),
      };
      const nextAccounts = [...accounts, account];
      const nextUser = { name: account.name, email: account.email, role: account.role };
      window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts));
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    } catch (error) {
      if (error instanceof Error && error.message === "इस ईमेल से डेमो खाता पहले से मौजूद है।") {
        throw error;
      }
      throw new Error("डेमो पंजीकरण पूरा नहीं हो सका। इस ब्राउज़र में लोकल स्टोरेज सक्षम करें।");
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <DemoAuthContext.Provider value={contextValue}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error("useDemoAuth must be used within DemoAuthProvider");
  }
  return context;
}
